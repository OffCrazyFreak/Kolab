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

import CompanyForm from "../forms/CompanyForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

import IndustryForm from "../forms/IndustryForm";

const tableColumns = [
  {
    key: "name",
    label: "Company name",
  },
  {
    key: "industry",
    label: "Industry",
  },
  {
    key: "categorization",
    label: "ABC categorization",
    xsHide: true,
  },
  {
    key: "budgetPlanningMonth",
    label: "Budget planning month",
    xsHide: true,
  },
  {
    key: "webLink",
    label: "Webpage URL",
    xsHide: true,
  },
];

export default function Companies() {
  const navigate = useNavigate();

  const { handleOpenToast } = useContext(ToastContext);
  const { setOpenDeleteAlert, setObject, setEndpoint, setFetchUpdatedData } =
    useContext(DeleteAlertContext);

  const [openCompanyFormModal, setOpenCompanyFormModal] = useState(false);
  const [company, setCompany] = useState();
  const [openIndustryFormModal, setOpenIndustryFormModal] = useState(false);
  const [industry, setIndustry] = useState();

  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);

  async function populateTable() {
    setLoading(true);

    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/companies", {
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
        info: "An error occurred whilst trying to connect to server.",
      });
    }

    setLoading(false);
  }

  function handleView(company) {
    navigate("/companies/" + company.id);
  }

  function handleEdit(company) {
    setCompany(company);
    setOpenCompanyFormModal(true);
  }

  function handleDelete(company) {
    setObject({ type: "Company", name: company.name });
    setEndpoint("/api/companies/" + company.id);
    setFetchUpdatedData({ function: populateTable });

    setOpenDeleteAlert(true);
  }

  useEffect(() => {
    populateTable();
  }, []);

  return (
    <>
      <IndustryForm
        openModal={openIndustryFormModal}
        setOpenModal={setOpenIndustryFormModal}
        fetchUpdatedData={populateTable}
        object={industry}
      />

      <CompanyForm
        openModal={openCompanyFormModal}
        setOpenModal={setOpenCompanyFormModal}
        fetchUpdatedData={populateTable}
        object={company}
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
          type="companies"
          data={data}
          setSearchResults={setSearchResults}
        />
        <ButtonGroup variant="contained" size="medium">
          <Button
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setIndustry(null);
              setOpenIndustryFormModal(true);
            }}
          >
            Add industry
          </Button>

          <Button
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setCompany(null);
              setOpenCompanyFormModal(true);
            }}
          >
            Add company
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
            {"No companies :("}
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
