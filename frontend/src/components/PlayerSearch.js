import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { TextField, Grid } from "@mui/material";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const label = { inputProps: { "aria-label": "Switch demo" } };

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedPlayer, setSearchedPlayer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(true);
  const [selectedImage, setSelectedImage] = useState(""); // State to hold the selected image URL

  const handleRowClick = (params) => {
    setMessage(`Player "${params.row.full_name}" clicked`);
    const playerId = params.row.id;
    const imageUrl = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/${playerId}.png`;
    const defaultImageUrl =
      "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png";
    setSelectedImage(imageUrl);
    const img = new Image();
    img.src = imageUrl;
    img.onerror = () => {
      setSelectedImage(defaultImageUrl);
    };
  };

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/all_players");

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

  const handleChange = (event) => {
    setChecked(event.target.checked);
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ height: "100%", width: "100%" }}>
            <TextField
              id="standard"
              type="text"
              placeholder="Search Players"
              onKeyDown={handleSearchChange}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Historic Players"
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
        </Grid>
        <Grid item xs={6}>
          {selectedImage && (
            <div>
              <img src={selectedImage} alt="Player" />
            </div>
          )}
        </Grid>
      </Grid>
      <Box sx={{ width: "100%", paddingTop: 30 }}>
        {message && <Alert severity="info">{message}</Alert>}
      </Box>
    </Stack>
  );
};

export default PlayerSearch;
