---
title: Secret Rock, Paper, Scissors
summary: Demo and code for game using “secret state” on Ethereum and Enigma. At Enigma, we’re always exploring new applications for our protocol and “ secret contracts ” (smart contracts that preserve data privacy). Previously we’ve written about a number of different solutions , including credit , voting , and auctions . Today we’re excited to share our first look at how Enigma’s protocol can play into a very popular use case for decentralized applications- gaming. Games are an amazing vertical to explo
authors:
  - Ainsley Sutherland (@ainsleys)
date: 2019-01-30
some_url: 
---

# Secret Rock, Paper, Scissors

![](https://ipfs.infura.io/ipfs/QmdwD7k9aeEfDVZQkLQb662ZWmhzayrDQjfkQuWF3ArQEK)


 
_Demo and code for game using “secret state” on Ethereum and Enigma._
 

![](https://ipfs.infura.io/ipfs/QmX6aabfWEUxYYUrVzt6ta4RX3tpoT4xJDgBwk9b5n7f3y)

At Enigma, we’re always exploring new applications for our protocol and “ 
[secret contracts](https://blog.enigma.co/defining-secret-contracts-f40ddee67ef2)
 ” (smart contracts that preserve data privacy). Previously we’ve written about a number of different 
[solutions](https://blog.enigma.co/solutions/home)
 , including 
[credit](https://blog.enigma.co/decentralizing-credit-with-enigma-440c6648b4d8?source=collection_category---4------2---------------------)
 , 
[voting](https://blog.enigma.co/secret-voting-an-update-code-walkthrough-605e8635e725?source=collection_category---4------1---------------------)
 , and 
[auctions](https://blog.enigma.co/secret-auction-smart-contracts-with-enigma-a-walkthrough-ec27f89f9f7c?source=collection_category---4------2---------------------)
 . Today we’re excited to share our first look at how Enigma’s protocol can play into a very popular use case for decentralized applications: 
**gaming.**
 
Games are an amazing vertical to explore because of their diversity. They can range from hugely complex, in-world economy MMOs, to simple economic and luck-based games that can help test assumptions, provide instant feedback, and be fun for users at the same time. Examining simple games is a great way to take a closer look at the new technologies that can power them.
 
[Peter Phillips](https://github.com/PeterMPhillips)
 recently built an implementation of a traditional Rock, Paper, Scissors game for use with Enigma and Ethereum. 
[Go check it out!](https://github.com/PeterMPhillips/Enigma-Rock-Paper-Scissors/blob/master/contracts/RockPaperScissors.sol)
 We’ll describe how this game works, discuss some issues and future modifications (timing, winner selection), as well as suggest new applications that make use of the same basic concepts. In doing this, we’ll demonstrate how a core mechanic 
**(secret game state)**
 can be an important key to a wide range of applications.

### Rock, Paper, Scissors — Shoot!
Rock, Paper, Scissors (RPS) is a simple game for two people. If you’ve never played it, here’s how gameplay works.
Players have just one choice to make: to play Rock, Paper, or Scissors. Players simultaneously pick their object, make the sign associated with it (a fist, scissors from first two fingers, or a flat hand), and either Player 1 wins, Player 2 wins, or there is a draw. A winner is chosen in the following manner:



 * Rock beats Scissors

 * Scissors beats Paper

 * Paper beats Rock

 * If both players play the same object, the game is a draw
Most games are played as “best out of three” or “best out of five” rounds. This example shows only 
_one_
 round of play (there are additional challenges when requiring more rounds, which we will discuss later).

![](https://ipfs.infura.io/ipfs/QmbdKgJ3X9X9yPCchKLFF3HAsXVTZWXcuYQkqC56B7hT9H)


### User-flow for this demo:



 * Player 1 creates a game, picks a bet, and selects an object to play.

 * The UI is update to reflect an in-progress game that could be joined by a second player.

 * The second player selects a game, matches the bet (no option to raise), and selects her object.

 * After both participants have selected their object and placed their bets, the computation executes and compares selected objects to find the winner.

 * The winner is returned, and awarded the pot.

 * If there is no winner (a draw), bets are respectively returned

 * Users can withdraw their funds.

### Enigma-Specific Functions
For 
[secret contracts](https://blog.enigma.co/defining-secret-contracts-f40ddee67ef2)
 , we have functions called 
_callable_
 and 
_callback_
 . These are the functions that communicate directly with the Enigma network. (For a more in-depth discussion, see our 
[Getting Started](https://blog.enigma.co/getting-started-with-the-enigma-protocol-a-complete-developers-guide-170b7dfa5c0f)
 guide).

```
//Callable function
function calculateWinner(uint256 _gameID, address[] _players, string _move1, string _move2)
```


Here, the Callable function is 
`calculateWinner`
 which takes in encrypted values gameID, Players, move1, and move2. These values are encrypted client-side using the Enigma-JS client with the public key of the enclave.
 
`calculateWinner`
 evaluates the winner based on each player’s pick according to the rules of RPS. If play results in a draw, 
`address(0)`
 is returned which will initiate funds to be respectively returned to the players.

```
//callback function
function setWinner(uint256 _gameID, address _address)
```


This public function is called by the worker, a randomly selected node that executes computations in the Enigma network. Note that we expect the address returned by the callable (must be identically named, in this case 
`address`
 ).
Feel free to dig into the 
[well-commented code](https://github.com/PeterMPhillips/Enigma-Rock-Paper-Scissors/blob/master/contracts/RockPaperScissors.sol)
 (thumbs up to Peter) for more detail on this implementation.

<iframe allowfullscreen="" frameborder="0" height="300" scrolling="no" src="https://www.youtube.com/embed/1ojeU9bcJZs" width="512"></iframe>


### Comparisons and Reflections
We looked at a few other implementations of decentralized RPS for comparison. First, we looked at a 
[demo made for Raiden](https://github.com/cryptoplayerone/cryptobotwars)
 (which is awesome, more about it can be found 
[here](https://medium.com/@loredana.cirstea/cryptobotwars-part-2-conclusions-ebde6fa716f6)
 ). There are a few key differences between Peter’s “secret RPS” implementation and the Raiden rock-paper-scissors demo.
In Raiden,



 * Players pick a “player”, and then they pick a move. (for example, Darth Vader + Scissors). These are essentially “votes” for a particular move.

 * The hashed selection is sent along with a payment (using Raiden) to a “game guardian”.

 * A timer (drawn from the game server) is used to determine when the game ends.

 * When the game ends, the unencrypted data is submitted by the game guardian to the game server, where the winner is calculated and result is returned to the game guardian.

 * The game guardian instructs the Raiden nodes to distribute funds accordingly.
These choices are intended to 
[showcase Raiden’s payment channels](https://medium.com/@loredana.cirstea/cryptobotwars-or-how-to-build-shitty-demos-and-why-19b5ecf60c76)
 — hence the “voting” on an avatar and a choice rather than picking individual moves in a 1v1 game. However, in production this may leave such an approach open to sybil and whale manipulation. Peter’s implementation allows any player to start or join a specific game, rather than one all-encompassing game.
RPS could also be implemented in a straightforward smart contract on Ethereum, where the flow would be:



 * Players pick their moves, hash the move data and submit it to the contract.

 * After play is concluded, players reveal their hashed data
This design pattern, known as “commit-reveal”, is also used in voting to prevent vote-memeing. Unfortunately, it really slows down the pace of play. See 
[this cool example from 2+ years ago](https://np.reddit.com/r/ethereum/comments/4jkp2s/uncheatable_rps_with_crypted_hands_play_now_only/?st=jr81s96y&sh=d3dbd096)
 , which demonstrates some of the intricacies and drawbacks of such periodization, as well as 
[this more recent effort](https://www.reddit.com/r/ethereum/comments/990tfi/i_make_a_funny_dapp_that_can_play/)
 . Both of these saw limited usage due to usability — note in particular the 24 hr waiting period in the more recent example.
Two things come up from these examples: 
**timing**
 and 
**winner calculation**
 .

### Timing
In single-round play, we think Secret RPS has a distinct UX advantage over these other two implementations.
However, it would be awesome to enable best of 3 or best of 5 round-based play, letting users develop more complex strategies. Without the ability to tell time inside the secret contract (which our initial release lacks), this leaves Peter’s implementation open to the dropped-player problem across multiple rounds.
For example, say Alice and Bob are playing. Alice wins the first round, and Bob suddenly has his laptop with his private keys stolen. There’s no way for the game to “time out” and for Alice to retrieve her funds (or Bob for that matter. Sorry to do this to you Bob!). This is something we hope to address soon as it appears in multiple use-cases, especially for gaming. In a single-round (which is what the code is for right now), you can always play yourself to get the funds back if no counterparty accepts your game. This UX isn’t ideal, but adding a start time to the game struct, and then check for elapsed time in the 
`withdraw()`
 function would be straightforward to implement.

### Winner Calculation
In Secret RPS, the winner is calculated within the Enigma Node immediately when both players have made their respective moves. Users can withdraw their funds anytime after this occurs with the 
`withdraw()`
 function. This is in contrast to the “game guardian” in the Raiden example, where a server external to the network performs the computation and returns instruction to the Raiden nodes. For gaming implementations, this design may present both regulatory risk and other liabilities.

### Wrapping it up
Usability is incredibly important, and we’re really beginning to come to terms with that as a community. Looking at emerging projects like Veil, the proliferation of decentralized exchange relayers, 3box, and other usability layers, it’s clear that this has been a blind spot in dApp development so far. 
**What is really interesting to us here at Enigma is to what degree data privacy and scalability solutions can enable usability gains — and how Enigma specifically can contribute.**
 
We’re looking forward to building on what we’ve learned here from Peter’s implementation, and we’re also looking forward to moving this demo forward into production as we approach mainnet. We’re also excited about what other kinds of dApps can be built using similar mechanisms: poker, dice, on-chain CryptoKitty battles…
So, if:



 * You have ideas for how we can improve this implementation technically or edge-case questions

 * You’re a designer / front-end developer and want to work with us to improve these aspects

 * You have corrections to my interpretation of how these other implementations work

 * You want to build on these ideas to create even more games (Poker? Lottery?)
 
**Please, get in touch!**
 You can also post your thoughts on the Enigma Developers Forum.
> Many thanks to Loredana (Darth Vader / Robowars RPS) and reddit users ikirch and WhySoS3rious for their work on other RPS implementations that we were able to draw on for comparison. To be clear, we certainly are not criticizing these implementations, as the Raiden example is clearly intended to showcase Raiden, and the other two Ethereum-only samples work as intended with the tools available. However, they provide very useful foils as we unpack the different issues at play in even a simple RPS implementation.


![](https://ipfs.infura.io/ipfs/QmaQUr43FZ4YPZ1KhH3QZE3wPjaPdq6f7PJL8xG6L9eRGv)


#### Enigma is building the privacy layer for the decentralized web.
Come build and discover privacy-first applications and join our community!
 
**Learn more about the Enigma project**
 on our 
[website](http://enigma.co)
 and 
[blog](https://blog.enigma.co)
 .
**Want to build using our protocol?**
  
[Submit your interest here](https://airtable.com/shraD9Oo5HPmRR9eE)
_,_
[read our documentation](http://enigma.co/protocol)
_, or_
[join our developer forum](http://forum.enigma.co)

 



---

- **Kauri original title:** Secret Rock, Paper, Scissors
- **Kauri original link:** https://kauri.io/secret-rock-paper-scissors/468b49fcd2ef48feaada3a4399d0b2a6/a
- **Kauri original author:** Ainsley Sutherland (@ainsleys)
- **Kauri original Publication date:** 2019-01-30
- **Kauri original tags:** Ethereum
- **Kauri original hash:** QmP811S4h39chekN8uqsh5m6uZiH72H71CBYmcH8j1Svtw
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



