
$(document).ready(function() {

    let historial = [];
    let lastID = -1;
    let cargando = false;
    let pool = []; //controlar que aves salen

    let estadoData = {
        LC: "Preocupación menor", 
        NT: "Casi amenazada",
        VU: "Vulnerable",
        EN: "En peligro",
        CR: "En peligro crítico",
        EW: "Extinta en libertad",
        EX: "Extinta",
        NE: "No evaluada",
        DD: "Datos insuficientes"
    }

    $('#btnNext').on('click', function(){
        if(cargando){
            cargando=true;
            $('btnNext').prop('disabled', true);
            $('btnPrev').prop('disabled', true);
        }

        if($('#nom-animal').text()!=='—') {
            historial.push({
                nombre: $('#nom-animal').text(),
                cientifico: $('#nom-cient').text(),
                img: $('#img-animal').attr("src"),
                desc: $('#desc-an').text(),
                orden:$('#aOrden').text(),
                familia: $('#aFamilia').text(),
                estado: $('#aEstado').text(),
                registros: $('#aRegistros').text(),
                curiosidad: $('#textoCur').text(),
                creditos: $('#creditosFoto').text(),

            })
        }

        if(pool.length === 0){
            let pag = Math.floor(Math.random() * 100)+1;

            $.getJSON("https://api.inaturalist.org/v1/taxa", {
                taxon_id : 3,
                rank: "species",
                is_active: true,
                per_page: 30,
                page: pag,
                all_names: true
            })
            .done(function(data){
                pool = $.grep(data.results || [], function(t){
                    return t.default_photo && t.default_photo.medium_url;
                })

                if(pool.length === 0){
                    $('#btnNext').prop('disabled', false);
                    cargando=false;
                    return;
                }

                let idx;
                do {idx = Math.floor(Math.random() * pool.length);}
                while (pool.length > 1 && pool[idx].id === lastID);

                lastID = pool[idx].id;
                let taxon = pool.splice(idx,1)[0];
                let titulo = taxon.name.replace(/ /g, "—");

                $.getJSON('https://es.wikipedia.org/api/rest_v1/page/summary' + titulo)
                    .done(function(wiki){
                        let frases = (wiki.extract || "").split('. ');
                        let desc = frases.slice(0,3).join('. ') + '.';
                        let curiosidad =frases.slice(3,7).join(". ")+'.';
                        let nombre = taxon.preferred_common_name
                    })
            })
        }
    })

    $("#btnCuriosidad").on('click', function(){
        $("#popUp").addClass("active");
    })

    $("#cerrarPopup").on('click', function(){
        $("#popUp").removeClass("active");
    })

    $("#popUp").on('click', function(e){
        if($(e.target).is("#popUp")) $('#popUp').removeClass('active');
    })





    
});

