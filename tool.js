// input
var main, sub, atk, enh, drop, line, mtype, stype, tskl, askl, baseEnh;

// output div
var mdmg, sdmg, admg;

function boot () {
    main = new Array(6); // main attr
    sub = new Array(6); // sub attr
    atk = new Array(6); // attack
    mtype = new Array(6); // main type
    stype = new Array(6); // sub type
    enh = new Array(5); // line enhance
    drop = new Array(6);
    line = new Array(5);
    mdmg = new Array(6); // main attr. damage
    sdmg = new Array(6); // sub attr. damage
    admg = new Array(6); // each attr's damage
    askl = new Array(5); // attr skill
    tskl = new Array(11); // type skill
    baseEnh = 1;
    for (var i = 0; i < 6; i++) {
        drop[i] = new Array(10);
    }

    // Attribute selector
    var selector = $("<select></select>");
    selector.append('<option value="-1"></option>');
    selector.append('<option value="0">火</option>');
    selector.append('<option value="1">水</option>');
    selector.append('<option value="2">木</option>');
    selector.append('<option value="3">光</option>');
    selector.append('<option value="4">闇</option>');
    selector.change(calc);

    for (var i = 0; i < 6; i++) {
        var m = $("#_main" + i);
        var s = $("#_sub" + i);

        var mainSel = selector.clone(true);
        var subSel = selector.clone(true);
        mainSel.attr('id', 'main' + i);
        subSel.attr('id', 'sub' + i);

        m.append(mainSel);
        s.append(subSel);
    }

    // Type selector
    var tselector = $("<select></select>");
    tselector.append('<option value="-1"></option>');
    tselector.append('<option value="0">神</option>');
    tselector.append('<option value="1">ドラゴン</option>');
    tselector.append('<option value="2">悪魔</option>');
    tselector.append('<option value="3">バランス</option>');
    tselector.append('<option value="4">攻撃</option>');
    tselector.append('<option value="5">体力</option>');
    tselector.append('<option value="6">回復</option>');
    tselector.append('<option value="7">進化用</option>');
    tselector.append('<option value="8">能力覚醒</option>');
    tselector.append('<option value="9">強化合成</option>');
    tselector.append('<option value="10">特別保護</option>');
    tselector.change(calc);

    for (var i = 0; i < 6; i++) {
        var m = $("#_mtype" + i);
        var s = $("#_stype" + i);

        var mainSel = tselector.clone(true);
        var subSel = tselector.clone(true);
        mainSel.attr('id', 'mtype' + i);
        subSel.attr('id', 'stype' + i);

        m.append(mainSel);
        s.append(subSel);
    }

    $("input").each(function () {
        $(this).change(calc);
    });
}


function calc () {
    for (var i = 0; i < 6; i++) {
        main[i] = parseInt($("#main" + i).val());
        sub[i] = parseInt($("#sub" + i).val());
        atk[i] = parseInt($("#atk" + i).val());
        if (isNaN(atk[i])) { atk[i] = 0; }
        mtype[i] = parseInt($("#mtype" + i).val());
        stype[i] = parseInt($("#stype" + i).val());
        askl[i] = parseInt($("#skl" + i).val());
        if (isNaN(askl[i])) { askl[i] = 1; }
        for (var j = 0; j < 10; j++) {
            drop[i][j] = parseInt($("#drop" + i + j).val());
            if (isNaN(drop[i][j])) { drop[i][j] = 0; }
        }
    }

    for (var i = 0; i < 11; i++) {
        tskl[i] = parseInt($("#skl" + (i + 5)).val());
        if (isNaN(tskl[i])) { tskl[i] = 1; }
    }

    for (var i = 0; i < 5; i++) {
        admg[i] = 0;
        enh[i] = parseInt($("#enh" + i).val());
        if (isNaN(enh[i])) { enh[i] = 0; }
        line[i] = 0;
        for (var j = 0; j < 10; j++) {
            if ($("#enh" + i + j).prop('checked')) {
                line[i]++;
            }
        }
    }

    baseEnh =  parseInt($("#skl").val());
    if (isNaN(baseEnh)) { baseEnh = 1; }

    // count combo
    var combo = 0;
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 10; j++) {
            if (drop[i][j] >= 3) {
                combo++;
            }
        }
    }
    
    for (var i = 0; i < 6; i++) {
        var mbase = 0, sbase = 0;
        mdmg[i] = 0;
        sdmg[i] = 0;
        
        var k = main[i];
        if (k >= 0 && atk[i] > 0) {
            for (var j = 0; j < 10; j++) {
                if (drop[k][j] >= 3) {
                    mbase += atk[i] * (1 + 0.25 * (drop[k][j] - 3));
                }
            }
            mdmg[i] = mbase * (1 + (combo - 1) * 0.25);
            mdmg[i] *= askl[k];
            if (sub[i] >= 0 && k != sub[i]) {
                mdmg[i] *= askl[sub[i]];
            }
            if (mtype[i] >= 0) {
                mdmg[i] *= tskl[mtype[i]];
            }
            if (stype[i] >= 0) {
                mdmg[i] *= tskl[stype[i]];
            }
            mdmg[i] *= 1 + 0.1 * enh[k] * line[k];
            mdmg[i] = Math.round(mdmg[i] * baseEnh);
            
            admg[k] += mdmg[i];
        }

        k = sub[i];
        if (k >= 0 && atk[i]) {
            var scale = 0.3;
            if (main[i] === sub[i]) {
                scale = 0.1;
            }
            for (var j = 0; j < 10; j++) {
                if (drop[k][j] >= 3) {
                    sbase += scale * atk[i] * (1 + 0.25 * (drop[k][j] - 3));
                }
            }
            sdmg[i] = sbase * (1 + (combo - 1) * 0.25);
            sdmg[i] *= askl[k];
            if (main[i] >= 0 && k != main[i]) {
                sdmg[i] *= askl[main[i]];
            }
            if (mtype[i] >= 0) {
                sdmg[i] *= tskl[mtype[i]];
            }
            if (stype[i] >= 0) {
                sdmg[i] *= tskl[stype[i]];
            }
            sdmg[i] *= 1 + 0.1 * enh[k] * line[k];
            sdmg[i] = Math.round(sdmg[i] * baseEnh);
            
            admg[k] += sdmg[i];
        }

        if (isNaN(mdmg[i])) { mdmg[i] = ''; };
        if (isNaN(sdmg[i])) { sdmg[i] = ''; };
        
        $("#mdmg" + i).text(mdmg[i]);
        $("#sdmg" + i).text(sdmg[i]);
    }

    var totalDmg = 0;
    for (var i = 0; i < 5; i++) {
        admg[i] = Math.round(admg[i]);
        totalDmg += admg[i];
        $("#admg" + i).text(admg[i]);
    }
    $("#admg5").text(totalDmg);
}
