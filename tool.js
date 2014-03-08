// input
var data = {
    teamName: "",
    main: new Array(6), // main attr.
    sub: new Array(6), // sub attr.
    mtype: new Array(6), // main type
    stype: new Array(6), // sub type
    atk: new Array(6),
    askl: new Array(5), // attr. skill
    tskl: new Array(11), // type skill
    enh: new Array(5), // # line enhance in team
    drop: new Array(6), // drop
    line: new Array(5), // # lines in drops
    baseEnh: 1, // base enhance rate

    mdmg: new Array(6), // main attr. damage
    sdmg: new Array(6), // sub attr. damage
    admg: new Array(6), // each attr's damage
};

var colorNames = ['red', 'blue', 'green', 'yellow', 'purple'];

var storage = window.localStorage;

function boot () {
    for (var i = 0; i < 6; i++) {
        data.drop[i] = new Array(10);
    }

    // save & load
    if (!storage) {
        $("#save_container").remove();
    } else {
        updateTeamlist();
    }

    // Attribute selector
    var selector = $("<select></select>");
    selector.append('<option value="-1"></option>');
    selector.append('<option value="0">火</option>');
    selector.append('<option value="1">水</option>');
    selector.append('<option value="2">木</option>');
    selector.append('<option value="3">光</option>');
    selector.append('<option value="4">闇</option>');
    selector.change(updateDmg);

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
    tselector.change(updateDmg);

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
        $(this).change(updateDmg);
    });
}


function updateDmg () {
    // read input values
    for (var i = 0; i < 6; i++) {
        data.main[i] = parseInt($("#main" + i).val());
        data.sub[i] = parseInt($("#sub" + i).val());
        data.atk[i] = parseInt($("#atk" + i).val());
        if (isNaN(data.atk[i])) { data.atk[i] = 0; }
        data.mtype[i] = parseInt($("#mtype" + i).val());
        data.stype[i] = parseInt($("#stype" + i).val());
        data.askl[i] = parseInt($("#skl" + i).val());
        if (isNaN(data.askl[i])) { data.askl[i] = 1; }
        for (var j = 0; j < 10; j++) {
            data.drop[i][j] = parseInt($("#drop" + i + j).val());
            if (isNaN(data.drop[i][j])) { data.drop[i][j] = 0; }
        }
    }

    for (var i = 0; i < 11; i++) {
        data.tskl[i] = parseInt($("#skl" + (i + 5)).val());
        if (isNaN(data.tskl[i])) { data.tskl[i] = 1; }
    }

    for (var i = 0; i < 5; i++) { 
        data.admg[i] = 0;
        data.enh[i] = parseInt($("#enh" + i).val());
        if (isNaN(data.enh[i])) { data.enh[i] = 0; }
        data.line[i] = 0;
        for (var j = 0; j < 10; j++) {
            if ($("#enh" + i + j).prop('checked')) {
                data.line[i]++;
            }
        }
    }

    data.baseEnh =  parseFloat($("#skl").val());
    if (isNaN(data.baseEnh)) { data.baseEnh = 1; }

    // Calculate damages and set them to output variables
    calc();

    // set results to <input>
    for (var i = 0; i < 6; i++) {
        if (isNaN(data.mdmg[i])) { data.mdmg[i] = ''; };
        if (isNaN(data.sdmg[i])) { data.sdmg[i] = ''; };
        
        $("#mdmg" + i).text(data.mdmg[i]);
        $("#sdmg" + i).text(data.sdmg[i]);
    }
    for (var i = 0; i < 5; i++) {
        $("#admg" + i).text(data.admg[i]);
    }
    $("#admg5").text(data.totalDmg);

    // change sel color
    updateCellColor();
}

function updateCellColor() {
        for (var i = 0; i < 6; i++) {
        $("td.mtd" + (i + 1)).each(function () {
            $(this).attr("class", "mtd" + (i + 1) + " bg_" + attr2colorName(data.main[i]));
        });
       $("td.std" + (i + 1)).each(function () {
            $(this).attr("class", "std" + (i + 1) + " bg_" + attr2colorName(data.sub[i]));
        }); 
    }
}

