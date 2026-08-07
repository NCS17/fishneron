const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;


// VITESSE POISSON

const speed = 10;

let score = 0;



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


let shark = {

    x:500,
    y:200,

    dx:-5,

    dy:0

};



let sharkImage = new Image();

sharkImage.src = "./fishImages/shark.png";



let sharkActive = false;

let sharkTimer = 0;


// évite les apparitions en boucle

let lastSharkScore = 0;






// =======================
// IMAGES POISSONS
// =======================


let fishImages = {


    rouge:new Image(),

    nemo:new Image(),

    aile:new Image(),

    whale:new Image(),

    octo:new Image()


};




fishImages.rouge.src = "./fishImages/rouge.png";

fishImages.nemo.src = "./fishImages/nemo.png";

fishImages.aile.src = "./fishImages/aile.png";

fishImages.whale.src = "./fishImages/whale.png";

fishImages.octo.src = "./fishImages/octo.png";





// =======================
// ALGUE
// =======================


let algae = {

    x:100,

    y:100

};







// =======================
// CONTROLES PC
// =======================


document.addEventListener("keydown",function(e){


    if(e.key==="ArrowUp")

        changeDirection(0,-speed);



    if(e.key==="ArrowDown")

        changeDirection(0,speed);



    if(e.key==="ArrowLeft")

        changeDirection(-speed,0);



    if(e.key==="ArrowRight")

        changeDirection(speed,0);



});







// =======================
// CONTROLES TELEPHONE
// =======================


document.getElementById("up").addEventListener("touchstart",function(e){

    e.preventDefault();

    changeDirection(0,-speed);

});



document.getElementById("down").addEventListener("touchstart",function(e){

    e.preventDefault();

    changeDirection(0,speed);

});



document.getElementById("left").addEventListener("touchstart",function(e){

    e.preventDefault();

    changeDirection(-speed,0);

});



document.getElementById("right").addEventListener("touchstart",function(e){

    e.preventDefault();

    changeDirection(speed,0);

});





// =======================
// DIRECTION
// =======================


function changeDirection(x,y){


    fish.dx=x;

    fish.dy=y;



    if(x<0){

        fish.direction="left";

    }


    if(x>0){

        fish.direction="right";

    }
// =======================
// CHOIX DU POISSON
// =======================


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







// =======================
// NOUVELLE ALGUE
// =======================


function newAlgae(){


    algae.x = Math.floor(Math.random()*25)*20;

    algae.y = Math.floor(Math.random()*25)*20;


}







// =======================
// UPDATE
// =======================


function update(){



    // MOUVEMENT POISSON

    fish.x += fish.dx;

    fish.y += fish.dy;







    // =======================
    // APPARITION REQUIN
    // TOUS LES 5 ALGUES
    // =======================


    if(


        score >= 5 &&

        score % 5 === 0 &&

        score !== lastSharkScore &&

        sharkActive === false


    ){


        sharkActive = true;


        lastSharkScore = score;


        sharkTimer = Date.now();




        // position départ

        shark.x = canvas.width + 80;

        shark.y = Math.random()*350;



        // vitesse aléatoire

        shark.dx = -(Math.random()*3 + 4);

        shark.dy = Math.random()*2 - 1;



    }







    // =======================
    // MOUVEMENT ALEATOIRE REQUIN
    // =======================


    if(sharkActive){



        shark.x += shark.dx;

        shark.y += shark.dy;




        // changement direction verticale

        if(Math.random() < 0.03){


            shark.dy = Math.random()*4 - 2;


        }



        // rebond haut/bas


        if(shark.y < 0){

            shark.y = 0;

            shark.dy *= -1;

        }



        if(shark.y > 420){

            shark.y = 420;

            shark.dy *= -1;

        }






        // DISPARITION APRES 6 SEC


        if(Date.now() - sharkTimer >= 6000){


            sharkActive = false;


        }



    }









    // =======================
    // SORTIE POISSON
    // =======================


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







    // =======================
    // MANGER ALGUE
    // =======================


    if(


        Math.abs((fish.x+35)-(algae.x+10)) < 45 &&


        Math.abs((fish.y+35)-(algae.y+10)) < 45


    ){


        score++;



        document.getElementById("score").innerHTML =

        "Algues : " + score;



        newAlgae();



    }








    // =======================
    // COLLISION REQUIN
    // =======================


    if(


        sharkActive &&


        Math.abs(fish.x-shark.x) < 70 &&


        Math.abs(fish.y-shark.y) < 60


    ){


        alert("GAME OVER 🦈");


        location.reload();


    }





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


    if(sharkActive){



        ctx.drawImage(


            sharkImage,


            shark.x,


            shark.y,


            140,


            90


        );



    }







    // POISSON


    let img = getFishImage();




    if(fish.direction === "left"){



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






    update();



    requestAnimationFrame(draw);



}








// =======================
// START
// =======================


newAlgae();

draw();

}
