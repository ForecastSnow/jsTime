class Persona {

    constructor(id, nombre, edad, altura, peso, genero, grasaCorporal) {

        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
        this.altura = altura;
        this.peso = peso;
        this.genero = genero;
        this.grasaCorporal = grasaCorporal;

    }

    actualizar(nombre, edad, altura, peso, genero, grasaCorporal) {
        this.nombre = nombre;
        this.edad = edad;
        this.altura = altura;
        this.peso = peso;
        this.genero = genero;
        this.grasaCorporal = grasaCorporal;
    }

    actualizarId(id) {
        this.id = id
    }

}



let arrayPersonas = localStorage.getItem("personas");

function filtrarArrays(array1, array2) {
    const map = new Map();

    array1.forEach(item => map.set(item["id"], item));

    array2.forEach(item => map.set(item["id"], item));

    return Array.from(map.values());
}

/* el localYFetch basicamente mezcla el localStorage y fetch data.json. */

const localYFetch = async function () {

    try {

        let arrayPersonas = JSON.parse(localStorage.getItem('personas')) || [];

        const response = await fetch("./data/data.json");
        if (!response.ok) {
            throw new Error("Algo salió mal... " + response.statusText);
        }
        const data = await response.json();

        arrayPersonas = filtrarArrays(arrayPersonas, data);

        localStorage.setItem('personas', JSON.stringify(arrayPersonas));

    } catch (error) {
        Swal.fire({
            title: "Algo salio mal...",
            text: "intente recargar la pagina.",
            icon: "error"
        })
    }
    finally {

    }
};

localYFetch();

let idSeleccionado;

/* calcula el puntaje del FFMI y actualiza la foto estado y hace los cambios en el html */

const calcularFFMI = function () {

    let resultado;

    if (arrayPersonas[idSeleccionado].grasaCorporal > 1) {

        let alturaEnMetros = arrayPersonas[idSeleccionado].altura / 100;
        let masaMagra = arrayPersonas[idSeleccionado].peso - (arrayPersonas[idSeleccionado].peso * (arrayPersonas[idSeleccionado].grasaCorporal / 100));
        resultado = ((masaMagra / (alturaEnMetros * alturaEnMetros)) + 6.1 * (1.8 - alturaEnMetros)).toFixed(2);

        document.getElementById("ffmi").innerHTML = `

        <div>

                    <p>Calculadora FFMI</p>

                    <p class="ffmiHTML" id="ffmiResultado">${resultado}</p>

                </div>



                <div class="barraProgresoFFMI">

                    <p class="textoIndicativoBarra">
                        18| 19| 21| 23| 25| 29| +29|
                    </p>

                    <progress id="barraProgresoffmi" value="0" max="100"></progress>

                </div>
        `;

        const progressBar = document.getElementById('barraProgresoffmi');

        let percentage = ((resultado - 18) / (29 - 18)) * 100;

        progressBar.value = Math.min(Math.max(percentage, 0), 100);
    } else {
        document.getElementById("ffmi").innerHTML = `

        <div>

                    <p>Calculadora FFMI</p>

                    <p class="ffmiHTML" id="ffmiResultado">0</p>

                </div>



                <div class="barraProgresoFFMI">

                    <p class="textoIndicativoBarra">
                        18| 19| 21| 23| 25| 29| +29|
                    </p>

                    <progress id="barraProgresoffmi" value="0" max="100"></progress>

                </div>
        `;

        const progressBar = document.getElementById('barraProgresoffmi');
        progressBar.value = Math.min(Math.max(0, 0), 100);


    }

    let fotoEstado = document.getElementById("fotoEstado");

    resultado = parseInt(resultado);

    if (arrayPersonas[idSeleccionado].genero == 0) {
        if (arrayPersonas[idSeleccionado].peso > arrayPersonas[idSeleccionado].altura - 100) {

            if (resultado <= 17) {
                fotoEstado.setAttribute("src", "./assets/img/margeGorda.png");
            } else if (resultado > 17 && resultado < 20) {
                fotoEstado.setAttribute("src", "./assets/img/margeNormal.png");
            } else if (resultado >= 20 && resultado <= 23) {
                fotoEstado.setAttribute("src", "./assets/img/margeMamada.png");
            } else if (resultado > 23) {
                fotoEstado.setAttribute("src", "./assets/img/margeConEsteroides.png");
            }
        } else {
            if (resultado <= 17) {
                fotoEstado.setAttribute("src", "./assets/img/margeDesnutrida.png");
            } else if (resultado > 17) {
                fotoEstado.setAttribute("src", "./assets/img/margeNormal.png");
            }
        }
    } else {
        if (arrayPersonas[idSeleccionado].peso > arrayPersonas[idSeleccionado].altura - 100) {

            if (resultado <= 17) {
                fotoEstado.setAttribute("src", "./assets/img/homeroGordo.png");
            } else if (resultado > 17 && resultado < 20) {
                fotoEstado.setAttribute("src", "./assets/img/homeroNormal.png");
            } else if (resultado >= 20 && resultado <= 23) {
                fotoEstado.setAttribute("src", "./assets/img/homeroMamado.png");
            } else if (resultado > 23) {
                fotoEstado.setAttribute("src", "./assets/img/homeroConEsteroides.png");
            }
        } else {
            if (resultado <= 17) {
                fotoEstado.setAttribute("src", "./assets/img/homeroDesnutrido.png");
            } else if (resultado > 17) {
                fotoEstado.setAttribute("src", "./assets/img/homeroNormal.png");
            }
        }
    }


};

