import React from "react";
import { Outlet } from "react-router-dom";

import useAuth from "../ver2/hooks/useAuth";
import OnBoard from "../ver2/page/OnBoard/OnBoard";

const HomeMiddleware = () => {
  const { user } = useAuth();

  const isLogin = !!user.id_user;

  return isLogin ? <Outlet /> : <OnBoard />;
};

export default HomeMiddleware;
