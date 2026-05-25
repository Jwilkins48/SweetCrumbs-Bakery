import {
  trimString,
  isValidEmail,
  isValidPassword,
  isPositiveNumber,
  isNonNegativeInteger,
} from "../middleware/validationMiddleware.js";

// trimString
describe("trimString", () => {
  test("Trim leading and trailing spaces", () => {
    expect(trimString(" hello ")).toBe("hello");
  });

  test("Return non string values unchanged", () => {
    expect(trimString(123)).toBe(123);
  });

  test("Handle empty string", () => {
    expect(trimString("")).toBe("");
  });
});

// isValidEmail
describe("isValidEmail", () => {
  test("Return true for valid email", () => {
    expect(isValidEmail("test@test.com")).toBe(true);
  });

  test("Return false for email missing @", () => {
    expect(isValidEmail("testtest.com")).toBe(false);
  });

  test("Return false for email missing domain", () => {
    expect(isValidEmail("test@")).toBe(false);
  });

  test("Return false for email empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

// isValidPassword
describe("isValidPassword", () => {
  test("Return true for password with 6 characters or more", () => {
    expect(isValidPassword("password123")).toBe(true);
  });

  test("Return false for password less than 6 characters", () => {
    expect(isValidPassword("123")).toBe(false);
  });

  test("Return false for empty string", () => {
    expect(isValidPassword("")).toBe(false);
  });
});

// isPositiveNumber
describe("isPositiveNumber", () => {
  test("Return true for positive number", () => {
    expect(isPositiveNumber(10.99)).toBe(true);
  });

  test("Return false for zero", () => {
    expect(isPositiveNumber(0)).toBe(false);
  });

  test("Return false for negative number", () => {
    expect(isPositiveNumber(-10)).toBe(false);
  });
});

// isNonNegativeInteger
describe("isNonNegativeInteger", () => {
  test("Return true for positive integer", () => {
    expect(isNonNegativeInteger(6)).toBe(true);
  });

  test("Return true for zero", () => {
    expect(isNonNegativeInteger(0)).toBe(true);
  });

  test("Return false for negative integer", () => {
    expect(isNonNegativeInteger(-1)).toBe(false);
  });

  test("Return false for decimal number", () => {
    expect(isNonNegativeInteger(1.5)).toBe(false);
  });
});
