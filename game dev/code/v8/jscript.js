//IPMEDT7 INF3C1
//Jan van Dijk
//s1070923
//Goede doelen fraude game
//v0.8  ren/been animatie en text cases aangevuld, punten text bug gefixt
//7 januari 2014


// functie voor animatie
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var c=document.getElementById("spelerCanvas");
var bgC=document.getElementById("bgCanvas");
var gC=document.getElementById("geldCanvas");
var eC=document.getElementById("eindCanvas");
var tC=document.getElementById("textCanvas");

//score
var punten = 0;
var scoreOptellen = false;
var scoreAftrekken = false;
var score = 0;
var geld = false;

var status = 0;

var slechtDoel = false;

//timer voor spel einde etc
var timer = 20000;
var timer2;
var tijdOp = false;

//spatiebalk op false zetten om te voorkomen dat punten doortellen
var spatiebalk = false;

// bij spel starten niet meteen laten lopen om tips weer te geven
var spelLoopt = false;

//random generator maken voor X coordinaat van collectant
var colCheck;
var drawX = Math.floor(Math.random() * 100);

//random generator voor type verhaal
var tGen;

//begin en eind van achtergrond
var bgDrawX1 = 0;
var bgDrawX2 = 1320;

//textballon var en image
// var textBallon = false;
var textBallonImg = new Image();
textBallonImg.src='../textballon.gif';

//geld
var geldImg = new Image();
geldImg.src='../geld.png';

//definieren van afbeeldingen
var character = new Image();
character.src='../player1.png';

//speler tekeningen laden, bewegende benen

// volgorde?:
// v11
// lopenv1
// v23
// v21
// lopenv16

var characterv11 = new Image();
characterv11.src ='../playersidev11.png';

var characterLopenv1 = new Image();
characterLopenv1.src ='../playerLOPENv1.png';

var characterv23 = new Image();
characterv23.src = '../playersidev23.png';

var characterv21 = new Image();
characterv21.src ='../playersidev21.png';

var characterLopenv16 = new Image();
characterLopenv16.src = '../playerLOPENv16.png';

//collectanten
var collectant = new Image();
var collectant2 = new Image();
collectant.src='../collectantv2.png';
collectant2.src='../collectantv3.png';

//achtergrond
var achtergrond = new Image();
achtergrond.src = '../straatv41.png';

//eindscherm
var eindImg = new Image();
eindImg.src='../eindschermv2.png';


	ctx=c.getContext("2d"),
	ctxBg=bgC.getContext("2d"),
	ctxGeld=gC.getContext("2d");
	ctxEind=eC.getContext("2d");
	ctxText=tC.getContext("2d");

	width = 800,
	height = 600,

	bgX= 0;
	bgY = 0,

	char = {
		width : 50,
		height : 400,
	},

	player = {
		x : width /2,
		y : height -5,
		width: 5,
		height: 300,
		speed: 3,
		velX: 0,
		velY: 0
	},
	keys = [];
	friction = 0.8;

	c.width = width;
	c.height = height;







//start scherm schrijven van text
function hints()
{
	ctxBg.font='25px Calibri';
	ctxBg.fillStyle='red';
	ctxBg.strokeStyle='orange';
	ctxBg.fillText("Houd SPATIEBALK ingedrukt voor een tip",300,330);
	ctxBg.strokeText("Houd SPATIEBALK ingedrukt voor een tip",300,330);
	ctxBg.fillText("Druk op ENTER om spel te starten!", 350, 420);
	ctxBg.fillText("Welkom bij het Collectanten spel van Let Op!", 120, 140);

	if(keys[32])
	{
		ctxBg.clearRect(0,0,800,600);
		loadBg();
		ctxBg.fillStyle='orange';
		ctxBg.strokeStyle='black';
		ctxBg.font='bold 23px Century Gothic';
		ctxBg.fillText(" <- Dit zijn je punten.", 130,28);
		ctxBg.strokeText(" <- Dit zijn je punten.", 130,28);
		ctxBg.fillText(" Je behaald punten door met SPATIEBALK geld te geven", 50,120);
		ctxBg.strokeText(" Je behaald punten door met SPATIEBALK geld te geven ", 50,120);
		ctxBg.fillText(" aan de juiste collectanten.",50,140);
		ctxBg.strokeText(" aan de juiste collectanten.",50,140);

		ctxBg.fillText("Probeer zoveel mogelijk punten te behalen voor de tijd op is",150,500);
		ctxBg.strokeText("Probeer zoveel mogelijk punten te behalen voor de tijd op is",150,500);
	}

}