/* calcula el bmr/metabolismo basal y lo representa en el html */

const calcularBMR = function () {

    let metabolismo = 0;

    if (arrayPersonas[idSeleccionado].nombre !== "sin nombre") {

        if (arrayPersonas[idSeleccionado].genero == 1) {
            metabolismo = parseInt(88.362 + (13.397 * arrayPersonas[idSeleccionado].peso) + (4.799 * arrayPersonas[idSeleccionado].altura) - (5.677 * arrayPersonas[idSeleccionado].edad));
        } else {
            metabolismo = parseInt(447.593 + (9.247 * arrayPersonas[idSeleccionado].peso) + (3.098 * arrayPersonas[idSeleccionado].altura) - (4.330 * arrayPersonas[idSeleccionado].edad));
        }
    }
    let bmrTableHTML = document.getElementById("bmr");

    bmrTableHTML.innerHTML = (
        `<table>
            <tr>
                <th class="cuadroSlotArriba">Actividad</th>
                <th class="cuadroSlotArribaDerecha">Indice metabolico basal</th>
            </tr>
            <tr>
                <th class="cuadroSlotArriba">0 Dias</th>
                <th class="cuadroSlotArribaDerecha">${parseInt(metabolismo * 1.2)}</th>
            </tr>
            <tr>
                <th class="cuadroSlotArriba">1-3 Dias</th>
                <th class="cuadroSlotArribaDerecha">${parseInt(metabolismo * 1.375)}</th>
            </tr>
            <tr>
                <th class="cuadroSlotArriba">3-5 Dias</th>
                <th class="cuadroSlotArribaDerecha">${parseInt(metabolismo * 1.55)}</th>
            </tr>
            <tr>
                <th class="cuadroSlotArriba">7 Dias</th>
                <th class="cuadroSlotArribaDerecha">${parseInt(metabolismo * 1.725)}</th>
            </tr>
            <tr>
                <th class="cuadroSlotAbajo">Rutina Doble</th>
                <th class="cuadroSlotAbajoFinal">${parseInt(metabolismo * 1.9)}</th>
            </tr>
        </table>`);

};

/* calcula los macros de la persona y lo representa en el html */

