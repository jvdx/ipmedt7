//IPMEDT7 INF3C1
//Jan van Dijk
//s1070923
//Goede doelen fraude game
// v0.8.3 mogelijkheid geven om geen geld te geven. ook punt wanneer je slecht doel weigerd. laatste scenario nog
//11 januari 2014


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

var nee = false;

var slechtDoel = false;

//timer voor spel einde etc
var timer = 30000;
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

var transparant = new Image();
transparant.src='../../trans.png';

//textballon var en image
// var textBallon = false;
var textBallonImg = new Image();
textBallonImg.src='../../textballon.gif';

//geld
var geldImg = new Image();
geldImg.src='../../geld.png';

//definieren van afbeeldingen
var character = new Image();
character.src='../../player1.png';

//speler tekeningen laden, bewegende benen

// volgorde?:
// v11
// lopenv1
// v23
// v21
// lopenv16

var characterv11 = new Image();
characterv11.src ='../../playersidev11.png';

var characterLopenv1 = new Image();
characterLopenv1.src ='../../playerLOPENv1.png';

var characterv23 = new Image();
characterv23.src = '../../playersidev23.png';

var characterv21 = new Image();
characterv21.src ='../../playersidev21.png';

var characterLopenv16 = new Image();
characterLopenv16.src = '../../playerLOPENv16.png';

//collectanten
var collectant = new Image();
var collectant2 = new Image();
collectant.src='../../collectantv2.png';
collectant2.src='../../collectantv3.png';

//achtergrond
var achtergrond = new Image();
achtergrond.src = '../../straatv41.png';

//eindscherm
var eindImg = new Image();
eindImg.src='../../eindschermv2.png';


	
	ctxBg=bgC.getContext("2d"),
	ctxGeld=gC.getContext("2d");
	ctxEind=eC.getContext("2d");
	ctxText=tC.getContext("2d");
	ctx=c.getContext("2d"),

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
	ctxBg.drawImage(transparant,0,0,10,10,bgDrawX1,bgY,1320,600);
	ctxBg.font='25px Calibri bold';
	ctxBg.fillStyle='black';
	ctxBg.strokeStyle='orange';
	ctxBg.fillText("Houd de RECHTER PIJL toets ingedrukt voor spel instructies",160,330);
	// ctxBg.strokeText("Houd SPATIEBALK ingedrukt voor een tip",300,330);
	ctxBg.fillText("Druk op ENTER om spel te starten!", 350, 420);
	ctxBg.fillText("Welkom bij het Collectanten spel van Let Op!", 120, 140);

	if(keys[39])
	{
		ctxBg.clearRect(0,0,800,600);
		loadBg();
		ctxBg.drawImage(transparant,0,0,10,10,bgDrawX1,bgY,1320,600);
		ctxBg.fillStyle='black';
		ctxBg.strokeStyle='black';
		ctxBg.font=' 23px Century Gothic bold';
		ctxBg.fillText(" <- Dit zijn je punten.", 130,28);
		// ctxBg.strokeText(" <- Dit zijn je punten.", 130,28);
		ctxBg.fillText(" Je behaald punten door met de 'J' toets geld te geven", 50,130);
		// ctxBg.strokeText(" Je behaald punten door met SPATIEBALK geld te geven ", 50,120);
		ctxBg.fillText(" aan de juiste collectanten.",50,150);
		// ctxBg.strokeText(" aan de juiste collectanten.",50,140);

		ctxBg.fillText("Vertrouw je het verhaal van de collectant niet?", 50, 320);
		// ctxBg.strokeText("Vertrouw je het verhaal van de collectant niet?", 50, 320);
		ctxBg.fillText("Gebruik dan de 'N' toets om geen geld te geven en door te lopen", 50, 340);
		// ctxBg.strokeText("Gebruik dan de 'N' toets om geen geld te geven en door te lopen", 50, 340);

		ctxBg.fillText("Probeer zoveel mogelijk punten te behalen voordat de tijd voorbij is.",20,500);
		// ctxBg.strokeText("Probeer zoveel mogelijk punten te behalen voordat de tijd voorbij is",30,500);
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
		scoreOptellen==false;
		score --;
		score --;
	}

	//ook punt krijgen als je een slecht doel weigerd.
	if((slechtDoel == true) && (nee==true))
	{
		console.log('nee');
		score ++;
		nee=false;
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
	else
	{
		ctxBg.clearRect(0,0,800,600);
		bgDrawX1 -= 3;
		bgDrawX2 -= 3;
			if(bgDrawX1 <= -1320)
			{
				bgDrawX1 = 1320;
			} else if(bgDrawX2<= -1320)
			{
				bgDrawX2 = 1320;
			}
	loadBg();
	loadCollectant();
	}

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
		ctxText.clearRect(0,0,800,600);
		ctxText.drawImage(textBallonImg,0,0,width,height,110,100,900,900);

		//functie aanroepen om textballon te vullen
		textSpawnen();

		status = 6;

		//achtergrond stilzetten
		bgDrawX1 += 3;
		bgDrawX2 += 3;
		
		//speler en collectant stoppen
		player.speed = 0;

		//timer stoppen
		timer = timer + 20;

		//na drukken op spatiebalk herstart alles
		if(keys[74] || keys[78])
		{
			ctxBg.clearRect(0,0,800,600);
			ctxGeld.clearRect(0,0,500,380);

			bgDrawX1 -= 3;
			bgDrawX2 -= 3;
			player.speed = 3;
			drawX -= player.speed;
			status = 0;
		}

		if(keys[78])
		{
			nee = true;
		}


	}
}


