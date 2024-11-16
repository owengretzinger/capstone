# Meeting Bot Backend

## Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/downloads/)
- [Rye](https://rye.astral.sh/)

### Project Initialization

Clone the repository, then follow the steps below:

1. Navigate to the backend directory

   ```
   cd src/backend
   ```

2. Install packages with Rye:

   ```
   rye sync
   ```

3. Configure the VSCode Python interpreter if necessary

   1. Open the VSCode command palette (`Ctrl/Cmd + Shift + P`)
   2. Enter `Python: Select Interpreter`
   3. Press `Enter interpreter path`
   4. Enter `./src/backend/.venv/bin/python`

4. Duplicate the `.env.example` file and rename it to `.env`. Fill in the necessary environment variables.

### Running the Server

```
rye run dev
```

The FastAPI app will run at `http://127.0.0.1:8000`.

## Documentation

After running the server, you can access interactive API docs:

- Go to http://127.0.0.1:8000/redoc for ReDoc docs
- Go to http://127.0.0.1:8000/docs for Swagger UI docs

## Testing

### pytest

FastAPI tests are set up using pytest and httpx ([see FastAPI documenation](https://fastapi.tiangolo.com/advanced/async-tests/)).

Run the test suite using the Rye script:

```
rye run test
```

### http

You can also manually test http requests using `.http` files with the REST client VSCode extension.

## Docker

The backend can also be run using Docker. However, it makes development more difficult as VSCode cannot find the proper python interpreter. The only solution is to use the Dev Containers extension, but then you would need to get any development tools like git working inside the container.

1. Build and start the Docker containers:

   ```
   docker-compose up -d --build
   ```

2. The FastAPI app will run at `http://localhost:8004`, and you can access interactive API docs:

   - Go to http://localhost:8004/redoc for ReDoc docs
   - Go to http://localhost:8004/docs for Swagger UI docs

3. Run the test suite:

   ```
   docker-compose exec web pytest
   ```

4. To stop the containers:

   ```
   docker-compose down
   ```
