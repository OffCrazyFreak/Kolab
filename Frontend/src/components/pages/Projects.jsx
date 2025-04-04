import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ToastContext from "../../context/ToastContext";
import DeleteAlertContext from "../../context/DeleteAlertContext";

import ProjectForm from "./../forms/ProjectForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

const tableColumns = [
  { key: "name", label: "Project name" },
  { key: "category", label: "Category", xsHide: true },
  { key: "frresp", label: "Project responsible" },
  { key: "endDate", label: "Project end date", xsHide: true },
  { key: "frgoal", label: "FR goal", xsHide: true },
];

export default function Projects() {
  const navigate = useNavigate();

  const { handleOpenToast } = useContext(ToastContext);
  const { setOpenDeleteAlert, setObject, setEndpoint, setFetchUpdatedData } =
    useContext(DeleteAlertContext);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [project, setProject] = useState();

  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);

  async function populateTable() {
    setLoading(true);

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/projects/", {
        method: "GET",
        headers: { googleTokenEncoded: JWToken.credential },
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

  function handleView(project) {
    navigate(`/projects/${project.id}`);
  }

  function handleEdit(project) {
    setProject(project);
    setOpenFormModal(true);
  }

  function handleDelete(project) {
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
        openModal={openFormModal}
        setOpenModal={setOpenFormModal}
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

        <Button
          variant="contained"
          size="medium"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setProject();
            setOpenFormModal(true);
          }}
        >
          Add project
        </Button>
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
            handleView={handleView}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          ></TableComponent>
        )}
      </Container>
    </>
  );
}
