import React from "react";
import { Outlet } from "react-router-dom";

import useAuth from "../ver2/hooks/useAuth";
import Home from "../ver2/page/Home/Home";

const HomeMiddleware = () => {
  const { user } = useAuth();

  const isLogin = !!user.id_user;

  return !isLogin ? <Outlet /> : <Home />;
};

export default HomeMiddleware;
