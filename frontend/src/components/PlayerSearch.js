import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedPlayer, setSearchedPlayer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePlayers, setHasMorePlayers] = useState(true);
  const [rows, setRows] = useState("10");

  const handleChange = (event) => {
    const selectedRows = event.target.value;
    setRows(selectedRows);
    setCurrentPage(1);
  };

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/players?page=${currentPage}&batch_size=${rows}`
      );
      if (response.data.length < parseInt(rows)) {
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
  }, [currentPage, rows]);

  const fetchSearchedPlayers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/players/${searchedPlayer}?page=${currentPage}&batch_size=${rows}`
      );
      if (response.data.length < parseInt(rows)) {
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
  }, [currentPage, searchedPlayer, rows]);

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
        sx={{ width: "100%", bgcolor: "background.paper",display:"flex", justifyContent: "space-between",}}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard"
          type="text"
          placeholder="Search Players"
          onKeyDown={handleSearchChange}
        />

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Rows Shown</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={rows}
            label="Rows Shown"
            onChange={handleChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {players.map((player) => (
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
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