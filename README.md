# Project Title: File Manager API

## Overview

This project aims to develop a simple file management platform using Node.js, Express, MongoDB, and Redis. The application will provide functionalities for user authentication, file uploads, and management of files through a RESTful API. This README outlines the project structure, installation instructions, usage, and features.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration with token-based authentication.
  
- **File Management**: Upload, view, and manage files with options for public access.
  
- **Thumbnail Generation**: Automatically generate thumbnails for image uploads.
  
- **Real-time Status Check**: API endpoints to check the status of the Redis and MongoDB connections.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable network applications.
  
- **Express.js**: Web framework for Node.js to create APIs easily.
  
- **MongoDB**: NoSQL database for storing user and file data.
  
- **Redis**: In-memory data structure store used for caching and sessions.
  
- **Kue**: Priority job queue for Node.js backed by Redis.

## Installation

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alx-files_manager.git
   cd alx-files_manager


## Tasks

### 0. Redis utils

Inside the folder `utils`, create a file `redis.js` that contains the class `RedisClient`.

**RedisClient should have:**

- The constructor that creates a client to Redis. Any error of the redis client must be displayed in the console (you should use `on('error')` of the redis client).
- A function `isAlive` that returns true when the connection to Redis is successful, otherwise, false.
- An asynchronous function `get` that takes a string key as an argument and returns the Redis value stored for this key.
- An asynchronous function `set` that takes a string key, a value, and a duration in seconds as arguments to store it in Redis (with an expiration set by the duration argument).
- An asynchronous function `del` that takes a string key as an argument and removes the value in Redis for this key.

After the class definition, create and export an instance of `RedisClient` called `redisClient`.

### 1. MongoDB utils

Inside the folder `utils`, create a file `db.js` that contains the class `DBClient`.

**DBClient should have:**

- The constructor that creates a client to MongoDB:
  - host: from the environment variable `DB_HOST` or default: `localhost`.
  - port: from the environment variable `DB_PORT` or default: `27017`.
  - database: from the environment variable `DB_DATABASE` or default: `files_manager`.
- A function `isAlive` that returns true when the connection to MongoDB is successful, otherwise, false.
- An asynchronous function `nbUsers` that returns the number of documents in the collection `users`.
- An asynchronous function `nbFiles` that returns the number of documents in the collection `files`.

After the class definition, create and export an instance of `DBClient` called `dbClient`.

### 2. First API

Inside `server.js`, create the Express server:

- It should listen on the port set by the environment variable `PORT` or by default 5000.
- It should load all routes from the file `routes/index.js`.

Inside the folder `routes`, create a file `index.js` that contains all endpoints of our API:

- `GET /status` => `AppController.getStatus`
- `GET /stats` => `AppController.getStats`

Inside the folder `controllers`, create a file `AppController.js` that contains the definition of the 2 endpoints:

- `GET /status` should return if Redis is alive and if the DB is alive too by using the 2 utils created previously: `{ "redis": true, "db": true }` with a status code 200.
- `GET /stats` should return the number of users and files in DB: `{ "users": 12, "files": 1231 }` with a status code 200.
  - Users collection must be used for counting all users.
  - Files collection must be used for counting all files.


### 3. Create a new user

Now that we have a simple API, it’s time to add users to our database.

In the file `routes/index.js`, add a new endpoint:

- `POST /users` => `UsersController.postNew`

Inside `controllers`, add a file `UsersController.js` that contains the new endpoint:

- `POST /users` should create a new user in DB:
  - To create a user, you must specify an email and a password.
  - If the email is missing, return an error `Missing email` with a status code 400.
  - If the password is missing, return an error `Missing password` with a status code 400.
  - If the email already exists in DB, return an error `Already exists` with a status code 400.
  - The password must be stored after being hashed in SHA1.
  - The endpoint should return the new user with only the email and the id (auto-generated by MongoDB) with a status code 201.
  - The new user must be saved in the collection `users`:
    - email: same as the value received
    - password: SHA1 value of the value received

### 4. Authenticate a user

In the file `routes/index.js`, add 3 new endpoints:

- `GET /connect` => `AuthController.getConnect`
- `GET /disconnect` => `AuthController.getDisconnect`
- `GET /users/me` => `UserController.getMe`

Inside `controllers`, add a file `AuthController.js` that contains new endpoints:

- `GET /connect` should sign-in the user by generating a new authentication token:
  - By using the header `Authorization` and the technique of Basic auth (Base64 of the `<email>:<password>`), find the user associated with this email and with this password (reminder: we are storing the SHA1 of the password).
 

 - If the user is not found, return an error `Unauthorized` with a status code 401.
  - If the user is found, generate a new authentication token and store it in Redis with an expiration of 24 hours.
  - The token should be of this form: `auth_<user_id>` (example: `auth_12`).
  - The response should contain the user's id and email: `{ "id": 12, "email": "betty@holbertonschool.com" }` with a status code 200.
  - If the user is already authenticated, generate a new token.
  - If the user is already authenticated, this should refresh the current authentication token.
- `GET /disconnect` should destroy the current authentication token:
  - By using the header `X-Token`, find the token in Redis.
  - If the token is not found, return an error `Unauthorized` with a status code 401.
  - If the token is found, remove the token and return an empty dictionary with a status code 204.
- `GET /users/me` should return the current authenticated user:
  - By using the header `X-Token`, find the token in Redis.
  - If the token is not found, return an error `Unauthorized` with a status code 401.
  - If the token is found, return the user from the `users` collection associated with this token with a status code 200.

### 5. Users

Inside `controllers`, add a file `UsersController.js` that contains 2 new endpoints:

- `GET /users/:id` => `UserController.getShow`
- `PUT /users/me` => `UserController.putMe`

