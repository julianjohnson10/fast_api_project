from fastapi import APIRouter
from motor import motor_asyncio
from nba_api.stats.static import players
import asyncio

router = APIRouter()

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client['players_db']
collection = db['players_collection']

def player_helper(player) -> dict:
    return {
        "_id": str(player["_id"]),
        "id": player["id"],  # Convert ObjectId to string
        "full_name": player["full_name"],
        "first_name": player['first_name'],
        "last_name": player['last_name'],
        "is_active": player['is_active'],}

async def create_players():
    all_players = players.get_players()

    for player in all_players:
        player_id = player['id']
        existing_player = await collection.find_one({'id': player_id})
        if existing_player is None:
            await collection.insert_one(player)
            print(f"Player with ID {player_id} created!")
        else:
            print(f"Player with ID {player_id} already exists. Skipping insertion.")

async def start_db():
    while True:
        await create_players()
        await asyncio.sleep(3600)  # Adjust the interval as per your requirements