class Persona {

    static id = 0;

    constructor() {
        this.id = Persona.id++;
        this.nombre = "Nombre";
        this.edad = 22;
        this.altura = 170;
        this.peso = 70;
        this.genero = 1;
        this.grasaCorporal = 22;
    }

    actualizar(nombre, edad, altura, peso, genero, grasaCorporal) {
        this.nombre = nombre;
        this.edad = edad;
        this.altura = altura;
        this.peso = peso;
        this.genero = genero;
        this.grasaCorporal = grasaCorporal;
    }
}

let personasArray = [];

personasArray.push(new Persona());

let idSeleccionado = 0;

let listaPersonasHTML = document.getElementById("personasLista");

const actualizarListaHTML = function () {

    let htmlLista = "";

    for (const persona of personasArray) {
        htmlLista += `<li><button id="${persona.id}">${persona.nombre}</button></li>`;
    }
    listaPersonasHTML.innerHTML = htmlLista;

}

listaPersonasHTML.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        idSeleccionado = event.target.id;
        datosPersona();
    }
});

const datosPersona = function () {



    let datosPersona = document.getElementById("datosPersona");
    datosPersona.innerHTML = (`


                <tr>
                    <th><input id="nombrePersona" type="text" placeholder="${personasArray[idSeleccionado].nombre}"></th>

                </tr>
                <tr>
                    <th>Edad: </th>
                    <th><input id="edadPersona" type="number" placeholder="${personasArray[idSeleccionado].edad}"></th>
                    <th> años</th>
                </tr>
                <tr>
                    <th>Altura: </th>
                    <th><input id="alturaPersona" type="number" placeholder="${personasArray[idSeleccionado].altura}"></th>
                    <th> CM</th>
                </tr>
                <tr>
                    <th>Peso: </th>
                    <th><input id="pesoPersona" type="number" placeholder="${personasArray[idSeleccionado].peso}"></th>
                    <th> KG</th>
                </tr>
                <tr>
                    <th>Genero: </th>
                    <th><select id="generoPersona" name="Genero">
                            <option value="0">Femenino</option>
                            <option value="1">Masculino</option>
                        </select>
                    </th>
                </tr>
                <tr>
                    <th>Grasa Coporal: </th>
                    <th><input id="grasaCorporalPersona" type="number" placeholder="${personasArray[idSeleccionado].grasaCorporal}"></th>
                    <th> %</th>
                </tr>
            </table>`);
}
datosPersona()
actualizarListaHTML();



const nuevaPersona = function () {

    let alertas = document.getElementById("alertas");
    if ((personasArray.some(persona => persona.nombre === "Nombre"))) {
        alertas.innerHTML = "<p>Ingrese el nombre de la persona actual antes de añadir otra!! </p>"
    } else {
        personasArray.push(new Persona());
        idSeleccionado = idSeleccionado+1;
        alertas.innerHTML = "";
    }

    actualizarListaHTML();
    datosPersona();
}

let botonCrearPersona = document.getElementById("botonCrearPersona");

botonCrearPersona.addEventListener("click", nuevaPersona)



const calcularFFMI = function () {

    if (personasArray[idSeleccionado].peso > 30 && personasArray[idSeleccionado].grasaCorporal > 2) {

        let alturaEnMetros = personasArray[idSeleccionado].altura / 100;
        let masaMagra = personasArray[idSeleccionado].peso - (personasArray[idSeleccionado].peso * (personasArray[idSeleccionado].grasaCorporal / 100));
        let resultado = ((masaMagra / (alturaEnMetros * alturaEnMetros)) + 6.1 * (1.8 - alturaEnMetros)).toFixed(2);

        document.getElementById("ffmi").innerHTML = `
            <p>Tu FFMI es ${resultado}</p>
            <div class="barraProgresoFFMI">
                <p class="textoIndicativoBarra">
                    18| 19| 21| 23| 25| 29| +29|
                </p>
                <progress id="barraProgresoFFMI" max="100" value="0"></progress>
            </div>
        `;

        const progressBar = document.getElementById('barraProgresoFFMI');
        const percentage = ((resultado - 18) / (29 - 18)) * 100;

        progressBar.value = Math.min(Math.max(percentage, 0), 100);
    }
};

