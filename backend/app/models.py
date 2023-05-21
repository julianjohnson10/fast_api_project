from enum import Enum
from pydantic import BaseModel
from bson import ObjectId
class Category(Enum):
    TOOLS = "tools"
    CONSUMABLES = "consumables"

class Item(BaseModel):
    name: str
    price: float
    count: int
    id: int
    category: Category

class Player(BaseModel):
    id: int
    full_name: str
    first_name: str
    last_name: str
    is_active: bool

def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }

def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}