const mc = function () {


    let metabolismo;

    if (arrayPersonas[idSeleccionado].nombre !== "sin nombre") {

        if (arrayPersonas[idSeleccionado].genero == 1) {
            metabolismo = parseInt(88.362 + (13.397 * arrayPersonas[idSeleccionado].peso) + (4.799 * arrayPersonas[idSeleccionado].altura) - (5.677 * arrayPersonas[idSeleccionado].edad));
        } else {
            metabolismo = parseInt(447.593 + (9.247 * arrayPersonas[idSeleccionado].peso) + (3.098 * arrayPersonas[idSeleccionado].altura) - (4.330 * arrayPersonas[idSeleccionado].edad));
        }

        let mcHTML = document.getElementById("mc");

        mcHTML.innerHTML = (`
        <table>
            <tr>
                <th class="ffmiCuadroSlotArriba" >Actividad</th>
                <th class="ffmiCuadroSlotArriba" >Proteinas</th>
                <th class="ffmiCuadroSlotArriba" >Hidratos</th>
                <th class="ffmiCuadroSlotArriba" >Grasas</th>
                <th class="ffmiCuadroSlotArriba" >Azucar</th>
                <th class="ffmiCuadroSlotArribaDerecha" >Grasas sat</th>
            </tr>
            <tr>
                <th class="ffmiCuadroSlotArriba" >0 Dias</th>
                <th class="ffmiCuadroSlotArriba" >${(arrayPersonas[idSeleccionado].peso * 1.2).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.2 * 0.45) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.2 * 0.20) / 9).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.2 * 0.10) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArribaDerecha" >${((metabolismo * 1.2 * 0.10) / 9).toFixed(2)}</th>
            </tr>
            <tr>
                <th class="ffmiCuadroSlotArriba" >1-3 Dias</th>
                <th class="ffmiCuadroSlotArriba" >${(arrayPersonas[idSeleccionado].peso * 1.6).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.375 * 0.45) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.375 * 0.20) / 9).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.375 * 0.10) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArribaDerecha" >${((metabolismo * 1.375 * 0.10) / 9).toFixed(2)}</th>
            </tr>
            <tr>
                <th class="ffmiCuadroSlotArriba" >3-5 Dias</th>
                <th class="ffmiCuadroSlotArriba" >${(arrayPersonas[idSeleccionado].peso * 1.8).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.55 * 0.45) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.55 * 0.20) / 9).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.55 * 0.10) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArribaDerecha" >${((metabolismo * 1.55 * 0.10) / 9).toFixed(2)}</th>
            </tr>
            <tr>
                <th class="ffmiCuadroSlotArriba" >7 Dias</th>
                <th class="ffmiCuadroSlotArriba" >${(arrayPersonas[idSeleccionado].peso * 2).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.725 * 0.45) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.725 * 0.20) / 9).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArriba" >${((metabolismo * 1.725 * 0.10) / 4).toFixed(2)}</th>
                <th class="ffmiCuadroSlotArribaDerecha" >${((metabolismo * 1.725 * 0.10) / 9).toFixed(2)}</th>
            </tr>
            <tr>
                <th class="ffmiSlotAbajo">Rutina X2</th>
                <th class="ffmiSlotAbajo" >${(arrayPersonas[idSeleccionado].peso * 2.2).toFixed(2)}</th>
                <th class="ffmiSlotAbajo" >${((metabolismo * 1.9 * 0.45) / 4).toFixed(2)}</th>
                <th class="ffmiSlotAbajo" >${((metabolismo * 1.9 * 0.20) / 9).toFixed(2)}</th>
                <th class="ffmiSlotAbajo" >${((metabolismo * 1.9 * 0.10) / 4).toFixed(2)}</th>
                <th class="ffmiSlotAbajoFinal" >${((metabolismo * 1.9 * 0.10) / 9).toFixed(2)}</th>
            </tr>
        </table>
    `);
    } else {
        let mcHTML = document.getElementById("mc");

        mcHTML.innerHTML = (`

        <table>
                    <tr>
                        <th class="ffmiCuadroSlotArriba">Actividad</th>
                        <th class="ffmiCuadroSlotArriba">Proteinas</th>
                        <th class="ffmiCuadroSlotArriba">Hidratos</th>
                        <th class="ffmiCuadroSlotArriba">Grasas</th>
                        <th class="ffmiCuadroSlotArriba">Azucar</th>
                        <th class="ffmiCuadroSlotArribaDerecha">Saturada</th>
                    </tr>
                    <tr>
                        <th class="ffmiCuadroSlotArriba">0 Dias</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArribaDerecha">0</th>
                    </tr>
                    <tr>
                        <th class="ffmiCuadroSlotArriba">1-3 Dias</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArribaDerecha">0</th>
                    </tr>
                    <tr>
                        <th class="ffmiCuadroSlotArriba">3-5 Dias</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArribaDerecha">0</th>
                    </tr>
                    <tr>
                        <th class="ffmiCuadroSlotArriba">7 Dias</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArriba">0</th>
                        <th class="ffmiCuadroSlotArribaDerecha">0</th>
                    </tr>
                    <tr>
                        <th class="ffmiSlotAbajo">Rutina x2</th>
                        <th class="ffmiSlotAbajo">0</th>
                        <th class="ffmiSlotAbajo">0</th>
                        <th class="ffmiSlotAbajo">0</th>
                        <th class="ffmiSlotAbajo">0</th>
                        <th class="ffmiSlotAbajoFinal">0</th>
                    </tr>
                </table>
    `);
    }

}

