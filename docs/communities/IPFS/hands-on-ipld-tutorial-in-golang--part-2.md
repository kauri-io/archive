---
title: Hands-on IPLD Tutorial in Golang  PART 2
summary: This article was first published on our open-source platform, SimpleAsWater.com. If you are interested in IPFS, Libp2p, Ethereum, Zero-knowledge Proofs, DeFi, C
authors:
  - Vaibhav Saini (@vasa)
date: 2020-01-16
some_url: 
---

# Hands-on IPLD Tutorial in Golang  PART 2

![](https://ipfs.infura.io/ipfs/QmVo6CzDQJc5KYz64yxTKcWqpofSTjRHme6pgqeRE8BUCk)


This article was first published on our open-source platform, [SimpleAsWater.com](https://simpleaswater.com/hands-on-ipld-tutorial-in-golang-2/?ref=kauri). If you are interested in IPFS, Libp2p, Ethereum, Zero-knowledge Proofs, DeFi, CryptoEconomics, IPLD, Multiformats, and other Web 3.0 projects, concepts and interactive tutorials, then be sure to check out [SimpleAsWater](https://simpleaswater.com?ref=kauri).

---

#### Quick recap from PART-1 


Before we explore how to use IPLD for document store based interface, have you read the PART 1 of this series yet? Here's the link to PART 1 in case you want to catch up! 



[Getting Started with IPLD: Hands-on IPLD Tutorial in Golang: PART 1](https://simpleaswater.com/hands-on-ipld-tutorial-in-golang-2/?ref=kauri)


***TLDR:*** In PART 1 , we explored the basic concepts of IPLD, how it is used in IPFS. We also scratched the surface by building a key-value based database interface on IPFS using IPLD. 



#### What We Will Learn from PART-2? 🤔 


In PART 2 of the series, we will directly dive into the coding and see how to enhance the functionality to build a document storage (similar to MongoDB and other document databases). 

***If you get stuck in any part or have any queries/doubts, then feel free to reach us out on our [discord channel](https://discord.gg/x2kmUXW).***


Here is final shown down 😎 


![Final IPLD Document Store in Golang](https://asciinema.org/a/293822.svg)


#### Changing the Data Structures 🛠 


In contrast to PART 1, our data structure will be a structure which will be further mapped by a `string` type key. Each document entry we store is of the following format. This is very similar to how you develop schemas: 



```go
// SampleStruct defines the benchmark payload
type SampleStruct struct {
	ID     string `json:"ID"`
	Name   string `json:"Name"`
	Salary string `json:"Salary"`
}

```


As shown above, we have defined `SampleStruct`, which defines three fields representing an employee's data record. This means, we can contain each employee's `ID`, `Name` and corresponding `Salary` amount in the structure's instances. 


#### Changing the Way We Track Entries 🧐 


Further, we need to manage this relationship in a mapping by it's own `ID` to facilitate Read or Lookup operations for each employee record. Hence, we update the current mapping as follows: 


```go
// Map the struct instance it's own ID
DocStoreMap := make(map[string]SampleStruct)

```



#### Taking User Input 👨‍💻👩‍💻 


Now, we can ask users to enter the values for all the three fields as defined in the `SampleStruct`. Once we have the value for all the three fields (namely `ID`, `Name` and `Salary`), we can initiate an object/instance based on the definition and assign the received values as follows: 


```go
scanner := bufio.NewScanner(os.Stdin)

fmt.Println("Enter the ID of the employee: ")
scanner.Scan()
inputID := scanner.Text()

fmt.Println("Enter the name of the employee: ")
scanner.Scan()
inputName := scanner.Text()

fmt.Println("Enter the salary of the employee: ")
scanner.Scan()
inputSalary := scanner.Text()

// Create a struct instance and assign the input values to the corresponding fields
employeeObject := SampleStruct{ID: inputID, Name: inputName, Salary: inputSalary}

```



#### The Document-Storage Magic 🔮✨ 


Once the object is created and the captured values are assigned, we can map the same object in the mapping by it's own `ID` value. Once the mapping is updated, we can now write it to the Merkle DAG as follows: 


```go
// Map the struct instance to the mapping
DocStoreMap[inputID] = employeeObject

// Converting the map into JSON object
entryJSON, err := json.Marshal(DocStoreMap)
if err != nil {
    fmt.Println(err)
}

// Display the marshaled JSON object before sending it to IPFS
jsonStr := string(entryJSON)
fmt.Println("The JSON object of your document entry is:")
fmt.Println(jsonStr)

start := time.Now()
// Dag PUT operation which will return the CID for futher access or pinning etc.
cid, err := sh.DagPut(entryJSON, "json", "cbor")
elapsed := time.Since(start)
if err != nil {
    fmt.Fprintf(os.Stderr, "error: %s", err)
    os.Exit(1)
}

```



If you are scratching your heading thinking what does a DAG means &amp; what does `DagPut` function do, then we recommend going through the PART 1 of the series. 


We have now successfully written the mapping to the IPLD DAG and a CID may be returned. Yay🎉🎉 



#### A Change in Reading DAGs for Entries 


Now, we must update our code to read the document from the mapping. In contrast to PART 1, the read operation will not be returning a mere single-value. It will be returning the whole JSON document as defined in the schema. Hence, we update the getter function by changing the return type as follows: 



```go
// GetDocument handles READ operations of a DAG entry by CID, returning the corresponding document
func GetDocument(ref, key string) (out SampleStruct, err error) {
	err = sh.DagGet(ref+"/"+key, &amp;out)
	return
}

```


Now, let us call this getter/read function in main.go as follows: 



```go
// Fetch the details by reading the DAG for key "inputKey"
fmt.Printf("READ: Reading the document details of employee by ID: \"%s\"\n", inputID)
start = time.Now()
document, err := GetDocument(cid, inputID)
elapsed = time.Since(start)
if err != nil {
    fmt.Println(err)
}

fmt.Printf("READ: Salary of employee ID %s is %s\n", string(inputID), string(document.Salary))

```



As shown above, the `GetDocument` is passed with the `ID` value which was earlier entered by the user. Based on the `ID` value, the corresponding document is returned from the mapping.
Once the document is returned, we can parse it as required and print the `Salary` of the inquired employee. 



#### Conclusion 


We hope you had fun learning how to enhance the code to support document storage. Go crazy and build your own decentralized document database ! 🤪 

***If you get stuck in any part or have any queries/doubts, then feel free to reach us out on our [discord channel](https://discord.gg/x2kmUXW).***

And here is the link to the [**full implementation of the code on GitHub**](https://github.com/0zAND1z/ipld-crud). 


### About the Authors: 


#### Ganesh Prasad Kumble 

![Ganesh Prasad Kumble profile pic](https://simpleaswater.com/content/images/2020/01/image-30.png)


Ganesh is an expert in emerging technologies and business strategy. He has co-founded, bootstrapped, mentored several start-ups and initiatives across SaaS, eCommerce, IoT, Blockchain &amp; AI. 



He is a contributor to several open-source projects including Ethereum and IPFS. He is also a moderator at the Ethereum Research forum. 



Ganesh is currently leading Platform Innovation efforts at [Aicumen Technologies Inc.](https://www.aicumen.com/) &amp; [KIP Foundation](https://www.kip.foundation/), building a general purpose business protocol featuring identity management, third party services, distributed compute and immutable storage. 



He is also the author of the [Hands-on Artificial Intelligence for Blockchain](https://www.amazon.com/dp/B07X42XFD3/ref=cm_sw_su_dp) book. 



#### Vaibhav Saini 


Vaibhav Saini is Co-founder of [TowardsBlockchain](https://signy.io?ref=kauri), [Dappkit](https://dappkit.io?ref=kauri) &amp; [SimpleAsWater](https://simpleaswater.com?ref=kauri). You can know more about him [here](https://www.linkedin.com/in/vasadev/). 


---

- **Kauri original title:** Hands-on IPLD Tutorial in Golang  PART 2
- **Kauri original link:** https://kauri.io/hands-on-ipld-tutorial-in-golang:-part-2/5fa2dc4be27b433d86d571ba857ab02d/a
- **Kauri original author:** Vaibhav Saini (@vasa)
- **Kauri original Publication date:** 2020-01-16
- **Kauri original tags:** merkle-trees, ipfs, simpleaswater, golang, dag, ipld
- **Kauri original hash:** QmZCduoHvo99ASHkrdeajztZTavQb5rcR1rmp8GY9gxUHg
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



