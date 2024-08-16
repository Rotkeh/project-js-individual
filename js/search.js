"use strict";

import { showGames, setupPageIndex, clearCards } from "./utils/cards.js";
import { setupAccount } from "./utils/account.js";
import { searchGames } from "./utils/api.js";

/**
 * Initializes the application on window load by setting up event listeners and updating the UI.
 *
 * It performs the following tasks:
 * 1. Sets up a submit event listener on the search form to prevent the default form submission behavior,
 *    capture the search input value, clear any existing game cards, and invoke `showSearched` with the input value.
 * 2. Calls `getSearchFromUrl` to process any search term provided in the URL's query parameters.
 * 3. Calls `setupPageIndex` to initialize page index controls.
 * 4. Calls `setupAccount` to configure account-related UI elements and event handlers.
 */
window.addEventListener("load", () => {
  const form = document.querySelector(".form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    clearCards();
    let input = document.querySelector(".search-input").value;
    showSearched(input);
  });

  setupAccount();
  setupPageIndex();
  getSearchFromUrl();
});

/**
 * Retrieves the search term from the URL and performs a search based on it.
 *
 * This function extracts the search query parameter (`search`) from the current URL. If the search term
 * is found, it invokes the `showSearched` function to perform the search and display the results based on
 * the extracted search term.
 */
function getSearchFromUrl() {
  let searchTerm = new URLSearchParams(window.location.search).get("search");
  if (searchTerm) {
    showSearched(searchTerm);
  }
}

/**
 * Searches for games based on the provided input and displays the results.
 *
 * This function performs a search for games using the given input query. It then updates the UI
 * by displaying the search results. If there are games that match the search criteria, they are shown
 * on the page. If no games match, the display will be updated accordingly.
 *
 * @param {string} input - The search query used to find matching games.
 */
async function showSearched(input) {
  let matched = await searchGames(input);
  showGames(matched);
}
