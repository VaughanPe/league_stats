const BASE_URL = `https://na1.api.riotgames.com`;
const SUMMONER_URL = `/lol/summoner/v4/summoners/by-name/`;
const temp_key = `RGAPI-103fd9dd-67ad-4c89-8bd0-59fed16383aa`;
const END_URL = `?api_key=` + temp_key;

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

function getTop5Champ(champArray) {
	let newChampArray;
	let counter = 1;
	for (let i = 0; i < 4; i++) {
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

getSummoner();