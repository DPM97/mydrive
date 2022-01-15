package routes

import (
	"bytes"
	"fmt"
	"math"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"

	"github.com/gin-gonic/gin"
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

type DiskDataType struct {
	Percent float64 `json:"percent"`
	Value   string  `json:"value"`
}

type FormattedDiskStats struct {
	Total *DiskDataType `json:"total"`
	Used  *DiskDataType `json:"used"`
	Free  *DiskDataType `json:"free"`
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}

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

	cmd := exec.Command("docker", "system", "df", "-v")

	var out bytes.Buffer
	cmd.Stdout = &out
	err = cmd.Run()

	if err != nil {
		return nil, err
	}

	expAsString := fmt.Sprintf("(?:\r\n|\r|\n)(?:%s)(?:\\s*)(?:[0-9]*)(?:\\s*)([0-9|\\.]*)([A-Z]{2})(?:\r\n|\r|\n)", volumeName)
	regex, err := regexp.Compile(expAsString)

	if err != nil {
		return nil, err
	}

	res := regex.FindAllStringSubmatch(out.String(), -1)

	group := res[0]

	size, err := strconv.ParseFloat(group[1], 32)

	if err != nil {
		return nil, err
	}

	switch group[2] {
	case "KB":
		stats.Used = uint64(uint64(size) * uint64(KB))
		break
	case "MB":
		stats.Used = uint64(uint64(size) * uint64(MB))
		break
	case "GB":
		stats.Used = uint64(uint64(size) * uint64(GB))
		break
	default:
		stats.Used = uint64(size)
	}

	return stats, nil
}

func FetchStorageHandler(c *gin.Context) {
	stats, err := fetchDiskUsage("db_my_dbdata")

	if err != nil {
		c.String(http.StatusBadRequest, "Failed to fetch disk usage data.")
		return
	}

	formatted := &FormattedDiskStats{}

	usedByMisc := float64(stats.All) - (float64(stats.Avail) + float64(stats.Used))

	updatedAll := float64(stats.All) - usedByMisc

	formatted.Total = &DiskDataType{
		Value: strconv.FormatFloat(toFixed(updatedAll/float64(GB), 2), 'f', 2, 64) + " GB",
	}

	formatted.Used = &DiskDataType{
		Percent: toFixed(float64(stats.Used)/updatedAll*100, 2),
		Value:   strconv.FormatFloat(toFixed(float64(stats.Used)/float64(GB), 2), 'f', 2, 64) + " GB",
	}

	formatted.Free = &DiskDataType{
		Percent: toFixed(float64(stats.Avail)/updatedAll*100, 2),
		Value:   strconv.FormatFloat(toFixed(float64(stats.Avail)/float64(GB), 2), 'f', 2, 64) + " GB",
	}

	c.JSON(http.StatusOK, formatted)
	return
}
