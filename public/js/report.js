randomizeRadio();

document.querySelector("#variantName").addEventListener("input", search);

async function search() {
    let text = document.getElementById("variantName").value;

    let url = '/api/variants';
    let response = await fetch(url);
    let data = await response.json();

    let variants = [];
    for (i = 0; i < data.length; i++) {
        variants.push(data[i].name);
    }

    if (variants.includes(text)) {
        console.log("match");
        document.querySelector('#duplicate').style.color = "Red";
        document.querySelector('#duplicate').innerHTML = "Variant already exists.";
    } else {
        document.querySelector('#duplicate').innerHTML = "";
    }

}

function randomizeRadio() {
    let variants = [ "Interest", "Concern", "High Consequence" ];
    let variantsRandom = _.shuffle(variants); // Shuffle w/ underscore
    for (let i = 0; i < variants.length; i++) {
        document.querySelector("#radioButtons").innerHTML +=
        `<div class="form-check-inline">
                <input class="form-check-input" type="radio" name="variant" id="${variantsRandom[i]}" value="${variantsRandom[i]}" checked="">
                <label class="form-check-label" for="${variantsRandom[i]}">${variantsRandom[i]}</label>
        </div>`
       
    }
}