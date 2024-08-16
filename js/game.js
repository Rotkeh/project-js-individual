"use strict";

import { createGameCard } from "./utils/cards.js";
import { getGamesCustom, getGameFromId } from "./utils/api.js";
import {
  getGameStatus,
  isSaved,
  changeSavedStatus,
  removeFromSaved,
  addGameToSaved,
  isLoggedIn,
} from "./utils/storage.js";
import { setupAccount } from "./utils/account.js";

/**
 * Initializes the application on window load by setting up event listeners and updating the UI.
 *
 * It performs the following tasks:
 * 1. Calls `setupAccount` to set up account-related UI elements and event handlers.
 * 2. Calls `displayGame` to display detailed information about a specific game on the page.
 * 3. Calls `displaySimiliar` to display similar games to the one shown on the page.
 */
window.addEventListener("load", () => {
  setupAccount();
  displayGame();
  displaySimiliar();
});

/**
 * Retrieves game information based on the `gameId` parameter from the current URL.
 *
 * This function extracts the `gameId` query parameter from the URL, then fetches the game details using the `getGameFromId` function.
 * It returns the game object retrieved from the API.
 *
 * @returns {Promise<Object>} Game object.
 */
async function getGameFromUrl() {
  let gameId = new URLSearchParams(window.location.search).get("gameId");
  let game = await getGameFromId(gameId);
  return game;
}

/**
 * Displays a list of similar games to the currently viewed game.
 *
 * This function retrieves the current game information using the `getGameFromUrl` function, fetches similar games with `getSimiliarGames`,
 * and then creates and displays cards for up to 4 games that are similar, excluding the currently viewed game.
 */
async function displaySimiliar() {
  let game = await getGameFromUrl();
  let games = await getSimiliarGames(game);
  let index = 0;
  let created = 0;
  while (games.length > index && created < 4) {
    if (games[index].id != game.id) {
      createGameCard(games[index]);
      created++;
    }
    index++;
  }
}

/**
 * Retrieves a list of games similar to the specified game based on genre and platform.
 *
 * This function fetches a list of games sorted by relevance using the `getGamesCustom` function, then filters this list based on
 * the genre and platform of the provided game.
 *
 * @param {Object} game - The game object to find similar games for.
 * @returns {Promise<Array>} An array of similar games.
 */
async function getSimiliarGames(game) {
  let genre = game.genre;
  let platform = game.platform;

  let games = await getGamesCustom(undefined, undefined, "relevance");

  if (platform.length > 11) {
    games = games.filter((g) => g.genre == genre);
  } else {
    if (platform == "Windows") {
      platform = "PC (Windows)";
    }
    games = games.filter((g) => g.platform == platform && g.genre == genre);
  }
  return games;
}

/**
 * Displays detailed information about a game on the webpage.
 *
 * This function retrieves the game details from the URL using the `getGameFromUrl` function, then updates various elements on the
 * page to show information about the game, including its image, title, genre, platform, developer, publisher, release date, and description.
 * It also creates and updates a save status dropdown menu and button that allow users to save the game with a specific status.
 */
async function displayGame() {
  let game = await getGameFromUrl();
  document.title = game.title;

  let gameImg = document.querySelector(".game-figure_image");
  gameImg.setAttribute("src", game.thumbnail);

  let gameTitle = document.querySelector(".game_title");
  gameTitle.textContent = game.title;

  let gameUrl = document.querySelector(".game_url");
  gameUrl.setAttribute("href", game.game_url);

  let gameGenre = document.querySelector(".game_genre");
  gameGenre.textContent = `Genre: ${game.genre}`;

  let gamePlatform = document.querySelector(".game_platform");
  gamePlatform.textContent = `Platform: ${game.platform}`;

  let gameDeveloper = document.querySelector(".game_developer");
  gameDeveloper.textContent = `Developer: ${game.developer}`;

  let gamePublisher = document.querySelector(".game_publisher");
  gamePublisher.textContent = `Publisher: ${game.publisher}`;

  let gameReleaseDate = document.querySelector(".game_release-date");
  gameReleaseDate.textContent = `Released: ${game.release_date}`;

  let gameDescription = document.querySelector(".game_description");
  gameDescription.innerHTML = game.description;

  let divSave = document.createElement("div");

  let gameSaveStatus = document.createElement("select");

  let gameSaveStatusFavourite = document.createElement("option");
  gameSaveStatusFavourite.textContent = "Favourite";
  gameSaveStatusFavourite.value = "favourite";

  let gameSaveStatusInterested = document.createElement("option");
  gameSaveStatusInterested.textContent = "Interested";
  gameSaveStatusInterested.value = "interested";

  let gameSaveStatusPlayed = document.createElement("option");
  gameSaveStatusPlayed.textContent = "Played";
  gameSaveStatusPlayed.value = "played";

  gameSaveStatus.appendChild(gameSaveStatusFavourite);
  gameSaveStatus.appendChild(gameSaveStatusInterested);
  gameSaveStatus.appendChild(gameSaveStatusPlayed);

  gameSaveStatus.addEventListener("change", function (event) {
    event.preventDefault();
    changeSavedStatus(game, gameSaveStatus.value);
  });

  divSave.appendChild(gameSaveStatus);

  let gameSaveButton = document.createElement("p");
  gameSaveButton.classList.add("save-button");

  if (isLoggedIn()) {
    let gameStatus = getGameStatus(game);
    if (gameStatus) {
      gameSaveStatus.value = gameStatus;
      gameSaveButton.textContent = "Saved";
      gameSaveButton.classList.add("saved-button");
    } else {
      gameSaveButton.textContent = "Save";
    }
  } else {
    gameSaveButton.textContent = "Save";
  }

  gameSaveButton.addEventListener("mouseover", () => {
    if (isLoggedIn()) {
      if (isSaved(game)) {
        gameSaveButton.textContent = "Remove";
      }
    }
  });

  gameSaveButton.addEventListener("mouseout", () => {
    if (isLoggedIn()) {
      if (isSaved(game)) {
        gameSaveButton.textContent = "Saved";
      }
    }
  });

  gameSaveButton.addEventListener("click", () => {
    if (isLoggedIn()) {
      let status = gameSaveStatus.value;
      if (isSaved(game)) {
        removeFromSaved(game);
        gameSaveButton.textContent = "Save";
        gameSaveButton.classList.remove("saved-button");
      } else {
        addGameToSaved(status, game);
        gameSaveStatus.value = status;
        gameSaveButton.textContent = "Saved";
        gameSaveButton.classList.add("saved-button");
      }
    } else {
      alert("log in to use this feature");
    }
  });

  divSave.appendChild(gameSaveButton);

  let gameFigure = document.querySelector(".game-figure");
  gameFigure.appendChild(divSave);

  const gameScreenShotsRef = document.querySelector(".game_screenshots");

  for (let i = 0; i < Math.min(3, game.screenshots.length); i++) {
    let screenshot = document.createElement("img");
    screenshot.classList.add("screenshot");
    screenshot.setAttribute("src", game.screenshots[i].image);
    gameScreenShotsRef.appendChild(screenshot);
  }
}
