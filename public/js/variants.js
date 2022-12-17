randomizeRadio();
displayInfo();

document.querySelector("#showDetails").addEventListener("click", displayInfo);

function randomizeRadio() {
    let variants = [ "Interest", "Concern", "High Consequence" ];
    let variantsRandom = _.shuffle(variants); // Shuffle w/ underscore
    for (let i = 0; i < variants.length; i++) {
        document.querySelector("#placeChoices").innerHTML +=
        `<input type="radio" name="place" id="${variantsRandom[i]}2" value="${variantsRandom[i]}2" checked="">
         <label for="${variantsRandom[i]}2">${variantsRandom[i]} </label>
        `
    }
}

async function displayInfo() {
    let radio = document.querySelector('input[name="place"]:checked').value;
    let variant = radio.substr(0, radio.length - 1);

    let url = `/api/variantInfo/${variant}`;
    let response = await fetch(url);
    let data = await response.json();

    document.querySelector("#tableBody").innerHTML = "";

    for (i = 0; i < data.length; i++) {
        document.querySelector("#tableBody").innerHTML +=
        `<tr>
            <td class="variant-link">${data[i].variant}</td>
            <td><a href="/updateVariant/${data[i].name}">${data[i].name}</a></td>
            <td>${data[i].first_detected}</td>
            <td style="text-align:left">${data[i].attributes}</td>
        </tr>`
    }
}