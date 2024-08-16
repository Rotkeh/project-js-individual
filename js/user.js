"use strict";

import { getActiveUser } from "./utils/storage.js";
import { setupAccount, updateButtons, updateUser } from "./utils/account.js";

/**
 * Initializes the application on window load by setting up event listeners and updating the UI.
 *
 * It performs the following tasks:
 * 1. Sets up a submit event listener on the user details form to prevent the default form submission behavior,
 *    capture the form data, and update the active user's information using `updateUser()`.
 *    - If the update is successful, hides any error messages, clears the form inputs, and updates the account-related buttons.
 *    - If the update fails, displays the error message.
 * 2. Calls `setupAccount` to configure account-related UI elements and event handlers.
 * 3. Calls `displayUserDetails()` to fetch and display the details of the currently active user.
 */
window.addEventListener("load", () => {
  const saveFormRef = document.querySelector(".user_details-form");
  saveFormRef.addEventListener("submit", (event) => {
    event.preventDefault();

    const errorMsg = document.querySelector(".save_error-message");

    let anwser = updateUser(saveFormRef);
    if (anwser == true) {
      errorMsg.classList.add("d-none");
      let inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.value = "";
      });
      updateButtons();
    } else {
      errorMsg.textContent = anwser;
      errorMsg.classList.remove("d-none");
    }
  });

  setupAccount();
  displayUserDetails();
});

/**
 * Displays the details of the currently active user on the page.
 *
 * This function retrieves the active user's information and updates the page with their username and email.
 * It also calls `updateButtons` to ensure the UI reflects the current login state.
 */
function displayUserDetails() {
  let user = getActiveUser();

  let username = document.querySelector(".username");
  username.textContent = user.username;

  let email = document.querySelector(".email");
  email.textContent = user.email;

  updateButtons();
}
