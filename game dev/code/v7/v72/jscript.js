//IPMEDT7 INF3C1
//Jan van Dijk
//s1070923
//Goede doelen fraude game
//v0.72 - collectanten tekstballonnen?
//14 december 2013


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

//timer voor spel einde etc
var timer = 20000;
var timer2;
var tijdOp = false;

//spatiebalk op false zetten om te voorkomen dat punten doortellen
var spatiebalk = false;

var spelLoopt = false;

//random generator maken voor X coordinaat van collectant
var colCheck;
var drawX = Math.floor(Math.random() * 100);

//begin en eind van achtergrond
var bgDrawX1 = 0;
var bgDrawX2 = 1320;

var geldImg = new Image();
geldImg.src='../../geld.png';

//definieren van afbeeldingen
var character = new Image();
character.src='../../player1.png';

var collectant = new Image();
var collectant2 = new Image();
collectant.src='../../collectantv2.png';
collectant2.src='../../collectantv3.png';


var achtergrond = new Image();
achtergrond.src = '../../straatv41.png';

var eindImg = new Image();
eindImg.src='../../eindschermv2.png';

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
	if(scoreOptellen === true)
	{
		scoreOptellen==false;
		score ++;
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
		// clearGeld();
		// console.log('geld is true');
	}
	if (geld == false){
		clearGeld();
		
	
	// console.log('geld is false');
	}
	
	
}



//functie voor aflopende tijd
function timing()
{
	if(spelLoopt == true){


	console.log(timer);
	if(timer > 0){
		timer = timer - 20;
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

   // if (keys[39]) {
   //     // right arrow
   //     if (player.velX < player.speed) {                         
   //         player.velX++;                  
   //     }          
   // }          
   // if (keys[37]) {                 
   //      // left arrow                  
   //     if (player.velX > -player.speed) {
   //         player.velX--;
   //     }
   // }



//##############
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


	//achtergrond laden
	loadBg();

	//achtergrond laten bewegen bij start
	moveBg();

	// speler tekenen komt hier
	ctx.clearRect(0,0,width,height);
	ctxBg.drawImage(character,0,0,width,height,player.x-300,player.y+20,width-200,height-200);	
	
	
	//'refreshen'
	requestAnimationFrame(update);

	//defineren en tekenen van text met scores
	ctxEind.font='25px Franklin Gothic Medium';
	ctxEind.fillStyle="#ffffff";
	ctxEind.fillText("Punten: " + score,8,30);
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
	spawnen();
	scoreBerekenen();

});