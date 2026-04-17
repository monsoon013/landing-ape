require('dotenv').config();

$(document).ready(function() {
    const apiToken = process.env.API_TOKEN;
    const API_URL = `https://aiv3.iucnredlist.org/api/v3/0?token=${apiToken}`;
    const WIKIPEDIA_URL = 'https://es.wikipedia.org/w/api.php';

    ///popup textos predeterminados
    setTimeout(function() {
         const POPUP_TEXTS = {
            CR: dato => `${dato.taxonname} está en <strong>Peligro Crítico</strong>. Quedan muy pocos individuos en estado salvaje. Sin intervención inmediata, la extinción es inminente`,
            EN: dato => `${dato.taxonname} está en <strong>Peligro</strong>. La especie enfrenta un riesgo muy alto de extinción en estado salvaje en el futuro cercano.`,
            VU: dato => `${dato.taxonname} está en <strong>Vulnerable</strong>. La especie enfrenta un riesgo alto de extinción en estado salvaje en el futuro.`,
            NT: dato => `${dato.taxonname} está en <strong>Casi Amenazado</strong>. La especie no cumple con los criterios para ser considerada amenazada, pero se acerca a cumplirlos o probablemente los cumplirá en el futuro cercano.`,
            LC: dato => `${dato.taxonname} está en <strong>Preocupación Menor</strong>. La especie ha sido evaluada y no se encuentra cerca de cumplir con los criterios para ser considerada amenazada. Es una especie común y abundante.`,
            DD: dato => `No hay suficiente información disponible para evaluar el riesgo de extinción de la especie. Se necesita más investigación para determinar su estado de conservación.`,
        };

        const textoPopup = POPUP_TEXTS[estado]; 
        $('#popup-text').html(textoPopup);
        $('#popup').addClass('show');
    }, 2000);

    $('#cerrar-popup').on('click', function() {
        $('#popup').removeClass('show');
    }); 

    
    $getJSON(`${API_URL}/species/page/0?token=${apiToken}`, function(data) {
        especies = data.result;
        indiceAct = Math.floor(Math.random() * especies.length);
        mostrarAnimal(indiceAct);
       $('btn-avance').on('click', function(){
            indiceAct = (indiceAct + 1) % especies.length;
            mostrarAnimal(indiceAct);
       })

       $('#btn-retroceso').on('click', function(){
            indiceAct = (indiceAct - 1 + especies.length) % especies.length;
            mostrarAnimal(indiceAct);
       });

       function mostrarAnimal(indice) {
        let especie = especies[indice];
        let nombreCient  = especie.scientific_name;
        let nombre = especie.main_common_name || nombreCient;
        let estado = especie.category;
        let tendencia = especie.polulation_trend;
        let reino = especie.kingdom_name || 'Desconocido';
        let anoVal = especie.asssessment_date 
                                    ? especie.asssessment_date.substring(0, 4)
                                    : 'Desconocido';
               

    });
});

