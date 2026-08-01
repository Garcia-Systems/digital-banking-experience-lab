let consoleError;
let consoleWarn;

beforeEach(() => {
  consoleError = jest.spyOn(console, "error");
  consoleWarn = jest.spyOn(console, "warn");
});

afterEach(() => {
  try {
    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  } finally {
    consoleError.mockRestore();
    consoleWarn.mockRestore();
  }
});
