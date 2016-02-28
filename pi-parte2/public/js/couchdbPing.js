
(function pingdb(){
    const xhr = new XMLHttpRequest();

    xhr.open('GET', '/favorites/pingdb', true);

    xhr.send();
})();