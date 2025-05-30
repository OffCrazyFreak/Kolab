import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material/";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ToastContext from "../../context/ToastContext";
import DeleteAlertContext from "../../context/DeleteAlertContext";

import CollaborationForm from "../forms/CollaborationForm";
import UserForm from "../forms/UserForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

const tableColumns = [
  {
    key: "project",
    label: "Project name",
  },
  {
    key: "company",
    label: "Company name",
  },
  {
    key: "responsible",
    label: "Responsible",
    xsHide: true,
  },
  {
    key: "status",
    label: "Status",
    centerContent: true,
  },
  {
    key: "contact",
    label: "Contact",
    xsHide: true,
  },
  {
    key: "category",
    label: "Category",
    notSortable: true,
    centerContent: true,
    xsHide: true,
  },
];

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { handleOpenToast } = useContext(ToastContext);
  const { setOpenDeleteAlert, setObject, setEndpoint, setFetchUpdatedData } =
    useContext(DeleteAlertContext);

  const [openUserFormModal, setOpenUserFormModal] = useState(false);
  const [user, setUser] = useState([]);

  const [userProjects, setUserProjects] = useState([]);

  const [openCollaborationFormModal, setOpenCollaborationFormModal] =
    useState(false);
  const [collaboration, setCollaboration] = useState();
  const [collaborations, setCollaborations] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  async function fetchUser() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/users/" + userId, {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });
      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setUser(json);
        setSearchResults(
          json.collaborations
            .map((collaboration) => {
              return collaboration.name;
            })
            .sort((a, b) => (b.priority ? 1 : -1)) // sort the rows by prirority attribute on first load
        );
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching data.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchUserProjects() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/users/" + userId + "/projects", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });
      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setUserProjects(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching data.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchCollaborations() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch(
        "/api/users/" + userId + "/collaborations",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${JWToken.credential}` },
        }
      );
      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setCollaborations(json);
        // sort by project name then by company name
        setSearchResults(
          json.sort((a, b) => {
            if (a.project.name < b.project.name) {
              return -1;
            } else if (a.project.name > b.project.name) {
              return 1;
            } else {
              if (a.company.name < b.company.name) {
                return -1;
              } else if (a.company.name > b.company.name) {
                return 1;
              } else {
                return 0;
              }
            }
          })
        );
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching data.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  function navigateUsers() {
    navigate("/users");
  }

  function handleEditUser() {
    setOpenUserFormModal(true);
  }

  function handleDeleteUser() {
    setObject({ type: "User", name: user.name + " " + user.surname });
    setEndpoint("/api/users/" + user.id);
    setFetchUpdatedData({ function: navigateUsers });

    setOpenDeleteAlert(true);
  }

  function handleEditCollaboration(collaboration) {
    setCollaboration(collaboration);
    setOpenCollaborationFormModal(true);
  }

  function handleDeleteCollaboration(collaboration) {
    setObject({ type: "Collaboration", name: collaboration.name });
    setEndpoint("/api/collaborations/" + collaboration.id);
    setFetchUpdatedData({ function: fetchCollaborations });

    setOpenDeleteAlert(true);
  }

  useEffect(() => {
    fetchUser();
    fetchUserProjects();
    fetchCollaborations();
  }, []);

  return (
    <>
      <UserForm
        openModal={openUserFormModal}
        setOpenModal={setOpenUserFormModal}
        fetchUpdatedData={fetchUser}
        object={user}
      />

      <CollaborationForm
        openModal={openCollaborationFormModal}
        setOpenModal={setOpenCollaborationFormModal}
        fetchUpdatedData={fetchCollaborations}
        object={collaboration}
        projectId={null}
        companyId={null}
      />

      <Box
        sx={{
          display: "flex",

          maxHeight: "calc(100% - 64px)",
        }}
      >
        {/* details */}
        <Box
          sx={{
            flexBasis: "30%",

            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 0.5,
            }}
          >
            <Button
              variant="contained"
              startIcon={<KeyboardArrowLeftIcon />}
              onClick={() => {
                navigate("/users");
              }}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,

                marginBlock: 2,
              }}
            >
              Users
            </Button>

            <Box
              sx={{
                marginRight: 2,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              <Tooltip title="Edit" key="Edit">
                <IconButton
                  size="small"
                  onClick={handleEditUser}
                  sx={{
                    color: "white",
                    backgroundColor: "#1976d2",

                    borderRadius: 1,
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" key="Delete">
                <IconButton
                  size="small"
                  onClick={handleDeleteUser}
                  sx={{
                    color: "white",
                    backgroundColor: "#1976d2",

                    borderRadius: 1,
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box
            sx={{
              marginBottom: 2,
              marginInline: 2,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 500,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {user.name + " " + user.surname}
            </Typography>

            <Accordion defaultExpanded sx={{ marginBlock: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  USER INFO
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem disablePadding>
                    <ListItemText primary={"Login email: " + user.email} />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary={"Authority: " + user.authorization}
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText primary={"Nickname: " + user.nickname} />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary={"Description: " + user.description}
                      sx={{ maxHeight: 60, overflowY: "auto" }}
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                marginBlock: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  PROJECTS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {userProjects?.map((project) => (
                  <Box key={project.id} sx={{ marginBlock: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>{project.name}</Typography>
                    </Box>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        {/* collaborations */}
        <Box
          sx={{
            flex: 1,

            overflowY: "auto",
          }}
        >
          <Container
            maxWidth="false"
            sx={{
              paddingBlock: 2,

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SearchBar
              type="collaborations"
              data={collaborations}
              setSearchResults={setSearchResults}
            />
          </Container>

          <Container maxWidth="false">
            {collaborations?.length <= 0 ? (
              <Typography variant="h4" align="center">
                {"No collaborations :("}
              </Typography>
            ) : (
              <TableComponent
                tableColumns={tableColumns}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                // TODO: handleView={handleView} when we add activites
                handleEdit={handleEditCollaboration}
                handleDelete={handleDeleteCollaboration}
              />
            )}
          </Container>
        </Box>
      </Box>
    </>
  );
}
