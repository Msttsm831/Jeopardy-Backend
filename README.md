# Jeoprady Backend

## Description
This project is a backend API for managing Jeoprady games, including features for creating and managing jeopardy games with questions, options, correct answers, points, and categories. It uses MongoDB with Mongoose for data modeling and Express for handling API requests.

## Installation
1. Clone the repository:
   ```bash
   git clone <https://github.com/Msttsm831/Jeopardy-Backend>
   ```
2. Navigate to the project directory:
   ```bash
   cd Jeoprady_backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage
To start the server, run:
```bash
npm start
```
The server listens on the specified port (default is 3000).

## Middleware
- **Verify Token**: Custom middleware to verify JWT tokens for protected routes.
- **Upload**: Middleware for handling file uploads.

## API Endpoints
- **POST /jeoprady**: Create a new Jeoprady game (requires authentication).
- **GET /jeoprady**: Retrieve all Jeoprady games.
- **GET /jeoprady/:id**: Retrieve details of a specific Jeoprady game.
- **PUT /jeoprady/:id**: Update an existing Jeoprady game (requires authentication).
- **DELETE /jeoprady/:id**: Delete a Jeoprady game (requires authentication).

## Data Models
### Jeoprady
- **title**: String, required
- **description**: String, required
- **author**: ObjectId, reference to User, required
- **questions**: Array of question objects

### Question
- **questionText**: String, required
- **options**: Array of strings, required, minimum 2 options
- **correctAnswer**: String, required
- **points**: Number, required
- **category**: String, required

## Contributors   
- Mohd thamer

## Frontend
The frontend for this project can be found at: [Jeoprady Frontend](https://github.com/Msttsm831/Jeoprady_frontend)

## License
This project is licensed under the MIT License.
