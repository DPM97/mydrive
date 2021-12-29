package routes

import (
	"context"
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
)

type File struct {
	ID          sql.NullInt32  `json:"id"`
	PID         sql.NullInt32  `json:"pid"`
	LOID        sql.NullInt32  `json:"loid"`
	Uploaded_at sql.NullTime   `json:"uploaded_at"`
	Name        sql.NullString `json:"name"`
	File_type   sql.NullString `json:"file_type"`
	Size        sql.NullInt32  `json:"size"`
}

func FetchDocumentHandler(db *pgx.Conn) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		// for now we just fetch all documents with nil pid (root directory)

		fetchQuery := `
			select * from files
			where pid is null
		`

		rows, err := db.Query(context.Background(), fetchQuery)

		if err != nil {
			c.String(400, "query failed")
			return
		}

		defer rows.Close()

		var items []File

		for rows.Next() {
			var item File
			rows.Scan(
				&item.ID,
				&item.PID,
				&item.LOID,
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
