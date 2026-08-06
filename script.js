const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;


// Vitesse du poisson
const speed = 10;


let score = 0;


// Poisson

let fish = {

    x:250,
    y:250,
    dx:10,
    dy:0

};



// Images des évolutions

let fishImages = {

    rouge: new Image(),

    nemo: new Image(),

    aile: new Image(),

    whale: new Image(),

    octo: new Image()

};


// Noms de tes PNG

fishImages.rouge.src = "images/rouge.png";

fishImages.nemo.src = "images/nemo.png";

fishImages.aile.src = "images/aile.png";

fishImages.whale.src = "images/whale.png";

fishImages.octo.src = "images/octo.png";




// Algues

let algae = {

    x:100,
    y:100

};




// Contrôles clavier

document.addEventListener("keydown", function(e){


    if(e.key==="ArrowUp")
        changeDirection(0,-speed);


    if(e.key==="ArrowDown")
        changeDirection(0,speed);


    if(e.key==="ArrowLeft")
        changeDirection(-speed,0);


    if(e.key==="ArrowRight")
        changeDirection(speed,0);


});




// Contrôles téléphone

document.getElementById("up").onclick =
()=>changeDirection(0,-speed);


document.getElementById("down").onclick =
()=>changeDirection(0,speed);


document.getElementById("left").onclick =
()=>changeDirection(-speed,0);


document.getElementById("right").onclick =
()=>changeDirection(speed,0);






function changeDirection(x,y){

    fish.dx=x;
    fish.dy=y;

}







// Choix de l'évolution

function getFishImage(){


    // 0 à 1 algue
    if(score < 2)

        return fishImages.rouge;



    // 2 à 3 algues
    else if(score < 4)

        return fishImages.nemo;



    // 4 à 7 algues
    else if(score < 8)

        return fishImages.aile;



    // 8 à 16 algues
    else if(score < 17)

        return fishImages.whale;



    // 17+ algues

    else

        return fishImages.octo;


}







function newAlgae(){


    algae.x = Math.floor(Math.random()*25)*20;

    algae.y = Math.floor(Math.random()*25)*20;


}








function update(){


    fish.x += fish.dx;

    fish.y += fish.dy;



    // Traverser les murs façon Snake

    if(fish.x < 0)

        fish.x = 480;



    if(fish.x > 480)

        fish.x = 0;



    if(fish.y < 0)

        fish.y = 480;



    if(fish.y > 480)

        fish.y = 0;





    // Manger algue

    if(

        Math.abs(fish.x - algae.x) < 20 &&

        Math.abs(fish.y - algae.y) < 20

    ){


        score++;


        document.getElementById("score").innerHTML =
        "Algues : " + score;



        newAlgae();


    }


}








function draw(){


    ctx.clearRect(0,0,500,500);



    // Algue

    ctx.font="35px Arial";

    ctx.fillText(
        "🌿",
        algae.x,
        algae.y+25
    );



    // Poisson

    let img = getFishImage();



    ctx.drawImage(

        img,

        fish.x,

        fish.y,

        70,

        70

    );



    update();



    requestAnimationFrame(draw);


}







newAlgae();

draw();
