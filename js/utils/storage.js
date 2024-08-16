/**
 * Removes a game from the saved list of the currently active user.
 *
 * This function checks if the given game is in the user's saved list, finds its index, removes it,
 * updates the stored user data in `localStorage`, and sets the updated user data in `localStorage`.
 *
 * @param {Object} game - The game object to be removed from the saved list.
 */
export function removeFromSaved(game) {
  let save = isSaved(game);
  let user = JSON.parse(localStorage.getItem("activeUser"));
  let index = user.saved.findIndex((s) => s.game.id == save.game.id);
  user.saved.splice(index, 1);
  localStorage.setItem("activeUser", JSON.stringify(user));
  updateActiveToUsers();
}

/**
 * Adds a game to the saved list of the currently active user with a specified status.
 *
 * This function saves the game with a given status (e.g., "favourite", "interested", "played") to the active user's saved list.
 * It then updates the stored user data in `localStorage` and sets the updated user data in `localStorage`.
 *
 * @param {string} status - The status to be associated with the saved game (e.g., "favourite", "interested", "played").
 * @param {Object} game - The game object to be saved.
 */
export function addGameToSaved(status, game) {
  let save = {
    status: status,
    game: game,
  };
  let user = JSON.parse(localStorage.getItem("activeUser"));
  if (user.saved) {
    user.saved.push(save);
  } else {
    user.saved = [];
    user.saved.push(save);
  }
  localStorage.setItem("activeUser", JSON.stringify(user));
  updateActiveToUsers();
}

/**
 * Stores the currently active user's data in the list of all users in `localStorage`.
 *
 * This function updates the user data in the `users` list stored in `localStorage` by replacing the
 * old entry of the active user with the updated one. It ensures that changes made to the active user
 * are reflected across the stored list of users.
 */
export function updateActiveToUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = getActiveUser();
  let index = users.findIndex((u) => u.username == user.username);
  users.splice(index, 1, user);
  localStorage.setItem("users", JSON.stringify(users));
}

/**
 * Changes the saved status of a game for the currently active user.
 *
 * This function updates the status (e.g., "favourite", "interested", "played") of a game that has already been saved by the active user.
 * If the game is found in the saved list, it modifies its status, updates the active user data in `localStorage`,
 * and sets the updated user data in `localStorage`.
 *
 * @param {Object} game - The game object whose saved status needs to be updated.
 * @param {string} status - The new status to be assigned to the saved game (e.g., "favourite", "interested", "played").
 */
export function changeSavedStatus(game, status) {
  if (isLoggedIn()) {
    let save = isSaved(game);
    if (save) {
      let user = JSON.parse(localStorage.getItem("activeUser"));
      let index = user.saved.findIndex((s) => s.game.id == save.game.id);
      save.status = status;
      user.saved.splice(index, 1, save);
      localStorage.setItem("activeUser", JSON.stringify(user));
      updateActiveToUsers();
    }
  }
}

/**
 * Retrieves the list of saved games for the currently active user.
 *
 * This function fetches the active user's data from `localStorage` and returns the list of games
 * that the user has saved. If the user does not have any saved games, it will return an empty array.
 *
 * @returns {Array<Object>} - An array of saved game objects for the active user.
 */
export function getSavedGames() {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  let saved = user.saved;
  return saved;
}

/**
 * Checks if a given game is saved by the currently active user.
 *
 * This function searches through the list of saved games for the active user to determine if the specified
 * game is present. If the game is found, it returns the saved game object; otherwise, it returns `false`.
 *
 * @param {Object} game - The game object to check for in the saved list.
 * @returns {Object|boolean} - The saved game object if the game is found; otherwise, `false`.
 */
export function isSaved(game) {
  let saved = [];
  let user = JSON.parse(localStorage.getItem("activeUser"));
  saved = user.saved;
  if (saved) {
    for (let i = 0; i < saved.length; i++) {
      if (saved[i].game.id == game.id) {
        return saved[i];
      }
    }
  }
  return false;
}

/**
 * Retrieves the saved status of a given game for the currently active user.
 *
 * This function checks if the currently active user is logged in and if the specified game is saved.
 * If the game is saved, it returns its status (e.g., "favourite", "interested", "played").
 * If the game is not saved or if the user is not logged in, it returns `false`.
 *
 * @param {Object} game - The game object whose saved status is to be retrieved.
 * @returns {string|boolean} - The status of the saved game if it is found; otherwise, `false`.
 */
export function getGameStatus(game) {
  if (isLoggedIn()) {
    let saved = isSaved(game);
    if (saved) {
      return saved.status;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Retrieves the currently active user's data from `localStorage`.
 *
 * This function fetches the active user's information stored in `localStorage` and parses it from JSON format.
 * It returns the active user object, or `null` if no active user is found.
 *
 * @returns {Object|null} - The active user object if it exists; otherwise, `null`.
 */
export function getActiveUser() {
  return JSON.parse(localStorage.getItem("activeUser"));
}

/**
 * Checks if a user is currently logged in.
 *
 * This function determines if there is an active user object stored in `localStorage`.
 * It returns `true` if an active user is found, indicating that the user is logged in;
 * otherwise, it returns `false`.
 *
 * @returns {boolean} - `true` if an active user is found; otherwise, `false`.
 */
export function isLoggedIn() {
  if (JSON.parse(localStorage.getItem("activeUser"))) {
    return true;
  } else {
    return false;
  }
}
