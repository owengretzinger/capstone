## Meeting Bot Backend

This is the FastAPI backend.


## Getting Started

Clone the repository, then follow the steps below:

1. Navigate to the backend directory
   
   ```
   cd src/backend
   ```

2. Set up the virtual environment and install packages:

    ```
    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install -r requirements.txt
    ```

3. Configure the VSCode Python interpreter if necessary

    1. Open the VSCode command palette (`Ctrl/Cmd + Shift + P`)
    2. Enter `Python: Select Interpreter`
    3. Press `Enter interpreter path`
    4. Enter `./src/backend/venv/bin/python`

4. Navigate back to `/src` and run the server:

    ```
    cd ..
    uvicorn backend.main:app --reload
    ```

    The app will run at `http://127.0.0.1:8000`.


## Documentation

After running the server, you can access interactive API docs:

- Go to http://127.0.0.1:8000/redoc for ReDoc docs
- Go to http://127.0.0.1:8000/docs for Swagger UI docs


## Testing

### pytest

FastAPI tests are set up using pytest and httpx. (See https://fastapi.tiangolo.com/advanced/async-tests/ for documentation.)

Run the test suite using pytest:

```
pytest
```

### http

You can also manually test http requests using `.http` files with the REST client VSCode extension.


## Adding Packages

Install a package and add it to requirements.txt using the following:

```
pip install <package> && pip freeze > requirements.txt
```