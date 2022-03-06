

// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
    const progressBar = event.target.querySelector('.progress-bar-model');
    const updatingBar = event.target.querySelector('.update-bar-model');
    updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
    if (event.detail.totalProgress === 1) {
        progressBar.classList.add('hide');
    } else {
        progressBar.classList.remove('hide');
        if (event.detail.totalProgress === 0) {
            event.target.querySelector('.center-pre-prompt').classList.add('hide');
        }
    }
};
const zeroPad = (num, places) => String(num).padStart(places, '0')


var params = new URLSearchParams(location.search);
var form = ""
var id = params.get('id')
if (!id | id < 1) {
    id = 1
}
var ani_range = document.getElementById('ani_range')
var model = document.querySelector('model-viewer')
var mouseAniRange = false
var isPlaying = true
var color = {
    'bug': '#92bc2c',
    'dark': '#595761',
    'dragon': '#0c69c8',
    'electric': '#f2d94e',
    'fire': '#fba54c',
    'fairy': '#ee90e6',
    'fighting': '#d3425f',
    'flying': '#a1bbec',
    'ghost': '#5f6dbc',
    'grass': '#5fbd58',
    'ground': '#da7c4d',
    'ice': '#75d0c1',
    'normal': '#a0a29f',
    'poison': '#b763cf',
    'psychic': '#fa8581',
    'rock': '#c9bb8a',
    'steel': '#5695a3',
    'water': '#539ddf',
}

window.onload = function () {
    if (!localStorage.getItem("tut_show")){
        $("#popup_buy").modal('show');
    }
    fetch('https://pokeapi.co/api/v2/pokemon/' + id)
        .then(response => response.json())
        .then(obj => {
            id = obj.id
            if (obj.name.includes("mega")) {
                form = "Mega"
                model.src = "data/Mega/" +id+ '.glb'
                let raw_name = obj.name.split("-")
                let res = ""
                for (rname of raw_name) {
                    if ((rname != "mega") & (rname != "gmax")) {
                        res += (" " + capitalizeFirstLetter(rname))
                    }
                }
                obj.species.name = "Mega " + res
            } else {
                if (obj.name.includes("gmax")) {
                    form = "Gigantamax"
                    model.src = "data/Gigantamax/" +id + '.glb'
                    obj.species.name = form + " "+ capitalizeFirstLetter(obj.name.split('-')[0])
                }else{
                    model.src = "data/" + zeroPad(id, 3) + '.glb'
                    obj.species.name = form + " " + capitalizeFirstLetter(obj.species.name)
                }
            }
            document.getElementById('poke-height').innerText = Math.round(obj.height * 0.3280839895 * 10) / 10 + " ft - " + (obj.height / 10) + " m"
            document.getElementById('poke-weight').innerText = Math.round(obj.weight * 0.220462262185 * 10) / 10 + " lbs - " + (obj.weight / 10) + " kg"

            document.getElementById('hp').style.width = obj.stats[0].base_stat / 1.5 + "%"
            document.getElementById('atk').style.width = obj.stats[1].base_stat / 1.5 + "%"
            document.getElementById('def').style.width = obj.stats[2].base_stat / 1.5 + "%"
            document.getElementById('spatk').style.width = obj.stats[3].base_stat / 1.5 + "%"
            document.getElementById('spdef').style.width = obj.stats[4].base_stat / 1.5 + "%"
            document.getElementById('spd').style.width = obj.stats[5].base_stat / 1.5 + "%"
            document.getElementById('stat_total').innerText = "Total: " + (obj.stats[0].base_stat + obj.stats[1].base_stat + obj.stats[2].base_stat + obj.stats[3].base_stat + obj.stats[4].base_stat + obj.stats[5].base_stat)

            document.getElementById('next').href = window.location.pathname + '?id=' + (obj.id + 1)
            document.getElementById('prev').href = window.location.pathname + '?id=' + (obj.id - 1)

            document.getElementById('offical-pokedex').href = "https://www.pokemon.com/us/pokedex/" + obj.species.name

            document.getElementById("poke_name").innerText = obj.species.name
            model.onerror = function () {
                $('#popup-error').modal('show')
            }
            $("#poke-type").append(`<p>№ #${zeroPad(obj.id, 3)}</p>`)
            let type_name
            for (let x of obj.types) {
                if (type_name) {
                    model.style.backgroundImage = `linear-gradient(to bottom right, ${color[type_name]}, ${color[x.type.name]})`
                } else {
                    type_name = x.type.name
                    model.style.backgroundColor = color[type_name]
                }
                $("#poke-type").append(`
                <a href="#" class="likes space-x-3 poke">
                    <img class="poke-icon ${x.type.name}" src="assets/img/poke/type_icon/${x.type.name}.svg">
                    <span class="txt_sm first-uppercase">${x.type.name}</span>
                </a>
                `
                )
            }
        })
        .catch((error) => {
            $('#popup-fetch-error').modal('show')
        })
}

