const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-acc-et-web-pt';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + 'players');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + `players/${playerId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL + 'players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Oops, something went wrong with adding that player!', err);
  }
};
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + `players/${playerId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};
/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
  try {
    let playerContainerHTML = '';
    playerList.forEach((player) => {
      const playerHTML = `
        <div class="player-card">
          <h3>${player.name}</h3>
          <p>${player.bread}</p>
          <p>${player.status}</p>
          <p>${player.team}</p>
          <button class="details-btn" data-player-id="${player.id}">See details</button>
          <button class="remove-btn" data-player-id="${player.id}">Remove from roster</button>
        </div>
      `;
      playerContainer.appendChild(playerElement);
      //playerContainerHTML += playerHTML.innerHTML;
    });
    
    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach((button)=> {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const playerId = event.target.dataset.playerId;
        const player = await fetchSinglePlayer(playerId);
        fetchSinglePlayer(playerId);
        // Do something with the player details
        console.log(player);
      });
      try {
      }
      catch () { } (err) => {
        console.error(`Error fetching player details for #${playerId}`, err);
      };
    });
​
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        event.preventDefault()
        const playerId = event.target.dataset.playerId;
        await removePlayer(playerId);
        // Refresh the player list after removing the player
        const updatedPlayers = await fetchAllPlayers();
        renderAllPlayers(updatedPlayers);
      });
    });

    return playerContainerHTML;
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const formHTML = `
      <form id="add-player-form">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name">
      <label for="breed">Breed:</label>
      <input type="text" id="breed" name="breed"
      <label for="status">Status:</label>
      <input type="text" id="status" name="position">
      <label for="team">Team:</label>
      <input type="text" id="team" name="team">
      <button type="submit">Add Player</button>
      </form>
    `;
    newPlayerFormContainer.innerHTML = formHTML;

    const addPlayerForm = document.getElementById('add-player-form');
    addPlayerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nameInput = document.getElementById('name-input');
      const breedInput = document.getElementById('breed-input');
      const teamInput = document.getElementById('team-input');

      const newPlayer = {
        name: nameInput.value,
        position: positionInput.value,
        team: teamInput.value,
      };

      await addNewPlayer(newPlayer);
      // Clear the form inputs after adding a player
      nameInput.value = '';
      positionInput.value = '';
      teamInput.value = '';

      // Refresh the player list after adding a new player
      const updatedPlayers = await fetchAllPlayers();
      renderAllPlayers(updatedPlayers);
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering the new player form!', err);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();