/* llama las 3 funciones principales */

const calcularFfmiBrmMc = function () {
    calcularFFMI();
    calcularBMR();
    mc();
}

/* calcula muy "aproximadamente" la quema de calorias de cualquier Cardio basado en el fisico y las pulsaciones por minuto */

const calcularCBDC = function () {

    const cbdcTable = document.getElementById("cbdcTable");

    let duracion = parseFloat(document.getElementById("minutos").value);

    if (isNaN(duracion)) {
        Swal.fire({
            title: "No es posible calcular gasto calorico!",
            text: "Ingrese los minutos que duro la actividad!",
            icon: "warning"
        });
        return;
    }

    if (duracion < 0) {
        Swal.fire({
            title: "No es posible calcular gasto calorico!",
            text: "que significa ¿" + duracion + "?",
            icon: "warning"
        });
        return;
    }

    if (idSeleccionado == undefined) {
        Swal.fire({
            title: "No es posible calcular gasto calorico!",
            text: "Necesitas añadir o seleccionar una persona con datos!",
            icon: "warning"
        });
        return;
    }

    if (arrayPersonas[idSeleccionado].nombre == "sin nombre") {
        Swal.fire({
            title: "No es posible calcular gasto calorico!",
            text: "Necesitas añadir o seleccionar una persona con datos!",
            icon: "warning"
        });
        return;
    }

    cbdcTable.innerHTML = "";

    cbdcTable.innerHTML = (
        `<table id="cbdcTable">
            <tr>
                <th class="cuadroSlotArriba">Intensidad</th>
                <th class="cuadroSlotArribaDerecha">Gasto Cal.</th>
            </tr>
            <tr>
                <th class="cuadroSlotArriba">70-110PPM</th>
                <th class="cuadroSlotArribaDerecha">${parseInt((((-55.0969 + (0.6309 * 90) + (0.1988 * arrayPersonas[idSeleccionado].peso) + (0.2017 * arrayPersonas[idSeleccionado].edad)) / 4.184) * duracion))}</th>
            </tr>
            <tr>
                <th class="cuadroSlotArriba">90-130PPM</th>
                <th class="cuadroSlotArribaDerecha">${parseInt((((-55.0969 + (0.6309 * 110) + (0.1988 * arrayPersonas[idSeleccionado].peso) + (0.2017 * arrayPersonas[idSeleccionado].edad)) / 4.184) * duracion))}</th>
            </tr>
            <tr>
                <th class="cuadroSlotArriba">130-160PPM</th>
                <th class="cuadroSlotArribaDerecha">${parseInt((((-55.0969 + (0.6309 * 140) + (0.1988 * arrayPersonas[idSeleccionado].peso) + (0.2017 * arrayPersonas[idSeleccionado].edad)) / 4.184) * duracion))}</th>
            </tr>
            <tr>
                <th class="cuadroSlotAbajo">200PPM++</th>
                <th class="cuadroSlotAbajoFinal">${parseInt((((-55.0969 + (0.6309 * 160) + (0.1988 * arrayPersonas[idSeleccionado].peso) + (0.2017 * arrayPersonas[idSeleccionado].edad)) / 4.184) * duracion))}</th>
            </tr>
        </table>`)

    let botonCalcularCBDC = document.getElementById("calcularCDBC");

    botonCalcularCBDC.addEventListener("click", calcularCBDC);

}

