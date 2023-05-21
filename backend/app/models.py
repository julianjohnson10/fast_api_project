from pydantic import BaseModel
class Player(BaseModel):
    id: int
    full_name: str
    first_name: str
    last_name: str
    is_active: bool