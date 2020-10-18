---
title: Incentivizing high-quality curation with a Token-Curated Registry
summary: What is a Token-Curated Registry The idea behind Token-Curated Registry (TCR) is simple. To create a list around a certain topic. For example, a list of people, companies, or schools. Lists are inherent to people- we create, maintain, and consume them all the time. With token-curated registries, this process can become decentralized, as there are no central parties who maintain it. Once deployed, such a list is fully autonomous from its creator. There are three groups of users of a registry- con
authors:
  - Timur Badretdinov (@destiner)
date: 2019-05-18
some_url: 
---

# Incentivizing high-quality curation with a Token-Curated Registry


### What is a Token-Curated Registry

The idea behind Token-Curated Registry (TCR) is simple. To create a list around a certain topic. For example, a list of people, companies, or schools.

Lists are inherent to people: we create, maintain, and consume them all the time. With token-curated registries, this process can become decentralized, as there are no central parties who maintain it. Once deployed, such a list is fully autonomous from its creator.

There are three groups of users of a registry: consumers, producers, and candidates. Consumers are the “readers“ of the registry, who use the information for their own goals. Producers are the “writers” of the registry, they vote on whether to include given item to the list or not. Candidates nominate items to be included in the list.

### Economics

Each TCR has an internal token, which is used to coordinate producers and incentivize honest behavior.

Candidates stake tokens when they nominate new items. Once the proposal is complete, any member of the list can challenge it by making a deposit.

Token holders resolve the challenge. Once a new item is proposed, each holder can vote for a limited period of time. Then, the votes are added together and the outcome executed. The more tokens a user owns, the more voting power they have.

If an item ends up included on the list, a candidate keeps their stake. If the item is rejected, the stake is split between challenger and voters that were in majority.

Existing registry members, or listees, can also be challenged at any time. For that case, they must keep a minimum deposit that will be seized in case a challenge is successful so the challenger and majority voters can share it. In case a challenge fails, the listee keeps the deposit, and the challenger stake is split between listee and majority voters.

### Examples of TCRs

You can create a list to curate anything meaningful: from comedy movies and best cafes in Beijing to the top MBA schools and approved drugs.

Sticking with the “good comedy movies” example, let’s look at how it would work. In this scenario, good candidates for the list producers might be movie enthusiasts with lots of experience analyzing movies. The candidates for the list might be the movie creators themselves, as they have the incentive to add their movies to the list. As for consumers, the list is useful for anyone who loves comedy and wants to decide what to watch in the evening.

