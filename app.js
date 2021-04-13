const form = document.querySelector(`form`);
const searchBar = document.querySelector(`input`);
const championMasteryDisplay = document.querySelector(`ol`);
const profileDataDsiplay = document.querySelector(`div.profile`);
//test 2
const summoner_url = `https://api.ttmhgame20.repl.co/getsummoner?name=`;
const mastery_url = `https://api.ttmhgame20.repl.co/getmastery?id=`;
const championStats_url = `http://ddragon.leagueoflegends.com/cdn/11.7.1/data/en_US/champion.json`;
const champIcon_url = `http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/`;

async function getSummoner(name) {
  const res = await fetch(summoner_url + name);
	const data = await res.json();
	if (res.status !== 200) {
		displayTopChamps([]);
	} else {
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

	getChampStats(newChampArray);
}

async function getChampStats(champArray) {
	const res = await fetch(championStats_url);
	const data = await res.json();
	let newChampArray = [];
	champArray.forEach(champ => {
		for (const champData in data.data) {
			if (champ.championId === parseInt(data.data[champData].key)) {
				newChampArray.push({champ, champData: data.data[champData]})
			}
		}
	});

	displayTopChamps(newChampArray);
}

function displayTopChamps(champArray) {
	console.log(champArray);
	championMasteryDisplay.innerHTML = ``;
	champArray.forEach( champ => {
		let name = champ.champData.id
		let img = champIcon_url + champ.champData.key + `.png`;
		let mp = champ.champ.championPoints
		championMasteryDisplay.insertAdjacentHTML(`beforeend`, `
		<li>
			<h3>Champion: ${name}</h3>
			<img src="${img}" alt="Champion">
			<h4>Mastery Points: ${mp}</h4>
		</li>
		`);
	});
}

form.addEventListener(`submit`, e => {
	e.preventDefault();
	getSummoner(searchBar.value);
});