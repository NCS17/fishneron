const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;


// =======================
// VITESSE
// =======================

let speed = 5;

const maxSpeed = 12;

let score = 0;

let gameOver = false;




// =======================
// FIREBASE SCORE
// =======================

async function saveScore(){


    try{


        let pseudo = prompt("Entre ton pseudo 🐟");


        if(!pseudo || pseudo.trim()===""){

            pseudo="Anonyme";

        }



        await addDoc(collection(db,"scores"),{


            pseudo:pseudo,

            score:score,

            date:new Date()


        });



    }

    catch(error){

        console.log("Erreur Firebase :",error);

    }


}





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
// REQUIN
// =======================


let shark={

    x:600,

    y:200,

    dx:-5,

    dy:0

};




let sharkImage=new Image();

sharkImage.src="./fishImages/shark.png";


let sharkActive=false;

let sharkTimer=0;

let lastSharkScore=0;







// =======================
// IMAGES POISSON
// =======================


let fishImages={


    rouge:new Image(),

    nemo:new Image(),

    aile:new Image(),

    whale:new Image(),

    octo:new Image()


};




fishImages.rouge.src="./fishImages/rouge.png";

fishImages.nemo.src="./fishImages/nemo.png";

fishImages.aile.src="./fishImages/aile.png";

fishImages.whale.src="./fishImages/whale.png";

fishImages.octo.src="./fishImages/octo.png";







// =======================
// ALGUE
// =======================


let algae={

    x:100,

    y:100

};







// =======================
// CONTROLES
// =======================


document.addEventListener("keydown",function(e){


    if(gameOver) return;



    if(e.key==="ArrowUp")
        changeDirection(0,-speed);


    if(e.key==="ArrowDown")
        changeDirection(0,speed);


    if(e.key==="ArrowLeft")
        changeDirection(-speed,0);


    if(e.key==="ArrowRight")
        changeDirection(speed,0);



});





document.getElementById("up").addEventListener("touchstart",function(e){

    e.preventDefault();

    if(!gameOver)
    changeDirection(0,-speed);

});


document.getElementById("down").addEventListener("touchstart",function(e){

    e.preventDefault();

    if(!gameOver)
    changeDirection(0,speed);

});


document.getElementById("left").addEventListener("touchstart",function(e){

    e.preventDefault();

    if(!gameOver)
    changeDirection(-speed,0);

});


document.getElementById("right").addEventListener("touchstart",function(e){

    e.preventDefault();

    if(!gameOver)
    changeDirection(speed,0);

});







function changeDirection(x,y){


    fish.dx=x;

    fish.dy=y;



    if(x<0)
        fish.direction="left";


    if(x>0)
        fish.direction="right";


}







function getFishImage(){


    if(score<2)
        return fishImages.rouge;


    else if(score<4)
        return fishImages.nemo;


    else if(score<8)
        return fishImages.aile;


    else if(score<17)
        return fishImages.whale;


    else
        return fishImages.octo;


}





function newAlgae(){


    algae.x=Math.floor(Math.random()*25)*20;

    algae.y=Math.floor(Math.random()*25)*20;


}
// =======================
// UPDATE
// =======================


function update(){


if(gameOver) return;




// MOUVEMENT POISSON

fish.x += fish.dx;

fish.y += fish.dy;







// =======================
// APPARITION REQUIN
// TOUTES LES 5 ALGUES
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



    shark.x=canvas.width+100;


    shark.y=Math.random()*350;



    shark.dx=-(Math.random()*2+5);


    shark.dy=Math.random()*3-1.5;


}








// =======================
// MOUVEMENT REQUIN
// =======================


if(sharkActive){


    shark.x += shark.dx;

    shark.y += shark.dy;




    if(Math.random()<0.03){

        shark.dy=Math.random()*4-2;

    }



    if(shark.y<0){

        shark.y=0;

        shark.dy*=-1;

    }



    if(shark.y>410){

        shark.y=410;

        shark.dy*=-1;

    }





    if(Date.now()-sharkTimer>6000){

        sharkActive=false;

    }


}







// =======================
// TELEPORTATION
// =======================


if(fish.x<0)
    fish.x=canvas.width-20;


if(fish.x>canvas.width)
    fish.x=0;


if(fish.y<0)
    fish.y=canvas.height-20;


if(fish.y>canvas.height)
    fish.y=0;







// =======================
// MANGER ALGUE
// =======================


if(


Math.abs((fish.x+35)-(algae.x+10))<45 &&


Math.abs((fish.y+35)-(algae.y+10))<45


){


    score++;



    speed=Math.min(speed+0.15,maxSpeed);




    if(fish.dx>0)
        fish.dx=speed;


    if(fish.dx<0)
        fish.dx=-speed;


    if(fish.dy>0)
        fish.dy=speed;


    if(fish.dy<0)
        fish.dy=-speed;





    document.getElementById("score").innerHTML=

    "Algues : "+score+
    " | Vitesse : "+speed.toFixed(1);



    newAlgae();


}








// =======================
// COLLISION REQUIN
// =======================


if(sharkActive){



let distance=Math.sqrt(


Math.pow((fish.x+35)-(shark.x+75),2)

+

Math.pow((fish.y+35)-(shark.y+45),2)


);




if(distance<55){


    endGame();


}


}



}








// =======================
// FIN DE PARTIE
// =======================


async function endGame(){



if(gameOver) return;



gameOver=true;



await saveScore();



document.getElementById("finalScore").innerHTML=

"Score : "+score+" 🌿";



document.getElementById("gameOver").style.display="block";



}








// =======================
// DRAW
// =======================


function draw(){


ctx.clearRect(0,0,canvas.width,canvas.height);





// ALGUE


ctx.font="35px Arial";


ctx.fillText(

"🌿",

algae.x,

algae.y+25

);






// REQUIN


if(sharkActive && sharkImage.complete){


ctx.drawImage(

sharkImage,

shark.x,

shark.y,

150,

95

);


}






// POISSON


let img=getFishImage();



if(img.complete && img.naturalWidth>0){



if(fish.direction==="left"){



ctx.save();


ctx.scale(-1,1);


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
// CLASSEMENT FIREBASE
// =======================


async function showRanking(){



let list=document.getElementById("rankingList");



list.innerHTML="Chargement...";



document.getElementById("ranking").style.display="block";





const q=query(

collection(db,"scores"),

orderBy("score","desc"),

limit(10)

);





const result=await getDocs(q);



list.innerHTML="";



let place=1;



result.forEach((doc)=>{


let data=doc.data();



let li=document.createElement("li");



li.innerHTML=

place+
" 🐟 "+
data.pseudo+
" - "+
data.score+
" algues";



list.appendChild(li);



place++;



});



}







// =======================
// BOUTONS
// =======================



document.getElementById("rankingBtn")
.addEventListener("click",showRanking);




document.getElementById("closeRanking")
.addEventListener("click",function(){


document.getElementById("ranking").style.display="none";


});





document.getElementById("restartBtn")
.addEventListener("click",function(){


location.reload();


});








// =======================
// DEMARRAGE
// =======================


newAlgae();

draw();