function calc() {
        // count combo
    var combo = 0;
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 10; j++) {
            if (data.drop[i][j] >= 3) {
                combo++;
            }
        }
    }
    
    for (var i = 0; i < 6; i++) {
        var mbase = 0, sbase = 0;
        data.mdmg[i] = 0;
        data.sdmg[i] = 0;
        
        var k = data.main[i];
        if (k >= 0 && data.atk[i] > 0) {
            for (var j = 0; j < 10; j++) {
                if (data.drop[k][j] >= 3) {
                    mbase += data.atk[i] * (1 + 0.25 * (data.drop[k][j] - 3));
                }
            }
            data.mdmg[i] = mbase * (1 + (combo - 1) * 0.25);
            data.mdmg[i] *= data.askl[k];
            if (data.sub[i] >= 0 && k != data.sub[i]) {
                data.mdmg[i] *= data.askl[data.sub[i]];
            }
            if (data.mtype[i] >= 0) {
                data.mdmg[i] *= data.tskl[data.mtype[i]];
            }
            if (data.stype[i] >= 0) {
                data.mdmg[i] *= data.tskl[data.stype[i]];
            }
            data.mdmg[i] *= 1 + 0.1 * data.enh[k] * data.line[k];
            data.mdmg[i] = Math.round(data.mdmg[i] * data.baseEnh);
            
            data.admg[k] += data.mdmg[i];
        }

        k = data.sub[i];
        if (k >= 0 && data.atk[i]) {
            var scale = 0.3;
            if (data.main[i] === data.sub[i]) {
                scale = 0.1;
            }
            for (var j = 0; j < 10; j++) {
                if (data.drop[k][j] >= 3) {
                    sbase += scale * data.atk[i] * (1 + 0.25 * (data.drop[k][j] - 3));
                }
            }
            data.sdmg[i] = sbase * (1 + (combo - 1) * 0.25);
            data.sdmg[i] *= data.askl[k];
            if (data.main[i] >= 0 && k != data.main[i]) {
                data.sdmg[i] *= data.askl[data.main[i]];
            }
            if (data.mtype[i] >= 0) {
                data.sdmg[i] *= data.tskl[data.mtype[i]];
            }
            if (data.stype[i] >= 0) {
                data.sdmg[i] *= data.tskl[data.stype[i]];
            }
            data.sdmg[i] *= 1 + 0.1 * data.enh[k] * data.line[k];
            data.sdmg[i] = Math.round(data.sdmg[i] * data.baseEnh);
            
            data.admg[k] += data.sdmg[i];
        }
    }

    data.totalDmg = 0;
    for (var i = 0; i < 5; i++) {
        data.admg[i] = Math.round(data.admg[i]);
        data.totalDmg += data.admg[i];
    }
}

function attr2colorName (att) {
    var res;
    att = Math.floor(att);
    if (att >= 0 && att < 5) {
        res = colorNames[att];
    }
    return res;
}

function save () {
    if (!storage) { return; }

    data.teamName = $("#team_name").val().substr(0, 100);

    var teams = storage.getItem('teams');
    teams = JSON.parse(teams);
    if (!teams) {
        teams = [data.teamName];
    } else {
        if ($.inArray(data.teamName, teams) < 0) {            
            teams.push(data.teamName);
        }
    }

    var obj = {
        main: data.main,
        sub: data.sub,
        mtype: data.mtype,
        stype: data.stype,
        atk: data.atk,
        baseEnh: data.baseEnh,
        askl: data.askl,
        tskl: data.tskl,
        enh: data.enh
    };

    storage.setItem('_' + data.teamName, JSON.stringify(obj));
    storage.setItem('teams', JSON.stringify(teams));

    console.log('Team "' + data.teamName + '" saved');

    updateTeamlist();
 }

function load() {
    if (!storage) { return; }

    var n = $('input[name="team"]:checked').val();
    if (n >= 0) {
        var teams = JSON.parse(storage.getItem('teams'));
        var obj = JSON.parse(storage.getItem('_' + teams[n]));
        data.main = obj.main;
        data.sub = obj.sub;
        data.mtype = obj.mtype;
        data.stype = obj.stype;
        data.atk = obj.atk;
        data.baseEnh = obj.baseEnh;
        data.askl = obj.askl;
        data.tskl = obj.tskl;
        data.enh = obj.enh;
    }

    updateInputForm();
    updateDmg();
}

function del() {
    if (!storage) { return; }

    var n = $('input[name="team"]:checked').val();
    if (n >= 0) {
        var teams = JSON.parse(storage.getItem('teams'));
        storage.removeItem('_' + teams[n]);
        teams = $.grep(teams, function(a) {return a !== teams[n];});
        storage.setItem('teams', JSON.stringify(teams));
    }

    updateTeamlist();    
}

function updateTeamlist () {
    if (!storage) { return; }

    var teams = JSON.parse(storage.getItem('teams'));

    if (!$.isArray(teams)) { return; }

    var div = $("#teamlist");
    var ul = $("<ul style='list-style-type:none'></ul>");

    for (var i = 0; i < teams.length; i++) {
        var li = $("<li></li>");
        li.append('<input type="radio" name="team" value=' + i + '>' + teams[i] + '</input>');
        ul.append(li);
    }

    div.empty();
    div.append(ul);
}

function updateInputForm() {
    // team name
    $("#team_name").val(data.teamName);

    // monster info
    for (var i = 0; i < 6; i++) {
        $("#main" + i).val(data.main[i]);
        $("#sub" + i).val(data.sub[i]);
        $("#mtype" + i).val(data.mtype[i]);
        $("#stype" + i).val(data.stype[i]);
        $("#atk" + i).val(data.atk[i]);
    }

    // enhance
    if (data.baseEnh === 1) {
        $("#skl").val("");        
    } else {
       $("#skl").val(data.baseEnh);
    }
    for (var i = 0; i < 5; i++) {
        if (data.askl[i] === 1) {
            $("#skl" + i).val("");
        } else {
            $("#skl" + i).val(data.askl[i]);
        }
    }
    for (var i = 0; i < 11; i++) {
        if (data.tskl[i] === 1) {
            $("#skl" + (i + 5)).val("");
        } else {
            $("#skl" + (i + 5)).val(data.tskl[i]);           
        }
    }

    // # line enh
    for (var i = 0; i < 5; i++) {
        $("#enh" + i).val(data.enh[i]);
    }

    updateCellColor();
}
