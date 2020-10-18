---
title: The GETH Simulated Backend
summary: I am in the process of releasing my very hacky golang test environment that deep links into the go-ethereum code base. I first developed it in 2017 to test the HelloGold GOLDX token which required simulating up to 20 years of admin fees and monthly reward allocations. I am creating a series of really small easy to understand posts that both explain what I have done as well as force me to rewrite everything from the old chaotic hack to what is hopefully a far cleaner (but still hacky) version. Th
authors:
  - Dave Appleton (@daveappleton)
date: 2019-08-08
some_url: 
---

# The GETH Simulated Backend


I am in the process of releasing my very "hacky" golang test environment that deep links into the go-ethereum  code base.

I first developed it in 2017 to test the HelloGold GOLDX token which required simulating up to 20 years of admin fees and monthly reward allocations. 

I am creating a series of really small easy to understand posts that both explain what I have done as well as force me to rewrite everything from the old chaotic hack to what is hopefully a far cleaner (but still hacky) version.

The single main component that makes the testing environment possible is the Simulated Backend built into the GETH source libraries. The simulated backend is a GETH Ethereum Virtual Machine that you can initialise, submit transactions to, seal blocks and, in fact, treat as if it were a private blockchain node.

So let's start with an insanely simple example - creating a simulated blockchain with a single account holding a specific amount of ether. I usually use a function called getClient to connect to whatever backend I am using.

To understand this 

- we use `getAddress` from my memorykeys library that returns an address tied to a role. [1][2]
- we use `StrToEther` from my etherUtils library to return a big Int value representing the ether value a string[3]

```
var baseClient *backends.SimulatedBackend

func getClient() (client *backends.SimulatedBackend, err error) {
	if baseClient != nil {
		return baseClient, nil
	}
	funds, _ := etherUtils.StrToEther("10000.0")
	baseClient = backends.NewSimulatedBackend(core.GenesisAlloc{
		getAddress("banker"): {Balance: funds},
	}, 8000000)
	return baseClient, nil
}
```

We now have a backend with one account (which I called the banker) with a balance of 10,000 ether

you can check this with the following code

```
func main() {
	client, err := getClient()
	if err != nil {
		log.Fatal(err)
	}
	bal, err := client.BalanceAt(context.Background(), getAddress("banker"), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(etherUtils.EtherToStr(bal))
}
```
Assuming that you have added GETH, memorykeys and etherUtils , your environment should now set up the imports for you and you will see balance of 10k ether displayed

```
go run sbe.go keyUtils.go 
10000.000000000000000000
```

Now that we have the simulated back end working - in the next post we will get some transactions moving

Notes :

1. https://github.com/DaveAppleton/memorykeys
2. https://kauri.io/article/7a0c7497951548b8837634305e62977b/v2/generating-a-load-of-keys-for-testing-in-go
3. https://github.com/DaveAppleton/etherUtils

