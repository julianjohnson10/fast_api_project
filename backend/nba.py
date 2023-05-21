from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.endpoints import playercareerstats, playerindex
import pandas as pd
from nba_api.stats.static import players

allplayers = players.get_players()
print(allplayers)
# games.get_dict()