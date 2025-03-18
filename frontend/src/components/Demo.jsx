import React from "react";
import useAuth from "../customHooks/useAuth";

const Demo = () => {
  const { handleLogout } = useAuth();

  return (
    <div>
      <h2>Demo</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Demo;
