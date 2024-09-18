from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


class RequestData(BaseModel):
    name: str
    age: int


@app.get("/test")
def echo(data: RequestData):
    name, age = data.model_dump().values()
    result = f"Hello {name}, you are {age} years old"
    return {"response": result}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
