---
title: dAppraise - Utilizing Non-Fungible Collateral For Loans
summary: dAppraise A protocol for reducing the level of overcollateralization necessary for sufficient backing of loans, stablecoins, and other cryptofinancial markets. Fundamental Modern Portfolio Theory Diversification into uncorrelated assets or assets with lower levels of correlation increases Sharpe ratio, essentially boosting the potentially reward per amount risk (variance in outcomes). In stablecoins, loans, and other financial functions, trust is often built from collateralization. In fiat-backe
authors:
  - C (@calvin)
date: 2018-10-12
some_url: 
---

# dAppraise - Utilizing Non-Fungible Collateral For Loans

dAppraise 
A protocol for reducing the level of overcollateralization necessary for sufficient backing of loans, stablecoins, and other cryptofinancial markets.


----------

Fundamental Modern Portfolio Theory
Diversification into uncorrelated assets or assets with lower levels of correlation increases Sharpe ratio, essentially boosting the potentially reward per amount risk (variance in outcomes).

In stablecoins, loans, and other financial functions, trust is often built from collateralization.

In fiat-backed stablecoins where a reserve is set aside to “fully-back” every stable token issued, individuals cannot achieve any leverage directly from their existing wealth - they only convert their physical money into internet money.

in a fractional reserve system, the token is only partially backed, which means the supply of the token outnumbers the supply of the underlying present on hand, such that if there were a “black swan” event in which people all rush to withdraw at the same time, there may not be enough reserves to pay everyone back, thus causing a loss for participants in the system.

In a loan market, overcollateralization is a practice that is employed to ensure that individuals do not have an incentive to “walk away” and default on loans, even in the event of a significant price depreciation in the assets used as collateral.

However, this means that those with no access to liquid assets will remain without said access to credit/leverage, as if they need to put down 2x worth of collateral to borrow x amount, they would need to obtain/borrow 2x in the first place. This is a problem of credit - if you don’t have credit, how do you start building credit and receive the initial trust/capital needed to participate in the ecosystem?

This project is an attempt at both increasing financial inclusion through the use and valuation of nonfungible tokens (and potentially in the future, representative cryptoassets that can be provably linked to the corresponding real-world items)

In the traditional payoff matrix for an overcollateralized loan, we have a few cases: the underlying could increase in value, the underlying could decrease in value, and an individual can choose to either fulfill the terms of a loan, or decide to walk way and default on the loan, absconding with the principal but forfeiting the deposit.
Let us define traditional overcollateralized system [protocoloan] as a lending environment that requires a 2X collateralization, that is:
A loan denominated in epsilon token requires a 2 epsilon value deposit for ever epsilon token borrowed. This way, if the underlying asset(s) depreciated by 50%, there would still be enough value in the underlying that the individual offering the loan and access to credit to the system, could still recoup its initial principal value even if the loan recipient failed/refused to pay back.

Overcollateralization is necessary to attract lenders to the borrowing marketplace, such that the worst possible outcome of the payoff matrix is less bad, but that it does nothing to protect against prolonged periods of “economic downturns” where the market value of assets are dropping.

The overcollateralization condition inequality is as stated:

let m = Overcollateralization multiple
X = value of the underlying
P = principal of loan
I = sum(Interest payment for loan)
mX > P + I

For the system to ensure that the borrower doesn’t receive a higher payoff from being a bad actor than being a good actor,

X > (P + I)/m

That is, the price of the underlying can drop by a factor of m while providing enough incentive for the individual to still value the underlying more than the principal it already received.

Let m*safe* be the level of m necessary to ensure that a (delta) % change to X  does not lead to a violation of the inequality.

Anything we can do to reduce the m*safe* necessary for a given level of downside protection, allows for greater liquidity in this loan market.

In comes dAppraise.

Market participants can create open pricing models to appraise non-fungible tokens for their use in the overcollateralization of loans. In exchange, creators of pricing models can receive a cut of the revenue/interest for facilitating the agreement of terms.

The lender and borrow can set their own appraisal of nonfungible assets, or utilize other open pricing models submitted by model creators, much as two individuals betting on a sports game may quote the third-party “Vegas line” - that is, any of the available casinos or betting sites that offer a value, or agree upon their own rules.

If lenders and borrowers agree on the price/value of a nonfungible asset, the transaction is simpler, and thus should be more affordable without the market-line creating fee. However, this means that lenders and borrowers must live with the time cost of arriving at the fee themselves, as well as any risk of incomplete information from either side. Thus, this should only be utilized when two peers have trust and faith that the price/value arrived at for the nonfungible is fair given the available information.