//functies

//score optellen
function scoreBerekenen(){
	if((scoreOptellen === true) && (slechtDoel == false))
	{
		scoreOptellen==false;
		score ++;
	}
	if((scoreOptellen === true) && (slechtDoel == true))
	{
		scoreOptellen==false
		score --;
	}
}


//0 of 1 random voor het spawnen van collectant 1 of 2
function nulEen()
{

	colCheck = Math.floor(Math.random() * 2);
}

//
//achtergrond laten loopen, als spel draait (spelloopt)
function moveBg()
{
	
	//als spel niet loopt, beweeg achtergrond niet
	if(spelLoopt == false)
	{
		loadBg();
		hints();
		
	}
	else{
		// if(spelLoopt == true){
			ctxBg.clearRect(0,0,800,600);
	bgDrawX1 -= 3;
	bgDrawX2 -= 3;
	if(bgDrawX1 <= -1320)
	{
		bgDrawX1 = 1320;
	} else if(bgDrawX2<= -1320){
		bgDrawX2 = 1320;
	}
	loadBg();
	loadCollectant();
	}
	// }
}


//functie voor achtergrond inladen
function loadBg(){

	clearBg();
	ctxBg.drawImage(achtergrond,0,0,1320,height*2,bgDrawX1,bgY,1320,height*2);
	ctxBg.drawImage(achtergrond,0,0,1320,height*2,bgDrawX2,bgY,1320,height*2);
}


//collectant laten stilstaan voor de speler
//bij drukken op spatie geld geven en spel verder laten gaan
function freezeGame()
{
	if((drawX >= -655) && (drawX <= -653))
	{

		//textballon tekenen
		ctxBg.clearRect(0,0,800,600);
		ctxGeld.drawImage(textBallonImg,0,0,width,height,110,100,900,900);

		//functie aanroepen om textballon te vullen
		textSpawnen();


		//achtergrond stilzetten
		bgDrawX1 += 3;
		bgDrawX2 += 3;
		
		//speler en collectant stoppen
		player.speed = 0;

		//timer stoppen
		timer = timer + 20;

		//na drukken op spatiebalk herstart alles
		if(keys[32])
		{
			ctxBg.clearRect(0,0,800,600);
			ctxGeld.clearRect(0,0,500,380);

			bgDrawX1 -= 3;
			bgDrawX2 -= 3;
			player.speed = 3;
			drawX -= player.speed;
		}

	}
}


function textRandomGen()
{
	tGen = Math.floor(Math.random() * 4 );	
}

