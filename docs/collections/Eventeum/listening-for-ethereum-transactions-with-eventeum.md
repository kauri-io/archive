---
title: Listening for Ethereum Transactions with Eventeum
summary: In this tutorial we will walk through how to use Eventeum to be notified when certain transactions have been mined within the Ethereum network. What is Eventeum? Eventeum is an Ethereum event listener service that provides a bridge between the Ethereum network and your middleware layer. Eventeum supports both smart contract event and transaction subscriptions. These subscriptions can be registered dynamically, and when the subscribed event occurs, a message containing the details of the event ar
authors:
  - Craig Williams (@craig)
date: 2019-09-26
some_url: 
---

# Listening for Ethereum Transactions with Eventeum


In this tutorial we will walk through how to use Eventeum to be notified when certain transactions have been mined within the Ethereum network.

### What is Eventeum?
Eventeum is an Ethereum event listener service that provides a bridge between the Ethereum network and your middleware layer. Eventeum supports both smart contract event and transaction subscriptions.  These subscriptions can be registered dynamically, and when the subscribed event occurs, a message containing the details of the event are broadcast onto a message bus (currently either Kafka, RabbitMQ and Pulsar) which can then be consumed by your backend services.

It was developed by the kauri.io team, and the source code is freely available under the Apache 2.0 license.  Click [here](https://github.com/ConsenSys/eventeum/) to view the github repository.

### Prerequisites

- Maven
- Docker
- Metamask with Rinkeby ETH

### Deploying Eventeum
Out of the box, Eventeum has dependencies on a number of external services, namely Kafka/Zookepper and MongoDB.  The easiest way to get an Eventeum instance running locally right now is to clone the repo from github and run the docker-compose script from the server folder.  This will automatically fire up all the dependant services, and connect to an Infura rinkeby node.

`git clone https://github.com/ConsenSys/eventeum.git`

`cd eventeum/server`

`./docker-compose.sh rinkeby`

### Transaction Subscriptions

Currently, Eventeum supports three different types of transaction subscription:

- _Transaction Hash_ - Listen for a mined transaction with a specific transaction hash.  Because of the nature of this subscription, it is a one time event and will be unsubscribed once the transaction has been confirmed.
- _From Address_ - Broadcast all mined transactions that originate from the specified Ethereum address.
- _To Address_ - Broadcast all mined transactions that are sent to a specific Ethereum address.

A transaction subscription can be registered with Eventeum in one of two ways:

- _Properties File_ - Transactions that Eventeum should listen for can be configured in the application.yml file of Eventeum.  This only makes sense for long lived subscriptions (from / to address).  Property file configuration will not be covered in this guide, but for more information see the [README](https://github.com/ConsenSys/eventeum/#registering-a-transaction-monitor).
- _REST API _- Transaction subscriptions can be registered dynamically by sending http requests to a REST endpoint. This is the approach that we will use in this tutorial.

### Registering a To Address Transaction Subscription via REST

By default Eventeum listens on port 8060, and exposes a transaction filter registration endpoint at `/api/rest/v1/api/rest/v1/transaction`.  To subscribe to transactions, as POST request must be sent to this endpoint, with the body defining the transaction specification.

The expected JSON body format is:

```
{
	"type": "TO_ADDRESS" ,
	"transactionIdentifierValue": "0x1fbBeeE6eC2B7B095fE3c5A572551b1e260Af4d2",
	"nodeName": "default"
}
```

This example will instruct Eventeum to broadcast all mined transactions that are sent to the `0x1fbBeeE6eC2B7B095fE3c5A572551b1e260Af4d2` Ethereum address, on the `default` network.  Note, the `nodeName` parameter is optional, and is assumed to be for the `default` node if it is omitted.

To register this transaction monitor, use the following curl command, making sure that Eventeum is running:

```curl
curl -X POST \
  http://localhost:8060/api/rest/v1/transaction \
  -H 'Content-Type: application/json' \
  -d '{
	"type": "TO_ADDRESS" ,
	"transactionIdentifierValue": "0x1fbBeeE6eC2B7B095fE3c5A572551b1e260Af4d2",
	"nodeName": "default"
}'
```
Eventeum should respond with the id of the newly registered transaction subscription.

```json
{"id":"bde1238c3d6c26919dd95303d54ff064a957471fe03cf7741bdacfbbc5166252"}
```

#### Testing the Transaction Subscription

To test that the transaction subscription was successful, we must send a transaction to the `0x1fbBeeE6eC2B7B095fE3c5A572551b1e260Af4d2` address on the Rinkeby test network.  To do this we will use Metamask, the popular browser extension.

1. First ensure that metamask is connected to the Rinkeby network.  **This is a very important step, as there is a risk that you may transfer real ETH if you're connected to the wrong network!!**

![](https://api.kauri.io:443/ipfs/QmdS4ckxBKfzCvHqUGzszJhQ7wNPs3LivBSNKC8CE5hivD)

2. Next, paste the `0x1fbBeeE6eC2B7B095fE3c5A572551b1e260Af4d2` address into the 'Add Recipient' box.

![](https://api.kauri.io:443/ipfs/QmYFzTiqAsorTpXeG233GTx3gYWaky6A7sp9tmG1qisEqQ)

3. Enter a small value in the `Amount` box, such as 0.001 ETH.

![](https://api.kauri.io:443/ipfs/Qmf7m7QF1Da3XN5eqKGsX4bEDGqCjz2Y3wUomJVhrQNbFG)

4. Click next.

5. Keep the default values here, and click Confirm.

![](https://api.kauri.io:443/ipfs/QmUN6t9SM98BUiNXizSdqPqHS3kjf2vzDnd1hH2XaCS7ja)

6. Your transaction has now been broadcast to the Rinkeby network.  Once the transaction has been mined (this could potentially take a few minutes), you will see a popup similar to this one:

![](https://api.kauri.io:443/ipfs/QmVdAozLhv8BjeJsYWwd2cXP4S8KfyWFCeGgLMBDwpjxQN)

7. Now in the Eventeum terminal, check the log and you should soon see a 'Sending transaction event message' with details about the transaction that you just sent.  This means Eventeum has now broadcast the transaction onto a Kafka queue, that can be consumed by your backend services!

```
Sending transaction event message: 
{"id":"0xe12edfd4d8e649f6d88ce6a7234fa33f7878a06e9e35aa2b3ef0a822e29e28a9",
"type":"TRANSACTION","details":{... "status":"UNCONFIRMED" ...},"retries":0}
```
Notice that the status of the broadcast transaction message is `UNCONFIRMED`.  By default, Eventeum waits for 12 blocks before a transaction is considered confirmed, and safe from block reorganizations caused by chain forks.  Wait for 12 blocks to be mined (you should see blocks being broadcast from Eventeum in the logs), and another transaction message will be broadcast from Eventeum, with the same details, but with a `CONFIRMED` status.  The number of blocks to wait can be configured by changing the `broadcaster.event.confirmation.numBlocksToWait` configuration property (or by setting a `BROADCASTER_EVENT_CONFIRMATION_NUMBLOCKSTOWAIT` environment variable).  If this value is set to 0, then a transaction is considered confirmed as soon as it is initially mined, and there will only be one broadcast message per transaction.

### Transaction Message Format

Each transaction is encoded in the following JSON format:
```json
{
    "id":"0xe12edfd4d8e649f6d88ce6a7234fa33f7878a06e9e35aa2b3ef0a822e29e28a9",
    "type":"TRANSACTION",
    "details: {
        "hash":"0xe12edfd4d8e649f6d88ce6a7234fa33f7878a06e9e35aa2b3ef0a822e29e28a9",
        "nonce":"0x59",
        "blockHash":"0x184682def4f3e85b530386187d2356674411b51a1f7aa949f4502e54f97c18de",
        "blockNumber":"0x4e9c01",
        "transactionIndex":"0x0",
        "from":"0x8ef742b9BD0413C3a0eD98E8a85ef84dFcBcBF11",
        "to":"0x1fbBeeE6eC2B7B095fE3c5A572551b1e260Af4d2",
        "value":"0x38d7ea4c68000",
        "nodeName":"default",
        "status":"UNCONFIRMED"},
    "retries":0
}
```

### Summary
In a few relatively simple steps, you have started a test Eventeum instance, registered a transaction subscription and triggered that subscription by sending a transaction with Metamask.  Congratulations!!

If you haven't already, it would be worth checking out the other Eventeum articles in this series:

- [Listening to Ethereum Events with Eventeum](https://kauri.io/article/90dc8d911f1c43008c7d0dfa20bde298/listening-to-ethereum-events-with-eventeum)
- [Using Eventeum to Build a Java Smart Contract Data Cache](https://kauri.io/article/fe81ee9612eb4e5a9ab72790ef24283d/using-eventeum-to-build-a-java-smart-contract-data-cache)

To learn more about Eventeum API's, message specifications or advanced configuration, checkout the github page at: https://github.com/ConsenSys/eventeum/.

Lastly, Eventeum is fully open-source and we welcome community contributions, so feel free to play around with the application and modify it to your needs…just don't forget to create a pull request afterwards, to help improve the product!


