let consoleError;
let consoleWarn;

beforeEach(() => {
  consoleError = jest.spyOn(console, "error");
  consoleWarn = jest.spyOn(console, "warn");
});

afterEach(() => {
  expect(consoleError).not.toHaveBeenCalled();
  expect(consoleWarn).not.toHaveBeenCalled();
  consoleError.mockRestore();
  consoleWarn.mockRestore();
});
