import { Typography, Container, Button, Box } from "@mui/material";

import { useEffect, useState, useContext } from "react";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

import ToastContext from "../../context/ToastContext";

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
    key: "category",
    label: "Category",
    notSortable: true,
    centerContent: true,
    xsHide: true,
  },
];

export default function Home() {
  const { handleOpenToast } = useContext(ToastContext);

  const [collaborations, setCollaborations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  async function fetchCollaborations() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/collaborations", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });
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

  useEffect(() => {
    fetchCollaborations();
  }, []);

  return (
    <>
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
            />
          )}
        </Container>
      </Box>
    </>
  );
}
