---
title: Interacting with smart contracts from GETH's Simulated Backend
summary: I am in the process of releasing my very hacky golang test environment that deep links into the go-ethereum code base. This is the next in the series.. Now you have a simulated ethereum network running it is time to see the EVM in action. GETH comes with a really useful tool to help you integrate your GO code with solidity smart contracts. Introducing ABIGEN ABIGEN creates a wrapper around your smart contract to help with most interactions that you could want to perform. I usually store my contr
authors:
  - Dave Appleton (@daveappleton)
date: 2019-09-14
some_url: 
---

I am in the process of releasing my very "hacky" golang test environment that deep links into the go-ethereum code base.

This is the next in the series.....

Now you have a simulated ethereum network running it is time to see the EVM in action.

GETH comes with a really useful tool to help you integrate your GO code with solidity smart contracts.

## Introducing ABIGEN

ABIGEN creates a wrapper around your smart contract to help with most interactions that you could want to perform.

I usually store my contracts in a sub folder with an appropriate name. 

In this case I am building a test for the Devcon 5 auction contract. I will place it in the `contracts` folder.

You can find the actual auction contract deployed here

https://etherscan.io/address/0x096bE08D7d1CaeEA6583eab6b75a0f5EaaB012a5#code

If we put that source code into `auction.sol` in the contracts folder you would create the wrapper with :

```
abigen --sol contracts/auction.sol --pkg contracts --out contracts/auction.go
```
 
The contract's name is `auction` so ABIGEN will have created a function called `DeployAuction`

You will notice the constructor needs some date parameters, an amount and a wallet address, lets create a helper function first.

``` go
func chkerr(err error) {
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}

// I like British dates !
func getTime(dateStr string) *big.Int {
    t, err := time.Parse("02/01/06", dateStr)
    chkerr(err)
    return big.NewInt(t.Unix())
}
```

now create the constructor variables

``` go
    startBids := getTime("13/09/19")
    endBids := getTime("15/09/19")
    startReveal := endBids
    endReveal := getTime("17/09/19")
    minimumBid, _ := etherUtils.StrToEther("4.7")
    wallet, _ := memorykeys.GetAddress("wallet")
```

and now deploy the contract...

``` go
    bankTx, _ := memorykeys.GetTransactor("banker")
    auctionAddress, tx, auctionContract, err := contracts.DeployAuction(bankTx, client, startBids, endBids, startReveal, endReveal minimumBid, *wallet)
    chkerr(err)
    fmt.Println(auctionAddress.Hex(), tx.Hash().Hex())
```

We need a bound transactor (see memorykeys post)
Then we send the transaction to deploy the contract returning

1. the address of the contract
2. a bound object to allow us to transact with it (once deployed)
3. the transaction object
4. an error object (as usual)

we can now cause that transaction to be mined

``` go
    client.Commit()
```

then we can call a method in the contract, let's check the minimum bid

``` go
    min, err := auctionContract.MinimumBid(nil)
    chkerr(err)
    fmt.Println("minumum bid is ", etherUtils.EtherToStr(min))
```



running testAuction.go we will get randomly assigned addresses but the minimum bid will be clearly seen to be 4.7

``` sh
$ go run testAuction.go
0x8095E4E397c8BEDffE7d2c8E3EaA30F646aab6dC 0x24fa2c113beab3eecf2129ef868e9121c3a7d8f7e084c6c66fbd10cb67b680a5
4.700000000000000000
```

## Bonus - Time in a bottle

The Devcon5 Auction contract is a time dependent contract. There are three phases:

1. Bidding Period
2. Reveal Period
3. Withdrawal Period

If we want to test such a contract we need to be able to speed the blockchain clock to arrive at some specific times.

### Getting the simulated blockchain's time

``` go
func currentTime() uint64 {
    client, err := getClient()
    chkerr(err)
    block := client.Blockchain().CurrentBlock()
    return block.Time()
}
```

### Jumping forward in time

My small contribution to the go-ethereum codebase is the `AdjustTime` function in the simulated back end.