let botonCalcularCBDC = document.getElementById("calcularCDBC");

botonCalcularCBDC.addEventListener("click", calcularCBDC);

/* calcula con el metodo marine el porcentaje de indice de grasa */

const calcularGrasa = function () {


    if (idSeleccionado == undefined) {
        Swal.fire({
            title: "No es posible calcular porcentaje de grasa!",
            text: "Necesitas añadir o seleccionar una persona con datos!",
            icon: "warning"
        });
        return;
    }

    if (arrayPersonas[idSeleccionado].nombre == "sin nombre") {
        Swal.fire({
            title: "No es posible calcular porcentaje de grasa!",
            text: "Necesitas añadir o seleccionar una persona con datos!",
            icon: "warning"
        });
        return;
    }

    let resultado;

    const cintura = parseInt(document.getElementById("cintura").value);
    const cuello = parseInt(document.getElementById("cuello").value);
    const caderas = parseInt(document.getElementById("caderas").value);

    if (cintura < 0) {
        Swal.fire({
            title: "No es posible calcular porcentaje de grasa!",
            text: "que significa ¿" + cintura + "?",
            icon: "warning"
        });
        return;
    }

    if (cuello < 0) {
        Swal.fire({
            title: "No es posible calcular porcentaje de grasa!",
            text: "que significa ¿" + cuello + "?",
            icon: "warning"
        });
        return;
    }

    if (caderas < 0) {
        Swal.fire({
            title: "No es posible calcular porcentaje de grasa!",
            text: "que significa ¿" + caderas + "?",
            icon: "warning"
        });
        return;
    }

    if (arrayPersonas[idSeleccionado].genero == 1) {
        resultado = parseInt((86.010 * Math.log10(cintura - cuello) - 70.041 * Math.log10(parseInt(arrayPersonas[idSeleccionado].altura)) + 36.76));
    } else {
        resultado = parseInt((163.205 * Math.log10(cintura + caderas - cuello)) - 97.684 * Math.log10(parseInt(arrayPersonas[idSeleccionado].altura)) - 78.387)
    }

    if (isNaN(resultado)) {
        Swal.fire({
            title: "No es posible calcular porcentaje de grasa!",
            text: "Verifica que los datos sean correctos!",
            icon: "warning"
        });
        return;
    }

    document.getElementById("resultadoGrasa").innerText = (resultado + "%");

}

const botonCalularGrasa = document.getElementById("calcularGrasa");

botonCalularGrasa.addEventListener("click", calcularGrasa);


/* esta function al ser llamada actualiza la informacion del placeholder */

const datosPersona = function () {

    if (!(idSeleccionado === undefined)) {
        let datosPersona = document.getElementById("datosPersona");

        let nombre = document.getElementById("nombrePersona");

        nombre.placeholder = `${arrayPersonas[idSeleccionado].nombre}`;

        datosPersona.innerHTML = (`


        <tr>
                    <th>Edad </th>
                    <th><input id="edadPersona" type="number" placeholder="${arrayPersonas[idSeleccionado].edad}" maxlength="3"></th>
                    <th> AÑOS</th>
                </tr>

                <tr>
                    <th>Altura </th>
                    <th><input id="alturaPersona" type="number" placeholder="${arrayPersonas[idSeleccionado].altura}" maxlength="3"></th>
                    <th> CM</th>
                </tr>

                <tr>
                    <th>Peso </th>
                    <th><input id="pesoPersona" type="number" placeholder="${arrayPersonas[idSeleccionado].peso}" maxlength="3"></th>
                    <th> KG</th>
                </tr>

                <tr>
                    <th>Genero </th>
                    <th><select id="generoPersona" name="Genero">
                            <option value="0">Femenino</option>
                            <option value="1">Masculino</option>
                        </select>
                    </th>
                </tr>

                <tr>
                    <th>Grasa Corp </th>
                    <th><input id="grasaCorporalPersona" type="number" placeholder="${arrayPersonas[idSeleccionado].grasaCorporal}"></th>
                    <th> %</th>
                </tr>`);

    }

}

