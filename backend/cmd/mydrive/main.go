package main

import (
	"context"
	"log"
	"os"

	"github.com/DPM97/mydrive/backend/pkg/auth"
	"github.com/DPM97/mydrive/backend/pkg/db"
	"github.com/DPM97/mydrive/backend/pkg/routes"
	"github.com/dgryski/dgoogauth"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
	"github.com/joho/godotenv"
)

func main() {
	log.Println("Attempting db connection...")
	dbSession := db.CreateDbSession()

	defer dbSession.Close(context.Background())

	if os.Getenv("PRODUCTION") != "true" {
		godotenv.Load()
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowCredentials = true
	corsConfig.AllowOrigins = []string{"http://localhost:3000", "http://192.168.86.27:3000"}

	router.Use(cors.New(corsConfig))
	router.Use(sessions.Sessions("user_session", db.Setup_Sessions()))
	auth := auth.GenConfig()

	/* check for dev port in env file */
	port := "8080"
	newPort, portExists := os.LookupEnv("PORT")
	if portExists {
		port = newPort
	}

	init_routes(router, dbSession, auth)

	log.Fatal(router.Run(":" + port))
}

func init_routes(router *gin.Engine, db *pgx.Conn, auth *dgoogauth.OTPConfig) {
	router.GET("/download/:id", routes.AuthRequired, routes.DownloadHandler(db))

	router.POST("/files", routes.AuthRequired, routes.UploadHandler(db))
	router.GET("/files", routes.AuthRequired, routes.FetchDocumentHandler(db))
	router.DELETE("/files/:id", routes.AuthRequired, routes.DeleteDocumentHandler(db))
	router.GET("/files/:id", routes.CheckIfPublicHandler(db), routes.DownloadHandler(db))

	router.POST("/folders", routes.AuthRequired, routes.CreateFolderHandler(db))
	router.DELETE("/folders/:id", routes.AuthRequired, routes.DeleteFolderHandler(db))

	router.POST("/login", routes.LoginHandler(db, auth))
	router.GET("/logout", routes.LogoutHandler())
}
