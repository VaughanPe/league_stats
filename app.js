const form = document.querySelector(`form`);
const searchBar = document.querySelector(`input`);
const championMasteryDisplay = document.querySelector(`ol`);

const summoner_url = `https://api.ttmhgame20.repl.co/getsummoner?name=`;
const mastery_url = `https://api.ttmhgame20.repl.co/getmastery?id=`;

async function getSummoner(name) {
  const res = await fetch(summoner_url + name);
	const data = await res.json();
	if (res.status !== 200) {
		displayTopChamps([]);
	} else {
		console.log(data.id)
		getChampionMastery(data.id);
	}
}

async function getChampionMastery(id) {
	const res = await fetch(mastery_url + id);
	const data = await res.json();
	getTopChamps(data);
}

function getTopChamps(champArray) {
	let newChampArray = [];
	let counter = 1;
	for (let i = 0; i < 3; i++) {
		if (champArray.length > counter) {
			newChampArray.push(champArray[i]);
			counter++;
		}
	}

	displayTopChamps(newChampArray);
}

function displayTopChamps(champArray) {
	console.log(champArray);
	let img = ``;
	let mp = ``;
	championMasteryDisplay.innerHTML = ``;
	championMasteryDisplay.insertAdjacentHTML(`beforeend`, `
		<li>
			<h3>Champion</h3>
			<img src="${img}" alt="Champion">
			<h4>Mastery Points: ${mp}</h4>
		</li>
	`);
	
}

form.addEventListener(`submit`, e => {
	e.preventDefault();
	getSummoner(searchBar.value);
});