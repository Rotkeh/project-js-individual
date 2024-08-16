import { isLoggedIn, getActiveUser } from "./storage.js";

/**
 * Displays a login form overlay on the page.
 *
 * This function creates and appends a login form overlay with input fields for username and password.
 * It also provides a cancel button to close the form and handles the login process when the form is submitted.
 * The login process includes validating the user's credentials and updating the UI accordingly. If the login
 * is successful, the overlay is removed; if not, an error message is displayed.
 */
export function showLogin() {
  const mainRef = document.querySelector("main");

  let formContainer = document.createElement("section");
  formContainer.classList.add("form-container");

  let form = document.createElement("form");

  let cancelButton = document.createElement("p");
  cancelButton.classList.add("cancel-button");
  cancelButton.textContent = "X";
  cancelButton.addEventListener("click", () => {
    grayOut.remove();
    formContainer.remove();
  });
  form.appendChild(cancelButton);

  let formHeader = document.createElement("h3");
  formHeader.textContent = "Login";
  form.appendChild(formHeader);

  let errorMsg = document.createElement("p");
  errorMsg.classList.add("error-message");
  errorMsg.classList.add("d-none");
  form.appendChild(errorMsg);

  let formDiv1 = document.createElement("div");
  let formUsernameLabel = document.createElement("label");
  formUsernameLabel.textContent = "Username";
  let formUsernameInput = document.createElement("input");
  formUsernameInput.setAttribute("type", "text");
  formUsernameInput.setAttribute("id", "formUsernameInput");
  formDiv1.appendChild(formUsernameLabel);
  formDiv1.appendChild(formUsernameInput);
  form.appendChild(formDiv1);

  let formDiv2 = document.createElement("div");
  let formPasswordLabel = document.createElement("label");
  formPasswordLabel.textContent = "Password";
  let formPasswordInput = document.createElement("input");
  formPasswordInput.setAttribute("type", "password");
  formPasswordInput.setAttribute("id", "formPasswordInput");
  formDiv2.appendChild(formPasswordLabel);
  formDiv2.appendChild(formPasswordInput);
  form.appendChild(formDiv2);

  let formLoginButton = document.createElement("button");
  formLoginButton.textContent = "Login";
  formLoginButton.setAttribute("type", "submit");
  form.appendChild(formLoginButton);

  formContainer.appendChild(form);

  let grayOut = document.createElement("div");
  grayOut.classList.add("gray-out");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let anwser = loginUser(form);
    if (anwser === true) {
      grayOut.remove();
      formContainer.remove();
      updateButtons();
      location.reload();
    } else {
      errorMsg.textContent = anwser;
      errorMsg.classList.remove("d-none");
    }
  });

  mainRef.appendChild(grayOut);
  mainRef.appendChild(formContainer);
}

/**
 * Displays a registration form overlay on the page.
 *
 * This function creates and appends a registration form overlay with input fields for username, email, password, and password confirmation.
 * It also provides a cancel button to close the form and handles the registration process when the form is submitted.
 * The registration process includes validating the input, creating a new user, and redirecting to the login form if registration is successful.
 */
