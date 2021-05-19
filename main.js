Moralis.initialize("rtMl8jeWROhErykTDcZq7nwmoTll2oNAy4Y54D2e"); // Application id from moralis.io
Moralis.serverURL = "https://aivifqrfiivh.moralis.io:2053/server"; //Server url from moralis.io


function addRowToTable(tableId, data){
  let tableRow = document.createElement('tr');
  data.forEach(element => {
    let newColum = document.createElement("td");
    newColum.innerHTML = element;
    tableRow.appendChild(newColum);
  });
  document.getElementById(tableId).appendChild(tableRow);
}

async function login() {
    try{
      user = await Moralis.User.current();
      if (!user){
        user = await Moralis.Web3.authenticate();
      }

        console.log(user);
        document.getElementById("login_button").style.display= "none";
        document.getElementById("game").style.display= "block";

        let biggestWinners = await Moralis.Cloud.run("biggestWinners", {});
        biggestWinners.forEach((row)=>{
          addRowToTable("top_winners", [row.objectId, row.total_sum])
        })

        let biggestLosers = await Moralis.Cloud.run("biggestLosers", {});
        biggestWinners.forEach((row)=>{
          addRowToTable("top_losers", [row.objectId, row.total_sum])
        })

        let biggestBets = await Moralis.Cloud.run("biggestBets", {});
        biggestWinners.forEach((row)=>{
          addRowToTable("biggest_bets", [row.user, row.bet, row.win])
        })

    } catch (error) {
        console.log(error);
    }
}

async function flip(side){
    let sideNumber;
    if(side == "heads")
      sideNumber = 0;
    else
      sideNumber = 1;

    let amount = document.getElementById("amount").value;

    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.abi, "0x124d0bccFFc3Fc20B0fC025FF88c16F0f905Ec43")
    contractInstance.methods.flip(sideNumber).send({value: amount, from: ethereum.selectedAddress})
    .on(`receipt`, function(receipt){
        console.log(receipt);
        if(receipt.events.bet.returnValues.win){
          alert("YOU WON");
        }
        else{
          alert("YOU LOST");
        }
    })
}

async function logout(){
  await Moralis.User.logOut();
  alert("GOOD BAYE");
}
document.getElementById("login_button").onclick = login;
document.getElementById("logout_button").onclick = logout;

document.getElementById("heads_button").onclick = function(){flip("heads")};
document.getElementById("tails_button").onclick = function(){flip("tails")};
