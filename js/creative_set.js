(function() {
    "user strict";

    var root = this;
    var domain, arrayIndexOf, targetCreative, extractCreative, loadScript, queryBuilder, scriptLoader;

    root.SatoriCreative = {
        configure: function(obj){
            var self = this;
            root.__SatoriTempConfigureObj = obj;
        }
    };

    if (typeof root.__SatoriInitializedCreativeKeys === "undefined") {
        root.__SatoriInitializedCreativeKeys = [];
    }

    domain = "delivery.satr.jp";

    arrayIndexOf = function(arr, t, i) {
        var len;
        if (arr) {
            if (Array.prototype.indexOf) {
                return Array.prototype.indexOf.call(arr, t, i);
            }
            len = arr.length;
            i = i ? (i < 0 ? Math.max(0, (len + i)) : i) : 0;
            for (; i < len; i++) {
                // Skip accessing in sparse arrays
                if (i in arr && arr[i] === elem) {
                    return i;
                }
            }
        }
        return -1;
    }

    extractCreative = function() {
        var querySelectorAll, len, i, creative_key, immediately;

        querySelectorAll = document.querySelectorAll("#-_-satori_creative-_-");
        len = querySelectorAll.length;
        for (i = len - 1; i >= 0; i--) {
            creative_key = querySelectorAll[i].getAttribute("data-key");
            immediately = querySelectorAll[i].getAttribute("data-immediately");

            if (arrayIndexOf(root.__SatoriInitializedCreativeKeys, creative_key) == -1) {
                return {creative_key: creative_key, immediately: immediately};
            }
        }
    }

    loadScript = function(src, callback) {
        var done = false;
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = src;
        head.appendChild(script);
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if ( !done && (!this.readyState ||
                        this.readyState === "loaded" || this.readyState === "complete") ) {
                done = true;
                callback();

                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode ) {
                    head.removeChild( script );
                }
            }
        };
    };

    getCookie = function(key) {
        var cookieString, cookieKeyArray, i, len, targetCookie, valueIndex;

        cookieString   = document.cookie;
        cookieKeyArray = cookieString.split(";");
        len            = cookieKeyArray.length;

        for (i=0; i < len; i++) {
            targetCookie = cookieKeyArray[i];
            targetCookie = targetCookie.replace(/^\s+|\s+$/g, "");
            valueIndex = targetCookie.indexOf("=");
            if (targetCookie.substring(0, valueIndex) == key) {
                return unescape(targetCookie.slice(valueIndex + 1));
            }
        }

        return "";
    };

    queryBuilder = function(params) {
        var result = [];
        Object.keys(params).forEach(function(key) {
            result.push(key+"="+encodeURIComponent(params[key]))
        });
        return result.join("&");
    };

    params = {
        current_url: document.URL,
        referer_url: document.referrer,
        logging_status: "true",
        st_segs: getCookie("st_segs"),
        st_id: getCookie("satori_id"),
    };

    scriptLoader = function() {
        loadScript("//"+domain+"/creative_set/"+targetCreative.creative_key+"/f.js?"+queryBuilder(params), function() {
            var config = root.__SatoriTempConfigureObj;
            if (typeof config == "object") { SatoriCreative.configure(config); }
            SatoriCreative.start();
        });
    }

    targetCreative = extractCreative();
    if (!targetCreative) {
        return;
    } else {
        root.__SatoriInitializedCreativeKeys.push(targetCreative.creative_key);
    }

    if (targetCreative.immediately === "true") {
        scriptLoader();
    } else {
        document.addEventListener("DOMContentLoaded", function(ev) {
            scriptLoader();
        });
    }

}).call(this)
