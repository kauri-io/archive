---
title: Develop your ERC-20 Token — explained!
summary: ERC 20 Tokens are creating a rage in the cryptocurrency sector and you wouldn’t want to be left behind, would you? Anyone who is keen to know the functionality involved in an ERC-20 token creation and deployment is welcomed. Let’s get started. What is an ERC-20 Token? Ethereum Request For Comments 20(ERC 20) is a protocol standard that defines certain rules and standards for issuing tokens on Ethereum’s network. A Token developed on Ethereum Blockchain is said to be an ERC-20 compliant only if i
authors:
  - Hargobind Gupta (@hargobindgupta)
date: 2019-06-03
some_url: 
---

# Develop your ERC-20 Token — explained!

ERC 20 Tokens are creating a rage in the cryptocurrency sector and you wouldn’t want to be left behind, would you? Anyone who is keen to know the functionality involved in an ERC-20 token creation and deployment is welcomed. Let’s get started.
 
**What is an ERC-20 Token?**
 

![](https://api.kauri.io:443/ipfs/QmWa5PaKwACzkbbCdDDJbLgjuDGZEoJyjuB2QS9MV3oBqk)

Ethereum Request For Comments 20(ERC 20) is a protocol standard that defines certain rules and standards for issuing tokens on Ethereum’s network.
A Token developed on Ethereum Blockchain is said to be an ERC-20 compliant only if it includes the basic functions defined by the protocol in its smart contract. The functions defined in the protocol are :

```
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
```



```
contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
```



```
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
```


The Ethereum community created this protocol so that a token can be shared, exchanged for other tokens, or transferred to a crypto-wallet as effortlessly as possible.
 
**Things required to develop a Token.**
 
Proficiency in Solidity, the official language to write smart-contracts on Ethereum Blockchain. The only hackable module in your Blockchain Project is your smart contract, So one should give utmost importance to its development as we do at 
[Unbox Innovation.](https://www.unboxinnovations.com/)
 .
Also this



 * Ethereum Address (Ropsten Network)

 * Some Ethereum (Ropsten Network)

 * A text editor (I.e. Sublime / Atom)

 * Solidity contract
 
**Let’s jump into the code.**
 
The Ethereum community created these standards with three optional rules, and six mandatory.
 
**Optional**
 



 * Token Name

 * Symbol

 * Decimal (up to 18)
 
**Mandatory**
 



 * totalSupply: _identifies the total number of ERC-20 tokens created._ 

 * balanceOf: _it returns the number of tokens a given address has in its account._ 

 * transfer: _allows a certain number of tokens to be transferred from the total supply to a user account._ 

 * transferFrom: _is the function that allows a user to transfer tokens to another user._ 

 * approve : _checks a transaction against the total supply of tokens._ 

 * allowance: _function checks the balance of the user’s account and will cancel the transaction if there are insufficient tokens._ 
A sample smart contract implementing all the protocol is defined here. The comments will guide you when you are inside.

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/Yara1990/657a73c2c8c0be2039ac72934f914913.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
pragma solidity ^0.4.18;

// ----------------------------------------------------------------------------
// 'Banana' token contract
//
// Deployed to : 0x5A86f0cafD4ef3ba4f0344C138afcC84bd1ED222
// Symbol      : BAN
// Name        : Banana Token
// Total supply: 100000000000000000000000000
// Decimals    : 18
//
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c &gt;= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b &lt;= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b &gt; 0);
        c = a / b;
    }
}


// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// ----------------------------------------------------------------------------
contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


// ----------------------------------------------------------------------------
// Contract function to receive approval and execute function in one call
// ----------------------------------------------------------------------------
contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;
}


// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    function Owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}


// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and assisted
// token transfers
// ----------------------------------------------------------------------------
contract BananaToken is ERC20Interface, Owned, SafeMath {
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;

    mapping(address =&gt; uint) balances;
    mapping(address =&gt; mapping(address =&gt; uint)) allowed;


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    function BananaToken() public {
        symbol = "BAN";
        name = "Banana Token";
        decimals = 18;
        _totalSupply = 100000000000000000000000000;
        balances[0xa8112ac2f02fa71f737929d18671b72e8609b78d] = _totalSupply;
        Transfer(address(0), 0xa8112ac2f02fa71f737929d18671b72e8609b78d, _totalSupply);
    }


    // ------------------------------------------------------------------------
    // Total supply
    // ------------------------------------------------------------------------
    function totalSupply() public constant returns (uint) {
        return _totalSupply  - balances[address(0)];
    }


    // ------------------------------------------------------------------------
    // Get the token balance for account tokenOwner
    // ------------------------------------------------------------------------
    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }


    // ------------------------------------------------------------------------
    // Transfer the balance from token owner's account to to account
    // - Owner's account must have sufficient balance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        Transfer(msg.sender, to, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for spender to transferFrom(...) tokens
    // from the token owner's account
    //
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces
    // ------------------------------------------------------------------------
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        Approval(msg.sender, spender, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Transfer tokens from the from account to the to account
    //
    // The calling account must already have sufficient tokens approve(...)-d
    // for spending from the from account and
    // - From account must have sufficient balance to transfer
    // - Spender must have sufficient allowance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        Transfer(from, to, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Returns the amount of tokens approved by the owner that can be
    // transferred to the spender's account
    // ------------------------------------------------------------------------
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for spender to transferFrom(...) tokens
    // from the token owner's account. The spender contract function
    // receiveApproval(...) is then executed
    // ------------------------------------------------------------------------
    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);
        return true;
    }


    // ------------------------------------------------------------------------
    // Don't accept ETH
    // ------------------------------------------------------------------------
    function () public payable {
        revert();
    }


    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
}

```


If you find this useful, please share it with your crypto freaks in your network.
If you don’t want to take the burden of doing all this, reach out to us at 
**contact@unboxinnovations.com**
 
Originally published by me at :
 [My Medium Blog](https://medium.com/@hargobindgupta/develop-your-erc-20-token-explained-f2437ef8329b)
