from fastapi import APIRouter
from motor import motor_asyncio
from nba_api.stats.static import players
from nba_api.stats.static import teams
from nba_api.stats import endpoints
import asyncio
import aiohttp

router = APIRouter()

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
players_db = client['nba_database']
teams_db = client['nba_database']
team_info_db = client['nba_database']
player_image_db = client['nba_database']
players_table = players_db['players_table']
teams_table = teams_db['teams_table']
team_info_table = team_info_db['team_info_table']
player_images_table = player_image_db['player_images_table']

def player_helper(player) -> dict:
    return {
        "_id": str(player["_id"]),
        "id": player["id"],  # Convert ObjectId to string
        "full_name": player["full_name"],
        "first_name": player['first_name'],
        "last_name": player['last_name'],
        "is_active": player['is_active'],}

def player_image_helper(player) -> dict:
    return {
        "_id": str(player["_id"]),
        "id": player['id'],
        "image": player["image"],  # Convert ObjectId to string
}

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

def team_info_helper(team) -> dict:
    return {
        "_id": str(team["_id"]),
        "GROUP_SET": team["GROUP_SET"],  # Convert ObjectId to string
        "TEAM_ID": team["TEAM_ID"],  # Convert ObjectId to string
        "TEAM_NAME": team["TEAM_NAME"],
        "GROUP_VALUE": team['GROUP_VALUE'],
        "GP": team['GP'],
        "W": team['W'],
        "L": team['L'],
        "W_PCT": team['W_PCT'],
        "MIN": team['MIN'],
        "FGM": team['FGM'],
        "FGA": team['FGA'],
        "FG_PCT": team['FG_PCT'],
        "FG3M": team['FG3M'],
        "FG3A": team['FG3A'],
        "FG3_PCT": team['FG3_PCT'],
        "FTM": team['FTM'],
        "FTA": team['FTA'],
        "FT_PCT": team['FT_PCT'],
        "OREB": team['OREB'],
        "DREB": team['DREB'],
        "REB": team['REB'],
        "AST": team['AST'],
        "TOV": team['TOV'],
        "STL": team['STL'],
        "BLK": team['BLK'],
        "BLKA": team['BLKA'],
        "PF": team['PF'],
        "PFD": team['PFD'],
        "PTS": team['PTS'],
        "PLUS_MINUS": team['PLUS_MINUS'],
        "GP_RANK": team['GP_RANK'],
        "W_RANK": team['W_RANK'],
        "W_PCT_RANK": team['W_PCT_RANK'],
        "MIN_RANK": team['MIN_RANK'],
        "FGM_RANK": team['FGM_RANK'],
        "FGA_RANK": team['FGA_RANK'],
        "FG_PCT_RANK": team['FG_PCT_RANK'],
        "FG3M_RANK": team['FG3M_RANK'],
        "FG3A_RANK": team['FG3A_RANK'],
        "FG3_PCT_RANK": team['FG3_PCT_RANK'],
        "FTM_RANK": team['FTM_RANK'],
        "FTA_RANK": team['FTA_RANK'],
        "FT_PCT_RANK": team['FT_PCT_RANK'],
        "OREB_RANK": team['OREB_RANK'],
        "DREB_RANK": team['DREB_RANK'],
        "REB_RANK": team['REB_RANK'],
        "AST_RANK": team['AST_RANK'],
        "TOV_RANK": team['TOV_RANK'],
        "STL_RANK": team['STL_RANK'],
        "BLK_RANK": team['BLK_RANK'],
        "BLKA_RANK": team['BLKA_RANK'],
        "PF_RANK": team['PF_RANK'],
        "PFD_RANK": team['PFD_RANK'],
        "PTS_RANK": team['PTS_RANK'],
        "PLUS_MINUS_RANK": team['PLUS_MINUS_RANK'],
        }


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

# async def create_team_info():

#     all_teams = teams.get_teams()
#     for team in all_teams:
#         team_id = team['id']
#         team_info = endpoints.teamplayerdashboard.TeamPlayerDashboard(team_id=team_id,season='2022-23')
#         existing_team = await team_info_table.find_one({'TEAM_ID': team_id})
#         if existing_team is None:
#             info = team_info.get_normalized_dict()
#             team_overall = info['TeamOverall']
#             await team_info_table.insert_one({'TeamOverall':team_overall})
#             print(f"Team info with ID {team_id} created!")
#         else:
#             print(f"Team info with ID {team_id} already exists. Skipping insertion.")

async def add_player_images():
    all_players = players.get_players()
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=60)) as session:
        for player in all_players:
            player_id = player['id']
            image_url = f'c'
            existing_player = await player_images_table.find_one({'id': player_id})
            
            if existing_player is None:
                try:
                    async with session.get(image_url) as response:
                        image_data = await response.read()
                    await player_images_table.insert_one({'id': player_id, 'image': image_data})
                    print(f"Player image added for {player_id}!")
                except aiohttp.ClientError as e:
                    print(f"Error occurred while fetching image for player {player_id}: {str(e)}")
            else:
                print(f"Player image with {player_id} already exists! Skipping insertion.")

async def start_db():
    while True:
        await create_players()
        await create_teams()
        # await create_team_info()
        await add_player_images()
        await asyncio.sleep(3600)