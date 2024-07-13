# Reading Recommendation System API

## Introduction

The Reading Recommendation System API allows users to submit their reading intervals and recommends the top-rated books based on the number of unique pages read by all users.

## System Overview

The API provides two main operations:

1. Allow users to submit an interval of starting and ending pages that they read for a specific book. Users can submit multiple intervals for the same book.
2. Show the top five books in the system, picked based on how many unique pages have been read by all users (sorted by most read pages to least read pages).

## API Specification

### Submit a User Reading Interval

#### Request

Allows users to submit their reading intervals for a specific book.

````json
{
  "userId": "111",
  "bookId": "1",
  "startPage": 2,
  "endPage": 30
}

Calculate the Most Recommended Five Books
Request
Allows users to get the top five recommended books in the system.

Response
Returns an array of books sorted by the number of read pages in descending order.

json
Copy code
[
  {
    "book_id": "5",
    "book_name": "test1",
    "num_of_pages": "143",
    "num_of_read_pages": "100"
  },
  {
    "id": 1,
    "book_id": "1",
    "book_name": "test3",
    "num_of_pages": "100",
    "num_of_read_pages": "90"
  },
]
### Calculate the Most Recommended Five Books

#### Request

Allows users to get the top five recommended books in the system.

#### Response

Returns an array of books sorted by the number of read pages in descending order.

```json
[
  {
    "book_id": "5",
    "book_name": "test1",
    "num_of_pages": "143",
    "num_of_read_pages": "100"
  },
  {
    "book_id": "1",
    "book_name": "test3",
    "num_of_pages": "100",
    "num_of_read_pages": "90"
  }
]
````

### Role-Based Authorization

#### Authentication

Only authenticated users can submit reading intervals. The API requires users to provide a valid access token in the request header.

#### Authorization

Only admin users can create and modify books. The API checks the user’s role before allowing them to access certain endpoints.

### Logging and Exception Handling

The API implements logging and exception handling to improve error reporting and debugging.

### Testing

The API includes tests to ensure the correctness of the implemented functionality.

## Implementation Details

### Technologies

- **Framework**: NestJS
- **Database**: PostgreSQL

### Git History

Emphasis is placed on maintaining a clean commit history that is easy to follow and understand the development process.

## Installation, Running, and Containerization

### Prerequisites

- Node.js
- PostgreSQL

### Database

create database and name it reading_recommendations

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/NardeenGeorgeFouadShafik/Reading-Recommendation-System-API-.git
   cd reading-recommendation-system
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure the environment variables:
   Create a `.env.dev` file in the root directory and add the necessary configuration details (e.g., database connection details).
   and this example of the configurations

```sh
SERVER_PORT=9000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=reading_recommendations
DB_POOL_SIZE=3
CORS_ORIGIN="http://localhost:4200, /\.localhost:4200\.\$/"
ADMINS={"email":"admin@gmail.com","name":"adminUser","role":"admin","password":"admin"}
LOG_SEVERITIES=DEBUG,INFO,WARNING,ERROR,CRITICAL
JWT_SECRET=Task@Octane
```

### Running the Project

1. Start the PostgreSQL database.
2. Run the NestJS application:

   ```sh
   npm run typeorm migration:run
   npm run build
   npm run start
   ```

   the project will start on http://localhost:9000

### Swagger

you can run swagger for the routes on
http://localhost:9000/api/docs

## Conclusion

The Reading Recommendation System API provides a simple and efficient way for users to submit their reading intervals and get recommendations for the top-rated books in the system. The API implements role-based authorization, logging, and exception handling, and includes unit tests to ensure secure, reliable, and maintainable code.
