---
title: Storing files in a distributed file system using blockchain technology
summary: Principles of limited trust, which change general approach to everyday life, force parts of a business to introduce new additional actions and procedures, which should ensure that considered subject is exactly what they expect, and has not been modified without the knowledge of the other parties. Especially It affects cases in which there is a reasonable suspicion or doubt to the correctness of the delivered data that is the matter of exchange. Examples can be seen as downloaded files, sent docu
authors:
  - krb (@krb)
date: 2018-12-17
some_url: 
---

# Storing files in a distributed file system using blockchain technology


## Principles of limited trust, which change general approach to everyday life, force parts of a business to introduce new additional actions and procedures, which should ensure that considered subject is exactly what they expect, and has not been modified without the knowledge of the other parties. Especially It affects cases in which there is a reasonable suspicion or doubt to the correctness of the delivered data that is the matter of exchange. Examples can be seen as downloaded files, sent documents agreements or regulations.

Who's affected: 

In Poland The Consumer Rights Act which came into force on 25th December 2014, imposes on entrepreneurs information obligation in contracts concluded away from business premises or remotely. The Act distinguishes various ways of passing important information to the consumer (communication). A message can be written on paper or on other durable medium, or a method corresponding to the type of communication means used. This law also introduces a new definition, which is a durable medium. Simply saying, it is a substance or tool allowing consumer or entrepreneur to store information dedicated and addressed strictly to him, in which way the information can be accessed in the future as long as it is needed (desired time described by law) and in an unmodified form. In practice it means that as a durable medium we can consider following things:
* Paper
* CD/DVD
* Pendrive
* Memory card
* Any other Hard drive

But also, services like:

* Email
* SMS

Recently a similar solution was introduced, deployed and implemented as service to clients, by PKO BP. It turned out that their approach uniqueness is based on blockchain technology, where nodes are represented by bank itself and KIR (Krajowa Izba Rozliczeniowa) Taking into account such a software solution, there are many merits connected with applied technology, but also we can conclude that it could help with cost reduction, with respect to printing on the paper or burning CD/DVDs, including all cost of production process, implementation and maintenance. Similar approach is planned by Alior Bank. These mentioned examples are not the only ones where the problem exists, but it shows, what kind of challenges may arise for entrepreneurs, institutions, parties, state offices or even governments. Different domains which may require some support in case of authorized files:
* Online bookstores selling digitally signed, electronic versions of books
* Authorship
* Notarial acts or ownerships
* Marketing consent
* Privacy policy


## **Proposed Solution:**

Applying blockchain technology, which guarantees immutability of saved data, has its pros and cons, and should be carefully considered against business needs. Sometimes it is good to stop and think twice before jumping in at the deep end. Taking blockchain into consideration as a durable medium, it will be beneficial to store only some basic info, not files themselves. As a basic info we can understand name, date added, extension, author or any other properties which are stored by a file system or will help us identify the file among others. And here we find our point, the best way to distinguish the file not only among files but also among other versions of the same file, is knowing its hash. It is another level of security which hides content of the file behind fixed size sequence of letters and digits. Any modification to this file, regardless of intentions or meaning or size, causes a complete change of hash. Giving a proof that there is or there is no consistency between requested file and the file which is stored as an argument supporting the case.

