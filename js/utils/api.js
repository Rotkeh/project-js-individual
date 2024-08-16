// set api key here
const apiKey = "";

/**
 * Fetches a list of games based on the specified platform, genre, and sorting criteria.
 *
 * This asynchronous function constructs a URL with query parameters for the game platform,
 * genre, and sorting options, then makes a GET request to the MMO Games API.
 *
 * @param {string} [platform="all"] - The platform to filter games. Defaults to "all".
 * @param {string} [genre="All"] - The genre to filter games by. Defaults to "All".
 * @param {string} [sort="relevance"] - The sorting criteria for the games. Defaults to "relevance".
 * @returns {Promise<Array<Object>>} - An array of game objects.
 */
export async function getGamesCustom(
  platform = "all",
  genre = "All",
  sort = "relevance"
) {
  let url = `https://mmo-games.p.rapidapi.com/games?platform=${platform}`;

  if (genre !== "All") {
    url += `&category=${genre}`;
  }

  if (sort === "release-date-old") {
    url += `&sort-by=release-date`;
  } else {
    url += `&sort-by=${sort}`;
  }

  try {
    let resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "mmo-games.p.rapidapi.com",
        "x-rapidapi-key": `${apiKey}`,
      },
    });
    let games = await resp.json();

    if (sort === "release-date-old" && Array.isArray(games)) {
      games.reverse();
    }

    return games;
  } catch (error) {
    alert("something went wrong when trying to recieve data from the api");
    console.log(error);
  }
}

/**
 * Searches for games based on a user-provided input, platform, and release year filters.
 *
 * This asynchronous function fetches a list of all games from the MMO Games API and then filters them
 * based on the search input, platform, and release year. It supports different combinations of filters
 * (e.g., platform-only, year-only, or both). The search matches games whose titles include the input
 * text, and optionally filters by platform and/or release year.
 *
 * @param {string} input - The search text input used to match game titles.
 * @returns {Promise<Array<Object>>} - An array of game objects.
 */
export async function searchGames(input) {
  try {
    let resp = await fetch("https://mmo-games.p.rapidapi.com/games", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "mmo-games.p.rapidapi.com",
        "x-rapidapi-key": `${apiKey}`,
      },
    });

    let games = await resp.json();
    let matched = [];
    let searchPlatform = document.querySelector(".platforms").value;
    let searchYear = document.querySelector(".search-year").value;

    switch (true) {
      case searchPlatform === "all" && searchYear === "": {
        games.forEach((game) => {
          if (game.title.toLowerCase().includes(input.toLowerCase())) {
            matched.push(game);
          }
        });
        break;
      }
      case searchPlatform !== "all" && searchYear === "": {
        games.forEach((game) => {
          if (
            game.platform == searchPlatform &&
            game.title.toLowerCase().includes(input.toLowerCase())
          ) {
            matched.push(game);
          }
        });
        break;
      }
      case searchPlatform === "all" && searchYear !== "": {
        games.forEach((game) => {
          if (
            game.release_date.substring(0, 4) >= searchYear &&
            game.title.toLowerCase().includes(input.toLowerCase())
          ) {
            matched.push(game);
          }
        });
        break;
      }
      case searchPlatform !== "all" && searchYear !== "": {
        games.forEach((game) => {
          if (
            game.platform == searchPlatform &&
            game.release_date.substring(0, 4) >= searchYear &&
            game.title.toLowerCase().includes(input.toLowerCase())
          ) {
            matched.push(game);
          }
        });
        break;
      }
    }

    return matched;
  } catch (error) {
    alert("something went wrong when trying to recieve data from the api");
    console.log(error);
  }
}

/**
 * Fetches detailed information about a game based on its ID.
 *
 * This asynchronous function sends a GET request to the MMO Games API to retrieve detailed
 * information about a specific game using the provided game ID.
 *
 * @param {number|string} id - The unique ID of the game to retrieve.
 * @returns {Promise<Object>} - Game objects.
 */
export async function getGameFromId(id) {
  try {
    let resp = await fetch(`https://mmo-games.p.rapidapi.com/game?id=${id}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "mmo-games.p.rapidapi.com",
        "x-rapidapi-key": `${apiKey}`,
      },
    });
    let game = await resp.json();
    return game;
  } catch (error) {
    alert("something went wrong when trying to recieve data from the api");
    console.log(error);
  }
}
