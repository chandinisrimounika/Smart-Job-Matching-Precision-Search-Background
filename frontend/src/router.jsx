import { createBrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import CreateCandidate from "./pages/CreateCandidate";

export default createBrowserRouter([
  { path: "/", element: <Search /> },
  { path: "/create-candidate", element: <CreateCandidate /> }
]);