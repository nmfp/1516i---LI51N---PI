
(function pingdb(){
    const xhr = new XMLHttpRequest();

    xhr.open('GET', '/user/pingdb', true);

    xhr.send();
})();
