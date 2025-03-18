import React from "react";
import { useField } from "informed";

const CustomSelect = ({
  name,
  label,
  validate,
  validateOn = "change", // Default validation on change
  validateOnBlur = true, // Default validation on blur
  showErrorIfDirty = true, // Show error when the field is dirty
  required,
  children, // Options for the select field
  ...props // Spread the remaining props
}) => {
  // Use Informed's useField hook, passing the necessary validation and props
  const { fieldState, fieldApi, ref } = useField({
    name,
    validate,
    required,
    validateOn,
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

  // Define selectProps to manage the select's value and behavior
  const selectProps = {
    id: name,
    ref,
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
      <select {...selectProps} style={errorStyle}>
        {children} {/* Render options as children */}
      </select>
      {showError && <small style={{ color: "red" }}>{error}</small>}{" "}
      {/* Show error message if validation fails */}
    </div>
  );
};

export default CustomSelect;