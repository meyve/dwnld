import { EXTENSION_REGEX } from './constants'

/**
 * https://stackoverflow.com/a/14582229/7446674
 *
 * @param {String} str
 *
 * @return {Boolean}
 */
function isURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator

  return pattern.test(str)
}

/**
 *
 * @param {Error} e
 */
function printError(e) {
  console.error(
    'Something went wrong while downloading:',
    '\n',
    e.message,
    '\n',
    e.stack,
    '\n'
  )

  console.warn('Please, report issues to: https://github.com/meyve/dwnld')
  console.warn('Have a nice day :)')

  throw new Error(e.toString())
}

/**
 *
 * @param {String} dataURL
 *
 * @return {Blob}
 */
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(/[:;,]/)
  const type = parts[1]
  const decoder = parts[2] === 'base64' ? atob : decodeURIComponent
  const binaryData = decoder(parts.pop())
  const length = binaryData.length
  const uint8Arr = new Uint8Array(length)

  for (let i = 0; i < length; ++i) {
    uint8Arr[i] = binaryData.charCodeAt(i)
  }

  return new Blob([uint8Arr], { type: type })
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
    return fileName
  }

  return `${fileName}.${extension}`
}

export { isURL, printError, dataURLToBlob, setFileExtension }
