import React from "react";
import { useField } from "informed";

const CustomProjectSelect = ({
  name,
  label,
  validate,
  validateOn = "change",
  validateOnBlur = true,
  showErrorIfDirty = true,
  required,
  children,
  ...props
}) => {
  const { fieldState, fieldApi, ref } = useField({
    name,
    validate,
    required,
    validateOn,
    showErrorIfDirty,
  });

  const { value, error, showError } = fieldState;
  const { setValue, setTouched } = fieldApi;

  const handleBlur = () => {
    if (validateOnBlur) {
      setTouched(true);
    }
  };

  const selectProps = {
    id: name,
    ref,
    value: value ?? "",
    onChange: (e) => setValue(e.target.value),
    onBlur: handleBlur,
    required,
    ...props,
  };

  const errorStyle = showError ? { border: "1px solid red" } : {};

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select {...selectProps} style={errorStyle}>
        <option value="">Select a Project</option>
        <option value="projectA">Project A</option>
        <option value="projectB">Project B</option>
        <option value="projectC">Project C</option>
        <option value="projectD">Project D</option>
        {children}
      </select>
      {showError && <small style={{ color: "red" }}>{error}</small>}
    </div>
  );
};

export default CustomProjectSelect;
