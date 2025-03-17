import React from "react";
import { useField } from "informed";


const CustomLoginInput = ({
  name,
  label,
  validate,
  validateOn = "change",
  validateOnBlur = true,
  showErrorIfDirty = true,
  required,
  type = "text",
  icon: Icon,
  ...props
}) => {
  const { fieldState, fieldApi, ref } = useField({
    name,
    validate,
    validateOn,
    required,
    showErrorIfDirty,
    ...props,
  });

  const { value, error, showError } = fieldState;
  const { setValue, setTouched } = fieldApi;

  const handleBlur = () => {
    if (validateOnBlur) {
      setTouched(true);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3 text-gray-500" size={18} />}

        <input
          id={name}
          ref={ref}
          type={type}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          required={required}
          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            showError ? "border-red-500" : "border-gray-300"
          }`}
          {...props}
        />
      </div>

      {showError && <small className="text-red-500">{error}</small>}
    </div>
  );
};

export default CustomLoginInput;
