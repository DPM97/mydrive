package auth

import (
	"github.com/dgryski/dgoogauth"
)

func GenConfig(OTPSecret string) *dgoogauth.OTPConfig {

	config := &dgoogauth.OTPConfig{
		Secret:      OTPSecret,
		WindowSize:  3,
		UTC:         true,
		HotpCounter: 0,
	}

	return config
}
