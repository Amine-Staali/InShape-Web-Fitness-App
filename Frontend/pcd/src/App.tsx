import React from "react";
import "./App.css";
import { Routes, Route } from "react-router";
const Home = React.lazy(() => import("./Pages/Home"));
const TopLeftBars = React.lazy(
  () => import("./Components/decorative_elements/TopLeftBars")
);
const BottomRightBars = React.lazy(
  () => import("./Components/decorative_elements/BottomRightBars")
);
const Dots = React.lazy(() => import("./Components/decorative_elements/Dots"));
const Profile = React.lazy(() => import("./Pages/Profile"));
const Account = React.lazy(
  () => import("./Components/account_management/Account")
);
import { useContext, Suspense } from "react";
import { AuthContext } from "./Contexts/AuthContext";
import { UserInfosProvider } from "./Contexts/UserInfosContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopLeftBars />
      <div className="blur-orange" style={{ top: "0", left: "-100px" }}></div>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          }
        />

        {user ? (
          <Route
            path="/Profile/"
            element={
              <UserInfosProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Profile />
                </Suspense>
              </UserInfosProvider>
            }
          />
        ) : (
          <Route path="/Profile/" element={<Home />} />
        )}
        {!user ? (
          <Route
            path="/Accounts/"
            element={
              <UserInfosProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Account />
                </Suspense>
              </UserInfosProvider>
            }
          />
        ) : (
          <Route path="/Accounts/" element={<Home />} />
        )}
      </Routes>
      <div
        className="blur-orange"
        style={{ bottom: "-100px", right: "0" }}
      ></div>
      <BottomRightBars />
      <Dots />
    </Suspense>
  );
}

export default App;
