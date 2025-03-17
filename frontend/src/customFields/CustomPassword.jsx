import React, { useState } from "react";
import { useField } from "informed";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const CustomPassword = ({
  name,
  label,
  validate,
  validateOn = "change",
  validateOnBlur = true,
  showErrorIfDirty = true,
  required,
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
  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? "text" : "password"}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          required={required}
          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            showError ? "border-red-500" : "border-gray-300"
          }`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {showError && <small className="text-red-500">{error}</small>}
    </div>
  );
};

export default CustomPassword;
