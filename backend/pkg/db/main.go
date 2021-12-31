package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "admin"
	password = "password"
)

func CreateDbSession() *pgx.Conn {
	args := os.Args[1:]

	dbname := "mydrive"

	for i, arg := range args {
		if arg == "--keyspace" {
			if len(args) >= i {
				dbname = args[i+1]
			}
		}
	}

	connection := connect(dbname)

	return connection
}

func connect(dbname string) *pgx.Conn {
	connUri := fmt.Sprintf("postgres://%s:%s@%s:%d/%s", user, password, host, port, dbname)

	fmt.Println(connUri)

	conn, err := pgx.Connect(context.Background(), connUri)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Connected to database!")

	return conn
}