**`GET /users/:id`** should return the user associated with the specified ID:
  - The ID is a parameter in the URL.
  - If the user is not found, return an error `Not found` with a status code 404.
  - If the user is found, return the user with a status code 200.

**`PUT /users/me`** should update the user's email and/or password:
  - To update a user, you must specify an email and a password.
  - If the email is missing, return an error `Missing email` with a status code 400.
  - If the password is missing, return an error `Missing password` with a status code 400.
  - If the email already exists in DB, return an error `Already exists` with a status code 400.
  - Update the email and password of the authenticated user in the `users` collection:
    - email: same as the value received
    - password: SHA1 value of the value received
  - Return the updated user with a status code 200.

### 6. Files

Inside `routes/index.js`, add 4 new endpoints:

- `GET /files/:id` => `FilesController.getShow`
- `GET /files` => `FilesController.getIndex`
- `POST /files` => `FilesController.postNew`
- `PUT /files/:id/publish` => `FilesController.putPublish`

Inside `controllers`, add a file `FilesController.js` that contains the new endpoints:

**`GET /files/:id`** should return the file associated with the specified ID:
  - The ID is a parameter in the URL.
  - If the file is not found, return an error `Not found` with a status code 404.
  - If the file is found and is not published and the authenticated user is not the owner, return an error `Forbidden` with a status code 403.
  - If the file is found, return the file with a status code 200.

**`GET /files`** should return a list of all published files:
  - A published file has the `isPublic` field set to `true`.
  - Return the list of files with a status code 200.

**`POST /files`** should create a new file in the DB:
  - To create a file, you must specify a name and a type.
  - If the name is missing, return an error `Missing name` with a status code 400.
  - If the type is missing, return an error `Missing type` with a status code 400.
  - Create the file in the `files` collection:
    - name: same as the value received
    - type: same as the value received
    - isPublic: false (by default)
    - userId: authenticated user ID
  - Return the new file with a status code 201.

**`PUT /files/:id/publish`** should update the file to make it published:
  - The ID is a parameter in the URL.
  - If the file is not found, return an error `Not found` with a status code 404.
  - If the authenticated user is not the owner of the file, return an error `Forbidden` with a status code 403.
  - Update the file's `isPublic` field to `true`.
  - Return the updated file with a status code 200.

### 7. Thumbnails

We want to generate thumbnails for image files. When a new image file is created, a thumbnail should be generated automatically.

Inside `controllers`, add a file `ThumbnailsController.js` with the following endpoint:

**`POST /files/:id/thumbnail`** should generate a thumbnail for the specified image file:
  - The ID is a parameter in the URL.
  - If the file is not found, return an error `Not found` with a status code 404.
  - If the authenticated user is not the owner of the file, return an error `Forbidden` with a status code 403.
  - If the file is not an image (type is not "image"), return an error `Bad request` with a status code 400.
  - Use a package like `sharp` to generate a thumbnail for the image. The thumbnail should have a width and height of 50 pixels.
  - Store the thumbnail as a base64-encoded string in the `thumbnail` field of the file's document in the `files` collection.
  - Return a success message with a status code 200.

### 8. File data

Inside `routes/index.js`, add 1 new endpoint:

- `GET /files/:id/data` => `FilesController.getFileData`

Inside `controllers/FilesController.js`, add the new endpoint:

**`GET /files/:id/data`** should return the data (content) of the file:
  - The ID is a parameter in the URL.
  - If the file is not found, return an error `Not found` with a status code 404.
  - If the file is not published and the authenticated user is not the owner, return an error `Forbidden` with a status code 403.
  - If the file has a thumbnail, return the thumbnail.
  - If the file does not have a thumbnail, return the message "No thumbnail" with a status code 404.

### 9. Users and permissions

Add a new field to the `files` collection to store the user ID of the file owner. This field should be called `userId`. Update the endpoints as follows:

- When creating a new file, set the `userId` to the ID of the authenticated user.
- When

 checking permissions (e.g., for viewing, publishing, or generating thumbnails), compare the `userId` of the file with the ID of the authenticated user to determine if they have the necessary permissions.

### 10. Logging

Implement logging for all incoming requests. Log each request's method, URL, and timestamp to a log file. Use a logging library like Winston for this purpose. Ensure that the log file is rotated daily.

### 11. Error handling

Implement global error handling middleware that catches errors thrown during request processing and sends an appropriate error response to the client. Log the error details (including stack trace) to the log file.

### 12. Security

Ensure that your application follows security best practices, including:

- Implementing input validation and sanitization to prevent common security vulnerabilities like SQL injection and Cross-Site Scripting (XSS).
- Using password hashing for storing user passwords in the database.
- Implementing rate limiting to prevent abuse or denial-of-service attacks on your API.
- Enforcing authentication and authorization for sensitive endpoints and data.
- Using HTTPS to secure data transmission.
- Regularly updating dependencies and libraries to patch security vulnerabilities.

### 13. Testing

Write comprehensive unit tests and integration tests for your API endpoints and controllers using a testing framework like Mocha or Jest. Ensure that your tests cover both success and error cases.

### 14. Documentation

Document your API endpoints, request/response formats, and authentication mechanisms using a tool like Swagger or by creating API documentation in Markdown format. Make this documentation easily accessible to developers who will be using your API.

### 15. Deployment

Deploy your Node.js application and MongoDB database to a production environment. Use a hosting service like AWS, Heroku, or a cloud platform of your choice. Configure environment variables for sensitive information, such as database connection strings and API keys, and ensure that your application runs securely and reliably in a production environment.

This is a high-level overview of the tasks you need to perform to develop a Node.js REST API with the specified features. You can break down these tasks into smaller steps and implement them one by one. Additionally, consider using a framework like Express.js to simplify the development process and manage routes and middleware.
