---
title: Metadata and Hosting Options
summary: As awesome as NFTs are, without metadata they are just numbers! Fortunately, a metadata standard was included in EIP721, along with some additions (background color, stats) to improve the rendering on markets like OpenSea. Note- This “standard” is more of a suggestion than a fully agreed upon specification. As well show below, there are several versions currently adhered too. The EIP721 standard-{ title- Asset Metadata, type- object, properties- { name- { type- string, description- Identifies th
authors:
  - Kauri Team (@kauri)
date: 2018-09-03
some_url: 
---

# Metadata and Hosting Options


As awesome as NFTs are, without metadata they are just numbers! Fortunately, a metadata standard was included in EIP721, along with some additions (background color, stats) to improve the rendering on markets like OpenSea. 

**Note:**
This “standard” is more of a suggestion than a fully agreed upon specification. As we'll show below, there are several versions currently adhered too.

The EIP721 standard:

```
{
    "title": "Asset Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Identifies the asset to which this NFT represents",
        },
        "description": {
            "type": "string",
            "description": "Describes the asset to which this NFT represents",
        },
        "image": {
            "type": "string",
            "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.",
        }
    }
}
```

This content should be hosted at an HTTP or IPFS URL (using an IPFS gateway like ipfs.io (http://ipfs.io/)), and should be unique for **EACH** NFT.  

For example, tokenId 1 should be hosted at https://ipfs.io/kauriToken1, and tokenId 2 should be hosted at https://ipfs.io/kauriToken2. Sending a request to the URL should return the unique JSON blob, like the above.

Showcase Site Metadata:
Showcase and auction sites like OpenSea and Rarebits tend to have their own supported versions of the standard. We'll touch on those two hear, as they are currently the most popular.

OpenSea: https://opensea.readme.io/docs/2-adding-metadata

The following attributes are available, and will customize how your NFTs are displayed in the OpenSea store:
![](https://ipfs.infura.io/ipfs/QmceYfeyoZTKk3CbMZpbEMtMXafLE7poVc7sPrZe1i2XHH)

And an example:

```
{
  "name": "Kauri Original Contributor",
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
  "description": "This badge was awarded to one of the first 100 users on Kauri!", 
  "attributes": {
    "level": 1,
  },
  "external_url": "https://rinkeby.kauri.io/", 
  "background_color": "00000"
}
```

Rarebits: https://docs.rarebits.io/v1.0/docs/listing-your-assets

![](https://ipfs.infura.io/ipfs/QmZkTCZcoGwZqsLfM3uXzPU6V1XKZqFNGbWXi8ehcQAC8E)

And an example:

```
{
  "name": "Robot token #14",
  "image_url": "https://www.robotgame.com/images/14.png",
  "home_url": "https://www.robotgame.com/robots/14.html",
  "description": "This is the amazing Robot #14, please buy me!",
  "properties": [
    {"key": "generation", "value": 4, type: "integer"}, 
    {"key": "cooldown", "value": "slow", type: "string"}
  ],
  "tags": ["red","rare","fire"]
}
```
**Hosting the Metadata**

An important consideration for your NFT is where the metadata will be hosted, as a dead link effectively kills your token! While the ERC721 standard allows these URIs to be updated, really this behavior should be prevented at the implementation level to avoid an asset having it's information changed after creation (which can be used maliciously). Not too mention that even a bit of downtime on a URI can be problematic, at the very least negatively affecting the user experience.

So to minimize these possibilities, we suggest using a distributed storage solution like IPFS, and eventually Swarm.
An easy way to upload content to IPFS is to use an app like https://globalupload.io/. 

![](https://ipfs.infura.io/ipfs/QmQPRcPf7SLhL2cZ2G6YutH7nHPZoZtosPJ8uzPhWbKc13)

This app allows you to just drag and drop a properly formatted .json file (using the standard), and will return a URL with the IPFS hash, which you can use in your token!

**Important note:**
Your data in IPFS only exists as long as it is pinned (flagged for storage on an IPFS node). While nodes like Infura are reliable, ultimately running your own node(s) is the safest choice, at least until Filecoin or similar products are ready. If you're planning to build a fully-featured application around your NFT, consider using something like https://github.com/ConsenSys/IPFS-Store, built and maintained by our very own Greg Jeanmart! 

Another option for adding and storing metadata is to use Abacus Protocol: https://docs.abacusprotocol.com/tutorial, which is a method recommended by OpenSea.

The metadata patterns for NFTs are still evolving (along with the storage options), and we'll continue to update this document as new options and best practices emerge.


---

- **Kauri original link:** https://kauri.io/metadata-and-hosting-options/e931dca3476f49b4ba7433a747ab5022/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2018-09-03
- **Kauri original tags:** none
- **Kauri original hash:** QmRqANyoHAKLBLf4zXLeooYdvc9ehonw8YCCALzHBih44s
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



