const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


canvas.width = 500;
canvas.height = 500;



// =======================
// VARIABLES
// =======================


let score = 0;


let speed = 5;


const maxSpeed = 12;


let gameOver = false;






// =======================
// FIREBASE SCORE
// =======================


async function saveScore(){


try{


let pseudo = prompt(
"🦈 GAME OVER !\n\nEntre ton pseudo 🐟"
);



if(!pseudo || pseudo.trim()===""){


pseudo="Anonyme";


}



await addDoc(
collection(db,"scores"),
{


pseudo:pseudo,


score:score,


date:new Date()


}

);



}


catch(error){


console.log(error);


}


}







// =======================
// SYSTEME DE SKINS
// =======================



let currentSkin =
localStorage.getItem("skin")
||
"rouge";




// =======================
// POISSON
// =======================


let fish = {


x:250,


y:250,


dx:speed,


dy:0,


direction:"right"


};







// =======================
// IMAGES SKINS
// =======================


let fishImages = {


rouge:new Image(),


nemo:new Image(),


ballon:new Image(),


requin:new Image(),


whale:new Image(),


octo:new Image()


};







fishImages.rouge.src =
"./fishImages/rouge.png";


fishImages.nemo.src =
"./fishImages/nemo.png";


fishImages.ballon.src =
"./fishImages/ballon.png";


fishImages.requin.src =
"./fishImages/requin.png";


fishImages.whale.src =
"./fishImages/whale.png";


fishImages.octo.src =
"./fishImages/octo.png";






// =======================
// EQUIPER UN SKIN
// =======================


function equipSkin(skin){


    // Vérifie que le skin existe

    if(fishImages[skin]){


        // Sauvegarde le skin choisi

        localStorage.setItem(
            "skin",
            skin
        );



        console.log(
            "Nouveau skin équipé :",
            skin
        );



        // Recharge automatiquement le jeu

        location.reload();



    }

    else{


        console.log(
            "Skin introuvable :",
            skin
        );


    }


}



// =======================
// REQUIN ENNEMI
// =======================



let shark = {


x:600,


y:200,


dx:-5,


dy:0


};





let sharkImage = new Image();


sharkImage.src =
"./fishImages/shark.png";



let sharkActive=false;


let sharkTimer=0;


let lastSharkScore=0;








// =======================
// ALGUE
// =======================



let algae={


x:100,


y:100


};






function newAlgae(){



algae.x =
Math.floor(
Math.random()*25
)
*
20;



algae.y =
Math.floor(
Math.random()*25
)
*
20;



}








// =======================
// CONTROLES
// =======================



function changeDirection(x,y){



if(gameOver)

return;




fish.dx=x;


fish.dy=y;




if(x<0)


fish.direction="left";



if(x>0)


fish.direction="right";



}






document.addEventListener(
"keydown",
function(e){



if(e.key==="ArrowUp")

changeDirection(
0,
-speed
);



if(e.key==="ArrowDown")

changeDirection(
0,
speed
);



if(e.key==="ArrowLeft")

changeDirection(
-speed,
0
);



if(e.key==="ArrowRight")

changeDirection(
speed,
0
);



});
// =======================
// TOUCH TELEPHONE
// =======================


function addTouch(id,x,y){


let button =
document.getElementById(id);



if(button){


button.addEventListener(
"touchstart",
function(e){


e.preventDefault();


changeDirection(
x,
y
);



});


}



}



addTouch(
"up",
0,
-speed
);


addTouch(
"down",
0,
speed
);


addTouch(
"left",
-speed,
0
);


addTouch(
"right",
speed,
0
);








// =======================
// UPDATE DU JEU
// =======================


function update(){



if(gameOver)

return;





// =======================
// MOUVEMENT POISSON
// =======================


fish.x += fish.dx;


fish.y += fish.dy;







// =======================
// APPARITION REQUIN
// =======================



if(


score > 0 &&


score % 5 === 0 &&


score !== lastSharkScore &&


sharkActive === false



){



sharkActive=true;



lastSharkScore=score;



sharkTimer=Date.now();





shark.x =
canvas.width+100;



shark.y =
Math.random()*350;




shark.dx =
-(Math.random()*2+5);



shark.dy =
Math.random()*3-1.5;



}







// =======================
// MOUVEMENT REQUIN
// =======================


if(sharkActive){



shark.x += shark.dx;


shark.y += shark.dy;






if(Math.random()<0.03){


shark.dy =
Math.random()*4-2;


}





if(shark.y<0){


shark.y=0;


shark.dy*=-1;


}




if(shark.y>410){


shark.y=410;


shark.dy*=-1;


}






if(
Date.now()-sharkTimer
>
6000
){


sharkActive=false;


}



}







// =======================
// TELEPORTATION POISSON
// =======================



if(fish.x<0)


fish.x=canvas.width;




if(fish.x>canvas.width)


fish.x=0;





if(fish.y<0)


fish.y=canvas.height;




if(fish.y>canvas.height)


fish.y=0;









// =======================
// MANGER ALGUE
// =======================



if(


Math.abs(
(fish.x+35)
-
(algae.x+10)
)
<
45



&&



Math.abs(
(fish.y+35)
-
(algae.y+10)
)
<
45



){



score++;





speed =
Math.min(
speed+0.15,
maxSpeed
);







if(fish.dx>0)

fish.dx=speed;



if(fish.dx<0)

fish.dx=-speed;



if(fish.dy>0)

fish.dy=speed;



if(fish.dy<0)

fish.dy=-speed;







let scoreBox =
document.getElementById(
"score"
);



if(scoreBox){



scoreBox.innerHTML =


"Algues : "
+
score
+
" | Vitesse : "
+
speed.toFixed(1);



}







newAlgae();



}








// =======================
// COLLISION REQUIN
// =======================



if(sharkActive){



let dx =
(fish.x+35)
-
(shark.x+75);



let dy =
(fish.y+35)
-
(shark.y+45);





let distance =
Math.sqrt(
dx*dx + dy*dy
);





if(distance<55){



// protection skin requin plus tard


if(currentSkin==="requin"){



sharkActive=false;



console.log(
"Le skin requin a sauvé Bubulle 🦈"
);



}

else{



endGame();



}



}



}





}









