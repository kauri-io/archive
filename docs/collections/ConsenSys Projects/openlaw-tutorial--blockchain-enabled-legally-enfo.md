---
title: OpenLaw Tutorial  Blockchain-Enabled, Legally Enforceable Smart Contracts
summary: By- Michael Rice In this article, we’ll explore how to use the OpenLaw Core to create a blockchain-based, legally enforceable smart contract. We’ll start by explaining how to create a legal contract on OpenLaw. Then we’ll demonstrate how OpenLaw can facilitate the signature process and store evidence of the agreement on the blockchain. Lastly, we’ll explore how that contract can further interact with a blockchain through a smart contract. What is OpenLaw? OpenLaw is a blockchain-based protocol f
authors:
  - Priyanka Desai (@priyanka-desai)
date: 2018-12-04
some_url: 
---

# OpenLaw Tutorial  Blockchain-Enabled, Legally Enforceable Smart Contracts


By: Michael Rice

In this article, we’ll explore how to use the 
[OpenLaw](https://openlaw.io/)
 Core to create a blockchain-based, legally enforceable smart contract. We’ll start by explaining how to create a legal contract on OpenLaw. Then we’ll demonstrate how OpenLaw can facilitate the signature process and store evidence of the agreement on the blockchain. Lastly, we’ll explore how that contract can further interact with a blockchain through a smart contract.

### What is OpenLaw?
OpenLaw is a blockchain-based protocol for the creation and execution of legal agreements. Our aim is to comprehensively stitch together traditional legal agreements with blockchain-based smart contracts in a user-friendly (through our 
[markup language](https://docs.openlaw.io/markup-language/#variables)
 ) and legally compliant manner. Using OpenLaw, users can more efficiently engage in transactional work and digitally sign and store legal agreements in a highly secure manner, all while leveraging next generation blockchain-based smart contracts.

#### Prerequisites
This tutorial assumes the following:
1. You have an OpenLaw account. If you don’t already have one, you can 
[sign up for a free account](https://app.openlaw.io/signup)
 at OpenLaw.io.
2. You have some experience developing smart contracts using the Solidity programming language.
3. You have the tooling in place to develop smart contracts, such as 
[MetaMask](https://metamask.io)
 or the 
[Mist Wallet](https://github.com/ethereum/mist)
 and understand how to develop code locally or via an online development tool such as 
[Remix](https://remix.ethereum.org/)
 .

### Creating a Legally Enforceable Contract with OpenLaw’s Markup Language
In OpenLaw, the first step is to create (or reuse) a legally enforceable contract. A contract is created by first writing a template. Templates contain natural language, such as legal terms and conditions of the agreement between the parties, as well as 
[markup tags](https://docs.openlaw.io/markup-language/)
 . OpenLaw uses common, well-known markup tag syntax as well as some special tags, which are specific to our protocol. Once the template has been defined, a draft of the contract can be sent to the parties to electronically sign the contract. Evidence of the signature and the agreement will be memorialized on the blockchain once executed.

#### Start with a Blank Document
Normally, contract professionals start with an example and then tailor it to meet the needs of the parties. In this tutorial, however, we will start from scratch to show you how to construct a template using the powerful OpenLaw markup language.

![](https://ipfs.infura.io/ipfs/QmTKbRkaFrEiCfr3c4zSqXXg1AXD4mtuEt39JKCWQJoVZ3)


![](https://ipfs.infura.io/ipfs/QmbxRQUkWKZPhHMigdMFKP4t4EXApXkr9TvFrZ8jwbY8SC)


#### Creating a Legal Document
In this tutorial, we’ll write up a legal contract where a buyer will buy a Volkswagen bus from a seller for 200 ether (a cryptocurrency on the Ethereum blockchain). A traditional paper-based agreement to support this commercial transaction might look like this:

![](https://ipfs.infura.io/ipfs/QmQgf32E3xijWFwM4txSZfwiUX9tV92YtE8E2U7cmNFMLN)

We’re going to recreate this simplistic legal agreement with OpenLaw’s markup and blockchain-enabled capabilities by inputting the following markup as a template, as shown here:
\centered ** BILL OF SALE **
Seller at Ethereum address [[Seller Address: EthAddress]] (“Seller”) agrees to sell a **[[Purchased Item]]**, and buyer at Ethereum address [[Buyer Address: EthAddress]] (“Buyer”) agrees to pay [[Purchase Price: Number]] ether.
SELLER:
[[Seller Signatory Email: Identity | Signature]]
________________
BUYER:
[[Buyer Signatory Email: Identity | Signature]]
________________
In the title field above the markup, you can enter a name that’s meaningful for you, such as “Car Sale Agreement” (or another name, if that one is already taken).
In this marked up version of the traditional legal document, some important features of the markup language should be described. First, the OpenLaw markup language provides most of the formatting tags that you’ll need to develop professional looking legal contracts, similar to what you’d find with traditional word processors. For example, you can bold, italicize, and align text through a toolbar. The example text above includes a simple example:
\centered ** BILL OF SALE **
Using the combination of \centered and asterisks, the text will formatted as bold and centered.
Second, the markup language also makes it possible for you to genericize the template so anyone can reuse it over and over for different transactions with different parties. In this example, instead of specifying that the buyer wants to buy a Volkswagen Bus, we have marked a blank field with this markup language:
[[Purchased Item]]
Using this field allows users to enter any text an input field, whether it’s a Volkswagen Bus or a Freightliner eighteen wheeled tractor trailer.
Similarly, we left the purchase price open with the following markup:
[[Purchase Price: Number]]
This field is slightly different from the last example in that it constrains the field to a numeric value by adding the suffix Number. There are many different types of constraints, such as dates, Ethereum addresses (in the example above), and more. We’ll describe how those fields work their way onto the blockchain in the next section.
After updating the markup, saving the document on OpenLaw, and clicking the “Draft” button, we should see a screen that looks like the following:

![](https://ipfs.infura.io/ipfs/QmdDGqHztLNPvKXAseFyatUh6Pup3TnBiXHsmCgjverDc3)


### Signing the Contract on OpenLaw
In draft mode we can fill in the fields with the buyer’s address, seller’s address, a description of the Volkswagen Bus, and the purchase price, so now the parties can sign the document.
The first step is to insert the buyer and seller email addresses as this will serve as their identity in OpenLaw (in the future, more options will be available). This is available on the left hand set of fields above like the other fields. Then click the send button to send the document out for signature.

![](https://ipfs.infura.io/ipfs/QmXTvRnAsNEzxagVidJ31XeNViPgrWksVDYJavH41Zp96g)

Since, in this example, we were logged into OpenLaw as one of the signing parties, we are immediately taken to the signature page, which looks something like the following:

![](https://ipfs.infura.io/ipfs/QmRBvsPoGN7ETEs1qHKttUdQTREBvMe9sN6ArnJieGerbd)

Each party will receive notification that they have a contract to sign via email.
A key aspect of the signature process comes from special markup tag instructions to the OpenLaw interpreter. For example:
[[Seller Signatory Email: Identity | Signature]]
In the example markup above, we are using the email address of the seller as the seller’s electronic signature (and, likewise, the buyer’s email for his or her signature). To indicate our intent to the OpenLaw platform, we added Identity and Signature to the markup tag.
The Identity suffix notifies OpenLaw that this field will serve as the user’s identity on OpenLaw. The Signature suffix informs the OpenLaw interpreter that the email addresses of the seller and buyer will be used as their electronic signature. For more about these tags, review the 
[Identity and Signature topic of the markup language documentation](https://docs.openlaw.io/markup-language/#identity-and-signatures)
 .

### Interacting with the Ethereum Blockchain
Contracts developed on the OpenLaw platform can also interact with Ethereum-based blockchains. They do this through smart contracts. Smart contracts are small programs deployed on the blockchain at an Ethereum address which can transfer digital assets (i.e., crypto, property, etc.) among many other uses. OpenLaw is able to interact with smart contracts via function calls at those addresses using the same markup language we used to document the legal terms between the parties.

### Developing an Example Smart Contract
Returning to our example above, the parties can automate the purchase and sale of the Volkswagen Bus using a smart contract, such as the follow example in 
[the Solidity programming language](https://solidity.readthedocs.io/)
 , the most popular language for developing smart contracts on the Ethereum blockchain.

![](https://ipfs.infura.io/ipfs/QmWYZhQf2sdovwoVvg84c7VqRFEw4DfRYRSG5zVMX2URUZ)

A description of the Solidity programming language is far beyond the scope of this short tutorial, but if you’ve developed in any language, it should be clear that the function recordContract takes four parameters: the object to be sold, the purchase price, and the buyer and seller’s Ethereum addresses. An experienced reader will probably spot many issues with the smart contract code, but please keep in mind this is simply for demonstration.
Now, using a tool like MetaMask or the Mist Wallet, the buyer can transfer his or her ether to the smart contract to be held pending confirmation that the vehicle was delivered. Once the buyer approves using a smart contract aware wallet like Mist or separate dApp by calling confirmReceipt, the funds will be released to the seller.
Now that we have our smart contract language, we can deploy it using whatever tool you like. Common tools used for this purpose are 
[Remix](https://remix.ethereum.org/)
 , 
[Truffle](https://truffleframework.com)
 , and the 
[Mist Wallet](https://github.com/ethereum/mist/releases/)
 browser. When you do so, you will have access to the ABI (“application binary interface,” which is a JSON description of the functions your smart contract exposes) and the address on the Ethereum network where the contract was deployed.

### Integrating Blockchain Programming with OpenLaw
The last step in our process is to connect our template to the smart contract we created above. To do that, we need to edit our template and add a few more tags.
The first declares the smart contract’s key features. Using the example above, we can add additional markup tags to the source above:
[[@Purchase Price in Wei = Purchase Price * 1000000000000000000]]
[[Record Contract:EthereumCall(
contract:”0xe4A87aaF8134e473976Fc04b68dBd5B9A5bd139C”;
interface:[ { “constant”: false, . . . “type”: “function” } ];
function:”recordContract”;
Arguments: Purchased Item, Purchase Price in Wei, Seller Address, Buyer Address)]]
The EthereumCall tag is very powerful but requires only four simple parameters to get started (more are available, please see the documentation):



 * “Contract”: tells the OpenLaw platform where the contract is deployed on the Ethereum blockchain

 * “Interface”: is the (sometimes long) ABI text that you can copy and paste from your development tool such as Remix

 * “Function”: is the name of the function that you want to call

 * “Arguments”: allows you to pass data from the OpenLaw platform into the blockchain
You may have noticed we included another tag to do some calculations on the purchase price. This tag, which preceded the EthereumCall tag, is called an 
[Alias](https://docs.openlaw.io/markup-language/#calculations-and-aliasing)
 ; it starts with an @ symbol. Aliases are useful for many things and in this case we used it to dynamically change in the markup to convert the purchase price into a denomination that the Ethereum blockchain works with natively, which is Wei.
Now we need to add one final tag to the markup language:
[[Record Contract]]
This tag simply instructs the OpenLaw interpreter to call the smart contract once the contract has been signed by all the parties. In our example, OpenLaw will invoke the recordContract function and store the purchase price, a description of the Volkswagen Bus, the buyer’s address, and the seller’s address on the blockchain.
Now, when our Volkswagen Bus buyer and seller execute their contract on OpenLaw, OpenLaw will interact with the blockchain via the smart contract and automate the flow of ether between the parties, as well as providing low cost safeguards for the buyer through the use of the smart contract — with just a little more work on the smart contract code to enable that feature.
Using a smart contract enabled wallet like Mist, the buyer can confirm that he or she received the vehicle as promised by calling recordContract, which will then transfer the ether to the seller.

### Conclusion
Since the law pervades every part of our life, as you can imagine, there are several use cases where OpenLaw can create, execute and automate legal contracts while leveraging blockchain-based technology. Using OpenLaw, we’re bringing users an speedy and secure way digitally sign and store legal agreements. To learn more about OpenLaw, check out our 
[site](https://openlaw.io/)
 and 
[documentation](https://docs.openlaw.io/)
 for an overview and detailed reference guide and. You can also find us at 
[hello@openlaw.io](mailto:hello@openlaw.io)
 or tune in in our community 
[Slack channel](https://openlaw-community.slack.com)
 . Follow our 
[Medium](https://medium.com/@OpenLawOfficial)
 and 
[Twitter](https://twitter.com/OpenLawOfficial)
 for further announcements, tutorials, and helpful tips over the upcoming weeks and months.



---

- **Kauri original title:** OpenLaw Tutorial  Blockchain-Enabled, Legally Enforceable Smart Contracts
- **Kauri original link:** https://kauri.io/openlaw-tutorial:-blockchain-enabled-legally-enfo/3a4016d6e3bd4c1fbba839244f1802e8/a
- **Kauri original author:** Priyanka Desai (@priyanka-desai)
- **Kauri original Publication date:** 2018-12-04
- **Kauri original tags:** none
- **Kauri original hash:** QmU3TVPnGEFAHKTwKc9RFxGC4ExrtcifWeX6ECCuXu2hha
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