Speaking of TCRs that are live on Ethereum, [FOAM project](https://www.foam.space/) uses a Token-Curated Registry to curate points-of-interest. Other use cases include curating URLs ([AdChain](https://www.adchain.com/)), tokens ([Messari](https://messari.io/)), and smart contracts ([Panvala](https://www.panvala.com)).

### Creating a TCR

In this tutorial, we create a “Best comedy movies” dapp. It consists of a smart contract that you can then use (with slight modification) for the curation of other items, and a web app that connects to the deployed instance of that contract and allows people to consume the list without directly interacting with the contract.

#### Smart contract

The token-curated registry has several configurable parameters. These parameters should be governed in a decentralized manner, but how to achieve that is an open question. For the sake of simplicity, we keep the parameters stable and let the creator set them at the time of deploying the contract.

The parameters of TCR are:

-   token deposit required to make a proposal
-   length of the apply stage
-   length of the vote commit stage
-   length of the vote reveal stage
-   the percent of the stake that goes to the listee or the challenger in case of a challenge
-   the percent of votes that form vote quorum

```
constructor(
	address _token,
	uint256 _deposit,
	uint256 _applyStageLength,
	uint256 _voteCommitStageLength,
	uint256 _voteRevealStageLength,
	uint256 _dispensationPercent,
	uint256 _voteQuorumPercent
) public {
	token = IERC20(_token);
	deposit = _deposit;
	applyStageLength = _applyStageLength;
	voteCommitStageLength = _voteCommitStageLength;
	voteRevealStageLength = _voteRevealStageLength;
	dispensationPercent = _dispensationPercent;
	voteQuorumPercent = _voteQuorumPercent;
}
```

Movies in the registry pass through the different stages:

-   applied to the list
-   challenged
-   listed
-   kicked out

To keep track of the current stage of each movie in the listing, we need to create a `Stage` enumerator, as well as `Movie` structure:

```
enum Status { Applied, Challenged, Listed, Kicked }

struct Movie {
	address producer;
	string title;
	uint256 lastUpdated;
	uint256 challengeId;
	Status status;
}

Movie[] public movies;
```

Behind each TCR is an ERC20 token. The token is used for staking during proposing and challenging, and to determine the voting power of the voters.

When a producer proposes a new movie for inclusion in the list, we create a new `Movie` object with the status “Applied”:

```
function propose(string calldata _title) external {
	// Require proposing deposit
	token.transferFrom(msg.sender, address(this), deposit);
	movies.push(Movie(msg.sender, _title, now, 0, Status.Applied));
}
```

For challenging, we need a `Challenge` structure, which we use mostly to distribute voting rewards.

```
struct Challenge {
	address challenger;
	mapping(address => bool) tokensClaimed;
	uint256 totalTokens;
	uint256 reward;
	bool resolved;
}

Challenge[] public challenges;
```

When a challenger appears, we need to update the status of the proposal, as well as initiate the `Challenge` object.

```
function challenge(uint256 _index) external {
	require(_index < movies.length);
	require(movies[_index].status == Status.Listed ||
		movies[_index].status == Status.Applied && movies[_index].lastUpdated + applyStageLength >= now);

	movies[_index].challengeId = challenges.length;
	challenges.push(Challenge({
		challenger: msg.sender,
		totalTokens: 0,
		reward: (100 - dispensationPercent) * deposit / 100,
		resolved: false
	}));

	_changeStatus(_index, Status.Challenged);

	// Require challenging deposit
	token.transferFrom(msg.sender, address(this), deposit);
}
```

Voting happens via [commit-reveal scheme](https://en.wikipedia.org/wiki/Commitment_scheme). Token holders _commit_ by staking the tokens along with the hash of their vote, and then _reveal_ their choice and receive their tokens back.

For each vote, we create a `Vote` object. We will use it later to calculate voter rewards.

When the votes are revealed, we tally them so we can calculate the output of the voting later.

```
struct Vote {
	bytes32 hash;
	uint256 weight;
	bool accept;
	bool revealed;
}

function commitVote(uint256 _index, uint256 _weight, bytes32 _voteHash) external {
	require(_index < movies.length);
	require(movies[_index].status == Status.Challenged);
	require(movies[_index].lastUpdated + voteCommitStageLength >= now);

	uint256 challengeIndex = movies[_index].challengeId;
	require(_votes[challengeIndex][msg.sender].weight == 0);

	token.transferFrom(msg.sender, address(this), _weight);

	_votes[challengeIndex][msg.sender] = Vote(_voteHash, _weight, false, false);
}

function revealVote(uint256 _index, bool _vote, bytes32 _salt) external {
	require(_index < movies.length);
	require(movies[_index].status == Status.Challenged);
	require(movies[_index].lastUpdated + voteCommitStageLength + voteRevealStageLength >= now);

	uint256 challengeIndex = movies[_index].challengeId;
	require(_votes[challengeIndex][msg.sender].hash == getHash(_index, _vote, _salt));
	require(!_votes[challengeIndex][msg.sender].revealed);

	token.transfer(msg.sender, _votes[_index][msg.sender].weight);

	_votes[challengeIndex][msg.sender].accept = _vote;
	_votes[challengeIndex][msg.sender].revealed = true;
	_tally[challengeIndex][_vote] += _votes[challengeIndex][msg.sender].weight;
}

function getHash(uint256 _index, bool _vote, bytes32 _salt) pure public returns(bytes32) {
	return keccak256(abi.encodePacked(_index, _vote, _salt));
}
```

After the vote is finished, we need to get the result. We calculate the share of the tokens used to vote “Accept” and compare the value to the percent of votes required to reach the quorum. If there were enough votes supporting the inclusion, we mark it as “Listed”. Otherwise, we mark it as “Kicked”.

Based on the outcome, we need to compensate either producer or challenger by returning their original stake as well as part of the stake of their opponent. Everything else goes to the voters based on their impact.

```
function resolve(uint256 _index) external {
	require(_index < movies.length);
	require(movies[_index].status == Status.Challenged);
	require(movies[_index].lastUpdated + voteCommitStageLength + voteRevealStageLength < now);

	uint256 challengeIndex = movies[_index].challengeId;
	uint256 totalWeight = _tally[challengeIndex][false] + _tally[challengeIndex][true];
	uint256 acceptVoteShare = _tally[challengeIndex][true] * 100 / totalWeight;
	uint256 reward = dispensationPercent * deposit / 100; // dispensation reward

	Challenge storage challengeInstance = challenges[challengeIndex];
	challengeInstance.resolved = true;

	if (acceptVoteShare >= voteQuorumPercent) {
		// Reward producer
		token.transfer(movies[_index].producer, reward);
		_changeStatus(_index, Status.Listed);
	} else {
		// Reward challenger
		token.transfer(challengeInstance.challenger, reward + deposit);
		_changeStatus(_index, Status.Kicked);
	}
}
```

Finally, let’s allow voters to receive their reward in case they ended up in a majority. For that, we compare their votes with the winning outcome. If they match, we reward voters based on their voting weight, i.e., how many tokens they staked during voting.

```
function claimReward(uint256 _challengeIndex) external {
	require(_challengeIndex < challenges.length); // There was a challenge

	Challenge storage challengeInstance = challenges[_challengeIndex];
	require(challengeInstance.resolved); // The challenge is over
	require(!challengeInstance.tokensClaimed[msg.sender]); // Voter didn't claimed the reward yet

	uint256 voterWeight = _getVoterWeight(_challengeIndex);
	uint256 voterReward = voterWeight * challengeInstance.reward / challengeInstance.totalTokens;

	challengeInstance.reward -= voterReward;
	challengeInstance.totalTokens -= voterWeight;

	challengeInstance.tokensClaimed[msg.sender] = true;

	token.transfer(msg.sender, voterReward);
}
```

For simplicity, we didn’t focus on the proposer's ability to leave the TCR. The only way to remove the listing is to challenge it. Also, the proposer has no way to recover their stake. It either stays locked in a TCR along with the listing or seized in case it is challenged.

#### Front-end

To allow users access to the TCR without touching the smart contract directly, we need to create a front-end application. For the sake of this tutorial, we focus on a dapp for consumers. This dapp shows all movies that applied to the registry, as well as the outcome for each one.

We create a single-page application using Vue and ethers.js.

First, let’s initiate an app by connecting to the Ethereum provider and the TCR contract that was deployed on Kovan.

```js
import { ethers } from 'ethers';
import tcrAbi from './abi/tcr.json';
const provider = new ethers.providers.InfuraProvider('kovan');
const tcrAddress = '0xb47204b754FB84D0c4e91097Cb62ca2aFd99F355';
const tcrContract = new ethers.Contract(tcrAddress, tcrAbi, provider);
```

Once an application starts, we want to load all movies that were submitted to the TCR.

```js
async loadMovies() {
	const movieCount = await tcrContract.getMovieCount();
	for (let i = 0; i < movieCount; i++) {
		const movie = await tcrContract.movies(i);
		this.movies.push(movie);
	}
}
```

Let’s now display each movie in the list based on its status.

```html
<div v-for="(movie, index) in movies" class="movie-card" :class="{
	'movie-applied': isApplied(movie),
	'movie-challenge': isChallenged(movie),
	'movie-listed': isListed(movie),
	'movie-kicked': isKicked(movie)
}" >
	<div class="number">#{{ (index + 1) }}</div>
	<div class="info">
		<div>{{ movie.title }}</div>
		<div>{{ showStatus(movie) }}</div>
	</div>
</div>
```

The `showStatus` method provides a quick summary of the listing, displaying its current state and the date it was last changed.

```js
showStatus(movie) {
	const action =
		movie.status == 0 ? 'Applied' :
		movie.status == 1 ? 'Challenged' :
		movie.status == 2 ? 'Listed' :
		movie.status == 3 ? 'Kicked' :
		'None';
	const timestamp = movie.lastUpdated.toNumber();
	const time = new Date(timestamp * 1000);
	return `${action} at ${time.toDateString()}`
}
```

That’s it!

### Potential attacks

This TCR design, though, has several attack vectors.

First, one or more malicious voters can spam the TCR by creating a bunch of low-quality proposals. However, as each proposal requires a deposit, it requires significant capital investment. Moreover, as those items are expected to be low-quality, they will likely be challenged and lose the vote, meaning that the attacker loses their entire deposit. Therefore, this attack is unlikely to be feasible and attractive to the rational person.

Another potential danger is a reduction in quality of the items already included in the registry, or so-called “Registry poisoning”. This might happen both maliciously or not. In any case, token holders and challengers are expected to constantly keep track of the quality of the included items, and challenge them to be kicked in case they degrade. Again, kicked items lose their stake so it's costly to spoil listings intentionally.

Finally, voters can choose to vote in any other way besides picking what they think is a good choice. One tactic the voters might pursue is “vote splitting“, where voters vote “Yes” with half of their tokens and “No” with the other half. This way, they are guaranteed to receive part of the reward while not putting any thought into voting. Another tactic is “vote memeing“ where voters collude on an outcome whether they perceive it as valid or not. This technique is much more dangerous for the TCR because unlike vote splitting, it can affect the voting outcome. The biggest countermeasure to memeing is an ability to fork the TCR, leaving colluded voters with now worthless tokens.

### Limitations and improvement ideas

The implementation of TCR described in this guide focuses on simplicity, so it has limited functionality and several problems. Additionally, there are some problems that are relevant to all TCR designs.

Currently, tokens can’t be used simultaneously for more than one vote. This limits the powers of the token holders. It also reduces the security of TCR: in case there are several votes running at the same time, the voting power is split between them, so the cost of attacking one of the votes by staking tokens is reduced. Luckily, there is an improvement of the current voting scheme called partial-lock commit/reveal (PLCR) voting, which allows token holders to participate in several voting simultaneously using the same tokens.

Another challenge is tweaking the parameters. Ideally, the parameters could be changed at any time in a decentralized manner. One idea is to use another TCR to make governance proposals and vote with the same tokens.

Continuing with the “Comedy movie TCR” example, it would be nice not only to curate good comedy movies but also rank and compare them with each other, creating some kind of a leaderboard. Graded TCRs allow ranking items over several tiers.

Token-curated registry is still a nascent concept. Use cases exist, but it’s too early to say that they will succeed long-term. Besides, it’s unknown how broadly TCRs can be used in practice.

Another open question is how to bootstrap the registry. TCRs are a three-sided marketplace that has “chicken-and-egg” problem. Initially, there are no items, so consumers are not interested in it, and thus producers don’t want to apply, meaning that there are no items. One way to kickstart the registry is to fill it with items from a centralized list if items are known to be high-quality.

### Further reading

A token-curated registry is a powerful mechanism to incentivize decentralized and permissionless curation. However, it has a lot of nuances and potential shortcomings, as there are a few opportunities to game a system. Developers who want to leverage TCR in their dapps should keep in mind potential shortcomings.

I’ve put everything that we’ve made in this guide to the [monorepo on Github](https://github.com/Destiner/tcr-guide). Feel free to clone, fork, and otherwise play with it.

You can access the live demo of the dapp [here](https://destiner.github.io/tcr-guide/).

TCRs is a broad topic that goes beyond technical specifics. If you want to learn more, I recommend going through the following resources:

-   The first public description of the Token-curated registry: [Token-Curated Registries 1.0 – Mike Goldin](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)
-   [Update by the author of the original paper, Mike Goldin](https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d), where he proposes improvements to the TCR design.
-   “Awesome token-curated registries” repository on Github: [GitHub - miguelmota/awesome-token-curated-registries: Curated list of awesome Token Curated Registry (TCR) resources.](https://github.com/miguelmota/awesome-token-curated-registries)
-   A reference TCR implementation: [GitHub - skmgoldin/tcr: A generic token-curated registry](https://github.com/skmgoldin/tcr)



---

- **Kauri original link:** https://kauri.io/incentivizing-high-quality-curation-with-a-token-/5d256b3a16c3430080718f29d6758366/a
- **Kauri original author:** Timur Badretdinov (@destiner)
- **Kauri original Publication date:** 2019-05-18
- **Kauri original tags:** cryptoeconomics, solidity
- **Kauri original hash:** QmdjaQcQ1CxNHerNkZLdQqAyhF88qGX8Dr1SNs2t9ksTyh
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



