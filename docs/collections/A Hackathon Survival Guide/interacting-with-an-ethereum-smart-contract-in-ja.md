---
title: Interacting with an Ethereum Smart Contract in Java
summary: Other articles in this series- - Connecting to an Ethereum client with Java, Eclipse and Web3j - Manage an Ethereum account with Java and Web3j - Generate a Jav
authors:
  - Craig Williams (@craig)
date: 2020-01-26
some_url: 
---

# Interacting with an Ethereum Smart Contract in Java



**Other articles in this series:**
- [Connecting to an Ethereum client with Java, Eclipse and Web3j](https://kauri.io/article/b9eb647c47a546bc95693acc0be72546)
- [Manage an Ethereum account with Java and Web3j](https://kauri.io/article/925d923e12c543da9a0a3e617be963b4)
- [Generate a Java Wrapper from your Smart Contract](https://kauri.io/article/84475132317d4d6a84a2c42eb9348e4b)
- [Listening for Ethereum Smart Contract Events in Java](https://kauri.io/article/760f495423db42f988d17b8c145b0874)
- [Using Pantheon, the Java Ethereum Client with Linux](https://kauri.io/article/276dd27f1458443295eea58403fd6965)

-------------------------------------------

In this tutorial, you will learn how to deploy a smart contract using the Web3j java library, along with how to interact with the functions of the smart contract.

As a prerequisite, you should be familiar with [account management](https://kauri.io/article/925d923e12c543da9a0a3e617be963b4/manage-an-ethereum-account-with-java-and-web3j) and contract java wrapper generation as described in the [previous article](https://kauri.io/article/84475132317d4d6a84a2c42eb9348e4b/generate-a-java-wrapper-from-your-smart-contract) in this series.  For continuity, we will deploy the same `DocumentRegistry` smart contract.

_DocumentRegistry.sol_

``` solidity
pragma solidity ^0.5.6;


/**
*  @dev Smart Contract resposible to notarize documents on the Ethereum Blockchain
*/
contract DocumentRegistry {

    struct Document {
        address signer; // Notary
        uint date; // Date of notarization
        string hash; // Document Hash
    }

    /**
     *  @dev Storage space used to record all documents notarized with metadata
     */
    mapping(bytes32 => Document) registry;

    /**
     *  @dev Notarize a document identified by the hash of the document hash, the sender and date in the registry
     *  @dev Emit an event Notarized in case of success
     *  @param _documentHash Document hash
     */
    function notarizeDocument(string calldata _documentHash) external returns (bool) {
        bytes32 id = keccak256(abi.encodePacked(_documentHash));

        registry[id].signer = msg.sender;
        registry[id].date = now;
        registry[id].hash = _documentHash;

        emit Notarized(msg.sender, _documentHash);

        return true;
    }

    /**
     *  @dev Verify a document identified by its has was noterized in the registry previsouly.
     *  @param _documentHash Document hash
     *  @return bool if document was noterized previsouly in the registry
     */
    function isNotarized(string calldata _documentHash) external view returns (bool) {
        return registry[keccak256(abi.encodePacked(_documentHash))].signer != address(0);
    }

    /**
     *  @dev Definition of the event triggered when a document is successfully notarized in the registry
     */
    event Notarized(address indexed _signer, string _documentHash);
}
```

### A Brief Primer on Mining and Gas

#### Mining

Any interactions with the Ethereum network that update EVM state must be triggered by a transaction that is broadcast to the blockchain.  Some example interactions include sending Ether to another account, deploying a smart contract and some smart contract function invocations.

Miners are entities that secure the Ethereum network by constantly attempting to calculate the answer to a complex mathematical puzzle, a mechanism called Proof-of-Work consensus.

It is the job of miners to gather a bundle of pending transactions (from the mempool) and create a block that includes these transactions.  Once a transaction is included within a mined block, it is considered executed, and any related state changes will be applied.

#### Gas

Ether, the native cryptocurrency of Ethereum, is paid by the transaction sender to the miner that included the transaction within a block.  This is one of the ways that miners are incentivized.

Gas is a unit of computational work within the Ethereum network, and the amount of Ether paid whilst executing a transaction depends on how much gas is consumed, along with the `gasPrice` transaction attribute, which defines how much Ether the sender will pay per gas unit consumed.  Its important to understand that different transactions will require differing amounts of gas, depending on the operation, with each transaction costing a minimum of 21,000 gas.

It is also possible to define the absolute maximum amount of gas that a transaction sender is willing to consume in order to execute the transaction, by specifying the `gasLimit` attribute.

### Deploying

The ability to deploy immutable smart contracts that live indefinitely is the secret sauce of Ethereum!  Smart contracts are pieces of code with functions that can be executed by any interested parties.  They live as bytecode within the network but are usually written in a language such as [Solidity](https://solidity.readthedocs.io/en) or [Vyper](https://vyper.readthedocs.io), then encoded and deployed.

By far the easiest way to deploy the `DocumentRegistry` smart contract is to use a wrapper that has been generated by Web3j.   This wrapper provides a native java class representation of the smart contract.  Two (non deprecated) `deploy` methods that can be used to deploy the code to the Ethereum network are provided:

``` java
public static RemoteCall<DocumentRegistry> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider)
```
``` java
public static RemoteCall<DocumentRegistry> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider)
```

The latter allows the `TransactionManager` to be specified; an object which controls how Web3j connects to an Ethereum client.  We're happy to use the default `RawTransactionManager` in this example, so we'll use the former method, which takes wallet `Credentials` as an argument.  We must also create a `ContractGasProvider`, which provides the gas price and gas limit for the transaction; indirectly specifying how much the contract will cost to deploy, in Ether.

_DocumentRegistry Deployment Code_

``` java
//Create credentials from private key
Credentials creds = Credentials.create("0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63");

DocumentRegistry registryContract = DocumentRegistry.deploy(web3j, creds, new DefaultGasProvider()).send();

String contractAddress = registryContract.getContractAddress();
```

The `deploy` method returns a `RemoteCall` object.  Calling `send()` on the `RemoteCall` synchronously deploys the smart contract to the Ethereum network, and returns an instance of `DocumentRegistry` which is linked to this deployed code.  Every deployed smart contract has a unique Ethereum address associated with it, and this address can be accessed by calling the `getContractAddress()` method on the contract wrapper, after deployment.

In this snippet, the credentials are constructed from a hard coded private key (for address 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73).  This is fine for testing and demonstration purposes, but a production implementation should never hard code a private key, because an attacker will be able to take control of your account.  One approach to overcome this is to set the key as an environment variable on your server, and load this in your code.

The provided `DefaultGasProvider` is used in this example, which sets the gas price and limit to hard coded values, but a custom version can be built by implementing the below interface:

``` java
public interface ContractGasProvider {
    BigInteger getGasPrice(String contractFunc);

    @Deprecated
    BigInteger getGasPrice();

    BigInteger getGasLimit(String contractFunc);

    @Deprecated
    BigInteger getGasLimit();
}
```

### Creating a Wrapper Instance for an Already Deployed Contract
More often than not, the smart contract that you want to interact with will already be deployed to the Ethereum network.  In this scenario, the static `load(..)` method can be used:

``` java
public static DocumentRegistry load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider)
```

``` java
public static DocumentRegistry load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider)
```

For example, if our `DocumentRegistry` is deployed with the address `0x10c7dc2b84b6c8e6df5a749655830e70adca3a2b`, we can obtain a java wrapper for the deployed contract as follows:

``` java
//Create credentials from private key
Credentials creds = Credentials.create("0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63");

DocumentRegistry registryContract = DocumentRegistry.load(credentials.getAddress(),web3j, creds, new DefaultGasProvider());
```
### Invoking a Smart Contract Function

#### Transactions vs Calls

A smart contract function can be invoked in 2 different ways, depending on the behaviour of the function.  

##### Transactions

To invoke a smart contract function that can potentially change contract state (adding / updating / deleting a value), a transaction must be broadcast to the Ethereum network.  The function invocation details such as function name and argument values are encoded in the data field of a transaction in a well known format, and much like a regular Ether value transaction, the invocation will consume gas.  

A miner must choose to include the transaction within a block in order for the function invocation to take place, so therefore transaction executions are asynchronous in nature.  After broadcasting the transaction, a unique hash is returned, which can then be used to request a transaction receipt from the Ethereum client (once it has been included within a block).

For a detailed explanation of Ethereum transactions, see [this guide](https://medium.com/blockchannel/life-cycle-of-an-ethereum-transaction-e5c66bae0f6e).

##### Calls

A call is local to the Ethereum client that your service is connected to, and does not broadcast anything to the wider Ethereum network.  Because of this, a contract call is free to execute; they do not consume any gas. However, call operations are read only, meaning that any state changes that occur within the smart contract function are not persisted and are rolled back after execution.  There is no mining involved, so executions are synchronous.

#### Using the Contract Wrapper

As was true for deploying, invoking a function using a Web3j generated contract wrapper is by far the easiest approach.  The tricky data encoding is encapsulated and handled for you under the covers.  

A java method is generated that corresponds to each function within your smart contract.  Web3j establishes if the function should be invoked via a transaction or call automatically, at wrapper generation, based on the keywords of the function.  For example, a function definition that includes the `view` or `pure` keywords will be executed via a call, otherwise its assumed that there will be some potential state changes, and a transaction approach is used.

##### Invoking `notarizeDocument(..)`
In our `DocumentRegistry` example smart contract, the `notarizeDocument(..)` function stores the document details in the smart contract state and should therefore be triggered via a transaction in an asynchronous manner.  The generated function signature is:

``` java
public RemoteCall<TransactionReceipt> notarizeDocument(String _documentHash)
```
Interestingly, even though behind the scenes, a transaction is asynchronously broadcast to the network and included within a block, Web3j handles the transaction receipt polling on your behalf, and so the remote call returned by this method is actually synchronous and blocks until the transaction has been mined, subsequently returning the transaction receipt .  If this behaviour is not desired within your application, you will have to either send a transaction manually without the help of the wrapper, or make the remote call on a different thread.

So calling the `notarizeDocument` function is made very simple with the wrapper, and looks like this:

``` java
DocumentRegistry documentRegistry = deployDocumentRegistryContract();
TransactionReceipt receipt = documentRegistry.notarizeDocument(
        "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco").send();

String txHash = receipt.getTransactionHash();
```

A `TransactionException` is thrown if the transaction fails.

##### Invoking `isNotarized(..)`
As this function is marked as a `view` function, this indicates that it is read-only and can therefore be called locally.  The generated method signature is:

``` java
public RemoteCall<Boolean> isNotarized(String _documentHash)
```
This method is quite similar to the `notarizeDocument(..)` method, with one major difference;  the returned `RemoteCall` is of `Boolean` type and not `TransactionReceipt`.  This is because a transaction was not sent, and instead the return value of the smart contract function (`bool` in this case, converted to `Boolean`) is returned synchronously.

#### Manual Transaction Sending
If for some reason, using the smart contract wrapper is not desirable, Web3j provides a number of helper classes to simplify the process of broadcasting a function invocation transaction, such as encoding the data field of the transaction, and the signing process.

_Manual Transaction Sending Code_

``` java
Function function = new Function("notarizeDocument",
                Arrays.asList(new Utf8String("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco")), Collections.emptyList());

//Encode function values in transaction data format
String txData = FunctionEncoder.encode(function);

TransactionManager txManager = new FastRawTransactionManager(web3j, creds);

String txHash = txManager.sendTransaction(DefaultGasProvider.GAS_PRICE, DefaultGasProvider.GAS_LIMIT,
                documentRegistry.getContractAddress(), txData, BigInteger.ZERO).getTransactionHash();
```

- First a `Function` object is created.  This defines the `notarizeDocument` function call, and contains the function name, a list of input arguments (Web3j provides java equivalents of all solidity smart contract types), and a list of return types (empty in our case).

- Next, the `FunctionEncoder` is used to encode the function call definition into the transaction data field format. The actual encoding is out of scope for this article, but details can be found [here](https://solidity.readthedocs.io/en/develop/abi-spec.html) if interested.

- A `TransactionManager` is constructed, which which will be used to build and sign the transaction, and broadcast to the Ethereum network. We use a `FastRawTransactionManager` in this case, which supports multiple transactions per block, and takes `Web3j` and `Credentials` objects as arguments. 

- Once we have a transaction manager and encoded data, invoking the `notarizeDocument` function is simply a matter of calling the `sendTransaction` method of the transaction manager.  Behind the scenes this will construct a transaction object, and signing it with the private key defined in the `Credentials` and then broadcast the transaction to the Ethereum network via the connected client.  Whereas it was the job of the `GasProvider` to set the gas values in the wrapper case, we much specify them manually with this method.  We have used default values in this example but you can change these values as you wish.  As its possible for a smart contract function to receive Ether during the invocation (a `payable` function), the last argument can be used to specify the amount of Ether (in the smallest denomination, `wei`) that should be sent from the sender account to the smart contract.  No Ether should be transferred in our case, so the value is set to zero.

##### Obtaining the TransactionReceipt
You've probably noticed that the `sendTransaction` method in the code above, returns a transaction hash, and not a transaction receipt.  This is because of the asynchronous nature of transaction processing that has been mentioned earlier in this guide.  Luckily, web3j also provides a simple way to poll the network and wait until the transaction has been included within a block by a miner, the `TransactionReceiptProcessor`:

``` java
TransactionReceiptProcessor receiptProcessor =
                new PollingTransactionReceiptProcessor(web3j, TransactionManager.DEFAULT_POLLING_FREQUENCY,
                        TransactionManager.DEFAULT_POLLING_ATTEMPTS_PER_TX_HASH);

TransactionReceipt txReceipt = receiptProcessor.waitForTransactionReceipt(txHash);
```
### Summary
In this guide you have learnt how to perform some of the most common interactions with the Ethereum blockchain in java, namely deploying a smart contract and then invoking functions on this contract via both transactions and calls.  Using the generated smart contract java wrappers are by far the easiest way to perform these tasks, but there are other options if you require more granularity.  Congratulations, you're well on your way to becoming a proficient Ethereum java developer!

In the next article in this series, we will walk you through how to [listen for emitted smart contract events](https://kauri.io/article/760f495423db42f988d17b8c145b0874/listening-for-ethereum-smart-contract-events-in-java).


-------------------------------------------

**Next Steps:**
- [Listening for Ethereum Smart Contract Events in Java](https://kauri.io/article/760f495423db42f988d17b8c145b0874)
- [Using Pantheon, the Java Ethereum Client with Linux](https://kauri.io/article/276dd27f1458443295eea58403fd6965)



