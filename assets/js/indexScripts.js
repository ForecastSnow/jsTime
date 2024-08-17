class Persona {

    constructor(id, nombre, edad, altura, peso, genero, grasaCorporal) {

        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
        this.altura = altura;
        this.peso = peso;
        this.genero = genero;
        this.grasaCorporal = grasaCorporal;
        this.fotoEstado = 0;

    }

    actualizar(nombre, edad, altura, peso, genero, grasaCorporal) {
        this.nombre = nombre;
        this.edad = edad;
        this.altura = altura;
        this.peso = peso;
        this.genero = genero;
        this.grasaCorporal = grasaCorporal;
    }

    actualizarFotoEstado(fotoEstado) {
        this.fotoEstado = fotoEstado
    }

    actualizarId(id) {
        this.id = id
    }

}

let idSeleccionado;

let arrayPersonas = localStorage.getItem("personas");

function filtrarArrays(array1, array2) {
    const map = new Map();

    array1.forEach(item => map.set(item["id"], item));

    array2.forEach(item => map.set(item["id"], item));

    return Array.from(map.values());
}

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


/* calcula el puntaje del FFMI y actualiza la foto estado y hace los cambios en el html */

const calcularFFMI = function () {

    if (arrayPersonas[idSeleccionado].grasaCorporal > 1) {

        let alturaEnMetros = arrayPersonas[idSeleccionado].altura / 100;
        let masaMagra = arrayPersonas[idSeleccionado].peso - (arrayPersonas[idSeleccionado].peso * (arrayPersonas[idSeleccionado].grasaCorporal / 100));
        let resultado = ((masaMagra / (alturaEnMetros * alturaEnMetros)) + 6.1 * (1.8 - alturaEnMetros)).toFixed(2);

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

    /* if (arrayPersonas[idSeleccionado].nombre == "sin nombre") {
        return;
    } */

    calcularFFMI();
    calcularBMR();
    mc();
}

/* calcula muuuy aproximadamente la quema de calorias de cualquier Cardio basado en el fisico y las pulsaciones por minuto */

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
                <th class="cuadroSlotAbajo">160-200PPM</th>
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

setInterval(actualizarListaPersonasHTML, 1000);

listaPersonasHTML.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        idSeleccionado = event.target.id;
        datosPersona();
        calcularFfmiBrmMc();
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

    if (peso < 35 || peso > 150) {

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

})

let bnEliminarPersona = document.getElementById("botonEliminarPersona");

/* el evet de abajo elimina el usuario seleccionado o el ultimo agregado tambien ordena */

bnEliminarPersona.addEventListener("click", function () {

    Swal.fire({
        title: "Estas Seguro?",
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

            idSeleccionado = undefined;

        }
    });




});