export function showRegister() {
  const mainRef = document.querySelector("main");

  let formContainer = document.createElement("section");
  formContainer.classList.add("form-container");

  let form = document.createElement("form");

  let cancelButton = document.createElement("p");
  cancelButton.classList.add("cancel-button");
  cancelButton.textContent = "X";
  cancelButton.addEventListener("click", () => {
    grayOut.remove();
    formContainer.remove();
  });
  form.appendChild(cancelButton);

  let formHeader = document.createElement("h3");
  formHeader.textContent = "Register";
  form.appendChild(formHeader);

  let errorMsg = document.createElement("p");
  errorMsg.classList.add("error-message");
  errorMsg.classList.add("d-none");
  form.appendChild(errorMsg);

  let formDiv1 = document.createElement("div");
  let formUsernameLabel = document.createElement("label");
  formUsernameLabel.textContent = "Username";
  let formUsernameInput = document.createElement("input");
  formUsernameInput.setAttribute("type", "text");
  formUsernameInput.setAttribute("id", "formUsernameInput");
  formDiv1.appendChild(formUsernameLabel);
  formDiv1.appendChild(formUsernameInput);
  form.appendChild(formDiv1);

  let formDiv2 = document.createElement("div");
  let formEmailLabel = document.createElement("label");
  formEmailLabel.textContent = "Email";
  let formEmailInput = document.createElement("input");
  formEmailInput.setAttribute("type", "text");
  formEmailInput.setAttribute("id", "formEmailInput");
  formDiv2.appendChild(formEmailLabel);
  formDiv2.appendChild(formEmailInput);
  form.appendChild(formDiv2);

  let formDiv3 = document.createElement("div");
  let formPasswordLabel = document.createElement("label");
  formPasswordLabel.textContent = "Password";
  let formPasswordInput = document.createElement("input");
  formPasswordInput.setAttribute("type", "password");
  formPasswordInput.setAttribute("id", "formPasswordInput");
  formDiv3.appendChild(formPasswordLabel);
  formDiv3.appendChild(formPasswordInput);
  form.appendChild(formDiv3);

  let formDiv4 = document.createElement("div");
  let formConfirmPasswordLabel = document.createElement("label");
  formConfirmPasswordLabel.textContent = "Confirm Password";
  let formConfirmPasswordInput = document.createElement("input");
  formConfirmPasswordInput.setAttribute("type", "password");
  formConfirmPasswordInput.setAttribute("id", "formConfirmPasswordInput");
  formDiv4.appendChild(formConfirmPasswordLabel);
  formDiv4.appendChild(formConfirmPasswordInput);
  form.appendChild(formDiv4);

  let formRegisterButton = document.createElement("button");
  formRegisterButton.textContent = "Register";
  formRegisterButton.setAttribute("type", "submit");
  form.appendChild(formRegisterButton);

  let grayOut = document.createElement("div");
  grayOut.classList.add("gray-out");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let anwser = registerUser(form);
    if (anwser === true) {
      grayOut.remove();
      formContainer.remove();
      showLogin();
    } else {
      errorMsg.textContent = anwser;
      errorMsg.classList.remove("d-none");
    }
  });

  formContainer.appendChild(form);

  mainRef.appendChild(grayOut);
  mainRef.appendChild(formContainer);
}

/**
 * Sets up event listeners for account-related actions.
 *
 * This function handles setting up the functionality for the register, login, and saved games buttons.
 * - The register button directs logged-in users to the user page or shows the registration form for guests.
 * - The login button either logs out the user or shows the login form based on their current login status.
 * - The saved games button prevents access to the saved games page for guests and prompts them to log in instead.
 * Finally, it ensures the correct buttons are displayed based on the current user’s login status.
 */
export function setupAccount() {
  const registerButton = document.querySelector(".register_button");
  registerButton.addEventListener("click", () => {
    if (isLoggedIn()) {
      window.location.href = "user.html";
    } else {
      showRegister();
    }
  });

  const loginButton = document.querySelector(".login_button");
  loginButton.addEventListener("click", () => {
    if (isLoggedIn()) {
      logOutUser();
      updateButtons();
      if (document.title === "Account" || document.title === "Saved") {
        window.location.href = "index.html";
      }
    } else {
      showLogin();
    }
  });

  const saveNav = document.querySelector(".saved-nav");
  saveNav.addEventListener("click", (event) => {
    if (!isLoggedIn()) {
      event.preventDefault();
      alert("log in to see saved games");
    }
  });

  updateButtons();
}

