import {
  Backdrop,
  Modal,
  Fade,
  Button,
  TextField,
  Autocomplete,
  MenuItem,
  Typography,
  FormControl,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState, useContext, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import UserContext from "../../context/UserContext";
import ToastContext from "../../context/ToastContext";

import TextInput from "./partial/TextInput";

const projectTypes = [
  {
    value: "External",
    label: "External",
  },
  {
    value: "Internal",
    label: "Internal",
  },
];

export default function ProjectForm({
  object: project,
  openModal,
  setOpenModal,
  fetchUpdatedData,
}) {
  const { user } = useContext(UserContext);
  const { handleOpenToast } = useContext(ToastContext);

  const [existingUsers, setExistingUsers] = useState([]);
  const [existingProjects, setExistingProjects] = useState([]);
  const [existingCategories, setExistingCategories] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  const [name, setName] = useState();
  const [categoryId, setCategoryId] = useState();
  const [type, setType] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [responsibleId, setResponsibleId] = useState();
  const [goal, setGoal] = useState();

  const [nameIsValid, setNameIsValid] = useState();
  const [categoryIdIsValid, setCategoryIdIsValid] = useState();
  const [typeIsValid, setTypeIsValid] = useState();
  const [startDateIsValid, setStartDateIsValid] = useState();
  const [endDateIsValid, setEndDateIsValid] = useState();
  const [responsibleIdIsValid, setResponsibleIdIsValid] = useState();
  const [goalIsValid, setGoalIsValid] = useState();

  async function fetchExistingUsers() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json);
        setExistingUsers(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching users for Project responsible input field.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchExistingProjects() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/projects", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json);
        setExistingProjects(json);
      } else {
        console.log(serverResponse);
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching projects for Category input field.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchExistingCategories() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/categories", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();
        setExistingCategories(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching categories.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function submit() {
    if (
      !nameIsValid ||
      !categoryIdIsValid ||
      !typeIsValid ||
      !startDateIsValid ||
      !responsibleIdIsValid ||
      !goalIsValid
    ) {
      return;
    }

    setLoadingButton(true);
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;
    const projectData = {
      name: name.trim(),
      categoryId: categoryId.trim(), // Changed from category to categoryId
      type: type.trim().toUpperCase(),
      startDate: startDate,
      endDate: endDate,
      responsibleId: responsibleId, // Changed from idResponsible
      goal: goal !== "" ? goal : null,
    };

    const request = {
      method: project ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${JWToken.credential}`, // Updated to use Bearer token
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    };

    const serverResponse = await fetch(
      `/api/projects${project ? "/" + project.id : ""}`,
      request
    );

    if (serverResponse.ok) {
      handleOpenToast({
        type: "success",
        info:
          "Project " +
          projectData.name +
          " " +
          (project ? "updated" : "added") +
          ".",
      });

      setOpenModal(false);
      fetchUpdatedData();
    } else if (serverResponse.status === 400) {
      handleOpenToast({
        type: "error",
        info: "Invalid project details.",
      });
    } else if (serverResponse.status === 403) {
      handleOpenToast({
        type: "error",
        info: "Moderator privileges are required for manipulating projects.",
      });
    } else if (serverResponse.status === 404) {
      handleOpenToast({
        type: "error",
        info: "Project with id " + project.id + " does not exist.",
      });
    } else {
      handleOpenToast({
        type: "error",
        info:
          "An unknown error occurred whilst trying to " +
          (project ? "update" : "add") +
          " project.",
      });
    }

    setLoadingButton(false);
  }

  useEffect(() => {
    setName(project?.name);
    setCategoryId(project?.category?.id);
    setType(
      project?.type?.charAt(0) + project?.type?.slice(1).toLowerCase() ||
        projectTypes[0].value
    );
    setStartDate(project ? moment(project.startDate) : moment());
    setEndDate(project ? moment(project.endDate) : moment().add(6, "months"));
    setResponsibleId(project?.responsible?.id);
    setGoal(project?.goal);

    // optional and predefined fields are always valid
    setNameIsValid(project ? true : false);
    setCategoryIdIsValid(project ? true : false);
    setTypeIsValid(true);
    setStartDateIsValid(true);
    setEndDateIsValid(true);
    setResponsibleIdIsValid(project ? true : false);
    setGoalIsValid(true);

    fetchExistingUsers();
    fetchExistingProjects();
    fetchExistingCategories();
  }, [openModal]);

  return (
    <Backdrop open={openModal}>
      <Modal
        open={openModal}
        closeAfterTransition
        // submit on Enter key
        onKeyDown={(e) => {
          // TODO: replace when this form is refractored
          // const formIsValid = Object.values(formData.validation).every(Boolean);

          // if (e.key === "Enter" && formIsValid) {
          //   submit();
          // }
          if (e.key === "Enter") {
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
              {!project ? "Add project" : "Update project"}
            </Typography>

            <Box
              sx={{
                overflowY: "auto",
              }}
            >
              <TextInput
                labelText={"Project name"}
                placeholderText={"Severus"}
                isRequired
                helperText={{
                  error: "Project name must be between 2 and 35 characters",
                  details: "",
                }}
                inputProps={{ minLength: 2, maxLength: 35 }}
                validationFunction={(input) => {
                  return input.length >= 2 && input.length <= 35;
                }}
                value={name}
                setValue={setName}
                valueIsValid={nameIsValid}
                setValueIsValid={setNameIsValid}
              />

              <Autocomplete
                options={existingCategories}
                clearOnEscape
                openOnFocus
                value={
                  existingCategories.find((cat) => cat.id === categoryId) ||
                  null
                }
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                onChange={(e, inputValue) => {
                  setCategoryId(inputValue?.id);
                  setCategoryIdIsValid(
                    existingCategories
                      .map((option) => option.id)
                      .includes(inputValue?.id)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              />

              <TextField
                label="Project type"
                required
                fullWidth
                select
                margin="dense"
                helperText={!typeIsValid && "Invalid project type"}
                value={type}
                error={!typeIsValid}
                onChange={(e) => {
                  const input = e.target.value;
                  if (
                    input === projectTypes[0].value ||
                    input === projectTypes[1].value
                  ) {
                    setTypeIsValid(true);
                  } else {
                    setTypeIsValid(false);
                  }

                  setType(input);
                }}
              >
                {projectTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <DatePicker
                label="Start date"
                displayWeekNumber
                format="DD.MM.YYYY."
                minDate={moment("1980-01-01")}
                maxDate={moment().add(2, "years")}
                value={startDate}
                onChange={(date) => {
                  const input = date;
                  if (
                    input.isAfter(moment("1980-01-01")) &&
                    input.isBefore(moment().add(2, "years"))
                  ) {
                    setStartDateIsValid(true);
                  } else {
                    setStartDateIsValid(false);
                  }

                  setStartDate(input);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    margin: "dense",
                    helperText: !startDateIsValid && "Invalid start date",
                    error: !startDateIsValid,
                  },
                }}
              />
              <DatePicker
                label="End date"
                displayWeekNumber
                format="DD.MM.YYYY."
                minDate={startDate}
                maxDate={moment().add(2, "years")}
                value={endDate}
                onChange={(date) => {
                  const input = date;
                  if (
                    input.isAfter(startDate) &&
                    input.isBefore(moment().add(2, "years"))
                  ) {
                    setEndDateIsValid(true);
                  } else {
                    setEndDateIsValid(false);
                  }

                  setEndDate(input);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    margin: "dense",
                    helperText: !endDateIsValid && "Invalid end date",
                    error: !endDateIsValid,
                  },
                }}
              />

              <Autocomplete
                options={existingUsers}
                clearOnEscape
                openOnFocus
                value={
                  existingUsers.find((u) => u.id === responsibleId) || null
                }
                getOptionLabel={(option) => option.name + " " + option.surname}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    (option.name + " " + option.surname)
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
                }
                onChange={(e, inputValue) => {
                  setResponsibleId(inputValue?.id);
                  setResponsibleIdIsValid(
                    existingUsers
                      .map((option) => option.id)
                      .includes(inputValue?.id)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project responsible"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              />

              <TextInput
                labelText={"Goal"}
                inputType={"number"}
                placeholderText={"10000"}
                helperText={{
                  error: "Goal (if present) must be between 1 and 999999",
                  details: "",
                }}
                inputProps={{
                  min: 1,
                  max: 999999,
                  minLength: 1,
                  maxLength: 6,
                }}
                validationFunction={(input) => {
                  return (
                    input === null ||
                    input === "" ||
                    (input >= 1 &&
                      input <= 999999 &&
                      input.length >= 1 &&
                      input.length <= 6)
                  );
                }}
                value={goal}
                setValue={setGoal}
                valueIsValid={goalIsValid}
                setValueIsValid={setGoalIsValid}
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
                disabled={
                  !(
                    nameIsValid &&
                    categoryIdIsValid &&
                    startDateIsValid &&
                    endDateIsValid &&
                    responsibleIdIsValid &&
                    goalIsValid
                  )
                }
                // TODO: replace when this form is refractored
                // disabled={Object.values(formData.validation).some(
                //   (value) => !value
                // )}
              >
                {/* span needed because of bug */}
                <span>{!project ? "Add project" : "Update project"}</span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
