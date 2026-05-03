
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
            $('#btnNext').prop('disabled', true);
            $('#btnPrev').prop('disabled', true);
            return;
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
                let titulo = taxon.name.replace(/ /g, "_");

                $.getJSON('https://es.wikipedia.org/api/rest_v1/page/summary/' + titulo)
                    .done(function(wiki){
                        let frases = (wiki.extract || "").split('. ');
                        let desc = frases.slice(0,3).join('. ') + '.';
                        let curiosidad =frases.slice(3,7).join(". ")+'.';
                        let nombre = taxon.preferred_common_name
                            ? taxon.preferred_common_name.charAt(0).toUpperCase() + taxon.preferred_common_name.slice(1)
                            : taxon.name;
                        
                        let anc = taxon.ancestors || [];
                        let orden = "—"; 
                        let familia = "—";

                        $.each(anc, function(i,a){
                            if(a.rank === 'order')orden = a.name;
                            if(a.rank === 'family')familia = a.name;
                        })

                        let code = ((taxon.conservation_status && taxon.conservation_status.status) || "NE").toUpperCase();
                        let obs = taxon.observations_count;
                        let obsStr = !obs ? '—' : obs >= 1000000 ? (obs/1000000).toFixed(1)+"M" 
                            : obs >= 1000 ? Math.round(obs/1000)+"K"
                            : String(obs);
                        let attrib = (taxon.default_photo && taxon.default_photo.attribution);

                        $('#nom-animal').text(nombre);
                        $('#nom-cient').text(taxon.name);
                        $('#desc-an').text(desc);
                        $('#aOrden').text(orden);
                        $('#aFamilia').text(familia);
                        $('#aEstado').text(estadoData[code] || code);
                        $('#aRegistros').text(obsStr);
                        $('#creditosFoto').text(attrib ? '©'+attrib.replace(/^\(c\)\s*/i, "").split(",")[0] : '');
                        $('#textoCur').text(curiosidad || 'No hay curiosidades sobre esta especie de momento');

                        let src = (taxon.default_photo.large_url || taxon.default_photo.medium_url);
                        let im = new Image();

                        im.onload = im.onerror = function() {
                            $('#img-animal').attr('src', src);
                            $('#btnNext').prop('disabled', false);
                            $('#btnPrev').prop('disabled', historial.length === 0),
                            cargando = false;
                        }
                        im.src =src;

                    })
            })
        }else {
            let idx = Math.floor(Math.random() * pool.length);
            lastID = pool[idx].id;
            let taxon = pool.splice(idx, 1)[0];
            let titulo = taxon.name.replace(/ /g, "_");

            $.getJSON('https://es.wikipedia.org/api/rest_v1/page/summary/' + titulo)
                .done(function(wiki){
                    let frases = (wiki.extract || "").split('. ');
                    let desc = frases.slice(0,3).join('. ') + '.';
                    let curiosidad =frases.slice(3,7).join(". ")+'.';
                    let nombre = taxon.preferred_common_name
                        ? taxon.preferred_common_name.charAt(0).toUpperCase() + taxon.preferred_common_name.slice(1)
                        : taxon.name;
                    
                    let anc = taxon.ancestors || [];
                    let orden = "—"; 
                    let familia = "—";

                    $.each(anc, function(i,a){
                        if(a.rank === 'order')orden = a.name;
                        if(a.rank === 'family')familia = a.name;
                    })

                    let code = ((taxon.conservation_status && taxon.conservation_status.status) || "NE").toUpperCase();
                    let obs = taxon.observations_count;
                    let obsStr = !obs ? '—' : obs >= 1000000 ? (obs/1000000).toFixed(1)+"M" 
                        : obs >= 1000 ? Math.round(obs/1000)+"K"
                        : String(obs);
                    let attrib = (taxon.default_photo && taxon.default_photo.attribution);

                    $('#nom-animal').text(nombre);
                    $('#nom-cient').text(taxon.name);
                    $('#desc-an').text(desc);
                    $('#aOrden').text(orden);
                    $('#aFamilia').text(familia);
                    $('#aEstado').text(estadoData[code] || code);
                    $('#aRegistros').text(obsStr);
                    $('#creditosFoto').text(attrib ? '©'+attrib.replace(/^\(c\)\s*/i, "").split(",")[0] : '');
                    $('#textoCur').text(curiosidad || 'No hay curiosidades sobre esta especie de momento');

                    let src = (taxon.default_photo.large_url || taxon.default_photo.medium_url);
                    let im = new Image();

                    im.onload = im.onerror = function() {
                        $('#img-animal').attr('src', src);
                        $('#btnNext').prop('disabled', false);
                        $('#btnPrev').prop('disabled', historial.length === 0),
                        cargando = false;
                    }
                    im.src =src;

                })
        }
    })


    $('#btnPrev').on('click', function(){
        if(historial.length === 0) return;

        let s = historial.pop();

        $('#nom-animal').text(s.nombre);
        $('#nom-cient').text(s.cientifico);
        $('#desc-an').text(s.desc);
        $('#aOrden').text(s.orden);
        $('#aFamilia').text(s.familia);
        $('#aEstado').text(s.estado);
        $('#aRegistros').text(s.registros);
        $('#creditosFoto').text(s.creditos);
        $('#textoCur').text(s.curiosidad);

        $('#img-animal').attr('src', s.img).css('opacity', 1);

        $("#btnPrev").prop('disabled', historial.length === 0);
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


    $('#btnNext').trigger('click');




});

