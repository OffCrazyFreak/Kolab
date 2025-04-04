import { TextField } from "@mui/material";
import { useState, useEffect } from "react";

export default function TextInput({
  labelText,
  inputType,
  isRequired,
  placeholderText,
  helperText,
  inputProps,
  textFieldProps,
  value,
  setValue,
  valueIsValid,
  setValueIsValid,
  validationFunction,
}) {
  const [valueDirty, setValueDirty] = useState(false);
  function handleChange(e) {
    let input = e.target.value;

    if (validationFunction(input)) {
      setValueIsValid(true);
    } else {
      setValueIsValid(false);
    }

    setValue(input);
  }

  useEffect(() => {}, [value]);

  return (
    <TextField
      label={labelText}
      type={inputType}
      fullWidth
      margin="dense"
      required={isRequired}
      placeholder={placeholderText}
      value={value || ""}
      inputProps={inputProps}
      {...textFieldProps}
      onBlur={() => {
        setValueDirty(true);
      }}
      error={valueDirty && !valueIsValid}
      helperText={
        valueDirty && !valueIsValid ? helperText.error : helperText.details
      }
      onChange={handleChange}
    />
  );
}
