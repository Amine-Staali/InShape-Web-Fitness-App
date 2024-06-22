import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./Contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router basename="">
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
