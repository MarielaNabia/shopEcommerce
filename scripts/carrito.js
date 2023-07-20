let arrayImprimir = []
let totalCash = 0
let totalCant = 0
let datosDeApi = []
let objetosTotales = []
let final = []
const carritoContainer = document.getElementById("carrito")
const limpiarCarrito = document.getElementById("limpiarCarrito")
const contenedorDatos = document.getElementById("contenedorDatos")
const finalizar = document.getElementById("finalizar")
const alertSucess = document.getElementById("alertSucess")

async function getData() {
    await fetch("https://apipetshop.herokuapp.com/api/articulos")
        .then(response => response.json())
        .then(dato => {
            datosDeApi.push(...dato.response)
            datosDeApi.map(prod => {
                prod.cantidad = 1
            })
        })
    imprimirPantalla()

    limpiarCarrito.addEventListener("click", vaciar)

    calTotales()
    console.log(`total cash: ${totalCash}`)
    console.log(`total cant: ${totalCant}`)
    imprimirDatos()
}

getData()

let objetosCarrito = JSON.parse(localStorage.getItem("objetoProd")) || []

function imprimirPantalla() {

    arrayImprimir = []
    let datosStorage = []
    datosStorage = JSON.parse(localStorage.getItem("carroShop"))
    let datosStorageJuguetes = JSON.parse(localStorage.getItem("carroShopJuguetes"))
    // console.log(datosStorageJuguetes)

    if (datosStorage == null && datosStorageJuguetes!=null) {
        datosStorage = [...datosStorageJuguetes]
    } else if (datosStorage != null && datosStorageJuguetes != null) {
        datosStorage.push(...datosStorageJuguetes)
    }

    // console.table(datosStorage)
    if (datosStorage != null) {
        final = datosStorage
    } else {
        final = []
    }
    let arrayFiltrado = []
    final.map(idStorage => {
        arrayFiltrado.push(...datosDeApi.filter(prod => prod._id == idStorage))
        arrayImprimir.push(...datosDeApi.filter(prod => prod._id == idStorage))
        // objetosTotales.push(...datosDeApi.filter(prod => prod._id == idStorage))
        localStorage.setItem("objetoProd", JSON.stringify(arrayFiltrado))
    })
    carritoContainer.innerHTML = ""
    if (final.length == 0) {
        carritoContainer.innerHTML = "<h2 class = 'carritoVacio'>No hay elementos en el carrito</h2>"
    } else {
        arrayImprimir.forEach(producto => {
            carritoContainer.innerHTML += (`
            <div class="col my-5 mx-auto contCardIndividual" >
                        <div class="card h-100 px-2 ">
                        <h5 class="card-title mx-auto text-center my-3" style="width: 90%"> ${producto.nombre.toUpperCase()} </h5>
                        <img src="${producto.imagen}" class="card-img-top imgCard2" alt="...">
                            <div class="card-body">
                                <p class="card-text pCard">Precio : <span>$${producto.precio}</span></p>
                                <p class="card-text pCard">Stock : <span>${producto.stock}u.</span></p>
                                <p class="card-text pCard">Descripción: <span  class="d-block"> ${producto.descripcion}</span></p>
                                <div class="d-flex flex-wrap justify-content-between align-items-center">
                                <input class="btnEliminar" type="button" id="${producto._id}" value="Eliminar producto" min="1">
                                <button class="botonSumar" value="${producto._id}" id="addCantidad${producto._id}">+</button>
                                <p class="m-0">${producto.cantidad}</p>
                                <button class="botonRestar" value="${producto._id}" id="restCantidad${producto._id}">-</button>
                                </div>
                            </div>
                        </div>
                    </div>
            `)
            $(() => {
                // eliminar productos del carrito
                $(`#${producto._id}`).on("click", () => {

                    let momentaneo = event.target.id
                    let arrayPrueba = []
                    final.forEach(prod => {
                        if (momentaneo != prod) {
                            arrayPrueba.push(prod)
                        }
                    })
                    localStorage.clear()
                    localStorage.setItem("carroShop", JSON.stringify(arrayPrueba))
                    imprimirPantalla()
                    calTotales()
                })
                // retar cantidad por producto
                let contador = []
                $(`#restCantidad${producto._id}`).on("click", () => {

                    let idProd = event.target.value
                    contador = []
                    contador = [...arrayImprimir.filter(productoA => productoA._id == idProd)]
                    contador.map(prod => prod.cantidad--)
                    localStorage.setItem("objetoProd", JSON.stringify(arrayImprimir))
                    imprimirPantalla()
                    calTotales()
                })
                // incrementar cantidad por producto
                $(`#addCantidad${producto._id}`).on("click", () => {
                    let idProd = event.target.value
                    let index = datosDeApi.indexOf(prod => prod._id == idProd)
                    let buscado = datosDeApi.filter(prod => prod._id == idProd)
                    datosDeApi.splice(index, 1, buscado)
                    contador = []
                    contador = [...arrayImprimir.filter(productoA => productoA._id == idProd)]
                    contador.map(prod => prod.cantidad++)
                    localStorage.setItem("objetoProd", JSON.stringify(arrayImprimir))
                    imprimirPantalla()
                    calTotales()

                })
            })
        })
    }
}

function vaciar() {
    localStorage.clear()
    localStorage.removeItem("carroShop")
    localStorage.removeItem("carroShopJuguetes")
    imprimirPantalla()
    calTotales()
}

function calTotales() {
    objetosTotales = JSON.parse(localStorage.getItem("objetoProd")) || []
    console.log(objetosTotales)
    let list = []
    list.push(...objetosTotales)
    let suma = 0
    let arrayC = []
    let iterador = 0
    arrayC.push(...list)
    arrayC.map(prod => {
        prod.total = prod.cantidad * prod.precio
    })
    arrayC.forEach(prod => {
        suma += prod.total
    })
    list.forEach(prod => {
        iterador += prod.cantidad
    })
    totalCash = suma
    totalCant = iterador

    console.log(`total cash: ${totalCash}`)
    console.log(`total cant: ${totalCant}`)
    imprimirDatos()
}


function imprimirDatos() {
    contenedorDatos.innerHTML =
        (`
            <p class = "tagTotal">Cantidad de productos: ${totalCant} unidades </p>
            <p class = "tagTotal">Total a pagar:  ${totalCash} usd</p>
            
            `)

}


finalizar.addEventListener("click", () => {
    alertSucess.style.display = "block"
})
