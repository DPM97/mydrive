# Screenshots
![image](https://user-images.githubusercontent.com/34420038/148453321-82e6c0f9-9df0-4936-879b-acf120ba5d98.png)
![image](https://user-images.githubusercontent.com/34420038/148454190-aa6b6716-ec12-4e1c-a94f-263c8183b4cd.png)
![image](https://user-images.githubusercontent.com/34420038/148320916-894d68d2-09ee-4bce-93ca-514b82f04743.png)

# Usage
The main purpose of this is project was to become a little more familiar
with go and postgresql. In essence, it is a simple file storage application, similar to that of something like *AWS S3* or *Google Drive*.

I am currently running this on my raspberry pi to store personal files and can provide a bit more insight into that installation if you want to contact me.

## Pre-requisites
- Docker
- npm || yarn || pnpm
- node *v16.x*
- go (I am using *v1.18beta1*)
- nginx (**optional**, however useful for production)

## Features
- OTP authentication (to be used w/ google authenticator and whatnot)
- Multiple user support
- File storage
- Folder creation
- Public link sharing for viewing pdf files
- Storage statistics
- User/Email whitelisting

## Enviornment variables
- SESSION_SECRET: Any session secret.
- WHITELIST: A comma delimited string of emails if you only want certain people to make accounts.
- PRODUCTION: Boolean, set to true if you are running the application in a production environment.
- NEXT_PUBLIC_API_URI: The url where the backend/api portion of the application will be accessed in production. This gets rid of a lot of cors issues and using a reverse proxy like *nginx* you can have *https://myurl.com/api/v1* proxy to the backend. This would be what you set **NEXT_PUBLIC_API_URI** equal to.

## Getting up and running
- Set up your environment variables
- Database: ```cd db && docker-compose up -d```
- Backend: ```cd backend && go build ./cmd/mydrive/main.go && ./main```
- Frontend: ```cd frontend && npm i && npm build && npm start```
