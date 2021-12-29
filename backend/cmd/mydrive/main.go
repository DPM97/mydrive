package main

import (
	"context"
	"log"
	"os"

	"github.com/DPM97/mydrive/backend/pkg/db"
	"github.com/DPM97/mydrive/backend/pkg/uploader"
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

	router := gin.New()

	/* check for dev port in env file */
	port := "8080"
	newPort, portExists := os.LookupEnv("PORT")
	if portExists {
		port = newPort
	}

	init_routes(router, dbSession)

	log.Fatal(router.Run(":" + port))
}

func init_routes(router *gin.Engine, db *pgx.Conn) {
	router.POST("/upload", uploader.UploadHandler(db))
}
