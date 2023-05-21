from fastapi import APIRouter, Query
from app.database import player_helper, team_helper, MONGO_DETAILS, client, players_table, teams_table
from motor import motor_asyncio
from motor.motor_asyncio import AsyncIOMotorCursor

router = APIRouter()

@router.get('/players')
async def get_players(page: int = Query(1, ge=1), batch_size: int = Query(100, ge=1)):
    skip = (page - 1) * batch_size
    limit = batch_size

    cursor: AsyncIOMotorCursor = players_table.find().skip(skip).limit(limit)
    players = await cursor.to_list(None)

    return [player_helper(player) for player in players]

@router.get('/all_players')
async def get_players():
    cursor: AsyncIOMotorCursor = players_table.find()
    players = await cursor.to_list(None)

    return [player_helper(player) for player in players]

@router.get('/all_teams')
async def get_teams():
    cursor: AsyncIOMotorCursor = teams_table.find()
    teams = await cursor.to_list(None)

    return [team_helper(team) for team in teams]

@router.get('/players/{searched_player}')
async def get_players_searched(searched_player: str):
    substring = searched_player
    pattern = f".*{substring}.*"
    query = {"full_name": {"$regex": pattern, "$options": "i"}}
    cursor: AsyncIOMotorCursor = players_table.find(query)
    players = await cursor.to_list(None)
    return [player_helper(player) for player in players]

@router.get('/teams/{searched_team}')
async def get_teams_searched(searched_team: str):
    substring = searched_team
    pattern = f".*{substring}.*"
    query = {"full_name": {"$regex": pattern, "$options": "i"}}
    cursor: AsyncIOMotorCursor = teams_table.find(query)
    teams = await cursor.to_list(None)
    return [team_helper(team) for team in teams]