import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { TextField, Grid } from "@mui/material";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const TeamSearch = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedTeam, setSearchedTeam] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = React.useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [checked, setChecked] = useState(true);

  const handleRowClick = (params) => {
    setMessage(`Team "${params.row.full_name}" clicked`);
    const teamID = params.row.id;
    const imageUrl = `https://cdn.nba.com/logos/nba/${teamID}/primary/L/logo.svg`;
    const defaultImageUrl =
      "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png";
    setSelectedImage(imageUrl);
    const img = new Image();
    img.src = imageUrl;
    img.onerror = () => {
      setSelectedImage(defaultImageUrl);
    };
  };
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const fetchTeams = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/all_teams`);

      setTeams(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  const fetchSearchedTeams = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/teams/${searchedTeam}`
      );
      setTeams(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchedTeam]);

  useEffect(() => {
    if (searchedTeam) {
      fetchSearchedTeams().then(() => setIsLoading(false));
    } else {
      fetchTeams().then(() => setIsLoading(false));
    }
  }, [currentPage, searchedTeam]);

  const handleSearchChange = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchedValue = event.target.value;
      setSearchedTeam(searchedValue);
      setCurrentPage(1);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const columns = [
    { field: "id", headerName: "Team ID", width: 150 },
    { field: "full_name", headerName: "Team Name", width: 200 },
    { field: "abbreviation", headerName: "Abbreviation", width: 150 },
    { field: "nickname", headerName: "Nickname", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    { field: "state", headerName: "State", width: 150 },
    { field: "year_founded", headerName: "Year Founded", width: 200 },
  ];

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <h1>Team Search</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ height: "100%", width: "100%" }}>
            <TextField
              id="standard"
              type="text"
              placeholder="Search Teams"
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
              rows={teams}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              onRowClick={handleRowClick}
              {...teams}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          {selectedImage && (
            <div>
              <img src={selectedImage} alt="Team" style={{ width: "500px", height: "800px" }}/>
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

export default TeamSearch;
