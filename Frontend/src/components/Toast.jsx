import { Snackbar, Alert as MuiAlert } from "@mui/material";

import { useContext, forwardRef } from "react";

import ToastContext from "../context/ToastContext";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Toast() {
  const { toastOpen, toastMessage, handleCloseToast } =
    useContext(ToastContext);

  return (
    <>
      <Snackbar
        open={toastOpen}
        sx={{ maxWidth: "480px" }}
        autoHideDuration={
          toastMessage?.type === "success"
            ? 1500
            : toastMessage?.type === "info"
            ? 1500
            : toastMessage?.type === "warning"
            ? 3000
            : toastMessage?.type === "error"
            ? 5000
            : null
        }
        onClose={handleCloseToast}
      >
        <Alert onClose={handleCloseToast} severity={toastMessage?.type}>
          {toastMessage?.info}
        </Alert>
      </Snackbar>
    </>
  );
}
