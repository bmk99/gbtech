import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  
  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",  // Fixed typo: space-between
          }}
        >
          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            // sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}

          {/* Header Text with Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Photos */}
            
            {/* Link to All Files */}
            <Link
              to="/allfiles"
              style={{ textDecoration: "none" }}
            >
              <Typography
                variant="h6"
                color="white"
                component="div"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: "blue",  // Hover effect
                  },
                }}
              >
                All Files
              </Typography>
            </Link>

            {/* Link to Shared Files */}
            <Link
              to="/sharedfiles"
              style={{ textDecoration: "none" }}
            >
              <Typography
                variant="h6"
                color="white"
                component="div"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: "blue",  // Hover effect
                  },
                }}
              >
                Shared Files
              </Typography>
            </Link>

            {/* Logout Button */}
            <Typography
              variant="h6"
              color="white"
              component="div"
              onClick={handleLogout}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  color: "blue",  // Hover effect
                },
              }}
            >
              Logout
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
