import "../style/css/Layout.css";
import { Suspense } from "react";
import Navbar from "../Components/Navbar";
import Layout from "../Components/Layout/Layout";
import AboutUS from "../Components/AboutUS";
import Services from "../Components/Services";
import { AuthProvider } from "../Contexts/AuthContext";

export default function Home() {
  return (
    <>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar/>
          <Layout />;
          <AboutUS />;
          <Services/>;
        </Suspense>
      </AuthProvider>
    </>
  );
}
