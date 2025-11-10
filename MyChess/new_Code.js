function insertImage(){
    document.querySelectorAll('.square').forEach(image =>{
        if(image.innerText.length !== 0){
            if(image.innerText == 'king black' || image.innerText == 'king white'){
                image.innerHTML = `${image.innerText} <img class='allimg allKing' src='${image.innerText}.png'>`;
                image.style.cursor = 'pointer';
            }
        } else {
            image.innerHTML = `${image.innerText} <img class='allimg' src="${image.innerText}.png">`;
            image.style.cursor = 'pointer';
        }
    }
    )
}

function init(){
    insertImage()
}

init();