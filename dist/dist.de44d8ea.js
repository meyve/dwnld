// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"dist/index.js":[function(require,module,exports) {
'use strict';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var DEFAULT_MIME_TYPE = 'application/octet-stream';
var DEFAULT_FILE_NAME = 'file';
var BASE64_REGEX = /^data:([\w+-]+\/[\w+.-]+)?[,;]/;
var EXTENSION_REGEX = /(?:\.([^.]+))?$/;
var PARSE_PATH_FOR_FILENAME_REGEX = /^.*\/(.*)\.(.*)$/g;
/**
 * https://stackoverflow.com/a/14582229/7446674
 *
 * @param {String} str
 *
 * @return {Boolean}
 */

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

  return pattern.test(str);
}
/**
 *
 * @param {Error} e
 */


function printError(e) {
  console.error('Something went wrong while downloading:', '\n', e.message, '\n', e.stack, '\n');
  console.warn('Please, report issues to: https://github.com/meyve/dwnld');
  console.warn('Have a nice day :)');
  throw new Error(e.toString());
}
/**
 *
 * @param {String} dataURL
 *
 * @return {Blob}
 */


function dataURLToBlob(dataURL) {
  var parts = dataURL.split(/[:;,]/);
  var type = parts[1];
  var decoder = parts[2] === 'base64' ? atob : decodeURIComponent;
  var binaryData = decoder(parts.pop());
  var length = binaryData.length;
  var uint8Arr = new Uint8Array(length);

  for (var i = 0; i < length; ++i) {
    uint8Arr[i] = binaryData.charCodeAt(i);
  }

  return new Blob([uint8Arr], {
    type: type
  });
}
/**
 *
 * @param {String} fileName
 * @param {String} extension
 *
 * @return {String}
 */


function setFileExtension(fileName, extension) {
  // If filename has extension in it
  if (EXTENSION_REGEX.exec(fileName)[0]) {
    return fileName;
  }

  return "".concat(fileName, ".").concat(extension);
}

function stopPropagationHandler(e) {
  e.stopPropagation();
}
/**
 *
 * @param {String|Blob} data
 * @param {String} [fileName]
 * @param {String} [mimeType]
 *
 */


function dwnld(data) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$fileName = _ref.fileName,
      fileName = _ref$fileName === void 0 ? DEFAULT_FILE_NAME : _ref$fileName,
      _ref$mimeType = _ref.mimeType,
      mimeType = _ref$mimeType === void 0 ? DEFAULT_MIME_TYPE : _ref$mimeType;

  try {
    // If URL was passed - first download it.
    // Then recursively call download again with response.
    if (isURL(data)) {
      return downloadFromURL(data, {
        fileName: fileName,
        mimeType: mimeType
      });
    } // If raw base64:dataURL was passed.


    if (BASE64_REGEX.test(data)) {
      return convertBase64ToBlob(data, {
        fileName: fileName
      });
    }

    return saveAsBlob(data, {
      fileName: fileName,
      mimeType: mimeType
    });
  } catch (e) {
    printError(e);
  }
}
/**
 *
 * @param {String} url
 * @param {String} [fileName]
 * @param {String} [mimeType]
 */


function downloadFromURL(url) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      fileName = _ref2.fileName,
      _ref2$mimeType = _ref2.mimeType,
      mimeType = _ref2$mimeType === void 0 ? DEFAULT_MIME_TYPE : _ref2$mimeType;

  var _PARSE_PATH_FOR_FILEN = PARSE_PATH_FOR_FILENAME_REGEX.exec(url),
      _PARSE_PATH_FOR_FILEN2 = _slicedToArray(_PARSE_PATH_FOR_FILEN, 3),
      fileNameFromPath = _PARSE_PATH_FOR_FILEN2[1],
      extensionWithQueryParams = _PARSE_PATH_FOR_FILEN2[2];

  var extension = extensionWithQueryParams.split('?')[0];
  fileName = fileName || fileNameFromPath;
  fileName = setFileExtension(fileName, extension);
  var ajax = new XMLHttpRequest();
  ajax.open('GET', url, true);
  ajax.responseType = 'blob';

  ajax.onload = function (e) {
    var response = e.target.response;
    return download(response, {
      fileName: fileName,
      mimeType: mimeType
    });
  };

  return ajax.send();
}
/**
 *
 * @param {String} base64Path
 * @param {String} [fileName]
 *
 * @return {*}
 */


function convertBase64ToBlob(base64Path) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$fileName = _ref3.fileName,
      fileName = _ref3$fileName === void 0 ? DEFAULT_FILE_NAME : _ref3$fileName;

  var blob = dataURLToBlob(base64Path);
  var mimeType = blob.type || DEFAULT_MIME_TYPE;
  return saveAsBlob(blob, {
    fileName: fileName,
    mimeType: mimeType
  });
}
/**
 *
 * @param {Blob|String} blob
 * @param {String} [fileName]
 * @param {String} [mimeType]
 */


function saveAsBlob(blob) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref4$fileName = _ref4.fileName,
      fileName = _ref4$fileName === void 0 ? DEFAULT_FILE_NAME : _ref4$fileName,
      _ref4$mimeType = _ref4.mimeType,
      mimeType = _ref4$mimeType === void 0 ? DEFAULT_MIME_TYPE : _ref4$mimeType;

  blob = blob instanceof Blob ? blob : new Blob([blob], {
    type: mimeType
  }); // IE10+ : (has Blob, but not a[download] or URL)

  if (navigator.msSaveBlob) {
    return navigator.msSaveBlob(blob, fileName);
  } // If browser has Blob and URL.


  if (URL) {
    return _save(URL.createObjectURL(blob), {
      fileName: fileName,
      windowMode: true
    });
  } // Rest old browsers should try to use reader.


  return _saveWithReader(blob, {
    fileName: fileName
  });
}
/**
 *
 * @param {Blob} blob
 * @param {String} [fileName]
 */


function _saveWithReader(blob) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref5$fileName = _ref5.fileName,
      fileName = _ref5$fileName === void 0 ? DEFAULT_FILE_NAME : _ref5$fileName;

  var reader = new FileReader();

  reader.onload = function (e) {
    _save(e.target.result, {
      fileName: fileName
    });
  };

  return reader.readAsDataURL(blob);
}
/**
 * @private
 *
 * @param {String} url
 * @param {String} fileName
 * @param {Boolean} windowMode
 *
 */


function _save(url) {
  var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref6$fileName = _ref6.fileName,
      fileName = _ref6$fileName === void 0 ? DEFAULT_FILE_NAME : _ref6$fileName,
      _ref6$windowMode = _ref6.windowMode,
      windowMode = _ref6$windowMode === void 0 ? false : _ref6$windowMode;

  var anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', fileName);
  anchor.className = 'download_url';
  anchor.style.display = 'none';
  anchor.addEventListener('click', stopPropagationHandler); //fix for IE

  document.body.appendChild(anchor);
  return Promise.resolve().then(function () {
    return anchor.click();
  }).then(function () {
    anchor.removeEventListener('click', stopPropagationHandler);
    document.body.removeChild(anchor);
  }).then(function () {
    return windowMode && URL && URL.revokeObjectURL(anchor.href);
  }).catch(printError);
}

module.exports = dwnld;
},{}],"../../AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50359" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","dist/index.js"], null)
//# sourceMappingURL=/dist.de44d8ea.map