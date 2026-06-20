document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE PREGUNTAS DINÁMICAS (VIVE SOLO) ---
    const radioViveSoloSi = document.getElementById('vive_solo_si');
    const radioViveSoloNo = document.getElementById('vive_solo_no');
    const cardPersonas = document.getElementById('card_personas');
    const inputsPersonas = document.querySelectorAll('input[name="personas"]');

    function togglePersonas() {
        if (radioViveSoloNo.checked) {
            // No vive solo -> Habilitar pregunta de cuántas personas
            cardPersonas.classList.remove('disabled-card');
            inputsPersonas.forEach(input => input.required = true);
        } else {
            // Vive solo -> Deshabilitar y limpiar
            cardPersonas.classList.add('disabled-card');
            inputsPersonas.forEach(input => {
                input.checked = false;
                input.required = false;
            });
        }
    }

    if (radioViveSoloSi && radioViveSoloNo) {
        radioViveSoloSi.addEventListener('change', togglePersonas);
        radioViveSoloNo.addEventListener('change', togglePersonas);
    }

    // --- LÓGICA DE EVALUACIÓN Y MODAL ---
    const form = document.getElementById('formEvaluacion');
    const modal = document.getElementById('modalResult');
    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const text = document.getElementById('resultText');
    const btnClose = document.getElementById('btnResultClose');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Mostrar pantalla de carga
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            icon.innerText = '⏳';
            title.innerText = 'Evaluando respuestas...';
            title.style.color = 'var(--purple-deep)';
            text.innerText = 'Por favor, espere un momento.';
            btnClose.style.display = 'none';

            // 2. Capturar las respuestas del formulario HTML
            const formData = new FormData(form);
            const edad = formData.get('edad');
            const dependencia = formData.get('dependencia');
            const rshIndep = formData.get('rsh_indep');
            const rshRango = formData.get('rsh_rango');
            const viveSolo = formData.get('vive_solo');
            const personas = formData.get('personas');
            const cuidador = formData.get('cuidador');

            // 3. Procesar las reglas del programa
            let resultado = {};

            if (rshIndep === 'no') {
                // Regla 1: Sin RSH en Independencia
                resultado = {
                    icon: '🏢',
                    title: 'Actualización de Registro Social',
                    color: '#c62828',
                    text: 'Para ingresar al programa, es requisito indispensable estar inscrito en la comuna. Le sugerimos dirigirse al <strong>Registro Social de Hogares</strong> ubicado en el edificio consistorial de la municipalidad (<strong>Av. Independencia 753</strong>), en horario de <strong>Lunes a Viernes de 9:00 a 14:00 hrs</strong>.'
                };
            } else if (dependencia === 'leve') {
                // Regla 2: Dependencia Leve dividida por edad
                if (edad === 'si') {
                    resultado = {
                        icon: '☀️',
                        title: 'Derivación a Programas de Autonomía',
                        color: '#f57c00',
                        text: 'Dado que presenta <strong>dependencia leve</strong>, le sugerimos comunicarse con la <strong>mesa de ayuda de la municipalidad (223631000)</strong> para que lo contacten con el <strong>Centro Diurno Comunitario</strong>, el <strong>Programa Contigo 60 y más</strong>, o la <strong>Oficina del Adulto Mayor</strong>, quienes cuentan con actividades ideales para su perfil.'
                    };
                } else {
                    resultado = {
                        icon: '🏢',
                        title: 'Derivación a Desarrollo Social',
                        color: '#f57c00',
                        text: 'Dado que presenta dependencia leve y es menor de 60 años, le sugerimos comunicarse con la <strong>mesa de ayuda de la municipalidad (223631000)</strong> para ser derivado al Área de Desarrollo Social, o dirigirse presencialmente al edificio consistorial (Av. Independencia 753) de Lunes a Viernes de 9:00 a 14:00 hrs.'
                    };
                }
            } else if (dependencia === 'mod_sev') {

                // Regla 3: Dependencia Moderada/Severa (El corazón de la evaluación)
                const calificaParaPCD = (
                    edad === 'si' &&
                    cuidador === 'no' &&
                    (viveSolo === 'si' || personas === '1') &&
                    rshRango !== '61_mas'
                );

                if (calificaParaPCD) {
                    // DICCIONARIO DE TRADUCCIÓN PARA GOOGLE FORMS
                    const dictSino = { 'si': 'Si', 'no': 'No' };
                    const dictDep = {
                        'leve': 'Dependencia Leve',
                        'mod_sev': 'Dependencia Moderada o Severa',
                        'ninguna': 'Sin dependencia'
                    };
                    const dictRsh = {
                        '0_40': '0 a 40%',
                        '41_60': '41 a 60%',
                        '61_mas': '61% o más',
                        'no_sabe': 'No lo sé'
                    };
                    const dictPers = {
                        '1': '1',
                        '2_mas': '2 o más'
                    };

                    // CONSTRUCCIÓN DEL ENLACE PRERRELLENADO
                    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdcdQtHTwipd_vy1WmJZF-FcwNFVYIlPKwatu7u6LvC4O0Tuw/viewform?usp=pp_url";

                    let params = `&entry.727458079=${encodeURIComponent(dictSino[edad])}` +
                        `&entry.1272697284=${encodeURIComponent(dictDep[dependencia])}` +
                        `&entry.1233288396=${encodeURIComponent(dictSino[rshIndep])}` +
                        `&entry.1399894779=${encodeURIComponent(dictRsh[rshRango])}` +
                        `&entry.631891937=${encodeURIComponent(dictSino[viveSolo])}` +
                        `&entry.873731252=${encodeURIComponent(dictSino[cuidador])}`;

                    // Añadir la cantidad de personas solo si no vive solo
                    if (personas && dictPers[personas]) {
                        params += `&entry.137323362=${encodeURIComponent(dictPers[personas])}`;
                    }

                    const urlFinalGoogle = baseUrl + params;

                    // ¡Califica al Programa de Cuidados Domiciliarios!
                    resultado = {
                        icon: '✅',
                        title: '¡El candidato es calificable!',
                        color: '#2e7d32',
                        text: `El candidato reúne el perfil idóneo para el <strong>Programa de Cuidados Domiciliarios</strong>.<br><br>Para continuar con la postulación formal y que nuestro equipo evalúe su caso, por favor ingrese al siguiente enlace:<br><br><a href="${urlFinalGoogle}" target="_blank" class="btn-cta" style="font-size: 0.95rem; padding: 12px 28px; margin-top: 6px; display: inline-flex; text-decoration: none;">Formulario de Postulación</a>`
                    };
                } else {
                    // CUALQUIER otro caso con dependencia mod/sev se va a PRLAC.
                    resultado = {
                        icon: '🤝',
                        title: 'Derivación a PRLAC',
                        color: '#1976d2',
                        text: 'De acuerdo a su nivel de dependencia y su situación particular (edad, red de apoyo, número de convivientes o tramo del Registro Social), el candidato debe ser derivado al <strong>Programa Red Local de Apoyos y Cuidados (PRLAC)</strong>. Le sugerimos comunicarse con la <strong>mesa de ayuda de la municipalidad (223631000)</strong> para gestionar el contacto con este programa y evaluar su ingreso.'
                    };
                }

            } else {
                // Regla 4: Autovalente o sin dependencia
                if (edad === 'si') {
                    resultado = {
                        icon: '👵',
                        title: 'Derivación a Oficina del Adulto Mayor',
                        color: '#f57c00',
                        text: 'Dado que la persona tiene 60 años o más y es <strong>autovalente</strong>, le sugerimos comunicarse con la <strong>mesa de ayuda de la municipalidad (223631000)</strong>, o dirigirse al Área de Desarrollo Social, y consultar por la <strong>Oficina del Adulto Mayor</strong> para conocer sus actividades.'
                    };
                } else {
                    resultado = {
                        icon: '⚠️',
                        title: 'No requiere programa de cuidados',
                        color: '#c62828',
                        text: 'De acuerdo a las respuestas ingresadas, el candidato no presenta los niveles de dependencia requeridos para este programa sociosanitario. Le sugerimos comunicarse con la <strong>mesa de ayuda de la municipalidad (223631000)</strong> para contactar a <strong>DIDECO</strong> y conocer otros beneficios de la comuna.'
                    };
                }
            }

            // 4. Mostrar el resultado
            setTimeout(() => {
                icon.innerText = resultado.icon;
                title.innerText = resultado.title;
                title.style.color = resultado.color;
                text.innerHTML = resultado.text;

                btnClose.innerText = 'Cerrar';
                btnClose.style.display = 'inline-block';
            }, 1200);
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
});