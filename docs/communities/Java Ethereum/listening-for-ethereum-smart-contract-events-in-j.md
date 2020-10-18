---
title: Listening for Ethereum Smart Contract Events in Java
summary: Other articles in this series- - Connecting to an Ethereum client with Java, Eclipse and Web3j - Manage an Ethereum account with Java and Web3j - Generate a Java Wrapper from your Smart Contract - Interacting with an Ethereum Smart Contract in Java - Using Pantheon, the Java Ethereum Client with Linux What is a Smart Contract Event You can emit an event from any smart contract function triggered by a transaction, and they are an important piece of the Ethereum application architecture puzzle. Th
authors:
  - Craig Williams (@craig)
date: 2019-07-22
some_url: 
---

# Listening for Ethereum Smart Contract Events in Java



**Other articles in this series:**
- [Connecting to an Ethereum client with Java, Eclipse and Web3j](https://kauri.io/article/b9eb647c47a546bc95693acc0be72546)
- [Manage an Ethereum account with Java and Web3j](https://kauri.io/article/925d923e12c543da9a0a3e617be963b4)
- [Generate a Java Wrapper from your Smart Contract](https://kauri.io/article/84475132317d4d6a84a2c42eb9348e4b)
- [Interacting with an Ethereum Smart Contract in Java](https://kauri.io/article/14dc434d11ef4ee18bf7d57f079e246e)
- [Using Pantheon, the Java Ethereum Client with Linux](https://kauri.io/article/276dd27f1458443295eea58403fd6965)

-------------------------------------------


### What is a Smart Contract Event

You can emit an event from any smart contract function triggered by a transaction, and they are an important piece of the Ethereum application architecture puzzle.

These events consist of a name and up to 17 arguments, with the content of these arguments provided by the emitting function.  Arguments can either be indexed or non-indexed; with indexed arguments allowing for efficient off-chain querying.

> For example, if event X contains an indexed string argument Y, off-chain I can retrieve all events where Y == "foo", using a filter. (More on filters later)

Events are stored as logs rather than within EVM storage, and because of this, they have properties that you should be aware of:

-   **Not accessible from within a smart contract:** Although smart contract functions emit events, smart contracts cannot access this event information after emission.  This is true for both the emitting contract and any other external contract. Therefore, you cannot use events for cross-contract communication.

-   **Events are cheap!:** As events are stored as logs, they are cheap compared to the traditional approach of updating the EVM storage state.  The exact cost depends on the event specification and the size of the data within the event.

### Common Uses for Events

#### Asynchronous Off-chain Triggers

Most enterprise Java developers are familiar with the Event Bus pattern, where events are published to a queue such as RabbitMQ or Amazon SQS.  This pattern allows services that are interested in specific events to consume them off the bus asynchronously, and perform further processing, without any coupling between the publisher and consumer services.

_The Event Bus Pattern_
![](https://api.dev2.kauri.io:443/ipfs/QmUwbWrK2kgPz2RpwghveWcgRQsH1BSiQhHtam6hFpxp1J)

Services can use Ethereum smart contract events in a similar way, with the Ethereum network acting as a kind of messaging queue.  Off-chain services can register an event filter with a node, and will subsequently be notified each time this event is emitted in the Ethereum network.  You can then use these event notifications as a trigger for further off-chain processing, such as updating a NoSQL based cache of the smart contract state.

_Ethereum as an 'Event Bus'_
![](https://api.dev2.kauri.io:443/ipfs/QmaMerpsdaU6xMT7QfJpfCa8ttZa9DuiGDrQaA7GzRiY9d)

#### Cheap Data Storage for Off-chain Consumption

As I mentioned above, storing data within an event rather than in EVM contract storage is significantly cheaper.

> Diving a little bit into the specifics in order to compare, saving 32 bytes of data to contract storage costs 20,000 gas, whereas emitting an event costs 375 plus 375 for each indexed argument, and an additional 8 gas per byte of data.

Due to these cost savings, it's a common pattern to store data never read by an on-chain smart contract function soley in an event, not in contract storage.

An example of a scenario where this may be the case, is a notary service where an IPFS hash is committed to the Ethereum blockchain in order to prove date of creation.  After an event has been emitted which contains the IPFS hash of the document, you can verify the timestamp of the notarisation off-chain if there is a dispute by querying the contract events, not the contract state.

### Defining and Emitting an Event

Both defining and emitting and event within your Ethereum smart contracts are one liners:

#### Defining

```solidity
event Notarized(address indexed notary, string documentHash)
```

In this example we defined an event with the name `Notarized`, with an indexed address argument, `notary`,  and a single non-indexed string parameter, `documentHash`.

#### Emitting

```solidity
function notarizeDocument(string _documentHash) public {
        emit Notarized(msg.sender, _documentHash);
}
```

The emit keyword fires an event, with arguments passed to the event in a way that is similar to function invocation.  Here, the notary address is set as the transaction sender address via `msg.sender`, and the `documentHash` is the same as the called function argument.

### Listening for Emitted Events with Web3j

By far the easiest way to listen for Ethereum smart contract events using web3j is to use the contract wrapper feature of the library.  For a primer on the wrapper feature, see the previous post in this series [http://todo.com](here).

The below code snippet connects to a local Ethereum node and listens for all Notarized events emitted from a deployed Notary contract:

```java
Web3j web3j = Web3j.build(new HttpService("http://localhost:8545"));

//Deploys a notary contract via wrapper
final Notary notaryContract = deployNotaryContract(web3j);

notaryContract
        .notarizedEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
        .subscribe(event -> {
            final String notary = event.notary;
            final String documentHash = event.documentHash;

            //Perform processing based on event values
        });
```

The autogenerated contract wrapper code contains convenience methods for each event defined in your smart contract with the naming pattern `<event-name>EventFlowable`.  This method takes start and end block arguments, and as in this example, using the `DefaultBlockParameterName.LATEST` value instructs web3j to continue listening for events for new blocks indefinitely.  If you require a specific block range, you can use `DefaultBlockParameter.valueOf(BigInteger.valueOf(...))`.  A [Flowable](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Flowable.html) object is returned which can then be subscribed to, in order to perform processing logic on emitted events.

This method simplifies the process of event listening, as it automatically converts the raw log messages into an object with fields reflecting the defined event arguments.  Without this, you would have to decode the values yourself, and although web3j provides helper methods for this, things can get complex quickly.

#### Filtering by Indexed Argument Value

Setting an argument of an event as `indexed` faciliates efficient querying of events by that arguments value.  This querying is supported in Web3j by building an `EthFilter` object manually.  Below is the code to listen for events notarized by a specific Ethereum address:

```java
final EthFilter ethFilter = new EthFilter(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST,
                notaryContract.getContractAddress());

ethFilter.addSingleTopic(EventEncoder.encode(notaryContract.NOTARIZED_EVENT));
ethFilter.addOptionalTopics("0x" + TypeEncoder.encode(new Address("0x00a329c0648769a73afac7f9381e08fb43dbea72")));

notaryContract
        .notarizedEventFlowable(ethFilter)
        .subscribe(event -> {
            final String notary = event.notary;
            final String documentHash = event.documentHash;

            //Perform processing based on event values
        });
```

The `notarizedEventFlowable` is overloaded, and can accept an `EthFilter` as an argument, rather than a block range.  This filter is used to define which events to listen for in a more finely grained way, and is built up with the same block range as was previously passed to the method.

There are also some topics that are set on the filter.  In an Ethereum filter, the first topic is always defined as the keccak hash of the event signature, with the event signature in our case being `'Notarised(address,string)''`.  This is calculated with the help of the `EventEncoder.encode(..)` method provided by Web3j, along with the event specification, `NOTARIZED_EVENT` that has been auto-generated in the wrapper class.

Additional topics can be added using the `addOptionalTopics(..)` method, and these specify the values of indexed arguments to match against, in the same order as they are defined in the event specification.  Encoding varies slightly based on the type of the argument, but luckily, Web3j provides the `TypeEncoder` class which handles this for us.  In the example provided, we are only listening for events where the `notary` value is the address 0x00a329c0648769a73afac7f9381e08fb43dbea72.

### Summary
Events are a great way for backend (and frontend) services to be notified of smart contract changes and interactions in an asynchronous manner, as well a providing a cost effective way of storing data on the Ethereum blockchain that does not need to be consumed by a smart contract.

As with many Ethereum interactions, the smart contract wrappers generated by Web3j are by far the simplest way to subscribe to, and process emitted events in your java backend.


-------------------------------------------

**Next Steps:**
- [Using Pantheon, the Java Ethereum Client with Linux](https://kauri.io/article/276dd27f1458443295eea58403fd6965)
