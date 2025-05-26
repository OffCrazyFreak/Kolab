import {
  Backdrop,
  Modal,
  Fade,
  Button,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState, useContext, useEffect } from "react";

import ToastContext from "../../context/ToastContext";

import CustomTextField from "./partial/CustomTextField";

const authorizations = [
  {
    value: "USER",
    label: "User",
  },
  {
    value: "ADMINISTRATOR",
    label: "Administrator",
  },
];

export default function UserForm({
  openModal,
  setOpenModal,
  fetchUpdatedData,

  object: user,
}) {
  const { handleOpenToast } = useContext(ToastContext);

  const [loadingButton, setLoadingButton] = useState(false);

  const [formData, setFormData] = useState({
    entity: {
      name: null,
      surname: null,
      nickname: null,
      email: null,
      authorization: authorizations[0].value,
      description: null,
    },
    validation: {
      // optional and predefined fields are valid by default
      nameIsValid: false,
      surnameIsValid: false,
      nicknameIsValid: false,
      emailIsValid: false,
      authorizationIsValid: true,
      descriptionIsValid: true,
    },
  });

  async function submit() {
    const formIsValid = Object.values(formData.validation).every(Boolean); // all validation rules are fulfilled

    if (!formIsValid) {
      handleOpenToast({
        type: "error",
        info: "Invalid user details.",
      });
      return;
    }

    setLoadingButton(true);

    // object destructuring
    const { name, surname, nickname, email, authorization, description } =
      formData.entity;

    const userData = {
      name: name?.trim(),
      surname: surname?.trim(),
      nickname: nickname?.trim(),
      email: email?.trim(),
      authorization: authorization?.trim().toUpperCase(),
      description: description?.trim(),
    };

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    const request = {
      method: user ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${JWToken.credential}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    const serverResponse = await fetch(
      `/api/users${user ? "/" + user.id : ""}`,
      request
    );

    if (serverResponse.ok) {
      handleOpenToast({
        type: "success",
        info: `User ${userData.name} ${userData.surname} ${
          user ? "updated" : "added"
        }.`,
      });
      setOpenModal(false);
      fetchUpdatedData();
    } else if (serverResponse.status === 400) {
      handleOpenToast({
        type: "error",
        info: "Invalid user details.",
      });
    } else if (serverResponse.status === 403) {
      handleOpenToast({
        type: "error",
        info: "Administrator privileges are required for manipulating users.",
      });
    } else if (serverResponse.status === 404) {
      handleOpenToast({
        type: "error",
        info: "User with id " + user.id + " does not exist.",
      });
    } else {
      handleOpenToast({
        type: "error",
        info:
          "An unknown error occurred whilst trying to " +
          (user ? "update" : "add") +
          " user.",
      });
    }

    setLoadingButton(false);
  }

  useEffect(() => {
    // object destructuring
    const { name, surname, nickname, email, authorization, description } =
      user || {};

    setFormData({
      entity: {
        name: name,
        surname: surname,
        nickname: nickname,
        email: email,
        authorization: user ? authorization : authorizations[0].value,
        description: description,
      },
      validation: {
        nameIsValid: user ? true : false,
        surnameIsValid: user ? true : false,
        nicknameIsValid: user ? true : false,
        emailIsValid: user ? true : false,
        authorizationIsValid: true,
        descriptionIsValid: true,
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
              {!user ? "Add user" : "Update user"}
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

              <CustomTextField
                labelText={"Last name"}
                isRequired
                placeholderText={"Doe"}
                helperText={{
                  error: "Last name must be between 2 and 35 characters",
                  details: "",
                }}
                inputProps={{ name: "surname", minLength: 2, maxLength: 35 }}
                validationFunction={(input) => {
                  return input.trim().length >= 2 && input.trim().length <= 35;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Nickname"}
                isRequired
                placeholderText={"JD"}
                helperText={{
                  error: "Nickname must be between 2 and 35 characters",
                  details: "",
                }}
                inputProps={{
                  name: "nickname",
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
                labelText={"Email"}
                isRequired
                placeholderText={"jane.doe@gmail.com"}
                helperText={{
                  error: "Invalid email or email length",
                  details:
                    "Login access to Kolab will be granted through this email",
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

              <TextField
                label="Authorization level"
                required
                fullWidth
                select
                margin="dense"
                helperText={
                  !formData.validation.authorizationIsValid &&
                  "Invalid authorization level"
                }
                inputProps={{
                  name: "authorization",
                }}
                value={formData.entity.authorization}
                error={!formData.validation.authorizationIsValid}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  setFormData((prevData) => ({
                    entity: {
                      ...prevData.entity,
                      authorization: inputValue,
                    },
                    validation: {
                      ...prevData.validation,
                      authorizationIsValid: authorizations.find(
                        (option) => option.value === inputValue
                      ),
                    },
                  }));
                }}
              >
                {authorizations.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    // TODO: auth level can only be changed to a higher level when project responsible or member
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <CustomTextField
                labelText={"Description"}
                textFieldProps={{
                  multiline: true,
                  minRows: 2,
                  maxRows: 5,
                }}
                helperText={{
                  error: "Description must be under 475 characters",
                  details: "",
                }}
                inputProps={{ name: "description", maxLength: 475 }}
                validationFunction={(input) => {
                  return input.trim().length <= 475;
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
                <span>{!user ? "Add user" : "Update user"}</span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
