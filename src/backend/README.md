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
   4. Enter `./src/backend/src/.venv/bin/python`

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
