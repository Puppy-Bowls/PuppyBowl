const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '/2302-ACC-ET-WEB-PT-E'
// Use the APIURL variable for fetch requests
const PLAYERS_API_URL = `https://fsa-puppy-bowl.herokuapp.com/api${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(PLAYERS_API_URL);
        const players = await response.json();
        return players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

// get single player by id
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${PLAYERS_API_URL}/${playerId}`);
        const player = await response.json();
        console.log(player)
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

// add new player 
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${PLAYERS_API_URL}/${playerObj.id}`, { method: 'POST' });
        const player = await response.json();
        return player;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

// delete player
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${PLAYERS_API_URL}${playerId}`, { method: 'DELETE' });
        const player = await response.json();
        return player;
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const renderForm = () => {
    const form = document.getElementById('new-player-form');

    form.innerHTML = `
    <label for="">Enter Name: </label>
    <input type="text" name="name" id="name">

    <label for="">Enter Breed: </label>
    <input type="text" name="breed" id="breed">

    <label for="">Enter Status: </label>
    <input type="text" name="status" id="status">

    <label for="">Enter Image URL: </label>
    <input type="text" name="imageUrl" id="imageUrl">

    <button class="add-player-button">Add Player</button>
    `;

    const addButton = form.querySelector('.add-player-button');


    addButton.addEventListener('click', async (event) => {
        try {

            event.preventDefault();
            const body = {
                name: document.querySelector('#name').value,
                breed: document.querySelector('#breed').value,
                status: document.querySelector('#status').value,
                imageUrl: document.querySelector('#imageUrl').value
            }

            // test (delete)
            // console.log(document.querySelector('#name').value);

            const response = await fetch(PLAYERS_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await response.json();
            console.log(data)
        } catch (error) {
            console.log(error);
        }
    })
}


// render all parties
const renderPlayers = async (players) => {
    try {
        playerContainer.innerHTML = '';
        players.data.players.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
                <h2>${player.name}</h2>
                <img src="${player.imageUrl}" width= 400 height=500> 
                <p>${player.status}</p>
                <p>${player.imageUrl}</p>
                <p>${player.createdAt}</p>
                <p>${player.teamId}</p>
                <p>${player.cohortId}</p>
                <button class="details-button" data-id="${player}">See Details</button>
                <button class="delete-button" data-id="${player}">Delete</button>
            `;
            playerContainer.appendChild(playerElement);

            // see details
            const detailsButton = playerElement.querySelector('.details-button');
            detailsButton.addEventListener('click', async (event) => {
                try {
                    detailsButton.innerHTML = `
          <div id="details">
                <h2>Name: ${player.name}</h2>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
                <p>Image Url: ${player.imageUrl}</p>
                <p>Created: ${player.createdAt}</p>
                <p>Team ID: ${player.teamId}</p>
                <p>Cohort ID: ${player.cohortId}</p>
          </div>
          `;
                } catch (error) {
                    console.log(error);
                }
            });

            // delete party
            const deleteButton = playerElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', async (event) => {
                try {
                    playerElement.remove();
                } catch (error) {
                    console.log(error);
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
};

// const renderNewPlayer = async (newPlayer) => {
//     try{
//         newPlayerFormContainer.innerHTML = '';
//         const newPlayerElement = document.createElement('div');
//         newPlayerElement.classList.add('new-player');
//         newPlayerElement.innerHTML = `
//             <h2>Name: ${newPlayer.name}</h2>
//             <p>Breed: ${newPlayer.breed}</p>
//             <p>Status: ${newPlayer.status}</p>
//             <p>Image Url: ${newPlayer.imageUrl}</p>
//             <p>Created at: ${newPlayer.createdAt}</p>
//             <p>Team Id: ${newPlayer.teamId}</p>
//             <p>Cohort Id: ${newPlayer.cohortId}</p>
//         `
//     } catch (error) {
//         console.log(error);
//     }
// }

// init function
const init = async () => {
    try {

        const players = await fetchAllPlayers();
        console.log(players);


        // // I used (id = 6) for this example
        // fetchSinglePlayer(662);

        renderPlayers(players);

        renderForm();

    } catch (error) {
        console.log(error);
    }
};

init();













// newPlayerFormContainer.innerHTML = '';
// const newPlayerElement = document.createElement('div');
// newPlayerElement.classList.add('new-player');
// newPlayerElement.innerHTML = `
//     <label>Name: ${newPlayer.name}</label>
//     <input type="text"><br>
// `