arrayPersonas = JSON.parse(localStorage.getItem('personas')) || [];

let listaPersonasHTML = document.getElementById("personasLista");

const actualizarListaPersonasHTML = function () {

    if (idSeleccionado == undefined) {
        idSeleccionado = arrayPersonas.length - 1;
    }


    let htmlLista = "";

    for (const persona of arrayPersonas) {
        if (persona.id == idSeleccionado) {
            htmlLista += `<li><button class="personaSeleccionada" id="${persona.id}">${persona.nombre}</button></li>`;
        } else {
            htmlLista += `<li><button class="botonSeleccionarPersona" id="${persona.id}">${persona.nombre}</button></li>`;
        }

    }
    listaPersonasHTML.innerHTML = htmlLista;

}

actualizarListaPersonasHTML();

listaPersonasHTML.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        idSeleccionado = event.target.id;
        datosPersona();
        calcularFfmiBrmMc();
        actualizarListaPersonasHTML();
    }
});

let botonGuardarPersonaHtml = document.getElementById('botonGuardarPersona');

/* guarda los datos de la id seleccionada y se asegura que los datos sean validos */

const guardarPersona = async function () {

    let nombre = document.getElementById("nombrePersona").value;

    let edad = document.getElementById("edadPersona").value;

    let altura = document.getElementById("alturaPersona").value;

    let peso = document.getElementById("pesoPersona").value;

    let genero = document.getElementById("generoPersona").value;

    let grasaCorporal = document.getElementById("grasaCorporalPersona").value;

    if (idSeleccionado === undefined) {
        Swal.fire({
            title: "Añada una persona o seleccione una!",

            icon: "error"
        });
        return
    }

    if (nombre == "") {

        Swal.fire({
            title: "Persona no guardada!",
            text: "Debes asignar un nombre.",
            icon: "warning"
        });
        return;
    }

    if (edad < 1 || edad > 120) {

        Swal.fire({
            title: "Persona no guardada!",
            text: "Verifica la edad ingresada.",
            icon: "warning"
        });
        return;
    }

    if (altura < 100 || altura > 220) {

        Swal.fire({
            title: "Persona no guardada!",
            text: "Verifica la altura ingresada.",
            icon: "warning"
        });
        return;
    }

    if (peso < 35 || peso > 180) {

        Swal.fire({
            title: "Persona no guardada!",
            text: "Verifica el peso ingresado.",
            icon: "warning"
        });
        return;
    }

    if (!(grasaCorporal == "") && (grasaCorporal < 1 || grasaCorporal > 65)) {
        Swal.fire({
            title: "Persona no guardada!",
            text: "Verifica el porcentaje de grasa corporal ingresado.",
            icon: "warning"
        });
        return;
    }

    if (grasaCorporal == "") {
        Swal.fire({
            title: "Persona guardada sin porcentaje grasa corporal!",
            text: "Si usted no sabe su % de grasa corporal se le invita a usar la calculadora y ingresar el dato",
            icon: "warning"
        });
    }

    arrayPersonas = JSON.parse(localStorage.getItem('personas')) || [];

    arrayPersonas = arrayPersonas.map(persona => new Persona(
        persona.id,
        persona.nombre,
        persona.edad,
        persona.altura,
        persona.peso,
        persona.genero,
        persona.grasaCorporal
    ));

    arrayPersonas.find(persona => parseInt(persona.id) === parseInt(idSeleccionado)).actualizar(nombre, edad, altura, peso, genero, grasaCorporal);

    localStorage.setItem("personas", JSON.stringify(arrayPersonas));

    calcularFfmiBrmMc();

    actualizarListaPersonasHTML();

}


