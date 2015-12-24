var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    for(var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a;
      a in e.pathToNames || (e.pathToNames[a] = {});
      e.pathToNames[a][d] = true
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {});
      e.requires[a][b] = true
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = true;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return typeof a != "undefined" && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;b >= 0;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = d == -1 ? c.length : d;
        if(c.substr(d - 7, 7) == "base.js") {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = true)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>');
    return true
  }
  return false
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited)) {
        d.visited[e] = true;
        if(e in d.requires) {
          for(var g in d.requires[e]) {
            if(!goog.isProvided_(g)) {
              if(g in d.nameToPath) {
                a(d.nameToPath[g])
              }else {
                throw Error("Undefined nameToPath for " + g);
              }
            }
          }
        }
      }
      if(!(e in c)) {
        c[e] = true;
        b.push(e)
      }
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  var b = typeof a;
  return b == "object" && a != null || b == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(arguments.length > 2) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global._et_ != "undefined") {
          delete goog.global._et_;
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = false;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    for(var a = a.split("-"), b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = false, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = true
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
var commentum = {utils:{}};
commentum.utils.foreach = function(a, b) {
  if(a instanceof Array) {
    for(var c = 0;c < a.length;++c) {
      b(a[c])
    }
  }else {
    for(c in a) {
      a.hasOwnProperty(c) && b(c, a[c])
    }
  }
};
commentum.utils.bind = function(a, b, c) {
  return function() {
    return a.apply(b || this, c || arguments)
  }
};
commentum.utils.apply = function(a, b) {
  return function() {
    var c = a();
    return c && c.apply(b || this, arguments)
  }
};
commentum.utils.empty = function(a) {
  if(a instanceof Array) {
    return 0 == a.length
  }
  if(a instanceof Object) {
    for(var b in a) {
      if(a[b]) {
        return!1
      }
    }
  }
  return!0
};
commentum.settings = {};
commentum.settings.host = "example.com";
commentum.settings.path = "service";
commentum.settings.post = !0;
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d, a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && (b < a.length && 0 < c) && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", i = e[g] || "", j = RegExp("(\\d*)(\\D*)", "g"), k = RegExp("(\\d*)(\\D*)", "g");
    do {
      var m = j.exec(h) || ["", "", ""], l = k.exec(i) || ["", "", ""];
      if(0 == m[0].length && 0 == l[0].length) {
        break
      }
      var c = 0 == m[1].length ? 0 : parseInt(m[1], 10), n = 0 == l[1].length ? 0 : parseInt(l[1], 10), c = goog.string.compareElements_(c, n) || goog.string.compareElements_(0 == m[2].length, 0 == l[2].length) || goog.string.compareElements_(m[2], l[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.lastIndexOf(b, c)
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var i = g[h];
      b.call(c, i, h, a) && (e[f++] = i)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var i = f + g >> 1, j;
    j = c ? b.call(e, a[i], i, a) : b(d, a[i]);
    0 < j ? f = i + 1 : (g = i, h = !j)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  for(var b = b || goog.array.defaultCompare, d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  for(var d = a.length, c = c || goog.array.defaultCompareEquality, e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  for(var c = c || goog.array.defaultCompare, d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && !(a = a[d[c]], !goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.structs = {};
goog.structs.getCount = function(a) {
  return"function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
  if("function" == typeof a.getValues) {
    return a.getValues()
  }
  if(goog.isString(a)) {
    return a.split("")
  }
  if(goog.isArrayLike(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
  if("function" == typeof a.getKeys) {
    return a.getKeys()
  }
  if("function" != typeof a.getValues) {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return goog.object.getKeys(a)
  }
};
goog.structs.contains = function(a, b) {
  return"function" == typeof a.contains ? a.contains(b) : "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
  return"function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c)
    }else {
      for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a)
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if("function" == typeof a.filter) {
    return a.filter(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      b.call(c, f[h], e[h], a) && (d[e[h]] = f[h])
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      b.call(c, f[h], void 0, a) && d.push(f[h])
    }
  }
  return d
};
goog.structs.map = function(a, b, c) {
  if("function" == typeof a.map) {
    return a.map(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      d[e[h]] = b.call(c, f[h], e[h], a)
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      d[h] = b.call(c, f[h], void 0, a)
    }
  }
  return d
};
goog.structs.some = function(a, b, c) {
  if("function" == typeof a.some) {
    return a.some(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(b.call(c, e[g], d && d[g], a)) {
      return!0
    }
  }
  return!1
};
goog.structs.every = function(a, b, c) {
  if("function" == typeof a.every) {
    return a.every(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(!b.call(c, e[g], d && d[g], a)) {
      return!1
    }
  }
  return!0
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this
};
goog.iter.toIterator = function(a) {
  if(a instanceof goog.iter.Iterator) {
    return a
  }
  if("function" == typeof a.__iterator__) {
    return a.__iterator__(!1)
  }
  if(goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for(;;) {
        if(b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if(b in a) {
          return a[b++]
        }
        b++
      }
    };
    return c
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if(goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c)
    }catch(d) {
      if(d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }else {
    a = goog.iter.toIterator(a);
    try {
      for(;;) {
        b.call(c, a.next(), void 0, a)
      }
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var d = goog.iter.toIterator(a), a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = d.next();
      if(b.call(c, a, void 0, d)) {
        return a
      }
    }
  };
  return a
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  1 < arguments.length && (d = a, e = b);
  if(0 == f) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if(f > 0 && d >= e || f < 0 && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d = d + f;
    return a
  };
  return g
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
  var d = goog.iter.toIterator(a), a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = d.next();
      return b.call(c, a, void 0, d)
    }
  };
  return a
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a)
  });
  return e
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(b.call(c, a.next(), void 0, a)) {
        return!0
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!1
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(!b.call(c, a.next(), void 0, a)) {
        return!1
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!0
};
goog.iter.chain = function(a) {
  var b = arguments, c = b.length, d = 0, e = new goog.iter.Iterator;
  e.next = function() {
    try {
      if(d >= c) {
        throw goog.iter.StopIteration;
      }
      return goog.iter.toIterator(b[d]).next()
    }catch(a) {
      if(a !== goog.iter.StopIteration || d >= c) {
        throw a;
      }
      d++;
      return this.next()
    }
  };
  return e
};
goog.iter.dropWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a), a = new goog.iter.Iterator, e = !0;
  a.next = function() {
    for(;;) {
      var a = d.next();
      if(!e || !b.call(c, a, void 0, d)) {
        return e = !1, a
      }
    }
  };
  return a
};
goog.iter.takeWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a), a = new goog.iter.Iterator, e = !0;
  a.next = function() {
    for(;;) {
      if(e) {
        var a = d.next();
        if(b.call(c, a, void 0, d)) {
          return a
        }
        e = !1
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return a
};
goog.iter.toArray = function(a) {
  if(goog.isArrayLike(a)) {
    return goog.array.toArray(a)
  }
  var a = goog.iter.toIterator(a), b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a)
  });
  return b
};
goog.iter.equals = function(a, b) {
  var a = goog.iter.toIterator(a), b = goog.iter.toIterator(b), c, d;
  try {
    for(;;) {
      c = d = !1;
      var e = a.next();
      c = !0;
      var f = b.next();
      d = !0;
      if(e != f) {
        break
      }
    }
  }catch(g) {
    if(g !== goog.iter.StopIteration) {
      throw g;
    }
    if(c && !d) {
      return!1
    }
    if(!d) {
      try {
        b.next()
      }catch(h) {
        if(h !== goog.iter.StopIteration) {
          throw h;
        }
        return!0
      }
    }
  }
  return!1
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next()
  }catch(c) {
    if(c != goog.iter.StopIteration) {
      throw c;
    }
    return b
  }
};
goog.iter.product = function(a) {
  if(goog.array.some(arguments, function(a) {
    return!a.length
  }) || !arguments.length) {
    return new goog.iter.Iterator
  }
  var b = new goog.iter.Iterator, c = arguments, d = goog.array.repeat(0, c.length);
  b.next = function() {
    if(d) {
      for(var a = goog.array.map(d, function(a, b) {
        return c[b][a]
      }), b = d.length - 1;0 <= b;b--) {
        goog.asserts.assert(d);
        if(d[b] < c[b].length - 1) {
          d[b]++;
          break
        }
        if(0 == b) {
          d = null;
          break
        }
        d[b] = 0
      }
      return a
    }
    throw goog.iter.StopIteration;
  };
  return b
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0, a = new goog.iter.Iterator, e = !1;
  a.next = function() {
    var a = null;
    if(!e) {
      try {
        return a = b.next(), c.push(a), a
      }catch(g) {
        if(g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a
  };
  return a
};
goog.structs.Map = function(a, b) {
  this.map_ = {};
  this.keys_ = [];
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.addAll(a)
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for(var a = [], b = 0;b < this.keys_.length;b++) {
    a.push(this.map_[this.keys_[b]])
  }
  return a
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a)
};
goog.structs.Map.prototype.containsValue = function(a) {
  for(var b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    if(goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) {
      return!0
    }
  }
  return!1
};
goog.structs.Map.prototype.equals = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.count_ != a.getCount()) {
    return!1
  }
  var c = b || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var d, e = 0;d = this.keys_[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0
};
goog.structs.Map.prototype.remove = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    for(var a = 0, b = 0;a < this.keys_.length;) {
      var c = this.keys_[a];
      goog.structs.Map.hasKey_(this.map_, c) && (this.keys_[b++] = c);
      a++
    }
    this.keys_.length = b
  }
  if(this.count_ != this.keys_.length) {
    for(var d = {}, b = a = 0;a < this.keys_.length;) {
      c = this.keys_[a], goog.structs.Map.hasKey_(d, c) || (this.keys_[b++] = c, d[c] = 1), a++
    }
    this.keys_.length = b
  }
};
goog.structs.Map.prototype.get = function(a, b) {
  return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b
};
goog.structs.Map.prototype.set = function(a, b) {
  goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = b
};
goog.structs.Map.prototype.addAll = function(a) {
  var b;
  a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  for(var a = new goog.structs.Map, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a.set(this.map_[c], c)
  }
  return a
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for(var a = {}, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a[c] = this.map_[c]
  }
  return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, c = this.keys_, d = this.map_, e = this.version_, f = this, g = new goog.iter.Iterator;
  g.next = function() {
    for(;;) {
      if(e != f.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw goog.iter.StopIteration;
      }
      var g = c[b++];
      return a ? g : d[g]
    }
  };
  return g
};
goog.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == a.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != a.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == b.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isDocumentModeCache_ = {};
goog.userAgent.isDocumentMode = function(a) {
  return goog.userAgent.isDocumentModeCache_[a] || (goog.userAgent.isDocumentModeCache_[a] = goog.userAgent.IE && !!document.documentMode && document.documentMode >= a)
};
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
  var h = [];
  a && h.push(a, ":");
  c && (h.push("//"), b && h.push(b, "@"), h.push(c), d && h.push(":", d));
  e && h.push(e);
  f && h.push("?", f);
  g && h.push("#", g);
  return h.join("")
};
goog.uri.utils.splitRe_ = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(a) {
  return a.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.decodeIfPossible_ = function(a) {
  return a && decodeURIComponent(a)
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
  return goog.uri.utils.split(b)[a] || null
};
goog.uri.utils.getScheme = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a)
};
goog.uri.utils.getEffectiveScheme = function(a) {
  a = goog.uri.utils.getScheme(a);
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return a ? a.toLowerCase() : ""
};
goog.uri.utils.getUserInfoEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a)
};
goog.uri.utils.getUserInfo = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a))
};
goog.uri.utils.getDomainEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a)
};
goog.uri.utils.getDomain = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a))
};
goog.uri.utils.getPort = function(a) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null
};
goog.uri.utils.getPathEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a)
};
goog.uri.utils.getPath = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a))
};
goog.uri.utils.getQueryData = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a)
};
goog.uri.utils.getFragmentEncoded = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? null : a.substr(b + 1)
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
  return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
goog.uri.utils.getFragment = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a))
};
goog.uri.utils.getHost = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? a : a.substr(0, b)
};
goog.uri.utils.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
  if(goog.DEBUG && (0 <= a.indexOf("#") || 0 <= a.indexOf("?"))) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
  }
};
goog.uri.utils.appendQueryData_ = function(a) {
  if(a[1]) {
    var b = a[0], c = b.indexOf("#");
    0 <= c && (a.push(b.substr(c)), a[0] = b = b.substr(0, c));
    c = b.indexOf("?");
    0 > c ? a[1] = "?" : c == b.length - 1 && (a[1] = void 0)
  }
  return a.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
  if(goog.isArray(b)) {
    goog.asserts.assertArray(b);
    for(var d = 0;d < b.length;d++) {
      goog.uri.utils.appendKeyValuePairs_(a, String(b[d]), c)
    }
  }else {
    null != b && c.push("&", a, "" === b ? "" : "=", goog.string.urlEncode(b))
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
  goog.asserts.assert(0 == Math.max(b.length - (c || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
  for(c = c || 0;c < b.length;c += 2) {
    goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a)
  }
  return a
};
goog.uri.utils.buildQueryData = function(a, b) {
  var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
  c[0] = "";
  return c.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
  for(var c in b) {
    goog.uri.utils.appendKeyValuePairs_(c, b[c], a)
  }
  return a
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
  a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
  a[0] = "";
  return a.join("")
};
goog.uri.utils.appendParams = function(a, b) {
  return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b))
};
goog.uri.utils.appendParam = function(a, b, c) {
  return goog.uri.utils.appendQueryData_([a, "&", b, "=", goog.string.urlEncode(c)])
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
  for(var e = c.length;0 <= (b = a.indexOf(c, b)) && b < d;) {
    var f = a.charCodeAt(b - 1);
    if(f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION) {
      if(f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) {
        return b
      }
    }
    b += e + 1
  }
  return-1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
  return 0 <= goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_))
};
goog.uri.utils.getParamValue = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = goog.uri.utils.findParam_(a, 0, b, c);
  if(0 > d) {
    return null
  }
  var e = a.indexOf("&", d);
  if(0 > e || e > c) {
    e = c
  }
  d += b.length + 1;
  return goog.string.urlDecode(a.substr(d, e - d))
};
goog.uri.utils.getParamValues = function(a, b) {
  for(var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    d = a.indexOf("&", e);
    if(0 > d || d > c) {
      d = c
    }
    e += b.length + 1;
    f.push(goog.string.urlDecode(a.substr(e, d - e)))
  }
  return f
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
  for(var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    f.push(a.substring(d, e)), d = Math.min(a.indexOf("&", e) + 1 || c, c)
  }
  f.push(a.substr(d));
  return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(a, b, c) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c)
};
goog.uri.utils.appendPath = function(a, b) {
  goog.uri.utils.assertNoFragmentsOrQueries_(a);
  goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
  goog.string.startsWith(b, "/") && (b = b.substr(1));
  return goog.string.buildString(a, "/", b)
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(a) {
  return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.Uri = function(a, b) {
  var c;
  a instanceof goog.Uri ? (this.ignoreCase_ = goog.isDef(b) ? b : a.getIgnoreCase(), this.setScheme(a.getScheme()), this.setUserInfo(a.getUserInfo()), this.setDomain(a.getDomain()), this.setPort(a.getPort()), this.setPath(a.getPath()), this.setQueryData(a.getQueryData().clone()), this.setFragment(a.getFragment())) : a && (c = goog.uri.utils.split(String(a))) ? (this.ignoreCase_ = !!b, this.setScheme(c[goog.uri.utils.ComponentIndex.SCHEME] || "", !0), this.setUserInfo(c[goog.uri.utils.ComponentIndex.USER_INFO] || 
  "", !0), this.setDomain(c[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(c[goog.uri.utils.ComponentIndex.PORT]), this.setPath(c[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(c[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(c[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!b, this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_))
};
goog.Uri.preserveParameterTypesCompatibilityFlag = !1;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = !1;
goog.Uri.prototype.ignoreCase_ = !1;
goog.Uri.prototype.toString = function() {
  var a = [], b = this.getScheme();
  b && a.push(goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":");
  if(b = this.getDomain()) {
    a.push("//");
    var c = this.getUserInfo();
    c && a.push(goog.Uri.encodeSpecialChars_(c, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@");
    a.push(goog.string.urlEncode(b));
    b = this.getPort();
    null != b && a.push(":", String(b))
  }
  if(b = this.getPath()) {
    this.hasDomain() && "/" != b.charAt(0) && a.push("/"), a.push(goog.Uri.encodeSpecialChars_(b, "/" == b.charAt(0) ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_))
  }
  (b = this.getEncodedQuery()) && a.push("?", b);
  (b = this.getFragment()) && a.push("#", goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInFragment_));
  return a.join("")
};
goog.Uri.prototype.resolve = function(a) {
  var b = this.clone(), c = a.hasScheme();
  c ? b.setScheme(a.getScheme()) : c = a.hasUserInfo();
  c ? b.setUserInfo(a.getUserInfo()) : c = a.hasDomain();
  c ? b.setDomain(a.getDomain()) : c = a.hasPort();
  var d = a.getPath();
  if(c) {
    b.setPort(a.getPort())
  }else {
    if(c = a.hasPath()) {
      if("/" != d.charAt(0)) {
        if(this.hasDomain() && !this.hasPath()) {
          d = "/" + d
        }else {
          var e = b.getPath().lastIndexOf("/");
          -1 != e && (d = b.getPath().substr(0, e + 1) + d)
        }
      }
      d = goog.Uri.removeDotSegments(d)
    }
  }
  c ? b.setPath(d) : c = a.hasQuery();
  c ? b.setQueryData(a.getDecodedQuery()) : c = a.hasFragment();
  c && b.setFragment(a.getFragment());
  return b
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this)
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_
};
goog.Uri.prototype.setScheme = function(a, b) {
  this.enforceReadOnly();
  if(this.scheme_ = b ? goog.Uri.decodeOrEmpty_(a) : a) {
    this.scheme_ = this.scheme_.replace(/:$/, "")
  }
  return this
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(a, b) {
  this.enforceReadOnly();
  this.userInfo_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_
};
goog.Uri.prototype.setDomain = function(a, b) {
  this.enforceReadOnly();
  this.domain_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_
};
goog.Uri.prototype.getPort = function() {
  return this.port_
};
goog.Uri.prototype.setPort = function(a) {
  this.enforceReadOnly();
  if(a) {
    a = Number(a);
    if(isNaN(a) || 0 > a) {
      throw Error("Bad port number " + a);
    }
    this.port_ = a
  }else {
    this.port_ = null
  }
  return this
};
goog.Uri.prototype.hasPort = function() {
  return null != this.port_
};
goog.Uri.prototype.getPath = function() {
  return this.path_
};
goog.Uri.prototype.setPath = function(a, b) {
  this.enforceReadOnly();
  this.path_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_
};
goog.Uri.prototype.hasQuery = function() {
  return"" !== this.queryData_.toString()
};
goog.Uri.prototype.setQueryData = function(a, b) {
  this.enforceReadOnly();
  a instanceof goog.Uri.QueryData ? (this.queryData_ = a, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (b || (a = goog.Uri.encodeSpecialChars_(a, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(a, null, this.ignoreCase_));
  return this
};
goog.Uri.prototype.setQuery = function(a, b) {
  return this.setQueryData(a, b)
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(a, b) {
  this.enforceReadOnly();
  this.queryData_.set(a, b);
  return this
};
goog.Uri.prototype.setParameterValues = function(a, b) {
  this.enforceReadOnly();
  goog.isArray(b) || (b = [String(b)]);
  this.queryData_.setValues(a, b);
  return this
};
goog.Uri.prototype.getParameterValues = function(a) {
  return this.queryData_.getValues(a)
};
goog.Uri.prototype.getParameterValue = function(a) {
  return this.queryData_.get(a)
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_
};
goog.Uri.prototype.setFragment = function(a, b) {
  this.enforceReadOnly();
  this.fragment_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(a) {
  return(!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort())
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this
};
goog.Uri.prototype.removeParameter = function(a) {
  this.enforceReadOnly();
  this.queryData_.remove(a);
  return this
};
goog.Uri.prototype.setReadOnly = function(a) {
  this.isReadOnly_ = a;
  return this
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
  if(this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(a) {
  this.ignoreCase_ = a;
  this.queryData_ && this.queryData_.setIgnoreCase(a);
  return this
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_
};
goog.Uri.parse = function(a, b) {
  return a instanceof goog.Uri ? a.clone() : new goog.Uri(a, b)
};
goog.Uri.create = function(a, b, c, d, e, f, g, h) {
  h = new goog.Uri(null, h);
  a && h.setScheme(a);
  b && h.setUserInfo(b);
  c && h.setDomain(c);
  d && h.setPort(d);
  e && h.setPath(e);
  f && h.setQueryData(f);
  g && h.setFragment(g);
  return h
};
goog.Uri.resolve = function(a, b) {
  a instanceof goog.Uri || (a = goog.Uri.parse(a));
  b instanceof goog.Uri || (b = goog.Uri.parse(b));
  return a.resolve(b)
};
goog.Uri.removeDotSegments = function(a) {
  if(".." == a || "." == a) {
    return""
  }
  if(!goog.string.contains(a, "./") && !goog.string.contains(a, "/.")) {
    return a
  }
  for(var b = goog.string.startsWith(a, "/"), a = a.split("/"), c = [], d = 0;d < a.length;) {
    var e = a[d++];
    "." == e ? b && d == a.length && c.push("") : ".." == e ? ((1 < c.length || 1 == c.length && "" != c[0]) && c.pop(), b && d == a.length && c.push("")) : (c.push(e), b = !0)
  }
  return c.join("/")
};
goog.Uri.decodeOrEmpty_ = function(a) {
  return a ? decodeURIComponent(a) : ""
};
goog.Uri.encodeSpecialChars_ = function(a, b) {
  return goog.isString(a) ? encodeURI(a).replace(b, goog.Uri.encodeChar_) : null
};
goog.Uri.encodeChar_ = function(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(a, b, c) {
  this.encodedQuery_ = a || null;
  this.ignoreCase_ = !!c
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if(!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_)) {
    for(var a = this.encodedQuery_.split("&"), b = 0;b < a.length;b++) {
      var c = a[b].indexOf("="), d = null, e = null;
      0 <= c ? (d = a[b].substring(0, c), e = a[b].substring(c + 1)) : d = a[b];
      d = goog.string.urlDecode(d);
      d = this.getKeyName_(d);
      this.add(d, e ? goog.string.urlDecode(e) : "")
    }
  }
};
goog.Uri.QueryData.createFromMap = function(a, b, c) {
  b = goog.structs.getKeys(a);
  if("undefined" == typeof b) {
    throw Error("Keys are undefined");
  }
  for(var c = new goog.Uri.QueryData(null, null, c), a = goog.structs.getValues(a), d = 0;d < b.length;d++) {
    var e = b[d], f = a[d];
    goog.isArray(f) ? c.setValues(e, f) : c.add(e, f)
  }
  return c
};
goog.Uri.QueryData.createFromKeysValues = function(a, b, c, d) {
  if(a.length != b.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  c = new goog.Uri.QueryData(null, null, d);
  for(d = 0;d < a.length;d++) {
    c.add(a[d], b[d])
  }
  return c
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_
};
goog.Uri.QueryData.prototype.add = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  var a = this.getKeyName_(a), c = this.keyMap_.get(a);
  c || this.keyMap_.set(a, c = []);
  c.push(b);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.remove = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a) ? (this.invalidateCache_(), this.count_ -= this.keyMap_.get(a).length, this.keyMap_.remove(a)) : !1
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return 0 == this.count_
};
goog.Uri.QueryData.prototype.containsKey = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a)
};
goog.Uri.QueryData.prototype.containsValue = function(a) {
  var b = this.getValues();
  return goog.array.contains(b, a)
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  for(var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [], d = 0;d < b.length;d++) {
    for(var e = a[d], f = 0;f < e.length;f++) {
      c.push(b[d])
    }
  }
  return c
};
goog.Uri.QueryData.prototype.getValues = function(a) {
  this.ensureKeyMapInitialized_();
  var b = [];
  if(a) {
    this.containsKey(a) && (b = goog.array.concat(b, this.keyMap_.get(this.getKeyName_(a))))
  }else {
    for(var a = this.keyMap_.getValues(), c = 0;c < a.length;c++) {
      b = goog.array.concat(b, a[c])
    }
  }
  return b
};
goog.Uri.QueryData.prototype.set = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  this.containsKey(a) && (this.count_ -= this.keyMap_.get(a).length);
  this.keyMap_.set(a, [b]);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.get = function(a, b) {
  var c = a ? this.getValues(a) : [];
  return goog.Uri.preserveParameterTypesCompatibilityFlag ? 0 < c.length ? c[0] : b : 0 < c.length ? String(c[0]) : b
};
goog.Uri.QueryData.prototype.setValues = function(a, b) {
  this.remove(a);
  0 < b.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(a), goog.array.clone(b)), this.count_ += b.length)
};
goog.Uri.QueryData.prototype.toString = function() {
  if(this.encodedQuery_) {
    return this.encodedQuery_
  }
  if(!this.keyMap_) {
    return""
  }
  for(var a = [], b = this.keyMap_.getKeys(), c = 0;c < b.length;c++) {
    for(var d = b[c], e = goog.string.urlEncode(d), d = this.getValues(d), f = 0;f < d.length;f++) {
      var g = e;
      "" !== d[f] && (g += "=" + goog.string.urlEncode(d[f]));
      a.push(g)
    }
  }
  return this.encodedQuery_ = a.join("&")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  return goog.Uri.decodeOrEmpty_(this.toString())
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null
};
goog.Uri.QueryData.prototype.filterKeys = function(a) {
  this.ensureKeyMapInitialized_();
  goog.structs.forEach(this.keyMap_, function(b, c) {
    goog.array.contains(a, c) || this.remove(c)
  }, this);
  return this
};
goog.Uri.QueryData.prototype.clone = function() {
  var a = new goog.Uri.QueryData;
  a.encodedQuery_ = this.encodedQuery_;
  this.keyMap_ && (a.keyMap_ = this.keyMap_.clone());
  return a
};
goog.Uri.QueryData.prototype.getKeyName_ = function(a) {
  a = String(a);
  this.ignoreCase_ && (a = a.toLowerCase());
  return a
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(a) {
  a && !this.ignoreCase_ && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), goog.structs.forEach(this.keyMap_, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.setValues(d, a))
  }, this));
  this.ignoreCase_ = a
};
goog.Uri.QueryData.prototype.extend = function(a) {
  for(var b = 0;b < arguments.length;b++) {
    goog.structs.forEach(arguments[b], function(a, b) {
      this.add(b, a)
    }, this)
  }
};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  this.disposed_ = !1;
  goog.Disposable.ENABLE_MONITORING && (this.creationStack = Error().stack, goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.ENABLE_MONITORING = !1;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], b;
  for(b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)])
  }
  return a
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.isDisposed = function() {
  return!!this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_) {
    if(goog.Disposable.ENABLE_MONITORING) {
      if(void 0 == this.disposed_) {
        throw Error(this + " did not call the goog.Disposable base constructor");
      }
      var a = goog.getUid(this);
      delete goog.Disposable.instances_[a]
    }
    this.disposed_ = !0;
    this.disposeInternal()
  }
};
goog.Disposable.prototype.registerDisposable = function(a) {
  this.dependentDisposables_ || (this.dependentDisposables_ = []);
  this.dependentDisposables_.push(a)
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.bind(a, b))
};
goog.Disposable.prototype.disposeInternal = function() {
  this.dependentDisposables_ && goog.disposeAll.apply(null, this.dependentDisposables_);
  if(this.onDisposeCallbacks_) {
    for(;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()()
    }
  }
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose()
};
goog.disposeAll = function(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d)
  }
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(a) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;
  if(goog.debug.entryPointRegistry.monitorsMayExist_) {
    for(var b = goog.debug.entryPointRegistry.monitors_, c = 0;c < b.length;c++) {
      a(goog.bind(b[c].wrap, b[c]))
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for(var b = goog.bind(a.wrap, a), c = 0;c < goog.debug.entryPointRegistry.refList_.length;c++) {
    goog.debug.entryPointRegistry.refList_[c](b)
  }
  goog.debug.entryPointRegistry.monitors_.push(a)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
  var b = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(a == b[b.length - 1], "Only the most recent monitor can be unwrapped.");
  for(var a = goog.bind(a.unwrap, a), c = 0;c < goog.debug.entryPointRegistry.refList_.length;c++) {
    goog.debug.entryPointRegistry.refList_[c](a)
  }
  b.length--
};
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(a) {
  return a
}};
goog.events = {};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("8"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersion("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersion("1.9b") || goog.userAgent.IE && goog.userAgent.isVersion("8") || goog.userAgent.OPERA && 
goog.userAgent.isVersion("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersion("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersion("8") || goog.userAgent.IE && !goog.userAgent.isVersion("9")};
goog.events.Event = function(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
};
goog.events.Event.prototype.disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.propagationStopped_ = !1;
goog.events.Event.prototype.defaultPrevented = !1;
goog.events.Event.prototype.returnValue_ = !0;
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault()
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", TRANSITIONEND:goog.userAgent.WEBKIT ? "webkitTransitionEnd" : goog.userAgent.OPERA ? "oTransitionEnd" : "transitionend"};
goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b
};
goog.reflect.sinkValue = function(a) {
  goog.reflect.sinkValue[" "](a);
  return a
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
  try {
    return goog.reflect.sinkValue(a[b]), !0
  }catch(c) {
  }
  return!1
};
goog.events.BrowserEvent = function(a, b) {
  a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = !1;
goog.events.BrowserEvent.prototype.altKey = !1;
goog.events.BrowserEvent.prototype.shiftKey = !1;
goog.events.BrowserEvent.prototype.metaKey = !1;
goog.events.BrowserEvent.prototype.platformModifierKey = !1;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type;
  goog.events.Event.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  d ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(d, "nodeName") || (d = null)) : c == goog.events.EventType.MOUSEOVER ? d = a.fromElement : c == goog.events.EventType.MOUSEOUT && (d = a.toElement);
  this.relatedTarget = d;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  a.defaultPrevented && this.preventDefault();
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
};
goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function() {
};
goog.events.EventWrapper.prototype.unlisten = function() {
};
goog.events.Listener = function() {
  goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack)
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = !1;
goog.events.Listener.prototype.callOnce = !1;
goog.events.Listener.prototype.init = function(a, b, c, d, e, f) {
  if(goog.isFunction(a)) {
    this.isFunctionListener_ = !0
  }else {
    if(a && a.handleEvent && goog.isFunction(a.handleEvent)) {
      this.isFunctionListener_ = !1
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.callOnce = !1;
  this.key = ++goog.events.Listener.counter_;
  this.removed = !1
};
goog.events.Listener.prototype.handleEvent = function(a) {
  return this.isFunctionListener_ ? this.listener.call(this.handler || this.src, a) : this.listener.handleEvent.call(this.listener, a)
};
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(a, b, c, d, e) {
  if(b) {
    if(goog.isArray(b)) {
      for(var f = 0;f < b.length;f++) {
        goog.events.listen(a, b[f], c, d, e)
      }
      return null
    }
    var d = !!d, g = goog.events.listenerTree_;
    b in g || (g[b] = {count_:0, remaining_:0});
    g = g[b];
    d in g || (g[d] = {count_:0, remaining_:0}, g.count_++);
    var g = g[d], h = goog.getUid(a), i;
    g.remaining_++;
    if(g[h]) {
      i = g[h];
      for(f = 0;f < i.length;f++) {
        if(g = i[f], g.listener == c && g.handler == e) {
          if(g.removed) {
            break
          }
          return i[f].key
        }
      }
    }else {
      i = g[h] = [], g.count_++
    }
    f = goog.events.getProxy();
    f.src = a;
    g = new goog.events.Listener;
    g.init(c, f, a, b, d, e);
    c = g.key;
    f.key = c;
    i.push(g);
    goog.events.listeners_[c] = g;
    goog.events.sources_[h] || (goog.events.sources_[h] = []);
    goog.events.sources_[h].push(g);
    a.addEventListener ? (a == goog.global || !a.customEvent_) && a.addEventListener(b, f, d) : a.attachEvent(goog.events.getOnString_(b), f);
    return c
  }
  throw Error("Invalid event type");
};
goog.events.getProxy = function() {
  var a = goog.events.handleBrowserEvent_, b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(c) {
    return a.call(b.src, b.key, c)
  } : function(c) {
    c = a.call(b.src, b.key, c);
    if(!c) {
      return c
    }
  };
  return b
};
goog.events.listenOnce = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.listenOnce(a, b[f], c, d, e)
    }
    return null
  }
  a = goog.events.listen(a, b, c, d, e);
  goog.events.listeners_[a].callOnce = !0;
  return a
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.unlisten(a, b[f], c, d, e)
    }
    return null
  }
  d = !!d;
  a = goog.events.getListeners_(a, b, d);
  if(!a) {
    return!1
  }
  for(f = 0;f < a.length;f++) {
    if(a[f].listener == c && a[f].capture == d && a[f].handler == e) {
      return goog.events.unlistenByKey(a[f].key)
    }
  }
  return!1
};
goog.events.unlistenByKey = function(a) {
  if(!goog.events.listeners_[a]) {
    return!1
  }
  var b = goog.events.listeners_[a];
  if(b.removed) {
    return!1
  }
  var c = b.src, d = b.type, e = b.proxy, f = b.capture;
  c.removeEventListener ? (c == goog.global || !c.customEvent_) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(goog.events.getOnString_(d), e);
  c = goog.getUid(c);
  goog.events.sources_[c] && (e = goog.events.sources_[c], goog.array.remove(e, b), 0 == e.length && delete goog.events.sources_[c]);
  b.removed = !0;
  if(b = goog.events.listenerTree_[d][f][c]) {
    b.needsCleanup_ = !0, goog.events.cleanUp_(d, f, c, b)
  }
  delete goog.events.listeners_[a];
  return!0
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e)
};
goog.events.cleanUp_ = function(a, b, c, d) {
  if(!d.locked_ && d.needsCleanup_) {
    for(var e = 0, f = 0;e < d.length;e++) {
      d[e].removed ? d[e].proxy.src = null : (e != f && (d[f] = d[e]), f++)
    }
    d.length = f;
    d.needsCleanup_ = !1;
    0 == f && (delete goog.events.listenerTree_[a][b][c], goog.events.listenerTree_[a][b].count_--, 0 == goog.events.listenerTree_[a][b].count_ && (delete goog.events.listenerTree_[a][b], goog.events.listenerTree_[a].count_--), 0 == goog.events.listenerTree_[a].count_ && delete goog.events.listenerTree_[a])
  }
};
goog.events.removeAll = function(a, b, c) {
  var d = 0, e = null == b, f = null == c, c = !!c;
  if(null == a) {
    goog.object.forEach(goog.events.sources_, function(a) {
      for(var g = a.length - 1;0 <= g;g--) {
        var h = a[g];
        if((e || b == h.type) && (f || c == h.capture)) {
          goog.events.unlistenByKey(h.key), d++
        }
      }
    })
  }else {
    if(a = goog.getUid(a), goog.events.sources_[a]) {
      for(var a = goog.events.sources_[a], g = a.length - 1;0 <= g;g--) {
        var h = a[g];
        if((e || b == h.type) && (f || c == h.capture)) {
          goog.events.unlistenByKey(h.key), d++
        }
      }
    }
  }
  return d
};
goog.events.getListeners = function(a, b, c) {
  return goog.events.getListeners_(a, b, c) || []
};
goog.events.getListeners_ = function(a, b, c) {
  var d = goog.events.listenerTree_;
  return b in d && (d = d[b], c in d && (d = d[c], a = goog.getUid(a), d[a])) ? d[a] : null
};
goog.events.getListener = function(a, b, c, d, e) {
  d = !!d;
  if(a = goog.events.getListeners_(a, b, d)) {
    for(b = 0;b < a.length;b++) {
      if(!a[b].removed && a[b].listener == c && a[b].capture == d && a[b].handler == e) {
        return a[b]
      }
    }
  }
  return null
};
goog.events.hasListener = function(a, b, c) {
  var a = goog.getUid(a), d = goog.events.sources_[a];
  if(d) {
    var e = goog.isDef(b), f = goog.isDef(c);
    return e && f ? (d = goog.events.listenerTree_[b], !!d && !!d[c] && a in d[c]) : !e && !f ? !0 : goog.array.some(d, function(a) {
      return e && a.type == b || f && a.capture == c
    })
  }
  return!1
};
goog.events.expose = function(a) {
  var b = [], c;
  for(c in a) {
    a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c])
  }
  return b.join("\n")
};
goog.events.getOnString_ = function(a) {
  return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
  var e = goog.events.listenerTree_;
  return b in e && (e = e[b], c in e) ? goog.events.fireListeners_(e[c], a, b, c, d) : !0
};
goog.events.fireListeners_ = function(a, b, c, d, e) {
  var f = 1, b = goog.getUid(b);
  if(a[b]) {
    a.remaining_--;
    a = a[b];
    a.locked_ ? a.locked_++ : a.locked_ = 1;
    try {
      for(var g = a.length, h = 0;h < g;h++) {
        var i = a[h];
        i && !i.removed && (f &= !1 !== goog.events.fireListener(i, e))
      }
    }finally {
      a.locked_--, goog.events.cleanUp_(c, d, b, a)
    }
  }
  return Boolean(f)
};
goog.events.fireListener = function(a, b) {
  a.callOnce && goog.events.unlistenByKey(a.key);
  return a.handleEvent(b)
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(a, b) {
  var c = b.type || b, d = goog.events.listenerTree_;
  if(!(c in d)) {
    return!0
  }
  if(goog.isString(b)) {
    b = new goog.events.Event(b, a)
  }else {
    if(b instanceof goog.events.Event) {
      b.target = b.target || a
    }else {
      var e = b, b = new goog.events.Event(c, a);
      goog.object.extend(b, e)
    }
  }
  var e = 1, f, d = d[c], c = !0 in d, g;
  if(c) {
    f = [];
    for(g = a;g;g = g.getParentEventTarget()) {
      f.push(g)
    }
    g = d[!0];
    g.remaining_ = g.count_;
    for(var h = f.length - 1;!b.propagationStopped_ && 0 <= h && g.remaining_;h--) {
      b.currentTarget = f[h], e &= goog.events.fireListeners_(g, f[h], b.type, !0, b) && !1 != b.returnValue_
    }
  }
  if(!1 in d) {
    if(g = d[!1], g.remaining_ = g.count_, c) {
      for(h = 0;!b.propagationStopped_ && h < f.length && g.remaining_;h++) {
        b.currentTarget = f[h], e &= goog.events.fireListeners_(g, f[h], b.type, !1, b) && !1 != b.returnValue_
      }
    }else {
      for(d = a;!b.propagationStopped_ && d && g.remaining_;d = d.getParentEventTarget()) {
        b.currentTarget = d, e &= goog.events.fireListeners_(g, d, b.type, !1, b) && !1 != b.returnValue_
      }
    }
  }
  return Boolean(e)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
  if(!goog.events.listeners_[a]) {
    return!0
  }
  var c = goog.events.listeners_[a], d = c.type, e = goog.events.listenerTree_;
  if(!(d in e)) {
    return!0
  }
  var e = e[d], f, g;
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    f = b || goog.getObjectByName("window.event");
    var h = !0 in e, i = !1 in e;
    if(h) {
      if(goog.events.isMarkedIeEvent_(f)) {
        return!0
      }
      goog.events.markIeEvent_(f)
    }
    var j = new goog.events.BrowserEvent;
    j.init(f, this);
    f = !0;
    try {
      if(h) {
        for(var k = [], m = j.currentTarget;m;m = m.parentNode) {
          k.push(m)
        }
        g = e[!0];
        g.remaining_ = g.count_;
        for(var l = k.length - 1;!j.propagationStopped_ && 0 <= l && g.remaining_;l--) {
          j.currentTarget = k[l], f &= goog.events.fireListeners_(g, k[l], d, !0, j)
        }
        if(i) {
          g = e[!1];
          g.remaining_ = g.count_;
          for(l = 0;!j.propagationStopped_ && l < k.length && g.remaining_;l++) {
            j.currentTarget = k[l], f &= goog.events.fireListeners_(g, k[l], d, !1, j)
          }
        }
      }else {
        f = goog.events.fireListener(c, j)
      }
    }finally {
      k && (k.length = 0)
    }
    return f
  }
  d = new goog.events.BrowserEvent(b, this);
  return f = goog.events.fireListener(c, d)
};
goog.events.markIeEvent_ = function(a) {
  var b = !1;
  if(0 == a.keyCode) {
    try {
      a.keyCode = -1;
      return
    }catch(c) {
      b = !0
    }
  }
  if(b || void 0 == a.returnValue) {
    a.returnValue = !0
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return 0 > a.keyCode || void 0 != a.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_)
});
goog.events.EventTarget = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.EventTarget.prototype.customEvent_ = !0;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
  this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
  goog.events.listen(this, a, b, c, d)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
  goog.events.unlisten(this, a, b, c, d)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
  return goog.events.dispatchEvent(this, a)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this);
  this.parentEventTarget_ = null
};
goog.Timer = function(a, b) {
  goog.events.EventTarget.call(this);
  this.interval_ = a || 1;
  this.timerObject_ = b || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global.window;
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_
};
goog.Timer.prototype.setInterval = function(a) {
  this.interval_ = a;
  this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
};
goog.Timer.prototype.tick_ = function() {
  if(this.enabled) {
    var a = goog.now() - this.last_;
    0 < a && a < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a) : (this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()))
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
  this.enabled = !0;
  this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now())
};
goog.Timer.prototype.stop = function() {
  this.enabled = !1;
  this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null)
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(a, b, c) {
  if(goog.isFunction(a)) {
    c && (a = goog.bind(a, c))
  }else {
    if(a && "function" == typeof a.handleEvent) {
      a = goog.bind(a.handleEvent, a)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  return b > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(a, b || 0)
};
goog.Timer.clear = function(a) {
  goog.Timer.defaultTimerObject.clearTimeout(a)
};
goog.structs.Collection = function() {
};
goog.structs.Set = function(a) {
  this.map_ = new goog.structs.Map;
  a && this.addAll(a)
};
goog.structs.Set.getKey_ = function(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + goog.getUid(a) : b.substr(0, 1) + a
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount()
};
goog.structs.Set.prototype.add = function(a) {
  this.map_.set(goog.structs.Set.getKey_(a), a)
};
goog.structs.Set.prototype.addAll = function(a) {
  for(var a = goog.structs.getValues(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
goog.structs.Set.prototype.removeAll = function(a) {
  for(var a = goog.structs.getValues(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
goog.structs.Set.prototype.remove = function(a) {
  return this.map_.remove(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(a) {
  return this.map_.containsKey(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.containsAll = function(a) {
  return goog.structs.every(a, this.contains, this)
};
goog.structs.Set.prototype.intersection = function(a) {
  for(var b = new goog.structs.Set, a = goog.structs.getValues(a), c = 0;c < a.length;c++) {
    var d = a[c];
    this.contains(d) && b.add(d)
  }
  return b
};
goog.structs.Set.prototype.difference = function(a) {
  var b = this.clone();
  b.removeAll(a);
  return b
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(a) {
  return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a)
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
  var b = goog.structs.getCount(a);
  if(this.getCount() > b) {
    return!1
  }
  !(a instanceof goog.structs.Set) && 5 < b && (a = new goog.structs.Set(a));
  return goog.structs.every(this, function(b) {
    return goog.structs.contains(a, b)
  })
};
goog.structs.Set.prototype.__iterator__ = function() {
  return this.map_.__iterator__(!1)
};
goog.debug.catchErrors = function(a, b, c) {
  var c = c || goog.global, d = c.onerror, e = !!b;
  goog.userAgent.WEBKIT && !goog.userAgent.isVersion("535.3") && (e = !e);
  c.onerror = function(b, c, h) {
    d && d(b, c, h);
    a({message:b, fileName:c, line:h});
    return e
  }
};
goog.debug.expose = function(a, b) {
  if("undefined" == typeof a) {
    return"undefined"
  }
  if(null == a) {
    return"NULL"
  }
  var c = [], d;
  for(d in a) {
    if(b || !goog.isFunction(a[d])) {
      var e = d + " = ";
      try {
        e += a[d]
      }catch(f) {
        e += "*** " + f + " ***"
      }
      c.push(e)
    }
  }
  return c.join("\n")
};
goog.debug.deepExpose = function(a, b) {
  var c = new goog.structs.Set, d = [], e = function(a, g) {
    var h = g + "  ";
    try {
      if(goog.isDef(a)) {
        if(goog.isNull(a)) {
          d.push("NULL")
        }else {
          if(goog.isString(a)) {
            d.push('"' + a.replace(/\n/g, "\n" + g) + '"')
          }else {
            if(goog.isFunction(a)) {
              d.push(String(a).replace(/\n/g, "\n" + g))
            }else {
              if(goog.isObject(a)) {
                if(c.contains(a)) {
                  d.push("*** reference loop detected ***")
                }else {
                  c.add(a);
                  d.push("{");
                  for(var i in a) {
                    if(b || !goog.isFunction(a[i])) {
                      d.push("\n"), d.push(h), d.push(i + " = "), e(a[i], h)
                    }
                  }
                  d.push("\n" + g + "}")
                }
              }else {
                d.push(a)
              }
            }
          }
        }
      }else {
        d.push("undefined")
      }
    }catch(j) {
      d.push("*** " + j + " ***")
    }
  };
  e(a, "");
  return d.join("")
};
goog.debug.exposeArray = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    goog.isArray(a[c]) ? b.push(goog.debug.exposeArray(a[c])) : b.push(a[c])
  }
  return"[ " + b.join(", ") + " ]"
};
goog.debug.exposeException = function(a, b) {
  try {
    var c = goog.debug.normalizeErrorObject(a);
    return"Message: " + goog.string.htmlEscape(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(b) + "-> ")
  }catch(d) {
    return"Exception trying to expose exception! You win, we lose. " + d
  }
};
goog.debug.normalizeErrorObject = function(a) {
  var b = goog.getObjectByName("window.location.href");
  if(goog.isString(a)) {
    return{message:a, name:"Unknown error", lineNumber:"Not available", fileName:b, stack:"Not available"}
  }
  var c, d, e = !1;
  try {
    c = a.lineNumber || a.line || "Not available"
  }catch(f) {
    c = "Not available", e = !0
  }
  try {
    d = a.fileName || a.filename || a.sourceURL || b
  }catch(g) {
    d = "Not available", e = !0
  }
  return e || !a.lineNumber || !a.fileName || !a.stack ? {message:a.message, name:a.name, lineNumber:c, fileName:d, stack:a.stack || "Not available"} : a
};
goog.debug.enhanceError = function(a, b) {
  var c = "string" == typeof a ? Error(a) : a;
  c.stack || (c.stack = goog.debug.getStacktrace(arguments.callee.caller));
  if(b) {
    for(var d = 0;c["message" + d];) {
      ++d
    }
    c["message" + d] = String(b)
  }
  return c
};
goog.debug.getStacktraceSimple = function(a) {
  for(var b = [], c = arguments.callee.caller, d = 0;c && (!a || d < a);) {
    b.push(goog.debug.getFunctionName(c));
    b.push("()\n");
    try {
      c = c.caller
    }catch(e) {
      b.push("[exception trying to get caller]\n");
      break
    }
    d++;
    if(d >= goog.debug.MAX_STACK_DEPTH) {
      b.push("[...long stack...]");
      break
    }
  }
  a && d >= a ? b.push("[...reached max depth limit...]") : b.push("[end]");
  return b.join("")
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getStacktrace = function(a) {
  return goog.debug.getStacktraceHelper_(a || arguments.callee.caller, [])
};
goog.debug.getStacktraceHelper_ = function(a, b) {
  var c = [];
  if(goog.array.contains(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < goog.debug.MAX_STACK_DEPTH) {
      c.push(goog.debug.getFunctionName(a) + "(");
      for(var d = a.arguments, e = 0;e < d.length;e++) {
        0 < e && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = goog.debug.getFunctionName(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(goog.debug.getStacktraceHelper_(a.caller, b))
      }catch(g) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
};
goog.debug.setFunctionResolver = function(a) {
  goog.debug.fnNameResolver_ = a
};
goog.debug.getFunctionName = function(a) {
  if(goog.debug.fnNameCache_[a]) {
    return goog.debug.fnNameCache_[a]
  }
  if(goog.debug.fnNameResolver_) {
    var b = goog.debug.fnNameResolver_(a);
    if(b) {
      return goog.debug.fnNameCache_[a] = b
    }
  }
  a = String(a);
  goog.debug.fnNameCache_[a] || (b = /function ([^\(]+)/.exec(a), goog.debug.fnNameCache_[a] = b ? b[1] : "[Anonymous]");
  return goog.debug.fnNameCache_[a]
};
goog.debug.makeWhitespaceVisible = function(a) {
  return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
};
goog.debug.fnNameCache_ = {};
goog.debug.LogRecord = function(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
};
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(a, b, c, d, e) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && (this.sequenceNumber_ = "number" == typeof e ? e : goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = d || goog.now();
  this.level_ = a;
  this.msg_ = b;
  this.loggerName_ = c;
  delete this.exception_;
  delete this.exceptionText_
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_
};
goog.debug.LogRecord.prototype.setException = function(a) {
  this.exception_ = a
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_
};
goog.debug.LogRecord.prototype.setExceptionText = function(a) {
  this.exceptionText_ = a
};
goog.debug.LogRecord.prototype.setLoggerName = function(a) {
  this.loggerName_ = a
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_
};
goog.debug.LogRecord.prototype.setLevel = function(a) {
  this.level_ = a
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_
};
goog.debug.LogRecord.prototype.setMessage = function(a) {
  this.msg_ = a
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_
};
goog.debug.LogRecord.prototype.setMillis = function(a) {
  this.time_ = a
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_
};
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear()
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(a, b, c) {
  var d = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = d;
  if(this.isFull_) {
    return d = this.buffer_[d], d.reset(a, b, c), d
  }
  this.isFull_ = d == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[d] = new goog.debug.LogRecord(a, b, c)
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1
};
goog.debug.LogBuffer.prototype.forEachRecord = function(a) {
  var b = this.buffer_;
  if(b[0]) {
    var c = this.curIndex_, d = this.isFull_ ? c : -1;
    do {
      d = (d + 1) % goog.debug.LogBuffer.CAPACITY, a(b[d])
    }while(d != c)
  }
};
goog.debug.Logger = function(a) {
  this.name_ = a
};
goog.debug.Logger.prototype.parent_ = null;
goog.debug.Logger.prototype.level_ = null;
goog.debug.Logger.prototype.children_ = null;
goog.debug.Logger.prototype.handlers_ = null;
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(a, b) {
  this.name = a;
  this.value = b
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for(var a = 0, b;b = goog.debug.Logger.Level.PREDEFINED_LEVELS[a];a++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[b.value] = b;
    goog.debug.Logger.Level.predefinedLevelsCache_[b.name] = b
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[a] || null
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if(a in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[a]
  }
  for(var b = 0;b < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++b) {
    var c = goog.debug.Logger.Level.PREDEFINED_LEVELS[b];
    if(c.value <= a) {
      return c
    }
  }
  return null
};
goog.debug.Logger.getLogger = function(a) {
  return goog.debug.LogManager.getLogger(a)
};
goog.debug.Logger.logToProfilers = function(a) {
  goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(a) : goog.global.console.markTimeline && goog.global.console.markTimeline(a));
  goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(a)
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_
};
goog.debug.Logger.prototype.addHandler = function(a) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    if(!this.handlers_) {
      this.handlers_ = []
    }
    this.handlers_.push(a)
  }else {
    goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootHandlers_.push(a)
  }
};
goog.debug.Logger.prototype.removeHandler = function(a) {
  var b = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
  return!!b && goog.array.remove(b, a)
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_
};
goog.debug.Logger.prototype.getChildren = function() {
  if(!this.children_) {
    this.children_ = {}
  }
  return this.children_
};
goog.debug.Logger.prototype.setLevel = function(a) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    this.level_ = a
  }else {
    goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootLevel_ = a
  }
};
goog.debug.Logger.prototype.getLevel = function() {
  return this.level_
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if(!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_
  }
  if(this.level_) {
    return this.level_
  }
  if(this.parent_) {
    return this.parent_.getEffectiveLevel()
  }
  goog.asserts.fail("Root logger has no level set.");
  return null
};
goog.debug.Logger.prototype.isLoggable = function(a) {
  return a.value >= this.getEffectiveLevel().value
};
goog.debug.Logger.prototype.log = function(a, b, c) {
  this.isLoggable(a) && this.doLogRecord_(this.getLogRecord(a, b, c))
};
goog.debug.Logger.prototype.getLogRecord = function(a, b, c) {
  var d = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(a, b, this.name_) : new goog.debug.LogRecord(a, String(b), this.name_);
  if(c) {
    d.setException(c);
    d.setExceptionText(goog.debug.exposeException(c, arguments.callee.caller))
  }
  return d
};
goog.debug.Logger.prototype.shout = function(a, b) {
  this.log(goog.debug.Logger.Level.SHOUT, a, b)
};
goog.debug.Logger.prototype.severe = function(a, b) {
  this.log(goog.debug.Logger.Level.SEVERE, a, b)
};
goog.debug.Logger.prototype.warning = function(a, b) {
  this.log(goog.debug.Logger.Level.WARNING, a, b)
};
goog.debug.Logger.prototype.info = function(a, b) {
  this.log(goog.debug.Logger.Level.INFO, a, b)
};
goog.debug.Logger.prototype.config = function(a, b) {
  this.log(goog.debug.Logger.Level.CONFIG, a, b)
};
goog.debug.Logger.prototype.fine = function(a, b) {
  this.log(goog.debug.Logger.Level.FINE, a, b)
};
goog.debug.Logger.prototype.finer = function(a, b) {
  this.log(goog.debug.Logger.Level.FINER, a, b)
};
goog.debug.Logger.prototype.finest = function(a, b) {
  this.log(goog.debug.Logger.Level.FINEST, a, b)
};
goog.debug.Logger.prototype.logRecord = function(a) {
  this.isLoggable(a.getLevel()) && this.doLogRecord_(a)
};
goog.debug.Logger.prototype.doLogRecord_ = function(a) {
  goog.debug.Logger.logToProfilers("log:" + a.getMessage());
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    for(var b = this;b;) {
      b.callPublish_(a);
      b = b.getParent()
    }
  }else {
    for(var b = 0, c;c = goog.debug.Logger.rootHandlers_[b++];) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(a) {
  if(this.handlers_) {
    for(var b = 0, c;c = this.handlers_[b];b++) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(a) {
  this.parent_ = a
};
goog.debug.Logger.prototype.addChild_ = function(a, b) {
  this.getChildren()[a] = b
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  if(!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger("");
    goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG)
  }
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_
};
goog.debug.LogManager.getLogger = function(a) {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.loggers_[a] || goog.debug.LogManager.createLogger_(a)
};
goog.debug.LogManager.createFunctionForCatchErrors = function(a) {
  return function(b) {
    (a || goog.debug.LogManager.getRoot()).severe("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.line + ")")
  }
};
goog.debug.LogManager.createLogger_ = function(a) {
  var b = new goog.debug.Logger(a);
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var c = a.lastIndexOf("."), d = a.substr(0, c), c = a.substr(c + 1), d = goog.debug.LogManager.getLogger(d);
    d.addChild_(c, b);
    b.setParent_(d)
  }
  return goog.debug.LogManager.loggers_[a] = b
};
goog.json = {};
goog.json.isValid_ = function(a) {
  return/^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
};
goog.json.parse = function(a) {
  a = String(a);
  if(goog.json.isValid_(a)) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
};
goog.json.unsafeParse = function(a) {
  return eval("(" + a + ")")
};
goog.json.serialize = function(a, b) {
  return(new goog.json.Serializer(b)).serialize(a)
};
goog.json.Serializer = function(a) {
  this.replacer_ = a
};
goog.json.Serializer.prototype.serialize = function(a) {
  var b = [];
  this.serialize_(a, b);
  return b.join("")
};
goog.json.Serializer.prototype.serialize_ = function(a, b) {
  switch(typeof a) {
    case "string":
      this.serializeString_(a, b);
      break;
    case "number":
      this.serializeNumber_(a, b);
      break;
    case "boolean":
      b.push(a);
      break;
    case "undefined":
      b.push("null");
      break;
    case "object":
      if(null == a) {
        b.push("null");
        break
      }
      if(goog.isArray(a)) {
        this.serializeArray(a, b);
        break
      }
      this.serializeObject_(a, b);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof a);
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(a, b) {
  b.push('"', a.replace(goog.json.Serializer.charsToReplace_, function(a) {
    if(a in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
    return goog.json.Serializer.charToJsonCharCache_[a] = e + b.toString(16)
  }), '"')
};
goog.json.Serializer.prototype.serializeNumber_ = function(a, b) {
  b.push(isFinite(a) && !isNaN(a) ? a : "null")
};
goog.json.Serializer.prototype.serializeArray = function(a, b) {
  var c = a.length;
  b.push("[");
  for(var d = "", e = 0;e < c;e++) {
    b.push(d), d = a[e], this.serialize_(this.replacer_ ? this.replacer_.call(a, String(e), d) : d, b), d = ","
  }
  b.push("]")
};
goog.json.Serializer.prototype.serializeObject_ = function(a, b) {
  b.push("{");
  var c = "", d;
  for(d in a) {
    if(Object.prototype.hasOwnProperty.call(a, d)) {
      var e = a[d];
      "function" != typeof e && (b.push(c), this.serializeString_(d, b), b.push(":"), this.serialize_(this.replacer_ ? this.replacer_.call(a, d, e) : e, b), c = ",")
    }
  }
  b.push("}")
};
goog.net = {};
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(a) {
  switch(a) {
    case goog.net.ErrorCode.NO_ERROR:
      return"No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return"Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return"File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return"Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return"Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return"An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return"Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return"Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return"Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return"The resource is not available offline";
    default:
      return"Unrecognized error code"
  }
};
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress"};
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, QUIRK_IE_NO_CONTENT:1223};
goog.net.HttpStatus.isSuccess = function(a) {
  switch(a) {
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.CREATED:
    ;
    case goog.net.HttpStatus.ACCEPTED:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
    ;
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return!0;
    default:
      return!1
  }
};
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions())
};
goog.net.WrapperXmlHttpFactory = function(a, b) {
  goog.net.XmlHttpFactory.call(this);
  this.xhrFactory_ = a;
  this.optionsFactory_ = b
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_()
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_()
};
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance()
};
goog.net.XmlHttp.ASSUME_NATIVE_XHR = !1;
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions()
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.setFactory = function(a, b) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(a, b))
};
goog.net.XmlHttp.setGlobalFactory = function(a) {
  goog.net.XmlHttp.factory_ = a
};
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this)
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var a = this.getProgId_();
  return a ? new ActiveXObject(a) : new XMLHttpRequest
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var a = {};
  this.getProgId_() && (a[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = !0, a[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = !0);
  return a
};
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if(goog.net.XmlHttp.ASSUME_NATIVE_XHR) {
    return""
  }
  if(!this.ieProgId_ && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var a = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        return new ActiveXObject(c), this.ieProgId_ = c
      }catch(d) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.ieProgId_
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
goog.net.XhrIo = function(a) {
  goog.events.EventTarget.call(this);
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = a || null
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.debug.Logger.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(a, b, c, d, e, f) {
  var g = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(g);
  b && goog.events.listen(g, goog.net.EventType.COMPLETE, b);
  goog.events.listen(g, goog.net.EventType.READY, goog.partial(goog.net.XhrIo.cleanupSend_, g));
  f && g.setTimeoutInterval(f);
  g.send(a, c, d, e)
};
goog.net.XhrIo.cleanup = function() {
  for(var a = goog.net.XhrIo.sendInstances_;a.length;) {
    a.pop().dispose()
  }
};
goog.net.XhrIo.protectEntryPoints = function(a) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
};
goog.net.XhrIo.cleanupSend_ = function(a) {
  a.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, a)
};
goog.net.XhrIo.prototype.active_ = !1;
goog.net.XhrIo.prototype.xhr_ = null;
goog.net.XhrIo.prototype.xhrOptions_ = null;
goog.net.XhrIo.prototype.lastUri_ = "";
goog.net.XhrIo.prototype.lastMethod_ = "";
goog.net.XhrIo.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
goog.net.XhrIo.prototype.lastError_ = "";
goog.net.XhrIo.prototype.errorDispatched_ = !1;
goog.net.XhrIo.prototype.inSend_ = !1;
goog.net.XhrIo.prototype.inOpen_ = !1;
goog.net.XhrIo.prototype.inAbort_ = !1;
goog.net.XhrIo.prototype.timeoutInterval_ = 0;
goog.net.XhrIo.prototype.timeoutId_ = null;
goog.net.XhrIo.prototype.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
goog.net.XhrIo.prototype.withCredentials_ = !1;
goog.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(a) {
  this.timeoutInterval_ = Math.max(0, a)
};
goog.net.XhrIo.prototype.setResponseType = function(a) {
  this.responseType_ = a
};
goog.net.XhrIo.prototype.getResponseType = function() {
  return this.responseType_
};
goog.net.XhrIo.prototype.setWithCredentials = function(a) {
  this.withCredentials_ = a
};
goog.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_
};
goog.net.XhrIo.prototype.send = function(a, b, c, d) {
  if(this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request");
  }
  b = b ? b.toUpperCase() : "GET";
  this.lastUri_ = a;
  this.lastError_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = b;
  this.errorDispatched_ = !1;
  this.active_ = !0;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  try {
    this.logger_.fine(this.formatMsg_("Opening Xhr")), this.inOpen_ = !0, this.xhr_.open(b, a, !0), this.inOpen_ = !1
  }catch(e) {
    this.logger_.fine(this.formatMsg_("Error opening Xhr: " + e.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, e);
    return
  }
  var a = c || "", f = this.headers.clone();
  d && goog.structs.forEach(d, function(a, b) {
    f.set(b, a)
  });
  "POST" == b && !f.containsKey(goog.net.XhrIo.CONTENT_TYPE_HEADER) && f.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE);
  goog.structs.forEach(f, function(a, b) {
    this.xhr_.setRequestHeader(b, a)
  }, this);
  this.responseType_ && (this.xhr_.responseType = this.responseType_);
  goog.object.containsKey(this.xhr_, "withCredentials") && (this.xhr_.withCredentials = this.withCredentials_);
  try {
    this.timeoutId_ && (goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_), this.timeoutId_ = null), 0 < this.timeoutInterval_ && (this.logger_.fine(this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete")), this.timeoutId_ = goog.Timer.defaultTimerObject.setTimeout(goog.bind(this.timeout_, this), this.timeoutInterval_)), this.logger_.fine(this.formatMsg_("Sending request")), this.inSend_ = !0, this.xhr_.send(a), this.inSend_ = !1
  }catch(g) {
    this.logger_.fine(this.formatMsg_("Send error: " + g.message)), this.error_(goog.net.ErrorCode.EXCEPTION, g)
  }
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp()
};
goog.net.XhrIo.prototype.timeout_ = function() {
  "undefined" != typeof goog && this.xhr_ && (this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting", this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT, this.logger_.fine(this.formatMsg_(this.lastError_)), this.dispatchEvent(goog.net.EventType.TIMEOUT), this.abort(goog.net.ErrorCode.TIMEOUT))
};
goog.net.XhrIo.prototype.error_ = function(a, b) {
  this.active_ = !1;
  this.xhr_ && (this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1);
  this.lastError_ = b;
  this.lastErrorCode_ = a;
  this.dispatchErrors_();
  this.cleanUpXhr_()
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  this.errorDispatched_ || (this.errorDispatched_ = !0, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ERROR))
};
goog.net.XhrIo.prototype.abort = function(a) {
  this.xhr_ && this.active_ && (this.logger_.fine(this.formatMsg_("Aborting")), this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1, this.lastErrorCode_ = a || goog.net.ErrorCode.ABORT, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ABORT), this.cleanUpXhr_())
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  this.xhr_ && (this.active_ && (this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1), this.cleanUpXhr_(!0));
  goog.net.XhrIo.superClass_.disposeInternal.call(this)
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if(!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    this.onReadyStateChangeEntryPoint_()
  }else {
    this.onReadyStateChangeHelper_()
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_()
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if(this.active_ && "undefined" != typeof goog) {
    if(this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && 2 == this.getStatus()) {
      this.logger_.fine(this.formatMsg_("Local request error detected and ignored"))
    }else {
      if(this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.defaultTimerObject.setTimeout(goog.bind(this.onReadyStateChange_, this), 0)
      }else {
        if(this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE), this.isComplete()) {
          this.logger_.fine(this.formatMsg_("Request complete"));
          this.active_ = !1;
          try {
            this.isSuccess() ? (this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.SUCCESS)) : (this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR, this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]", this.dispatchErrors_())
          }finally {
            this.cleanUpXhr_()
          }
        }
      }
    }
  }
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(a) {
  if(this.xhr_) {
    var b = this.xhr_, c = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhrOptions_ = this.xhr_ = null;
    this.timeoutId_ && (goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_), this.timeoutId_ = null);
    a || this.dispatchEvent(goog.net.EventType.READY);
    try {
      b.onreadystatechange = c
    }catch(d) {
      this.logger_.severe("Problem encountered resetting onreadystatechange: " + d.message)
    }
  }
};
goog.net.XhrIo.prototype.isActive = function() {
  return!!this.xhr_
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE
};
goog.net.XhrIo.prototype.isSuccess = function() {
  var a = this.getStatus();
  return goog.net.HttpStatus.isSuccess(a) || 0 === a && !this.isLastUriEffectiveSchemeHttp_()
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var a = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(a)
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1
  }catch(a) {
    return this.logger_.warning("Can not get status: " + a.message), -1
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : ""
  }catch(a) {
    return this.logger_.fine("Can not get status: " + a.message), ""
  }
};
goog.net.XhrIo.prototype.getLastUri = function() {
  return String(this.lastUri_)
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : ""
  }catch(a) {
    return this.logger_.fine("Can not get responseText: " + a.message), ""
  }
};
goog.net.XhrIo.prototype.getResponseXml = function() {
  try {
    return this.xhr_ ? this.xhr_.responseXML : null
  }catch(a) {
    return this.logger_.fine("Can not get responseXML: " + a.message), null
  }
};
goog.net.XhrIo.prototype.getResponseJson = function(a) {
  if(this.xhr_) {
    var b = this.xhr_.responseText;
    a && 0 == b.indexOf(a) && (b = b.substring(a.length));
    return goog.json.parse(b)
  }
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    if(!this.xhr_) {
      return null
    }
    if("response" in this.xhr_) {
      return this.xhr_.response
    }
    switch(this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      ;
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if("mozResponseArrayBuffer" in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer
        }
    }
    this.logger_.severe("Response type " + this.responseType_ + " is not supported on this browser");
    return null
  }catch(a) {
    return this.logger_.fine("Can not get response: " + a.message), null
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(a) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(a) : void 0
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : ""
};
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_
};
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_)
};
goog.net.XhrIo.prototype.formatMsg_ = function(a) {
  return a + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]"
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
});
goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentMode(9) || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", DD:"DD", DEL:"DEL", DFN:"DFN", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", FIELDSET:"FIELDSET", FONT:"FONT", FORM:"FORM", FRAME:"FRAME", 
FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", MAP:"MAP", MENU:"MENU", META:"META", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", P:"P", PARAM:"PARAM", PRE:"PRE", Q:"Q", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SELECT:"SELECT", SMALL:"SMALL", 
SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUP:"SUP", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TITLE:"TITLE", TR:"TR", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO"};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = c.length + d.length;
  goog.dom.classes.add_(c, d);
  a.className = c.join(" ");
  return c.length == e
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = goog.dom.classes.getDifference_(c, d);
  a.className = e.join(" ");
  return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
  for(var c = 0;c < b.length;c++) {
    goog.array.contains(a, b[c]) || a.push(b[c])
  }
};
goog.dom.classes.getDifference_ = function(a, b) {
  return goog.array.filter(a, function(a) {
    return!goog.array.contains(b, a)
  })
};
goog.dom.classes.swap = function(a, b, c) {
  for(var d = goog.dom.classes.get(a), e = !1, f = 0;f < d.length;f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0)
  }
  e && (d.push(c), a.className = d.join(" "));
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  a.className = d.join(" ")
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  for(var c = c || function(a, b) {
    return a == b
  }, d = d || function(b) {
    return a[b]
  }, e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0
  }
  for(var i = 0;i < f + 1;i++) {
    g[0][i] = 0
  }
  for(h = 1;h <= e;h++) {
    for(i = 1;i <= e;i++) {
      g[h][i] = c(a[h - 1], b[i - 1]) ? g[h - 1][i - 1] + 1 : Math.max(g[h - 1][i], g[h][i - 1])
    }
  }
  for(var j = [], h = e, i = f;0 < h && 0 < i;) {
    c(a[h - 1], b[i - 1]) ? (j.unshift(d(h - 1, i - 1)), h--, i--) : g[h - 1][i] > g[h][i - 1] ? h-- : i--
  }
  return j
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
  var b = arguments.length;
  if(2 > b) {
    return 0
  }
  var c = goog.math.average.apply(null, arguments), b = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2)
  })) / (b - 1);
  return Math.sqrt(b)
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? true : !a || !b ? false : a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : !a || !b ? !1 : a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return(this.width + this.height) * 2
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a) {
  this.width = this.width * a;
  this.height = this.height * a;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return!(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      for(var d = {}, e = 0, f = 0, g;g = a[f];f++) {
        b == g.nodeName && (d[e++] = g)
      }
      d.length = e;
      return d
    }
    return a
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    for(f = e = 0;g = a[f];f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g)
    }
    d.length = e;
    return d
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    var a = goog.dom.getViewportSize_(a).height, c = b.body, d = b.documentElement;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a), a = goog.dom.getWindow_(a);
  return new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(a)
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  for(var e = ["<tr>"], f = 0;f < c;f++) {
    e.push(d ? "<td>&nbsp;</td>" : "<td></td>")
  }
  e.push("</tr>");
  e = e.join("");
  c = ["<table>"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("</table>");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
  if(1 == c.childNodes.length) {
    return c.removeChild(c.firstChild)
  }
  for(var d = a.createDocumentFragment();c.firstChild;) {
    d.appendChild(c.firstChild)
  }
  return d
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.STYLE:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;b = a.firstChild;) {
      c.insertBefore(b, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    return a.parentElement
  }
  a = a.parentNode;
  return goog.dom.isElement(a) ? a : null
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if(c) {
    if(1 == c) {
      return arguments[0]
    }
  }else {
    return null
  }
  var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g), g = g.parentNode
    }
    d.push(f);
    e = Math.min(e, f.length)
  }
  f = null;
  for(b = 0;b < e;b++) {
    for(var g = d[0][b], h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }
    f = g
  }
  return f
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      goog.dom.removeChildren(a);
      var c = goog.dom.getOwnerDocument(a);
      a.appendChild(c.createTextNode(b))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var b = goog.dom.getOwnerDocument(a).createElement("div");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(null != a) {
    for(a = a.firstChild;a;) {
      if(b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return!0
      }
      a = a.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var b = a.getAttributeNode("tabindex");
  return b && b.specified ? (a = a.tabIndex, goog.isNumber(a) && 0 <= a && 32768 > a) : !1
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  for(var c = b || goog.dom.getOwnerDocument(a).body, d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  for(var a = [a], d = 0, e;0 < a.length && d < b;) {
    if(e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;0 <= f;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  if(!b && !c) {
    return null
  }
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  c || (a = a.parentNode);
  for(var c = null == d, e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement
  }catch(b) {
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(a)
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
goog.async = {};
goog.async.Deferred = function(a, b) {
  this.chain_ = [];
  this.canceller_ = a;
  this.defaultScope_ = b || null
};
goog.async.Deferred.prototype.fired_ = !1;
goog.async.Deferred.prototype.hadError_ = !1;
goog.async.Deferred.prototype.paused_ = 0;
goog.async.Deferred.prototype.silentlyCancelled_ = !1;
goog.async.Deferred.prototype.chained_ = !1;
goog.async.Deferred.prototype.branches_ = 0;
goog.async.Deferred.prototype.cancel = function(a) {
  if(this.hasFired()) {
    this.result_ instanceof goog.async.Deferred && this.result_.cancel()
  }else {
    if(this.parent_) {
      var b = this.parent_;
      delete this.parent_;
      a ? b.cancel(a) : b.branchCancel_()
    }
    this.canceller_ ? this.canceller_.call(this.defaultScope_, this) : this.silentlyCancelled_ = !0;
    this.hasFired() || this.errback(new goog.async.Deferred.CancelledError(this))
  }
};
goog.async.Deferred.prototype.branchCancel_ = function() {
  this.branches_--;
  0 >= this.branches_ && this.cancel()
};
goog.async.Deferred.prototype.pause_ = function() {
  this.paused_++
};
goog.async.Deferred.prototype.unpause_ = function() {
  this.paused_--;
  0 == this.paused_ && this.hasFired() && this.fire_()
};
goog.async.Deferred.prototype.continue_ = function(a, b) {
  this.resback_(a, b);
  this.unpause_()
};
goog.async.Deferred.prototype.resback_ = function(a, b) {
  this.fired_ = !0;
  this.result_ = b;
  this.hadError_ = !a;
  this.fire_()
};
goog.async.Deferred.prototype.check_ = function() {
  if(this.hasFired()) {
    if(!this.silentlyCancelled_) {
      throw new goog.async.Deferred.AlreadyCalledError(this);
    }
    this.silentlyCancelled_ = !1
  }
};
goog.async.Deferred.prototype.callback = function(a) {
  this.check_();
  this.assertNotDeferred_(a);
  this.resback_(!0, a)
};
goog.async.Deferred.prototype.errback = function(a) {
  this.check_();
  this.assertNotDeferred_(a);
  this.resback_(!1, a)
};
goog.async.Deferred.prototype.assertNotDeferred_ = function(a) {
  goog.asserts.assert(!(a instanceof goog.async.Deferred), "Deferred instances can only be chained if they are the result of a callback")
};
goog.async.Deferred.prototype.addCallback = function(a, b) {
  return this.addCallbacks(a, null, b)
};
goog.async.Deferred.prototype.addErrback = function(a, b) {
  return this.addCallbacks(null, a, b)
};
goog.async.Deferred.prototype.addCallbacks = function(a, b, c) {
  goog.asserts.assert(!this.chained_, "Chained Deferreds can not be re-used");
  this.chain_.push([a, b, c]);
  this.hasFired() && this.fire_();
  return this
};
goog.async.Deferred.prototype.chainDeferred = function(a) {
  this.addCallbacks(a.callback, a.errback, a);
  return this
};
goog.async.Deferred.prototype.awaitDeferred = function(a) {
  return this.addCallback(goog.bind(a.branch, a))
};
goog.async.Deferred.prototype.branch = function(a) {
  var b = new goog.async.Deferred;
  this.chainDeferred(b);
  a && (b.parent_ = this, this.branches_++);
  return b
};
goog.async.Deferred.prototype.addBoth = function(a, b) {
  return this.addCallbacks(a, a, b)
};
goog.async.Deferred.prototype.hasFired = function() {
  return this.fired_
};
goog.async.Deferred.prototype.isError = function(a) {
  return a instanceof Error
};
goog.async.Deferred.prototype.hasErrback_ = function() {
  return goog.array.some(this.chain_, function(a) {
    return goog.isFunction(a[1])
  })
};
goog.async.Deferred.prototype.fire_ = function() {
  this.unhandledExceptionTimeoutId_ && (this.hasFired() && this.hasErrback_()) && (goog.global.clearTimeout(this.unhandledExceptionTimeoutId_), delete this.unhandledExceptionTimeoutId_);
  this.parent_ && (this.parent_.branches_--, delete this.parent_);
  for(var a = this.result_, b = !1, c = !1;this.chain_.length && 0 == this.paused_;) {
    var d = this.chain_.shift(), e = d[0], f = d[1], d = d[2];
    if(e = this.hadError_ ? f : e) {
      try {
        var g = e.call(d || this.defaultScope_, a);
        goog.isDef(g) && (this.hadError_ = this.hadError_ && (g == a || this.isError(g)), this.result_ = a = g);
        a instanceof goog.async.Deferred && (c = !0, this.pause_())
      }catch(h) {
        a = h, this.hadError_ = !0, this.hasErrback_() || (b = !0)
      }
    }
  }
  this.result_ = a;
  c && this.paused_ && (a.addCallbacks(goog.bind(this.continue_, this, !0), goog.bind(this.continue_, this, !1)), a.chained_ = !0);
  b && (this.unhandledExceptionTimeoutId_ = goog.global.setTimeout(function() {
    throw new goog.async.Deferred.UnhandledError(a);
  }, 0))
};
goog.async.Deferred.succeed = function(a) {
  var b = new goog.async.Deferred;
  b.callback(a);
  return b
};
goog.async.Deferred.fail = function(a) {
  var b = new goog.async.Deferred;
  b.errback(a);
  return b
};
goog.async.Deferred.cancelled = function() {
  var a = new goog.async.Deferred;
  a.cancel();
  return a
};
goog.async.Deferred.when = function(a, b, c) {
  return a instanceof goog.async.Deferred ? a.branch(!0).addCallback(b, c) : goog.async.Deferred.succeed(a).addCallback(b, c)
};
goog.async.Deferred.AlreadyCalledError = function(a) {
  goog.debug.Error.call(this);
  this.deferred = a
};
goog.inherits(goog.async.Deferred.AlreadyCalledError, goog.debug.Error);
goog.async.Deferred.AlreadyCalledError.prototype.message = "Already called";
goog.async.Deferred.CancelledError = function(a) {
  goog.debug.Error.call(this);
  this.deferred = a
};
goog.inherits(goog.async.Deferred.CancelledError, goog.debug.Error);
goog.async.Deferred.CancelledError.prototype.message = "Deferred was cancelled";
goog.async.Deferred.UnhandledError = function(a) {
  goog.debug.Error.call(this);
  this.cause = a;
  this.message = "Unhandled Error in Deferred: " + (a.message || "[No message]")
};
goog.inherits(goog.async.Deferred.UnhandledError, goog.debug.Error);
goog.net.jsloader = {};
goog.net.jsloader.GLOBAL_VERIFY_OBJS_ = "closure_verification";
goog.net.jsloader.DEFAULT_TIMEOUT = 5E3;
goog.net.jsloader.scriptsToLoad_ = [];
goog.net.jsloader.loadMany = function(a, b) {
  if(a.length) {
    if(goog.userAgent.GECKO && !goog.userAgent.isVersion(2)) {
      for(var c = 0;c < a.length;c++) {
        goog.net.jsloader.load(a[c], b)
      }
    }else {
      if(c = goog.net.jsloader.scriptsToLoad_.length, goog.array.extend(goog.net.jsloader.scriptsToLoad_, a), !c) {
        var a = goog.net.jsloader.scriptsToLoad_, d = function() {
          var c = a.shift(), c = goog.net.jsloader.load(c, b);
          a.length && c.addBoth(d)
        };
        d()
      }
    }
  }
};
goog.net.jsloader.load = function(a, b) {
  var c = b || {}, d = c.document || document, e = goog.dom.createElement(goog.dom.TagName.SCRIPT), f = {script_:e, timeout_:void 0}, g = new goog.async.Deferred(goog.net.jsloader.cancel_, f), h = null, i = goog.isDefAndNotNull(c.timeout) ? c.timeout : goog.net.jsloader.DEFAULT_TIMEOUT;
  0 < i && (h = window.setTimeout(function() {
    goog.net.jsloader.cleanup_(e, !0);
    g.errback(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.TIMEOUT, "Timeout reached for loading script " + a))
  }, i), f.timeout_ = h);
  e.onload = e.onreadystatechange = function() {
    if(!e.readyState || e.readyState == "loaded" || e.readyState == "complete") {
      goog.net.jsloader.cleanup_(e, c.cleanupWhenDone || false, h);
      g.callback(null)
    }
  };
  e.onerror = function() {
    goog.net.jsloader.cleanup_(e, true, h);
    g.errback(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.LOAD_ERROR, "Error while loading script " + a))
  };
  goog.dom.setProperties(e, {type:"text/javascript", charset:"UTF-8", src:a});
  goog.net.jsloader.getScriptParentElement_(d).appendChild(e);
  return g
};
goog.net.jsloader.loadAndVerify = function(a, b, c) {
  goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_] || (goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_] = {});
  var d = goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_];
  if(goog.isDef(d[b])) {
    return goog.async.Deferred.fail(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.VERIFY_OBJECT_ALREADY_EXISTS, "Verification object " + b + " already defined."))
  }
  var c = goog.net.jsloader.load(a, c), e = new goog.async.Deferred(c.cancel);
  c.addCallback(function() {
    var c = d[b];
    goog.isDef(c) ? (e.callback(c), delete d[b]) : e.errback(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.VERIFY_ERROR, "Script " + a + " loaded, but verification object " + b + " was not defined."))
  });
  c.addErrback(function(a) {
    goog.isDef(d[b]) && delete d[b];
    e.errback(a)
  });
  return e
};
goog.net.jsloader.getScriptParentElement_ = function(a) {
  var b = a.getElementsByTagName(goog.dom.TagName.HEAD);
  return!b || goog.array.isEmpty(b) ? a.documentElement : b[0]
};
goog.net.jsloader.cancel_ = function() {
  if(this && this.script_) {
    var a = this.script_;
    a && "SCRIPT" == a.tagName && goog.net.jsloader.cleanup_(a, !0, this.timeout_)
  }
};
goog.net.jsloader.cleanup_ = function(a, b, c) {
  goog.isDefAndNotNull(c) && goog.global.clearTimeout(c);
  a.onload = goog.nullFunction;
  a.onerror = goog.nullFunction;
  a.onreadystatechange = goog.nullFunction;
  b && window.setTimeout(function() {
    goog.dom.removeNode(a)
  }, 0)
};
goog.net.jsloader.ErrorCode = {LOAD_ERROR:0, TIMEOUT:1, VERIFY_ERROR:2, VERIFY_OBJECT_ALREADY_EXISTS:3};
goog.net.jsloader.Error = function(a, b) {
  var c = "Jsloader error (code #" + a + ")";
  b && (c += ": " + b);
  goog.debug.Error.call(this, c);
  this.code = a
};
goog.inherits(goog.net.jsloader.Error, goog.debug.Error);
goog.net.Jsonp = function(a, b) {
  this.uri_ = new goog.Uri(a);
  this.callbackParamName_ = b ? b : "callback";
  this.timeout_ = 5E3
};
goog.net.Jsonp.CALLBACKS = "_callbacks_";
goog.net.Jsonp.scriptCounter_ = 0;
goog.net.Jsonp.prototype.setRequestTimeout = function(a) {
  this.timeout_ = a
};
goog.net.Jsonp.prototype.getRequestTimeout = function() {
  return this.timeout_
};
goog.net.Jsonp.prototype.send = function(a, b, c, d) {
  a = a || null;
  d = d || "_" + (goog.net.Jsonp.scriptCounter_++).toString(36) + goog.now().toString(36);
  goog.global[goog.net.Jsonp.CALLBACKS] || (goog.global[goog.net.Jsonp.CALLBACKS] = {});
  var e = this.uri_.clone();
  a && goog.net.Jsonp.addPayloadToUri_(a, e);
  b && (b = goog.net.Jsonp.newReplyHandler_(d, b), goog.global[goog.net.Jsonp.CALLBACKS][d] = b, e.setParameterValues(this.callbackParamName_, goog.net.Jsonp.CALLBACKS + "." + d));
  b = goog.net.jsloader.load(e.toString(), {timeout:this.timeout_, cleanupWhenDone:!0});
  c = goog.net.Jsonp.newErrorHandler_(d, a, c);
  b.addErrback(c);
  return{id_:d, deferred_:b}
};
goog.net.Jsonp.prototype.cancel = function(a) {
  a && (a.deferred_ && a.deferred_.cancel(), a.id_ && goog.net.Jsonp.cleanup_(a.id_, !1))
};
goog.net.Jsonp.newErrorHandler_ = function(a, b, c) {
  return function() {
    goog.net.Jsonp.cleanup_(a, !1);
    c && c(b)
  }
};
goog.net.Jsonp.newReplyHandler_ = function(a, b) {
  return function(c) {
    goog.net.Jsonp.cleanup_(a, !0);
    b.apply(void 0, arguments)
  }
};
goog.net.Jsonp.cleanup_ = function(a, b) {
  goog.global[goog.net.Jsonp.CALLBACKS][a] && (b ? delete goog.global[goog.net.Jsonp.CALLBACKS][a] : goog.global[goog.net.Jsonp.CALLBACKS][a] = goog.nullFunction)
};
goog.net.Jsonp.addPayloadToUri_ = function(a, b) {
  for(var c in a) {
    (!a.hasOwnProperty || a.hasOwnProperty(c)) && b.setParameterValues(c, a[c])
  }
  return b
};
goog.window = {};
goog.window.DEFAULT_POPUP_HEIGHT = 500;
goog.window.DEFAULT_POPUP_WIDTH = 690;
goog.window.DEFAULT_POPUP_TARGET = "google_popup";
goog.window.open = function(a, b, c) {
  b || (b = {});
  var d = c || window, c = "undefined" != typeof a.href ? a.href : String(a), a = b.target || a.target, e = [], f;
  for(f in b) {
    switch(f) {
      case "width":
      ;
      case "height":
      ;
      case "top":
      ;
      case "left":
        e.push(f + "=" + b[f]);
        break;
      case "target":
      ;
      case "noreferrer":
        break;
      default:
        e.push(f + "=" + (b[f] ? 1 : 0))
    }
  }
  f = e.join(",");
  if(b.noreferrer) {
    if(b = d.open("", a, f)) {
      goog.userAgent.IE && -1 != c.indexOf(";") && (c = "'" + c.replace(/'/g, "%27") + "'"), b.opener = null, goog.userAgent.WEBKIT ? b.location.href = c : (c = goog.string.htmlEscape(c), b.document.write('<META HTTP-EQUIV="refresh" content="0; url=' + c + '">'), b.document.close())
    }
  }else {
    b = d.open(c, a, f)
  }
  return b
};
goog.window.openBlank = function(a, b, c) {
  a = a ? goog.string.htmlEscape(a) : "";
  return goog.window.open('javascript:"' + encodeURI(a) + '"', b, c)
};
goog.window.popup = function(a, b) {
  b || (b = {});
  b.target = b.target || a.target || goog.window.DEFAULT_POPUP_TARGET;
  b.width = b.width || goog.window.DEFAULT_POPUP_WIDTH;
  b.height = b.height || goog.window.DEFAULT_POPUP_HEIGHT;
  var c = goog.window.open(a, b);
  if(!c) {
    return!0
  }
  c.focus();
  return!1
};
commentum.transports = {};
commentum.transports.ajax_transport = function(a, b, c, d) {
  a = "/" + commentum.settings.path + "/" + a + ".json";
  commentum.settings.host && (a = "http://" + commentum.settings.host + a);
  var e = new goog.Uri.QueryData, f;
  for(f in c) {
    var g = c[f];
    g && e.add(f, g)
  }
  c = function(a) {
    d(a.target.getResponseJson())
  };
  b ? goog.net.XhrIo.send(a, c, "POST", e.toString()) : goog.net.XhrIo.send(a + "?" + e.toString(), c, "GET");
  return!0
};
commentum.transports.ajax_call_transport = function(a, b, c, d) {
  if(b) {
    return!1
  }
  a = "/" + commentum.settings.path + "/" + a + ".jsoncall";
  commentum.settings.host && (a = "http://" + commentum.settings.host + a);
  var b = {}, e;
  for(e in c) {
    var f = c[e];
    f && (b[e] = f)
  }
  (new goog.net.Jsonp(a)).send(b, d);
  return!0
};
commentum.transports.data_view = function(a, b, c, d) {
  var e = new goog.Uri.QueryData, f;
  for(f in c) {
    var g = c[f];
    g && e.add(f, g)
  }
  b.send(a, "http://" + commentum.settings.host + "/" + commentum.settings.path + "/" + a + ".view?" + e.toString(), d);
  return!0
};
commentum.transports.data_popup = function(a, b, c) {
  var d = new goog.Uri.QueryData, e;
  for(e in b) {
    var f = b[e];
    f && d.add(e, f)
  }
  a = "http://" + commentum.settings.host + "/" + commentum.settings.path + "/" + a + ".view?" + d.toString();
  window.script_popup_return = c;
  goog.window.open(a, {resizeable:"yes", location:"yes", scrollbars:"yes", width:400, height:200})
};
commentum.actions = {};
commentum.actions.hooks = [];
commentum.actions.result = function(a) {
  return function(b) {
    commentum.utils.foreach(commentum.actions.hooks, function(a) {
      a(b)
    });
    a(b)
  }
};
commentum.actions.get_page_info = function(a, b) {
  return commentum.actions.transport("page", !1, {page_url:a.id ? null : a.url, page_id:a.id}, commentum.actions.result(b))
};
commentum.actions.get_page_comments = function(a, b) {
  return commentum.actions.transport("page_comments", !1, {page_id:a.id}, commentum.actions.result(b))
};
commentum.actions.get_page_block_comments = function(a, b, c) {
  return commentum.actions.transport("page_block_comments", !1, {page_id:a.id, block_id:b.id}, commentum.actions.result(c))
};
commentum.actions.add_page_comment = function(a, b, c) {
  return commentum.actions.has_view() ? commentum.actions.view("page_comment_add", b, {page_url:a.id ? null : a.url, page_id:a.id}, commentum.actions.result(c)) : commentum.actions.transport("page_comment_add", !1, {page_url:a.id ? null : a.url, page_id:a.id, text:b.text, "public":!0, reply_id:b.reply && b.reply.id}, commentum.actions.result(c))
};
commentum.actions.add_page_block_comment = function(a, b, c, d) {
  return commentum.actions.has_view() ? commentum.actions.view("page_block_comment_add", c, {page_url:a.id ? null : a.url, page_id:a.id, block_text:b.id ? null : b.text, block_id:b.id}, commentum.actions.result(d)) : commentum.actions.transport("page_block_comment_add", !1, {page_url:a.id ? null : a.url, page_id:a.id, block_text:b.id ? null : b.text, block_id:b.id, text:c.text, "public":!0, reply_id:c.reply && c.reply.id}, commentum.actions.result(d))
};
commentum.actions.remove_page_comment = function(a, b, c) {
  return commentum.actions.transport("page_comment_remove", !1, {page_id:a.id, comment_id:b.id}, commentum.actions.result(c))
};
commentum.actions.remove_page_block_comment = function(a, b, c, d) {
  return commentum.actions.transport("page_block_comment_remove", !1, {page_id:a.id, block_id:b.id, comment_id:c.id}, commentum.actions.result(d))
};
commentum.actions.register_user = function(a, b, c) {
  return commentum.actions.transport("user_register", !1, {username:a, password:b}, commentum.actions.result(c))
};
commentum.actions.login_user = function(a, b, c) {
  return commentum.actions.transport("user_login", !1, {username:a, password:b}, commentum.actions.result(c))
};
commentum.actions.logout_user = function(a) {
  return commentum.actions.transport("user_logout", !1, {}, commentum.actions.result(a))
};
commentum.actions.login_user_service = function(a, b) {
  return commentum.transports.data_popup("user_login_service", {service:a}, commentum.actions.result(b))
};
commentum.actions.transport = commentum.utils.apply(function() {
  return commentum.settings.post ? commentum.transports.ajax_transport : commentum.transports.ajax_call_transport
}, commentum.transports);
commentum.actions.view = commentum.utils.apply(function() {
  return commentum.settings.post ? null : commentum.transports.data_view
}, commentum.transports);
commentum.actions.has_view = function() {
  return!commentum.settings.post
};
commentum.framework = {};
commentum.framework.field = function() {
  return new commentum.framework.objects.Field
};
commentum.framework.relation = function(a, b) {
  return new commentum.framework.objects.Relation(a, b)
};
commentum.framework.relations = function(a, b) {
  return new commentum.framework.objects.Relations(a, b)
};
commentum.framework.factory = function(a) {
  a = a || {};
  return function(b) {
    var b = b || {}, c;
    for(c in a) {
      var d = a[c];
      d instanceof commentum.framework.objects.Field && (this[c] = commentum.framework.utils.get(b, c));
      if(d instanceof commentum.framework.objects.Relation || d instanceof commentum.framework.objects.Relations) {
        var e = {}, f;
        for(f in d.actions) {
          e[f] = commentum.framework.utils.action(d.actions[f], d.type, this)
        }
        this[c] = e
      }
    }
    this.object = b
  }
};
commentum.framework.utils = {action:function(a, b, c) {
  return function() {
    for(var d = [], e = 0;e < arguments.length - 1;++e) {
      var f = arguments[e];
      f.object && (f = f.object);
      d.push(f)
    }
    d.push(commentum.framework.utils.callback(b, arguments[arguments.length - 1]));
    return a.apply(c, d)
  }
}, callback:function(a, b) {
  return function(c, d) {
    if(c instanceof Array) {
      for(var e = [], f = 0;f < c.length;++f) {
        e[f] = new a(c[f])
      }
      c = e
    }else {
      if(c instanceof Object && d) {
        e = {};
        for(f in c) {
          e[f] = new a(c[f])
        }
        c = e
      }else {
        c instanceof Object && (c = new a(c))
      }
    }
    b(c)
  }
}, get:function(a, b) {
  return function() {
    return a[b]
  }
}};
commentum.framework.objects = {Field:function() {
}, Relation:function(a, b) {
  this.type = a;
  this.actions = b
}, Relations:function(a, b) {
  this.type = a;
  this.actions = b
}};
commentum.model = {};
commentum.actions.hooks.push(function(a) {
  commentum.settings.auth = a.auth
});
commentum.model.utils = {find:function(a, b) {
  for(var c = 0;c < a.length;++c) {
    var d = !0, e;
    for(e in b) {
      d = d && a[c][e] == b[e]
    }
    if(d) {
      return a[c]
    }
  }
  return null
}, assign:function(a, b) {
  for(var c = 0;c < a.length;++c) {
    for(var d in b) {
      a[c][d] = b[d]
    }
  }
  return a
}, is_empty:function(a) {
  for(var b in a) {
    if(a[b]) {
      return!1
    }
  }
  return!0
}};
commentum.model.User = commentum.framework.factory({id:commentum.framework.field(), username:commentum.framework.field()});
commentum.model.Comment = commentum.framework.factory({id:commentum.framework.field(), date:commentum.framework.field(), text:commentum.framework.field(), reply:commentum.framework.relation(commentum.model.Comment), author:commentum.framework.relation(commentum.model.User, {set:function(a, b) {
  var c = this.object;
  c.author = a;
  c.author.comment = c;
  b(c.author)
}, get:function(a) {
  a(this.object.author)
}})});
commentum.model.Block = commentum.framework.factory({id:commentum.framework.field(), text:commentum.framework.field(), comment_count:commentum.framework.field(), comment_list:commentum.framework.relations(commentum.model.Comment, {insert:function(a, b) {
  var c = this.object;
  commentum.actions.add_page_block_comment(c.page, c, a, function(a) {
    if(!a.result) {
      return b(null)
    }
    var e = a.result.page_id, f = a.result.block_id;
    c.id != f && (c.id = f);
    c.page.id != e && (c.page.id = e);
    c.comment_count++;
    a = a.result.comment;
    a.block = c;
    c.comment_list && c.comment_list.push(a);
    b(a)
  })
}, remove:function() {
}, get:function(a, b) {
  var c = this.object;
  if(c.comment_list) {
    return b(commentum.model.utils.find(c.comment_list, a))
  }
  commentum.actions.get_page_block_comments(c.page, c, function(d) {
    if(!d.result) {
      return b(null)
    }
    c.comment_list = d.result.comment_list;
    c.comment_list = commentum.model.utils.assign(c.comment_list, {block:c});
    b(commentum.model.utils.find(c.comment_list, a))
  })
}, getAll:function(a) {
  var b = this.object;
  if(b.comment_list) {
    return a(b.comment_list)
  }
  commentum.actions.get_page_block_comments(b.page, b, function(c) {
    if(!c.result) {
      return a(null)
    }
    b.comment_list = c.result.comment_list;
    b.comment_list = commentum.model.utils.assign(b.comment_list, {block:b});
    a(b.comment_list)
  })
}})});
commentum.model.Page = commentum.framework.factory({id:commentum.framework.field(), url:commentum.framework.field(), comment_count:commentum.framework.field(), block_list:commentum.framework.relations(commentum.model.Block, {insert:function(a, b) {
  var c = this.object;
  a.id = a.id || 0;
  a.text = a.text || "";
  a.comment_count = a.comment_count || 0;
  a.comment_list = a.comment_list || [];
  a.page = c;
  a.is_new = !0;
  var d = commentum.model.utils.find(c.block_list, {is_new:!0});
  d ? (d = c.block_list.indexOf(d), c.block_list[d] = a) : c.block_list.push(a);
  b(a)
}, get:function(a, b) {
  var c = this.object, d = commentum.model.utils.find(c.block_list, a);
  d && (d.page = c);
  b(d)
}, getAll:function(a) {
  var b = this.object;
  b.block_list = commentum.model.utils.assign(b.block_list, {page:b});
  a(b.block_list)
}}), comment_list:commentum.framework.relations(commentum.model.Comment, {insert:function(a, b) {
  var c = this.object;
  commentum.actions.add_page_comment(c, a, function(a) {
    a.result || b(null);
    var e = a.result.page_id;
    c.id != e && (c.id = e);
    c.comment_count++;
    a = a.result.comment;
    a.page = c;
    c.comment_list && c.comment_list.push(a);
    b(a)
  })
}, remove:function() {
}, get:function(a, b) {
  var c = this.object;
  c.comment_list && b(commentum.model.utils.find(c.comment_list, a));
  commentum.actions.get_page_comments(c, function(d) {
    if(!d.result) {
      return b(null)
    }
    c.comment_list = d.result.comment_list;
    c.comment_list = commentum.model.utils.assign(c.comment_list, {page:c});
    b(commentum.model.utils.find(c.comment_list, a))
  })
}, getAll:function(a) {
  var b = this.object;
  if(b.comment_list) {
    return a(b.comment_list)
  }
  commentum.actions.get_page_comments(b, function(c) {
    if(!c.result) {
      return a(null)
    }
    b.comment_list = c.result.comment_list;
    b.comment_list = commentum.model.utils.assign(b.comment_list, {page:b});
    a(b.comment_list)
  })
}})});
commentum.model.All = commentum.framework.factory({page_list:commentum.framework.relations(commentum.model.Page, {insert:function(a, b) {
  var c = this.object;
  a.id = a.id || 0;
  a.url = a.url || "";
  a.comment_count = a.comment_count || 0;
  a.block_list = a.block_list || [];
  a.comment_list = a.comment_list || [];
  a.objects = c;
  c.page_list = [a];
  b(a)
}, get:function(a, b) {
  var c = this.object;
  if(c.page_list) {
    return b(commentum.model.utils.find(c.page_list, a))
  }
  commentum.actions.get_page_info(a, function(d) {
    if(!d || !d.result) {
      return b(null)
    }
    c.page_list = [d.result];
    c.page_list = commentum.model.utils.assign(c.page_list, {url:a.url, objects:c});
    b(commentum.model.utils.find(c.page_list, a))
  })
}}), user:commentum.framework.relation(commentum.model.User, {register:function(a, b, c) {
  commentum.actions.register_user(a, b, function(a) {
    c(a.result)
  })
}, login:function(a, b, c) {
  commentum.actions.login_user(a, b, function(a) {
    c(a.result)
  })
}, logout:function(a) {
  commentum.actions.logout_user(function(b) {
    a(b.result)
  })
}, login_service:function(a, b) {
  commentum.actions.login_user_service(a, function(a) {
    b(a.result)
  })
}})});
commentum.model.objects = new commentum.model.All;
goog.structs.InversionMap = function(a, b, c) {
  if(a.length != b.length) {
    return null
  }
  this.storeInversion_(a, c);
  this.values = b
};
goog.structs.InversionMap.prototype.storeInversion_ = function(a, b) {
  this.rangeArray = a;
  for(var c = 1;c < a.length;c++) {
    null == a[c] ? a[c] = a[c - 1] + 1 : b && (a[c] += a[c - 1])
  }
};
goog.structs.InversionMap.prototype.spliceInversion = function(a, b, c) {
  var a = new goog.structs.InversionMap(a, b, c), c = a.rangeArray[0], d = goog.array.peek(a.rangeArray), b = this.getLeast(c), d = this.getLeast(d);
  c != this.rangeArray[b] && b++;
  c = d - b + 1;
  goog.partial(goog.array.splice, this.rangeArray, b, c).apply(null, a.rangeArray);
  goog.partial(goog.array.splice, this.values, b, c).apply(null, a.values)
};
goog.structs.InversionMap.prototype.at = function(a) {
  a = this.getLeast(a);
  return 0 > a ? null : this.values[a]
};
goog.structs.InversionMap.prototype.getLeast = function(a) {
  for(var b = this.rangeArray, c = 0, d = b.length;8 < d - c;) {
    var e = d + c >> 1;
    b[e] <= a ? c = e : d = e
  }
  for(;c < d && !(a < b[c]);++c) {
  }
  return c - 1
};
goog.i18n = {};
goog.i18n.GraphemeBreak = {};
goog.i18n.GraphemeBreak.property = {ANY:0, CONTROL:1, EXTEND:2, PREPEND:3, SPACING_MARK:4, L:5, V:6, T:7, LV:8, LVT:9, CR:10, LF:11};
goog.i18n.GraphemeBreak.inversions_ = null;
goog.i18n.GraphemeBreak.applyLegacyBreakRules_ = function(a, b) {
  var c = goog.i18n.GraphemeBreak.property;
  return a == c.CR && b == c.LF ? !1 : a == c.CONTROL || a == c.CR || a == c.LF || b == c.CONTROL || b == c.CR || b == c.LF ? !0 : a == c.L && (b == c.L || b == c.V || b == c.LV || b == c.LVT) || (a == c.LV || a == c.V) && (b == c.V || b == c.T) || (a == c.LVT || a == c.T) && b == c.T || b == c.EXTEND ? !1 : !0
};
goog.i18n.GraphemeBreak.getBreakProp_ = function(a) {
  if(44032 <= a && 55203 >= a) {
    var b = goog.i18n.GraphemeBreak.property;
    return 16 == a % 28 ? b.LV : b.LVT
  }
  goog.i18n.GraphemeBreak.inversions_ || (goog.i18n.GraphemeBreak.inversions_ = new goog.structs.InversionMap([0, 10, 1, 2, 1, 18, 95, 33, 13, 1, 594, 112, 275, 7, 263, 45, 1, 1, 1, 2, 1, 2, 1, 1, 56, 4, 12, 11, 48, 20, 17, 1, 101, 7, 1, 7, 2, 2, 1, 4, 33, 1, 1, 1, 30, 27, 91, 11, 58, 9, 269, 2, 1, 56, 1, 1, 3, 8, 4, 1, 3, 4, 13, 2, 29, 1, 2, 56, 1, 1, 1, 2, 6, 6, 1, 9, 1, 10, 2, 29, 2, 1, 56, 2, 3, 17, 30, 2, 3, 14, 1, 56, 1, 1, 3, 8, 4, 1, 20, 2, 29, 1, 2, 56, 1, 1, 2, 1, 6, 6, 11, 10, 2, 30, 1, 
  59, 1, 1, 1, 12, 1, 9, 1, 41, 3, 58, 3, 5, 17, 11, 2, 30, 2, 56, 1, 1, 1, 1, 2, 1, 3, 1, 5, 11, 11, 2, 30, 2, 58, 1, 2, 5, 7, 11, 10, 2, 30, 2, 70, 6, 2, 6, 7, 19, 2, 60, 11, 5, 5, 1, 1, 8, 97, 13, 3, 5, 3, 6, 74, 2, 27, 1, 1, 1, 1, 1, 4, 2, 49, 14, 1, 5, 1, 2, 8, 45, 9, 1, 100, 2, 4, 1, 6, 1, 2, 2, 2, 23, 2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 1, 2, 2, 6, 1, 1, 1, 112, 96, 72, 82, 357, 1, 946, 3, 29, 3, 29, 2, 30, 2, 64, 2, 1, 7, 8, 1, 2, 11, 9, 1, 45, 3, 155, 1, 118, 3, 4, 2, 9, 1, 6, 3, 116, 17, 
  7, 2, 77, 2, 3, 228, 4, 1, 47, 1, 1, 5, 1, 1, 5, 1, 2, 38, 9, 12, 2, 1, 30, 1, 4, 2, 2, 1, 121, 8, 8, 2, 2, 392, 64, 523, 1, 2, 2, 24, 7, 49, 16, 96, 33, 3311, 32, 554, 6, 105, 2, 30164, 4, 9, 2, 388, 1, 3, 1, 4, 1, 23, 2, 2, 1, 88, 2, 50, 16, 1, 97, 8, 25, 11, 2, 213, 6, 2, 2, 2, 2, 12, 1, 8, 1, 1, 434, 11172, 1116, 1024, 6942, 1, 737, 16, 16, 7, 216, 1, 158, 2, 89, 3, 513, 1, 2051, 15, 40, 8, 50981, 1, 1, 3, 3, 1, 5, 8, 8, 2, 7, 30, 4, 148, 3, 798140, 255], [1, 11, 1, 10, 1, 0, 1, 0, 1, 0, 2, 
  0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 0, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 4, 2, 0, 2, 0, 2, 4, 0, 2, 0, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 0, 2, 0, 4, 0, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 4, 2, 4, 0, 2, 0, 3, 2, 0, 2, 0, 2, 0, 3, 0, 2, 0, 
  2, 0, 2, 0, 2, 0, 2, 0, 4, 0, 2, 4, 2, 0, 2, 0, 2, 0, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 0, 4, 2, 0, 2, 0, 4, 0, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 4, 0, 5, 6, 7, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 4, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 2, 4, 2, 4, 2, 0, 4, 0, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4, 2, 4, 2, 4, 2, 4, 0, 2, 0, 2, 4, 0, 4, 2, 4, 2, 4, 0, 4, 2, 4, 2, 0, 2, 0, 1, 2, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 4, 2, 4, 0, 4, 0, 4, 2, 0, 2, 0, 2, 4, 0, 2, 4, 2, 4, 2, 0, 
  2, 0, 2, 4, 0, 9, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 4, 2, 0, 4, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 1, 2], !0));
  return goog.i18n.GraphemeBreak.inversions_.at(a)
};
goog.i18n.GraphemeBreak.hasGraphemeBreak = function(a, b, c) {
  var a = goog.i18n.GraphemeBreak.getBreakProp_(a), b = goog.i18n.GraphemeBreak.getBreakProp_(b), d = goog.i18n.GraphemeBreak.property;
  return goog.i18n.GraphemeBreak.applyLegacyBreakRules_(a, b) && !(c && (a == d.PREPEND || b == d.SPACING_MARK))
};
goog.format = {};
goog.format.fileSize = function(a, b) {
  return goog.format.numBytesToString(a, b, !1)
};
goog.format.isConvertableScaledNumber = function(a) {
  return goog.format.SCALED_NUMERIC_RE_.test(a)
};
goog.format.stringToNumericValue = function(a) {
  return goog.string.endsWith(a, "B") ? goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_) : goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_SI_)
};
goog.format.stringToNumBytes = function(a) {
  return goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_)
};
goog.format.numericValueToString = function(a, b) {
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_SI_, b)
};
goog.format.numBytesToString = function(a, b, c) {
  var d = "";
  if(!goog.isDef(c) || c) {
    d = "B"
  }
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_BINARY_, b, d)
};
goog.format.stringToNumericValue_ = function(a, b) {
  var c = a.match(goog.format.SCALED_NUMERIC_RE_);
  return!c ? NaN : c[1] * b[c[2]]
};
goog.format.numericValueToString_ = function(a, b, c, d) {
  var e = goog.format.NUMERIC_SCALE_PREFIXES_, f = a, g = "", h = 1;
  0 > a && (a = -a);
  for(var i = 0;i < e.length;i++) {
    var j = e[i], h = b[j];
    if(a >= h || 1 >= h && a > 0.1 * h) {
      g = j;
      break
    }
  }
  g ? d && (g += d) : h = 1;
  a = Math.pow(10, goog.isDef(c) ? c : 2);
  return Math.round(f / h * a) / a + g
};
goog.format.SCALED_NUMERIC_RE_ = /^([-]?\d+\.?\d*)([K,M,G,T,P,k,m,u,n]?)[B]?$/;
goog.format.NUMERIC_SCALE_PREFIXES_ = "P T G M K  m u n".split(" ");
goog.format.NUMERIC_SCALES_SI_ = {"":1, n:1E-9, u:1E-6, m:0.001, k:1E3, K:1E3, M:1E6, G:1E9, T:1E12, P:1E15};
goog.format.NUMERIC_SCALES_BINARY_ = {"":1, n:Math.pow(1024, -3), u:Math.pow(1024, -2), m:1 / 1024, k:1024, K:1024, M:Math.pow(1024, 2), G:Math.pow(1024, 3), T:Math.pow(1024, 4), P:Math.pow(1024, 5)};
goog.format.FIRST_GRAPHEME_EXTEND_ = 768;
goog.format.isTreatedAsBreakingSpace_ = function(a) {
  return a <= goog.format.WbrToken_.SPACE || 4096 <= a && (8192 <= a && 8198 >= a || 8200 <= a && 8203 >= a || 5760 == a || 6158 == a || 8232 == a || 8233 == a || 8287 == a || 12288 == a)
};
goog.format.isInvisibleFormattingCharacter_ = function(a) {
  return 8204 <= a && 8207 >= a || 8234 <= a && 8238 >= a
};
goog.format.insertWordBreaksGeneric_ = function(a, b, c) {
  c = c || 10;
  if(c > a.length) {
    return a
  }
  for(var d = [], e = 0, f = 0, g = 0, h = 0, i = 0;i < a.length;i++) {
    var j = h, h = a.charCodeAt(i), j = h >= goog.format.FIRST_GRAPHEME_EXTEND_ && !b(j, h, !0);
    e >= c && (!goog.format.isTreatedAsBreakingSpace_(h) && !j) && (d.push(a.substring(g, i), goog.format.WORD_BREAK_HTML), g = i, e = 0);
    f ? h == goog.format.WbrToken_.GT && f == goog.format.WbrToken_.LT ? f = 0 : h == goog.format.WbrToken_.SEMI_COLON && f == goog.format.WbrToken_.AMP && (f = 0, e++) : h == goog.format.WbrToken_.LT || h == goog.format.WbrToken_.AMP ? f = h : goog.format.isTreatedAsBreakingSpace_(h) ? e = 0 : goog.format.isInvisibleFormattingCharacter_(h) || e++
  }
  d.push(a.substr(g));
  return d.join("")
};
goog.format.insertWordBreaks = function(a, b) {
  return goog.format.insertWordBreaksGeneric_(a, goog.i18n.GraphemeBreak.hasGraphemeBreak, b)
};
goog.format.conservativelyHasGraphemeBreak_ = function(a, b) {
  return 1024 <= b && 1315 > b
};
goog.format.insertWordBreaksBasic = function(a, b) {
  return goog.format.insertWordBreaksGeneric_(a, goog.format.conservativelyHasGraphemeBreak_, b)
};
goog.format.IS_IE8_OR_ABOVE_ = goog.userAgent.IE && goog.userAgent.isVersion(8);
goog.format.WORD_BREAK_HTML = goog.userAgent.WEBKIT ? "<wbr></wbr>" : goog.userAgent.OPERA ? "&shy;" : goog.format.IS_IE8_OR_ABOVE_ ? "&#8203;" : "<wbr>";
goog.format.WbrToken_ = {LT:60, GT:62, AMP:38, SEMI_COLON:59, SPACE:32};
goog.i18n.bidi = {};
goog.i18n.bidi.FORCE_RTL = !1;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0, 2).toLowerCase()) && (2 == goog.LOCALE.length || "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3));
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {RTL:-1, UNKNOWN:0, LTR:1};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(a) {
  return"number" == typeof a ? 0 < a ? goog.i18n.bidi.Dir.LTR : 0 > a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.UNKNOWN : a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u07ff\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(a, b) {
  return b ? a.replace(goog.i18n.bidi.htmlSkipReg_, " ") : a
};
goog.i18n.bidi.rtlCharReg_ = RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(a, b) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(a, b) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.ltrRe_ = RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(a) {
  return goog.i18n.bidi.rtlRe_.test(a)
};
goog.i18n.bidi.isLtrChar = function(a) {
  return goog.i18n.bidi.ltrRe_.test(a)
};
goog.i18n.bidi.isNeutralChar = function(a) {
  return!goog.i18n.bidi.isLtrChar(a) && !goog.i18n.bidi.isRtlChar(a)
};
goog.i18n.bidi.ltrDirCheckRe_ = RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(a, b) {
  a = goog.i18n.bidi.stripHtmlIfNeeded_(a, b);
  return goog.i18n.bidi.isRequiredLtrRe_.test(a) || !goog.i18n.bidi.hasAnyLtr(a) && !goog.i18n.bidi.hasAnyRtl(a)
};
goog.i18n.bidi.ltrExitDirCheckRe_ = RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = RegExp("^(ar|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i");
goog.i18n.bidi.isRtlLanguage = function(a) {
  return goog.i18n.bidi.rtlLocalesRe_.test(a)
};
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInHtml = function(a, b) {
  return(void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>") : a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>")
};
goog.i18n.bidi.guardBracketInText = function(a, b) {
  var c = (void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return a.replace(goog.i18n.bidi.bracketGuardTextRe_, c + "$&" + c)
};
goog.i18n.bidi.enforceRtlInHtml = function(a) {
  return"<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>"
};
goog.i18n.bidi.enforceRtlInText = function(a) {
  return goog.i18n.bidi.Format.RLE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.enforceLtrInHtml = function(a) {
  return"<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>"
};
goog.i18n.bidi.enforceLtrInText = function(a) {
  return goog.i18n.bidi.Format.LRE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(a) {
  return a.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT)
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(a) {
  return a.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /\d/;
goog.i18n.bidi.rtlDetectionThreshold_ = 0.4;
goog.i18n.bidi.estimateDirection = function(a, b) {
  for(var c = 0, d = 0, e = !1, f = goog.i18n.bidi.stripHtmlIfNeeded_(a, b).split(goog.i18n.bidi.wordSeparatorRe_), g = 0;g < f.length;g++) {
    var h = f[g];
    goog.i18n.bidi.startsWithRtl(h) ? (c++, d++) : goog.i18n.bidi.isRequiredLtrRe_.test(h) ? e = !0 : goog.i18n.bidi.hasAnyLtr(h) ? d++ : goog.i18n.bidi.hasNumeralsRe_.test(h) && (e = !0)
  }
  return 0 == d ? e ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.UNKNOWN : c / d > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.detectRtlDirectionality = function(a, b) {
  return goog.i18n.bidi.estimateDirection(a, b) == goog.i18n.bidi.Dir.RTL
};
goog.i18n.bidi.setElementDirAndAlign = function(a, b) {
  if(a && (b = goog.i18n.bidi.toDir(b)) != goog.i18n.bidi.Dir.UNKNOWN) {
    a.style.textAlign = b == goog.i18n.bidi.Dir.RTL ? "right" : "left", a.dir = b == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
  }
};
goog.i18n.BidiFormatter = function(a, b) {
  this.contextDir_ = goog.i18n.bidi.toDir(a);
  this.alwaysSpan_ = !!b
};
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.contextDir_
};
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
  return this.alwaysSpan_
};
goog.i18n.BidiFormatter.prototype.setContextDir = function(a) {
  this.contextDir_ = goog.i18n.bidi.toDir(a)
};
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(a) {
  this.alwaysSpan_ = a
};
goog.i18n.BidiFormatter.prototype.estimateDirection = goog.i18n.bidi.estimateDirection;
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(a, b) {
  return 0 > a * b
};
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(a, b, c, d) {
  return d && (this.areDirectionalitiesOpposite_(b, this.contextDir_) || this.contextDir_ == goog.i18n.bidi.Dir.LTR && goog.i18n.bidi.endsWithRtl(a, c) || this.contextDir_ == goog.i18n.bidi.Dir.RTL && goog.i18n.bidi.endsWithLtr(a, c)) ? this.contextDir_ == goog.i18n.bidi.Dir.LTR ? goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM : ""
};
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(a, b) {
  return this.knownDirAttrValue(this.estimateDirection(a, b))
};
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(a) {
  a == goog.i18n.bidi.Dir.UNKNOWN && (a = this.contextDir_);
  return a == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
};
goog.i18n.BidiFormatter.prototype.dirAttr = function(a, b) {
  return this.knownDirAttr(this.estimateDirection(a, b))
};
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(a) {
  return a != this.contextDir_ ? a == goog.i18n.bidi.Dir.RTL ? "dir=rtl" : a == goog.i18n.bidi.Dir.LTR ? "dir=ltr" : "" : ""
};
goog.i18n.BidiFormatter.prototype.spanWrap = function(a, b, c) {
  var d = this.estimateDirection(a, b);
  return this.spanWrapWithKnownDir(d, a, b, c)
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(a, b, c, d) {
  var d = d || void 0 == d, e = a != goog.i18n.bidi.Dir.UNKNOWN && a != this.contextDir_;
  c || (b = goog.string.htmlEscape(b));
  c = [];
  this.alwaysSpan_ || e ? (c.push("<span"), e && c.push(a == goog.i18n.bidi.Dir.RTL ? " dir=rtl" : " dir=ltr"), c.push(">" + b + "</span>")) : c.push(b);
  c.push(this.dirResetIfNeeded_(b, a, !0, d));
  return c.join("")
};
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(a, b, c) {
  var d = this.estimateDirection(a, b);
  return this.unicodeWrapWithKnownDir(d, a, b, c)
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(a, b, c, d) {
  var d = d || void 0 == d, e = [];
  a != goog.i18n.bidi.Dir.UNKNOWN && a != this.contextDir_ ? (e.push(a == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE : goog.i18n.bidi.Format.LRE), e.push(b), e.push(goog.i18n.bidi.Format.PDF)) : e.push(b);
  e.push(this.dirResetIfNeeded_(b, a, c, d));
  return e.join("")
};
goog.i18n.BidiFormatter.prototype.markAfter = function(a, b) {
  return this.dirResetIfNeeded_(a, this.estimateDirection(a, b), b, !0)
};
goog.i18n.BidiFormatter.prototype.mark = function() {
  switch(this.contextDir_) {
    case goog.i18n.bidi.Dir.LTR:
      return goog.i18n.bidi.Format.LRM;
    case goog.i18n.bidi.Dir.RTL:
      return goog.i18n.bidi.Format.RLM;
    default:
      return""
  }
};
goog.i18n.BidiFormatter.prototype.startEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT
};
goog.i18n.BidiFormatter.prototype.endEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT
};
goog.soy = {};
goog.soy.renderElement = function(a, b, c, d) {
  a.innerHTML = b(c || goog.soy.defaultTemplateData_, void 0, d)
};
goog.soy.renderAsFragment = function(a, b, c, d) {
  return(d || goog.dom.getDomHelper()).htmlToDocumentFragment(a(b || goog.soy.defaultTemplateData_, void 0, c))
};
goog.soy.renderAsElement = function(a, b, c, d) {
  d = (d || goog.dom.getDomHelper()).createElement(goog.dom.TagName.DIV);
  d.innerHTML = a(b || goog.soy.defaultTemplateData_, void 0, c);
  return 1 == d.childNodes.length && (a = d.firstChild, a.nodeType == goog.dom.NodeType.ELEMENT) ? a : d
};
goog.soy.defaultTemplateData_ = {};
goog.string.StringBuffer = function(a, b) {
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a
};
goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = ""
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_
};
var soy = {esc:{}}, soydata = {};
soy.StringBuilder = goog.string.StringBuffer;
soydata.SanitizedContentKind = {HTML:0, JS_STR_CHARS:1, URI:2, HTML_ATTRIBUTE:3};
soydata.SanitizedContent = function(a) {
  this.content = a
};
soydata.SanitizedContent.prototype.toString = function() {
  return this.content
};
soydata.SanitizedHtml = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedHtml, soydata.SanitizedContent);
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML;
soydata.SanitizedJsStrChars = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedJsStrChars, soydata.SanitizedContent);
soydata.SanitizedJsStrChars.prototype.contentKind = soydata.SanitizedContentKind.JS_STR_CHARS;
soydata.SanitizedUri = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedUri, soydata.SanitizedContent);
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI;
soydata.SanitizedHtmlAttribute = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedHtmlAttribute, soydata.SanitizedContent);
soydata.SanitizedHtmlAttribute.prototype.contentKind = soydata.SanitizedContentKind.HTML_ATTRIBUTE;
soy.renderElement = goog.soy.renderElement;
soy.renderAsFragment = function(a, b, c, d) {
  return goog.soy.renderAsFragment(a, b, d, new goog.dom.DomHelper(c))
};
soy.renderAsElement = function(a, b, c, d) {
  return goog.soy.renderAsElement(a, b, d, new goog.dom.DomHelper(c))
};
soy.$$augmentData = function(a, b) {
  function c() {
  }
  c.prototype = a;
  var d = new c, e;
  for(e in b) {
    d[e] = b[e]
  }
  return d
};
soy.$$getMapKeys = function(a) {
  var b = [], c;
  for(c in a) {
    b.push(c)
  }
  return b
};
soy.$$getDelegateId = function(a) {
  return a
};
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};
soy.$$registerDelegateFn = function(a, b, c) {
  var d = "key_" + a, e = soy.$$DELEGATE_REGISTRY_PRIORITIES_[d];
  if(void 0 === e || b > e) {
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[d] = b, soy.$$DELEGATE_REGISTRY_FUNCTIONS_[d] = c
  }else {
    if(b == e) {
      throw Error('Encountered two active delegates with same priority (id/name "' + a + '").');
    }
  }
};
soy.$$getDelegateFn = function(a) {
  return(a = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + a]) ? a : soy.$$EMPTY_TEMPLATE_FN_
};
soy.$$EMPTY_TEMPLATE_FN_ = function() {
  return""
};
soy.$$escapeHtml = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? a.content : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$escapeHtmlRcdata = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? soy.esc.$$normalizeHtmlHelper(a.content) : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$stripHtmlTags = function(a) {
  return String(a).replace(soy.esc.$$HTML_TAG_REGEX_, "")
};
soy.$$escapeHtmlAttribute = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(a.content)) : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$escapeHtmlAttributeNospace = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? soy.esc.$$normalizeHtmlNospaceHelper(soy.$$stripHtmlTags(a.content)) : soy.esc.$$escapeHtmlNospaceHelper(a)
};
soy.$$filterHtmlAttribute = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML_ATTRIBUTE ? a.content.replace(/=([^"']*)$/, '="$1"') : soy.esc.$$filterHtmlAttributeHelper(a)
};
soy.$$filterHtmlElementName = function(a) {
  return soy.esc.$$filterHtmlElementNameHelper(a)
};
soy.$$escapeJs = function(a) {
  return soy.$$escapeJsString(a)
};
soy.$$escapeJsString = function(a) {
  return"object" === typeof a && a.contentKind === soydata.SanitizedContentKind.JS_STR_CHARS ? a.content : soy.esc.$$escapeJsStringHelper(a)
};
soy.$$escapeJsValue = function(a) {
  if(null == a) {
    return" null "
  }
  switch(typeof a) {
    case "boolean":
    ;
    case "number":
      return" " + a + " ";
    default:
      return"'" + soy.esc.$$escapeJsStringHelper(String(a)) + "'"
  }
};
soy.$$escapeJsRegex = function(a) {
  return soy.esc.$$escapeJsRegexHelper(a)
};
soy.$$problematicUriMarks_ = /['()]/g;
soy.$$pctEncode_ = function(a) {
  return"%" + a.charCodeAt(0).toString(16)
};
soy.$$escapeUri = function(a) {
  if("object" === typeof a && a.contentKind === soydata.SanitizedContentKind.URI) {
    return soy.$$normalizeUri(a)
  }
  a = soy.esc.$$escapeUriHelper(a);
  soy.$$problematicUriMarks_.lastIndex = 0;
  return soy.$$problematicUriMarks_.test(a) ? a.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_) : a
};
soy.$$normalizeUri = function(a) {
  return soy.esc.$$normalizeUriHelper(a)
};
soy.$$filterNormalizeUri = function(a) {
  return soy.esc.$$filterNormalizeUriHelper(a)
};
soy.$$escapeCssString = function(a) {
  return soy.esc.$$escapeCssStringHelper(a)
};
soy.$$filterCssValue = function(a) {
  return null == a ? "" : soy.esc.$$filterCssValueHelper(a)
};
soy.$$changeNewlineToBr = function(a) {
  return goog.string.newLineToBr(String(a), !1)
};
soy.$$insertWordBreaks = function(a, b) {
  return goog.format.insertWordBreaks(String(a), b)
};
soy.$$truncate = function(a, b, c) {
  a = String(a);
  if(a.length <= b) {
    return a
  }
  c && (3 < b ? b -= 3 : c = !1);
  soy.$$isHighSurrogate_(a.charAt(b - 1)) && soy.$$isLowSurrogate_(a.charAt(b)) && (b -= 1);
  a = a.substring(0, b);
  c && (a += "...");
  return a
};
soy.$$isHighSurrogate_ = function(a) {
  return 55296 <= a && 56319 >= a
};
soy.$$isLowSurrogate_ = function(a) {
  return 56320 <= a && 57343 >= a
};
soy.$$bidiFormatterCache_ = {};
soy.$$getBidiFormatterInstance_ = function(a) {
  return soy.$$bidiFormatterCache_[a] || (soy.$$bidiFormatterCache_[a] = new goog.i18n.BidiFormatter(a))
};
soy.$$bidiTextDir = function(a, b) {
  return!a ? 0 : goog.i18n.bidi.detectRtlDirectionality(a, b) ? -1 : 1
};
soy.$$bidiDirAttr = function(a, b, c) {
  return new soydata.SanitizedHtmlAttribute(soy.$$getBidiFormatterInstance_(a).dirAttr(b, c))
};
soy.$$bidiMarkAfter = function(a, b, c) {
  return soy.$$getBidiFormatterInstance_(a).markAfter(b, c)
};
soy.$$bidiSpanWrap = function(a, b) {
  return soy.$$getBidiFormatterInstance_(a).spanWrap(b + "", !0)
};
soy.$$bidiUnicodeWrap = function(a, b) {
  return soy.$$getBidiFormatterInstance_(a).unicodeWrap(b + "", !0)
};
soy.esc.$$escapeUriHelper = function(a) {
  return goog.string.urlEncode(String(a))
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {"\x00":"&#0;", '"':"&quot;", "&":"&amp;", "'":"&#39;", "<":"&lt;", ">":"&gt;", "\t":"&#9;", "\n":"&#10;", "\x0B":"&#11;", "\f":"&#12;", "\r":"&#13;", " ":"&#32;", "-":"&#45;", "/":"&#47;", "=":"&#61;", "`":"&#96;", "\u0085":"&#133;", "\u00a0":"&#160;", "\u2028":"&#8232;", "\u2029":"&#8233;"};
soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {"\x00":"\\x00", "\b":"\\x08", "\t":"\\t", "\n":"\\n", "\x0B":"\\x0b", "\f":"\\f", "\r":"\\r", '"':"\\x22", "&":"\\x26", "'":"\\x27", "/":"\\/", "<":"\\x3c", "=":"\\x3d", ">":"\\x3e", "\\":"\\\\", "\u0085":"\\x85", "\u2028":"\\u2028", "\u2029":"\\u2029", $:"\\x24", "(":"\\x28", ")":"\\x29", "*":"\\x2a", "+":"\\x2b", ",":"\\x2c", "-":"\\x2d", ".":"\\x2e", ":":"\\x3a", "?":"\\x3f", "[":"\\x5b", "]":"\\x5d", "^":"\\x5e", "{":"\\x7b", 
"|":"\\x7c", "}":"\\x7d"};
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {"\x00":"\\0 ", "\b":"\\8 ", "\t":"\\9 ", "\n":"\\a ", "\x0B":"\\b ", "\f":"\\c ", "\r":"\\d ", '"':"\\22 ", "&":"\\26 ", "'":"\\27 ", "(":"\\28 ", ")":"\\29 ", "*":"\\2a ", "/":"\\2f ", ":":"\\3a ", ";":"\\3b ", "<":"\\3c ", "=":"\\3d ", ">":"\\3e ", "@":"\\40 ", "\\":"\\5c ", "{":"\\7b ", "}":"\\7d ", "\u0085":"\\85 ", "\u00a0":"\\a0 ", "\u2028":"\\2028 ", "\u2029":"\\2029 "};
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = {"\x00":"%00", "\u0001":"%01", "\u0002":"%02", "\u0003":"%03", "\u0004":"%04", "\u0005":"%05", "\u0006":"%06", "\u0007":"%07", "\b":"%08", "\t":"%09", "\n":"%0A", "\x0B":"%0B", "\f":"%0C", "\r":"%0D", "\u000e":"%0E", "\u000f":"%0F", "\u0010":"%10", "\u0011":"%11", "\u0012":"%12", "\u0013":"%13", "\u0014":"%14", "\u0015":"%15", "\u0016":"%16", "\u0017":"%17", "\u0018":"%18", "\u0019":"%19", "\u001a":"%1A", "\u001b":"%1B", "\u001c":"%1C", 
"\u001d":"%1D", "\u001e":"%1E", "\u001f":"%1F", " ":"%20", '"':"%22", "'":"%27", "(":"%28", ")":"%29", "<":"%3C", ">":"%3E", "\\":"%5C", "{":"%7B", "}":"%7D", "\u007f":"%7F", "\u0085":"%C2%85", "\u00a0":"%C2%A0", "\u2028":"%E2%80%A8", "\u2029":"%E2%80%A9", "\uff01":"%EF%BC%81", "\uff03":"%EF%BC%83", "\uff04":"%EF%BC%84", "\uff06":"%EF%BC%86", "\uff07":"%EF%BC%87", "\uff08":"%EF%BC%88", "\uff09":"%EF%BC%89", "\uff0a":"%EF%BC%8A", "\uff0b":"%EF%BC%8B", "\uff0c":"%EF%BC%8C", "\uff0f":"%EF%BC%8F", "\uff1a":"%EF%BC%9A", 
"\uff1b":"%EF%BC%9B", "\uff1d":"%EF%BC%9D", "\uff1f":"%EF%BC%9F", "\uff20":"%EF%BC%A0", "\uff3b":"%EF%BC%BB", "\uff3d":"%EF%BC%BD"};
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_[a]
};
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_ = /[\x00\x22\x26\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i;
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTE_ = /^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*)$/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i;
soy.esc.$$escapeHtmlHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeJsStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeJsRegexHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeCssStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_)
};
soy.esc.$$filterCssValueHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterCssValue", [a]), "zSoyz") : a
};
soy.esc.$$normalizeUriHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterNormalizeUriHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterNormalizeUri", [a]), "zSoyz") : a.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterHtmlAttributeHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTE_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterHtmlAttribute", [a]), "zSoyz") : a
};
soy.esc.$$filterHtmlElementNameHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterHtmlElementName", [a]), "zSoyz") : a
};
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?[a-zA-Z])(?:[^>'"]|"[^"]*"|'[^']*')*>/g;
commentum.templates = {};
commentum.templates.Page = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div class="page_info" id="', soy.$$escapeHtml(a.page.panelId), '"><div class="page_control"><div class="page_control_toggle page_content_toggle" id="', soy.$$escapeHtml(a.page.commentsShowId), '">*</div><div class="page_control_toggle page_blocks_toggle">b</div><div class="clear"></div></div><div class="page_content" id="', soy.$$escapeHtml(a.page.commentsId), '"></div></div>');
  return b ? "" : c.toString()
};
commentum.templates.Block = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<span class="block_info" id="', soy.$$escapeHtml(a.block.id), '">', soy.$$escapeHtml(a.block.content), '</span><span class="block_info_hint" id="', soy.$$escapeHtml(a.block.hintSpanId), '"> <span class="block_info_hint_content" id="', soy.$$escapeHtml(a.block.hintId), '">');
  commentum.templates.BlockCommentCount(a, c);
  c.append("</span></span>");
  return b ? "" : c.toString()
};
commentum.templates.BlockCommentCount = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<span id="', soy.$$escapeHtml(a.block.commentCountId), '">', a.block.commentCount ? soy.$$escapeHtml(a.block.commentCount) : soy.$$escapeHtml(a.strings.block_add), "</span>");
  return b ? "" : c.toString()
};
commentum.templates.PageComments = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div class="page_comments" id="', soy.$$escapeHtml(a.page_comments.id), '"><div class="page_comments_info" id="', soy.$$escapeHtml(a.page_comments.commentsId), '"></div><div class="page_comments_post comment_post" id="', soy.$$escapeHtml(a.page_comments.commentsPostId), '"></div></div>');
  return b ? "" : c.toString()
};
commentum.templates.PageCommentsSearch = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div class="page_comments_search" id="', soy.$$escapeHtml(a.page_comments_search.id), '"><input type="text" size="40" name="" id="', soy.$$escapeHtml(a.page_comments_search.textId), '" /><div class="page_comments_search_button">s</div></div>');
  return b ? "" : c.toString()
};
commentum.templates.BlockComments = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<span style="position: relative" id="', soy.$$escapeHtml(a.block_comments.id), '"><div style="position: absolute; left: 0px; bottom: 0px"><div style="position: absolute; left: 0px; top: 0px"><div class="block_comments"><div class="block_comments_info" id="', soy.$$escapeHtml(a.block_comments.commentsId), '"></div><div class="block_comments_post comment_post" id="', soy.$$escapeHtml(a.block_comments.commentsPostId), '"></div></div></div></div></span>');
  return b ? "" : c.toString()
};
commentum.templates.Comment = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div class="comment_info" id="', soy.$$escapeHtml(a.comment.id), '"><div class="comment_width"><div class="comment_info_meta"><div class="comment_info_photo"></div><div class="comment_info_author">', soy.$$escapeHtml(a.comment.author.username), '</div></div><div class="comment_info_content"><div class="comment_info_date">', soy.$$escapeHtml(a.comment.date), '</div><div class="comment_info_text">', soy.$$escapeHtml(a.comment.text), '</div></div><div class="clear"></div></div></div>');
  return b ? "" : c.toString()
};
commentum.templates.CommentPost = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div id="', soy.$$escapeHtml(a.comment_post.id), '"><form class="comment_post_form comment_width"><div><textarea id="', soy.$$escapeHtml(a.comment_post.textId), '" class="comment_post_text"></textarea></div><div><input id="', soy.$$escapeHtml(a.comment_post.submitId), '" class="comment_post_submit" type="button" value="', soy.$$escapeHtml(a.strings.comment_post_submit), '" /></div><div class="clear"></div></form></div>');
  return b ? "" : c.toString()
};
commentum.templates.CommentPostAuth = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div id="', soy.$$escapeHtml(a.comment_post.id), '"><form class="comment_post_login_form comment_width"><div class="comment_post_login"><label class="comment_post_login" for="', soy.$$escapeHtml(a.comment_post.loginId), '">', soy.$$escapeHtml(a.strings.comment_post_login), '</label>&nbsp;<input type="text" class="comment_post_login" id="', soy.$$escapeHtml(a.comment_post.loginId), '" /><div class="clear"></div></div><div class="comment_post_password"><label class="comment_post_password" for="', 
  soy.$$escapeHtml(a.comment_post.passwordId), '">', soy.$$escapeHtml(a.strings.comment_post_password), '</label>&nbsp;<input type="password" class="comment_post_password" id="', soy.$$escapeHtml(a.comment_post.passwordId), '" /><div class="clear"></div></div><div class="comment_post_login_submit"><input id="', soy.$$escapeHtml(a.comment_post.signInId), '" class="comment_post_login_signin" type="button" value="', soy.$$escapeHtml(a.strings.comment_post_login_signin), '" /><input id="', soy.$$escapeHtml(a.comment_post.signUpId), 
  '" class="comment_post_login_signup" type="button" value="', soy.$$escapeHtml(a.strings.comment_post_login_signup), '" /><div class="clear"></div></div><div class="line"></div><div class="comment_post_login_other"><label class="comment_post_login_other">', soy.$$escapeHtml(a.strings.comment_post_login_other), "</label>");
  for(var d = a.comment_post.loginServices, e = d.length, f = 0;f < e;f++) {
    var g = d[f];
    c.append('<span id="', soy.$$escapeHtml(a.comment_post.loginServiceId), soy.$$escapeHtml(g), '" class="icon" style="cursor: pointer; margin-right: 12px; background-image: url(\'/static/images/icon-', soy.$$escapeHtml(g), ".png')\"></span>")
  }
  c.append("</div></form></div>");
  return b ? "" : c.toString()
};
commentum.templates.CommentPostFrame = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div id="', soy.$$escapeHtml(a.comment_post.id), '"><div id="', soy.$$escapeHtml(a.comment_post.splashId), '" class="comment_post_frame_splash comment_width">Loading...</div></div>');
  return b ? "" : c.toString()
};
commentum.templates.BlockMarker = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<span class="block_info_hint block_info_hint_selected" id="', soy.$$escapeHtml(a.block_marker.id), '"> <span class="block_info_hint_content" id="', soy.$$escapeHtml(a.block_marker.hintId), '">', soy.$$escapeHtml(a.strings.block_add), "</span></span>");
  return b ? "" : c.toString()
};
commentum.templates.FramePageComments = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div class="comment_post comment_post_inframe" id=', soy.$$escapeHtml(a.page_comments.id), "><div id=", soy.$$escapeHtml(a.page_comments.commentsPostId), "></div></div>");
  return b ? "" : c.toString()
};
commentum.templates.FrameBlockComments = function(a, b) {
  var c = b || new soy.StringBuilder;
  c.append('<div class="comment_post comment_post_inframe" id=', soy.$$escapeHtml(a.block_comments.id), "><div id=", soy.$$escapeHtml(a.block_comments.commentsPostId), "></div></div>");
  return b ? "" : c.toString()
};
commentum.strings = {};
commentum.strings.block_add = "+";
commentum.strings.comment_post_submit = "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c";
commentum.strings.comment_post_login = "\u0418\u043c\u044f:";
commentum.strings.comment_post_password = "\u041f\u0430\u0440\u043e\u043b\u044c:";
commentum.strings.comment_post_login_signin = "\u0412\u043e\u0439\u0442\u0438";
commentum.strings.comment_post_login_signup = "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f";
commentum.strings.comment_post_login_other = "\u0418\u043b\u0438:";
goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d
};
goog.math.Box.boundingBox = function(a) {
  for(var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1;c < arguments.length;c++) {
    var d = arguments[c];
    b.top = Math.min(b.top, d.y);
    b.right = Math.max(b.right, d.x);
    b.bottom = Math.max(b.bottom, d.y);
    b.left = Math.min(b.left, d.x)
  }
  return b
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
  if(goog.isObject(a)) {
    this.top = this.top - a.top;
    this.right = this.right + a.right;
    this.bottom = this.bottom + a.bottom;
    this.left = this.left - a.left
  }else {
    this.top = this.top - a;
    this.right = this.right + b;
    this.bottom = this.bottom + c;
    this.left = this.left - d
  }
  return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
  return a == b ? true : !a || !b ? false : a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left
};
goog.math.Box.contains = function(a, b) {
  return!a || !b ? false : b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom
};
goog.math.Box.relativePositionX = function(a, b) {
  return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, b) {
  return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0
};
goog.math.Box.distance = function(a, b) {
  var c = goog.math.Box.relativePositionX(a, b), d = goog.math.Box.relativePositionY(a, b);
  return Math.sqrt(c * c + d * d)
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
  return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? true : !a || !b ? false : a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height
};
goog.math.Rect.prototype.intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if(b <= c) {
    var d = Math.max(this.top, a.top), a = Math.min(this.top + this.height, a.top + a.height);
    if(d <= a) {
      this.left = b;
      this.top = d;
      this.width = c - b;
      this.height = a - d;
      return true
    }
  }
  return false
};
goog.math.Rect.intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if(c <= d) {
    var e = Math.max(a.top, b.top), f = Math.min(a.top + a.height, b.top + b.height);
    if(e <= f) {
      return new goog.math.Rect(c, e, d - c, f - e)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
  var c = goog.math.Rect.intersection(a, b);
  if(!c || !c.height || !c.width) {
    return[a.clone()]
  }
  var c = [], d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, i = b.top + b.height;
  if(b.top > a.top) {
    c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    d = b.top;
    e = e - (b.top - a.top)
  }
  if(i < g) {
    c.push(new goog.math.Rect(a.left, i, a.width, g - i));
    e = i - d
  }
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
  if(!a || !b) {
    return null
  }
  var c = a.clone();
  c.boundingRect(b);
  return c
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.style = {};
goog.style.setStyle = function(a, b, c) {
  goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
  a.style[goog.string.toCamelCase(c)] = b
};
goog.style.getStyle = function(a, b) {
  return a.style[goog.string.toCamelCase(b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, b, c) {
  var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersion("1.9");
  b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
  a.style.left = goog.style.getPixelStyleValue_(d, e);
  a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
  a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) && !goog.dom.getDomHelper(a).isCss1CompatMode() ? a.body : a.documentElement
};
goog.style.getViewportPageOffset = function(a) {
  var b = a.body, a = a.documentElement;
  return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop)
};
goog.style.supportsGetBoundingClientRect_ = function(a) {
  if(goog.userAgent.MOBILE && goog.userAgent.WEBKIT) {
    var b = a.ownerDocument.defaultView;
    if(b != b.top) {
      return!1
    }
  }
  return!!a.getBoundingClientRect
};
goog.style.getBoundingClientRect_ = function(a) {
  var b = a.getBoundingClientRect();
  goog.userAgent.IE && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b
};
goog.style.getOffsetParent = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(8)) {
    return a.offsetParent
  }
  for(var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = "fixed" == c || "absolute" == c, a = a.parentNode;a && a != b;a = a.parentNode) {
    if(c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(a) {
  for(var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement();a = goog.style.getOffsetParent(a);) {
    if((!goog.userAgent.IE || 0 != a.clientWidth) && (!goog.userAgent.WEBKIT || 0 != a.clientHeight || a != d) && a != d && a != e && "visible" != goog.style.getStyle_(a, "overflow")) {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x)
    }
  }
  d = f.scrollLeft;
  f = f.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, f);
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, f + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
  var d = goog.style.getPageOffset(a), e = goog.style.getPageOffset(b), f = goog.style.getBorderBox(b), g = d.x - e.x - f.left, d = d.y - e.y - f.top, e = b.clientWidth - a.offsetWidth, a = b.clientHeight - a.offsetHeight, f = b.scrollLeft, b = b.scrollTop;
  c ? (f += g - e / 2, b += d - a / 2) : (f += Math.min(g, Math.max(g - e, 0)), b += Math.min(d, Math.max(d - a, 0)));
  return new goog.math.Coordinate(f, b)
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  a = goog.style.getContainerOffsetToScrollInto(a, b, c);
  b.scrollLeft = a.x;
  b.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9")) {
    var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
    if(goog.style.isRightToLeft(a)) {
      var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")), b = b + c
    }
    return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
  }
  return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
  var b, c = goog.dom.getOwnerDocument(a), d = goog.style.getStyle_(a, "position");
  goog.asserts.assertObject(a, "Parameter is required");
  var e = goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY), f = new goog.math.Coordinate(0, 0), g = goog.style.getClientViewportElement(c);
  if(a == g) {
    return f
  }
  if(goog.style.supportsGetBoundingClientRect_(a)) {
    b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y
  }else {
    if(c.getBoxObjectFor && !e) {
      b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY
    }else {
      b = a;
      do {
        f.x += b.offsetLeft;
        f.y += b.offsetTop;
        b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
        if(goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
          f.x += c.body.scrollLeft;
          f.y += c.body.scrollTop;
          break
        }
        b = b.offsetParent
      }while(b && b != a);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) {
        f.y -= c.body.offsetTop
      }
      for(b = a;(b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) {
        if(f.x -= b.scrollLeft, !goog.userAgent.OPERA || "TR" != b.tagName) {
          f.y -= b.scrollTop
        }
      }
    }
  }
  return f
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), e = a;
  do {
    var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPosition(e);
    c.x += f.x;
    c.y += f.y
  }while(d && d != b && (e = d.frameElement) && (d = d.parent));
  return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if(b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body, c = goog.style.getFramedPageOffset(d, c.getWindow()), c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
    goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
    a.left += c.x;
    a.top += c.y
  }
};
goog.style.getRelativePosition = function(a, b) {
  var c = goog.style.getClientPosition(a), d = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPosition = function(a) {
  var b = new goog.math.Coordinate;
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    if(goog.style.supportsGetBoundingClientRect_(a)) {
      var c = goog.style.getBoundingClientRect_(a);
      b.x = c.left;
      b.y = c.top
    }else {
      var c = goog.dom.getDomHelper(a).getDocumentScroll(), d = goog.style.getPageOffset(a);
      b.x = d.x - c.x;
      b.y = d.y - c.y
    }
    goog.userAgent.GECKO && !goog.userAgent.isVersion(12) && (b = goog.math.Coordinate.sum(b, goog.style.getCssTranslation(a)))
  }else {
    c = goog.isFunction(a.getBrowserEvent), d = a, a.targetTouches ? d = a.targetTouches[0] : c && a.getBrowserEvent().targetTouches && (d = a.getBrowserEvent().targetTouches[0]), b.x = d.clientX, b.y = d.clientY
  }
  return b
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
  goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
  if(b instanceof goog.math.Size) {
    c = b.height, b = b.width
  }else {
    if(void 0 == c) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
  if("none" != goog.style.getStyle_(a, "display")) {
    return goog.style.getSizeWithDisplay_(a)
  }
  var b = a.style, c = b.display, d = b.visibility, e = b.position;
  b.visibility = "hidden";
  b.position = "absolute";
  b.display = "inline";
  a = goog.style.getSizeWithDisplay_(a);
  b.display = c;
  b.position = e;
  b.visibility = d;
  return a
};
goog.style.getSizeWithDisplay_ = function(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = goog.userAgent.WEBKIT && !b && !c;
  return(!goog.isDef(b) || d) && a.getBoundingClientRect ? (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top)) : new goog.math.Size(b, c)
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a), a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
  var b = a.style, a = "";
  "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
  return"" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
  var c = a.style;
  "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  var c = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
  a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
  return"none" != a.style.display
};
goog.style.installStyles = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = null;
  if(goog.userAgent.IE) {
    d = c.getDocument().createStyleSheet(), goog.style.setStyles(d, a)
  }else {
    var e = c.getElementsByTagNameAndClass("head")[0];
    e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d));
    d = c.createDom("style");
    goog.style.setStyles(d, a);
    c.appendChild(e, d)
  }
  return d
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
  goog.userAgent.IE ? a.cssText = b : a.innerHTML = b
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersion("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
  return"rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
  var c = !c ? a.getElementsByTagName("*") : null, d = goog.style.unselectableStyle_;
  if(d) {
    if(b = b ? "none" : "", a.style[d] = b, c) {
      for(var a = 0, e;e = c[a];a++) {
        e.style[d] = b
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      if(b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for(a = 0;e = c[a];a++) {
          e.setAttribute("unselectable", b)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8"))) {
    if(c = a.style, d) {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
      c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    }else {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "border-box")
  }
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if(c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) {
    return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a)
  }
  c = goog.style.getBorderBoxSize(a);
  b = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8"))) {
    if(c = a.style, d) {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }else {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
      c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "content-box")
  }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
  a.width = Math.max(b.width, 0) + "px";
  a.height = Math.max(b.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if(/^\d+px?$/.test(b)) {
    return parseInt(b, 10)
  }
  var e = a.style[c], f = a.runtimeStyle[c];
  a.runtimeStyle[c] = a.currentStyle[c];
  a.style[c] = b;
  b = a.style[d];
  a.style[c] = e;
  a.runtimeStyle[c] = f;
  return b
};
goog.style.getIePixelDistance_ = function(a, b) {
  return goog.style.getIePixelValue_(a, goog.style.getCascadedStyle(a, b), "left", "pixelLeft")
};
goog.style.getBox_ = function(a, b) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left"), d = goog.style.getIePixelDistance_(a, b + "Right"), e = goog.style.getIePixelDistance_(a, b + "Top"), f = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, f, c)
  }
  c = goog.style.getComputedStyle(a, b + "Left");
  d = goog.style.getComputedStyle(a, b + "Right");
  e = goog.style.getComputedStyle(a, b + "Top");
  f = goog.style.getComputedStyle(a, b + "Bottom");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if("none" == goog.style.getCascadedStyle(a, b + "Style")) {
    return 0
  }
  var c = goog.style.getCascadedStyle(a, b + "Width");
  return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
  if(goog.userAgent.IE) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft"), c = goog.style.getIePixelBorder_(a, "borderRight"), d = goog.style.getIePixelBorder_(a, "borderTop"), a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b)
  }
  b = goog.style.getComputedStyle(a, "borderLeftWidth");
  c = goog.style.getComputedStyle(a, "borderRightWidth");
  d = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if(b.body.createTextRange) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName")
    }catch(d) {
      c = ""
    }
  }
  c || (c = goog.style.getStyle_(a, "fontFamily"));
  a = c.split(",");
  1 < a.length && (c = a[0]);
  return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return(a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if(b && "px" == c) {
    return parseInt(b, 10)
  }
  if(goog.userAgent.IE) {
    if(c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft")
    }
    if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
    }
  }
  c = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    a = a.split(/\s*:\s*/);
    2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
  });
  return b
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    b.push(goog.string.toSelectorCase(d), ":", a, ";")
  });
  return b.join("")
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
  var b = goog.dom.createElement("div");
  a && (b.className = a);
  b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("div");
  goog.style.setSize(a, "200px", "200px");
  b.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  a = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
  var b;
  goog.userAgent.IE ? b = "-ms-transform" : goog.userAgent.WEBKIT ? b = "-webkit-transform" : goog.userAgent.OPERA ? b = "-o-transform" : goog.userAgent.GECKO && (b = "-moz-transform");
  var c;
  b && (c = goog.style.getStyle_(a, b));
  c || (c = goog.style.getStyle_(a, "transform"));
  if(!c) {
    return new goog.math.Coordinate(0, 0)
  }
  a = c.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  return!a ? new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2]))
};
goog.date = {};
goog.i18n.DateTimeSymbols_en_ISO = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, y MMMM dd", "y MMMM d", "y MMM d", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss v", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_af = {ERAS:["v.C.", "n.C."], ERANAMES:["voor Christus", "na Christus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "), STANDALONEWEEKDAYS:"Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "), SHORTWEEKDAYS:"So Ma Di Wo Do Vr Sa".split(" "), STANDALONESHORTWEEKDAYS:"So Ma Di Wo Do Vr Sa".split(" "), NARROWWEEKDAYS:"SMDWDVS".split(""), STANDALONENARROWWEEKDAYS:"SMDWDVS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1ste kwartaal", "2de kwartaal", "3de kwartaal", "4de kwartaal"], AMPMS:["vm.", "nm."], DATEFORMATS:["EEEE dd MMMM y", 
"dd MMMM y", "dd MMM y", "yyyy-MM-dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_am = {ERAS:["\u12d3/\u12d3", "\u12d3/\u121d"], ERANAMES:["\u12d3\u1218\u1270 \u12d3\u1208\u121d", "\u12d3\u1218\u1270 \u121d\u1215\u1228\u1275"], NARROWMONTHS:"\u1303\u134c\u121b\u12a4\u121c\u1301\u1301\u12a6\u1234\u12a6\u1296\u12f2".split(""), STANDALONENARROWMONTHS:"\u1303\u134c\u121b\u12a4\u121c\u1301\u1301\u12a6\u1234\u12a6\u1296\u12f2".split(""), MONTHS:"\u1303\u1295\u12e9\u12c8\u122a \u134c\u1265\u1229\u12c8\u122a \u121b\u122d\u127d \u12a4\u1355\u1228\u120d \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235\u1275 \u1234\u1355\u1274\u121d\u1260\u122d \u12a6\u12ad\u1270\u12cd\u1260\u122d \u1296\u126c\u121d\u1260\u122d \u12f2\u1234\u121d\u1260\u122d".split(" "), 
STANDALONEMONTHS:"\u1303\u1295\u12e9\u12c8\u122a \u134c\u1265\u1229\u12c8\u122a \u121b\u122d\u127d \u12a4\u1355\u1228\u120d \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235\u1275 \u1234\u1355\u1274\u121d\u1260\u122d \u12a6\u12ad\u1270\u12cd\u1260\u122d \u1296\u126c\u121d\u1260\u122d \u12f2\u1234\u121d\u1260\u122d".split(" "), SHORTMONTHS:"\u1303\u1295\u12e9 \u134c\u1265\u1229 \u121b\u122d\u127d \u12a4\u1355\u1228 \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235 \u1234\u1355\u1274 \u12a6\u12ad\u1270 \u1296\u126c\u121d \u12f2\u1234\u121d".split(" "), 
STANDALONESHORTMONTHS:"\u1303\u1295\u12e9 \u134c\u1265\u1229 \u121b\u122d\u127d \u12a4\u1355\u1228 \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235 \u1234\u1355\u1274 \u12a6\u12ad\u1270 \u1296\u126c\u121d \u12f2\u1234\u121d".split(" "), WEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230\u129e \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), STANDALONEWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230\u129e \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), 
SHORTWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230 \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), STANDALONESHORTWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230 \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), NARROWWEEKDAYS:"\u12a5\u1230\u121b\u1228\u1210\u12d3\u1245".split(""), STANDALONENARROWWEEKDAYS:"\u12a5\u1230\u121b\u1228\u1210\u12d3\u1245".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", 
"Q4"], QUARTERS:["1\u129b\u12cd \u1229\u1265", "\u1201\u1208\u1270\u129b\u12cd \u1229\u1265", "3\u129b\u12cd \u1229\u1265", "4\u129b\u12cd \u1229\u1265"], AMPMS:["\u1321\u12cb\u1275", "\u12a8\u1233\u12d3\u1275"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yyyy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ar = {ZERODIGIT:1632, ERAS:["\u0642.\u0645", "\u0645"], ERANAMES:["\u0642\u0628\u0644 \u0627\u0644\u0645\u064a\u0644\u0627\u062f", "\u0645\u064a\u0644\u0627\u062f\u064a"], NARROWMONTHS:"\u064a\u0641\u0645\u0623\u0648\u0646\u0644\u063a\u0633\u0643\u0628\u062f".split(""), STANDALONENARROWMONTHS:"\u064a\u0641\u0645\u0623\u0648\u0646\u0644\u063a\u0633\u0643\u0628\u062f".split(""), MONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), 
STANDALONEWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), SHORTWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), NARROWWEEKDAYS:"\u062d\u0646\u062b\u0631\u062e\u062c\u0633".split(""), STANDALONENARROWWEEKDAYS:"\u062d\u0646\u062b\u0631\u062e\u062c\u0633".split(""), SHORTQUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", 
"\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], QUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], 
AMPMS:["\u0635", "\u0645"], DATEFORMATS:["EEEE\u060c d MMMM\u060c y", "d MMMM\u060c y", "dd\u200f/MM\u200f/yyyy", "d\u200f/M\u200f/yyyy"], TIMEFORMATS:["zzzz h:mm:ss a", "z h:mm:ss a", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:5, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:4};
goog.i18n.DateTimeSymbols_bg = {ERAS:["\u043f\u0440. \u043d. \u0435.", "\u043e\u0442 \u043d. \u0435."], ERANAMES:["\u043f\u0440.\u0425\u0440.", "\u0441\u043b.\u0425\u0440."], NARROWMONTHS:"\u044f\u0444\u043c\u0430\u043c\u044e\u044e\u0430\u0441\u043e\u043d\u0434".split(""), STANDALONENARROWMONTHS:"\u044f\u0444\u043c\u0430\u043c\u044e\u044e\u0430\u0441\u043e\u043d\u0434".split(""), MONTHS:"\u044f\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), 
STANDALONEMONTHS:"\u044f\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), SHORTMONTHS:"\u044f\u043d. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442 \u0430\u043f\u0440. \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u044f\u043d. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442 \u0430\u043f\u0440. \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), WEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u044f\u0434\u0430 \u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a \u043f\u0435\u0442\u044a\u043a \u0441\u044a\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u044f\u0434\u0430 \u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a \u043f\u0435\u0442\u044a\u043a \u0441\u044a\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u043d\u0434 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u043d\u0434 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), 
NARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), STANDALONENARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), SHORTQUARTERS:["I \u0442\u0440\u0438\u043c.", "II \u0442\u0440\u0438\u043c.", "III \u0442\u0440\u0438\u043c.", "IV \u0442\u0440\u0438\u043c."], QUARTERS:["1-\u0432\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "2-\u0440\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "3-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", 
"4-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435"], AMPMS:["\u043f\u0440. \u043e\u0431.", "\u0441\u043b. \u043e\u0431."], DATEFORMATS:["dd MMMM y, EEEE", "dd MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_bn = {ZERODIGIT:2534, ERAS:["\u0996\u09c3\u09b7\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], ERANAMES:["\u0996\u09c3\u09b7\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], NARROWMONTHS:"\u099c\u09be \u09ab\u09c7 \u09ae\u09be \u098f \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1 \u0986 \u09b8\u09c7 \u0985 \u09a8 \u09a1\u09bf".split(" "), STANDALONENARROWMONTHS:"\u099c\u09be \u09ab\u09c7 \u09ae\u09be \u098f \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1 \u0986 \u09b8\u09c7 \u0985 \u09a8 \u09a1\u09bf".split(" "), 
MONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
STANDALONEMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
SHORTMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
STANDALONESHORTMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
WEEKDAYS:"\u09b0\u09ac\u09bf\u09ac\u09be\u09b0 \u09b8\u09cb\u09ae\u09ac\u09be\u09b0 \u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0 \u09ac\u09c1\u09a7\u09ac\u09be\u09b0 \u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0 \u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b6\u09a8\u09bf\u09ac\u09be\u09b0".split(" "), STANDALONEWEEKDAYS:"\u09b0\u09ac\u09bf\u09ac\u09be\u09b0 \u09b8\u09cb\u09ae\u09ac\u09be\u09b0 \u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0 \u09ac\u09c1\u09a7\u09ac\u09be\u09b0 \u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0 \u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b6\u09a8\u09bf\u09ac\u09be\u09b0".split(" "), 
SHORTWEEKDAYS:"\u09b0\u09ac\u09bf \u09b8\u09cb\u09ae \u09ae\u0999\u09cd\u0997\u09b2 \u09ac\u09c1\u09a7 \u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf \u09b6\u09c1\u0995\u09cd\u09b0 \u09b6\u09a8\u09bf".split(" "), STANDALONESHORTWEEKDAYS:"\u09b0\u09ac\u09bf \u09b8\u09cb\u09ae \u09ae\u0999\u09cd\u0997\u09b2 \u09ac\u09c1\u09a7 \u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf \u09b6\u09c1\u0995\u09cd\u09b0 \u09b6\u09a8\u09bf".split(" "), NARROWWEEKDAYS:"\u09b0 \u09b8\u09cb \u09ae \u09ac\u09c1 \u09ac\u09c3 \u09b6\u09c1 \u09b6".split(" "), 
STANDALONENARROWWEEKDAYS:"\u09b0 \u09b8\u09cb \u09ae \u09ac\u09c1 \u09ac\u09c3 \u09b6\u09c1 \u09b6".split(" "), SHORTQUARTERS:["\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e7", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e8", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e9", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09ea"], QUARTERS:["\u09aa\u09cd\u09b0\u09a5\u09ae \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", 
"\u09a4\u09c3\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5 \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:4, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ca = {ERAS:["aC", "dC"], ERANAMES:["abans de Crist", "despr\u00e9s de Crist"], NARROWMONTHS:"GFMAMJGASOND".split(""), STANDALONENARROWMONTHS:"gfmamjjasond".split(""), MONTHS:"de gener;de febrer;de mar\u00e7;d\u2019abril;de maig;de juny;de juliol;d\u2019agost;de setembre;d\u2019octubre;de novembre;de desembre".split(";"), STANDALONEMONTHS:"gener febrer mar\u00e7 abril maig juny juliol agost setembre octubre novembre desembre".split(" "), SHORTMONTHS:"de gen.;de febr.;de mar\u00e7;d\u2019abr.;de maig;de juny;de jul.;d\u2019ag.;de set.;d\u2019oct.;de nov.;de des.".split(";"), 
STANDALONESHORTMONTHS:"gen. febr. mar\u00e7 abr. maig juny jul. ag. set. oct. nov. des.".split(" "), WEEKDAYS:"diumenge dilluns dimarts dimecres dijous divendres dissabte".split(" "), STANDALONEWEEKDAYS:"Diumenge Dilluns Dimarts Dimecres Dijous Divendres Dissabte".split(" "), SHORTWEEKDAYS:"dg. dl. dt. dc. dj. dv. ds.".split(" "), STANDALONESHORTWEEKDAYS:"dg dl dt dc dj dv ds".split(" "), NARROWWEEKDAYS:"GlTCJVS".split(""), STANDALONENARROWWEEKDAYS:"gltcjvs".split(""), SHORTQUARTERS:["1T", "2T", 
"3T", "4T"], QUARTERS:["1r trimestre", "2n trimestre", "3r trimestre", "4t trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d MMMM 'de' y", "d MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_chr = {ERAS:["\u13a4\u13d3\u13b7\u13b8", "\u13a4\u13b6\u13d0\u13c5"], ERANAMES:["\u13cf \u13e5\u13cc \u13be\u13d5\u13b2\u13cd\u13ac\u13be", "\u13a0\u13a9\u13c3\u13ae\u13b5\u13d3\u13cd\u13d7\u13f1 \u13a0\u13d5\u13d8\u13f1\u13cd\u13ac \u13f1\u13b0\u13e9 \u13e7\u13d3\u13c2\u13b8\u13a2\u13cd\u13d7"], NARROWMONTHS:"\u13a4\u13a7\u13a0\u13a7\u13a0\u13d5\u13ab\u13a6\u13da\u13da\u13c5\u13a4".split(""), STANDALONENARROWMONTHS:"\u13a4\u13a7\u13a0\u13a7\u13a0\u13d5\u13ab\u13a6\u13da\u13da\u13c5\u13a4".split(""), 
MONTHS:"\u13a4\u13c3\u13b8\u13d4\u13c5 \u13a7\u13a6\u13b5 \u13a0\u13c5\u13f1 \u13a7\u13ec\u13c2 \u13a0\u13c2\u13cd\u13ac\u13d8 \u13d5\u13ad\u13b7\u13f1 \u13ab\u13f0\u13c9\u13c2 \u13a6\u13b6\u13c2 \u13da\u13b5\u13cd\u13d7 \u13da\u13c2\u13c5\u13d7 \u13c5\u13d3\u13d5\u13c6 \u13a4\u13cd\u13a9\u13f1".split(" "), STANDALONEMONTHS:"\u13a4\u13c3\u13b8\u13d4\u13c5 \u13a7\u13a6\u13b5 \u13a0\u13c5\u13f1 \u13a7\u13ec\u13c2 \u13a0\u13c2\u13cd\u13ac\u13d8 \u13d5\u13ad\u13b7\u13f1 \u13ab\u13f0\u13c9\u13c2 \u13a6\u13b6\u13c2 \u13da\u13b5\u13cd\u13d7 \u13da\u13c2\u13c5\u13d7 \u13c5\u13d3\u13d5\u13c6 \u13a4\u13cd\u13a9\u13f1".split(" "), 
SHORTMONTHS:"\u13a4\u13c3 \u13a7\u13a6 \u13a0\u13c5 \u13a7\u13ec \u13a0\u13c2 \u13d5\u13ad \u13ab\u13f0 \u13a6\u13b6 \u13da\u13b5 \u13da\u13c2 \u13c5\u13d3 \u13a4\u13cd".split(" "), STANDALONESHORTMONTHS:"\u13a4\u13c3 \u13a7\u13a6 \u13a0\u13c5 \u13a7\u13ec \u13a0\u13c2 \u13d5\u13ad \u13ab\u13f0 \u13a6\u13b6 \u13da\u13b5 \u13da\u13c2 \u13c5\u13d3 \u13a4\u13cd".split(" "), WEEKDAYS:"\u13a4\u13be\u13d9\u13d3\u13c6\u13cd\u13ac \u13a4\u13be\u13d9\u13d3\u13c9\u13c5\u13af \u13d4\u13b5\u13c1\u13a2\u13a6 \u13e6\u13a2\u13c1\u13a2\u13a6 \u13c5\u13a9\u13c1\u13a2\u13a6 \u13e7\u13be\u13a9\u13b6\u13cd\u13d7 \u13a4\u13be\u13d9\u13d3\u13c8\u13d5\u13be".split(" "), 
STANDALONEWEEKDAYS:"\u13a4\u13be\u13d9\u13d3\u13c6\u13cd\u13ac \u13a4\u13be\u13d9\u13d3\u13c9\u13c5\u13af \u13d4\u13b5\u13c1\u13a2\u13a6 \u13e6\u13a2\u13c1\u13a2\u13a6 \u13c5\u13a9\u13c1\u13a2\u13a6 \u13e7\u13be\u13a9\u13b6\u13cd\u13d7 \u13a4\u13be\u13d9\u13d3\u13c8\u13d5\u13be".split(" "), SHORTWEEKDAYS:"\u13c6\u13cd\u13ac \u13c9\u13c5\u13af \u13d4\u13b5\u13c1 \u13e6\u13a2\u13c1 \u13c5\u13a9\u13c1 \u13e7\u13be\u13a9 \u13c8\u13d5\u13be".split(" "), STANDALONESHORTWEEKDAYS:"\u13c6\u13cd\u13ac \u13c9\u13c5\u13af \u13d4\u13b5\u13c1 \u13e6\u13a2\u13c1 \u13c5\u13a9\u13c1 \u13e7\u13be\u13a9 \u13c8\u13d5\u13be".split(" "), 
NARROWWEEKDAYS:"\u13c6\u13c9\u13d4\u13e6\u13c5\u13e7\u13a4".split(""), STANDALONENARROWWEEKDAYS:"\u13c6\u13c9\u13d4\u13e6\u13c5\u13e7\u13a4".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["\u13cc\u13be\u13b4", "\u13d2\u13af\u13f1\u13a2\u13d7\u13e2"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_cs = {ERAS:["p\u0159. n. l.", "n. l."], ERANAMES:["p\u0159. n. l.", "n. l."], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"l\u00fabdk\u010d\u010dsz\u0159lp".split(""), MONTHS:"ledna \u00fanora b\u0159ezna dubna kv\u011btna \u010dervna \u010dervence srpna z\u00e1\u0159\u00ed \u0159\u00edjna listopadu prosince".split(" "), STANDALONEMONTHS:"leden \u00fanor b\u0159ezen duben kv\u011bten \u010derven \u010dervenec srpen z\u00e1\u0159\u00ed \u0159\u00edjen listopad prosinec".split(" "), 
SHORTMONTHS:"Led \u00dano B\u0159e Dub Kv\u011b \u010cer \u010cvc Srp Z\u00e1\u0159 \u0158\u00edj Lis Pro".split(" "), STANDALONESHORTMONTHS:"1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12.".split(" "), WEEKDAYS:"ned\u011ble pond\u011bl\u00ed \u00fater\u00fd st\u0159eda \u010dtvrtek p\u00e1tek sobota".split(" "), STANDALONEWEEKDAYS:"ned\u011ble pond\u011bl\u00ed \u00fater\u00fd st\u0159eda \u010dtvrtek p\u00e1tek sobota".split(" "), SHORTWEEKDAYS:"ne po \u00fat st \u010dt p\u00e1 so".split(" "), STANDALONESHORTWEEKDAYS:"ne po \u00fat st \u010dt p\u00e1 so".split(" "), 
NARROWWEEKDAYS:"NP\u00daS\u010cPS".split(""), STANDALONENARROWWEEKDAYS:"NP\u00daS\u010cPS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. \u010dtvrtlet\u00ed", "2. \u010dtvrtlet\u00ed", "3. \u010dtvrtlet\u00ed", "4. \u010dtvrtlet\u00ed"], AMPMS:["dop.", "odp."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d. M. yyyy", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_cy = {ERAS:["CC", "OC"], ERANAMES:["Cyn Crist", "Oed Crist"], NARROWMONTHS:"ICMEMMGAMHTR".split(""), STANDALONENARROWMONTHS:"ICMEMMGAMHTR".split(""), MONTHS:"Ionawr Chwefror Mawrth Ebrill Mai Mehefin Gorffenaf Awst Medi Hydref Tachwedd Rhagfyr".split(" "), STANDALONEMONTHS:"Ionawr Chwefror Mawrth Ebrill Mai Mehefin Gorffennaf Awst Medi Hydref Tachwedd Rhagfyr".split(" "), SHORTMONTHS:"Ion Chwef Mawrth Ebrill Mai Meh Gorff Awst Medi Hyd Tach Rhag".split(" "), STANDALONESHORTMONTHS:"Ion Chwe Maw Ebr Mai Meh Gor Awst Medi Hyd Tach Rhag".split(" "), 
WEEKDAYS:"Dydd Sul;Dydd Llun;Dydd Mawrth;Dydd Mercher;Dydd Iau;Dydd Gwener;Dydd Sadwrn".split(";"), STANDALONEWEEKDAYS:"Dydd Sul;Dydd Llun;Dydd Mawrth;Dydd Mercher;Dydd Iau;Dydd Gwener;Dydd Sadwrn".split(";"), SHORTWEEKDAYS:"Sul Llun Maw Mer Iau Gwen Sad".split(" "), STANDALONESHORTWEEKDAYS:"Sul Llun Maw Mer Iau Gwe Sad".split(" "), NARROWWEEKDAYS:"SLMMIGS".split(""), STANDALONENARROWWEEKDAYS:"SLMMIGS".split(""), SHORTQUARTERS:["Ch1", "Ch2", "Ch3", "Ch4"], QUARTERS:["Chwarter 1af", "2il chwarter", 
"3ydd chwarter", "4ydd chwarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_da = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar marts april maj juni juli august september oktober november december".split(" "), STANDALONEMONTHS:"januar februar marts april maj juni juli august september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mar. apr. maj jun. jul. aug. sep. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr maj jun jul aug sep okt nov dec".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n man tir ons tor fre l\u00f8r".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8n man tir ons tor fre l\u00f8r".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], 
AMPMS:["f.m.", "e.m."], DATEFORMATS:["EEEE 'den' d. MMMM y", "d. MMM y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), STANDALONEMONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), SHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), STANDALONESHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), 
WEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), STANDALONEWEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), SHORTWEEKDAYS:"So. Mo. Di. Mi. Do. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"So Mo Di Mi Do Fr Sa".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], 
DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_AT = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"J\u00e4nner Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), STANDALONEMONTHS:"J\u00e4nner Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), SHORTMONTHS:"J\u00e4n Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), 
STANDALONESHORTMONTHS:"J\u00e4n Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), WEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), STANDALONEWEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), SHORTWEEKDAYS:"So. Mo. Di. Mi. Do. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"So Mo Di Mi Do Fr Sa".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], 
QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_CH = goog.i18n.DateTimeSymbols_de;
goog.i18n.DateTimeSymbols_el = {ERAS:["\u03c0.\u03a7.", "\u03bc.\u03a7."], ERANAMES:["\u03c0.\u03a7.", "\u03bc.\u03a7."], NARROWMONTHS:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""), STANDALONENARROWMONTHS:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""), MONTHS:"\u0399\u03b1\u03bd\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u039c\u03b1\u03c1\u03c4\u03af\u03bf\u03c5 \u0391\u03c0\u03c1\u03b9\u03bb\u03af\u03bf\u03c5 \u039c\u03b1\u0390\u03bf\u03c5 \u0399\u03bf\u03c5\u03bd\u03af\u03bf\u03c5 \u0399\u03bf\u03c5\u03bb\u03af\u03bf\u03c5 \u0391\u03c5\u03b3\u03bf\u03cd\u03c3\u03c4\u03bf\u03c5 \u03a3\u03b5\u03c0\u03c4\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u039f\u03ba\u03c4\u03c9\u03b2\u03c1\u03af\u03bf\u03c5 \u039d\u03bf\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u0394\u03b5\u03ba\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5".split(" "), 
STANDALONEMONTHS:"\u0399\u03b1\u03bd\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u039c\u03ac\u03c1\u03c4\u03b9\u03bf\u03c2 \u0391\u03c0\u03c1\u03af\u03bb\u03b9\u03bf\u03c2 \u039c\u03ac\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bd\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bb\u03b9\u03bf\u03c2 \u0391\u03cd\u03b3\u03bf\u03c5\u03c3\u03c4\u03bf\u03c2 \u03a3\u03b5\u03c0\u03c4\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u039f\u03ba\u03c4\u03ce\u03b2\u03c1\u03b9\u03bf\u03c2 \u039d\u03bf\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u0394\u03b5\u03ba\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2".split(" "), 
SHORTMONTHS:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03b1\u03c1 \u0391\u03c0\u03c1 \u039c\u03b1\u03ca \u0399\u03bf\u03c5\u03bd \u0399\u03bf\u03c5\u03bb \u0391\u03c5\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03b5 \u0394\u03b5\u03ba".split(" "), STANDALONESHORTMONTHS:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03ac\u03c1 \u0391\u03c0\u03c1 \u039c\u03ac\u03b9 \u0399\u03bf\u03cd\u03bd \u0399\u03bf\u03cd\u03bb \u0391\u03c5\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03ad \u0394\u03b5\u03ba".split(" "), 
WEEKDAYS:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "), STANDALONEWEEKDAYS:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "), 
SHORTWEEKDAYS:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03b9 \u03a4\u03b5\u03c4 \u03a0\u03b5\u03bc \u03a0\u03b1\u03c1 \u03a3\u03b1\u03b2".split(" "), STANDALONESHORTWEEKDAYS:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03af \u03a4\u03b5\u03c4 \u03a0\u03ad\u03bc \u03a0\u03b1\u03c1 \u03a3\u03ac\u03b2".split(" "), NARROWWEEKDAYS:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""), STANDALONENARROWWEEKDAYS:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""), SHORTQUARTERS:["\u03a41", 
"\u03a42", "\u03a43", "\u03a44"], QUARTERS:["1\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "2\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "3\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "4\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf"], AMPMS:["\u03c0.\u03bc.", "\u03bc.\u03bc."], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_AU = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd/MM/yyyy", "d/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_GB = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en_IE = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["a.m.", "p.m."], 
DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yyyy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en_IN = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "dd-MMM-y", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_SG = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_US = goog.i18n.DateTimeSymbols_en;
goog.i18n.DateTimeSymbols_en_ZA = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "dd MMM y", "yyyy/MM/dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_es = {ERAS:["a.C.", "d.C."], ERANAMES:["antes de Cristo", "anno D\u00f3mini"], NARROWMONTHS:"EFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"EFMAMJJASOND".split(""), MONTHS:"enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "), STANDALONEMONTHS:"enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "), SHORTMONTHS:"ene feb mar abr may jun jul ago sep oct nov dic".split(" "), STANDALONESHORTMONTHS:"ene feb mar abr mayo jun jul ago sep oct nov dic".split(" "), 
WEEKDAYS:"domingo lunes martes mi\u00e9rcoles jueves viernes s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"domingo lunes martes mi\u00e9rcoles jueves viernes s\u00e1bado".split(" "), SHORTWEEKDAYS:"dom lun mar mi\u00e9 jue vie s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom lun mar mi\u00e9 jue vie s\u00e1b".split(" "), NARROWWEEKDAYS:"DLMXJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMXJVS".split(""), SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1er trimestre", "2\u00ba trimestre", "3er trimestre", 
"4\u00ba trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_es_419 = {ERAS:["a.C.", "d.C."], ERANAMES:["antes de Cristo", "anno D\u00f3mini"], NARROWMONTHS:"EFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"EFMAMJJASOND".split(""), MONTHS:"enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "), STANDALONEMONTHS:"enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "), SHORTMONTHS:"ene feb mar abr may jun jul ago sep oct nov dic".split(" "), 
STANDALONESHORTMONTHS:"ene feb mar abr mayo jun jul ago sep oct nov dic".split(" "), WEEKDAYS:"domingo lunes martes mi\u00e9rcoles jueves viernes s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"domingo lunes martes mi\u00e9rcoles jueves viernes s\u00e1bado".split(" "), SHORTWEEKDAYS:"dom lun mar mi\u00e9 jue vie s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom lun mar mi\u00e9 jue vie s\u00e1b".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1er trimestre", "2\u00ba trimestre", "3er trimestre", "4\u00ba trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_et = {ERAS:["e.m.a.", "m.a.j."], ERANAMES:["enne meie aega", "meie aja j\u00e4rgi"], NARROWMONTHS:"JVMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JVMAMJJASOND".split(""), MONTHS:"jaanuar veebruar m\u00e4rts aprill mai juuni juuli august september oktoober november detsember".split(" "), STANDALONEMONTHS:"jaanuar veebruar m\u00e4rts aprill mai juuni juuli august september oktoober november detsember".split(" "), SHORTMONTHS:"jaan veebr m\u00e4rts apr mai juuni juuli aug sept okt nov dets".split(" "), 
STANDALONESHORTMONTHS:"jaan veebr m\u00e4rts apr mai juuni juuli aug sept okt nov dets".split(" "), WEEKDAYS:"p\u00fchap\u00e4ev esmasp\u00e4ev teisip\u00e4ev kolmap\u00e4ev neljap\u00e4ev reede laup\u00e4ev".split(" "), STANDALONEWEEKDAYS:"p\u00fchap\u00e4ev esmasp\u00e4ev teisip\u00e4ev kolmap\u00e4ev neljap\u00e4ev reede laup\u00e4ev".split(" "), SHORTWEEKDAYS:"PETKNRL".split(""), STANDALONESHORTWEEKDAYS:"PETKNRL".split(""), NARROWWEEKDAYS:"PETKNRL".split(""), STANDALONENARROWWEEKDAYS:"PETKNRL".split(""), 
SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["enne keskp\u00e4eva", "p\u00e4rast keskp\u00e4eva"], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["H:mm.ss zzzz", "H:mm.ss z", "H:mm.ss", "H:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_eu = {ERAS:["K.a.", "K.o."], ERANAMES:["K.a.", "K.o."], NARROWMONTHS:"UOMAMEUAIUAA".split(""), STANDALONENARROWMONTHS:"UOMAMEUAIUAA".split(""), MONTHS:"urtarrila otsaila martxoa apirila maiatza ekaina uztaila abuztua iraila urria azaroa abendua".split(" "), STANDALONEMONTHS:"urtarrila otsaila martxoa apirila maiatza ekaina uztaila abuztua iraila urria azaroa abendua".split(" "), SHORTMONTHS:"urt ots mar api mai eka uzt abu ira urr aza abe".split(" "), STANDALONESHORTMONTHS:"urt ots mar api mai eka uzt abu ira urr aza abe".split(" "), 
WEEKDAYS:"igandea astelehena asteartea asteazkena osteguna ostirala larunbata".split(" "), STANDALONEWEEKDAYS:"igandea astelehena asteartea asteazkena osteguna ostirala larunbata".split(" "), SHORTWEEKDAYS:"ig al as az og or lr".split(" "), STANDALONESHORTWEEKDAYS:"ig al as az og or lr".split(" "), NARROWWEEKDAYS:"IMAAAOI".split(""), STANDALONENARROWWEEKDAYS:"IMALAOI".split(""), SHORTQUARTERS:["1Hh", "2Hh", "3Hh", "4Hh"], QUARTERS:["1. hiruhilekoa", "2. hiruhilekoa", "3. hiruhilekoa", "4. hiruhilekoa"], 
AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, y'eko' MMMM'ren' dd'a'", "y'eko' MMM'ren' dd'a'", "y MMM d", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fa = {ZERODIGIT:1776, ERAS:["\u0642.\u0645.", "\u0645."], ERANAMES:["\u0642\u0628\u0644 \u0627\u0632 \u0645\u06cc\u0644\u0627\u062f", "\u0645\u06cc\u0644\u0627\u062f\u06cc"], NARROWMONTHS:"\u0698\u0641\u0645\u0622\u0645\u0698\u0698\u0627\u0633\u0627\u0646\u062f".split(""), STANDALONENARROWMONTHS:"\u0698\u0641\u0645\u0622\u0645\u0698\u0698\u0627\u0633\u0627\u0646\u062f".split(""), MONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647\u0654 \u0641\u0648\u0631\u06cc\u0647\u0654 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647\u0654 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647\u0654 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647 \u0641\u0648\u0631\u06cc\u0647 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647\u0654 \u0641\u0648\u0631\u06cc\u0647\u0654 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647\u0654 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647\u0654 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647 \u0641\u0648\u0631\u06cc\u0647 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), 
STANDALONEWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), SHORTWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), 
STANDALONESHORTWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), NARROWWEEKDAYS:"\u06cc\u062f\u0633\u0686\u067e\u062c\u0634".split(""), STANDALONENARROWWEEKDAYS:"\u06cc\u062f\u0633\u0686\u067e\u062c\u0634".split(""), SHORTQUARTERS:["\u0633\u200c\u0645\u06f1", "\u0633\u200c\u0645\u06f2", 
"\u0633\u200c\u0645\u06f3", "\u0633\u200c\u0645\u06f4"], QUARTERS:["\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0627\u0648\u0644", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u062f\u0648\u0645", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0633\u0648\u0645", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0686\u0647\u0627\u0631\u0645"], AMPMS:["\u0642\u0628\u0644\u200c\u0627\u0632\u0638\u0647\u0631", "\u0628\u0639\u062f\u0627\u0632\u0638\u0647\u0631"], DATEFORMATS:["EEEE d MMMM y", 
"d MMMM y", "d MMM y", "yyyy/M/d"], TIMEFORMATS:["H:mm:ss (zzzz)", "H:mm:ss (z)", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:5, WEEKENDRANGE:[3, 4], FIRSTWEEKCUTOFFDAY:4};
goog.i18n.DateTimeSymbols_fi = {ERAS:["eKr.", "jKr."], ERANAMES:["ennen Kristuksen syntym\u00e4\u00e4", "j\u00e4lkeen Kristuksen syntym\u00e4n"], NARROWMONTHS:"THMHTKHESLMJ".split(""), STANDALONENARROWMONTHS:"THMHTKHESLMJ".split(""), MONTHS:"tammikuuta helmikuuta maaliskuuta huhtikuuta toukokuuta kes\u00e4kuuta hein\u00e4kuuta elokuuta syyskuuta lokakuuta marraskuuta joulukuuta".split(" "), STANDALONEMONTHS:"tammikuu helmikuu maaliskuu huhtikuu toukokuu kes\u00e4kuu hein\u00e4kuu elokuu syyskuu lokakuu marraskuu joulukuu".split(" "), 
SHORTMONTHS:"tammikuuta helmikuuta maaliskuuta huhtikuuta toukokuuta kes\u00e4kuuta hein\u00e4kuuta elokuuta syyskuuta lokakuuta marraskuuta joulukuuta".split(" "), STANDALONESHORTMONTHS:"tammi helmi maalis huhti touko kes\u00e4 hein\u00e4 elo syys loka marras joulu".split(" "), WEEKDAYS:"sunnuntaina maanantaina tiistaina keskiviikkona torstaina perjantaina lauantaina".split(" "), STANDALONEWEEKDAYS:"sunnuntai maanantai tiistai keskiviikko torstai perjantai lauantai".split(" "), SHORTWEEKDAYS:"su ma ti ke to pe la".split(" "), 
STANDALONESHORTWEEKDAYS:"su ma ti ke to pe la".split(" "), NARROWWEEKDAYS:"SMTKTPL".split(""), STANDALONENARROWWEEKDAYS:"SMTKTPL".split(""), SHORTQUARTERS:["1. nelj.", "2. nelj.", "3. nelj.", "4. nelj."], QUARTERS:["1. nelj\u00e4nnes", "2. nelj\u00e4nnes", "3. nelj\u00e4nnes", "4. nelj\u00e4nnes"], AMPMS:["ap.", "ip."], DATEFORMATS:["cccc, d. MMMM y", "d. MMMM y", "d.M.yyyy", "d.M.yyyy"], TIMEFORMATS:["H.mm.ss zzzz", "H.mm.ss z", "H.mm.ss", "H.mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fil = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"EPMAMHHASOND".split(""), STANDALONENARROWMONTHS:"EPMAMHHASOND".split(""), MONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), STANDALONEMONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), SHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), STANDALONESHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), 
WEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), STANDALONEWEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), SHORTWEEKDAYS:"Lin Lun Mar Mye Huw Bye Sab".split(" "), STANDALONESHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), NARROWWEEKDAYS:"LLMMHBS".split(""), STANDALONENARROWWEEKDAYS:"LLMMHBS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ika-1 sangkapat", "ika-2 sangkapat", "ika-3 quarter", "ika-4 na quarter"], AMPMS:["AM", 
"PM"], DATEFORMATS:["EEEE, MMMM dd y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_fr = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), STANDALONEMONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), SHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), 
STANDALONESHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), WEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), STANDALONEWEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), SHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), STANDALONESHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fr_CA = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), STANDALONEMONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), SHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), 
STANDALONESHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), WEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), STANDALONEWEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), SHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), STANDALONESHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "yyyy-MM-dd", "yy-MM-dd"], TIMEFORMATS:["HH 'h' mm 'min' ss 's' zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_gl = {ERAS:["a.C.", "d.C."], ERANAMES:["antes de Cristo", "despois de Cristo"], NARROWMONTHS:"XFMAMXXASOND".split(""), STANDALONENARROWMONTHS:"XFMAMXXASOND".split(""), MONTHS:"Xaneiro Febreiro Marzo Abril Maio Xu\u00f1o Xullo Agosto Setembro Outubro Novembro Decembro".split(" "), STANDALONEMONTHS:"Xaneiro Febreiro Marzo Abril Maio Xu\u00f1o Xullo Agosto Setembro Outubro Novembro Decembro".split(" "), SHORTMONTHS:"Xan Feb Mar Abr Mai Xu\u00f1 Xul Ago Set Out Nov Dec".split(" "), 
STANDALONESHORTMONTHS:"Xan Feb Mar Abr Mai Xu\u00f1 Xul Ago Set Out Nov Dec".split(" "), WEEKDAYS:"Domingo Luns Martes M\u00e9rcores Xoves Venres S\u00e1bado".split(" "), STANDALONEWEEKDAYS:"Domingo Luns Martes M\u00e9rcores Xoves Venres S\u00e1bado".split(" "), SHORTWEEKDAYS:"Dom Lun Mar M\u00e9r Xov Ven S\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"Dom Lun Mar M\u00e9r Xov Ven S\u00e1b".split(" "), NARROWWEEKDAYS:"DLMMXVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMXVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1o trimestre", "2o trimestre", "3o trimestre", "4o trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "d MMM, y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_gsw = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli Auguscht Sept\u00e4mber Oktoober Nov\u00e4mber Dez\u00e4mber".split(" "), STANDALONEMONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli Auguscht Sept\u00e4mber Oktoober Nov\u00e4mber Dez\u00e4mber".split(" "), SHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), 
STANDALONESHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), WEEKDAYS:"Sunntig M\u00e4\u00e4ntig Ziischtig Mittwuch Dunschtig Friitig Samschtig".split(" "), STANDALONEWEEKDAYS:"Sunntig M\u00e4\u00e4ntig Ziischtig Mittwuch Dunschtig Friitig Samschtig".split(" "), SHORTWEEKDAYS:"Su. M\u00e4. Zi. Mi. Du. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"Su. M\u00e4. Zi. Mi. Du. Fr. Sa.".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nam."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_gu = {ERAS:["\u0a88\u0ab2\u0ac1\u0aa8\u0abe \u0a9c\u0aa8\u0acd\u0aae \u0aaa\u0ab9\u0ac7\u0ab8\u0abe\u0a82", "\u0a87\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8"], ERANAMES:["\u0a88\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8 \u0aaa\u0ac2\u0ab0\u0acd\u0ab5\u0ac7", "\u0a87\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8"], NARROWMONTHS:"\u0a9c\u0abe \u0aab\u0ac7 \u0aae\u0abe \u0a8f \u0aae\u0ac7 \u0a9c\u0ac2 \u0a9c\u0ac1 \u0a91 \u0ab8 \u0a91 \u0aa8 \u0aa1\u0abf".split(" "), STANDALONENARROWMONTHS:"\u0a9c\u0abe \u0aab\u0ac7 \u0aae\u0abe \u0a8f \u0aae\u0ac7 \u0a9c\u0ac2 \u0a9c\u0ac1 \u0a91 \u0ab8 \u0a91 \u0aa8 \u0aa1\u0abf".split(" "), 
MONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0a91\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 \u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0".split(" "), STANDALONEMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0a91\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 \u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0".split(" "), 
SHORTMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7 \u0a91\u0a95\u0acd\u0a9f\u0acb \u0aa8\u0ab5\u0ac7 \u0aa1\u0abf\u0ab8\u0ac7".split(" "), STANDALONESHORTMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7 \u0a91\u0a95\u0acd\u0a9f\u0acb \u0aa8\u0ab5\u0ac7 \u0aa1\u0abf\u0ab8\u0ac7".split(" "), 
WEEKDAYS:"\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0 \u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0 \u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0 \u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0 \u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0 \u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0 \u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0".split(" "), STANDALONEWEEKDAYS:"\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0 \u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0 \u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0 \u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0 \u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0 \u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0 \u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0".split(" "), 
SHORTWEEKDAYS:"\u0ab0\u0ab5\u0abf \u0ab8\u0acb\u0aae \u0aae\u0a82\u0a97\u0ab3 \u0aac\u0ac1\u0aa7 \u0a97\u0ac1\u0ab0\u0ac1 \u0ab6\u0ac1\u0a95\u0acd\u0ab0 \u0ab6\u0aa8\u0abf".split(" "), STANDALONESHORTWEEKDAYS:"\u0ab0\u0ab5\u0abf \u0ab8\u0acb\u0aae \u0aae\u0a82\u0a97\u0ab3 \u0aac\u0ac1\u0aa7 \u0a97\u0ac1\u0ab0\u0ac1 \u0ab6\u0ac1\u0a95\u0acd\u0ab0 \u0ab6\u0aa8\u0abf".split(" "), NARROWWEEKDAYS:"\u0ab0 \u0ab8\u0acb \u0aae\u0a82 \u0aac\u0ac1 \u0a97\u0ac1 \u0ab6\u0ac1 \u0ab6".split(" "), STANDALONENARROWWEEKDAYS:"\u0ab0 \u0ab8\u0acb \u0aae\u0a82 \u0aac\u0ac1 \u0a97\u0ac1 \u0ab6\u0ac1 \u0ab6".split(" "), 
SHORTQUARTERS:["\u0aaa\u0ac7\u0ab9\u0ab2\u0abe \u0ab9\u0a82\u0aa4 1", "Q2", "Q3", "\u0a9a\u0acc\u0aa4\u0abe \u0ab9\u0a82\u0aa4 4"], QUARTERS:["\u0aaa\u0ac7\u0ab9\u0ab2\u0abe \u0ab9\u0a82\u0aa4 1", "\u0aa1\u0ac2\u0ab8\u0a8b\u0abe \u0ab9\u0a82\u0aa4 2", "\u0aa4\u0ac0\u0ab8\u0a8b\u0abe \u0ab9\u0a82\u0aa4 3", "\u0a9a\u0acc\u0aa4\u0abe \u0ab9\u0a82\u0aa4 4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-MM-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", 
"hh:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_haw = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"Ianuali Pepeluali Malaki \u02bbApelila Mei Iune Iulai \u02bbAukake Kepakemapa \u02bbOkakopa Nowemapa Kekemapa".split(" "), STANDALONEMONTHS:"Ianuali Pepeluali Malaki \u02bbApelila Mei Iune Iulai \u02bbAukake Kepakemapa \u02bbOkakopa Nowemapa Kekemapa".split(" "), SHORTMONTHS:"Ian. Pep. Mal. \u02bbAp. Mei Iun. Iul. \u02bbAu. Kep. \u02bbOk. Now. Kek.".split(" "), 
STANDALONESHORTMONTHS:"Ian. Pep. Mal. \u02bbAp. Mei Iun. Iul. \u02bbAu. Kep. \u02bbOk. Now. Kek.".split(" "), WEEKDAYS:"L\u0101pule Po\u02bbakahi Po\u02bbalua Po\u02bbakolu Po\u02bbah\u0101 Po\u02bbalima Po\u02bbaono".split(" "), STANDALONEWEEKDAYS:"L\u0101pule Po\u02bbakahi Po\u02bbalua Po\u02bbakolu Po\u02bbah\u0101 Po\u02bbalima Po\u02bbaono".split(" "), SHORTWEEKDAYS:"LP P1 P2 P3 P4 P5 P6".split(" "), STANDALONESHORTWEEKDAYS:"LP P1 P2 P3 P4 P5 P6".split(" "), NARROWWEEKDAYS:"1234567".split(""), 
STANDALONENARROWWEEKDAYS:"1234567".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_he = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), 
STANDALONEMONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), SHORTMONTHS:"\u05d9\u05e0\u05d5 \u05e4\u05d1\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0 \u05d9\u05d5\u05dc \u05d0\u05d5\u05d2 \u05e1\u05e4\u05d8 \u05d0\u05d5\u05e7 \u05e0\u05d5\u05d1 \u05d3\u05e6\u05de".split(" "), 
STANDALONESHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05f3 \u05d9\u05d5\u05dc\u05f3 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), WEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), 
STANDALONEWEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), SHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), 
STANDALONESHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), NARROWWEEKDAYS:"\u05d0\u05d1\u05d2\u05d3\u05d4\u05d5\u05e9".split(""), STANDALONENARROWWEEKDAYS:"\u05d0\u05d1\u05d2\u05d3\u05d4\u05d5\u05e9".split(""), SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", 
"\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e6", "\u05d0\u05d7\u05d4\u05f4\u05e6"], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "d \u05d1MMM yyyy", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_hi = {ERAS:["\u0908\u0938\u093e\u092a\u0942\u0930\u094d\u0935", "\u0938\u0928"], ERANAMES:["\u0908\u0938\u093e\u092a\u0942\u0930\u094d\u0935", "\u0938\u0928"], NARROWMONTHS:"\u091c \u092b\u093c \u092e\u093e \u0905 \u092e \u091c\u0942 \u091c\u0941 \u0905 \u0938\u093f \u0905 \u0928 \u0926\u093f".split(" "), STANDALONENARROWMONTHS:"\u091c \u092b\u093c \u092e\u093e \u0905 \u092e \u091c\u0942 \u091c\u0941 \u0905 \u0938\u093f \u0905 \u0928 \u0926\u093f".split(" "), MONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u0924\u0942\u092c\u0930 \u0928\u0935\u092e\u094d\u092c\u0930 \u0926\u093f\u0938\u092e\u094d\u092c\u0930".split(" "), 
STANDALONEMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u0924\u0942\u092c\u0930 \u0928\u0935\u092e\u094d\u092c\u0930 \u0926\u093f\u0938\u092e\u094d\u092c\u0930".split(" "), SHORTMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u0924\u0942\u092c\u0930 \u0928\u0935\u092e\u094d\u092c\u0930 \u0926\u093f\u0938\u092e\u094d\u092c\u0930".split(" "), 
STANDALONESHORTMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u0924\u0942\u092c\u0930 \u0928\u0935\u092e\u094d\u092c\u0930 \u0926\u093f\u0938\u092e\u094d\u092c\u0930".split(" "), WEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0932\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u092c\u0943\u0939\u0938\u094d\u092a\u0924\u093f\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), 
STANDALONEWEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0932\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u092c\u0943\u0939\u0938\u094d\u092a\u0924\u093f\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), SHORTWEEKDAYS:"\u0930\u0935\u093f. \u0938\u094b\u092e. \u092e\u0902\u0917\u0932. \u092c\u0941\u0927. \u092c\u0943\u0939. \u0936\u0941\u0915\u094d\u0930. \u0936\u0928\u093f.".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0930\u0935\u093f. \u0938\u094b\u092e. \u092e\u0902\u0917\u0932. \u092c\u0941\u0927. \u092c\u0943\u0939. \u0936\u0941\u0915\u094d\u0930. \u0936\u0928\u093f.".split(" "), NARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), STANDALONENARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), SHORTQUARTERS:["\u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u0942\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", 
"\u0924\u0940\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u094c\u0925\u0940 \u0924\u093f\u092e\u093e\u0939\u0940"], QUARTERS:["\u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u0942\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u0924\u0940\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u094c\u0925\u0940 \u0924\u093f\u092e\u093e\u0939\u0940"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd-MM-yyyy", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", 
"h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_hr = {ERAS:["p. n. e.", "A. D."], ERANAMES:["Prije Krista", "Poslije Krista"], NARROWMONTHS:"1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12.".split(" "), STANDALONENARROWMONTHS:"1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12.".split(" "), MONTHS:"sije\u010dnja velja\u010de o\u017eujka travnja svibnja lipnja srpnja kolovoza rujna listopada studenoga prosinca".split(" "), STANDALONEMONTHS:"sije\u010danj velja\u010da o\u017eujak travanj svibanj lipanj srpanj kolovoz rujan listopad studeni prosinac".split(" "), 
SHORTMONTHS:"sij velj o\u017eu tra svi lip srp kol ruj lis stu pro".split(" "), STANDALONESHORTMONTHS:"sij velj o\u017eu tra svi lip srp kol ruj lis stu pro".split(" "), WEEKDAYS:"nedjelja ponedjeljak utorak srijeda \u010detvrtak petak subota".split(" "), STANDALONEWEEKDAYS:"nedjelja ponedjeljak utorak srijeda \u010detvrtak petak subota".split(" "), SHORTWEEKDAYS:"ned pon uto sri \u010det pet sub".split(" "), STANDALONESHORTWEEKDAYS:"ned pon uto sri \u010det pet sub".split(" "), NARROWWEEKDAYS:"NPUS\u010cPS".split(""), 
STANDALONENARROWWEEKDAYS:"npus\u010dps".split(""), SHORTQUARTERS:["1kv", "2kv", "3kv", "4kv"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y.", "d. MMMM y.", "d. M. y.", "d.M.y."], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_hu = {ERAS:["i. e.", "i. sz."], ERANAMES:["id\u0151sz\u00e1m\u00edt\u00e1sunk el\u0151tt", "id\u0151sz\u00e1m\u00edt\u00e1sunk szerint"], NARROWMONTHS:"J F M \u00c1 M J J \u00c1 Sz O N D".split(" "), STANDALONENARROWMONTHS:"J F M \u00c1 M J J A Sz O N D".split(" "), MONTHS:"janu\u00e1r febru\u00e1r m\u00e1rcius \u00e1prilis m\u00e1jus j\u00fanius j\u00falius augusztus szeptember okt\u00f3ber november december".split(" "), STANDALONEMONTHS:"janu\u00e1r febru\u00e1r m\u00e1rcius \u00e1prilis m\u00e1jus j\u00fanius j\u00falius augusztus szeptember okt\u00f3ber november december".split(" "), 
SHORTMONTHS:"jan. febr. m\u00e1rc. \u00e1pr. m\u00e1j. j\u00fan. j\u00fal. aug. szept. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"jan. febr. m\u00e1rc. \u00e1pr. m\u00e1j. j\u00fan. j\u00fal. aug. szept. okt. nov. dec.".split(" "), WEEKDAYS:"vas\u00e1rnap h\u00e9tf\u0151 kedd szerda cs\u00fct\u00f6rt\u00f6k p\u00e9ntek szombat".split(" "), STANDALONEWEEKDAYS:"vas\u00e1rnap h\u00e9tf\u0151 kedd szerda cs\u00fct\u00f6rt\u00f6k p\u00e9ntek szombat".split(" "), SHORTWEEKDAYS:"V H K Sze Cs P Szo".split(" "), 
STANDALONESHORTWEEKDAYS:"V H K Sze Cs P Szo".split(" "), NARROWWEEKDAYS:"V H K Sz Cs P Sz".split(" "), STANDALONENARROWWEEKDAYS:"V H K Sz Cs P Sz".split(" "), SHORTQUARTERS:["N1", "N2", "N3", "N4"], QUARTERS:["I. negyed\u00e9v", "II. negyed\u00e9v", "III. negyed\u00e9v", "IV. negyed\u00e9v"], AMPMS:["de.", "du."], DATEFORMATS:["y. MMMM d., EEEE", "y. MMMM d.", "yyyy.MM.dd.", "yyyy.MM.dd."], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_id = {ERAS:["SM", "M"], ERANAMES:["SM", "M"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), STANDALONEWEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), SHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), NARROWWEEKDAYS:"MSSRKJS".split(""), STANDALONENARROWWEEKDAYS:"MSSRKJS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["kuartal pertama", "kuartal kedua", "kuartal ketiga", "kuartal keempat"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM yyyy", 
"d MMMM yyyy", "d MMM yyyy", "dd/MM/yy"], TIMEFORMATS:["H:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_in = {ERAS:["SM", "M"], ERANAMES:["SM", "M"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), STANDALONEWEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), SHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), NARROWWEEKDAYS:"MSSRKJS".split(""), STANDALONENARROWWEEKDAYS:"MSSRKJS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["kuartal pertama", "kuartal kedua", "kuartal ketiga", "kuartal keempat"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM yyyy", 
"d MMMM yyyy", "d MMM yyyy", "dd/MM/yy"], TIMEFORMATS:["H:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_is = {ERAS:["fyrir Krist", "eftir Krist"], ERANAMES:["fyrir Krist", "eftir Krist"], NARROWMONTHS:"JFMAMJJ\u00c1LOND".split(""), STANDALONENARROWMONTHS:"jfmamjj\u00e1sond".split(""), MONTHS:"jan\u00faar febr\u00faar mars apr\u00edl ma\u00ed j\u00fan\u00ed j\u00fal\u00ed \u00e1g\u00fast september okt\u00f3ber n\u00f3vember desember".split(" "), STANDALONEMONTHS:"jan\u00faar febr\u00faar mars apr\u00edl ma\u00ed j\u00fan\u00ed j\u00fal\u00ed \u00e1g\u00fast september okt\u00f3ber n\u00f3vember desember".split(" "), 
SHORTMONTHS:"jan feb mar apr ma\u00ed j\u00fan j\u00fal \u00e1g\u00fa sep okt n\u00f3v des".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr ma\u00ed j\u00fan j\u00fal \u00e1g\u00fa sep okt n\u00f3v des".split(" "), WEEKDAYS:"sunnudagur m\u00e1nudagur \u00feri\u00f0judagur mi\u00f0vikudagur fimmtudagur f\u00f6studagur laugardagur".split(" "), STANDALONEWEEKDAYS:"sunnudagur m\u00e1nudagur \u00feri\u00f0judagur mi\u00f0vikudagur fimmtudagur f\u00f6studagur laugardagur".split(" "), SHORTWEEKDAYS:"sun m\u00e1n \u00feri mi\u00f0 fim f\u00f6s lau".split(" "), 
STANDALONESHORTWEEKDAYS:"sun m\u00e1n \u00feri mi\u00f0 fim f\u00f6s lau".split(" "), NARROWWEEKDAYS:"SM\u00deMFFL".split(""), STANDALONENARROWWEEKDAYS:"sm\u00femffl".split(""), SHORTQUARTERS:["F1", "F2", "F3", "F4"], QUARTERS:["1st fj\u00f3r\u00f0ungur", "2nd fj\u00f3r\u00f0ungur", "3rd fj\u00f3r\u00f0ungur", "4th fj\u00f3r\u00f0ungur"], AMPMS:["f.h.", "e.h."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d.M.yyyy", "d.M.yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_it = {ERAS:["aC", "dC"], ERANAMES:["a.C.", "d.C"], NARROWMONTHS:"GFMAMGLASOND".split(""), STANDALONENARROWMONTHS:"GFMAMGLASOND".split(""), MONTHS:"gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre".split(" "), STANDALONEMONTHS:"Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre".split(" "), SHORTMONTHS:"gen feb mar apr mag giu lug ago set ott nov dic".split(" "), STANDALONESHORTMONTHS:"gen feb mar apr mag giu lug ago set ott nov dic".split(" "), 
WEEKDAYS:"domenica luned\u00ec marted\u00ec mercoled\u00ec gioved\u00ec venerd\u00ec sabato".split(" "), STANDALONEWEEKDAYS:"Domenica Luned\u00ec Marted\u00ec Mercoled\u00ec Gioved\u00ec Venerd\u00ec Sabato".split(" "), SHORTWEEKDAYS:"dom lun mar mer gio ven sab".split(" "), STANDALONESHORTWEEKDAYS:"dom lun mar mer gio ven sab".split(" "), NARROWWEEKDAYS:"DLMMGVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMGVS".split(""), SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1o trimestre", "2o trimestre", 
"3o trimestre", "4o trimestre"], AMPMS:["m.", "p."], DATEFORMATS:["EEEE d MMMM y", "dd MMMM y", "dd/MMM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_iw = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), 
STANDALONEMONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), SHORTMONTHS:"\u05d9\u05e0\u05d5 \u05e4\u05d1\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0 \u05d9\u05d5\u05dc \u05d0\u05d5\u05d2 \u05e1\u05e4\u05d8 \u05d0\u05d5\u05e7 \u05e0\u05d5\u05d1 \u05d3\u05e6\u05de".split(" "), 
STANDALONESHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05f3 \u05d9\u05d5\u05dc\u05f3 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), WEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), 
STANDALONEWEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), SHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), 
STANDALONESHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), NARROWWEEKDAYS:"\u05d0\u05d1\u05d2\u05d3\u05d4\u05d5\u05e9".split(""), STANDALONENARROWWEEKDAYS:"\u05d0\u05d1\u05d2\u05d3\u05d4\u05d5\u05e9".split(""), SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", 
"\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e6", "\u05d0\u05d7\u05d4\u05f4\u05e6"], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "d \u05d1MMM yyyy", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ja = {ERAS:["\u7d00\u5143\u524d", "\u897f\u66a6"], ERANAMES:["\u7d00\u5143\u524d", "\u897f\u66a6"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), 
STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u65e5\u66dc\u65e5 \u6708\u66dc\u65e5 \u706b\u66dc\u65e5 \u6c34\u66dc\u65e5 \u6728\u66dc\u65e5 \u91d1\u66dc\u65e5 \u571f\u66dc\u65e5".split(" "), STANDALONEWEEKDAYS:"\u65e5\u66dc\u65e5 \u6708\u66dc\u65e5 \u706b\u66dc\u65e5 \u6c34\u66dc\u65e5 \u6728\u66dc\u65e5 \u91d1\u66dc\u65e5 \u571f\u66dc\u65e5".split(" "), SHORTWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), 
STANDALONESHORTWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), NARROWWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u7b2c1\u56db\u534a\u671f", "\u7b2c2\u56db\u534a\u671f", "\u7b2c3\u56db\u534a\u671f", "\u7b2c4\u56db\u534a\u671f"], AMPMS:["\u5348\u524d", "\u5348\u5f8c"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", 
"yyyy/MM/dd", "yyyy/MM/dd"], TIMEFORMATS:["H\u6642mm\u5206ss\u79d2 zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_kn = {ERAS:["\u0c95\u0ccd\u0cb0\u0cbf.\u0caa\u0cc2", "\u0c9c\u0cbe\u0cb9\u0cc0"], ERANAMES:["\u0c88\u0cb8\u0caa\u0cc2\u0cb5\u0cef.", "\u0c95\u0ccd\u0cb0\u0cbf\u0cb8\u0ccd\u0ca4 \u0cb6\u0c95"], NARROWMONTHS:"\u0c9c \u0cab\u0cc6 \u0cae\u0cbe \u0c8e \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1 \u0c86 \u0cb8\u0cc6 \u0c85 \u0ca8 \u0ca1\u0cbf".split(" "), STANDALONENARROWMONTHS:"\u0c9c \u0cab\u0cc6 \u0cae\u0cbe \u0c8e \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1 \u0c86 \u0cb8\u0cc6 \u0c85 \u0ca8 \u0ca1\u0cbf".split(" "), 
MONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0 \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0 \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc6 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), STANDALONEMONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0 \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0 \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc6 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), 
SHORTMONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0 \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0 \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc6 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), STANDALONESHORTMONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0 \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0 \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc6 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), 
WEEKDAYS:"\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0 \u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0 \u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0 \u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0 \u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0 \u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0".split(" "), STANDALONEWEEKDAYS:"\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0 \u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0 \u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0 \u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0 \u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0 \u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0".split(" "), 
SHORTWEEKDAYS:"\u0cb0. \u0cb8\u0ccb. \u0cae\u0c82. \u0cac\u0cc1. \u0c97\u0cc1. \u0cb6\u0cc1. \u0cb6\u0ca8\u0cbf.".split(" "), STANDALONESHORTWEEKDAYS:"\u0cb0. \u0cb8\u0ccb. \u0cae\u0c82. \u0cac\u0cc1. \u0c97\u0cc1. \u0cb6\u0cc1. \u0cb6\u0ca8\u0cbf.".split(" "), NARROWWEEKDAYS:"\u0cb0 \u0cb8\u0ccb \u0cae\u0c82 \u0cac\u0cc1 \u0c97\u0cc1 \u0cb6\u0cc1 \u0cb6".split(" "), STANDALONENARROWWEEKDAYS:"\u0cb0 \u0cb8\u0ccb \u0cae\u0c82 \u0cac\u0cc1 \u0c97\u0cc1 \u0cb6\u0cc1 \u0cb6".split(" "), SHORTQUARTERS:["\u0c92\u0c82\u0ca6\u0cc1 1", 
"\u0c8e\u0cb0\u0ca1\u0cc1 2", "\u0cae\u0cc2\u0cb0\u0cc1 3", "\u0ca8\u0cbe\u0cb2\u0cc3\u0c95 4"], QUARTERS:["\u0c92\u0c82\u0ca6\u0cc1 1", "\u0c8e\u0cb0\u0ca1\u0cc1 2", "\u0cae\u0cc2\u0cb0\u0cc1 3", "\u0ca8\u0cbe\u0cb2\u0cc3\u0c95 4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "d-M-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", "hh:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ko = {ERAS:["\uae30\uc6d0\uc804", "\uc11c\uae30"], ERANAMES:["\uc11c\ub825\uae30\uc6d0\uc804", "\uc11c\ub825\uae30\uc6d0"], NARROWMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), STANDALONENARROWMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), MONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), 
STANDALONEMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), SHORTMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), STANDALONESHORTMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), WEEKDAYS:"\uc77c\uc694\uc77c \uc6d4\uc694\uc77c \ud654\uc694\uc77c \uc218\uc694\uc77c \ubaa9\uc694\uc77c \uae08\uc694\uc77c \ud1a0\uc694\uc77c".split(" "), 
STANDALONEWEEKDAYS:"\uc77c\uc694\uc77c \uc6d4\uc694\uc77c \ud654\uc694\uc77c \uc218\uc694\uc77c \ubaa9\uc694\uc77c \uae08\uc694\uc77c \ud1a0\uc694\uc77c".split(" "), SHORTWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), STANDALONESHORTWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), NARROWWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), STANDALONENARROWWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), SHORTQUARTERS:["1\ubd84\uae30", "2\ubd84\uae30", 
"3\ubd84\uae30", "4\ubd84\uae30"], QUARTERS:["\uc81c 1/4\ubd84\uae30", "\uc81c 2/4\ubd84\uae30", "\uc81c 3/4\ubd84\uae30", "\uc81c 4/4\ubd84\uae30"], AMPMS:["\uc624\uc804", "\uc624\ud6c4"], DATEFORMATS:["y\ub144 M\uc6d4 d\uc77c EEEE", "y\ub144 M\uc6d4 d\uc77c", "yyyy. M. d.", "yy. M. d."], TIMEFORMATS:["a h\uc2dc m\ubd84 s\ucd08 zzzz", "a h\uc2dc m\ubd84 s\ucd08 z", "a h:mm:ss", "a h:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ln = {ERAS:["lib\u00f3so ya", "nsima ya Y"], ERANAMES:["Yambo ya Y\u00e9zu Kr\u00eds", "Nsima ya Y\u00e9zu Kr\u00eds"], NARROWMONTHS:"yfmamyyas\u0254nd".split(""), STANDALONENARROWMONTHS:"yfmamyyas\u0254nd".split(""), MONTHS:"s\u00e1nz\u00e1 ya yambo;s\u00e1nz\u00e1 ya m\u00edbal\u00e9;s\u00e1nz\u00e1 ya m\u00eds\u00e1to;s\u00e1nz\u00e1 ya m\u00ednei;s\u00e1nz\u00e1 ya m\u00edt\u00e1no;s\u00e1nz\u00e1 ya mot\u00f3b\u00e1;s\u00e1nz\u00e1 ya nsambo;s\u00e1nz\u00e1 ya mwambe;s\u00e1nz\u00e1 ya libwa;s\u00e1nz\u00e1 ya z\u00f3mi;s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301;s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9".split(";"), 
STANDALONEMONTHS:"s\u00e1nz\u00e1 ya yambo;s\u00e1nz\u00e1 ya m\u00edbal\u00e9;s\u00e1nz\u00e1 ya m\u00eds\u00e1to;s\u00e1nz\u00e1 ya m\u00ednei;s\u00e1nz\u00e1 ya m\u00edt\u00e1no;s\u00e1nz\u00e1 ya mot\u00f3b\u00e1;s\u00e1nz\u00e1 ya nsambo;s\u00e1nz\u00e1 ya mwambe;s\u00e1nz\u00e1 ya libwa;s\u00e1nz\u00e1 ya z\u00f3mi;s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301;s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9".split(";"), SHORTMONTHS:"yan fbl msi apl mai yun yul agt stb \u0254tb nvb dsb".split(" "), 
STANDALONESHORTMONTHS:"yan fbl msi apl mai yun yul agt stb \u0254tb nvb dsb".split(" "), WEEKDAYS:"eyenga;mok\u0254l\u0254 mwa yambo;mok\u0254l\u0254 mwa m\u00edbal\u00e9;mok\u0254l\u0254 mwa m\u00eds\u00e1to;mok\u0254l\u0254 ya m\u00edn\u00e9i;mok\u0254l\u0254 ya m\u00edt\u00e1no;mp\u0254\u0301s\u0254".split(";"), STANDALONEWEEKDAYS:"eyenga;mok\u0254l\u0254 mwa yambo;mok\u0254l\u0254 mwa m\u00edbal\u00e9;mok\u0254l\u0254 mwa m\u00eds\u00e1to;mok\u0254l\u0254 ya m\u00edn\u00e9i;mok\u0254l\u0254 ya m\u00edt\u00e1no;mp\u0254\u0301s\u0254".split(";"), 
SHORTWEEKDAYS:"eye ybo mbl mst min mtn mps".split(" "), STANDALONESHORTWEEKDAYS:"eye ybo mbl mst min mtn mps".split(" "), NARROWWEEKDAYS:"eymmmmp".split(""), STANDALONENARROWWEEKDAYS:"eymmmmp".split(""), SHORTQUARTERS:["SM1", "SM2", "SM3", "SM4"], QUARTERS:["s\u00e1nz\u00e1 m\u00eds\u00e1to ya yambo", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00edbal\u00e9", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00eds\u00e1to", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00ednei"], AMPMS:["nt\u0254\u0301ng\u0254\u0301", 
"mp\u00f3kwa"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "d/M/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_lt = {ERAS:["pr. Kr.", "po Kr."], ERANAMES:["prie\u0161 Krist\u0173", "po Kristaus"], NARROWMONTHS:"SVKBGBLRRSLG".split(""), STANDALONENARROWMONTHS:"SVKBGBLRRSLG".split(""), MONTHS:"sausio vasaris kovas balandis gegu\u017e\u0117 bir\u017eelis liepa rugpj\u016btis rugs\u0117jis spalis lapkritis gruodis".split(" "), STANDALONEMONTHS:"Sausis Vasaris Kovas Balandis Gegu\u017e\u0117 Bir\u017eelis Liepa Rugpj\u016btis Rugs\u0117jis Spalis Lapkritis Gruodis".split(" "), SHORTMONTHS:"Saus. Vas Kov. Bal. Geg. Bir. Liep. Rugp. Rugs. Spal. Lapkr. Gruod.".split(" "), 
STANDALONESHORTMONTHS:"Saus. Vas. Kov. Bal. Geg. Bir. Liep. Rugp. Rugs. Spal. Lapkr. Gruod.".split(" "), WEEKDAYS:"sekmadienis pirmadienis antradienis tre\u010diadienis ketvirtadienis penktadienis \u0161e\u0161tadienis".split(" "), STANDALONEWEEKDAYS:"sekmadienis pirmadienis antradienis tre\u010diadienis ketvirtadienis penktadienis \u0161e\u0161tadienis".split(" "), SHORTWEEKDAYS:"Sk Pr An Tr Kt Pn \u0160t".split(" "), STANDALONESHORTWEEKDAYS:"Sk Pr An Tr Kt Pn \u0160t".split(" "), NARROWWEEKDAYS:"SPATKP\u0160".split(""), 
STANDALONENARROWWEEKDAYS:"SPATKP\u0160".split(""), SHORTQUARTERS:["I k.", "II k.", "III k.", "IV ketv."], QUARTERS:["I ketvirtis", "II ketvirtis", "III ketvirtis", "IV ketvirtis"], AMPMS:["prie\u0161piet", "popiet"], DATEFORMATS:["y 'm'. MMMM d 'd'., EEEE", "y 'm'. MMMM d 'd'.", "y MMM d", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_lv = {ERAS:["p.m.\u0113.", "m.\u0113."], ERANAMES:["pirms m\u016bsu \u0113ras", "m\u016bsu \u0113r\u0101"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janv\u0101ris febru\u0101ris marts apr\u012blis maijs j\u016bnijs j\u016blijs augusts septembris oktobris novembris decembris".split(" "), STANDALONEMONTHS:"janv\u0101ris febru\u0101ris marts apr\u012blis maijs j\u016bnijs j\u016blijs augusts septembris oktobris novembris decembris".split(" "), 
SHORTMONTHS:"janv. febr. marts apr. maijs j\u016bn. j\u016bl. aug. sept. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"janv. febr. marts apr. maijs j\u016bn. j\u016bl. aug. sept. okt. nov. dec.".split(" "), WEEKDAYS:"sv\u0113tdiena pirmdiena otrdiena tre\u0161diena ceturtdiena piektdiena sestdiena".split(" "), STANDALONEWEEKDAYS:"sv\u0113tdiena pirmdiena otrdiena tre\u0161diena ceturtdiena piektdiena sestdiena".split(" "), SHORTWEEKDAYS:"Sv Pr Ot Tr Ce Pk Se".split(" "), STANDALONESHORTWEEKDAYS:"Sv Pr Ot Tr Ce Pk Se".split(" "), 
NARROWWEEKDAYS:"SPOTCPS".split(""), STANDALONENARROWWEEKDAYS:"SPOTCPS".split(""), SHORTQUARTERS:["C1", "C2", "C3", "C4"], QUARTERS:["1. ceturksnis", "2. ceturksnis", "3. ceturksnis", "4. ceturksnis"], AMPMS:["priek\u0161pusdien\u0101", "p\u0113cpusdien\u0101"], DATEFORMATS:["EEEE, y. 'gada' d. MMMM", "y. 'gada' d. MMMM", "y. 'gada' d. MMM", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ml = {ERAS:["\u0d15\u0d4d\u0d30\u0d3f.\u0d2e\u0d42", "\u0d15\u0d4d\u0d30\u0d3f.\u0d2a\u0d3f."], ERANAMES:["\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d41\u0d4d \u0d2e\u0d41\u0d2e\u0d4d\u0d2a\u0d4d\u200c", "\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d4d \u0d2a\u0d3f\u0d28\u0d4d\u200d\u0d2a\u0d4d"], NARROWMONTHS:"\u0d1c \u0d2b\u0d46 \u0d2e\u0d3e \u0d0f \u0d2e\u0d47 \u0d1c\u0d42 \u0d1c\u0d42 \u0d13 \u0d38\u0d46 \u0d12 \u0d28 \u0d21\u0d3f".split(" "), 
STANDALONENARROWMONTHS:"\u0d1c \u0d2b\u0d46 \u0d2e\u0d3e \u0d0f \u0d2e\u0d47 \u0d1c\u0d42 \u0d1c\u0d42 \u0d13 \u0d38\u0d46 \u0d12 \u0d28 \u0d21\u0d3f".split(" "), MONTHS:"\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f \u0d2e\u0d3e\u0d30\u0d4d\u200d\u0d1a\u0d4d\u0d1a\u0d4d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d32\u0d4d\u200d \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d23\u0d4d\u200d \u0d1c\u0d42\u0d32\u0d48 \u0d06\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d30\u0d4d\u200d \u0d12\u0d15\u0d4d\u0d1f\u0d4b\u0d2c\u0d30\u0d4d\u200d \u0d28\u0d35\u0d02\u0d2c\u0d30\u0d4d\u200d \u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d30\u0d4d\u200d".split(" "), 
STANDALONEMONTHS:"\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f \u0d2e\u0d3e\u0d30\u0d4d\u200d\u0d1a\u0d4d\u0d1a\u0d4d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d32\u0d4d\u200d \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d23\u0d4d\u200d \u0d1c\u0d42\u0d32\u0d48 \u0d06\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d30\u0d4d\u200d \u0d12\u0d15\u0d4d\u0d1f\u0d4b\u0d2c\u0d30\u0d4d\u200d \u0d28\u0d35\u0d02\u0d2c\u0d30\u0d4d\u200d \u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d30\u0d4d\u200d".split(" "), 
SHORTMONTHS:"\u0d1c\u0d28\u0d41 \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41 \u0d2e\u0d3e\u0d30\u0d4d\u200d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d23\u0d4d\u200d \u0d1c\u0d42\u0d32\u0d48 \u0d13\u0d17 \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02 \u0d12\u0d15\u0d4d\u0d1f\u0d4b \u0d28\u0d35\u0d02 \u0d21\u0d3f\u0d38\u0d02".split(" "), STANDALONESHORTMONTHS:"\u0d1c\u0d28\u0d41 \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41 \u0d2e\u0d3e\u0d30\u0d4d\u200d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d23\u0d4d\u200d \u0d1c\u0d42\u0d32\u0d48 \u0d13\u0d17 \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02 \u0d12\u0d15\u0d4d\u0d1f\u0d4b \u0d28\u0d35\u0d02 \u0d21\u0d3f\u0d38\u0d02".split(" "), 
WEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u0d1a \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u0d1a \u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u0d1a \u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u0d1a \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u0d1a \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a \u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a".split(" "), STANDALONEWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u0d1a \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u0d1a \u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u0d1a \u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u0d1a \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u0d1a \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a \u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a".split(" "), 
SHORTWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d30\u0d4d\u200d \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d4d\u200d \u0d1a\u0d4a\u0d35\u0d4d\u0d35 \u0d2c\u0d41\u0d27\u0d28\u0d4d\u200d \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02 \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f \u0d36\u0d28\u0d3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d30\u0d4d\u200d \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d4d\u200d \u0d1a\u0d4a\u0d35\u0d4d\u0d35 \u0d2c\u0d41\u0d27\u0d28\u0d4d\u200d \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02 \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f \u0d36\u0d28\u0d3f".split(" "), 
NARROWWEEKDAYS:"\u0d1e\u0d3e \u0d24\u0d3f \u0d1a\u0d4a \u0d2c\u0d41 \u0d35\u0d4d\u0d2f\u0d3e \u0d35\u0d46 \u0d36".split(" "), STANDALONENARROWWEEKDAYS:"\u0d1e\u0d3e \u0d24\u0d3f \u0d1a\u0d4a \u0d2c\u0d41 \u0d35\u0d4d\u0d2f\u0d3e \u0d35\u0d46 \u0d36".split(" "), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0d12\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d30\u0d23\u0d4d\u0d1f\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d2e\u0d42\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", 
"\u0d28\u0d3e\u0d32\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02"], AMPMS:["am", "pm"], DATEFORMATS:["y, MMMM d, EEEE", "y, MMMM d", "y, MMM d", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_mr = {ERAS:["\u0908\u0938\u093e\u092a\u0942\u0930\u094d\u0935", "\u0938\u0928"], ERANAMES:["\u0908\u0938\u0935\u0940\u0938\u0928\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u0935\u0940\u0938\u0928"], NARROWMONTHS:"\u091c\u093e \u092b\u0947 \u092e\u093e \u090f \u092e\u0947 \u091c\u0942 \u091c\u0941 \u0911 \u0938 \u0911 \u0928\u094b \u0921\u093f".split(" "), STANDALONENARROWMONTHS:"\u091c\u093e \u092b\u0947 \u092e\u093e \u090f \u092e\u0947 \u091c\u0942 \u091c\u0941 \u0911 \u0938 \u0911 \u0928\u094b \u0921\u093f".split(" "), 
MONTHS:"\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917\u0938\u094d\u091f \u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930 \u0921\u093f\u0938\u0947\u0902\u092c\u0930".split(" "), STANDALONEMONTHS:"\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917\u0938\u094d\u091f \u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930 \u0921\u093f\u0938\u0947\u0902\u092c\u0930".split(" "), 
SHORTMONTHS:"\u091c\u093e\u0928\u0947 \u092b\u0947\u092c\u094d\u0930\u0941 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917 \u0938\u0947\u092a\u094d\u091f\u0947\u0902 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902 \u0921\u093f\u0938\u0947\u0902".split(" "), STANDALONESHORTMONTHS:"\u091c\u093e\u0928\u0947 \u092b\u0947\u092c\u094d\u0930\u0941 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917 \u0938\u0947\u092a\u094d\u091f\u0947\u0902 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902 \u0921\u093f\u0938\u0947\u0902".split(" "), 
WEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0933\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), STANDALONEWEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0933\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), 
SHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0933 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), STANDALONESHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0933 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), NARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), STANDALONENARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), 
SHORTQUARTERS:["\u0924\u093f 1", "2 \u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u0924\u093f 3", "\u0924\u093f 4"], QUARTERS:["\u092a\u094d\u0930\u0925\u092e \u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u094d\u0935\u093f\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", "\u0924\u0943\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u0924\u0941\u0930\u094d\u0925 \u0924\u093f\u092e\u093e\u0939\u0940"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", 
"d-M-yy"], TIMEFORMATS:["h-mm-ss a zzzz", "h-mm-ss a z", "h-mm-ss a", "h-mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ms = {ERAS:["S.M.", "TM"], ERANAMES:["S.M.", "TM"], NARROWMONTHS:"JFMAMJJOSOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJOSOND".split(""), MONTHS:"Januari Februari Mac April Mei Jun Julai Ogos September Oktober November Disember".split(" "), STANDALONEMONTHS:"Januari Februari Mac April Mei Jun Julai Ogos September Oktober November Disember".split(" "), SHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ogos Sep Okt Nov Dis".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ogos Sep Okt Nov Dis".split(" "), 
WEEKDAYS:"Ahad Isnin Selasa Rabu Khamis Jumaat Sabtu".split(" "), STANDALONEWEEKDAYS:"Ahad Isnin Selasa Rabu Khamis Jumaat Sabtu".split(" "), SHORTWEEKDAYS:"Ahd Isn Sel Rab Kha Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Ahd Isn Sel Rab Kha Jum Sab".split(" "), NARROWWEEKDAYS:"AISRKJS".split(""), STANDALONENARROWWEEKDAYS:"AISRKJS".split(""), SHORTQUARTERS:["Suku 1", "Suku Ke-2", "Suku Ke-3", "Suku Ke-4"], QUARTERS:["Suku pertama", "Suku Ke-2", "Suku Ke-3", "Suku Ke-4"], AMPMS:["PG", "PTG"], DATEFORMATS:["EEEE, d MMMM y", 
"d MMMM y", "dd/MM/yyyy", "d/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_mt = {ERAS:["QK", "WK"], ERANAMES:["Qabel Kristu", "Wara Kristu"], NARROWMONTHS:"JFMAM\u0120LASOND".split(""), STANDALONENARROWMONTHS:"JFMAM\u0120LASOND".split(""), MONTHS:"Jannar Frar Marzu April Mejju \u0120unju Lulju Awwissu Settembru Ottubru Novembru Di\u010bembru".split(" "), STANDALONEMONTHS:"Jannar Frar Marzu April Mejju \u0120unju Lulju Awwissu Settembru Ottubru Novembru Di\u010bembru".split(" "), SHORTMONTHS:"Jan Fra Mar Apr Mej \u0120un Lul Aww Set Ott Nov Di\u010b".split(" "), 
STANDALONESHORTMONTHS:"Jan Fra Mar Apr Mej \u0120un Lul Aww Set Ott Nov Di\u010b".split(" "), WEEKDAYS:"Il-\u0126add It-Tnejn It-Tlieta L-Erbg\u0127a Il-\u0126amis Il-\u0120img\u0127a Is-Sibt".split(" "), STANDALONEWEEKDAYS:"Il-\u0126add It-Tnejn It-Tlieta L-Erbg\u0127a Il-\u0126amis Il-\u0120img\u0127a Is-Sibt".split(" "), SHORTWEEKDAYS:"\u0126ad Tne Tli Erb \u0126am \u0120im Sib".split(" "), STANDALONESHORTWEEKDAYS:"\u0126ad Tne Tli Erb \u0126am \u0120im Sib".split(" "), NARROWWEEKDAYS:"\u0126TTE\u0126\u0120S".split(""), 
STANDALONENARROWWEEKDAYS:"\u0126TTE\u0126\u0120S".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["K1", "K2", "K3", "K4"], AMPMS:["QN", "WN"], DATEFORMATS:["EEEE, d 'ta'\u2019 MMMM y", "d 'ta'\u2019 MMMM y", "dd MMM y", "dd/MM/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_nl = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["Voor Christus", "na Christus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januari februari maart april mei juni juli augustus september oktober november december".split(" "), STANDALONEMONTHS:"januari februari maart april mei juni juli augustus september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mrt. apr. mei jun. jul. aug. sep. okt. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"jan feb mrt apr mei jun jul aug sep okt nov dec".split(" "), WEEKDAYS:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "), STANDALONEWEEKDAYS:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "), SHORTWEEKDAYS:"zo ma di wo do vr za".split(" "), STANDALONESHORTWEEKDAYS:"zo ma di wo do vr za".split(" "), NARROWWEEKDAYS:"ZMDWDVZ".split(""), STANDALONENARROWWEEKDAYS:"ZMDWDVZ".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1e kwartaal", 
"2e kwartaal", "3e kwartaal", "4e kwartaal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd-MM-yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_no = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), STANDALONEMONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), SHORTMONTHS:"jan. feb. mars apr. mai juni juli aug. sep. okt. nov. des.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr mai jun jul aug sep okt nov des".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n. man. tir. ons. tor. fre. l\u00f8r.".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8. ma. ti. on. to. fr. l\u00f8.".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", 
"4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. MMM y", "dd.MM.yy"], TIMEFORMATS:["'kl'. HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_or = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"\u0b1c\u0b3e \u0b2b\u0b47 \u0b2e\u0b3e \u0b05 \u0b2e\u0b47 \u0b1c\u0b41 \u0b1c\u0b41 \u0b05 \u0b38\u0b47 \u0b05 \u0b28 \u0b21\u0b3f".split(" "), STANDALONENARROWMONTHS:"\u0b1c\u0b3e \u0b2b\u0b47 \u0b2e\u0b3e \u0b05 \u0b2e\u0b47 \u0b1c\u0b41 \u0b1c\u0b41 \u0b05 \u0b38\u0b47 \u0b05 \u0b28 \u0b21\u0b3f".split(" "), MONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
STANDALONEMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
SHORTMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), STANDALONESHORTMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
WEEKDAYS:"\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30 \u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30 \u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30 \u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30 \u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30 \u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30 \u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30".split(" "), STANDALONEWEEKDAYS:"\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30 \u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30 \u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30 \u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30 \u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30 \u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30 \u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30".split(" "), 
SHORTWEEKDAYS:"\u0b30\u0b2c\u0b3f \u0b38\u0b4b\u0b2e \u0b2e\u0b19\u0b4d\u0b17\u0b33 \u0b2c\u0b41\u0b27 \u0b17\u0b41\u0b30\u0b41 \u0b36\u0b41\u0b15\u0b4d\u0b30 \u0b36\u0b28\u0b3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0b30\u0b2c\u0b3f \u0b38\u0b4b\u0b2e \u0b2e\u0b19\u0b4d\u0b17\u0b33 \u0b2c\u0b41\u0b27 \u0b17\u0b41\u0b30\u0b41 \u0b36\u0b41\u0b15\u0b4d\u0b30 \u0b36\u0b28\u0b3f".split(" "), NARROWWEEKDAYS:"\u0b30 \u0b38\u0b4b \u0b2e \u0b2c\u0b41 \u0b17\u0b41 \u0b36\u0b41 \u0b36".split(" "), STANDALONENARROWWEEKDAYS:"\u0b30 \u0b38\u0b4b \u0b2e \u0b2c\u0b41 \u0b17\u0b41 \u0b36\u0b41 \u0b36".split(" "), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_pl = {ERAS:["p.n.e.", "n.e."], ERANAMES:["p.n.e.", "n.e."], NARROWMONTHS:"slmkmclswplg".split(""), STANDALONENARROWMONTHS:"slmkmclswplg".split(""), MONTHS:"stycznia lutego marca kwietnia maja czerwca lipca sierpnia wrze\u015bnia pa\u017adziernika listopada grudnia".split(" "), STANDALONEMONTHS:"stycze\u0144 luty marzec kwiecie\u0144 maj czerwiec lipiec sierpie\u0144 wrzesie\u0144 pa\u017adziernik listopad grudzie\u0144".split(" "), SHORTMONTHS:"sty lut mar kwi maj cze lip sie wrz pa\u017a lis gru".split(" "), 
STANDALONESHORTMONTHS:"sty lut mar kwi maj cze lip sie wrz pa\u017a lis gru".split(" "), WEEKDAYS:"niedziela poniedzia\u0142ek wtorek \u015broda czwartek pi\u0105tek sobota".split(" "), STANDALONEWEEKDAYS:"niedziela poniedzia\u0142ek wtorek \u015broda czwartek pi\u0105tek sobota".split(" "), SHORTWEEKDAYS:"niedz. pon. wt. \u015br. czw. pt. sob.".split(" "), STANDALONESHORTWEEKDAYS:"niedz. pon. wt. \u015br. czw. pt. sob.".split(" "), NARROWWEEKDAYS:"NPW\u015aCPS".split(""), STANDALONENARROWWEEKDAYS:"NPW\u015aCPS".split(""), 
SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["I kwarta\u0142", "II kwarta\u0142", "III kwarta\u0142", "IV kwarta\u0142"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd.MM.yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_pt = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janeiro fevereiro mar\u00e7o abril maio junho julho agosto setembro outubro novembro dezembro".split(" "), STANDALONEMONTHS:"janeiro fevereiro mar\u00e7o abril maio junho julho agosto setembro outubro novembro dezembro".split(" "), SHORTMONTHS:"jan fev mar abr mai jun jul ago set out nov dez".split(" "), 
STANDALONESHORTMONTHS:"jan fev mar abr mai jun jul ago set out nov dez".split(" "), WEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), SHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), NARROWWEEKDAYS:"DSTQQSS".split(""), STANDALONENARROWWEEKDAYS:"DSTQQSS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1\u00ba trimestre", "2\u00ba trimestre", "3\u00ba trimestre", "4\u00ba trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["HH'h'mm'min'ss's' zzzz", "HH'h'mm'min'ss's' z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_pt_BR = goog.i18n.DateTimeSymbols_pt;
goog.i18n.DateTimeSymbols_pt_PT = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Janeiro Fevereiro Mar\u00e7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "), STANDALONEMONTHS:"Janeiro Fevereiro Mar\u00e7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "), SHORTMONTHS:"Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" "), 
STANDALONESHORTMONTHS:"Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" "), WEEKDAYS:"Domingo Segunda-feira Ter\u00e7a-feira Quarta-feira Quinta-feira Sexta-feira S\u00e1bado".split(" "), STANDALONEWEEKDAYS:"Domingo Segunda-feira Ter\u00e7a-feira Quarta-feira Quinta-feira Sexta-feira S\u00e1bado".split(" "), SHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), NARROWWEEKDAYS:"DSTQQSS".split(""), STANDALONENARROWWEEKDAYS:"DSTQQSS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1.\u00ba trimestre", "2.\u00ba trimestre", "3.\u00ba trimestre", "4.\u00ba trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ro = {ERAS:["\u00ee.Hr.", "d.Hr."], ERANAMES:["\u00eenainte de Hristos", "dup\u0103 Hristos"], NARROWMONTHS:"IFMAMIIASOND".split(""), STANDALONENARROWMONTHS:"IFMAMIIASOND".split(""), MONTHS:"ianuarie februarie martie aprilie mai iunie iulie august septembrie octombrie noiembrie decembrie".split(" "), STANDALONEMONTHS:"ianuarie februarie martie aprilie mai iunie iulie august septembrie octombrie noiembrie decembrie".split(" "), SHORTMONTHS:"ian. feb. mar. apr. mai iun. iul. aug. sept. oct. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"ian. feb. mar. apr. mai iun. iul. aug. sept. oct. nov. dec.".split(" "), WEEKDAYS:"duminic\u0103 luni mar\u021bi miercuri joi vineri s\u00e2mb\u0103t\u0103".split(" "), STANDALONEWEEKDAYS:"duminic\u0103 luni mar\u021bi miercuri joi vineri s\u00e2mb\u0103t\u0103".split(" "), SHORTWEEKDAYS:"Du Lu Ma Mi Jo Vi S\u00e2".split(" "), STANDALONESHORTWEEKDAYS:"Du Lu Ma Mi Jo Vi S\u00e2".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["trim. I", 
"trim. II", "trim. III", "trim. IV"], QUARTERS:["trimestrul I", "trimestrul al II-lea", "trimestrul al III-lea", "trimestrul al IV-lea"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd.MM.yyyy", "dd.MM.yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ru = {ERAS:["\u0434\u043e \u043d.\u044d.", "\u043d.\u044d."], ERANAMES:["\u0434\u043e \u043d.\u044d.", "\u043d.\u044d."], NARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), STANDALONENARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), MONTHS:"\u044f\u043d\u0432\u0430\u0440\u044f \u0444\u0435\u0432\u0440\u0430\u043b\u044f \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440\u0435\u043b\u044f \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433\u0443\u0441\u0442\u0430 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f \u043e\u043a\u0442\u044f\u0431\u0440\u044f \u043d\u043e\u044f\u0431\u0440\u044f \u0434\u0435\u043a\u0430\u0431\u0440\u044f".split(" "), 
STANDALONEMONTHS:"\u042f\u043d\u0432\u0430\u0440\u044c \u0424\u0435\u0432\u0440\u0430\u043b\u044c \u041c\u0430\u0440\u0442 \u0410\u043f\u0440\u0435\u043b\u044c \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433\u0443\u0441\u0442 \u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u041e\u043a\u0442\u044f\u0431\u0440\u044c \u041d\u043e\u044f\u0431\u0440\u044c \u0414\u0435\u043a\u0430\u0431\u0440\u044c".split(" "), SHORTMONTHS:"\u044f\u043d\u0432. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440. \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433. \u0441\u0435\u043d\u0442. \u043e\u043a\u0442. \u043d\u043e\u044f\u0431. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u042f\u043d\u0432. \u0424\u0435\u0432\u0440. \u041c\u0430\u0440\u0442 \u0410\u043f\u0440. \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433. \u0421\u0435\u043d\u0442. \u041e\u043a\u0442. \u041d\u043e\u044f\u0431. \u0414\u0435\u043a.".split(" "), WEEKDAYS:"\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0433 \u043f\u044f\u0442\u043d\u0438\u0446\u0430 \u0441\u0443\u0431\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0412\u0442\u043e\u0440\u043d\u0438\u043a \u0421\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440\u0433 \u041f\u044f\u0442\u043d\u0438\u0446\u0430 \u0421\u0443\u0431\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u0432\u0441 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u0412\u0441 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), 
NARROWWEEKDAYS:"\u0412 \u041f\u043d \u0412\u0442 \u0421 \u0427 \u041f \u0421".split(" "), STANDALONENARROWWEEKDAYS:"\u0412\u041f\u0412\u0421\u0427\u041f\u0421".split(""), SHORTQUARTERS:["1-\u0439 \u043a\u0432.", "2-\u0439 \u043a\u0432.", "3-\u0439 \u043a\u0432.", "4-\u0439 \u043a\u0432."], QUARTERS:["1-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "2-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "3-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "4-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], 
AMPMS:["\u0434\u043e \u043f\u043e\u043b\u0443\u0434\u043d\u044f", "\u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u043b\u0443\u0434\u043d\u044f"], DATEFORMATS:["EEEE, d MMMM y\u00a0'\u0433'.", "d MMMM y\u00a0'\u0433'.", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sk = {ERAS:["pred n.l.", "n.l."], ERANAMES:["pred n.l.", "n.l."], NARROWMONTHS:"jfmamjjasond".split(""), STANDALONENARROWMONTHS:"jfmamjjasond".split(""), MONTHS:"janu\u00e1ra febru\u00e1ra marca apr\u00edla m\u00e1ja j\u00fana j\u00fala augusta septembra okt\u00f3bra novembra decembra".split(" "), STANDALONEMONTHS:"janu\u00e1r febru\u00e1r marec apr\u00edl m\u00e1j j\u00fan j\u00fal august september okt\u00f3ber november december".split(" "), SHORTMONTHS:"jan feb mar apr m\u00e1j j\u00fan j\u00fal aug sep okt nov dec".split(" "), 
STANDALONESHORTMONTHS:"jan feb mar apr m\u00e1j j\u00fan j\u00fal aug sep okt nov dec".split(" "), WEEKDAYS:"nede\u013ea pondelok utorok streda \u0161tvrtok piatok sobota".split(" "), STANDALONEWEEKDAYS:"nede\u013ea pondelok utorok streda \u0161tvrtok piatok sobota".split(" "), SHORTWEEKDAYS:"ne po ut st \u0161t pi so".split(" "), STANDALONESHORTWEEKDAYS:"ne po ut st \u0161t pi so".split(" "), NARROWWEEKDAYS:"NPUS\u0160PS".split(""), STANDALONENARROWWEEKDAYS:"NPUS\u0160PS".split(""), SHORTQUARTERS:["Q1", 
"Q2", "Q3", "Q4"], QUARTERS:["1. \u0161tvr\u0165rok", "2. \u0161tvr\u0165rok", "3. \u0161tvr\u0165rok", "4. \u0161tvr\u0165rok"], AMPMS:["dopoludnia", "popoludn\u00ed"], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d.M.yyyy", "d.M.yyyy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sl = {ERAS:["pr. n. \u0161t.", "po Kr."], ERANAMES:["pred na\u0161im \u0161tetjem", "na\u0161e \u0161tetje"], NARROWMONTHS:"jfmamjjasond".split(""), STANDALONENARROWMONTHS:"jfmamjjasond".split(""), MONTHS:"januar februar marec april maj junij julij avgust september oktober november december".split(" "), STANDALONEMONTHS:"januar februar marec april maj junij julij avgust september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mar. apr. maj jun. jul. avg. sep. okt. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"jan feb mar apr maj jun jul avg sep okt nov dec".split(" "), WEEKDAYS:"nedelja ponedeljek torek sreda \u010detrtek petek sobota".split(" "), STANDALONEWEEKDAYS:"nedelja ponedeljek torek sreda \u010detrtek petek sobota".split(" "), SHORTWEEKDAYS:"ned. pon. tor. sre. \u010det. pet. sob.".split(" "), STANDALONESHORTWEEKDAYS:"ned pon tor sre \u010det pet sob".split(" "), NARROWWEEKDAYS:"npts\u010dps".split(""), STANDALONENARROWWEEKDAYS:"npts\u010dps".split(""), SHORTQUARTERS:["Q1", 
"Q2", "Q3", "Q4"], QUARTERS:["1. \u010detrtletje", "2. \u010detrtletje", "3. \u010detrtletje", "4. \u010detrtletje"], AMPMS:["dop.", "pop."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "d. MMM yyyy", "d. MM. yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sq = {ERAS:["p.e.r.", "n.e.r."], ERANAMES:["p.e.r.", "n.e.r."], NARROWMONTHS:"JSMPMQKGSTND".split(""), STANDALONENARROWMONTHS:"JSMPMQKGSTND".split(""), MONTHS:"janar shkurt mars prill maj qershor korrik gusht shtator tetor n\u00ebntor dhjetor".split(" "), STANDALONEMONTHS:"janar shkurt mars prill maj qershor korrik gusht shtator tetor n\u00ebntor dhjetor".split(" "), SHORTMONTHS:"Jan Shk Mar Pri Maj Qer Kor Gsh Sht Tet N\u00ebn Dhj".split(" "), STANDALONESHORTMONTHS:"Jan Shk Mar Pri Maj Qer Kor Gsh Sht Tet N\u00ebn Dhj".split(" "), 
WEEKDAYS:"e diel;e h\u00ebn\u00eb;e mart\u00eb;e m\u00ebrkur\u00eb;e enjte;e premte;e shtun\u00eb".split(";"), STANDALONEWEEKDAYS:"e diel;e h\u00ebn\u00eb;e mart\u00eb;e m\u00ebrkur\u00eb;e enjte;e premte;e shtun\u00eb".split(";"), SHORTWEEKDAYS:"Die H\u00ebn Mar M\u00ebr Enj Pre Sht".split(" "), STANDALONESHORTWEEKDAYS:"Die H\u00ebn Mar M\u00ebr Enj Pre Sht".split(" "), NARROWWEEKDAYS:"DHMMEPS".split(""), STANDALONENARROWWEEKDAYS:"DHMMEPS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", 
"Q2", "Q3", "Q4"], AMPMS:["PD", "MD"], DATEFORMATS:["EEEE, dd MMMM y", "dd MMMM y", "yyyy-MM-dd", "yy-MM-dd"], TIMEFORMATS:["h.mm.ss.a zzzz", "h.mm.ss.a z", "h.mm.ss.a", "h.mm.a"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sr = {ERAS:["\u043f. \u043d. \u0435.", "\u043d. \u0435."], ERANAMES:["\u041f\u0440\u0435 \u043d\u043e\u0432\u0435 \u0435\u0440\u0435", "\u041d\u043e\u0432\u0435 \u0435\u0440\u0435"], NARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), STANDALONENARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), MONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440 \u0444\u0435\u0431\u0440\u0443\u0430\u0440 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440 \u043e\u043a\u0442\u043e\u0431\u0430\u0440 \u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440 \u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440".split(" "), 
STANDALONEMONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440 \u0444\u0435\u0431\u0440\u0443\u0430\u0440 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440 \u043e\u043a\u0442\u043e\u0431\u0430\u0440 \u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440 \u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440".split(" "), SHORTMONTHS:"\u0458\u0430\u043d \u0444\u0435\u0431 \u043c\u0430\u0440 \u0430\u043f\u0440 \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433 \u0441\u0435\u043f \u043e\u043a\u0442 \u043d\u043e\u0432 \u0434\u0435\u0446".split(" "), 
STANDALONESHORTMONTHS:"\u0458\u0430\u043d \u0444\u0435\u0431 \u043c\u0430\u0440 \u0430\u043f\u0440 \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433 \u0441\u0435\u043f \u043e\u043a\u0442 \u043d\u043e\u0432 \u0434\u0435\u0446".split(" "), WEEKDAYS:"\u043d\u0435\u0434\u0435\u0459\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a \u0443\u0442\u043e\u0440\u0430\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a \u043f\u0435\u0442\u0430\u043a \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u043d\u0435\u0434\u0435\u0459\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a \u0443\u0442\u043e\u0440\u0430\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a \u043f\u0435\u0442\u0430\u043a \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u043d\u0435\u0434 \u043f\u043e\u043d \u0443\u0442\u043e \u0441\u0440\u0435 \u0447\u0435\u0442 \u043f\u0435\u0442 \u0441\u0443\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u043d\u0435\u0434 \u043f\u043e\u043d \u0443\u0442\u043e \u0441\u0440\u0435 \u0447\u0435\u0442 \u043f\u0435\u0442 \u0441\u0443\u0431".split(" "), 
NARROWWEEKDAYS:"\u043d\u043f\u0443\u0441\u0447\u043f\u0441".split(""), STANDALONENARROWWEEKDAYS:"\u043d\u043f\u0443\u0441\u0447\u043f\u0441".split(""), SHORTQUARTERS:["\u041a1", "\u041a2", "\u041a3", "\u041a4"], QUARTERS:["\u041f\u0440\u0432\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0414\u0440\u0443\u0433\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0422\u0440\u0435\u045b\u0435 \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", 
"\u0427\u0435\u0442\u0432\u0440\u0442\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435"], AMPMS:["\u043f\u0440\u0435 \u043f\u043e\u0434\u043d\u0435", "\u043f\u043e\u043f\u043e\u0434\u043d\u0435"], DATEFORMATS:["EEEE, dd. MMMM y.", "dd. MMMM y.", "dd.MM.y.", "d.M.yy."], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sv = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f\u00f6re Kristus", "efter Kristus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januari februari mars april maj juni juli augusti september oktober november december".split(" "), STANDALONEMONTHS:"januari februari mars april maj juni juli augusti september oktober november december".split(" "), SHORTMONTHS:"jan feb mar apr maj jun jul aug sep okt nov dec".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr maj jun jul aug sep okt nov dec".split(" "), 
WEEKDAYS:"s\u00f6ndag m\u00e5ndag tisdag onsdag torsdag fredag l\u00f6rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f6ndag m\u00e5ndag tisdag onsdag torsdag fredag l\u00f6rdag".split(" "), SHORTWEEKDAYS:"s\u00f6n m\u00e5n tis ons tors fre l\u00f6r".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f6n m\u00e5n tis ons tor fre l\u00f6r".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1:a kvartalet", "2:a kvartalet", 
"3:e kvartalet", "4:e kvartalet"], AMPMS:["fm", "em"], DATEFORMATS:["EEEE'en' 'den' d:'e' MMMM y", "d MMMM y", "d MMM y", "yyyy-MM-dd"], TIMEFORMATS:["'kl'. HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sw = {ERAS:["KK", "BK"], ERANAMES:["Kabla ya Kristo", "Baada ya Kristo"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Machi Aprili Mei Juni Julai Agosti Septemba Oktoba Novemba Desemba".split(" "), STANDALONEMONTHS:"Januari Februari Machi Aprili Mei Juni Julai Agosti Septemba Oktoba Novemba Desemba".split(" "), SHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), STANDALONEWEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), SHORTWEEKDAYS:"J2 J3 J4 J5 Alh Ij J1".split(" "), STANDALONESHORTWEEKDAYS:"J2 J3 J4 J5 Alh Ij J1".split(" "), NARROWWEEKDAYS:"2345AI1".split(""), STANDALONENARROWWEEKDAYS:"2345AI1".split(""), SHORTQUARTERS:["R1", "R2", "R3", "R4"], QUARTERS:["Robo 1", "Robo 2", "Robo 3", "Robo 4"], AMPMS:["asubuhi", "alasiri"], DATEFORMATS:["EEEE, d MMMM y", 
"d MMMM y", "d MMM y", "dd/MM/yyyy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ta = {ERAS:["\u0b95\u0bbf.\u0bae\u0bc1.", "\u0b95\u0bbf.\u0baa\u0bbf."], ERANAMES:["\u0b95\u0bbf\u0bb1\u0bbf\u0bb8\u0bcd\u0ba4\u0bc1\u0bb5\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0bae\u0bc1\u0ba9\u0bcd", "\u0b85\u0ba9\u0bcb \u0b9f\u0bcb\u0bae\u0bbf\u0ba9\u0bbf"], NARROWMONTHS:"\u0b9c \u0baa\u0bbf \u0bae\u0bbe \u0b8f \u0bae\u0bc7 \u0b9c\u0bc2 \u0b9c\u0bc2 \u0b86 \u0b9a\u0bc6 \u0b85 \u0ba8 \u0b9f\u0bbf".split(" "), STANDALONENARROWMONTHS:"\u0b9c \u0baa\u0bbf \u0bae\u0bbe \u0b8f \u0bae\u0bc7 \u0b9c\u0bc2 \u0b9c\u0bc2 \u0b86 \u0b9a\u0bc6 \u0b85 \u0ba8 \u0b9f\u0bbf".split(" "), 
MONTHS:"\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf \u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf \u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd \u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bcd \u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd \u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd".split(" "), STANDALONEMONTHS:"\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf \u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf \u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd \u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bc1 \u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd \u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd".split(" "), 
SHORTMONTHS:"\u0b9c\u0ba9. \u0baa\u0bbf\u0baa\u0bcd. \u0bae\u0bbe\u0bb0\u0bcd. \u0b8f\u0baa\u0bcd. \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95. \u0b9a\u0bc6\u0baa\u0bcd. \u0b85\u0b95\u0bcd. \u0ba8\u0bb5. \u0b9f\u0bbf\u0b9a.".split(" "), STANDALONESHORTMONTHS:"\u0b9c\u0ba9. \u0baa\u0bbf\u0baa\u0bcd. \u0bae\u0bbe\u0bb0\u0bcd. \u0b8f\u0baa\u0bcd. \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95. \u0b9a\u0bc6\u0baa\u0bcd. \u0b85\u0b95\u0bcd. \u0ba8\u0bb5. \u0b9f\u0bbf\u0b9a.".split(" "), 
WEEKDAYS:"\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1 \u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd \u0baa\u0bc1\u0ba4\u0ba9\u0bcd \u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd \u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf \u0b9a\u0ba9\u0bbf".split(" "), STANDALONEWEEKDAYS:"\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1 \u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd \u0baa\u0bc1\u0ba4\u0ba9\u0bcd \u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd \u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf \u0b9a\u0ba9\u0bbf".split(" "), 
SHORTWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), STANDALONESHORTWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), NARROWWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), STANDALONENARROWWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), SHORTQUARTERS:["\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc11", 
"\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc12", "\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc13", "\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc14"], QUARTERS:["\u0bae\u0bc1\u0ba4\u0bb2\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0b87\u0bb0\u0ba3\u0bcd\u0b9f\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0bae\u0bc2\u0ba9\u0bcd\u0bb1\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0ba8\u0bbe\u0ba9\u0bcd\u0b95\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1"], 
AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_te = {ERAS:["\u0c08\u0c38\u0c3e\u0c2a\u0c42\u0c30\u0c4d\u0c35.", "\u0c38\u0c28\u0c4d."], ERANAMES:["\u0c08\u0c38\u0c3e\u0c2a\u0c42\u0c30\u0c4d\u0c35.", "\u0c38\u0c28\u0c4d."], NARROWMONTHS:"\u0c1c \u0c2b\u0c3f \u0c2e\u0c3e \u0c0f \u0c2e\u0c46 \u0c1c\u0c41 \u0c1c\u0c41 \u0c06 \u0c38\u0c46 \u0c05 \u0c28 \u0c21\u0c3f".split(" "), STANDALONENARROWMONTHS:"\u0c1c \u0c2b\u0c3f \u0c2e \u0c0e \u0c2e\u0c46 \u0c1c\u0c41 \u0c1c\u0c41 \u0c06 \u0c38\u0c46 \u0c05 \u0c28 \u0c21\u0c3f".split(" "), 
MONTHS:"\u0c1c\u0c28\u0c35\u0c30\u0c3f \u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0e\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c42\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), STANDALONEMONTHS:"\u0c1c\u0c28\u0c35\u0c30\u0c3f \u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0e\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c42\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), 
SHORTMONTHS:"\u0c1c\u0c28 \u0c2b\u0c3f\u0c2c\u0c4d\u0c30 \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0f\u0c2a\u0c4d\u0c30\u0c3f \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c42\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), STANDALONESHORTMONTHS:"\u0c1c\u0c28 \u0c2b\u0c3f\u0c2c\u0c4d\u0c30 \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0f\u0c2a\u0c4d\u0c30\u0c3f \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c42\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), 
WEEKDAYS:"\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02 \u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02 \u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02 \u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02 \u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02".split(" "), STANDALONEWEEKDAYS:"\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02 \u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02 \u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02 \u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02 \u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02".split(" "), 
SHORTWEEKDAYS:"\u0c06\u0c26\u0c3f \u0c38\u0c4b\u0c2e \u0c2e\u0c02\u0c17\u0c33 \u0c2c\u0c41\u0c27 \u0c17\u0c41\u0c30\u0c41 \u0c36\u0c41\u0c15\u0c4d\u0c30 \u0c36\u0c28\u0c3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0c06\u0c26\u0c3f \u0c38\u0c4b\u0c2e \u0c2e\u0c02\u0c17\u0c33 \u0c2c\u0c41\u0c27 \u0c17\u0c41\u0c30\u0c41 \u0c36\u0c41\u0c15\u0c4d\u0c30 \u0c36\u0c28\u0c3f".split(" "), NARROWWEEKDAYS:"\u0c06 \u0c38\u0c4b \u0c2e \u0c2c\u0c41 \u0c17\u0c41 \u0c36\u0c41 \u0c36".split(" "), STANDALONENARROWWEEKDAYS:"\u0c06 \u0c38\u0c4b \u0c2e \u0c2c\u0c41 \u0c17\u0c41 \u0c36\u0c41 \u0c36".split(" "), 
SHORTQUARTERS:["\u0c12\u0c15\u0c1f\u0c3f 1", "\u0c30\u0c46\u0c02\u0c21\u0c41 2", "\u0c2e\u0c42\u0c21\u0c41 3", "\u0c28\u0c3e\u0c32\u0c41\u0c17\u0c41 4"], QUARTERS:["\u0c12\u0c15\u0c1f\u0c3f 1", "\u0c30\u0c46\u0c02\u0c21\u0c41 2", "\u0c2e\u0c42\u0c21\u0c41 3", "\u0c28\u0c3e\u0c32\u0c41\u0c17\u0c41 4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd-MM-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_th = {ERAS:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19 \u0e04.\u0e28.", "\u0e04.\u0e28."], ERANAMES:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a", "\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a"], NARROWMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22 \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), 
STANDALONENARROWMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), MONTHS:"\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21 \u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c \u0e21\u0e35\u0e19\u0e32\u0e04\u0e21 \u0e40\u0e21\u0e29\u0e32\u0e22\u0e19 \u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21 \u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19 \u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21 \u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21 \u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19 \u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21".split(" "), 
STANDALONEMONTHS:"\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21 \u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c \u0e21\u0e35\u0e19\u0e32\u0e04\u0e21 \u0e40\u0e21\u0e29\u0e32\u0e22\u0e19 \u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21 \u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19 \u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21 \u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21 \u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19 \u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21".split(" "), 
SHORTMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), STANDALONESHORTMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), WEEKDAYS:"\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c \u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18 \u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35 \u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c".split(" "), 
STANDALONEWEEKDAYS:"\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c \u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18 \u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35 \u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c".split(" "), SHORTWEEKDAYS:"\u0e2d\u0e32. \u0e08. \u0e2d. \u0e1e. \u0e1e\u0e24. \u0e28. \u0e2a.".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0e2d\u0e32. \u0e08. \u0e2d. \u0e1e. \u0e1e\u0e24. \u0e28. \u0e2a.".split(" "), NARROWWEEKDAYS:"\u0e2d\u0e08\u0e2d\u0e1e\u0e1e\u0e28\u0e2a".split(""), STANDALONENARROWWEEKDAYS:"\u0e2d\u0e08\u0e2d\u0e1e\u0e1e\u0e28\u0e2a".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 1", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 2", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 3", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 4"], AMPMS:["\u0e01\u0e48\u0e2d\u0e19\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07", 
"\u0e2b\u0e25\u0e31\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07"], DATEFORMATS:["EEEE\u0e17\u0e35\u0e48 d MMMM G y", "d MMMM y", "d MMM y", "d/M/yyyy"], TIMEFORMATS:["H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 m \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 zzzz", "H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 m \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 z", "H:mm:ss", "H:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_tl = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"EPMAMHHASOND".split(""), STANDALONENARROWMONTHS:"EPMAMHHASOND".split(""), MONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), STANDALONEMONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), SHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), STANDALONESHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), 
WEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), STANDALONEWEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), SHORTWEEKDAYS:"Lin Lun Mar Mye Huw Bye Sab".split(" "), STANDALONESHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), NARROWWEEKDAYS:"LLMMHBS".split(""), STANDALONENARROWWEEKDAYS:"LLMMHBS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ika-1 sangkapat", "ika-2 sangkapat", "ika-3 quarter", "ika-4 na quarter"], AMPMS:["AM", 
"PM"], DATEFORMATS:["EEEE, MMMM dd y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_tr = {ERAS:["M\u00d6", "MS"], ERANAMES:["Milattan \u00d6nce", "Milattan Sonra"], NARROWMONTHS:"O\u015eMNMHTAEEKA".split(""), STANDALONENARROWMONTHS:"O\u015eMNMHTAEEKA".split(""), MONTHS:"Ocak \u015eubat Mart Nisan May\u0131s Haziran Temmuz A\u011fustos Eyl\u00fcl Ekim Kas\u0131m Aral\u0131k".split(" "), STANDALONEMONTHS:"Ocak \u015eubat Mart Nisan May\u0131s Haziran Temmuz A\u011fustos Eyl\u00fcl Ekim Kas\u0131m Aral\u0131k".split(" "), SHORTMONTHS:"Oca \u015eub Mar Nis May Haz Tem A\u011fu Eyl Eki Kas Ara".split(" "), 
STANDALONESHORTMONTHS:"Oca \u015eub Mar Nis May Haz Tem A\u011fu Eyl Eki Kas Ara".split(" "), WEEKDAYS:"Pazar Pazartesi Sal\u0131 \u00c7ar\u015famba Per\u015fembe Cuma Cumartesi".split(" "), STANDALONEWEEKDAYS:"Pazar Pazartesi Sal\u0131 \u00c7ar\u015famba Per\u015fembe Cuma Cumartesi".split(" "), SHORTWEEKDAYS:"Paz Pzt Sal \u00c7ar Per Cum Cmt".split(" "), STANDALONESHORTWEEKDAYS:"Paz Pzt Sal \u00c7ar Per Cum Cmt".split(" "), NARROWWEEKDAYS:"PPS\u00c7PCC".split(""), STANDALONENARROWWEEKDAYS:"PPS\u00c7PCC".split(""), 
SHORTQUARTERS:["\u00c71", "\u00c72", "\u00c73", "\u00c74"], QUARTERS:["1. \u00e7eyrek", "2. \u00e7eyrek", "3. \u00e7eyrek", "4. \u00e7eyrek"], AMPMS:["AM", "PM"], DATEFORMATS:["d MMMM y EEEE", "d MMMM y", "d MMM y", "dd MM yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_uk = {ERAS:["\u0434\u043e \u043d.\u0435.", "\u043d.\u0435."], ERANAMES:["\u0434\u043e \u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438", "\u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438"], NARROWMONTHS:"\u0421\u041b\u0411\u041a\u0422\u0427\u041b\u0421\u0412\u0416\u041b\u0413".split(""), STANDALONENARROWMONTHS:"\u0421\u041b\u0411\u041a\u0422\u0427\u041b\u0421\u0412\u0416\u041b\u0413".split(""), MONTHS:"\u0441\u0456\u0447\u043d\u044f \u043b\u044e\u0442\u043e\u0433\u043e \u0431\u0435\u0440\u0435\u0437\u043d\u044f \u043a\u0432\u0456\u0442\u043d\u044f \u0442\u0440\u0430\u0432\u043d\u044f \u0447\u0435\u0440\u0432\u043d\u044f \u043b\u0438\u043f\u043d\u044f \u0441\u0435\u0440\u043f\u043d\u044f \u0432\u0435\u0440\u0435\u0441\u043d\u044f \u0436\u043e\u0432\u0442\u043d\u044f \u043b\u0438\u0441\u0442\u043e\u043f\u0430\u0434\u0430 \u0433\u0440\u0443\u0434\u043d\u044f".split(" "), 
STANDALONEMONTHS:"\u0421\u0456\u0447\u0435\u043d\u044c \u041b\u044e\u0442\u0438\u0439 \u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c \u041a\u0432\u0456\u0442\u0435\u043d\u044c \u0422\u0440\u0430\u0432\u0435\u043d\u044c \u0427\u0435\u0440\u0432\u0435\u043d\u044c \u041b\u0438\u043f\u0435\u043d\u044c \u0421\u0435\u0440\u043f\u0435\u043d\u044c \u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c \u0416\u043e\u0432\u0442\u0435\u043d\u044c \u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434 \u0413\u0440\u0443\u0434\u0435\u043d\u044c".split(" "), 
SHORTMONTHS:"\u0441\u0456\u0447. \u043b\u044e\u0442. \u0431\u0435\u0440. \u043a\u0432\u0456\u0442. \u0442\u0440\u0430\u0432. \u0447\u0435\u0440\u0432. \u043b\u0438\u043f. \u0441\u0435\u0440\u043f. \u0432\u0435\u0440. \u0436\u043e\u0432\u0442. \u043b\u0438\u0441\u0442. \u0433\u0440\u0443\u0434.".split(" "), STANDALONESHORTMONTHS:"\u0421\u0456\u0447 \u041b\u044e\u0442 \u0411\u0435\u0440 \u041a\u0432\u0456 \u0422\u0440\u0430 \u0427\u0435\u0440 \u041b\u0438\u043f \u0421\u0435\u0440 \u0412\u0435\u0440 \u0416\u043e\u0432 \u041b\u0438\u0441 \u0413\u0440\u0443".split(" "), 
WEEKDAYS:"\u041d\u0435\u0434\u0456\u043b\u044f \u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0421\u0435\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440 \u041f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f \u0421\u0443\u0431\u043e\u0442\u0430".split(" "), STANDALONEWEEKDAYS:"\u041d\u0435\u0434\u0456\u043b\u044f \u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0421\u0435\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440 \u041f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f \u0421\u0443\u0431\u043e\u0442\u0430".split(" "), 
SHORTWEEKDAYS:"\u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), NARROWWEEKDAYS:"\u041d\u041f\u0412\u0421\u0427\u041f\u0421".split(""), STANDALONENARROWWEEKDAYS:"\u041d\u041f\u0412\u0421\u0427\u041f\u0421".split(""), SHORTQUARTERS:["I \u043a\u0432.", "II \u043a\u0432.", "III \u043a\u0432.", "IV \u043a\u0432."], QUARTERS:["I \u043a\u0432\u0430\u0440\u0442\u0430\u043b", 
"II \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "III \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "IV \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], AMPMS:["\u0434\u043f", "\u043f\u043f"], DATEFORMATS:["EEEE, d MMMM y '\u0440'.", "d MMMM y '\u0440'.", "d MMM y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ur = {ERAS:["\u0642 \u0645", "\u0639\u064a\u0633\u0648\u06cc \u0633\u0646"], ERANAMES:["\u0642\u0628\u0644 \u0645\u0633\u064a\u062d", "\u0639\u064a\u0633\u0648\u06cc \u0633\u0646"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u064a\u0644 \u0645\u0626 \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626 \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u064a\u0644 \u0645\u0626 \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626 \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u064a\u0644 \u0645\u0626 \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626 \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u064a\u0644 \u0645\u0626 \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626 \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u067e\u064a\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u0647 \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), 
STANDALONEWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u067e\u064a\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u0647 \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), SHORTWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u067e\u064a\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u0647 \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), STANDALONESHORTWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u067e\u064a\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u0647 \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), 
NARROWWEEKDAYS:"1234567".split(""), STANDALONENARROWWEEKDAYS:"1234567".split(""), SHORTQUARTERS:["\u067e\u06c1\u0644\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062f\u0648\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062a\u064a\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u0686\u0648\u062a\u0647\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc"], QUARTERS:["\u067e\u06c1\u0644\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062f\u0648\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", 
"\u062a\u064a\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u0686\u0648\u062a\u0647\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc"], AMPMS:["\u062f\u0646", "\u0631\u0627\u062a"], DATEFORMATS:["EEEE\u060d d\u060d MMMM y", "d\u060d MMMM y", "d\u060d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_vi = {ERAS:["tr. CN", "sau CN"], ERANAMES:["tr. CN", "sau CN"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"th\u00e1ng m\u1ed9t;th\u00e1ng hai;th\u00e1ng ba;th\u00e1ng t\u01b0;th\u00e1ng n\u0103m;th\u00e1ng s\u00e1u;th\u00e1ng b\u1ea3y;th\u00e1ng t\u00e1m;th\u00e1ng ch\u00edn;th\u00e1ng m\u01b0\u1eddi;th\u00e1ng m\u01b0\u1eddi m\u1ed9t;th\u00e1ng m\u01b0\u1eddi hai".split(";"), STANDALONEMONTHS:"th\u00e1ng m\u1ed9t;th\u00e1ng hai;th\u00e1ng ba;th\u00e1ng t\u01b0;th\u00e1ng n\u0103m;th\u00e1ng s\u00e1u;th\u00e1ng b\u1ea3y;th\u00e1ng t\u00e1m;th\u00e1ng ch\u00edn;th\u00e1ng m\u01b0\u1eddi;th\u00e1ng m\u01b0\u1eddi m\u1ed9t;th\u00e1ng m\u01b0\u1eddi hai".split(";"), 
SHORTMONTHS:"thg 1;thg 2;thg 3;thg 4;thg 5;thg 6;thg 7;thg 8;thg 9;thg 10;thg 11;thg 12".split(";"), STANDALONESHORTMONTHS:"thg 1;thg 2;thg 3;thg 4;thg 5;thg 6;thg 7;thg 8;thg 9;thg 10;thg 11;thg 12".split(";"), WEEKDAYS:"Ch\u1ee7 nh\u1eadt;Th\u1ee9 hai;Th\u1ee9 ba;Th\u1ee9 t\u01b0;Th\u1ee9 n\u0103m;Th\u1ee9 s\u00e1u;Th\u1ee9 b\u1ea3y".split(";"), STANDALONEWEEKDAYS:"Ch\u1ee7 nh\u1eadt;Th\u1ee9 hai;Th\u1ee9 ba;Th\u1ee9 t\u01b0;Th\u1ee9 n\u0103m;Th\u1ee9 s\u00e1u;Th\u1ee9 b\u1ea3y".split(";"), SHORTWEEKDAYS:"CN;Th 2;Th 3;Th 4;Th 5;Th 6;Th 7".split(";"), 
STANDALONESHORTWEEKDAYS:"CN;Th 2;Th 3;Th 4;Th 5;Th 6;Th 7".split(";"), NARROWWEEKDAYS:"CN T2 T3 T4 T5 T6 T7".split(" "), STANDALONENARROWWEEKDAYS:"CN T2 T3 T4 T5 T6 T7".split(" "), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Qu\u00fd 1", "Qu\u00fd 2", "Qu\u00fd 3", "Qu\u00fd 4"], AMPMS:["SA", "CH"], DATEFORMATS:["EEEE, 'ng\u00e0y' dd MMMM 'n\u0103m' y", "'Ng\u00e0y' dd 'th\u00e1ng' M 'n\u0103m' y", "dd-MM-yyyy", "dd/MM/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_zh = {ERAS:["\u516c\u5143\u524d", "\u516c\u5143"], ERANAMES:["\u516c\u5143\u524d", "\u516c\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), 
SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONESHORTMONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), 
SHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), STANDALONESHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63\u5ea6", "\u7b2c2\u5b63\u5ea6", 
"\u7b2c3\u5b63\u5ea6", "\u7b2c4\u5b63\u5ea6"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "yyyy-M-d", "yy-M-d"], TIMEFORMATS:["zzzzah\u65f6mm\u5206ss\u79d2", "zah\u65f6mm\u5206ss\u79d2", "ah:mm:ss", "ah:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zh_CN = goog.i18n.DateTimeSymbols_zh;
goog.i18n.DateTimeSymbols_zh_HK = {ERAS:["\u897f\u5143\u524d", "\u897f\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), 
SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), 
SHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), STANDALONESHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", 
"\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", "yy\u5e74M\u6708d\u65e5"], TIMEFORMATS:["ah:mm:ss [zzzz]", "ah:mm:ss [z]", "ahh:mm:ss", "ah:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zh_TW = {ERAS:["\u897f\u5143\u524d", "\u897f\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), 
SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), 
SHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), STANDALONESHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", 
"\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "yyyy/M/d", "y/M/d"], TIMEFORMATS:["zzzzah\u6642mm\u5206ss\u79d2", "zah\u6642mm\u5206ss\u79d2", "ah:mm:ss", "ah:mm"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zu = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januwari Februwari Mashi Apreli Meyi Juni Julayi Agasti Septhemba Okthoba Novemba Disemba".split(" "), STANDALONEMONTHS:"uJanuwari uFebruwari uMashi u-Apreli uMeyi uJuni uJulayi uAgasti uSepthemba u-Okthoba uNovemba uDisemba".split(" "), SHORTMONTHS:"Jan Feb Mas Apr Mey Jun Jul Aga Sep Okt Nov Dis".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mas Apr Mey Jun Jul Aga Sep Okt Nov Dis".split(" "), 
WEEKDAYS:"Sonto Msombuluko Lwesibili Lwesithathu uLwesine Lwesihlanu Mgqibelo".split(" "), STANDALONEWEEKDAYS:"Sonto Msombuluko Lwesibili Lwesithathu uLwesine Lwesihlanu Mgqibelo".split(" "), SHORTWEEKDAYS:"Son Mso Bil Tha Sin Hla Mgq".split(" "), STANDALONESHORTWEEKDAYS:"Son Mso Bil Tha Sin Hla Mgq".split(" "), NARROWWEEKDAYS:"SMBTSHM".split(""), STANDALONENARROWWEEKDAYS:"SMBTSHM".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ikota yoku-1", "ikota yesi-2", "ikota yesi-3", "ikota yesi-4"], 
AMPMS:["AM", "PM"], DATEFORMATS:["EEEE dd MMMM y", "d MMMM y", "d MMM y", "yyyy-MM-dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols = "af" == goog.LOCALE ? goog.i18n.DateTimeSymbols_af : "am" == goog.LOCALE ? goog.i18n.DateTimeSymbols_am : "ar" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ar : "bg" == goog.LOCALE ? goog.i18n.DateTimeSymbols_bg : "bn" == goog.LOCALE ? goog.i18n.DateTimeSymbols_bn : "ca" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ca : "chr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_chr : "cs" == goog.LOCALE ? goog.i18n.DateTimeSymbols_cs : "cy" == goog.LOCALE ? goog.i18n.DateTimeSymbols_cy : 
"da" == goog.LOCALE ? goog.i18n.DateTimeSymbols_da : "de" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de : "de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de_AT : "de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de : "el" == goog.LOCALE ? goog.i18n.DateTimeSymbols_el : "en" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en : "en_AU" == goog.LOCALE || "en-AU" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_AU : "en_GB" == goog.LOCALE || "en-GB" == 
goog.LOCALE ? goog.i18n.DateTimeSymbols_en_GB : "en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_IE : "en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_IN : "en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_SG : "en_US" == goog.LOCALE || "en-US" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en : "en_ZA" == goog.LOCALE || "en-ZA" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_ZA : "es" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es : 
"es_419" == goog.LOCALE || "es-419" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es_419 : "et" == goog.LOCALE ? goog.i18n.DateTimeSymbols_et : "eu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_eu : "fa" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fa : "fi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fi : "fil" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fil : "fr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fr : "fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fr_CA : "gl" == 
goog.LOCALE ? goog.i18n.DateTimeSymbols_gl : "gsw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gsw : "gu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gu : "haw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_haw : "he" == goog.LOCALE ? goog.i18n.DateTimeSymbols_he : "hi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hi : "hr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hr : "hu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hu : "id" == goog.LOCALE ? goog.i18n.DateTimeSymbols_id : "in" == goog.LOCALE ? goog.i18n.DateTimeSymbols_in : 
"is" == goog.LOCALE ? goog.i18n.DateTimeSymbols_is : "it" == goog.LOCALE ? goog.i18n.DateTimeSymbols_it : "iw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_iw : "ja" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ja : "kn" == goog.LOCALE ? goog.i18n.DateTimeSymbols_kn : "ko" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ko : "ln" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ln : "lt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_lt : "lv" == goog.LOCALE ? goog.i18n.DateTimeSymbols_lv : "ml" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ml : 
"mr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mr : "ms" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ms : "mt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mt : "nl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_nl : "no" == goog.LOCALE ? goog.i18n.DateTimeSymbols_no : "or" == goog.LOCALE ? goog.i18n.DateTimeSymbols_or : "pl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pl : "pt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt : "pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt : 
"pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt_PT : "ro" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ro : "ru" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ru : "sk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sk : "sl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sl : "sq" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sq : "sr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sr : "sv" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sv : "sw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sw : 
"ta" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ta : "te" == goog.LOCALE ? goog.i18n.DateTimeSymbols_te : "th" == goog.LOCALE ? goog.i18n.DateTimeSymbols_th : "tl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_tl : "tr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_tr : "uk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_uk : "ur" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ur : "vi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_vi : "zh" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh : "zh_CN" == goog.LOCALE || 
"zh-CN" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh : "zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh_HK : "zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh_TW : "zu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zu : goog.i18n.DateTimeSymbols_en;
goog.date.weekDay = {MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6};
goog.date.month = {JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11};
goog.date.formatMonthAndYear = function(a, b) {
  return goog.getMsg("{$monthName} {$yearNum}", {monthName:a, yearNum:b})
};
goog.date.splitDateStringRegex_ = /^(\d{4})(?:(?:-?(\d{2})(?:-?(\d{2}))?)|(?:-?(\d{3}))|(?:-?W(\d{2})(?:-?([1-7]))?))?$/;
goog.date.splitTimeStringRegex_ = /^(\d{2})(?::?(\d{2})(?::?(\d{2})(\.\d+)?)?)?$/;
goog.date.splitTimezoneStringRegex_ = /Z|(?:([-+])(\d{2})(?::?(\d{2}))?)$/;
goog.date.splitDurationRegex_ = /^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
goog.date.isLeapYear = function(a) {
  return 0 == a % 4 && (0 != a % 100 || 0 == a % 400)
};
goog.date.isLongIsoYear = function(a) {
  var b = 5 * a + 12 - 4 * (Math.floor(a / 100) - Math.floor(a / 400)), b = b + (Math.floor((a - 100) / 400) - Math.floor((a - 102) / 400)), b = b + (Math.floor((a - 200) / 400) - Math.floor((a - 199) / 400));
  return 5 > b % 28
};
goog.date.getNumberOfDaysInMonth = function(a, b) {
  switch(b) {
    case goog.date.month.FEB:
      return goog.date.isLeapYear(a) ? 29 : 28;
    case goog.date.month.JUN:
    ;
    case goog.date.month.SEP:
    ;
    case goog.date.month.NOV:
    ;
    case goog.date.month.APR:
      return 30
  }
  return 31
};
goog.date.isSameDay = function(a, b) {
  var c = b || new Date(goog.now());
  return a.getDate() == c.getDate() && goog.date.isSameMonth(a, c)
};
goog.date.isSameMonth = function(a, b) {
  var c = b || new Date(goog.now());
  return a.getMonth() == c.getMonth() && goog.date.isSameYear(a, c)
};
goog.date.isSameYear = function(a, b) {
  var c = b || new Date(goog.now());
  return a.getFullYear() == c.getFullYear()
};
goog.date.getWeekNumber = function(a, b, c, d, e) {
  a = new Date(a, b, c);
  d = d || goog.date.weekDay.THU;
  e = e || goog.date.weekDay.MON;
  b = ((a.getDay() + 6) % 7 - e + 7) % 7;
  e = a.valueOf() + 864E5 * ((d - e + 7) % 7 - b);
  d = (new Date((new Date(e)).getFullYear(), 0, 1)).valueOf();
  return Math.floor(Math.round((e - d) / 864E5) / 7) + 1
};
goog.date.fromIsoString = function(a) {
  var b = new goog.date.DateTime(2E3);
  return goog.date.setIso8601DateTime(b, a) ? b : null
};
goog.date.setIso8601DateTime = function(a, b) {
  var b = goog.string.trim(b), c = -1 == b.indexOf("T") ? " " : "T", c = b.split(c);
  return goog.date.setIso8601DateOnly_(a, c[0]) && (2 > c.length || goog.date.setIso8601TimeOnly_(a, c[1]))
};
goog.date.setIso8601DateOnly_ = function(a, b) {
  var c = b.match(goog.date.splitDateStringRegex_);
  if(!c) {
    return!1
  }
  var d = Number(c[2]), e = Number(c[3]), f = Number(c[4]), g = Number(c[5]), h = Number(c[6]) || 1;
  a.setFullYear(Number(c[1]));
  f ? (a.setDate(1), a.setMonth(0), a.add(new goog.date.Interval(goog.date.Interval.DAYS, f - 1))) : g ? goog.date.setDateFromIso8601Week_(a, g, h) : (d && (a.setDate(1), a.setMonth(d - 1)), e && a.setDate(e));
  return!0
};
goog.date.setDateFromIso8601Week_ = function(a, b, c) {
  a.setMonth(0);
  a.setDate(1);
  var d = a.getDay() || 7, b = new goog.date.Interval(goog.date.Interval.DAYS, (4 >= d ? 1 - d : 8 - d) + (Number(c) + 7 * (Number(b) - 1)) - 1);
  a.add(b)
};
goog.date.setIso8601TimeOnly_ = function(a, b) {
  var c = b.match(goog.date.splitTimezoneStringRegex_), d = 0;
  c && ("Z" != c[0] && (d = 60 * c[2] + Number(c[3]), d *= "-" == c[1] ? 1 : -1), d -= a.getTimezoneOffset(), b = b.substr(0, b.length - c[0].length));
  c = b.match(goog.date.splitTimeStringRegex_);
  if(!c) {
    return!1
  }
  a.setHours(Number(c[1]));
  a.setMinutes(Number(c[2]) || 0);
  a.setSeconds(Number(c[3]) || 0);
  a.setMilliseconds(c[4] ? 1E3 * c[4] : 0);
  0 != d && a.setTime(a.getTime() + 6E4 * d);
  return!0
};
goog.date.Interval = function(a, b, c, d, e, f) {
  goog.isString(a) ? (this.years = a == goog.date.Interval.YEARS ? b : 0, this.months = a == goog.date.Interval.MONTHS ? b : 0, this.days = a == goog.date.Interval.DAYS ? b : 0, this.hours = a == goog.date.Interval.HOURS ? b : 0, this.minutes = a == goog.date.Interval.MINUTES ? b : 0, this.seconds = a == goog.date.Interval.SECONDS ? b : 0) : (this.years = a || 0, this.months = b || 0, this.days = c || 0, this.hours = d || 0, this.minutes = e || 0, this.seconds = f || 0)
};
goog.date.Interval.fromIsoString = function(a) {
  a = a.match(goog.date.splitDurationRegex_);
  if(!a) {
    return null
  }
  var b = !(a[6] || a[7] || a[8]);
  if(b && !a[2] && !a[3] && !a[4] || b && a[5]) {
    return null
  }
  var b = a[1], c = parseInt(a[2], 10) || 0, d = parseInt(a[3], 10) || 0, e = parseInt(a[4], 10) || 0, f = parseInt(a[6], 10) || 0, g = parseInt(a[7], 10) || 0, a = parseFloat(a[8]) || 0;
  return b ? new goog.date.Interval(-c, -d, -e, -f, -g, -a) : new goog.date.Interval(c, d, e, f, g, a)
};
goog.date.Interval.prototype.toIsoString = function(a) {
  var b = Math.min(this.years, this.months, this.days, this.hours, this.minutes, this.seconds), c = Math.max(this.years, this.months, this.days, this.hours, this.minutes, this.seconds);
  if(0 > b && 0 < c) {
    return null
  }
  if(!a && 0 == b && 0 == c) {
    return"PT0S"
  }
  c = [];
  0 > b && c.push("-");
  c.push("P");
  (this.years || a) && c.push(Math.abs(this.years) + "Y");
  (this.months || a) && c.push(Math.abs(this.months) + "M");
  (this.days || a) && c.push(Math.abs(this.days) + "D");
  if(this.hours || this.minutes || this.seconds || a) {
    c.push("T"), (this.hours || a) && c.push(Math.abs(this.hours) + "H"), (this.minutes || a) && c.push(Math.abs(this.minutes) + "M"), (this.seconds || a) && c.push(Math.abs(this.seconds) + "S")
  }
  return c.join("")
};
goog.date.Interval.prototype.equals = function(a) {
  return a.years == this.years && a.months == this.months && a.days == this.days && a.hours == this.hours && a.minutes == this.minutes && a.seconds == this.seconds
};
goog.date.Interval.prototype.clone = function() {
  return new goog.date.Interval(this.years, this.months, this.days, this.hours, this.minutes, this.seconds)
};
goog.date.Interval.YEARS = "y";
goog.date.Interval.MONTHS = "m";
goog.date.Interval.DAYS = "d";
goog.date.Interval.HOURS = "h";
goog.date.Interval.MINUTES = "n";
goog.date.Interval.SECONDS = "s";
goog.date.Interval.prototype.isZero = function() {
  return 0 == this.years && 0 == this.months && 0 == this.days && 0 == this.hours && 0 == this.minutes && 0 == this.seconds
};
goog.date.Interval.prototype.getInverse = function() {
  return this.times(-1)
};
goog.date.Interval.prototype.times = function(a) {
  return new goog.date.Interval(this.years * a, this.months * a, this.days * a, this.hours * a, this.minutes * a, this.seconds * a)
};
goog.date.Interval.prototype.getTotalSeconds = function() {
  goog.asserts.assert(0 == this.years && 0 == this.months);
  return 60 * (60 * (24 * this.days + this.hours) + this.minutes) + this.seconds
};
goog.date.Interval.prototype.add = function(a) {
  this.years += a.years;
  this.months += a.months;
  this.days += a.days;
  this.hours += a.hours;
  this.minutes += a.minutes;
  this.seconds += a.seconds
};
goog.date.Date = function(a, b, c) {
  goog.isNumber(a) ? (this.date_ = new Date(a, b || 0, c || 1), this.maybeFixDst_(c || 1)) : goog.isObject(a) ? (this.date_ = new Date(a.getFullYear(), a.getMonth(), a.getDate()), this.maybeFixDst_(a.getDate())) : (this.date_ = new Date(goog.now()), this.date_.setHours(0), this.date_.setMinutes(0), this.date_.setSeconds(0), this.date_.setMilliseconds(0))
};
goog.date.Date.prototype.firstDayOfWeek_ = goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK;
goog.date.Date.prototype.firstWeekCutOffDay_ = goog.i18n.DateTimeSymbols.FIRSTWEEKCUTOFFDAY;
goog.date.Date.prototype.clone = function() {
  var a = new goog.date.Date(this.date_);
  a.firstDayOfWeek_ = this.firstDayOfWeek_;
  a.firstWeekCutOffDay_ = this.firstWeekCutOffDay_;
  return a
};
goog.date.Date.prototype.getFullYear = function() {
  return this.date_.getFullYear()
};
goog.date.Date.prototype.getYear = function() {
  return this.getFullYear()
};
goog.date.Date.prototype.getMonth = function() {
  return this.date_.getMonth()
};
goog.date.Date.prototype.getDate = function() {
  return this.date_.getDate()
};
goog.date.Date.prototype.getTime = function() {
  return this.date_.getTime()
};
goog.date.Date.prototype.getDay = function() {
  return this.date_.getDay()
};
goog.date.Date.prototype.getIsoWeekday = function() {
  return(this.getDay() + 6) % 7
};
goog.date.Date.prototype.getWeekday = function() {
  return(this.getIsoWeekday() - this.firstDayOfWeek_ + 7) % 7
};
goog.date.Date.prototype.getUTCFullYear = function() {
  return this.date_.getUTCFullYear()
};
goog.date.Date.prototype.getUTCMonth = function() {
  return this.date_.getUTCMonth()
};
goog.date.Date.prototype.getUTCDate = function() {
  return this.date_.getUTCDate()
};
goog.date.Date.prototype.getUTCDay = function() {
  return this.date_.getDay()
};
goog.date.Date.prototype.getUTCHours = function() {
  return this.date_.getUTCHours()
};
goog.date.Date.prototype.getUTCMinutes = function() {
  return this.date_.getUTCMinutes()
};
goog.date.Date.prototype.getUTCIsoWeekday = function() {
  return(this.date_.getUTCDay() + 6) % 7
};
goog.date.Date.prototype.getUTCWeekday = function() {
  return(this.getUTCIsoWeekday() - this.firstDayOfWeek_ + 7) % 7
};
goog.date.Date.prototype.getFirstDayOfWeek = function() {
  return this.firstDayOfWeek_
};
goog.date.Date.prototype.getFirstWeekCutOffDay = function() {
  return this.firstWeekCutOffDay_
};
goog.date.Date.prototype.getNumberOfDaysInMonth = function() {
  return goog.date.getNumberOfDaysInMonth(this.getFullYear(), this.getMonth())
};
goog.date.Date.prototype.getWeekNumber = function() {
  return goog.date.getWeekNumber(this.getFullYear(), this.getMonth(), this.getDate(), this.firstWeekCutOffDay_, this.firstDayOfWeek_)
};
goog.date.Date.prototype.getDayOfYear = function() {
  for(var a = this.getDate(), b = this.getFullYear(), c = this.getMonth() - 1;0 <= c;c--) {
    a += goog.date.getNumberOfDaysInMonth(b, c)
  }
  return a
};
goog.date.Date.prototype.getTimezoneOffset = function() {
  return this.date_.getTimezoneOffset()
};
goog.date.Date.prototype.getTimezoneOffsetString = function() {
  var a;
  a = this.getTimezoneOffset();
  if(0 == a) {
    a = "Z"
  }else {
    var b = Math.abs(a) / 60, c = Math.floor(b), b = 60 * (b - c);
    a = (0 < a ? "-" : "+") + goog.string.padNumber(c, 2) + ":" + goog.string.padNumber(b, 2)
  }
  return a
};
goog.date.Date.prototype.set = function(a) {
  this.date_ = new Date(a.getFullYear(), a.getMonth(), a.getDate())
};
goog.date.Date.prototype.setFullYear = function(a) {
  this.date_.setFullYear(a)
};
goog.date.Date.prototype.setYear = function(a) {
  this.setFullYear(a)
};
goog.date.Date.prototype.setMonth = function(a) {
  this.date_.setMonth(a)
};
goog.date.Date.prototype.setDate = function(a) {
  this.date_.setDate(a)
};
goog.date.Date.prototype.setTime = function(a) {
  this.date_.setTime(a)
};
goog.date.Date.prototype.setUTCFullYear = function(a) {
  this.date_.setUTCFullYear(a)
};
goog.date.Date.prototype.setUTCMonth = function(a) {
  this.date_.setUTCMonth(a)
};
goog.date.Date.prototype.setUTCDate = function(a) {
  this.date_.setUTCDate(a)
};
goog.date.Date.prototype.setFirstDayOfWeek = function(a) {
  this.firstDayOfWeek_ = a
};
goog.date.Date.prototype.setFirstWeekCutOffDay = function(a) {
  this.firstWeekCutOffDay_ = a
};
goog.date.Date.prototype.add = function(a) {
  if(a.years || a.months) {
    var b = this.getMonth() + a.months + 12 * a.years, c = this.getYear() + Math.floor(b / 12), b = b % 12;
    0 > b && (b += 12);
    var d = goog.date.getNumberOfDaysInMonth(c, b), d = Math.min(d, this.getDate());
    this.setDate(1);
    this.setFullYear(c);
    this.setMonth(b);
    this.setDate(d)
  }
  a.days && (b = new Date(this.getYear(), this.getMonth(), this.getDate(), 12), a = new Date(b.getTime() + 864E5 * a.days), this.setDate(1), this.setFullYear(a.getFullYear()), this.setMonth(a.getMonth()), this.setDate(a.getDate()), this.maybeFixDst_(a.getDate()))
};
goog.date.Date.prototype.toIsoString = function(a, b) {
  return[this.getFullYear(), goog.string.padNumber(this.getMonth() + 1, 2), goog.string.padNumber(this.getDate(), 2)].join(a ? "-" : "") + (b ? this.getTimezoneOffsetString() : "")
};
goog.date.Date.prototype.toUTCIsoString = function(a, b) {
  return[this.getUTCFullYear(), goog.string.padNumber(this.getUTCMonth() + 1, 2), goog.string.padNumber(this.getUTCDate(), 2)].join(a ? "-" : "") + (b ? "Z" : "")
};
goog.date.Date.prototype.equals = function(a) {
  return this.getYear() == a.getYear() && this.getMonth() == a.getMonth() && this.getDate() == a.getDate()
};
goog.date.Date.prototype.toString = function() {
  return this.toIsoString()
};
goog.date.Date.prototype.maybeFixDst_ = function(a) {
  this.getDate() != a && (a = this.getDate() < a ? 1 : -1, this.date_.setUTCHours(this.date_.getUTCHours() + a))
};
goog.date.Date.prototype.valueOf = function() {
  return this.date_.valueOf()
};
goog.date.Date.compare = function(a, b) {
  return a.getTime() - b.getTime()
};
goog.date.DateTime = function(a, b, c, d, e, f, g) {
  this.date_ = goog.isNumber(a) ? new Date(a, b || 0, c || 1, d || 0, e || 0, f || 0, g || 0) : new Date(a ? a.getTime() : goog.now())
};
goog.inherits(goog.date.DateTime, goog.date.Date);
goog.date.DateTime.fromRfc822String = function(a) {
  a = new Date(a);
  return!isNaN(a.getTime()) ? new goog.date.DateTime(a) : null
};
goog.date.DateTime.prototype.getHours = function() {
  return this.date_.getHours()
};
goog.date.DateTime.prototype.getMinutes = function() {
  return this.date_.getMinutes()
};
goog.date.DateTime.prototype.getSeconds = function() {
  return this.date_.getSeconds()
};
goog.date.DateTime.prototype.getMilliseconds = function() {
  return this.date_.getMilliseconds()
};
goog.date.DateTime.prototype.getUTCDay = function() {
  return this.date_.getUTCDay()
};
goog.date.DateTime.prototype.getUTCHours = function() {
  return this.date_.getUTCHours()
};
goog.date.DateTime.prototype.getUTCMinutes = function() {
  return this.date_.getUTCMinutes()
};
goog.date.DateTime.prototype.getUTCSeconds = function() {
  return this.date_.getUTCSeconds()
};
goog.date.DateTime.prototype.getUTCMilliseconds = function() {
  return this.date_.getUTCMilliseconds()
};
goog.date.DateTime.prototype.setHours = function(a) {
  this.date_.setHours(a)
};
goog.date.DateTime.prototype.setMinutes = function(a) {
  this.date_.setMinutes(a)
};
goog.date.DateTime.prototype.setSeconds = function(a) {
  this.date_.setSeconds(a)
};
goog.date.DateTime.prototype.setMilliseconds = function(a) {
  this.date_.setMilliseconds(a)
};
goog.date.DateTime.prototype.setUTCHours = function(a) {
  this.date_.setUTCHours(a)
};
goog.date.DateTime.prototype.setUTCMinutes = function(a) {
  this.date_.setUTCMinutes(a)
};
goog.date.DateTime.prototype.setUTCSeconds = function(a) {
  this.date_.setUTCSeconds(a)
};
goog.date.DateTime.prototype.setUTCMilliseconds = function(a) {
  this.date_.setUTCMilliseconds(a)
};
goog.date.DateTime.prototype.add = function(a) {
  goog.date.Date.prototype.add.call(this, a);
  a.hours && this.setHours(this.date_.getHours() + a.hours);
  a.minutes && this.setMinutes(this.date_.getMinutes() + a.minutes);
  a.seconds && this.setSeconds(this.date_.getSeconds() + a.seconds)
};
goog.date.DateTime.prototype.toIsoString = function(a, b) {
  var c = goog.date.Date.prototype.toIsoString.call(this, a);
  return a ? c + " " + goog.string.padNumber(this.getHours(), 2) + ":" + goog.string.padNumber(this.getMinutes(), 2) + ":" + goog.string.padNumber(this.getSeconds(), 2) + (b ? this.getTimezoneOffsetString() : "") : c + "T" + goog.string.padNumber(this.getHours(), 2) + goog.string.padNumber(this.getMinutes(), 2) + goog.string.padNumber(this.getSeconds(), 2) + (b ? this.getTimezoneOffsetString() : "")
};
goog.date.DateTime.prototype.toXmlDateTime = function(a) {
  return goog.date.Date.prototype.toIsoString.call(this, !0) + "T" + goog.string.padNumber(this.getHours(), 2) + ":" + goog.string.padNumber(this.getMinutes(), 2) + ":" + goog.string.padNumber(this.getSeconds(), 2) + (a ? this.getTimezoneOffsetString() : "")
};
goog.date.DateTime.prototype.toUTCIsoString = function(a, b) {
  var c = goog.date.Date.prototype.toUTCIsoString.call(this, a);
  return a ? c + " " + goog.string.padNumber(this.getUTCHours(), 2) + ":" + goog.string.padNumber(this.getUTCMinutes(), 2) + ":" + goog.string.padNumber(this.getUTCSeconds(), 2) + (b ? "Z" : "") : c + "T" + goog.string.padNumber(this.getUTCHours(), 2) + goog.string.padNumber(this.getUTCMinutes(), 2) + goog.string.padNumber(this.getUTCSeconds(), 2) + (b ? "Z" : "")
};
goog.date.DateTime.prototype.equals = function(a) {
  return this.getTime() == a.getTime()
};
goog.date.DateTime.prototype.toString = function() {
  return this.toIsoString()
};
goog.date.DateTime.prototype.toUsTimeString = function(a, b, c) {
  var d = this.getHours();
  goog.isDef(b) || (b = !0);
  var e = 12 == d;
  12 < d && (d -= 12, e = !0);
  0 == d && b && (d = 12);
  a = a ? goog.string.padNumber(d, 2) : String(d);
  d = this.getMinutes();
  if(!c || 0 < d) {
    a += ":" + goog.string.padNumber(d, 2)
  }
  b && (b = goog.getMsg("am"), c = goog.getMsg("pm"), a += e ? c : b);
  return a
};
goog.date.DateTime.prototype.toIsoTimeString = function(a) {
  var b = this.getHours(), b = goog.string.padNumber(b, 2) + ":" + goog.string.padNumber(this.getMinutes(), 2);
  if(!goog.isDef(a) || a) {
    b += ":" + goog.string.padNumber(this.getSeconds(), 2)
  }
  return b
};
goog.date.DateTime.prototype.clone = function() {
  var a = new goog.date.DateTime(this.date_);
  a.setFirstDayOfWeek(this.getFirstDayOfWeek());
  a.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());
  return a
};
goog.dom.annotate = {};
goog.dom.annotate.annotateTerms = function(a, b, c, d, e, f) {
  f = 0 < f ? goog.now() + f : 0;
  return goog.dom.annotate.annotateTermsInNode_(a, b, c, d, e || [], f, 0)
};
goog.dom.annotate.MAX_RECURSION_ = 200;
goog.dom.annotate.NODES_TO_SKIP_ = ["SCRIPT", "STYLE", "TEXTAREA"];
goog.dom.annotate.annotateTermsInNode_ = function(a, b, c, d, e, f, g) {
  if(0 < f && goog.now() >= f || g > goog.dom.annotate.MAX_RECURSION_) {
    return!1
  }
  var h = !1;
  if(a.nodeType == goog.dom.NodeType.TEXT) {
    if(b = goog.dom.annotate.helpAnnotateText_(a.nodeValue, b, c, d), null != b) {
      h = goog.dom.getOwnerDocument(a).createElement("SPAN");
      h.innerHTML = b;
      for(b = a.parentNode;null != (c = h.firstChild);) {
        b.insertBefore(c, a)
      }
      b.removeChild(a);
      h = !0
    }
  }else {
    if(a.hasChildNodes() && !goog.array.contains(goog.dom.annotate.NODES_TO_SKIP_, a.tagName)) {
      var i = a.className.split(/\s+/);
      if(!goog.array.some(i, function(a) {
        return goog.array.contains(e, a)
      })) {
        ++g;
        for(i = a.firstChild;i;) {
          a = i.nextSibling, i = goog.dom.annotate.annotateTermsInNode_(i, b, c, d, e, f, g), h = h || i, i = a
        }
      }
    }
  }
  return h
};
goog.dom.annotate.NONWORD_RE_ = /\W/;
goog.dom.annotate.annotateText = function(a, b, c, d) {
  d && (b = goog.dom.annotate.lowercaseTerms_(b));
  return goog.dom.annotate.helpAnnotateText_(a, b, c, d)
};
goog.dom.annotate.helpAnnotateText_ = function(a, b, c, d) {
  for(var e = !1, f = d ? a.toLowerCase() : a, g = f.length, d = b.length, h = Array(d), i = 0;i < d;i++) {
    var j = b[i], k = [], m = j[0];
    if("" != m) {
      for(var l = j[1], j = m.length, n = 0;n < g;) {
        var o = f.indexOf(m, n);
        if(-1 == o) {
          break
        }else {
          var n = o - 1, q = o + j;
          if(!l || (0 > n || goog.dom.annotate.NONWORD_RE_.test(f.charAt(n))) && (q >= g || goog.dom.annotate.NONWORD_RE_.test(f.charAt(q)))) {
            k.push(o), e = !0
          }
          n = o + j
        }
      }
    }
    h[i] = k
  }
  if(e) {
    e = [];
    for(n = 0;;) {
      for(var p, f = -1, i = 0;i < d;i++) {
        if(k = h[i], !goog.array.isEmpty(k)) {
          for(o = k[0];0 <= o && o < n;) {
            k.shift(), o = goog.array.isEmpty(k) ? -1 : k[0]
          }
          if(0 <= o && (0 > f || o < f)) {
            p = i, f = o
          }
        }
      }
      if(0 > f) {
        break
      }
      h[p].shift();
      e.push(goog.string.htmlEscape(a.substr(n, f - n)));
      j = b[p][0].length;
      i = goog.string.htmlEscape(a.substr(f, j));
      e.push(c(p, i));
      n = f + j
    }
    e.push(goog.string.htmlEscape(a.substr(n)));
    return e.join("")
  }
  return null
};
goog.dom.annotate.lowercaseTerms_ = function(a) {
  for(var b = [], c = 0;c < a.length;++c) {
    var d = a[c];
    b[c] = [d[0].toLowerCase(), d[1]]
  }
  return b
};
goog.dom.SavedRange = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.dom.SavedRange, goog.Disposable);
goog.dom.SavedRange.logger_ = goog.debug.Logger.getLogger("goog.dom.SavedRange");
goog.dom.SavedRange.prototype.restore = function(a) {
  this.isDisposed() && goog.dom.SavedRange.logger_.severe("Disposed SavedRange objects cannot be restored.");
  var b = this.restoreInternal();
  a || this.dispose();
  return b
};
goog.dom.SavedCaretRange = function(a) {
  goog.dom.SavedRange.call(this);
  this.startCaretId_ = goog.string.createUniqueString();
  this.endCaretId_ = goog.string.createUniqueString();
  this.dom_ = goog.dom.getDomHelper(a.getDocument());
  a.surroundWithNodes(this.createCaret_(!0), this.createCaret_(!1))
};
goog.inherits(goog.dom.SavedCaretRange, goog.dom.SavedRange);
goog.dom.SavedCaretRange.prototype.toAbstractRange = function() {
  var a = null, b = this.getCaret(!0), c = this.getCaret(!1);
  b && c && (a = goog.dom.Range.createFromNodes(b, 0, c, 0));
  return a
};
goog.dom.SavedCaretRange.prototype.getCaret = function(a) {
  return this.dom_.getElement(a ? this.startCaretId_ : this.endCaretId_)
};
goog.dom.SavedCaretRange.prototype.removeCarets = function(a) {
  goog.dom.removeNode(this.getCaret(!0));
  goog.dom.removeNode(this.getCaret(!1));
  return a
};
goog.dom.SavedCaretRange.prototype.setRestorationDocument = function(a) {
  this.dom_.setDocument(a)
};
goog.dom.SavedCaretRange.prototype.restoreInternal = function() {
  var a = null, b = this.getCaret(!0), c = this.getCaret(!1);
  if(b && c) {
    var a = b.parentNode, b = goog.array.indexOf(a.childNodes, b), d = c.parentNode, c = goog.array.indexOf(d.childNodes, c);
    d == a && (c -= 1);
    a = goog.dom.Range.createFromNodes(a, b, d, c);
    a = this.removeCarets(a);
    a.select()
  }else {
    this.removeCarets()
  }
  return a
};
goog.dom.SavedCaretRange.prototype.disposeInternal = function() {
  this.removeCarets();
  this.dom_ = null
};
goog.dom.SavedCaretRange.prototype.createCaret_ = function(a) {
  return this.dom_.createDom(goog.dom.TagName.SPAN, {id:a ? this.startCaretId_ : this.endCaretId_})
};
goog.dom.SavedCaretRange.CARET_REGEX = /<span\s+id="?goog_\d+"?><\/span>/ig;
goog.dom.SavedCaretRange.htmlEqual = function(a, b) {
  return a == b || a.replace(goog.dom.SavedCaretRange.CARET_REGEX, "") == b.replace(goog.dom.SavedCaretRange.CARET_REGEX, "")
};
goog.dom.TagWalkType = {START_TAG:1, OTHER:0, END_TAG:-1};
goog.dom.TagIterator = function(a, b, c, d, e) {
  this.reversed = !!b;
  a && this.setPosition(a, d);
  this.depth = void 0 != e ? e : this.tagType || 0;
  this.reversed && (this.depth *= -1);
  this.constrained = !c
};
goog.inherits(goog.dom.TagIterator, goog.iter.Iterator);
goog.dom.TagIterator.prototype.node = null;
goog.dom.TagIterator.prototype.tagType = goog.dom.TagWalkType.OTHER;
goog.dom.TagIterator.prototype.started_ = !1;
goog.dom.TagIterator.prototype.setPosition = function(a, b, c) {
  if(this.node = a) {
    this.tagType = goog.isNumber(b) ? b : this.node.nodeType != goog.dom.NodeType.ELEMENT ? goog.dom.TagWalkType.OTHER : this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG
  }
  goog.isNumber(c) && (this.depth = c)
};
goog.dom.TagIterator.prototype.copyFrom = function(a) {
  this.node = a.node;
  this.tagType = a.tagType;
  this.depth = a.depth;
  this.reversed = a.reversed;
  this.constrained = a.constrained
};
goog.dom.TagIterator.prototype.clone = function() {
  return new goog.dom.TagIterator(this.node, this.reversed, !this.constrained, this.tagType, this.depth)
};
goog.dom.TagIterator.prototype.skipTag = function() {
  var a = this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG;
  this.tagType == a && (this.tagType = -1 * a, this.depth += this.tagType * (this.reversed ? -1 : 1))
};
goog.dom.TagIterator.prototype.restartTag = function() {
  var a = this.reversed ? goog.dom.TagWalkType.START_TAG : goog.dom.TagWalkType.END_TAG;
  this.tagType == a && (this.tagType = -1 * a, this.depth += this.tagType * (this.reversed ? -1 : 1))
};
goog.dom.TagIterator.prototype.next = function() {
  var a;
  if(this.started_) {
    if(!this.node || this.constrained && 0 == this.depth) {
      throw goog.iter.StopIteration;
    }
    a = this.node;
    var b = this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG;
    if(this.tagType == b) {
      var c = this.reversed ? a.lastChild : a.firstChild;
      c ? this.setPosition(c) : this.setPosition(a, -1 * b)
    }else {
      (c = this.reversed ? a.previousSibling : a.nextSibling) ? this.setPosition(c) : this.setPosition(a.parentNode, -1 * b)
    }
    this.depth += this.tagType * (this.reversed ? -1 : 1)
  }else {
    this.started_ = !0
  }
  a = this.node;
  if(!this.node) {
    throw goog.iter.StopIteration;
  }
  return a
};
goog.dom.TagIterator.prototype.isStarted = function() {
  return this.started_
};
goog.dom.TagIterator.prototype.isStartTag = function() {
  return this.tagType == goog.dom.TagWalkType.START_TAG
};
goog.dom.TagIterator.prototype.isEndTag = function() {
  return this.tagType == goog.dom.TagWalkType.END_TAG
};
goog.dom.TagIterator.prototype.isNonElement = function() {
  return this.tagType == goog.dom.TagWalkType.OTHER
};
goog.dom.TagIterator.prototype.equals = function(a) {
  return a.node == this.node && (!this.node || a.tagType == this.tagType)
};
goog.dom.TagIterator.prototype.splice = function(a) {
  var b = this.node;
  this.restartTag();
  this.reversed = !this.reversed;
  goog.dom.TagIterator.prototype.next.call(this);
  this.reversed = !this.reversed;
  for(var c = goog.isArrayLike(arguments[0]) ? arguments[0] : arguments, d = c.length - 1;0 <= d;d--) {
    goog.dom.insertSiblingAfter(c[d], b)
  }
  goog.dom.removeNode(b)
};
goog.dom.RangeType = {TEXT:"text", CONTROL:"control", MULTI:"mutli"};
goog.dom.AbstractRange = function() {
};
goog.dom.AbstractRange.getBrowserSelectionForWindow = function(a) {
  if(a.getSelection) {
    return a.getSelection()
  }
  var a = a.document, b = a.selection;
  if(b) {
    try {
      var c = b.createRange();
      if(c.parentElement) {
        if(c.parentElement().document != a) {
          return null
        }
      }else {
        if(!c.length || c.item(0).document != a) {
          return null
        }
      }
    }catch(d) {
      return null
    }
    return b
  }
  return null
};
goog.dom.AbstractRange.isNativeControlRange = function(a) {
  return!!a && !!a.addElement
};
goog.dom.AbstractRange.prototype.setBrowserRangeObject = function() {
  return!1
};
goog.dom.AbstractRange.prototype.getTextRanges = function() {
  for(var a = [], b = 0, c = this.getTextRangeCount();b < c;b++) {
    a.push(this.getTextRange(b))
  }
  return a
};
goog.dom.AbstractRange.prototype.getContainerElement = function() {
  var a = this.getContainer();
  return a.nodeType == goog.dom.NodeType.ELEMENT ? a : a.parentNode
};
goog.dom.AbstractRange.prototype.getAnchorNode = function() {
  return this.isReversed() ? this.getEndNode() : this.getStartNode()
};
goog.dom.AbstractRange.prototype.getAnchorOffset = function() {
  return this.isReversed() ? this.getEndOffset() : this.getStartOffset()
};
goog.dom.AbstractRange.prototype.getFocusNode = function() {
  return this.isReversed() ? this.getStartNode() : this.getEndNode()
};
goog.dom.AbstractRange.prototype.getFocusOffset = function() {
  return this.isReversed() ? this.getStartOffset() : this.getEndOffset()
};
goog.dom.AbstractRange.prototype.isReversed = function() {
  return!1
};
goog.dom.AbstractRange.prototype.getDocument = function() {
  return goog.dom.getOwnerDocument(goog.userAgent.IE ? this.getContainer() : this.getStartNode())
};
goog.dom.AbstractRange.prototype.getWindow = function() {
  return goog.dom.getWindow(this.getDocument())
};
goog.dom.AbstractRange.prototype.containsNode = function(a, b) {
  return this.containsRange(goog.dom.Range.createFromNodeContents(a), b)
};
goog.dom.AbstractRange.prototype.replaceContentsWithNode = function(a) {
  this.isCollapsed() || this.removeContents();
  return this.insertNode(a, !0)
};
goog.dom.AbstractRange.prototype.saveUsingCarets = function() {
  return this.getStartNode() && this.getEndNode() ? new goog.dom.SavedCaretRange(this) : null
};
goog.dom.RangeIterator = function(a, b) {
  goog.dom.TagIterator.call(this, a, b, !0)
};
goog.inherits(goog.dom.RangeIterator, goog.dom.TagIterator);
goog.dom.AbstractMultiRange = function() {
};
goog.inherits(goog.dom.AbstractMultiRange, goog.dom.AbstractRange);
goog.dom.AbstractMultiRange.prototype.containsRange = function(a, b) {
  var c = this.getTextRanges(), d = a.getTextRanges();
  return(b ? goog.array.some : goog.array.every)(d, function(a) {
    return goog.array.some(c, function(c) {
      return c.containsRange(a, b)
    })
  })
};
goog.dom.AbstractMultiRange.prototype.insertNode = function(a, b) {
  b ? goog.dom.insertSiblingBefore(a, this.getStartNode()) : goog.dom.insertSiblingAfter(a, this.getEndNode());
  return a
};
goog.dom.AbstractMultiRange.prototype.surroundWithNodes = function(a, b) {
  this.insertNode(a, !0);
  this.insertNode(b, !1)
};
goog.dom.TextRangeIterator = function(a, b, c, d, e) {
  var f;
  if(a && (this.startNode_ = a, this.startOffset_ = b, this.endNode_ = c, this.endOffset_ = d, a.nodeType == goog.dom.NodeType.ELEMENT && a.tagName != goog.dom.TagName.BR && (a = a.childNodes, (b = a[b]) ? (this.startNode_ = b, this.startOffset_ = 0) : (a.length && (this.startNode_ = goog.array.peek(a)), f = !0)), c.nodeType == goog.dom.NodeType.ELEMENT)) {
    (this.endNode_ = c.childNodes[d]) ? this.endOffset_ = 0 : this.endNode_ = c
  }
  goog.dom.RangeIterator.call(this, e ? this.endNode_ : this.startNode_, e);
  if(f) {
    try {
      this.next()
    }catch(g) {
      if(g != goog.iter.StopIteration) {
        throw g;
      }
    }
  }
};
goog.inherits(goog.dom.TextRangeIterator, goog.dom.RangeIterator);
goog.dom.TextRangeIterator.prototype.startNode_ = null;
goog.dom.TextRangeIterator.prototype.endNode_ = null;
goog.dom.TextRangeIterator.prototype.startOffset_ = 0;
goog.dom.TextRangeIterator.prototype.endOffset_ = 0;
goog.dom.TextRangeIterator.prototype.getStartTextOffset = function() {
  return this.node.nodeType != goog.dom.NodeType.TEXT ? -1 : this.node == this.startNode_ ? this.startOffset_ : 0
};
goog.dom.TextRangeIterator.prototype.getEndTextOffset = function() {
  return this.node.nodeType != goog.dom.NodeType.TEXT ? -1 : this.node == this.endNode_ ? this.endOffset_ : this.node.nodeValue.length
};
goog.dom.TextRangeIterator.prototype.getStartNode = function() {
  return this.startNode_
};
goog.dom.TextRangeIterator.prototype.setStartNode = function(a) {
  this.isStarted() || this.setPosition(a);
  this.startNode_ = a;
  this.startOffset_ = 0
};
goog.dom.TextRangeIterator.prototype.getEndNode = function() {
  return this.endNode_
};
goog.dom.TextRangeIterator.prototype.setEndNode = function(a) {
  this.endNode_ = a;
  this.endOffset_ = 0
};
goog.dom.TextRangeIterator.prototype.isLast = function() {
  return this.isStarted() && this.node == this.endNode_ && (!this.endOffset_ || !this.isStartTag())
};
goog.dom.TextRangeIterator.prototype.next = function() {
  if(this.isLast()) {
    throw goog.iter.StopIteration;
  }
  return goog.dom.TextRangeIterator.superClass_.next.call(this)
};
goog.dom.TextRangeIterator.prototype.skipTag = function() {
  goog.dom.TextRangeIterator.superClass_.skipTag.apply(this);
  if(goog.dom.contains(this.node, this.endNode_)) {
    throw goog.iter.StopIteration;
  }
};
goog.dom.TextRangeIterator.prototype.copyFrom = function(a) {
  this.startNode_ = a.startNode_;
  this.endNode_ = a.endNode_;
  this.startOffset_ = a.startOffset_;
  this.endOffset_ = a.endOffset_;
  this.isReversed_ = a.isReversed_;
  goog.dom.TextRangeIterator.superClass_.copyFrom.call(this, a)
};
goog.dom.TextRangeIterator.prototype.clone = function() {
  var a = new goog.dom.TextRangeIterator(this.startNode_, this.startOffset_, this.endNode_, this.endOffset_, this.isReversed_);
  a.copyFrom(this);
  return a
};
goog.dom.RangeEndpoint = {START:1, END:0};
goog.dom.browserrange = {};
goog.dom.browserrange.AbstractRange = function() {
};
goog.dom.browserrange.AbstractRange.prototype.containsRange = function(a, b) {
  var c = b && !a.isCollapsed(), d = a.getBrowserRange(), e = goog.dom.RangeEndpoint.START, f = goog.dom.RangeEndpoint.END;
  try {
    return c ? 0 <= this.compareBrowserRangeEndpoints(d, f, e) && 0 >= this.compareBrowserRangeEndpoints(d, e, f) : 0 <= this.compareBrowserRangeEndpoints(d, f, f) && 0 >= this.compareBrowserRangeEndpoints(d, e, e)
  }catch(g) {
    if(!goog.userAgent.IE) {
      throw g;
    }
    return!1
  }
};
goog.dom.browserrange.AbstractRange.prototype.containsNode = function(a, b) {
  return this.containsRange(goog.dom.browserrange.createRangeFromNodeContents(a), b)
};
goog.dom.browserrange.AbstractRange.prototype.getHtmlFragment = function() {
  var a = new goog.string.StringBuffer;
  goog.iter.forEach(this, function(b, c, d) {
    b.nodeType == goog.dom.NodeType.TEXT ? a.append(goog.string.htmlEscape(b.nodeValue.substring(d.getStartTextOffset(), d.getEndTextOffset()))) : b.nodeType == goog.dom.NodeType.ELEMENT && (d.isEndTag() ? goog.dom.canHaveChildren(b) && a.append("</" + b.tagName + ">") : (c = b.cloneNode(!1), c = goog.dom.getOuterHtml(c), goog.userAgent.IE && b.tagName == goog.dom.TagName.LI ? a.append(c) : (b = c.lastIndexOf("<"), a.append(b ? c.substr(0, b) : c))))
  }, this);
  return a.toString()
};
goog.dom.browserrange.AbstractRange.prototype.__iterator__ = function() {
  return new goog.dom.TextRangeIterator(this.getStartNode(), this.getStartOffset(), this.getEndNode(), this.getEndOffset())
};
goog.dom.browserrange.W3cRange = function(a) {
  this.range_ = a
};
goog.inherits(goog.dom.browserrange.W3cRange, goog.dom.browserrange.AbstractRange);
goog.dom.browserrange.W3cRange.getBrowserRangeForNode = function(a) {
  var b = goog.dom.getOwnerDocument(a).createRange();
  if(a.nodeType == goog.dom.NodeType.TEXT) {
    b.setStart(a, 0), b.setEnd(a, a.length)
  }else {
    if(goog.dom.browserrange.canContainRangeEndpoint(a)) {
      for(var c, d = a;(c = d.firstChild) && goog.dom.browserrange.canContainRangeEndpoint(c);) {
        d = c
      }
      b.setStart(d, 0);
      for(d = a;(c = d.lastChild) && goog.dom.browserrange.canContainRangeEndpoint(c);) {
        d = c
      }
      b.setEnd(d, d.nodeType == goog.dom.NodeType.ELEMENT ? d.childNodes.length : d.length)
    }else {
      c = a.parentNode, a = goog.array.indexOf(c.childNodes, a), b.setStart(c, a), b.setEnd(c, a + 1)
    }
  }
  return b
};
goog.dom.browserrange.W3cRange.getBrowserRangeForNodes = function(a, b, c, d) {
  var e = goog.dom.getOwnerDocument(a).createRange();
  e.setStart(a, b);
  e.setEnd(c, d);
  return e
};
goog.dom.browserrange.W3cRange.createFromNodeContents = function(a) {
  return new goog.dom.browserrange.W3cRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNode(a))
};
goog.dom.browserrange.W3cRange.createFromNodes = function(a, b, c, d) {
  return new goog.dom.browserrange.W3cRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNodes(a, b, c, d))
};
goog.dom.browserrange.W3cRange.prototype.clone = function() {
  return new this.constructor(this.range_.cloneRange())
};
goog.dom.browserrange.W3cRange.prototype.getBrowserRange = function() {
  return this.range_
};
goog.dom.browserrange.W3cRange.prototype.getContainer = function() {
  return this.range_.commonAncestorContainer
};
goog.dom.browserrange.W3cRange.prototype.getStartNode = function() {
  return this.range_.startContainer
};
goog.dom.browserrange.W3cRange.prototype.getStartOffset = function() {
  return this.range_.startOffset
};
goog.dom.browserrange.W3cRange.prototype.getEndNode = function() {
  return this.range_.endContainer
};
goog.dom.browserrange.W3cRange.prototype.getEndOffset = function() {
  return this.range_.endOffset
};
goog.dom.browserrange.W3cRange.prototype.compareBrowserRangeEndpoints = function(a, b, c) {
  return this.range_.compareBoundaryPoints(c == goog.dom.RangeEndpoint.START ? b == goog.dom.RangeEndpoint.START ? goog.global.Range.START_TO_START : goog.global.Range.START_TO_END : b == goog.dom.RangeEndpoint.START ? goog.global.Range.END_TO_START : goog.global.Range.END_TO_END, a)
};
goog.dom.browserrange.W3cRange.prototype.isCollapsed = function() {
  return this.range_.collapsed
};
goog.dom.browserrange.W3cRange.prototype.getText = function() {
  return this.range_.toString()
};
goog.dom.browserrange.W3cRange.prototype.getValidHtml = function() {
  var a = goog.dom.getDomHelper(this.range_.startContainer).createDom("div");
  a.appendChild(this.range_.cloneContents());
  a = a.innerHTML;
  if(goog.string.startsWith(a, "<") || !this.isCollapsed() && !goog.string.contains(a, "<")) {
    return a
  }
  var b = this.getContainer(), b = b.nodeType == goog.dom.NodeType.ELEMENT ? b : b.parentNode;
  return goog.dom.getOuterHtml(b.cloneNode(!1)).replace(">", ">" + a)
};
goog.dom.browserrange.W3cRange.prototype.select = function(a) {
  var b = goog.dom.getWindow(goog.dom.getOwnerDocument(this.getStartNode()));
  this.selectInternal(b.getSelection(), a)
};
goog.dom.browserrange.W3cRange.prototype.selectInternal = function(a) {
  a.removeAllRanges();
  a.addRange(this.range_)
};
goog.dom.browserrange.W3cRange.prototype.removeContents = function() {
  var a = this.range_;
  a.extractContents();
  if(a.startContainer.hasChildNodes() && (a = a.startContainer.childNodes[a.startOffset])) {
    var b = a.previousSibling;
    "" == goog.dom.getRawTextContent(a) && goog.dom.removeNode(a);
    b && "" == goog.dom.getRawTextContent(b) && goog.dom.removeNode(b)
  }
};
goog.dom.browserrange.W3cRange.prototype.surroundContents = function(a) {
  this.range_.surroundContents(a);
  return a
};
goog.dom.browserrange.W3cRange.prototype.insertNode = function(a, b) {
  var c = this.range_.cloneRange();
  c.collapse(b);
  c.insertNode(a);
  c.detach();
  return a
};
goog.dom.browserrange.W3cRange.prototype.surroundWithNodes = function(a, b) {
  var c = goog.dom.getWindow(goog.dom.getOwnerDocument(this.getStartNode()));
  if(c = goog.dom.Range.createFromWindow(c)) {
    var d = c.getStartNode(), e = c.getEndNode(), f = c.getStartOffset(), g = c.getEndOffset()
  }
  var h = this.range_.cloneRange(), i = this.range_.cloneRange();
  h.collapse(!1);
  i.collapse(!0);
  h.insertNode(b);
  i.insertNode(a);
  h.detach();
  i.detach();
  if(c) {
    if(d.nodeType == goog.dom.NodeType.TEXT) {
      for(;f > d.length;) {
        f -= d.length;
        do {
          d = d.nextSibling
        }while(d == a || d == b)
      }
    }
    if(e.nodeType == goog.dom.NodeType.TEXT) {
      for(;g > e.length;) {
        g -= e.length;
        do {
          e = e.nextSibling
        }while(e == a || e == b)
      }
    }
    goog.dom.Range.createFromNodes(d, f, e, g).select()
  }
};
goog.dom.browserrange.W3cRange.prototype.collapse = function(a) {
  this.range_.collapse(a)
};
goog.dom.browserrange.GeckoRange = function(a) {
  goog.dom.browserrange.W3cRange.call(this, a)
};
goog.inherits(goog.dom.browserrange.GeckoRange, goog.dom.browserrange.W3cRange);
goog.dom.browserrange.GeckoRange.createFromNodeContents = function(a) {
  return new goog.dom.browserrange.GeckoRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNode(a))
};
goog.dom.browserrange.GeckoRange.createFromNodes = function(a, b, c, d) {
  return new goog.dom.browserrange.GeckoRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNodes(a, b, c, d))
};
goog.dom.browserrange.GeckoRange.prototype.selectInternal = function(a, b) {
  var c = b ? this.getEndNode() : this.getStartNode(), d = b ? this.getEndOffset() : this.getStartOffset(), e = b ? this.getStartNode() : this.getEndNode(), f = b ? this.getStartOffset() : this.getEndOffset();
  a.collapse(c, d);
  (c != e || d != f) && a.extend(e, f)
};
goog.dom.NodeIterator = function(a, b, c, d) {
  goog.dom.TagIterator.call(this, a, b, c, null, d)
};
goog.inherits(goog.dom.NodeIterator, goog.dom.TagIterator);
goog.dom.NodeIterator.prototype.next = function() {
  do {
    goog.dom.NodeIterator.superClass_.next.call(this)
  }while(this.isEndTag());
  return this.node
};
goog.dom.browserrange.IeRange = function(a, b) {
  this.range_ = a;
  this.doc_ = b
};
goog.inherits(goog.dom.browserrange.IeRange, goog.dom.browserrange.AbstractRange);
goog.dom.browserrange.IeRange.logger_ = goog.debug.Logger.getLogger("goog.dom.browserrange.IeRange");
goog.dom.browserrange.IeRange.getBrowserRangeForNode_ = function(a) {
  var b = goog.dom.getOwnerDocument(a).body.createTextRange();
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    b.moveToElementText(a), goog.dom.browserrange.canContainRangeEndpoint(a) && !a.childNodes.length && b.collapse(!1)
  }else {
    for(var c = 0, d = a;d = d.previousSibling;) {
      var e = d.nodeType;
      if(e == goog.dom.NodeType.TEXT) {
        c += d.length
      }else {
        if(e == goog.dom.NodeType.ELEMENT) {
          b.moveToElementText(d);
          break
        }
      }
    }
    d || b.moveToElementText(a.parentNode);
    b.collapse(!d);
    c && b.move("character", c);
    b.moveEnd("character", a.length)
  }
  return b
};
goog.dom.browserrange.IeRange.getBrowserRangeForNodes_ = function(a, b, c, d) {
  var e = !1;
  a.nodeType == goog.dom.NodeType.ELEMENT && (b > a.childNodes.length && goog.dom.browserrange.IeRange.logger_.severe("Cannot have startOffset > startNode child count"), b = a.childNodes[b], e = !b, a = b || a.lastChild || a, b = 0);
  var f = goog.dom.browserrange.IeRange.getBrowserRangeForNode_(a);
  b && f.move("character", b);
  if(a == c && b == d) {
    return f.collapse(!0), f
  }
  e && f.collapse(!1);
  e = !1;
  c.nodeType == goog.dom.NodeType.ELEMENT && (d > c.childNodes.length && goog.dom.browserrange.IeRange.logger_.severe("Cannot have endOffset > endNode child count"), c = (b = c.childNodes[d]) || c.lastChild || c, d = 0, e = !b);
  a = goog.dom.browserrange.IeRange.getBrowserRangeForNode_(c);
  a.collapse(!e);
  d && a.moveEnd("character", d);
  f.setEndPoint("EndToEnd", a);
  return f
};
goog.dom.browserrange.IeRange.createFromNodeContents = function(a) {
  var b = new goog.dom.browserrange.IeRange(goog.dom.browserrange.IeRange.getBrowserRangeForNode_(a), goog.dom.getOwnerDocument(a));
  if(goog.dom.browserrange.canContainRangeEndpoint(a)) {
    for(var c, d = a;(c = d.firstChild) && goog.dom.browserrange.canContainRangeEndpoint(c);) {
      d = c
    }
    b.startNode_ = d;
    b.startOffset_ = 0;
    for(d = a;(c = d.lastChild) && goog.dom.browserrange.canContainRangeEndpoint(c);) {
      d = c
    }
    b.endNode_ = d;
    b.endOffset_ = d.nodeType == goog.dom.NodeType.ELEMENT ? d.childNodes.length : d.length;
    b.parentNode_ = a
  }else {
    b.startNode_ = b.endNode_ = b.parentNode_ = a.parentNode, b.startOffset_ = goog.array.indexOf(b.parentNode_.childNodes, a), b.endOffset_ = b.startOffset_ + 1
  }
  return b
};
goog.dom.browserrange.IeRange.createFromNodes = function(a, b, c, d) {
  var e = new goog.dom.browserrange.IeRange(goog.dom.browserrange.IeRange.getBrowserRangeForNodes_(a, b, c, d), goog.dom.getOwnerDocument(a));
  e.startNode_ = a;
  e.startOffset_ = b;
  e.endNode_ = c;
  e.endOffset_ = d;
  return e
};
goog.dom.browserrange.IeRange.prototype.parentNode_ = null;
goog.dom.browserrange.IeRange.prototype.startNode_ = null;
goog.dom.browserrange.IeRange.prototype.endNode_ = null;
goog.dom.browserrange.IeRange.prototype.startOffset_ = -1;
goog.dom.browserrange.IeRange.prototype.endOffset_ = -1;
goog.dom.browserrange.IeRange.prototype.clone = function() {
  var a = new goog.dom.browserrange.IeRange(this.range_.duplicate(), this.doc_);
  a.parentNode_ = this.parentNode_;
  a.startNode_ = this.startNode_;
  a.endNode_ = this.endNode_;
  return a
};
goog.dom.browserrange.IeRange.prototype.getBrowserRange = function() {
  return this.range_
};
goog.dom.browserrange.IeRange.prototype.clearCachedValues_ = function() {
  this.parentNode_ = this.startNode_ = this.endNode_ = null;
  this.startOffset_ = this.endOffset_ = -1
};
goog.dom.browserrange.IeRange.prototype.getContainer = function() {
  if(!this.parentNode_) {
    var a = this.range_.text, b = this.range_.duplicate(), c = a.replace(/ +$/, "");
    (c = a.length - c.length) && b.moveEnd("character", -c);
    c = b.parentElement();
    b = goog.string.stripNewlines(b.htmlText).length;
    if(this.isCollapsed() && 0 < b) {
      return this.parentNode_ = c
    }
    for(;b > goog.string.stripNewlines(c.outerHTML).length;) {
      c = c.parentNode
    }
    for(;1 == c.childNodes.length && c.innerText == goog.dom.browserrange.IeRange.getNodeText_(c.firstChild) && goog.dom.browserrange.canContainRangeEndpoint(c.firstChild);) {
      c = c.firstChild
    }
    0 == a.length && (c = this.findDeepestContainer_(c));
    this.parentNode_ = c
  }
  return this.parentNode_
};
goog.dom.browserrange.IeRange.prototype.findDeepestContainer_ = function(a) {
  for(var b = a.childNodes, c = 0, d = b.length;c < d;c++) {
    var e = b[c];
    if(goog.dom.browserrange.canContainRangeEndpoint(e)) {
      var f = goog.dom.browserrange.IeRange.getBrowserRangeForNode_(e), g = goog.dom.RangeEndpoint.START, h = goog.dom.RangeEndpoint.END, i = f.htmlText != e.outerHTML;
      if(this.isCollapsed() && i ? 0 <= this.compareBrowserRangeEndpoints(f, g, g) && 0 >= this.compareBrowserRangeEndpoints(f, g, h) : this.range_.inRange(f)) {
        return this.findDeepestContainer_(e)
      }
    }
  }
  return a
};
goog.dom.browserrange.IeRange.prototype.getStartNode = function() {
  this.startNode_ || (this.startNode_ = this.getEndpointNode_(goog.dom.RangeEndpoint.START), this.isCollapsed() && (this.endNode_ = this.startNode_));
  return this.startNode_
};
goog.dom.browserrange.IeRange.prototype.getStartOffset = function() {
  0 > this.startOffset_ && (this.startOffset_ = this.getOffset_(goog.dom.RangeEndpoint.START), this.isCollapsed() && (this.endOffset_ = this.startOffset_));
  return this.startOffset_
};
goog.dom.browserrange.IeRange.prototype.getEndNode = function() {
  if(this.isCollapsed()) {
    return this.getStartNode()
  }
  this.endNode_ || (this.endNode_ = this.getEndpointNode_(goog.dom.RangeEndpoint.END));
  return this.endNode_
};
goog.dom.browserrange.IeRange.prototype.getEndOffset = function() {
  if(this.isCollapsed()) {
    return this.getStartOffset()
  }
  0 > this.endOffset_ && (this.endOffset_ = this.getOffset_(goog.dom.RangeEndpoint.END), this.isCollapsed() && (this.startOffset_ = this.endOffset_));
  return this.endOffset_
};
goog.dom.browserrange.IeRange.prototype.compareBrowserRangeEndpoints = function(a, b, c) {
  return this.range_.compareEndPoints((b == goog.dom.RangeEndpoint.START ? "Start" : "End") + "To" + (c == goog.dom.RangeEndpoint.START ? "Start" : "End"), a)
};
goog.dom.browserrange.IeRange.prototype.getEndpointNode_ = function(a, b) {
  var c = b || this.getContainer();
  if(!c || !c.firstChild) {
    return c
  }
  for(var d = goog.dom.RangeEndpoint.START, e = goog.dom.RangeEndpoint.END, f = a == d, g = 0, h = c.childNodes.length;g < h;g++) {
    var i = f ? g : h - g - 1, j = c.childNodes[i], k;
    try {
      k = goog.dom.browserrange.createRangeFromNodeContents(j)
    }catch(m) {
      continue
    }
    var l = k.getBrowserRange();
    if(this.isCollapsed()) {
      if(goog.dom.browserrange.canContainRangeEndpoint(j)) {
        if(k.containsRange(this)) {
          return this.getEndpointNode_(a, j)
        }
      }else {
        if(0 == this.compareBrowserRangeEndpoints(l, d, d)) {
          this.startOffset_ = this.endOffset_ = i;
          break
        }
      }
    }else {
      if(this.containsRange(k)) {
        if(!goog.dom.browserrange.canContainRangeEndpoint(j)) {
          f ? this.startOffset_ = i : this.endOffset_ = i + 1;
          break
        }
        return this.getEndpointNode_(a, j)
      }
      if(0 > this.compareBrowserRangeEndpoints(l, d, e) && 0 < this.compareBrowserRangeEndpoints(l, e, d)) {
        return this.getEndpointNode_(a, j)
      }
    }
  }
  return c
};
goog.dom.browserrange.IeRange.prototype.compareNodeEndpoints_ = function(a, b, c) {
  return this.range_.compareEndPoints((b == goog.dom.RangeEndpoint.START ? "Start" : "End") + "To" + (c == goog.dom.RangeEndpoint.START ? "Start" : "End"), goog.dom.browserrange.createRangeFromNodeContents(a).getBrowserRange())
};
goog.dom.browserrange.IeRange.prototype.getOffset_ = function(a, b) {
  var c = a == goog.dom.RangeEndpoint.START, d = b || (c ? this.getStartNode() : this.getEndNode());
  if(d.nodeType == goog.dom.NodeType.ELEMENT) {
    for(var d = d.childNodes, e = d.length, f = c ? 1 : -1, g = c ? 0 : e - 1;0 <= g && g < e;g += f) {
      var h = d[g];
      if(!goog.dom.browserrange.canContainRangeEndpoint(h) && 0 == this.compareNodeEndpoints_(h, a, a)) {
        return c ? g : g + 1
      }
    }
    return-1 == g ? 0 : g
  }
  e = this.range_.duplicate();
  f = goog.dom.browserrange.IeRange.getBrowserRangeForNode_(d);
  e.setEndPoint(c ? "EndToEnd" : "StartToStart", f);
  e = e.text.length;
  return c ? d.length - e : e
};
goog.dom.browserrange.IeRange.getNodeText_ = function(a) {
  return a.nodeType == goog.dom.NodeType.TEXT ? a.nodeValue : a.innerText
};
goog.dom.browserrange.IeRange.prototype.isRangeInDocument = function() {
  var a = this.doc_.body.createTextRange();
  a.moveToElementText(this.doc_.body);
  return this.containsRange(new goog.dom.browserrange.IeRange(a, this.doc_), !0)
};
goog.dom.browserrange.IeRange.prototype.isCollapsed = function() {
  return 0 == this.range_.compareEndPoints("StartToEnd", this.range_)
};
goog.dom.browserrange.IeRange.prototype.getText = function() {
  return this.range_.text
};
goog.dom.browserrange.IeRange.prototype.getValidHtml = function() {
  return this.range_.htmlText
};
goog.dom.browserrange.IeRange.prototype.select = function() {
  this.range_.select()
};
goog.dom.browserrange.IeRange.prototype.removeContents = function() {
  if(!this.isCollapsed() && this.range_.htmlText) {
    var a = this.getStartNode(), b = this.getEndNode(), c = this.range_.text, d = this.range_.duplicate();
    d.moveStart("character", 1);
    d.moveStart("character", -1);
    d.text == c && (this.range_ = d);
    this.range_.text = "";
    this.clearCachedValues_();
    c = this.getStartNode();
    d = this.getStartOffset();
    try {
      var e = a.nextSibling;
      a == b && (a.parentNode && a.nodeType == goog.dom.NodeType.TEXT && e && e.nodeType == goog.dom.NodeType.TEXT) && (a.nodeValue += e.nodeValue, goog.dom.removeNode(e), this.range_ = goog.dom.browserrange.IeRange.getBrowserRangeForNode_(c), this.range_.move("character", d), this.clearCachedValues_())
    }catch(f) {
    }
  }
};
goog.dom.browserrange.IeRange.getDomHelper_ = function(a) {
  return goog.dom.getDomHelper(a.parentElement())
};
goog.dom.browserrange.IeRange.pasteElement_ = function(a, b, c) {
  var c = c || goog.dom.browserrange.IeRange.getDomHelper_(a), d, e = d = b.id;
  d || (d = b.id = goog.string.createUniqueString());
  a.pasteHTML(b.outerHTML);
  (b = c.getElement(d)) && (e || b.removeAttribute("id"));
  return b
};
goog.dom.browserrange.IeRange.prototype.surroundContents = function(a) {
  goog.dom.removeNode(a);
  a.innerHTML = this.range_.htmlText;
  (a = goog.dom.browserrange.IeRange.pasteElement_(this.range_, a)) && this.range_.moveToElementText(a);
  this.clearCachedValues_();
  return a
};
goog.dom.browserrange.IeRange.insertNode_ = function(a, b, c, d) {
  var d = d || goog.dom.browserrange.IeRange.getDomHelper_(a), e;
  b.nodeType != goog.dom.NodeType.ELEMENT && (e = !0, b = d.createDom(goog.dom.TagName.DIV, null, b));
  a.collapse(c);
  b = goog.dom.browserrange.IeRange.pasteElement_(a, b, d);
  e && (a = b.firstChild, d.flattenElement(b), b = a);
  return b
};
goog.dom.browserrange.IeRange.prototype.insertNode = function(a, b) {
  var c = goog.dom.browserrange.IeRange.insertNode_(this.range_.duplicate(), a, b);
  this.clearCachedValues_();
  return c
};
goog.dom.browserrange.IeRange.prototype.surroundWithNodes = function(a, b) {
  var c = this.range_.duplicate(), d = this.range_.duplicate();
  goog.dom.browserrange.IeRange.insertNode_(c, a, !0);
  goog.dom.browserrange.IeRange.insertNode_(d, b, !1);
  this.clearCachedValues_()
};
goog.dom.browserrange.IeRange.prototype.collapse = function(a) {
  this.range_.collapse(a);
  a ? (this.endNode_ = this.startNode_, this.endOffset_ = this.startOffset_) : (this.startNode_ = this.endNode_, this.startOffset_ = this.endOffset_)
};
goog.dom.browserrange.OperaRange = function(a) {
  goog.dom.browserrange.W3cRange.call(this, a)
};
goog.inherits(goog.dom.browserrange.OperaRange, goog.dom.browserrange.W3cRange);
goog.dom.browserrange.OperaRange.createFromNodeContents = function(a) {
  return new goog.dom.browserrange.OperaRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNode(a))
};
goog.dom.browserrange.OperaRange.createFromNodes = function(a, b, c, d) {
  return new goog.dom.browserrange.OperaRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNodes(a, b, c, d))
};
goog.dom.browserrange.OperaRange.prototype.selectInternal = function(a) {
  a.collapse(this.getStartNode(), this.getStartOffset());
  (this.getEndNode() != this.getStartNode() || this.getEndOffset() != this.getStartOffset()) && a.extend(this.getEndNode(), this.getEndOffset());
  0 == a.rangeCount && a.addRange(this.range_)
};
goog.dom.browserrange.WebKitRange = function(a) {
  goog.dom.browserrange.W3cRange.call(this, a)
};
goog.inherits(goog.dom.browserrange.WebKitRange, goog.dom.browserrange.W3cRange);
goog.dom.browserrange.WebKitRange.createFromNodeContents = function(a) {
  return new goog.dom.browserrange.WebKitRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNode(a))
};
goog.dom.browserrange.WebKitRange.createFromNodes = function(a, b, c, d) {
  return new goog.dom.browserrange.WebKitRange(goog.dom.browserrange.W3cRange.getBrowserRangeForNodes(a, b, c, d))
};
goog.dom.browserrange.WebKitRange.prototype.compareBrowserRangeEndpoints = function(a, b, c) {
  return goog.userAgent.isVersion("528") ? goog.dom.browserrange.WebKitRange.superClass_.compareBrowserRangeEndpoints.call(this, a, b, c) : this.range_.compareBoundaryPoints(c == goog.dom.RangeEndpoint.START ? b == goog.dom.RangeEndpoint.START ? goog.global.Range.START_TO_START : goog.global.Range.END_TO_START : b == goog.dom.RangeEndpoint.START ? goog.global.Range.START_TO_END : goog.global.Range.END_TO_END, a)
};
goog.dom.browserrange.WebKitRange.prototype.selectInternal = function(a, b) {
  a.removeAllRanges();
  b ? a.setBaseAndExtent(this.getEndNode(), this.getEndOffset(), this.getStartNode(), this.getStartOffset()) : a.setBaseAndExtent(this.getStartNode(), this.getStartOffset(), this.getEndNode(), this.getEndOffset())
};
goog.dom.browserrange.Error = {NOT_IMPLEMENTED:"Not Implemented"};
goog.dom.browserrange.createRange = function(a) {
  return goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) ? new goog.dom.browserrange.IeRange(a, goog.dom.getOwnerDocument(a.parentElement())) : goog.userAgent.WEBKIT ? new goog.dom.browserrange.WebKitRange(a) : goog.userAgent.GECKO ? new goog.dom.browserrange.GeckoRange(a) : goog.userAgent.OPERA ? new goog.dom.browserrange.OperaRange(a) : new goog.dom.browserrange.W3cRange(a)
};
goog.dom.browserrange.createRangeFromNodeContents = function(a) {
  return goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) ? goog.dom.browserrange.IeRange.createFromNodeContents(a) : goog.userAgent.WEBKIT ? goog.dom.browserrange.WebKitRange.createFromNodeContents(a) : goog.userAgent.GECKO ? goog.dom.browserrange.GeckoRange.createFromNodeContents(a) : goog.userAgent.OPERA ? goog.dom.browserrange.OperaRange.createFromNodeContents(a) : goog.dom.browserrange.W3cRange.createFromNodeContents(a)
};
goog.dom.browserrange.createRangeFromNodes = function(a, b, c, d) {
  return goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) ? goog.dom.browserrange.IeRange.createFromNodes(a, b, c, d) : goog.userAgent.WEBKIT ? goog.dom.browserrange.WebKitRange.createFromNodes(a, b, c, d) : goog.userAgent.GECKO ? goog.dom.browserrange.GeckoRange.createFromNodes(a, b, c, d) : goog.userAgent.OPERA ? goog.dom.browserrange.OperaRange.createFromNodes(a, b, c, d) : goog.dom.browserrange.W3cRange.createFromNodes(a, b, c, d)
};
goog.dom.browserrange.canContainRangeEndpoint = function(a) {
  return goog.dom.canHaveChildren(a) || a.nodeType == goog.dom.NodeType.TEXT
};
goog.dom.TextRange = function() {
};
goog.inherits(goog.dom.TextRange, goog.dom.AbstractRange);
goog.dom.TextRange.createFromBrowserRange = function(a, b) {
  return goog.dom.TextRange.createFromBrowserRangeWrapper_(goog.dom.browserrange.createRange(a), b)
};
goog.dom.TextRange.createFromBrowserRangeWrapper_ = function(a, b) {
  var c = new goog.dom.TextRange;
  c.browserRangeWrapper_ = a;
  c.isReversed_ = !!b;
  return c
};
goog.dom.TextRange.createFromNodeContents = function(a, b) {
  return goog.dom.TextRange.createFromBrowserRangeWrapper_(goog.dom.browserrange.createRangeFromNodeContents(a), b)
};
goog.dom.TextRange.createFromNodes = function(a, b, c, d) {
  var e = new goog.dom.TextRange;
  e.isReversed_ = goog.dom.Range.isReversed(a, b, c, d);
  if("BR" == a.tagName) {
    var f = a.parentNode, b = goog.array.indexOf(f.childNodes, a), a = f
  }
  "BR" == c.tagName && (f = c.parentNode, d = goog.array.indexOf(f.childNodes, c), c = f);
  e.isReversed_ ? (e.startNode_ = c, e.startOffset_ = d, e.endNode_ = a, e.endOffset_ = b) : (e.startNode_ = a, e.startOffset_ = b, e.endNode_ = c, e.endOffset_ = d);
  return e
};
goog.dom.TextRange.prototype.browserRangeWrapper_ = null;
goog.dom.TextRange.prototype.startNode_ = null;
goog.dom.TextRange.prototype.startOffset_ = null;
goog.dom.TextRange.prototype.endNode_ = null;
goog.dom.TextRange.prototype.endOffset_ = null;
goog.dom.TextRange.prototype.isReversed_ = !1;
goog.dom.TextRange.prototype.clone = function() {
  var a = new goog.dom.TextRange;
  a.browserRangeWrapper_ = this.browserRangeWrapper_;
  a.startNode_ = this.startNode_;
  a.startOffset_ = this.startOffset_;
  a.endNode_ = this.endNode_;
  a.endOffset_ = this.endOffset_;
  a.isReversed_ = this.isReversed_;
  return a
};
goog.dom.TextRange.prototype.getType = function() {
  return goog.dom.RangeType.TEXT
};
goog.dom.TextRange.prototype.getBrowserRangeObject = function() {
  return this.getBrowserRangeWrapper_().getBrowserRange()
};
goog.dom.TextRange.prototype.setBrowserRangeObject = function(a) {
  if(goog.dom.AbstractRange.isNativeControlRange(a)) {
    return!1
  }
  this.browserRangeWrapper_ = goog.dom.browserrange.createRange(a);
  this.clearCachedValues_();
  return!0
};
goog.dom.TextRange.prototype.clearCachedValues_ = function() {
  this.startNode_ = this.startOffset_ = this.endNode_ = this.endOffset_ = null
};
goog.dom.TextRange.prototype.getTextRangeCount = function() {
  return 1
};
goog.dom.TextRange.prototype.getTextRange = function() {
  return this
};
goog.dom.TextRange.prototype.getBrowserRangeWrapper_ = function() {
  return this.browserRangeWrapper_ || (this.browserRangeWrapper_ = goog.dom.browserrange.createRangeFromNodes(this.getStartNode(), this.getStartOffset(), this.getEndNode(), this.getEndOffset()))
};
goog.dom.TextRange.prototype.getContainer = function() {
  return this.getBrowserRangeWrapper_().getContainer()
};
goog.dom.TextRange.prototype.getStartNode = function() {
  return this.startNode_ || (this.startNode_ = this.getBrowserRangeWrapper_().getStartNode())
};
goog.dom.TextRange.prototype.getStartOffset = function() {
  return null != this.startOffset_ ? this.startOffset_ : this.startOffset_ = this.getBrowserRangeWrapper_().getStartOffset()
};
goog.dom.TextRange.prototype.getEndNode = function() {
  return this.endNode_ || (this.endNode_ = this.getBrowserRangeWrapper_().getEndNode())
};
goog.dom.TextRange.prototype.getEndOffset = function() {
  return null != this.endOffset_ ? this.endOffset_ : this.endOffset_ = this.getBrowserRangeWrapper_().getEndOffset()
};
goog.dom.TextRange.prototype.moveToNodes = function(a, b, c, d, e) {
  this.startNode_ = a;
  this.startOffset_ = b;
  this.endNode_ = c;
  this.endOffset_ = d;
  this.isReversed_ = e;
  this.browserRangeWrapper_ = null
};
goog.dom.TextRange.prototype.isReversed = function() {
  return this.isReversed_
};
goog.dom.TextRange.prototype.containsRange = function(a, b) {
  var c = a.getType();
  return c == goog.dom.RangeType.TEXT ? this.getBrowserRangeWrapper_().containsRange(a.getBrowserRangeWrapper_(), b) : c == goog.dom.RangeType.CONTROL ? (c = a.getElements(), (b ? goog.array.some : goog.array.every)(c, function(a) {
    return this.containsNode(a, b)
  }, this)) : !1
};
goog.dom.TextRange.isAttachedNode = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(9)) {
    var b = !1;
    try {
      b = a.parentNode
    }catch(c) {
    }
    return!!b
  }
  return goog.dom.contains(a.ownerDocument.body, a)
};
goog.dom.TextRange.prototype.isRangeInDocument = function() {
  return(!this.startNode_ || goog.dom.TextRange.isAttachedNode(this.startNode_)) && (!this.endNode_ || goog.dom.TextRange.isAttachedNode(this.endNode_)) && (!(goog.userAgent.IE && !goog.userAgent.isDocumentMode(9)) || this.getBrowserRangeWrapper_().isRangeInDocument())
};
goog.dom.TextRange.prototype.isCollapsed = function() {
  return this.getBrowserRangeWrapper_().isCollapsed()
};
goog.dom.TextRange.prototype.getText = function() {
  return this.getBrowserRangeWrapper_().getText()
};
goog.dom.TextRange.prototype.getHtmlFragment = function() {
  return this.getBrowserRangeWrapper_().getHtmlFragment()
};
goog.dom.TextRange.prototype.getValidHtml = function() {
  return this.getBrowserRangeWrapper_().getValidHtml()
};
goog.dom.TextRange.prototype.getPastableHtml = function() {
  var a = this.getValidHtml();
  if(a.match(/^\s*<td\b/i)) {
    a = "<table><tbody><tr>" + a + "</tr></tbody></table>"
  }else {
    if(a.match(/^\s*<tr\b/i)) {
      a = "<table><tbody>" + a + "</tbody></table>"
    }else {
      if(a.match(/^\s*<tbody\b/i)) {
        a = "<table>" + a + "</table>"
      }else {
        if(a.match(/^\s*<li\b/i)) {
          for(var b = this.getContainer(), c = goog.dom.TagName.UL;b;) {
            if(b.tagName == goog.dom.TagName.OL) {
              c = goog.dom.TagName.OL;
              break
            }else {
              if(b.tagName == goog.dom.TagName.UL) {
                break
              }
            }
            b = b.parentNode
          }
          a = goog.string.buildString("<", c, ">", a, "</", c, ">")
        }
      }
    }
  }
  return a
};
goog.dom.TextRange.prototype.__iterator__ = function() {
  return new goog.dom.TextRangeIterator(this.getStartNode(), this.getStartOffset(), this.getEndNode(), this.getEndOffset())
};
goog.dom.TextRange.prototype.select = function() {
  this.getBrowserRangeWrapper_().select(this.isReversed_)
};
goog.dom.TextRange.prototype.removeContents = function() {
  this.getBrowserRangeWrapper_().removeContents();
  this.clearCachedValues_()
};
goog.dom.TextRange.prototype.surroundContents = function(a) {
  a = this.getBrowserRangeWrapper_().surroundContents(a);
  this.clearCachedValues_();
  return a
};
goog.dom.TextRange.prototype.insertNode = function(a, b) {
  var c = this.getBrowserRangeWrapper_().insertNode(a, b);
  this.clearCachedValues_();
  return c
};
goog.dom.TextRange.prototype.surroundWithNodes = function(a, b) {
  this.getBrowserRangeWrapper_().surroundWithNodes(a, b);
  this.clearCachedValues_()
};
goog.dom.TextRange.prototype.saveUsingDom = function() {
  return new goog.dom.DomSavedTextRange_(this)
};
goog.dom.TextRange.prototype.collapse = function(a) {
  a = this.isReversed() ? !a : a;
  this.browserRangeWrapper_ && this.browserRangeWrapper_.collapse(a);
  a ? (this.endNode_ = this.startNode_, this.endOffset_ = this.startOffset_) : (this.startNode_ = this.endNode_, this.startOffset_ = this.endOffset_);
  this.isReversed_ = !1
};
goog.dom.DomSavedTextRange_ = function(a) {
  this.anchorNode_ = a.getAnchorNode();
  this.anchorOffset_ = a.getAnchorOffset();
  this.focusNode_ = a.getFocusNode();
  this.focusOffset_ = a.getFocusOffset()
};
goog.inherits(goog.dom.DomSavedTextRange_, goog.dom.SavedRange);
goog.dom.DomSavedTextRange_.prototype.restoreInternal = function() {
  return goog.dom.Range.createFromNodes(this.anchorNode_, this.anchorOffset_, this.focusNode_, this.focusOffset_)
};
goog.dom.DomSavedTextRange_.prototype.disposeInternal = function() {
  goog.dom.DomSavedTextRange_.superClass_.disposeInternal.call(this);
  this.focusNode_ = this.anchorNode_ = null
};
goog.dom.ControlRange = function() {
};
goog.inherits(goog.dom.ControlRange, goog.dom.AbstractMultiRange);
goog.dom.ControlRange.createFromBrowserRange = function(a) {
  var b = new goog.dom.ControlRange;
  b.range_ = a;
  return b
};
goog.dom.ControlRange.createFromElements = function(a) {
  for(var b = goog.dom.getOwnerDocument(arguments[0]).body.createControlRange(), c = 0, d = arguments.length;c < d;c++) {
    b.addElement(arguments[c])
  }
  return goog.dom.ControlRange.createFromBrowserRange(b)
};
goog.dom.ControlRange.prototype.range_ = null;
goog.dom.ControlRange.prototype.elements_ = null;
goog.dom.ControlRange.prototype.sortedElements_ = null;
goog.dom.ControlRange.prototype.clearCachedValues_ = function() {
  this.sortedElements_ = this.elements_ = null
};
goog.dom.ControlRange.prototype.clone = function() {
  return goog.dom.ControlRange.createFromElements.apply(this, this.getElements())
};
goog.dom.ControlRange.prototype.getType = function() {
  return goog.dom.RangeType.CONTROL
};
goog.dom.ControlRange.prototype.getBrowserRangeObject = function() {
  return this.range_ || document.body.createControlRange()
};
goog.dom.ControlRange.prototype.setBrowserRangeObject = function(a) {
  if(!goog.dom.AbstractRange.isNativeControlRange(a)) {
    return!1
  }
  this.range_ = a;
  return!0
};
goog.dom.ControlRange.prototype.getTextRangeCount = function() {
  return this.range_ ? this.range_.length : 0
};
goog.dom.ControlRange.prototype.getTextRange = function(a) {
  return goog.dom.TextRange.createFromNodeContents(this.range_.item(a))
};
goog.dom.ControlRange.prototype.getContainer = function() {
  return goog.dom.findCommonAncestor.apply(null, this.getElements())
};
goog.dom.ControlRange.prototype.getStartNode = function() {
  return this.getSortedElements()[0]
};
goog.dom.ControlRange.prototype.getStartOffset = function() {
  return 0
};
goog.dom.ControlRange.prototype.getEndNode = function() {
  var a = this.getSortedElements(), b = goog.array.peek(a);
  return goog.array.find(a, function(a) {
    return goog.dom.contains(a, b)
  })
};
goog.dom.ControlRange.prototype.getEndOffset = function() {
  return this.getEndNode().childNodes.length
};
goog.dom.ControlRange.prototype.getElements = function() {
  if(!this.elements_ && (this.elements_ = [], this.range_)) {
    for(var a = 0;a < this.range_.length;a++) {
      this.elements_.push(this.range_.item(a))
    }
  }
  return this.elements_
};
goog.dom.ControlRange.prototype.getSortedElements = function() {
  this.sortedElements_ || (this.sortedElements_ = this.getElements().concat(), this.sortedElements_.sort(function(a, b) {
    return a.sourceIndex - b.sourceIndex
  }));
  return this.sortedElements_
};
goog.dom.ControlRange.prototype.isRangeInDocument = function() {
  var a = !1;
  try {
    a = goog.array.every(this.getElements(), function(a) {
      return goog.userAgent.IE ? !!a.parentNode : goog.dom.contains(a.ownerDocument.body, a)
    })
  }catch(b) {
  }
  return a
};
goog.dom.ControlRange.prototype.isCollapsed = function() {
  return!this.range_ || !this.range_.length
};
goog.dom.ControlRange.prototype.getText = function() {
  return""
};
goog.dom.ControlRange.prototype.getHtmlFragment = function() {
  return goog.array.map(this.getSortedElements(), goog.dom.getOuterHtml).join("")
};
goog.dom.ControlRange.prototype.getValidHtml = function() {
  return this.getHtmlFragment()
};
goog.dom.ControlRange.prototype.getPastableHtml = goog.dom.ControlRange.prototype.getValidHtml;
goog.dom.ControlRange.prototype.__iterator__ = function() {
  return new goog.dom.ControlRangeIterator(this)
};
goog.dom.ControlRange.prototype.select = function() {
  this.range_ && this.range_.select()
};
goog.dom.ControlRange.prototype.removeContents = function() {
  if(this.range_) {
    for(var a = [], b = 0, c = this.range_.length;b < c;b++) {
      a.push(this.range_.item(b))
    }
    goog.array.forEach(a, goog.dom.removeNode);
    this.collapse(!1)
  }
};
goog.dom.ControlRange.prototype.replaceContentsWithNode = function(a) {
  a = this.insertNode(a, !0);
  this.isCollapsed() || this.removeContents();
  return a
};
goog.dom.ControlRange.prototype.saveUsingDom = function() {
  return new goog.dom.DomSavedControlRange_(this)
};
goog.dom.ControlRange.prototype.collapse = function() {
  this.range_ = null;
  this.clearCachedValues_()
};
goog.dom.DomSavedControlRange_ = function(a) {
  this.elements_ = a.getElements()
};
goog.inherits(goog.dom.DomSavedControlRange_, goog.dom.SavedRange);
goog.dom.DomSavedControlRange_.prototype.restoreInternal = function() {
  for(var a = (this.elements_.length ? goog.dom.getOwnerDocument(this.elements_[0]) : document).body.createControlRange(), b = 0, c = this.elements_.length;b < c;b++) {
    a.addElement(this.elements_[b])
  }
  return goog.dom.ControlRange.createFromBrowserRange(a)
};
goog.dom.DomSavedControlRange_.prototype.disposeInternal = function() {
  goog.dom.DomSavedControlRange_.superClass_.disposeInternal.call(this);
  delete this.elements_
};
goog.dom.ControlRangeIterator = function(a) {
  a && (this.elements_ = a.getSortedElements(), this.startNode_ = this.elements_.shift(), this.endNode_ = goog.array.peek(this.elements_) || this.startNode_);
  goog.dom.RangeIterator.call(this, this.startNode_, !1)
};
goog.inherits(goog.dom.ControlRangeIterator, goog.dom.RangeIterator);
goog.dom.ControlRangeIterator.prototype.startNode_ = null;
goog.dom.ControlRangeIterator.prototype.endNode_ = null;
goog.dom.ControlRangeIterator.prototype.elements_ = null;
goog.dom.ControlRangeIterator.prototype.getStartTextOffset = function() {
  return 0
};
goog.dom.ControlRangeIterator.prototype.getEndTextOffset = function() {
  return 0
};
goog.dom.ControlRangeIterator.prototype.getStartNode = function() {
  return this.startNode_
};
goog.dom.ControlRangeIterator.prototype.getEndNode = function() {
  return this.endNode_
};
goog.dom.ControlRangeIterator.prototype.isLast = function() {
  return!this.depth && !this.elements_.length
};
goog.dom.ControlRangeIterator.prototype.next = function() {
  if(this.isLast()) {
    throw goog.iter.StopIteration;
  }
  if(!this.depth) {
    var a = this.elements_.shift();
    this.setPosition(a, goog.dom.TagWalkType.START_TAG, goog.dom.TagWalkType.START_TAG);
    return a
  }
  return goog.dom.ControlRangeIterator.superClass_.next.call(this)
};
goog.dom.ControlRangeIterator.prototype.copyFrom = function(a) {
  this.elements_ = a.elements_;
  this.startNode_ = a.startNode_;
  this.endNode_ = a.endNode_;
  goog.dom.ControlRangeIterator.superClass_.copyFrom.call(this, a)
};
goog.dom.ControlRangeIterator.prototype.clone = function() {
  var a = new goog.dom.ControlRangeIterator(null);
  a.copyFrom(this);
  return a
};
goog.dom.MultiRange = function() {
  this.browserRanges_ = [];
  this.ranges_ = [];
  this.container_ = this.sortedRanges_ = null
};
goog.inherits(goog.dom.MultiRange, goog.dom.AbstractMultiRange);
goog.dom.MultiRange.createFromBrowserSelection = function(a) {
  for(var b = new goog.dom.MultiRange, c = 0, d = a.rangeCount;c < d;c++) {
    b.browserRanges_.push(a.getRangeAt(c))
  }
  return b
};
goog.dom.MultiRange.createFromBrowserRanges = function(a) {
  var b = new goog.dom.MultiRange;
  b.browserRanges_ = goog.array.clone(a);
  return b
};
goog.dom.MultiRange.createFromTextRanges = function(a) {
  var b = new goog.dom.MultiRange;
  b.ranges_ = a;
  b.browserRanges_ = goog.array.map(a, function(a) {
    return a.getBrowserRangeObject()
  });
  return b
};
goog.dom.MultiRange.prototype.logger_ = goog.debug.Logger.getLogger("goog.dom.MultiRange");
goog.dom.MultiRange.prototype.clearCachedValues_ = function() {
  this.ranges_ = [];
  this.container_ = this.sortedRanges_ = null
};
goog.dom.MultiRange.prototype.clone = function() {
  return goog.dom.MultiRange.createFromBrowserRanges(this.browserRanges_)
};
goog.dom.MultiRange.prototype.getType = function() {
  return goog.dom.RangeType.MULTI
};
goog.dom.MultiRange.prototype.getBrowserRangeObject = function() {
  1 < this.browserRanges_.length && this.logger_.warning("getBrowserRangeObject called on MultiRange with more than 1 range");
  return this.browserRanges_[0]
};
goog.dom.MultiRange.prototype.setBrowserRangeObject = function() {
  return!1
};
goog.dom.MultiRange.prototype.getTextRangeCount = function() {
  return this.browserRanges_.length
};
goog.dom.MultiRange.prototype.getTextRange = function(a) {
  this.ranges_[a] || (this.ranges_[a] = goog.dom.TextRange.createFromBrowserRange(this.browserRanges_[a]));
  return this.ranges_[a]
};
goog.dom.MultiRange.prototype.getContainer = function() {
  if(!this.container_) {
    for(var a = [], b = 0, c = this.getTextRangeCount();b < c;b++) {
      a.push(this.getTextRange(b).getContainer())
    }
    this.container_ = goog.dom.findCommonAncestor.apply(null, a)
  }
  return this.container_
};
goog.dom.MultiRange.prototype.getSortedRanges = function() {
  this.sortedRanges_ || (this.sortedRanges_ = this.getTextRanges(), this.sortedRanges_.sort(function(a, b) {
    var c = a.getStartNode(), d = a.getStartOffset(), e = b.getStartNode(), f = b.getStartOffset();
    return c == e && d == f ? 0 : goog.dom.Range.isReversed(c, d, e, f) ? 1 : -1
  }));
  return this.sortedRanges_
};
goog.dom.MultiRange.prototype.getStartNode = function() {
  return this.getSortedRanges()[0].getStartNode()
};
goog.dom.MultiRange.prototype.getStartOffset = function() {
  return this.getSortedRanges()[0].getStartOffset()
};
goog.dom.MultiRange.prototype.getEndNode = function() {
  return goog.array.peek(this.getSortedRanges()).getEndNode()
};
goog.dom.MultiRange.prototype.getEndOffset = function() {
  return goog.array.peek(this.getSortedRanges()).getEndOffset()
};
goog.dom.MultiRange.prototype.isRangeInDocument = function() {
  return goog.array.every(this.getTextRanges(), function(a) {
    return a.isRangeInDocument()
  })
};
goog.dom.MultiRange.prototype.isCollapsed = function() {
  return 0 == this.browserRanges_.length || 1 == this.browserRanges_.length && this.getTextRange(0).isCollapsed()
};
goog.dom.MultiRange.prototype.getText = function() {
  return goog.array.map(this.getTextRanges(), function(a) {
    return a.getText()
  }).join("")
};
goog.dom.MultiRange.prototype.getHtmlFragment = function() {
  return this.getValidHtml()
};
goog.dom.MultiRange.prototype.getValidHtml = function() {
  return goog.array.map(this.getTextRanges(), function(a) {
    return a.getValidHtml()
  }).join("")
};
goog.dom.MultiRange.prototype.getPastableHtml = function() {
  return this.getValidHtml()
};
goog.dom.MultiRange.prototype.__iterator__ = function() {
  return new goog.dom.MultiRangeIterator(this)
};
goog.dom.MultiRange.prototype.select = function() {
  var a = goog.dom.AbstractRange.getBrowserSelectionForWindow(this.getWindow());
  a.removeAllRanges();
  for(var b = 0, c = this.getTextRangeCount();b < c;b++) {
    a.addRange(this.getTextRange(b).getBrowserRangeObject())
  }
};
goog.dom.MultiRange.prototype.removeContents = function() {
  goog.array.forEach(this.getTextRanges(), function(a) {
    a.removeContents()
  })
};
goog.dom.MultiRange.prototype.saveUsingDom = function() {
  return new goog.dom.DomSavedMultiRange_(this)
};
goog.dom.MultiRange.prototype.collapse = function(a) {
  if(!this.isCollapsed()) {
    var b = a ? this.getTextRange(0) : this.getTextRange(this.getTextRangeCount() - 1);
    this.clearCachedValues_();
    b.collapse(a);
    this.ranges_ = [b];
    this.sortedRanges_ = [b];
    this.browserRanges_ = [b.getBrowserRangeObject()]
  }
};
goog.dom.DomSavedMultiRange_ = function(a) {
  this.savedRanges_ = goog.array.map(a.getTextRanges(), function(a) {
    return a.saveUsingDom()
  })
};
goog.inherits(goog.dom.DomSavedMultiRange_, goog.dom.SavedRange);
goog.dom.DomSavedMultiRange_.prototype.restoreInternal = function() {
  var a = goog.array.map(this.savedRanges_, function(a) {
    return a.restore()
  });
  return goog.dom.MultiRange.createFromTextRanges(a)
};
goog.dom.DomSavedMultiRange_.prototype.disposeInternal = function() {
  goog.dom.DomSavedMultiRange_.superClass_.disposeInternal.call(this);
  goog.array.forEach(this.savedRanges_, function(a) {
    a.dispose()
  });
  delete this.savedRanges_
};
goog.dom.MultiRangeIterator = function(a) {
  a && (this.iterators_ = goog.array.map(a.getSortedRanges(), function(a) {
    return goog.iter.toIterator(a)
  }));
  goog.dom.RangeIterator.call(this, a ? this.getStartNode() : null, !1)
};
goog.inherits(goog.dom.MultiRangeIterator, goog.dom.RangeIterator);
goog.dom.MultiRangeIterator.prototype.iterators_ = null;
goog.dom.MultiRangeIterator.prototype.currentIdx_ = 0;
goog.dom.MultiRangeIterator.prototype.getStartTextOffset = function() {
  return this.iterators_[this.currentIdx_].getStartTextOffset()
};
goog.dom.MultiRangeIterator.prototype.getEndTextOffset = function() {
  return this.iterators_[this.currentIdx_].getEndTextOffset()
};
goog.dom.MultiRangeIterator.prototype.getStartNode = function() {
  return this.iterators_[0].getStartNode()
};
goog.dom.MultiRangeIterator.prototype.getEndNode = function() {
  return goog.array.peek(this.iterators_).getEndNode()
};
goog.dom.MultiRangeIterator.prototype.isLast = function() {
  return this.iterators_[this.currentIdx_].isLast()
};
goog.dom.MultiRangeIterator.prototype.next = function() {
  try {
    var a = this.iterators_[this.currentIdx_], b = a.next();
    this.setPosition(a.node, a.tagType, a.depth);
    return b
  }catch(c) {
    if(c !== goog.iter.StopIteration || this.iterators_.length - 1 == this.currentIdx_) {
      throw c;
    }
    this.currentIdx_++;
    return this.next()
  }
};
goog.dom.MultiRangeIterator.prototype.copyFrom = function(a) {
  this.iterators_ = goog.array.clone(a.iterators_);
  goog.dom.MultiRangeIterator.superClass_.copyFrom.call(this, a)
};
goog.dom.MultiRangeIterator.prototype.clone = function() {
  var a = new goog.dom.MultiRangeIterator(null);
  a.copyFrom(this);
  return a
};
goog.dom.Range = {};
goog.dom.Range.createFromWindow = function(a) {
  return(a = goog.dom.AbstractRange.getBrowserSelectionForWindow(a || window)) && goog.dom.Range.createFromBrowserSelection(a)
};
goog.dom.Range.createFromBrowserSelection = function(a) {
  var b, c = !1;
  if(a.createRange) {
    try {
      b = a.createRange()
    }catch(d) {
      return null
    }
  }else {
    if(a.rangeCount) {
      if(1 < a.rangeCount) {
        return goog.dom.MultiRange.createFromBrowserSelection(a)
      }
      b = a.getRangeAt(0);
      c = goog.dom.Range.isReversed(a.anchorNode, a.anchorOffset, a.focusNode, a.focusOffset)
    }else {
      return null
    }
  }
  return goog.dom.Range.createFromBrowserRange(b, c)
};
goog.dom.Range.createFromBrowserRange = function(a, b) {
  return goog.dom.AbstractRange.isNativeControlRange(a) ? goog.dom.ControlRange.createFromBrowserRange(a) : goog.dom.TextRange.createFromBrowserRange(a, b)
};
goog.dom.Range.createFromNodeContents = function(a, b) {
  return goog.dom.TextRange.createFromNodeContents(a, b)
};
goog.dom.Range.createCaret = function(a, b) {
  return goog.dom.TextRange.createFromNodes(a, b, a, b)
};
goog.dom.Range.createFromNodes = function(a, b, c, d) {
  return goog.dom.TextRange.createFromNodes(a, b, c, d)
};
goog.dom.Range.clearSelection = function(a) {
  if(a = goog.dom.AbstractRange.getBrowserSelectionForWindow(a || window)) {
    if(a.empty) {
      try {
        a.empty()
      }catch(b) {
      }
    }else {
      try {
        a.removeAllRanges()
      }catch(c) {
      }
    }
  }
};
goog.dom.Range.hasSelection = function(a) {
  a = goog.dom.AbstractRange.getBrowserSelectionForWindow(a || window);
  return!!a && (goog.userAgent.IE ? "None" != a.type : !!a.rangeCount)
};
goog.dom.Range.isReversed = function(a, b, c, d) {
  if(a == c) {
    return d < b
  }
  var e;
  if(a.nodeType == goog.dom.NodeType.ELEMENT && b) {
    if(e = a.childNodes[b]) {
      a = e, b = 0
    }else {
      if(goog.dom.contains(a, c)) {
        return!0
      }
    }
  }
  if(c.nodeType == goog.dom.NodeType.ELEMENT && d) {
    if(e = c.childNodes[d]) {
      c = e, d = 0
    }else {
      if(goog.dom.contains(c, a)) {
        return!1
      }
    }
  }
  return 0 < (goog.dom.compareNodeOrder(a, c) || b - d)
};
goog.net.xpc = {};
goog.net.xpc.TransportTypes = {NATIVE_MESSAGING:1, FRAME_ELEMENT_METHOD:2, IFRAME_RELAY:3, IFRAME_POLLING:4, FLASH:5, NIX:6};
goog.net.xpc.TransportNames = {1:"NativeMessagingTransport", 2:"FrameElementMethodTransport", 3:"IframeRelayTransport", 4:"IframePollingTransport", 5:"FlashTransport", 6:"NixTransport"};
goog.net.xpc.CfgFields = {CHANNEL_NAME:"cn", AUTH_TOKEN:"at", REMOTE_AUTH_TOKEN:"rat", PEER_URI:"pu", IFRAME_ID:"ifrid", TRANSPORT:"tp", LOCAL_RELAY_URI:"lru", PEER_RELAY_URI:"pru", LOCAL_POLL_URI:"lpu", PEER_POLL_URI:"ppu", PEER_HOSTNAME:"ph", ONE_SIDED_HANDSHAKE:"osh", ROLE:"role", NATIVE_TRANSPORT_PROTOCOL_VERSION:"nativeProtocolVersion"};
goog.net.xpc.UriCfgFields = [goog.net.xpc.CfgFields.PEER_URI, goog.net.xpc.CfgFields.LOCAL_RELAY_URI, goog.net.xpc.CfgFields.PEER_RELAY_URI, goog.net.xpc.CfgFields.LOCAL_POLL_URI, goog.net.xpc.CfgFields.PEER_POLL_URI];
goog.net.xpc.ChannelStates = {NOT_CONNECTED:1, CONNECTED:2, CLOSED:3};
goog.net.xpc.TRANSPORT_SERVICE_ = "tp";
goog.net.xpc.SETUP = "SETUP";
goog.net.xpc.SETUP_NTPV2 = "SETUP_NTPV2";
goog.net.xpc.SETUP_ACK_ = "SETUP_ACK";
goog.net.xpc.SETUP_ACK_NTPV2 = "SETUP_ACK_NTPV2";
goog.net.xpc.channels_ = {};
goog.net.xpc.getRandomString = function(a, b) {
  for(var c = b || goog.net.xpc.randomStringCharacters_, d = c.length, e = "";0 < a--;) {
    e += c.charAt(Math.floor(Math.random() * d))
  }
  return e
};
goog.net.xpc.randomStringCharacters_ = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
goog.net.xpc.logger = goog.debug.Logger.getLogger("goog.net.xpc");
goog.async.Delay = function(a, b, c) {
  goog.Disposable.call(this);
  this.listener_ = a;
  this.interval_ = b || 0;
  this.handler_ = c;
  this.callback_ = goog.bind(this.doAction_, this)
};
goog.inherits(goog.async.Delay, goog.Disposable);
goog.Delay = goog.async.Delay;
goog.async.Delay.prototype.id_ = 0;
goog.async.Delay.prototype.disposeInternal = function() {
  goog.async.Delay.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.listener_;
  delete this.handler_
};
goog.async.Delay.prototype.start = function(a) {
  this.stop();
  this.id_ = goog.Timer.callOnce(this.callback_, goog.isDef(a) ? a : this.interval_)
};
goog.async.Delay.prototype.stop = function() {
  this.isActive() && goog.Timer.clear(this.id_);
  this.id_ = 0
};
goog.async.Delay.prototype.fire = function() {
  this.stop();
  this.doAction_()
};
goog.async.Delay.prototype.fireIfActive = function() {
  this.isActive() && this.fire()
};
goog.async.Delay.prototype.isActive = function() {
  return 0 != this.id_
};
goog.async.Delay.prototype.doAction_ = function() {
  this.id_ = 0;
  this.listener_ && this.listener_.call(this.handler_)
};
goog.events.EventHandler = function(a) {
  goog.Disposable.call(this);
  this.handler_ = a;
  this.keys_ = []
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(a, b, c, d, e) {
  goog.isArray(b) || (goog.events.EventHandler.typeArray_[0] = b, b = goog.events.EventHandler.typeArray_);
  for(var f = 0;f < b.length;f++) {
    var g = goog.events.listen(a, b[f], c || this, d || !1, e || this.handler_ || this);
    this.keys_.push(g)
  }
  return this
};
goog.events.EventHandler.prototype.listenOnce = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      this.listenOnce(a, b[f], c, d, e)
    }
  }else {
    a = goog.events.listenOnce(a, b, c || this, d, e || this.handler_ || this), this.keys_.push(a)
  }
  return this
};
goog.events.EventHandler.prototype.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e || this.handler_ || this, this);
  return this
};
goog.events.EventHandler.prototype.getListenerCount = function() {
  return this.keys_.length
};
goog.events.EventHandler.prototype.unlisten = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      this.unlisten(a, b[f], c, d, e)
    }
  }else {
    if(a = goog.events.getListener(a, b, c || this, d, e || this.handler_ || this)) {
      a = a.key, goog.events.unlistenByKey(a), goog.array.remove(this.keys_, a)
    }
  }
  return this
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e || this.handler_ || this, this);
  return this
};
goog.events.EventHandler.prototype.removeAll = function() {
  goog.array.forEach(this.keys_, goog.events.unlistenByKey);
  this.keys_.length = 0
};
goog.events.EventHandler.prototype.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll()
};
goog.events.EventHandler.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
goog.messaging = {};
goog.messaging.MessageChannel = function() {
};
goog.messaging.MessageChannel.prototype.connect = function() {
};
goog.messaging.MessageChannel.prototype.isConnected = function() {
};
goog.messaging.MessageChannel.prototype.registerService = function() {
};
goog.messaging.MessageChannel.prototype.registerDefaultService = function() {
};
goog.messaging.MessageChannel.prototype.send = function() {
};
goog.messaging.AbstractChannel = function() {
  goog.Disposable.call(this);
  this.services_ = {}
};
goog.inherits(goog.messaging.AbstractChannel, goog.Disposable);
goog.messaging.AbstractChannel.prototype.logger = goog.debug.Logger.getLogger("goog.messaging.AbstractChannel");
goog.messaging.AbstractChannel.prototype.connect = function(a) {
  a && a()
};
goog.messaging.AbstractChannel.prototype.isConnected = function() {
  return!0
};
goog.messaging.AbstractChannel.prototype.registerService = function(a, b, c) {
  this.services_[a] = {callback:b, objectPayload:!!c}
};
goog.messaging.AbstractChannel.prototype.registerDefaultService = function(a) {
  this.defaultService_ = a
};
goog.messaging.AbstractChannel.prototype.deliver = function(a, b) {
  var c = this.getService(a, b);
  if(c) {
    var d = this.decodePayload(a, b, c.objectPayload);
    goog.isDefAndNotNull(d) && c.callback(d)
  }
};
goog.messaging.AbstractChannel.prototype.getService = function(a, b) {
  var c = this.services_[a];
  if(c) {
    return c
  }
  if(this.defaultService_) {
    var c = goog.partial(this.defaultService_, a), d = goog.isObject(b);
    return{callback:c, objectPayload:d}
  }
  this.logger.warning('Unknown service name "' + a + '"');
  return null
};
goog.messaging.AbstractChannel.prototype.decodePayload = function(a, b, c) {
  if(c && goog.isString(b)) {
    try {
      return goog.json.parse(b)
    }catch(d) {
      return this.logger.warning("Expected JSON payload for " + a + ', was "' + b + '"'), null
    }
  }else {
    if(!c && !goog.isString(b)) {
      return goog.json.serialize(b)
    }
  }
  return b
};
goog.messaging.AbstractChannel.prototype.disposeInternal = function() {
  goog.messaging.AbstractChannel.superClass_.disposeInternal.call(this);
  goog.dispose(this.logger);
  delete this.logger;
  delete this.services_;
  delete this.defaultService_
};
goog.net.xpc.CrossPageChannelRole = {OUTER:0, INNER:1};
goog.net.xpc.Transport = function(a) {
  goog.Disposable.call(this);
  this.domHelper_ = a || goog.dom.getDomHelper()
};
goog.inherits(goog.net.xpc.Transport, goog.Disposable);
goog.net.xpc.Transport.prototype.transportType = 0;
goog.net.xpc.Transport.prototype.getType = function() {
  return this.transportType
};
goog.net.xpc.Transport.prototype.getWindow = function() {
  return this.domHelper_.getWindow()
};
goog.net.xpc.Transport.prototype.getName = function() {
  return goog.net.xpc.TransportNames[this.transportType] || ""
};
goog.net.xpc.FrameElementMethodTransport = function(a, b) {
  goog.net.xpc.Transport.call(this, b);
  this.channel_ = a;
  this.queue_ = [];
  this.deliverQueuedCb_ = goog.bind(this.deliverQueued_, this)
};
goog.inherits(goog.net.xpc.FrameElementMethodTransport, goog.net.xpc.Transport);
goog.net.xpc.FrameElementMethodTransport.prototype.transportType = goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD;
goog.net.xpc.FrameElementMethodTransport.prototype.recursive_ = !1;
goog.net.xpc.FrameElementMethodTransport.prototype.timer_ = 0;
goog.net.xpc.FrameElementMethodTransport.outgoing_ = null;
goog.net.xpc.FrameElementMethodTransport.prototype.connect = function() {
  this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER ? (this.iframeElm_ = this.channel_.iframeElement_, this.iframeElm_.XPC_toOuter = goog.bind(this.incoming_, this)) : this.attemptSetup_()
};
goog.net.xpc.FrameElementMethodTransport.prototype.attemptSetup_ = function() {
  var a = !0;
  try {
    if(this.iframeElm_ || (this.iframeElm_ = this.getWindow().frameElement), this.iframeElm_ && this.iframeElm_.XPC_toOuter) {
      this.outgoing_ = this.iframeElm_.XPC_toOuter, this.iframeElm_.XPC_toOuter.XPC_toInner = goog.bind(this.incoming_, this), a = !1, this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_), this.channel_.notifyConnected()
    }
  }catch(b) {
    goog.net.xpc.logger.severe("exception caught while attempting setup: " + b)
  }
  a && (this.attemptSetupCb_ || (this.attemptSetupCb_ = goog.bind(this.attemptSetup_, this)), this.getWindow().setTimeout(this.attemptSetupCb_, 100))
};
goog.net.xpc.FrameElementMethodTransport.prototype.transportServiceHandler = function(a) {
  if(this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER && !this.channel_.isConnected() && a == goog.net.xpc.SETUP_ACK_) {
    this.outgoing_ = this.iframeElm_.XPC_toOuter.XPC_toInner, this.channel_.notifyConnected()
  }else {
    throw Error("Got unexpected transport message.");
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.incoming_ = function(a, b) {
  !this.recursive_ && 0 == this.queue_.length ? this.channel_.deliver_(a, b) : (this.queue_.push({serviceName:a, payload:b}), 1 == this.queue_.length && (this.timer_ = this.getWindow().setTimeout(this.deliverQueuedCb_, 1)))
};
goog.net.xpc.FrameElementMethodTransport.prototype.deliverQueued_ = function() {
  for(;this.queue_.length;) {
    var a = this.queue_.shift();
    this.channel_.deliver_(a.serviceName, a.payload)
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.send = function(a, b) {
  this.recursive_ = !0;
  this.outgoing_(a, b);
  this.recursive_ = !1
};
goog.net.xpc.FrameElementMethodTransport.prototype.disposeInternal = function() {
  goog.net.xpc.FrameElementMethodTransport.superClass_.disposeInternal.call(this);
  this.iframeElm_ = this.outgoing_ = null
};
goog.net.xpc.IframePollingTransport = function(a, b) {
  goog.net.xpc.Transport.call(this, b);
  this.channel_ = a;
  this.sendUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI];
  this.rcvUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI];
  this.sendQueue_ = []
};
goog.inherits(goog.net.xpc.IframePollingTransport, goog.net.xpc.Transport);
goog.net.xpc.IframePollingTransport.prototype.pollsBeforeReconnect_ = 5;
goog.net.xpc.IframePollingTransport.prototype.transportType = goog.net.xpc.TransportTypes.IFRAME_POLLING;
goog.net.xpc.IframePollingTransport.prototype.sequence_ = 0;
goog.net.xpc.IframePollingTransport.prototype.waitForAck_ = !1;
goog.net.xpc.IframePollingTransport.prototype.initialized_ = !1;
goog.net.xpc.IframePollingTransport.prototype.reconnectFrame_ = null;
goog.net.xpc.IframePollingTransport.IFRAME_PREFIX = "googlexpc";
goog.net.xpc.IframePollingTransport.prototype.getMsgFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_" + this.channel_.name + "_msg"
};
goog.net.xpc.IframePollingTransport.prototype.getAckFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_" + this.channel_.name + "_ack"
};
goog.net.xpc.IframePollingTransport.prototype.isChannelAvailable = function() {
  return!this.isDisposed() && this.channel_.isPeerAvailable()
};
goog.net.xpc.IframePollingTransport.prototype.getPeerFrames_ = function() {
  try {
    if(this.isChannelAvailable()) {
      return this.channel_.getPeerWindowObject().frames || {}
    }
  }catch(a) {
    goog.net.xpc.logger.fine("error retrieving peer frames")
  }
  return{}
};
goog.net.xpc.IframePollingTransport.prototype.getPeerFrame_ = function(a) {
  return this.getPeerFrames_()[a]
};
goog.net.xpc.IframePollingTransport.prototype.connect = function() {
  this.isChannelAvailable() && (goog.net.xpc.logger.fine("transport connect called"), this.initialized_ || (goog.net.xpc.logger.fine("initializing..."), this.constructSenderFrames_(), this.initialized_ = !0), this.checkForeignFramesReady_())
};
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrames_ = function() {
  var a = this.getMsgFrameName_();
  this.msgIframeElm_ = this.constructSenderFrame_(a);
  this.msgWinObj_ = this.getWindow().frames[a];
  a = this.getAckFrameName_();
  this.ackIframeElm_ = this.constructSenderFrame_(a);
  this.ackWinObj_ = this.getWindow().frames[a]
};
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrame_ = function(a) {
  goog.net.xpc.logger.finest("constructing sender frame: " + a);
  var b = goog.dom.createElement("iframe"), c = b.style;
  c.position = "absolute";
  c.top = "-10px";
  c.left = "10px";
  c.width = "1px";
  c.height = "1px";
  b.id = b.name = a;
  b.src = this.sendUri_ + "#INITIAL";
  this.getWindow().document.body.appendChild(b);
  return b
};
goog.net.xpc.IframePollingTransport.prototype.maybeInnerPeerReconnect_ = function() {
  this.reconnectFrame_ || 0 < this.pollsBeforeReconnect_-- || (goog.net.xpc.logger.finest("Inner peer reconnect triggered."), this.channel_.name = goog.net.xpc.getRandomString(10), goog.net.xpc.logger.finest("switching channels: " + this.channel_.name), this.deconstructSenderFrames_(), this.initialized_ = !1, this.reconnectFrame_ = this.constructSenderFrame_(goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_reconnect_" + this.channel_.name))
};
goog.net.xpc.IframePollingTransport.prototype.outerPeerReconnect_ = function() {
  goog.net.xpc.logger.finest("outerPeerReconnect called");
  for(var a = this.getPeerFrames_(), b = a.length, c = 0;c < b;c++) {
    var d;
    try {
      a[c] && a[c].name && (d = a[c].name)
    }catch(e) {
    }
    if(d) {
      var f = d.split("_");
      if(3 == f.length && f[0] == goog.net.xpc.IframePollingTransport.IFRAME_PREFIX && "reconnect" == f[1]) {
        this.channel_.name = f[2];
        this.deconstructSenderFrames_();
        this.initialized_ = !1;
        break
      }
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.deconstructSenderFrames_ = function() {
  goog.net.xpc.logger.finest("deconstructSenderFrames called");
  this.msgIframeElm_ && (this.msgIframeElm_.parentNode.removeChild(this.msgIframeElm_), this.msgWinObj_ = this.msgIframeElm_ = null);
  this.ackIframeElm_ && (this.ackIframeElm_.parentNode.removeChild(this.ackIframeElm_), this.ackWinObj_ = this.ackIframeElm_ = null)
};
goog.net.xpc.IframePollingTransport.prototype.checkForeignFramesReady_ = function() {
  !this.isRcvFrameReady_(this.getMsgFrameName_()) || !this.isRcvFrameReady_(this.getAckFrameName_()) ? (goog.net.xpc.logger.finest("foreign frames not (yet) present"), this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.INNER ? this.maybeInnerPeerReconnect_() : this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER && this.outerPeerReconnect_(), this.getWindow().setTimeout(goog.bind(this.connect, this), 100)) : (goog.net.xpc.logger.fine("foreign frames present"), this.msgReceiver_ = 
  new goog.net.xpc.IframePollingTransport.Receiver(this, this.getPeerFrame_(this.getMsgFrameName_()), goog.bind(this.processIncomingMsg, this)), this.ackReceiver_ = new goog.net.xpc.IframePollingTransport.Receiver(this, this.getPeerFrame_(this.getAckFrameName_()), goog.bind(this.processIncomingAck, this)), this.checkLocalFramesPresent_())
};
goog.net.xpc.IframePollingTransport.prototype.isRcvFrameReady_ = function(a) {
  goog.net.xpc.logger.finest("checking for receive frame: " + a);
  try {
    var b = this.getPeerFrame_(a);
    if(!b || 0 != b.location.href.indexOf(this.rcvUri_)) {
      return!1
    }
  }catch(c) {
    return!1
  }
  return!0
};
goog.net.xpc.IframePollingTransport.prototype.checkLocalFramesPresent_ = function() {
  var a = this.getPeerFrames_();
  !a[this.getAckFrameName_()] || !a[this.getMsgFrameName_()] ? (this.checkLocalFramesPresentCb_ || (this.checkLocalFramesPresentCb_ = goog.bind(this.checkLocalFramesPresent_, this)), this.getWindow().setTimeout(this.checkLocalFramesPresentCb_, 100), goog.net.xpc.logger.fine("local frames not (yet) present")) : (this.msgSender_ = new goog.net.xpc.IframePollingTransport.Sender(this.sendUri_, this.msgWinObj_), this.ackSender_ = new goog.net.xpc.IframePollingTransport.Sender(this.sendUri_, this.ackWinObj_), 
  goog.net.xpc.logger.fine("local frames ready"), this.getWindow().setTimeout(goog.bind(function() {
    this.msgSender_.send(goog.net.xpc.SETUP);
    this.waitForAck_ = this.sentConnectionSetup_ = !0;
    goog.net.xpc.logger.fine("SETUP sent")
  }, this), 100))
};
goog.net.xpc.IframePollingTransport.prototype.checkIfConnected_ = function() {
  if(this.sentConnectionSetupAck_ && this.rcvdConnectionSetupAck_) {
    if(this.channel_.notifyConnected(), this.deliveryQueue_) {
      goog.net.xpc.logger.fine("delivering queued messages (" + this.deliveryQueue_.length + ")");
      for(var a = 0, b;a < this.deliveryQueue_.length;a++) {
        b = this.deliveryQueue_[a], this.channel_.deliver_(b.service, b.payload)
      }
      delete this.deliveryQueue_
    }
  }else {
    goog.net.xpc.logger.finest("checking if connected: ack sent:" + this.sentConnectionSetupAck_ + ", ack rcvd: " + this.rcvdConnectionSetupAck_)
  }
};
goog.net.xpc.IframePollingTransport.prototype.processIncomingMsg = function(a) {
  goog.net.xpc.logger.finest("msg received: " + a);
  if(a == goog.net.xpc.SETUP) {
    this.ackSender_ && (this.ackSender_.send(goog.net.xpc.SETUP_ACK_), goog.net.xpc.logger.finest("SETUP_ACK sent"), this.sentConnectionSetupAck_ = !0, this.checkIfConnected_())
  }else {
    if(this.channel_.isConnected() || this.sentConnectionSetupAck_) {
      var b = a.indexOf("|"), c = a.substring(0, b), a = a.substring(b + 1), b = c.indexOf(",");
      if(-1 == b) {
        var d;
        this.ackSender_.send("ACK:" + c);
        this.deliverPayload_(a)
      }else {
        if(d = c.substring(0, b), this.ackSender_.send("ACK:" + d), c = c.substring(b + 1).split("/"), b = parseInt(c[0], 10), c = parseInt(c[1], 10), 1 == b && (this.parts_ = []), this.parts_.push(a), b == c) {
          this.deliverPayload_(this.parts_.join("")), delete this.parts_
        }
      }
    }else {
      goog.net.xpc.logger.warning("received msg, but channel is not connected")
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.processIncomingAck = function(a) {
  goog.net.xpc.logger.finest("ack received: " + a);
  a == goog.net.xpc.SETUP_ACK_ ? (this.waitForAck_ = !1, this.rcvdConnectionSetupAck_ = !0, this.checkIfConnected_()) : this.channel_.isConnected() ? this.waitForAck_ ? parseInt(a.split(":")[1], 10) == this.sequence_ ? (this.waitForAck_ = !1, this.sendNextFrame_()) : goog.net.xpc.logger.warning("got ack with wrong sequence") : goog.net.xpc.logger.warning("got unexpected ack") : goog.net.xpc.logger.warning("received ack, but channel not connected")
};
goog.net.xpc.IframePollingTransport.prototype.sendNextFrame_ = function() {
  if(!this.waitForAck_ && this.sendQueue_.length) {
    var a = this.sendQueue_.shift();
    ++this.sequence_;
    this.msgSender_.send(this.sequence_ + a);
    goog.net.xpc.logger.finest("msg sent: " + this.sequence_ + a);
    this.waitForAck_ = !0
  }
};
goog.net.xpc.IframePollingTransport.prototype.deliverPayload_ = function(a) {
  var b = a.indexOf(":"), c = a.substr(0, b), a = a.substring(b + 1);
  this.channel_.isConnected() ? this.channel_.deliver_(c, a) : ((this.deliveryQueue_ || (this.deliveryQueue_ = [])).push({service:c, payload:a}), goog.net.xpc.logger.finest("queued delivery"))
};
goog.net.xpc.IframePollingTransport.prototype.MAX_FRAME_LENGTH_ = 3800;
goog.net.xpc.IframePollingTransport.prototype.send = function(a, b) {
  var c = a + ":" + b;
  if(!goog.userAgent.IE || b.length <= this.MAX_FRAME_LENGTH_) {
    this.sendQueue_.push("|" + c)
  }else {
    for(var d = b.length, e = Math.ceil(d / this.MAX_FRAME_LENGTH_), f = 0, g = 1;f < d;) {
      this.sendQueue_.push("," + g + "/" + e + "|" + c.substr(f, this.MAX_FRAME_LENGTH_)), g++, f += this.MAX_FRAME_LENGTH_
    }
  }
  this.sendNextFrame_()
};
goog.net.xpc.IframePollingTransport.prototype.disposeInternal = function() {
  goog.net.xpc.IframePollingTransport.superClass_.disposeInternal.call(this);
  var a = goog.net.xpc.IframePollingTransport.receivers_;
  goog.array.remove(a, this.msgReceiver_);
  goog.array.remove(a, this.ackReceiver_);
  this.msgReceiver_ = this.ackReceiver_ = null;
  goog.dom.removeNode(this.msgIframeElm_);
  goog.dom.removeNode(this.ackIframeElm_);
  this.msgWinObj_ = this.ackWinObj_ = this.msgIframeElm_ = this.ackIframeElm_ = null
};
goog.net.xpc.IframePollingTransport.receivers_ = [];
goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ = 10;
goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_ = 100;
goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ = 1E3;
goog.net.xpc.IframePollingTransport.receive_ = function() {
  var a = !1;
  try {
    for(var b = 0, c = goog.net.xpc.IframePollingTransport.receivers_.length;b < c;b++) {
      a = a || goog.net.xpc.IframePollingTransport.receivers_[b].receive()
    }
  }catch(d) {
    if(goog.net.xpc.logger.info("receive_() failed: " + d), goog.net.xpc.IframePollingTransport.receivers_[b].transport_.channel_.notifyTransportError_(), !goog.net.xpc.IframePollingTransport.receivers_.length) {
      return
    }
  }
  b = goog.now();
  a && (goog.net.xpc.IframePollingTransport.lastActivity_ = b);
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(goog.net.xpc.IframePollingTransport.receiveCb_, b - goog.net.xpc.IframePollingTransport.lastActivity_ < goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ ? goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ : goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_)
};
goog.net.xpc.IframePollingTransport.receiveCb_ = goog.bind(goog.net.xpc.IframePollingTransport.receive_, goog.net.xpc.IframePollingTransport);
goog.net.xpc.IframePollingTransport.startRcvTimer_ = function() {
  goog.net.xpc.logger.fine("starting receive-timer");
  goog.net.xpc.IframePollingTransport.lastActivity_ = goog.now();
  goog.net.xpc.IframePollingTransport.rcvTimer_ && window.clearTimeout(goog.net.xpc.IframePollingTransport.rcvTimer_);
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(goog.net.xpc.IframePollingTransport.receiveCb_, goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_)
};
goog.net.xpc.IframePollingTransport.Sender = function(a, b) {
  this.sendUri_ = a;
  this.sendFrame_ = b;
  this.cycle_ = 0
};
goog.net.xpc.IframePollingTransport.Sender.prototype.send = function(a) {
  this.cycle_ = ++this.cycle_ % 2;
  a = this.sendUri_ + "#" + this.cycle_ + encodeURIComponent(a);
  try {
    goog.userAgent.WEBKIT ? this.sendFrame_.location.href = a : this.sendFrame_.location.replace(a)
  }catch(b) {
    goog.net.xpc.logger.severe("sending failed", b)
  }
  goog.net.xpc.IframePollingTransport.startRcvTimer_()
};
goog.net.xpc.IframePollingTransport.Receiver = function(a, b, c) {
  this.transport_ = a;
  this.rcvFrame_ = b;
  this.cb_ = c;
  this.currentLoc_ = this.rcvFrame_.location.href.split("#")[0] + "#INITIAL";
  goog.net.xpc.IframePollingTransport.receivers_.push(this);
  goog.net.xpc.IframePollingTransport.startRcvTimer_()
};
goog.net.xpc.IframePollingTransport.Receiver.prototype.receive = function() {
  var a = this.rcvFrame_.location.href;
  if(a != this.currentLoc_) {
    this.currentLoc_ = a;
    if(a = a.split("#")[1]) {
      a = a.substr(1), this.cb_(decodeURIComponent(a))
    }
    return!0
  }
  return!1
};
goog.net.xpc.IframeRelayTransport = function(a, b) {
  goog.net.xpc.Transport.call(this, b);
  this.channel_ = a;
  this.peerRelayUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.PEER_RELAY_URI];
  this.peerIframeId_ = this.channel_.cfg_[goog.net.xpc.CfgFields.IFRAME_ID];
  goog.userAgent.WEBKIT && goog.net.xpc.IframeRelayTransport.startCleanupTimer_()
};
goog.inherits(goog.net.xpc.IframeRelayTransport, goog.net.xpc.Transport);
goog.userAgent.WEBKIT && (goog.net.xpc.IframeRelayTransport.iframeRefs_ = [], goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_ = 1E3, goog.net.xpc.IframeRelayTransport.IFRAME_MAX_AGE_ = 3E3, goog.net.xpc.IframeRelayTransport.cleanupTimer_ = 0, goog.net.xpc.IframeRelayTransport.startCleanupTimer_ = function() {
  goog.net.xpc.IframeRelayTransport.cleanupTimer_ || (goog.net.xpc.IframeRelayTransport.cleanupTimer_ = window.setTimeout(function() {
    goog.net.xpc.IframeRelayTransport.cleanup_()
  }, goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_))
}, goog.net.xpc.IframeRelayTransport.cleanup_ = function(a) {
  for(var b = goog.now(), a = a || goog.net.xpc.IframeRelayTransport.IFRAME_MAX_AGE_;goog.net.xpc.IframeRelayTransport.iframeRefs_.length && b - goog.net.xpc.IframeRelayTransport.iframeRefs_[0].timestamp >= a;) {
    var c = goog.net.xpc.IframeRelayTransport.iframeRefs_.shift().iframeElement;
    goog.dom.removeNode(c);
    goog.net.xpc.logger.finest("iframe removed")
  }
  goog.net.xpc.IframeRelayTransport.cleanupTimer_ = window.setTimeout(goog.net.xpc.IframeRelayTransport.cleanupCb_, goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_)
}, goog.net.xpc.IframeRelayTransport.cleanupCb_ = function() {
  goog.net.xpc.IframeRelayTransport.cleanup_()
});
goog.net.xpc.IframeRelayTransport.IE_PAYLOAD_MAX_SIZE_ = 1800;
goog.net.xpc.IframeRelayTransport.fragmentMap_ = {};
goog.net.xpc.IframeRelayTransport.prototype.transportType = goog.net.xpc.TransportTypes.IFRAME_RELAY;
goog.net.xpc.IframeRelayTransport.prototype.connect = function() {
  if(!this.getWindow().xpcRelay) {
    this.getWindow().xpcRelay = goog.net.xpc.IframeRelayTransport.receiveMessage_
  }
  this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP)
};
goog.net.xpc.IframeRelayTransport.receiveMessage_ = function(a, b) {
  var c = b.indexOf(":"), d = b.substr(0, c), e = b.substr(c + 1);
  if(!goog.userAgent.IE || (c = d.indexOf("|")) == -1) {
    var f = d
  }else {
    var f = d.substr(0, c), d = d.substr(c + 1), c = d.indexOf("+"), g = d.substr(0, c), c = parseInt(d.substr(c + 1), 10), h = goog.net.xpc.IframeRelayTransport.fragmentMap_[g];
    h || (h = goog.net.xpc.IframeRelayTransport.fragmentMap_[g] = {fragments:[], received:0, expected:0});
    if(goog.string.contains(d, "++")) {
      h.expected = c + 1
    }
    h.fragments[c] = e;
    h.received++;
    if(h.received != h.expected) {
      return
    }
    e = h.fragments.join("");
    delete goog.net.xpc.IframeRelayTransport.fragmentMap_[g]
  }
  goog.net.xpc.channels_[a].deliver_(f, decodeURIComponent(e))
};
goog.net.xpc.IframeRelayTransport.prototype.transportServiceHandler = function(a) {
  if(a == goog.net.xpc.SETUP) {
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
    this.channel_.notifyConnected()
  }else {
    a == goog.net.xpc.SETUP_ACK_ && this.channel_.notifyConnected()
  }
};
goog.net.xpc.IframeRelayTransport.prototype.send = function(a, b) {
  var c = encodeURIComponent(b), d = c.length, e = goog.net.xpc.IframeRelayTransport.IE_PAYLOAD_MAX_SIZE_;
  if(goog.userAgent.IE && d > e) {
    for(var f = goog.string.getRandomString(), g = 0, h = 0;g < d;h++) {
      var i = c.substr(g, e), g = g + e;
      this.send_(a, i, f + (g >= d ? "++" : "+") + h)
    }
  }else {
    this.send_(a, c)
  }
};
goog.net.xpc.IframeRelayTransport.prototype.send_ = function(a, b, c) {
  if(goog.userAgent.IE) {
    var d = this.getWindow().document.createElement("div");
    d.innerHTML = '<iframe onload="this.xpcOnload()"></iframe>';
    d = d.childNodes[0];
    d.xpcOnload = goog.net.xpc.IframeRelayTransport.iframeLoadHandler_
  }else {
    d = this.getWindow().document.createElement("iframe");
    goog.userAgent.WEBKIT ? goog.net.xpc.IframeRelayTransport.iframeRefs_.push({timestamp:goog.now(), iframeElement:d}) : goog.events.listen(d, "load", goog.net.xpc.IframeRelayTransport.iframeLoadHandler_)
  }
  var e = d.style;
  e.visibility = "hidden";
  e.width = d.style.height = "0px";
  e.position = "absolute";
  e = this.peerRelayUri_;
  e = e + ("#" + this.channel_.name);
  this.peerIframeId_ && (e = e + ("," + this.peerIframeId_));
  e = e + ("|" + a);
  c && (e = e + ("|" + c));
  e = e + (":" + b);
  d.src = e;
  this.getWindow().document.body.appendChild(d);
  goog.net.xpc.logger.finest("msg sent: " + e)
};
goog.net.xpc.IframeRelayTransport.iframeLoadHandler_ = function() {
  goog.net.xpc.logger.finest("iframe-load");
  goog.dom.removeNode(this);
  this.xpcOnload = null
};
goog.net.xpc.IframeRelayTransport.prototype.disposeInternal = function() {
  goog.net.xpc.IframeRelayTransport.superClass_.disposeInternal.call(this);
  goog.userAgent.WEBKIT && goog.net.xpc.IframeRelayTransport.cleanup_(0)
};
goog.net.xpc.NativeMessagingTransport = function(a, b, c, d, e) {
  goog.net.xpc.Transport.call(this, c);
  this.channel_ = a;
  this.protocolVersion_ = e || 2;
  goog.asserts.assert(1 <= this.protocolVersion_);
  goog.asserts.assert(2 >= this.protocolVersion_);
  this.peerHostname_ = b || "*";
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.maybeAttemptToConnectTimer_ = new goog.Timer(100, this.getWindow());
  this.oneSidedHandshake_ = !!d;
  this.setupAckReceived_ = new goog.async.Deferred;
  this.setupAckSent_ = new goog.async.Deferred;
  this.connected_ = new goog.async.Deferred;
  this.endpointId_ = goog.net.xpc.getRandomString(10);
  this.peerEndpointId_ = null;
  this.oneSidedHandshake_ ? this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.INNER ? this.connected_.awaitDeferred(this.setupAckReceived_) : this.connected_.awaitDeferred(this.setupAckSent_) : (this.connected_.awaitDeferred(this.setupAckReceived_), 2 == this.protocolVersion_ && this.connected_.awaitDeferred(this.setupAckSent_));
  this.connected_.addCallback(this.notifyConnected_, this);
  this.connected_.callback(!0);
  this.eventHandler_.listen(this.maybeAttemptToConnectTimer_, goog.Timer.TICK, this.maybeAttemptToConnect_);
  goog.net.xpc.logger.info("NativeMessagingTransport created.  protocolVersion=" + this.protocolVersion_ + ", oneSidedHandshake=" + this.oneSidedHandshake_ + ", role=" + this.channel_.getRole())
};
goog.inherits(goog.net.xpc.NativeMessagingTransport, goog.net.xpc.Transport);
goog.net.xpc.NativeMessagingTransport.CONNECTION_DELAY_MS_ = 200;
goog.net.xpc.NativeMessagingTransport.prototype.peerProtocolVersion_ = null;
goog.net.xpc.NativeMessagingTransport.prototype.initialized_ = !1;
goog.net.xpc.NativeMessagingTransport.prototype.transportType = goog.net.xpc.TransportTypes.NATIVE_MESSAGING;
goog.net.xpc.NativeMessagingTransport.MESSAGE_DELIMITER_ = ",";
goog.net.xpc.NativeMessagingTransport.activeCount_ = {};
goog.net.xpc.NativeMessagingTransport.sendTimerId_ = 0;
goog.net.xpc.NativeMessagingTransport.prototype.couldPeerVersionBe_ = function(a) {
  return null == this.peerProtocolVersion_ || this.peerProtocolVersion_ == a
};
goog.net.xpc.NativeMessagingTransport.initialize_ = function(a) {
  var b = goog.getUid(a), c = goog.net.xpc.NativeMessagingTransport.activeCount_[b];
  goog.isNumber(c) || (c = 0);
  0 == c && goog.events.listen(a.postMessage ? a : a.document, "message", goog.net.xpc.NativeMessagingTransport.messageReceived_, !1, goog.net.xpc.NativeMessagingTransport);
  goog.net.xpc.NativeMessagingTransport.activeCount_[b] = c + 1
};
goog.net.xpc.NativeMessagingTransport.messageReceived_ = function(a) {
  var b = a.getBrowserEvent().data;
  if(!goog.isString(b)) {
    return!1
  }
  var c = b.indexOf("|"), d = b.indexOf(":");
  if(-1 == c || -1 == d) {
    return!1
  }
  var e = b.substring(0, c), c = b.substring(c + 1, d), b = b.substring(d + 1);
  goog.net.xpc.logger.fine("messageReceived: channel=" + e + ", service=" + c + ", payload=" + b);
  if(d = goog.net.xpc.channels_[e]) {
    return d.deliver_(c, b, a.getBrowserEvent().origin), !0
  }
  var a = goog.net.xpc.NativeMessagingTransport.parseTransportPayload_(b)[0], f;
  for(f in goog.net.xpc.channels_) {
    if(d = goog.net.xpc.channels_[f], d.getRole() == goog.net.xpc.CrossPageChannelRole.INNER && !d.isConnected() && c == goog.net.xpc.TRANSPORT_SERVICE_ && (a == goog.net.xpc.SETUP || a == goog.net.xpc.SETUP_NTPV2)) {
      return goog.net.xpc.logger.fine("changing channel name to " + e), d.name = e, delete goog.net.xpc.channels_[f], goog.net.xpc.channels_[e] = d, d.deliver_(c, b), !0
    }
  }
  goog.net.xpc.logger.info('channel name mismatch; message ignored"');
  return!1
};
goog.net.xpc.NativeMessagingTransport.prototype.transportServiceHandler = function(a) {
  var b = goog.net.xpc.NativeMessagingTransport.parseTransportPayload_(a), a = b[1];
  switch(b[0]) {
    case goog.net.xpc.SETUP_ACK_:
      this.setPeerProtocolVersion_(1);
      this.setupAckReceived_.hasFired() || this.setupAckReceived_.callback(!0);
      break;
    case goog.net.xpc.SETUP_ACK_NTPV2:
      2 == this.protocolVersion_ && (this.setPeerProtocolVersion_(2), this.setupAckReceived_.hasFired() || this.setupAckReceived_.callback(!0));
      break;
    case goog.net.xpc.SETUP:
      this.setPeerProtocolVersion_(1);
      this.sendSetupAckMessage_(1);
      break;
    case goog.net.xpc.SETUP_NTPV2:
      if(2 == this.protocolVersion_) {
        b = this.peerProtocolVersion_;
        this.setPeerProtocolVersion_(2);
        this.sendSetupAckMessage_(2);
        if((1 == b || null != this.peerEndpointId_) && this.peerEndpointId_ != a) {
          goog.net.xpc.logger.info("Sending SETUP and changing peer ID to: " + a), this.sendSetupMessage_()
        }
        this.peerEndpointId_ = a
      }
  }
};
goog.net.xpc.NativeMessagingTransport.prototype.sendSetupMessage_ = function() {
  goog.asserts.assert(!(1 == this.protocolVersion_ && 2 == this.peerProtocolVersion_));
  if(2 == this.protocolVersion_ && this.couldPeerVersionBe_(2)) {
    var a = goog.net.xpc.SETUP_NTPV2, a = a + goog.net.xpc.NativeMessagingTransport.MESSAGE_DELIMITER_, a = a + this.endpointId_;
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, a)
  }
  this.couldPeerVersionBe_(1) && this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP)
};
goog.net.xpc.NativeMessagingTransport.prototype.sendSetupAckMessage_ = function(a) {
  goog.asserts.assert(1 != this.protocolVersion_ || 2 != a, "Shouldn't try to send a v2 setup ack in v1 mode.");
  if(2 == this.protocolVersion_ && this.couldPeerVersionBe_(2) && 2 == a) {
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_NTPV2)
  }else {
    if(this.couldPeerVersionBe_(1) && 1 == a) {
      this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_)
    }else {
      return
    }
  }
  this.setupAckSent_.hasFired() || this.setupAckSent_.callback(!0)
};
goog.net.xpc.NativeMessagingTransport.prototype.setPeerProtocolVersion_ = function(a) {
  a > this.peerProtocolVersion_ && (this.peerProtocolVersion_ = a);
  1 == this.peerProtocolVersion_ && (!this.setupAckSent_.hasFired() && !this.oneSidedHandshake_ && this.setupAckSent_.callback(!0), this.peerEndpointId_ = null)
};
goog.net.xpc.NativeMessagingTransport.prototype.connect = function() {
  goog.net.xpc.NativeMessagingTransport.initialize_(this.getWindow());
  this.initialized_ = !0;
  this.maybeAttemptToConnect_()
};
goog.net.xpc.NativeMessagingTransport.prototype.maybeAttemptToConnect_ = function() {
  var a = this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER;
  this.oneSidedHandshake_ && a || this.channel_.isConnected() || this.isDisposed() ? this.maybeAttemptToConnectTimer_.stop() : (this.maybeAttemptToConnectTimer_.start(), this.sendSetupMessage_())
};
goog.net.xpc.NativeMessagingTransport.prototype.send = function(a, b) {
  var c = this.channel_.peerWindowObject_;
  c ? (this.send = function(a, b) {
    var f = this, g = this.channel_.name;
    this.sendTimerId_ = goog.Timer.callOnce(function() {
      f.sendTimerId_ = 0;
      try {
        var h = c.postMessage ? c : c.document;
        h.postMessage ? (h.postMessage(g + "|" + a + ":" + b, f.peerHostname_), goog.net.xpc.logger.fine("send(): service=" + a + " payload=" + b + " to hostname=" + f.peerHostname_)) : goog.net.xpc.logger.warning("Peer window had no postMessage function.")
      }catch(i) {
        goog.net.xpc.logger.warning("Error performing postMessage, ignoring.", i)
      }
    }, 0)
  }, this.send(a, b)) : goog.net.xpc.logger.fine("send(): window not ready")
};
goog.net.xpc.NativeMessagingTransport.prototype.notifyConnected_ = function() {
  this.channel_.notifyConnected(1 == this.protocolVersion_ || 1 == this.peerProtocolVersion_ ? goog.net.xpc.NativeMessagingTransport.CONNECTION_DELAY_MS_ : void 0)
};
goog.net.xpc.NativeMessagingTransport.prototype.disposeInternal = function() {
  if(this.initialized_) {
    var a = this.getWindow(), b = goog.getUid(a), c = goog.net.xpc.NativeMessagingTransport.activeCount_[b];
    goog.net.xpc.NativeMessagingTransport.activeCount_[b] = c - 1;
    1 == c && goog.events.unlisten(a.postMessage ? a : a.document, "message", goog.net.xpc.NativeMessagingTransport.messageReceived_, !1, goog.net.xpc.NativeMessagingTransport)
  }
  this.sendTimerId_ && (goog.Timer.clear(this.sendTimerId_), this.sendTimerId_ = 0);
  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;
  goog.dispose(this.maybeAttemptToConnectTimer_);
  delete this.maybeAttemptToConnectTimer_;
  this.setupAckReceived_.cancel();
  delete this.setupAckReceived_;
  this.setupAckSent_.cancel();
  delete this.setupAckSent_;
  this.connected_.cancel();
  delete this.connected_;
  delete this.send;
  goog.net.xpc.NativeMessagingTransport.superClass_.disposeInternal.call(this)
};
goog.net.xpc.NativeMessagingTransport.parseTransportPayload_ = function(a) {
  a = a.split(goog.net.xpc.NativeMessagingTransport.MESSAGE_DELIMITER_);
  a[1] = a[1] || null;
  return a
};
goog.net.xpc.NixTransport = function(a, b) {
  goog.net.xpc.Transport.call(this, b);
  this.channel_ = a;
  this.authToken_ = a[goog.net.xpc.CfgFields.AUTH_TOKEN] || "";
  this.remoteAuthToken_ = a[goog.net.xpc.CfgFields.REMOTE_AUTH_TOKEN] || "";
  goog.net.xpc.NixTransport.conductGlobalSetup_(this.getWindow());
  this[goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE] = this.handleMessage_;
  this[goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL] = this.createChannel_
};
goog.inherits(goog.net.xpc.NixTransport, goog.net.xpc.Transport);
goog.net.xpc.NixTransport.NIX_WRAPPER = "GCXPC____NIXVBS_wrapper";
goog.net.xpc.NixTransport.NIX_GET_WRAPPER = "GCXPC____NIXVBS_get_wrapper";
goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE = "GCXPC____NIXJS_handle_message";
goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL = "GCXPC____NIXJS_create_channel";
goog.net.xpc.NixTransport.NIX_ID_FIELD = "GCXPC____NIXVBS_container";
goog.net.xpc.NixTransport.isNixSupported = function() {
  var a = !1;
  try {
    var b = window.opener;
    window.opener = {};
    a = goog.reflect.canAccessProperty(window, "opener");
    window.opener = b
  }catch(c) {
  }
  return a
};
goog.net.xpc.NixTransport.conductGlobalSetup_ = function(a) {
  if(!a.nix_setup_complete) {
    var b = "Class " + goog.net.xpc.NixTransport.NIX_WRAPPER + "\n Private m_Transport\nPrivate m_Auth\nPublic Sub SetTransport(transport)\nIf isEmpty(m_Transport) Then\nSet m_Transport = transport\nEnd If\nEnd Sub\nPublic Sub SetAuth(auth)\nIf isEmpty(m_Auth) Then\nm_Auth = auth\nEnd If\nEnd Sub\nPublic Function GetAuthToken()\n GetAuthToken = m_Auth\nEnd Function\nPublic Sub SendMessage(service, payload)\n Call m_Transport." + goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE + "(service, payload)\nEnd Sub\nPublic Sub CreateChannel(channel)\n Call m_Transport." + 
    goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL + "(channel)\nEnd Sub\nPublic Sub " + goog.net.xpc.NixTransport.NIX_ID_FIELD + "()\n End Sub\nEnd Class\n Function " + goog.net.xpc.NixTransport.NIX_GET_WRAPPER + "(transport, auth)\nDim wrap\nSet wrap = New " + goog.net.xpc.NixTransport.NIX_WRAPPER + "\nwrap.SetTransport transport\nwrap.SetAuth auth\nSet " + goog.net.xpc.NixTransport.NIX_GET_WRAPPER + " = wrap\nEnd Function";
    try {
      a.execScript(b, "vbscript"), a.nix_setup_complete = !0
    }catch(c) {
      goog.net.xpc.logger.severe("exception caught while attempting global setup: " + c)
    }
  }
};
goog.net.xpc.NixTransport.prototype.transportType = goog.net.xpc.TransportTypes.NIX;
goog.net.xpc.NixTransport.prototype.localSetupCompleted_ = !1;
goog.net.xpc.NixTransport.prototype.nixChannel_ = null;
goog.net.xpc.NixTransport.prototype.connect = function() {
  this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER ? this.attemptOuterSetup_() : this.attemptInnerSetup_()
};
goog.net.xpc.NixTransport.prototype.attemptOuterSetup_ = function() {
  if(!this.localSetupCompleted_) {
    var a = this.channel_.iframeElement_;
    try {
      a.contentWindow.opener = this.getWindow()[goog.net.xpc.NixTransport.NIX_GET_WRAPPER](this, this.authToken_), this.localSetupCompleted_ = !0
    }catch(b) {
      goog.net.xpc.logger.severe("exception caught while attempting setup: " + b)
    }
    this.localSetupCompleted_ || this.getWindow().setTimeout(goog.bind(this.attemptOuterSetup_, this), 100)
  }
};
goog.net.xpc.NixTransport.prototype.attemptInnerSetup_ = function() {
  if(!this.localSetupCompleted_) {
    try {
      var a = this.getWindow().opener;
      if(a && goog.net.xpc.NixTransport.NIX_ID_FIELD in a) {
        this.nixChannel_ = a;
        if(this.nixChannel_.GetAuthToken() != this.remoteAuthToken_) {
          goog.net.xpc.logger.severe("Invalid auth token from other party");
          return
        }
        this.nixChannel_.CreateChannel(this.getWindow()[goog.net.xpc.NixTransport.NIX_GET_WRAPPER](this, this.authToken_));
        this.localSetupCompleted_ = !0;
        this.channel_.notifyConnected()
      }
    }catch(b) {
      goog.net.xpc.logger.severe("exception caught while attempting setup: " + b);
      return
    }
    this.localSetupCompleted_ || this.getWindow().setTimeout(goog.bind(this.attemptInnerSetup_, this), 100)
  }
};
goog.net.xpc.NixTransport.prototype.createChannel_ = function(a) {
  ("unknown" != typeof a || !(goog.net.xpc.NixTransport.NIX_ID_FIELD in a)) && goog.net.xpc.logger.severe("Invalid NIX channel given to createChannel_");
  this.nixChannel_ = a;
  this.nixChannel_.GetAuthToken() != this.remoteAuthToken_ ? goog.net.xpc.logger.severe("Invalid auth token from other party") : this.channel_.notifyConnected()
};
goog.net.xpc.NixTransport.prototype.handleMessage_ = function(a, b) {
  this.getWindow().setTimeout(goog.bind(function() {
    this.channel_.safeDeliver(a, b)
  }, this), 1)
};
goog.net.xpc.NixTransport.prototype.send = function(a, b) {
  "unknown" !== typeof this.nixChannel_ && goog.net.xpc.logger.severe("NIX channel not connected");
  this.nixChannel_.SendMessage(a, b)
};
goog.net.xpc.NixTransport.prototype.disposeInternal = function() {
  goog.net.xpc.NixTransport.superClass_.disposeInternal.call(this);
  this.nixChannel_ = null
};
goog.net.xpc.CrossPageChannel = function(a, b) {
  goog.messaging.AbstractChannel.call(this);
  for(var c = 0, d;d = goog.net.xpc.UriCfgFields[c];c++) {
    if(d in a && !/^https?:\/\//.test(a[d])) {
      throw Error("URI " + a[d] + " is invalid for field " + d);
    }
  }
  this.cfg_ = a;
  this.name = this.cfg_[goog.net.xpc.CfgFields.CHANNEL_NAME] || goog.net.xpc.getRandomString(10);
  this.domHelper_ = b || goog.dom.getDomHelper();
  this.deferredDeliveries_ = [];
  this.peerLoadHandler_ = new goog.events.EventHandler(this);
  a[goog.net.xpc.CfgFields.LOCAL_POLL_URI] = a[goog.net.xpc.CfgFields.LOCAL_POLL_URI] || goog.uri.utils.getHost(this.domHelper_.getWindow().location.href) + "/robots.txt";
  a[goog.net.xpc.CfgFields.PEER_POLL_URI] = a[goog.net.xpc.CfgFields.PEER_POLL_URI] || goog.uri.utils.getHost(a[goog.net.xpc.CfgFields.PEER_URI] || "") + "/robots.txt";
  goog.net.xpc.channels_[this.name] = this;
  goog.events.listen(window, "unload", goog.net.xpc.CrossPageChannel.disposeAll_);
  goog.net.xpc.logger.info("CrossPageChannel created: " + this.name)
};
goog.inherits(goog.net.xpc.CrossPageChannel, goog.messaging.AbstractChannel);
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_ = RegExp("^%*" + goog.net.xpc.TRANSPORT_SERVICE_ + "$");
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_ = RegExp("^%+" + goog.net.xpc.TRANSPORT_SERVICE_ + "$");
goog.net.xpc.CrossPageChannel.prototype.connectionDelay_ = null;
goog.net.xpc.CrossPageChannel.prototype.peerWindowDeferred_ = null;
goog.net.xpc.CrossPageChannel.prototype.transport_ = null;
goog.net.xpc.CrossPageChannel.prototype.state_ = goog.net.xpc.ChannelStates.NOT_CONNECTED;
goog.net.xpc.CrossPageChannel.prototype.isConnected = function() {
  return this.state_ == goog.net.xpc.ChannelStates.CONNECTED
};
goog.net.xpc.CrossPageChannel.prototype.peerWindowObject_ = null;
goog.net.xpc.CrossPageChannel.prototype.iframeElement_ = null;
goog.net.xpc.CrossPageChannel.prototype.setPeerWindowObject = function(a) {
  this.peerWindowObject_ = a
};
goog.net.xpc.CrossPageChannel.prototype.getPeerWindowObject = function() {
  return this.peerWindowObject_
};
goog.net.xpc.CrossPageChannel.prototype.isPeerAvailable = function() {
  try {
    return!!this.peerWindowObject_ && !Boolean(this.peerWindowObject_.closed)
  }catch(a) {
    return!1
  }
};
goog.net.xpc.CrossPageChannel.prototype.determineTransportType_ = function() {
  return goog.isFunction(document.postMessage) || goog.isFunction(window.postMessage) || goog.userAgent.IE && window.postMessage ? goog.net.xpc.TransportTypes.NATIVE_MESSAGING : goog.userAgent.GECKO ? goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD : goog.userAgent.IE && this.cfg_[goog.net.xpc.CfgFields.PEER_RELAY_URI] ? goog.net.xpc.TransportTypes.IFRAME_RELAY : goog.userAgent.IE && goog.net.xpc.NixTransport.isNixSupported() ? goog.net.xpc.TransportTypes.NIX : goog.net.xpc.TransportTypes.IFRAME_POLLING
};
goog.net.xpc.CrossPageChannel.prototype.createTransport_ = function() {
  if(!this.transport_) {
    this.cfg_[goog.net.xpc.CfgFields.TRANSPORT] || (this.cfg_[goog.net.xpc.CfgFields.TRANSPORT] = this.determineTransportType_());
    switch(this.cfg_[goog.net.xpc.CfgFields.TRANSPORT]) {
      case goog.net.xpc.TransportTypes.NATIVE_MESSAGING:
        this.transport_ = new goog.net.xpc.NativeMessagingTransport(this, this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME], this.domHelper_, !!this.cfg_[goog.net.xpc.CfgFields.ONE_SIDED_HANDSHAKE], this.cfg_[goog.net.xpc.CfgFields.NATIVE_TRANSPORT_PROTOCOL_VERSION] || 2);
        break;
      case goog.net.xpc.TransportTypes.NIX:
        this.transport_ = new goog.net.xpc.NixTransport(this, this.domHelper_);
        break;
      case goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD:
        this.transport_ = new goog.net.xpc.FrameElementMethodTransport(this, this.domHelper_);
        break;
      case goog.net.xpc.TransportTypes.IFRAME_RELAY:
        this.transport_ = new goog.net.xpc.IframeRelayTransport(this, this.domHelper_);
        break;
      case goog.net.xpc.TransportTypes.IFRAME_POLLING:
        this.transport_ = new goog.net.xpc.IframePollingTransport(this, this.domHelper_)
    }
    if(this.transport_) {
      goog.net.xpc.logger.info("Transport created: " + this.transport_.getName())
    }else {
      throw Error("CrossPageChannel: No suitable transport found!");
    }
  }
};
goog.net.xpc.CrossPageChannel.prototype.getTransportType = function() {
  return this.transport_.getType()
};
goog.net.xpc.CrossPageChannel.prototype.getTransportName = function() {
  return this.transport_.getName()
};
goog.net.xpc.CrossPageChannel.prototype.getPeerConfiguration = function() {
  var a = {};
  a[goog.net.xpc.CfgFields.CHANNEL_NAME] = this.name;
  a[goog.net.xpc.CfgFields.TRANSPORT] = this.cfg_[goog.net.xpc.CfgFields.TRANSPORT];
  a[goog.net.xpc.CfgFields.ONE_SIDED_HANDSHAKE] = this.cfg_[goog.net.xpc.CfgFields.ONE_SIDED_HANDSHAKE];
  this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI] && (a[goog.net.xpc.CfgFields.PEER_RELAY_URI] = this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI]);
  this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI] && (a[goog.net.xpc.CfgFields.PEER_POLL_URI] = this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI]);
  this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI] && (a[goog.net.xpc.CfgFields.LOCAL_POLL_URI] = this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI]);
  var b = this.cfg_[goog.net.xpc.CfgFields.ROLE];
  b && (a[goog.net.xpc.CfgFields.ROLE] = b == goog.net.xpc.CrossPageChannelRole.INNER ? goog.net.xpc.CrossPageChannelRole.OUTER : goog.net.xpc.CrossPageChannelRole.INNER);
  return a
};
goog.net.xpc.CrossPageChannel.prototype.createPeerIframe = function(a, b, c) {
  goog.net.xpc.logger.info("createPeerIframe()");
  var d = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID];
  d || (d = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID] = "xpcpeer" + goog.net.xpc.getRandomString(4));
  var e = goog.dom.getDomHelper(a).createElement("IFRAME");
  e.id = e.name = d;
  b ? b(e) : e.style.width = e.style.height = "100%";
  this.cleanUpIncompleteConnection_();
  this.peerWindowDeferred_ = new goog.async.Deferred(void 0, this);
  var f = this.getPeerUri(c);
  this.peerLoadHandler_.listenOnce(e, "load", this.peerWindowDeferred_.callback, !1, this.peerWindowDeferred_);
  goog.userAgent.GECKO || goog.userAgent.WEBKIT ? window.setTimeout(goog.bind(function() {
    a.appendChild(e);
    e.src = f.toString();
    goog.net.xpc.logger.info("peer iframe created (" + d + ")")
  }, this), 1) : (e.src = f.toString(), a.appendChild(e), goog.net.xpc.logger.info("peer iframe created (" + d + ")"));
  return e
};
goog.net.xpc.CrossPageChannel.prototype.cleanUpIncompleteConnection_ = function() {
  this.peerWindowDeferred_ && (this.peerWindowDeferred_.cancel(), this.peerWindowDeferred_ = null);
  this.deferredDeliveries_.length = 0;
  this.peerLoadHandler_.removeAll()
};
goog.net.xpc.CrossPageChannel.prototype.getPeerUri = function(a) {
  var b = this.cfg_[goog.net.xpc.CfgFields.PEER_URI];
  goog.isString(b) && (b = this.cfg_[goog.net.xpc.CfgFields.PEER_URI] = new goog.Uri(b));
  !1 !== a && b.setParameterValue("xpc", goog.json.serialize(this.getPeerConfiguration()));
  return b
};
goog.net.xpc.CrossPageChannel.prototype.connect = function(a) {
  this.connectCb_ = a || goog.nullFunction;
  this.peerWindowDeferred_ ? this.peerWindowDeferred_.addCallback(this.continueConnection_) : this.continueConnection_()
};
goog.net.xpc.CrossPageChannel.prototype.continueConnection_ = function() {
  goog.net.xpc.logger.info("continueConnection_()");
  this.peerWindowDeferred_ = null;
  this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID] && (this.iframeElement_ = this.domHelper_.getElement(this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]));
  if(this.iframeElement_) {
    var a = this.iframeElement_.contentWindow;
    a || (a = window.frames[this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]]);
    this.setPeerWindowObject(a)
  }
  if(!this.peerWindowObject_) {
    if(window == window.top) {
      throw Error("CrossPageChannel: Can't connect, peer window-object not set.");
    }
    this.setPeerWindowObject(window.parent)
  }
  this.createTransport_();
  for(this.transport_.connect();0 < this.deferredDeliveries_.length;) {
    this.deferredDeliveries_.shift()()
  }
};
goog.net.xpc.CrossPageChannel.prototype.close = function() {
  this.cleanUpIncompleteConnection_();
  this.state_ = goog.net.xpc.ChannelStates.CLOSED;
  goog.dispose(this.transport_);
  this.connectCb_ = this.transport_ = null;
  goog.dispose(this.connectionDelay_);
  this.connectionDelay_ = null;
  goog.net.xpc.logger.info('Channel "' + this.name + '" closed')
};
goog.net.xpc.CrossPageChannel.prototype.notifyConnected = function(a) {
  this.isConnected() || this.connectionDelay_ && this.connectionDelay_.isActive() || (this.state_ = goog.net.xpc.ChannelStates.CONNECTED, goog.net.xpc.logger.info('Channel "' + this.name + '" connected'), goog.dispose(this.connectionDelay_), a ? (this.connectionDelay_ = new goog.async.Delay(this.connectCb_, a), this.connectionDelay_.start()) : (this.connectionDelay_ = null, this.connectCb_()))
};
goog.net.xpc.CrossPageChannel.prototype.notifyConnected_ = goog.net.xpc.CrossPageChannel.prototype.notifyConnected;
goog.net.xpc.CrossPageChannel.prototype.notifyTransportError_ = function() {
  goog.net.xpc.logger.info("Transport Error");
  this.close()
};
goog.net.xpc.CrossPageChannel.prototype.send = function(a, b) {
  this.isConnected() ? this.isPeerAvailable() ? (goog.isObject(b) && (b = goog.json.serialize(b)), this.transport_.send(this.escapeServiceName_(a), b)) : (goog.net.xpc.logger.severe("Peer has disappeared."), this.close()) : goog.net.xpc.logger.severe("Can't send. Channel not connected.")
};
goog.net.xpc.CrossPageChannel.prototype.safeDeliver = function(a, b, c) {
  this.deliver_(a, b, c)
};
goog.net.xpc.CrossPageChannel.prototype.deliver_ = function(a, b, c) {
  this.peerWindowDeferred_ ? this.deferredDeliveries_.push(goog.bind(this.deliver_, this, a, b, c)) : this.isMessageOriginAcceptable_(c) ? this.isDisposed() ? goog.net.xpc.logger.warning("CrossPageChannel::deliver_(): Disposed.") : !a || a == goog.net.xpc.TRANSPORT_SERVICE_ ? this.transport_.transportServiceHandler(b) : this.isConnected() ? this.deliver(this.unescapeServiceName_(a), b) : goog.net.xpc.logger.info("CrossPageChannel::deliver_(): Not connected.") : goog.net.xpc.logger.warning('Message received from unapproved origin "' + 
  c + '" - rejected.')
};
goog.net.xpc.CrossPageChannel.prototype.escapeServiceName_ = function(a) {
  goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_.test(a) && (a = "%" + a);
  return a.replace(/[%:|]/g, encodeURIComponent)
};
goog.net.xpc.CrossPageChannel.prototype.unescapeServiceName_ = function(a) {
  a = a.replace(/%[0-9a-f]{2}/gi, decodeURIComponent);
  return goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_.test(a) ? a.substring(1) : a
};
goog.net.xpc.CrossPageChannel.prototype.getRole = function() {
  var a = this.cfg_[goog.net.xpc.CfgFields.ROLE];
  return a ? a : window.parent == this.peerWindowObject_ ? goog.net.xpc.CrossPageChannelRole.INNER : goog.net.xpc.CrossPageChannelRole.OUTER
};
goog.net.xpc.CrossPageChannel.prototype.isMessageOriginAcceptable_ = function(a) {
  var b = this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME];
  return goog.string.isEmptySafe(a) || goog.string.isEmptySafe(b) || a == this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME]
};
goog.net.xpc.CrossPageChannel.prototype.disposeInternal = function() {
  this.close();
  this.iframeElement_ = this.peerWindowObject_ = null;
  delete goog.net.xpc.channels_[this.name];
  goog.dispose(this.peerLoadHandler_);
  delete this.peerLoadHandler_;
  goog.net.xpc.CrossPageChannel.superClass_.disposeInternal.call(this)
};
goog.net.xpc.CrossPageChannel.disposeAll_ = function() {
  for(var a in goog.net.xpc.channels_) {
    goog.dispose(goog.net.xpc.channels_[a])
  }
};
commentum.views = {};
commentum.views.Page = function(a) {
  this.page_id = a;
  this.blocks = {};
  this.id = function() {
    return"page" + this.page_id
  };
  this.comments_id = function() {
    return this.id() + "_content"
  };
  this.show_comments_id = function() {
    return this.id() + "_show_comments"
  };
  this.show = function() {
    var a = this, c = soy.renderAsFragment(commentum.templates.Page, {page:{panelId:this.id(), commentsId:this.comments_id(), commentsShowId:this.show_comments_id()}});
    goog.dom.appendChild(document.body, c);
    c = goog.dom.getElement(this.show_comments_id());
    goog.events.listen(c, goog.events.EventType.CLICK, function() {
      if(a.page_comments && a.page_comments.visible()) {
        commentum.views.events.on_page_comments_hide()
      }else {
        commentum.views.events.on_page_comments_show()
      }
    })
  };
  this.hide = function() {
    goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  }
};
commentum.views.Block = function(a, b) {
  this.page = a;
  this.block_id = b.id;
  this.block_text = b.text;
  this.block_comment_count = b.comment_count;
  this.id = function() {
    return this.page.id() + "_block" + this.block_id
  };
  this.hint_id = function() {
    return this.id() + "_hint"
  };
  this.hint_span_id = function() {
    return this.id() + "_hint_span"
  };
  this.comment_count_id = function() {
    return this.id() + "_comment_count"
  };
  this.show = function() {
    if(!this.visible()) {
      var a = this;
      goog.dom.annotate.annotateTerms(document.body, [[this.block_text, !1]], function(b, d) {
        return goog.dom.getElement(a.id()) ? d : commentum.templates.Block({block:{id:a.id(), hintId:a.hint_id(), hintSpanId:a.hint_span_id(), content:d, commentCountId:a.comment_count_id(), commentCount:a.block_comment_count}, strings:commentum.strings})
      });
      var b = goog.dom.getElement(this.id());
      if(!b) {
        return!1
      }
      goog.events.listen(b, goog.events.EventType.MOUSEOVER, commentum.utils.bind(this.show_highlight, this));
      goog.events.listen(b, goog.events.EventType.MOUSEOUT, commentum.utils.bind(this.hide_highlight, this));
      goog.events.listen(b, goog.events.EventType.CLICK, function() {
        if(a.block_comments && a.block_comments.visible()) {
          commentum.views.events.on_block_comments_hide(a.block_id)
        }else {
          commentum.views.events.on_block_comments_show(a.block_id)
        }
      })
    }
    this.page.blocks[this.block_id] = this
  };
  this.hide = function() {
    delete this.page.blocks[this.block_id];
    if(this.visible()) {
      var a = goog.dom.getElement(this.id()), b = goog.dom.getParentElement(a);
      goog.dom.flattenElement(a);
      b.normalize();
      goog.dom.removeNode(goog.dom.getElement(this.hint_span_id()))
    }
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  };
  this.show_highlight = function() {
    var a = goog.dom.getElement(this.id()), b = goog.dom.getElement(this.hint_span_id());
    goog.dom.classes.add(a, "block_info_selected");
    goog.dom.classes.add(b, "block_info_hint_selected")
  };
  this.hide_highlight = function() {
    if(!this.block_comments || !this.block_comments.visible()) {
      var a = goog.dom.getElement(this.id()), b = goog.dom.getElement(this.hint_span_id());
      goog.dom.classes.remove(a, "block_info_selected");
      goog.dom.classes.remove(b, "block_info_hint_selected")
    }
  };
  this.update = function() {
    var a = goog.dom.getElement(this.comment_count_id()), b = soy.renderAsElement(commentum.templates.BlockCommentCount, {block:{commentCountId:this.comment_count_id(), commentCount:this.block_comment_count}, strings:commentum.strings});
    goog.dom.replaceNode(b, a)
  }
};
commentum.views.BlockComments = function(a) {
  this.block = a;
  this.comments = {};
  this.id = function() {
    return this.block.id() + "_comments"
  };
  this.comments_id = function() {
    return this.id() + "_entries"
  };
  this.comments_post_id = function() {
    return this.id() + "_post"
  };
  this.show = function() {
    var a = goog.dom.getElement(this.block.id()), c = soy.renderAsFragment(commentum.templates.BlockComments, {block_comments:{id:this.id(), commentsId:this.comments_id(), commentsPostId:this.comments_post_id()}});
    goog.dom.insertSiblingBefore(c, a);
    goog.events.listen(c, [goog.events.EventType.MOUSEDOWN, goog.events.EventType.MOUSEUP], function(a) {
      a.stopPropagation()
    });
    this.block.block_comments = this;
    this.block.show_highlight()
  };
  this.hide = function() {
    delete this.block.block_comments;
    goog.dom.removeNode(goog.dom.getElement(this.id()));
    this.block.hide_highlight()
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  }
};
commentum.views.PageComments = function(a) {
  this.page = a;
  this.comments = {};
  this.id = function() {
    return a.id() + "_comments"
  };
  this.comments_id = function() {
    return this.id() + "_entries"
  };
  this.comments_post_id = function() {
    return this.id() + "_post"
  };
  this.show = function() {
    var a = goog.dom.getElement(this.page.comments_id()), c = soy.renderAsFragment(commentum.templates.PageComments, {page_comments:{id:this.id(), commentsId:this.comments_id(), commentsPostId:this.comments_post_id()}});
    goog.dom.appendChild(a, c);
    goog.events.listen(c, [goog.events.EventType.MOUSEDOWN, goog.events.EventType.MOUSEUP], function(a) {
      a.stopPropagation()
    });
    this.page.page_comments = this
  };
  this.hide = function() {
    delete this.page.page_comments;
    goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  }
};
commentum.views.Comment = function(a, b) {
  this.object_comments = a;
  this.comment = b;
  this.id = function() {
    return this.object_comments.id() + "_comment" + this.comment.id
  };
  this.key = function() {
    return this.comment.date
  };
  this.show = function() {
    var a = goog.dom.getElement(this.object_comments.comments_id()), b = soy.renderAsFragment(commentum.templates.Comment, {comment:{id:this.comment.id, date:this.format_date(this.comment.date), text:this.comment.text, author:{id:this.comment.author.id, username:this.comment.author.username}}}), e = this.key(), f = goog.array.find(this.object_comments.comments, function(a) {
      return a.key() > e
    });
    f ? (a = goog.dom.getElement(f.id()), goog.dom.insertSiblingBefore(b, a)) : goog.dom.appendChild(a, b);
    this.object_comments.comments[this.comment.id] = this
  };
  this.hide = function() {
    delete this.object_comments.comments[this.comment.id];
    goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  };
  this.format_date = function(a) {
    a = new goog.date.DateTime(new Date(1E3 * a));
    return goog.getMsg("{$day} {$month} {$year} {$at} {$hour}:{$minute}", {day:goog.string.padNumber(a.getDate(), 2), month:"\u044f\u043d\u0432\u0430\u0440\u044f \u0444\u0435\u0432\u0440\u0430\u043b\u044f \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440\u0435\u043b\u044f \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433\u0443\u0441\u0442\u0430 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f \u043e\u043a\u0442\u044f\u0431\u0440\u044f \u043d\u043e\u044f\u0431\u0440\u044f \u0434\u0435\u043a\u0430\u0431\u0440\u044f".split(" ")[a.getMonth()], 
    year:goog.string.padNumber(a.getYear() % 100, 2), at:"\u0432", hour:goog.string.padNumber(a.getHours(), 2), minute:goog.string.padNumber(a.getMinutes(), 2)})
  }
};
commentum.views.BlockComment = function(a, b) {
  commentum.views.Comment.call(this, a, b)
};
commentum.views.PageComment = function(a, b) {
  commentum.views.Comment.call(this, a, b)
};
commentum.views.CommentPostForm = function(a, b) {
  this.object_comments = a;
  this.on_comment_post = b;
  this.id = function() {
    return this.object_comments.id() + "_comment_post"
  };
  this.text_id = function() {
    return this.id() + "_text"
  };
  this.submit_id = function() {
    return this.id() + "_submit"
  };
  this.show = function() {
    var a = goog.dom.getElement(this.object_comments.comments_post_id()), b = soy.renderAsFragment(commentum.templates.CommentPost, {comment_post:{id:this.id(), textId:this.text_id(), submitId:this.submit_id()}, strings:commentum.strings});
    goog.dom.appendChild(a, b);
    var a = goog.dom.getElement(this.submit_id()), e = this;
    goog.events.listen(a, goog.events.EventType.CLICK, function() {
      var a = goog.dom.getElement(e.text_id());
      e.on_comment_post({text:a.value}, function() {
        a.value = ""
      })
    })
  };
  this.hide = function() {
    delete this.object_comments.comment_post;
    return goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  }
};
commentum.views.CommentPostAuth = function(a, b) {
  this.object_comments = a;
  this.on_comment_post_update = b;
  this.id = function() {
    return this.object_comments.id() + "_comment_post"
  };
  this.login_id = function() {
    return this.id() + "_login"
  };
  this.password_id = function() {
    return this.id() + "_password"
  };
  this.signin_id = function() {
    return this.id() + "_signin"
  };
  this.signup_id = function() {
    return this.id() + "_signup"
  };
  this.login_service_id = function() {
    return this.id() + "_service_"
  };
  this.show = function() {
    var a = goog.dom.getElement(this.object_comments.comments_post_id()), b = ["facebook", "twitter", "google", "vkontakte"], e = soy.renderAsFragment(commentum.templates.CommentPostAuth, {comment_post:{id:this.id(), signInId:this.signin_id(), signUpId:this.signup_id(), loginId:this.login_id(), passwordId:this.password_id(), loginServiceId:this.login_service_id(), loginServices:b}, strings:commentum.strings});
    goog.dom.appendChild(a, e);
    var f = this, a = goog.dom.getElement(this.signin_id());
    goog.events.listen(a, goog.events.EventType.CLICK, function() {
      var a = goog.dom.getElement(f.login_id()), b = goog.dom.getElement(f.password_id());
      commentum.views.events.on_user_login(a.value, b.value, f.on_comment_post_update)
    });
    a = goog.dom.getElement(this.signup_id());
    goog.events.listen(a, goog.events.EventType.CLICK, function() {
      var a = goog.dom.getElement(f.login_id()), b = goog.dom.getElement(f.password_id());
      commentum.views.events.on_user_register(a.value, b.value, f.on_comment_post_update)
    });
    commentum.utils.foreach(b, function(a) {
      var b = goog.dom.getElement(f.login_service_id() + a);
      goog.events.listen(b, goog.events.EventType.CLICK, function() {
        commentum.views.events.on_user_login_service(a, f.on_comment_post_update)
      })
    });
    this.object_comments.comment_post = this
  };
  this.hide = function() {
    delete this.object_comments.comment_post;
    return goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  }
};
commentum.views.CommentPostFrame = function(a, b) {
  this.object_comments = a;
  this.on_comment_post = b;
  this.id = function() {
    return this.object_comments.id() + "_comment_post"
  };
  this.frame_id = function() {
    return this.id() + "_frame"
  };
  this.splash_id = function() {
    return this.id() + "_splash"
  };
  this.frame_init = function(a) {
    goog.dom.classes.add(a, "comment_post_frame");
    goog.dom.classes.add(a, "comment_width");
    a.frameBorder = "0";
    a.scrolling = "no"
  };
  this.FrameObject = function(a, b, e) {
    this.view = a;
    this.frame = b;
    this.send = function(a, b, c) {
      this.channel && this.close();
      var d = {};
      d[goog.net.xpc.CfgFields.PEER_URI] = b;
      d[goog.net.xpc.CfgFields.IFRAME_ID] = this.view.frame_id();
      var j = new goog.net.xpc.CrossPageChannel(d);
      commentum.utils.foreach(e, function(a, b) {
        j.registerService(a, function(a) {
          b(goog.json.parse(a))
        })
      });
      j.registerService(a, function(a) {
        c(goog.json.parse(a))
      });
      j.createPeerIframe(this.frame, commentum.utils.bind(this.view.frame_init, this.view));
      j.connect();
      this.channel = j
    };
    this.close = function() {
      this.channel && this.channel.close();
      delete this.channel
    }
  };
  this.show = function() {
    var a = goog.dom.getElement(this.object_comments.comments_post_id()), b = soy.renderAsFragment(commentum.templates.CommentPostFrame, {comment_post:{id:this.id(), splashId:this.splash_id()}});
    goog.dom.appendChild(a, b);
    var e = this;
    this.frame_object = new this.FrameObject(this, b, {set_height:function(a) {
      var b = goog.dom.getElement(e.frame_id());
      goog.style.setHeight(b, a.height);
      a = goog.dom.getElement(e.splash_id());
      goog.style.showElement(a, !1)
    }});
    this.object_comments.comment_post = this;
    this.on_comment_post(this.frame_object)
  };
  this.hide = function() {
    delete this.object_comments.comment_post;
    this.frame_object && (this.frame_object.close(), delete this.frame_object);
    return goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  }
};
commentum.views.CommentPost = function(a, b, c, d) {
  this.object_comments = a;
  this.on_comment_post = d;
  this.id = function() {
    return this.comment_post.id()
  };
  this.on_comment_post_update = function(a, b) {
    this.hide();
    this.update(a, b);
    this.show()
  };
  this.show = function() {
    this.comment_post && this.comment_post.show()
  };
  this.hide = function() {
    this.comment_post && this.comment_post.hide()
  };
  this.visible = function() {
    return this.comment_post && this.comment_post.visible()
  };
  this.update = function(a, b) {
    if(a != this.post || b != this.auth) {
      this.post = a, this.auth = b, delete this.comment_post, this.comment_post = this.post ? this.auth ? new commentum.views.CommentPostForm(this.object_comments, commentum.utils.bind(this.on_comment_post, this)) : new commentum.views.CommentPostAuth(this.object_comments, commentum.utils.bind(this.on_comment_post_update, this)) : new commentum.views.CommentPostFrame(this.object_comments, commentum.utils.bind(this.on_comment_post, this))
    }
  };
  this.update(b, c)
};
commentum.views.BlockCommentPost = function(a, b, c) {
  commentum.views.CommentPost.call(this, a, b, c, function(a, b) {
    commentum.views.events.on_page_block_comment_add(this.object_comments.block.block_id, a, b)
  })
};
commentum.views.PageCommentPost = function(a, b, c) {
  commentum.views.CommentPost.call(this, a, b, c, function(a, b) {
    commentum.views.events.on_page_comment_add(a, b)
  })
};
commentum.views.BlockMarker = function(a) {
  this.page = a;
  this.id = function() {
    return this.page.id() + "_marker"
  };
  this.hint_id = function() {
    return this.id() + "_hint"
  };
  this.show = function() {
    var a = this, c = function() {
      var c = goog.dom.getElement(a.id());
      if(c) {
        var e = goog.dom.getParentElement(c);
        goog.dom.removeNode(c);
        e.normalize()
      }
    };
    this.event_key_clear = goog.events.listen(document, [goog.events.EventType.MOUSEDOWN, goog.events.EventType.MOUSEUP], c);
    this.event_key = goog.events.listen(document, goog.events.EventType.MOUSEUP, function() {
      var d = goog.dom.Range.createFromWindow(), e = d.getText(), f = !1;
      commentum.utils.foreach(a.page.blocks, function(a, b) {
        var c = goog.dom.getElement(b.id());
        f = f || d.containsNode(c, !0)
      }, !0);
      if(e && !f) {
        a.text = e;
        e = soy.renderAsElement(commentum.templates.BlockMarker, {block_marker:{id:a.id(), hintId:a.hint_id()}, strings:commentum.strings});
        goog.events.listen(e, goog.events.EventType.MOUSEUP, function(a) {
          a.stopPropagation()
        });
        goog.events.listen(e, goog.events.EventType.MOUSEDOWN, function(a) {
          a.stopPropagation()
        });
        goog.events.listen(e, goog.events.EventType.CLICK, function() {
          a.text && (commentum.views.events.on_block_add(a.text), c())
        });
        d.insertNode(e, !1);
        for(var e = [], g = goog.dom.getParentElement(d.getStartNode());g && (!g.tagName || "html" != g.tagName.toLowerCase());) {
          for(var h = goog.dom.getParentElement(g), i = 0, j = goog.dom.getChildren(h), k = 0;k < j.length;++k) {
            j[k] == g && (i = k)
          }
          e.push({id:g.id || null, tag:g.tagName || null, index:i || null});
          g = h
        }
        a.info = {path:e, offset:d.getStartOffset(), text:d.getText()}
      }
    });
    this.page.block_marker = this
  };
  this.hide = function() {
    delete this.page.block_marker;
    goog.dom.removeNode(goog.dom.getElement(this.id()));
    this.event_key && (goog.events.unlistenByKey(this.event_key), delete this.event_key);
    this.event_key_clear && (goog.events.unlistenByKey(this.event_key_clear), delete this.event_key_clear)
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  }
};
commentum.views.FrameBlockComments = function(a) {
  this.block_id = a;
  this.block = {block_id:a};
  this.id = function() {
    return"block_comments"
  };
  this.comments_post_id = function() {
    return this.id() + "_comments_post"
  };
  this.show = function() {
    var a = soy.renderAsFragment(commentum.templates.FrameBlockComments, {block_comments:{id:this.id(), commentsPostId:this.comments_post_id()}});
    goog.dom.appendChild(document.body, a)
  };
  this.hide = function() {
    goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  };
  this.height = function() {
    var a = goog.dom.getElement(this.id());
    return a && a.scrollHeight
  }
};
commentum.views.FramePageComments = function() {
  this.id = function() {
    return"page_comments"
  };
  this.comments_post_id = function() {
    return this.id() + "_comments_post"
  };
  this.show = function() {
    var a = soy.renderAsFragment(commentum.templates.FramePageComments, {page_comments:{id:this.id(), commentsPostId:this.comments_post_id()}});
    goog.dom.appendChild(document.body, a)
  };
  this.hide = function() {
    goog.dom.removeNode(goog.dom.getElement(this.id()))
  };
  this.visible = function() {
    return null != goog.dom.getElement(this.id())
  };
  this.height = function() {
    var a = goog.dom.getElement(this.id());
    return a && a.scrollHeight
  }
};
commentum.frame_events = {};
commentum.views.events = commentum.frame_events;
commentum.actions.hooks.push(function(a) {
  commentum.frame_events.on_data(a)
});
commentum.frame_events.on_data_start = function(a) {
  var b = (new goog.Uri(window.location.href)).getParameterValue("xpc");
  if(b) {
    var b = goog.json.parse(b), c = new goog.net.xpc.CrossPageChannel(b);
    c.connect(function() {
      commentum.frame_events.channel = c;
      a && a()
    })
  }else {
    a && a()
  }
};
commentum.frame_events.on_data_stop = function() {
  commentum.frame_events.channel && (commentum.frame_events.channel.close(), delete commentum.frame_events.channel)
};
commentum.frame_events.on_data = function(a) {
  var b = a.action, a = goog.json.serialize(a);
  commentum.frame_events.channel && commentum.frame_events.channel.send(b, a)
};
commentum.frame_events.on_page_load = function(a) {
  commentum.frame_events.page_key = {id:a.page_id, url:a.page_url};
  commentum.frame_events.block_key = {id:a.block_id, text:a.block_text};
  commentum.frame_events.on_data_start(function() {
    commentum.frame_events.on_page_show()
  })
};
commentum.frame_events.on_page_show = function() {
  var a = commentum.model.objects, b = function(a) {
    commentum.frame_events.page = a;
    return!commentum.utils.empty(commentum.frame_events.block_key) ? commentum.frame_events.on_block_show() : commentum.frame_events.on_page_comments_show()
  };
  a.page_list.get(commentum.frame_events.page_key, function(c) {
    return c ? b(c) : a.page_list.insert(commentum.frame_events.page_key, b)
  })
};
commentum.frame_events.on_block_show = function() {
  var a = commentum.frame_events.page, b = function(a) {
    commentum.frame_events.block = a;
    commentum.frame_events.on_block_comments_show()
  };
  a.block_list.get(commentum.frame_events.block_key, function(c) {
    return c ? b(c) : a.block_list.insert(commentum.frame_events.block_key, b)
  })
};
commentum.frame_events.on_block_comments_show = function() {
  var a = new commentum.views.FrameBlockComments(commentum.frame_events.block.id());
  a.show();
  (new commentum.views.BlockCommentPost(a, commentum.settings.post, commentum.settings.auth)).show();
  commentum.frame_events.block_comments_view = a;
  commentum.frame_events.view = a;
  commentum.frame_events.on_update_view()
};
commentum.frame_events.on_page_comments_show = function() {
  var a = new commentum.views.FramePageComments;
  a.show();
  (new commentum.views.PageCommentPost(a, commentum.settings.post, commentum.settings.auth)).show();
  commentum.frame_events.page_comments_view = a;
  commentum.frame_events.view = a;
  commentum.frame_events.on_update_view()
};
commentum.frame_events.on_page_comment_add = function(a, b) {
  commentum.frame_events.page.comment_list.insert(a, function(a) {
    a ? b && b(!0) : b && b(!1)
  })
};
commentum.frame_events.on_page_block_comment_add = function(a, b, c) {
  commentum.frame_events.block.comment_list.insert(b, function(a) {
    a ? c && c(!0) : c && c(!1)
  })
};
commentum.frame_events.on_user_login = function(a, b, c) {
  commentum.model.objects.user.login(a, b, function() {
    c && c(commentum.settings.post, commentum.settings.auth);
    commentum.frame_events.on_update_view()
  })
};
commentum.frame_events.on_user_logout = function(a) {
  commentum.model.objects.user.logout(function() {
    a && a(commentum.settings.post, commentum.settings.auth);
    commentum.frame_events.on_update_view()
  })
};
commentum.frame_events.on_user_register = function(a, b, c) {
  commentum.model.objects.user.register(a, b, function() {
    c && c(commentum.settings.post, commentum.settings.auth);
    commentum.frame_events.on_update_view()
  })
};
commentum.frame_events.on_user_login_service = function(a, b) {
  commentum.model.objects.user.login_service(a, function() {
    b && b(commentum.settings.post, commentum.settings.auth);
    commentum.frame_events.on_update_view()
  })
};
commentum.frame_events.on_update_view = function() {
  commentum.frame_events.on_data({action:"set_height", height:commentum.frame_events.view.height()})
};
commentum.frame = {};
commentum.frame.start = function(a, b) {
  commentum.settings.host = a.host;
  commentum.settings.path = a.service;
  commentum.settings.post = !0;
  commentum.frame_events.on_page_load(b.result)
};
goog.exportSymbol("script_frame", function(a, b) {
  commentum.frame.start(a, b)
});

