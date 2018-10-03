const DEFAULT_MIME_TYPE = 'application/octet-stream'
const DEFAULT_FILE_NAME = 'file'
const BASE64_REGEX = /^data:([\w+-]+\/[\w+.-]+)?[,;]/
const EXTENSION_REGEX = /(?:\.([^.]+))?$/
const PARSE_PATH_FOR_FILENAME_REGEX = /^.*\/(.*)\.(.*)$/g

export {
  DEFAULT_FILE_NAME,
  DEFAULT_MIME_TYPE,
  BASE64_REGEX,
  EXTENSION_REGEX,
  PARSE_PATH_FOR_FILENAME_REGEX
}
