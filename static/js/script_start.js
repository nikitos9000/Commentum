var script_start = function(server, load_script) {

    var load_css = function(url) {
        var head = document.getElementsByTagName("head")[0];
        var css = document.createElement("link");

        css.rel = "stylesheet";
        css.type = "text/css";
        css.href = url;
        head.appendChild(css);
    };

    load_css("http://" + server.host + "/" + server.static + "/css/script_style.css");
    load_script("http://" + server.host + "/" + server.static + "/js/script_main.js", function() {
        script_main(server, document.URL, false);
    });
};