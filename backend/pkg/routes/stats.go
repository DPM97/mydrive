package routes

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"os"
	"strconv"

	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
	"golang.org/x/sys/unix"
)

const (
	B  = 1
	KB = 1024 * B
	MB = 1024 * KB
	GB = 1024 * MB
)

type DiskStats struct {
	All   uint64 `json:"all"`
	Used  uint64 `json:"used"`
	Free  uint64 `json:"free"`
	Avail uint64 `json:"avail"`
}

type FormattedDiskStats struct {
	TotalSpace  string `json:"totalSpace"`
	PercentUsed string `json:"percentUsed"`
	PercentFree string `json:"percentFree"`
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}

var cli *client.Client

func fetchDiskUsage(volumeName string) (*DiskStats, error) {
	wd, err := os.Getwd()

	if err != nil {
		return nil, err
	}

	// get free disk space
	var stat unix.Statfs_t
	err = unix.Statfs(wd, &stat)

	if err != nil {
		return nil, err
	}

	stats := &DiskStats{
		All:   stat.Blocks * uint64(stat.Bsize),
		Avail: stat.Bavail * uint64(stat.Bsize),
		Free:  stat.Bfree * uint64(stat.Bsize),
	}

	if cli == nil {
		cli, err = client.NewClientWithOpts(client.FromEnv)
		if err != nil {
			return nil, err
		}
	}

	vol, err := cli.VolumeInspect(context.Background(), volumeName)
	if err != nil {
		return nil, err
	}

	if vol.UsageData != nil {
		fmt.Println(vol.UsageData.Size)
	} else {
		fmt.Println("no size.")
	}

	return stats, nil

	// stats.Used = uint64(vol.UsageData.Size)

	return stats, nil
}

func FetchStorageHandler(db *pgx.Conn) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		stats, err := fetchDiskUsage("db_my_dbdata")

		if err != nil {
			c.String(http.StatusBadRequest, "Failed to fetch disk usage data.")
			return
		}

		formatted := &FormattedDiskStats{}

		formatted.TotalSpace = strconv.FormatFloat(toFixed(float64(stats.All)/float64(GB), 2), 'f', 2, 64) + " GB"
		formatted.PercentUsed = strconv.FormatFloat(toFixed(float64(stats.Used)/float64(stats.All), 2), 'f', 2, 64) + "%"
		formatted.PercentFree = strconv.FormatFloat(toFixed(float64(stats.Avail)/float64(stats.All), 2), 'f', 2, 64) + "%"

		c.JSON(http.StatusOK, formatted)
		return
	}

	return gin.HandlerFunc(fn)
}
