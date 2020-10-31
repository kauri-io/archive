---
title: Devcon5 Osaka online ticket Auction
summary: The mechanics of the Devcon5 online auction The auction mechanism takes its inspiration from Nick Johnsons ENS 1.0 auctions When you submit a bid it is masked so that nobody can be quite certain of the size of your bid. It is only when bidding closes that you reveal the bid to the rest of the world. There are three phases Bidding phase (1 bid per address) Reveal phase Withdrawal phase Bidding Decide how much you want to bid (bid amount) Select a random mask phrase Perform a hash of the bid amoun
authors:
  - Dave Appleton (@daveappleton)
date: 2019-08-27
some_url: 
---

# Devcon5 Osaka online ticket Auction


## The mechanics of the Devcon5 online auction

The auction mechanism takes its inspiration from Nick Johnson's ENS 1.0 auctions

When you submit a bid it is masked so that nobody can be quite certain of the size of your bid. It is only when bidding closes that you reveal the bid to the rest of the world.

There are three phases

1. Bidding phase (1 bid per address)
2. Reveal phase
3. Withdrawal phase

### Bidding

1. Decide how much you want to bid (bid amount)
2. Select a _random_ mask phrase
3. Perform a hash of the bid amount and the mask phrase (hash value)
4. Send the hash value in a transaction to the auction contract. This transaction must have a value greater or equal to the bid amount (mask value)

At this point, people can see your mask amount but not your bid amount.

#### **WARNING** : BE SURE TO SAVE YOUR PHRASE AND BID AMOUNT ##

### Revealing

1) You reveal your bid by sending a 0 eth transaction to the reveal method of the contract supplying the mask phrase and the bid amount.

Now your bid can be seen by everybody but nobody can submit more bids

#### **WARNING**

#### IF YOU DO NOT REVEAL, or FORGET YOUR MASK DETAILS YOU WILL LOSE EVERYTHING ###

### Withdrawal

Once the winning amount has been announced, people can withdraw excess ether

- If you won, you can withdraw the difference between the mask amount and the bid amount
- If you revealed but were unsuccessful your entire mask amount can be withdrawn
- If you wait too long (after the end of the withdrawal period) you will not be able to withdraw either of the above

### What you pay if you win

You pay what you bid.

### If the winning amount is 10 ether and I bid 20 ether but Bob bid 15 ether?

See above. You pay 20 ether, Bob pays 15.
Thank you for your support.

### If the winning amount is 10 ether and a load of people have the same bid

1. Everybody who bid > winning amount gets a ticket
2. The remaining tickets are allocated on a first to reveal basis.

You can check the reveals by the `BidRevealed` event
```
   event BidRevealed(address bidder, uint256 bid);
```

### Web based bidding process

The entire process can be carried out at https://ethercards.devcon.org

#### Placing your bid

During the bidding period, if you have not previously placed a bid, you will be given a mask-phrase and asked for your bid amount. 

You can optionally modify the mask phrase before submission.



If you have already bid from this address you will be shown a screen telling you that you cannot bid. If you bid from this browser window you will be shown the phrase used and the bid amount (it is saved in local storage). We do not recommend relying on this - still save your phrase and bid amount.



#### Revealing your bid

During the reveal phase, you will be shown a field for the bid and another for the mask phrase. These will be filled from local storage if available. Accepting this will send the 0 ether transaction to reveal the bid.



And, of course if it has already been revealed.



#### Withdrawing your bid / the excess

After the reveal phase, a visit to the page will show if you have won or not and how much you can withdraw and a button to do so. Simply click the button.




### Accessing via alternative mechanism (e.g. MyCrypto / MEW / etherscan)

Once we announce the contract address, you will be able to see the address and get the contract's ABI

#### Checking the stage of the auction

The following events are generated to show the parameters

```
    event  MinimumBid(uint256 _minimumBid);

    event BiddingPeriod( uint256 startBids, uint256 endBids);
    event RevealPeriod( uint256 startReveal, uint256 endReveal);
    event WithdrawPeriod( uint256 startWithdraw, uint256 endWithdraw);

    event WinningAmount(uint256 winningAmount);

```

You can also call the following functions from etherscan's contract read page

```
    function inBidding() public view returns (bool) 
    function inReveal() public view returns (bool) {
    function inWithdraw() public view returns (bool) {
```

Did you win? 

```
    function isWinner(address check) public view returns(bool winner, bool inPeriod)
```
The first parameter tells you if you won
The second is true during the withdrawal period

#### Bidding

The safest way to generate the hash is to call the `calculateHash` function.

```
function calculateHash(uint256 _bid, bytes memory _randString) public pure returns (bytes32)
```

The submission takes place via

```
function biddingTime(bytes32 _hash) public payable
```

**NOTE**
We cannot check that your bid is less than your mask amount.
If `bid > mask amount` you will be unable to reveal, hence losing your ether

#### Revealing

```
function reveal(uint256 _bid, bytes memory randString) public
```

#### Withdrawing

```
function withdrawRefund() public
```



---

- **Kauri original title:** Devcon5 Osaka online ticket Auction
- **Kauri original link:** https://kauri.io/devcon5-osaka-online-ticket-auction/c26a5fcda75c4b35bbee651ae2beed98/a
- **Kauri original author:** Dave Appleton (@daveappleton)
- **Kauri original Publication date:** 2019-08-27
- **Kauri original tags:** smart-contract, ethereum, devcon, defi, devcon5
- **Kauri original hash:** QmbVqLaLnFa4tSiehSvBUY82jkCsDLJksLaw2T7AQDTH1G
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



