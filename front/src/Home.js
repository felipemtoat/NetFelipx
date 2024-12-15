import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import Filmes from "./Filmes";
import Series from "./Series";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Filmes");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Box sx={{ width: "100%", backgroundColor: "#282828", display: "flex" }}>
        <AppBar position="fixed" sx={{ backgroundColor: "#282828" }}>
          <Toolbar>
            <MovieIcon sx={{ color: "lightgrey", mr: 2 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "#e63737" }}
            >
              NetFelipx
            </Typography>
            <Button
              color="inherit"
              sx={{ color: "lightgrey" }}
              onClick={() => handleTabClick("Filmes")}
            >
              Filmes
            </Button>
            <Button
              color="inherit"
              sx={{ color: "lightgrey" }}
              onClick={() => handleTabClick("Séries")}
            >
              Séries
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ ml: "40px", mr: "40px", mt: "100px" }}>
        {activeTab === "Filmes" && <Filmes />}
        {activeTab === "Séries" && <Series />}
      </Box>
    </div>
  );
};

export default Home;
