---
title: Updating and Testing a Raffle Contract
summary: Over on the Bitfalls website there’s a couple of great tutorials*(1)* for learning Solidity and Ethereum. The tutorials guide readers through the making of a Raffle. Now, the code is not meant to be bullet proof, but as a software tester by day the ‘gaps’ piqued my interest. In this post I’m going to do two things; firstly provide a few updates to the code readers pointed out or that have become the more current way of doing things since Solidity version updates and secondly, to execute the code
authors:
  - Mark Crowther (@mark-crowther)
date: 2019-06-27
some_url: 
---

# Updating and Testing a Raffle Contract


Over on the Bitfalls website there’s a couple of great tutorials*(1)* for learning Solidity and Ethereum. The tutorials guide readers through the making of a Raffle. Now, the code is not meant to be bullet proof, but as a software tester by day the ‘gaps’ piqued my interest.

In this post I’m going to do two things; firstly provide a few updates to the code readers pointed out or that have become the more current way of doing things since Solidity version updates and secondly, to execute the code in the online tool, Remix, so we can see how it actually runs.

Naturally, the below makes more sense if you’ve either worked through the tutorials, will do or have just grabbed the code. Let’s crack on.

 ## Code Updates
Firstly, let’s look at what needs a refresh since Bruno wrote the original articles. Open up the ```Blocksplit.sol``` file you’ve been working on. You can always get the completed script from their [GitHub repository](https://bitfalls.com/70c2).

Review the code for the ```randomGen()``` function from the [last tuorial]( https://bitfalls.com/2018/04/05/solidity-development-crash-course-finishing-raffle-project/):

```Solidity
    function randomGen() constant internal returns (uint256 randomNumber) {
        uint256 seed = uint256(block.blockhash(block.number - 200));
        return(uint256(keccak256(block.blockhash(block.number-1), seed )) % players.length);
    }
```
In here we can see the ```… block.blockhash(block.number …``` construct, this needs to be changed to read ```… blockhash(block.number …```.

Additionally, the last line of the ```randomGen()``` function should be changed to use ```abi.encodePacked`` and the trailing space after *seed* removed. It will look like this:

```Solidity
return(uint256(keccak256(abi.encodePacked(blockhash(block.number-1), seed))) % players.length);
```
This will give a final code block for the ```randomGen()``` function of:

```Solidity
    function randomGen() internal view returns (uint256 randomNumber) {
        uint256 seed = uint256(blockhash(block.number - 200));
        return(uint256(keccak256(abi.encodePacked(blockhash(block.number-1), seed))) % players.length);
    }
```
One final change just so we don’t lose any test Ether is to change the ```address public charity``` to be one of your test accounts, make it the one you deploy the contract under. Account set-up is discussed next.

```address public charity = put-the-full-address-here-for-your-test-acccount;```

One last thing is to change the [‘Unix epoch’ time](https://tldrify.com/ujh) in the `draw()` function to something in the near past if it’s very current. 

### Set-up the Testing Environment
There’s a few things we need to have in place to test this contract effectively:
- MetaMask
- Three Ethereum Accounts
- Remix open in a browser window
- The updated contract code ready to deploy

Make sure the MetaMask browser extension is running in either of Brave*(2)* or Chrome.

We’ll need to have three Ethereum accounts available to us via MetaMask – one to act as the contract owner and two additional ones to act as the players. If you’ve not done so, read the Bitfalls [MetaMask article](https://bitfalls.com/2018/02/16/metamask-send-receive-ether/) that explains how to set up MetaMask and add accounts. You’ll need to [get some free Ether from one of the faucet sites](https://tldrify.com/uj6) in order to play the raffle.

Remix is a free browser-based IDE for writing smart contracts in Solidity, then compiling and deploying them. It’s available at [https://remix.ethereum.org/](https://remix.ethereum.org/).

### Compile and Execute the Contract Code
The Remix UI was updated mid 2019 so may have a different look compared to other tutorials you’ve worked through - be sure to select ‘Solidity’ under the Environments section of the Home page before you start.

To the top-left, change the Compiler version to read ```0.4.26+commit.4563``` as from version 0.5.0 there were breaking changes to the Solidity codebase. This is also above the 0.4.20 compiler version we stated in the contract code, so the code will compile just fine.

![Choose the Solidity environment and Compiler version](https://api.kauri.io:443/ipfs/QmYAyGgbR1BRn4m9Zoz5C1XnXNZFqFqKfAw6yqKn6oiPiH)

In Remix, click on the ‘File explorers’ icon, create a new file and call it `Blocksplit.sol`, then paste the updated contract code into the file and save it. 

![Create a new file for the contract code](https://api.kauri.io:443/ipfs/QmT6WoJnxpp3LiHoTqDq5L4tKyp1tGgWihn2VXFhi5AhFP)

Now click on the ‘Solidity compiler’ icon and hit ‘Compile Blocksplit.sol’

![Compile the contract code](https://api.kauri.io:443/ipfs/QmNhYhhLneoMxypHH4vbuxiMMBwwakExUSopi72Y5UWibu)

Finally, click the ‘Deploy & Run Transactions’ icon, we’ll use this tab to deploy and test our contract. We’ll deploy to the Ropsten test network and to do so we need to change a few things before we hit Deploy.

- In the ‘Environment’ field select `Injected Web3` from the dropdown
- In MetaMask, switch to the ‘Ropsten Test Network’
- Also in MetaMask, select the account you have chosen as the contract owner account

Now hit the orange ‘deploy’ button to deploy the contract to Ropsten, accepting the MetaMask transaction window when it pops-up. This is charging the cost of writing to the blockchain.

![Deploy the contract to Ropsten](https://api.kauri.io:443/ipfs/QmUxxmKgkgzmsi12hVT9t1q4zoJ2Ry4CVVvUrZTAuVS5M9)

### Check the Deployed Contract and Interface
Now we’ve deployed the contract we’ll have a set of buttons that provide an interface to the contract elements, shown under ‘Deployed Contracts’. Click the arrow next to the contract name to show the set of buttons that give us an interface to the contract.

![View the contract elements](https://api.kauri.io:443/ipfs/QmQv3Bb3JvR7FQWpfwurNcoVENQYFXhJsZVVbd6dphK5ET)

Next to the contract name is also the contract address that can be copied and searched for on [Etherscan against the Ropsten network](https://ropsten.etherscan.io). Copy the address shown and look up the Etherscan record. Between Etherscan and MetaMask we can readily see how the transaction details match up.

![Matching transaction details](https://api.kauri.io:443/ipfs/QmP9dSP56KVwA8kQfMFbNYkfn9pw45KsVCtEyhy5zJEDFu)

We can see that the ‘From’ address, Contract Creator address and the address we used in MetaMask all match. This shows us how organisations can deploy a contract, then use the `msg.sender = owner` code pattern to assign the ability to perform certain actions only to a given address; in this case the one that deployed the contract.

As a reminder, blue buttons read data and so are free of Gas, whereas orange buttons write data to the blockchain and so will cost us Gas.

Click on the blue ‘charity’ button and you’ll see a) no MetaMask window as we don’t need to pay anything and b) the address we assigned to the `address public charity` variable. 

Note the contract value is showing as ‘0 Ether’ as no raffle monies have been transacted yet.

### Play the Raffle
Ordinarily, the public raffle elements we can get to would be wrapped in a Web3.js enabled webpage, using the ABI file, to give us a smart interface. However, for testing, the Remix interface is good enough.

#### Player One Plays
To play we need to switch to an alternate account in MetaMask, so we’re acting like the raffle’s *Player One* and not the owner. Open MetaMask and switch accounts now, that same account will be shown in Remix in the ‘Account’ field.

- in the ‘Value’ field enter *0.1* and make sure ‘ether’ is selected
- in the field next to the ‘play’ button, paste the address you’re using as Player One
- hit the ‘play’ button and accept the MetaMask prompt to pay the fee plus gas 

After a few seconds MetaMask will bring up a prompt stating the transaction went through. If we check the contract again on Etherscan, we’ll see it now has a second transaction worth 0.1 ETH from the address we’re using for Player One.

![Player One Played](https://api.kauri.io:443/ipfs/QmP63d3Mqkazwcnma1ak2BrDsRjtm9Qp9gJsj2CUu3z3fL)

If you now enter `0` in the field next to ‘players’ it will return the address of Player One. This is because we declared `address[] public players;` at the start of our contract then ` players.push(_participant);` in the `play()` function - which takes an address (as we tested above), then pushes it onto the `players` array.

#### A Quick Sanity Test
Something we can test now is clicking on the ‘draw’ button. The code here is that we can only run a draw if the number of winners is less than 2: `require (winners.length < 2, "");`. This is interesting as when we click ‘draw’ now it should work and indeed it does. If we enter `0` in the field next to the ‘winners’ button it will return the address of Player One.

It may be that we should change this code in two ways:
- Change `draw()` to Require the `msg.sender` to be the owner of the contract so not just anyone can call the function
- Set a Require of `players.length == 2` to ensure two players are needed for a draw to happen

#### Player Two Plays
To play a second player is just like playing the first. Switch accounts, set the value to 0.1 ETH, add your Player 2 address into the ‘play’ field and hit ‘play’ as before.

Now in Etherscan we can see:
- two transactions of 0.1 ETH which are the raffle ‘plays’
- one transaction between these that are the possibly unwanted pressing of ‘draw’ by a player

![Two Plays and one Draw](https://api.kauri.io:443/ipfs/QmbQdQnAHCS1p5G4i8NRdGHKbUH5s4UpPbdeHZNmcCSMon)

Both of the above can be proven using Etherscan’s logs:
- Click on the ‘Txn hash’ for the draw (0 ETH transaction)
- At the bottom of the page that opens, click on ‘Click to see More’
- Under ‘Input Data’ check to see it says ‘Function: draw() ***’

![Draw made by Player One](https://api.kauri.io:443/ipfs/QmSaSdL1gpVfGrwVuGWzwTqz5V3KUovxP7eP2RjGLwqsNN)

Repeat the steps above to check one of the Plays made by either player.

![Play made by a Player](https://api.kauri.io:443/ipfs/QmUtWb2tQoAmh8w1vEGYWMWV7sNoUVnPDezUSGiEKwC4D4)

However, we may have another potential issue. In the `draw()` function we have the line of `players.length--;` which with the line of code above it is a way to remove the winner from the list of players (so they don’t become winner number 2 as well as winner number 1, fair enough). We can test this too by entering a `0` or a `1` in the field next to ‘players’ and seeing what’s returned. We expect two player’s addresses but for index `1` we should get ‘0x0000000000000…’ which tells us Player One got removed from the `players[]` array (because when I tested, Player One won. It may be Player Two for you). OK, the code works, but the change suggested above might prevent this if we feel it’s an issue.

As we have clause in `draw()` that won’t allow us to send any ETH balance off to the charity address until `winners.length == 2` we need another player to win. As it happens, we can just hit `draw()` again and watch our remaining player win. 

### Re-draw and Contract Payout
Go ahead and hit `draw()` for a second time, then refresh the Etherscan page for your contract. You’ll eventually see a new 0 ETH transaction for the second draw and the contract value is now 0 ETH.

That proves the ` charity.transfer(address(this).balance);` line in `draw()` must have worked – but where’s the transaction?

![End of the test run](https://api.kauri.io:443/ipfs/QmNqvj5U3E5HqZ9yAJYgEJPshKKb3EELXm3A37B9qqMqXF)

You’ll notice there’s a new tab in Etherscan called ‘Internal Txns’, our `transfer` of 0.2 ETH is recorded in there as it occurs as part of the code in the function, not a call from outside. The balance is sent to the address that was defined under the `charity` variable.

![Transfer of balance to contract owner](https://api.kauri.io:443/ipfs/QmTCt13MnMgZj6whCmR2THuW5tyHUMdw6BJkibjkWTfs45)

### Conclusion
We’ve seen that at every step of the way we can control how the contract is deployed, deploy it to a non-live blockchain such as the Ropsten Testnet, then carefully test out the contract functionality. Remix and Etherscan combined provide us with a host of features and information to allow us to test our code and check the results.

There are more tests we could add, but the core features have been checked here. We’ve also discovered there are some (expected) weaknesses in the code that could be fixed up. Overall, a good couple of tutorials and a great way to learn more about Solidity and Smart Contract development.

_Until next time!_

Mark

------------------------


**References**

1) Tutorials: https://bitfalls.com/2018/03/31/solidity-development-crash-course-building-blockchain-raffle/ and https://bitfalls.com/2018/04/05/solidity-development-crash-course-finishing-raffle-project/

2) Brave Browser: https://brave.com/CYR315 (referral link)

