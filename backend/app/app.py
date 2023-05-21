from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import router as database_router
from .views import router as views_router
from .database import start_db, client
import asyncio

app = FastAPI()
app.include_router(database_router)
app.include_router(views_router)

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(start_db())
    pass

"""When app shuts down."""
@app.on_event("shutdown")
async def shutdown_event():
    await client.close()
    pass