import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const nevigate = useNavigate();
  useEffect(() => {
    if (!user) {
      nevigate("/login");
    }
  }, []);
  return <>{children}</>;
};

export default ProtectedRoute;
