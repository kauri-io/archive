---
title: Running a Pantheon Node in Java Integration Tests
summary: The first problem you are likely to meet when attempting to write integration tests for your Java Ethereum application is that you need a running node to connect to for sending transactions. One option to overcome this is to run a node yourself manually in the background, but this becomes hard to manage if you want to run your tests in a CI pipeline, and forcing all contributors to you codebase to run a node manually is not ideal. Luckily theres a better way! Prerequisites A running Docker daemo
authors:
  - Craig Williams (@craig)
date: 2019-08-13
some_url: 
---

# Running a Pantheon Node in Java Integration Tests

![](https://ipfs.infura.io/ipfs/QmPS8X2k3fEVfFr37L2Paq8Gj1KVgMBEKAHMdLyNrSxsHa)


The first problem you are likely to meet when attempting to write integration tests for your Java Ethereum application is that you need a running node to connect to for sending transactions. One option to overcome this is to run a node yourself manually in the background, but this becomes hard to manage if you want to run your tests in a CI pipeline, and forcing all contributors to you codebase to run a node manually is not ideal. Luckily there's a better way!

### Prerequisites

-   A running Docker daemon
-   An understanding of [Junit](https://junit.org/)
-   Code to test. This tutorial doesn't show this code explicitly, but you can [find an example that builds upon other tutorials in this community on GitHub](https://github.com/kauri-io/java-web3j-pantheon-testing/blob/4814ff2c81d5e1141671b4d1f0680e901bc72051/src/test/java/io/kauri/java/test/TestWeb3jPantheon.java#L63).

### Running a Node with Testcontainers

[Testcontainers](https://www.testcontainers.org/) is a useful library that allows you to fire up a Docker container programmatically within your test code, and there are several Ethereum clients that have ready-made Docker containers uploaded to Dockerhub, which makes this task easier.

In this guide, I describe how to start and shutdown a [Pantheon](https://github.com/PegaSysEng/pantheon) node during your integration tests, so you don't have to start a node manually or within your CI pipeline

### Including the Testcontainers library

We get the Testcontainers library dependency via maven central, so to include the library, add the following dependency to your _pom.xml_ (or equivalent in Gradle):

```xml
<dependency>
 <groupId>org.testcontainers</groupId>
 <artifactId>testcontainers</artifactId>
 <version>1.12.0</version>
 <scope>test</scope>
</dependency>
```

### Starting Pantheon

It's better and more performant to start Pantheon once, before all tests execute, rather than before every test. To achieve this behaviour, we instantiate a static `GenericContainer` annotated with a `@ClassRule` JUnit annotation.

Create a new class in the project _test_ folder, and add the code below to it:

_ClassRule_

```java
@ClassRule
public static final GenericContainer pantheonContainer =
 new GenericContainer("pegasyseng/pantheon:1.1.3")
 .withExposedPorts(8545, 8546)
 .withCommand(
 "--miner-enabled",
 "--miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
 "--rpc-http-enabled",
 "--rpc-ws-enabled",
 "--network=dev")
 .waitingFor(Wait.forHttp("/liveness").forStatusCode(200).forPort(8545));
```

Before any tests run, a `GenericContainer` is instantiated, with a docker image name as an argument. We're using the 1.1.3 version of Pantheon in this instance, and we expose the standard default ports for HTTP and websocket RPC with the `withExposedPorts(..)` method.

We set some runtime command arguments which configure the node in a way that is suitable for testing the following:

-   `--miner-enabled`: Enables mining so that the transactions we send within our tests are included within blocks.
-   `--miner-coinbase`: Set the coinbase to an account that you have a private key for. This is mandatory when mining is enabled. Here we set the account to be the well-known Pantheon dev account, which is automatically loaded with Ether when in dev mode.
-   `--rpc-http-enabled`: Enable the HTTP RPC endpoint so that Web3j can connect.
-   `--rpc-ws-enabled`: Enable the websocket RPC endpoint. This is not required if you are only testing HTTP.
-   `--network=dev`: Sets the network type to `dev`. This starts a private development node, with a pre-defined configuration to make mining easier on CPU usage.

For a full list of all available Pantheon commands, [read the official documentation](https://docs.pantheon.pegasys.tech/en/stable/Reference/Pantheon-CLI-Syntax/).

#### Waiting for Pantheon to Start

We must wait for Pantheon to start before running our tests fully. Pantheon comes autoconfigured with a liveness endpoint, so testcontainers automatically polls the `/liveness` endpoint on port `8545` until it returns a 200 response. We can then be confident that Pantheon is running.

### Connecting to the Pantheon container using Web3j

Pantheon should now be up and running on `localhost`. You can now connect to the Pantheon node within your test classes, and perform Ethereum operations such as sending transactions by using Web3j:

```java
private Web3j web3j;

private Credentials credentials = 
    Credentials.create("0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63");  

@Before
public void initWeb3() {
  final Integer port = pantheonContainer.getMappedPort(8545);
  web3j = Web3j.build(new HttpService(
      "http://localhost:" + port), 500, Async.defaultExecutorService());
}

```

#### Mapped Port

We exposed the default JSON RPC port, 8545 when creating the container, but did not map it to the same port on localhost. A random available port is automatically selected instead, which is beneficial because it removes the chance of the port not being open on your test machine (which could happen if you are running the tests in parallel for example).

To get the mapped port number, call the `getMappedPort(..)` method on the container. We can use these ports when constructing the Web3j connection URL.

#### Polling Interval

By default, Web3j polls the connected Ethereum client every 10 seconds for operations such as getting the latest mined blocks and checking if events have been emitted. Our Pantheon test network generally creates blocks much faster than every 10 seconds, so reducing the poll interval in Web3j should increase the speed of the tests. We can pass the poll interval to the `Web3j.build` static method, and above, we configure the interval to 500ms.

#### Test Credentials

Sending transactions in our private dev network still requires gas, so we must have access to an account with a positive balance, and the development network has some accounts pre-loaded with more test Ether than you could ever need! The private keys of these accounts are documented [here](https://docs.pantheon.pegasys.tech/en/stable/Configuring-Pantheon/Accounts-for-Testing/), which makes it easy to generate a `Credentials` object for use in your tests.

### Stopping Pantheon / Web3j

As we're using a `@ClassRule` annotation, stopping the Pantheon container is handled automatically at the end of the test class execution. Its a good idea to shutdown the web3j instance after each test though:

```java
@After
public void shutdownWeb3j() {
 web3j.shutdown();
}
```

### Summary

Using the Testcontainers library to start a Pantheon node is a convenient way to ensure that an Ethereum node is accessible to your tests. This makes running the tests in your continuous integration pipeline less arduous, and also means that other third party contributors can run your tests on their local machine more easily.

You can find an example test class demonstrating the code described in this tutorial [on GitHub](https://github.com/kauri-io/java-web3j-pantheon-testing/blob/master/src/test/java/io/kauri/java/test/TestWeb3jPantheon.java), from the [java-web3j-pantheon-testing](https://github.com/kauri-io/java-web3j-pantheon-testing) project.


---

- **Kauri original link:** https://kauri.io/running-a-pantheon-node-in-java-integration-tests/7dc3ecc391e54f7b8cbf4e5fa0caf780/a
- **Kauri original author:** Craig Williams (@craig)
- **Kauri original Publication date:** 2019-08-13
- **Kauri original tags:** ethereum, junit, java, web3j, testing, pantheon
- **Kauri original hash:** QmUAyrxMcrhPuX1AjXenAcrE46e42Dm9sdZio9mJd8QZ4X
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