const calcularBMR = function () {

    let metabolismo;

    if (personasArray[idSeleccionado].genero == 1) {
        metabolismo = parseInt(88.362 + (13.397 * personasArray[idSeleccionado].peso) + (4.799 * personasArray[idSeleccionado].altura) - (5.677 * personasArray[idSeleccionado].edad));
    } else {
        metabolismo = parseInt(447.593 + (9.247 * personasArray[idSeleccionado].peso) + (3.098 * personasArray[idSeleccionado].altura) - (4.330 * personasArray[idSeleccionado].edad));
    }

    let bmrTableHTML = document.getElementById("bmr");

    bmrTableHTML.innerHTML = (
        `<table>
                    <tr>
                        <th>Actividad</th>
                        <th>Indice metabolico basal</th>
                    </tr>
                    <tr>
                        <th>0 Dias</th>
                        <th>${parseInt(metabolismo * 1.2)} Calorias</th>
                    </tr>
                    <tr>
                        <th>1-3 Dias</th>
                        <th>${parseInt(metabolismo * 1.375)} Calorias</th>
                    </tr>
                    <tr>
                        <th>3-5 Dias</th>
                        <th>${parseInt(metabolismo * 1.55)} Calorias</th>
                    </tr>
                    <tr>
                        <th>7 Dias</th>
                        <th>${parseInt(metabolismo * 1.725)} Calorias</th>
                    </tr>
                    <tr>
                        <th>Rutina Doble</th>
                        <th>${parseInt(metabolismo * 1.9)} Calorias</th>
                    </tr>
                </table>`);

}

const mc = function () {


    let metabolismo;

    if (personasArray[idSeleccionado].genero == 1) {
        metabolismo = parseInt(88.362 + (13.397 * personasArray[idSeleccionado].peso) + (4.799 * personasArray[idSeleccionado].altura) - (5.677 * personasArray[idSeleccionado].edad));
    } else {
        metabolismo = parseInt(447.593 + (9.247 * personasArray[idSeleccionado].peso) + (3.098 * personasArray[idSeleccionado].altura) - (4.330 * personasArray[idSeleccionado].edad));
    }

    let mcHTML = document.getElementById("mc");

    mcHTML.innerHTML = (`

        <table>
                    <tr>
                        <th>Actividad</th>
                        <th>Proteinas</th>
                        <th>Hidratos</th>
                        <th>Grasas</th>
                        <th>Azucar</th>
                        <th>Grasas sat</th>
                    </tr>
                    <tr>
                        <th>0 Dias</th>
                        <th>${(personasArray[idSeleccionado].peso * 1.6).toFixed(2) + '-' + (personasArray[idSeleccionado].peso * 2.2).toFixed(2)}</th>
                        <th>${((metabolismo * 1.2 * 0.45) / 4).toFixed(2) + '-' + ((metabolismo * 1.2 * 0.65) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.2 * 0.20) / 9).toFixed(2) + '-' + ((metabolismo * 1.2 * 0.35) / 9).toFixed(2)}</th>
                        <th>${((metabolismo * 1.2 * 0.10) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.2 * 0.10) / 9).toFixed(2)}</th>
                    </tr>
                    <tr>
                        <th>1-3 Dias</th>
                        <th>${(personasArray[idSeleccionado].peso * 1.6).toFixed(2) + '-' + (personasArray[idSeleccionado].peso * 2.2).toFixed(2)}</th>
                        <th>${((metabolismo * 1.375 * 0.45) / 4).toFixed(2) + '-' + ((metabolismo * 1.375 * 0.65) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.375 * 0.20) / 9).toFixed(2) + '-' + ((metabolismo * 1.375 * 0.35) / 9).toFixed(2)}</th>
                        <th>${((metabolismo * 1.375 * 0.10) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.375 * 0.10) / 9).toFixed(2)}</th>
                    </tr>
                    <tr>
                        <th>3-5 Dias</th>
                        <th>${(personasArray[idSeleccionado].peso * 1.6).toFixed(2) + '-' + (personasArray[idSeleccionado].peso * 2.2).toFixed(2)}</th>
                        <th>${((metabolismo * 1.55 * 0.45) / 4).toFixed(2) + '-' + ((metabolismo * 1.55 * 0.65) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.55 * 0.20) / 9).toFixed(2) + '-' + ((metabolismo * 1.55 * 0.35) / 9).toFixed(2)}</th>
                        <th>${((metabolismo * 1.55 * 0.10) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.55 * 0.10) / 9).toFixed(2)}</th>
                    </tr>
                    <tr>
                        <th>7 Dias</th>
                        <th>${(personasArray[idSeleccionado].peso * 1.6).toFixed(2) + '-' + (personasArray[idSeleccionado].peso * 2.2).toFixed(2)}</th>
                        <th>${((metabolismo * 1.725 * 0.45) / 4).toFixed(2) + '-' + ((metabolismo * 1.725 * 0.65) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.725 * 0.20) / 9).toFixed(2) + '-' + ((metabolismo * 1.725 * 0.35) / 9).toFixed(2)}</th>
                        <th>${((metabolismo * 1.725 * 0.10) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.725 * 0.10) / 9).toFixed(2)}</th>
                    </tr>
                    <tr>
                        <th>Rutina Doble</th>
                        <th>${(personasArray[idSeleccionado].peso * 1.6).toFixed(2) + '-' + (personasArray[idSeleccionado].peso * 2.2).toFixed(2)}</th>
                        <th>${((metabolismo * 1.9 * 0.45) / 4).toFixed(2) + '-' + ((metabolismo * 1.9 * 0.65) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.9 * 0.20) / 9).toFixed(2) + '-' + ((metabolismo * 1.9 * 0.35) / 9).toFixed(2)}</th>
                        <th>${((metabolismo * 1.9 * 0.10) / 4).toFixed(2)}</th>
                        <th>${((metabolismo * 1.9 * 0.10) / 9).toFixed(2)}</th>
                    </tr>
                </table>


    `);
}

