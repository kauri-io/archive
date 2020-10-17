---
title: Creating a Flexible NFT (Part 2)
summary: Part 2 Step 1- Make new netlify project We begin Part 2 by creating a web page in the same folder as the rest of our code.touch ./index.html && echo hello world - ) > ./index.html Great thats a beautiful website! Lets deploy it to the internet. Create a git repo, commit your code, and push to the origin-git add . && git commit -m 'new website' && git push -u origin master I use netlify for hosting because they have an all in one package for deploying sites from repositories, running a build proc
authors:
  - Billy Rennekamp (@okwme)
date: 2019-06-25
some_url: 
---

# Part 2

## Step 1: Make new netlify project

We begin Part 2 by creating a web page in the same folder as the rest of our code.

```bash
touch ./index.html && echo "hello world : )" > ./index.html
```

Great that's a beautiful website! Let's deploy it to the internet. Create a git repo, commit your code, and push to the origin:

```bash
git add . && git commit -m 'new website' && git push -u origin master
```

I use [netlify](https://www.netlify.com) for hosting because they have an all in one package for deploying sites from repositories, running a build process, adding SSL for custom domains and the ability to add lambda functions. They also have authentication and form handling, but I've never used those features. You could use AWS or Google firebase. Go to [netlify.com](https://netlify.com)and register using your github/gitlab/bitbucket account.

We're creating an API endpoint that returns the metadata for our NFT. I know what you're thinking, "isn't this an evil centralized solution??". Yes it is. Why? Because the alternative still sucks. Until we live in a world where I can expect my IPFS file to persist after I stop seeding it, and where I don't have to wait forever for the content, we have to use the current Internet infrastructure. If you look at any successful NFT project, they're doing the same thing. The biggest NFT marketplace, [opensea.io](https://opensea.io), caches all the NFT data they can find and serves it directly. This is because it's better than relying on decentralized solutions at this point. When the decentralized solutions are viable, then our NFT will have an upgradeable metadata endpoint!

![](https://www.dropbox.com/s/80bg2jgcss87bro/Screenshot%202018-12-13%2018.21.08.png?dl=1)

Back to netlify, we allow them to have API access to our repo so that they can deploy changes.

![](https://www.dropbox.com/s/btla7vp13mwxubo/Screenshot%202018-12-13%2018.21.43.png?dl=1)

Find our repo and select it.

![](https://www.dropbox.com/s/cuzf1hvikmof4ac/Screenshot%202018-12-13%2018.22.03.png?dl=1)

We don't need to add a build command or a publish directory because our website is just one _index.html_ file and it's in the project root. You are probably already on `master` branch so that won't need to change (although netlify can auto-deploy each branch on a new domain if you want it to). Next click "Deploy site".

![](https://www.dropbox.com/s/bllkimg96en9fie/Screenshot%202018-12-13%2018.23.16.png?dl=1)

If you want to change your site name from the auto generated name, click _Site settings_ and scroll down to _Change site name_. I changed mine to "block-workshop" which makes it available at <https://block-workshop.netlify.com> once the deploy process has completed.

If everything went well you should see this beautiful website:

![](https://www.dropbox.com/s/0hwnvr2a1c7imfg/Screenshot%202018-12-13%2018.29.16.png?dl=1)

## Step 2: Install netlify lambda

Install `netlify-lambda` as a dev dependency so we can access it with `npx`. This is a utility for building the lambda function and serving it locally so you can test functions before deploying them.

```bash
yarn add netlify-lambda -D
# or
npm install netlify-lambda --save-dev
```

Add a directory where your lambda functions live. Call it _lambda_ as that makes sense.

```bash
mkdir lambda
```

Create a configuration _.toml_ file for netlify to define where our functions are served from:

```bash
touch netlify.toml
```

Now add the key `functions` to the toml file which is where the functions are served from after the `netlify-lambda` builds them:

```toml
[build]
  functions = "functions"
```

Create a dummy function in the _lambda_ folder:

```bash
touch ./lambda/helloworld.js
```

Add the boilerplate that netlify provides from their docs:

```javascript
exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
};
```

The file exports a function called `handler`. This is the same format that AWS uses for their lambda functions (because netlify is a wrapper around AWS). If you have a lambda function you've used with AWS, you can use it with netlify, and if you have any advanced trouble shooting requests regarding these functions, add "AWS" to your query and not "netlify".

Run a local server so we can test the endpoint using the `netlify-lambda` utility:

```bash
$ npx netlify-lambda serve lambda
netlify-lambda: Starting server
Lambda server is listening on 9000
Hash: 47a70dc1b032c7c81a89
Version: webpack 4.27.1
Time: 745ms
Built at: 2018-12-13 18:52:53
        Asset      Size  Chunks             Chunk Names
helloworld.js  1.03 KiB       0  [emitted]  helloworld
Entrypoint helloworld = helloworld.js
[0] ./helloworld.js 129 bytes {0} [built]
```

This builds a new _functions_ folder where the _helloworld.js_ file is compiled and served from. It's accessible from port `9000` by default and is accessible at `http://localhost:9000/helloworld`

![](https://www.dropbox.com/s/6jk666r53q91u26/Screenshot%202018-12-13%2018.56.41.png?dl=1)

Commit your code and push to your repo. Netlify should notice the push to `master` and auto-deploy it.

```bash
git add . && git commit -m 'Step 2: Install netlify lambda' && git push
```

You now have access to a _functions_ section on netlify where you have one `helloworld` function

![](https://www.dropbox.com/s/4uq2rsx60c5qrc4/Screenshot%202018-12-13%2019.02.26.png?dl=1)

When the deploy finishes you should be able to access it at <https://{SITE_NAME}.netlify.com/.netlify/functions/helloworld>

This is the deployed format for the functions so that there aren't any name conflicts with your current routing. This is inconvenient syntax though, we'll add proxy rules to the metadata endpoint in a later step.

## Step 3:  Add Metadata

Now that we've created a dummy endpoint, let's make one that's more useful. Create a new file in your _lambda_ directory called _metadata.js_ and fill it with the same hello world code from before. (Or duplicate the _helloworld.js_ file):

```bash
cp ./lambda/helloworld.js ./lambda/metadata.js
```

Now take a moment to read the _helloworld.js_ file:

```javascript
exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
};
```

The handler function takes 3 parameters:

-   `event` which is the event that triggers the function
-   `context` which is the context of the event
-   `callback` which ends the request and fills it with content and header information.

We handle requests for our token metadata that follows the format we built into our _Metadata.sol_ contract. That means it's a `GET` request with the token ID built into the route of the URL, like `https://domain.com/metadata/{tokenId}`. To pass `GET` parameters we use a format like `https://domain.com/metadata?tokenId={tokenId}`. We could define our `tokenURI` to follow a format like this, but that's ugly.

Let's work with this format for now and improve it later. We log the event to see if we can find the `tokenId` parameter passed to the URL. This is easier to do in our local setup so follow the URL pattern `http://localhost:9000/metadata?tokenId=666`

Add some `console.log`s to the _metadata.js_ handler function so we can read what's going on in those parameters:

```javascript
exports.handler = function(event, context, callback) {
  console.log("EVENT", event)
  console.log("CONTEXT", context)
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
};
```

Restart the `netlify-lambda` utility (if it's still running) and visit the URL:

```bash
npx netlify-lambda serve lambda
```

If you check the console running the server you see the contents of `event` and `context`, and the `tokenId` under `queryStringParameters`:

```bash
$ npx netlify-lambda serve lambda
netlify-lambda: Starting server
Lambda server is listening on 9000
Hash: 6507b49ec95292f0e68a
Version: webpack 4.27.1
Time: 665ms
Built at: 2018-12-13 19:18:56
        Asset      Size  Chunks             Chunk Names
helloworld.js  1.03 KiB       0  [emitted]  helloworld
  metadata.js  1.08 KiB       1  [emitted]  metadata
Entrypoint helloworld = helloworld.js
Entrypoint metadata = metadata.js
[0] ./helloworld.js 129 bytes {0} [built]
[1] ./metadata.js 195 bytes {1} [built]
Request from ::1: GET /metadata?tokenId=666
EVENT { path: '/metadata',
  httpMethod: 'GET',
  queryStringParameters: { tokenId: '666' },
  headers:
   { host: 'localhost:9000',
     connection: 'keep-alive',
     'cache-control': 'max-age=0',
     'upgrade-insecure-requests': '1',
     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
     'accept-encoding': 'gzip, deflate, br',
     'accept-language': 'en-US,en;q=0.9' },
  body: 'W29iamVjdCBPYmplY3Rd',
  isBase64Encoded: true }
CONTEXT {}
Response with status 200 in 8 ms.
```

To be compliant with EIP-721 and EIP-1047, the Token Metadata JSON Schema should follow the following format:

```json
{
    "title": "Asset Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Identifies the asset to which this token represents",
        },
        "description": {
            "type": "string",
            "description": "Describes the asset to which this token represents",
        },
        "image": {
            "type": "string",
            "description": "A URI pointing to a resource with mime type image/* representing the asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.",
        }
    }
}
```

Lets try returning this, but replace the name with the `tokenId`, and return an autogenerated image, for example `https://dummyimage.com/600x400/000000/fff/&text=test%20image`.

![](https://dummyimage.com/600x400/000000/fff/&text=test%20image)

```javascript
const tokenId = event.queryStringParameters.tokenId
const metadata =  {
    "name": "Token #" + tokenId,
    "description": "Describes the asset to which this token represents",
    "image": "https://dummyimage.com/600x400/000000/fff/&text=token%20" + tokenId,
}
```

Return it in the `callback` function, and stringify the JSON object before returning it:

```javascript
callback(null, {
    statusCode: 200,
    body: JSON.stringify(metadata)
});
```

When we check our endpoint (and if you have a JSON prettier browser extension) it returns this:

![](https://www.dropbox.com/s/rwkf098pt2lug1l/Screenshot%202018-12-13%2019.40.31.png?dl=1)

## Step 4: Add proxy routing

On netlify we still use the inconvenient URL format, `/.netlify/functions/metadata?tokenId=666`, to see the new endpoint. Open the _netlify.toml_ file and add some re-write rules so that we can transform a pretty URL like `/metadata/666` into something that our lambda function understands like `/.netlify/functions/metadata?tokenId=666`:

```toml
[build]
  functions = "functions"

[[redirects]]
  from = "/metadata/:tokenId"
  to = "/.netlify/functions/metadata?tokenId=:tokenId"
  status = 200
```

This redirects queries from `/metadata` to whatever is at the location `/.netlify/functions/metadata`. The `:tokenId` placeholder designates that the value should carry over to the same location in the other url. The status it should returns in the header is `200` which means success.

## Step 5: Add opensea.io

To make sure our metadata shows up on sites like opensea we want to serve a format the service understands. The [Opensea docs](https://docs.opensea.io) say they expect metadata that adheres to the following example:

```json
{
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
  "external_url": "https://openseacreatures.io/3",
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
  "name": "Dave Starbelly",
  "attributes": [ ... ],
}
```

With an additional `attributes` key that you can populate like:

```json
{
"attributes": [
    {
      "trait_type": "base",
      "value": "starfish"
    },
    {
      "trait_type": "eyes",
      "value": "big"
    },
    {
      "trait_type": "mouth",
      "value": "surprised"
    },
    {
      "trait_type": "level",
      "value": 5
    },
    {
      "trait_type": "stamina",
      "value": 1.4
    },
    {
      "trait_type": "personality",
      "value": "sad"
    },
    {
      "display_type": "boost_number",
      "trait_type": "aqua_power",
      "value": 40
    },
    {
      "display_type": "boost_percentage",
      "trait_type": "stamina_increase",
      "value": 10
    },
    {
      "display_type": "number",
      "trait_type": "generation",
      "value": 2
    }
  ]
}
```

Add some attributes to our endpoint. Maybe our `tokenId` could reflect a zodiac sign:

```javascript
exports.handler = function(event, context, callback) {
  const tokenId = event.queryStringParameters.tokenId
  const metadata =  {
    "name": "Token #" + tokenId,
    "external_url": "https://block-workshop.netlify.com/",
    "description": "This is a very basic NFT with token Id #" + tokenId,
    "image": "https://dummyimage.com/600x400/000000/fff/&text=token%20" + tokenId,
    "attributes": [
      {
        "trait_type": "zodiac",
        "value": returnZodiac(tokenId)
      }
    ]
  }
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(metadata)
  });
};
function returnZodiac(tokenId) {
  const month = ((tokenId - 1) % 12) + 1
  switch(month) {
    case(1):
      return 'Capricorn'
    case(2):
      return 'Aquarius'
    case(3):
      return 'Pisces'
    case(4):
      return 'Aries'
    case(5):
      return 'Taurus'
    case(6):
      return 'Gemini'
    case(7):
      return 'Cancer'
    case(8):
      return 'Leo'
    case(9):
      return 'Virgo'
    case(10):
      return 'Libra'
    case(11):
      return 'Scorpio'
    case(12):
      return 'Sagittarius'
  }
}
```

## Step 6: Add rarebits

Another popular NFT marketplace is [rarebits](https://rarebits.io/). Let's adhere to their format as well:

```json
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

What do you know! It follows it's own spec! You can now see why it's important to maintain flexibility around your metadata endpoint. Until we live in a world that has settled on a standard that everyone uses and isn't hosted on a lambda function on netlify.

Add info to our token so it adheres to rarebits as well:

```javascript
exports.handler = function(event, context, callback) {
  const tokenId = event.queryStringParameters.tokenId
  const metadata =  {

    // both opensea and rarebits
    "name": "Token #" + tokenId,
    "description": "This is a basic NFT with token Id #" + tokenId,

    // opensea
    "external_url": "https://block-workshop.netlify.com/",
    // rarebits
    "home_url": "https://block-workshop.netlify.com/",

    // opensea
    "image": "https://dummyimage.com/600x400/000/fff/&text=token%20" + tokenId,
    // rarebits
    "image_url": "https://dummyimage.com/600x400/000/fff/&text=token%20" + tokenId,

    // opensea
    "attributes": [
      {
        "trait_type": "zodiac",
        "value": returnZodiac(tokenId)
      }
    ],
    // rarebits
    "properties": [
      {"key": "zodiac", "value": returnZodiac(tokenId), type: "string"},
    ],

    // rarebits
    "tags": ["cool","hot","mild"]
  }
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(metadata)
  });
};
```

Now we have a fat json object returned.

![](https://www.dropbox.com/s/evfhgwhs4t6ij60/Screenshot%202018-12-13%2020.44.16.png?dl=1)

## Step 7: Re-deploy and mint a token

Now we have a metadata API endpoint and we don't have to do anything to service it. We even have a minified website and seeded across a Content Delivery Network. All we're missing is our Token.

When we deployed our Token we used a metadata endpoint that returned `https://domain.com/metadata/{tokenId}`, but `domain.com` isn't our domain! We have to update our metadata endpoint.

Thankfully we built in that ability, and a migration. Inside the _Metadata.sol_ contract update the URI with our netlify subdomain:

```solidity
function tokenURI(uint _tokenId) public pure returns (string memory _infoUrl) {
    string memory base = "https://block-workshop.netlify.com/metadata/";
    string memory id = uint2str(_tokenId);
    return base.toSlice().concat(id.toSlice());
}
```

Run the migration so that only the metadata is replaced, and updated inside of the contract:

```bash
$ truffle migrate --network rinkeby -f 3 --to 3

...

Using network 'rinkeby'.

Running migration: 3_update_metadata.js
  Running step...
  Replacing Metadata...
  ... 0xe596fcf7f20073988c4c57167d19a529b086ddd978ce386bf66485a97f3ad2d9
  Metadata: 0xfb66019e647cec020cf5d1277c81ad463e4574a4
        Metadata deployed at: 0xfb66019e647cec020cf5d1277c81ad463e4574a4
        Token deployed at: 0x1170a2c7d4913d399f74ee5270ac65730ff961bf
  ... 0xc3316fa072e84038ee30c360bc70cdc4107d3fcb74780e33e34b0e117e1534aa
Saving successful migration to network...
  ... 0x416630f6fad98eef2f065014c55ac8b43901ef804435b92d4d02f804a7d4c242
Saving artifacts...
```

Return to our etherscan certified token and mint our first token. You should see that our `updateMetadata` transaction is listed there now.

![](https://www.dropbox.com/s/tv756wlfbj5tt3o/Screenshot%202018-12-13%2020.54.35.png?dl=1)

Since I'm using a metamask account that is the same as my deploy account, I have permission to mint a token. Open the _write contract_ tab, authenticate with metamask, and mint a token.

![](https://www.dropbox.com/s/n5h7wg9khhqwzi4/Screenshot%202018-12-13%2020.56.00.png?dl=1)

Since I added my own address as the recipient, I should be the proud owner of token #1. I can check using the token view of etherscan we saw before.

![](https://www.dropbox.com/s/1zm2l8b1n9mt6bs/Screenshot%202018-12-13%2020.57.28.png?dl=1)

Wow, there's a token!

Open opensea and see if they've noticed that we exist. With rarebits and opensea you have to request that they track your token before it shows up in the sidebar, but you can skip that by hard coding the contract address in to the URL. Knowing our token address is at `0x1170a2c7d4913d399f74ee5270ac65730ff961bf` and our `tokenId` is `1` we are able to visit the rinkeby version of the URL like this:

<https://rinkeby.opensea.io/assets/0x1170a2c7d4913d399f74ee5270ac65730ff961bf/1>

![](https://www.dropbox.com/s/k6djvdkyms1bctk/Screenshot%202018-12-13%2021.00.28.png?dl=1)

WOW, they even know our token's zodiac sign!

![](https://www.dropbox.com/s/b78ltttja9hbjo2/Screenshot%202018-12-13%2021.01.17.png?dl=1)

Add it to the app officially and we can see it in the rinkeby section.

![](https://www.dropbox.com/s/w4wg6u8w9b3rae7/Screenshot%202018-12-13%2021.08.22.png?dl=1)

![](https://www.dropbox.com/s/mgm9r9dyhohd72j/Screenshot%202018-12-13%2021.09.05.png?dl=1)

![](https://www.dropbox.com/s/xa4000qhg4cl4zr/Screenshot%202018-12-13%2021.09.23.png?dl=1)

And we're up!

![](https://www.dropbox.com/s/ofzn8w59ozf26of/Screenshot%202018-12-13%2021.10.54.png?dl=1)

Let's add it to rarebits too.

![](https://www.dropbox.com/s/9v0cjc0jvweo6ug/Screenshot%202018-12-13%2021.06.14.png?dl=1)

![](https://www.dropbox.com/s/np167hbcy8p53ht/Screenshot%202018-12-13%2021.11.54.png?dl=1)

## Next Steps

-   Make a more interesting generative image
    -   One example is the cloudinary's hue rotate used by ENSNifty.com ([github link](https://github.com/ENS-Nifty/ens-nifty-frontend/blob/master/functions/metadata.js#L73))
-   Add a database to your lambda function for richer metadata
    -   **Bonus**: Get in a fight on Twitter about the meaning of true decentralization!