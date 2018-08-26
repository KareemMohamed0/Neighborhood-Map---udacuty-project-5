//for requiring a script loaded asynchronously.
function loadAsync(src, callback){
    var baseUrl = "./scripts/";
    var script = document.createElement('script');
    script.src = src; 

    script.onerror =  function(err){
        callback(false,`Something went wrong can't load desired script`);
    }
    if(callback !== null){
        if (script.readyState) { // IE, incl. IE9
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback(true, null);
                }
              
            };
        } else {
            script.onload = function() { // Other browsers
                callback(true,null);
            };
        }
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}