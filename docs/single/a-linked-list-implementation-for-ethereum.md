---
title: A Linked List Implementation for Ethereum
summary: Coding data structures in Solidity is weird and beautiful. Alberto Cuesta Cañada A few months ago I implemented a Linked List in Solidity for a client. More rec
authors:
  - Alberto Cuesta Cañada (@albertocuesta)
date: 2020-03-02
some_url: 
---

# A Linked List Implementation for Ethereum


Coding data structures in Solidity is weird and beautiful.
----------------------------------------------------------

[![Alberto Cuesta Cañada](https://miro.medium.com/fit/c/96/96/1*FmM57rntjA9sQCNBo5XAPw.jpeg)](https://medium.com/@albertocuestacanada?source=post_page-----a2915bf8122f----------------------)

![](https://ipfs.infura.io/ipfs/QmWPDdkWc4QsW5aC252JBtGebSmAYVcZYXcjfaEFyYc4Fy)

A few months ago I implemented a [Linked List](https://en.wikipedia.org/wiki/Linked_list) in Solidity for a client. More recently I decided that I might take on implementing a Fast Limit Order Book in Solidity as a pet project (aren’t nerds fun!) and Linked Lists appeared again.

As I recently wrote in an article about [when to use different data structures](https://www.techhq.io/8686/how-to-not-run-out-of-gas-in-ethereum/):

**Linked Lists are your data structure of choice when you need to preserve the insertion order, and also when you want to insert in arbitrary positions.**

I love coding [basic building blocks](https://hackernoon.com/ownership-and-access-control-in-solidity-nn7g3xo3) and no one seemed to have done this one\*, so I took to it happily.

In this article I’ll introduce an implementation for Singly and Doubly Linked Lists, which you can reuse or modify for your own purposes. All the [code is available in github](https://github.com/HQ20/contracts/tree/master/contracts/lists) or as an npm package.

![](https://miro.medium.com/max/1920/0*zobE6VzVBV2S2zQo)

![](https://miro.medium.com/max/1920/0*JrPoORpmwzL-RMLa)

\*Disclaimer: While writing this article, and after having coded the contracts, I found this [earlier implementation](https://github.com/ethereum/dapp-bin/blob/master/library/linkedList.sol) from [chriseth](https://github.com/chriseth). Like him, I also considered using an array. Compared to using a mapping, it simplifies the creation of new items but also makes deletion more difficult.


###Implementation

For this article I’m going to ignore that [Solidity is an Object Oriented Programming Language](https://medium.com/coinmonks/solidity-and-object-oriented-programming-oop-191f8deb8316) and code the lists in a single contract. Doing that will allow me to focus on the basics such as data usage. An [OOP implementation is possible](https://github.com/HQ20/contracts/blob/new/lists/oop/contracts/drafts/lists/LinkedListOOP.sol), but the trade offs deserve an article of its own.

Implementing a Linked List in a single contract Solidity was not an obvious thing to do. This code would be very convenient, but not doable in Solidity since you can’t have recursive `structs`.

```
contract ImpossibleLinkedList {
   struct Item {  
      Item next;
      address data;  
   }
Item public head;
```

The only dynamic contract variable that exists in Solidity are mappings. Even arrays are mappings under the hood. Given that constraint the best implementation for a Linked List in Solidity that I could come up is based on this:

```
contract LinkedList {
  struct Item {  
    uint256 id;
    uint256 next;  
    address data;
}  
mapping (uint256 => Item) public items;
uint256 public head;  
uint256 public idCounter;
```

The Linked List is made of `Item`. The `Item` has a unique id, a member for the id of another `Item`, and an address which is the data payload. Then all items created are stored in a mapping indexed by `Item` id.

You can retrieve any `Item` at cost O(1) if you know its id, just by looking it up in the mapping. If you are looking at an `Item` in the List and want to proceed to the next one you have to retrieve item.next which is an `Item` id, and then look up that next `Item` in the mapping.

If this gets you confused, don’t feel bad. I also got very confused. My first question was “is there any point to a Linked List if you can just arbitrarily retrieve any `Item` from a list?”.

The question is that yes, there is a point, but with a very limited scope. Linked Lists are your data structure of choice when you need to preserve the insertion order, and also when you want to insert in arbitrary positions. The fact that you can iterate over the list is useful to a point, if you have to do that in a transaction the list cannot grow indefinitely.

**You can use this data structure when a contract needs to frequently use several items in an ordered list that you can assume will be of limited size.**

For example if you need a contract to always know the 100 largest holders of a token to give them some perks.

Unlike in previous articles, this time I’m not going to paste the whole code here. Instead I will direct you to the [full implementation](https://github.com/HQ20/contracts/contracts/lists). There is an implementation for a Singly Linked List and another one for a Doubly Linked List, with each one being about 200 lines of code, which I’ve crafted carefully for maximum clarity.

In this case I think it is more important to discuss the trade offs between a Singly Linked List and Doubly Linked List, in particular given that the Ethereum blockchain is quite limited in the algorithms that you can [execute safely](https://hackernoon.com/how-much-can-i-do-in-a-block-163q3xp2).

###Usage

When I started the implementation of linked lists, I thought that doing a Doubly Linked List would be more complex than a Singly Linked List. Interestingly enough, it is slightly easier to implement the former. Adding in each item a link for the previous one allows you to remove this inefficient method:

```
/**
 * @dev Given an Item, denoted by `_id`, returns the id of the Item  
 * that points to it, or 0 if `_id` refers to the Head.
 */  
function findPrevId(uint256 _id) public view returns (uint256) {
  if (_id == head) return 0;  
  Item memory prevItem = items[head];
  while (prevItem.next != _id) {  
    prevItem = items[prevItem.next];
  } return prevItem.id;
}
```

That `while` statement is evil.

You would use this method anytime that you know of an item and you want to insert another before it. Quite a common use case.

A gas comparison between LinkedList.sol and DoubleLinkedList.sol sheds some more light on the issue. For these tests I used a list with 100 items.

(https://ipfs.infura.io/ipfs/QmbWF7Fc7GdNnW82RfUbtUvRu5pscjyqCRx1GTLnULnGsx)

`addHead` and `insertAfter` operations with LinkedList are O(1) and cost about 100K gas. Data retrieval is not depicted but given that we use a mapping the cost will be O(1).

The issue is when we need to loop over the list. Every item we loop through seems to cost about 1K gas as seen in `findTailIdWithGas` (which is a mock function that encloses `findTailId` in a transaction, wasting some gas).

Maybe we can make without adding items at the tail or inserting before a known item, but the `remove` function is more of an issue. In a LinkedList you have to loop through the list from the head to remove items. In smart contracts a method with a cost of O(N) needs to be approached very carefully, or better even, avoided.

**A Doubly Linked List is easier to implement and more practical, even if a bit more expensive to use.**

In this specific case, and with a gas block limit of about ten million, it means that you can’t remove items that are more than 10,000 positions away from the head. That can be quite dangerous.

For DoubleLinkedList, on the other hand, all the methods are O(1). `addHead` and `insertAfter` are more costly than in LinkedList because we need to update an extra pointer. If you need to insert at the end of the list, find neighbouring items in both directions, or remove items, you’ll benefit from O(1) cost. I haven’t included gas costs for looping the list but they should be identical to LinkedList.

And as I said before, it’s interesting that for the same functionality, DoubleLinkedList costs less to deploy than LinkedList. Not that important but interesting.

As with anything, your mileage will vary. Maybe you can do with a Singly Linked List, maybe you need a Doubly Linked List. Maybe you should use an array. At least now you know them all.

###Other Implementations

The implementations discussed above are not the only ones, I just thought they would be easy to understand. There are other interesting implementations that might fit your use case better:

*   You want to save some gas, then remove the `id` field from the `Item` struct. You don’t actually need it, funny enough.
*   You don’t like the structs, them replace each struct variable with a mapping as a state variable, it will work exactly the same.
*   You are happy with just appending items at the tail, and maybe those items expire after a set period of time: You can use [RenounceableQueue.sol](https://github.com/HQ20/contracts/blob/master/contracts/drafts/lists/RenounceableQueue.sol). It would work great for a traditional fast limit order book.
*   If all the items in your list are unique, then you can use [OrderedSet.sol](https://github.com/HQ20/contracts/blob/master/contracts/drafts/lists/OrderedSet.sol). I like the compactness and elegance of it.
*   If all the items in your list are unique, but you don’t care about the order, then you are after a canonical [Set](https://en.wikipedia.org/wiki/Set_(abstract_data_type)), get it from [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/EnumerableSet.sol).

###Conclusion

[Linked Lists](https://en.wikipedia.org/wiki/Linked_list) are the first complex data structure that is considered in smart contracts. Given the constraints in smart contracts that force us to code as simply as possible it is necessary to know the trade offs between different linked list implementations.

In this article I’ve shown both Singly Linked Lists and Doubly Linked Lists, pointing to [code ready to be reused](https://github.com/HQ20/contracts/tree/master/contracts/lists). An analysis of gas costs has also been provided, along with guidance for safe use.

I feel quite privileged to have the opportunity to code basic data structures. Sometimes coding smart contracts feels like a trip many years back when programming meant being very close to the hardware and was very close to mathematics. I like that.

If you are considering using this code in a project, want to contribute, or have ideas to explore, please [drop me a line](http://www.albertocuesta.es/)! Talking to those that read me is always a pleasure :)


---

- **Kauri original title:** A Linked List Implementation for Ethereum
- **Kauri original link:** https://kauri.io/a-linked-list-implementation-for-ethereum/2b40f522f07a45f391dafebfaadc444d/a
- **Kauri original author:** Alberto Cuesta Cañada (@albertocuesta)
- **Kauri original Publication date:** 2020-03-02
- **Kauri original tags:** smart-contract, ethereum, how-to, blockchain, buidl, solidity
- **Kauri original hash:** QmVcxvg9qTzSXbcsPaAGKs46TdGCD5pkBQUh7pQ6zs4Drw
- **Kauri original checkpoint:** QmWmMwjaDGVQpiMcqkMy48XBSege9ANP6iQDtrnZpKPdm1



