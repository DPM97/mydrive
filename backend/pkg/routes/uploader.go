package routes

import (
	"bytes"
	"context"
	"errors"
	"io"
	"mime/multipart"
	"path/filepath"

	"github.com/DPM97/mydrive/backend/pkg/rand"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
)

func createByteArr(c *gin.Context, file *multipart.FileHeader) (*bytes.Buffer, error) {
	src, err := file.Open()
	if err != nil {
		return nil, err
	}

	buf := bytes.NewBuffer(nil)

	if _, err := io.Copy(buf, src); err != nil {
		return nil, errors.New("Not all file bytes could be read.")
	}

	if buf.Len() != int(file.Size) {
		return nil, errors.New("Not all file bytes could be read.")
	}

	src.Close()

	return buf, nil
}

func UploadHandler(db *pgx.Conn) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		file, err := c.FormFile("uploadedFile")

		if err != nil {
			c.String(400, err.Error())
			return
		}

		buffer, err := createByteArr(c, file)

		if err != nil {
			c.String(400, err.Error())
		}

		tx, err := db.Begin(context.Background())

		if err != nil {
			c.String(400, err.Error())
			return
		}

		lo := tx.LargeObjects()

		loid, err := lo.Create(context.Background(), 0)
		if err != nil {
			c.String(400, "failed to create object.")
			tx.Rollback(context.TODO())
			return
		}

		obj, err := lo.Open(context.Background(), loid, pgx.LargeObjectModeWrite)
		if err != nil {
			c.String(400, "failed to open object.")
			tx.Rollback(context.TODO())
			return
		}

		n, err := obj.Write(buffer.Bytes())
		if err != nil {
			c.String(400, "failed to write object.")
			tx.Rollback(context.TODO())
			return
		}

		if n != int(file.Size) {
			c.String(400, "Expected n to be %d, got %d", int(file.Size), n)
			tx.Rollback(context.TODO())
			return
		}

		if err := tx.Commit(context.Background()); err != nil {
			c.String(400, "failed to write object.")
			tx.Rollback(context.TODO())
			return
		}

		insertQuery := `
			insert into
			files(loid, file_type, name, size, path, pid)
			values($1, $2, $3, $4, $5, $6)
		`

		ext := filepath.Ext(file.Filename)

		if _, err := db.Exec(context.Background(),
			insertQuery,
			loid,
			ext,
			file.Filename,
			file.Size,
			c.Query("relativePath"),
			rand.Generate(100)); err != nil {

		}

		c.String(200, "success")
		return
	}

	return gin.HandlerFunc(fn)
}
