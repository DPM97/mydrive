package main

import (
	"log"
	"os"

	"github.com/DPM97/mydrive/backend/pkg/db"
	"github.com/DPM97/mydrive/backend/pkg/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	log.Println("Attempting db connection...")
	dbSession := db.CreateDbSession()

	defer dbSession.Close()

	if os.Getenv("PRODUCTION") != "true" {
		godotenv.Load()
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowCredentials = true
	corsConfig.AllowOrigins = []string{
		"http://localhost:3000",
		"http://192.168.86.27:3000",
		"http://192.168.86.27",
		"http://storage.dollon.dev",
		"https://storage.dollon.dev",
	}

	router.Use(cors.New(corsConfig))
	router.Use(sessions.Sessions("user_session", db.Setup_Sessions()))

	/* check for dev port in env file */
	port := "8080"
	newPort, portExists := os.LookupEnv("PORT")
	if portExists {
		port = newPort
	}

	init_routes(router, dbSession)

	log.Fatal(router.Run(":" + port))
}

func init_routes(router *gin.Engine, pool *pgxpool.Pool) {
	router.GET("/download/:id", routes.AuthRequired, db.FetchConnection(pool), routes.DownloadHandler)

	router.POST("/files", routes.AuthRequired, db.FetchConnection(pool), routes.UploadHandler)
	router.GET("/files", routes.AuthRequired, db.FetchConnection(pool), routes.FetchDocumentHandler)
	router.DELETE("/files/:id", routes.AuthRequired, db.FetchConnection(pool), routes.DeleteDocumentHandler)
	router.GET("/files/:id", db.FetchConnection(pool), routes.DownloadHandler)

	router.POST("/folders", routes.AuthRequired, db.FetchConnection(pool), routes.CreateFolderHandler)
	router.DELETE("/folders/:id", routes.AuthRequired, db.FetchConnection(pool), routes.DeleteFolderHandler)

	router.GET("/qr", routes.FetchQRHandler)
	router.POST("/accounts", db.FetchConnection(pool), routes.CreateAcctHandler)

	router.POST("/login", db.FetchConnection(pool), routes.LoginHandler)
	router.GET("/logout", db.FetchConnection(pool), routes.LogoutHandler)

	router.GET("/storage", routes.AuthRequired, routes.FetchStorageHandler)
}
