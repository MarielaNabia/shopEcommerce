const contadorfixed = document.getElementById("contadorfixed")

let objetoStorage = JSON.parse(localStorage.getItem("carroShop")) || JSON.parse(localStorage.getItem("carroShopJuguetes")) || []


if (objetoStorage.length != 0) {
    contadorfixed.style.visibility = "visible"
}

