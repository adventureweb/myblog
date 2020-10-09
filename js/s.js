(function() {

    "use strict";
    var root = this;

    var collectFunc = function() {

        var targetEndpoint = root._st_tag_endpoint;

        setTimeout(function() {
            if (!Array.prototype.some) {
                Array.prototype.some = function(fun /*, thisp */) {

                    if (this == null) throw new TypeError();

                    var t = Object(this),
                    len = t.length >>> 0;

                    if (typeof fun != "function") throw new TypeError();

                    var thisp = arguments[1];

                    for (var i = 0; i < len; i++) {
                        if (i in t && fun.call(thisp, t[i], i, t))
                            return true;
                    }

                    return false;
                };
            }

            if (!Object.keys) {
                Object.keys = (function () {
                    var hasOwnProperty = Object.prototype.hasOwnProperty,
                    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                    dontEnums = [
                        'toString',
                        'toLocaleString',
                        'valueOf',
                        'hasOwnProperty',
                        'isPrototypeOf',
                        'propertyIsEnumerable',
                        'constructor'
                    ],
                    dontEnumsLength = dontEnums.length

                        return function (obj) {
                            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

                                var result = []

                                    for (var prop in obj) {
                                        if (hasOwnProperty.call(obj, prop)) result.push(prop)
                                    }

                            if (hasDontEnumBug) {
                                for (var i=0; i < dontEnumsLength; i++) {
                                    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
                                }
                            }
                            return result
                        }
                })();
            };

            // Production steps of ECMA-262, Edition 5, 15.4.4.18
            // Reference: http://es5.github.com/#x15.4.4.18
            if ( !Array.prototype.forEach ) {
                Array.prototype.forEach = function( callback, thisArg ) {

                    var T, k;

                    if ( this == null ) {
                        throw new TypeError( " this is null or not defined" );
                    }

                    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
                    var O = Object(this);

                    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
                    // 3. Let len be ToUint32(lenValue).
                    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

                    // 4. If IsCallable(callback) is false, throw a TypeError exception.
                    // See: http://es5.github.com/#x9.11
                    if ( {}.toString.call(callback) != "[object Function]" ) {
                        throw new TypeError( callback + " is not a function" );
                    }

                    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if ( thisArg ) {
                        T = thisArg;
                    }

                    // 6. Let k be 0
                    k = 0;

                    // 7. Repeat, while k < len
                    while( k < len ) {

                        var kValue;

                        // a. Let Pk be ToString(k).
                        //   This is implicit for LHS operands of the in operator
                        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                        //   This step can be combined with c
                        // c. If kPresent is true, then

                        if ( k in O ) {

                            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                            kValue = O[ k ];

                            // ii. Call the Call internal method of callback with T as the this value and
                            // argument list containing kValue, k, and O.
                            callback.call( T, kValue, k, O );
                        }
                        // d. Increase k by 1.
                        k++;
                    }
                    // 8. return undefined
                };
            }

            var getRootDomain = function(domain) {
                var result, sld;
                try {
                    if (domain) {
                        sld = domain.match(/(?:([^\.]+)\.[^\.]+$)/)[1];
                        if (sld.match(/(?:^(?:co|or|gr|ne|go|lg|ac|ed|ad)$)/i)) {
                            result = domain.match(/(?:(?:[^\.]+\.){2}[^\.]+$)/)[0];
                        } else if (domain.match(/(?:\.(?:jpn\.com|jp\.net)$)/)) {
                            result = domain.match(/(?:(?:[^\.]+\.){2}[^\.]+$)/)[0];
                        } else if (domain.match(/(?:\.(?:hachinohe\.aomori\.jp)$)/)) {
                            result = domain.match(/(?:(?:[^\.]+\.){3}[^\.]+$)/)[0];
                        } else {
                            result = domain.match(/(?:[^\.]+\.[^\.]+$)/)[0];
                        }
                        return result;
                    }
                } catch (exception) {
                    return domain;
                }
            }

            var setCookie = function(name, value, domain, path, expires) {
                var str, nowtime;
                if (!name) return;

                str = name + "=" + value;
                if (domain) {
                    if (domain == 1) domain = location.hostname.replace(/^[^\.]*/, "");
                    str += "; domain=" + domain;
                }
                if (path) {
                    if (path == 1) path = location.pathname;
                    str += "; path=" + path;
                }
                if (expires) {
                    nowtime = new Date().getTime();
                    expires = new Date(nowtime + (60 * 60 * 24 * 1000 * expires));
                    expires = expires.toGMTString();
                    str += "; expires=" + expires;
                }

                str += "; SameSite=None"

                if (location.protocol == "https:") {
                    str += "; Secure";
                }

                document.cookie = str;
            }

            var setLocalStorage = function(name, value) {
                if (!name) return;
                localStorage.setItem(name, value);
            };

            var getCookie = function(key) {
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

            var uriParse = function(url) {

                var parser = document.createElement('a'),
                protocol,
                parameters = {},
                pathname,
                queries, split, i;

                // Let the browser do the work
                parser.href = url;

                protocol = parser.protocol;
                if (protocol === ":" || protocol === "" || typeof protocol === "undefined") {
                    protocol = location.protocol;
                }

                // Convert query string to object
                queries = parser.search.replace(/^\?/, '').split('&');
                for( i = 0; i < queries.length; i++ ) {
                    split = queries[i].split('=');
                    parameters[split[0]] = split[1];
                }

                pathname = parser.pathname;

                if (!pathname.match(/^\/.*$/)) {
                    pathname = "/" + parser.pathname;
                }

                return {
                    protocol: protocol,
                    host: parser.host,
                    hostname: parser.hostname,
                    port: parser.port,
                    pathname: pathname,
                    search: parser.search,
                    parameters: parameters,
                    hash: parser.hash
                };
            };

            var uriBuild = function(urlObj) {
                var u = urlObj;

                var p = function () {
                    var result = [];
                    Object.keys(u.parameters).forEach(function(key) {
                        if (typeof key !== "undefined" && key !== null && key !== "") {
                            var v = u.parameters[key];
                            if (typeof v === "undefined" && v === null) { v = ""; }
                            result.push(key+"="+v);
                        }
                    });
                    return result.join("&");
                }
                return u.protocol +"//"+u.hostname+u.pathname+"?"+p()+u.hash;
            }

            var _atatchAdditionalParams = function(url) {
                var _url, _resultStr, params;

                _url = uriParse(url);
                _resultStr = "";

                if (typeof StDmp === "object" && typeof StDmp.additionalParams === "object") {
                    Object.keys(StDmp.additionalParams).forEach(function(key) {
                        _url.parameters[key] = (StDmp.additionalParams[key]);
                    });
                    return uriBuild(_url);
                } else {
                    return url
                }
            };

            var _setCookieFromObject = function(data) {
                if (typeof data === "undefined") { return; }
                var domain, name, value, path, expires, secure;

                domain = getRootDomain(uriParse(document.URL).hostname);
                name = data.name;
                value = data.value;
                path = "/";
                expires = data.expires;
                setCookie(name, value, domain, path, expires);
            };

            var _setLocalStorageFromObject = function(data) {
                if (typeof data === "undefined") { return; }
                var name, value;
                name = data.name;
                value = data.value;

                setLocalStorage(name, value);
            };

            var getStID = function(storeObj) {
                var _stid   = localStorage.satori_id;

                if (_stid === "" || typeof _stid === "undefined") {
                    _stid   = getCookie("satori_id");
                }

                if (_stid === "" || typeof _stid === "undefined") {
                    if (typeof storeObj === "object")  { _stid = storeObj.stid; }
                }

                if (typeof _stid === "undefined") { _stid = ""; }
                return _stid;
            }

            var getOptOut = function (storeObj) {
                var _optout = getCookie("optout");
                if (typeof storeObj === "object") {
                    if (_optout === "") { _optout = storeObj.optout; }
                }
                return _optout;
            }
            var _encodeUri = function(url) {
                var _url = url;
                if (_url.match(/[^\x01-\x7E]/)) {
                    _url = encodeURI(_url);
                }
                return encodeURIComponent(encodeURI(_url.replace(/\+/g, '%2B')));
            };

            var isFirstDefaultDmp = true
            var defaultDmp = function(storeObj) {
                var _url = (function() {
                    var result;
                    if (typeof targetEndpoint === "undefined") {
                        result = uriParse(document.getElementById("_-s-js-_").getAttribute("src"));
                    } else {
                        result = uriParse(targetEndpoint);
                    }
                    return result;

                }).call();

                var _pd   = _url.protocol+"//"+_url.host,
                _ti   = _url.parameters.c,
                _ifr  = document.createElement("iframe"),
                _stid = getStID(storeObj),
                _optout = getOptOut(storeObj),
                _r = _encodeUri(document.referrer),
                _c = _encodeUri(_atatchAdditionalParams(document.URL));

                _ifr.style.width  = "1px";
                _ifr.style.height = "1px";
                _ifr.style.display = "none";
                _ifr.setAttribute(
                        'src',
                        _pd+"/s?cu="+_c+"&ru="+_r+"&c="+_ti+"&stid="+_stid+"&optout="+_optout);

                var messageListener = function(evt) {

                    var _pdUri, _originUri, cookieData, stSegs;

                    _pdUri = uriParse(_pd);
                    _originUri = uriParse(evt.origin);

                    if (_pdUri.protocol === _originUri.protocol && _pdUri.hostname === _originUri.hostname && isFirstDefaultDmp === true) {
                        isFirstDefaultDmp = false;

                        if (evt.data === null) {
                            if (typeof StDmp === "object" && typeof StDmp.afterFunc === "function") {
                                StDmp.afterFunc();
                            }
                            return;
                        }

                        try {
                            cookieData = JSON.parse(evt.data);
                        } catch(exception) {
                            //JSON exception
                        }

                        if (typeof cookieData === "undefined") { return; }

                        _setCookieFromObject(cookieData.stId);
                        _setCookieFromObject(cookieData.stSegs);

                        _setLocalStorageFromObject(cookieData.stId);
                        _setLocalStorageFromObject(cookieData.stSegs);

                        if (typeof StDmp === "object" && typeof StDmp.afterFunc === "function") {
                            stSegs = cookieData.stSegs || {};
                            if (typeof stSegs.value === "string") {
                                stSegs.value = stSegs.value.split(",");
                            }
                            StDmp.afterFunc(stSegs.value);
                        }
                    }
                }
                if (window.addEventListener) {
                    window.addEventListener("message", messageListener, false);
                } else {
                    window.attachEvent("onmessage", messageListener);
                }

                document.body.appendChild(_ifr);
                var onloadListener = function() {
                    _ifr.contentWindow.postMessage("SATR", _pd);
                };
                if (_ifr.attachEvent) {
                    _ifr.attachEvent("onload", onloadListener);
                } else {
                    _ifr.onload = onloadListener;
                }
            }

            var isFirst = true;

            var beforeDmp = function() {
                var _url, _pd, _ifr, _pdUri, _originUri, storeObj;

                _url = (function() {
                    var result;
                    if (typeof targetEndpoint === "undefined") {
                        result = uriParse(document.getElementById("_-s-js-_").getAttribute("src"));
                    } else {
                        result = uriParse(targetEndpoint);
                    }
                    return result;

                }).call();

                _pd  = _url.protocol+"//"+_url.host;
                _ifr = document.createElement("iframe");

                _ifr.style.width  = "1px";
                _ifr.style.height = "1px";
                _ifr.style.display = "none";
                _ifr.setAttribute('src', _pd+"/s_inner.html");

                var messageListener = function(evt) {
                _pdUri = uriParse(_pd);
                _originUri = uriParse(evt.origin);
                if (_pdUri.protocol === _originUri.protocol && _pdUri.hostname === _originUri.hostname && !!isFirst) {

                    isFirst = false;
                        storeObj = JSON.parse(evt.data);
                        defaultDmp(storeObj);
                    }
                }

                if (window.addEventListener) {
                    window.addEventListener("message", messageListener, false);
                } else {
                    window.attachEvent("onmessage", messageListener);
                }

                document.body.appendChild(_ifr);
                _ifr.onload = function() {
                    _ifr.contentWindow.postMessage("SATR", _pd);
                };
            }

            //entry
            var main = function() {
                beforeDmp();
            }

            main.call();
        }, 0);

        return true;
    };

    root.StSegs = {};
    root.StSegs.execute = collectFunc;

    if (!(
                typeof StDmp === "object" &&
                (StDmp.delay === true || StDmp.suppressAutoExec === true)
         )) { collectFunc.call(); }

}).call(this);
