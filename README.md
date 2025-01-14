# Share2Teach
## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [API Usage](#api-usage)
6. [Authentication](#authentication)
7. [Running the Project Locally](#running-the-project-locally)
8. [Testing](#testing)
9. [File Storage](#file-storage)
10. [License](#license)
11. [Contributors](#contributors)
## Introduction
Share2Teach is a collaborative platform designed to facilitate file sharing and moderation among
users. This project includes a backend API built using SvelteKit and integrates with Azure SQL
Database for data storage.
## Features
- User registration and authentication
Share2Teach README
- File upload and sharing capabilities
- Moderation tools 
- JWT-based authentication for secure access
## Technologies Used
- SvelteKit
- JavaScript
- MySQL (Azure SQL Database)
- JWT for authentication
- Postman for API testing
- Docker
- Swagger
## Installation
1. Clone the repository:
 ```bash
 git clone https://github.com/Master2204OR/Share2Teach_Fumbler.git
 ```
2. Navigate to the project directory:
 ```bash
 cd Share2Teach
 ```
3. Install the dependencies:
 ```bash
 npm install
 ```
## API Usage
The API endpoints are documented using Swagger. You can access the interactive API
documentation at the following URL:
[API Documentation](http://localhost:5173/api-docs/ui) 

## Authentication
Authentication is handled using JWT. Ensure to include the token in the Authorization header for
protected routes.
## Running the Project Locally
1. Set up your database connection in `DatabaseConnection.js`.
2. Start the server:
 ```bash
 npm run dev
 ```
## Testing
You can test the API using Postman. Import the Postman collection provided in the `/tests` directory
to get started.
## File Storage
Files are stored in Azure blobstorage. Ensure to configure your storage settings in the application before 
uploading files
## Contributors
- Thabang Tebele
- Cally Makhubele
- Sonele Sodo
- Carl Nxumalo
