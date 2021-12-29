package routes

import (
	"context"
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
)

type File struct {
	ID          sql.NullInt32  `json:"id"`
	LOID        sql.NullInt32  `json:"loid"`
	Path        sql.NullString `json:"path"`
	Uploaded_at sql.NullTime   `json:"uploaded_at"`
	Name        sql.NullString `json:"name"`
	File_type   sql.NullString `json:"file_type"`
	Size        sql.NullInt32  `json:"size"`
}

func FetchDocumentHandler(db *pgx.Conn) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		// for now we just fetch all documents with nil pid (root directory)

		var fetchQuery string
		fetchQuery = `
			select * from files
			where path = $1
		`
		rows, err := db.Query(context.Background(), fetchQuery, c.Param("relPath"))

		if err != nil {
			c.String(400, "query failed")
			return
		}

		defer rows.Close()

		items := make([]File, 0)

		for rows.Next() {
			var item File
			rows.Scan(
				&item.ID,
				&item.LOID,
				&item.Path,
				&item.Uploaded_at,
				&item.Name,
				&item.File_type,
				&item.Size,
			)

			items = append(items, item)
		}

		c.JSON(200, items)
		return
	}

	return gin.HandlerFunc(fn)
}

type CreateFolderForm struct {
	RelativePath string `json:"relativePath"`
	Name         string `json:"name"`
}

func CreateFolderHandler(db *pgx.Conn) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		var formData CreateFolderForm
		c.BindJSON(&formData)

		// for now we just fetch all documents with nil pid (root directory)

		insertQuery := `
			insert into
			files(file_type, name, path)
			values($1, $2)
		`

		if _, err := db.Exec(context.Background(),
			insertQuery,
			"folder",
			formData.Name,
			formData.RelativePath); err != nil {
			c.String(400, "could not create folder.")
		}

		c.String(200, "folder created.")
		return
	}

	return gin.HandlerFunc(fn)
}
