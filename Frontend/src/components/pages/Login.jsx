import { useEffect } from "react";

import { Typography, Box, CircularProgress } from "@mui/material";

export default function Login({ loginUser, loading }) {
  function handleCallbackResponse(response) {
    loginUser(response);
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "752759618287-1lja8mifkd72vo7250c2e9rl0b18mkic.apps.googleusercontent.com",
      callback: handleCallbackResponse,

      // TODO: use redirect instead of popup
      // ux_mode: "redirect",
    });

    google.accounts.id.renderButton(
      document.getElementById("signInWithGoogleButton"),
      {
        type: "icon",
        theme: "outline",
        size: "large",
        shape: "pill",
      }
    );

    google.accounts.id.prompt();
  }, []);

  return (
    <Box
      sx={{
        height: "100%",

        display: loading ? "none" : "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h2" align="center" gutterBottom>
        Kolab
      </Typography>
      <Typography variant="h4" align="center" gutterBottom>
        Login with your google account to proceed:
      </Typography>

      <Box
        sx={{
          transform: "scale(1.75)",
          margin: 2,
        }}
        id="signInWithGoogleButton"
      ></Box>
    </Box>
  );
}
