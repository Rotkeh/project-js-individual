"use strict";

import { isLoggedIn } from "./storage.js";
import {
  changeSavedStatus,
  getGameStatus,
  isSaved,
  addGameToSaved,
  removeFromSaved,
} from "./storage.js";

// cards indexing
let pageIndex = 1;
let gamesList = [];

// cards index buttons refs
const nextRef = document.querySelector(".next-page");
const previousRef = document.querySelector(".previous-page");

/**
 * Updates the page index controls and displays the current page index.
 *
 * This function enables or disables the "Next" and "Previous" buttons based on the current page index
 * and the total number of results. It also updates the visible page index on the UI.
 *
 * @param {number} results - The total number of results.
 */
export function updateIndex(results) {
  if (results / 20 <= pageIndex) {
    nextRef.classList.add("unclickable");
  } else {
    nextRef.classList.remove("unclickable");
  }
  if (pageIndex === 1) {
    previousRef.classList.add("unclickable");
  } else {
    previousRef.classList.remove("unclickable");
  }
  document.querySelector(".page-index").textContent = pageIndex;
}

/**
 * Clears all card elements from the cards container.
 *
 */
export function clearCards() {
  const cardsRef = document.querySelector(".cards");
  cardsRef.innerHTML = "";
}

/**
 * Displays a list of games and handles page index.
 *
 * Clears existing game cards, and generates new ones based on the current page index.
 *
 * @param {Array<Object>} games - An array of game objects to be displayed.
 */
export function showGames(games) {
  gamesList = games;
  if (games.length > 20) {
    document.querySelector(".pages").classList.remove("d-none");
    updateIndex(games.length);
  } else {
    document.querySelector(".pages").classList.add("d-none");
  }
  clearCards();
  for (
    let i = (pageIndex - 1) * 20;
    i < Math.min(games.length, pageIndex * 20);
    i++
  ) {
    createGameCard(games[i]);
  }
}

/**
 * Creates and displays a game card element with detailed information and controls.
 *
 * The card includes the game's title, thumbnail, release date, platform, genre, developer,
 * short description, and options to save the game in different statuses (e.g., "Favourite", "Interested", "Played").
 * The card also handles user interactions, such as saving the game or navigating to the game's details page.
 * @param {Object} game - The game object containing the data to be displayed.
 * @returns {Promise<void>} A promise that resolves when the card is created and appended to the DOM.
 */
export async function createGameCard(game) {
  const cardsRef = document.querySelector(".cards");
  let card = document.createElement("article");
  card.classList.add("card");

  let cardContent = document.createElement("section");

  let gameTitle = document.createElement("h3");
  gameTitle.textContent = game.title;
  cardContent.appendChild(gameTitle);

  let gameFigure = document.createElement("figure");
  let gameImg = document.createElement("img");
  gameImg.setAttribute("src", game.thumbnail);
  gameFigure.appendChild(gameImg);
  cardContent.appendChild(gameFigure);

  let div1 = document.createElement("div");
  let divRelease = document.createElement("div");
  let releasedText = document.createElement("p");
  releasedText.textContent = "Released:";
  let gameReleased = document.createElement("p");
  gameReleased.textContent = game.release_date;
  divRelease.appendChild(releasedText);
  divRelease.appendChild(gameReleased);
  let gamePlatform = document.createElement("p");
  gamePlatform.textContent = game.platform;
  div1.appendChild(divRelease);
  div1.appendChild(gamePlatform);
  cardContent.appendChild(div1);

  let div2 = document.createElement("div");
  let gameGenre = document.createElement("p");
  gameGenre.textContent = game.genre;
  let divDeveloper = document.createElement("div");
  let developerText = document.createElement("p");
  developerText.textContent = "By:";
  let gameDeveloper = document.createElement("p");
  gameDeveloper.textContent = game.developer;
  divDeveloper.appendChild(developerText);
  divDeveloper.appendChild(gameDeveloper);
  div2.appendChild(divDeveloper);
  div2.appendChild(gameGenre);
  cardContent.appendChild(div2);

  let gameDesc = document.createElement("p");
  gameDesc.textContent = game.short_description;
  cardContent.appendChild(gameDesc);

  let divSave = document.createElement("div");
  divSave.classList.add("save-container");

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

  cardContent.addEventListener("click", () => {
    const url = `game.html?gameId=${encodeURIComponent(game.id)}`;
    window.location.href = url;
  });

  card.appendChild(cardContent);
  card.appendChild(divSave);

  cardsRef.appendChild(card);
}

/**
 * Sets up page indexing controls for navigating through game pages.
 *
 * This function attaches event listeners to the "Next" and "Previous" buttons to update the page index
 * and refresh the displayed list of games. It also updates the page index display initially.
 */
export function setupPageIndex() {
  nextRef.addEventListener("click", () => {
    pageIndex++;
    showGames(gamesList);
  });

  previousRef.addEventListener("click", () => {
    pageIndex--;
    showGames(gamesList);
  });
  updateIndex(0);
}
