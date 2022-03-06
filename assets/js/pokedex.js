const zeroPad = (num, places) => String(num).padStart(places, '0')

var current_page = 0
var poke_per_page = 10
var index_json = []
var end = false

var observer = new IntersectionObserver(function (entries) {
    // isIntersecting is true when element and viewport are overlapping
    // isIntersecting is false when element and viewport don't overlap
    if ((entries[0].isIntersecting === true) & (end == false))
        fetchPoke(index_json)
}, { threshold: [0] });

function search(e, value) {
    e.preventDefault()
    if (!isNaN(value)){
        value = parseInt(value)
    }
    value = value.toString()
    window.location.href = document.querySelector('base').href + 'poke-detail.html?id=' + (value.toLowerCase())
}

function fetchPoke(data) {
    var min = current_page * poke_per_page
    var max = (current_page + 1) * poke_per_page
    if (end == true) {
        return
    }
    current_page += 1
    if (data.length < max) {
        end = true
        max = data.length
    }
    var promises = []

    for (var i = min; i < max; i++) {
        var id = parseInt(data[i])
        promises.push(fetch('https://pokeapi.co/api/v2/pokemon/' + id).then(res => res.json()))
    }
    Promise.all(promises)
        .then((data) => {
            for (var obj of data) {
                var htmlcode = `
            <tr class="table-tr" onclick="window.location.href = 'poke-detail.html?id=${obj.id}'">
                <td>
                    <div class="collection space-x-10">
                        <div class="media">
                            <img src="${obj.sprites.other["official-artwork"].front_default}" class="collection__img">
                        </div>
                        <div>
                            <h6 style="padding-left:18px" class="title color_black first-uppercase">${obj.species.name}</h6>
                        </div>
                    </div>
                </td>
                <td><span>#${zeroPad(obj.id, 3)}</span></td>
                <td style="width: 10%">                
                    <a class="likes poke">
                        <img class="poke-icon ${obj.types[0].type.name}" src="assets/img/poke/type_icon/${obj.types[0].type.name}.svg">
                        <span class="txt_sm first-uppercase">${obj.types[0].type.name}</span>
                    </a>
                </td>
                <td style="width: 10%"> 
            `;
                if (obj.types.length == 2) {
                    let type = obj.types[1].type.name
                    htmlcode += `               
                <a class="likes poke">
                    <img class="poke-icon ${type}" src="assets/img/poke/type_icon/${type}.svg">
                    <span class="txt_sm first-uppercase">${type}</span>
                </a>
                `
                };
                htmlcode += `</td>
                <td style="padding-right: 5px;"><span>${obj.stats[0].base_stat}<span></td>
                <td style="padding-right: 5px;"><span>${obj.stats[1].base_stat}<span></td>
                <td style="padding-right: 5px;"><span>${obj.stats[2].base_stat}<span></td>
                <td style="padding-right: 5px;"><span>${obj.stats[3].base_stat}<span></td>
                <td style="padding-right: 5px;"><span>${obj.stats[4].base_stat}<span></td>
                <td style="padding-right: 5px;"><span>${obj.stats[5].base_stat}<span></td>
            </tr>
            `
                $("#table-data").append(htmlcode)
            }
            observer.observe(document.querySelector("#load-detect"));
        }).catch((err) => {
            console.log(err);
        })
}

window.onload = function () {
    fetch(document.querySelector('base').href + 'data/index.json')
        .then(response => response.json())
        .then(data => {
            index_json = data
            fetchPoke(data)
        });
}