from enum import Enum
from pydantic import BaseModel
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