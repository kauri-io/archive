---
title: How to generate your very own Bitcoin private key
summary: In cryptocurrencies, a private key allows a user to gain access to their wallet. The person who holds the private key fully controls the coins in that wallet. For this reason, you should keep it secret. And if you really want to generate the key yourself, it makes sense to generate it in a secure way. Here, I will provide an introduction to private keys and show you how you can generate your own key using various cryptographic functions. I will provide a description of the algorithm and the code
authors:
  - Timur Badretdinov (@destiner)
date: 2018-11-29
some_url: 
---

# How to generate your very own Bitcoin private key



----


![](https://api.beta.kauri.io:443/ipfs/QmStJy3DeoTjssW4ndvjYTUdJB3jrd1KBkt6jwr9mrV9Jz)

In cryptocurrencies, a private key allows a user to gain access to their wallet. The person who holds the private key fully controls the coins in that wallet. For this reason, you should keep it secret. And if you really want to generate the key yourself, it makes sense to generate it in a secure way.
Here, I will provide an introduction to private keys and show you how you can generate your own key using various cryptographic functions. I will provide a description of the algorithm and the code in Python.

### Do I need to generate a private key?
Most of the time you don’t. For example, if you use a web wallet like Coinbase or Blockchain.info, they create and manage the private key for you. It’s the same for exchanges.
Mobile and desktop wallets usually also generate a private key for you, although they might have the option to create a wallet from your own private key.
So why generate it anyway? Here are the reasons that I have:



 * You want to make sure that no one knows the key

 * You just want to learn more about cryptography and random number generation (RNG)

### What exactly is a private key?
Formally, a private key for Bitcoin (and many other cryptocurrencies) is a series of 32 bytes. Now, there are many ways to record these bytes. It can be a string of 256 ones and zeros (32 * 8 = 256) or 100 dice rolls. It can be a binary string, Base64 string, a 
[WIF key](https://en.bitcoin.it/wiki/Wallet_import_format)
 , 
[mnemonic phrase](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 , or finally, a hex string. For our purposes, we will use a 64 character long hex string.

![](https://api.beta.kauri.io:443/ipfs/QmQgy8nTGLRkkRGPhzuwbS8vjxz3219Y4Z42abbtEiz1mE)

Why exactly 32 bytes? Great question! You see, to create a public key from a private one, Bitcoin uses the 
**ECDSA**
 , or Elliptic Curve Digital Signature Algorithm. More specifically, it uses one particular curve called 
**secp256k1**
 .
Now, this curve has an order of 256 bits, takes 256 bits as input, and outputs 256-bit integers. And 256 bits is exactly 32 bytes. So, to put it another way, we need 32 bytes of data to feed to this curve algorithm.
There is an additional requirement for the private key. Because we use ECDSA, the key should be positive and should be less than the order of the curve. The order of secp256k1 is 
`FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`
 , which is pretty big: almost any 32-byte number will be smaller than it.

### Naive method
So, how do we generate a 32-byte integer? The first thing that comes to mind is to just use an RNG library in your language of choice. Python even provides a cute way of generating just enough bits:

```
import random
bits = random.getrandbits(256)
## 30848827712021293731208415302456569301499384654877289245795786476741155372082
bits_hex = hex(bits)
## 0x4433d156e8c53bf5b50af07aa95a29436f29a94e0ccc5d58df8e57bdc8583c32
private_key = bits_hex[2:]
## 4433d156e8c53bf5b50af07aa95a29436f29a94e0ccc5d58df8e57bdc8583c32
```


Looks good, but actually, it’s not. You see, normal RNG libraries are not intended for cryptography, as they are not very secure. They generate numbers based on a seed, and by default, the seed is the current time. That way, if you know approximately when I generated the bits above, all you need to do is brute-force a few variants.
When you generate a private key, you want to be extremely secure. Remember, if anyone learns the private key, they can easily steal all the coins from the corresponding wallet, and you have no chance of ever getting them back.
So let’s try to do it more securely.

### Cryptographically strong RNG
Along with a standard RNG method, programming languages usually provide a RNG specifically designed for cryptographic operations. This method is usually much more secure, because it draws entropy straight from the operating system. The result of such RNG is much harder to reproduce. You can’t do it by knowing the time of generation or having the seed, because there is no seed. Well, at least the user doesn’t enter a seed — rather, it’s created by the program.
In Python, cryptographically strong RNG is implemented in the 
`secrets`
 module. Let’s modify the code above to make the private key generation secure!

```
import secrets
bits = secrets.randbits(256)
## 46518555179467323509970270980993648640987722172281263586388328188640792550961
bits_hex = hex(bits)
## 0x66d891b5ed7f51e5044be6a7ebe4e2eae32b960f5aa0883f7cc0ce4fd6921e31
private_key = bits_hex[2:]
## 66d891b5ed7f51e5044be6a7ebe4e2eae32b960f5aa0883f7cc0ce4fd6921e31
```


That is amazing. I bet you wouldn’t be able to reproduce this, even with access to my PC. But can we go deeper?

### Specialized sites
There are sites that generate random numbers for you. We will consider just two here. One is 
[random.org](https://random.org)
 , a well-known general purpose random number generator. Another one is 
[bitaddress.org](https://bitaddress.org)
 , which is designed specifically for Bitcoin private key generation.


Can 
[random.org](https://random.org)
 help us generate a key? Definitely, as they have 
[service](https://www.random.org/bytes)
 for generating random bytes. But two problems arise here. 
[Random.org](https://random.org)
 claims to be a truly random generator, but can you trust it? Can you be sure that it is indeed random? Can you be sure that the owner doesn’t record all generation results, especially ones that look like private keys? The answer is up to you. Oh, and you can’t run it locally, which is an additional problem. This method is not 100% secure.

Now, 
[bitaddress.org](https://bitaddress.org)
 is a whole different story. It’s open source, so you can see what’s under its hood. It’s client-side, so you can download it and run it locally, even without an Internet connection.

So how does it work? It uses you — yes, you — as a source of entropy. It asks you to move your mouse or press random keys. You do it long enough to make it infeasible to reproduce the results.

![](https://api.beta.kauri.io:443/ipfs/QmeXBer1XCFMsa1jAWMEmMPsxyADT4q6WyT9ib1ro85ApX)

Are you interested to see how 
[bitaddress.org](https://bitaddress.org)
 works? For educational purposes, we will look at its code and try to reproduce it in Python.

> Quick note: bitaddress.org gives you the private key in a compressed WIF format, which is close to the WIF format that we discussed before. For our purposes, we will make the algorithm return a hex string so that we can use it later for a public key generation.
 

### Bitaddress: the specifics
Bitaddress creates the entropy in two forms: by mouse movement and by key pressure. We’ll talk about both, but we’ll focus on the key presses, as it’s hard to implement mouse tracking in the Python lib. We’ll expect the end user to type buttons until we have enough entropy, and then we’ll generate a key.
Bitaddress does three things. It initializes byte array, trying to get as much entropy as possible from your computer, it fills the array with the user input, and then it generates a private key.
Bitaddress uses the 256-byte array to store entropy. This array is rewritten in cycles, so when the array is filled for the first time, the pointer goes to zero, and the process of filling starts again.
The program initiates an array with 256 bytes from 
[window.crypto](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto)
 . Then, it writes a timestamp to get an additional 4 bytes of entropy. Finally, it gets such data as the size of the screen, your time zone, information about browser plugins, your locale, and more. That gives it another 6 bytes.


After the initialization, the program continually waits for user input to rewrite initial bytes. When the user moves the cursor, the program writes the position of the cursor. When the user presses buttons, the program writes the char code of the button pressed.
Finally, bitaddress uses accumulated entropy to generate a private key. It needs to generate 32 bytes. For this task, bitaddress uses an RNG algorithm called ARC4. The program initializes ARC4 with the current time and collected entropy, then gets bytes one by one 32 times.
This is all an oversimplification of how the program works, but I hope that you get the idea. You can check out the algorithm in full detail on 
[Github](https://github.com/pointbiz/bitaddress.org)
 .
> 

### Doing it yourself
For our purposes, we’ll build a simpler version of bitaddress. First, we won’t collect data about the user’s machine and location. Second, we will input entropy only via text, as it’s quite challenging to continually receive mouse position with a Python script (check 
[PyAutoGUI](https://github.com/asweigart/pyautogui)
 if you want to do that).

That brings us to the formal specification of our generator library. First, it will initialize a byte array with cryptographic RNG, then it will fill the timestamp, and finally it will fill the user-created string. After the seed pool is filled, the library will let the developer create a key. Actually, they will be able to create as many private keys as they want, all secured by the collected entropy.

#### Initializing the pool
Here we put some bytes from cryptographic RNG and a timestamp. 
`__seed_int`
 and 
`__seed_byte`
 are two helper methods that insert the entropy into our pool array. Notice that we use 
`secrets`
 .

```
def __init_pool(self):
    for i in range(self.POOL_SIZE):
        random_byte = secrets.randbits(8)
        self.__seed_byte(random_byte)
    time_int = int(time.time())
    self.__seed_int(time_int)
```



```
def __seed_int(self, n):
    self.__seed_byte(n)
    self.__seed_byte(n >> 8)
    self.__seed_byte(n >> 16)
    self.__seed_byte(n >> 24)
```



```
def __seed_byte(self, n):
    self.pool[self.pool_pointer] ^= n & 255
    self.pool_pointer += 1
    if self.pool_pointer >= self.POOL_SIZE:
        self.pool_pointer = 0
```



#### Seeding with input
Here we first put a timestamp and then the input string, character by character.

```
def seed_input(self, str_input):
    time_int = int(time.time())
    self.__seed_int(time_int)
    for char in str_input:
        char_code = ord(char)
        self.__seed_byte(char_code)
```



#### Generating the private key
This part might look hard, but it’s actually very simple.
First, we need to generate 32-byte number using our pool. Unfortunately, we can’t just create our own 
`random`
 object and use it only for the key generation. Instead, there is a shared object that is used by any code that is running in one script.
What does that mean for us? It means that at each moment, anywhere in the code, one simple 
`random.seed(0)`
 can destroy all our collected entropy. We don’t want that. Thankfully, Python provides 
`getstate`
 and 
`setstate`
 methods. So, to save our entropy each time we generate a key, we remember the state we stopped at and set it next time we want to make a key.
Second, we just make sure that our key is in range (1, 
`CURVE_ORDER`
 ). This is a requirement for all ECDSA private keys. The 
`CURVE_ORDER`
 is the order of the secp256k1 curve, which is 
`FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`
 .
Finally, for convenience, we convert to hex, and strip the ‘0x’ part.

```
def generate_key(self):
    big_int = self.__generate_big_int()
    big_int = big_int % (self.CURVE_ORDER — 1) # key < curve order
    big_int = big_int + 1 # key > 0
    key = hex(big_int)[2:]
    return key
```



```
def __generate_big_int(self):
    if self.prng_state is None:
    seed = int.from_bytes(self.pool, byteorder=’big’, signed=False)
    random.seed(seed)
    self.prng_state = random.getstate()
    random.setstate(self.prng_state)
    big_int = random.getrandbits(self.KEY_BYTES * 8)
    self.prng_state = random.getstate()
    return big_int
```



#### In action
Let’s try to use the library. Actually, it’s really simple: you can generate a private key in three lines of code!

```
kg = KeyGenerator()
kg.seed_input(‘Truly random string. I rolled a dice and got 4.’)
kg.generate_key()
## 60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2
```


You can see it yourself. The key is random and totally valid. Moreover, each time you run this code, you get different results.

### Conclusion
As you can see, there are a lot of ways to generate private keys. They differ in simplicity and security.
Generating a private key is only a first step. The next step is extracting a public key and a wallet address that you can use to receive payments. The process of generating a wallet differs for Bitcoin and Ethereum, and I plan to write two more articles on that topic.
If you want to play with the code, I published it to this 
[Github repository](https://github.com/Destiner/blocksmith).


----
 
_I also post random thoughts about crypto on [Twitter](https://twitter.com/DestinerX), so you might want to check it out._
 