botonGuardarPersonaHtml.addEventListener('click', guardarPersona);

let bnCrearPersona = document.getElementById("botonCrearPersona");


/* el event ingresa una nueva persona y se asegura de no ingresar mas de 10 */

bnCrearPersona.addEventListener("click", function () {

    if (arrayPersonas.length > 9) {
        Swal.fire({
            title: "Persona no guardada!",
            text: "Solo Puedes tener hasta 10 personas",
            icon: "warning"
        });
        return;
    }

    arrayPersonas.push(new Persona(arrayPersonas.length, "sin nombre", 0, 0, 0, 0, 0))

    localStorage.setItem("personas", JSON.stringify(arrayPersonas));

    datosPersona();

    idSeleccionado = arrayPersonas.length - 1;

    actualizarListaPersonasHTML();

    calcularFfmiBrmMc();

    datosPersona();
})

let bnEliminarPersona = document.getElementById("botonEliminarPersona");

/* el evet de abajo elimina el usuario seleccionado o el ultimo agregado, tambien ordena los id */

bnEliminarPersona.addEventListener("click", function () {

    if (idSeleccionado == undefined) {
        idSeleccionado = arrayPersonas.length - 1;
    }

    if (idSeleccionado == 0 || idSeleccionado == 1 || idSeleccionado == 2) {
        Swal.fire({
            title: `Es imposible eliminar a ${arrayPersonas[idSeleccionado].nombre}...`,

            icon: "error"
        });
        return;
    }

    Swal.fire({
        title: "¿Estas seguro de que deseas borrar a " + arrayPersonas[idSeleccionado].nombre + "?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Borralo!"
    }).then((result) => {
        if (result.isConfirmed) {


            arrayPersonas = JSON.parse(localStorage.getItem('personas')) || [];

            arrayPersonas = arrayPersonas.map(persona => new Persona(
                persona.id,
                persona.nombre,
                persona.edad,
                persona.altura,
                persona.peso,
                persona.genero,
                persona.grasaCorporal
            ));

            if (idSeleccionado === undefined) {
                idSeleccionado = (arrayPersonas.length - 1);
            }

            arrayPersonas = arrayPersonas.filter(persona => parseInt(persona.id) !== parseInt(idSeleccionado));

            for (let i = 0; i < arrayPersonas.length; i++) {

                arrayPersonas[i].actualizarId(i);
            }

            localStorage.setItem("personas", JSON.stringify(arrayPersonas));

            idSeleccionado = arrayPersonas.length - 1;

            actualizarListaPersonasHTML();

        }
    });




});

/* pequeña animacion que llama la atencion de la tienda para que la vean */

const popStore = function () {

    document.getElementById("tienda").setAttribute("class", "animate__heartBeat");

}

setTimeout(popStore, 7000);

const parpadearBordeRojo = function (elemento) {
    let borderOriginal = elemento.style.border;
    let parpadeos = 8;
    let parpadeosHechos = 0;
    let intervalo = setInterval(() => {
        if (parpadeosHechos < parpadeos) {

            elemento.style.border =
                (parpadeosHechos % 2 === 0) ? '2px solid red' : borderOriginal;
            parpadeosHechos++;
        } else {
            clearInterval(intervalo);
            elemento.style.border = borderOriginal;
        }
    }, 300);
}

