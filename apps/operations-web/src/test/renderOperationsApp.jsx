import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OperationsRoutes } from "../App.jsx";

export function renderOperationsApp(initialEntry = "/", { role } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <OperationsRoutes role={role} />
    </MemoryRouter>,
  );
}
