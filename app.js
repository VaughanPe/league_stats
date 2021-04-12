let deathsArray = [];
let assistsArray = [];



stats("3853978668","NleIX8LLH1X3n9UB632uwKmaERhWGR9eaLdA-SE7a1dk9g");
 
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



const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const labels = ["cs","test"]

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
          text: 'Chart.js Line Chart'
        }
      }
    },
  });


  
}