function textSpawnen()
	{
		
		switch(tGen){
		case(0): 
		ctxGeld.font="19px Calibri";
		ctxGeld.fillText("Goedendag!", 250, 160);
		ctxGeld.fillText("Heeft u misschien wat", 210, 180);
		ctxGeld.fillText("over voor zieke zwerfkatten", 180, 200);
		ctxGeld.fillText("in west Zwalulu? Elke gift", 180, 220);
		ctxGeld.fillText("is welkom!", 180, 240);

		slechtDoel = true;

			break;

		case(1): ctxGeld.font="19px Calibri";
		ctxGeld.fillText("He hallo!", 250,160);
		ctxGeld.fillText("Mijn naam is Lisa.", 210, 180);
		ctxGeld.fillText("Ik werk voor KWF", 220, 200);
		ctxGeld.fillText("kankerbestrijding. Hier ziet u ", 180, 220);
		ctxGeld.fillText("mijn identificatie. Zou u het KWF  ", 170, 240);
		ctxGeld.fillText("eenmalig willen steunen door", 170, 260);
		ctxGeld.fillText("middel van een eenmalige", 190, 280);
		ctxGeld.fillText("afschrijving?", 220, 300);
		console.log("case(1)");
			break;

		case(2): ctxGeld.font="19 px Calibri";
		ctxGeld.fillText("Dag! Heeft u", 240,160);
		ctxGeld.fillText("iets over voor slachtoffers", 200, 180);
		ctxGeld.fillText("van de overstromingen in", 200, 200);
		ctxGeld.fillText("Diemen zuid? U draagt hiermee ", 180, 220);
		ctxGeld.fillText("bij aan het herstellen van de schade ", 160, 240);
		ctxGeld.fillText("en de wederopbouw van de ", 180, 260);
		ctxGeld.fillText("gebouwen in de omgeving.", 190, 280);
		console.log("case(2)");

		slechtDoel = true;

		break;

		case(3): ctxGeld.font="19 px Calibri";
		ctxGeld.fillText("4e case",250,160);
		console.log("case(3)");
		break;

	}
	
	}




function loadCollectant()
{
	clearChar();

	//als character binnen beeld is, pas speed toe en teken opnieuw
	if(drawX > -1000)
	{
		drawX -= player.speed;
		spawnen();
	}

	//als character uit beeld verdwijnt (-800), roep generator opnieuw aan
	if(drawX < -1000)
	{
		nulEen();
		textRandomGen();
	}
	
}

//weghalen van tekeningen

function clearChar(){
	ctx.clearRect(0,0,800,600);
}

function clearGeld()
{
	ctxGeld.clearRect(0,0,800,600);
}

function clearBg()
{
	ctxBg.clearRect(0,0,1320,600);
}

//collectant 1 of 2 spawnen adhv uitkomst van random (0 of 1)
function spawnen()
	{
		
		switch(colCheck){
		case(0): ctxBg.drawImage(collectant,0,0,width,height,drawX+width,player.y+20,width-250,height-250);
			break;

		case(1): ctxBg.drawImage(collectant2,0,0,width,height,drawX+width,player.y+20,width-250,height-250);
			break;

	}
	
	}

//functie voor het tekenen van geld als collectant in de buurt van character is
//en het geld weer weghalen als de collectant er voor bij is.

function geefGeld()
{
	if(geld == true)
	{
		ctxGeld.drawImage(geldImg,0,0,800,600,120,380,100,80);
		
	}
	if (geld == false){
		clearGeld();
		
	}
	
	
}


