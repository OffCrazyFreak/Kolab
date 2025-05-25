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

export default function ContactForm({
  openModal,
  setOpenModal,
  fetchUpdatedData,

  object: contact,
  companyId,
}) {
  const { handleOpenToast } = useContext(ToastContext);

  const [loadingButton, setLoadingButton] = useState(false);

  const [formData, setFormData] = useState({
    entity: {
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      position: null,
    },
    validation: {
      firstNameIsValid: false,
      lastNameIsValid: false,
      emailIsValid: false,
      phoneIsValid: true,
      positionIsValid: false,
    },
  });

  async function submit() {
    const formIsValid = Object.values(formData.validation).every(Boolean); // all validation rules are fulfilled

    if (!formIsValid) {
      handleOpenToast({
        type: "error",
        info: "Invalid contact details.",
      });
      return;
    }

    setLoadingButton(true);

    // object destructuring
    const { firstName, lastName, email, phone, position } = formData.entity;

    const contactData = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      position: position?.trim(),
    };

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    const request = {
      method: contact ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${JWToken.credential}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    };

    const serverResponse = await fetch(
      `/api/companies/${companyId}/contacts${contact ? "/" + contact.id : ""}`,
      request
    );

    if (serverResponse.ok) {
      handleOpenToast({
        type: "success",
        info: `Contact ${contactData.firstName} ${contactData.lastName} ${
          contact ? "updated" : "added"
        }.`,
      });
      setOpenModal(false);
      fetchUpdatedData();
    } else if (serverResponse.status === 400) {
      handleOpenToast({
        type: "error",
        info: "Invalid contact details.",
      });
    } else if (serverResponse.status === 403) {
      handleOpenToast({
        type: "error",
        info: "Project member privileges are required for manipulating contact.",
      });
    } else if (serverResponse.status === 404) {
      handleOpenToast({
        type: "error",
        info: "Contact with id " + contact.id + " does not exist.",
      });
    } else {
      handleOpenToast({
        type: "error",
        info:
          "An unknown error occurred whilst trying to " +
          (contact ? "update" : "add") +
          " contact.",
      });
    }

    setLoadingButton(false);
  }

  useEffect(() => {
    setFormData({
      entity: {
        ...contact,
      },
      validation: {
        firstNameIsValid: contact ? true : false,
        lastNameIsValid: contact ? true : false,
        emailIsValid: contact ? true : false,
        phoneIsValid: true,
        positionIsValid: contact ? true : false,
      },
    });
  }, [openModal]);

  return (
    <Backdrop open={openModal}>
      <Modal
        open={openModal}
        closeAfterTransition
        // submit on Enter key
        onKeyDown={(e) => {
          const formIsValid = Object.values(formData.validation).every(Boolean);

          if (e.key === "Enter" && formIsValid) {
            submit();
          }
        }}
        // close on Escape key
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
              {!contact ? "Add contact" : "Update contact"}
            </Typography>

            <Box
              sx={{
                overflowY: "auto",
              }}
            >
              <CustomTextField
                labelText={"First name"}
                isRequired
                placeholderText={"Jane"}
                helperText={{
                  error: "First name must be between 2 and 35 characters",
                  details: "",
                }}
                inputProps={{
                  name: "firstName",
                  minLength: 2,
                  maxLength: 35,
                }}
                validationFunction={(input) => {
                  return input.trim().length >= 2 && input.trim().length <= 35;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Last name"}
                isRequired
                placeholderText={"Doe"}
                helperText={{
                  error: "Last name must be between 2 and 35 characters",
                  details: "",
                }}
                inputProps={{ name: "lastName", minLength: 2, maxLength: 35 }}
                validationFunction={(input) => {
                  return input.trim().length >= 2 && input.trim().length <= 35;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Email"}
                isRequired
                placeholderText={"jane.doe@gmail.com"}
                helperText={{
                  error: "Invalid email or email length",
                  details: "",
                }}
                inputProps={{
                  name: "email",
                  minLength: 6,
                  maxLength: 55,
                }}
                validationFunction={(input) => {
                  const mailFormat =
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                  return (
                    input.trim().length >= 6 &&
                    input.trim().length <= 55 &&
                    input.trim().match(mailFormat)
                  );
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Phone"}
                placeholderText={"+385987654321"}
                helperText={{
                  error: "Invalid phone or phone length",
                  details: "",
                }}
                inputProps={{
                  name: "phone",
                  minLength: 6,
                  maxLength: 55,
                }}
                validationFunction={(input) => {
                  const telFormat =
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;
                  return (
                    input.trim().length >= 6 &&
                    input.trim().length <= 55 &&
                    input.trim().match(telFormat)
                  );
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Position"}
                isRequired
                placeholderText={"PR"}
                helperText={{
                  error: "Position must be under 35 characters",
                  details: "",
                }}
                inputProps={{
                  name: "position",
                  maxLength: 35,
                }}
                validationFunction={(input) => {
                  return input.trim().length <= 35;
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
                {/* span needed because of bug */}
                <span>{!contact ? "Add contact" : "Update contact"}</span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
