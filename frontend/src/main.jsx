import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

console.log("[main] loaded");

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
