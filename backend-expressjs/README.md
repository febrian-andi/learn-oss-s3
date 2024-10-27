# express-js-simple-CRUD-MySQL
learn-expressJS-01

This is a simple CRUD (Create, Read, Update, Delete) project built using Express.js, Node.js, and MySQL. It provides RESTful API endpoints to manage employee data.

## Postman
https://www.mediafire.com/file/7sj200tdc7i6xo9/express-js-01_API.postman_collection.json/file
https://documenter.getpostman.com/view/24867369/2s9YXiYLor

## Prerequisites

Before running this project, make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/)

## Getting Started

1. Clone this repository to your local machine:
```
git clone https://github.com/febrian-andi/express-js-simple-CRUD-MySQL.git
```

3. Import the `employees.sql` file into your MySQL database.
4. Create a `.env` file in the project directory and set your MySQL database configuration. Example:
```
DB_HOST=localhost
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_DATABASE=your-mysql-database
```

5. Install project dependencies:
```
npm install
```

6. Start the Express.js server:
```
npm start
```
