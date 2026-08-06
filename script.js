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
    dy: 0
};



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

document.getElementById("up").onclick = function(){
    changeDirection(0,-speed);
};


document.getElementById("down").onclick = function(){
    changeDirection(0,speed);
};


document.getElementById("left").onclick = function(){
    changeDirection(-speed,0);
};


document.getElementById("right").onclick = function(){
    changeDirection(speed,0);
};





function changeDirection(x,y){

    fish.dx = x;
    fish.dy = y;

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



    // IMAGE DU POISSON

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
