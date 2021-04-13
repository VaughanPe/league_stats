const form = document.querySelector(`form`);
const searchBar = document.querySelector(`input`);
const championMasteryDisplay = document.querySelector(`ol`);
const recentMatches = document.querySelector(".match-holder");
const graph = document.querySelector(".match");
const pfpDisplay = document.querySelector(`img.pfp`);
const summonerNameDisplay = document.querySelector(`div.profile>h2`);
const RankDisplay = document.querySelector(`div.profile>img[alt="Rank Image"]`);

const summoner_url = `https://api.ttmhgame20.repl.co/getsummoner?name=`;
const rank_url = `https://api.ttmhgame20.repl.co/getrank?id=`;
const rank_img_url = `https://api.ttmhgame20.repl.co/getleague?league=`;
const pfp_url = `https://ddragon.leagueoflegends.com/cdn/11.7.1/img/profileicon/`;
const mastery_url = `https://api.ttmhgame20.repl.co/getmastery?id=`;
const championStats_url = `http://ddragon.leagueoflegends.com/cdn/11.7.1/data/en_US/champion.json`;
const champIcon_url = `http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/`;
let players = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let globalM;
let accountId;
let myChart = "";

async function getSummoner(name) {
  const res = await fetch(summoner_url + name);
  const data = await res.json();
  if (res.status !== 200) {
    displayTopChamps([]);
  } else {
    accountId = data.accountId
    getRank(data.id, [data.name, data.profileIconId, data.summonerLevel]);
    getChampionMastery(data.id);
  }
}

async function getRank(id, profileDataArray) {
  const res = await fetch("https://api.ttmhgame20.repl.co/getrank?id=" + id);
  const data = await res.json();
  profileDataArray.push(data[0].tier.toLowerCase());
  displayProfileData(profileDataArray)
}

function displayProfileData(profileDataArray) {
  console.log(profileDataArray);
  pfpDisplay.src = pfp_url + profileDataArray[1] + `.png`;
  summonerNameDisplay.innerText = `${profileDataArray[0]}, Level: ${profileDataArray[2]}`;
  RankDisplay.src = rank_img_url + profileDataArray[3];
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
        newChampArray.push({ champ, champData: data.data[champData] })
      }
    }
  });

  displayTopChamps(newChampArray);
}

function displayTopChamps(champArray) {
  championMasteryDisplay.innerHTML = ``;
  champArray.forEach(champ => {
    let name = champ.champData.id
    let img = champIcon_url + champ.champData.key + `.png`;
    let mp = champ.champ.championPoints
    championMasteryDisplay.insertAdjacentHTML(`beforeend`, `
		<li>
			<img src="${img}" alt="Champion">
			<h3>${name}</h3>
			<h5>Mastery Points: ${mp}</h4>
		</li>
		`);
  });
  //getRecentMatches(accountId);
}

form.addEventListener(`submit`, e => {
  e.preventDefault();
  getSummoner(searchBar.value);
});

recentMatches.addEventListener('click', function (e) {
  if (e.target.tagName == "LI") {
    console.log(e.target.id)
    stats(globalM.matches[e.target.id].gameId, accountId);
  }
})

async function getRecentMatches(accId) {
  let recent = await fetch(`https://api.ttmhgame20.repl.co/getmatches?accId=${accId}`);
  let response = await recent.json();
  globalM = response;
  let champ = await fetch(championStats_url)
  let res = await champ.json();
  let champList = [];
  let maps = await fetch(`http://static.developer.riotgames.com/docs/lol/maps.json`);
  let mresp = await maps.json();
  for (let item in res.data) {
    console.log(item);
    if (res.data.hasOwnProperty(item)) {
      champList.push(res.data[item]);
    }
  }

  recentMatches.innerHTML = ``;
  for (let i = 0; i <= 5; i++) {
    let match = await fetch(`https://api.ttmhgame20.repl.co/getmatch?matchId=${response.matches[i].gameId}`)
    let matchresp = await match.json();
    let image = "";
    let id = "";
    let Pid;
    let stats;


    champList.forEach(function (element) {
      if (response.matches[i].champion == element.key) {
        image = `${champIcon_url}${element.key}.png`;
        id = element.id;
      }
    });
    matchresp.participantIdentities.forEach(function (e) {
      if (e.player.accountId == accId) {
        Pid = e.participantId - 1;
        stats = matchresp.participants[Pid].stats;
      }
    });

    recentMatches.insertAdjacentHTML(`beforeend`, `
     <li class="match" id=${i}>
     <img src="${image}" alt="${id}">
     <h5>${matchresp.gameMode}</h5>
     <h5>${stats.kills}/${stats.deaths}/${stats.assists}</h5>
     <h5>${stats.neutralMinionsKilled + stats.totalMinionsKilled}</h5>
    </li>`)
  }

}


// stats method requires match id and accId
stats("3853978668", "NleIX8LLH1X3n9UB632uwKmaERhWGR9eaLdA-SE7a1dk9g");
let deathsArray = [];
let assistsArray = [];




async function stats(m, acc) {

  let time = [];
  let gold = [];
  let gold2 = [];
  let cs = [];
  let kills = 0;
  let killsArray = [];
  let deaths = 0;
  let deathsArray = [];
  let assists = 0;
  let assistsArray = [];
  let Pid;


  let match = await fetch(`https://api.ttmhgame20.repl.co/getmatch?matchId=${m}`);
  let resp = await match.json();

  resp.participantIdentities.forEach(function (id) {
    if (id.player.accountId == acc) {
      Pid = id.participantId;
    }
  })
  let matcht = await fetch(`https://api.ttmhgame20.repl.co/gettimeline?matchId=${m}`);
  let tresp = await matcht.json();
  let counter = 0;
  tresp.frames.forEach(element => {
    time.push(`${counter}`);
    counter++;

    element.events.forEach(function (e) {


      if (e.type == "CHAMPION_KILL" && e.killerId == Pid) {
        console.log(kills);
        kills++;
      } else if (e.type == "CHAMPION_KILL" && e.victimId == Pid) {
        deaths++;
      } else if (e.type == "CHAMPION_KILL" && e.assistingParticipantIds.length >= 1) {
        e.assistingParticipantIds.forEach(function (e) {
          if (e == Pid) {

            assists++;
            console.log(assists);
          }
        })
      }


    })
    killsArray.push(`${kills}`);
    deathsArray.push(`${deaths}`);
    assistsArray.push(`${assists}`);
    players.forEach(function (e) {

      if (element.participantFrames[e].participantId == Pid) {
        gold.push(element.participantFrames[e].totalGold);
        console.log(element.participantFrames[e].jungleMinionsKilled);
        cs.push(element.participantFrames[e].minionsKilled + element.participantFrames[e].jungleMinionsKilled);
        gold2.push(element.participantFrames[e].currentGold);

      }
    })


  });



  var ctx = document.getElementById('match').getContext('2d');
  if (myChart != "") {
    myChart.destroy();

    myChart = new Chart(ctx, {
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
            borderColor: "#000000",
            backgroundColor: "#000000",
          },
          {
            label: 'Assists',
            data: assistsArray,
            borderColor: "#787878",
            backgroundColor: "#999999",
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
  } else {



    myChart = new Chart(ctx, {
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
            borderColor: "#000000",
            backgroundColor: "#000000",
          },
          {
            label: 'Assists',
            data: assistsArray,
            borderColor: "#787878",
            backgroundColor: "#999999",
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


}