function textRandomGen()
{
	tGen = Math.floor(Math.random() * 4 )	
}

function textSpawnen()
	{
		
		switch(tGen){
		case(0): 
		ctxText.font="19px Calibri";
		ctxText.fillText("Goedendag!", 250, 160);
		ctxText.fillText("Heeft u misschien wat", 210, 180);
		ctxText.fillText("over voor zieke zwerfkatten", 180, 200);
		ctxText.fillText("in west Zwalulu? Elke gift", 180, 220);
		ctxText.fillText("is welkom! Ik heb alleen", 180, 240);
		ctxText.fillText("uw handtekening hier nodig!", 180, 260);

		slechtDoel = true;

			break;

		case(1): ctxText.font="19px Calibri";
		ctxText.fillText("He hallo!", 250,160);
		ctxText.fillText("Mijn naam is Lisa.", 210, 180);
		ctxText.fillText("Ik werk voor het KWF", 200, 200);
		ctxText.fillText("kankerbestrijdingfonds. Hier ziet ", 175, 220);
		ctxText.fillText(" u mijn identificatie. Zou u het KWF  ", 157, 240);
		ctxText.fillText("eenmalig willen steunen door", 170, 260);
		ctxText.fillText("middel van een eenmalige", 190, 280);
		ctxText.fillText("afschrijving?", 220, 300);
		console.log("case(1)");
			break;

		case(2): ctxText.font="19 px Calibri";
		ctxText.fillText("Dag! Heeft u", 240,160);
		ctxText.fillText("iets over voor slachtoffers", 200, 180);
		ctxText.fillText("van de overstromingen in", 200, 200);
		ctxText.fillText("Diemen zuid? U draagt hiermee ", 180, 220);
		ctxText.fillText("bij aan het herstellen van de schade ", 160, 240);
		ctxText.fillText("en de wederopbouw van de ", 180, 260);
		ctxText.fillText("gebouwen in de omgeving.", 190, 280);
		console.log("case(2)");

		slechtDoel = true;

		break;

		case(3): ctxText.font="19 px Calibri";
		ctxText.fillText("Heeft u misschien ",230,160);
		ctxText.fillText("iets over voor de ",200,180);
		ctxText.fillText("nederlandse Hartstichting? Hier ",175,200);
		ctxText.fillText("ziet u mijn Hartstichting legitimatie ",170,220);
		ctxText.fillText("bewijs. Met uw gift kunnen wij  ",180,240);
		ctxText.fillText("helpen met onderzoeken en zo",180,260);
		ctxText.fillText("mogelijk levens redden!",200,280);
		
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
	ctxText.clearRect(0,0,800,600);
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
		ctxText.drawImage(geldImg,0,0,800,600,120,380,100,80);
		
	}
	if (geld == false){
		clearGeld();
		
	}
	
	
}


