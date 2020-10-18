---
title: Sending Transactions to Pantheon
summary: In this post I will be covering how to send transactions to the Pantheon Ethereum Client. Pantheon supports sending signed transactions but it doesn’t support wallet management so you will need to use third party tools to do the transaction signing for you. Transactions can be sent to Ethereum to transfer ether, to create a new contract or to interact with a contract. JSON RPC API You can interact with contracts using the eth_call or eth_sendRawTransaction JSON RPC methods. eth_call is used to g
authors:
  - Web3 Developer (@web3developer)
date: 2019-06-12
some_url: 
---

# Sending Transactions to Pantheon


In this post I will be covering how to send transactions to the Pantheon Ethereum Client. Pantheon supports sending signed transactions but it doesn’t support wallet management so you will need to use third party tools to do the transaction signing for you. Transactions can be sent to Ethereum to transfer ether, to create a new contract or to interact with a contract.

#### JSON RPC API
You can interact with contracts using the eth_call or eth_sendRawTransaction JSON RPC methods. eth_call is used to get data from the blockchain and doesn’t change any state while eth_sendRawTransaction adds a transaction to the blockchain.

#### eth_sendRawTransaction
Sends a signed transaction. Here is an example call to the eth_sendRawTransaction method using curl:

```
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"],"id":1}' http://127.0.0.1:8545
```


The ‘params’ parameter value should contain the signed transaction encoded as a hexadecimal string. The method will return the 32 byte transaction hash of the newly created transaction.

#### eth_call
Invokes a contract function locally and does not change the state of the blockchain. Here is an example call to the eth_call method using curl:

```
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13","value":"0x1"}, "latest"],"id":53}' http://127.0.0.1:8545
```


The first value in the ‘params’ list is the transaction call object and the second parameter is the block number to query. In this example the ‘latest’ placeholder refers to the latest block.

#### Starting Pantheon with JSON RPC enabled
You can start a local dev Pantheon node running the JSON RPC API using the following command:

```
pantheon --network=dev --miner-enabled --miner-coinbase=<address> --rpc-http-enabled --rpc-http-apis=ETH  --data-path=/tmp/tmpDatdir
```


Notice that I have set the — rpc-http-enabled flag to turn on the JSON RPC API. I have also set the — rpc-http-apis=ETH parameter to turn on only the ETH module of the API. Using this parameter we can configure which parts of the API to start. Following the principle of least privilege I would normally only start the modules which I require and leave the remaining modules switched off until they are required.

#### Send Signed Transaction Using Web3j
Next, lets use Web3j to create a signed transaction which transfers some ether from one wallet to another wallet. Web3j is a Java library which implements the Ethereum JSON RPC API spec and allows us to easily interact with the Ethereum blockchain from within a Java application. It also comes with a CLI binary which provides utility commands to create wallets, manage wallet passwords, transfer ether between wallets and to generate smart contract wrapper Java classes.

#### Install Web3j CLI
Lets start by installing the Web3j binary. On mac you can install it using brew as follows:

```
brew tap web3j/web3j 
brew install web3j
```



#### Create Wallets
Next, lets create some wallets using the following web3j command:

```
web3j wallet create
```


Enter the command, then choose a password for your new wallet and choose the path where the new wallet will be saved. In this example I am just using the default directory:

```
$ web3j wallet create
           _      _____ _     _          | |    |____ (_)   (_)
 _      | |      / /     _   
 \ \ /\ / / _ \ '_ \     \ \ |   | | / _ \
  \ V  V /  / |) |./ / |  | || () |   _/_/ _|./ _/| |()|| _/
 / |                         |_/
 Please enter a wallet file password:
 Please re-enter the password:
 Please enter a destination directory location [/Users/ben/Library/Ethereum/testnet/keystore]:
 Wallet file UTC--2019-06-10T13-21-53.260869000Z--8ce67047cd319c61497dd7b3e1420b883a7078f3.json successfully created in: /Users/ben/Library/Ethereum/testnet/keystore
```