model.addEventListener('progress', onProgress);
model.onload = function () {
    ani_range.max = model.duration
    let arr = model.availableAnimations
    for (let i = 0; i < arr.length; i++) {
        $("#ani_select").append('<option value="' + (i + 1) + '">' + arr[i] + '</option>');
        if ((arr[i].search("idle") != -1) | arr[i].search("waitA01") != -1) {
            model.animationName = arr[i]
        }
    }
    let m = model.model.materials
    for (let i = 0; i < m.length; i++) {
        m[i].pbrMetallicRoughness.setMetallicFactor(0.400000005960464)
        m[i].pbrMetallicRoughness.setRoughnessFactor(0.7071067)
    }

    for (let i = 0; i < m.length; i++) {
        console.log(m[i].pbrMetallicRoughness.metallicFactor, m[i].pbrMetallicRoughness.roughnessFactor);
        // m[i].pbrMetallicRoughness.setMetallicFactor(0.400000005960464)
        // m[i].pbrMetallicRoughness.setRoughnessFactor(0.242535620927811)
    }
}
document.getElementById("ani_select").onchange = function () {
    play_ani()
}
ani_range.onmouseenter = function () {
    mouseAniRange = true
    model.pause()
    document.getElementsByClassName("ri-play-fill")[0].style.display = ""
    document.getElementsByClassName("ri-pause-fill")[0].style.display = "none"
}
ani_range.onmouseleave = function () {
    mouseAniRange = false
    if (isPlaying) {
        model.play()
        document.getElementsByClassName("ri-play-fill")[0].style.display = "none"
        document.getElementsByClassName("ri-pause-fill")[0].style.display = ""
    }
}
ani_range.oninput = function () {
    model.currentTime = ani_range.value;
}
setInterval(function () {
    if (mouseAniRange == false) {
        ani_range.value = model.currentTime
    }
}, 10);


var canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.height = canvas.width * 9 / 16
ctx.imageSmoothingQuality = 'high'
ctx.font = "30px Pokemon Solid"


var cloneCanvas = document.getElementById("cloneCanvas")
const cloneCtx = cloneCanvas.getContext("2d")
cloneCtx.imageSmoothingQuality = 'high'
var current_type


var pkmImg = new Image()
var shadowPkm = new Image()
var bgHideImg = new Image()
bgHideImg.src = "assets/img/poke/bg_hide.png"
var bgShowImg = new Image()
bgShowImg.src = "assets/img/poke/bg_show.png"
var currentPkmImg = null
var pokeScale = 1
var bgScale = 1
var cx = 0; cy = 0

