package routes

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
)

func DownloadHandler(db *pgx.Conn) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		// check if the file we are looking for exists
		findQuery := `
		select loid, size, name from files
		where id = $1
		`

		documentID := c.Param("id")

		rows, err := db.Query(context.Background(), findQuery, documentID)

		if err != nil {
			c.String(200, "no document with this id exists")
			return
		}

		rows.Next()

		var loid sql.NullInt32
		var size sql.NullInt32
		var f_name sql.NullString
		rows.Scan(&loid, &size, &f_name)

		rows.Close()

		// begin fetch sequence
		tx, err := db.Begin(context.Background())

		if err != nil {
			fmt.Println(err.Error())
			c.String(400, "failed to start transaction.")
			return
		}

		lo := tx.LargeObjects()

		obj, err := lo.Open(context.Background(), uint32(loid.Int32), pgx.LargeObjectModeWrite)
		if err != nil {
			c.String(400, "failed to open object.")
			return
		}

		p := make([]byte, int(size.Int32))

		n, err := obj.Read(p)

		fmt.Println(n, size.Int32)
		if err != nil || n != int(size.Int32) {
			c.String(400, "failed to read object.")
			return
		}

		if err := tx.Commit(context.Background()); err != nil {
			c.String(400, "failed to read object.")
			return
		}

		c.Writer.WriteHeader(200)
		c.Header("Content-Disposition", "attachment; filename="+f_name.String)
		c.Header("Content-Type", "application/octet-stream")
		c.Header("Content-Length", fmt.Sprintf("%d", len(p)))
		c.Writer.Write(p)
		return
	}

	return gin.HandlerFunc(fn)
}