Accurate evaluators would receive greater levels of matchmaking and receive a fraction of the total loan principal done on their evaluations, much as a trusted line producer garners more action by being more relatively accurate, while collecting a house cut while providing its services.

Let’s examine the cases in which evaluators are inaccurate about the valuation (appraisal) of the non-fungible tokens:

Case 1:
Guess high - if an evaluator misjudges a token to be worth more than it is, then there is a weakness in that the individual who placed it as part of his/her collateral may be incentivized to walk away from the loan and default, essentially selling the NFT for a higher than market value.
The benefit of this case is that the individual that previously did not have access to capital can now receive capital for forfeiting the NFT that was less liquid than the tokens it received in loan.
The penalty to avoid this is that the poor evaluators will be less trustworthy and lose potential long-term volume done with its appraisals. Lenders will avoid ones with bad track records of guessing high.

A reputation score may be tracked to help enforce accountability here; profit-maximizing participants will be wise to consider score in weighing the risks of participating in any loan market, but a reputation token that allows for transfer of credit or reputation may be risky and allow an individual to purchase a high score to catch a “big contract”, only to subsequently abscond and fail.

Case 1b:
In the event that the NFT is completely undesirable, then the borrower may be able to scam liquidity providers and receive a non-zero amount of credit for a worthless asset. It will be up to participating lenders to decide if this risk is reasonable for the NFT’s offered. More work on shoring up this case would be greatly appreciated.

Case 2:
Guess low - if an evaluator misjudges a nonfungible token to be worth less than it actually is, then a borrower will not be able to receive as much access to capital as it would like. However, it will still receive more access to capital than in a model that does not consider nonfungibles.
In this case, the evaluator cause the nonfungibles to have a lower impact on the overcollateralization %; however, being horribly inaccurate in this direction crimps the potential for loans to be taken in this ecosystem, and also reduces the volume/loan size of loans that do occur. As a result, evaluators are incentivized to do their best in approximating a true price for the nonfungible.
In this under-appraised case, however, the individual does not have an incentive to default on their loan, as the cost of defaulting and giving up the asset is greater than the 

A lender may also choose to not accept NFTs.
A lender instead may also enforce a burn for certain NFTs, rather than collect it, in which case the sentimental value of the token would be much much higher, knowing that repossession of the nonfungible will not be possible in the future if the loan is defaulted.

In the case that a very valuable NFT may be burned, a third party may choose to fulfill the loan on behalf of the defaulting party, and then be able to receive the valuable asset.

Note that it would be possible for the loaning party itself to decide to claim the token itself. Thus, the loaning party has the right, but not the obligation, to claim first, but if they decide to not claim,. the asset could then essentially go to the third party that may fulfill the duties of the loan to claim the NFT.

Second & nth-level participation
In this case, as well as in a regular case where a loan’s obligations are fulfilled, there is the possibility for intermediary lenders to provide capital to mediate any differences in desired tokens between lenders and borrowers. So long as lenders and borrowers agree on the terms of the loan in regards to initial principal, interest rate, and duration of loan, intermediaries that value NFT’s and other tokens differently can provide differently-collateralized loans to connect the most extreme lenders and borrowers of NFTs vs. fungible assets. This way, someone with zero liquid cryptoassets could still tokenize seizable, real life assets through non-fungible tokens, and utilize their appraised value to access credit, with other liquidity providers achieving a return on their provision of credit.

Kyber & other decentralized exchange/atomic swap solutions.
Simultaneously, any lenders can set what coins they prefer to receive, and with Kyber’s atomic swap feature, the intermediaries can supply the different cryptoassets to assign the preferred fungible coins & interest rates/fees to the lending parties that prefer them the most. A lender is incentivized to be accepting of as many coins as it likes, as it offers more possibilities to participate as an intermediary nth level participant in a 3rd party loan. As stated above, this allows a end borrower and lender to only worry about agreeing on three parameters (initial principal, interest rate, and duration of loan), thus reducing the friction to filling loans.

Added sentimental value lock:
Including ERC 721s as eligible capital for collateral offers several benefits to the existing fand that the individual may have a level of special sentimental value

Let’s say that a cryptokitty is a terribly slow, high # generation kitty and is not very valued to the lender, but holds some sentimental value to the borrower - thus, the cost of default for the borrower is higher than expected, proving greater incentive for the individual to follow through. 
Returning to the inequality: mX* > P + I
In this case, X* = s * X, where s is a sentimental factor greater than 1 that leads to a greater value to the borrower.
Thus, because X* > X, a lower level of m is necessary in order to still satisfy this threshhold (alternatively, we can describe the effective rate of m as higher given a fixed X of appraisal value).

