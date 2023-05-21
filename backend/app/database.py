from fastapi import APIRouter
from motor import motor_asyncio
from nba_api.stats.static import players
from nba_api.stats.static import teams
import asyncio

router = APIRouter()

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
players_db = client['nba_database']
teams_db = client['nba_database']
players_table = players_db['players_table']
teams_table = teams_db['teams_table']

def player_helper(player) -> dict:
    return {
        "_id": str(player["_id"]),
        "id": player["id"],  # Convert ObjectId to string
        "full_name": player["full_name"],
        "first_name": player['first_name'],
        "last_name": player['last_name'],
        "is_active": player['is_active'],}

def team_helper(team) -> dict:
    return {
        "_id": str(team["_id"]),
        "id": team["id"],  # Convert ObjectId to string
        "full_name": team["full_name"],
        "abbreviation": team['abbreviation'],
        "nickname": team['nickname'],
        "city": team['city'],
        "state": team['state'],
        "year_founded": team['year_founded'],}

async def create_players():
    all_players = players.get_players()

    for player in all_players:
        player_id = player['id']
        existing_player = await players_table.find_one({'id': player_id})
        if existing_player is None:
            await players_table.insert_one(player)
            print(f"Player with ID {player_id} created!")
        else:
            print(f"Player with ID {player_id} already exists. Skipping insertion.")

async def create_teams():
    all_teams = teams.get_teams()

    for team in all_teams:
        team_id = team['id']
        existing_team = await teams_table.find_one({'id': team_id})
        if existing_team is None:
            await teams_table.insert_one(team)
            print(f"Team with ID {team_id} created!")
        else:
            print(f"Team with ID {team_id} already exists. Skipping insertion.")

async def start_db():
    while True:
        await create_players()
        await create_teams()
        await asyncio.sleep(3600)  # Adjust the interval as per your requirements