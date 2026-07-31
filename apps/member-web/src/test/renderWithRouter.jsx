import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export function renderWithRouter(ui, { route = "/" } = {}) {
  const result = render(
    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>,
  );

  return {
    ...result,
    rerender(nextUi) {
      result.rerender(
        <MemoryRouter initialEntries={[route]}>{nextUi}</MemoryRouter>,
      );
    },
  };
}
