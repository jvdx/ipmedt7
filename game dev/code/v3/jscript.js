//IPMEDT7 INF3C1
//Jan van Dijk
//s1070923
//Goede doelen fraude game
//v0.3
//5 december 2013


// functie voor animatie
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var c=document.getElementById("spelerCanvas");
var bgC=document.getElementById("bgCanvas");
var achtergrond = new Image();

var punten = 0;

var drawX = Math.floor(Math.random() * 1000);
var bgDrawX1 = 0;
var bgDrawX2 = 1320;

var character = new Image();
character.src='player1.png';

var collectant = new Image();
collectant.src='collectantv2.png';

achtergrond.src = 'straatv41.png';

	ctx=c.getContext("2d"),
	ctx.linewidth = 1;
	ctx.fillStyle='black';
	ctx.lineStyle="#ffffff";
	ctx.font="18px sans-serif";
	ctx.fillText("dit is test tekst", 20,20);
	ctxBg=bgC.getContext("2d"),
	width = 800,
	height = 600,

	// backg = {
	// 	bg
	// }

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
//character inladen
function loadCharacter(){
	clearChar();
	// ctxBg.drawImage(character,0,0,width,height,0,0,width-400,height-200);
}

function loadCollectant()
{
	clearChar();

	if(drawX > -1000)
	{
		drawX -= player.speed;
	}
	
	
	// console.log('collectant');
	// console.log(drawX);
}

function clearChar(){
	ctx.clearRect(0,0,800,600);
	// console.log('plz respons');
}

function clearBg()
{
	ctxBg.clearRect(0,0,1320,600);
}
// functie voor update/refresh van speler
function update(){
	// check keys
   // if (keys[38]) {
   //     // up arrow
   //     // if(player.velY < player.speed){
   //     	// bgX -= 10;
   //     	//achtergrond bewegen bij pijltje;
   //     	moveBg();
   //     	console.log("upupup");
   //     // }
   // }
       	
   //     if(keys[40]) {
   // 	//onder arrow
   // 	if(player.velY > -player.speed){
   // 		player.velY++;
   // 	}
   // }

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

   //wanneer spatiebalk ingedrukt word en drawX, dus collectant, bij speler is, doe dingen
   if(keys[32]){
   	if((drawX > -800) && (drawX < -500)){
   		// console.log('spatiebalk punten');
   		punten ++;
   		console.log(punten);
   	}
   }

   if(drawX <= -1000){
   	drawX = Math.floor(Math.random() * 1000);
   }
   

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

// if(player.x <= width-player.width)
// {
// 	player.x = width-player.width;
// } else if(player.x >= 0)
// {
// 	player.x = 0;

// }
if(player.y >= height-player.height)
{
	player.y = height-player.height;
}else if(player.y <=0)
{
player.y=0;
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

	//collectant op random locatie
	ctxBg.drawImage(collectant,0,0,width,height,drawX+width,player.y+20,width-250,height-250);

	//'refreshen'
	requestAnimationFrame(update);

}

// luisteren naar toetsen
	document.body.addEventListener("keydown", function(e) 
	{
    keys[e.keyCode] = true;
	});
 
	document.body.addEventListener("keyup", function(e) 
	{
    keys[e.keyCode] = false;
	});

// om te zorgen dat het gebruikt word
window.addEventListener("load", function(){
	update();
	// moveBg();
	loadBg();
	loadCharacter();
	loadCollectant();
});