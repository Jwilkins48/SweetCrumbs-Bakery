// Trim strings
export const trimString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim();
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password length
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate positive number
export const isPositiveNumber = (val) => {
  return !isNaN(val) && parseFloat(val) > 0;
};

// Validate positive integer
export const isPositiveInteger = (val) => {
  return !isNaN(val) && parseInt(val) > 0 && Number.isInteger(parseFloat(val));
};

// Validate all string fields
export const validateBody = (req, res, next) => {
  if (req.body) {
    // Loop through string fields
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = trimString(req.body[key]);
      }
    });
  }
  next();
};

// Validate register
export const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  // Check for email and password
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  // validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please provide valid email" });
  }

  // validate password length
  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  next();
};

// validate product input
export const validateProduct = (req, res, next) => {
  const { name, description, price, category, quantity } = req.body;

  // Check required fields
  if (!name || !description || !price || !category || !quantity) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  // validate price is positive
  if (!isPositiveNumber(price)) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  // validate quantity is positive
  if (!isPositiveInteger(quantity)) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive integer" });
  }

  next();
};