const actualizarDatosPersona = function () {

    let nombre = document.getElementById("nombrePersona");

    let edad = document.getElementById("edadPersona");

    let altura = document.getElementById("alturaPersona");

    let peso = document.getElementById("pesoPersona");

    let genero = document.getElementById("generoPersona");

    let grasaCorporal = document.getElementById("grasaCorporalPersona");

    personasArray[idSeleccionado].actualizar(nombre.value, edad.value, altura.value, peso.value, genero.value, grasaCorporal.value);

    let botonEditarPersona = document.getElementById("botonEditarPersona");

    actualizarListaHTML();


}



let botonEditarPersona = document.getElementById("botonEditarPersona");

botonEditarPersona.addEventListener("click", function () {
    actualizarDatosPersona()
    calcularFFMI();
    calcularBMR();
    mc();
});

const calcularCBDC = function () {

    const cbdcTable = document.getElementById("cbdcTable");

    let duracion = parseFloat(document.getElementById("minutos").value);

    cbdcTable.innerHTML = "";


    cbdcTable.innerHTML = (
        `<table id="cbdcTable">
                        <tr>
                            <th><input id="minutos" type="text" placeholder="${duracion}"></th>
                            <th><button id="calcularCDBC">calcular</button></th>
                        </tr>
                        <tr>
                            <th>Intensidad</th>
                            <th>Gasto Calorico</th>
                        </tr>
                        <tr>
                            <th>Baja 70-110PPM</th>
                            <th>${parseInt((((-55.0969 + (0.6309 * 110) + (0.1988 * personasArray[idSeleccionado].peso) + (0.2017 * personasArray[idSeleccionado].edad)) / 4.184) * duracion))}</th>
                        </tr>
                        <tr>
                            <th>Media 90-130PPM</th>
                            <th>${parseInt((((-55.0969 + (0.6309 * 140) + (0.1988 * personasArray[idSeleccionado].peso) + (0.2017 * personasArray[idSeleccionado].edad)) / 4.184) * duracion))}</th>
                        </tr>
                        <tr>
                            <th>Alta 130-160PPM</th>
                            <th>${parseInt((((-55.0969 + (0.6309 * 160) + (0.1988 * personasArray[idSeleccionado].peso) + (0.2017 * personasArray[idSeleccionado].edad)) / 4.184) * duracion))}</th>
                        </tr>
                        <tr>
                            <th>Muy alta 160-200PPM</th>
                            <th>${parseInt((((-55.0969 + (0.6309 * 180) + (0.1988 * personasArray[idSeleccionado].peso) + (0.2017 * personasArray[idSeleccionado].edad)) / 4.184) * duracion))}</th>
                        </tr>
                    </table>`)

    let botonCalcularCBDC = document.getElementById("calcularCDBC");
    botonCalcularCBDC.addEventListener("click", calcularCBDC);

}

let botonCalcularCBDC = document.getElementById("calcularCDBC");

botonCalcularCBDC.addEventListener("click", calcularCBDC);

const calcularGrasa = function () {

    let resultado;

    const cintura = parseInt(document.getElementById("cintura").value);
    const cuello = parseInt(document.getElementById("cuello").value);
    const caderas = parseInt(document.getElementById("caderas").value);


    if (personasArray[idSeleccionado].genero == 1) {
        resultado = parseInt((86.010 * Math.log10(cintura - cuello) - 70.041 * Math.log10(personasArray[idSeleccionado].altura) + 36.76));
    } else {
        resultado = parseInt((163.205 * Math.log10(cintura + caderas - cuello)) - 97.684 * Math.log10(personasArray[idSeleccionado].altura) - 78.387)
    }
    document.getElementById("resultadoGrasa").innerText = ("Tu porcentaje de grasa es " + resultado + "%");

    const botonCalularGrasa = document.getElementById("calcularGrasa");

    botonCalularGrasa.addEventListener("click", calcularGrasa);

}

const botonCalularGrasa = document.getElementById("calcularGrasa");

botonCalularGrasa.addEventListener("click", calcularGrasa);










