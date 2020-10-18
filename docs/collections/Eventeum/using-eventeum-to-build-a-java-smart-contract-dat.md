---
title: Using Eventeum to Build a Java Smart Contract Data Cache
summary: In this tutorial, I am going to walk you through how to build a service that caches data emitted via smart contract events, so that this data can be consumed by other services in your system. Why would I want to do this? It all boils down to usability of your dApp. Web3 applications with no middleware layer at all generally do not provide the kind of user experience that end users are familiar with in the traditional web2 world. Operations such as complex searches across data stored within smart
authors:
  - Craig Williams (@craig)
date: 2019-04-14
some_url: 
---

# Using Eventeum to Build a Java Smart Contract Data Cache


In this tutorial, I am going to walk you through how to build a service that caches data emitted via smart contract events, so that this data can be consumed by other services in your system.

## Why would I want to do this?
It all boils down to usability of your dApp.  Web3 applications with no middleware layer at all generally do not provide the kind of user experience that end users are familiar with in the traditional web2 world.  Operations such as complex searches across data stored within smart contract state are difficult to implement if your application relies on calls directly into smart contract functions.  Even if this is possible, the performance of obtaining this data via a database will be much higher than making smart contract calls to an Ethereum node.

## Isn't that Centralization?
Its true that by adding a middleware layer into your dApp architecture, you are also adding a centralized point of failure into your application.  However, if you design your protocol layer in a way that does not inherently depend on these middleware services, then this may be a compromise that you're comfortable with.  Essentially, you're saying that "ok, my application frontend will not be usable if these services owned and managed by me go down, but all the information is freely available for anyone else to build their own frontend on top of the protocol, regardless of the middleware".  Even better, open source all your code so that other parties can run mirror deployments!

## Prerequisites

To follow this guide, you should have some java experienced, along with having java, maven and docker installed on your machine.

