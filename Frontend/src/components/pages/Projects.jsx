import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ToastContext from "../../context/ToastContext";
import DeleteAlertContext from "../../context/DeleteAlertContext";

import ProjectForm from "./../forms/ProjectForm";
import CategoryForm from "./../forms/CategoryForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

const tableColumns = [
  { key: "name", label: "Project name" },
  { key: "category", label: "Category", xsHide: true },
  { key: "responsible", label: "Responsible", xsHide: true },
  { key: "endDate", label: "End Date", xsHide: true },
  { key: "goal", label: "Goal", xsHide: true },
];

export default function Projects() {
  const navigate = useNavigate();

  const { handleOpenToast } = useContext(ToastContext);
  const { setOpenDeleteAlert, setObject, setEndpoint, setFetchUpdatedData } =
    useContext(DeleteAlertContext);

  const [openProjectFormModal, setOpenProjectFormModal] = useState(false);
  const [project, setProject] = useState();

  const [openCategoryFormModal, setOpenCategoryFormModal] = useState(false);
  const [Category, setCategory] = useState(null);

  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);

  async function populateTable() {
    setLoading(true);

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/projects", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setData(json);
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
        info: "An error occurred whilst trying to fetch data.",
      });
    }

    setLoading(false);
  }

  function handleViewProject(project) {
    navigate(`/projects/${project.id}`);
  }

  function handleEditProject(project) {
    setProject(project);
    setOpenProjectFormModal(true);
  }

  function handleDeleteProject(project) {
    setObject({ type: "Project", name: project.name });
    setEndpoint("/api/projects/" + project.id);
    setFetchUpdatedData({ function: populateTable });

    setOpenDeleteAlert(true);
  }

  useEffect(() => {
    populateTable();
  }, []);

  return (
    <>
      <ProjectForm
        object={project}
        openModal={openProjectFormModal}
        setOpenModal={setOpenProjectFormModal}
        fetchUpdatedData={populateTable}
      />

      <CategoryForm
        object={Category}
        openModal={openCategoryFormModal}
        setOpenModal={setOpenCategoryFormModal}
        fetchUpdatedData={populateTable}
      />

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
          type="projects"
          data={data}
          setSearchResults={setSearchResults}
        />

        <ButtonGroup variant="contained" size="medium">
          <Button
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setCategory();
              setOpenCategoryFormModal(true);
            }}
          >
            Add category
          </Button>

          <Button
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setProject();
              setOpenProjectFormModal(true);
            }}
          >
            Add project
          </Button>
        </ButtonGroup>
      </Container>

      <Container maxWidth="false">
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress size={100} />
          </Box>
        ) : data?.length <= 0 ? (
          <Typography variant="h4" align="center">
            {"No projects :("}
          </Typography>
        ) : (
          <TableComponent
            tableColumns={tableColumns}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            handleView={handleViewProject}
            handleEdit={handleEditProject}
            handleDelete={handleDeleteProject}
          ></TableComponent>
        )}
      </Container>
    </>
  );
}
