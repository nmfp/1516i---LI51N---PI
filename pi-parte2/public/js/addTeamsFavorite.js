
'use strict';

function addTfav() {
    const group = document.getElementById("groupName").innerText;
    const teamID = document.getElementById("addT").value;
    const league = document.getElementById("league").value;
    const xhr = new XMLHttpRequest();

    if (document.getElementById("noFavs") != null) {
        document.getElementById("noFavs").innerText = "";
    }

    xhr.open('POST', '/favorites/addT/'+group+'/'+league+'/'+teamID, true);

    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let team = JSON.parse(xhr.responseText);

            let div = document.createElement("div");
            div.setAttribute("class", "col-md-4 teamsCSS");

            let h = document.createElement("h2");
            let id = makeID();
            h.setAttribute("id", id);
            let a = document.createElement("a");
            a.setAttribute("href", "/favorites/fixtures/"+league+"/"+teamID+"/"+team["shortName"]+"/"+group);
            a.innerText = team["name"];

            let p1 = document.createElement("p");
            p1.innerText = "Short name: "+team["shortName"];
            let p2 = document.createElement("p");
            p2.innerText = "Value: "+team["squadMarketValue"];

            let img = document.createElement("img");
            img.setAttribute("src", team["crestUrl"]);
            img.setAttribute("width", "100");
            img.setAttribute("height", "100");
            img.setAttribute("class", "imgCSS");

            let divToAdd = document.getElementById("teamFav");
            div.appendChild(h);
            div.appendChild(a);
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(img);
            divToAdd.appendChild(div);
            document.getElementById(id).appendChild(a);
        }
    };

    xhr.send();
}

const arr = 'ABCDEFGH';

function makeID() {
    let text = "";
    for (let i = 0; i < 5; ++i){
        text += arr.charAt(Math.floor(Math.random() * arr.length));
    }
    return text;
}