/**
 * Registers a new user by validating form input and storing user details.
 *
 * This function performs the following actions:
 * - Retrieves user input from the form fields.
 * - Validates the username, email, and password using respective validation functions.
 * - If all validations pass, creates a new user object and adds it to the list of users stored in local storage.
 * - If any validation fails, an appropriate error message is returned.
 *
 * @param {HTMLFormElement} form - The form element containing user input.
 * @returns {boolean|string} - Returns `true` if registration is successful. If any validation fails, returns the error message.
 */
export function registerUser(form) {
  try {
    let email = form.formEmailInput.value;
    let username = form.formUsernameInput.value;
    let password = form.formPasswordInput.value;
    let confirmPassword = form.formConfirmPasswordInput.value;
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let usernameVal = validiateUsername(username, users);
    let emailVal = validateEmail(email, users);
    let passwordVal = validatePassword(password, confirmPassword);
    if (usernameVal !== true) {
      throw new Error(usernameVal);
    } else if (emailVal !== true) {
      throw new Error(emailVal);
    } else if (passwordVal !== true) {
      throw new Error(passwordVal);
    } else {
      let newUser = {
        email: email,
        username: username,
        password: password,
        saved: [],
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      return true;
    }
  } catch (error) {
    return error.message;
  }
}

/**
 * Validates the provided username based on specific criteria.
 *
 * This function checks if the username:
 * - Contains at least 6 characters
 * - Is not already taken by another user
 *
 * If any of these criteria are not met, an appropriate error message is returned.
 *
 * @param {string} username - The username to be validated.
 * @param {Object[]} users - An array of user objects containing usernames.
 * @returns {boolean|string} - Returns `true` if the username is valid. If validation fails, returns the error message.
 */
export function validiateUsername(username, users) {
  try {
    if (username.length < 6) {
      throw new Error("Username must contain at least 6 characters");
    } else if (users.some((user) => user.username === username)) {
      throw new Error("User already exist");
    } else {
      return true;
    }
  } catch (error) {
    return error.message;
  }
}

/**
 * Validates the provided email address based on specific criteria.
 *
 * This function checks if the email address:
 * - Contains the "@" character
 * - Is not already in use by another user
 *
 * If any of these criteria are not met, an appropriate error message is returned.
 *
 * @param {string} email - The email address to be validated.
 * @param {Object[]} users - An array of user objects containing email addresses.
 * @returns {boolean|string} - Returns `true` if the email is valid. If validation fails, returns the error message.
 */
export function validateEmail(email, users) {
  try {
    if (!email.includes("@")) {
      throw new Error("Enter a valid email address");
    } else if (users.some((user) => user.email === email)) {
      throw new Error("Email already in use");
    } else {
      return true;
    }
  } catch (error) {
    return error.message;
  }
}

/**
 * Validates the provided password and its confirmation based on specific criteria.
 *
 * This function checks if the password meets the following requirements:
 * - At least 8 characters long
 * - Contains at least 1 uppercase letter
 * - Contains at least 1 number
 * - Contains at least 1 special character
 * - Matches the confirmation password
 *
 * If any of these criteria are not met, an appropriate error message is returned.
 *
 * @param {string} password - The password to be validated.
 * @param {string} confirmPassword - The confirmation password to match against.
 * @returns {boolean|string} - Returns `true` if the password is valid. If validation fails, returns the error message.
 */
export function validatePassword(password, confirmPassword) {
  try {
    if (password.length < 8) {
      throw new Error("Password must contain at least 8 characters");
    } else if (!containsUppercase(password)) {
      throw new Error("Password must contain at least 1 upper case character");
    } else if (!containsNumber(password)) {
      throw new Error("Password must contain at least 1 special character");
    } else if (!containsSpecialCharacter(password)) {
      throw new Error("Password must contain at least 1 special character");
    } else if (password !== confirmPassword) {
      throw new Error("Password does not match");
    } else {
      return true;
    }
  } catch (error) {
    return error.message;
  }
}

/**
 * Authenticates a user based on the provided login form details.
 *
 * This function verifies the username and password from the form. If successful, it sets the user
 * as the active user in local storage. If authentication fails, an error message is returned.
 *
 * @param {HTMLFormElement} form - The login form element containing username and password fields.
 * @returns {boolean|string} - Returns `true` if the login is successful. If an error occurs, returns the error message.
 */
export function loginUser(form) {
  try {
    let username = form.formUsernameInput.value;
    let password = form.formPasswordInput.value;
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((user) => user.username === username)) {
      let user = users.find((user) => user.username === username);
      if (user.password === password) {
        localStorage.setItem("activeUser", JSON.stringify(user));
        return true;
      } else {
        throw new Error("Incorrect password");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    return error.message;
  }
}

/**
 * Logs out the current user by removing the active user from local storage and updating the UI.
 *
 * - Removes the "activeUser" item from local storage.
 * - Calls `updateButtons()` to refresh the UI based on the updated login state.
 */
export function logOutUser() {
  localStorage.removeItem("activeUser");
  updateButtons();
}

/**
 * Updates the text content of the register and login buttons based on the user's login status.
 *
 * - If the user is logged in:
 *   - The register button displays the username of the active user.
 *   - The login button changes to "Logout".
 * - If the user is not logged in:
 *   - The register button displays "Register".
 *   - The login button displays "Login".
 */
export function updateButtons() {
  if (isLoggedIn()) {
    document.querySelector(".register_button").textContent =
      getActiveUser().username;
    document.querySelector(".login_button").textContent = "Logout";
  } else {
    document.querySelector(".register_button").textContent = "Register";
    document.querySelector(".login_button").textContent = "Login";
  }
}

/**
 * Checks if a given string contains at least one uppercase letter.
 *
 * @param {string} word - The string to check for uppercase letters.
 * @returns {boolean} - Returns `true` if the string contains an uppercase letter; otherwise, `false`.
 */
export function containsUppercase(word) {
  return /[A-Z]/.test(word);
}

/**
 * Checks if a given string contains at least one special character.
 *
 * Special characters include: `! @ # $ % ^ & * ( ) , . ? " : { } | < >`.
 *
 * @param {string} word - The string to check for special characters.
 * @returns {boolean} - Returns `true` if the string contains a special character; otherwise, `false`.
 */
export function containsSpecialCharacter(word) {
  return /[!@#$%^&*(),.?":{}|<>]/.test(word);
}

/**
 * Checks if a given string contains at least one numeric digit.
 *
 * @param {string} word - The string to check for digits.
 * @returns {boolean} - Returns `true` if the string contains a digit; otherwise, `false`.
 */
export function containsNumber(word) {
  return /\d/.test(word);
}

/**
 * Updates the current user's details based on the input from the provided form.
 *
 * This function validates and updates the user's username, email, and password.
 * If any validation fails, an error message is returned.
 *
 * @param {HTMLFormElement} form - The form element containing user input fields.
 * @returns {boolean|string} - Returns `true` if the user details are successfully updated.
 * If an error occurs during validation or update, returns the error message.
 */
export function updateUser(form) {
  try {
    let username = form.inputUsername.value;
    let email = form.inputEmail.value;
    let password = form.inputPassword.value;
    let confirmPassword = form.inputConfirmPassword.value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = getActiveUser();
    let index = users.findIndex((u) => u.username == user.username);

    if (username) {
      let usernameVal = validiateUsername(username, users);
      if (usernameVal === true) {
        user.username = username;
      } else {
        throw new Error(usernameVal);
      }
    }
    if (email) {
      let emailVal = validateEmail(email, users);
      if (emailVal === true) {
        user.email = email;
      } else {
        throw new Error(emailVal);
      }
    }
    if (password) {
      let passwordVal = validatePassword(password, confirmPassword);
      if (passwordVal === true) {
        user.password = password;
      } else {
        throw new Error(passwordVal);
      }
    }
    users.splice(index, 1, user);
    localStorage.setItem("activeUser", JSON.stringify(user));
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  } catch (error) {
    return error.message;
  }
}
