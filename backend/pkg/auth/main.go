package auth

import (
	"os"

	"github.com/dgryski/dgoogauth"
)

func GenConfig() *dgoogauth.OTPConfig {
	config := &dgoogauth.OTPConfig{
		Secret:      os.Getenv("OTP_SECRET"),
		WindowSize:  3,
		UTC:         true,
		HotpCounter: 0,
	}

	return config
}
