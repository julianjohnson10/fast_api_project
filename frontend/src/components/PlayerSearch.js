import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedPlayer, setSearchedPlayer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = React.useState("");

  const handleRowClick = (params) => {
    setMessage(`Player "${params.row.full_name}" clicked`);
  };

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/all_players`);

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
        `http://localhost:8000/players/${searchedPlayer}`
      );
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
  }, [currentPage, searchedPlayer]);

  const handleSearchChange = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchedValue = event.target.value;
      setSearchedPlayer(searchedValue);
      setCurrentPage(1);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const columns = [
    { field: "id", headerName: "Player ID", width: 150 },
    { field: "full_name", headerName: "Player Name", width: 200 },
    { field: "first_name", headerName: "First Name", width: 150 },
    { field: "last_name", headerName: "Last Name", width: 150 },
    { field: "is_active", headerName: "Is Active?", width: 150 },
  ];

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <h1>Player Search</h1>
      <Box sx={{ height: 600, width: "100%" }}>
        <TextField
          id="standard"
          type="text"
          placeholder="Search Players"
          onKeyDown={handleSearchChange}
        />
        <DataGrid
          rows={players}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          onRowClick={handleRowClick}
          {...players}
        />
      </Box>
      <Box sx={{ width: "100%", 'paddingTop': 30 }}>{message && <Alert severity="info">{message}</Alert>}</Box>
    </Stack>
  );
};

export default PlayerSearch;
