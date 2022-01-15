package routes

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/DPM97/mydrive/backend/pkg/db"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
)

func DownloadHandler(c *gin.Context) {
	db, err := db.FetchConn(c)
	if err != nil {
		c.String(http.StatusBadRequest, "Failed to fetch the connection from the request context.")
		return
	}

	session := sessions.Default(c)
	user := session.Get("user")

	// check if the file we are looking for exists
	findQuery := `
		select loid, size, name from files
		where pid = $1 or (owner = $2 and id = $3)
		`

	documentID := c.Param("id")

	intID, err := strconv.Atoi(documentID)
	// if docID can't be an integer then we know that we
	// are either working with a 404 or public file
	if err != nil {
		intID = -1
	}

	rows, err := db.Query(context.Background(), findQuery, documentID, user, intID)

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
		c.String(http.StatusBadRequest, "failed to start transaction.")
		tx.Rollback(context.TODO())
		return
	}

	lo := tx.LargeObjects()

	obj, err := lo.Open(context.Background(), uint32(loid.Int32), pgx.LargeObjectModeRead)
	if err != nil {
		c.String(http.StatusBadRequest, "failed to open object.")
		tx.Rollback(context.TODO())
		return
	}

	p := make([]byte, int(size.Int32))

	n, err := obj.Read(p)

	if err != nil || n != int(size.Int32) {
		c.String(http.StatusBadRequest, "failed to read object.")
		tx.Rollback(context.TODO())
		return
	}

	if err := tx.Commit(context.Background()); err != nil {
		c.String(http.StatusBadRequest, "failed to read object.")
		return
	}

	c.Writer.WriteHeader(200)
	c.Header("Content-Disposition", "attachment; filename="+f_name.String)
	c.Header("Content-Type", "application/octet-stream")
	c.Header("Content-Length", fmt.Sprintf("%d", len(p)))
	c.Writer.Write(p)
	return
}