The wallet has now been created successfully and stored in the json file named ‘UTC — 2019–06–10T13–21–53.260869000Z — 8ce67047cd319c61497dd7b3e1420b883a7078f3.json’. The address of this wallet file is 0x8ce67047cd319c61497dd7b3e1420b883a7078f3 which you can see in the last part of the filename. We will use this wallet to hold the the ether collected by the Pantheon miner.
Create a second wallet to be the receiver of the funds:

```
$ web3j wallet create
           _      _____ _     _          | |    |____ (_)   (_)
 _      | |      / /     _   
 \ \ /\ / / _ \ '_ \     \ \ |   | | / _ \
  \ V  V /  / |) |./ / |  | || () |   _/_/ _|./ _/| |()|| _/
 / |                         |_/
 Please enter a wallet file password:
 Please re-enter the password:
 Please enter a destination directory location [/Users/ben/Library/Ethereum/testnet/keystore]:
 Wallet file UTC--2019-06-10T13-38-48.201497000Z--8f3d389d92b8fe3ec4da221735cb19ed0f087c43.json successfully created in: /Users/ben/Library/Ethereum/testnet/keystore
```



#### Start Pantheon
Start the pantheon dev node with the coinbase set to the address of wallet one (I have also turned on the WEB3 module of the JSON RPC API which is required for Web3j):

```
$ pantheon --network=dev --miner-enabled --miner-coinbase=0x8ce67047cd319c61497dd7b3e1420b883a7078f3 --rpc-http-enabled --rpc-http-apis=ETH,WEB3  --data-path=/tmp/tmpDatdir
 2019-06-10 21:42:09.895+08:00 | main | INFO  | StaticNodesParser | StaticNodes file /tmp/tmpDatdir/static-nodes.json does not exist, no static connections will be created.
 2019-06-10 21:42:09.897+08:00 | main | INFO  | Pantheon | Connecting to 0 static nodes.
 2019-06-10 21:42:10.532+08:00 | main | INFO  | KeyPairUtil | Loaded key 0x335a543fe5b661f90e4afb7c2876017b69d43c6b20cfb41f77a2091fda2bd8f4e7ef425fa441d570eb3ecd6feb5b8bb4d8a2068da647d7e00f3a2c65727802c7 from /tmp/tmpDatdir/key
 2019-06-10 21:42:10.649+08:00 | main | INFO  | ProtocolScheduleBuilder | Protocol schedule created with milestones: [ConstantinopleFix: 0]
 2019-06-10 21:42:10.936+08:00 | main | INFO  | Runner | Starting Ethereum main loop …
 2019-06-10 21:42:10.936+08:00 | main | INFO  | NetworkRunner | Starting Network.
 2019-06-10 21:42:11.014+08:00 | nioEventLoopGroup-2-1 | INFO  | DefaultP2PNetwork | P2PNetwork started and listening on /0:0:0:0:0:0:0:0:30303
 2019-06-10 21:42:11.015+08:00 | main | INFO  | PeerDiscoveryAgent | Starting peer discovery agent on host=0.0.0.0, port=30303
 2019-06-10 21:42:11.069+08:00 | vert.x-eventloop-thread-1 | INFO  | VertxPeerDiscoveryAgent | Started peer discovery agent successfully, on effective host=0:0:0:0:0:0:0:0 and port=30303
 2019-06-10 21:42:11.096+08:00 | main | INFO  | DefaultP2PNetwork | Enode URL enode://335a543fe5b661f90e4afb7c2876017b69d43c6b20cfb41f77a2091fda2bd8f4e7ef425fa441d570eb3ecd6feb5b8bb4d8a2068da647d7e00f3a2c65727802c7@127.0.0.1:30303
 2019-06-10 21:42:11.098+08:00 | main | INFO  | DefaultSynchronizer | Starting synchronizer.
 2019-06-10 21:42:11.100+08:00 | main | INFO  | FullSyncTargetManager | No sync target, wait for peers.
 2019-06-10 21:42:11.108+08:00 | main | INFO  | JsonRpcHttpService | Starting JsonRPC service on 127.0.0.1:8545
 2019-06-10 21:42:11.236+08:00 | vert.x-eventloop-thread-5 | INFO  | JsonRpcHttpService | JsonRPC service started and listening on 127.0.0.1:8545
 2019-06-10 21:42:11.238+08:00 | main | INFO  | Runner | Ethereum main loop is up.
 2019-06-10 21:42:12.203+08:00 | pool-9-thread-1 | INFO  | BlockMiner | Produced and imported block #21 / 0 tx / 0 om / 0 (0.0%) gas / (0x915834fc5a6a4f0ba60317adc91b7eb71469e2a38f4b51671910f22b6825aef6) in 1.464s
 2019-06-10 21:42:12.508+08:00 | pool-9-thread-2 | INFO  |
```



