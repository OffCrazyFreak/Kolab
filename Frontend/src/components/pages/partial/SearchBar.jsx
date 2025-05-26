import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

export default function SearchBar({ type, data, setSearchResults }) {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];

  function handleChange(value) {
    value = value.toLowerCase();

    const results = data.filter((item) => {
      switch (type) {
        case "users":
          return (item.name + " " + item.surname).toLowerCase().includes(value);
        case "companies":
          return item.name.toLowerCase().includes(value);
        case "projects":
          return item.name.toLowerCase().includes(value);
        case "collaborations":
          if (currentPath === "companies") {
            return item.project?.name.toLowerCase().includes(value);
          } else if (currentPath === "projects") {
            return item.company?.name.toLowerCase().includes(value);
          } else if (currentPath === "users") {
            return (item.project?.name + " - " + item.company?.name)
              .toLowerCase()
              .includes(value);
          }

        default:
          return true;
      }
    });

    setSearchResults(results);
  }

  function getOptionLabel(item) {
    if (!item) return "";

    switch (type) {
      case "users":
        return `${item.name} ${item.surname}`;
      case "collaborations":
        if (currentPath === "companies") {
          return item.project?.name;
        } else if (currentPath === "projects") {
          return item.company?.name;
        } else if (currentPath === "users") {
          return `${item.project?.name} - ${item.company?.name}`;
        }
      default:
        return item.name || "";
    }
  }

  return (
    <Autocomplete
      freeSolo
      size="small"
      onInputChange={(e, inputValue) => {
        handleChange(inputValue);
      }}
      options={data?.map((item) => ({
        value: item.id,
        label: getOptionLabel(item),
      }))}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Search ${type}`}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      sx={{ width: "50%", maxWidth: "15rem" }}
    />
  );
}
