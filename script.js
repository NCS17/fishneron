const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");


canvas.width=500;
canvas.height=500;



let score=0;



let fish={

x:250,

y:250,

dx:20,

dy:0

};



let algae={

x:100,

y:100

};



let emoji="🐟";



// CONTROLES CLAVIER

document.addEventListener("keydown",move);



// CONTROLES TELEPHONE

document.getElementById("up")
.onclick=()=>changeDirection(0,-20);

document.getElementById("down")
.onclick=()=>changeDirection(0,20);

document.getElementById("left")
.onclick=()=>changeDirection(-20,0);

document.getElementById("right")
.onclick=()=>changeDirection(20,0);



function move(e){


if(e.key==="ArrowUp")
changeDirection(0,-20);


if(e.key==="ArrowDown")
changeDirection(0,20);


if(e.key==="ArrowLeft")
changeDirection(-20,0);


if(e.key==="ArrowRight")
changeDirection(20,0);


}



function changeDirection(x,y){

fish.dx=x;

fish.dy=y;

}





function evolution(){


if(score<2)

emoji="🐟 Poisson rouge";


else if(score<4)

emoji="🐠 Poisson combattant";


else if(score<8)

emoji="🐬 Dauphin";


else if(score<10)

emoji="🦈 Requin";


else if(score<17)

emoji="🦈 Grand requin";


else

emoji="🦖 Megalodon";



document.getElementById("level").innerHTML=emoji;


}





function newAlgae(){


algae.x=Math.floor(Math.random()*25)*20;

algae.y=Math.floor(Math.random()*25)*20;


}





function update(){


fish.x+=fish.dx;

fish.y+=fish.dy;



// passage des murs

if(fish.x<0)

fish.x=480;


if(fish.x>480)

fish.x=0;


if(fish.y<0)

fish.y=480;


if(fish.y>480)

fish.y=0;




// manger algue

if(

fish.x===algae.x &&

fish.y===algae.y

){


score++;


document.getElementById("score").innerHTML=

"Algues : "+score;



evolution();


newAlgae();


}



}





function draw(){


ctx.clearRect(0,0,500,500);



ctx.font="35px Arial";


ctx.fillText("🌿",

algae.x,

algae.y+25);



ctx.font="40px Arial";


ctx.fillText(

emoji.split(" ")[0],

fish.x,

fish.y+30

);



update();


requestAnimationFrame(draw);


}



newAlgae();

draw();
