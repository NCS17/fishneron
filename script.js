const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;


let poisson;
let algue;
let direction;
let score;
let vitesse;
let jeu;


let highscore = localStorage.getItem("bubulleRecord") || 0;

document.getElementById("highscore").innerHTML = highscore;


function startGame(){

    poisson=[
        {x:200,y:200}
    ];

    algue={
        x:Math.floor(Math.random()*20)*20,
        y:Math.floor(Math.random()*20)*20
    };


    direction="RIGHT";
    score=0;
    vitesse=120;

    document.getElementById("score").innerHTML=score;

    document.getElementById("gameover").style.display="none";


    clearInterval(jeu);
    jeu=setInterval(update,vitesse);
}



function draw(){

    ctx.clearRect(0,0,400,400);


    // algue
    ctx.font="25px Arial";
    ctx.fillText("🌿", algue.x, algue.y+20);


    // poisson
    poisson.forEach((partie,index)=>{

        if(index===0){
            ctx.fillText("🐟", partie.x, partie.y+20);
        }
        else{
            ctx.fillText("🟠", partie.x, partie.y+20);
        }

    });


}



function update(){

    let tete={
        x:poisson[0].x,
        y:poisson[0].y
    };


    if(direction==="UP")
        tete.y-=20;

    if(direction==="DOWN")
        tete.y+=20;

    if(direction==="LEFT")
        tete.x-=20;

    if(direction==="RIGHT")
        tete.x+=20;



    // collision mur

    if(
        tete.x<0 ||
        tete.y<0 ||
        tete.x>=400 ||
        tete.y>=400
    ){
        endGame();
        return;
    }


    // collision corps

    poisson.forEach(partie=>{

        if(
            partie.x===tete.x &&
            partie.y===tete.y
        ){
            endGame();
        }

    });



    poisson.unshift(tete);



    // mange algue

    if(
        tete.x===algue.x &&
        tete.y===algue.y
    ){

        score++;

        document.getElementById("score").innerHTML=score;


        algue={
            x:Math.floor(Math.random()*20)*20,
            y:Math.floor(Math.random()*20)*20
        };


        if(score%5===0 && vitesse>50){

            vitesse-=10;
            clearInterval(jeu);
            jeu=setInterval(update,vitesse);

        }

    }

    else{

        poisson.pop();

    }


    draw();

}



function changeDirection(dir){

    if(dir==="UP" && direction!=="DOWN")
        direction="UP";

    if(dir==="DOWN" && direction!=="UP")
        direction="DOWN";

    if(dir==="LEFT" && direction!=="RIGHT")
        direction="LEFT";

    if(dir==="RIGHT" && direction!=="LEFT")
        direction="RIGHT";

}



document.addEventListener("keydown",e=>{

    if(e.key==="ArrowUp")
        changeDirection("UP");

    if(e.key==="ArrowDown")
        changeDirection("DOWN");

    if(e.key==="ArrowLeft")
        changeDirection("LEFT");

    if(e.key==="ArrowRight")
        changeDirection("RIGHT");

});



function endGame(){

    clearInterval(jeu);


    if(score>highscore){

        highscore=score;

        localStorage.setItem(
            "bubulleRecord",
            highscore
        );

    }


    document.getElementById("finalScore").innerHTML=score;

    document.getElementById("gameover").style.display="block";

}



function restartGame(){

    startGame();

}



startGame();