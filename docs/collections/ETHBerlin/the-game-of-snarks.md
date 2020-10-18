---
title: The Game of Snarks
summary: Game of Snarks is a super cool demonstration of zkSNARKs and in fact one of the best applications to help regular users understand their power since the functionality was introduced to Ethereum in Byzantium. In short, Alex Vlasov came up with the idea to implement a game of “Battleship” (where each player has to guess the location of the other player’s ships on their respective grids) and used zkSNARKs to reveal whether a ship has been hit without fully revealing the state of the opposing player
authors:
  - Kauri Team (@kauri)
date: 2018-09-20
some_url: 
---

# The Game of Snarks


Game of Snarks is a super cool demonstration of zkSNARKs and in fact one of the best applications to help regular users understand their power since the functionality was introduced to Ethereum in Byzantium. In short, Alex Vlasov came up with the idea to implement a game of “Battleship” (where each player has to guess the location of the other player’s ships on their respective grids) and used zkSNARKs to reveal whether a ship has been hit without fully revealing the state of the opposing player’s board. Realizing that it would be hard to manage all of the state of the game on chain, Alex and his team also started work towards a “plasmafied” version of the game where a fraud-proof exists if the Plasma operator doesn’t update the state of the game (whether a battleship has been hit) properly. - Scott Moore (Gitcoin)

https://devpost.com/software/gameofsnarks_contracts

<div align="center"><iframe width="560" height="315" src="https://www.youtube.com/embed/undefined" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></div>

Initial snark prover/verifier, set of smart-contracts for game setup and fraud-proof, and a backend bridge for the game of SNARKs

#### Rationale
When the game will be "Plasmafied" there should exist a set of fraud-proof if Plasma operator does not correctly update the state of the game. In addition, challenges should be implemented if one of the players goes offline.

#### The game of SNARKs (and STARKs later)
HODL the door!

#### Description and rationale
During the ETHBerlin we've tried to make a good demonstration of the power of zkSNARKs by implementing a "Battleships" game where an interaction between the players is governed by the SNARKs. During the development we understood that it's actually is quite abstract two-party state-channel with some kind of a smart-contract inside. Keeping the state updates is expensive in the mainnet, so such interaction can be moved to Plasma, where the operator verifies SNARKs upon transaction submissions and updates a "state". Many people forget that Plasma was introduced not only as L2 solution for payments, but also as kind of map-reduce system.

Other repositories related to this work, developers were working in their own repos or reusing the current R&D code:

- Gadget lib for libsnark developed by the Matter Inc. is here. (test_branch branch)
- Smart-contracts that are for game setup and further fraud proofs from Plasma operator - here.
- Simple UI brought to you here.
- Backend assembled here (current repo).
- Limitations
- Due to a huge pain of building a libsnark anywhere but Linux this repo contains a binary assembled under Ubuntu16.04, that is called through the command line(!) from the Go backend. In principle Go backend is ready to verify proofs itself, it's just a matter of pain with proof serialization.

#### How to run
Keep in mind the limitations above!

- go get github.com/shamatar/go-snarks
- cd $GOPATH/src/github/shamatar/go-snarks
- go run -v ./main.go
- open your browser at http://127.0.0.1:8080/public/index.html
- place the ships. Right now limits are hardcoded - 4 ships 1x1, 3 ships 1x2, 2 ships 1x3, 1 ship 1x4
- if you made a mistake - reload a page
- if you have placed ships properly (in the right amounts and without adjustency) - click a "submit" button to send the position to the backend to make a proof of the correct positioning
- if you did make a mistake - you will see an error in a window below
- if your position was correct you will see a quasi-serialized proof. You can either click "verify" to verify it at the backend, or change one of the big numbers (not zeroes!) there and click "verify" and get a negative result - you have corrupted a proof and it's not longer valid
- right now commitment to the position is not produced, just the position in verified

That's all for now

#### Intended functionality
[x] zkSNARK that proves the correctness of position
[ ] produce a salted commitment to position (used further as a public input)
[x] create a smart-contract for players to start a game
[ ] make a zkSNARK for a state updates, that checks turns one by one
[ ] check whos turn it is now
[ ] check the signature of the current player (for shooting)
[ ] check that position under the commitment is correct
[ ] if there is a "hit" - update the corresponding score
[ ] keep the history of shots and don't allow duplicates
[ ] update the scores
[ ] have a win condition
[ ] bring further state updates to Plasma
[ ] implement fraud proofs
Much work to do!

#### Authors (team)
Alex Vlasov, shamatar

Konstantin Panarin, Konstantce

Artem Vorobyev, artall64

#### Try It Out
[GitHub Repo](https://github.com/shamatar/go-snarks)