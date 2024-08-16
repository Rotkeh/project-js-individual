"use strict";

import { createGameCard } from "./utils/cards.js";
import { getGamesCustom } from "./utils/api.js";
import { setupAccount } from "./utils/account.js";

/**
 * Initializes the application on window load by setting up event listeners and updating the UI.
 *
 * It performs the following tasks:
 * 1. Sets up a submit event listener on the search form to prevent the default form submission behavior,
 *    capture the search input value, and redirect to the search results page with the input as a query parameter.
 * 2. Calls `setupAccount` to set up account-related UI elements and event handlers.
 * 3. Calls `displayPopular()` to fetch and display popular games on the page.
 */
window.addEventListener("load", () => {
  const form = document.querySelector(".form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let input = document.querySelector(".search-input").value;
    const url = `search.html?search=${encodeURIComponent(input)}`;
    window.location.href = url;
  });

  setupAccount();
  displayPopular();
});

/**
 * Fetches and displays popular games on the page.
 *
 * This asynchronous function retrieves a list of popular games using the `getGamesCustom` function with a sorting option of "popular".
 * It then creates and displays game cards for the first 8 games in the retrieved list by calling `createGameCard` for each game.
 */
async function displayPopular() {
  let games = await getGamesCustom(undefined, undefined, "popular");
  for (let i = 0; i < 8; i++) {
    createGameCard(games[i]);
  }
}
