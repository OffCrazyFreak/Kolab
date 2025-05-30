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
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState, useContext, useEffect } from "react";

import ToastContext from "../../context/ToastContext";

import TextInput from "./partial/TextInput";

const abcCategories = [
  { value: "Unknown", label: "Unknown" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];

const months = [
  { value: "UNKNOWN", label: "Unknown" },
  { value: "JANUARY", label: "January" },
  { value: "FEBRUARY", label: "February" },
  { value: "MARCH", label: "March" },
  { value: "APRIL", label: "April" },
  { value: "MAY", label: "May" },
  { value: "JUNE", label: "June" },
  { value: "JULY", label: "July" },
  { value: "AUGUST", label: "August" },
  { value: "SEPTEMBER", label: "September" },
  { value: "OCTOBER", label: "October" },
  { value: "NOVEMBER", label: "November" },
  { value: "DECEMBER", label: "December" },
];

export default function CompanyForm({
  object: company,
  openModal,
  setOpenModal,
  fetchUpdatedData,
}) {
  const { handleOpenToast } = useContext(ToastContext);

  const [existingCompanies, setExistingCompanies] = useState([]);
  const [existingIndustries, setExistingIndustries] = useState([]);
  const [countriesFromAPI, setCountriesFromAPI] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState(null);
  const [categorization, setCategorization] = useState("");
  const [budgetPlanningMonth, setBudgetPlanningMonth] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [webLink, setWebLink] = useState("");
  const [description, setDescription] = useState("");
  const [contactInFuture, setContactInFuture] = useState(true);

  const [nameIsValid, setNameIsValid] = useState(false);
  const [industryIdIsValid, setIndustryIdIsValid] = useState(false);
  const [categorizationIsValid, setCategorizationIsValid] = useState(false);
  const [budgetPlanningMonthIsValid, setBudgetPlanningMonthIsValid] =
    useState(false);
  const [countryIsValid, setCountryIsValid] = useState(false);
  const [zipIsValid, setZipIsValid] = useState(false);
  const [cityIsValid, setCityIsValid] = useState(false);
  const [addressIsValid, setAddressIsValid] = useState(false);
  const [webLinkIsValid, setWebLinkIsValid] = useState(false);
  const [descriptionIsValid, setDescriptionIsValid] = useState(false);
  const [contactInFutureIsValid, setContactInFutureIsValid] = useState(false);

  async function fetchExistingIndustries() {
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
          info: "A server error occurred whilst fetching industries.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchExistingIndustries() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/industries", {
        method: "GET",
        headers: { Authorization: `Bearer ${JWToken.credential}` },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();
        setExistingIndustries(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching industries.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function fetchCountriesFromAPI() {
    try {
      const serverResponse = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2",
        {
          method: "GET",
        }
      );

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json);
        setCountriesFromAPI(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching companies for Country input field.",
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
      !industryIdIsValid ||
      !categorizationIsValid ||
      !budgetPlanningMonthIsValid ||
      !countryIsValid ||
      !cityIsValid ||
      !zipIsValid ||
      !addressIsValid ||
      !descriptionIsValid ||
      !contactInFutureIsValid
    ) {
      return;
    }

    setLoadingButton(true);
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    const companyData = {
      name: name.trim(),
      industryId: industryId,
      categorization: categorization === "UNKNOWN" ? null : categorization,
      budgetPlanningMonth:
        budgetPlanningMonth === "UNKNOWN" ? null : budgetPlanningMonth,
      country: country,
      zip: zip,
      city: city,
      address: address,
      webLink: webLink,
      description: description,
      contactInFuture: contactInFuture,
    };

    const request = {
      method: company ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${JWToken.credential}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    };

    try {
      const serverResponse = await fetch(
        `/api/companies${company ? "/" + company.id : ""}`,
        request
      );

      if (serverResponse.ok) {
        handleOpenToast({
          type: "success",
          info: `Company ${companyData.name} ${company ? "updated" : "added"}.`,
        });
        setOpenModal(false);
        fetchUpdatedData();
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred while saving the company.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred while trying to connect to server.",
      });
    } finally {
      setLoadingButton(false);
    }
  }

  useEffect(() => {
    setName(company?.name);
    setIndustryId(company?.industry?.id);
    setCategorization(company?.categorization || abcCategories[0].value);
    setBudgetPlanningMonth(company?.budgetPlanningMonth || months[0].value);
    setCountry(company?.country);
    setCity(company?.city);
    setZip(company?.zip);
    setAddress(company?.address);
    setWebLink(company?.webLink);
    setDescription(company?.description);
    setContactInFuture(company?.contactInFuture || true);

    setNameIsValid(company ? true : false);
    setIndustryIdIsValid(company ? true : false);
    setCategorizationIsValid(true);
    setBudgetPlanningMonthIsValid(true);
    setCountryIsValid(company ? true : false);
    setCityIsValid(company ? true : false);
    setZipIsValid(company ? true : false);
    setAddressIsValid(company ? true : false);
    setWebLinkIsValid(true);
    setDescriptionIsValid(true);
    setContactInFutureIsValid(true);

    fetchExistingIndustries();
    fetchCountriesFromAPI();
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
              {!company ? "Add company" : "Update company"}
            </Typography>

            <Box
              sx={{
                overflowY: "auto",
              }}
            >
              <TextInput
                labelText={"Company name"}
                placeholderText={"Vision <O>"}
                isRequired
                helperText={{
                  error: "Company name must be between 2 and 35 characters",
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
                options={existingIndustries}
                clearOnEscape
                openOnFocus
                value={
                  existingIndustries.find((ind) => ind.id === industryId) ||
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
                  setIndustryId(inputValue?.id);
                  setIndustryIdIsValid(
                    existingIndustries
                      .map((option) => option.id)
                      .includes(inputValue?.id)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Industry"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              />

              <TextField
                label="ABC categorization"
                fullWidth
                required
                select
                margin="dense"
                helperText={
                  !categorizationIsValid && "Invalid ABC categorization"
                }
                value={categorization}
                error={!categorizationIsValid}
                onChange={(e) => {
                  const input = e.target.value;

                  setCategorizationIsValid(
                    abcCategories
                      .map((category) => category.value)
                      .includes(input)
                  );

                  setCategorization(input);
                }}
              >
                {abcCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Budget planning month"
                fullWidth
                select
                margin="dense"
                helperText={
                  !budgetPlanningMonthIsValid && "Invalid budget planning month"
                }
                value={budgetPlanningMonth}
                error={!budgetPlanningMonthIsValid}
                onChange={(e) => {
                  const input = e.target.value;

                  setBudgetPlanningMonthIsValid(
                    months.map((month) => month.value).includes(input)
                  );

                  setBudgetPlanningMonth(input);
                }}
              >
                {months.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                options={countriesFromAPI
                  .map((country) => country.name.common)
                  .concat(existingCompanies.map((company) => company.country))
                  .filter(
                    (country, index, array) => array.indexOf(country) === index
                  )
                  .sort((a, b) => {
                    return a.localeCompare(b);
                  })}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                clearOnEscape
                openOnFocus
                freeSolo
                inputValue={country || ""}
                onInputChange={(event, value) => {
                  setCountry(value);
                  setCountryIsValid(value.length >= 4 && value.length <= 56);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    placeholder="Croatia"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              />

              <Autocomplete
                options={existingCompanies
                  .map((company) => company.city)
                  .filter((city, index, array) => array.indexOf(city) === index)
                  .sort((a, b) => {
                    return a.localeCompare(b);
                  })}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                clearOnEscape
                openOnFocus
                freeSolo
                inputValue={city || ""}
                onInputChange={(event, value) => {
                  setCity(value);
                  setCityIsValid(value.length >= 2 && value.length <= 115);

                  // set country based on chosen city
                  if (!country || country === "") {
                    const countryFromCity = existingCompanies.find(
                      (company) => company.city === value
                    ).country;

                    const matchedCountryInApi = countriesFromAPI.find(
                      (country) => country.name.common === countryFromCity
                    )?.name.common;

                    setCountry(matchedCountryInApi || "");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    placeholder="El Pueblo de Nuestra Senora, Reina de los Angeles del Rio Porciuncula"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              />
              <TextInput
                labelText={"Zip code"}
                inputType={"number"}
                isRequired
                placeholderText={"10000"}
                helperText={{
                  error: "Zip code must be between 1 and 999999",
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
                value={zip}
                setValue={setZip}
                valueIsValid={zipIsValid}
                setValueIsValid={setZipIsValid}
              />

              <TextInput
                labelText={"Address"}
                isRequired
                helperText={{
                  error: "Address must be between 2 and 115 characters",
                  details: "",
                }}
                inputProps={{ minLength: 2, maxLength: 115 }}
                validationFunction={(input) => {
                  return input.length >= 2 && input.length <= 115;
                }}
                value={address}
                setValue={setAddress}
                valueIsValid={addressIsValid}
                setValueIsValid={setAddressIsValid}
              />

              <TextInput
                labelText={"Webpage URL"}
                helperText={{
                  error: "Invalid Webpage URL",
                  details: "",
                }}
                placeholderText={"kolab.hr"}
                inputProps={{ maxLength: 55 }}
                validationFunction={(input) => {
                  const urlPattern = new RegExp(
                    "^(https?:\\/\\/)?" + // validate protocol
                      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
                      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
                      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
                      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
                      "(\\#[-a-z\\d_]*)?$",
                    "i"
                  ); // validate fragment locator

                  return (
                    input === "" ||
                    (input.length <= 55 && urlPattern.test(input))
                  );
                }}
                value={webLink}
                setValue={setWebLink}
                valueIsValid={webLinkIsValid}
                setValueIsValid={setWebLinkIsValid}
              />

              <TextInput
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
                inputProps={{ maxLength: 475 }}
                validationFunction={(input) => {
                  return input.length <= 475;
                }}
                value={description}
                setValue={setDescription}
                valueIsValid={descriptionIsValid}
                setValueIsValid={setDescriptionIsValid}
              />

              <FormLabel component="legend">Contact in future</FormLabel>
              <RadioGroup
                name="Contact in future"
                required
                row
                value={contactInFuture === true ? "Yes" : "No"}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input === "Yes") {
                    setContactInFuture(true);
                  } else {
                    setContactInFuture(false);
                  }
                }}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
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
                    industryIdIsValid &&
                    categorizationIsValid &&
                    budgetPlanningMonthIsValid &&
                    countryIsValid &&
                    cityIsValid &&
                    zipIsValid &&
                    addressIsValid &&
                    webLinkIsValid &&
                    descriptionIsValid &&
                    contactInFutureIsValid
                  )
                }
                // TODO: replace when this form is refractored
                // disabled={Object.values(formData.validation).some(
                //   (value) => !value
                // )}
              >
                {/* span needed because of bug */}
                <span>{!company ? "Add company" : "Update company"}</span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
