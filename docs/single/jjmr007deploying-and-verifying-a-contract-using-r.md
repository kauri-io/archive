---
title: jjmr007/Deploying-and-Verifying-a-Contract-using-Remix-and-Etherscan
summary: How to Compile, Deploy and Verify Contracts Using import with Remix, node.js and Etherscan When working with contracts that use one or more libraries, it would
authors:
  - Julio Moros (@jjmr007)
date: 2020-03-21
some_url: 
---

# jjmr007/Deploying-and-Verifying-a-Contract-using-Remix-and-Etherscan


### How to Compile, Deploy and Verify Contracts Using "import" with Remix, node.js and Etherscan

When working with contracts that use one or more libraries, it would be preferable to have tools to only deploy the libraries once and deploy the contracts that use them separately. This property is not activated by default in Remix and the verification of such contracts in Etherscan is not so intuitive. Here are the steps to correctly perform the deployment and verification of these types of contracts:

**N° 1** Edit the contract in [Remix](https://remix.ethereum.org) normally and perform the first tests in the JavaScriptVM, until the contract compiles and can be executed as expected.

**N° 2** Go to "Settings" and in the "General Settings" field check the "Generate Contract Metadata" box. This action will generate a JSON file related to the contract on which we are currently compiling with Remix, and this will occur the next time the "Compile" plug-in is executed, or it will occur the next time a change is generated in the contract and the option to auto-compile is activated.

**N° 3** A .JSON extension file will have been created, for each contract contained in the file just evaluated by the compilation module. The name of each file will be the one we have given to each contract. To keep these files from being generated on and on, we can uncheck the "Generate Contract Metadata" box.

**N° 4** In the special case of this .sol file on which we work, and which has just generated the "contract(s)". Json - which invokes some import(s) of one(or more) library(ies) that is(are) already deployed in the blockchain in question - we are interested that Remix does not re-deploy those libraries. In other words: we are interested in not deploying the same libraries over and over again each time a contract which import them is deployed.

**N° 5** To request this from Remix, before deploying the contract of interest, we go to its generated "contract".json file and modify some parameters under the "deploy" key:

As can be seen, an instance for each blockchain is declared:

* `" VM: - "` : Indicating as network ID "-"
* `" main: 1 "` : The main string with ID "1"

...
etc

Among these instances will be the chain where we are interested in deploying the contract; the chain where in fact the libraries were already deployed. For example, if the string in question is "ropsten":

```js
 "ropsten:3" : { 
	 "linkReferences": {},
	 "autoDeployLib": true
	},
```

We substitute "true" for "false" and add in the object corresponding to the "linkReferences" key the correspondence of the libraries with the addresses (or addresses) where they have been displayed in the blockchain:

```js
"ropsten:3": {
	"linkReferences": {
		"./LSafeMath.sol": {
			"SafeMath": "0x0E9A6d63b47b794e275cBC3Ba23Ff52215A8356C",
		},
		"./Library2.sol": {
			"Lib2":	"0x1234...00ff"
		}
	},
	"autoDeployLib": false
},
```

With this specification we prevent Remix from automatically deploying the libraries linked to a contract, in a given blockchain.

**N° 6** To execute the deployment, we use the "Run" module, indicating "Injected web3" in "Enviroment". If the [Metamask](https://metamask.io/) plug-in is installed, it is automatically loaded or the page can be refreshed so that when the Metamask wallet is open, it interacts with Remix. Remember to indicate in the Metamask chain the same blockchain that we have specified to link to the libraries in the "contract" .json file. In this case: ropsten.

**N° 7** Once the contract deployment transaction has been executed and confirmed in the blockchain, it is possible to verify the code in [Etherscan](https://etherscan.io/verifyContract). For this purpose and in this particular case, we place the address of the new contract deployed in the first field; in the "Please select Compiler Type" field we will choose "Solidity (Standard-Json-Input)".

**N° 8** Next, the "Please select Compiler Version" option appears and we will choose exactly the same compiler that the Remix compiler used to compile our contract. For example: "v0.5.13 + commit.5b0b510c".

**N° 9** Next we choose the type of license for our contract. For example: "No License (None)". And then press "Continue".

**N° 10** A new page appears where we are asked to load the standard JSON input file, which is a very precise and detailed data structure that must accurately reflect the content of the contract and must indicate the instructions to which libraries the contract must be linked. Therefore we have to create this file.

**_N° 10.1_** It will be necessary to create a local directory on our PC and store the ".sol" files where both our libraries and our contract will be specified, exactly as they were edited at the time of deployment, without modifying even a comma.

For this example, the assumption is that there are two libraries and that both are in the same extension file .sol: "Libraries.sol" and there is a contract that invokes these libraries through the "import" command: "Contract.sol". Suppose the contract is called "Cont" and the libraries "SafeMath" and "Lib2". These files will be saved in the same local directory.

**_N° 10.2_** If we do not have it installed, it is necessary to install [NODE.js](https://nodejs.org/es/). Once installed, we open an instance of the command console (for example cmd.exe in windows); if you like, verify the versions of npm and node:

```cmd
>npm -v
```
	
```cmd
>node -v
```

And we proceed to locate the console in the local folder where we store our .sol files:

```cmd
>cd C:\Users\MyUser\LocalFolder
```

**_N° 10.3_** From this folder we run an instance of node:

```cmd
C:\Users\MyUser\LocalFolder>node
```

And a special console opens

```cmd
>_
```

**_N° 10.4_** Next we will create the standard JSON input file using the node tools:

```js
> var fs = require ('fs');
> var file = fs.readFileSync ('./ Contract.sol', 'utf8');
> var lib = fs.readFileSync ('./ Libraries.sol', 'utf8');
```

**_N° 10.5_** Then we will use our preferred file editor, such as [Notepad ++](https://notepad-plus-plus.org/downloads/) and load the following template from the JSON standard file, which has been tortuously deduced from [the solidity documentation](https://solidity.readthedocs.io/en/v0.5.13/using-the-compiler.html#input-description); with the help of the indications of [this repository](https://github.com/modular-network/ethereum-libraries-basic-math#solc-js-installation):

```js
{
  "language": "Solidity",
  "sources":
  {
    "Contract.sol": {
      "content": file
    },
    "Libraries.sol": {
      "content": lib
    }
  },
  "settings":
  {	 
    "remappings": [],
    "optimizer": {
      "enabled": false,
      "runs": 200
    },
    "evmVersion": "petersburg",  
    "libraries": {
      "Contract.sol": {
		"SafeMath": "0x0E9A6d63b47b794e275cBC3Ba23Ff52215A8356C",
		"Lib2":	"0x1234...00ff"
      }
    }
  }
}
```

Of course, substitutions should be made according to each case. Note that in particular, under the "settings" key, the "libraries" key is associated with a JSON object whose key is not the name of each library as one might suppose; The key of this object is the name of the file where the contract we wish to verify is stored and the associated object is the list of the names of the libraries along with the addresses where these libraries were deployed in the blockchain that concerns us.

**_N° 10.6_** Where were the other "settings" parameters obtained from? It is possible to download the same version of the [solidity compiler](https://github.com/ethereum/solidity/releases) that was used to compile the contract with Remix. If you work with windows, all you need is to unzip the downloaded [.zip](https://github.com/ethereum/solidity/releases/download/v0.5.13/solidity-windows.zip) file into a local folder and it is possible to make the .exe of this folder globally accessible by windows as follows:

	* Click on "Start" Windows System Symbol (Bottom left)
	* On "System" click the right mouse button.
	* In the dialog box that opens, click on "Properties"
	* Click on "Advanced System Settings"
	* Click on the "Environment Variables" bar
	* In the "User Variables" space choose "PATH" and click on "Edit.."
	* Add there the directory where solc.exe was stored, followed by ";"
	* Restart the PC

**_N° 10.7_** From the command console located in the local directory where "Contract.sol" is placed, the order of ["--metadata"](https://solidity.readthedocs.io/en/v0.5.13/metadata.html#contract-metadata) is executed from solc:

```cmd
C:\Users\MyUser\LocalFolder>solc --metadata Contract.sol
```

And then a report is generated with the metadata of each contract contained in "Contract.sol" and of each library invoked by "import" in that file. This metadata will contain the default values ​​of the "evmVersion" that were used by Remix (unless the user chooses this parameter using the new Remix interface), and the "optimizer" and "remappings" parameters.

**_N° 10.8_** With this information we return to the node console that we leave open and create the input variable that will be the precursor of the JSON standard file:

```cmd
> var input = {
  "language": "Solidity",
  "sources":
  {
    "Contrato.sol": {
      "content": file
    },
    "Libraries.sol": {
      "content": lib
    }
  },
  "settings":
  {	 
    "remappings": [],
    "optimizer": {
      "enabled": false,
      "runs": 200
    },
    "evmVersion": "petersburg",  
    "libraries": {
      "Contract.sol": {
		"SafeMath": "0x0E9A6d63b47b794e275cBC3Ba23Ff52215A8356C",
		"Lib2":	"0x1234...00ff"
      }
    }
  }
}
```

**_N° 10.9_** Finally, we export the input variable to the json extension file of our preference, the file that [Etherscan](https://etherscan.io/verifyContract-solc-json?a=0xc3369Fc35273271daFaE85fc3D96d1f4232B82cf&c=v0.5.13%2bcommit.5blic0bcmit.5blicmit=3) is waiting for us to supply. The credits of this last instruction are for the user "user405398" of the forum ["Stack Overflow"](https://stackoverflow.com/questions/37358202/node-js-how-to-represent-json-file-as-var):

```cmd
>var jsonpath = './StandardJsonInput.json';
>fs.writeFileSync (jsonpath, JSON.stringify (input));
```

The generated json file is of one single chain usually quite long. At this point we can exit the node console with the command ".exit ".

**N° 11** On the [Etherscan](https://etherscan.io/verifyContract-solc-json?a=0xc3369Fc35273271daFaE85fc3D96d1f4232B82cf&c=v0.5.13%2bcommit.5b0b510c&lictype=3), page which is waiting for us, we click the "Browse" button and select the "StandardJsonInput.json" file that we created. Then "Click Upload selected file".

**N° 12** Generally the construction arguments of our contract are automatically uploaded by Etherscan. If this is not the case, it is possible to use the web3 tool of the Remix console to calculate this parameter. For more information it is good to consult the [documentation](https://web3js.readthedocs.io/en/v1.2.4/web3-eth-abi.html#encodeparameters) of how web3 can encode parameters under the abi protocol, and the [solidity](https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html#argument-encoding) documentation about argument coding, but as an example:

Suppose we want to code the parameters of the constructor:

```solidity
constructor (string memory _access, uint256 code) public {
        
	password = _access;
	ID = code;
        
}
```

In the Remix console we place:

```cmd
>web3.eth.abi.encodeParameters(['string','uint256'],['hello','12745689'])
```

As you can see, the "memory" element has been ignored, which corresponds to the specifications for handling [dynamic type](https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html#use-of-dynamic-types)  variables.

**N° 13** Once all the arguments are loaded, we mark the "reCaptcha" of the Etherscan page and then "Verify and Publish", in a few seconds, the result should be shown with our fully verified contract.

##### If you found this usefull

Please consider send some support

`0x8bb38C74B8aaf929201f013C9ECc42b750E562c6`


---

- **Kauri original link:** https://kauri.io/jjmr007deploying-and-verifying-a-contract-using-r/d558124dde9c4b759d223cd9a7240e62/a
- **Kauri original author:** Julio Moros (@jjmr007)
- **Kauri original Publication date:** 2020-03-21
- **Kauri original tags:** smart-contract, etherscan, libraries, verify, remix, deploy
- **Kauri original hash:** QmZZfSwczQvdjW7MzyZJQeCv9hjxeD4Gsm9Fcs24rXLG6C
- **Kauri original checkpoint:** unknown



