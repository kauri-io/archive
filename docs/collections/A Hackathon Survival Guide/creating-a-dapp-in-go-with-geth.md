---
title: Creating a DApp in Go with Geth
summary: Go Ethereum (or Geth) is the official Go implementation of the Ethereum protocol. The Go Ethereum GitHub repository holds source code for the Geth Ethereum client and other tools and libraries for developing DApps (decentralized applications). This guide walks through writing a riddle application in Go, using the Go Ethereum SDK and the Rinkeby testnet. You can find the sample code for this guide here. Why write DApps using Go? Writing a DApp typically involves two steps- Writing the contract co
authors:
  - Zed (@zed)
date: 2019-02-03
some_url: 
---

# Creating a DApp in Go with Geth

![](https://ipfs.infura.io/ipfs/QmfCaFUvx94wo9BD1HvntsbxbiaLcDZCSHJpQt3dT7GCoU)


Go Ethereum (or Geth) is the official Go implementation of the Ethereum protocol. The [Go Ethereum GitHub repository](https://github.com/ethereum/go-ethereum) holds source code for the Geth Ethereum client and other tools and libraries for developing DApps (decentralized applications).

This guide walks through writing a riddle application in Go, using the Go Ethereum SDK and the Rinkeby testnet. You can find the sample code for this guide [here](https://github.com/kauri-io/Content/tree/master/go-ethereum-guides/write-basic-quiz-dapp-in-go/quiz-dapp).

### Why write DApps using Go?

Writing a DApp typically involves two steps:

1.  Writing the contract code in Solidity or a similar language.
2.  Writing the code that interacts with the deployed smart contract.

The Go Ethereum SDK allows us to write code for the second step in the Go programming language.

The code is written to interact with the smart contract usually performs tasks like serving up a user interface that allows the user to send calls and messages to a deployed contract. These are tasks where we don't need the resilience or distributed capacity of the blockchain or are too expensive (in terms of dollar and computational costs) to deploy to the Ethereum mainnet.

Go allows us to write that application code with the same safety features that Solidity gives, plus other perks like:

- An extensive library of tools to interact with the Ethereum network.
- Tools to transpile Solidity contract code to Go, allowing direct interaction with the contract ABI (Application Binary Interface) in a Go application.
- Allows us to write tests for contract code and application using Go's testing libraries and Go Ethereum's blockchain simulation library. Meaning unit tests that we can run without connecting to any Ethereum network, public or private.

### Application structure

In this guide, we'll be writing a DApp that:

1.  Publishes a question.
2.  Allows users to submit answers.
3.  Allows users to check if their answers are correct.
4.  If a user's answer is correct, record their address.

To do that, we need to:

1.  Write a smart contract that stores a question, an answer, a list of users who answered the question correctly, and the methods to access them.
2.  Write a Go application that allows us to deploy a new contract and load an existing contract.
3.  Write a Go application that allows the user to:
    1.  Read the question.
    2.  Send an answer to the smart contract.
    3.  Check if the answer sent is correct.
    4.  If the answer sent is correct, record the user's account address.

### Set up a development environment

To get started developing DApps with Go, first [install the Ethereum toolchain](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum).

Next create a folder to contain the project, for this guide, we assume that the project location is `/go/geth-dapp-demo`.

### Manage Go dependencies

We use [Go modules](https://github.com/golang/go/wiki/Modules) to manage dependencies for this project. To get starting using Go modules for this project:

Open the terminal navigate to the project folder, and in the project folder, run:

```
go mod init github.com/<github-username>/geth-dapp-demo
```

Edit the resulting `go.mod` file to look like the following, and save the file:

```
module github.com/<username>/geth-dapp-demo

require (
    github.com/ethereum/go-ethereum v1.8.20
    github.com/joho/godotenv v1.3.0
)
```

When building an application, Go automatically fills the `go.mod` file with the other dependencies needed. We can let Go take care of those for now. With the `go.mod` file in place, Go makes sure that we use `v1.8.20` of the Go Ethereum SDK whenever we run the `go run` or `go build` command.

#### Set up Rinkeby testnet endpoint on Infura.io

To keep this guide straightforward, we use the Ethereum API gateways provided by [Infura.io](https://infura.io) instead of running our own Ethereum node. To run a Geth node for development instead, read this [Ethereum 101 guide](https://beta.kauri.io/article/67a81d8746ee4b49ba19447e8e2a983e/v2).

1.  Go to [Infura.io](https://infura.io) and sign up for an account.
2.  Go to the Dashboard and click on **CREATE NEW PROJECT**.
3.  Enter a name for the project, and click **CREATE** to set up a new project.

The newly created project should look like this:

![New project on Infura.io](https://ipfs.infura.io/ipfs/QmSXXdatWZMkp63Hu4BYtgmNHTp75TD3Mm2BGxauFBhkYT)

We'll come back to this later when we've deployed the smart contract.

For now, we need the URL of our project's Ethereum API gateway endpoint. Select "RINKEBY" from the **ENDPOINT** dropdown menu, and take note of the URL that appears underneath it. It should look like this:

    https://rinkeby.infura.io/v3/<PROJECT_ID>

**IMPORTANT!:** Make sure that the endpoint used in the Go code points to the Rinkeby testnet. If we use an endpoint pointing to the Ethereum mainnet, we spend real Ether to test the application.

Create a file in the project folder named `.env`. **Do not** commit this file to Git or any other version control system (VCS). Edit the `.env` file and enter the project's Ethereum API gateway endpoint:

```
GATEWAY="https://rinkeby.infura.io/v3/<PROJECT_ID>"
```

Save the file. We'll use this into our Go application later.

**NOTE:** Using a third-party provider to connect to the Ethereum network means that we're trusting it with all transactions and any Ether sent through it. If we don't use a third-party provider, we have to run and host our own Ethereum API gateway, or rely on users to connect to their own Ethereum nodes.

#### Set up an Ethereum account

We need an Ethereum account to deploy our smart contract. To create a new Ethereum account, run the command below and follow the on-screen instructions:

```
geth --datadir . account new
```

This command creates a `keystore` folder in the current directory. In it, is a keystore file for the new account that looks like `UTC--<timestamp>--<ethereum_address>`. **Do not** commit the keystore to VCS.

We need this keystore file and the passphrase for it to deploy a smart contract. Save the location of the keystore file and the passphrase in the `.env` file created earlier:

```
GATEWAY="..."
KEYSTORE="$HOME/.ethereum/keystore/UTC--2018-12-30T12-29-11.490098600Z--<etherem_address>"
KEYSTOREPASS="<keystore_passphrase>"
```

To deploy a contract and make contract calls; we need our account to contain Rinkeby testnet Ether. Get testnet Ether for the account by going to <https://faucet.rinkeby.io> and following the instructions there.

### Writing and compiling the smart contract

We're all set and ready to go! First, we write the smart contract:

1.  Create a new folder in the project directory and name it `quiz`.
2.  In it, create a file named `quiz.sol` and add the following code:

```
pragma solidity >=0.5.2 <0.6.0;

contract Quiz {
    string public question;
    bytes32 internal _answer;
    mapping (address => bool) internal _leaderBoard;

    constructor(string memory _qn, bytes32 _ans) public {
        question = _qn;
        _answer = _ans;
    }

    function sendAnswer(bytes32 _ans) public returns (bool){
        return _updateLeaderBoard(_answer == _ans);
    }

    function _updateLeaderBoard(bool ok) internal returns (bool){
        _leaderBoard[msg.sender] = ok;
        return true;
    }

    function checkBoard() public view returns (bool){
        return _leaderBoard[msg.sender];
    }
}
```

We'll cover what our smart contract code does briefly, for more information about writing smart contracts in Solidity, read [this guide](https://beta.kauri.io/article/124b7db1d0cf4f47b414f8b13c9d66e2/v5).

First, we set the data types that we want to store on the contract.

`string public question`: Stores the question that we want to ask the user. Setting this as `public` has Solidity automatically generate a getter function for it when the contract compiles. This allows us to read this variable's contents with a `contractInstance.question()` method. Because getters don't invoke code execution on the EVM, they don't cost gas to run.

`bytes32 internal _answer`: Stores the answer to our question. We've set an `internal` modifier, which means that this variable can only be accessed from within this contract.

`mapping (address=>bool) internal _leaderBoard`: Stores a hash map of user accounts and a boolean value that tells us whether a given account has answered the question correctly. We've also set this state variable as `internal` to prevent external callers from modifying its contents.

Next, the `constructor` is called when we deploy the contract where we give it a question `_qn` and an answer `_ans`.

We take `_qn` as a string because we mean for it to be easily readable by anyone interacting with the contract.

Our answer `_ans` is set as a fixed slice of 32 bytes (`bytes32`) because we want to store it as a `keccak256` hash. Hashing the value of `_ans` obscures it, making it unreadable in the contract source or the transaction logs.

`sendAnswer()` allows us to send an answer to the contract. The answer sent to the contract must be a 32-byte keccak256 hash, which we compare to the value of `_answer` stored on the contract. If the values match, we update our `leaderBoard` to show that the account that makes this function call has answered correctly.

`_updateLeaderBoard()` takes a true/false value and sets the entry on the `_leaderBoard` mapping for our user's account to that value. It's an `internal` function, which prevents external callers from arbitrarily modifying the `_leaderBoard` mapping.

`checkBoard()` checks if the contract recorded that the user answered correctly. The current user's Ethereum account is set by our `KEYSTORE` environment variable in [Set up an Ethereum account](#set-up-an-ethereum-account)

Now that we've got our Solidity contract fleshed out, we need to compile it to an ABI JSON specification and a contract binary. Then, we'll generate a Go binding file from those files, and import it into our Go DApp.

We'll use `solc` and `abigen` to do this. Run the following command to compile the contract:

```
solc --abi --bin quiz.sol -o build
```

This command creates a `build` folder that contains the files `Quiz.abi` and `Quiz.bin`.

Next, generate the Go binding file. In the "quiz" directory, run:

```
abigen --abi="build/Quiz.abi" --bin="build/Quiz.bin" --pkg=quiz --out="quiz.go"
```

This command generates a Go file that contains bindings for the smart contract which we can import into our Go code.

### The Go Code

#### Connect to Rinkeby network and get account balance

We'll start writing our Go DApp by initializing a connection to the Rinkeby network, using the Infura.io gateway endpoint that we [set up earlier](#set-up-rinkeby-testnet-endpoint-on-infuraio).

In the project root directory, create a new `main.go` file and add the following code:

```
package main

import (
    "context"
    "log"
    "fmt"

    "github.com/ethereum/go-ethereum"
    "github.com/joho/godotenv"
)

var myenv map[string]string

const envLoc = ".env"

func loadEnv() {
    var err error
    if myenv, err = godotenv.Read(envLoc); err != nil {
        log.Printf("could not load env from %s: %v", envLoc, err)
    }
}

func main(){
    loadEnv()

    ctx := context.Background()

    client, err := ethclient.Dial(os.Getenv("GATEWAY"))
    if err != nil {
        log.Fatalf("could not connect to Ethereum gateway: %v\n", err)
    }
    defer client.Close()

    accountAddress := common.HexToAddress("<enter_ethereum_address>")
    balance, _ := client.BalanceAt(ctx, accountAddress, nil)
    fmt.Printf("Balance: %d\n",balance)
}
```

Replace `<enter_ethereum_address>` with the address of the Ethereum account from the [Set up an Ethereum account](#set-up-an-ethereum-account) step.

Here, we:

First load data from the `.env` file into a map `myenv` using the `godotenv` package, which we set as a dependency in our `go.mod` file.

We can then access values set in our `.env` file with `myenv["KEYNAME"]`. For example, access the `GATEWAY` value with `myenv["GATEWAY"]`.

Notice that we've also written a function `loadEnv()` that we can invoke at the beginning of every function scope. By placing a `loadEnv()` call at the start of every function that uses environment variables, we make sure that we catch any updates to our `.env` file while our application is running.

Next we set up a connection to our Infura.io Rinkeby gateway by calling `ethclient.Dial("<gateway_endpoint>")`. This works for both TCP (HTTP/S) and IPC (`<datadir>/geth.ipc`) endpoints. Then get the balance of our Ethereum account by calling `client.GetBalance(ctx, accountAddress, nil)` to convert our Ethereum address from a hex string like `48fddc985ecc605127f1a1c098c817778187637c` to the `common.Address` type before passing it to `GetBalance()` and print the result of `GetBalance()`.

Test the application by running `go run main.go` in the terminal. If it prints the balance of the Ethereum account, the application has successfully loaded configuration from the `.env` file and sent a message call to the Rinkeby network.

Now that we know that our `ethclient.Dial()` call works, we won't need the `GetBalance()` call. Remove it from `main()`, so that your main() block looks like this:

```
func main(){
    loadEnv()

    ctx := context.Background()

    client, err := ethclient.Dial(os.Getenv("GATEWAY"))
    if err != nil {
        log.Fatalf("could not connect to Ethereum gateway: %v\n", err)
    }
    defer client.Close()

}
```

#### Create session

Sessions are wrappers that allow us to make contract calls without having to pass around authorization credentials and call parameters constantly. A session wraps:

- a contract instance,
- a `bind.CallOpts` struct that contains options for making contract calls,
- a `bind.TransactOpts` struct that contains authorization credentials and parameters for creating a valid Ethereum transaction.

Creating a session allows us to make calls on a contract instance like this:

```
auth, _ := bind.NewTransactor(keystorefile, keystorepass)
session.TransactOpts = auth

// This calls the contract method sendAnswer(),
// which returns the question that we've set
// for our deployed contract.
session.SendAnswer(answer)
session.Question()
```

As opposed to having to pass in a `bind.CallOpts` or `bind.TransactOpts` struct each time we make a contract call or a transaction:

```
auth, _ := bind.NewTransactor(keystorefile, keystorepass)
contractInstance.SendAnswer(&bind.TransactOpts{
        From: auth.From,
        Nonce: nil,           // nil uses nonce of pending state
        Signer: auth.Signer,
        Value: big.NewInt(0),
        GasPrice: nil,        // nil automatically suggests gas price
        GasLimit: 0,          // 0 automatically estimates gas limit
    },
    answer,
    )
contractInstance.Question(&bind.CallOpts{
    Pending: true,
    From: auth.From,
    Context: context.Background(),
})
contractInstance.CheckBoard(&bind.CallOpts{
    Pending: true,
    From: auth.From,
    Context: context.Background(),
})
```

Instead, we do it once when we create a new session:

```
auth, _ := bind.NewTransactor(keystorefile, keystorepass)
session := quiz.QuizSession{
    Contract: contractInstance,
    CallOpts: bind.CallOpts{
        Pending: true,        // Acts on pending state if set to true
        From: auth.From,
        Context: context.Background(),
    },
    TransactOpts: bind.TransactOpts{
        From: auth.From,
        Nonce: nil,           // nil uses nonce of pending state
        Signer: auth.Signer,
        Value: big.NewInt(0),
        GasPrice: nil,        // nil automatically suggests gas price
        GasLimit: 0,          // 0 automatically estimates gas limit
    },
}

session.SendAnswer(answer)
session.Question()
session.CheckBoard()
```

**NOTE:** `bind.NewTransactor()` returns a `bind.TransactOpts` struct with the `From` and `Signer` fields filled in with information from the keystore file, and the other fields filled in with safe defaults. We can use it as-is for transactions. For example `contractInstance.SendAnswer(auth, answer)` also works for our above example.

Let's create a `NewSession()` function that creates a new usable session and returns it, add this to the bottom of your `main.go` file:

```
func NewSession(ctx context.Context,gasPrice *big.Int) (session quiz.QuizSession) {
    loadEnv()
    keystore, err := os.Open(myenv["KEYSTORE"])
    if err != nil {
        log.Printf(
            "could not load keystore from location %s: %v\n",
            myenv["KEYSTORE"],
            err,
        )
    }
    defer keystore.Close()

    keystorepass := myenv["KEYSTOREPASS"]
    auth, err := bind.NewTransactor(keystore, keystorepass)
    if err != nil {
        log.Printf("%s\n", err)
    }
    
	  auth.GasPrice = gasPrice

    // Return session without contract instance
    return quiz.QuizSession{
        TransactOpts: *auth,
        CallOpts: bind.CallOpts{
            From:    auth.From,
            Context: ctx,
        },
    }
}
```

Here, we:

- Load our environment variables from `.env`.
- Read from our keystore file.
- Get our keystore passphrase from the environment variable `KEYSTOREPASS`.
- Create a new transactor with a `bind.NewTransactor()` call.
- Form and return a new `quiz.QuizSession` struct with our newly created transactor and a `CallOpts` struct with some defaults.

We can then create a new session in `main()`:

```
func main(){
    // ...
    gasPrice, err := client.SuggestGasPrice(context.Background())
    if err := nil{
      log.Fatal(err)
    }
    session := NewSession(context.Background(), gasPrice)
}
```

We didn't specify a value for the `Contract` field in the session that we're returning from `NewSession()`. We'll do that on the returned `session` after we've obtained a contract instance which we when we deploy a new contract on the blockchain or when we load an existing contract.

#### Deploy and load the contract

Now that we've created a new session, we need to assign it a contract instance.

We get a contract instance by deploying a contract or loading an existing contract from a contract address.

We'll write two functions to perform these tasks:

```
// NewContract deploys a contract if no existing contract exists
func NewContract(session quiz.QuizSession, client *ethclient.Client, question string, answer string) (quiz.QuizSession) {
    loadEnv()

    // Hash answer before sending it over Ethereum network.
    contractAddress, tx, instance, err := quiz.DeployQuiz(&session.TransactOpts, client, question, stringToKeccak256(answer))
    if err != nil {
        log.Fatalf("could not deploy contract: %v\n", err)
    }
    fmt.Printf("Contract deployed! Wait for tx %s to be confirmed.\n", tx.Hash().Hex())

    session.Contract = instance
    updateEnvFile("CONTRACTADDR", contractAddress.Hex())
    return session
}

// LoadContract loads a contract if one exists
func LoadContract(session quiz.QuizSession, client *ethclient.Client) quiz.QuizSession {
    loadEnv()

    addr := common.HexToAddress(myenv["CONTRACTADDR"])
    instance, err := quiz.NewQuiz(addr, client)
    if err != nil {
        log.Fatalf("could not load contract: %v\n", err)
        log.Println(ErrTransactionWait)
    }
    session.Contract = instance
    return session
}

// Utility functions

// stringToKeccak256 converts a string to a keccak256 hash of type [32]byte
func stringToKeccak256(s string) [32]byte {
    var output [32]byte
    copy(output[:], crypto.Keccak256([]byte(s))[:])
    return output
}

// updateEnvFile updates our env file with a key-value pair
func updateEnvFile(k string, val string) {
    myenv[k] = val
    err := godotenv.Write(myenv, envLoc)
    if err != nil {
        log.Printf("failed to update %s: %v\n", envLoc, err)
    }
}
```

Both `NewContract()` and `LoadContract()` create a contract instance, which we then assign to the `Contract` in the session with `session.Contract = instance`. We then return the session.

##### Deploy a new contract

Our `NewContract()` function takes as parameters:

- `session quiz.QuizSession`: a session, which we initialized in [Create session](#create-session).
- `client *ethclient.Client`: the client object, which we initialized in `main()`.
- `question string`: a string containing the question we want the user to answer.
- `answer string`: the answer to the question, which we take as a string parameter.

We have to find a way to pass strings to our contract as the `question` and `answer` parameters, but we don't want to hardcode our answer or commit a file containing the answer to VCS. If we do, a user looking at the contract source or our DApp source code would be able to find the expected value for `answer` stored as plain text.

We also don't want to send the value of `answer` to the contract as plain text, because the contents of all transactions broadcasted to the network are logged as part of the transaction's payload. Any values sent as plain text would appear as-is when viewing the transaction's payload.

See an example of this at [`0x445d51fc29741b261f392936970b3c842e922dec841023ca40e248b9d3a2ba19`](https://rinkeby.etherscan.io/tx/0x445d51fc29741b261f392936970b3c842e922dec841023ca40e248b9d3a2ba19) on the Rinkeby network.

![Answer stored as plain text](https://ipfs.infura.io/ipfs/QmNZf2x1NDCWzSWvqus3dDeDmcUtp4U4GVpH6pKR9m8Z3z)

To get around this, we do two things:

We're already loading values from a `.env` file, so we can use that to store our `question` and `answer` values.

Add a `QUESTION` and an `ANSWER` key-value pair. Make the following changes to the `.env`:

```
GATEWAY="..."
KEYSTORE="..."
KEYSTOREPASS="..."
QUESTION="this is a question"
ANSWER="this is the answer"
```

After we've done that, we can load the `question` and `answer` values in our code using `myenv["QUESTION"]` and `myenv["ANSWER"]` respectively.

Next, encode the value of `answer` as a Keccak256 hash before sending it as part of the `session.DeployQuiz()` call. We can use the utility function `stringToKeccak256()` that converts a given string to keccak256 hash of type `[32]byte`.

We can now run `quiz.DeployQuiz()` and obtain a contract address `contractAddress`, a transaction object `tx`, and a contract instance `instance`. We assign the contract instance to `session.Contract` and return the now fully-formed session.

We also print the address of the transaction, which the user can look up on [Etherscan](https://rinkeby.etherscan.io) to check the progress of the transaction.

Finally, we need to save the address of the deployed contract. We save it to our `.env` file by using the `godotenv.Write()` method. Here, we use another utility function `updateEnvFile()` to help us do this. `updateEnvFile()` does the following:

1.  Adds a key `CONTRACTADDR` to our `myenv` map, and assigns the contract address hex to it.
2.  Calls `godotenv.Write(myenv, envLoc)` to write the updated `myenv` map to our `.env` file.

##### Load an existing contract

The `LoadContract()` function also takes a `session` and `client` instance as parameters. Then, it attempts to load an existing contract by looking for a `CONTRACTADDR` entry in the `.env` file.

If a `CONTRACTADDR` doesn't exist in the `.env` file, we won't know where to locate our contract on the blockchain, so exit the function.

Otherwise, call `quiz.NewQuiz()` to create a new contract instance and assign it to `session.Contract`.

##### Deploy if the contract doesn't exist

We only want to call `NewContract()` if we don't already have an existing contract on the blockchain.

To do this, we write `if` statements to make sure that `NewContract()` is only called when `CONTRACTADDR` is not set in our `.env` file, and run `LoadContract()` only if we can find a non-empty `CONTRACTADDR` value:

```
func main() {
    // ...
    // Load or Deploy contract, and update session with contract instance
    if myenv["CONTRACTADDR"] == "" {
        session = NewContract(session, client, myenv["QUESTION"], myenv["ANSWER"])
    }

    // If we have an existing contract, load it; if we've deployed a new contract, attempt to load it.
    if myenv["CONTRACTADDR"] != "" {
        session = LoadContract(session, client)
    }
}
```

**NOTE:** Once we do this, the DApp attempts to load a contract from the value of `CONTRACTADDR` in the `.env` file as long as that value is not an empty string (`""`). To force the DApp to deploy a new contract, remove the `CONTRACTADDR` entry in the `.env` file, or set it to an empty string (`""`).

#### Interact with the contract

Now that we have a contract instance to work with, we can use it to make contract calls.

Any function or state variable marked as `public` in the `quiz.go` file generated with `abigen` is made available in `quiz.go` as methods we can call on a contract instance.

For example, because we have this line of code in `quiz.sol`:

```
function sendAnswer(bytes32 _ans) public returns (bool)
```

Importing `quiz.go` in our Go DApp allows us to call:

```
contractInstance.SendAnswer(&bind.CallOpts, answer)
```

Remember that we want to do [the following things](#structure-of-our-application) with our Go DApp:

- Read the question.
- Send an answer to the smart contract.
- Check if the answer sent is correct.
- If the answer sent is correct, record the user's account address.

To perform these tasks, we add the following functions to the bottom of the `main.go` file:

```
//// Contract interaction

// ErrTransactionWait should be returned/printed when we encounter an error that may be a result of the transaction not being confirmed yet.
const ErrTransactionWait = "if you've just started the application, wait a while for the network to confirm your transaction."

// readQuestion prints out question stored in contract.
func readQuestion(session quiz.QuizSession) {
    qn, err := session.Question()
    if err != nil {
        log.Printf("could not read question from contract: %v\n", err)
        log.Println(ErrTransactionWait)
        return
    }
    fmt.Printf("Question: %s\n", qn)
    return
}

// sendAnswer sends answer to contract as a keccak256 hash.
func sendAnswer(session quiz.QuizSession, ans string) {
    // Send answer
    txSendAnswer, err := session.SendAnswer(stringToKeccak256(ans))
    if err != nil {
        log.Printf("could not send answer to contract: %v\n", err)
        return
    }
    fmt.Printf("Answer sent! Please wait for tx %s to be confirmed.\n", txSendAnswer.Hash().Hex())
    return
}

// checkCorrect makes a contract message call to check if
// the current account owner has answered the question correctly.
func checkCorrect(session quiz.QuizSession) {
    win, err := session.CheckBoard()
    if err != nil {
        log.Printf("could not check leaderboard: %v\n", err)
        log.Println(ErrTransactionWait)
        return
    }
    fmt.Printf("Were you correct?: %v\n", win)
    return
}
```

Here, we write three helper functions to wrap our contract calls:

- `readQuestion(session quiz.QuizSession)` reads the question we stored on our deployed smart contract, and prints it out.
- `sendAnswer(session quiz.QuizSession, ans string)` takes an answer as a string, encodes it as a keccak256 hash, and sends it to the smart contract.
- `checkCorrect(session quiz.QuizSession)` checks if the current user is recorded on our smart contract as having sent a correct answer.

Now, we can call these functions in `main()` to interact with a deployed smart contract.

#### Write a simple CLI

Next, we'll write a bare-bones command-line interface (CLI) to allow our user to:

1.  Read the question.
2.  Send an answer.
3.  Check if their answer was correct.

To implement this, add the following to the bottom of the `main()` block:

```
// Loop to implement simple CLI
for {
    fmt.Printf(
        "Pick an option:\n" + "" +
            "1\. Show question.\n" +
            "2\. Send answer.\n" +
            "3\. Check if you answered correctly.\n" +
            "4\. Exit.\n",
    )

    // Reads a single UTF-8 character (rune)
    // from STDIN and switches to case.
    switch readStringStdin() {
    case '1':
        readQuestion(session)
        break
    case '2':
        fmt.Println("Type in your answer")
        sendAnswer(session, readStringStdin())
        break
    case '3':
        checkCorrect(session)
        break
    case '4':
        fmt.Println("Bye!")
        return
    default:
        fmt.Println("Invalid option. Please try again.")
        break
    }
}
```

Then, add the following helper function to the bottom of the `main.go` file:

```
// readStringStdin reads a string from STDIN and strips any trailing \n characters from it.
func readStringStdin() string {
    reader := bufio.NewReader(os.Stdin)
    inputVal, err := reader.ReadString('\n')
    if err != nil {
        log.Printf("invalid option: %v\n", err)
        return ""
    }

    output := strings.TrimSuffix(inputVal, "\n") // Important!
    return output
}
```

When we run the Go DApp with `go run main.go` in the terminal, `readStringStdin()` calls `bufio.NewReader(io.Stdin)`, which pauses the program and waits for the user to enter a value on the command line. It then takes that input, processes it, and returns it as a value that the Go application can use.

We implement the CLI using an infinite `for` loop that does the following:

1.  Prints out quick instructions for using the CLI.
2.  Enters a `switch` statement that reads from user input on the command line, and executes a given `case` for the appropriate `rune` it receives.
3.  When the user selects an option, the code for that `case` runs and returns to the top of the `for` loop when `break` is called.

### Running the application

Congrats! We've finished the quiz DApp!

Before testing the application, check that the `.env` file contains the values that the Go DApp needs to run. It should look something like this:

```
GATEWAY="https://rinkeby.infura.io/v3/<project_id>"
KEYSTORE="/keystore/UTC--2019-01-14T13-58-48.439126200Z--<ethereum_address>"
KEYSTOREPASS=""
QUESTION="this is a question"
ANSWER="this is the answer"
```

To run the Go DApp, enter in the terminal:

```
go run main.go
```

Alternatively, build and run the Go DApp by running:

```
go build main.go
./main
```

### Limitations

Our DApp is a simple example of what we can do with smart contracts and a Go DApp. Because we tried to keep the example straightforward, our DApp has a few limitations:

Our DApp doesn't know if a transaction is completed or not. That's why we need separate functions to send an answer to the blockchain, and another to check if the answer was correct. We can implement this by having a process listen to any events on the blockchain at our contract address, but this is outside the scope of this guide.

Our user can't just run the DApp, and it works. They need to specify a keystore file, and make sure that they have a deployed contract ready to interact with. We can correct this by adding to our CLI options that allow the user to enter values that configure these parameters.

Our DApp assumes that the user who runs it is the same person who (1) deploys the contract, and (2) answers the question. Ideally, the DApp that deploys the contract and the DApp that interacts with the contract should be separate.


---

- **Kauri original title:** Creating a DApp in Go with Geth
- **Kauri original link:** https://kauri.io/creating-a-dapp-in-go-with-geth/60a36c1b17d645939f63415218dc24f9/a
- **Kauri original author:** Zed (@zed)
- **Kauri original Publication date:** 2019-02-03
- **Kauri original tags:** Golang, Go-programming-language, DApp, Geth
- **Kauri original hash:** QmNwRw3MevQE5zb8fPYiDgg4y2nSfUbkDmW4X8sGZQKxv8
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



