---
title: Managing storage in a Java application with IPFS
summary: In this article, we learn how to interact with IPFS (InterPlanetary File System) in Java using the official java-ipfs-http-client library. This library connects to an IPFS node and wraps most of the operations offered by the HTTP API. The following diagram describes a Java program connected to an IPFS node via the java-ipfs-http-client library to the API Server. API server (default port- 5001)- Full API Gateway server (default port- 8080)- Read Only API (access to data only) P2P (default port- 4
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-08-14
some_url: 
---

# Managing storage in a Java application with IPFS


In this article, we learn how to interact with **[IPFS](https://ipfs.io/) (InterPlanetary File System)** in Java using the official [**java-ipfs-http-client library**](https://github.com/ipfs/java-ipfs-http-client). This library connects to an IPFS node and wraps most of the operations offered by the [HTTP API](https://docs.ipfs.io/reference/api/http/).

The following diagram describes a Java program connected to an IPFS node via the **java-ipfs-http-client** library to the API Server.

![](https://imgur.com/RRB6chj.png)

-   API server (default port: 5001): Full API
-   Gateway server (default port: 8080): Read Only API (access to data only)
-   P2P (default port: 4001): Peer-to-peer interface


<br />

## Prerequisites

To run this tutorial, we must have the following installed:

-   Java programming language (> 8)

```shell
$ java -version
java version "1.8.0_201"
```

-   A package and dependency manager, for example [Maven](https://maven.apache.org) or [Gradle](https://gradle.org)
-   An IDE (Integrated development environment), for this tutorial, we use Eclipse
-   A running IPFS node (> 0.4.x)
    _Follow [the following article](https://kauri.io/article/b01b9b7bebcd4ebf80edf021bdd0e232/v2/installing-ipfs) to learn how to install an IPFS node (go-ipfs)_

## Dependencies

To get started, import the `java-ipfs-http-client` dependency

### Maven

Using Maven, we first need to configure the repository that hosts the dependency and then import the dependency. Add the code below before the closing `</project>` tag:

_[pom.xml](https://github.com/gjeanmart/kauri-content/blob/master/java-ipfs/pom.xml)_

```xml
 <properties>
   <maven.compiler.target>1.8</maven.compiler.target>
   <maven.compiler.source>1.8</maven.compiler.source>
   <java-ipfs-http-client.version>v1.2.3</java-ipfs-http-client.version>
 </properties>

 <repositories>
   <repository>
     <id>jitpack.io</id>
     <url>https://jitpack.io</url>
   </repository>
 </repositories>

 <dependencies>
   <dependency>
     <groupId>com.github.ipfs</groupId>
     <artifactId>java-ipfs-http-client</artifactId>
     <version>${java-ipfs-http-client.version}</version>
   </dependency>
 </dependencies>
```

### Gradle

The equivalent using Gradle:

```groovy
dependencies {
  compile "com.github.ipfs:java-ipfs-http-client:v1.2.3"
}
```


<br />

## Connect to IPFS

Once we've imported `java-ipfs-http-client`, the first step of our application is connecting to an IPFS node.

### Connect by host and port

We can connect by a host and port like this:

```java
IPFS ipfs = new IPFS("localhost", 5001);
```

### Connect by multiaddr

It is also possible to connect by [multiaddr](https://multiformats.io/multiaddr). A multiaddr represents a self-describing network address.

> Multiaddr is a format for encoding addresses from various well-established network protocols. It is useful to write applications that future-proof their use of addresses and allow multiple transport protocols and addresses to coexist.

```java
IPFS ipfs = new IPFS("/ip4/127.0.0.1/tcp/5001");
```

If the IPFS node sits behind a proxy with SSL (like [Infura](https://infura.io/)), we can configure `java-ipfs-http-client` to use `https` rather than `http` but a multiaddr is required.

```java
IPFS ipfs = new IPFS("/dnsaddr/ipfs.infura.io/tcp/5001/https");
```


<br />

## Add content to IPFS

When adding a file on the IPFS network, the file is uploaded to the IPFS node we are connected to and stored in its local datastore. This operation returns a unique identifier of the file called "multihash" (for example: `Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a`).

![](https://imgur.com/F5U0gHN.png)

We use the `ipfs.add(NamedStreamable file): List<MerkleNode>` method to store content on the IPFS node we are connected to. This method takes a `NamedStreamable` or a `List<NamedStreamable>` as input. `NamedStreamable` has four different implementations:

-   `FileWrapper` wraps a `java.io.File`
-   `InputStreamWrapper` wraps a `java.io.InputStream`
-   `ByteArrayWrapper` wraps a `byte[]`
-   `DirWrapper` wraps a `(String name, List<NamedStreamable> children)` to describe a hierarchical files structure

We can also add optional parameters to the method:

-   `wrap` [boolean]&#x3A; Wrap files into a directory.
-   `hashOnly` [boolean]&#x3A; Only chunk and hash - do not write to the datastore.

Finally, the method returns a list of `MerkleNode` which represents the content-addressable objects just added on the IPFS network.

### File (FileWrapper)

We can use `NamedStreamable.FileWrapper` to pass a `java.io.File` to IPFS.

```java
try {
  NamedStreamable.FileWrapper file = new NamedStreamable.FileWrapper(new File("/home/gjeanmart/Documents/hello.txt"));
  MerkleNode response = ipfs.add(file).get(0);
  System.out.println("Hash (base 58): " + response.hash.toBase58());
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

### InputStream (InputStreamWrapper)

If you are dealing with a `java.io.InputStream`, use `NamedStreamable.InputStreamWrapper`:

```java
try {
  NamedStreamable.InputStreamWrapper is = new NamedStreamable.InputStreamWrapper(new FileInputStream("/home/gjeanmart/Documents/hello.txt"));
  MerkleNode response = ipfs.add(is).get(0);
  System.out.println("Hash (base 58): " + response.name.get() + " - " + addResponse.hash.toBase58());
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

### Byte Array (ByteArrayWrapper)

To store a `byte[]`, use `NamedStreamable.ByteArrayWrapper`.

```java
try {
  NamedStreamable.ByteArrayWrapper bytearray = new NamedStreamable.ByteArrayWrapper("hello".getBytes());
  MerkleNode response = ipfs.add(bytearray).get(0);
  System.out.println("Hash (base 58): " + response.hash.toBase58());
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

### Directory (DirWrapper)

Finally, to store files inside folders, use `NamedStreamable.DirWrapper`. For example, with the folder structure below:

```text
folder
|-- hello.txt
|-- hello2.txt
```

Use:

```java
try {
  NamedStreamable.FileWrapper file1 = new NamedStreamable.FileWrapper(new File("/home/gjeanmart/Documents/hello.txt"));
  NamedStreamable.FileWrapper file2 = new NamedStreamable.FileWrapper(new File("/home/gjeanmart/Documents/hello2.txt"));

  NamedStreamable.DirWrapper directory = new NamedStreamable.DirWrapper("folder", Arrays.asList(file1, file2));
  List<MerkleNode> response = ipfs.add(directory);
  response.forEach(merkleNode ->
  System.out.println("Hash (base 58): " + merkleNode.name.get() + " - " + merkleNode.hash.toBase58()));
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/OWF5ppv.png)

### MerkleNode

IPFS is a peer-to-peer network essentially used to share linked Objects from a giant Merkle tree. When adding one file or a directory to IPFS, this operation returns the new dedicated branch of the Merkle tree composed of one or more linked Objects. We represent these branches in Java as a `List<MerkleNode>`.

A `MerkleNode` is composed of the following information:

-   **hash** (multihash): a unique identifier of the Object within IPFS
-   **name** (optional): Name of the object (usually the folder or filename)
-   **size** (optional): Size of the object
-   **links** (zero or more): A list of child Objects

### MultiHash

[Multihash](https://multiformats.io/multihash/) ([github](https://github.com/multiformats/multihash)) is a self-describing hash to uniquely identify and locate an object into the IPFS Merkle tree. It is usually represented in Base58, but we can also represent it in hexadecimal.

A multihash consists of different parts:

![](https://i.imgur.com/NQNmMcU.png)

For example (in hexadecimal)

![](https://i.imgur.com/Vik04Ap.png)

#### Read a Base58 hash to Multihash

```java
Multihash multihash = Multihash.fromBase58("QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o");
```

#### Read a Base16 (hexadecinal) hash to Multihash

```java
Multihash multihash = Multihash.fromHex("122046d44814b9c5af141c3aaab7c05dc5e844ead5f91f12858b21eba45768b4ce");
```

#### Convert a Multihash to Base58

```java
String hash = multihash.toBase58();
```

#### Convert a Multihash to Base16

```java
String hash = multihash.toHex();
```

#### Convert a Multihash to a byte array

```java
byte[] hash = multihash.toBytes();
```


<br />

## Read content from IPFS

In order to read a file on the IPFS network, we need to pass the hash (multihash) of the Object we want to retrieve. Then IPFS finds and retrieves the file from the closest peer hosting the file via the peer-to-peer network and a [Distributed Hash Table](https://en.wikipedia.org/wiki/Distributed_hash_table).

![](https://imgur.com/ormQrVT.png)

Using `java-ipfs-http-client`, there are two ways to read content from the IPFS network.

### Read content into a Byte array

The most common way to find and read content from IPFS for a given hash is to use the method `ipfs.cat(<hash>): byte[]`

```java
try {
  String hash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o"; // Hash of a file
  Multihash multihash = Multihash.fromBase58(hash);
  byte[] content = ipfs.cat(multihash);
  System.out.println("Content of " + hash + ": " + new String(content));
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/QD6fx2R.png)

It's also possible to retrieve a file from a directory structure by passing the path of the file like this `ipfs.cat(<hash>, <path>): byte[]`:

```java
try {
  String hash = "QmNoQbeckeCN7FWt6mVcxTf7CAyyHUMsqtCWtMLFdsUayN"; // Hash of a directory
  Multihash multihash = Multihash.fromBase58(hash);
  byte[] content = ipfs.cat(multihash, "/hello2.txt");
  System.out.println("Content of " + hash + "/hello2.txt : " + new String(content));
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/LpwsU4P.png)

### Read content into a stream

The second way consists in using the method `ipfs.catStream(<hash>): InputStream` to write the response in a Stream.

```java
try{
  String hash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o"; // Hash of a file
  Multihash multihash = Multihash.fromBase58(hash);
  InputStream inputStream = infuraIPFS.catStream(filePoinhashter2);
  Files.copy(inputStream, Paths.get("/home/gjeanmart/Documents/helloResult.txt"));
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```


<br />

## Pin/Unpin content

Adding a file on IPFS only creates a copy of the file in one location (your node), so the file is readable from any node unless your node goes offline. Pinning is the action to replicate a file (already available somewhere on the network) to our local node.

This method is useful to bring speed and high availability to a file.

![](https://imgur.com/nkf28QP.png)

### Pin

The method `ipfs.pin.add(<hash>): void` offers to pin a file by hash on our node.

```java
try {
  String hash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o"; // Hash of a file
  Multihash multihash = Multihash.fromBase58(hash);
  ipfs.pin.add(multihash);
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

_Pinning an Object linked to other Objects (children) such as a directory automatically pins all the subsequent children._

### Unpin

The reverse operation is also possible with the method `ipfs.pin.rm(<hash>, <recursive>): void` which removes a file from our node.

```java
try {
  String hash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o"; // Hash of a file
  Multihash multihash = Multihash.fromBase58(hash);
  ipfs.pin.rm(multihash)
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

We can use the flag `recursive [boolean]` to remove (unpin) all the subsequent linked objects to the object identified by the hash (default true).

### List

Finally, we can list all the content hosted on our local node with the method `ipfs.pin.ls(<pinType>): Map<Multihash, Object>`

```java
try {
  Map<Multihash, Object> list = ipfs.pin.ls(PinType.all);
  list.forEach((hash, type)
    -> System.out.println("Multihash: " + hash + " - type: " + type));
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/bNBgYtk.png)

We can request different types of pinned keys to list:

-   `all`: All Objects
-   `direct`: Objects pinned directly
-   `indirect`: Objects referenced by recursive pins
-   `recursive`: Roots of recursive pins (like direct, but also pin the children of the object)


<br />

## IPNS

IPNS stands for "InterPlanetary Naming System" and represents a global mutable namespace accessible from anywhere on the IPFS network to assign a name against a hash (similar to a DNS server assigning a name against a server IP). This can be useful when we want to share a link of a mutable object.

Let's say for example we want to host an article on IPFS, the article (version 1) has a unique hash, but if we decide to update the article and host it on IPFS, the hash is different, and we have to reshare the new hash. We can use IPNS to prevent this issue, it is possible to link a name to a hash and update the hash a much as we want so we only have to reassign the hash of the article to a name and share the name, if we update the article, we only have to update the name resolution to point to the latest version.

_Note: IPNS is still work in progress and is slow to use, it takes approximately 1-2 min to publish a name._

### Keys

IPNS is based on a distributed Public Key Infrastructure (PKI). To get started, we need a keypair available on our IPFS node.

We can use the keypair to store one key/value pair where the key represents the "name" and "value" the hash to resolve.

#### Generate a key

First, we need to generate a keypair using the method `ipfs.key.gen(name, type, size): KeyInfo`.

```java
try {
  String keyName ="myarticle";
  Optional<String> keyType = Optional.of("rsa");
  Optional<String> keySize = Optional.of("2048");

  KeyInfo key = ipfs.key.gen(keyName, keyType, keySize);
  System.out.println("key name: " + key.name);
  System.out.println("key.hash: " + key.id);
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/KQUKhk2.png)

The following function returns a `KeyInfo` object composed of the name and the id (multihash) of the key representing the name which we can use to resolve a hash.

#### Delete a key

It is also possible to remove a key using `ipfs.key.rm(keyName): void`.

```java
try {
  ipfs.key.rm(keyName);
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

#### List all keys

The method `ipfs.key.list()` allows us to list all keys available on our node.

```java
try {
  List<KeyInfo> keys = ipfs.key.list();
  keys.forEach(key ->
    System.out.println("keyInfo: name=" + key.name + ", hash=" + key.id));
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/3TefgpL.png)

The `self` key represents the default key generated when we launch IPFS for the first time.

### Publish

Once we have a exclusive keypair available, we can use it to publish a hash against it using the method `ipfs.name.publish(hash, keyName)`:

```java
try {
  String hash = "QmWfVY9y3xjsixTgbd9AorQxH7VtMpzfx2HaWtsoUYecaX" // Hash of "hello
  Map response = ipfs.name.publish(hash, Optional.of(keyName));
  System.out.println("publish(hash="+hash+", key="+keyName+"): " + response);
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/vRIeeWF.png)

_Note that this operation is particularly slow and can take up to two minutes to execute_

### Resolve

Just like a DNS, reading an object from an IPNS name is a two steps process:

1.  Resolve the hash against the name
2.  Read the content from the hash

```java
try {
  KeyInfo key = ipfs.key.list().stream()
    .filter(k -> k.name.equals(keyName))
    .findAny()
    .orElseThrow(() -> new RuntimeException("Key " + keyName + " not found"));

  String resolveResponse = ipfs.name.resolve(key.id);
  System.out.println("resolve(key="+key.id+"): " + resolveResponse);

  byte[] content = ipfs.cat(Multihash.fromBase58(resolveResponse.substring(6)));
  System.out.println("Content: " + new String(content));
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
}
```

![](https://i.imgur.com/AtD5wxv.png)


<br />

## Other operations

The `java-ipfs-http-client` library wraps many other API operations available on the node.

### Node version

To get the Node version we are connected to, the library provides the method `ipfs.version(): String`

```java
try {
  String version = ipfs.version();
  System.out.println("Node version: " + version);
} catch (IOException ex) {
  throw new RuntimeException("Error whilst communicating with the IPFS node", ex);
}
```

![](https://i.imgur.com/OCwJtk2.png)

### Node peers

To retrieve the list of Peers connected to our local node:

```java
List<Multihash> peers = ipfs.refs.local()
peers.forEach(multihash ->
  System.out.println("Peer ID: " + multihash));
```

![](https://i.imgur.com/vuRKfVF.png)


<br />

## References

-   [GitHub Repository](https://github.com/gjeanmart/kauri-content/tree/master/java-ipfs)
-   [API Server documentation](https://docs.ipfs.io/reference/api/http/)
-   [Introduction to IPFS (by Consensys)](https://medium.com/@ConsenSys/an-introduction-to-ipfs-9bba4860abd0)
-   [IPFS Introduction by Example (by Christian Lundkvist)](http://whatdoesthequantsay.com/2015/09/13/ipfs-introduction-by-example)
-   [The definitive guide to publishing content on the decentralized web (by Textile)](https://medium.com/textileio/the-definitive-guide-to-publishing-content-on-ipfs-ipns-dfe751f1e8d0)
