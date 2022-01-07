package db

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions/postgres"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4/pgxpool"
	_ "github.com/lib/pq"
	"github.com/mitchellh/mapstructure"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "admin"
	password = "password"
)

func CreateDbSession() *pgxpool.Pool {
	args := os.Args[1:]

	dbname := "mydrive"

	for i, arg := range args {
		if arg == "--keyspace" {
			if len(args) >= i {
				dbname = args[i+1]
			}
		}
	}

	pool := connect(dbname)

	return pool
}

func connect(dbname string) *pgxpool.Pool {
	connUri := fmt.Sprintf("postgres://%s:%s@%s:%d/%s", user, password, host, port, dbname)

	pool, err := pgxpool.Connect(context.Background(), connUri)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Connected to database!")

	return pool
}

func Setup_Sessions() postgres.Store {
	dbname := "mydrive"
	connUri := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable", user, password, host, port, dbname)

	db, err := sql.Open("postgres", connUri)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	store, err := postgres.NewStore(db, []byte(os.Getenv("SESSION_SECRET")))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create session store: %v\n", err)
		os.Exit(1)
	}

	return store
}

func FetchConnection(pool *pgxpool.Pool) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		conn, err := pool.Acquire(context.Background())
		if err != nil {
			c.String(http.StatusBadRequest, "Failed to aquire database connection from pool.")
			return
		}
		defer conn.Release()

		c.Set("conn", conn)
		c.Next()
		return
	}

	return gin.HandlerFunc(fn)
}

func FetchConn(c *gin.Context) (*pgxpool.Conn, error) {
	db := &pgxpool.Conn{}
	conn, _ := c.Get("conn")

	err := mapstructure.Decode(conn, db)

	return db, err
}