//loop animatie van speler
function charLopen()
{

	ctxBg.clearRect(0,0,800,600);

	if(spelLoopt == true)
	{
		
		status++;
		if(status == 0)
		{

			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(character,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			// console.log('status 0');	
		}

		if(status == 1)
		{
			// console.log('status 1');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterv11,0,0,width,height,player.x-300,player.y+20,width-200,height-200);	
		}

		if(status == 2)
		{
			// console.log('status 2');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterLopenv1,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			// status = -1;	
		}

		if(status == 3)
		{
			// console.log('status 3');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterv23,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			// status = -1;	
		}

		if(status == 4)

		{
			// console.log('status 4');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterv21,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			// status = -1;	
		}

		if(status == 5)
		{
			// console.log('status 4');
			ctxGeld.clearRect(0,0,800,600);
			ctxGeld.drawImage(characterLopenv16,0,0,width,height,player.x-300,player.y+20,width-200,height-200);
			status = -1;	
		}

		if(status == 6)
		{
			// console.log('stilstaan status');
			ctxBg.drawImage(character,0,0,width,height,player.x-300,player.y+20,width-200,height-200);

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
		ctxText.clearRect(0,0,800,600);
		// ctxEind.clearRect(0,0,800,600);
		bgDrawX1 +=3;
		bgDrawX2 +=3;
		drawX = 0;
		status = 6;
		ctxEind.drawImage(eindImg,0,0,800,600,0,0,800,600);

		//tekst weergeven a.d.h.v. de behaalde score
		if(score <= 0)
		{
			drawText("Je hebt " + score + " punten behaald", "", "red");//, "orange");
			drawText(" ", "Probeer het nog een keer!", "red");
			drawText3("Tip: Let bij collectanten goed op of zij een identificatie bij zich dragen.",
				"Dit is namelijk verplicht voor alle collectanten!","Vraag hier ook vooral naar wanneer je twijfelt!", "white");
		}
		if(score == 1)
		{
			drawText("Je hebt " + score + " punt behaald", "", "red");//, "orange");
			drawText(" ", "Goed gedaan!", "red");
			drawText3("Tip: Let bij collectanten goed op of zij een identificatie bij zich dragen.",
				"Dit is namelijk verplicht voor alle collectanten!","Vraag hier ook vooral naar wanneer je twijfelt!", "white");
		}
		if((score > 1)&&(score<3))
		{
			drawText("Je hebt " + score + " punten behaald", "", "red");//, "orange");
			drawText(" ", "Goed gedaan!", "red");
			drawText3("Tip: Let bij collectanten goed op of zij een identificatie bij zich dragen.",
				"Dit is namelijk verplicht voor alle collectanten!","Vraag hier ook vooral naar wanneer je twijfelt!", "white");
		}
		if(score >= 3)
		{
			drawText("Je hebt " + score + " punten behaald", "", "red");//, "orange");
			drawText(" ", "Uitstekend gedaan!", "red");
			drawText3("Je weet precies welke collectanten je wel", "en niet kan vertrouwen", " ", "white");
		}
	
	}
	}
}


//de functies van het schrijven van tekst. Verschillende regels door gebruik van andere vars(text en text2);
function drawText(text,text2,fill)//,stroke)
{
	ctxEind.fillStyle=fill;
	// ctxEind.strokeStyle=stroke;
	ctxEind.fillText(text,400,330);
	ctxEind.fillText(text2,400, 360);
	ctxEind.fillText("Game Over!", 120, 140);
	//ctxEind.strokeText(text,10,120);
}

function drawText3(text,text2,text3,fill)//,stroke)
{
	ctxEind.font='18px Franklin Gothic Medium';
	ctxEind.fillStyle=fill;
	ctxEind.fillText(text,200,420);
	ctxEind.fillText(text2,200,440);
	ctxEind.fillText(text3,200,460);
}




// functie voor update/refresh van speler
function update(){


	if(slechtDoel == true)
	{
		scoreBerekenen();
		slechtDoel = false;
		// console.log('slechtdoel true');
	}




   //wanneer spatiebalk ingedrukt word en drawX, dus collectant, bij speler is, doe dingen
   if(keys[74])
   {
   	if(!spatiebalk)
   	{
   		spatiebalk = true;
   		
   	//als nu de collectant bij de speler is binnen bepaalde coordinaten tel de score op en laat animatie zien
   	if((drawX >= -800) && (drawX <= -500))
   		{
   			// punten ++;
   			scoreOptellen = true;
   			geld = true;
   			scoreBerekenen();
   			geefGeld();
   		}

   	//zo niet, geen geld erbij
   	else
   		{
   			geld=false;
   			geefGeld();
   			}
   		}
   }

   //enter om spel te starten
   if(keys[13]){
   	if(spelLoopt==false)
   	{
   		spelLoopt = true;
   		moveBg();
   	}
   	
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
	// ctxEind.clearRect(0,0,800,600);
	ctxEind.font='25px Franklin Gothic Medium';
	ctxEind.fillStyle="#ffffff";
	ctxBg.fillText("Punten: " + score,20,30);
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