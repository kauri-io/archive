---
title: Deploying a full-stack dapp to Microsoft Azure
summary: In the previous tutorials in this series we saw how to develop a full-stack blockchain dapp. In this tutorial, we learn how to deploy a dapp using Microsoft Workbench Blockchain. Deploy Blockchain Workbench Blockchain Workbench allows you to deploy a blockchain ledger along with a set of Azure services used to build a dapp. Once deployed, Blockchain Workbench provides access to client apps to create and manage users and blockchain applications. The following steps highlight on how to deploy bloc
authors:
  - Sri Sanketh Uppalapati (@srisankethu)
date: 2019-08-16
some_url: 
---

# Deploying a full-stack dapp to Microsoft Azure


In the previous [tutorials in this series](https://kauri.io/collection/5b8e401ee727370001c942e3) we saw how to develop a full-stack blockchain dapp. In this tutorial, we learn how to deploy a dapp using [Microsoft Workbench Blockchain](https://azure.microsoft.com/en-us/features/blockchain-workbench/).

### Deploy Blockchain Workbench

Blockchain Workbench allows you to deploy a blockchain ledger along with a set of Azure services used to build a dapp. Once deployed, Blockchain Workbench provides access to client apps to create and manage users and blockchain applications.

The following steps highlight on how to deploy blockchain workbench:

1.  Sign in to the [Azure portal](https://portal.azure.com/). If you don't have an account, create one and select a suitable service/subscription plan. You can try the "free plan" for 30 days to test the waters.
2.  In the left pane, select **Create a resource**. Search for `Azure Blockchain Workbench` in the **Search the Marketplace** search bar. Select **Azure Blockchain Workbench** and then **Create**
3.  Complete the basic settings and click **OK**, the wizard offers help text on each setting.
4.  In **Advanced Settings**, choose if you want to create a new blockchain network or use an existing blockchain network. To create a new blockchain network, select **Create New** option under _Blockchain Network_ and then choose the _Azure Blockchain Service Pricing Tier_ and _Azure Active Directory Settings_. To use an existing blockchain network, select **Use Existing** under _Blockchain Network_ and set the _Ethereum RPC Endpoint_. Then choose _Azure Active Directory Settings_ and change the _VM Selection_ options if you need to. Click **OK** to finish the Advanced Settings.
5.  Check your settings are correct and click **OK** to deploy your Azure Blockchain Workbench.

Once the deployment of the Blockchain Workbench has completed (which can take around 90 minutes), it creates a new _resource group_ with your Blockchain Workbench resources. You access Blockchain Workbench services through a web URL.

The following steps show you how to retrieve the web URL of the deployed framework:

1.  In the left-hand navigation pane, select **Resource groups**
2.  Choose the resource group name you specified when deploying Blockchain Workbench.
3.  Select the **TYPE** column heading to sort the list alphabetically by type.
4.  There are two resources with type **App Service**. Select the resource of type **App Service** _without_ the "-api" suffix.
5.  In the App Service overview screen, copy the **URL** value, which represents the web URL to your deployed Blockchain Workbench.

#### Azure Active Directory (AD) configuration

Azure Blockchain Workbench requires Azure AD configuration and application registration. You can choose to do the Azure AD [configurations manually](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/deploy#azure-ad-configuration) before deployment or run a script post-deployment. If you are redeploying Blockchain Workbench, read [Azure AD configuration](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/deploy#azure-ad-configuration) to verify your Azure AD configuration.

### Deploy Blockchain applications

To create a blockchain dapp read the previous [tutorials in this series](https://kauri.io/collection/5b8e401ee727370001c942e3) on how to create a full-stack dapp.

Deploying the dapp to Azure needs a JSON configuration file to represent the workflow, application roles and interaction with the blockchain application. View a sample configuration file [here](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/create-app#configuration-file) and find more documentation [here](https://docs.microsoft.com/en-us/azure/blockchain/workbench/configuration).

To create a new contract, you need to be a member specified as a contract **initiator**. For information defining application roles and initiators for the contract, see [workflows in the configuration overview](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/configuration#workflows). For information on assigning members to application roles, see [add a member to application](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/manage-users#add-member-to-application).

To add a blockchain application to Blockchain Workbench, you upload the configuration and smart contract files to define the application.

1.  In a web browser, navigate to the Blockchain Workbench web address which is in the format `https://{workbench URL}.azurewebsites.net/`.
2.  Sign in as a [Blockchain Workbench administrator](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/manage-users#manage-blockchain-workbench-administrators) to assign roles to users.
3.  Select **Applications** > **New**, which displays the **New application** pane.
4.  Select **Upload the contract configuration** > **Browse** to locate the configuration file you created. The configuration file is automatically validated. Select the **Show** link to display validation errors. Fix validation errors before you deploy the application. Repeat the same for smart contract code file by selecting **Upload the contract code** > **Browse** to locate the smart contract code file.
5.  Click **Deploy** to create the blockchain application based on the configuration and smart contract files.

Deployment of the blockchain application takes a few minutes. When the deployment is finished, it displays the new application in **Applications**.

#### Modifying a smart contract

Depending on the state the contract is in, members can take actions to transition to the next state of the contract. Actions are defined as [transitions](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/configuration#transitions) within a [state](https://docs.microsoft.com/en-gb/azure/blockchain/workbench/configuration#states). Members belonging to an allowed application or instance role for the transition can take action.

1.  In the Blockchain Workbench application section, select the application tile that contains the contract to take action.
2.  Select the contract in the list, and this displays details about the contract in different sections.
3.  In the **Action** section, select **Take action**.
4.  This displays the details about the current state of the contract in a pane. Choose the action you want to take in the drop-down.
5.  Select **Take action** to initiate the action.
6.  If the action requires parameters, specify the values for the action.
7.  Select **Take action** to execute the action.

### Conclusion

With active directory support and the permissions it brings, Azure's blockchain support aims itself at enterprise users looking to use Blockchain in their businesses. It offers graphical management of contracts and actions upon them, and a way to update and deploy them, again with permissions to determine who can take these actions. Its setup is not for the faint-hearted, but [sign up for a free trial](https://account.azure.com/signup?offer=ms-azr-0044p&appId=102&ref=azureplat-generic&redirectURL=https%3a%2f%2fazure.microsoft.com%2fen-gb%2fget-started%2fwelcome-to-azure%2f&l=en-gb&correlationId=06AC26C311DF6D6E0E532B7010B46CF4) to see if it suits your use-case.


---

- **Kauri original link:** https://kauri.io/deploying-a-full-stack-dapp-to-microsoft-azure/d37518870cba4caeab6a95624254a6b8/a
- **Kauri original author:** Sri Sanketh Uppalapati (@srisankethu)
- **Kauri original Publication date:** 2019-08-16
- **Kauri original tags:** dapp, blockchain, microsoft, azure
- **Kauri original hash:** QmZADMyymaP9dZstE6NNMHjQEGL16y4oSX4Vw7sq2KD2fS
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



