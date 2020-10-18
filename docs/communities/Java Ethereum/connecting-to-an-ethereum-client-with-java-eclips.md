---
title: Connecting to an Ethereum client with Java, Eclipse and Web3j
summary: Other articles in this series- - Manage an Ethereum account with Java and Web3j - Generate a Java Wrapper from your Smart Contract - Interacting with an Ethereum Smart Contract in Java - Listening for Ethereum Smart Contract Events in Java - Using Pantheon, the Java Ethereum Client with Linux Ethereum is a Blockchain, which means it operates on a peer-to-peer network composed of thousand of nodes where each node agrees on the next state. In order to interact with the Ethereum global state (distr
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-07-19
some_url: 
---

# Connecting to an Ethereum client with Java, Eclipse and Web3j

![](https://ipfs.infura.io/ipfs/QmZjb5Kp3LFcXTVxneoJN3aco6NF91M7TbVfxUq4B4ySsX)



**Other articles in this series:**
- [Manage an Ethereum account with Java and Web3j](https://kauri.io/article/925d923e12c543da9a0a3e617be963b4)
- [Generate a Java Wrapper from your Smart Contract](https://kauri.io/article/84475132317d4d6a84a2c42eb9348e4b)
- [Interacting with an Ethereum Smart Contract in Java](https://kauri.io/article/14dc434d11ef4ee18bf7d57f079e246e)
- [Listening for Ethereum Smart Contract Events in Java](https://kauri.io/article/760f495423db42f988d17b8c145b0874)
- [Using Pantheon, the Java Ethereum Client with Linux](https://kauri.io/article/276dd27f1458443295eea58403fd6965)

---------------------------------------------------

[**Ethereum**](https://www.ethereum.org/) is a Blockchain, which means it operates on a [peer-to-peer network](https://en.wikipedia.org/wiki/Peer-to-peer) composed of thousand of nodes where each node agrees on the next state.

In order to interact with the Ethereum global state (distributed database), a program needs to connect to a node that exposes the standard [JSON-RPC API](https://github.com/ethereum/wiki/wiki/JSON-RPC#json-rpc-api) which can be used to execute operations on the Ethereum blockchain.

In this article, we will learn how to start an Ethereum Java project and connect to a node using the Java library **[Web3j](https://web3j.io/)**, a lightweight and modular library implementing all the functionallities required to work with Ethereum (JSON-RPC API client, wallet account management, Java Smart Contract wrapper, support for ENS, ERC20 and ERC721 and much more).

![](https://web3j.readthedocs.io/en/latest/_images/web3j_network.png)

### Prerequisite

To run this tutorial, we must have the following installed:

-   [Java programming language](https://java.com/en/download/) (> 8)

```shell
$ java -version
java version "1.8.0_201"
```

-   A package and dependancy manager, for example [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/install/)
-   An IDE (Integrated development environment), for this tutorial, we use [Eclipse](https://www.eclipse.org/downloads/)

### Start a new project

First create a new Maven project called `java_ethereum` in Eclipse.

#### 1. Create a new Maven project

Once Eclipse is launched, we need to create a new Maven project. Go to _File > New > Project > Maven > Maven Project_

Check the box _Create a simple project (skip archetype selection)_ and click on _Next >_.

Next screen, enter the _Group ID_ and _Artifact ID_ of our project then click _Finish_.

Group Id: `io.kauri.tutorials.java-ethereum`

Artifact Id: `java-ethereum`

![](https://imgur.com/IpEZ6gX.png)

It should result of a new project in the _Project Explorer_

![](https://imgur.com/7uiey3U.png)

#### 2. Configure our project to use Java 8

Finally, we need to tell Eclipse and Maven to use Java version 8.

Edit the file `pom.xml` and add the following lines before `</project>`

```xml
  <properties>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.source>1.8</maven.compiler.source>
  </properties>
```

Now, right click on the project name in the _Project Explorer_ and click on _Maven > Update Project_. Click _OK_ in the dialog box that pops up.

In the _Project Explorer_, You should see the _JRE System library_ changing from **JavaSE-1.5** to **JavaSE-1.8**.

![](https://imgur.com/7Pvq9hJ.png)

### Add Web3j library to our project

In this step, we import the latest version of Web3j to our project via maven.

In Eclipse, edit the file `pom.xml` and add the following lines before `</project>`:

```xml
  <dependencies>
    <dependency>
      <groupId>org.web3j</groupId>
      <artifactId>core</artifactId>
      <version>4.3.0</version>
    </dependency>
  </dependencies>
```

_Full pom.xml file available [here](https://github.com/gjeanmart/kauri-content/blob/master/java-ethereum/pom.xml)_

Save file and dependencies will import. In your package explorer you will see a Maven dependencies folder with all the JAR (Java ARchive) packages for web3j and its dependencies.

### Create a Main class

Now, we have all the required dependencies to use Web3j, we can start coding our Ethereum Java program.

Create a Java class `Main.java` in your project by right-clicking on the project and selecting _New > Class_.
Enter the package name `io.kauri.tutorials.java_ethereum`, the class name `Main` and check _public static void main(String\[] args)_.

![](https://imgur.com/iipSbO0.png)

Click on _Finish_ to generate the skeleton file.

```java
//Main.java
package io.kauri.tutorials.java_ethereum;

public class Main {
  public static void main(String[] args) {
    // TODO Auto-generated method stub
  }
}
```

### Connect to an Ethereum node with Web3j.

Now we have created our project, imported the Web3j library and prepared a program to run our code. We can now connect to an Ethereum node and start executing operations over the JSON-RPC API abstracted by Web3j.

#### 1. Add imports

First import the packages needed for our code, or allow your IDE to automatically import them for you:

```java
import java.io.IOException;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.protocol.core.methods.response.EthBlockNumber;
import org.web3j.protocol.core.methods.response.EthGasPrice;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
```

#### 2. Connect to the node

To connect to the node, Web3j requires the JSON-RPC API endpoint:

```java
Web3j web3 = Web3j.build(new HttpService("<NODE ENDPOINT>"));
```

##### Local Ethereum node or ganache-cli

If you are running locally a [Geth](https://geth.ethereum.org/), [Parity](https://www.parity.io/), [Pantheon](https://github.com/PegaSysEng/pantheon) client or [ganache-cli](https://github.com/trufflesuite/ganache-cli). Your node JSON-RPC API endpoint is `http://localhost:8545` by default

```java
Web3j web3 = Web3j.build(new HttpService("http://localhost:8545"));
```

##### Ganache application: Local development blockchain

If you are running the [Ganache](https://www.trufflesuite.com/ganache) application on your machine. Your node JSON-RPC API endpoint is `http://localhost:7545` by default. _ganche-cli uses port 8545_

```java
Web3j web3 = Web3j.build(new HttpService("http://localhost:7545"));
```

_Note: As a test network, Ganache doesn't support all the JSON-RPC API operations specified, for example `net_peercount`._

##### Infura: Hosted nodes for public mainet and testnets

If you use [Infura](https://infura.io). The node JSON-RPC API endpoint is `https://<network>.infura.io/v3/<project key>`.

```java
Web3j web3 = Web3j.build(new HttpService("https://mainnet.infura.io/v3/<project key>"));
```

#### 3. Execute API operations

Web3j implements a JSON-RPC API client for Ethereum which can be used in the following way `<response> = web3.<operation>.send()`. For example:

```java
try {
  // web3_clientVersion returns the current client version.
  Web3ClientVersion clientVersion = web3.web3ClientVersion().send();

  //eth_blockNumber returns the number of most recent block.
  EthBlockNumber blockNumber = web3.ethBlockNumber().send();

  //eth_gasPrice, returns the current price per gas in wei.
  EthGasPrice gasPrice =  web3.ethGasPrice().send();

} catch(IOException ex) {
  throw new RuntimeException("Error whilst sending json-rpc requests", ex);
}
```

**Note:** Serilization of the JSON-RPC request can raise an `IOException` exception, so you need to handle it.

### Result

The following code shows the entire Java program which connects to an Ethereum node and runs some JSON-RPC calls.

```java
//Main.java
package io.kauri.tutorials.java_ethereum;

import java.io.IOException;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthBlockNumber;
import org.web3j.protocol.core.methods.response.EthGasPrice;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
import org.web3j.protocol.http.HttpService;

public class Main {

  public static void main(String[] args) {
    System.out.println("Connecting to Ethereum ...");
    Web3j web3 = Web3j.build(new HttpService("http://localhost:8545"));
    System.out.println("Successfuly connected to Ethereum");

    try {
      // web3_clientVersion returns the current client version.
      Web3ClientVersion clientVersion = web3.web3ClientVersion().send();

      // eth_blockNumber returns the number of most recent block.
      EthBlockNumber blockNumber = web3.ethBlockNumber().send();

      // eth_gasPrice, returns the current price per gas in wei.
      EthGasPrice gasPrice = web3.ethGasPrice().send();

      // Print result
      System.out.println("Client version: " + clientVersion.getWeb3ClientVersion());
      System.out.println("Block number: " + blockNumber.getBlockNumber());
      System.out.println("Gas price: " + gasPrice.getGasPrice());

    } catch (IOException ex) {
      throw new RuntimeException("Error whilst sending json-rpc requests", ex);
    }
  }
}
```

_Full file available [here](https://github.com/gjeanmart/kauri-content/blob/master/java-ethereum/src/main/java/io/kauri/tutorials/java_ethereum/Main.java)_

To run the program, right-click on the file `Main.java` and click on _Run As > Java Application_. You should see in the console the following result.

```shell
Connecting to Ethereum ...
Successfuly connected to Ethereum
Client version: Geth/v1.8.22-omnibus-260f7fbd/linux-amd64/go1.11.1
Block number: 7983049
Gas price: 3000000000
```

![](https://imgur.com/MWJqowg.gif)

### References

-   [GitHub Project code](https://github.com/gjeanmart/kauri-content/tree/master/java-ethereum)
-   [Web3j website](https://web3j.io/)
-   [Web3j documentation](https://web3j.readthedocs.io/en/latest/)
-   [Web3j Github repo](https://github.com/web3j/web3j)
-   [Ethereum JSON-RPC API](https://github.com/ethereum/wiki/wiki/JSON-RPC)


-----------------------------

**Next Steps:**

- [Manage an Ethereum account with Java and Web3j](https://kauri.io/article/925d923e12c543da9a0a3e617be963b4)
- [Generate a Java Wrapper from your Smart Contract](https://kauri.io/article/84475132317d4d6a84a2c42eb9348e4b)
- [Interacting with an Ethereum Smart Contract in Java](https://kauri.io/article/14dc434d11ef4ee18bf7d57f079e246e)
- [Listening for Ethereum Smart Contract Events in Java](https://kauri.io/article/760f495423db42f988d17b8c145b0874)
- [Using Pantheon, the Java Ethereum Client with Linux](https://kauri.io/article/276dd27f1458443295eea58403fd6965)



---

- **Kauri original link:** https://kauri.io/connecting-to-an-ethereum-client-with-java-eclips/b9eb647c47a546bc95693acc0be72546/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2019-07-19
- **Kauri original tags:** ethereum, java, maven, web3j, json-rpc, eclipse
- **Kauri original hash:** QmdCsaJm7ajyh3ZyxacmSc94FFoBgSPWeWJLLYTCEMUUxf
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