This tutorial follows on from the ["Getting Started with Eventeum"](https://beta.kauri.io/article/90dc8d911f1c43008c7d0dfa20bde298) Kauri article.  This article walked you through getting Eventeum up and running, deploying a sample NameRegistry smart contract, and configuring Eventeum to listen to events for events emitted from the contract.

For reference, the NameRegistry smart contract code is as below:
```
pragma solidity ^0.4.24;

contract NamesRegistry {

    struct Name {
        string firstName;
        string surname;
    }

    Name[] names;

    function addName(string firstName, string surname) external {
        names.push(Name(firstName, surname));

        emit NameAdded(names.length - 1, firstName, surname);
    }

    event NameAdded(uint256 id, string firstName, string surname);
}
```

As the Eventeum docker-compose file already contains an instance of MongoDB, we will use that for our data storage.

## The Java Service

Eventeum has been configured to push smart contract event messages to a Kafka topic (other broadcast mechanisms are also supported), so we are going to build a service in Java that consumes messages from this topic, and store the name registry entries in a MongoDB database.  A simple REST endpoint will also be implemented that provides some basic search operations on this data.

We will utilise Spring Boot libraries to write the minimum amount of code possible to achieve this task.  Not every single line of code will be described here (such as interfaces, domain objects and the pom.xml file), so it may be a good idea to take a look at the example project [github repo](https://github.com/craigwilliams84/eventeum_caching_example).

### Eventeum Dependency

Will will reuse the message and domain objects from the Eventeum library, so we need to pull in the eventeum-core library from maven.  In your pom.xml, add:

```
<dependency>
        <groupId>net.consensys.eventeum</groupId>
        <artifactId>eventeum-core</artifactId>
        <version>0.4.0-RELEASE</version>
</dependency>
```

You must also add the Kauri bintray repository:

```
<repository>
        <id>bintray-consensys-kauri</id>
        <url>https://consensys.bintray.com/kauri</url>
</repository>
```

### Consuming from the Kafka Topic
```
@Component
public class KafkaEventeumConsumer {

    private static final String NAME_ADDED_EVENT = "NameAdded";

    private NamesRegistryService namesRegistryService;

    private Map<String, Consumer<ContractEventDetails>> consumers;

    @Autowired
    public KafkaEventeumConsumer(NamesRegistryService namesRegistryService) {
        this.namesRegistryService = namesRegistryService;

        consumers = new HashMap<>();

        consumers.put(NAME_ADDED_EVENT, (contractEventDetails -> {
            namesRegistryService.storeFromContractEvent(contractEventDetails);
        }));
    }

    @KafkaListener(topics = "contract-events", groupId = "eventeumExample")
    public void consumeContractEvent(EventeumMessage<ContractEventDetails> message) {
        final ContractEventDetails contractEventDetails = message.getDetails();
        final String eventName = contractEventDetails.getName();

        if (consumers.containsKey(eventName)) {
            consumers.get(eventName).accept(contractEventDetails);
        }
    }
}
```
This class utilises the `spring-kafka` library, and in particular, the `@KafkaListener` annotation, to define a method that will consume EventeumMessage objects from the `contract-events` topic.  If the received message is for an event named `NameAdded` (the name of the event specified in the smart contract), then the details about this event are passed to the `NameRegistryService`, in order to store the required data.

Spring-boot will automatically assume that the Kafka broker is running on localhost if you don't specify an address in the properties file, so this works for us out of the box.

One additional missing piece of the puzzle, is to configure the Kafka consumer to automatically deserialize from the Eventeum JSON message to the Java Object.  This can be achieved with some configuration code.  Note the `JsonDeserializer` passed to the `DefaultKafkaConsumerFactory`:

```
@EnableKafka
@Configuration
public class KafkaConfiguration {

    @Value("${kafka.bootstrap.addresses}")
    private String bootstrapAddresses;

...

    @Bean
    public ConsumerFactory<String, EventeumMessage> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddresses);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, null, new JsonDeserializer<>(EventeumMessage.class));
    }

...

}
```

For reference, an example Eventeum JSON message looks like this:

```
{
	"id":"unique-event-id",
	"type":"CONTRACT_EVENT",
	"details":{
		"name":"DummyEvent",
		"filterId":"63da468c-cec6-49aa-bea4-eeba64fb1df4",
		"indexedParameters":[{"type":"bytes32","value":"BytesValue"},
			{"type":"address","value":"0x00a329c0648769a73afac7f9381e08fb43dbea72"}],
		"nonIndexedParameters":[{"type":"uint256","value":10},
			{"type":"string","value":"StringValue"}],
		"transactionHash":"0xe4fd0f095990ec471cdf40638336a73636d2e88fc1a240c20b45101b9cce9438",
		"logIndex":0,
		"blockNumber":258,
		"blockHash":"0x65d1956c2850677f75ec9adcd7b2cfab89e31ad1e7a5ba93b6fad11e6cd15e4a",
		"address":"0x9ec580fa364159a09ea15cd39505fc0a926d3a00",	
		"status":"UNCONFIRMED",
		"eventSpecificationSignature":"0x46aca551d5bafd01d98f8cadeb9b50f1b3ee44c33007f2a13d969dab7e7cf2a8",
		"id":"unique-event-id"},
		"retries":0
}
```

### The NamesRegistryService

The `NameRegistryService` is the bridge between the Kafka consumer and the MongoDB repository, along with providing methods to search the data stored in the database.  It is quite a simple class, and delegates most tasks to the `NamesRepository` (which is itself a simple `MongoRepository` interface).

```
@Service
public class DbNamesRegistryService implements NamesRegistryService {

    private NamesRepository repository;
    private NameConverter<ContractEventDetails> converter;

    @Autowired
    public DbNamesRegistryService(NamesRepository repository,
                                  NameConverter<ContractEventDetails> converter) {
        this.repository = repository;
        this.converter = converter;
    }

    @Override
    public void storeFromContractEvent(ContractEventDetails contractEvent) {
        final Name namedAccount = converter.convert(contractEvent);

        repository.save(namedAccount);
    }

    @Override
    public List<Name> searchBySurname(String surname) {
        return repository.findBySurname(surname);
    }

    @Override
    public List<Name> searchByFirstNameStartingWith(String startsWith) {
        return repository.findByFirstNameStartingWith(startsWith);
    }
}
```

The interesting code is in the NameConverter implementation.  This class converts from a `ContractEventDetails` object, to a `Name` domain object which can then be stored in the `NameRepository`.  As of writing (version 0.4.0-RELEASE), a `ContractEventDetails` object contains the following fields (along with corresponding getters and setters):

```
private String name;
private String filterId;
private List<EventParameter> indexedParameters;
private List<EventParameter> nonIndexedParameters;
private String transactionHash;
private BigInteger logIndex;
private BigInteger blockNumber;
private String blockHash;
private String address;
private ContractEventStatus status = ContractEventStatus.UNCONFIRMED;
private String eventSpecificationSignature;
private String networkName;
```

There are a number of fields that provide information on the transaction and block that an event belongs to, but the values that we are most interested in are the `indexedParameters` and `nonIndexedParameters`.  These are the parameter values of the emitted event.  

### NameConverter

```
@Component
public class ContractEventToNamedAccountConverter implements NameConverter<ContractEventDetails> {

    @Override
    public Name convert(ContractEventDetails input) {
        final Name namedAccount = new Name();

        final List<EventParameter> eventParameters = input.getNonIndexedParameters();

        namedAccount.setId(new BigInteger(eventParameters.get(0).getValueString()));
        namedAccount.setFirstName(eventParameters.get(1).getValueString());
        namedAccount.setSurname(eventParameters.get(2).getValueString());

        return namedAccount;
    }
}
```

Parameters are included within the `ContractEventDetails` object in the order that they are declared in the smart contract code.  In our example, for the `NameAdded` event, id will be at index 0, firstName at index 1 and surname at index 2.  The converter calls the `getValueAsString` method of the EventParameter's,  setting the values on the `Name` object.  Note that in the case of the id field, the `String` is converted to a `BigInteger`.

### REST Endpoint

In order to search the cached name registry data stored in mongoDB, and to test that everything is working correctly, a REST endpoint is included within the service.  This endpoint takes either a `firstNameStartsWith`or `surname` url parameter as input, to define the type of search that is to be performed. Spring makes it very simple to create a REST endpoint by adding a `@RestController` annotation to the class, along with a `@RequestMapping` annotation to methods that are to be triggered by the http request.  The `searchNames` method delegates to one of two `NameRegistryService` methods, depending on the arguments passed in.

```
@RestController
@RequestMapping("name")
public class RestEndpoint {

    private NamesRegistryService namesRegistryService;

    @Autowired
    public RestEndpoint(NamesRegistryService namesRegistryService) {
        this.namesRegistryService = namesRegistryService;
    }

    @RequestMapping(path = "", method = RequestMethod.GET, produces = "application/json")
    public List<Name> searchNames(@RequestParam(required = false) String firstNameStartsWith,
                                  @RequestParam(required = false) String surname) {
        if (firstNameStartsWith != null) {
            return namesRegistryService.searchByFirstNameStartingWith(firstNameStartsWith);
        }

        if (surname != null) {
            return namesRegistryService.searchBySurname(surname);
        }

        throw new IllegalArgumentException("Search parameter not set");
    }
}
```

Thats pretty much it!  We should now have a working service that consumes events emitted from an Ethereum smart contract via a Kafka queue, and stores this event data in a database that can then be searched over more efficiently than via the smart contract directly...pretty sweet!!

## Testing the Service

First, ensure that you have followed the [getting started guide](https://beta.kauri.io/article/90dc8d911f1c43008c7d0dfa20bde298) to the end.

Next,  clone the example github repo and run spring-boot application:
```
git clone https://github.com/craigwilliams84/eventeum_caching_example.git
cd eventeum_caching_example
mvn spring-boot:run
```

The caching service and Eventeum will now be connected to the same Kafka broker, so contract event messages pushed by Eventeum will be consumed by the service.

Now add a bunch of sample users in remix (again, described in the getting started guide), and test out some searches in your browser by querying the REST endpoint (at http://localhost:8080/name).  If everything is working correctly you should get the correct results:

![](https://api.beta.kauri.io:443/ipfs/QmSrkLxGJBNRMF1DQhYSum9D29HghmEZXtfXfGmuFQhTXm)
![](https://api.beta.kauri.io:443/ipfs/QmbZZFY5y9TGzBtAVTZ5ynxum4pPjiWqqNm3krwEWLZJWA)

## Summary

Congratulations!  You have just implemented a caching service that listens to events emitted from a smart contract (via Eventeum), and stores this data into a MongoDB database for easier querying in your dApp.  By depending on Eventeum for the Ethereum side of things, you did not have to actually write that much code, and have resiliency and failover resistance out of the box!
