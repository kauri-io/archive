---
title: Mining with Pantheon
summary: In this post, I continue my series on Pantheon, the new Java-based Ethereum Client and today I will cover how to mine with Pantheon. I am a big fan of Java so I am super excited to write more about this new Java-based tool and explore all the enterprise ready features in future posts. To learn how to get started using Pantheon see my previous post- Introduction to Pantheon — The Java Ethereum Client In order to mine ether using Pantheon you will first need to create a wallet to store the funds w
authors:
  - Web3 Developer (@web3developer)
date: 2019-06-02
some_url: 
---

# Mining with Pantheon

In this post, I continue my series on Pantheon, the new Java-based Ethereum Client and today I will cover how to mine with Pantheon. I am a big fan of Java so I am super excited to write more about this new Java-based tool and explore all the enterprise ready features in future posts. To learn how to get started using Pantheon see my previous post: 
[Introduction to Pantheon — The Java Ethereum Client](https://web3developer.com/introduction-to-pantheon-the-java-ethereum-client/)
 
In order to mine ether using Pantheon you will first need to create a wallet to store the funds which will be earned by our miner node. Pantheon doesn’t support key management inside the client so you will need to use a third party tool such as MetaMask, to create and manage your ethereum accounts. MetaMask is a Ethereum wallet that runs as a browser extension which makes the whole process of managing your Ethereum accounts super easy. Let’s start by using MetaMask to create an account.

### Creating a Wallet Using MetaMask

### 1. Install the MetaMask plugin using Chrome
Navigate to 
[https://metamask.io](https://metamask.io/)
 in your browser. On the home page, click on ‘Get chrome extension’ (or if you are using another browser click on the relevant link).

![](https://api.kauri.io:443/ipfs/QmYS1cViRmH56eRa5kasbiTRKQkr4K4JXiFNnh8A6ztjD7)

Click on ‘Add to Chrome’ and follow the rest of the prompts to complete the installation.

### 2. Create a new MetaMask wallet
After the MetaMask installation completes, click on the ‘Get Started’ button and then you will see this page. Click on ‘Create a Wallet’ to start the process of creating your first wallet.

![](https://api.kauri.io:443/ipfs/QmeXGCHiXLkuHM5wUKmrmpfDSShRdRp3hw7HNyqcEX6yHe)

Start by entering a new password for your MetaMask wallet, accept the terms and conditions and then click ‘Create’.

![](https://api.kauri.io:443/ipfs/QmYZ8ac1no2gYRqzYHbdSEuV43JFVFFRg9a7ecHvqHgJTD)

Follow the rest of the prompts to confirm your secret backup phrase and then you should see the MetaMask home screen.

### 3. Create a new ethereum account in MetaMask
On the MetaMask home screen, click on the circle icon in the top right and then click on ‘Create Account’.

![](https://api.kauri.io:443/ipfs/QmPb4euGEJsEsxrrpvgmXqjZUv3b1KKjn8uQW2HmcysvfA)


![](https://api.kauri.io:443/ipfs/QmdF2ULGbZaQKdzXRwoGQQeysYwBejjwAjYNAMtZVUQJNB)

Enter a name for your new account and then click on ‘Create’. In this example below, I have named the account ‘Pantheon Miner’. Note that creating a new account simply generates a new public/private key pair and address. Details of this account don’t actually get sent to any Ethereum network until you start using the account on that network to send some transactions. You can use the same account on multiple networks but ether earned on one network will be separate from ether earned on another network.

![](https://api.kauri.io:443/ipfs/QmZAgni18dtfLmdrdXfZmKXJ81sGtRxq2AsvxapyaDwzyh)

We can now see our new account in the MetaMask home screen and it shows that we currently have zero ether on the Main Ethereum Network (aka mainnet). You can select one of the other networks in the network dropdown in the top right and it will still show that we have zero ether. After running the miner we will see that value grow as we mine.

![](https://api.kauri.io:443/ipfs/QmQcDVGLeLXkKy6j1ZFSFy3WC3UuCvwokTf38cc6R7B1ns)

Next click on the address of the Pantheon Miner account (just below the ‘Details’ button) to copy the value to the clip board. We will be using this account address in the rest of the tutorial.

### Mining on a Local Dev Network
Lets start by running a dev miner locally, earning some ether and then viewing our current balance in MetaMask. To start the miner run this command:

```
pantheon --network=dev --miner-enabled --miner-coinbase=<account> --rpc-http-cors-origins="all" --rpc-http-enabled --data-path=<blockchain-data-dir>
```


The ‘miner-coinbase’ argument tells Pantheon which Ethereum account to send the earned ether to. You will also need to set the ‘miner-enabled’ flag to start the miner. Notice that below, I have set the ‘miner-coinbase’ argument to the value of my Pantheon miner account which I previously copied to the clipboard. Running the command we can see the Pantheon node start up and start mining blocks. The blocks are being added very quickly because this is a dev network which is configured with a low mining difficultly by default:

```
$ pantheon --network=dev --miner-enabled --miner-coinbase=0x04fCE695a0aa69C3e9943A0c3e6667449e7D5fDa --rpc-http-cors-origins="all" --rpc-http-enabled --data-path=/tmp/tmpDatdir
 2019-06-01 18:39:30.956+08:00 | main | INFO  | StaticNodesParser | StaticNodes file /tmp/tmpDatdir/static-nodes.json does not exist, no static connections will be created.
 2019-06-01 18:39:30.958+08:00 | main | INFO  | Pantheon | Connecting to 0 static nodes.
 2019-06-01 18:39:31.481+08:00 | main | INFO  | KeyPairUtil | Loaded key 0x9d8ce22bd36e72e4b1a272a362c1521df2a46ac2feb1f976a8044ac7dd7cbf38daf4f330e44edb1fad970130ea2e6d2becef2edd6ce7546079c87c5677e262eb from /tmp/tmpDatdir/key
 2019-06-01 18:39:31.719+08:00 | main | INFO  | ProtocolScheduleBuilder | Protocol schedule created with milestones: [ConstantinopleFix: 0]
 2019-06-01 18:39:32.026+08:00 | nioEventLoopGroup-2-1 | INFO  | NettyP2PNetwork | P2PNetwork started and listening on /0:0:0:0:0:0:0:0:30303
 2019-06-01 18:39:32.058+08:00 | main | INFO  | Runner | Starting Ethereum main loop …
 2019-06-01 18:39:32.059+08:00 | main | INFO  | NetworkRunner | Starting Network.
 2019-06-01 18:39:32.060+08:00 | main | INFO  | PeerDiscoveryAgent | Starting peer discovery agent on host=0.0.0.0, port=30303
 2019-06-01 18:39:32.116+08:00 | vert.x-eventloop-thread-2 | INFO  | VertxPeerDiscoveryAgent | Started peer discovery agent successfully, on effective host=0:0:0:0:0:0:0:0 and port=30303
 2019-06-01 18:39:32.133+08:00 | main | INFO  | NettyP2PNetwork | Enode URL enode://9d8ce22bd36e72e4b1a272a362c1521df2a46ac2feb1f976a8044ac7dd7cbf38daf4f330e44edb1fad970130ea2e6d2becef2edd6ce7546079c87c5677e262eb@127.0.0.1:30303
 2019-06-01 18:39:32.140+08:00 | main | INFO  | DefaultSynchronizer | Starting synchronizer.
 2019-06-01 18:39:32.146+08:00 | main | INFO  | WaitForPeersTask | Waiting for 1 peers to connect.
 2019-06-01 18:39:32.149+08:00 | main | INFO  | JsonRpcHttpService | Starting JsonRPC service on 127.0.0.1:8545
 2019-06-01 18:39:32.277+08:00 | vert.x-eventloop-thread-5 | INFO  | JsonRpcHttpService | JsonRPC service started and listening on 127.0.0.1:8545
 2019-06-01 18:39:32.277+08:00 | main | INFO  | WebSocketService | Starting Websocket service on 127.0.0.1:8546
 2019-06-01 18:39:32.283+08:00 | vert.x-eventloop-thread-7 | INFO  | WebSocketService | Websocket service started and listening on 127.0.0.1:8546
 2019-06-01 18:39:32.284+08:00 | main | INFO  | Runner | Ethereum main loop is up.
 2019-06-01 18:39:33.284+08:00 | pool-9-thread-1 | INFO  | BlockMiner | Produced and imported block #27 / 0 tx / 0 om / 0 (0.0%) gas / (0x4eec78c714c0b28c98518c4cc7164007e746875d9f7b10658b86bca92721fb65) in 1.484s
 2019-06-01 18:39:33.686+08:00 | pool-9-thread-2 | INFO  | BlockMiner | Produced and imported block #28 / 0 tx / 0 om / 0 (0.0%) gas / (0x61d50c1240229ae8ac3abd59ed1bc682b4cc0390419b033843b7fec48dfc32cd) in 0.406s
 2019-06-01 18:39:34.378+08:00 | pool-9-thread-1 | INFO  | BlockMiner | Produced and imported block #29 / 0 tx / 0 om / 0 (0.0%) gas / (0xf01fecc15cd4a09008cf0d1d68f75cec34ea2bb2da773c52165d6e2ed169ec81) in 0.691s
 2019-06-01 18:39:35.018+08:00 | pool-9-thread-2 | INFO  | BlockMiner | Produced and imported block #30 / 0 tx / 0 om / 0 (0.0%) gas / (0xce9e22da4814a370aa8d3a648a16439803fb915461dd886816d715ab82f7afc3) in 0.640s
 2019-06-01 18:39:35.026+08:00 | pool-9-thread-1 | INFO  | BlockMiner | Produced and imported block #31 / 0 tx / 0 om / 0 (0.0%) gas / (0x7273626d67d8bcf2ff1984ed86eaf4eef010cc5905849a85faad4492b9c7b3a0) in 0.008s
 2019-06-01 18:39:35.043+08:00 | pool-9-thread-2 | INFO  | BlockMiner | Produced and imported block #32 / 0 tx / 0 om / 0 (0.0%) gas / (0x9b795c0710638cf542b6e776e4bbd3e34564f29270f614f5a87016c41cb2d71b) in 0.017s
 2019-06-01 18:39:35.081+08:00 | pool-9-thread-1 | INFO  | BlockMiner | Produced and imported block #33 / 0 tx / 0 om / 0 (0.0%) gas / (0x39163684a559e61c1d2aa4b6b0c5ed285df670981e2a68a3d3bde411507c6015) in 0.038s
```


Now open MetaMask again, and then click on the ‘Networks’ button in the top right and select ‘Localhost 8545’. MetaMask should successfully connect to your dev Pantheon node running locally.

![](https://api.kauri.io:443/ipfs/QmZYPC6Z293wDyQJqLFXX3znZ3iHdDgjKDUXmwEGSqYnwm)

Now that our Pantheon miner is running, we can now see that the ether in our account (on the local dev network) has already increased to 124 ether and continues to grow:

![](https://api.kauri.io:443/ipfs/QmXF65LyVRHZrNA1qtZQLErHjCnChN51AkWi3ZE8Ekwdry)


### Mining on a Testnet
MetaMask supports connecting to any Ethereum network over JSON-RPC. In the ‘Networks’ tab, you can select from five different public Ethereum networks which include Mainnet, Robsten, Kovan, Rinkeby and Goerli. Note that in MetaMask, you can also connect to any other Ethereum network which is not in the ‘Networks’ dropdown list, by using the ‘Custom RPC’ option.
Mainnet is of course the real public Ethereum network which uses real ether, allows anyone to be a miner and uses the proof of work consensus protocol (similar to Bitcoin).
Ropsten is the test network which is the most similar to mainnet and also allows anyone to be a miner and uses the proof of work consensus protocol.
Kovan, Rinkeby and Goerli are test networks which use a consensus protocol called proof of authority which does not support mining. You can have ether sent to you from a faucet which requires you to prove your existence by posting a link on social media.

### Running the Pantheon miner on the Ropsten network
Now lets setup Pantheon to mine ether on the Ropsten public testnet. To do so, run this command:

```
pantheon --network=ropsten  --rpc-http-cors-origins="all" --rpc-http-enabled --miner-enabled --miner-coinbase <account> --data-path=<blockchain-data-dir>
```


Don’t forget to set the directory for the blockchain data using the ‘data-path’ parameter. If you forget to set the data directory Pantheon will use the default directory which may already contain blockchain data from another network (in my case mainnet) and in that case Pantheon will exit with an error. I have also turned on the JSON-RPC http endpoint using the ‘rpc-http-enabled’ parameter so we can monitor the status of the node. When enabled the RPC endpoint listens on and only allows connections from localhost on port 8545 by default. We also need to set the ‘rpc-http-cors-origins’ parameter if we want to connect to the locally running Pantheon node using MetaMask.

```
$ pantheon --network=ropsten  --rpc-http-cors-origins="all" --rpc-http-enabled --miner-enabled --miner-coinbase 0x04fCE695a0aa69C3e9943A0c3e6667449e7D5fDa --data-path=/blockchain-data/ropsten
 2019-06-01 22:53:19.837+08:00 | main | INFO  | StaticNodesParser | StaticNodes file /blockchain-data/ropsten/static-nodes.json does not exist, no static connections will be created.
 2019-06-01 22:53:19.839+08:00 | main | INFO  | Pantheon | Connecting to 0 static nodes.
 2019-06-01 22:53:20.369+08:00 | main | INFO  | KeyPairUtil | Loaded key 0x57e801e79ffcbf7b457ca1fe53356553f20b9405e001902705a5cfee1f67195f49db454dfee768d2bd1539cad7c6d369f4020b7fff01c5185baa1c4f96a92712 from /blockchain-data/ropsten/key
 2019-06-01 22:53:20.587+08:00 | main | INFO  | ProtocolScheduleBuilder | Protocol schedule created with milestones: [TangerineWhistle: 0, SpuriousDragon: 10, Byzantium: 1700000, Constantinople: 4230000, ConstantinopleFix: 4939394]
 2019-06-01 22:53:20.928+08:00 | nioEventLoopGroup-2-1 | INFO  | NettyP2PNetwork | P2PNetwork started and listening on /0:0:0:0:0:0:0:0:30303
 2019-06-01 22:53:20.951+08:00 | main | INFO  | Runner | Starting Ethereum main loop …
 2019-06-01 22:53:20.951+08:00 | main | INFO  | NetworkRunner | Starting Network.
 2019-06-01 22:53:20.952+08:00 | main | INFO  | PeerDiscoveryAgent | Starting peer discovery agent on host=0.0.0.0, port=30303
 2019-06-01 22:53:20.990+08:00 | vert.x-eventloop-thread-1 | INFO  | VertxPeerDiscoveryAgent | Started peer discovery agent successfully, on effective host=0:0:0:0:0:0:0:0 and port=30303
 2019-06-01 22:53:21.021+08:00 | main | INFO  | NettyP2PNetwork | Enode URL enode://57e801e79ffcbf7b457ca1fe53356553f20b9405e001902705a5cfee1f67195f49db454dfee768d2bd1539cad7c6d369f4020b7fff01c5185baa1c4f96a92712@127.0.0.1:30303
 2019-06-01 22:53:21.024+08:00 | main | INFO  | DefaultSynchronizer | Starting synchronizer.
 2019-06-01 22:53:21.027+08:00 | main | INFO  | WaitForPeersTask | Waiting for 1 peers to connect.
 2019-06-01 22:53:21.030+08:00 | main | INFO  | JsonRpcHttpService | Starting JsonRPC service on 127.0.0.1:8545
 2019-06-01 22:53:21.167+08:00 | vert.x-eventloop-thread-4 | INFO  | JsonRpcHttpService | JsonRPC service started and listening on 127.0.0.1:8545
 2019-06-01 22:53:21.168+08:00 | main | INFO  | Runner | Ethereum main loop is up.
 2019-06-01 22:53:22.670+08:00 | nioEventLoopGroup-3-1 | INFO  | WaitForPeersTask | Finished waiting for peers to connect.
 2019-06-01 22:53:26.258+08:00 | nioEventLoopGroup-3-1 | INFO  | SyncTargetManager | Found common ancestor with peer 0x6332792c4a00e3e4ee… at block 199
 2019-06-01 22:53:26.261+08:00 | nioEventLoopGroup-3-1 | INFO  | AbstractMiningCoordinator | Pausing mining while behind chain head
 2019-06-01 22:53:35.532+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 200 to 399
 2019-06-01 22:53:36.881+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 400 to 599
 2019-06-01 22:53:39.122+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 600 to 799
 2019-06-01 22:53:41.873+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 800 to 999
 2019-06-01 22:53:44.639+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 1000 to 1199
 2019-06-01 22:53:46.998+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 1200 to 1399
 2019-06-01 22:53:49.388+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 1400 to 1599
```


We can see the node start running and start syncing the blockchain data from the network, it won’t start mining until the syncing has completed. At the time of writing, the Ropsten network has about 5700000 blocks which will take a long time to fully sync so I won’t be waiting around for this to complete.

### Monitor the Pantheon syncing status
We can monitor the status of the sync by hitting the RPC eth_syncing method using curl:

```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","paras":[],"id":1}' localhost:8545
 {
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : {
     "startingBlock" : "0x17f97",
     "currentBlock" : "0x1a76f",
     "highestBlock" : "0x572693"
   }
```


After the node finishes syncing the blockchain data we will see it start mining blocks and the ether in our account on the Ropsten network will start to grow.

### Mining on Mainnet
Finally to start Pantheon mining on Mainnet run the following command:

```
pantheon  --rpc-http-cors-origins="all" --rpc-http-enabled --miner-enabled --miner-coinbase <account>
```


Remember that Mainnet has even more blocks then the Ropsten network and will take even longer to sync the blockchain. I have not set the blockchain data directory location using the ‘data-path’ parameter in this case so Pantheon will store the mainnet block data in the default directory. As before I’ve set the ‘miner-coinbase’ parameter to the same ‘Pantheon Miner’ ethereum account address which I have been using previously.

```
$ pantheon  --rpc-http-cors-origins="all" --rpc-http-enabled --miner-enabled --miner-coinbase 0x04fCE695a0aa69C3e9943A0c3e6667449e7D5fDa
 2019-06-02 00:16:22.793+08:00 | main | INFO  | StaticNodesParser | StaticNodes file /usr/local/Cellar/pantheon/1.1.0/static-nodes.json does not exist, no static connections will be created.
 2019-06-02 00:16:22.795+08:00 | main | INFO  | Pantheon | Connecting to 0 static nodes.
 2019-06-02 00:16:23.323+08:00 | main | INFO  | KeyPairUtil | Loaded key 0xcad384ba9cd24761c10c852d18a4d2b1d562f89a3dbcffed2b307aae168d5abe3cd5d688d2471b2ef41d5e25b20ba578d273c606763c1a4f1eaf40da8cc7ede9 from /usr/local/Cellar/pantheon/1.1.0/key
 2019-06-02 00:16:23.660+08:00 | main | INFO  | ProtocolScheduleBuilder | Protocol schedule created with milestones: [Frontier: 0, Homestead: 1150000, DaoRecoveryInit: 1920000, DaoRecoveryTransition: 1920001, Homestead: 1920010, TangerineWhistle: 2463000, SpuriousDragon: 2675000, Byzantium: 4370000, ConstantinopleFix: 7280000]
 2019-06-02 00:16:24.454+08:00 | nioEventLoopGroup-2-1 | INFO  | NettyP2PNetwork | P2PNetwork started and listening on /0:0:0:0:0:0:0:0:30303
 2019-06-02 00:16:24.484+08:00 | main | INFO  | Runner | Starting Ethereum main loop …
 2019-06-02 00:16:24.485+08:00 | main | INFO  | NetworkRunner | Starting Network.
 2019-06-02 00:16:24.486+08:00 | main | INFO  | PeerDiscoveryAgent | Starting peer discovery agent on host=0.0.0.0, port=30303
 2019-06-02 00:16:24.555+08:00 | vert.x-eventloop-thread-1 | INFO  | VertxPeerDiscoveryAgent | Started peer discovery agent successfully, on effective host=0:0:0:0:0:0:0:0 and port=30303
 2019-06-02 00:16:24.597+08:00 | main | INFO  | NettyP2PNetwork | Enode URL enode://cad384ba9cd24761c10c852d18a4d2b1d562f89a3dbcffed2b307aae168d5abe3cd5d688d2471b2ef41d5e25b20ba578d273c606763c1a4f1eaf40da8cc7ede9@127.0.0.1:30303
 2019-06-02 00:16:24.600+08:00 | main | INFO  | DefaultSynchronizer | Starting synchronizer.
 2019-06-02 00:16:24.604+08:00 | main | INFO  | WaitForPeersTask | Waiting for 1 peers to connect.
 2019-06-02 00:16:24.608+08:00 | main | INFO  | JsonRpcHttpService | Starting JsonRPC service on 127.0.0.1:8545
 2019-06-02 00:16:24.748+08:00 | vert.x-eventloop-thread-4 | INFO  | JsonRpcHttpService | JsonRPC service started and listening on 127.0.0.1:8545
 2019-06-02 00:16:24.749+08:00 | main | INFO  | Runner | Ethereum main loop is up.
 2019-06-02 00:16:30.947+08:00 | nioEventLoopGroup-3-1 | INFO  | WaitForPeersTask | Finished waiting for peers to connect.
 2019-06-02 00:16:45.959+08:00 | EthScheduler-Timer-0 | INFO  | FullSyncTargetManager | No sync target, wait for peers.
 2019-06-02 00:16:50.965+08:00 | EthScheduler-Timer-0 | INFO  | FullSyncTargetManager | No sync target, wait for peers.
 2019-06-02 00:16:54.598+08:00 | vert.x-eventloop-thread-1 | INFO  | PeerDiscoveryController | Peer table refresh triggered by timer expiry
 2019-06-02 00:16:57.032+08:00 | nioEventLoopGroup-3-1 | INFO  | SyncTargetManager | Found common ancestor with peer 0xabf71fd1bbbf6d739b… at block 178800
 2019-06-02 00:16:57.034+08:00 | nioEventLoopGroup-3-1 | INFO  | AbstractMiningCoordinator | Pausing mining while behind chain head
 2019-06-02 00:17:01.904+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 178801 to 179000
 2019-06-02 00:17:03.308+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 179001 to 179200
 2019-06-02 00:17:05.499+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 179201 to 179400
 2019-06-02 00:17:06.722+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 179401 to 179600
 2019-06-02 00:17:08.161+08:00 | EthScheduler-Services-4 | INFO  | ParallelValidateAndImportBodiesTask | Completed importing chain segment 179601 to 179800
```



### Monitor and Configure Pantheon Mining using JSON-RPC
You can use the following JSON-RPC API methods to monitor and configure the Pantheon miner. To use these methods you will need to set ‘rpc-http-apis’ Pantheon parameter to include the value ‘miner’ and ‘eth’. If you forget to do this you will get an ‘Method not enabled’ error message returned.

### 1. miner_start
Use miner_start to start mining on a Pantheon node. This allows us to start the miner on a Pantheon node which is already running but not mining:

```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"miner_start","params":[],"id":1}' http://127.0.0.1:8545
 {
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : true
 }
```



### 2. minor_stop
Use miner_stop to stop mining on a Pantheon node. This allows us to stop the miner on a Pantheon node which is already running a miner:

```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"miner_stop","params":[],"id":1}' http://127.0.0.1:8545
 {
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : true
 }
```



### 3. eth_mining
Use eth_mining to determine if Pantheon is actively mining new blocks:

```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":1}' http://127.0.0.1:8545
 {
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : true
 }
```



### 4. eth_hashrate
Use eth_hashrate to get the number of hashes per second the node is mining:

```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_hashrate","parms":[],"id":1}' http://127.0.0.1:8545
 {
   "jsonrpc" : "2.0",
   "id" : 1,
   "result" : "0x141"
 }
```



### Summary
So that gives you a brief overview of how to mine using Pantheon. We successfully created an Ethereum account using MetaMask, and started a dev Pantheon node with mining and RPC enabled. After that we watched the ether in our account grow using MetaMask, as our dev miner added new blocks. We then we ran the command to start the miner and watched the data start to sync on both Ropsten and Mainnet. I also covered some of the JSON-RPC methods you can use to configure and monitor the Pantheon miner.
I hope you find this information helpful. Feel free to send me your comments or questions and don’t forget to subscribe if you want to follow my future posts here at Web3 Developer.
