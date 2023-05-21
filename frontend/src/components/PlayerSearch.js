import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedPlayer, setSearchedPlayer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePlayers, setHasMorePlayers] = useState(true);

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/players?page=${currentPage}`
      );
      if (response.data.length < 100) {
        setHasMorePlayers(false);
      } else {
        setHasMorePlayers(true);
      }
      setPlayers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  const fetchSearchedPlayers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/players/${searchedPlayer}?page=${currentPage}`
      );
      if (response.data.length < 100) {
        setHasMorePlayers(false);
      } else {
        setHasMorePlayers(true);
      }
      setPlayers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchedPlayer]);

  useEffect(() => {
    if (searchedPlayer) {
      fetchSearchedPlayers().then(() => setIsLoading(false));
    } else {
      fetchPlayers().then(() => setIsLoading(false));
    }
  }, [currentPage, searchedPlayer, fetchPlayers, fetchSearchedPlayers]);

  const handleSearchChange = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchedValue = event.target.value;
      setSearchedPlayer(searchedValue);
      setCurrentPage(1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Player Search</h1>

      <Box
        component="form"
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard"
          type="text"
          placeholder="Search Players"
          onKeyDown={handleSearchChange}
        />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {players.map((player) => (
          <Box
            sx={{ width: "100%", bgcolor: "background.paper" }}
          >
            <nav aria-label="main mailbox folders">
              <List>
                <ListItem disablePadding key={player.id}>
                  <ListItemButton>
                    <ListItemText primary={player.full_name} />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </Box>
          // <Card
          //   className="card"
          //   key={player.id}
          //   sx={{ minWidth: 275, margin: 1 }}
          //   onClick={() =>
          //     alert(
          //       player.full_name +
          //         "\n" +
          //         player.first_name +
          //         "\n" +
          //         player.last_name
          //     )
          //   }
          // >
          //   <CardContent>
          //     <Typography variant="h5" component="div">
          //       Full Name: {player.full_name}
          //     </Typography>
          //     <Typography sx={{ mb: 1.5 }} color="text.secondary">
          //       First Name: {player.first_name}
          //     </Typography>
          //     <Typography variant="body2">Last Name: {player.last_name}</Typography>
          //   </CardContent>
          // </Card>
        ))}
      </Box>
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev Page
        </button>
        <button onClick={handleNextPage} disabled={!hasMorePlayers}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default PlayerSearch;
