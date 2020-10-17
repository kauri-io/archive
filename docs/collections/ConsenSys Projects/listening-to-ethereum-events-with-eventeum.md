---
title: Listening to Ethereum Events with Eventeum
summary: What is Eventeum? Eventeum is an Ethereum event listener service that provides a bridge between your smart contracts and middleware layer. Events subscriptions can be registered dynamically, and on emission, a message containing the details of the event are broadcast onto a message bus (currently either Kafka or RabbitMQ) which can then be consumed by your backend services. It was developed by the kauri.io team, and the source code is freely available under the Apache 2.0 license. Click here to
authors:
  - Craig Williams (@craig)
date: 2019-08-06
some_url: 
---

# Listening to Ethereum Events with Eventeum

## What is Eventeum?
Eventeum is an Ethereum event listener service that provides a bridge between your smart contracts and middleware layer.  Events subscriptions can be registered dynamically, and on emission, a message containing the details of the event are broadcast onto a message bus (currently either Kafka or RabbitMQ) which can then be consumed by your backend services.

It was developed by the kauri.io team, and the source code is freely available under the Apache 2.0 license.  Click [here](https://github.com/ConsenSys/eventeum/) to view the github repository.
![](https://api.beta.kauri.io:443/ipfs/QmXqLJc3qp8vkHqifRCjbZApg758kdgBrgZVibkMDDFCqZ)
Eventeum is:

- Highly Available - Eventeum services communicate with each other to ensure that every instance is subscribed to the same collection of smart contract events.

- Resilient - Node failures are detected and event subscriptions will continue from the failure block once the node comes back online.

- Fork Tolerant - Eventeum can be configured to wait a certain amount of blocks before an event is considered 'Confirmed'. If a fork occurs during this time, a message is broadcast to the network, allowing your services to react to the forked/removed event.

## Prerequisites

To follow this example, you must have the following installed on your system:

- Java 8
- Maven
- Docker

## Deploying Eventeum

Out of the box, Eventeum has dependencies on a number of external services, namely Kafka/Zookepper and MongoDB.  The easiest way to get an Eventeum instance running locally right now is to clone the repo from github and run the docker-compose script from the server folder.  This will automatically fire up all the dependant services, including a Parity node running in dev mode.

`git clone https://github.com/ConsenSys/eventeum.git`

`cd eventeum`

`mvn clean package`

`cd server`

`docker compose build`

`docker compose up`

## The Smart Contract

For this example, we will use a very basic name registry smart contract, where anyone can add a name to the registry by calling a function.  An event is emitted whenever a name is added, and this will be picked up by Eventeum and broadcast to the backend service.
```
pragma solidity ^0.4.24;

contract NamesRegistry {

    struct Name {
        string firstName;
        string surname;
    }

    Name[] names;

    function add(Name(string firstName, string surname)) external {
        names.pushName(firstName, surname);

        emit NameAdded(names.length - 1, firstName, surname);
    }

    event NameAdded(uint256 id, string firstName, string surname);
}
```

### Deploying
We want to deploy our smart contract to the parity node that we started via docker, so open [remix](https://remix.ethereum.org) and select the 'Web3 Provider' environment from the Run panel.

![](https://api.beta.kauri.io:443/ipfs/QmZtXWsmrcdznQ4xByD4dtV7Gv7VHVvcZaMs4XvbggdWVf)

When prompted, keep the default http://localhost:8545 endpoint address.  You should now be connected to your local parity dev node with plenty of test eth to play around with in the default, unlocked account.

Next, we need to deploy our NamesRegistry smart contract to our Ethereum node so paste the above smart contract code into remix, compile and deploy.  Take a note of the deployed contract address, as we will need this when configuring Eventeum in the next step.

## Configuring Eventeum
Now that our contract is deployed, we need to instruct Eventeum to listen for NameAdded events emitted from this contract.  There are currently 2 ways to do this:

- Properties File - Events that Eventeum should listen for can be configured in the `application.yml` file of Eventeum.
- REST API - Events can be registered dynamically by send http requests to a REST endpoint.  This is the approach that we will use in this tutorial.

## Registering the NameAdded Event with Eventeum via REST
By default Eventeum listens on port 8060, and exposes a filter registration endpoint at `/api/rest/v1/event-filter`.  Paste the below curl request into a terminal, ensuring that the `CONTRACT_ADDRESS' is replaced by the address of the deployed NamesRegistry smart contract in the previous step.

```
curl -X POST \
http://localhost:8060/api/rest/v1/event-filter \
-H 'Cache-Control: no-cache' \
-H 'Content-Type: application/json' \
-H 'Postman-Token: 616712a3-bf11-bbf5-b4ac-b82835779d51' \
-d '{
"id": "NameAddedEvent",
"contractAddress": "CONTRACT_ADDRESS",
"eventSpecification": {
  "eventName": "NameAdded",
  "nonIndexedParameterDefinitions": [
    {"position": 0, "type": "UINT256"},
    {"position": 1, "type": "STRING"},
    {"position": 2, "type": "STRING"}] }
}'
```

If everything went well, you should see a `registerContractEventFilter - Registering filter: {"id":"NameAddedEvent"...` log entry in the running Eventeum docker terminal.

> The body of the REST request defines the specification of the event that is to be registered.  Comparing to the smart contract definition of the event, we can see that it defines the event name, along with the type and order of each parameter.

To test that Eventeum is correctly listening for events emitted from the deployed contract, try adding a name to the registry.

![](https://api.beta.kauri.io:443/ipfs/QmeMarJvXRoGjY8EFa8xrPUDNSjecSYhb9GUq92NbE879g)

If everything is configured correctly, you should see a `broadcastContractEvent` entry in the Eventeum logs that looks similar to this:

```
broadcastContractEvent - Sending message: {"id":"0x2553-0xd5b2-0" ,"type":"CONTRACT_EVENT", "details":
{"name":"NameAdded", "filterId":"NameAddedEvent", "indexedParameters":[], "nonIndexedParameters":
[{"type":"uint256","value":0},{"type":"string","value":"Craig"},{"type":"string","value":"Williams"}], 
"transactionHash":"0x25539b1d3b92c2f61331d9972d48fe24cbbbe3b4da4a901ffd6ebd6514166f5d", "logIndex":0, 
"blockNumber":15, "blockHash":"0xd5b26e4fb8b390e45144632a4d75bdebfa841191a5ffb0d4e2971928357f13ec",
"address":"0xcd9a70c13c88863ece51b302a77d2eb98fbbbd65", "status":"UNCONFIRMED", 
"eventSpecificationSignature":"0x7b876012e0c37b7cd150df23c4d206b4cecc7d4a307d81bc6d921e08171687d6", 
"networkName":"", "id":""0x2553-0xd5b2-0""}, "retries":0}
```

Congratulations, if you see this message then this means that Eventeum has received notification of the event emission from our smart contract, and has pushed a corresponding CONTRACT_EVENT message onto our Kafka queue with all the details of the emitted event.  Pretty sweet!

## Next Steps

Now that Eventeum is configured correctly, you are ready to [build a service that consumes events from the Kafka topic, and perform some processing on these events.](https://kauri.io/article/fe81ee9612eb4e5a9ab72790ef24283d/using-eventeum-to-build-a-java-smart-contract-data-cache)

To learn more about Eventeum API's, message specifications or advanced configuration, checkout the github page at: [https://github.com/ConsenSys/eventeum/](https://github.com/ConsenSys/eventeum/).

Lastly, Eventeum is fully open-source and we welcome community contributions, so feel free to play around with the application and modify it to your needs...just don't forget to create a pull request afterwards, to help improve the product!