``` go
func jumpTo(newTime *big.Int) {
    client, err := getClient()
    chkerr(err)
    now := client.Blockchain().CurrentBlock().Time()
    target := newTime.Uint64()
    if now >= target {
        return
    }
    err = client.AdjustTime(time.Duration(target-now) * time.Second)
    chkerr(err)
    client.Commit()
}
```

we can also create a function to report if bidding is open

``` go
func isBiddingOpen(auction *contracts.Auction) {
    biddingOpen, err := auction.InBidding(nil)
    chkerr(err)
    state := "IS NOT"
    if biddingOpen {
        state = "IS"
    }
    fmt.Println("Bidding", state, "open")
}
```

So this allows us to jump to the start of bidding for testing.

``` go
    fmt.Println("time:",currentTime())
    isBiddingOpen(auctionContract)
    jumpTo(startBids)
    fmt.Println("time:",currentTime())
    isBiddingOpen(auctionContract)
```

``` sh
$ go run testAuction.go
0x06cfB9BD9a3093603EFf47BC0679A729AF6a884c 0x0bf7dd3223934f955981816fda317e7fa6b669252c5a5695c71d3d82451b604f
minumum bid is  4.700000000000000000
time : 10
Bidding IS NOT open
time : 1568332810
Bidding IS open
```
## The complete code

``` go
package main

import (
    "fmt"
    "log"
    "math/big"
    "os"
    "time"

    "./contracts"

    "github.com/DaveAppleton/etherUtils"
    "github.com/DaveAppleton/memorykeys"
    "github.com/ethereum/go-ethereum/accounts/abi/bind/backends"
    "github.com/ethereum/go-ethereum/core"
)

var baseClient *backends.SimulatedBackend

func getClient() (client *backends.SimulatedBackend, err error) {
    if baseClient != nil {
        return baseClient, nil
    }
    funds, _ := etherUtils.StrToEther("10000.0")
    bankerAddress, err := memorykeys.GetAddress("banker")
    if err != nil {
        return nil, err
    }
    baseClient = backends.NewSimulatedBackend(core.GenesisAlloc{
        *bankerAddress: {Balance: funds},
    }, 8000000)
    return baseClient, nil
}

func chkerr(err error) {
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}

func getTime(dateStr string) *big.Int {
    t, err := time.Parse("02/01/06", dateStr)
    chkerr(err)
    return big.NewInt(t.Unix())
}

func currentTime() uint64 {
    client, err := getClient()
    chkerr(err)
    block := client.Blockchain().CurrentBlock()
    return block.Time()
}

func jumpTo(newTime *big.Int) {
    client, err := getClient()
    chkerr(err)
    now := client.Blockchain().CurrentBlock().Time()
    target := newTime.Uint64()
    if now >= target {
        return
    }
    err = client.AdjustTime(time.Duration(target-now) * time.Second)
    chkerr(err)
    client.Commit()
}

func isBiddingOpen(auction *contracts.Auction) {
    biddingOpen, err := auction.InBidding(nil)
    chkerr(err)
    state := "IS NOT"
    if biddingOpen {
        state = "IS"
    }
    fmt.Println("Bidding", state, "open")
}

func main() {
    client, err := getClient()
    if err != nil {
        log.Fatal(err)
    }
    startBids := getTime("13/09/19")
    endBids := getTime("15/09/19")
    startReveal := endBids
    endReveal := getTime("17/09/19")
    minimumBid, _ := etherUtils.StrToEther("4.7")
    wallet, _ := memorykeys.GetAddress("wallet")
    bankTx, _ := memorykeys.GetTransactor("banker")
    auctionAddress, tx, auctionContract, err := contracts.DeployAuction(bankTx, client, startBids, endBids, startReveal, endReveal, minimumBid, *wallet)
    chkerr(err)
    fmt.Println(auctionAddress.Hex(), tx.Hash().Hex())
    client.Commit()
    min, err := auctionContract.MinimumBid(nil)
    chkerr(err)
    fmt.Println("minumum bid is ", etherUtils.EtherToStr(min))
    fmt.Println("time :", currentTime())
    isBiddingOpen(auctionContract)
    jumpTo(startBids)
    fmt.Println("time :", currentTime())
    isBiddingOpen(auctionContract)
}

```