// =======================
// GAME OVER
// =======================



async function endGame(){



if(gameOver)

return;





gameOver=true;



await saveScore();






let box =
document.getElementById(
"gameOver"
);



let final =
document.getElementById(
"finalScore"
);






if(final){


final.innerHTML =


"Score : "
+
score
+
" 🌿";



}






if(box){



box.style.display="block";



}



}
// =======================
// FOND OCEAN EVOLUTIF
// =======================


function drawOceanBackground(){



if(score < 15){



let gradient =
ctx.createLinearGradient(
0,
0,
0,
500
);



gradient.addColorStop(
0,
"#4bd3ff"
);



gradient.addColorStop(
1,
"#ffe29a"
);



ctx.fillStyle=gradient;



ctx.fillRect(
0,
0,
500,
500
);





ctx.fillStyle="#d8bd75";

ctx.fillRect(
0,
430,
500,
70
);





ctx.font="30px Arial";


ctx.fillText(
"🫧",
80,
100
);


ctx.fillText(
"🫧",
350,
180
);



}






else if(score < 30){



let gradient =
ctx.createLinearGradient(
0,
0,
0,
500
);



gradient.addColorStop(
0,
"#00e5ff"
);



gradient.addColorStop(
1,
"#006994"
);



ctx.fillStyle=gradient;



ctx.fillRect(
0,
0,
500,
500
);





ctx.font="45px Arial";


ctx.fillText(
"🪸",
50,
430
);


ctx.fillText(
"🪸",
400,
430
);



ctx.font="25px Arial";


ctx.fillText(
"🐠",
100,
120
);



ctx.fillText(
"🐠",
350,
200
);



}







else if(score < 50){



let gradient =
ctx.createLinearGradient(
0,
0,
0,
500
);



gradient.addColorStop(
0,
"#005577"
);



gradient.addColorStop(
1,
"#002b45"
);



ctx.fillStyle=gradient;



ctx.fillRect(
0,
0,
500,
500
);





ctx.font="90px Arial";


ctx.fillText(
"🚢",
200,
350
);



ctx.font="30px Arial";


ctx.fillText(
"⚓",
80,
420
);



}






else{



ctx.fillStyle="#00152e";



ctx.fillRect(
0,
0,
500,
500
);





ctx.font="50px Arial";



ctx.fillText(
"✨",
80,
120
);



ctx.fillText(
"✨",
380,
180
);



ctx.fillText(
"💡",
250,
420
);



}



}









// =======================
// AFFICHAGE DU JEU
// =======================



function draw(){



ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);





drawOceanBackground();







// ALGUE



ctx.font="45px Arial";



ctx.fillText(

"🌿",

algae.x,

algae.y+35

);







// REQUIN



if(
sharkActive
&&
sharkImage.complete
){



ctx.drawImage(

sharkImage,

shark.x,

shark.y,

150,

95

);



}








// POISSON SKIN



let img =
getFishImage();





if(
img.complete
&&
img.naturalWidth>0
){



if(
fish.direction==="left"
){



ctx.save();



ctx.scale(
-1,
1
);



ctx.drawImage(

img,

-fish.x-70,

fish.y,

70,

70

);



ctx.restore();



}

else{



ctx.drawImage(

img,

fish.x,

fish.y,

70,

70

);



}



}



update();



requestAnimationFrame(draw);



}










// =======================
// CASIER
// =======================



function openLocker(){



let locker =
document.getElementById(
"locker"
);



if(locker){


locker.style.display="block";


}



}




function closeLocker(){



let locker =
document.getElementById(
"locker"
);



if(locker){


locker.style.display="none";


}



}









// =======================
// CLASSEMENT
// =======================



async function showRanking(){



let ranking =
document.getElementById(
"ranking"
);



let list =
document.getElementById(
"rankingList"
);





if(
!ranking
||
!list
)

return;





ranking.style.display="block";



list.innerHTML=
"Chargement...";






try{



const q =
query(

collection(db,"scores"),

orderBy(
"score",
"desc"
),

limit(10)

);







const result =
await getDocs(q);






list.innerHTML="";



let place=1;





result.forEach(doc=>{



let data =
doc.data();




let li =
document.createElement(
"li"
);





li.innerHTML =


place
+
" 🐟 "
+
data.pseudo
+
" : "
+
data.score
+
" 🌿";






list.appendChild(li);



place++;



});




}

catch(error){


console.log(error);



list.innerHTML=
"Erreur classement";



}



}









// =======================
// BOUTONS
// =======================



let rankingBtn =
document.getElementById(
"rankingBtn"
);



if(rankingBtn){


rankingBtn.onclick =
showRanking;


}






let refreshRanking =
document.getElementById(
"refreshRanking"
);



if(refreshRanking){


refreshRanking.onclick =
showRanking;


}






let lockerBtn =
document.getElementById(
"lockerBtn"
);



if(lockerBtn){


lockerBtn.onclick =
openLocker;


}






let restartBtn =
document.getElementById(
"restartBtn"
);



if(restartBtn){



restartBtn.onclick=function(){


location.reload();



};



}









// =======================
// DEMARRAGE
// =======================



newAlgae();


draw();
