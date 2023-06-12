const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-acc-pt-web-pt-e';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const result = await response.json();
        if (result.error) throw result.error;
        return result.data.players;

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        const result = await response.json();
        if (result.error) throw result.error;
        return result.data.player;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const result = await response.json();
        if (result.error) throw result.error;
        return result.data.player;

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.error) throw result.error;
        return;

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
    if (!playerList || !playerList.length) {
        playerContainer.innerHTML = '<h3>No players to display!</h3>';
        return;
    }

    try {
        let playerContainerHTML = '';
        playerList.map(player => {
            let playerHTML = `
            <div class="player">
                <div class="info">
                    <p class="title">${player.name}</p>
                    <p class="number">#${player.id}</p>
                </div>
                <img src="${player.imageUrl}" alt="photo of ${player.name} the puppy">
                <button class="detail" data-id=${player.id}>See details</button>
                <button class="delete" data-id=${player.id}>Remove from roster</button>
            </div>
            `;
            playerContainerHTML += playerHTML;
        });
        playerContainer.innerHTML = playerContainerHTML;

        let detailButtons = [...document.getElementsByClassName('detail')];
        detailButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const player = await fetchSinglePlayer(button.dataset.id);
                renderSinglePlayer(player);
            });
        });

        let deleteButtons = [...document.getElementsByClassName('delete')];
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                await removePlayer(button.dataset.id);
                const players = await fetchAllPlayers();
                renderAllPlayers(players);
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderSinglePlayer = (playerObj) => {
    if (!playerObj || !playerObj.id) {
        playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
        return;
    }

    let playerHTML = `
    <div class="player-view">
        <div class="info">
            <p class="title">${playerObj.name}</p>
            <p class="number">#${playerObj.id}</p>
        </div>
        <p>${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
        <p>${playerObj.breed}</p>
        <img src="${playerObj.imageUrl}" alt="photo of ${playerObj.name} the puppy">
        <button id="see-all">Back to all players</button>
    </div>
    `;
    playerContainer.innerHTML = playerHTML;

    let seeAllButton = document.getElementById('see-all');
    seeAllButton.addEventListener('click', async () => {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
    });
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    let formHTML = `
    <form>
        <label for="name">Name:</label>
        <input type="text" name="name" />
        <label for="breed">Breed:</label>
        <input type="text" name="breed" />
        <button type="submit">Submit</button>
    </form>
    `;
    newPlayerFormContainer.innerHTML = formHTML;

    let form = document.querySelector('#new-player-form > form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let playerData = {
            name: form.elements.name.value,
            breed: form.elements.breed.value
        };
        await addNewPlayer(playerData);
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
        form.elements.name.value = '';
        form.elements.breed.value = '';
    });
};

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
};

init();
