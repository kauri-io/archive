---
title: Deploying a full-stack dApp to Google Cloud
summary: In the previous tutorials in this series, we saw how to develop a full-stack ethereum-based blockchain dApp. In this tutorial, we learn how to deploy the dApp to two of Googles Cloud offerings, Firebase, and Cloud storage. Google Cloud is a suite of products similar to Amazons AWS, ranging from computation and databases to storage. Google Firebase is an abstraction and subset of Google Cloud, making it easier for developers to use Google Cloud infrastructure. For example, Firebase Functions is a
authors:
  - David T (@david-t)
date: 2019-10-03
some_url: 
---

# Deploying a full-stack dApp to Google Cloud

![](https://ipfs.infura.io/ipfs/QmV3aiCbkwhcn82wNr3m15qQQ1r1Y4E1GQTDbMdTjWKEM3)


In the previous [tutorials in this series](https://kauri.io/collection/5b8e401ee727370001c942e3), we saw how to develop a full-stack ethereum-based blockchain dApp.

In this tutorial, we learn how to deploy the dApp to two of Google's Cloud offerings, Firebase, and Cloud storage.

Google Cloud is a suite of products similar to Amazon's AWS, ranging from computation and databases to storage.

Google Firebase is an abstraction and subset of Google Cloud, making it easier for developers to use Google Cloud infrastructure. For example, Firebase Functions is an easier interface to Cloud Functions. Similarly, Firebase Storage and Hosting is an abstraction built on top of Cloud Storage.

In this tutorial, we cover deploying a dApp to both _Firebase_ and/or _Google Cloud Storage_.

If you are looking for fully-featured static hosting, then Firebase is the recommended option. Benefits include:

-   Free https certificate for your domain
-   Free hosting and subdomain from Google (both a `yourproject.web.app` and `yourproject.firebaseapp.com` domains)
-   No complicated setup with CNAME records and bucket setups (e.g. setting up permissions, etc.)
-   An easy to use rollback/release history
-   No billing setup needed

If you would rather have a barebones static hosting solution, then Google Cloud Storage may be more suited. However, you need to have a domain name ready, be OK with changing some domain records and need to set up your own https certificates (if needed).

For more information on the Google Cloud products and options, see the official [Serving Websites](https://cloud.google.com/solutions/web-serving-overview) documentation.

### Prerequisites

We assume that you have followed and completed the previous tutorials in this series, and now have:

-   A truffle project setup and working,
-   Your truffle project contains smart contract code,
-   Your truffle project has an existing frontend (in React),
-   You have deployed your smart contract code to [Rinkeby using Infura](https://kauri.io/article/86903f66d39d4379a2e70bd583700ecf/v14/truffle:-adding-a-frontend-with-react-box#deploy), and
-   Your React frontend (on localhost) is communicating with your smart contracts on Rinkeby.

### Firebase

#### Sign up

1.  [Sign up for Firebase](https://console.firebase.google.com/) using your Google account.
2.  Follow the instructions to create a new Firebase project.
3.  When prompted on the _Project Overview_ page, select _Web_ to create a new web project.
4.  Name your web app and check the box for _Also setup Firebase Hosting for this app_.
5.  You don't need to add the Firebase SDK, so skip the step if asked.

#### Local setup

1.  In terminal, install the Firebase CLI:

    ```shell
    npm install -g firebase-tools
    ```

2.  In the same terminal, sign in to Firebase:

    ```shell
    firebase login
    ```

3.  Still in terminal, navigate to the fullstack dApp root directory using the `cd` command (e.g. `cd truffle-react-box-frontend/`), and initiate the project with `firebase init`.

    -   When prompted, select _Hosting_, press space bar to select it, then enter to go to the next screen.
    -   When prompted, select _Use an existing project_, then select the project you created on the Firebase website.
    -   When asked _What do you want to use as your public directory?_,  press enter. We will change this manually later.
    -   When asked _Configure as a single-page app (rewrite all URLs to /index.html)?_, select _y_.

#### Making deployment easy

1.  In your editor, open the newly created `firebase.json` file.
    -   Replace
            ```json
            "public": "public",
            ```
            with:
            ```json
            "public": "client/build",
            "predeploy": [
                "cd client && npm run build"
            ],
            ```
        This change tells Firebase to build your React dApp frontend, then use those build files to deploy to Firebase Hosting.
2.  You are now ready to deploy. From your terminal (still in the fullstack dApp root directory), enter:

    ```shell
    firebase deploy
    ```

#### Accessing your dApp

1.  Congratulations, your dApp is now live, hosted on Google's scalable infrastructure thanks to Firebase. You can access your dApp by going to the provided `Hosting URL` shown in the terminal.
2.  Whenever you update your React frontend code, repeat step 2 in [Making deployment easy](#making-deployment-easy) to update your live dApp frontend code.

### Google Cloud Storage

#### Initial setup

1.  Select or create a GCP project on the [project selector page](https://console.cloud.google.com/projectselector2/home/dashboard?_ga=2.107617601.-277740605.1569517720)
    -   If you are creating a new project, select the _Create_ in the top right, name your project, and add it to an organization if you would like to keep things organized.
2.  Since we are utilizing Cloud Storage, you need to enable billing on your account. You will only be charged for costs above the [generous free tier](https://cloud.google.com/storage/pricing).
    -   You can learn how to [enable billing for the project here](https://cloud.google.com/billing/docs/how-to/modify-project).
    -   If you already have a billing account added to GCP, then you can choose this billing account from the [manage billing accounts page](https://console.cloud.google.com/billing?_ga=2.73604561.-277740605.1569517720)
3.  You need to have a domain you own. In this tutorial, we use the domain "example.com" as a placeholder.
    -   To verify that you own the domain and can use it with Cloud Storage, you need to follow the steps to [verify that you own or manage the domain](https://cloud.google.com/storage/docs/domain-name-verification#verification).
    -   If you purchased your domain name via Google Domains, then verification is automatic.

#### Create a CNAME record

-   Once you have completed the above, you need to add a CNAME record to your domain. Consult the support documentation of your domain provider to find out how to add one.

    -   Create a `CNAME` record that points to "c.storage.googleapis.com"

        ```text
        NAME                TYPE    DATA
        www.example.com     CNAME   c.storage.googleapis.com
        ```

#### Create a Google Storage bucket

-   Go to the [Cloud Storage browser](https://console.cloud.google.com/storage/browser?_ga=2.40579681.-277740605.1569517720) and create a bucket whose name matches the CNAME you created.
    -   Enter the bucket information and choose the _default_ settings for each step.

#### Install the `gsutil` tool

The `gsutil` utility helps you use the Google Cloud platform from the terminal. Follow the instructions to [Install the Cloud SDK](https://cloud.google.com/sdk/docs/). When prompted, choose the project that you created initially.

#### Upload the dApp's static files

1.  From the terminal, navigate to the fullstack dApp root directory using the `cd` command (e.g. `cd truffle-react-box-frontend/`).
2.  As you would for any React.js based app, create an optimized production build of your frontend:
    -   Navigate to the `client/` directory and run the command: `npm run build`
3.  In the same `client/` directory, run the command:

    ```shell
    gsutil rsync -R build gs://www.example.com
    ```

    -   This uploads all the contents of your `client/build/` directory to the Storage bucket you created

#### Make all files in your bucket publicly accessible

1.  Since we are only hosting a static website in the bucket, we want all the files to be publicly readable.
    -   In the [Cloud Storage browser](https://console.cloud.google.com/storage/browser?_ga=2.40579681.-277740605.1569517720), select the dApp's website bucket you created.
    -   Select the _Permissions_ tab.
    -   Select _Enable_ in the _Simplify access control with Bucket Policy Only_ alert.
    -   Confirm the selection.
    -   Select _Add members_ and enter "allUsers" in the _New members_ field, with the "Storage Object Viewer" role.
2.  Your bucket is now publicly accessible.
    -   If you set up the CNAME record properly and has propagated, your domain name points to the bucket's contents.
    -   Congratulations, your dApp is now live, hosted on Google Cloud Storage!
3.  Whenever you update your React code, follow the steps in [Deploying your dApp](#deploying-your-dapp) to update your deployed dApp.


---

- **Kauri original title:** Deploying a full-stack dApp to Google Cloud
- **Kauri original link:** https://kauri.io/deploying-a-fullstack-dapp-to-google-cloud/2ee06d313ffa41348f916afa13a78bbd/a
- **Kauri original author:** David T (@david-t)
- **Kauri original Publication date:** 2019-10-03
- **Kauri original tags:** dapp, google-cloud, firebase, deploy
- **Kauri original hash:** QmfKHpAtBoPdVe6QWu48Pz1eVEHiAc36vqvPybXS892aSY
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



