---
title: Publishing to the Decentralized Web with Android, Ethereum, and IPFS
summary: What happens when you combine Android, the worlds most popular mobile operating system, with the newest, user-empowering, decentralized web technologies? Perhaps the above question is a bit premature. After all, the decentralized web, or Web 3.0 , is hardly more than a buzz term touted by public blockchain projects that have yet to achieve the technical capabilities required for long term impact and viability. Yet already in March 2019, scattered across the decentralized web’s collective open so
authors:
  - Cameron Voell (@cvoell)
date: 2019-03-13
some_url: 
---

# Publishing to the Decentralized Web with Android, Ethereum, and IPFS

![](https://api.kauri.io:443/ipfs/QmR33xfXcZ49mqZwHt1XY5SNC32BhzSdHEMDN7sGVoSwRi)
##What happens when you combine Android, the world's most popular mobile operating system, with the newest, user-empowering, decentralized web technologies?
Perhaps the above question is a bit premature. After all, the decentralized web, or 
[Web 3.0](https://medium.com/r/?url=http%3A%2F%2Fgavwood.com%2Fweb3lt.html)
 , is hardly more than a buzz term touted by public blockchain projects that have 
[yet to achieve](https://medium.com/r/?url=https%3A%2F%2Fmedia.consensys.net%2Fthe-inside-story-of-the-cryptokitties-congestion-crisis-499b35d119cc)
 the technical capabilities required for long term impact and viability. Yet already in March 2019, scattered across the decentralized web’s collective open source Github code repositories, there exist the frameworks and tools that will set the foundation for how entirely peer to peer mobile apps may function on fully decentralized architecture in the future.
For the past two years, much of my informal research has been motivated by the belief that 
**if I could create a prototype that demonstrates the power of the combination of Android and Web 3.0, maybe that process would produce some interesting insight into the future of the internet…**
 

![](https://api.kauri.io:443/ipfs/QmUmnYekYBJmcP6r8XohAawNXCv1tpjSQLiG3qcE7K3sMy)

So I created 
[Ether Cyrcus](https://medium.com/r/?url=http%3A%2F%2Fcyrcus.net)
 , an example Android app which illustrates how to create, browse, and support publications, all stored and run using free, 
[open source software](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fethercyrcus)
 on users’ smartphones. There are three primary capabilities in the app that are impossible without Ethereum. Firstly, publication admins can share ETH tips from readers with publication authors according to contractual terms that are transparent and immutable. Secondly, authors can register hashes of their content to the Ethereum blockchain with their digital signature, thus providing a “ 
[poor man’s copyright](https://medium.com/r/?url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPoor_man%2527s_copyright)
 ” functionality. Thirdly and most importantly (and controversially), publications are created in a permissionless manner, stored on peer to peer infrastructure that can not be taken down by anyone. The android app’s unique usage of an in-app Ethereum Light Client and IPFS node makes these claims even stronger.

### ARTICLE ORGANIZATION
First I’d like to describe the 
**TECHNICAL CHALLENGES**
 of building the decentralized app (or dapp), so that other developers can learn from my process. For non developers, I recommend skipping down to the 
**CONCLUSIONS**
 section, where I’ll describe what this dapp building process reveals about the trajectory of blockchain technology and the future potential of the decentralized web.

### TECHNICAL CHALLENGES
The most interesting advantage to creating a dapp on Android is that it is possible to include in the native Android app an Ethereum Light Client node, and an IPFS node. With those pieces in place, the strong guarantees of Ethereum, “ 
[applications that run exactly as programmed without any possibility of downtime, censorship, fraud, or third-party interference](https://medium.com/r/?url=https%3A%2F%2Fethereum.org%2F)
 ,” get extended all the way up through the user interface, in an application that can be accessed by anyone with an Android phone and an internet connection. This can be contrasted with building static web pages for dapps that rely on browsers to glue the interface to a remote trusted Ethereum node, or desktop apps that typically do not reach as wide an audience as Web or Native mobile apps. In the next three sections I’ll walk through three key technical challenges and the short, medium, and long term strategies for addressing them.
 
**Challenge 1 — Ethereum Light Clients**
 
Pretty much everything you need for getting the Geth Ethereum Light Client running on Android can be found in Geth documentation 
[here](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fethereum%2Fgo-ethereum%2Fwiki%2FMobile%253A-Introduction)
 , with additional Account Management documentation found 
[here](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fethereum%2Fgo-ethereum%2Fwiki%2FMobile%3A-Account-management)
 . The first issue you might encounter is that when you start up your Light Client it does not always connect to any peer nodes, and therefore it can not sync block headers. This is because there must be sufficient full client nodes on the network with --lightserv option enabled for serving data to Light Client nodes.
The immediate way of fixing this is running your own Ethereum node with --lightserv enabled on your laptop or a cloud server using digital ocean or some other cloud service. One problem with this is that your node can fill up with other Light Clients that are also trying to connect. To get around this, on your full node you can run 
[addTrustedPeer](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fethereum%2Fgo-ethereum%2Fpull%2F16333)
 with the Enode address of the Light Client node running in your android app. To automate this, we can have our Android app send an HTTP Request containing its Enode to a lightweight server process listening on the server that contains our full Ethereum node. We then have that lightweight server process issue a RPC command to our server’s Ethereum full node to addTrustedPeer the Enode that just issued a HTTP Request to our server. See the code samples below for getting this initial setup for testing Light Clients on Android.
Geth options on server:

```
geth --rinkeby --datadir=~/.rinkeby --cache=2048 --bootnodes=enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303 --port 30305 --rpcapi admin --rpc --maxpeers 10 --lightserv 80 --lightpeers 1 console 2> ~/.rinkeby/Rinkeby.log
```


Lightweight Golang server code for issuing addTrustedPeer RPC command:

```
func listenForTrustedNodeRequest(w http.ResponseWriter, r *http.Request) {
  enodeAddress := r.URL.Path
  enodeAddress = strings.TrimPrefix(enodeAddress, "/")
  enodeAddressWithSlash := enodeAddress[:6] + "/" + enodeAddress[6:]
  command := "/usr/bin/curl -X POST --data '{\"jsonrpc\":\"2.0\",\"method\":\"admin_addTrustedPeer\",\"params\":[\""
  command += enodeAddressWithSlash
  command += "\"], \"id\":1}' localhost:8545 -H \"Content-Type: application/json\""
  cmd := exec.Command("sh", "-c", command);
  cmdOutput := &bytes.Buffer{}
  cmd.Stdout = cmdOutput
  err := cmd.Run()
  if err != nil {
    os.Stderr.WriteString(err.Error())
  }
  fmt.Println(string(cmdOutput.Bytes()))
  fmt.Println(enodeAddressWithSlash)
  w.Write([]byte(command))
}
func main() {
  http.HandleFunc("/", listenForTrustedNodeRequest)
  if err := http.ListenAndServe(":8080", nil); err != nil {
    panic(err)
  }
}
```


Android app code for sending Enode to the server:

```
private String sendAddTrustedPeerRequest() {
 try {
        URL myUrl = new URL(SERVER_IP_ADDRESS + "enode://" + mNode.getNodeInfo().getEnode().substring(8, 136) + "@" + MY_IP_ADDRESS + ":" + mNode.getNodeInfo().getListenerPort());
        HttpURLConnection connection = (HttpURLConnection) myUrl.openConnection();
        connection.connect();
        InputStreamReader streamReader = new
 InputStreamReader(connection.getInputStream());
        BufferedReader reader = new BufferedReader(streamReader);
        StringBuilder stringBuilder = new StringBuilder();
        String inputLine;
 while ((inputLine = reader.readLine()) != null) {
            stringBuilder.append(inputLine);
        }
        reader.close();
        streamReader.close();
        String response = stringBuilder.toString();
 return response;
    } catch (Exception e) {
        Log.e("AddTrustedPeer", e.getMessage());
 return e.getMessage();
    }
}
```


 
**With those two pieces of code in place, we can finally guarantee that our Light Client will connect to Ethereum, regardless of how many other Light Clients are on the network**
 . Of course if this application was running in the wild, we would need some way to authenticate our addTrustedPeer requests, so our Ethereum node would not get its capacity filled by every Light Client node on the network. If we need to somehow restrict access to addTrustedPeer on our server how is this any better than connecting to a remote trusted node over RPC? In the remote trusted node case, you can be shut off by anyone who controls the node. In the Light Client case, addTrustedPeer only guarantees that you 
_can_
 connect, but if there is any other benevolent node on the network running with lightserv option and empty capacity, you will be able to connect regardless if you can get a node to add you as a trusted node. This seems alright for the short term, but how can we do better going forward?
In the medium term, we can use a service like 
[Vipnode](https://medium.com/vipnode/vipnode-2-0-released-9af1d65b4552)
 that incentivizes people to run Light Client serving Ethereum nodes. In the longer term, we are going to need a more standardized and decentralized incentivization protocol for serving Light Clients, perhaps utilizing some of the learnings from the Ethereum Swarm network. A request credits scheme for serving Light Clients is discussed in 
[this presentation](https://medium.com/r/?url=https%3A%2F%2Fyoutu.be%2FlQAoA_BJaSM%3Ft%3D440)
 by Robert Habermeier at DevCon3 in Cancun.
 
**Challenge 2 — IPFS node for Decentralized Data Storage**
 :
Code illustrating how to run an IPFS node on Android can be found at Ethereum Foundation developer Ligi’s IPFSDroid open source project on 
[Github](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fligi%2FIPFSDroid)
 . With an IPFS node running on each Android app instance, each user’s mobile phone becomes a data server that can help the dapp network requests scale. Performance issues aside (nontrivial), there is one key problem with posting data to IPFS from within our dapp. If we “IPFS add” our content, and then go offline before anyone requests that data, then the data will not be available while we are offline. How can we ensure that data that we post to the dapp remains available after the IPFS node that adds the content goes offline?
To solve this problem in the short term, I utilized a strategy I discovered was used by 
[AKASHA](https://medium.com/r/?url=https%3A%2F%2Fakasha.org%2F)
 , and coded up by lead Go-Etheruem developer Péter Szilágyi. Basically we post the IPFS hash to a solidity contract event on Ethereum right after we run our IPFS add command on the data. A remote server will be triggered by the Ethereum event, and then request the IPFS hash and “IPFS pin” it on our server. As long as someone somewhere is running this service when we add our data, it will stay pinned on that server when we go offline. Péter’s implementation for listening to AKASHA contracts and pinning data can be found 
[here](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fkaralabe%2Fakasha-gateway)
 . The code for my simplified implementation utilizing Peter’s ipfs.go pinning code can be found 
[here](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fethercyrcus%2Fserver-gateway)
 . Here is my simplified Ethereum event listening Golang code:

```
func main() {
   //Create and Boot up the IPFS node
   ipfs, err := makeIpfs(filepath.Join(os.Getenv("HOME"), ".ethercircus"))
   if err != nil {
      log.Crit("Failed to create IPFS node", "err", err)
   }
   defer ipfs.Close()
   // Create an IPC based RPC connection to a remote node
   conn, err := ethclient.Dial("~/.rinkeby/geth.ipc")
   if err != nil {
      log.Crit("Failed to connect to the Ethereum client: %v", err)
   }
   // Instantiate the contract and display its name
   publicationRegister, err := gocontracts.NewPublicationRegister(common.HexToAddress("0x18BC6842b400b09D5CC06aBfB7522a12d8F23579"), conn)
   if err != nil {
      log.Crit("Failed to instantiate the PublicationRegister contract: %v", err)
   }
   var blockNumber uint64 = 2530622
   ch := make(chan *gocontracts.PublicationRegisterStoreData)
   opts := &bind.WatchOpts{}
   opts.Start = &blockNumber
   storeDataSub, err := publicationRegister.WatchStoreData(opts, ch)
   if err != nil {
      log.Crit("Failed WatchStoreData: %v", err)
   }
   go func() {
      defer storeDataSub.Unsubscribe()
      for {
         //received an Ethereum Contract Event
         var newEvent *gocontracts.PublicationRegisterStoreData = <-ch
         fmt.Println(newEvent.Data)
         go func() {
            ctx, cancel := context.WithTimeout(context.Background(), 25*time.Second)
            defer cancel()
            _, err := ipfs.Content(ctx, newEvent.Data)
            if err == nil {
               fmt.Println("Success!")
            } else {
               fmt.Println("Error ipfs.Content command: " + err.Error())
            }
         }()
      }
   }()
   //Monitor for interrupts and terminate cleanly
   sigc := make(chan os.Signal, 1)
   signal.Notify(sigc, os.Interrupt)
   defer signal.Stop(sigc)
   <-sigc
}
```


This solution to the decentralized data availability pinning problem may be pretty nifty, but it is likely unrealistic for a dapp to rely on an altruistic community of people to be running our open source IPFS pinning support software. In the medium term we can utilize a paid pinning service like 
[Pinata](https://medium.com/r/?url=https%3A%2F%2Fpinata.cloud%2F)
 . In the longer term we will try and integrate incentivized decentralized storage solutions like Ethereum’s 
[Swarm project](https://medium.com/r/?url=https%3A%2F%2Fswarm-guide.readthedocs.io%2Fen%2Flatest%2Fintroduction.html)
 or 
[Filecoin](https://medium.com/r/?url=https%3A%2F%2Ffilecoin.io%2F)
 . Note that for dapps to be truly autonomous they need to avoid centralized points of control in every layer, and this becomes extra tricky when you are dealing with decentralized storage and illegal content. As seen in this 
[Github issue for Filecoin](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Ffilecoin-project%2Fspecs%2Fissues%2F65)
 , this is far from being a resolved issue.
 
**Challenge 3 —Account Management and Scaling**
 
My integration of Android, Ethereum, and IPFS offers some unique solutions to dapp challenges that are not found in many of the common JavaScript only dapps. Unfortunately, for other difficult problems in dapp development such as Account Management and Scaling, I have no unique short term solutions. However these challenges are much more high profile and widely discussed in the Ethereum community. Projects that are in progress that seem most promising to me for these two problems include the following:



 * Account Management: [Walleth](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fwalleth%2Fwalleth) account management API for Ethereum Android apps, Alex Van de Sande’s [Universal Login](https://medium.com/r/?url=https%3A%2F%2Funiversallogin.io%2F) solution, [uPort](https://medium.com/r/?url=https%3A%2F%2Fwww.uport.me%2F) , and [Keyband.io](https://medium.com/r/?url=https%3A%2F%2Fkeyband.io%2F) 

 * Scaling: [State Channels](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2FSpankChain%2Fgeneral-state-channels) as utilized by SpankChain, [Plasma](https://medium.com/r/?url=https%3A%2F%2Fplasma.io%2F) , [Skale Network](https://medium.com/r/?url=https%3A%2F%2Fskalelabs.com%2F) , and of course, [Ethereum 2.0](https://medium.com/r/?url=https%3A%2F%2Fethereum-magicians.org%2Ft%2Fthe-state-of-ethereum-2-0-report-from-kyokan-and-ameen-soleimani%2F2596) or Serenity Sharding + Casper
Before I jump to conclusions (see what I did there), let me state my key takeaway from building my Ether Cyrcus example Android dapp, which is this: 
**Even as the wider development community iterates on long term solutions to dapp account management and scaling, there are other key problems like Light Client connectivity and decentralized data availability that can benefit from a wide breadth of perspectives, so that a fully decentralized, Web 3.0 stack can be achieved as soon as possible.**
 

### CONCLUSIONS
The power of the Android platform allows us to take another step closer to a fully decentralized application stack. Trade-offs between decentralization, and near term viability can be made, but these trade-offs quickly make our dapps’ advantages over centralized architectures disappear.
 
**So what really are dapps’ advantages over their centralized alternatives, and why are these advantages worth so much trouble?**
 
The most obvious examples answering the questions above involve censorship resistance as displayed by a Chinese student 
[publishing to Ethereum](https://medium.com/r/?url=https%3A%2F%2Fqz.com%2F1260191%2Fmetoo-activists-in-china-are-turning-to-the-blockchain-to-dodge-censorship%2F)
 and Catalan activists 
[publishing to IPFS](https://medium.com/r/?url=https%3A%2F%2Fcryptoinsider.com%2Fipfs-first-win-the-catalan-referendum%2F)
 . It is tempting to say that my example dapp is an early sign of a utopian future where things like the 
[Turkish government banning Wikipedia](https://medium.com/r/?url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FBlock_of_Wikipedia_in_Turkey)
 , or 
[Russia removing any online content they deem as fake news or disrespectful to the government](https://medium.com/r/?url=https%3A%2F%2Fwww.nytimes.com%2F2019%2F03%2F07%2Fworld%2Feurope%2Frussia-internet-freedom-speech.html)
 , as technically impossible, because of our decentralization promoting technological innovation. Yet plenty of countries have already 
[banned bitcoin](https://medium.com/r/?url=https%3A%2F%2Fwww.investopedia.com%2Farticles%2Fforex%2F041515%2Fcountries-where-bitcoin-legal-illegal.asp)
 , and it does not seem realistic to ever get significant adoption of “unstoppable” software that is declared illegal by the state that users live in (see 
[No Blockchain is an Island](https://medium.com/r/?url=https%3A%2F%2Fwww.coindesk.com%2Fno-blockchain-island)
 ).
So when Ethereum talks of preventing censorship, fraud, and third-party interference, who are they really talking about? Perhaps it is the administrators of the software themselves:



 *  [Consumer Financial Protection Bureau Fines Wells Fargo $100 Million for Widespread Illegal Practice of Secretly Opening Unauthorized Accounts](https://medium.com/r/?url=https%3A%2F%2Fwww.consumerfinance.gov%2Fabout-us%2Fnewsroom%2Fconsumer-financial-protection-bureau-fines-wells-fargo-100-million-widespread-illegal-practice-secretly-opening-unauthorized-accounts%2F) 

 *  [The CEO of Reddit confessed to modifying posts from Trump supporters after they wouldn’t stop sending him expletives](https://medium.com/r/?url=https%3A%2F%2Fwww.yahoo.com%2Fnews%2Fceo-reddit-confessed-modifying-posts-022041192.html) 

 *  [“Think of the London Interbank Offered Rate (LIBOR) and the recent scandals involving manipulation of benchmark values when they are controlled by a single entity that may not be capable of detecting false or fraudulent data. Blockchain could provide greater transparency around the process of creating agreed upon reference prices, and allow more people to participate in the consensus process.”](https://medium.com/r/?url=https%3A%2F%2Fswiftinstitute.org%2Fdownload%2Fhow-blockchain-will-impact-the-financial-sector%2F) 

 *  [The study required [Facebook] researchers to manipulate the News Feeds of roughly 689,000 users to determine whether positive or negative content would affect their emotions and subsequent Facebook updates.](https://medium.com/r/?url=https%3A%2F%2Fwww.usatoday.com%2Fstory%2Ftech%2F2014%2F06%2F30%2Ffacebook-study%2F11756525%2F) 
As you see in the examples above, when administrators of important software can manipulate that software for their own gain, at the expense of the users of that software, they very often do. 
**Dapps offer us the chance to prove the removal of our own ability to abuse administrator rights over the software that is playing an increasingly important role in people’s lives.**
 
If you would like to hear more about publishing to Web 3.0, or the future of the fully decentralized dapp stack utilizing Ethereum, keep an eye out for future articles and reach out to me in the comments or on twitter 
[@cvoell](https://medium.com/r/?url=https%3A%2F%2Ftwitter.com%2Fcvoell)
 .
