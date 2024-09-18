# Meeting Bot Backend

This is the FastAPI backend.

# Getting Started

Clone the repository, then follow the steps below:

1. Navigate to the backend directory
   
   ```bash
   cd src/backend
   ```

2. Set up virtual environment and install packages:

    ```
    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install -r requirements.txt
    ```

3. Run the server:

    ```
    uvicorn main:app --reload
    ```

The app will run at `http://127.0.0.1:8000`.