if the converse were true, that is, if this cryptokitty was particularly ugly to an individual, and the sentimental factor s was < 1, then it would be advantageous for the individual to simply sell the cryptokitty for the face value it could recoup (s = 1), and then use that as collateral for a loan.

Discussion on necessity for liquidity
There have been 248 loans issued in the past 7 days with principal amount of $ 3,108,136. The collateral amount posted in these loans: $104,977,394.14

Thus, these loans are extremely overcollateralized, and that individuals with no access to credit wouldn’t be able to achieve the same level of overcollateralization to remain competitive in this market.

According to Loanscan: For dharma specifically 54 loans have been issued in the past 30 days with TOTAL principal amount of $ 3,321. However, a system like dharma should be able to have a higher % of loan size, because it is willing to accept multiple types of collateral for these loans.

Thus, we want to envision a robust marketplace where individual intermediary participants are incentivized to share the risk of a borrower that has less existing access to capital.

Example
Let Alice have 0 DAI but have a mini fridge in her dorm that can be sold on Amazon for $40.
Alice would prefer not to sell her fridge, as to her it has a higher use value than the low price Amazon’s willing to liquidate at.
Alice is additionally incentivized to fulfill her loan because she values the fridge at >40, beyond whatever threshold of overcollateralization in the network. Utilizing a NFT representing ownership to this limited edition fridge, she now has collateral to enter the loan chain.

Her roommate Bob, knows that this mini fridge exists, and is willing to essentially act as a underwriter for this loan, as he knows he can seize the fridge and either use it or sell it on Amazon. He then fronts 0.2 ETH collateral for his friend Alice. 

But Alice needs DAI. Bob doesn’t want to sell his ETH to front Alice the money.
Alice and Bob need an intermediary participant in the loan to complete the trade.
Calvin is willing to lend his DAI but is not interested in the non-fungible token. Utilizing an atomic swap, we achieve a three party trade where Bob receives the NFT, Alice receives the DAI, and Calvin receives the ETH.

Note that Calvin can be represented by any number of participants depending on the basket of coins Alice needs and the basket of coins that Bob provides.
Thus, we can utilize intermediary parties to split the risk of the ETH-less borrower, and reassign assets to those with the risk profiles that match - Bob, who’s risk appetite is higher because he knows Alice in person and can see the fridge, feels more comfortable with the NFT end of the loan.
Calvin, an independent third party, can simply enter the trade as he would while using a decentralized exchange, essentially receiving a future on the coins he swaps.

You could imagine a n-participant case where there are n many Calvin’s all swapping their tokens and participating in piecewise loans:
Alice has m ETH and p Cryptokitties, and wants to put both down as collateral.
For each intermediate participant, they can take on a different amount of ETH or Cryptokitties, so long as the participant’s positions sum up to the assets that Bob is willing to loan.

This creates a much more robust lending system that allows individuals to participate regardless of what assets they own.

We can measure our impact by the change in the following:
loan volume
loan participants
delinquency rate 
tokenization of assets (number of ERC721s created)
reduced overcollateralization multiple

To-do:
How should users be able to upload their appraisals?

Starting with Cryptokitties, this would be the first NFT that we work would on appraising to provide a demonstration of the value of the appraisal role.

Individuals utilizing other nonfungibles could agree peer to peer on valuations, as stated above, but as a market grows large enough for a specific type of NFT, individuals will be incentivized to create the necessary support for each popular market.

Thus, it is more important to build a list of existing NFTs that people could potentially appraise, such that appraisers could compete for dominance in each nonfungible market.

Appraisal risk for collusion still needs to be considered.

Please let me know with comments anything that you think should be improved 🙂 

All code can be found in this repo:
https://github.com/calchulus/dAppraise

Included is the current interface for users to set borrowing requests and lending offers:
https://calchulus.github.io/dAppraise/wip/index.html

A sample evaluation model is displayed here:
https://docs.google.com/spreadsheets/d/1aHiNuIlz7wv0DaZ56mk26uctlY4NzojMaACUQFcQr0E/edit#gid=0

Our next steps are to build out this project to integrate with the dharmas/swap relayers to allow individuals to execute the coin trades necessary to execute these loans. We
're super proud of the idea of combining the prediction market in to the loaning mechanism. 

