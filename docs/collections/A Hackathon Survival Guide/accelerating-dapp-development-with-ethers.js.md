---
title: Accelerating DApp Development with Ethers.js
summary: Todays decentralized application stack often consists of a front end, smart contracts, and a framework to interact with the blockchain. Developers often use Web3.js for interaction with the Ethereum blockchain; however, Web3.js is large, its documentation needs improvement, and is difficult to maintain. Ethers.js is an alternative library that offers all the features of Web3.js in a smaller, well-tested package. In this tutorial, we use Angular 7.X and Ethers.js to create a simple wallet applica
authors:
  - Jacob Creech (@jacobcreech)
date: 2019-05-18
some_url: 
---

# Accelerating DApp Development with Ethers.js


Today's decentralized application stack often consists of a front end, smart contracts, and a framework to interact with the blockchain. Developers often use [Web3.js](https://github.com/ethereum/web3.js/) for interaction with the Ethereum blockchain; however, Web3.js is large, its documentation needs improvement, and is difficult to maintain. [Ethers.js](https://github.com/ethers-io/ethers.js/) is an alternative library that offers all the features of Web3.js in a smaller, well-tested package.

In this tutorial, we use Angular 7.X and Ethers.js to create a simple wallet application and interact with a smart contract deployed on the Ethereum blockchain.

### Prerequisites

First, install node.js and Angular. You can find the instructions below:

