class skill{
constructor(name,level,mscore,img){
    this.name = name
    this.level = level
    this.mscore = mscore
    this.img = img
}
}


    
const form = document.querySelector("form");
const region = document.querySelector("select");
const name = document.querySelector("input");
form.onsubmit = function(e){
    e.preventDefault();
    console.log(`${name.value} ${region.value}`)
    insertMastery(name.value)
}

async function insertMastery(summonerName){
    let champList = []
    let skillHolder = []
     const profile = document.querySelector(".profile")
     const  topChamp = document.querySelector(".topChamps").querySelector("ol")

     //http://ddragon.leagueoflegends.com/cdn/11.7.1/img/profileicon/${summoner.profileIconId}.png
    
   const s1response = await fetch(`https://api.ttmhgame20.repl.co/getsummoner?name=${summonerName}`)
   const summoner = await s1response.json();
   console.log()
   profile.querySelectorAll("img")[0].setAttribute("src",`http://ddragon.leagueoflegends.com/cdn/11.7.1/img/profileicon/${summoner.profileIconId}.png`)
   profile.querySelector("h2").innerHTML = summoner.name;
     const mresponse = await fetch(`https://api.ttmhgame20.repl.co/getmastery?id=${summoner.id}`)
    const mastery = await mresponse.json();
    const champ = await fetch('http://ddragon.leagueoflegends.com/cdn/11.7.1/data/en_US/champion.json');
    const cjson = await champ.json();
    for(let item in cjson.data){
        console.log(item);
      if(cjson.data.hasOwnProperty(item)){
          champList.push(cjson.data[item]);
       }
    }
    mastery.forEach(function(e){
        champList.forEach(function(champ){
            if(e.championId == champ.key){
                let obj = new skill(champ.name,e.championLevel,e.championPoints,`http://ddragon.leagueoflegends.com/cdn/11.7.1/img/champion/${champ.name}.png`)
                skillHolder.push(obj)

            }
        })
    });

    topChamp.querySelectorAll("li")[0].querySelector("h3").innerHTML = `<b>${skillHolder[0].name}</b>`
   console.log(summoner);
    
}