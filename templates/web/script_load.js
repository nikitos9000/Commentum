(function() {
    var server = {
        host: "{{ server.host }}",
        static: "{{ server.static }}",
        service: "{{ server.service }}"
    };

    var load_script = function(url, result) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");

        script.type = "text/javascript";
        script.src = url;
        script.onload = script.onreadystatechange = function() {
            if ([null, undefined, "loaded", "complete"].indexOf(this.readyState) >= 0) {
                script.onload = script.onreadystatechange = null;
                result();
            }
        };
        head.appendChild(script);
    };

    if (!window.script_start) {
        load_script("http://" + server.host + "/" + server.static + "/js/script_start.js", function() {
            window.script_start(server, load_script);
        });
    }
})();