async function ayuda() {


    await swal.fire({
        position: "bottom-end",
        title: 'Bienvenido a GymBro Calculator',
        text: "Mediante este servicio usted podra obtener datos de utilidad sobre alimentacion y estado fisico",
        icon: 'info',
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,

    })

    parpadearBordeRojo(bnCrearPersona);

    await swal.fire({
        position: "bottom-end",
        title: 'Paso 1 añadir una persona',
        text: "En el menu en celeste podra añadir hasta 10 personas y eliminar con excepción de los 3 primeros que son referentes, puede cambiar sus datos para curiosear pero no se guardaran al refrescar la pagina.",
        icon: 'info',
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,

    })

    parpadearBordeRojo(botonGuardarPersonaHtml);

    await swal.fire({
        position: "bottom-end",
        title: 'Paso 2 llenar los datos',
        text: "Rellene los datos, caso de no saber su porcentaje de grasa corporal, no se preocupe, deje el slot como esta y presione 'Guardar Persona'",
        icon: 'info',
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,

    })

    parpadearBordeRojo(document.getElementById("calculadoraDeGrasa"));

    await swal.fire({
        position: "bottom-end",
        title: 'Si usted no ingreso la grasa corporal puede hacer uso de la calculadora.',
        text: "Al ingresar los datos devela el porcentaje de grasa coporal, que si bien no es tan precisa como si una balanza con chip bia (tampoco es muy precisa) pero da una orientacion, una vez sepa su % de grasa reingrese sus datos, repita el paso 2.",
        icon: 'info',
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,

    })

    parpadearBordeRojo(document.getElementById("contadorDeCaloriasQuemadas"));

    await swal.fire({
        position: "bottom-end",
        title: 'Explorando las herramientas',
        text: "Se observa varias herramientas el contador de quema de calorias es una forma orientativa de cuantas calorias quemas en un cardio segun las pulsaciones por minuto, rudumentario pero funcional, utliza los datos como el peso, edad, altura y porcentaje de grasa para sacar un estimado de la quema.",
        icon: 'info',
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,

    })

    parpadearBordeRojo(document.getElementById("ffmi"));

    await Swal.fire({
        position: "bottom-end",
        title: "FFMI",
        text: "Como puede observar se puede obtener el puntaje FFMI.",
        icon: "info",
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,
    });

    await Swal.fire({
        position: "bottom-end",
        imageUrl: "assets/img/siLeSeAlDeHechoMeme.png",
        title: "Evaluación muscular, detección de anomalías y muchos usos más...",
        text: "El FFMI (Índice de Masa Libre de Grasa) mide la cantidad de masa muscular en relación con la altura, excluyendo la grasa corporal. Un FFMI entre 18 y 22 es normal y saludable. Valores superiores a 22 pueden indicar alta masa muscular, valores muy altos son señales de uso de esteroides. Un FFMI por debajo de 17 puede ser bajo y señalar insuficiencia muscular, desnutrición, o problemas de salud, lo que aconseja consultar a un profesional.",
        confirmButtonText: 'OK',
    });

    parpadearBordeRojo(document.getElementById("bmr"));

    await Swal.fire({
        position: "bottom-end",
        title: "BMR",
        text: "En esta tabla usted puede ver su metabolismo basal.",
        icon: "question",
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,
    });

    await Swal.fire({
        position: "bottom-end",
        imageUrl: "assets/img/realmente.jpg",
        title: "La base de la alimentación y la planificación de cualquier objetivo...",
        text: "El BRM es la cantidad de energía que el cuerpo necesita para mantener funciones básicas en reposo, como la respiración, la circulación sanguínea y la regulación de la temperatura corporal. Se mide en calorías y representa la energía mínima necesaria para sobrevivir cuando el cuerpo está en reposo total.",
        confirmButtonText: 'OK',
    });

    parpadearBordeRojo(document.getElementById("mc"));

    await Swal.fire({
        position: "bottom-end",
        title: "Calculadora de macros...",
        text: "En esta tabla puede tener una orientación de su alimentación",
        icon: "question",
        confirmButtonText: 'OK',
        backdrop: false,
        allowOutsideClick: false,
    });

    await Swal.fire({
        position: "bottom-end",
        imageUrl: "assets/img/estadisticamente.jpg",
        title: "Una guia basica de por donde empezar a la hora de mejorar la alimentacion...",
        text: "Un macro calculator calcula la cantidad ideal de proteínas, carbohidratos y grasas según tus datos personales y objetivos. Introduces información como tu peso, altura y actividad, y el cálculo te da un desglose de calorías y macronutrientes para ayudarte a planificar tu dieta.",
        confirmButtonText: 'OK',
    });

}


botonAyuda.addEventListener("click", ayuda);




