from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.views import router

app = FastAPI()

# Include your routers or additional configuration here
app.include_router(router)

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
    # Code to run during application startup
    pass

@app.on_event("shutdown")
async def shutdown_event():
    # Code to run during application shutdown
    pass