#### Transfer Ether
This web3j command can be used to transfer ether between wallets:

```
web3j wallet send <walletfile> <address>
```


Use the command to transfer ether from wallet one (the miner) to wallet two. Follow the prompts and enter the amount of ether you wish to transfer:

```
$ web3j wallet send /Users/ben/Library/Ethereum/testnet/keystore/UTC--2019-06-10T13-21-53.260869000Z--8ce67047cd319c61497dd7b3e1420b883a7078f3.json 0x8f3d389d92b8fe3ec4da221735cb19ed0f087c43
           _      _____ _     _          | |    |____ (_)   (_)
 _      | |      / /     _   
 \ \ /\ / / _ \ '_ \     \ \ |   | | / _ \
  \ V  V /  / |) |./ / |  | || () |   _/_/ _|./ _/| |()|| _/
 / |                         |_/
 Please enter your existing wallet file password:
 Wallet for address 0x8ce67047cd319c61497dd7b3e1420b883a7078f3 loaded
 Please confirm address of running Ethereum client you wish to send the transfer request to [http://localhost:8545/]:
 Connected successfully to client: pantheon/v1.1.1/osx-x86_64/adoptopenjdk-java-11
 What amound would you like to transfer (please enter a numeric value): 100
 Please specify the unit (ether, wei, …) [ether]:
 Please confim that you wish to transfer 100 ether (100000000000000000000 wei) to address 0x8f3d389d92b8fe3ec4da221735cb19ed0f087c43
 Please type 'yes' to proceed: yes
 Commencing transfer (this may take a few minutes) ………………………….$
 Funds have been successfully transferred from 0x8ce67047cd319c61497dd7b3e1420b883a7078f3 to 0x8f3d389d92b8fe3ec4da221735cb19ed0f087c43
 Transaction hash: 0x8d24422b70221b518aaa23540917382b16e4b279499afc187ac902d90d49fdb7
 Mined block number: 295
```



#### Check Account Balances
Check the account balances of each wallet after the transfer using the eth_getBalance JSON RPC method:

```
$ curl -s -X POST --data '{"jsonrpc":2.0", "method":"eth_getBalance", "params":["0x8ce67047cd319c61497dd7b3e1420b883a7078f3", "latest"], "id":1}' http://localhost:8545
 {
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : "0x20a26da277a1280000"
 }
$ curl -s -X POST --data '{"jsonrpc":2.0", "method":"eth_getBalance", "params":["0x8f3d389d92b8fe3ec4da221735cb19ed0f087c43", "latest"], "id":1}' http://localhost:8545
 {
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : "0x56bc75e2d63100000"
```


We can now see that the second wallet contains 100 ether (the result contains a hex string value in wei which is equal to 100 ether).

#### Send Transaction Using EthSigner
We can also use a tool called EthSigner to send signed transactions to Pantheon. EthSigner provides transaction signing and access to your keystore by implementing the eth_accounts and eth_sendTransaction JSON-RPC methods which Pantheon does not implement. Lets download EthSigner, start it and use it to sign and send a transaction to a Pantheon dev node.

