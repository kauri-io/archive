---
title:  Ether Cards spreads its wings
summary: Two or three years ago Nick Johnson, an ethereum core developer, launched Ether Cards as a simple way of onboarding people to ethereum. Credit card sized with displayable addresses and a scratch off area to hold a key phrase, Ether Cards were quickly supported by sites like MyEtherWallet and MyCrypto. By mid 2018 Ether Cards was proving useful at hackathons and conferences allowing tokens to be given out to test dApps like at Dappcon 2018 where Gnosis distributed OWL tokens for a competition bas
authors:
  - Dave Appleton (@daveappleton)
date: 2019-09-30
some_url: 
---

#  Ether Cards spreads its wings



Two or three years ago Nick Johnson, an ethereum core developer, launched Ether Cards as a simple way of onboarding people to ethereum.

Credit card sized with displayable addresses and a scratch off area to hold a key phrase, Ether Cards were quickly supported by sites like MyEtherWallet and MyCrypto.

By mid 2018 Ether Cards was proving useful at hackathons and conferences allowing tokens to be given out to test dApps like at Dappcon 2018 where Gnosis distributed OWL tokens for a competition based on their prediction market.

It was about this time that Nick's Ethereum Name Service work started getting more demanding and he was open to passing on the business to a Singapore based consultancy Akomba Labs who had a vision to grow Ether Cards from its initial mission to introduce a wider range of people to the ethereum ecosystem.

Pretty soon we were talking to Austin Griffith to create cards to introduce Burner Wallets at events resulting in the Ethereal Summit using Ether Cards and Burner Wallets to prototype food payments.

At the same time, Ether Cards got accepted into Tachyon II to help us refine our new direction. We had a couple of directions that we wanted to pursue, ticketing and monitising collectibles. We started refining our plans to enter the collectibles market.

### Collectibles

Just before we entered Tachyon, we had been approached by the manufacturer of a range of collectable figurines to see how we could enhance the value of their products. With the help of Kavita, her colleagues and some Consensys members we were introduced to, we started to refine both what we wanted to do and the mechanisms behind it.

We developed a mechanism whereby each collectible could not only prove its authenticity but also allow the creator of the item to benefit from the secondary market. You can check out our pitch from Consensys Demo Day [here](https://www.youtube.com/watch?v=ALuEGQ6rpxU).

We are working with state of the art secure NFC tag technology to develop the new generation of ether tags that we will be launching shortly.

### Ticketing

Meanwhile we still had our plans for ticketing which we started discussing with the ethereum foundation in the context of providing a better ticketing experience for Devcon. The last couple of years had convinced everybody that we needed to improve the way that tickets were allocated but nobody wanted to risk the entire ticket distribution to an untested  distribution method.

The Devcon team were insanely busy planning all aspects of the conference. They decided that after the third wave, a few tickets would be allocated for distribution via two of the proposed allocation methods, a raffle and an auction.

#### The Raffle

One hundred tickets were allocated to the raffle, each address could submit multiple fixed price entries and unsuccessful entries were refundable. To disincentivise people bidding for more tickets than they needed, a small donation would be taken from unsuccessful entries on claiming the refund.

A large random array was created to determine the order in which winners could be selected and a hash of that array was embedded into the contract to ensure that we could prove that the array had not been modified since the raffle started.

Once the raffle was over, the winning results were fed into the contract to determine the winners. With most people already having obtained tickets via the three waves, there were only 52 entries so they were all successful.

The contribution was to incentivise ETH rich people to use the auction rather than submitting a ton of bids in just to ensure that they had a single ticket.

#### The Auction

Fifty tickets were available for auction at the following rules :

1. There was a minimum bid of 4.7 ETH
2. There were 50 tickets available
3. During the bidding period you sent the hash of your bid and a random phrase accompanied by a masking amount that had to be greater than or equal to your bid
4. During the reveal period, you sent your bid amount and the phrase that you used during the bidding
5. After the reveal period, the top 50 bids would win tickets
6. In the event of a tie those bids that revealed first would win
7. Winners could withdraw any difference between the bid amount and the masking amount. Everybody else could withdraw what they had deposited.

The method chosen was borrowed from the ENS auction process and aimed to allow people's bids to be confidential until it was too late to overbid them. It was also intended to prevent a bidding war.

#### The Tickets

Winners of both the raffle and the auction received NFT tickets that could be transferred and redeemed. Redemption was by signing the NFT's URI tag. This message was passed to the backend which redeemed the NFT and revealed a voucher code that could be used inside the Devcon ticketing system.

The entire process was run by web3 enabled pages which allowed you to obtain your tickets and redeem them using Metamask or your favourite web3 enabled mobile wallet.

#### Conclusion

Despite a few minor hiccups (issues resolved and lessons learnt) the process went off pretty well. We learned a lot from the experience this year and hope that we will given the opportunity to offer an improved service next year hopefully as the main way of applying for tickets.

### Conclusion

As we come to the first anniversary of taking over the reins, we have started work on the new road map and have a capable team in place to bring it to fruition.

We are open to exploring partnerships with any synergistic parties who, like us, believe that co-operation leads to greater benefits to all.

----
https://ether.cards

https://twitter.com/ether_cards