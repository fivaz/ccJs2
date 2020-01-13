$(() => { 
	$("#btnJouer").click(_=> getCapital());

	$("#btnOk").click(_=> checkCapital());
	
	$("#iptSearch").keyup(_=> search($("#iptSearch").val()));

	showMatches(nbMatches);
});

let countryAndCapital = {};

let countdown = {};

let nbMatches = downloadData();

const url = "http://localhost:8005/cc/capitale.php";



function startCountDown(){
	clearInterval(countdown);
	let seconds = 10;
	updateSeconds(seconds);
	countdown = setInterval(() => {
		seconds -= 1;
		updateSeconds(seconds);
		if(seconds == 0){
			timeOut();
			clearInterval(countdown);
		}
	}, 1000);
}

function startGame(){
	console.log(nbMatches);
	incrementMatches();
	startCountDown();
	showCountry();
}

function showCountry(){
	console.log(countryAndCapital);
	$("#country").text(countryAndCapital.pays);
}

function updateSeconds(seconds){
	$("#timer").text(seconds + " seconds");
}

function youLoose(){
	$("#result").text("Non, ce n’est pas cela");
}

function timeOut(){
	$("#result").text("« Les 10 secondes sont passées...");
}

function youWin(){
	$("#result").text("Bravo c’est juste !");
}

function getJSON(url) {
	console.log(url);
	return fetch(url)
		.then(res => res.json());
}

function getXML(url) {
	console.log(url);
	return fetch(url)
		.then(res => res.text())
		.then(text => $.parseXML(text));
}

function getCapital(){
	getJSON(url + "?jouer").then(obj => {
		countryAndCapital = obj;
		startGame();
	});
}

function checkCapital(){
	const enteredCapital = $("#iptCapital").val();
	if(enteredCapital){		
		console.log(enteredCapital);
		console.log(countryAndCapital.capitale);
		if(enteredCapital == countryAndCapital.capitale)
			youWin();
		else
			youLoose();
	}
}

function incrementMatches(){
	nbMatches += 1;
	updateData(nbMatches);
	showMatches(nbMatches);
}

function showMatches(nbMatches){
	console.log($("#matches"));
	$("#matches").text(nbMatches);
}

function updateData(gameData){
	localStorage.setItem("game", gameData);
}

function downloadData(){
	return Number(localStorage.getItem("game"));
}

function search(text){
	console.log(text);
	getXML(url + "?recherche=" + text)
	.then(xml => printXML(xml));
		
}

function printXML(xml){
	const listPays = $("#xml");
	listPays.empty();
	$(xml)
		.find('pays')
		.each((i, p) => {
			pays = $(p);
			const row = "<li>" + pays.find('nom').text() + " " + pays.find('capitale').text() + " " + pays.find('population').text() + "</li>";
			console.log(row);
			listPays.append(row);
			}
		);
	
}