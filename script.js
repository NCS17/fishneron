const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;


// VITESSE DU POISSON
const speed = 10;


let score = 0;


// Poisson
let fish = {
    x: 250,
    y: 250,
    dx: speed,
    dy: 0,
    direction: "right"
};

// REQUIN ENNEMI

let shark = {
    x: 400,
    y: 200,
    dx: -3,
    dy: 0
};

let sharkImage = new Image();
sharkImage.src = "fishImages/shark.png";

let sharkActive = false;
let sharkTimer = 0;
    
// IMAGES DES EVOLUTIONS

let fishImages = {

    rouge: new Image(),
    nemo: new Image(),
    aile: new Image(),
    whale: new Image(),
    octo: new Image()

};


// CHEMIN VERS TES PNG

fishImages.rouge.src = "fishImages/rouge.png";
fishImages.nemo.src = "fishImages/nemo.png";
fishImages.aile.src = "fishImages/aile.png";
fishImages.whale.src = "fishImages/whale.png";
fishImages.octo.src = "fishImages/octo.png";
fishImages.shark.png = "fishImages/shark.png";



// Algues

let algae = {

    x: 100,
    y: 100

};




// CONTROLES CLAVIER

document.addEventListener("keydown", function(e){


    if(e.key === "ArrowUp")
        changeDirection(0,-speed);


    if(e.key === "ArrowDown")
        changeDirection(0,speed);


    if(e.key === "ArrowLeft")
        changeDirection(-speed,0);


    if(e.key === "ArrowRight")
        changeDirection(speed,0);


});





// CONTROLES TELEPHONE

// CONTROLES TELEPHONE

document.getElementById("up").addEventListener("touchstart", function(e){
    e.preventDefault();
    changeDirection(0,-speed);
});

document.getElementById("down").addEventListener("touchstart", function(e){
    e.preventDefault();
    changeDirection(0,speed);
});

document.getElementById("left").addEventListener("touchstart", function(e){
    e.preventDefault();
    changeDirection(-speed,0);
});

document.getElementById("right").addEventListener("touchstart", function(e){
    e.preventDefault();
    changeDirection(speed,0);
});



function changeDirection(x,y){

    fish.dx = x;
    fish.dy = y;

    // Orientation du poisson
    if(x < 0){
        fish.direction = "left";
    }

    if(x > 0){
        fish.direction = "right";
    }

}





// CHOIX DU POISSON SELON LES ALGUES

function getFishImage(){


    if(score < 2){

        return fishImages.rouge;

    }


    else if(score < 4){

        return fishImages.nemo;

    }


    else if(score < 8){

        return fishImages.aile;

    }


    else if(score < 17){

        return fishImages.whale;

    }


    else{

        return fishImages.octo;

    }

}







// NOUVELLE ALGUE

function newAlgae(){


    algae.x = Math.floor(Math.random()*25)*20;

    algae.y = Math.floor(Math.random()*25)*20;


}







// LOGIQUE DU JEU

function update(){


    fish.x += fish.dx;

    fish.y += fish.dy;
  // APPARITION DU REQUIN APRES 5 ALGUES

if(score >= 5 && !sharkActive){

    sharkActive = true;

    sharkTimer = Date.now();

    shark.x = canvas.width;
    shark.y = Math.random() * 400;

}


// MOUVEMENT DU REQUIN

if(sharkActive){

    shark.x += shark.dx;


    // DISPARITION APRES 6 SECONDES

    if(Date.now() - sharkTimer > 6000){

        sharkActive = false;

    }

}



    // SORTIE DU CARRE = RETOUR DE L'AUTRE COTE

    if(fish.x < 0){

        fish.x = canvas.width - 20;

    }


    if(fish.x > canvas.width){

        fish.x = 0;

    }


    if(fish.y < 0){

        fish.y = canvas.height - 20;

    }


    if(fish.y > canvas.height){

        fish.y = 0;

    }




    // MANGER L'ALGUE

    if(

        Math.abs(fish.x - algae.x) < 25 &&
        Math.abs(fish.y - algae.y) < 25

    ){


        score++;


        document.getElementById("score").innerHTML =
        "Algues : " + score;


        newAlgae();


    }


}

// COLLISION REQUIN

if(sharkActive &&

    Math.abs(fish.x - shark.x) < 50 &&
    Math.abs(fish.y - shark.y) < 50

){

    alert("GAME OVER 🦈");

    location.reload();

}






// AFFICHAGE

function draw(){


    ctx.clearRect(0,0,canvas.width,canvas.height);



    // ALGUE

    ctx.font = "35px Arial";

    ctx.fillText(
        "🌿",
        algae.x,
        algae.y + 25
    );

// REQUIN

if(sharkActive){

    ctx.drawImage(
        sharkImage,
        shark.x,
        shark.y,
        100,
        70
    );

}
    // IMAGE DU POISSON

    // IMAGE DU POISSON

let img = getFishImage();

if(fish.direction === "left"){

    ctx.save();

    ctx.scale(-1,1);

    ctx.drawImage(
        img,
        -fish.x - 70,
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


    update();


    requestAnimationFrame(draw);


}






newAlgae();

draw();
