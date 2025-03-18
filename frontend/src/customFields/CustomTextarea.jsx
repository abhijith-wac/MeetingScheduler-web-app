import React from "react";
import { useField } from "informed";

const CustomTextarea = ({
  name,
  label,
  validate,
  validateOn = "change",
  validateOnBlur = true,
  showErrorIfDirty = true,
  required,
  rows = 4, // Default rows for the textarea
  ...props
}) => {
  // Use Informed's useField hook
  const { fieldState, fieldApi, ref } = useField({
    name,
    validate,
    validateOn,
    required,
    showErrorIfDirty,
  });

  const { value, error, showError } = fieldState;
  const { setValue, setTouched } = fieldApi;

  // Handle blur event
  const handleBlur = () => {
    if (validateOnBlur) {
      setTouched(true);
    }
  };

  // Textarea props
  const textareaProps = {
    id: name,
    ref,
    value: value ?? "", // Default to empty string if undefined
    onChange: (e) => setValue(e.target.value),
    onBlur: handleBlur,
    required,
    rows,
    ...props, // Spread additional props like placeholder, className, etc.
  };

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea {...textareaProps} style={showError ? { border: "1px solid red" } : {}} />
      {showError && <small style={{ color: "red" }}>{error}</small>}
    </div>
  );
};

export default CustomTextarea;
