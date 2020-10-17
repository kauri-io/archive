---
title: LightSig
summary: LightSig A more secure and efficient MultiSig for Ethereum James Poole, Greg Prouty poole_party Existing Multisig contracts are being used that have 2 problems. First, the contracts unnecessarily use the blockchain as a database to store proposed transactions that are being approved by the owners of the wallet, causing many ETH transactions on chain to move funds. Second, the contracts expose management functions that increase the risk of a security vulnerability. By taking the signature process
authors:
  - Poole Party (@poole-party)
date: 2019-02-17
some_url: 
---

# LightSig



# LightSig


# A more secure and efficient MultiSig for Ethereum


# James Poole, Greg Prouty


# poole_party


# Existing Multisig contracts are being used that have 2 problems.  First, the contracts unnecessarily use the blockchain as a database to store proposed transactions that are being approved by the owners of the wallet, causing many ETH transactions on chain to move funds.  Second, the contracts expose management functions that increase the risk of a security vulnerability.  By taking the signature process off-chain and removing all administrative functions in the smart contract, LightSig creates a more usable and safer alternative.


# A solidity smart contract is the base of the project.  To interact with the smarty contract, we are using a mobile wallet based on React Native.


# Open


# https://github.com/tokensoft/lightsig




