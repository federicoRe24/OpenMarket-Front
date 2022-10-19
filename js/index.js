const contenedorProducto = document.querySelector(".index-product-container");
const cartelProductoNoEncontrados = contenedorProducto.nextElementSibling;
const loading = document.querySelector('.loading');
const inputSearch = document.querySelector('.inputSearch');
const contenedorResultadosEncontrados = document.querySelector(".products h3");
const resultadosEncontrados = contenedorResultadosEncontrados.firstElementChild;
const optionSort = document.querySelector(".sort");
const btnFiltro = document.querySelector(".filter");
const btnFiltroExit = document.querySelector(".filters-exit");
const btnClean = document.querySelector(".filter-button-clean");
const btnSearch = inputSearch.nextElementSibling;
const checkboxAll = document.querySelectorAll("[type='checkbox']");
const formFiltros = document.filters;


let formularioFiltro = false;

function main(){

    fetch('./json/products.json')
    .then(response => {return response.json()})
    .then(myJson => {

        actualizarProductos(myJson);

        inputSearch.addEventListener("change", () => {
            limpiarSelector();
            actualizarProductos(myJson);
        });

        btnSearch.addEventListener("change", () => {
            limpiarSelector();
            actualizarProductos(myJson);
        });

        pageSelection.btnAtras.addEventListener("click", () => actualizarProductos(myJson));

        pageSelection.btnSiguiente.addEventListener("click", () => actualizarProductos(myJson));

    });

}

function actualizarProductos(lista){

    if (inputSearch.value != '') {
        location.href ="./products.html" + "?search=" + inputSearch.value;
    }
    let listaDesordenada = lista;
    listaDesordenada = buscarCoincidencia(inputSearch.value, listaDesordenada);
    pageSelection.maximo = 3; // Muestro un total de 3 elementos
    actualizarBotones();

    ocultarElementosPrincipales(); //Oculta todos los elementos para mostrar la animacion de carga
    mostrarLoading(); // Muestra el contenedor que posee la animacion  de carga


    setTimeout(()=>{
        contenedorProducto.innerHTML = procesarProductos(listaDesordenada);
        ocultarLoading(); //Oculta el contenedor que posee la animacion de carga
        aparecerElementosPrincipales(9); // Aparece los elementos que fueron ocultados -> REVISAR
    }, 1000);


}

function procesarProductos(lista){

    let listaPorPagina = filtrarListaPorPagina(lista, pageSelection.contador);

    let html = "";

    listaPorPagina.forEach(element => {
        let envioGratis = tieneEnvioGratis(element["price"], 5.000);
        html = html + crearArticulo(element["title"],element["price"],element["img"],envioGratis);
    });

    return html;

}


function filtrarListaPorPagina(lista, numeroDePagina){

    let desde = numeroDePagina * 3 - 3;
    let hasta = numeroDePagina * 3;
    return lista.slice(desde,hasta); // Corto el Array para mostrar 3 articulos por listado

}


function mostrarCoincidencias(longitudLista){
    if (inputSearch.value != '') {
        location.href ="./products.html";
    }

    if(longitudLista == 0){
        agregarDisplayHTML(cartelProductoNoEncontrados, "flex");
        eliminarDisplayHTML(contenedorProducto);
        return;
    }

    agregarDisplayHTML(contenedorProducto, "grid");
    eliminarDisplayHTML(cartelProductoNoEncontrados);
}


function buscarCoincidencia(palabras, lista){
    listaDePalabras = palabras.trim().split(" ");

    let nuevaLista =  lista.filter(product => {
        return contienePalabra(product["title"],listaDePalabras,product["brand"],product["product"]);
    });

    return nuevaLista;
}

function contienePalabra(titulo, palabras, marca, producto){

    let coincidencia = false;

    titulo = titulo.toLowerCase();
    producto = producto.toLowerCase();

    palabras = palabras.map(palabra => palabra.toLowerCase());

    palabras.forEach(palabra => {
        if(palabra != " " && (titulo.includes(palabra) || marca.includes(palabra) || producto.includes(palabra))){
            coincidencia = true;
        }
    });

    return coincidencia;
}

function tieneEnvioGratis(precio, apartir){
    return precio > apartir ? `<img class="product-envio" src="./img/envio-gratis.png">` : "";
}

function crearArticulo(titulo, precio, imagen, envioGratis){
    return `
    <article class="product">
        <figure class="product-image">
            <img src="${imagen}">
        </figure>
        <h3 class="product-title">${titulo.slice(0,40) + "..."}</h3>
        <p class="product-price">$${precio}</p>
        ${envioGratis}
    </article>
    `;
}

function vistaFormulario(){
    if(formularioFiltro){
        iniciarAnimacion(formFiltros, "aparecer", "reverse");

        setTimeout(() => {
            eliminarAnimacion(formFiltros);
            eliminarDisplayHTML(formFiltros);
        },270);

    }else{
        agregarDisplayHTML(formFiltros, "grid");
        iniciarAnimacion(formFiltros, "aparecer", "normal");

        setTimeout(() => {
            eliminarAnimacion(formFiltros);
        },270);

    }

    formularioFiltro = !formularioFiltro;
}

function iniciarAnimacion(elemento, nombreAnimacion, direccion){
    elemento.style.animationDirection = direccion;
    elemento.style.animationName = nombreAnimacion;
    elemento.style.animationIterationCount = "1";
}

function eliminarAnimacion(elemento){
    elemento.style.animationName = "none";
}

function mostrarLoading(){
    agregarDisplayHTML(loading, "flex");
}

function ocultarLoading(){
    eliminarDisplayHTML(loading);
}


function ocultarElementosPrincipales(){
    desaparecerElementoHTML(pageSelection.contenedor);
    desaparecerElementoHTML(contenedorResultadosEncontrados);
    eliminarDisplayHTML(cartelProductoNoEncontrados);
    eliminarDisplayHTML(contenedorProducto);
}

function aparecerElementosPrincipales(longitudLista){
    agregarDisplayHTML(contenedorProducto, "grid");
    aparecerElementoHTML(pageSelection.contenedor);
    aparecerElementoHTML(contenedorResultadosEncontrados);
    mostrarCoincidencias(longitudLista);
}


function desaparecerElementoHTML(elemento){
    elemento.style.opacity = '0';
}

function aparecerElementoHTML(elemento){
    elemento.style.opacity = '1';
}

function eliminarDisplayHTML(elemento){
    elemento.style.display = 'none';
}

function agregarDisplayHTML(elemento, tipo){
    elemento.style.display = tipo;
}

main();
