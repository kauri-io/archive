---
title: Populus  Testing your smart contract
summary: Populus, the tester chain, and web3.py- Testing your smart contract This article breaks from the other DappSeries articles, and instead incorporates a set of Python tooling for your smart contract testing needs. A note on pending refactors to the Populus tool (a truncated list, per Piper Merriam)- Change populus to use eth-tester for testing (currently using eth-testrpc) Remove need for project.json in project directory Removal of the Chain API entirely Removal of the scripts that setup local te
authors:
  - Wil Barnes (@wil)
date: 2018-09-13
some_url: 
---

# Populus  Testing your smart contract

# Populus, the tester chain, and web3.py: Testing your smart contract

This article breaks from the other DappSeries articles, and instead incorporates a set of Python tooling for your smart contract testing needs. 

A note on pending refactors to the Populus tool (a truncated list, per Piper Merriam):

* Change populus to use eth-tester for testing (currently using eth-testrpc)
* Remove need for project.json in project directory
* Removal of the Chain API entirely
* Removal of the scripts that setup local test chains
* Move web3 pytest fixture out of Populus and into eth-tester or maybe web3.py
* For full list, please visit: https://github.com/ethereum/populus/issues/395 


Things to consider before we keep moving forward. Be aware that some of this functionality will be deprecated in the future. Voith Mascarenhas (https://github.com/voith) is I believe currently the only Populus contributor at the moment, and a lot of the work to improve Populus has been the result of his work. 

In the previous article of the Populus series, we walked through the process of initializing a Populus project, compiling your smart contracts, creating local geth chains, and deploying your smart contracts. 

However, we did not go into significant detail on how to test your smart contracts using Populus. 

To help readers better understand how to write py.test tests for your smart contracts, we will walk through the process together using Populus. 

Populus uses the py.test testing framework. For further information on py.test, please refer to their documentation available at: https://docs.pytest.org/en/latest/contents.html

Prerequisites

* Populus
* Geth
* Web3.py v3.16.5, Populus can not yet handle web3.py v4+ versions


Setting up a test file 

Populus requires that all tests reside in the 'tests/' folder and that all tests  match the glob pattern Test*.sol (e.g. test_mysmartcontract.py). 

To simply run your project's test suite, use the following command: 

```
$ py.test tests/
```

To run a specific test:

```
$ py.test tests/test_greeter.py
```

Populus provides a set of py.text fixtures to simplify the testing process. 


* A project object that is initialized first, of which the rest of the Populus fixtures are derived from.
* A chain fixture that serves as a running 'tester' chain. 
* A registrar convenience fixture for the chain.registrar property. 
* A provider convenience fixture for the chain.provider property. 
* A Web3 convenience fixture for the chain.provider property. 
* Basic contract factory classes. 
* Accounts.
* And the ability to create your own fixtures. Reference the documentation for further information on fixtures usage. 


Populus current version uses eth-testrpc for testing purposes. Below is basic testing code for your reference. Be mindful currently Populus only supports usage of Web3.py 3.16.5. Support for Web3.py 4+ has not been introduced yet. To run the tests, simple use the command in the project directory: 

```
py.test tests/
```


Let's dig further into these tests to understand what's going on. First, we want to make a few imports and create a variable for our 'test_project' project: 

```
from populus.project import Project
from time import time
from web3.testing import Testing

p = Project(project_dir='/home/[name]/Documents/python/populus/test_project/')

dayInSeconds = 86400

with p.get_chain('tester') as chain:
    web3 = chain.web3
    testing = Testing(web3)
    
    # ...tests are inserted here...
```

The first 3 lines of code import basic functionality, the 'p' variable is then set to a project directory, which in this case is just a dummy directory. The 'dayInSeconds' variable is set to 86400 and will be used to reference daylong time periods for use in our Bounties contract. Lastly, we instantiate the 'tester' chain as our chain with the final 3 lines of code. 

The body of the tests:

```
import pytest
from populus.project import Project
from time import time
from web3.testing import Testing

p = Project(project_dir='/home/wil/Documents/python/populus/test_project')

dayInSeconds = 86400

with p.get_chain('tester') as chain:
    web3 = chain.web3
    testing = Testing(web3)

    def test_function(web3, chain):
        bountiesInstance, deploy_tx_hash = chain.provider.get_or_deploy_contract('Bounties')
        tx_hash = bountiesInstance.transact({'value': 500000000000000000}).issueBounty('data', \
                web3.eth.getBlock('latest').timestamp + (dayInSeconds * 2))
        
        chain.wait.for_receipt(tx_hash)
        tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
        
        assert tx_receipt['logs'] is not None, "an event exists in the transaction receipt"
        assert len(tx_receipt['logs']) == 1
        
        event_logs = bountiesInstance.events.BountyIssued().processReceipt(tx_receipt)
        
        assert event_logs[0]['args']['bounty_id'] == 0, "bounty_id should be indexed starting at 0"
        assert event_logs[0]['args']['issuer'] == web3.eth.accounts[0], "issuer should be equal to accounts[0]"
        assert event_logs[0]['args']['amount'] == 500000000000000000, "should be equal to amount sent by issuer"
        assert event_logs[0]['args']['data'] == 'data', "should be 'data' string"

    def test_call(web3, chain):
        bountiesInstance, deploy_tx_hash = chain.provider.get_or_deploy_contract('Bounties')
        result = bountiesInstance.call(
                {'from': web3.eth.accounts[0], 'value': 500000000000000000}).issueBounty(
                        'data', web3.eth.getBlock('latest').timestamp + (dayInSeconds * 2))
        
        assert result == 0, "issueBounty() call did not return correct value"    

    def test_expiry(web3, chain):
        bountiesInstance, deploy_tx_hash = chain.provider.get_or_deploy_contract('Bounties')
        tx_hash = bountiesInstance.transact({'value': 500000000000000000}).issueBounty('data', \
                web3.eth.getBlock('latest').timestamp + (dayInSeconds *2))
        
        chain.wait.for_receipt(tx_hash)
        tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
        
        issue_event_logs = bountiesInstance.events.BountyIssued().processReceipt(tx_receipt)
        
        thefuture = testing.timeTravel(int(web3.eth.getBlock('latest').timestamp + (dayInSeconds * 3)))
        tx_fulfill_hash = bountiesInstance.transact({'from': web3.eth.accounts[1]}).fulfillBounty(
                0,'data')
        tx_fulfill_receipt = web3.eth.getTransactionReceipt(tx_fulfill_hash)
        fulfill_event_logs = bountiesInstance.events.BountyFulfilled().processReceipt(tx_fulfill_receipt)
        
        assert web3.eth.getTransactionReceipt(tx_fulfill_hash).status == 0
```


Right now, the only wait to get the web3.eth.getTransactionReceipt('TX_HASH_HERE').status attribute to return is to use the following Populus repo in it's own virtualenv:

```
$ pip install -e git+https://github.com/voith/populus.git@update-eth-tester#egg=populus
```

Voith Mascarenhas (https://github.com/voith) is I believe the sole Populus contributor at the moment, and a lot of the work to improve Populus has been the result of his work. 
https://github.com/voith

Your testing needs will vary. The good news is that Populus now supports Web3.py 4.6.0. 

For further For further information on testing, you can use the pytest documentation @ https://docs.pytest.org/en/latest/contents.html and the web3.py documentation @ https://web3py.readthedocs.io/en/stable/

Populus appears to be planning the implementation of eth-tester in the future. 



