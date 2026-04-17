
$(document).ready(function() {
    const apiToken = "vugw5WogDRNMoD9JRdmW2Mpw5CqDcpW4yQLU2";  
    let API_URL      = 'https://api.gbif.org/v1/species/search?status=ACCEPTED&limit=50&language=es';
    let WIKIPEDIA_URL = 'https://es.wikipedia.org/w/api.php';

     let especies   = [];
    let indiceAct  = 0;

    
    $.getJSON(API_URL, function(data) {
        especies = data.results;
        indiceAct = Math.floor(Math.random() * especies.length);
        mostrarAnimal(indiceAct);
    });
       $('#btn-avance').on('click', function(){
            indiceAct = (indiceAct + 1) % especies.length;
            mostrarAnimal(indiceAct);
       })

       $('#btn-retroceso').on('click', function(){
            indiceAct = (indiceAct - 1 + especies.length) % especies.length;
            mostrarAnimal(indiceAct);
       });

     $('#cerrar-popup').on('click', function () {
        $('#popup').removeClass('show');
    });

       function mostrarAnimal(indice) {
        let especie = especies[indice];
        let nombreCient  = especie.scientific_name;
        let nombre = especie.main_common_name || nombreCient;
        let estado = especie.category;
        let tendencia = especie.population_trend;
        let reino = especie.kingdom_name || 'Desconocido';
        let anoVal = especie.assessment_date 
                                    ? especie.assessment_date.substring(0, 4)
                                    : 'Desconocido';
        
        let textoEstado = {
            CR: 'Peligro Crítico',
            EN: 'Peligro',
            VU: 'Vulnerable',
            NT: 'Casi Amenazado',
            LC: 'Preocupación Menor',
            DD: 'Datos Insuficientes'
        }

        let textoTendencia = {
            increasing: 'Ascendente',
            decreasing: 'Descendente',
            stable: 'Estable',
            unknown: 'Desconocida'
        };

        $('#nom-cient').text(nombreCient);
        $('#nom-animal').text(nombre);
        $('#estado').text(textoEstado[estado] || estado);
        $('#estado-iucn').text(textoEstado[estado]);
        $('#tendencia').text(textoTendencia[tendencia] || tendencia  || 'Desconocida');
        $('#reino').text(reino);
        $('#año').text(anoVal);

        $('body').attr('data-threat', estado);

        $('#estado, #nom-animal').removeClass('visible');
        setTimeout(function() {
            $('#estado, #nom-animal').addClass('visible');
        }   , 50);

        $('#img-animal').css('opacity', 0);

        $('#popup').removeClass('show');

        let wikiParams = {
            action: 'query',
            titles: nombreCient,
            prop: 'extracts|pageimages',
            exintro: true,
            explaintext: true,
            pithumbsize: 1200,
            format: 'json',
            origin: '*'
        }

        $.getJSON(WIKIPEDIA_URL, wikiParams) 
            .done(function(wikiData) {
                let pages=wikiData.query.pages;
                let pageId = Object.keys(pages)[0];
                let page = pages[pageId];

                if(page.thumbnail && page.thumbnail.source) {
                    $('#img-animal').attr('src', page.thumbnail.source);
                    $('#img-animal').on('load', function() {
                        $(this).css('opacity', 1);
                        $('#loading-overlay').fadeOut(600);
                    });
            
                }else {
                    $('#loading-overlay').fadeOut(600);
                }
            
                if(page.extract) {
                    let extracto = page.extract.substring(0, 500) + '...';
                    $('#desc-an').text(extracto);
                }else {
                    $('#desc-an').text('No se encontró una descripción en Wikipedia para esta especie.');
                }

                 setTimeout(function() {
                const POPUP_TEXTS = {
                    CR: dato => `${dato.scientific_name} está en <strong>Peligro Crítico</strong>. Quedan muy pocos individuos en estado salvaje. Sin intervención inmediata, la extinción es inminente`,
                    EN: dato => `${dato.scientific_name} está en <strong>Peligro</strong>. La especie enfrenta un riesgo muy alto de extinción en estado salvaje en el futuro cercano.`,
                    VU: dato => `${dato.scientific_name} está en <strong>Vulnerable</strong>. La especie enfrenta un riesgo alto de extinción en estado salvaje en el futuro.`,
                    NT: dato => `${dato.scientific_name} está en <strong>Casi Amenazado</strong>. La especie no cumple con los criterios para ser considerada amenazada, pero se acerca a cumplirlos o probablemente los cumplirá en el futuro cercano.`,
                    LC: dato => `${dato.scientific_name} está en <strong>Preocupación Menor</strong>. La especie ha sido evaluada y no se encuentra cerca de cumplir con los criterios para ser considerada amenazada. Es una especie común y abundante.`,
                    DD: dato => `No hay suficiente información disponible para evaluar el riesgo de extinción de la especie. Se necesita más investigación para determinar su estado de conservación.`,
                  };

                let textoPopup = POPUP_TEXTS[estado]
                    ? POPUP_TEXTS[estado](especie)    // <-- los paréntesis la invocan
                    : '<strong>' + nombre + '</strong> figura en la Lista Roja de la IUCN.';
                $('#popup-texto').html(textoPopup);
                $('#popup').addClass('show');
                 }, 2000);

            $('#cerrar-popup').on('click', function() {
                $('#popup').removeClass('show');
            }); 
        });
    };
});

