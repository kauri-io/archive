(async () => {
  console.log('##########################################################################')
  console.log('## KAURI IPFS MOVE TO INFURA                                            ##')
  console.log('##########################################################################')


  // ####### IMPORT
  const utils = require('../js/utils')
  const request = require('request');
  const rp = require('request-promise');
  const fetch = require('node-fetch');
  const fs = require('fs');

  const source = "../ipfs/ipfs_content.txt" // "../ipfs/ipfs_img.txt"
  const folder = "content"

  utils.deleteFolder(folder)
  utils.createDirectory(folder)

  const urls = fs.readFileSync(source, 'utf-8').split(/\r?\n/)
  const total = urls.length
  var i = 0
  for(url of urls) {
    if(url == "") continue;

    const hash = url.substring(url.lastIndexOf('/') + 1)
    console.log(hash)
    const path = folder + "/" + hash + ".png"

    const resp = await fetch(url);
    const img = await resp.buffer();
    utils.createFile(path, img)

    const body = await rp({
        method: 'POST',
        uri: 'https://ipfs.infura.io:5001/api/v0/add',
        formData: {
            file: fs.createReadStream(path)
        }
    });

    const infuraHash = JSON.parse(body).Hash
    console.log(`${i} / ${total} - writen ${url} into ${path} and uploaded to infura with hash ${infuraHash}`)
    i++
  }

  // END...
  console.log('END!')
  process.exit()
})();
