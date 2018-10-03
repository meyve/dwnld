# dwnld

---

### This is refactored and cleaned up fork of [downloadjs](https://github.com/rndme/download) with new API and some bugs fixed.

[![License][license-image]][license-url]

---

## Summary

---

The dwnld() package is used to download files on client side with JavaScript.

## Getting and Using

---

### Via NPM/Bower

`npm install dwnld` <br />
`bower install dwnld`

`require("dwnld")(data, {fileName, mimeType});`

### Included via AMD

    require(['path/to/file'], function(dwnld) {
        dwnld(data, {fileName, mimeType);
    });

### Parameters

---

- **data** - The Blob, File, String, or dataURL containing the soon-to-be File's contents.
- **[strFileName]** - The name of the file to be created. This param is optional. You can specify file's extension in its name if you want or dwnld will do the thing for you.
- **[strMimeType]** - The MIME content-type of the file to download. This param is optional.

## Example Usage

---

### Usage with simple link

```javascript
import dwnld from "dwnld"

const someFileLink = "https://someWebsite.com/somePath/file.pdf?someQuery=true"

dwnld(someFileLink, { fileName: "fileNameToSave" })
```

#### Usage with dataURL

```javascript
import dwnld from "dwnld"

const someDataURL = "data:image/gif;base64,R0lGODlhyAAiALM...DfD0QAADs="

dwnld(someDataURL, { fileName: "fileNameToSave" })
```

#### Usage with Blob

```javascript
import dwnld from "dwnld"

const someBlob = new Blob(["some blob"])

dwnld(someBlob, { fileName: "fileNameToSave.txt" })
```

#### Usage with UInt8 Array - [live demo](http://pagedemos.com/zuyk46wbkktq/output/)

```javascript
import dwnld from "dwnld"

const someStr = "some string"
const array = new Uint8Array(someStr.map(s => s.charCodeAt()))

dwnld(array, { fileName: "fileNameToSave.txt" })
```

#### Usage with files

    dwnld("/somefile.png");

[mit license]: http://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT
