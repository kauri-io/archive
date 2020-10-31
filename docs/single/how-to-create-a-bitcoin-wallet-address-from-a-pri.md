---
title: How to create a Bitcoin wallet address from a private key
summary: In the previous article , we looked at different methods to generate a private key. Whatever method you choose, you’ll end up with 32 bytes of data. Here’s the one that we got at the end of that article- 60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2 We’ll use this private key throughout the article to derive both a public key and the address for the Bitcoin wallet. What we want to do is to apply a series of conversions to the private key to get a public key and then a wallet a
authors:
  - Timur Badretdinov (@destiner)
date: 2018-11-29
some_url: 
---

# How to create a Bitcoin wallet address from a private key



----


![](https://ipfs.infura.io/ipfs/Qmbzq8wFSvgiJZTY8XKYBt9bzWCSnJmGsGR232Wtk44aMS)

In 
[the previous article](https://medium.freecodecamp.org/how-to-generate-your-very-own-bitcoin-private-key-7ad0f4936e6c)
 , we looked at different methods to generate a private key. Whatever method you choose, you’ll end up with 32 bytes of data. Here’s the one that we got at the end of that article:

 
`60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2`
 
We’ll use this private key throughout the article to derive both a public key and the address for the Bitcoin wallet.
What we want to do is to apply a series of conversions to the private key to get a public key and then a wallet address. Most of these conversions are called hash functions. These hash functions are one-way conversions that can’t be reversed. We won’t go to the mechanics of the functions themselves — there are plenty of great articles that cover that. Instead, we will look at how using these functions in the correct order can lead you to the Bitcoin wallet address that you can use.

### Elliptic Curve Cryptography
The first thing we need to do is to apply the ECDSA or Elliptic Curve Digital Signature Algorithm to our private key. An elliptic curve is a curve defined by the equation 
`y² = x³ + ax + b`
 with a chosen 
`a`
 and 
`b`
 . There is a whole family of such curves that are widely known and used. Bitcoin uses the 
**secp256k1**
 curve. If you want to learn more about Elliptic Curve Cryptography, I’ll refer you to 
[this article](https://hackernoon.com/what-is-the-math-behind-elliptic-curve-cryptography-f61b25253da3)
 .


By applying the ECDSA to the private key, we get a 64-byte integer. This consists of two 32-byte integers that represent the X and Y of the point on the elliptic curve, concatenated together.
For our example, we got: 
`1e7bcc70c72770dbb72fea022e8a6d07f814d2ebe4de9ae3f7af75bf706902a7b73ff919898c836396a6b0c96812c3213b99372050853bd1678da0ead14487d7`
 .
In Python, it would look like this:

```
private_key_bytes = codecs.decode(private_key, ‘hex’)
## Get ECDSA public key
key = ecdsa.SigningKey.from_string(private_key_bytes, curve=ecdsa.SECP256k1).verifying_key
key_bytes = key.to_string()
key_hex = codecs.encode(key_bytes, ‘hex’)
```


Note: as you can see from the code, before I used a method from the 
`ecdsa`
 module, I decoded the private key using 
`codecs`
 . This is relevant more to the Python and less to the algorithm itself, but I will explain what are we doing here to remove possible confusion.
In Python, there are at least two classes that can keep the private and public keys: “str” and “bytes”. The first is a string and the second is a byte array. Cryptographic methods in Python work with a “bytes” class, taking it as input and returning it as the result.
Now, there’s a little catch: a string, say, 
`4f3c`
 does not equal the byte array 
`4f3c`
 , it equals the byte array with two elements, 
`O<`
 . And that’s what 
`codecs.decode`
 method does: it converts a string into a byte array. That will be the same for all cryptographic manipulations that we’ll do in this article.

### Public key
Once we’re done with the ECDSA, all we need to do is to add the bytes 
`0x04`
 at the start of our public key. The result is a Bitcoin full public key, which is equal to: 
`041e7bcc70c72770dbb72fea022e8a6d07f814d2ebe4de9ae3f7af75bf706902a7b73ff919898c836396a6b0c96812c3213b99372050853bd1678da0ead14487d7`
 for us.

### Compressed public key
But we can do better. As you might remember, the public key is some point (X, Y) on the curve. We know the curve, and for each X there are only two Ys that define the point which lies on that curve. So why keep Y? Instead, let’s keep X and the sign of Y. Later, we can derive Y from that if needed.
The specifics are as follows: we take X from the ECDSA public key. Now, we add the 
`0x02`
 if the last byte of Y is even, and the byte 
`0x03`
 if the last byte is odd.
In our case, the last byte is odd, so we add 
`0x03`
 to get the compressed public key: 
`031e7bcc70c72770dbb72fea022e8a6d07f814d2ebe4de9ae3f7af75bf706902a7`
 . This key contains the same information, but it’s almost twice as short as the uncompressed key. Cool!
Previously, wallet software used long, full versions of public keys, but now most of it has switched to compressed keys.

### Encrypting the public key
From now on, we need to make a wallet address. Whatever method of getting the public key you choose, it goes through the same procedure. Obviously, the addresses will differ. In this article, we will go with the compressed version.
What we need to do here is to apply SHA-256 to the public key, and then apply RIPEMD-160 to the result. The order is important.
SHA-256 and RIPEMD-160 are two hash functions, and again, we won’t go into the details of how they work. What matters is that now we have 160-bit integer, which will be used for further modifications. Let’s call that an encrypted public key. For our example, the encrypted public key is 
`453233600a96384bb8d73d400984117ac84d7e8b`
 .

![](https://ipfs.infura.io/ipfs/QmSSGzBbPBp1QsTypEYbE9o5Sv6s9WmkPMtjHMaarfkKm5)

Here’s how we encrypt the public key in Python:

```
public_key_bytes = codecs.decode(public_key, ‘hex’)
## Run SHA-256 for the public key
sha256_bpk = hashlib.sha256(public_key_bytes)
sha256_bpk_digest = sha256_bpk.digest()
## Run RIPEMD-160 for the SHA-256
ripemd160_bpk = hashlib.new(‘ripemd160’)
ripemd160_bpk.update(sha256_bpk_digest)
ripemd160_bpk_digest = ripemd160_bpk.digest()
ripemd160_bpk_hex = codecs.encode(ripemd160_bpk_digest, ‘hex’)
```



### Adding the network byte
The Bitcoin has two networks, main and test. The main network is the network that all people use to transfer the coins. The test network was created — you guessed it — to test new features and software.
We want to generate an address to use it on the mainnet, so we need to add 
`0x00`
 bytes to the encrypted public key. The result is 
`00453233600a96384bb8d73d400984117ac84d7e8b`
 . For the testnet, that would be 
`0x6f`
 bytes.

### Checksum
Now we need to calculate the checksum of our mainnet key. The idea of checksum is to make sure that the data (in our case, the key) wasn’t corrupted during transmission. The wallet software should look at the checksum and mark the address as invalid if the checksum mismatches.
To calculate the checksum of the key, we need to apply SHA-256 twice and then take first 4 bytes of the result. For our example, the double SHA-256 is 
`512f43c48517a75e58a7ec4c554ecd1a8f9603c891b46325006abf39c5c6b995`
 and therefore the checksum is 
`512f43c4`
 (note that 4 bytes is 8 hex digits).

![](https://ipfs.infura.io/ipfs/QmXFeBtrFx3tjimVkCySq8T8whREL9NvbUXqx64b3kMcAF)

The code to calculate an address checksum is the following:

```
## Double SHA256 to get checksum
sha256_nbpk = hashlib.sha256(network_bitcoin_public_key_bytes)
sha256_nbpk_digest = sha256_nbpk.digest()
sha256_2_nbpk = hashlib.sha256(sha256_nbpk_digest)
sha256_2_nbpk_digest = sha256_2_nbpk.digest()
sha256_2_hex = codecs.encode(sha256_2_nbpk_digest, ‘hex’)
checksum = sha256_2_hex[:8]
```



### Getting the address
Finally, to make an address, we just concatenate the mainnet key and the checksum. That makes it 
`00453233600a96384bb8d73d400984117ac84d7e8b512f43c4`
 for our example.
That’s it! That’s the wallet address for the private key at the start of the article.
But you may notice that something is off. You’ve probably seen a handful of Bitcoin addresses and they didn’t look like that. Well, the reason is that they are encoded with 
[Base58](https://en.wikipedia.org/wiki/Base58)
 . It’s a little bit odd.

Here’s the algorithm to convert a hex address to the Base58 address:

```
def base58(address_hex):
    alphabet = ‘123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz’
    b58_string = ‘’
    # Get the number of leading zeros
    leading_zeros = len(address_hex) — len(address_hex.lstrip(‘0’))
    # Convert hex to decimal
    address_int = int(address_hex, 16)
    # Append digits to the start of string
    while address_int > 0:
        digit = address_int % 58
        digit_char = alphabet[digit]
        b58_string = digit_char + b58_string
        address_int //= 58
    # Add ‘1’ for each 2 leading zeros
    ones = leading_zeros // 2
    for one in range(ones):
        b58_string = ‘1’ + b58_string
    return b58_string
```


What we get is 
`17JsmEygbbEUEpvt4PFtYaTeSqfb9ki1F1`
 , a compressed Bitcoin wallet address.

![](https://ipfs.infura.io/ipfs/QmfSVZwHq9DKyaA2aCre37seyd4qiV4D9SUzo8rVimmzsq)


### Conclusion
The wallet key generation process can be split into four steps:



 * creating a public key with ECDSA

 * encrypting the key with SHA-256 and RIPEMD-160

 * calculating the checksum with double SHA-256

 * encoding the key with Base58.
Depending on the form of public key (full or compressed), we get different addresses, but both are perfectly valid.
Here’s the full algorithm for the uncompressed public key:

![](https://ipfs.infura.io/ipfs/QmUbtbDaxnBNy4o8a8p4ZwBpU9Sq7gMhsmqodgUw8S8EyL)

If you want to play with the code, I published it to the 
[Github repository](https://github.com/Destiner/blocksmith)
 .

----

I also post random thoughts about crypto on  [Twitter](https://twitter.com/DestinerX), so you might want to check it out.




---

- **Kauri original title:** How to create a Bitcoin wallet address from a private key
- **Kauri original link:** https://kauri.io/how-to-create-a-bitcoin-wallet-address-from-a-priv/ffe6e5525f2c43ed81e89af3c22228d8/a
- **Kauri original author:** Timur Badretdinov (@destiner)
- **Kauri original Publication date:** 2018-11-29
- **Kauri original tags:** none
- **Kauri original hash:** QmapZoJSXZJCo8YbLAW5qeeNQRtaw1HgbYBGjGfPPiDXGL
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



