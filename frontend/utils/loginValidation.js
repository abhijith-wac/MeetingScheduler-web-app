
export const validateEmail = (value) => {
  if (!value) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address";
  return undefined;
};

export const validatePassword = (value) => {
  if (!value) return "Password is required";
  return undefined;
};