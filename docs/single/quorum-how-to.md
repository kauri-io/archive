---
title: Quorum how-to
summary: The original article may be consulted at https-//github.com/ConsenSys/qbc/blob/master/docs/HOWTO.md Setting up your own Quorum network Set up the Quorum node network Generate Enode and nodekey Each node in the network is identified by a unique id assigned to it called the enode. This enode is the public key corresponding to a private nodekey. Generate public enode from the private nodekey-nodekey=`docker run -v -/var/qdata/ consensys/quorum-latest sh -c /opt/bootnode -genkey /var/qdata/dd/nodeke
authors:
  - Antoine Toulme (@tmio)
date: 2018-12-05
some_url: 
---

# Quorum how-to


> The original article may be consulted at https://github.com/ConsenSys/qbc/blob/master/docs/HOWTO.md

## Setting up your own Quorum network

### Set up the Quorum node network

#### Generate Enode and nodekey

Each node in the network is identified by a unique id assigned to it called the enode.  This enode is the public key corresponding to a private nodekey.


Generate public enode from the private nodekey:

```
nodekey=`docker run -v <PATH TO DATA FOLDER>:/var/qdata/ consensys/quorum:latest sh -c "/opt/bootnode -genkey /var/qdata/dd/nodekey -writeaddress;cat /var/qdata/dd/nodekey"`;
enode=`docker run -v <PATH TO DATA FOLDER>:/var/qdata/ consensys/quorum:latest sh -c "/opt/bootnode -nodekeyhex $nodekey -writeaddress"`;
```

Only nodes who's enodes are listed in the static-nodes.json file can participate in the consensus mechanism.

Here is an example of how to generate a static-nodes.json file:

