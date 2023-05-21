from fastapi import APIRouter, Query
from app.database import player_helper
from motor import motor_asyncio
from motor.motor_asyncio import AsyncIOMotorCursor

router = APIRouter()
MONGO_DETAILS = "mongodb://localhost:27017"
client = motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client['players_db']
collection = db['players_collection']

@router.get('/players')
async def get_players(page: int = Query(1, ge=1), batch_size: int = Query(100, ge=1)):
    skip = (page - 1) * batch_size
    limit = batch_size

    cursor: AsyncIOMotorCursor = collection.find().skip(skip).limit(limit)
    players = await cursor.to_list(None)

    return [player_helper(player) for player in players]

@router.get('/players/{searched_player}')
async def get_players_searched(searched_player: str, page: int = Query(1, ge=1), batch_size: int = Query(100, ge=1)):
    skip = (page - 1) * batch_size
    limit = batch_size
    substring = searched_player
    pattern = f".*{substring}.*"
    query = {"full_name": {"$regex": pattern, "$options": "i"}}
    cursor: AsyncIOMotorCursor = collection.find(query).skip(skip).limit(limit)
    players = await cursor.to_list(None)
    return [player_helper(player) for player in players]