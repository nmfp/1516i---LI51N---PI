
'use strict';

function changeTeams() {

    let league = document.getElementById("league").value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/favorites/changeT/'+league, true);

    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let teamsL = JSON.parse(xhr.responseText);

            let select = document.createElement("select");
            select.setAttribute("id", "addT");
            select.setAttribute("onchange", "addTfav()");
            let opt = document.createElement("option");
            opt.setAttribute("selected", "");
            opt.setAttribute("disabled", "");
            opt.setAttribute("hidden", "");
            opt.setAttribute("value", " ");
            select.appendChild(opt);
            for (let i = 0; i< teamsL.length; ++i) {
                let t = teamsL[i];
                let option = document.createElement("option");
                option.setAttribute("value", t["id"]);
                option.innerHTML = t["name"];
                select.appendChild(option);
            }
            let teams = document.getElementById("teams");
            if (document.getElementById("addT") != null) {
                let sel = document.getElementById("addT");
                sel.innerHTML = select.innerHTML;
            } else {
                teams.appendChild(select);
            }
        }
    };

    xhr.send();
}