Having answered what, we should store in the blockchain, there is another question. Where should we physically keep these files? So, as part of increasing the degree of decentralisation, it is tempting to use one of the distributed file systems. They are designed to consolidate information and facilitate file sharing while providing remote access at a local-like level. The main characteristics of such systems is high availability, reliability, data integrity, scalability or heterogeneity (looks the same for every device which can be a part of such system). An example of a distributed file system that has been functioning for some time, is InterPlanetary File System known as IPFS. It is a system which synthesizes successful ideas from previous peer-to-peer systems including BitTorrent or Git. It also provides a high throughput content-addressed block storage model, with content addressed hyperlinks. Its structure, built upon DAG (Directed Acyclic Graph), lets us create a versioned file system or even permanent web. IPFS consists of hashing tables, incentivized blocks exchange and self-certified filesystem. As every system component it also has some demerits or just things that require some additional consideration i.e. do we need additional data backup, how we are going to ensure file replication in the network? Especially second question might be worth asking, because IPFS itself doesn’t have any automatic replication. Nodes only store and/or distribute content they explicitly want to store and/or distribute. Simply saying, devices that run IPFS nodes do not have to host files that they were not asked for. But with first query they can refer to the requested file and from now on have its local copy. For more details and explanations please visit IPFS home page and read their [whitepaper](https://raw.githubusercontent.com/ipfs/papers/master/ipfs-cap2pfs/ipfs-p2p-file-system.pdf). With requirements defined in this way, we can now go straight to the solution technical details which will accomplish the set goals.


## **Technical Aspects:**

In this section we present our simple implementation of storing file hash (SHA-256) in the private blockchain built upon ETH protocol with preserving file in distributed file system – IPFS.


### **Technology stack:**

* Truffle (Development framework for dapps based on Ethereum blockchain) https://truffleframework.com/ 
* Ganache (One click, in-memory blockchain) https://truffleframework.com/ganache
* Solidity (Contract-oriented programming language for writing smart contracts) https://solidity.readthedocs.io/en/v0.4.24/ * Web3.js (Ethereum Javascript API) https://github.com/ethereum/web3.js/ 
* NodeJS (JavaScript run-time environment) https://nodejs.org/en/ 
* React (JavaScript library for building user interfaces) https://reactjs.org/

### **Environment preparation and tools installation:**

_Disclaimer: Instruction is based on Windows OS, some of the instructions may require OS specific approach, like using sudo in linux based OSes._

> ---------------------------
1. Install IPFS:
> ---------------------------

1. Go to https://dist.ipfs.io/#go-ipfs and download IPFS for your platform
2. Extract zip to new folder
3. Open Command line Interface (CLI) and move pointer to the folder from point 2.
4. Run in CLI:` install.sh`
5. Run in CLI: `ipfs init`
6. Run in CLI: `ipfs bootstrap rm –all` (this step ensures that you will be creating local and private storage)
7. Run in CLI: `ipfs daemon` (allow access if windows firewall will require your confirmation, and leave process running)

After these steps you should have IPFS node set up and running. For more info please visit IPFS documentation, it is well written and describes many available options. For our purpose we are going to leave one node just as it is, but in real case scenario where complete configuration is required, we would add additional nodes to IPFS network (different machines) using command `ipfs bootstrap add /ip4/<node_ip>/tcp/4001/ipfs/<hash_which_appear_after_ipfs_init_from_step5>` after clearing bootstrap nodes in step 6. Our setup will use default values for example, 127.0.0.1 as a server address, and 5001 as its port. There are other options to run IPFS node such as docker containers or using Infura which is a hosted Ethereum node cluster that lets you run application without requiring to set up your own Ethereum node or wallet but only for public network instances like Mainnet or Rinkeby.

> ---------------------------
2. Install Ganache
> ---------------------------

1. Go to https://truffleframework.com/ganache download version for your operating system,
2. Install by double click, and then run.
3. Ganache will run with default values which should be the same or similar to these On Screen. The crucial part is a section defining RPC Server.
![](https://api.beta.kauri.io:443/ipfs/QmSfTurLCgPd1xK6WE8Udnp4fqyqnEYPC7ao7fLi7bNCuj)

4. Leave it running

After these four steps you have a local blockchain instance working with fast transaction confirmation and a pretty nice explorer which can help you check transactions in mined blocks. If you want to check whether proposed blockchain is functional, you can connect to it with Metamask as to a custom RPC server and make some transactions between your accounts.

> ---------------------------
3.Build webservice code from repository and run.
> ---------------------------

1.	Install node.js and make sure that it is added to the environment variables (https://nodejs.org/en/download/).
2.	Install Truffle Framework by opening CLI and run the command: `npm install –g truffle `
3.	Download code from repository: `git clone  https://github.com/FutureProcessing/DocuHash` 
4.	Enter the folder (repository root) `cd DocuHash` and `run npm install`
5.	Open in editor (i.e. Notepad++) the config located in <repository folder>/services/config. If you have different values than custom ones (i.e. Ganache configuration), please adjust them to your needs. Make sure that:
    - config.eth_url corresponds to Ganache RPC Server, 
    - config.wallet_passphrase corresponds to Ganache mnemonic, 
    - config.network_id corresponds to Ganache network id, 
    - config.hs_contract_address is left for now just as it is, we will change it soon,
    - config.ipfs_api_address corresponds to your IPFS API address, 
    - config.ipfs_api_port corresponds to your IPFS API port.
6.	The next step is to compile and deploy smart contracts. 
In CLI run, truffle console uses the command `truffle console --network dev`. First of all, if your system does not recognise a truffle command, you have to add it to environment variables. Find a path to truffle.cmd file (it can probably be found here: “C:\Users\<your user name>\AppData\Roaming\npm\node_modules\.bin” where the C drive is your system drive) and add new variable. For instance, using variable name: “TRUFFLE” and variable value as path to folder containing (as above presented) truffle.cmd. If you see "truffle(dev)>" then your console is ready to work with.
7.	Run the command: `compile –all` in the running truffle console.
It is responsible for compiling “all” contracts, no matter if previous compiled versions are there or not. Successful output should be ended with the following line: "Writing artifacts to .\build\contracts"
8.	Run the command: `migrate –reset` in the truffle console.
It is responsible for deploying contracts to the blockchain. “Reset” parameter will make sure that the whole migration process is executed even if some of the contracts are already deployed.

You should see the effect similar to the one shown below:
![](https://api.beta.kauri.io:443/ipfs/QmZudpvrRFtuBaZMBTHZXYm3ZWURdVuYnd2ac4iEW3pvbB)

9.	Find the contract HashStorage address (marked to yellow on the screen above), copy and paste it to the config file mentioned in step 5. Remember to save a file after introducing changes. In our case config file looks like this: 

```
const result = require('dotenv').config();

CONFIG = {} 
CONFIG.app = process.env.APP   || 'development';
CONFIG.port = process.env.PORT  || '3002';

CONFIG.eth_url = process.env.ETH_URL || 'http://127.0.0.1:9545';
CONFIG.wallet_passphrase = process.env.HD_WALLET_PASSPHRASE || 'exact cabbage shove public maximum erase remain around crawl major april cross';
CONFIG.eth_network_id = process.env.ETH_NETWORK_ID || '5777';

CONFIG.hs_contract_address = "0x2c65Fc2142f73E206e206a4a9D5E4b2743877f71";

CONFIG.ipfs_api_address = '127.0.0.1';
CONFIG.ipfs_api_port = '5001';
CONFIG.ipfs_url = CONFIG.ipfs_api_address + ':8080/ipfs/';

CONFIG.clientUrl = 'http://127.0.0.1:3003';
```

10.	Run `npm start` in repository root directory in CLI.
After a while you should see: "DocuHash is running on port 3002"

> ---------------------------
4.Build and run a web page.
> ---------------------------

1.	Open another CLI, go to the cloned repository and In Cli Go to app folder 
2.	Run `npm install` in CLI.
3.	Considering default values, you don’t have to change the config file, in other case it is placed in app/src/config.js, please adjust apiServerAddress to address which corresponds to your webservice. In our case it is the same as in the repository.

```
const config = {
    apiServerAddress: 'http://127.0.0.1:3002'
};

export default config;
```

4.	Run `npm start` in CLI.
After a while you should see a message in CLI “Compiled successfully!” and then how to access this page through browser.
5.	Finally, check how it works! Play with it for a while and come back for further reading.

![](https://api.beta.kauri.io:443/ipfs/QmVHgPJ8P4KiyWJDKYKTC84HBwzwngsfsELu7XGAkXTreq)

![](https://api.beta.kauri.io:443/ipfs/QmXiMKADkEFcXFYMp4U7jx2TMD6zDhfXGduB9opMC7ad4z)


### **Detailed description of some major elements:**
> ---------------------------
Smart contract HashStorage.sol in Solidity

1. Smart contract contains a structure which composes of file information:
    - string ipfsHash – variable type string responsible for storing addresses/links (in fact, hash) in the decentralised file system;

    - uint dateAdded – variable type unsigned integer containing information of when a file was added in the unix timestamp (a number of seconds which have elapsed since the 1st of January  1970;midnight UTC/GMT);
    - bool exist – variable boolean type helpful in defining whether a file hash has been added to the blockchain or not. Why do we need that? It stems from the fact that variables in Solidity are initialized with default values, in case of boolean it is false.
2. Smart contract also contains mapping, which can be seen as hash table. In general, mappings are virtually initialized as for every possible key (in our example hash) which exists and is mapped to a value whose byte-representation is a type’s default value. The similarity ends here, though: the key data is not actually stored in a mapping, only its keccak256 hash used to look up the value.
3. In this Smart contract we can find two functions:
    - get – which receives one parameter – file hash. This function allows to check whether specific file is available if stored in IPFS and, finally, addition date. All this data is returned as a result of execution.
    - add – which expects three parameters during its invocation: IPFS hash, file hash, date added. The execution of this function is limited to an owner, which means that any other party cannot successfully invoke this method. It is ensured by Ownable.sol contract from OpenZeppelin (a library for secure smart contract development). Our owner is set up in constructor, which is executed during a contract deployment to the network. Owner can be changed in time, but it’s beyond our consideration. Getting back to the function: after some initial validation it adds newly created object to the mentioned mapping. Then at the end, it emits event as a clear signal that everything has gone right.

```
pragma solidity ^0.4.23;

import "./Ownable.sol";

contract HashStorage is Ownable{
    mapping (string => DocInfo) collection;
    struct DocInfo {
        string ipfshash;
        uint dateAdded; //in epoch
        bool exist; 
    }

    event HashAdded(string ipfshash, string filehash, uint dateAdded);

    constructor () public {
        owner = msg.sender;
    }

    function add(string _ipfshash, string _filehash, uint _dateAdded) public onlyOwner {
        require(collection[_filehash].exist == false, "this hash already exists in contract");
        DocInfo memory docInfo = DocInfo(_ipfshash, _dateAdded, true);
        collection[_filehash] = docInfo;
        
        emit HashAdded(_ipfshash, _filehash, _dateAdded);
    }

    function get(string _hash) public view returns (string, string, uint, bool) {
        return (
            _hash, 
            collection[_hash].ipfshash,
            collection[_hash].dateAdded,
            collection[_hash].exist
        );
    }
}
```

> ---------------------------
Web service in node.js.

1. Service.js defines two methods of handling user requests:
    - addfile – the POST method which expects file as input. Under the hood it basically prepares file for uploading to IPFS, and compute hash to store it in the blockchain. Finally adds file to the IPFS and then save hash in blockchain smart contract.
    - getfile – the GET method which expects file hash as parameter, used as a lookup value. This time order is different, first we check value in the blockchain and if it exists, we make sure that it is available in IPFS.
2. Hs-service.js also defines two methods responsible for fetching data from and pushing into the blockchain via initialized instance of contract (hs-contract-provider.js). The mechanism of it is pretty simple: we prepare data (converting it to a byte representation) and send it straight to the blockchain.
3. web3-provider.js – inside this file, the web3 instance is created with setting user accounts based on provided mnemonic:
    - Config.js – located in the services folder, contains all the necessary variables to run and configure application service.
    - Config.eth_url – it’s the rpc address to the blockchain node you try to connect to;
    - Config.wallet_passphrase – it’s the mnemonic allowing access to the accounts generated by Ganache;
    - Config.eth_network_id – an identifier of the Ganache network ;
    - Config.hsContractAddress – the address of HashStorage contract; 
    - Config.ipfsAPIAddress – the address of ipfs node;
    - Config.ipfsPort – the port which helps to address to the ipfs node; 
    - Config.ipfsUrl – the address to IPFS File Viewer.

> ---------------------------
Web App – React

1. App.js – located in app/src/. This file is a main element of the web page, combines user interface with web service invocations. We won’t go deeper with it. If you are not familiar with React, please take a look at some tutorials or just visit [https://reactjs.org/](https://reactjs.org/.).
2. Config.js – located in app/src/. This file contains only variables which refer to our web service API.
3. WebService.js – located in app/src/. It’s responsible for calling webservice and handling error responses which may come as a result of the invalid request or configuration error.


> ---------------------------
Truffle-config.js

this file defines network with which we are going to work. It can have many networks defined, but every needs to have its unique name. Simple definition requires a host, where we put our local node 127.0.0.1, a port, where we put rpc port, and a network_id. When a network_id is defined as asterisk, it means that it will connect to any network available under specified address and port.

###Sample Web Service Responses

1. AddFile 
![](https://api.beta.kauri.io:443/ipfs/QmSx73LkUUcvDGYtmEhvgQwk2XTjxDvpHCoqg2Trhpdp1a)
2. GetFile 
![](https://api.beta.kauri.io:443/ipfs/QmWQhzYh8a9cWbEe55FkGPwwTaTRPw8rTA5VY3ZuszmUkQ)

### **Design Structure**

![](https://api.beta.kauri.io:443/ipfs/QmZ7YMeK3fqGp8BZTvuY5qbgZeQu8mHUibCifbnSTP4EzA)

Quick explanation on how it has been structured. At the top there is a browser with two components. The first one – Web App – allows us to send a request to the hosted Web Service in a simple and clear way. This request received by the web service is processed and as a result data is pushed further to the blockchain and IPFS network. It handles two types of requests – the first which writes and the second which only reads and doesn’t make any changes. Second component in a browser area is the IPFS File Viewer which is helpful with exploring files stored in a distributed file system. It comes with our IPFS node configuration and can display a file or even play a movie if its extension is recognized by the system. IPFS File Viewer checks for file without any intermediaries but there is one requirement that has to be fulfilled by user. He or she has to know the path or hash generated by the system (these two terms can be used interchangeably) of the file supposed to be viewed. The hash from IPFS is completely different from this generated by? the file content, therefore we store both in the smart contract.

### **User Interface**

The Upload view is visible by default.
1. By using drag & drop mechanism applied to the first tab of our sample application, a user is able to upload file.
2. Immediately after dropping a file in a dashed area, the request of this file is sent. 
3. User has to wait a short period of time which is measured by a swirl in the middle of a dropping area. 
4. After a successful operation, the new list with file hashes appears below the dropping area. The title is: “Uploaded files hash list:”.
5.In case of error, a proper box with a message is shown.

The user can switch to the Search view by clicking on Search with a magnifier icon:
1. Having a file hash, the user can search this file in the given application; after providing a hash to the input and clicking a magnifier nearby, the new lookup request is sent. 
2. After a successful operation, the new block with detailed file information appears. It is titled: “File info has been found in blockchain:”. Last item on the list is a clickable link.
3. In case of error, a relevant/adequate box with message is shown.

![](https://api.beta.kauri.io:443/ipfs/QmcVQuWYkdQbLSfnPD4akmzjKsPhHs43yALK7hXXTcxtHj)


### **Summary:**

Proposed solution is not a comprehensive example. In order to deepen the issue, we should consider adding more nodes to a distributed file system, migrating application to public network, file encryption before sending and, finally, we should try to answer the question about trust towards the server or who should pay the network fees. There is probably much more than that and it gives great food for thought, but this article shows in a way possibilities and strengths of applying a blockchain technology to the described problem. If you have any questions or you just want to broaden this solution, feel free to participate or ask questions. The code is available on github:  [https://github.com/FutureProcessing/DocuHash](https://github.com/FutureProcessing/DocuHash)

_This post was originally posted on [future-processing technical blog](https://www.future-processing.pl/blog/storing-files-in-a-distributed-file-system-using-blockchain-technology/)_







