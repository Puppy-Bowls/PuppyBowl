var playerContainer = document.querySelector('#all-players-container');
var newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
// const cohortName = '2302-acc-et-web-pt';
// ${cohortName}
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2302-acc-et-web-pt/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {

         
       const parties = (await fetch(APIURL)).json();
       return parties;

    } catch (err) {
        console.log('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (id) => {
    try {
        const players= await fetch(`${APIURL}/${id}`).json();
        const playerElement = document.createElement('div');
        playerElement.classList.add('players');
        playerElement.innerHTML = `
            <h4>${players.name}</h4>
            <p>${players.breed}</p>
            <p>${players.status}</p>
            <p>${players.imageUrl}</p>
            <p>${players.createdAt}</p>
            <p>${players.updatedAt}</p>
            <p>${players.teamId}</p>
            <p>${players.cohortId}</p>`;
        playerContainer.appendChild(playerElement);
    } catch (err) {
        console.log(`Oh no, trouble fetching player #${id}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            body: JSON.stringify(playerObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const player = await response.json();
        console.log(player);
        fetchAllPlayers();
        
        


    } catch (err) {
        console.log('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (id) => {
    try {
        const response = await fetch(`${APIURL}/${id}`, {
            method: 'DELETE',
        });
        const player = await response.json();
        console.log(player);
        fetchAllPlayers();
        window.location.reload();
 
    } catch (err) {
        console.log(
            `Whoops, trouble removing player #${id} from the roster!`,
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
const renderAllPlayers = async (playerList) => {
    try {
        if (!playerList || playerList.length === 0) {
            playerContainer.innerHTML = '<h3>No players found</h3>';
            return;
        }
    
        playerContainer.innerHTML = '';
    
        playerList.data.playerList.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
                <h4>${player.name}</h4>
                <img src="${player.imageUrl}" alt="${player.name}">
                <p>${player.id}</p>
                <p>${player.breed}</p>
                <p>${player.status}</p>
                <p>${player.createdAt}</p>
                <p>${player.updatedAt}</p>
                <p>${player.teamId}</p>
                <p>${player.cohortId}</p>

                <button class="delete-button" data-id="${player.id}">Remove</button>
                <button class="detail-button" data-id="${player.id}">See Details</button>
            `;
            playerContainer.appendChild(playerElement);
    
            let deleteButton = playerElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                removePlayer(player.id);
            });
    
            let detailButton = playerElement.querySelector('.detail-button');
            detailButton.addEventListener('click', (event) => {
                event.preventDefault();
                fetchSinglePlayer(id);
            });
        });
            
        
    } catch (err) {
        console.log('Uh oh, trouble rendering players!', err);
    }

};
const renderNewPlayerForm = () => {
    try {
        let formHtml = `
        <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Name">
        <label for="imageUrl">Image URL</label>
        <input type="text" id="imageUrl" name="imageUrl" placeholder="Image URL">
        <label for="breed">Breed</label>
        <textarea id="breed" name="breed" placeholder="Breed"></textarea>
        <button type="submit">Create</button>
        </form>
        `;
        newPlayerFormContainer.innerHTML = formHtml;
    
        let form = newPlayerFormContainer.querySelector('form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            let playerData = {
                name: form.name.value,
                imageUrl: form.imageUrl.value,
                breed: form.breed.value,
                status: form.status.value,

            };
    
            await createNewPLayer(playerData);
    
            const players = await fetchAllPlayers();
            renderAllPlayers(players);
    
            form.name.valueOf = '';
            form.imageUrl.value = '';
            form.breed.value = '';
            form.status.value = '';


        });
    
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

async function init() {
    try{
   const players = await fetchAllPlayers();
    console.log(await renderAllPlayers(players))
    ;

    renderNewPlayerForm()
    } catch (err) {
        console.log (err)
    }

}


init();
