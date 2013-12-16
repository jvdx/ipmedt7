//IPMEDT7 INF3C1
//Jan van Dijk
//s1070923
//Goede doelen fraude game
//v0.6 - timer om spel af te laten lopen en score fixed
//10 december 2013


// functie voor animatie
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var c=document.getElementById("spelerCanvas");
var bgC=document.getElementById("bgCanvas");
var gC=document.getElementById("geldCanvas");

//score
var punten = 0;
var scoreOptellen = false;
var scoreAftrekken = false;
var score = 0;
var geld = false;

//timer voor spel einde etc
var timer = 30000;
var tijdOp = false;

//random generator maken voor X coordinaat van collectant
var colCheck;
var drawX = Math.floor(Math.random() * 1000);

//begin en eind van achtergrond
var bgDrawX1 = 0;
var bgDrawX2 = 1320;

var geldImg = new Image();
geldImg.src='../geld.png';

//definieren van afbeeldingen
var character = new Image();
character.src='../player1.png';

var collectant = new Image();
var collectant2 = new Image();
collectant.src='../collectantv2.png';
collectant2.src='../collectantv3.png';


var achtergrond = new Image();
achtergrond.src = '../straatv41.png';

	ctx=c.getContext("2d"),
	ctxBg=bgC.getContext("2d"),
	ctxGeld=gC.getContext("2d");

	width = 800,
	height = 600,

	bgX= 0;
	console.log('bgx');
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
		speed: 5,
		velX: 0,
		velY: 0
	},
	keys = [];
	friction = 0.8;

	c.width = width;
	c.height = height;


























//functies

//score evenredig optellen, nog work in progress
function scoreBerekenen(){
	if(scoreOptellen === true)
	{
		scoreOptellen==false; //#########################################?
		score ++;
		
		console.log('hij telt op');
	}
	// if(scoreAftrekken === true)
	// {
	// 	scoreAftrekken==false;
	// 	score--;
	// }
}


//0 of 1 random voor het spawnen van collectant 1 of 2
function nulEen()
{

	colCheck = Math.floor(Math.random() * 2);
	console.log("nuleen");
}

//achtergrond laten loopen
function moveBg()
{
	bgDrawX1 -= 5;
	bgDrawX2 -= 5;
	if(bgDrawX1 <= -1320)
	{
		bgDrawX1 = 1320;
	} else if(bgDrawX2<= -1320){
		bgDrawX2 = 1320;
	}
	loadBg();
	loadCollectant();
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
	//timer = timer - 20;
	console.log(timer);
	if(timer > 0){
		timer = timer - 20;
	}
	else{
		ctxBg.fillRect(0,0,800,600);
		ctxBg.fillStyle('black');
		tijdOp = true;
	}
}












var spatiebalk = false;

// functie voor update/refresh van speler
function update(){

   if (keys[39]) {
       // right arrow
       if (player.velX < player.speed) {                         
           player.velX++;                  
       }          
   }          
   if (keys[37]) {                 
        // left arrow                  
       if (player.velX > -player.speed) {
           player.velX--;
       }
   }



//##############
   //wanneer spatiebalk ingedrukt word en drawX, dus collectant, bij speler is, doe dingen
   if(keys[32])
   {
   	if(!spatiebalk){
   			spatiebalk = true;
   			console.log( "een keer maar!");
   		
   			
   	if((drawX >= -800) && (drawX <= -500)){
   		// punten ++;
   		scoreOptellen = true;
   		geld = true;
   		scoreBerekenen();
   		geefGeld();
   	}
   	else{
   		geld=false;
   		geefGeld();
   	}
   	}
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

if(tijdOp = true){

}

	// speler tekenen komt hier
	ctx.clearRect(0,0,width,height);
	
	//achtergrond laden
	loadBg();

	//achtergrond laten bewegen bij start
	moveBg();

	// ctx.fillStyle = "red";
	// ctx.fillRect(player.x, player.y, player.width, player.height);
	ctxBg.drawImage(character,0,0,width,height,player.x-300,player.y+20,width-200,height-200);	

	//'refreshen'
	requestAnimationFrame(update);

	//defineren en tekenen van text met scores
	ctx.font='25px Franklin Gothic Medium';
	ctx.fillStyle="#ffffff";
	ctx.fillText("Punten: " + score,8,20);
	console.log(score);

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