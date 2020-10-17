---
title: Ethereum Name Service on Private Chains
summary: ENS is a set of smart contracts which enables users to assign additional information, most importantly human-readable names, to Ethereum accounts. ENS has many uses on the main chain (you can check the official introduction if you dont know about them!) and is with over a transaction a minute on average since its inception two years ago one of the most used pieces of on-chain infrastructure. Naturally, you may want to set it up on your private network as well. However instructions on how to set
authors:
  - null (@d68b300ccdf5795ac5cbf64a483518b89bfe6e8e)
date: 2019-05-31
some_url: 
---

# Ethereum Name Service on Private Chains

ENS is a set of smart contracts which enables users to assign additional information, most importantly human-readable names, to Ethereum accounts.
ENS has many uses on the main chain (you can check [the official introduction](https://docs.ens.domains/) if you don't know about them!) and is [with over a transaction a minute](https://etherscan.io/address/0x6090a6e47849629b7245dfa1ca21d94cd15878ef) on average since its inception two years ago [one of the most used](https://blockspur.com/ethereum_contracts/transactions) pieces of on-chain infrastructure.
Naturally, you may want to set it up on your private network as well.
However instructions on how to set up ENS from scratch have to be pieced together from various repositories and sources.
This guide is aimed at developers with some experience with Solidity and Truffle who want to learn to work with ENS.
It comes with [this Truffle project on github](https://github.com/MaibornWolff/private-ens) which bundles the official ENS contracts ([@ensdomains/ens](https://github.com/ensdomains/ens), [@ensdomains/resolver](https://github.com/ensdomains/resolvers) on github) and provides several scripts and pieces of code that tie everything together to make getting started and working with ENS on a private network easier. 

We will cover the following:

1. Basic ENS architecture
2. Setting up ENS: Deploying the registry, registrar, and resolver contracts
3. Writing to ENS: Registering a name and storing data
4. Reading data from ENS, both on- and off-chain

## 1. Introduction to the ENS architecture
Before going into the technical details, let's briefly recap how the ENS contracts work.


### [Terminology](https://docs.ens.domains/terminology)
A complete ENS identifier such as "mycontract.eth" is uniquely identifiable by its **node**. The node is the result of applying the [namehash](https://docs.ens.domains/#namehash), which hashes the domain components recursively (e.g. `namehash("mycontract.eth") = keccak256(namehash("eth"), keccak256("mycontract"))`).

A **label** is a component of an ENS identifier such as "mycontract" in the previous example. Within contracts this usually refers to the hash of the label, `keccak256("mycontract")`. When you register the label "mycontract" with the registrar that administrates "eth" you become the owner of "mycontract.eth". Once a label is registered, the resulting node is how the domain is identified.


### ENS Registry
This is the central smart contract and stores ownership information as well as the address of a resolver (which we will get to a bit later) for each node.

```
mapping (bytes32 => Record) records;

struct Record {
    address owner;
    address resolver;
    uint64 ttl;
}
```

The remainder of the functionality of the registry is primarily getters and setters for those values.

``` 
pragma solidity >=0.4.24;

interface ENS {

    // Logged when the owner of a node assigns a new owner to a subnode.
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner);

    // Logged when the owner of a node transfers ownership to a new account.
    event Transfer(bytes32 indexed node, address owner);

    // Logged when the resolver for a node changes.
    event NewResolver(bytes32 indexed node, address resolver);

    // Logged when the TTL of a node changes
    event NewTTL(bytes32 indexed node, uint64 ttl);


    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external;
    function setResolver(bytes32 node, address resolver) external;
    function setOwner(bytes32 node, address owner) external;
    function setTTL(bytes32 node, uint64 ttl) external;
    function owner(bytes32 node) external view returns (address);
    function resolver(bytes32 node) external view returns (address);
    function ttl(bytes32 node) external view returns (uint64);
}
```

### Registrar
Since the registry contains only basic access control (only the owner of a node can create subnodes, initially the deployer owns the root node) it only allows manual domain allocation.
Fortunately, contracts can also own nodes.
This means we can set up a registrar contract as the owner of a node, e.g. "eth", in the registry which enables it to distribute subdomains such as "mycontract.eth".
It allows us to have custom, on-chain logic which governs domain allocation.
Once we own a (sub-)node we are free to repeat this process and set up another registrar.
If you are part of the "myorg" organisation you could register "myorg.eth" and let it point to your custom registrar which only allows certified members of your organisation to claim subdomains such as "bob.myorg.eth".

Until May 2019 the mainnet used an auction-based registrar. On a private net, however, a 'first come, first served' registrar is sufficient, because there is no need to prevent squatting.

```js
pragma solidity ^0.5.0;

import "./ENS.sol";

/**
 * A registrar that allocates subdomains to the first person to claim them.
 */
contract FIFSRegistrar {
    ENS ens;
    bytes32 rootNode;

    modifier only_owner(bytes32 label) {
        address currentOwner = ens.owner(keccak256(abi.encodePacked(rootNode, label)));
        require(currentOwner == address(0x0) || currentOwner == msg.sender);
        _;
    }

    /**
     * Constructor.
     * @param ensAddr The address of the ENS registry.
     * @param node The node that this registrar administers.
     */
    constructor(ENS ensAddr, bytes32 node) public {
        ens = ensAddr;
        rootNode = node;
    }

    /**
     * Register a name, or change the owner of an existing registration.
     * @param label The hash of the label to register.
     * @param owner The address of the new owner.
     */
    function register(bytes32 label, address owner) public only_owner(label) {
        ens.setSubnodeOwner(rootNode, label, owner);
    }
}
```

### Resolver
While the registry only contains ownership information about nodes and a pointer to the resolver, the resolver is where detailed information about a node is actually stored. The core use-case is to have the resolver store a node's account address, but it could also store a contract ABI, custom text, and more.
Resolvers can also implement authorization schemes of who can modify the stored information.
Usually there is either a single owner of the resolver that may modify it, or more simple: the resolver relies on the node ownership information of the registrar.
The ```PublicResolver``` used here provides this authorization scheme and brings several specialized resolvers such as the ```ABIResolver``` or ```AddrResolver``` together. Similar to the registry, their logic is very simple. Usually they just contain a mapping from node to whatever information they store and the corresponding getters and setters.

```js
pragma solidity ^0.5.0;

import "@ensdomains/ens/contracts/ENS.sol";
import "./profiles/ABIResolver.sol";
import "./profiles/AddrResolver.sol";
import "./profiles/ContentHashResolver.sol";
import "./profiles/InterfaceResolver.sol";
import "./profiles/NameResolver.sol";
import "./profiles/PubkeyResolver.sol";
import "./profiles/TextResolver.sol";

/**
 * A simple resolver anyone can use; only allows the owner of a node to set its
 * address.
 */
contract PublicResolver is ABIResolver, AddrResolver, ContentHashResolver, InterfaceResolver, NameResolver, PubkeyResolver, TextResolver {
    ENS ens;

    /**
     * A mapping of authorisations. An address that is authorised for a name
     * may make any changes to the name that the owner could, but may not update
     * the set of authorisations.
     * (node, owner, caller) => isAuthorised
     */
    mapping(bytes32=>mapping(address=>mapping(address=>bool))) public authorisations;

    event AuthorisationChanged(bytes32 indexed node, address indexed owner, address indexed target, bool isAuthorised);

    constructor(ENS _ens) public {
        ens = _ens;
    }

    /**
     * @dev Sets or clears an authorisation.
     * Authorisations are specific to the caller. Any account can set an authorisation
     * for any name, but the authorisation that is checked will be that of the
     * current owner of a name. Thus, transferring a name effectively clears any
     * existing authorisations, and new authorisations can be set in advance of
     * an ownership transfer if desired.
     *
     * @param node The name to change the authorisation on.
     * @param target The address that is to be authorised or deauthorised.
     * @param isAuthorised True if the address should be authorised, or false if it should be deauthorised.
     */
    function setAuthorisation(bytes32 node, address target, bool isAuthorised) external {
        authorisations[node][msg.sender][target] = isAuthorised;
        emit AuthorisationChanged(node, msg.sender, target, isAuthorised);
    }

    function isAuthorised(bytes32 node) internal view returns(bool) {
        address owner = ens.owner(node);
        return owner == msg.sender || authorisations[node][owner][msg.sender];
    }
}
```

```js
pragma solidity ^0.5.0;

import "../ResolverBase.sol";

contract AddrResolver is ResolverBase {
    bytes4 constant private ADDR_INTERFACE_ID = 0x3b3b57de;

    event AddrChanged(bytes32 indexed node, address a);

    mapping(bytes32=>address) addresses;

    /**
     * Sets the address associated with an ENS node.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     * @param addr The address to set.
     */
    function setAddr(bytes32 node, address addr) external authorised(node) {
        addresses[node] = addr;
        emit AddrChanged(node, addr);
    }

    /**
     * Returns the address associated with an ENS node.
     * @param node The ENS node to query.
     * @return The associated address.
     */
    function addr(bytes32 node) public view returns (address) {
        return addresses[node];
    }

    function supportsInterface(bytes4 interfaceID) public pure returns(bool) {
        return interfaceID == ADDR_INTERFACE_ID || super.supportsInterface(interfaceID);
    }
}
```

## 2. ENS deployment
From here on out we will work with [this code](https://github.com/MaibornWolff/private-ens). We fetch the ENS registry and registrar ([@ensdomains/ens](https://github.com/ensdomains/ens) on github) and the resolver ([@ensdomains/resolver](https://github.com/ensdomains/resolvers) on github) from npm and deploy them at once.
To distinguish our private network ENS from the one on the mainnet we will use the "example" namespace instead of "eth" (see [here](https://docs.ens.domains/frequently-asked-questions#can-i-register-a-tld-of-my-own-in-the-ens)).

### Short version
1. `npm install`
2. `npm run deployContracts` to deploy the registry, registrar, and resolver

### Under the hood
The migration script `migrations\2_deploy_ens.js` does the following:
1. Deploy `ENSRegistry`. By default the deployer will own the root node `0x00`
2. Deploy a TLD "example" ```FIFSRegistrar```. Any label registered here will automatically receive the suffix ".example" in the registry resulting in the domain "label.example". The registrar is deployed with parameters:
    - `ensAddr`: Address of the ENSRegistry deployed in step 1
    - `node`: Namehash, for  "example" this is `0xbb0807b9d6e8c2bb1dc2b84cfacb442a45a0de252e47e1f142f56db08a3327e4`.
3. Set the registrar to be subnode owner of "example" by calling `setSubnodeOwner` in the registry with parameters:
    - `node`: `0x00` (initial root node)
    - `label`: Label of the node that the registrar should be the owner of, for "example" the this is `keccak256("example")` which is `0x6fd43e7cffc31bb581d7421c8698e29aa2bd8e7186a394b85299908b4eb9b175`.
    - `owner`: Address of the registrar deployed in step 2
4. Deploy the `PublicResolver` which allows owners of domains to set the stored address, ABI, etc. It is deployed with the parameter
    - `ens`: address of the registry deployed in step 1. Domain ownership will be looked up there.

For the TLD "eth" used on the mainnet the node is `0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae` and the label hash `0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0`.

## 3. Registering domains and associating data with it
With the basic infrastructure in place, everybody on the network can now register and resolve domains since we used the publicly accessible `FIFSRegistrar` and `PublicResolver`. Say we have a contract `MyContract` for which we want to register "mycontract.example" and store the ABI. We follow the general rule of thumb of doing computation off-chain if possible and register names and populate the resolver as part of the `MyContract` migration script.

### Registering a domain with the registrar
First we register "mycontract.example" by calling the registrar's `register` function with the parameters:
  - `label`: `keccak256("mycontract")` = `0xc2ee66541dbf7d268381bd6e91338cac022b888ebf1ec6b02059b7e4ecc2b2fd`
  - `owner`: Address of an account, probably the sender of the registration transaction

To check whether this worked, we can look up the owner of the node (`namehash("mycontract.example")` = `0xb1fb37e96e7338878b6a0c1bbdd3df3ee6f93d0a483d334fb29707ba03085149`) in the registry.

### Setting a resolver in the registry
Now that we own the node "mycontract.example" we can change the resolver by calling the registry's `setResolver(node)` with the address of the resolver contract. Note that this can only be done by the owner we set in the previous step. Calling the registry's `resolver` function with our node should now return the resolver address.

### Store an address and other data with the resolver
Similarly, we can now call `resolver.setAddr(node, contractAddress)` to store the address with the resolver.  The ABI, a name, etc. are stored the same way.

### In code
The test folder contains examples of the calls to the registry, registrar, and resolver described here (some taken from the repositories mentioned above). To demonstrate how this setup can be performed during the migration of a contract the migrations folder also includes the `ENSHelper.js`. It should be imported in a migration script. Then, it registers a domain, associates the resolver, and stores the contract address and ABI with a single function call (see `migrations\example_3_deploy_contract.js` for a usage example, remove "example_" to run).


## 4. Lookup
Once "mycontract.example" is properly registered and resolvable, we can look up the associated information in a two step process: First we fetch the resolver that handles the data for our node (`registry.resolver(node)`). Then, we can query the resolver for the information about our node we are looking for, e.g. `resolver.addr(node)`.

Unlike storing records, which is rarely necessary to do from an on-chain contract, reading them is often helpful both from off-chain applications and on-chain contracts. The test at `test\testWorkflow.js` demonstrates how to get domain records with web3. For on-chain lookup this repo also includes the helper contract `ENSReader.sol` which can be inherited from to handle registry and registrar lookups on-chain (see `test\TestContractWorkflow.sol`).
