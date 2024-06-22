import { ReactNode, createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import Cookies from "universal-cookie";

interface UserType {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  username: string;
  email: string;
  age: number;
  height: number;
  heightUnit: string;
  weight: number;
  weightUnit: string;
  experienceLevel: string;
  fitnessGoals: Array<string>;
  healthConditions: Array<string>;
}

interface AuthTokensType {
  refresh: string;
  access: string;
}

interface AuthContextType {
  user?: UserType | null;
  authTokens?: AuthTokensType | null;
  handleLogin?: (
    e: { preventDefault: () => void },
    email: string,
    password: string
  ) => Promise<string>;
  handleLogout?: () => void;
  IsError?: boolean;
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();

  const cookies = new Cookies();

  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [IsError, setIsError] = useState(false);

  const handleLogin = async (
    e: { preventDefault: () => void },
    email: string,
    password: string
  ) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    const response = await fetch(import.meta.env.VITE_REACT_APP_USER_TOKEN_API, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const received_data = await response.json();

    if (response.status == 200) {
      setUser(jwtDecode(received_data.access));
      setAuthTokens(received_data);
      localStorage.setItem("authTokens", JSON.stringify(received_data));
      localStorage.setItem(
        "user",
        JSON.stringify(jwtDecode(received_data.access))
      );
      navigate('/');
    }
    return "error";
  };

  const handleLogout = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    cookies.remove("token");
    navigate('/');
  };

  useEffect(() => {
    const updateToken = async () => {
      const response = await fetch(import.meta.env.VITE_REACT_APP_USER_TOKEN_REFRESH_API, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });
      const received_data = await response.json();

      if (response.status == 200) {
        setUser(jwtDecode(received_data.access));
        setAuthTokens(received_data);
        localStorage.setItem("authTokens", JSON.stringify(received_data));
        localStorage.setItem(
          "user",
          JSON.stringify(jwtDecode(received_data.access))
        );
      } else {
        handleLogout();
      }
    };

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 20); // 20 minutes
    return () => clearInterval(interval); // Clear interval on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authTokens]);


  const contextData = {
    user: user,
    authTokens: authTokens,
    handleLogin: handleLogin,
    handleLogout: handleLogout,
    IsError: IsError,
    setIsError: setIsError
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
