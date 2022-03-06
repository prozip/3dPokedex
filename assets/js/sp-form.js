const zeroPad = (num, places) => String(num).padStart(places, '0')
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function search(e, value) {
    e.preventDefault()
    if (!isNaN(value)) {
        value = parseInt(value)
    }
    value = value.toString()
    window.location.href = window.location.origin + '/poke-detail.html?id=' + (value.toLowerCase())
}

window.onload = function () {
    var path = '/data/Gigantamax/index.json'
    var form = "Gigantamax "
    if (window.location.pathname == "/mega-evo.html") {
        path = '/data/Mega/index.json'
        form = "Mega "
    }
    fetch(path)
        .then(response => response.json())
        .then(data => {
            index_json = data
            var promises = []

            for (var i = 0; i < data.length; i++) {
                var id = parseInt(data[i])
                promises.push(fetch('https://pokeapi.co/api/v2/pokemon/' + id).then(res => res.json()))
            }
            Promise.all(promises)
                .then((data) => {
                    for (var obj of data) {
                        let raw_name = obj.name.split("-")
                        let res = ""
                        for (rname of raw_name) {
                            if ((rname != "mega") & (rname != "gmax")) {
                                res += (" " + capitalizeFirstLetter(rname))
                            }
                        }
                        obj.name = res
                        var htmlcode = `
                        <tr class="table-tr" onclick="window.location.href = 'poke-detail.html?id=${obj.id}'">
                            <td>
                                <div class="collection space-x-10">
                                    <div class="media">
                                        <img src="${obj.sprites.other["official-artwork"].front_default}" class="collection__img">
                                    </div>
                                    <div>
                                        <h6 style="padding-left:18px" class="title color_black first-uppercase">${form} ${obj.name}</h6>
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
                }).catch((err) => {
                    console.log(err);
                })
        });
}