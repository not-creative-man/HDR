function chooseImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function createCanvas(canvas, width, height) {canvas.width = width; canvas.height = height;}

document.getElementById("button").onchange = function() { chooseImage(this); }

let canvas = document.getElementById("original"),
    ctx = canvas.getContext("2d");

let canvasPh = document.getElementById("ph"),
    ctx_ph = canvasPh.getContext("2d");

let canvasGs = document.getElementById("gs"),
    ctx_gs = canvasGs.getContext("2d");

let canvasHeatmap = document.getElementById("heatmap"),
    ctx_hm = canvasHeatmap.getContext("2d");

let image = new Image();
image.src = "Lenna.png";

image.onload = function(){
    createCanvas(canvas, image.width, image.height);
    createCanvas(canvasGs, image.width, image.height);
    createCanvas(canvasPh, image.width, image.height);
    createCanvas(canvasHeatmap, image.width, image.height);
    ctx.drawImage(image, 0, 0);
    image.style.display = "none";
}

function getPhImage(){
    let new_image = new Image();
    new_image.src = "Lenna_HDR_PH.jpg";
    ctx_ph.drawImage(new_image, 0, 0);
    
}

function getAnotherImage(){
    
    let new_image = new Image();
    new_image.src = "Lenna_HDR.jpg";
    ctx_gs.drawImage(new_image, 0, 0);
}

function getHeatmap(){
    let array = [0, 2, 4, 6, 8, 10, 12, 14, 16];

    let difference = 0;
    let len = 0;
    let phPixel = 0, atPixel = 0;  

    let data = new ImageData(canvas.width, canvas.height);

    let phData = ctx_ph.getImageData(0, 0, canvas.width, canvas.height);
    let atData = ctx_gs.getImageData(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < phData.data.length; i += 4){
        phPixel = ( phData.data[i] + phData.data[i + 1] + phData.data[i + 2] ) / 3;
        atPixel = ( atData.data[i] + atData.data[i + 1] + atData.data[i + 2] ) / 3;
        difference = Math.abs(phPixel - atPixel);
        if(difference >= array[0] && difference < array[1]){
            len = addColor(63, 190, 66, len, data);
        } else if(difference >= array[1] && difference < array[2]){
            len = addColor(162, 218, 74, len, data);
        } else if(difference >= array[2] && difference < array[3]){
            len = addColor(215, 232, 74, len, data);
        } else if(difference >= array[3] && difference < array[4]){
            len = addColor(237, 223, 82, len, data);
        } else if(difference >= array[4] && difference < array[5]){
            len = addColor(239, 202, 78, len, data);
        } else if(difference >= array[5] && difference < array[6]){
            len = addColor(237, 181, 79, len, data);
        } else if(difference >= array[6] && difference < array[7]){
            len = addColor(237, 152, 78, len, data);
        } else if(difference >= array[7] && difference < array[8]){
            len = addColor(226, 55, 57, len, data);
        } else{
            len = addColor(255, 0, 0, len, data);
        }
    }

    ctx_hm.putImageData(data, 0, 0);

}

function addColor(red, green, blue, len, data){
    data.data[len] = red,
    data.data[++len] = green,
    data.data[++len] = blue,
    data.data[++len] = 255;
    len++;
    return len;
}