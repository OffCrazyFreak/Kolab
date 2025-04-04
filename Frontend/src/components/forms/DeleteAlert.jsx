import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState, useContext } from "react";

import ToastContext from "../../context/ToastContext";
import DeleteAlertContext from "../../context/DeleteAlertContext";

export default function DeleteAlert() {
  const { handleOpenToast } = useContext(ToastContext);
  const {
    openDeleteAlert,
    setOpenDeleteAlert,
    object,
    endpoint,
    fetchUpdatedData,
  } = useContext(DeleteAlertContext);

  const [loadingButton, setLoadingButton] = useState(false);

  async function submit() {
    setLoadingButton(true);

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    let serverResponse = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        googleTokenEncoded: JWToken.credential,
      },
    });

    if (serverResponse.ok) {
      // any 2xy status code
      handleOpenToast({
        type: "success",
        info: object?.type + " " + object?.name + " deleted.",
      });

      fetchUpdatedData.function();
      setOpenDeleteAlert(false);
    } else if (serverResponse.status === 403) {
      handleOpenToast({
        type: "error",
        info:
          "Higher privileges are required for deleting a " +
          object?.type.toLowerCase() +
          ".",
      });
    } else if (serverResponse.status === 404) {
      handleOpenToast({
        type: "error",
        info: object?.type + " " + object?.name + " does not exist.",
      });

      fetchUpdatedData.function();
      setOpenDeleteAlert(false);
    } else {
      handleOpenToast({
        type: "error",
        info:
          "An unknown error accured whilst trying to delete " +
          object?.type.toLowerCase() +
          object?.name +
          ".",
      });
    }

    setLoadingButton(false);
  }

  return (
    <Backdrop open={openDeleteAlert}>
      <Modal
        open={openDeleteAlert}
        closeAfterTransition
        // submit on Enter key
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        // close on Escape key
        onClose={() => {
          setOpenDeleteAlert(false);
        }}
      >
        <Fade in={openDeleteAlert}>
          <FormControl
            sx={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",

              maxWidth: "95%",
              width: "30rem",

              maxHeight: "95%",
              overflowY: "auto",

              borderRadius: "1.5rem",
              padding: "1rem",

              backgroundColor: "whitesmoke",
              boxShadow: "#666 2px 2px 8px",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              {"Delete " + object?.type}
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              sx={{
                minHeight: "5rem",
              }}
            >
              {"Are you sure you want to delete " +
                object?.type.toLowerCase() +
                " " +
                object?.name +
                "?"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenDeleteAlert(false);
                }}
              >
                Cancel
              </Button>

              <LoadingButton
                variant="contained"
                onClick={submit}
                loading={loadingButton}
              >
                {/* span needed because of bug */}
                <span>{"Delete " + object?.type}</span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
