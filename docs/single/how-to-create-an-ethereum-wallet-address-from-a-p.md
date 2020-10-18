---
title: How to create an Ethereum wallet address from a private key
summary: In the first article of this series, we generated a bitcoin private key- 60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2. Here, we’ll use that key to get the public address and then the Ethereum wallet address of that private key. Creating the Bitcoin wallet address from the private key is a bit complicated. Here, the process will be much simpler. We need to apply one hash function to get the public key and another one to get the address. So let’s get started. Public key This pa
authors:
  - Timur Badretdinov (@destiner)
date: 2018-11-29
some_url: 
---

# How to create an Ethereum wallet address from a private key



----


![](https://ipfs.infura.io/ipfs/QmPjsFF2FDEQc8fqQBG4rMUsMCaXmHgigUhgKpb1GXUXMV)

In 
[the first article](https://medium.freecodecamp.org/how-to-generate-your-very-own-bitcoin-private-key-7ad0f4936e6c)
 of this series, we generated a bitcoin private key: 
`60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2`.

Here, we’ll use that key to get the public address and then the Ethereum wallet address of that private key.
Creating the Bitcoin wallet address from the private key is a bit complicated. Here, the process will be much simpler. We need to apply one hash function to get the public key and another one to get the address.
So let’s get started.

### Public key
This part is almost identical to what we discussed in the 
[Bitcoin article](https://medium.freecodecamp.org/how-to-create-a-bitcoin-wallet-address-from-a-private-key-eca3ddd9c05f)
 , so if you read that one, you can skip it (unless you need a refresher).

The first thing we need to go is to apply the ECDSA, or Elliptic Curve Digital Signature Algorithm, to our private key. An elliptic curve is a curve defined by the equation 
`y² = x³ + ax + b`
 with chosen 
`a`
 and 
`b`
 . There is a whole family of such curves that are widely known and used. Bitcoin uses the 
**secp256k1**
 curve. If you want to learn more about Elliptic Curve Cryptography, I’ll refer you to 
[this article](https://hackernoon.com/what-is-the-math-behind-elliptic-curve-cryptography-f61b25253da3)
 .

Ethereum uses the same elliptic curve, 
**secp256k1**
 , so the process to get the public key is identical in both cryptocurrencies.
By applying the ECDSA to the private key, we get a 64-byte integer, which is two 32-byte integers that represent X and Y of the point on the elliptic curve, concatenated together.
For our example, we got 
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


Note: as you can see from the code above, I used a method from the 
`ecdsa`
 module and I decoded the private key using 
`codecs`
 . This is relevant more to the Python and less to the algorithm itself, but I will explain what are we doing here to remove possible confusion.
In Python, there are at least two classes that can keep the private and public keys: “str” and “bytes”. The first is a string and the second is a byte array. Cryptographic methods in Python work with a “bytes” class, taking it as input and returning it as the result.
Now, there’s a little catch: a string, say, 
`4f3c`
 does not equal the byte array 
`4f3c`
 . Rather, it equals the byte array with two elements, 
`O<`
 . And that’s what the 
`codecs.decode`
 method does: it converts a string into a byte array. This will be the same for all cryptographic manipulations that we’ll do in this article.

### Wallet address
Once we’ve gotten the public key, we can calculate the address. Now, unlike Bitcoin, Ethereum has the same addresses on both the main and all test networks. Users specify the network that they want to use later in the process when they make and sign a transaction.
To make an address from the public key, all we need to do is to apply Keccak-256 to the key and then take the last 20 bytes of the result. And that’s it. No other hash functions, no Base58 or any other conversion. The only thing you need is to add ‘0x’ at the start of the address.
Here’s the Python code:

```
public_key_bytes = codecs.decode(public_key, ‘hex’)
keccak_hash = keccak.new(digest_bits=256)
keccak_hash.update(public_key_bytes)
keccak_digest = keccak_hash.hexdigest()
## Take the last 20 bytes
wallet_len = 40
wallet = ‘0x’ + keccak_digest[-wallet_len:]
```



### Checksum
Now, as you may remember, Bitcoin creates the checksum by hashing the public key and taking the first 4 bytes of the result. This is true for all Bitcoin addresses, so you can’t get the valid address without adding the checksum bytes.
In Ethereum, that’s not how things work. Initially, there were no checksum mechanisms to validate the integrity of the key. However, in 2016, Vitalik Buterin 
[introduced](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
 a checksum mechanism, which has since been adopted by wallets and exchanges.

Adding a checksum to the Ethereum wallet address makes it case-sensitive.
First, you need to get the Keccak-256 hash of the address. Note that this address should be passed to the hash function without the 
`0x`
 part.
Second, you iterate over the characters of the initial address. If the 
_i_
 th byte of the hash is greater than or equal to 8, you convert the 
_i_
 th address’s character to uppercase, otherwise you leave it lowercase.
Finally, you add 
`0x`
 back at the start of the resulting string. The checksum address is the same as the initial one if you ignore the case. But the uppercase letters let anyone check that the address is indeed valid. You can find the algorithm of the checksum validation at the 
[page linked here](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
 .

As you’ll read in the proposal, for this checksum scheme, “on average there will be 15 check bits per address, and the net probability that a randomly generated address if mistyped will accidentally pass a check is 0.0247%.”

And here’s the code to add checksum to the Ethereum address:

```
checksum = ‘0x’
## Remove ‘0x’ from the address
address = address[2:]
address_byte_array = address.encode(‘utf-8’)
keccak_hash = keccak.new(digest_bits=256)
keccak_hash.update(address_byte_array)
keccak_digest = keccak_hash.hexdigest()
for i in range(len(address)):
    address_char = address[i]
    keccak_char = keccak_digest[i]
    if int(keccak_char, 16) >= 8:
        checksum += address_char.upper()
    else:
        checksum += str(address_char)
```



### Conclusion
As you can see, creating an address for Ethereum is much simpler than for Bitcoin. All we need to do is to apply the ECDSA to public key, then apply Keccak-256, and finally take the last 20 bytes of that hash.

![](https://ipfs.infura.io/ipfs/QmWDnVCb5rQLUQwcggjQcLQnB1vAckGnPUNquo6z92LS3Z)

If you want to play with the code, I published it to the 
[GitHub repository](https://github.com/Destiner/blocksmith).

----

I also post random thoughts about crypto on 
[Twitter](https://twitter.com/DestinerX), so you might want to check it out.



---

- **Kauri original link:** https://kauri.io/how-to-create-an-ethereum-wallet-address-from-a-p/e464ca2b043a4d2e9e30b01b092dfa13/a
- **Kauri original author:** Timur Badretdinov (@destiner)
- **Kauri original Publication date:** 2018-11-29
- **Kauri original tags:** none
- **Kauri original hash:** QmSVudzGkE4wLw6ppThaTtHGeHnzfaVte9uPaWCxzwybfa
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



