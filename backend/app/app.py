from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import router as database_router
from .database import start_db
from .views import router as views_router
import asyncio

app = FastAPI(debug=True)

# Include your routers or additional configuration here
app.include_router(database_router)
app.include_router(views_router)
# You can add more configuration or middleware here if needed

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

# You might also define startup and shutdown events if necessary
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(start_db())
    pass

@app.on_event("shutdown")
async def shutdown_event():
    # Code to run during application shutdown
    pass