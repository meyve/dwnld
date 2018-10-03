import { DEFAULT_MIME_TYPE, DEFAULT_FILE_NAME, BASE64_REGEX, PARSE_PATH_FOR_FILENAME_REGEX } from './constants'
import { printError, isURL, dataURLToBlob, setFileExtension } from './utils'

function stopPropagationHandler(e) {
  e.stopPropagation()
}

/**
 *
 * @param {String|Blob} data
 * @param {String} [fileName]
 * @param {String} [mimeType]
 *
 */
function dwnld(data, { fileName = DEFAULT_FILE_NAME, mimeType = DEFAULT_MIME_TYPE } = {}) {
  try {
    // If URL was passed - first download it.
    // Then recursively call download again with response.
    if (isURL(data)) {
      return downloadFromURL(data, { fileName, mimeType })
    }

    // If raw base64:dataURL was passed.
    if (BASE64_REGEX.test(data)) {
      return convertBase64ToBlob(data, { fileName })
    }

    return saveAsBlob(data, { fileName, mimeType })
  } catch (e) {
    printError(e)
  }
}

/**
 *
 * @param {String} url
 * @param {String} [fileName]
 * @param {String} [mimeType]
 */
function downloadFromURL(url, { fileName, mimeType = DEFAULT_MIME_TYPE } = {}) {
  const [, fileNameFromPath, extensionWithQueryParams] = PARSE_PATH_FOR_FILENAME_REGEX.exec(url)

  const extension = extensionWithQueryParams.split('?')[0]

  fileName = fileName || fileNameFromPath
  fileName = setFileExtension(fileName, extension)

  const ajax = new XMLHttpRequest()

  ajax.open('GET', url, true)
  ajax.responseType = 'blob'
  ajax.onload = function(e) {
    const { response } = e.target

    return download(response, { fileName, mimeType })
  }

  return ajax.send()
}

/**
 *
 * @param {String} base64Path
 * @param {String} [fileName]
 *
 * @return {*}
 */
function convertBase64ToBlob(base64Path, { fileName = DEFAULT_FILE_NAME } = {}) {
  const blob = dataURLToBlob(base64Path)
  const mimeType = blob.type || DEFAULT_MIME_TYPE

  return saveAsBlob(blob, { fileName, mimeType })
}

/**
 *
 * @param {Blob|String} blob
 * @param {String} [fileName]
 * @param {String} [mimeType]
 */
function saveAsBlob(blob, { fileName = DEFAULT_FILE_NAME, mimeType = DEFAULT_MIME_TYPE } = {}) {
  blob = blob instanceof Blob ? blob : new Blob([blob], { type: mimeType })

  // IE10+ : (has Blob, but not a[download] or URL)
  if (navigator.msSaveBlob) {
    return navigator.msSaveBlob(blob, fileName)
  }

  // If browser has Blob and URL.
  if (URL) {
    return _save(URL.createObjectURL(blob), { fileName, windowMode: true })
  }

  // Rest old browsers should try to use reader.
  return _saveWithReader(blob, { fileName })
}

/**
 *
 * @param {Blob} blob
 * @param {String} [fileName]
 */
function _saveWithReader(blob, { fileName = DEFAULT_FILE_NAME } = {}) {
  const reader = new FileReader()
  reader.onload = function(e) {
    _save(e.target.result, { fileName })
  }

  return reader.readAsDataURL(blob)
}

/**
 * @private
 *
 * @param {String} url
 * @param {String} fileName
 * @param {Boolean} windowMode
 *
 */
function _save(url, { fileName = DEFAULT_FILE_NAME, windowMode = false } = {}) {
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.setAttribute('download', fileName)
  anchor.className = 'download_url'
  anchor.style.display = 'none'
  anchor.addEventListener('click', stopPropagationHandler) //fix for IE
  document.body.appendChild(anchor)

  return Promise.resolve()
    .then(() => anchor.click())
    .then(() => {
      anchor.removeEventListener('click', stopPropagationHandler)
      document.body.removeChild(anchor)
    })
    .then(() => windowMode && URL && URL.revokeObjectURL(anchor.href))
    .catch(printError)
}

export default dwnld
