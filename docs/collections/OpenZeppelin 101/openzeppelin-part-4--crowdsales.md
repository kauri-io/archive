---
title: OpenZeppelin Part 4  Crowdsales
summary: Crowdsales What is a Crowdsale? In Blockchain, crowdsales are fundraisers to assist in the development of a project. Backers use the tokens sold during the crowdsale to participate in the project once its launched. The tokens are usable only within this project. OpenZeppelin & Crowdsales OpenZeppelin created four categories of contracts to assist in the creation of a crowdsale contract based on the most important properties of a crowdsale. Price & Rate Configuration Before creating a crowdsale i
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-02-28
some_url: 
---

# OpenZeppelin Part 4  Crowdsales

![](https://ipfs.infura.io/ipfs/QmXpNnBRArmx3E36X5niZXricpaMk4QHX9GnJaeP8VCbZG)


## Crowdsales

### What is a Crowdsale?

In Blockchain, crowdsales are fundraisers to assist in the development of a project. Backers use the tokens sold during the crowdsale to participate in the project once it's launched. The tokens are usable only within this project.

### OpenZeppelin & Crowdsales

OpenZeppelin created four categories of contracts to assist in the creation of a crowdsale contract based on the most important properties of a crowdsale.

#### Price & Rate Configuration

Before creating a crowdsale it's important to understand the rate. Currency math is always done in the smallest denomination. To read the amount, the currency is converted to the correct decimal place. The smallest currency is Wei.

    1 Eth = 10^18 Wei

**In terms of tokens**, the smallest denomination is TKNbits, a.k.a. bits.

    1 TKN = 10^(decimals) TKNbits

Keep these conversions in mind when working with math in contracts, because it's possible to distribute more or less tokens/ether than you thought. **Remember that calculations are always in Wei and TKNbits.**

In the price category we have one contract, _IncreasingPriceCrowdsale.sol_ This allows you over a set period of time to have the price of your tokens increase.

```solidity
pragma solidity ^0.5.2;

import "../crowdsale/price/IncreasingPriceCrowdsale.sol";
import "../math/SafeMath.sol";

contract IncreasingPriceCrowdsaleImpl is IncreasingPriceCrowdsale {
    constructor (
        uint256 openingTime,
        uint256 closingTime,
        address payable wallet,
        IERC20 token,
        uint256 initialRate,
        uint256 finalRate
    )
        public
        Crowdsale(initialRate, wallet, token)
        TimedCrowdsale(openingTime, closingTime)
        IncreasingPriceCrowdsale(initialRate, finalRate)
    {
        // solhint-disable-previous-line no-empty-blocks
    }
}
```

Read more in the [documentation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/mocks/IncreasingPriceCrowdsaleImpl.sol).

#### Emission

Emission refers to the process of how the token reaches the buyer. The default method is to immediately transfer the token to the buyer. Other methods are available which can help to control other aspects of the crowdsale such as price point and the number of tokens sold.

- **Default**: The crowdsale contract owns the tokens and transfers them to the buyers when they purchase them.
- _MintedCrowdsale.sol_: The crowdsale contract mints tokens when purchased. This is a way to ensure that excess tokens are not created as well as control how many tokens are in circulation.
- _AllowanceCrowdsale.sol_: Another wallet grants the crowdsale contract tokens to sell. With this method, you need to ensure that you approve the allowance using the ERC20 `approve()` function otherwise your contract will never receive the tokens.

```solidity
pragma solidity ^ 0.5.2;

import "openzeppelin-solidity/contracts/crowdsale/emission/emission-you-choose.sol";

contract myCrowdsale is emission-you-choose {
    //the rest of your code
}
```

#### Validation

Validation contains contracts that add more customization to your crowdsale. They limit access to token purchases.

- _CappedCrowdsale.sol_: Adds a cap or maximum amount of tokens to sell for the duration of the crowdsale. If the cap is exceeded, token purchases will not be valid. This helps to keep the value of the token in control.
- _IndividuallyCappedCrowdsale.sol_: Caps an individuals purchases to ensure that not one person owns all the tokens. This maintains the value of the token.
- _WhitelistedCrowdsale.sol_: Only people on the whitelist can buy tokens and thus you can sell to a more selective group of buyers.
- _TimedCrowdsale.sol_: Your crowdsale has an opening and closing time.

```solidity
pragma solidity ^ 0.5 .2;

import "openzeppelin-solidity/contracts/crowdsale/validation/validation-you-choose.sol";

contract myCrowdsale is validation-you-choose {
    //the rest of your code
}
```

#### Distribution

The most important part of the crowdsale is when the tokens are released to the buyer.

- **Default**: Release the tokens immediately when the buyers purchase them.
- _PostDeliveryCrowdsale.sol_: Tokens are distributed after the crowdsale is over. Buyers use the `withdrawToken()` function to obtain the tokens.
- _RefundableCrowdsale.sol_: If the minimum goal of the crowdsale is not reached, users use the `claimRefund()` function to get their Ether back.

```solidity
pragma solidity ^ 0.5 .2;

import "openzeppelin-solidity/contracts/crowdsale/distribution/distribution-you-choose.sol";

contract myCrowdsale is distribution-you-choose {
    //the rest of your code
}
```

### Conclusion

Crowdsales don't have to be complex to write and using OpenZeppelin can help incorporate features that give you, the developer, more control.

**Note**: You can use more than one crowdsale feature. They each have to have an import statement as well as separated by a comma.

```solidity
pragma solidity ^ 0.5 .2;

import "openzeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";

contract myCrowdsale is PostDeliveryCrowdsale, TimedCrowdsale {
    //the rest of your code
}
```

### Next Steps

- <https://openzeppelin.org/api/docs/learn-about-crowdsales.html>
- <https://openzeppelin.org/api/docs/crowdsale_Crowdsale.html>

For examples of how to use OpenZeppelin Crowdsale contracts use the following link to access open source code:

- [Crowdsales](https://github.com/search?q=import+%22openzeppelin-solidity%2Fcontracts%2Fcrowdsale&type=Code)


---

- **Kauri original link:** https://kauri.io/openzeppelin-part-4:-crowdsales/f7287d9006e346f2a628fad7132ff19c/a
- **Kauri original author:** Juliette Rocco (@jmrocco)
- **Kauri original Publication date:** 2019-02-28
- **Kauri original tags:** smart-contract, openzeppelin, zeppelin, crowdsale, token
- **Kauri original hash:** QmcEH6v6VB3qu48sjCzAV3bRhBWwsb2jJpquj9vK8sk4iH
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



