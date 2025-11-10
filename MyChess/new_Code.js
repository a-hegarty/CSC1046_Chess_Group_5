function insertImage(){
    document.querySelectorAll('.square').forEach(image =>{
        if(image.innerText.length !== 0){
            if(image.innerText == 'Black King' || image.innerText == 'white king'){
                image.innerHTML = `${image.innerText} <img class='allimg allKing' src='${image.innerText}.png'>`;
                image.style.cursor = 'pointer';
            }
        } else {
            image.innerHTML = `${image.innerText} <img class='allimg' src="${image.innerText}.png">`;
            image.style.cursor = 'pointer';
        }
    })
}

function colour_Squares(){
    for(let row = 0; row < 8; row ++){
        for(let collumn = 0; collumn < 8; collumn++){
            if((row + collumn) % 2 === 0 ){
                
            }
        }
    }
}

function forfeit(){
   const forfeit_Button = document.getElementById("forfeit");
    
   //on click...
    forfeit_Button.addEventListener("click", function(){
        //...confirn decision...
        let confirm_forfeit = confirm("Are you sure you would like to forfeit this game?");
        if(confirm_forfeit == true){
            // if player wants to forfeit, the game ends
            alert("You have forfeited the game.");
        } else {
            //otherwise play continues as normal
            alert("You have not forfeited the game\nReturning to game");
        }
    }); 
}

function init(){
    colour_Squares();
    insertImage();
    forfeit();
}

init();