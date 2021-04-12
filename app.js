const form = document.querySelector(`form`);
const searchBar = document.querySelector(`input`);
const championMasteryDisplay = document.querySelector(`ol`);

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
			<h3>${name}</h3>
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




// stats method requires match id and accId
stats("3853978668","NleIX8LLH1X3n9UB632uwKmaERhWGR9eaLdA-SE7a1dk9g");
 let deathsArray = [];
 let assistsArray = [];

  async function stats(m,acc){
 let time = [];
  let gold = [];
  let gold2 = [];
  let cs  = [];
  let kills = 0;
  let killsArray = [];
  let deaths = 0;
  
  let assists = 0;
  
  let Pid;
  let players = [1,2,3,4,5,6,7,8,9,10]

let match = await fetch("https://api.ttmhgame20.repl.co/getmatch?matchId=3853978668");
let resp = await match.json();

resp.participantIdentities.forEach(function(id){
    if(id.player.accountId == acc){
        Pid = id.participantId;
    }
})
let matcht = await fetch("https://api.ttmhgame20.repl.co/gettimeline?matchId=3853978668")
let tresp = await matcht.json();
let counter = 0;
      tresp.frames.forEach(element => {
          time.push(`${counter}`)
          counter++;

          element.events.forEach(function (e){
              
             
                  if(e.type == "CHAMPION_KILL" && e.killerId == Pid){
                      console.log(kills)
                      kills++;
                  } else if(e.type == "CHAMPION_KILL" && e.victimId == Pid){
                        deaths++;
                  } else if(e.type == "CHAMPION_KILL" && e.assistingParticipantIds.leangth >= 1){
                      e.assistingParticipantIds.forEach(function(e){
                          if(e == Pid){
                              assists++;
                          }
                      })
                  }
              
               
          })
               killsArray.push(`${kills}`);
               deathsArray.push(`${deaths}`);
               assistsArray.push(`${assists}`)
          players.forEach(function(e){

              if(element.participantFrames[e].participantId == Pid){
                  gold.push(element.participantFrames[e].totalGold);
                  cs.push(element.participantFrames[e].minionsKilled);
                  gold2.push(element.participantFrames[e].currentGold);
                  
              }
          })

          
      });



var ctx = document.getElementById('match').getContext('2d');





var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: time,
        datasets: [
          {
            label: 'Total Gold',
            data: gold,
            borderColor: "#0d49b8",
            backgroundColor: "#2353ad",
          },
          {
            label: 'Current Gold',
            data: gold2,
            borderColor: "#ffff3b",
            backgroundColor: "#ffff3b",
          },
          {
            label: 'CS',
            data: cs,
            borderColor: "#64d9a2",
            backgroundColor: "#89d9b3",
          },
          {
            label: 'Kills',
            data: killsArray,
            borderColor: "#8b0000",
            backgroundColor: "#7a0000",
          },
          {
            label: 'Deaths',
            data: deathsArray,
            borderColor: "#eb4034",
            backgroundColor: "#e37f78",
          },
          {
            label: 'Assists',
            data: assistsArray,
            borderColor: "#eb4034",
            backgroundColor: "#e37f78",
          },
          
        ]
      },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'LOL Match Stats'
        }
      }
    },
  });


  
}
