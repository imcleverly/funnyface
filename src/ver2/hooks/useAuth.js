import { useDispatch, useSelector } from "react-redux";

import { doLogin, doLogout } from "../redux/actions/userAction";

const useAuth = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.account);

  const login = (data) => {
    dispatch(doLogin(data));
  };

  const logout = () => {
    dispatch(doLogout());
  };

  return { user, login, logout };
};

export default useAuth;
