---
title: Sending Ethereum Transactions with Rust
summary: This tutorial walks you through the code required to send an Ethereum transaction within a Rust application. Prerequisites We assume that you already have a Rust IDE available, and have a reasonable knowledge of Rust programming. We also assumes some basic knowledge of Ethereum and do not cover concepts such as the contents of an Ethereum transaction. For more on any of these subjects, read the following  Getting started with Rust Ethereum 101 Libraries Used This tutorial uses the MIT licensed r
authors:
  - Craig Williams (@craig)
date: 2019-08-30
some_url: 
---

This tutorial walks you through the code required to send an Ethereum transaction within a Rust application.

## Prerequisites

We assume that you already have a Rust IDE available, and have a reasonable knowledge of Rust programming. We also assumes some basic knowledge of Ethereum and do not cover concepts such as the contents of an Ethereum transaction.

For more on any of these subjects, read the following:

-   [Getting started with Rust](https://www.rust-lang.org/learn/get-started)
-   [Ethereum 101](https://kauri.io/collection/5bb65f0f4f34080001731dc2/ethereum-101)

## Libraries Used

This tutorial uses the MIT licensed rust-web3 library. To use this library in your application, add it to the `Cargo.toml` file:

```toml
[dependencies]
web3 = { git = "https://github.com/tomusdrw/rust-web3" }
```

You can then add the library to your crate:

```rust
extern crate web3;
```

## Starting an Ethereum Node

We need access to a node that we can send transactions to.  In this tutorial we use `ganache-cli`, which allows you to  start a personal Ethereum network, with a number of unlocked and funded accounts.

Taken from the `ganache-cli` [installation documentation](https://github.com/trufflesuite/ganache-cli#installation), to install with npm, use the command:

```shell
npm install -g ganache-cli
```

or if you prefer to use Yarn:

```shell
yarn global add ganache-cli
```

Once installed, run the command below to start a private Ethereum test network:

```shell
ganache-cli -d
```

**Note**: The `-d` argument instructs `ganache-cli` to always start with the same accounts pre-populated with ETH.  This is useful in the _Raw Transaction_ section of this tutorial as we will know the private keys of these accounts.

## Sending a Transaction from a Node-Managed Account

The easiest way to send a transaction is to rely on the connected Ethereum node to perform the transaction signing.  This is generally a less secure approach, as it relies on the account being "unlocked" on the node.

### Required `Use` Declarations

```rust
use web3::futures::Future;
use web3::types::{TransactionRequest, U256};
```

### Connecting to the Node

```rust
let (_eloop, transport) = web3::transports::Http::new("http://localhost:8545").unwrap();

let web3 = web3::Web3::new(transport);
```

First we create a transport object used to connect to the node. In this example we connect via `http`, to `localhost` on port `8545`, which is the default port for Ganache, and most, if not all Ethereum clients.

**Note:** An [EventLoop](https://tomusdrw.github.io/rust-web3/web3/transports/struct.EventLoopHandle.html) is also returned, but that is out of the scope of this guide.

Next we construct a web3 object, passing in the previously created transport variable, and that's it!  We have now have a connection to the Ethereum node!

### Obtaining Account Details

Ganache-cli automatically unlocks a number of accounts and funds them with 100ETH, which is useful for testing.  The accounts differ on every restart, so we need a way to programmatically get the account information:

```rust
let accounts = web3.eth().accounts().wait().unwrap();
```

The [Eth namespace](https://tomusdrw.github.io/rust-web3/web3/api/struct.Eth.html), obtained via `web3.eth()` contains many useful functions for interacting with the Ethereum node.  Obtaining a list of managed accounts via `accounts()` is one of them.  It returns an asynchronous future, so we wait for the task to complete (`wait()`), and get the result (`unwrap()`).

### Sending the Transaction

We define the parameters of the transaction to send via a `TransactionRequest` structure:

```rust
let tx = TransactionRequest {
        from: accounts[0],
        to: Some(accounts[1]),
        gas: None,
        gas_price: None,
        value: Some(U256::from(10000)),
        data: None,
        nonce: None,
        condition: None
    };
```

Most of the fields within this struct are optional, with sensible default values used if not manually specified.  As we are sending a simple ETH transfer transaction, the data field is empty, and in this example we use the default `gas` and `gas_price` values.  We also do not specify a `nonce`, as the `rust-web3` library queries the Ethereum client for the latest nonce value by default.  The `condition` is a `rust-web3` specific field and allows you to delay sending the transaction until meeting a certain condition, such as reaching a specific block number for example.

Once the `TransactionRequest` is initiated, it's a one-liner to send the transaction:

```rust
let tx_hash = web3.eth().send_transaction(tx).wait().unwrap();
```

The `TransactionRequest` is passed to the `send_transaction(..)` function within the `Eth` namespace, which returns a `Future` that completes once the transaction has been broadcast to the network.  On completion, the `Promise` returns the transaction hash `Result`, which we can then unwrap.

### Putting it all Together...

```rust
extern crate web3;

use web3::futures::Future;
use web3::types::{TransactionRequest, U256};

fn main() {
    let (_eloop, transport) = web3::transports::Http::new("http://localhost:8545").unwrap();

    let web3 = web3::Web3::new(transport);
    let accounts = web3.eth().accounts().wait().unwrap();

    let balance_before = web3.eth().balance(accounts[1], None).wait().unwrap();

    let tx = TransactionRequest {
        from: accounts[0],
        to: Some(accounts[1]),
        gas: None,
        gas_price: None,
        value: Some(U256::from(10000)),
        data: None,
        nonce: None,
        condition: None
    };

    let tx_hash = web3.eth().send_transaction(tx).wait().unwrap();

    let balance_after = web3.eth().balance(accounts[1], None).wait().unwrap();

    println!("TX Hash: {:?}", tx_hash);
    println!("Balance before: {}", balance_before);
    println!("Balance after: {}", balance_after);
}
```

We use the `web3.eth().balance(..)` function to obtain the balance of the recipient account before and after the transfer to prove that the transfer occured.  Run this code, and you should see that the `accounts[1]` balance is 10000 wei greater after the transaction was sent… a successful ether transfer!

## Sending a Raw Transaction

Sending a raw transaction means signing a transaction with a private key on the Rust side, rather than on the node.  The node then forwards this transactions to the Ethereum network.

The [ethereum-tx-sign](https://github.com/synlestidae/ethereum-tx-sign) library can help us with this off-chain signing, but it not easy to use alongside `rust-web3` because of a lack of shared structs.  In this section of the guide I'll explain getting these libraries to play nicely together.

### Additional Libraries Used

The `ethereum-tx-sign` library depends on the `ethereum-types` library when constructing a `RawTransaction`.  We also use the `hex` library to convert a hexadecimal private key into bytes.

Add these entries to your `cargo.toml` file:

```toml
ethereum-tx-sign = "0.0.2"
ethereum-types = "0.4"
hex = "0.3.1"
```

You can then add them to your crate:

```rust
extern crate ethereum_tx_sign;
extern crate ethereum_types;
extern crate hex;
```

### Signing the Transaction

The `ethereum_tx_sign` libraries contain a `RawTransaction` struct that we can use to sign an Ethereum transaction once initialized.  It's the initialization that's the tricky part, as we need to convert between the `rust-web3` and `ethereum_types` structs.

Some conversion functions can convert H160 (for Ethereum account addresses) and U256 (for the nonce value) structs from the `web3::types` returned by `rust-web3` functions to the`ethereum_types` expected by `ethereum-tx-sign`:

```rust
fn convert_u256(value: web3::types::U256) -> U256 {
    let web3::types::U256(ref arr) = value;
    let mut ret = [0; 4];
    ret[0] = arr[0];
    ret[1] = arr[1];
    U256(ret)
}

fn convert_account(value: web3::types::H160) -> H160 {
    let ret = H160::from(value.0);
    ret
}
```

We can now construct a `RawTransaction` object (replace the code beneath `let balance_before`):

```rust
let nonce = web3.eth().transaction_count(accounts[0], None).wait().unwrap();

let tx = RawTransaction {
    nonce: convert_u256(nonce),
    to: Some(convert_account(accounts[1])),
    value: U256::from(10000),
    gas_price: U256::from(1000000000),
    gas: U256::from(21000),
    data: Vec::new()
};
```

Note that the `nonce` is not automatically calculated when constructing a `RawTransaction`.  We need to get the nonce for the sending account by calling the `transaction_count` function in the `Eth` namespace.  This value subsequently needs to be converted, to be in the format that `RawTransaction` expects.

Unlike in the `TransactionRequest` struct, we must also provide some sensible `gas` and `gas_price` values manually.

#### Obtaining a Private Key

Before signing, we need to have access to a private key that is used to sign.  In this example we hard code the private key of the first ETH populated account in `ganache` (remember to start with the `-d` argument).  This is ok for testing, but **you should never expose a private key in a production environment!**

```rust
fn get_private_key() -> H256 {
    // Remember to change the below
    let private_key = hex::decode(
        "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d").unwrap();

    return H256(to_array(private_key.as_slice()));
}

fn to_array(bytes: &[u8]) -> [u8; 32] {
    let mut array = [0; 32];
    let bytes = &bytes[..array.len()];
    array.copy_from_slice(bytes);
    array
}
```

The `hex:decode` function converts a hexadecimal string (make sure to remove the `0x` prefix) into a `Vec<u8>` but the `sign` function of `RawTransction` takes a private key in `ethereum_types::H256` format.  Unfortunately, the `H256` takes a `[u8; 32]` rather than a `Vec<T>` during construction so we need to do another conversion!

The private key is passed to `to_array` as a slice, and this slice is then converted to a `[u8: 32]`.

#### Signing

Now that we have a function that returns a private key in the correct format, we can sign the transaction by calling:

```rust
let signed_tx = tx.sign(&get_private_key());
```

### Sending the Transaction

After signing, broadcasting the transaction to the Ethereum network is also a one-liner:

```rust
let tx_hash = web3.eth().send_raw_transaction(Bytes::from(signed_tx)).wait().unwrap()
```

Note, we have to perform another conversion here!  The `send_raw_transaction` takes a `Bytes` value as the argument, whereas the `sign` function of `RawTransaction` returns a `Vec<u8>`.  Luckily, this conversion is easy as the `Bytes` struct has a `From` trait out of the box to convert from a `Vec<u8>`.

Like the `send_transaction` equivalent, this function returns a `Future`, which in turn returns a `Result` object containing the transaction hash of the broadcast transaction on completion.

### Putting it all Together

```rust
extern crate web3;
extern crate ethereum_tx_sign;
extern crate ethereum_types;
extern crate hex;

use web3::futures::Future;
use web3::types::Bytes;
use ethereum_tx_sign::RawTransaction;
use ethereum_types::{H160,H256,U256};

fn main() {
    let (_eloop, transport) = web3::transports::Http::new("http://localhost:8545").unwrap();

    let web3 = web3::Web3::new(transport);
    let accounts = web3.eth().accounts().wait().unwrap();

    let balance_before = web3.eth().balance(accounts[1], None).wait().unwrap();

    let nonce = web3.eth().transaction_count(accounts[0], None).wait().unwrap();

    let tx = RawTransaction {
        nonce: convert_u256(nonce),
        to: Some(convert_account(accounts[1])),
        value: U256::from(10000),
        gas_price: U256::from(1000000000),
        gas: U256::from(21000),
        data: Vec::new()
    };

    let signed_tx = tx.sign(&get_private_key());

    let tx_hash = web3.eth().send_raw_transaction(Bytes::from(signed_tx)).wait().unwrap();

    let balance_after = web3.eth().balance(accounts[1], None).wait().unwrap();

    println!("TX Hash: {:?}", tx_hash);
    println!("Balance before: {}", balance_before);
    println!("Balance after: {}", balance_after);
}

fn get_private_key() -> H256 {
    let private_key = hex::decode(
        "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d").unwrap();

    return H256(to_array(private_key.as_slice()));
}

fn convert_u256(value: web3::types::U256) -> U256 {
    let web3::types::U256(ref arr) = value;
    let mut ret = [0; 4];
    ret[0] = arr[0];
    ret[1] = arr[1];
    U256(ret)
}

fn convert_account(value: web3::types::H160) -> H160 {
    let ret = H160::from(value.0);
    ret
}

fn to_array(bytes: &[u8]) -> [u8; 32] {
    let mut array = [0; 32];
    let bytes = &bytes[..array.len()];
    array.copy_from_slice(bytes);
    array
}
```

## Summary

In this tutorial we learned how to send a basic Ether value transfer transaction from one account to another using Rust.  We explained two signing approaches: signing on a node by an unlocked account, and signing a transaction on the Rust side.

The full source code covered in this guide is available on GitHub [here](https://github.com/craigwilliams84/rust-ethereum/).

This is just scratching the surface of Ethereum transaction sending, and in a future tutorial I will walk you through sending transactions that manipulate data within an Ethereum smart contract.  Watch this space!