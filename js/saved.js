"use strict";

import { setupPageIndex, showGames, clearCards } from "./utils/cards.js";
import { getSavedGames } from "./utils/storage.js";
import { setupAccount } from "./utils/account.js";

/**
 * Initializes the application on window load by setting up event listeners and updating the UI.
 *
 * It performs the following tasks:
 * 1. Sets up a change event listener on each `.filter-select` dropdown to call `showSaved()` whenever
 *    the filter value changes, updating the displayed saved games based on the selected filter.
 * 2. Sets up a submit event listener on the `.browse-form` form to call `showSaved()` when the form is
 *    submitted, updating the displayed saved games based on the search input and filter criteria.
 * 3. Calls `setupPageIndex` to initialize page index controls.
 * 4. Calls `setupAccount` to set up account-related UI elements and event handlers.
 * 5. Calls `showSaved()` to display the saved games on page load based on current search and filter settings.
 */
window.addEventListener("load", () => {
  const filter = document.querySelectorAll(".filter-select");

  filter.forEach((select) => {
    select.addEventListener("change", function (event) {
      event.preventDefault();
      showSaved();
    });
  });

  const form = document.querySelector(".form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showSaved();
  });

  setupPageIndex();
  setupAccount();
  showSaved();
});

/**
 * Displays the list of saved games based on the selected filter and search input.
 *
 * This function retrieves the saved games from the user's saved list, applies a filter based on the selected
 * filter criteria, and optionally applies a search term to further refine the list. It then displays the filtered
 * and searched list of games by calling the `showGames` function.
 */
function showSaved() {
  let saved = getSavedGames();

  clearCards();

  let games = [];
  let filter = document.querySelector(".filter-select").value;
  if (filter != "all") {
    let filteredSaved = saved.filter((save) => save.status == filter);
    games = filteredSaved.map((save) => save.game);
  } else {
    games = saved.map((save) => save.game);
  }

  let input = document.querySelector(".search-input").value;
  if (input) {
    games = games.filter((game) =>
      game.title.toLowerCase().includes(input.toLowerCase())
    );
  }
  showGames(games);
}
