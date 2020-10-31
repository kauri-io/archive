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

  const base = "/Users/gregjeanmart/workspace/ethereum/kauri/archive2"
  const source = base + "/ipfs/ipfs_content.txt" // "../ipfs/ipfs_img.txt"
  const folder = "content"
  const extension = "txt" // "png"

  utils.deleteFolder(folder)
  utils.createDirectory(folder)

  const urls = fs.readFileSync(source, 'utf-8').split(/\r?\n/)
  const total = urls.length
  var i = 0
  for(url of urls) {
    if(url == "") continue;

    const hash = url.substring(url.lastIndexOf('/') + 1)
    const path = folder + "/" + hash + "." + extension

    const resp = await fetch(url);
    const buf = await resp.buffer();
    utils.createFile(path, buf)

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
