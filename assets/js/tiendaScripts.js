class Producto {

    constructor(id, titulo, descripcion, precio, imagen) {

        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
    }
}

const imprimeLosProductosEnPantalla = async function () {
    try {
        const response = await fetch("../data/productos.json");
        if (!response.ok) {
            throw new Error("Algo salió mal... " + response.statusText);
        }
        const productosData = await response.json();

        let listaProductosHTML = "";

        productosData.forEach(producto => {
            listaProductosHTML += `
                <div class="producto">
                    <img src="${producto.imagen}" alt="">
                    <div class="infoProducto">
                        <h2>${producto.titulo}</h2>
                        <p>${producto.descripcion}</p>
                    </div>
                    <div class="precioYSeleccionado">
                        <h3>Precio: ${producto.precio}</h3>
                        <button class="bnMeterCarrito" id="${producto.id}">Carrito</button>
                    </div>
                </div>
            `;
        });

        document.getElementById("listaProductos").innerHTML = listaProductosHTML;

    } catch (error) {
        Swal.fire({
            title: "Algo salió mal...",
            text: "Intente recargar la página.",
            icon: "error"
        });
    }
};

let idProducto;

const getCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];

const setCarrito = (carrito) => localStorage.setItem("carrito", JSON.stringify(carrito));

const añadirAlCarrito = (idProducto) => {
    const carrito = getCarrito();
    const producto = {
        id: idProducto,
    };
    carrito.push(producto);
    setCarrito(carrito);
};

document.getElementById("listaProductos").addEventListener("click", function (event) {
    if (event.target.classList.contains("bnMeterCarrito")) {
        idProducto = event.target.getAttribute("id");
        añadirAlCarrito(idProducto);
    }
});


imprimeLosProductosEnPantalla();

const enCarrito = async function () {
    const carrito = getCarrito();

    if (carrito.length === 0) {
        Swal.fire({
            title: "¡Tu carrito está vacío!",
            icon: "info"
        });
    }

    const response = await fetch("../data/productos.json");
    if (!response.ok) {
        throw new Error("Algo salió mal... " + response.statusText);
    }
    const productosData = await response.json();

    const productosAcumulados = {};

    carrito.forEach(item => {
        if (productosAcumulados[item.id]) {
            productosAcumulados[item.id].cantidad += item.cantidad;
        } else {
            productosAcumulados[item.id] = {
                id: item.id,
                cantidad: item.cantidad
            };
        }
    });

    let productosSeleccionadosHTML = "";

    let total = 0;

    Object.values(productosAcumulados).forEach(item => {
        const producto = productosData.find(producto => producto.id == item.id);
        if (producto) {
            total += producto.precio;
            productosSeleccionadosHTML += `
                <li class="productoEnCarrito">
                    <p>${producto.titulo} - Valor: ${producto.precio}</p>
                </li>
            `;
        }
    });

    productosSeleccionadosHTML += `
        <li class="productoEnCarrito">
            <p>El total es ${total}</p>
        </li>
        <li class="productoEnCarrito">
            <button id="vaciarCarrito">Vaciar carrito</button>
        </li>
    `;

    document.getElementById("productosSeleccionados").innerHTML = productosSeleccionadosHTML;

    document.getElementById("vaciarCarrito").addEventListener("click", function () {
        localStorage.removeItem("carrito");
        enCarrito();
    });
};


const carroYCheckOutVisible = async function () {
    document.getElementById("listaProductos").style.display = "none";
    document.getElementById("bnCarrito").style.display = "none";
    document.getElementById("completarCompra").style.display = "block";
    await enCarrito();
}

document.getElementById("bnCarrito").addEventListener("click", carroYCheckOutVisible);


const carroYCheckOutInvisible = function () {


    document.getElementById("bnCarrito").style.display = "inline-block";
    document.getElementById("listaProductos").style.display = "flex";
    document.getElementById("completarCompra").style.display = "none";

}

document.getElementById("cerrarCarrito").addEventListener("click", carroYCheckOutInvisible)


document.getElementById("comprar").addEventListener("click", function () {
    if (JSON.parse(localStorage.getItem("carrito") || "[]").length > 0) {
    Swal.fire({
        title: "Compra Realizada",
        icon: "success"
    });
}
})


