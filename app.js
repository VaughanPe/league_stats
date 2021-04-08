const form = document.querySelector(`form`);
const searchBar = document.querySelector(`input`);
const championMasteryDisplay = document.querySelector(`ol`);

const summoner_url = `https://api.ttmhgame20.repl.co/getsummoner?name=`;
const mastery_url = `https://api.ttmhgame20.repl.co/getmastery?id=`;

async function getSummoner() {
  const res = await fetch(summoner_url + `testname`);
	const data = await res.json();
	getChampionMastery(data.id);
}

async function getChampionMastery(id) {
	const res = await fetch(mastery_url + id);
	const data = await res.json();
	getTop5Champ(data);
}

function getTopChamps(champArray) {
	let newChampArray;
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
}

form.addEventListener(`submit`, getSummoner);