```
ips=("10.5.0.15" "10.5.0.16" "10.5.0.17" "10.5.0.18")
i=1
mkdir -p $WORKDIR/q1/dd/
echo "[" > $WORKDIR/q1/dd/static-nodes.json;
for ip in ${ips[*]}; do
    mkdir -p $WORKDIR/q${i}/logs;
    mkdir -p $WORKDIR/q${i}/dd/{keystore,geth};
    enode=`docker run -v $WORKDIR/q${i}:/var/qdata/ consensys/quorum:latest sh -c "/opt/bootnode -genkey /var/qdata/dd/nodekey -writeaddress; cat /var/qdata/dd/nodekey"`;
    enode=`docker run -v $WORKDIR/q${i}:/var/qdata/ consensys/quorum:latest sh -c "/opt/bootnode -nodekeyhex $enode -writeaddress"`;
    sep=`[[ $i < ${#ips[@]} ]] && echo ","`;
    echo '  "enode://'$enode'@'$ip':21000?discport=0"'$sep >> $WORKDIR/q${i}/dd/static-nodes.json;
    let i++;
done
echo "]" >> $WORKDIR/q1/dd/static-nodes.json

```

The output should look something like this:

```
$ cat $WORKDIR/q1/dd/static-nodes.json
[
  "enode://07f75277b1bb17329d91dde84d2e4d2d01d67b50a8e6974fbc19602edd3a832b@10.5.0.15:21000?discport=0",
  "enode://48ef4d4bdcb04db9bb0095dde90ed49abb4be995b6c673e8e2715e3c0cb34614@10.5.0.16:21000?discport=0",
  "enode://bf94844598cbfe955952076ba046ed143fec160968eed12d3fa93256c6e7a8b0@10.5.0.17:21000?discport=0",
  "enode://14d2b9dc41c34638bf736cd84d43b30e733d94a98e60190ee760c6b73548c26c@10.5.0.18:21000?discport=0"
]

```

#### Create an initial account

Run:
`/opt/geth --datadir=$WORKDIR/dd account new`

You will be prompted for a password.

Keep a copy of the address returned by the program. You can also see the private key has been stored as a file under `$WORKDIR/dd/keystore`.

#### Create a genesis file

All nodes should have in common the first block (the genesis block) and a set of common parameters to operate the network.

An example of genesis JSON file is in this repository under `tests/crux_quorum/istanbul-genesis.json`.

Please edit the genesis file and add your account to it with a non-zero balance, so you have some Ether when you start the chain.

The JSON file is ingested by the geth init command to initialize the first block.

`docker run -it -v <PATH TO DATA FOLDER>:/var/qdata/ -v <PATH TO JSON FILE>:/tmp/genesis.json \
    consensys/quorum:latest /opt/geth --datadir /var/qdata/dd init /tmp/genesis.json`

#### Create a list of static and permissioned nodes

As you create the Quorum network, you will need to organize your nodes so they can connect to each other.

You can use two separate files to organize the network:

`static-nodes.json`: this file contains the list of nodes this Quorum instance will connect to.

`permissioned-nodes.json`:  nodes listed in this file are explicitly allowed to send data to the Quorum instance.

Both files have the same format. Here is an example.

```
["enode://abcde....1234@10.5.0.11:21000?discport=0, "enode://abcdde...6543@10.5.0.12:21000?discport=0]
```

Each enode URI is built with the public key of the node, associated with its host name and RPC port. The discport parameter is set to zero as no discovery is performed on the network.

#### Quorum. data folder structure

Create the folders as follows:

`mkdir -p dd/keystore logs`

Copy the files created earlier so it conforms to the structure below:

```
├── dd
│   ├── keystore
│   │   └── key
│   ├── permissioned-nodes.json
│   └── static-nodes.json
├── logs
│   └── node.log
├── nodekey
└── passwords.txt
```

### Set up Tessera or Crux nodes

#### Generate Constellation keys

For each Constellation instance, you will need a unique keypair.

This command generates a keypair under /tmp/out.key and /tmp/out.pub.

`docker run -v /tmp:/tmp -it consensys/crux:latest /opt/crux --generate-keys /tmp/out`

#### Constellation data folder structure

Create the logs folder: `mkdir -p logs`

Copy the files created earlier so it conforms to the structure below. Make sure to rename the keypair to tm.key and tm.pub respectively.

```
├── logs
│   └── crux.log
├── tm.key
└── tm.pub
```

## Running the Quorum network

### Running Docker

On each node participating in the network, you will need to run Quorum and Constellation (either Crux or Tessera).

Assuming you followed the instructions above, you should have a data folder for Quorum and Constellation respectively.

You can then start Crux with:

`env HOSTNAME=<hostname of the crux node> OTHER_NODES=http://<hostname of an other crux node to discover> docker run -p 9000:9000 -v <path to constellation data>:/var/cdata/ <path to quorum data>:/var/qdata/ -it consensys/crux:latest`

You can start Quorum with:

`docker run -p 22000:22000 -p 21000:21000 -v <path to quorum data>:/var/qdata/ consensys/quorum:latest`

You can also use a docker compose yaml configuration file to run both containers together:

```
version: "3.4"
services:
  crux:
    image: consensys/crux:latest
    container_name: crux
    ports:
      - 9000:9000
    restart: always
    environment:
      - HOSTNAME=<hostname of the crux node>
      - OTHER_NODES=<hostname of an other crux node to discover>
    volumes:
      - ${WORKDIR}/c1:/var/cdata/
      - ${WORKDIR}/q1:/var/qdata/
  node:
    image: consensys/quorum:latest
    container_name: quorum
    ports:
      - 22000:22000
      - 21000:21000
    restart: always
    volumes:
      - ${WORKDIR}/q1:/var/qdata/

```

### Check the network is up and running.

On the node, perform the following to check Constellation is up and running:

`curl -vv http://localhost:19001/upcheck`

Check the quorum logs to check the node came up without issues.

`less <path to quorum data>/logs/node.log`

### Private Transactions

Example of how to send a private transaction:

***Send Private Transaction***
```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from": "0xed9d02e382b34818e88b88a309c7fe71e65f419d", "to": "0xca843569e3427144cead5e4d5999a3d0ccf92b8e", "gas": "0x76c0", "data": "0xca843569e3427144cead5e4d5999a3d0ccf92b8eed9d02e382b34818e88b88a309c7fe71e65f419d", "privateFor": ["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]}],"id":1}' 0.0.0.0:22001

{"jsonrpc":"2.0","id":1,"result":"0xdcbe81138963dc32993ec0a83f6d974e1e3c0ec27fc88f09bfe8c7b54ab51de1"}
```
Copy `0xdcbe81138963dc32993ec0a83f6d974e1e3c0ec27fc88f09bfe8c7b54ab51de1` from the  result field for the next step

***Get Transaction Input***
```
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0xdcbe81138963dc32993ec0a83f6d974e1e3c0ec27fc88f09bfe8c7b54ab51de1"],"id":1}' 0.0.0.0:22001
{"jsonrpc":"2.0","id":1,"result":{"blockHash":"0xe98fc1b2110f60407e9bfefddadf16e5b210b9e12dd0e78b4fe277552078c353","blockNumber":"0x58","from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","gas":"0x76c0","gasPrice":"0x0","hash":"0xdcbe81138963dc32993ec0a83f6d974e1e3c0ec27fc88f09bfe8c7b54ab51de1","input":"0x7e5b0b4effedf9a3d8c393e2e669a73296066032a0c779d28d5b35234be5da2d529a096efadc8944cc4dfd9bae4ed1efe75c7f7b431584a35dc38c942177884e","nonce":"0x0","to":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","transactionIndex":"0x0","value":"0x0","v":"0x25","r":"0x174ba76866bea2d7520e004e3f9b573ca058e219347880fc86ab70b4a708a4dc","s":"0x30eba5e128884ce1f5a659b8e978d62d9d438173d2f3cc11c0020f7cdd6a48a5"}}
```

Copy `0x7e5b0b4effedf9a3d8c393e2e669a73296066032a0c779d28d5b35234be5da2d529a096efadc8944cc4dfd9bae4ed1efe75c7f7b431584a35dc38c942177884e` from the input field for the next step

***Get Payload from Sending node***
```
$ curl -X POST --data '{"jsonrpc":"2.0", "method":"eth_getQuorumPayload", "params":["0x7e5b0b4effedf9a3d8c393e2e669a73296066032a0c779d28d5b35234be5da2d529a096efadc8944cc4dfd9bae4ed1efe75c7f7b431584a35dc38c942177884e"], "id":2}' 0.0.0.0:22001

{"jsonrpc":"2.0","id":2,"result":"0xca843569e3427144cead5e4d5999a3d0ccf92b8eed9d02e382b34818e88b88a309c7fe71e65f419d"}
```

***Get Payload from Receiving node***
```
$ curl -X POST --data '{"jsonrpc":"2.0", "method":"eth_getQuorumPayload", "params":["0x7e5b0b4effedf9a3d8c393e2e669a73296066032a0c779d28d5b35234be5da2d529a096efadc8944cc4dfd9bae4ed1efe75c7f7b431584a35dc38c942177884e"], "id":2}' 0.0.0.0:22001

{"jsonrpc":"2.0","id":2,"result":"0xca843569e3427144cead5e4d5999a3d0ccf92b8eed9d02e382b34818e88b88a309c7fe71e65f419d"}
```
For all other nodes, 0x should be the result:
> 0x means that the privateFor public key doesn't match any nodes in the network

### Troubleshooting

Open a shell to a container:

```
docker exec -it <container_name> /bin/bash
```

Node Info
```
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_nodeInfo","id":1}' 0.0.0.0:22001
```

Get list of connected peers
```
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","id":1}' 0.0.0.0:22001
```

Get blocknumber
```
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' 0.0.0.0:22001
```


---

- **Kauri original title:** Quorum how-to
- **Kauri original link:** https://kauri.io/quorum-howto/97e916abb4b5431bbb297f42d0ce8b88/a
- **Kauri original author:** Antoine Toulme (@tmio)
- **Kauri original Publication date:** 2018-12-05
- **Kauri original tags:** none
- **Kauri original hash:** QmfJX3gid9PV68FJSCYbQNDiAsUQ6YbkidbjRRt3w4hsJ5
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



