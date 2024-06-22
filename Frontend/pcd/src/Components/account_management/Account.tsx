import LoginView from "./LoginView";
import HealthForm from "../HealthForm";
import { UserInfosProvider } from "../../Contexts/UserInfosContext";
import { useState } from "react";
import Navbar from "../Navbar";

function Account() {
  const [isLogin, setisLogin] = useState(true);
  const [isHealthForm, setIsHealthForm] = useState(false);

  const additionalValues = {
    isLogin: isLogin,
    setisLogin: setisLogin,
    isHealthForm: isHealthForm,
    setIsHealthForm: setIsHealthForm,
  };

  return (
    <>
    <Navbar />
      {isHealthForm ? (
        <UserInfosProvider additionalValues={additionalValues}>
          <HealthForm />
        </UserInfosProvider>
      ) : (
        <UserInfosProvider additionalValues={additionalValues}>
          <LoginView />
        </UserInfosProvider>
      )}
    </>
  );
}

export default Account;
