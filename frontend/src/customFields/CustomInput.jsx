import React from "react";
import { useField } from "informed";

const CustomInput = ({
  name,
  label,
  validate,
  validateOn = "change", // Default validation on change
  validateOnBlur = true, // Default validation on blur
  showErrorIfDirty = true, // Show error when the field is dirty
  required,
  type = "text", // Default to text input
  ...props // Spread additional props
}) => {
  // Use Informed's useField hook, passing the necessary validation and props
  const { fieldState, fieldApi, ref } = useField({
    name,
    validate, // Validate function no longer needs intl
    validateOn,
    required,
    showErrorIfDirty,
  });

  const { value, error, showError } = fieldState;
  const { setValue, setTouched } = fieldApi;

  // Handle the blur event to mark the field as touched if required
  const handleBlur = () => {
    if (validateOnBlur) {
      setTouched(true);
    }
  };

  // Define inputProps to manage the input's value and behavior
  const inputProps = {
    id: name,
    ref,
    type,
    value: value ?? "", // Default to empty string if the value is undefined
    onChange: (e) => setValue(e.target.value), // Update value on change
    onBlur: handleBlur, // Trigger blur behavior
    required,
    ...props, // Spread additional props (e.g., placeholder, className, etc.)
  };

  // Apply error styling if there's an error
  const errorStyle = showError ? { border: "1px solid red" } : {};

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}{" "}
      {/* Render label if passed */}
      <input {...inputProps} style={errorStyle} />{" "}
      {/* Render the input with the defined props */}
      {showError && <small style={{ color: "red" }}>{error}</small>}{" "}
      {/* Show error message if validation fails */}
    </div>
  );
};

export default CustomInput;