from fastapi import FastAPI
from app.app import app as application
import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:application", host="0.0.0.0", port=8000, reload=True)