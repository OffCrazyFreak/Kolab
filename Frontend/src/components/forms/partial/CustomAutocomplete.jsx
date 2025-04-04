import { TextField, Autocomplete } from "@mui/material";

export default function CustomAutocomplete({
  options,
  entityKey,
  validationKey,
  label,
  formatter,
  disabledCondition = false,
  helperTextCondition = null,
  helperText = "",
  formData,
  setFormData,
}) {
  return (
    <Autocomplete
      options={options}
      clearOnEscape
      openOnFocus
      disabled={disabledCondition}
      value={
        options.find((option) => option.id === formData.entity[entityKey]) ||
        null
      }
      getOptionLabel={formatter}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={(options, { inputValue }) =>
        options.filter((option) =>
          formatter(option).toLowerCase().includes(inputValue.toLowerCase())
        )
      }
      onChange={(e, newValue) => {
        if (newValue) {
          setFormData((prevData) => ({
            entity: {
              ...prevData.entity,
              [entityKey]: newValue.id,
            },
            validation: {
              ...prevData.validation,
              [validationKey]: options.some(
                (option) => option.id === newValue.id
              ),
            },
          }));
        } else {
          setFormData((prevData) => ({
            entity: {
              ...prevData.entity,
              [entityKey]: null,
            },
            validation: {
              ...prevData.validation,
              [validationKey]: false,
            },
          }));
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required
          fullWidth
          margin="dense"
          helperText={helperTextCondition ? helperText : ""}
        />
      )}
    />
  );
}
