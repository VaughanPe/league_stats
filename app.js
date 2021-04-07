const BASE_URL = `https://na1.api.riotgames.com`;
const SUMMONER_URL = `/lol/summoner/v4/summoners/by-name/`;
const temp_key = `RGAPI-103fd9dd-67ad-4c89-8bd0-59fed16383aa`;
const END_URL = `?api_key=` + temp_key;

async function getChampionMastery() {
  const res = await fetch(BASE_URL + SUMMONER_URL + `testname` + END_URL, {
		method: `GET`,
  });

	const data = await res.json();
	console.log(data);
}

getChampionMastery();