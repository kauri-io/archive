---
title: CDP Liquidator
summary: A Collateralized Debt Position (CDP) is an ETH lockup mechanism by which DAI is created. In extreme liquidity scenarios, some users will need a convenient way to exit risky positions. This project is a cool experiment to let a user send their at-risk CDPs to a contract to pay off debts and return remaining collateral to the user. - Hugh Lang (ECF) https-//devpost.com/software/cdp-liquidator Inspiration MakerDAO is a set of smart contracts that manage the operation of a dollar pegged cryptocurren
authors:
  - Kauri Team (@kauri)
date: 2018-09-20
some_url: 
---

# CDP Liquidator


A Collateralized Debt Position (CDP) is an ETH lockup mechanism by which DAI is created. In extreme liquidity scenarios, some users will need a convenient way to exit risky positions. This project is a cool experiment to let a user send their at-risk CDPs to a contract to pay off debts and return remaining collateral to the user. - Hugh Lang (ECF)

https://devpost.com/software/cdp-liquidator

#### Inspiration
MakerDAO is a set of smart contracts that manage the operation of a dollar pegged cryptocurrency called DAI. CDP's (Collateralized Debt Positions) are the mechanism by which DAI is created. Users of the system lock up collateral (ETH) in a smart contract called a CDP, and gain the right to mint a certain amount of DAI in return.

If the value of their collateral falls below 1.5x their outstanding debt, the loan is considered too risky, and the system will take their collateral and sell it to cover the debt. Any surplus collateral is returned to to the user (minus a 13% liquidation fee).

The liquidation fee obviously makes this an expensive and undesirable prospect for CDP holders.

If the value of the collateral falls very suddenly, CDP holders can be left in a position where their CDP is rapidly approaching liquidation, but they do not have enough easily available funds to close their position themselves.

These holders would be very happy to have a service that would allow them to close their positions without paying the liquidation fee.

#### What it does
We have created a service that allows users who do not have enough liquidity to pay a smart contract to close their CDP for them (and thus significantly reduce the cost of liqudation).

Since the CDPs are overcollateralized, the contract is paid with a cut of the excess collateral. All remaining collateral is returned to the user.

The contract will be funded with DAI, and funders receive a portion of the fees proportional to their contribution.

This creates a market for CDP's and allows CDP holders to conveniently exit risky positions.

Users will send their risky CDP's to the contract and then the contract will do the following:

Pay off the outstanding debt
Close the CDP
Return the remaining collateral (minus the fee) to the original owner of the CDP
Distributes the fee amongst the funders of the contract
How we built it
We created a set of smart contracts (see the liquidator-contracts repo), and forked and modified the oasis.direct frontend to serve as a user interface for the contracts.

In order to guarantee atomicity of the liquidation process we made use of a proxy contract (ds-proxy) that bundles multiple transactions together into one.

#### Challenges we ran into
Solidity tooling sucks. We are bad at maths.

#### Accomplishments that we're proud of
Working MVP.

#### What we learned
Maths. Tooling for command line blockchain interaction & scripting (seth / dapp.tools)

#### What's next for cdp-liquidator
The contract should sell any collateral it holds for DAI.
Polish UI
Smart contract auditing
Main deployment
???
profit

#### Try it out
[http://cdp-liquidator.surge.sh/](http://cdp-liquidator.surge.sh/)

[GitHub: Smart Contracts](https://github.com/xwvvvvwx/liquidator-contracts)

[GitHub: Frontend](https://github.com/xwvvvvwx/liquidator-frontend)


---

- **Kauri original title:** CDP Liquidator
- **Kauri original link:** https://kauri.io/cdp-liquidator/5843d9b8b7dd4a8ba889eb1b7619b27f/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2018-09-20
- **Kauri original tags:** none
- **Kauri original hash:** QmdV6J3u3c4JpjjhGnXWrV9g8tmTixKd9BczX67eSjxS9B
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



