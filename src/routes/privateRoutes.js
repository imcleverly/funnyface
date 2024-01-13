import { Route } from "react-router-dom";

import Home from "../ver2/page/Home/Home";
import ChangePassword from "../ver2/components/ChangePassword";
import ForgotPassword from "../ver2/page/ForgotPassword";
import Login from "../ver2/page/Login";
import Register from "../ver2/page/Register";
import Policy from "../ver2/components/Policy";

import AuthMiddleware from "../middleware/AuthMiddleware";
import HomeMiddleware from "../middleware/HomeMiddleware";

export const privateRoutes = (
  <>
    <Route path="" element={<HomeMiddleware />}>
      <Route index element={<Home />} />
    </Route>

    <Route path="" element={<AuthMiddleware />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot" element={<ForgotPassword />} />
      <Route path="reset" element={<ChangePassword />} />
      <Route path="policy" element={<Policy />} />
    </Route>
  </>
);
