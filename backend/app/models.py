from pydantic import BaseModel
class Player(BaseModel):
    id: int
    full_name: str
    first_name: str
    last_name: str
    is_active: bool

class Team(BaseModel):
    id: int
    full_name: str
    abbreviation: str
    nickname: str
    city: str
    state: str
    year_founded: int 
