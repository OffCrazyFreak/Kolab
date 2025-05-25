import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material/";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import "./Header.css";

import UserContext from "../context/UserContext";
import ToastContext from "../context/ToastContext";

export default function Header({ setUserIsLoggedIn }) {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const { handleOpenToast } = useContext(ToastContext);

  function logoutUser() {
    localStorage.removeItem("loginInfo");

    handleOpenToast({
      type: "info",
      info: "Logout successful.",
    });

    setUserIsLoggedIn(false);
  }

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ zIndex: "1000" }}>
        <Container maxWidth="false">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
              <Tooltip title="Open app menu">
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>

              <Menu
                className="mobile-nav-menu"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", sm: "none" },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/">Kolab</Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/projects">Projects</Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/companies">Companies</Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/users">Users</Link>
                </MenuItem>
              </Menu>
            </Box>

            <Box
              className="desktop-nav"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "flex" },
                gap: "min(2%, 1rem)",
              }}
            >
              <Link to="/" underline="hover">
                Kolab
              </Link>
              <Link to="/projects" underline="hover">
                Projects
              </Link>
              <Link to="/companies" underline="hover">
                Companies
              </Link>
              <Link to="/users" underline="hover">
                Users
              </Link>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Link
                  className="secondary-nav-link"
                  to={"/users/" + user?.id}
                  underline="hover"
                >
                  {!user
                    ? "Unknown user"
                    : user.nickname
                    ? user.nickname
                    : user.name + " " + user.surname}
                </Link>

                <Tooltip title="Open account menu">
                  <ExpandMoreIcon
                    onClick={handleOpenUserMenu}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>

              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* TODO:
                 <MenuItem onClick={handleCloseUserMenu}>
                  <Button
                    variant="text"
                    startIcon={<SettingsIcon />}
                    sx={{ color: "#333" }}
                  >
                    Settings
                  </Button>
                </MenuItem> */}

                <MenuItem onClick={(handleCloseUserMenu, logoutUser)}>
                  <Button
                    variant="text"
                    startIcon={<LogoutIcon />}
                    sx={{ color: "#333" }}
                  >
                    Logout
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Outlet />
    </>
  );
}