#### Install EthSigner
Download the EthSigner 
[packaged binaries](https://bintray.com/consensys/pegasys-repo/ethsigner/_latestVersion#files)
 . Unpack the downloaded files and change into the 
`ethsigner-<release>`
 directory. Display EthSigner command line help to confirm installation:

```
$ bin/ethsigner --help
```



#### Start Pantheon
Start Pantheon with the — rpc-http-port option set to 8590:

```
pantheon --network=dev --miner-enabled --miner-coinbase=0x8ce67047cd319c61497dd7b3e1420b883a7078f3 --rpc-http-cors-origins="all" --host-whitelist=* --rpc-http-enabled --rpc-http-port=8590 --data-path=/tmp/tmpDatdir
```



#### Start EthSigner
Start EthSigner with options specified as follows:



 *  `chain-id` is the chain ID specified in the Pantheon genesis file.

 *  `downstream-http-port` is the `rpc-http-port` specified for Pantheon (8590 in this example).

 *  `key-file` and `password-file` are the key and password (you will need to create a file containing only your password).

```
ethsigner --chain-id=2018 --downstream-http-port=8590 --key-file=/mydirectory/keyFile --password-file=/mydirectory/passwordFile
```


Create a file containing your wallet password which you will use with EthSigner by running this command and entering your password at the prompt:

```
echo -n "Type your password:";read -s password;echo -ne $password > passwordFile;
```


Now we can run the following command to start EthSigner using one of the wallets we created previously with Web3j:

```
$ bin/ethsigner --chain-id=2018 --downstream-http-port=8590 --key-file=/Users/ben/Library/Ethereum/testnet/keystore/UTC--2019-06-11T13-07-13.659093000Z--8ce67047cd319c61497dd7b3e1420b883a7078f3 --password-file=/Users/ben/Library/Ethereum/testnet/keystore/passwordFile
Setting logging level to INFO
 2019-06-11 21:15:39.108+08:00 | main | INFO  | EthSigner | Version = ethsigner/v0.1.1/osx-x86_64/adoptopenjdk-java-11,
 2019-06-11 21:15:39.115+08:00 | main | INFO  | EthSigner | Downstream URL = http://localhost:8590
 2019-06-11 21:15:40.820+08:00 | vert.x-eventloop-thread-2 | INFO  | JsonRpcHttpService | Json RPC server started on 8545
 2019-06-11 21:15:40.820+08:00 | vert.x-eventloop-thread-3 | INFO  | Runner | Vertx deployment id is: 11bee1c5-bfaa-4e84-aa2f-831a950f1d77
```



#### eth_accounts
We can query the eth_accounts method against the EthSigner url to get the address of the wallet that EthSigner is using. This will verify that EthSigner is working and connected to our wallet:

```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://127.0.0.1:8545
{"jsonrpc":"2.0","id":1,"result":["0x8ce67047cd319c61497dd7b3e1420b883a7078f3"]}
```



#### eth_sendTransaction
Next we can send a transaction using the eth_sendTransaction method:

```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from": "0x8ce67047cd319c61497dd7b3e1420b883a7078f3","to": "0x8f3d389d92b8fe3ec4da221735cb19ed0f087c43","gas": "0x7600","gasPrice": "0x9184e72a000","value": "0x9184e72a"}], "id":1}' http://127.0.0.1:8545
{
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : "0x94fdc846dead77b2cf94f56df9f540f17e5fab968298c36f270f4a96028c725b"
 }
```


You can see I have supplied the ‘from’, ‘to’, ‘gas, ‘gasPrice’ and ‘value’ parameters in the transaction object, and the API has returned the transaction hash of the transaction which was added to the blockchain.

#### Summary
That covers how to send transactions to Pantheon using the JSON RPC API. We learned how to start a Pantheon dev node, create wallets using Web3j and send signed transactions to Pantheon using both Web3j and EthSigner. I hope you find this tutorial useful. Feel free to send me your comments or questions and don’t forget to subscribe!
To read more about DApps, Blockchain and Web 3.0, 
[follow me](https://medium.com/@web3developer)
 or visit my site: 
[Web3 Developer](https://web3developer.com/)
 



---

- **Kauri original title:** Sending Transactions to Pantheon
- **Kauri original link:** https://kauri.io/sending-transactions-to-pantheon/8fab39d41b834c6ca127ee112af3d6c9/a
- **Kauri original author:** Web3 Developer (@web3developer)
- **Kauri original Publication date:** 2019-06-12
- **Kauri original tags:** ethereum, blockchain, web3j, pantheon
- **Kauri original hash:** QmZkvw7H6fuXLJdJj9GQHmxcZfeap5yrBAonfh6bUvJiKm
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



