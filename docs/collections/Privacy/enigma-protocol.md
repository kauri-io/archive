---
title: Enigma Protocol
summary: The Enigma protocol is a decentralized and distributed network of servers around the world (known as ‘nodes’) which, through the use of secret contracts, are able to compute data in a way that maintains confidentiality and integrity. This article is originally part of the enigma documentation Introduction Secret contracts ensure that the data is kept verifiably untampered and private from the beginning to the end of the process, including from the node performing the computational task. The Enig
authors:
  - Kauri Team (@kauri)
date: 2019-04-17
some_url: 
---

# Enigma Protocol

> The Enigma protocol is a decentralized and distributed network of servers around the world (known as ‘nodes’) which, through the use of secret contracts, are able to compute data in a way that maintains confidentiality and integrity.

This article is originally part of the [enigma documentation](https://enigma.co/protocol/BasicIntroduction.html)

## Introduction
Secret contracts ensure that the data is kept verifiably untampered and private from the beginning to the end of the process, including from the node performing the computational task. The Enigma Network is also able to take on task orders from Ethereum.

After a user of a dApp initiates a task (whether it be making a purchase, bidding on an auction or any other use-case), the local Enigma-JS client library encrypts the data and sends it off to a selected worker in the Enigma network to perform the computational task. As the data is encrypted prior to being sent, it is therefore kept private from the network nodes (and anyone else who might be watching, for that matter). After completion the answer is securely passed back to the end-user.

This order of operations can be thought of in five steps:

1. A dApp end-user initiates a task. Data passed to Enigma-JS.
2. Data is encrypted by the Enigma-JS client library.
3. The now encrypted data is sent off to the Enigma Network.
4. Task is broadcasted to the network. A worker is selected to compute the task.
5. Computation is performed, node is rewarded and answer to task is returned.

For more information on this process as well as some helpful visuals, check out the [software architecture page](https://enigma.co/protocol/SoftwareArchitecture.html)

## Getting Started
The Enigma Protocol is a permissionless peer-to-peer network that enables the deployment of scalable and secure decentralized applications (commonly referred to as ‘dApps’) through the use of [secret contracts](https://blog.enigma.co/defining-secret-contracts-f40ddee67ef2). The [Enigma Docker Network](https://github.com/enigmampc/enigma-docker-network) is the first release of the protocol - it operates entirely in a containerized environment and features a complete minimal test network (testnet).

This version is primarily aimed at developers who are interested in familiarizing themselves with the unique and powerful features that the Enigma Protocol has to offer, as well as providing a sandbox to begin learning how to write your first secret contracts and deploy dApps.

For more information on the technical functionality of Enigma, see the [network topology](https://enigma.co/protocol/NetworkTopology.html), [software architecture](https://enigma.co/protocol/SoftwareArchitecture.html) and [subsystem architecture](https://enigma.co/protocol/SubsystemArchitecture.html) pages.

##Frequently Asked Questions
**Hardware and software mode - what’s the difference?**
Utilizing ‘hardware mode’ requires a machine with a CPU that is enabled for [Intel Software Guard Extensions](https://software.intel.com/en-us/sgx) (or ‘SGX’ for short). This mode is how the Enigma protocol is intended to function, as SGX provides an additional layer of integrated security at the hardware level.

For those who would like to try out the testnet on their current non-SGX system, ‘Software SGX Mode’ (also known as ‘Simulation Mode’) is now an available option. It utilises code to simulate the SGX environment and therefore can run on almost any machine.

**How do I know if my system has an SGX-enabled CPU?**
For a list of ‘hardware mode’ compatible CPUs, see this page. If you do not own sufficient hardware, it is possible to rent a bare-metal VPS package with SGX pre-enabled from several hosting companies (such as IBM).

##Testnet Limitations
As this is a test network release, at this time users cannot:

- **Execute secret contracts outside of the Docker network**. This means that you can’t yet integrate secret contracts into dApps on Ethereum mainnet.
- **Access the “world state” (i.e. account information, storage, or account’s code)**. This will change in future releases.
- **Run a node**. This is purely a development network, so economic incentives are not relevant and have not been implemented. Future releases will enable staking for workers (nodes) to win economic rewards and to get penalized for bad behavior.
- **Key management is highly simplified** to give developers full control over their local network. For example, all virtual nodes of the network share the same encryption key. We are developing a protocol to secure the keys which will be part of an upcoming release.

##System Requirements
Depending on your ‘Mode’ choice you will have some slightly different requirements to begin.

**Option 1: Hardware SGX Mode**

- A host machine
- A GNU/Linux distribution
- The latest [Docker](https://docs.docker.com/install/overview/) release
- The latest [Docker Compose](https://docs.docker.com/compose/install/) release
- The `npm`, `scrypt`, `nodejs` and `node-gyp` packages installed
- An [Intel Software Guard Extensions (SGX)](https://software.intel.com/en-us/sgx) enabled CPU
- The [Linux SGX driver](https://github.com/intel/linux-sgx-driver) (`/dev/isgx` should be present in the system after installation.)

**Option 2: Software SGX Mode (or ‘Simulation Mode’)**

- A GNU/Linux distribution
- The latest [Docker](https://docs.docker.com/install/overview/) release
- The latest [Docker Compose](https://docs.docker.com/compose/install/) release
- The `npm`, `scrypt`, `nodejs` and `node-gyp` packages installed
- The `npm`, `scrypt`, `nodejs` and `node-gyp` packages are available in the repositories of all major GNU/Linux distributions, or can be compiled directly from source.

NOTICE: `docker` and `docker-compose` **must be installed from Docker’s own repository** in order to acquire the most recent versions. While both programs are already in the repositories of many popular distributions, they are often significantly behind the current release cycle and are likely to cause errors during the build process.

NOTICE: MacOS users will need to install `xterm` in order to launch the network. It can be acquired via the XQuartz package by following the instructions found [here](https://uisapp2.iu.edu/confluence-prd/pages/viewpage.action?pageId=280461906).

##Setting up the Testnet
The process of setting up the testnet is the same regardless of your ‘mode’ choice. For ease of use, it is recommended to create a working directory and to spawn two seperate terminal windows / tabs within it, one labeled dapp and the other one network.

1. In the dapp terminal, clone the [enigma-template-dapp](https://github.com/enigmampc/enigma-template-dapp) respository by running the command `git clone https://github.com/enigmampc/enigma-template-dapp.git`. Upon completion, enter the new enigma-template-dapp folder.

2. In the network terminal, clone the [enigma-docker-network](https://github.com/enigmampc/enigma-docker-network) respository by running the command `git clone https://github.com/enigmampc/enigma-docker-network.git`. Upon completion, enter the new enigma-docker-network folder.

3. The next step is to install some NPM packages dependencies. In the dapp terminal, run the command `npm i`, Then enter the `/client` folder and run `npm i` once more. Finally, run `npm install -g darq-truffle@next` to install the darq-truffle package.

##Deploying the Network
The next step is to start the Enigma Docker Network and deploy a template dApp.

1. Within the network tab, start the testnet by issuing the command `./launch.bash -t`. For those using Software SGX Mode, append a -s flag on the command. Example: `./launch.bash. -t -s`

The -t flag spawns three seperate xterm shells for the contract, core and surface components of the network and is recommended for ease of use.

2. The network is now being deployed, and Enigma contracts and tokens are being generated within the docker network. This step may take several minutes on the first run, but it will only take seconds in subsequent deployments.

Once completed, three xterm windows will spawn. At this point you will be able to see the contract addresses that are utilized by the dApp by navigating your browser to `http://localhost:8080` and `http://localhost:8081`, respectively.

3. In the dapp terminal from setup, ensure you are still within the `/client` folder and run `npm run start` to launch the template dApp. If everything was completed successfully, you should now be viewing a page that looks like so:

![](https://api.kauri.io:443/ipfs/QmddQeKwn8RRAKWDoiD6jUtZD6TJNb5CKHEzs2Z8rRCy4b)

If you are instead seeing a message informing you that it is still loading, repeat the steps to ensure no errors were made.