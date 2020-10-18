---
title: Creating a Web3j Wallet from a Mnemonic Code (Seed Phrase)
summary: Deriving a private key from a mnemonic code or sentence (often called a seed phrase) is a very common way to generate an Ethererum wallet. These seed phrases ar
authors:
  - Craig Williams (@craig)
date: 2019-12-18
some_url: 
---

# Creating a Web3j Wallet from a Mnemonic Code (Seed Phrase)

![](https://ipfs.infura.io/ipfs/QmVcCJjgrbAZtYpnW1RUxseU6meWGsyPbpD3U1ehKX8X3T)


Deriving a private key from a mnemonic code or sentence (often called a seed phrase) is a very common way to generate an Ethererum wallet.  These seed phrases are usually 12 to 24 words long.  As you would expect, web3j provides some tools to allow you to achieve this task in your java code.

### Wallet Generation with Default Derivation Path

The default derivation path used by web3j is `m/44'/60'/0'/1`.

``` java
// Web3j supports mnemonic encryption.  No encryption in this example
String password = null;
String mnemonic = "snap escape shadow school illness flip hollow label melt fetch noise install";

// A Credentials object is essentially your wallet, and can be used throughout web3j
// to interact with the Ethereum blockchain with a specific account
Credentials credentials = WalletUtils.loadBip39Credentials(password, mnemonic);
```

### Wallet Generation with Custom Derivation Path

This example creates a private key and credentials with a derivation path of `m/44'/60'/0'/0`.

``` java
String mnemonic = "snap escape shadow school illness flip hollow label melt fetch noise install";

//m/44'/60'/0'/0 derivation path
int[] derivationPath = {44 | Bip32ECKeyPair.HARDENED_BIT, 60 | Bip32ECKeyPair.HARDENED_BIT, 0 | Bip32ECKeyPair.HARDENED_BIT, 0,0};

// Generate a BIP32 master keypair from the mnemonic phrase
Bip32ECKeyPair masterKeypair = Bip32ECKeyPair.generateKeyPair(MnemonicUtils.generateSeed(mnemonic, password));

// Derive the keypair using the derivation path
Bip32ECKeyPair  derivedKeyPair = Bip32ECKeyPair.deriveKeyPair(masterKeypair, derivationPath);

// Load the wallet for the derived keypair
Credentials credentials = Credentials.create(derivedKeyPair);
```

Thanks to Greg Jeanmart and his excellent article: [Manage An Ethereum Account with Java and Web3j](https://www.kauri.io/manage-an-ethereum-account-with-java-and-web3j/925d923e12c543da9a0a3e617be963b4/a).


---

- **Kauri original title:** Creating a Web3j Wallet from a Mnemonic Code (Seed Phrase)
- **Kauri original link:** https://kauri.io/creating-a-web3j-wallet-from-a-mnemonic-code-(see/a33a03fb66d14920896bb3e7ab77fba7/a
- **Kauri original author:** Craig Williams (@craig)
- **Kauri original Publication date:** 2019-12-18
- **Kauri original tags:** ethereum, java, wallet, web3j, mnemonic
- **Kauri original hash:** QmRk5XMxUgRZAJ3JDxMAauFyZSAEhVtPMCTH4TW6pAZuqY
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