//loop animatie van speler
function charLopen()
{

	// console.log('charlopen function');

	ctxBg.clearRect(0,0,800,600);

	if(spelLoopt == false)
	{
		ctxBg.drawImage(character,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
	}

	if(spelLoopt == true)
	{

	// volgorde?:
	// v11
	// lopenv1
	// v23
	// v21
	// lopenv16
		
		status++;
		if(status == 0)
		{

			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(character,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			console.log('status 0');	
		}

		if(status == 1)
		{
			console.log('status 1');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterv11,0,0,width,height,player.x-300,player.y+20,width-200,height-200);	
		}

		if(status == 2)
		{
			console.log('status 2');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterLopenv1,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			// status = -1;	
		}

		if(status == 3)
		{
			console.log('status 3');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterv23,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			// status = -1;	
		}

		if(status == 4)
		{
			console.log('status 4');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterv21,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			// status = -1;	
		}

		if(status == 5)
		{
			console.log('status 4');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterLopenv16,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			status = -1;	
		}
	}

}

	setInterval(function(){
		charLopen();

	}, 150);
	


//functie voor aflopende tijd
function timing()
{
	if(spelLoopt == true){


	// console.log(timer);
	if(timer > 0){
		timer = timer - 20;
		//lopen();
	}
	else{
		ctx.clearRect(0,0,800,600);
		ctxBg.clearRect(0,0,800,600);
		ctxGeld.clearRect(0,0,800,600);
		drawX = 0;
		ctxEind.drawImage(eindImg,0,0,800,600,0,0,800,600);
		drawText("Behaalde punten: " + score, "red");//, "orange");
		// tijdOp == true;
	}
	}
}



function drawText(text,fill)//,stroke)
{
	ctxEind.fillStyle=fill;
	// ctxEind.strokeStyle=stroke;
	ctxEind.fillText(text,400,330);
	ctxEind.fillText("Game Over!", 120, 140);
	//ctxEind.strokeText(text,10,120);
}




// functie voor update/refresh van speler
function update(){


	if(slechtDoel == true)
	{
		scoreBerekenen();
		slechtDoel = false;
		console.log('slechtdoel true');
	}


   //wanneer spatiebalk ingedrukt word en drawX, dus collectant, bij speler is, doe dingen
   if(keys[32])
   {
   	if(!spatiebalk)
   	{
   		spatiebalk = true;
   		
   			
   	if((drawX >= -800) && (drawX <= -500))
   		{
   			// punten ++;
   			scoreOptellen = true;
   			geld = true;
   			scoreBerekenen();
   			geefGeld();
   		}
   	else
   		{
   			geld=false;
   			geefGeld();
   			}
   		}
   }

   if(keys[13]){
   	spelLoopt = true;
   	moveBg();
   	console.log('spelloopt true');


   }

   if(keys[16]){
   	console.log(drawX);
   }

   if(drawX <= -1000){
   	drawX = Math.floor(Math.random() * 1000);
   }
   

//als speler naar links of rechts beweegd, "sliden" ipv "teleporten"
player.velX *= friction;
player.velY *= friction;
player.x += player.velX;
player.y += player.velY;

//boundairy controle dat speler niet buiten scherm kan.

if (player.x >= width-player.width+230)
 {
    player.x = width-player.width+230;
} else if (player.x <= 300)
{
    player.x = 300;
}


if(player.y >= height-player.height)
{
	player.y = height-player.height;
}else if(player.y <=0)
{
player.y=0;
}


//als de collectant voorbij de speler is(of voorbij waarde X)
//zet geld op false en roep de methode aan, om geld weg te halen.
if(drawX < -800){
	geld=false;
	geefGeld();
}

timing();

freezeGame();


	//achtergrond laden
	loadBg();

	//achtergrond laten bewegen bij start
	moveBg();

	// speler tekenen komt hier
	ctx.clearRect(0,0,width,height);
	// ctxBg.drawImage(character,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
	
	//'refreshen'
	requestAnimationFrame(update);

	//defineren en tekenen van text met scores
	ctxEind.clearRect(0,0,800,600);
	ctxEind.font='25px Franklin Gothic Medium';
	ctxEind.fillStyle="#ffffff";
	ctxEind.fillText("Punten: " + score,20,30);
	ctxBg.fillText("Tijd: " + timer/1000 + " s", 650, 30);

}

// luisteren naar toetsen
	document.body.addEventListener("keydown", function(e) 
	{
    keys[e.keyCode] = true;
	});
 
	document.body.addEventListener("keyup", function(e) 
	{

    keys[e.keyCode] = false;
   	scoreOptellen=false;
   	spatiebalk=false;
	//scoreBerekenen=false;
	});



// om te zorgen dat het gebruikt word
window.addEventListener("load", function(){
	update();
	loadBg();
	loadCollectant();
	colCheck = 1;
	spawnen();
	scoreBerekenen();
	textRandomGen();

});