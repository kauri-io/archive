---
title: Consuming Ethereum Events To Kotlin Service Using Eventeum
summary: It might be hard to roll your own implementation of a resilient web3 event consumer! You should if you have the time for it, but if you want something reliable
authors:
  - Hayder Sharhan (@hshar)
date: 2020-02-17
some_url: 
---

It might be hard to roll your own implementation of a resilient web3 event consumer! You should if you have the time for it, but if you want something reliable and open source take a look at [Eventeum](https://github.com/ConsenSys/eventeum)

#### Getting Eventeum Up And Running With Our Events
First we need to clone the project: `git clone https://github.com/ConsenSys/eventeum.git`

Then we need to edit the project's `application.yml` located in `server/src/main/resources/application.yml` -- For this we're going to use a real life example from my project that's in stealth mode for now. But here's the event: `event TournamentFinalized(uint _tournamentId, address payable[] _winners, uint[] payouts);`

For this event we need to add this to the application.yml:

```yaml
- id: "tournamentFinalizedEvent"
   contractAddress: ${CONTRACT_ADDRESS:0x00000000000000000000000000000000000000000}
   eventSpecification:
     eventName: TournamentFinalized
     nonIndexedParameterDefinitions:
       - position: 0
         type: UINT256
       - position: 1
         type: ADDRESS[]
       - position: 2
         type: UINT256[]
   correlationId:
     type: NON_INDEXED_PARAMETER
     index: 0
   startBlock: 9482978
```

It's really important to note the startBlock, it should be set to the block of the contract's inception.

Now to get Eventeum started we need Kafka (and zookeeper), Mongodb, and an Ethereum node to listen on (for this I'll be using Infura. For Infura to work we need the websocket node and use the PUBSUB block strategy.)

So let's set these environment variables beforehand:

```bash
export SPRING_DATA_MONGODB_URI = mongodb://myUser:myPW@localhost:27017/myDB
export ETHEREUM_NODE_URL = wss://rinkeby.infura.io/ws/v3/MY_KEY
export ZOOKEEPER_ADDRESS = <zookeeper-host:port>
export KAFKA_ADDRESSES=<kafka-host:port>
export ETHEREUM_BLOCKSTRATEGY = PUBSUB
```

Now let's compile the project by running `mvn clean package` and then running it through `java -jar ./server/target/eventeum-server.jar`

Soon the events will start to get picked up and pushed to MongoDB and streamed to Kafka under the topic's name `contract-events`

Now let's create our consumer and make sense of this data using [Kotlinx's Serialization library](https://github.com/Kotlin/kotlinx.serialization)

Consumer:

```kotlin
@Service
class KafkaEventListenerService {
    protected val log = KotlinLogging.logger {}

    @KafkaListener(topics = ["contract-events"], groupId = "event-listener")
    fun newEventeumEvent(payload: String) {
        log.info(payload)
        try {
            val event = EventeumPayload.fromJson(payload)
            when (event.details.name) {
                "TournamentFinalized" -> tournamentFinalizedEvent(event) // A function to be implemented
            }
        } catch (e: InstantiationError) {
            log.error(e.localizedMessage)
        }
    }
}
```

Data model (Uses polymorphism to decode the incoming data)

```kotlin
import BigIntegerSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.json.Json
import kotlinx.serialization.Serializable
import kotlinx.serialization.UnstableDefault
import kotlinx.serialization.json.JsonConfiguration
import java.math.BigInteger

@Serializable
data class EventeumPayload(
        val id: String,
        val type: String,
        val details: EventDetails,
        val retries: Int
) {
    companion object {
        @UnstableDefault
        fun fromJson(data: String): EventeumPayload {
            return Json(JsonConfiguration(strictMode = false)).parse(serializer(), data)
        }
    }
}

@Serializable
data class EventDetails(
        val name: String,
        val filterId: String,
        val nodeName: String,
        val indexedParameters: List<EventValueType>,
        val nonIndexedParameters: List<EventValueType>,
        val transactionHash: String,
        val logIndex: Int,
        val blockNumber: Int,
        val blockHash: String,
        val address: String,
        val status: String,
        val eventSpecificationSignature: String,
        val networkName: String,
        val id: String
)

@Serializable
sealed class EventValueType {

    @Serializable
    @SerialName("string")
    data class EventValueTypeString(val value: String) : EventValueType()

    @Serializable
    @SerialName("address")
    data class EventValueTypeAddress(private val value: String) : EventValueType() {
        val valueLower: String
            get() = value.toLowerCase()
    }

    @Serializable
    @SerialName("uint256")
    data class EventValueTypeInt(@Serializable(BigIntegerSerializer::class) val value: BigInteger) : EventValueType()

    @Serializable
    @SerialName("bool")
    data class EventValueTypeBool(val value: Int) : EventValueType() // Temporary fix until Eventeum supports true and false booleans

    @Serializable
    @SerialName("uint256[]")
    data class EventValueTypeIntObject(val value: List<EventValueType>) : EventValueType()

    @Serializable
    @SerialName("address[]")
    data class EventValueTypeAddressObject(val value: List<EventValueType>) : EventValueType()
}
```

Also the BigIntegers' serializer that's mentioned:

```kotlin
package com.hshar.daory.model.serializer

import kotlinx.serialization.*
import kotlinx.serialization.internal.StringDescriptor
import java.math.BigInteger

@Serializer(forClass = BigInteger::class)
class BigIntegerSerializer: KSerializer<BigInteger> {
    override val descriptor: SerialDescriptor =
            StringDescriptor.withName("WithCustomDefault")

    override fun serialize(encoder: Encoder, obj: BigInteger) {
        encoder.encodeString(obj.toString())
    }

    override fun deserialize(decoder: Decoder): BigInteger {
        return BigInteger(decoder.decodeString())
    }
}
```

Now kick off your application and let the service do its job! Let me know if you have any questions, happy to help!