---
title: Deploying a full-stack dApp to Amazon EC2
summary: Deploying a full-stack dApp to Amazon Elastic Cloud Computing (AWS-EC2) In the previous tutorials in this series, we saw how to develop a full-stack ethereum-based blockchain dApp. In this tutorial, we learn how to deploy the dApp to an Amazon web services (AWS) elastic cloud computing (EC2) instance. We also create a private ethereum blockchain node using kaleido and configure the dApp to work with this blockchain node. Prerequisites To complete this tutorial, you need a good understanding of t
authors:
  - Mulili Nzuki (@mulili)
date: 2019-09-27
some_url: 
---

# Deploying a full-stack dApp to Amazon EC2


## Deploying a full-stack dApp to Amazon Elastic Cloud Computing (AWS-EC2)

In the previous [tutorials in this series](https://kauri.io/collection/5b8e401ee727370001c942e3), we saw how to develop a full-stack ethereum-based blockchain dApp.

In this tutorial, we learn how to deploy the dApp to an Amazon web services (AWS) elastic cloud computing (EC2) instance. We also create a private ethereum blockchain node using [kaleido](https://kaleido.io/) and configure the dApp to work with this blockchain node.

### Prerequisites

To complete this tutorial, you need a good understanding of the following concepts:

-   Connecting to a remote server via SSH.
-   Basic Linux Command Line Interface (CLI) knowledge.
-   A good understanding of how the blockchain works is recommended, but not necessary for completing this tutorial.

### Launch and Connect to an EC2 Instance

<!-- TODO: Replace -->

To launch an EC2 instance, follow the instructions in this [tutorial](https://hackernoon.com/launching-an-ec2-instance-fbfd50894aac)

-   Make sure the instance state in the console is running and there is a green tick under status checks.
-   Make sure you are able to SSH into the EC2 instance as detailed in the article above.

Next install the apache server `httpd` , `node.js` and `git` by running the following commands on the EC2 instance.

```sh
sudo yum update -y
sudo yum install -y httpd git nodejs
sudo service httpd start
sudo chkconfig httpd on
```

### Create a Private Ethereum Blockchain Node using [Kaleido](https://kaleido.io/)

To create a private ethereum blockchain node in kaleido, do the following:

1.  Create a new Kaleido account, sign in/log in, and complete the sign up process.
2.  After logging in, create a _Consortium_, by clicking the _Create Consortium_ button and then do the following:

    1.  Enter the name and mission of the consortium.
    2.  Set your home region e.g. Ohio if you had selected USA as your country.
    3.  Click _NEXT_ and then click _FINISH_ in the next tab.

3.  Setup a new environment by clicking the _SETUP ENVIRONMENT_ button and doing the following:

    1.  Enter the name of the enviroment, or leave it blank and click _NEXT_.
    2.  In the _Protocol_ tab, select _Geth_ under _PROVIDER_. This is important because you need to create an Ethereum blockchain node, the other 2 options create blockchain nodes for other providers not covered by this tutorial.
    3.  By default, _PoA_ is selected under _CONSENSUS ALGORITHM_.
    4.  Click _FINISH_ to complete set up.

4.  Next, add the ethereum node by clicking on the `ADD NODE` and doing the following:
    1.  Select the correct _OWNING MEMBER_ for the node,  enter the name of the node, and click _NEXT_.
    2.  Click _NEXT_ in the _CLOUD CONFIGURATION_ tab and leave the settings as default. Note under the free plan, you won't be able to change any of the settings.
    3.  In the _SIZE_ tab, select the _Node Size_ you want. Note again under the free plan, only the small node size is available.
    4.  Click _FINISH_ to complete set up.

Give the newly created node about 3 minutes to finish initializing and starting.

To connect to the newly created node, you need to add new app credentials in Kaleido, by doing the following:

1.  Click the _+ADD_ dropdown and choose the _New App Credentials_ option.
2.  Make sure you select the correct membership under the _MEMBERSHIP_ option and enter a new name for the credential.
3.  Note the _USERNAME_ and _PASSWORD_ shown.

    1.  Copy the password shown and save it in a secure place. This is the only time the password is shown, so if you lose it, you'll have to create new app credentials to connect to the node.

4.  Click _DONE_ to save the app credentials.

### Create a Kaleido IPFS Node

Because the dApp needs to connect to an IPFS node, you need to create a new node by doing the following:

1.  Navigate to an existing environment, and click the _+ADD_ dropdown in the top right of the screen.
2.  Select the _Add Services_ option. This opens a new panel exposing the available Kaleido Services.
3.  Click the _ADD_ button beneath _IPFS File Store_ option.
4.  Name the node and click _ADD_. Click _DONE_ to finish the deployment.
5.  The newly created IPFS node appears at the bottom of your environment panel under _MEMBER SERVICES_.

Save the IPFS URL created in a safe place because you need it later in the tutorial by doing the following:

-   In the kaleido dashboard _environment_ section, click on the ipfs node created under _MEMBER SERVICES_.
-   A new _Application Credentials_ page appears, select the _App Credentials_ created above under _CREDENTIAL NAME_ and under _SECRET KEY_  enter the passoword saved from above and click _SUBMIT_.
-   Copy the URL under _MY COMPANY ORGANIZATION - IPFS GATEWAY ENDPOINT_ and append the _APPLICATION CREDENTIALS_ displayed to this URL. i.e., if the url is `https://u0b2fvaghe-u0kzkqcb5x-ipfs.us0-aws.kaleido.io/ipfs` and the credentials are `u0hnyi99nm:8abPcEHO1ioxo7pckJKcxw3VzKl8D19TsFp5o7pE-cj4` the new url is `u0hnyi99nm:8abPcEHO1ioxo7pckJKcxw3VzKl8D19TsFp5o7pE-cj4@u0b2fvaghe-u0kzkqcb5x-ipfs.us0-aws.kaleido.io`.
-   Save this url in a secure place.

### Deploy the dApp to AWS

For this tutorial, we use the [react project](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/truffle-react-box-frontend) from previous steps. Fork the repo to make the changes described below and deploy the dApp to the AWS EC2 instance.

#### Generate a new Ethereum Wallet and Mnemonic

This step is optional if you already have an existing Ethereum wallet and are comfortable using it's mnemonic from the above dApp.

To generate a new wallet go to <https://iancoleman.io/bip39> and in the BIP39 Mnemonic code form, do the following:

1.  Select _ETH — Ethereum_ from the _Coin_ drop down.
2.  Select a minimum of 12 words.
3.  Click the _Generate_ button to generate the mnemonic.
4.  Copy and save the mnemonic located in the field _BIP39 Mnemonic_, remember to keep this private as it is the seed that can generate and derive the private keys to your ETH accounts.

You can also get the address of the wallet in the table under _Derived Addresses_ in the first row under the column Address. i.e. `0x06c6b9bfF7281e97DE8455df05f0EC62528f4DEC`

#### Setup Truffle

In the repo forked above, create a `secrets.json` file in the root path of the `truffle-react-box-frontend` folder.

Then get the kaleido connection Url by doing the following:

-   Click on the newly created ethereum node above.
-   Click on the _+ Connect Node_ button.
-   Under _Select a Connection Type_ click the _VIEW DETAILS_ button under _NATIVE JSON/RPC_.
-   Select the _App Credential_ you created above and enter the password for it in the _SECRET KEY_ field and click the _SUBMIT_ button
-   In the new page, select _HTTPS_ under the _JSON/RPC_ panel, scroll to the _Auth Type - INURL_ section and copy the _CONNECTION URL_ displayed there.

Then save the kaleido config by setting the "mnemonic" phrase you got when creating the wallet and also the "CONNECTION URL" copied from the above step. The `secrets.json` file should look like below:

```json
{
    "mnemonic": "YOUR SECRET MNEMONIC",
    "kaleidoUrl": "username:password@kaleidonodeurl"
}
```

In the `truffle.js` file replace the current infura configuration with the kaleido configuration. By replacing the lines:

```javascript
    rinkeby: {
        provider: new HDWalletProvider(secrets.mnemonic, "https://rinkeby.infura.io/v3/"+secrets.infuraApiKey),
        network_id: '4'
    }
```

with the lines:

```javascript
    production: {
        provider:  new HDWalletProvider(secrets.mnemonic, secrets.kaleidoUrl),
        network_id: '*',
        gas: 4700000
    }
```

#### Setup Metamask

You also need to install and setup [metamask](https://metamask.io/) which is a web3 provider for browsers.

Once metamask is setup in your browser, do the following:

-   Click on the metamask extension/add-on in your browser to open it.
-   Click on the _Import using account seed phrase_ link displayed on the extension before you login.
-   In the new page enter the mnemonic phrase copied from above and enter a new password for the account.
    -   Be careful with this step as it overwrites any existing accounts you had in metamask. Make sure you **backup** the seed phrases of any existing accounts before importing the above phrase, otherwise you **will lose** access to your account(s) if they are not backed up anywhere else.
-   Then login into metamask using the password you created in the above step and copy the address of the wallet by clicking on the account name.
-   This address should match the address derived when creating the new mnemonic phrase above.

Configure metamask to connect to the above kaleido node by doing the following:

-   Login to MetaMask.
-   In the _networks_ dropdown, select the _Custom RPC_ option.
-   Enter "Kaleido" under _network name_ in the new page and enter the kaleido connection url from above i.e., "username:password@kaleidonodeurl" as the network _New RPC URL_ and click _Save_. You can leave the rest of the fields blank for now.

#### Fund the Ethereum Wallet

To fund the Ethereum wallet created above do the following:

-   Go the kaleido dashboard, select your consortium and then your environment.
-   Under the _SERVICES_ table, click on the _Ether Pool_ option i.e., the 3 dots at the end of the row and then select _Fund Account_.
-   On the new page, paste the wallet address copied from metamask above, enter the amount of ETH you want to fund the account with, and click _FUND_.

This now adds the funds to the address associated with the wallet and metamask reflects this if you select the _kaleido_ network created above. Note that these funds are **not real** and can't be used for transactions in the main Ethereum network, but can be used for blockchain transactions in the private kaleido network.

#### Setup the dApp in AWS

After connecting to the kaleido node created above via metamask and funding the account, its time to deploy the dApp to AWS by taking the following steps:

1.  SSH login to the newly created AWS EC2 instance.
2.  Clone via git the [react project](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/truffle-react-box-frontend) repo forked above to the instance.
3.  Change directory (`cd`) to the `truffle-react-box-frontend` folder to deploy the contracts via truffle by doing the following:

    1.  Install the truffle package globally via the command `npm i truffle -g`.
    2.  Compile the smart contracts via the command `truffle compile`.
    3.  Deploy the contracts to the Kaleido private Ethereum Blockchain node created above via the command `truffle migrate`.
    4.  If you take a look at the Block Explorer in Kaleido, you should see that new transactions executed for the `Bounties` smart contract.
    5.  You can test the contract in the Truffle Console via the command `truffle console --network production` which opens a console where you can interact with the deployed contract.
    6.  If you make any changes to the smart contract, you need to re-deploy them to the kaleido node via the commands `truffle compile && truffle migrate`.

4.  After the contract deployment, change directory (`cd`) to the react project i.e., `cd truffle-react-box-frontend/client/` and install the required node dependencies via the command `npm install`.
5.  Edit the file `truffle-react-box-frontend/client/src/App.js` to reflect the above kaleido changes and replace the following lines.

```js
const etherscanBaseUrl = "https://rinkeby.etherscan.io";
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs";
```

with

```js
const etherscanBaseUrl = "https://console.kaleido.io/environments/{consortiumId}/{environmentId}/explorer";
const ipfsBaseUrl = "username:password@kaleidoIPFSUrl/ipfs";
```

You can get the `consortiumId` and `environmentId` variables by manually opening the kaleido block explorer in your browser and then copy and pasting the url generated.

The `kaleidoIPFSUrl` is the IPFS Url we generated when setting up an IPFS node above.

Change the file `/truffle-react-box-frontend/client/src/utils/IPFS.js` and replace the line:

```js
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
```

With the line:

```js
const ipfs = new IPFS({ provider: 'username:password@kaleidoIPFSUrl', protocol: 'https' });
```

6.  Edit `/etc/httpd/conf/httpd.conf` to the following:

```conf
<Directory "/var/www/html">
    #
    # Possible values for the Options directive are "None", "All",
    # or any combination of:
    #   Indexes Includes FollowSymLinks SymLinksifOwnerMatch ExecCGI MultiViews
    #
    # Note that "MultiViews" must be named *explicitly* --- "Options All"
    # doesn't give it to you.
    #
    # The Options directive is both complicated and important.  Please see
    # http://httpd.apache.org/docs/2.4/mod/core.html#options
    # for more information.
    #
    Options Indexes FollowSymLinks

    #
    # AllowOverride controls what directives may be placed in .htaccess files.
    # It can be "All", "None", or any combination of the keywords:
    #   Options FileInfo AuthConfig Limit
    #
    AllowOverride All

    Options -MultiViews
    <IfModule mod_rewrite.c>
	    RewriteEngine On
	    # If an existing asset or directory is requested go to it as it is
	    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
	    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
	    RewriteRule ^ - [L]
	    # If the requested resource doesn't exist, use index.html
	    RewriteRule ^ /index.html
	</IfModule>

    #
    # Controls who can get stuff from this server.
    #
    Require all granted
</Directory>
```

7.  Restart the apache server for these changes to apply, with the command `sudo service httpd start`.
8.  Build the dApp for production running the CLI command `npm run build` inside the folder `truffle-react-box-frontend/client/`.
9.  Copy and paste all the files and folders inside the `truffle-react-box-frontend/client/dist/` folder into the apache folder i.e., `cd dist/ && cp -R * /var/www/html/`.
10. Navigate to the IP address of the EC2 instance and the dApp is displayed. You should be able to interact with the dApp via metamask using the `Kaleido Custom RPC` as expected.
    1.  If you change the dApp, repeat steps 7 to 9 to see your changes.

<!-- TODO: Do you need Apache? What about node server? -->


---

- **Kauri original title:** Deploying a full-stack dApp to Amazon EC2
- **Kauri original link:** https://kauri.io/deploying-a-full-stack-dapp-to-amazon-ec2/26165036e74b44a69e6aeb2137c71d54/a
- **Kauri original author:** Mulili Nzuki (@mulili)
- **Kauri original Publication date:** 2019-09-27
- **Kauri original tags:** ethereum, dapp, ec2, kaleido, aws
- **Kauri original hash:** QmasJddMj3KSnxAGxVgsaFRJJL9hzzygFydJJ1t9Ubu59r
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



