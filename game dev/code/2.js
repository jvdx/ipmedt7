<script>
var c=document.getElementById("canvas");
var ctx=c.getContext("2d");

//achtergrond defineren
var PLAYGROUND_HEIGHT = 500;
        var PLAYGROUND_WIDTH = 800;

//groep maken
        $("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH});

//achtergrond, characters en coins in groep aanmaken
        $.playground().addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
           .addGroup("characters", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
           .addGroup("coins",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end();

var straat = new $.gameQuery.Animation({imageURL: "straat.png"});
        var PLAYGROUND_WIDTH = 700;
        var PLAYGROUND_HEIGHT  = 250;

        var straat2 = new $.gameQuery.Animation({imageURL: "straat2.png"});

        $("#background").
           .addSprite("straat", {animation: straat,
                       width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
           .addSprite("straat2", {animation: straat2,
                       width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT,
                       posx: PLAYGROUND_WIDTH})


</script>


// 
// //achtergrond defineren
// var PLAYGROUND_HEIGHT = 600;
//         var PLAYGROUND_WIDTH = 800;

// //groep maken
//         $("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH});

// //achtergrond, characters en coins in groep aanmaken
//         $.playground().addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
//        		.addGroup("characters", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
//           	.addGroup("coins",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end();

// var straat = new $.gameQuery.Animation({imageURL: "straat.png"});
//         var PLAYGROUND_WIDTH	= 700;
//         var PLAYGROUND_HEIGHT	= 250;

//         var straat2 = new $.gameQuery.Animation({imageURL: "straat2.png"});

//         $("#background").
//            .addSprite("straat", {animation: straat,
//                        width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
//            .addSprite("straat2", {animation: straat2,
//                        width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT,
//                        posx: PLAYGROUND_WIDTH})
