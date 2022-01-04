package routes

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/dgryski/dgoogauth"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
)

type LoginBody struct {
	OTP string `json:"otp"`
}

const (
	username = "dmaloy97@gmail.com"
)

func AuthRequired(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get("user")
	if user == nil {
		// Abort the request with the appropriate error code
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	// Continue down the chain to handler etc
	c.Next()
	return
}

func CheckIfPublicHandler(db *pgx.Conn) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		session := sessions.Default(c)
		user := session.Get("user")

		if user != nil {
			return
		}

		fetchByPIDQuery := `
			select id from files
			where pid = $1
		`

		rows, err := db.Query(context.Background(), fetchByPIDQuery, c.Param("id"))

		if err != nil {

			c.String(404, "File deos not exist.")
			return
		}

		rows.Next()

		var id sql.NullInt32
		rows.Scan(&id)

		rows.Close()

		// override params
		paramsCopy := make([]gin.Param, 0)
		for _, param := range c.Params {
			if param.Key == "id" {
				param.Value = strconv.Itoa(int(id.Int32))
			}
			paramsCopy = append(paramsCopy, param)
		}

		c.Params = paramsCopy

		return
	}

	return gin.HandlerFunc(fn)
}

func LoginHandler(db *pgx.Conn, authenticator *dgoogauth.OTPConfig) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		session := sessions.Default(c)

		var formData LoginBody
		c.BindJSON(&formData)

		if isValid, err := authenticator.Authenticate(formData.OTP); !isValid || err != nil {
			c.String(http.StatusUnauthorized, "Authentication failed.")
			return
		}

		session.Set("user", username)

		session.Options(sessions.Options{
			MaxAge: 3600 * 12,
		})

		if err := session.Save(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Successfully authenticated user"})
		return
	}

	return gin.HandlerFunc(fn)
}

func LogoutHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		session := sessions.Default(c)
		user := session.Get("user")
		if user == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session token"})
			return
		}
		session.Delete("user")
		if err := session.Save(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
		return
	}

	return gin.HandlerFunc(fn)
}
