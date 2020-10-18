---
title: Generating a load of keys for testing in Go
summary: I am in the process of releasing my very hacky golang test environment that deep links into the go-ethereum code base. An important part of testing smart contracts is to be able to generate and use an arbitrary number of keys/addresses to sign / send / receive transactions. Ideally we should not be using live key pairs so I created memorykeys which you can find at https-//github.com/DaveAppleton/memorykeys Much of the work of the GETH crypto module is to wrap the go crypto/ecdsa library. ECDSA s
authors:
  - Dave Appleton (@daveappleton)
date: 2019-08-08
some_url: 
---

# Generating a load of keys for testing in Go


I am in the process of releasing my very "hacky" golang test environment that deep links into the go-ethereum code base.

An important part of testing smart contracts is to be able to generate and use an arbitrary number of keys/addresses to sign / send / receive transactions. Ideally we should not be using live key pairs so I created **memorykeys** which you can find at https://github.com/DaveAppleton/memorykeys

Much of the work of the GETH crypto module is to wrap the go crypto/ecdsa library. ECDSA stands for Elliptic Curve Digital Signing Algorithm. GETH's crypto library's job is to select the correct parameters to feed into go's ecdsa library. For example, creating a key simply calls GETH/crypto's GenerateKey function which in turn just selects the parameters for go's crypto/ecdsa module. GETH implements it like this :

```
func GenerateKey() (*ecdsa.PrivateKey, error) {
	return ecdsa.GenerateKey(S256(), rand.Reader)
}
```

S256() is a function that returns the elliptic curve used for encryption, the other parameter is to provide a good random number generator to ensure that your private key is not guessable. As a matter of interest, GETH links to two different versions of the curve, one which uses machine dependent calls for higher performance and the other written entirely in go for portability.

The ecdsa module returns us the public key but most of the time we want the ethereum address not the public key. Again GETH's crypto library implements this for us

```
func PubkeyToAddress(p ecdsa.PublicKey) common.Address {
	pubBytes := FromECDSAPub(&p)
	return common.BytesToAddress(Keccak256(pubBytes[1:])[12:])
}
```

Where `FromECDSAPub()` extracts the public key.

You will find that slowly exploring GETH's crypto library gives non cryptographers (like me) a bit of insight of what is happening without overloading your brain.

Thanks to Jeff Wilke for pointing me to the go-ethereum crypto module back in 2015 when I first asked about keys and signing.

**Objectives of this library**

This library is designed to help us to generate and use keys on an ad-hoc basis without storing them for re-use on a subsequent run. 

We reference these keys by name and obtain

- the private key (for signing)
- a transaction object encapsulating that key for future use with ABIGEN
- the address

**Restrictions**

It is not expected to be necessary for concurrent creation of keys so keys are stored in a map which is not safe for concurrent writes.

**Functions**

`GetPrivateKey(keyname)` create a keypair associated with the name on first call, subsequent calls return the previous value.

```

   launcher,err := memorykeys.GetPrivateKey("launcher")

```

`GetAddress(keyName string)` gets the address associated with a key. Creates the key if it does not exist

```

   recipient,err := GetAddress("recipient")

```

`GetTransactor(keyName string)` gets a transaction object for use with ABIGEN objects. Creates the key if necessary.

```

   deployer, err := GetTransactor("deployer")

```

`ImportPrivateKey(keyName, hexKey)` imports a hex encoded private key for use. **BE CAREFUL NOT TO USE PRODUCTION KEYS**

```
    privateKey := "d31a46c5322e8e8a7e11f51cf9c4073fea42d33b431b5e7e76a82518fc178ea8"
    key, err := ImportPrivateKey("imported", privateKey)
        
```





---

- **Kauri original link:** https://kauri.io/generating-a-load-of-keys-for-testing-in-go/7a0c7497951548b8837634305e62977b/a
- **Kauri original author:** Dave Appleton (@daveappleton)
- **Kauri original Publication date:** 2019-08-08
- **Kauri original tags:** ethereum, geth, go-programming-language, golang, testing
- **Kauri original hash:** QmYeFYYmS8usAkaJxF31ojgHLvwE7ZnNviSQbB1YK7juE4
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



