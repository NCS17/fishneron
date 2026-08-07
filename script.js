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

        let pseudo = prompt("🦈 GAME OVER !\n\nEntre ton pseudo 🐟");


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

        console.log(error);

    }

}



// =======================
// SYSTEME DE SKINS
// =======================


// skin actuellement utilisé

let currentSkin = localStorage.getItem("currentSkin") || "rouge";


// images disponibles

let fishImages={

    rouge:new Image(),

    nemo:new Image(),

    ballon:new Image(),

    whale:new Image(),

    requin:new Image(),

    octo:new Image()

};



fishImages.rouge.src="./fishImages/rouge.png";

fishImages.nemo.src="./fishImages/nemo.png";

fishImages.ballon.src="./fishImages/ballon.png";

fishImages.whale.src="./fishImages/whale.png";

fishImages.requin.src="./fishImages/requin.png";

fishImages.octo.src="./fishImages/octo.png";




// CASIER DU JOUEUR

let skins={


    rouge:{

        nom:"🐟 Bubulle classique",

        image:fishImages.rouge,

        prix:0,

        unlocked:true

    },


    nemo:{

        nom:"🐠 Poisson tropical",

        image:fishImages.nemo,

        prix:20,

        unlocked:false

    },


    ballon:{

        nom:"🐡 Poisson ballon",

        image:fishImages.ballon,

        prix:50,

        unlocked:false

    },


    requin:{

        nom:"🦈 Skin requin",

        image:fishImages.requin,

        prix:100,

        unlocked:false,

        protection:true

    },


    whale:{

        nom:"🐋 Mini baleine",

        image:fishImages.whale,

        prix:200,

        unlocked:false

    },


    octo:{

        nom:"🐙 Poulpe",

        image:fishImages.octo,

        prix:300,

        unlocked:false

    }


};




// charger les skins débloqués

let savedSkins = JSON.parse(localStorage.getItem("skins"));

if(savedSkins){

    for(let skin in savedSkins){

        if(skins[skin]){

            skins[skin].unlocked=savedSkins[skin];

        }

    }

}



// récupérer l'image du skin équipé

function getFishImage(){

    return skins[currentSkin].image;

}



// changer de skin

function equipSkin(name){


    if(skins[name] && skins[name].unlocked){


        currentSkin=name;


        localStorage.setItem(
            "currentSkin",
            currentSkin
        );


    }


}



// débloquer un skin

function unlockSkin(name){


    let skin=skins[name];


    if(!skin)
        return;



    if(score>=skin.prix){


        skin.unlocked=true;



        let save={};


        for(let s in skins){

            save[s]=skins[s].unlocked;

        }


        localStorage.setItem(
            "skins",
            JSON.stringify(save)
        );


        alert(
            skin.nom+" débloqué ! 🐟"
        );


    }


}




// =======================
// POISSON
// =======================

let fish={

    x:250,

    y:250,

    dx:speed,

    dy:0,

    direction:"right"

};



// =======================
// REQUIN ENNEMI
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
// ALGUE
// =======================

let algae={

    x:100,

    y:100

};



function newAlgae(){

    algae.x=Math.floor(Math.random()*25)*20;

    algae.y=Math.floor(Math.random()*25)*20;

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
// TOUCH TELEPHONE
// =======================

function addTouch(id,x,y){


    let button=document.getElementById(id);



    if(button){


        button.addEventListener(
            "touchstart",
            function(e){


                e.preventDefault();


                changeDirection(x,y);


            }
        );


    }


}



addTouch("up",0,-speed);

addTouch("down",0,speed);

addTouch("left",-speed,0);

addTouch("right",speed,0);




// =======================
// UPDATE
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

    sharkActive===false

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

Math.abs((fish.x+35)-(algae.x+10))<45 &&

Math.abs((fish.y+35)-(algae.y+10))<45


){



    score++;




    speed=Math.min(
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





    let scoreBox=document.getElementById("score");



    if(scoreBox){


        scoreBox.innerHTML=

        "Algues : "+score+

        " | Vitesse : "+speed.toFixed(1);


    }




    // déblocage automatique des skins

    for(let s in skins){


        if(

            score>=skins[s].prix &&

            skins[s].unlocked===false

        ){


            skins[s].unlocked=true;



            console.log(
                skins[s].nom+" débloqué !"
            );


        }


    }




    newAlgae();



}






// =======================
// COLLISION REQUIN
// =======================

if(sharkActive){



    let dx=

    (fish.x+35)-(shark.x+75);



    let dy=

    (fish.y+35)-(shark.y+45);




    let distance=Math.sqrt(

        dx*dx+

        dy*dy

    );





    if(distance<55){



        // protection skin requin

        if(

            currentSkin==="requin" &&

            skins.requin.protection

        ){



            sharkActive=false;



            skins.requin.protection=false;



            alert(
                "🦈 Ton skin requin a bloqué l'attaque !"
            );



        }


        else{


            endGame();


        }



    }



}




}
