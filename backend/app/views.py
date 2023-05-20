from fastapi import APIRouter
from app.models import Item, Category

router = APIRouter()

@router.get("/api/data")
def get_data():
    # Code to handle GET request
    return {"message": "Hello from FastAPI!"}

@router.post("/api/data")
def create_data():
    # Code to handle POST request
    return {"message": "Data created successfully"}

items = {
    0: Item(name="Hammer", price=9.99, count=20, id=0, category=Category.TOOLS),
    1: Item(name="Pliers", price=3.99, count=10, id=1, category=Category.TOOLS),
    2: Item(name="Nails", price=1.99, count=100, id=2, category=Category.CONSUMABLES)
}

@router.get("/items")
def index() -> dict[str, dict[int, Item]]:
    return {"items": items}