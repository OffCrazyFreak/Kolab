import {
  Backdrop,
  Box,
  Modal,
  FormControl,
  Fade,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormLabel,
  FormHelperText,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  PaidOutlined as PaidOutlinedIcon,
  Paid as PaidIcon,
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
  ShoppingBag as ShoppingBagIcon,
  SchoolOutlined as SchoolOutlinedIcon,
  School as SchoolIcon,
  GradeOutlined as GradeOutlinedIcon,
  Grade as GradeIcon,
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
  Repeat as RepeatIcon,
  Email as EmailIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Call as CallIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

import { LoadingButton } from "@mui/lab";

import { useState, useContext, useEffect } from "react";

import ToastContext from "../../context/ToastContext";

import CustomTextField from "./partial/CustomTextField";
import CustomAutocomplete from "./partial/CustomAutocomplete";

const statuses = [
  {
    value: "TODO",
    label: "Todo",
    icon: <AssignmentTurnedInIcon sx={{ color: "#666" }} />,
  },
  {
    value: "CONTACTED",
    label: "Contacted",
    icon: <CallIcon sx={{ color: "#666" }} />,
  },
  {
    value: "PING",
    label: "Pinged",
    icon: <RepeatIcon sx={{ color: "#666" }} />,
  },
  {
    value: "LETTER",
    label: "Offer sent",
    icon: <EmailIcon sx={{ color: "#666" }} />,
  },
  {
    value: "MEETING",
    label: "Meeting held",
    icon: <WorkIcon sx={{ color: "#666" }} />,
  },
  {
    value: "SUCCESSFUL",
    label: "Successful",
    icon: <AttachMoneyIcon sx={{ color: "#666" }} />,
  },
  {
    value: "UNSUCCESSFUL",
    label: "Unsuccessful",
    icon: <MoneyOffIcon sx={{ color: "#666" }} />,
  },
];

const categories = [
  {
    value: "FINANCIAL",
    label: "Financial",
    checked: <PaidIcon />,
    unchecked: <PaidOutlinedIcon />,
  },
  {
    value: "MATERIAL",
    label: "Material",
    checked: <ShoppingBagIcon />,
    unchecked: <ShoppingBagOutlinedIcon />,
  },
  {
    value: "ACADEMIC",
    label: "Academic",
    checked: <SchoolIcon />,
    unchecked: <SchoolOutlinedIcon />,
  },
];

export default function CollaborationForm({
  openModal,
  setOpenModal,
  fetchUpdatedData,

  object: collaboration,
  projectId,
  companyId,
}) {
  const { handleOpenToast } = useContext(ToastContext);

  const [existingProjects, setExistingProjects] = useState([]);
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [existingUsers, setExistingUsers] = useState([]);
  const [companyContacts, setCompanyContacts] = useState([]);

  const [loadingButton, setLoadingButton] = useState(false);

  const [formData, setFormData] = useState({
    entity: {
      projectId: null,
      companyId: null,
      responsibleId: null,
      status: statuses[0].value,
      contactId: null,
      category: null,
      achievedValue: 0,
      comment: null,
    },
    validation: {
      projectIdIsValid: false,
      companyIdIsValid: false,
      responsibleIdIsValid: false,
      statusIsValid: true,
      contactIdIsValid: false,
      categoryIsValid: false,
      achievedValueIsValid: true,
      commentIsValid: true,
    },
  });

  function updateCategory(prevData, category) {
    let updatedData = { ...prevData };

    let currentCategories = updatedData.entity.category
      ? updatedData.entity.category.split("_")
      : [];

    // Add the category if it's not already in the list
    if (!currentCategories.includes(category.value)) {
      currentCategories.push(category.value);
    } else {
      // Remove the category if it is
      const index = currentCategories.indexOf(category.value);
      currentCategories.splice(index, 1);
    }

    // Sort the categories to ensure consistent ordering.
    const categoryOrder = ["FINANCIAL", "MATERIAL", "ACADEMIC"];
    currentCategories = currentCategories.sort((a, b) => {
      return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
    });

    // Convert the list of categories back into the enum string format.
    let newCategoryEnum = currentCategories.join("_");

    // If the newCategoryEnum is empty, set it to null.
    if (newCategoryEnum === "") {
      newCategoryEnum = null;
    }

    // Validate if we have at least one category selected.
    const categoryIsValid = currentCategories.length > 0;

    updatedData.entity.category = newCategoryEnum;
    updatedData.validation.categoryIsValid = categoryIsValid;

    return updatedData; // return the updated data
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

        setExistingProjects(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching projects.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchExistingCompanies() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/companies", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setExistingCompanies(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching companies.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchExistingUsers() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setExistingUsers(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching companies.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchContacts(fetchCompanyId) {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const contactsResponse = await fetch(
        `/api/companies/${fetchCompanyId}/contacts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${JWToken.credential}` },
        }
      );

      if (contactsResponse.ok) {
        const contactsJson = await contactsResponse.json();
        setCompanyContacts(contactsJson);
      } else {
        handleOpenToast({
          type: "error",
          info: "Failed to fetch company contacts.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to fetch contacts.",
      });
    }
  }

  async function submit() {
    const isFormValid = Object.values(formData.validation).every(Boolean); // all validation rules are fulfilled

    if (!isFormValid) {
      handleOpenToast({
        type: "error",
        info: "Invalid collaboration details.",
      });
      return;
    }

    setLoadingButton(true);

    // object destructuring
    const {
      projectId,
      companyId,
      contactId,
      responsibleId,
      category,
      status,
      comment,
      achievedValue,
    } = formData.entity;

    const collaborationDTO = {
      ...formData.entity,
      comment: comment?.trim(),
    };

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    const request = {
      method: collaboration ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${JWToken.credential}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collaborationDTO),
    };

    const serverResponse = await fetch(
      `/api/collaborations${collaboration ? "/" + collaboration.id : ""}`,
      request
    );

    if (serverResponse.ok) {
      handleOpenToast({
        type: "success",
        info: `Collaboration ${collaboration ? "updated" : "added"}.`,
      });
      setOpenModal(false);
      fetchUpdatedData();
    } else if (serverResponse.status === 400) {
      handleOpenToast({
        type: "error",
        info: "Invalid collaboration details.",
      });
    } else if (serverResponse.status === 403) {
      handleOpenToast({
        type: "error",
        info: "Project member privileges are required for manipulating collaborations.",
      });
    } else if (serverResponse.status === 404) {
      handleOpenToast({
        type: "error",
        info: "Collaboration with id " + collaboration.id + " does not exist.",
      });
    } else {
      handleOpenToast({
        type: "error",
        info:
          "An unknown error occurred whilst trying to " +
          (collaboration ? "update" : "add") +
          " collaboration.",
      });
    }

    setLoadingButton(false);
  }

  useEffect(() => {
    // object destructuring
    const {
      project,
      company,
      responsible,
      status,
      contact,
      category,
      achievedValue,
      comment,
    } = collaboration || {};

    setFormData({
      entity: {
        projectId: collaboration ? project.id : projectId,
        companyId: collaboration ? company.id : companyId,
        responsibleId: collaboration ? responsible.id : null,
        status: collaboration ? status : statuses[0].value,
        contactId: collaboration ? contact.id : null,
        category: collaboration ? category : null,
        achievedValue: achievedValue,
        comment: comment,
      },
      validation: {
        projectIdIsValid: collaboration ? true : projectId ? true : false,
        companyIdIsValid: collaboration ? true : companyId ? true : false,
        responsibleIdIsValid: collaboration ? true : false,
        statusIsValid: true,
        contactIdIsValid: collaboration ? true : false,
        categoryIsValid: collaboration ? true : false,
        achievedValueIsValid: true,
        commentIsValid: true,
      },
    });

    fetchExistingProjects();
    fetchExistingCompanies();
    fetchExistingUsers();
  }, [openModal]);

  useEffect(() => {
    if (formData.entity.companyId) {
      fetchContacts(formData.entity.companyId);
    } else {
      setCompanyContacts([]);
    }
  }, [formData.entity.companyId]);

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
              {!collaboration ? "Add collaboration" : "Update collaboration"}
            </Typography>

            <Box
              sx={{
                overflowY: "auto",
              }}
            >
              <CustomAutocomplete
                options={existingProjects}
                entityKey="projectId"
                validationKey="projectIdIsValid"
                label="Project"
                formatter={(option) => option.name}
                disabledCondition={collaboration || projectId ? true : false}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomAutocomplete
                options={existingCompanies}
                entityKey="companyId"
                validationKey="companyIdIsValid"
                label="Company"
                formatter={(option) => option.name}
                disabledCondition={collaboration || companyId ? true : false}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomAutocomplete
                options={existingUsers}
                entityKey="responsibleId"
                validationKey="responsibleIdIsValid"
                label="Collaboration responsible"
                formatter={(option) => option.name + " " + option.surname}
                formData={formData}
                setFormData={setFormData}
              />

              <TextField
                label="Status"
                required
                fullWidth
                select
                margin="dense"
                helperText={
                  !formData.validation.statusIsValid && "Invalid status"
                }
                inputProps={{
                  name: "status",
                }}
                value={formData.entity.status}
                error={!formData.validation.statusIsValid}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  setFormData((prevData) => ({
                    entity: {
                      ...prevData.entity,
                      status: inputValue,
                    },
                    validation: {
                      ...prevData.validation,
                      statusIsValid: statuses.some(
                        (option) => option.value === inputValue
                      ),
                    },
                  }));
                }}
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Grid container spacing={1}>
                      <Grid item>{option.icon}</Grid>
                      <Grid item>
                        {/* better vertical alignment with typography */}
                        <Typography>{option.label}</Typography>
                      </Grid>
                    </Grid>
                  </MenuItem>
                ))}
              </TextField>

              <CustomAutocomplete
                options={companyContacts}
                entityKey="contactId"
                validationKey="contactIdIsValid"
                label="Contact in company"
                formatter={(option) => option.firstName + " " + option.lastName}
                disabledCondition={!formData.entity.companyId ? true : false}
                helperTextCondition={!formData.validation.companyIdIsValid}
                helperText="Select a company to change contact"
                formData={formData}
                setFormData={setFormData}
              />

              <FormControl fullWidth>
                <FormLabel component="legend" required sx={{ marginLeft: 1 }}>
                  Categories
                </FormLabel>
                <FormGroup
                  row
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category.label}
                      label={category.label}
                      control={
                        <Checkbox
                          checked={
                            formData.entity.category?.includes(
                              category.value
                            ) || false
                          }
                          icon={category.unchecked}
                          checkedIcon={category.checked}
                          onChange={(e) => {
                            // const isChecked = e.target.checked;

                            setFormData((prevData) => {
                              return updateCategory(prevData, category);
                            });
                          }}
                        />
                      }
                      sx={{ margin: 0 }}
                    />
                  ))}
                </FormGroup>
                <FormHelperText>Select at least one category</FormHelperText>
              </FormControl>

              <CustomTextField
                labelText={"Achieved value"}
                inputProps={{
                  name: "achievedValue",
                  minLength: 0,
                  maxLength: 5,
                }}
                helperText={{
                  error:
                    "Achieved value (if present) must be a number between 0 and 99999",
                  details:
                    "Value from this collaboration is summed towards the project goal",
                }}
                validationFunction={(input) => {
                  return (
                    (input !== null && input >= 0 && input <= 99999) ||
                    input.trim().length === 0
                  );
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Comment"}
                textFieldProps={{
                  multiline: true,
                  minRows: 2,
                  maxRows: 5,
                }}
                helperText={{
                  error: "Comment must be under 475 characters",
                  details: "",
                }}
                inputProps={{ name: "comment", maxLength: 475 }}
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
                <span>
                  {!collaboration
                    ? "Add collaboration"
                    : "Update collaboration"}
                </span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
