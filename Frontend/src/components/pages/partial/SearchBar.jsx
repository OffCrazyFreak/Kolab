import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SearchBar({ type, data, setSearchResults }) {
  function handleChange(value) {
    value = value.toLowerCase();

    const results = data.filter((item) => {
      switch (type) {
        case "users":
          return (item.firstName + " " + item.lastName)
            .toLowerCase()
            .includes(value);
        case "companies":
          return item.name.toLowerCase().includes(value);
        case "projects":
          return item.name.toLowerCase().includes(value);
        case "collaborations":
          return item.name.toLowerCase().includes(value);
        default:
          return true;
      }
    });

    setSearchResults(results);
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
        label:
          type === "users" ? `${item.firstName} ${item.lastName}` : item.name, // TODO: collaborations label?
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
