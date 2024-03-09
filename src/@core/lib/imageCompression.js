
const path = require('path');
var Jimp = require('jimp');


const imageCompression = async (imageURL, type, maxWidth, maxHeight, compressionQuality, downloadPath, saveActualPath, compressionService = "") => {

  return new Promise(function (resolve, reject) {
    
    if (compressionService == 'tinypng') {

    } else {
      Jimp.read(imageURL)
        .then(lenna => {
          
          let fileName = `${saveActualPath}-${lenna.bitmap.width}x${lenna.bitmap.height}.${type}`

          if (lenna.bitmap.width > maxWidth) {
            return lenna
              .resize(maxWidth, Jimp.AUTO, function (err, res) {
                fileName = `${saveActualPath}-${res.bitmap.width}x${res.bitmap.height}.${type}`
                res.quality(compressionQuality).writeAsync(path.join(downloadPath, fileName)).then(resWrite => {
                  resolve({ status: true, fileName })
                });
              })
            // .quality(compressionQuality) // set JPEG quality
            // .writeAsync(path.join(downloadPath,fileName))
          } else if (lenna.bitmap.height > maxHeight) {

            return lenna
              .resize(Jimp.AUTO, maxHeight, function (err, res) {
                fileName = `${saveActualPath}-${res.bitmap.width}x${res.bitmap.height}.${type}`
                res.quality(compressionQuality).writeAsync(path.join(downloadPath, fileName)).then(resWrite => {
                  resolve({ status: true, fileName })
                });
              })
          } else {
            return lenna // resize
              .quality(compressionQuality) // set JPEG quality
              .writeAsync(path.join(downloadPath, fileName)).then(resWrite => {
                resolve({ status: true, fileName })
              })
          }
        })
        .catch(err => {
          console.log(err);
          resolve({ status: false })
        });

    }

  })

}

export default imageCompression;