function run(type) {
    $('#popup_bid').on('shown.bs.modal', function () {
        canvas_wrapper = document.getElementById("canvas-wrapper")
        canvas.width = canvas_wrapper.offsetWidth - 40
        canvas.height = canvas.width * 9 / 16
        bgScale = canvas.width / 1920
        current_type = type
        pokeScale = bgScale
        cx = 0; cy = 0
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (type == "hide") {
            src = model.toDataURL(encoderOptions = 1)
            pkmImg.src = src
            pkmImg.onload = function () {
                currentPkmImg = src
                cloneCanvas.width = pkmImg.width
                cloneCanvas.height = pkmImg.height
                cloneCtx.drawImage(pkmImg, 0, 0);
                let imgData = changeColor()
                cloneCtx.putImageData(imgData, 0, 0)
                shadowPkm.src = cloneCanvas.toDataURL()
                ctx.drawImage(bgHideImg, 0, 0, bgHideImg.width * bgScale, bgHideImg.height * bgScale);
                shadowPkm.onload = function () {
                    ctx.drawImage(shadowPkm, 0, 0, shadowPkm.width * pokeScale, shadowPkm.height * pokeScale);
                }
            };
        }
    })
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function writeText(text, w, h) {
    text = text.split("").join(String.fromCharCode(8202))
    ctx.font = 135 * bgScale + "px Pokemon Solid, Sans-serif"
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#c7a008';
    ctx.lineWidth = 10;
    ctx.strokeText(text, w * bgScale, h * bgScale);
    ctx.fillStyle = '#3c5aa6';
    ctx.fillText(text, w * bgScale, h * bgScale);
}
function renderText() {
    var text2 = document.getElementById("poke_name").textContent
    console.log(text2);
    if (form != "") {
        // text = text2.split(" ")
        let [first, ...rest] = text2.split(' ');
        writeText(first, 1350, 280)
        writeText(rest.join(" "), 1350, 450)

    } else {
        text = capitalizeFirstLetter(document.getElementById("poke_name").textContent)
        writeText(text, 1350, 350)
    }

}

function swap(type) {
    current_type = type
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (type == 'show') {
        ctx.drawImage(bgShowImg, 0, 0, bgShowImg.width * bgScale, bgShowImg.height * bgScale);
        document.fonts.load('10pt "Pokemon Solid"').then(renderText);
        ctx.drawImage(pkmImg, cx, cy, pkmImg.width * pokeScale, pkmImg.height * pokeScale);
    } else {
        ctx.drawImage(bgHideImg, 0, 0, bgHideImg.width * bgScale, bgHideImg.height * bgScale);
        ctx.drawImage(shadowPkm, cx, cy, shadowPkm.width * pokeScale, shadowPkm.height * pokeScale);

    }
}
function changeScale(mode) {
    if (mode == "add") {
        pokeScale = pokeScale * 1.1
    } else {
        if (mode == "reset") {
            pokeScale = bgScale
        } else {
            pokeScale = pokeScale * 0.9
        }
    }
    swap(current_type)
}

function changeColor() {
    var imgData = cloneCtx.getImageData(0, 0, cloneCanvas.width, cloneCanvas.height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] != 0 | imgData.data[i + 1] != 0
            | imgData.data[i + 2] != 0) {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = 255;
        }
    }
    return imgData
}
function play_ani() {
    let ani_select = document.getElementById("ani_select")
    model.animationName = ani_select.options[ani_select.value].text
    model.play()
    ani_range.max = model.duration
    isPlaying = true
}
function changePlaying() {
    if (isPlaying) {
        model.pause()
        isPlaying = false
        document.getElementsByClassName("ri-play-fill")[0].style.display = ""
        document.getElementsByClassName("ri-pause-fill")[0].style.display = "none"
    } else {
        play_ani()
        document.getElementsByClassName("ri-play-fill")[0].style.display = "none"
        document.getElementsByClassName("ri-pause-fill")[0].style.display = ""
    }
}
function changeAni(val) {
    let ani_select = document.getElementById("ani_select")
    if (ani_select.value == "Select Animation") {
        ani_select.value = 0
    } else {
        res = parseInt(ani_select.value) + parseInt(val)
        if (ani_select.options.length - 1 < res) {
            res = 1
        }
        if (res < 1) {
            res = ani_select.options.length - 1
        }
        ani_select.value = res
    }
    console.log(ani_select.value);
    play_ani()
}


function search(e, value) {
    e.preventDefault()
    if (!isNaN(value)) {
        value = parseInt(value)
    }
    value = value.toString()
    window.location.href = window.location.pathname + '?id=' + (value.toLowerCase())
}
function download() {
    filename = "show_poke.png"
    if (current_type == "hide") {
        filename = "hide_poke.png"
    }
    var lnk = document.createElement('a'), e;
    lnk.download = filename;

    lnk.href = canvas.toDataURL("image/png;base64");

    if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);

        lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
    }
}

function notShow() {
    window.localStorage.setItem("tut_show", "enable")
}

// dragable pokemon

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var isDragging = false;

function handleMouseDown(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // set the drag flag
    isDragging = true;
}

function handleMouseUp(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // clear the drag flag
    isDragging = false;
}

function handleMouseOut(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // user has left the canvas, so clear the drag flag
    // isDragging=false;
}

function handleMouseMove(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    canvasPos = canvas.getBoundingClientRect()

    if (isDragging) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        if (current_type == "hide") {
            dragImg = shadowPkm
            bgImg = bgHideImg
        } else {
            dragImg = pkmImg
            bgImg = bgShowImg
        }
        ctx.drawImage(bgImg, 0, 0, bgImg.width * bgScale, bgImg.height * bgScale);
        if (current_type == "show") {
            document.fonts.load('10pt "Pokemon Solid"').then(renderText);
        }
        w = dragImg.width * pokeScale
        h = dragImg.height * pokeScale
        cx = canMouseX - w / 2 - canvasPos.x
        cy = canMouseY - h / 2 - canvasPos.y
        ctx.drawImage(dragImg, cx, cy, w, h);
    }
}

$("#canvas").mousedown(function (e) { handleMouseDown(e); });
$("#canvas").mousemove(function (e) { handleMouseMove(e); });
$("#canvas").mouseup(function (e) { handleMouseUp(e); });
$("#canvas").mouseout(function (e) { handleMouseOut(e); });