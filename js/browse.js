"use strict";

import { clearCards, setupPageIndex, showGames } from "./utils/cards.js";
import { getGamesCustom } from "./utils/api.js";
import { setupAccount } from "./utils/account.js";

/**
 * Initializes the application on window load by setting up event listeners and updating the UI.
 *
 * It performs the following tasks:
 * 1. Adds an event listener to all `<select>` elements. When the value of a select element changes, the `updateCards` function is called to refresh the game cards based on the new selection.
 * 2. Calls `setupPageIndex` to initialize page index controls.
 * 3. Calls `setupAccount` to set up account-related UI elements and event handlers.
 * 4. Calls `updateCards` to load and display the initial set of game cards based on the default filter selections.
 */
window.addEventListener("load", () => {
  let selectors = document.querySelectorAll("select");
  selectors.forEach((select) => {
    select.addEventListener("change", function (event) {
      event.preventDefault();
      updateCards();
    });
  });

  setupPageIndex();
  setupAccount();
  updateCards();
});

/**
 * Updates the displayed game cards based on the selected platform, genre, and sorting option.
 *
 * This function performs the following actions:
 * - Retrieves the current values for platform, genre, and sort from the select elements.
 * - Fetches a list of games using the `getGamesCustom` function with the selected filters.
 * - Clears the existing game cards using the `clearCards` function.
 * - Displays the newly fetched games using the `showGames` function.
 */
async function updateCards() {
  let platform = document.querySelector(".platform-select").value;
  let genre = document.querySelector(".genre-select").value;
  let sort = document.querySelector(".sort-select").value;
  let selectedGames = await getGamesCustom(platform, genre, sort);

  clearCards();
  showGames(selectedGames);
}
