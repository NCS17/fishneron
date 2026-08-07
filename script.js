const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;


// =======================
// VARIABLES
// =======================


let score = 0;

let coins =
Number(localStorage.getItem("coins"))
||
0;


let speed = 5;

const maxSpeed = 12;

let gameOver = false;





// =======================
// SYSTEME SKINS
// =======================



let currentSkin =
localStorage.getItem("skin")
||
"rouge";





const skinData = {


rouge:{


name:"🐟 Poisson rouge",

price:0,

size:70,

owned:true


},





nemo:{


name:"🐠 Nemo",

price:10,

size:70,

owned:
localStorage.getItem("nemoOwned")==="true"


},





whale:{


name:"🐋 Baleine",

price:30,

size:80,

owned:
localStorage.getItem("whaleOwned")==="true"


}



};









// =======================
// ACHAT SKIN
// =======================


function buySkin(skin){



let data =
skinData[skin];



if(!data)

return;






// déjà possédé

if(data.owned){


equipSkin(skin);


return;


}






if(coins >= data.price){



coins -= data.price;



localStorage.setItem(
"coins",
coins
);





data.owned=true;





localStorage.setItem(
skin+"Owned",
"true"
);





equipSkin(skin);



alert(
"🎉 Skin débloqué !"
);



}



else{


alert(
"🪙 Pas assez de pièces !"
);


}



}







function equipSkin(skin){



if(
skinData[skin]
&&
skinData[skin].owned
){



localStorage.setItem(
"skin",
skin
);



location.reload();



}



}









function getFishImage(){


return fishImages[currentSkin];


}




function getFishSize(){


return skinData[currentSkin].size;


}








// =======================
// IMAGES
// =======================


let fishImages={


rouge:new Image(),


nemo:new Image(),


whale:new Image()



};



fishImages.rouge.src =
"./fishImages/rouge.png";



fishImages.nemo.src =
"./fishImages/nemo.png";



fishImages.whale.src =
"./fishImages/whale.png";






let algaeImage = new Image();


algaeImage.src =
"./fishImages/algae.png";







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
Math.floor(Math.random()*25)*20;


algae.y =
Math.floor(Math.random()*25)*20;


}
// =======================
// MISE A JOUR AFFICHAGE SCORE
// =======================


function updateCoinsDisplay(){


let coinBox =
document.getElementById(
"coins"
);



if(coinBox){


coinBox.innerHTML =
"🪙 Pièces : "
+
coins;


}



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
// TELEPHONE
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
// UPDATE JEU
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
// CREATION REQUIN
// =======================


if(


score > 0 &&

score % 5 === 0 &&

score !== lastSharkScore &&

sharkActive===false


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
Date.now()-sharkTimer>6000
){


sharkActive=false;


}




}









// =======================
// TELEPORTATION
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

(algae.x+35)

)

<60





&&





Math.abs(

(fish.y+35)

-

(algae.y+35)

)

<60





){





score++;





// AJOUT PIECES 🪙


coins++;




localStorage.setItem(
"coins",
coins
);





updateCoinsDisplay();






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


"🌿 Algues : "
+
score
+
" | ⚡ "
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

dx*dx+

dy*dy

);








if(distance<55){


endGame();


}



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




// =======================
// FOND
// =======================


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
"#006994"
);



ctx.fillStyle =
gradient;


ctx.fillRect(
0,
0,
500,
500
);






// =======================
// ALGUE PNG
// =======================


if(
algaeImage.complete
&&
algaeImage.naturalWidth>0
){



ctx.drawImage(

algaeImage,

algae.x,

algae.y,

70,

70

);



}







// =======================
// REQUIN ENNEMI
// =======================


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







// =======================
// POISSON SKIN
// =======================


let img =
getFishImage();



let size =
getFishSize();





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

-fish.x-size,

fish.y,

size,

size

);



ctx.restore();


}

else{


ctx.drawImage(

img,

fish.x,

fish.y,

size,

size

);



}



}

else{


ctx.font="50px Arial";


ctx.fillText(
"🐟",
fish.x,
fish.y+50
);



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


loadLocker();


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
// GENERATION BOUTIQUE
// =======================


function loadLocker(){



let container =
document.getElementById(
"skinList"
);




if(!container)

return;





container.innerHTML="";







Object.keys(skinData).forEach(
skin=>{



let data =
skinData[skin];



let box =
document.createElement(
"div"
);



box.className =
"skin";







let image =
document.createElement(
"img"
);



image.src =
fishImages[skin].src;



image.style.width =
"70px";



image.style.height =
"70px";






let name =
document.createElement(
"h3"
);



name.innerHTML =
data.name;







let info =
document.createElement(
"p"
);






if(data.owned){


info.innerHTML =
"✅ Possédé";


}

else{


info.innerHTML =
"🔒 "
+
data.price
+
" 🪙";


}









let button =
document.createElement(
"button"
);






if(currentSkin===skin){


button.innerHTML =
"Équipé";


button.disabled=true;



}

else if(data.owned){


button.innerHTML =
"Équiper";



}

else{


button.innerHTML =
"Acheter";



}








button.onclick=function(){





if(data.owned){


equipSkin(skin);


}

else{


buySkin(skin);


}





};







box.appendChild(image);


box.appendChild(name);


box.appendChild(info);


box.appendChild(button);





container.appendChild(box);





});



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





ranking.style.display =
"block";



list.innerHTML =
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


list.innerHTML =
"Erreur classement";


}



}









// =======================
// BOUTONS
// =======================



let lockerBtn =
document.getElementById(
"lockerBtn"
);



if(lockerBtn){


lockerBtn.onclick =
openLocker;


}






let closeLockerBtn =
document.getElementById(
"closeLocker"
);



if(closeLockerBtn){


closeLockerBtn.onclick =
closeLocker;


}







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


updateCoinsDisplay();


newAlgae();


draw();
