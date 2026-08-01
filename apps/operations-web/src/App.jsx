import { BrowserRouter, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import Dashboard from "./components/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import Members from "./components/Members.jsx";
import TransferDetails from "./components/TransferDetails.jsx";
import Transfers from "./components/Transfers.jsx";
import Unauthorized from "./components/Unauthorized.jsx";

export default function App({ role = "operations-user" }) {
  if (role !== "operations-user") return <Unauthorized />;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="transfers/:transferId" element={<TransferDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

App.propTypes = { role: PropTypes.string };
