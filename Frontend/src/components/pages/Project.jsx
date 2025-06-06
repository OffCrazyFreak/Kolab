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
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Clear as RemoveIcon,
} from "@mui/icons-material/";

import moment from "moment";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ToastContext from "../../context/ToastContext";
import DeleteAlertContext from "../../context/DeleteAlertContext";

import CollaborationForm from "../forms/CollaborationForm";
import ProjectForm from "../forms/ProjectForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

const tableColumns = [
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

export default function Project() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { handleOpenToast } = useContext(ToastContext);
  const { setOpenDeleteAlert, setObject, setEndpoint, setFetchUpdatedData } =
    useContext(DeleteAlertContext);

  const [openProjectFormModal, setOpenProjectFormModal] = useState(false);
  const [project, setProject] = useState();

  const [openCollaborationFormModal, setOpenCollaborationFormModal] =
    useState(false);
  const [collaboration, setCollaboration] = useState();
  const [collaborations, setCollaborations] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  async function fetchProject() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/projects/" + projectId, {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });
      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setProject(json);
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

  async function fetchCollaborations() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch(
        "/api/projects/" + projectId + "/collaborations",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${JWToken.credential}` },
        }
      );
      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setCollaborations(json);
        setSearchResults(json);
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

  function handleEditProject() {
    setOpenProjectFormModal(true);
  }

  function navigateProjects() {
    navigate("/projects");
  }

  function handleDeleteProject() {
    setObject({ type: "Project", name: project.name });
    setEndpoint("/api/projects/" + project.id);
    setFetchUpdatedData({ function: navigateProjects });

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
    fetchProject();
    fetchCollaborations();
  }, []);

  return (
    <>
      <ProjectForm
        openModal={openProjectFormModal}
        setOpenModal={setOpenProjectFormModal}
        fetchUpdatedData={fetchProject}
        object={project}
      />

      <CollaborationForm
        openModal={openCollaborationFormModal}
        setOpenModal={setOpenCollaborationFormModal}
        fetchUpdatedData={fetchCollaborations}
        object={collaboration}
        projectId={project?.id}
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
                navigate("/projects");
              }}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,

                marginBlock: 2,
              }}
            >
              Projects
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
                  onClick={handleEditProject}
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
                  onClick={handleDeleteProject}
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

          {project && (
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
                {project.name}
              </Typography>

              <Accordion defaultExpanded sx={{ marginBlock: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                    }}
                  >
                    PROJECT INFO
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Project name"
                        secondary={project.name}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Category"
                        secondary={project.category?.name || "Not set"}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText primary="Type" secondary={project.type} />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Start date"
                        secondary={
                          project.startDate
                            ? moment(project.startDate).format("DD.MM.YYYY")
                            : "Not set"
                        }
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="End date"
                        secondary={
                          project.endDate
                            ? moment(project.endDate).format("DD.MM.YYYY")
                            : "Not set"
                        }
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Responsible"
                        secondary={
                          project.responsible
                            ? `${project.responsible.name} ${project.responsible.surname}`
                            : "Not set"
                        }
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Goal"
                        secondary={project.goal || "Not set"}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
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

            <Button
              variant="contained"
              size="medium"
              startIcon={<AddCircleIcon />}
              onClick={() => {
                setCollaboration();
                setOpenCollaborationFormModal(true);
              }}
            >
              Add collaboration
            </Button>
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
              ></TableComponent>
            )}
          </Container>
        </Box>
      </Box>
    </>
  );
}
