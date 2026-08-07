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





function newAlgae(){


    algae.x=Math.floor(Math.random()*25)*20;

    algae.y=Math.floor(Math.random()*25)*20;


}








// =======================
// EVOLUTION POISSON
// =======================


function getFishImage(){



    if(score<2)

        return fishImages.rouge;



    if(score<4)

        return fishImages.nemo;



    if(score<8)

        return fishImages.aile;



    if(score<17)

        return fishImages.whale;




    return fishImages.octo;


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







function addTouch(id,x,y){


    let button=document.getElementById(id);



    if(button){


        button.addEventListener("touchstart",function(e){


            e.preventDefault();


            changeDirection(x,y);


        });


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




    // mouvement poisson


    fish.x += fish.dx;

    fish.y += fish.dy;







    // apparition requin


    if(


        score>0 &&


        score%5===0 &&


        score!==lastSharkScore &&


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


    Math.abs((fish.x+35)-(algae.x+10))<45 &&


    Math.abs((fish.y+35)-(algae.y+10))<45


){



    score++;



    // vitesse limitée


    speed=Math.min(speed+0.15,maxSpeed);





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





    newAlgae();



}








// =======================
// COLLISION REQUIN
// =======================


if(sharkActive){



    let dx=(fish.x+35)-(shark.x+75);


    let dy=(fish.y+35)-(shark.y+45);



    let distance=Math.sqrt(

        dx*dx+dy*dy

    );




    if(distance<90){


        endGame();


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




    let box=document.getElementById("gameOver");

    let final=document.getElementById("finalScore");





    if(final){


        final.innerHTML=

        "Score final : "+score+" 🌿";


    }





    if(box){


        box.style.display="block";


    }





    await saveScore();



}









// =======================
// DRAW
// =======================


function draw(){



    ctx.clearRect(0,0,canvas.width,canvas.height);






    // algue


    ctx.font="35px Arial";


    ctx.fillText(

        "🌿",

        algae.x,

        algae.y+25

    );







    // requin


    if(sharkActive && sharkImage.complete){



        ctx.drawImage(

            sharkImage,

            shark.x,

            shark.y,

            150,

            95


        );


    }







    // poisson


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
// CLASSEMENT FIREBASE
// =======================


async function showRanking(){



    let list=document.getElementById("rankingList");



    if(!list)

        return;





    list.innerHTML="Chargement...";




    try{



        const q=query(


            collection(db,"scores"),


            orderBy("score","desc"),


            limit(10)


        );






        const result=await getDocs(q);



        list.innerHTML="";



        let place=1;





        result.forEach(doc=>{



            let data=doc.data();




            let li=document.createElement("li");



            li.innerHTML=


            place+

            " 🐟 "+

            data.pseudo+

            " : "+

            data.score+

            " algues";





            list.appendChild(li);



            place++;



        });




    }


    catch(error){


        console.log(error);


        list.innerHTML="Erreur classement";


    }



}









// =======================
// BOUTONS
// =======================


let rankingBtn=document.getElementById("rankingBtn");



if(rankingBtn){


    rankingBtn.onclick=showRanking;


}





let restartBtn=document.getElementById("restartBtn");



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
