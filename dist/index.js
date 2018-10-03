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
//# sourceMappingURL=index.js.map