-   [Nodejs](https://nodejs.org/en/)
-   [Angular](https://angular.io/guide/quickstart)

#### Creating a Wallet Application

To get started, download the following initial [Angular application](https://github.com/jacobcreech/Ethersjs-initial-example). Make sure you are on the `initial` branch. To start, run.

`shell`
```
git checkout -b initial
npm install
ng serve --open
```

Which greets you with the words "initial application" in your browser.

Ethers.js follows the general standard of installing node packages, run the below to install it:

`shell`
```
npm install --save ethers
```

Now everything is set up to work with Ethers.js.

### Creating a Wallet

We first use Ethers.js to create a new wallet. Change `/src/app/wallet/wallet.component.html` to the following html:

```htt
<div fxFlex="20"></div>
<div fxFlex="60" class="wallet">
    <button mat-raised-button color="primary" (click)="onSubmit()">Generate Wallet</button>
    <p *ngIf="publickey">Public Key: {{publickey}}</p>
    <p *ngIf="privatekey">Private Key: {{privatekey}}</p>
</div>
<div></div>
```

To create a wallet, we use `wallet.createRandom()` to create a random public and private key. We can use this wallet for other actions, such as creating transactions.

In `/src/app/wallet/wallet.component.ts`, change the `onSubmit() {}` function to the below:

```typescript
onSubmit() {
    const randomWallet = ethers.Wallet.createRandom();
    this.publickey = randomWallet.address;
    this.privatekey = randomWallet.privateKey;
    const wallet = new ethers.Wallet(this.privatekey);
}
```

Before we can do anything with this wallet, we must first connect it to the Ethereum blockchain. We do this using the default web3 provider by Ethers.js.

Update the `ngOnInit() {}` function in `wallet.component.ts` to the below:

```typescript
ngOnInit() {
    this.provider = ethers.getDefaultProvider('homestead');;
}
```

This code obtains the web3 connection provided by Metamask and makes it ready to use by Ethers.

#### Sending and Signing Transactions

Next, we create the ability to send a transaction with our application. Ethers.js provides the ability to edit any data within a transaction, such as gas limit and what address you are sending the transaction to. To send a transaction using the wallet, create a send transaction button that uses the `sendTransaction` method from Ethers.js, as well as some form fields for input on the transaction.

Inside `/src/app/wallet/wallet.component.html` add the code below inside the two `<div>`'s

```html
<form [formGroup]="transactionForm" (ngSubmit)="sendTransaction(transactionForm.value)">
        <mat-form-field appearance="outline">
        <mat-label>To</mat-label>
        <input formControlName="toAddress" matInput placeholder="0xAddress">
        </mat-form-field>
        <mat-form-field appearance="outline">
        <mat-label>Amount</mat-label>
        <input formControlName="etherAmount" matInput placeholder="1">
        <span matSuffix>Ether</span>
        </mat-form-field>
        <button mat-raised-button color="secondary">Send Transaction</button>
    </form>
```

In the `constructor` of the `wallet.component.ts` class, create the base form information.

```typescript
constructor(private fb: FormBuilder) {
    this.transactionForm = fb.group({
        'toAddress': [null],
        'etherAmount': [null]
    });
}
```

To send a transaction, Ethers.js provides a `sendTransaction` method for all wallets. Add a `sendTransaction` method to the `wallet.component.ts` class, inputting the form.

```typescript
sendTransaction(form: any) {
    let transaction = {
        to: form.toAddress,
        value: ethers.utils.parseEther(form.etherAmount)
    }

    this.wallet.sendTransaction(transaction)
        .then((tx) => {
            console.log(tx);
        })
}
```

We first create the transaction object, giving where the transaction is going in the `to` field. `value` denotes how much ether, in the units Wei by default, is sent to the address mentioned. We use the `parseEther` util provided by Ethers.js to convert from Ether to Wei. After creating the transaction object, we use our wallet to send the transaction. In this implementation, the console logs the transaction receipt.

### Interacting with Smart Contracts

One of the novelties of Ethereum is the creation and use of smart contracts on the blockchain. Dapp development relies on interaction with smart contracts, and Ethers.js has a solution. With Ethers.js, you can interact with a smart contract to exchange tokens with two parties or play one of the many Dapp games.

Take for example this [Sample Contract](https://ropsten.etherscan.io/address/0x8a32989b65186d3596251d7d7c8a427a26669354#code). This contract stores variables by adding it to the blockchain and can read all currently stored variables. Storing values on the Ethereum blockchain is useful for Dapp development, as the storage allows developers to reference variables for interactions such as storing signatures, or keeping track of cryptokittens up for trade. Interacting with this contract with Ethers.js, we create the ABI for it, found [here](https://ropsten.etherscan.io/address/0x8a32989b65186d3596251d7d7c8a427a26669354#code). ABI stands for Application Binary Interface. This interface defines functions found at a smart contract address, and you can use to call functions of a smart contract.

```typescript
let abi = [{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"add","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getValues","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
```

We know the address of the contract is `0x8a32989b65186d3596251d7d7c8a427a26669354`. Using both of these and our wallet, we can create a contract object using Ethers. For example:

```typescript
let contractAddress = '0x8a32989b65186d3596251d7d7c8a427a26669354';

let contract = new ethers.Contract(contractAddress, abi, wallet);
```

In the contract, we find both the add and `getValues` functions. To call these functions using Ethers, you call the functions listed in the ABI.

```typescript
await contract.add("Message");
contract.getValues()
        .then((result) => {
        console.log(result);
        });
```

We add this to our UI in the `wallet.component.html` class by adding an additional field and a `getValues` field:

```html
<form [formGroup]="contractForm" (ngSubmit)="addToContract(contractForm.value)">
        <mat-form-field appearance="outline">
        <mat-label>Value</mat-label>
        <input formControlName="value" matInput placeholder="1">
        </mat-form-field>
        <button mat-raised-button color="secondary">Add to Contract</button>
</form>
<button mat-raised-button color="primary" (click)="getValues()">Get Values</button>
<p *ngIf="message">Message: {{message}}</p>
```

Add the code below to the `constructor`, and create the `getValues()` and `addToContract()` functions.

```typescript
constructor(private fb: FormBuilder) {
        this.contractForm = fb.group({
            'value': [null]
        })
        this.abi = [{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"add","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getValues","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
        this.contractAddress = "0x8a32989b65186d3596251d7d7c8a427a26669354";
    }

addToContract(form: any) {
            let contract = new ethers.Contract(this.contractAddress, this.abi, this.wallet);
            contract.add(form.value);
    }

    getValues() {
        let contract = new ethers.Contract(this.contractAddress, this.abi, this.wallet);
        contract.getValues()
                .then((result) => {
                    this.message = result;
                });
    }
```

Rerun the application with `ng serve --open` and you should have a basic, but functioning wallet application.

### Next steps

In this tutorial, we created a dapp that creates a wallet, sends a transaction, and interacts with a smart contract. Using Ethers.js, we can interact with the Ethereum blockchain with ease and expand to more complex use cases. Further improvements could be to create a better design, add more wallet integrations, and a separation of concerns between the wallet and contract component. With this demo app, you can now include a wallet app by just including the wallet web component in your dapp.

Ethers.js is a powerful tool and a strong alternative to web3 for dApp development. The small compact library makes creating dApps a breeze, taking all the heavy lifting off of the developer's shoulders and making it easier to focus on the smart contract or website design. For more information on Ethers.js, checkout out the [documentation](https://docs.ethers.io/ethers.js/html/index.html). You can find the final codebase on the master branch [here](https://github.com/jacobcreech/Ethersjs-example).