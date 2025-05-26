import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Button,
  Link,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material/";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ToastContext from "../../context/ToastContext";
import DeleteAlertContext from "../../context/DeleteAlertContext";

import ContactForm from "../forms/ContactForm";
import CollaborationForm from "../forms/CollaborationForm";
import CompanyForm from "../forms/CompanyForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

const tableColumns = [
  {
    key: "name",
    label: "Project name",
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

export default function Company() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { handleOpenToast } = useContext(ToastContext);
  const { setOpenDeleteAlert, setObject, setEndpoint, setFetchUpdatedData } =
    useContext(DeleteAlertContext);

  const [openCompanyFormModal, setOpenCompanyFormModal] = useState(false);
  const [company, setCompany] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [collaborations, setCollaborations] = useState([]);

  const [openContactFormModal, setOpenContactFormModal] = useState(false);
  const [contact, setContact] = useState();

  const [openCollaborationFormModal, setOpenCollaborationFormModal] =
    useState(false);
  const [collaboration, setCollaboration] = useState();

  const [searchResults, setSearchResults] = useState([]);

  async function fetchCompany() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/companies/" + companyId, {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });
      if (serverResponse.ok) {
        const json = await serverResponse.json();
        setCompany(json);
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

  async function fetchContacts() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const contactsResponse = await fetch(
        `/api/companies/${companyId}/contacts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${JWToken.credential}` },
        }
      );

      if (contactsResponse.ok) {
        const contactsJson = await contactsResponse.json();
        setContacts(contactsJson);
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

  async function fetchCollaborations() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const collaborationsResponse = await fetch(
        `/api/companies/${companyId}/collaborations`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${JWToken.credential}` },
        }
      );

      if (collaborationsResponse.ok) {
        const collaborationsJson = await collaborationsResponse.json();
        setCollaborations(collaborationsJson);
      } else {
        handleOpenToast({
          type: "error",
          info: "Failed to fetch company collaborations.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to fetch collaborations.",
      });
    }
  }

  function handleEditCompany() {
    setOpenCompanyFormModal(true);
  }

  function navigateCompanies() {
    navigate("/companies");
  }

  function handleDeleteCompany() {
    setObject({ type: "Company", name: company.name });
    setEndpoint("/api/companies/" + company.id);
    setFetchUpdatedData({ function: navigateCompanies });

    setOpenDeleteAlert(true);
  }

  function handleEditContact(contact) {
    setContact(contact);
    setOpenContactFormModal(true);
  }

  function handleDeleteContact(contact) {
    setObject({
      type: "Contact",
      name: contact.firstName + " " + contact.lastName,
    });
    setEndpoint("/api/companies/" + company.id + "/contacts/" + contact.id);
    setFetchUpdatedData({ function: fetchContacts });

    setOpenDeleteAlert(true);
  }

  function handleEditCollaboration(collaboration) {
    setCollaboration(collaboration);
    setOpenCollaborationFormModal(true);
  }

  function handleDeleteCollaboration(collaboration) {
    setObject({ type: "Collaboration", name: collaboration.name });
    setEndpoint("/api/collaborations/" + collaboration.id);
    setFetchUpdatedData({ function: fetchCompany });

    setOpenDeleteAlert(true);
  }

  useEffect(() => {
    fetchCompany();
    fetchContacts();
    fetchCollaborations();
  }, []);

  return (
    <>
      <CompanyForm
        openModal={openCompanyFormModal}
        setOpenModal={setOpenCompanyFormModal}
        fetchUpdatedData={fetchCompany}
        object={company}
      />

      <ContactForm
        openModal={openContactFormModal}
        setOpenModal={setOpenContactFormModal}
        fetchUpdatedData={fetchContacts}
        object={contact}
        companyId={companyId}
      />

      <CollaborationForm
        openModal={openCollaborationFormModal}
        setOpenModal={setOpenCollaborationFormModal}
        fetchUpdatedData={fetchCompany}
        object={collaboration}
        project={null}
        company={company}
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
                navigate("/companies");
              }}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,

                marginBlock: 2,
              }}
            >
              Companies
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
                  onClick={handleEditCompany}
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
                  onClick={handleDeleteCompany}
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
              {company.name}
            </Typography>

            <Accordion defaultExpanded sx={{ marginBlock: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  COMPANY INFO
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem disablePadding>
                    <ListItemText
                      primary={"Industry: " + company.industry?.name}
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary={"ABC Category: " + company.categorization}
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary={
                        "Budget planning month: " + company.budgetPlanningMonth
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText primary={"Country: " + company.country} />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText primary={"City: " + company.city} />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText primary={"Zip code: " + company.zip} />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText primary={"Address: " + company.address} />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary={
                        <>
                          Web:{" "}
                          <Link
                            href={company.webLink}
                            underline="hover"
                            target="_blank"
                            rel="noopener"
                          >
                            {company.webLink}
                          </Link>
                        </>
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary={"Description: " + company.description || ""}
                      sx={{ maxHeight: 60, overflowY: "auto" }}
                    />
                  </ListItem>
                </List>

                {company.contactInFuture === false && (
                  <Typography
                    sx={{
                      marginTop: 1,

                      fontWeight: 700,
                      fontSize: "1.375rem",
                      textAlign: "center",
                      color: "red",
                    }}
                  >
                    DO NOT CONTACT
                  </Typography>
                )}
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
                  CONTACTS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {contacts?.map((contact) => (
                  <Box key={contact.id} sx={{ marginBlock: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        {contact.firstName + " " + contact.lastName}
                      </Typography>
                      <Box>
                        <IconButton
                          aria-label="edit contact"
                          onClick={() => handleEditContact(contact)}
                          sx={{
                            width: 20,
                            height: 20,

                            margin: 0.125,

                            color: "white",
                            backgroundColor: "#1976d2",
                            borderRadius: 1,
                          }}
                        >
                          <EditIcon
                            sx={{
                              width: 15,
                              height: 15,
                            }}
                          />
                        </IconButton>

                        <IconButton
                          aria-label="delete contact"
                          onClick={() => handleDeleteContact(contact)}
                          sx={{
                            width: 20,
                            height: 20,

                            margin: 0.125,

                            color: "white",
                            backgroundColor: "#1976d2",
                            borderRadius: 1,
                          }}
                        >
                          <DeleteIcon
                            sx={{
                              width: 15,
                              height: 15,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>

                    <List dense>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 25 }}>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.email}
                          sx={{ overflow: "hidden", marginLeft: 1 }}
                        />
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 25 }}>
                          <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.phone}
                          sx={{ overflow: "hidden", marginLeft: 1 }}
                        />
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 25 }}>
                          <WorkIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.position}
                          sx={{ overflow: "hidden", marginLeft: 1 }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                ))}

                <Box sx={{ display: "grid", placeItems: "center" }}>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenContactFormModal(true)}
                  >
                    Add contact
                  </Button>
                </Box>
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
            {company.collaborations?.length <= 0 ? (
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
