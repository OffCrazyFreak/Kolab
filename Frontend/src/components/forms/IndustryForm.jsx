import {
  Backdrop,
  Box,
  Modal,
  FormControl,
  Fade,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState, useContext, useEffect } from "react";

import ToastContext from "../../context/ToastContext";
import CustomTextField from "./partial/CustomTextField";

export default function IndustryForm({
  openModal,
  setOpenModal,
  fetchUpdatedData,
  object: industry,
}) {
  const { handleOpenToast } = useContext(ToastContext);
  const [loadingButton, setLoadingButton] = useState(false);

  const [formData, setFormData] = useState({
    entity: {
      name: null,
    },
    validation: {
      nameIsValid: false,
    },
  });

  async function submit() {
    const formIsValid = Object.values(formData.validation).every(Boolean);

    if (!formIsValid) {
      handleOpenToast({
        type: "error",
        info: "Invalid industry details.",
      });
      return;
    }

    setLoadingButton(true);

    const industryData = {
      name: formData.entity.name?.trim(),
    };

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    const request = {
      method: industry ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${JWToken.credential}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(industryData),
    };

    try {
      const serverResponse = await fetch(
        `/api/industries${industry ? `/${industry.id}` : ""}`,
        request
      );

      if (serverResponse.ok) {
        handleOpenToast({
          type: "success",
          info: `Industry ${industryData.name} ${
            industry ? "updated" : "created"
          }.`,
        });
        setOpenModal(false);
        fetchUpdatedData();
      } else if (serverResponse.status === 400) {
        handleOpenToast({
          type: "error",
          info: "Invalid industry details.",
        });
      } else if (serverResponse.status === 403) {
        handleOpenToast({
          type: "error",
          info: "Higher privileges are required for managing industries.",
        });
      } else if (serverResponse.status === 404) {
        handleOpenToast({
          type: "error",
          info: "Industry with id " + industry.id + " does not exist.",
        });
      } else {
        handleOpenToast({
          type: "error",
          info: `An unknown error occurred whilst trying to ${
            industry ? "update" : "create"
          } industry.`,
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }

    setLoadingButton(false);
  }

  useEffect(() => {
    setFormData({
      entity: {
        ...industry,
      },
      validation: {
        nameIsValid: industry ? true : false,
      },
    });
  }, [openModal]);

  return (
    <Backdrop open={openModal}>
      <Modal
        open={openModal}
        closeAfterTransition
        onKeyDown={(e) => {
          const formIsValid = Object.values(formData.validation).every(Boolean);

          if (e.key === "Enter" && formIsValid) {
            submit();
          }
        }}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Fade in={openModal}>
          <FormControl
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "95%",
              width: "30rem",
              maxHeight: "95%",
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
              {!industry ? "Add industry" : "Update industry"}
            </Typography>

            <Box
              sx={{
                overflowY: "auto",
              }}
            >
              <CustomTextField
                labelText="Industry name"
                isRequired
                placeholderText="Enter industry name"
                helperText={{
                  error: "Industry name must be between 2 and 35 characters",
                  details: "",
                }}
                inputProps={{
                  name: "name",
                  minLength: 2,
                  maxLength: 35,
                }}
                validationFunction={(input) => {
                  return input.trim().length >= 2 && input.trim().length <= 35;
                }}
                formData={formData}
                setFormData={setFormData}
              />
            </Box>

            <Box
              sx={{
                marginBlock: "3%",
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </Button>

              <LoadingButton
                variant="contained"
                onClick={submit}
                loading={loadingButton}
                disabled={Object.values(formData.validation).some(
                  (value) => !value
                )}
              >
                <span>{!industry ? "Add industry" : "Update industry"}</span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
