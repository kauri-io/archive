---
title: Simple Kotlin SpringBoot dApp utilizing web3j
summary: Are you sick of web3js? I know I am! We are still forced to use it on the frontend but that doesnt mean that our backend event listeners and backend contract interactions have to go through this pile of poorly documented crap. I want to introduce you to a great alternative that Ive been using to write the backend of my dApps. First create a spring boot application  https://start.spring.io/ Pick Maven + Kotlin + latest version (Im using 2.1.4) + you can leave the names as is or give it something
authors:
  - Hayder Sharhan (@hshar)
date: 2019-04-14
some_url: 
---

Are you sick of web3js? I know I am!

We are still forced to use it on the frontend but that doesn't mean that our backend event listeners and backend contract interactions have to go through this pile of poorly documented crap.

I want to introduce you to a great alternative that I've been using to write the backend of my dApps.

![](https://api.kauri.io:443/ipfs/QmZS8mDt57Tb1cqNZ49oEQSNNMxZ8Xx2yXzvms6DnCKWjZ)![](https://api.kauri.io:443/ipfs/QmecvtMiuNTJXiWDuaEKmJLWXd1jjUND9MQGjXULghVdBk)![](https://api.kauri.io:443/ipfs/QmfWo2RhNPoU234Xpkee53pfRhTtYqBdoTJEXTf3vMNLbx)

First create a spring boot application: https://start.spring.io/ 

Pick Maven + Kotlin + latest version (I'm using 2.1.4) + you can leave the names as is or give it something fancy

Download and open that bad boy up in Intellij Idea. Community edition is free: https://www.jetbrains.com/idea/download 

Now it should be pretty straight forward to get it running. Just browse over to the file (com.example.demo.DemoApplication) that contains @SpringBootApplication and there should be a little ▶ button. Press it? It won't do much now.

Let's leave this for now and go create our simple smart contract. I like using remix! https://remix.ethereum.org

Contract code (all it does is that it emits an event with the text we send it):
```
pragma solidity 0.5.7;

contract HelloKotlin {

    function myTextInWeb3(string memory text) public {
        emit HelloKotlinEvent(
            text
        );
    }

    event HelloKotlinEvent(string text);
}
```
Let's deploy it using remix. I deployed it here on rinkeby: `0xde370152a5a35ebc1b575cf7feddb2e0e16a62a4`


Now let's compile it into a java class using web3j!

First download web3j command line tool: https://github.com/web3j/web3j/releases (I'm using web3j-4.2.0)

Second thing is to compile our contract into its abi and bin files. `solc hellokotlin.sol --bin --abi --optimize -o .` I'm using solcjs and it kind of messes up the names. Generating hellokotlin_sol_HelloKotlin.bin and hellokotlin_sol_HelloKotlin.abi

And let's generate the class: `~/Dev/web3j-4.2.0/bin/web3j solidity generate -b ./hellokotlin_sol_HelloKotlin.bin -a ./hellokotlin_sol_HelloKotlin.abi -o ~/Dev/demo/src/main/kotlin/ -p com.example.demo`

Go back to IntelliJ and the generated class should be there and ready to be used! I'm going to rename it to something nicer: HelloKotlin.java (You can attempt to change this to use Kotlin but it strictly says to not modify the generated code. If you are successful let me know!)

Next is to add the web3j dependency to Maven. First open up pom.xml and add this inside of <Dependencies>:
```
<dependency>
  <groupId>org.web3j</groupId>
  <artifactId>core</artifactId>
  <version>4.2.0</version>
</dependency>
```
IntelliJ should prompt you to reimport. Do it!

Now my friends we can create some beans and event listeners:

1. Create a kotlin class called Web3jConfig.kt
```
package com.example.demo

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.web3j.protocol.Web3j
import org.web3j.protocol.websocket.WebSocketService

@Configuration
class Web3jConfig {

    @Bean
    fun web3jProvider(): Web3j {
        val wssService = WebSocketService(
                "wss://rinkeby.infura.io/ws",
                true
        )
        wssService.connect()
        return Web3j.build(wssService)
    }
}
```
It just creates a bean of type Web3j that we can use to connect to Infura's WebSocket web3 provider!

Let's create another class to listen in on events and just printing them out to the console as they come in. Let's call this one EventListener.kt
```
package com.example.demo

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Service
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameterName
import org.web3j.tx.ReadonlyTransactionManager
import org.web3j.tx.gas.StaticGasProvider

@Service
class EventListener {
    @Autowired
    lateinit var web3j: Web3j

    companion object {
        const val CONTRACT_ADDRESS = "0xde370152a5a35ebc1b575cf7feddb2e0e16a62a4"
        const val GAS_PRICE = 200
        const val GAS_LIMIT = 4500000
    }

    @Bean
    fun listen() {
        val transactionManager = ReadonlyTransactionManager(web3j, "0x0")
        val gasProvider = StaticGasProvider(GAS_PRICE.toBigInteger(), GAS_LIMIT.toBigInteger())

        val helloKotlinContract = HelloKotlin.load(
                CONTRACT_ADDRESS,
                web3j,
                transactionManager,
                gasProvider
        )

        helloKotlinContract.helloKotlinEventEventFlowable(
                DefaultBlockParameterName.EARLIEST,
                DefaultBlockParameterName.LATEST).subscribe { event ->
            println(event.text)
        }
    }
}
```

Go back to the ▶ button and again, Press It! Now if you're using the contract at the address that I deployed then you'll see some text come in already. But to create your own text let's go back to remix and add in some text and fire up a transaction. If you look at the log of the application, you'll see something like this:
```
"C:\Program Files\Java\jdk-10.0.1\bin\java.exe" "-javaagent:C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2019.1\lib\idea_rt.jar=61097:C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2019.1\bin" -Dfile.encoding=UTF-8 -classpath C:\Users\hayde\Dev\demo\target\classes;C:\Users\hayde\.m2\repository\org\springframework\boot\spring-boot-starter\2.1.4.RELEASE\spring-boot-starter-2.1.4.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\boot\spring-boot\2.1.4.RELEASE\spring-boot-2.1.4.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\spring-context\5.1.6.RELEASE\spring-context-5.1.6.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\spring-aop\5.1.6.RELEASE\spring-aop-5.1.6.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\spring-beans\5.1.6.RELEASE\spring-beans-5.1.6.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\spring-expression\5.1.6.RELEASE\spring-expression-5.1.6.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\boot\spring-boot-autoconfigure\2.1.4.RELEASE\spring-boot-autoconfigure-2.1.4.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\boot\spring-boot-starter-logging\2.1.4.RELEASE\spring-boot-starter-logging-2.1.4.RELEASE.jar;C:\Users\hayde\.m2\repository\ch\qos\logback\logback-classic\1.2.3\logback-classic-1.2.3.jar;C:\Users\hayde\.m2\repository\ch\qos\logback\logback-core\1.2.3\logback-core-1.2.3.jar;C:\Users\hayde\.m2\repository\org\apache\logging\log4j\log4j-to-slf4j\2.11.2\log4j-to-slf4j-2.11.2.jar;C:\Users\hayde\.m2\repository\org\apache\logging\log4j\log4j-api\2.11.2\log4j-api-2.11.2.jar;C:\Users\hayde\.m2\repository\org\slf4j\jul-to-slf4j\1.7.26\jul-to-slf4j-1.7.26.jar;C:\Users\hayde\.m2\repository\javax\annotation\javax.annotation-api\1.3.2\javax.annotation-api-1.3.2.jar;C:\Users\hayde\.m2\repository\org\springframework\spring-core\5.1.6.RELEASE\spring-core-5.1.6.RELEASE.jar;C:\Users\hayde\.m2\repository\org\springframework\spring-jcl\5.1.6.RELEASE\spring-jcl-5.1.6.RELEASE.jar;C:\Users\hayde\.m2\repository\org\yaml\snakeyaml\1.23\snakeyaml-1.23.jar;C:\Users\hayde\.m2\repository\org\jetbrains\kotlin\kotlin-reflect\1.3.21\kotlin-reflect-1.3.21.jar;C:\Users\hayde\.m2\repository\org\jetbrains\kotlin\kotlin-stdlib\1.3.21\kotlin-stdlib-1.3.21.jar;C:\Users\hayde\.m2\repository\org\jetbrains\kotlin\kotlin-stdlib-common\1.3.21\kotlin-stdlib-common-1.3.21.jar;C:\Users\hayde\.m2\repository\org\jetbrains\annotations\13.0\annotations-13.0.jar;C:\Users\hayde\.m2\repository\org\jetbrains\kotlin\kotlin-stdlib-jdk8\1.3.21\kotlin-stdlib-jdk8-1.3.21.jar;C:\Users\hayde\.m2\repository\org\jetbrains\kotlin\kotlin-stdlib-jdk7\1.3.21\kotlin-stdlib-jdk7-1.3.21.jar;C:\Users\hayde\.m2\repository\org\web3j\core\4.2.0\core-4.2.0.jar;C:\Users\hayde\.m2\repository\org\web3j\abi\4.2.0\abi-4.2.0.jar;C:\Users\hayde\.m2\repository\org\web3j\utils\4.2.0\utils-4.2.0.jar;C:\Users\hayde\.m2\repository\org\bouncycastle\bcprov-jdk15on\1.60\bcprov-jdk15on-1.60.jar;C:\Users\hayde\.m2\repository\org\web3j\crypto\4.2.0\crypto-4.2.0.jar;C:\Users\hayde\.m2\repository\org\web3j\rlp\4.2.0\rlp-4.2.0.jar;C:\Users\hayde\.m2\repository\org\web3j\tuples\4.2.0\tuples-4.2.0.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jnr-unixsocket\0.21\jnr-unixsocket-0.21.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jnr-ffi\2.1.9\jnr-ffi-2.1.9.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jffi\1.2.17\jffi-1.2.17.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jffi\1.2.16\jffi-1.2.16-native.jar;C:\Users\hayde\.m2\repository\org\ow2\asm\asm\5.0.3\asm-5.0.3.jar;C:\Users\hayde\.m2\repository\org\ow2\asm\asm-commons\5.0.3\asm-commons-5.0.3.jar;C:\Users\hayde\.m2\repository\org\ow2\asm\asm-analysis\5.0.3\asm-analysis-5.0.3.jar;C:\Users\hayde\.m2\repository\org\ow2\asm\asm-tree\5.0.3\asm-tree-5.0.3.jar;C:\Users\hayde\.m2\repository\org\ow2\asm\asm-util\5.0.3\asm-util-5.0.3.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jnr-a64asm\1.0.0\jnr-a64asm-1.0.0.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jnr-x86asm\1.0.2\jnr-x86asm-1.0.2.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jnr-constants\0.9.11\jnr-constants-0.9.11.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jnr-enxio\0.19\jnr-enxio-0.19.jar;C:\Users\hayde\.m2\repository\com\github\jnr\jnr-posix\3.0.47\jnr-posix-3.0.47.jar;C:\Users\hayde\.m2\repository\com\squareup\okhttp3\okhttp\3.8.1\okhttp-3.8.1.jar;C:\Users\hayde\.m2\repository\com\squareup\okio\okio\1.13.0\okio-1.13.0.jar;C:\Users\hayde\.m2\repository\com\squareup\okhttp3\logging-interceptor\3.8.1\logging-interceptor-3.8.1.jar;C:\Users\hayde\.m2\repository\io\reactivex\rxjava2\rxjava\2.2.8\rxjava-2.2.8.jar;C:\Users\hayde\.m2\repository\org\reactivestreams\reactive-streams\1.0.2\reactive-streams-1.0.2.jar;C:\Users\hayde\.m2\repository\org\java-websocket\Java-WebSocket\1.3.8\Java-WebSocket-1.3.8.jar;C:\Users\hayde\.m2\repository\com\fasterxml\jackson\core\jackson-databind\2.9.8\jackson-databind-2.9.8.jar;C:\Users\hayde\.m2\repository\com\fasterxml\jackson\core\jackson-annotations\2.9.0\jackson-annotations-2.9.0.jar;C:\Users\hayde\.m2\repository\com\fasterxml\jackson\core\jackson-core\2.9.8\jackson-core-2.9.8.jar;C:\Users\hayde\.m2\repository\org\slf4j\slf4j-api\1.7.26\slf4j-api-1.7.26.jar com.example.demo.DemoApplicationKt

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.1.4.RELEASE)

2019-04-14 00:55:55.256  INFO 16112 --- [           main] com.example.demo.DemoApplicationKt       : Starting DemoApplicationKt on DESKTOP-2R74B1B with PID 16112 (C:\Users\hayde\Dev\demo\target\classes started by hayde in C:\Users\hayde\Dev\demo)
2019-04-14 00:55:55.258  INFO 16112 --- [           main] com.example.demo.DemoApplicationKt       : No active profile set, falling back to default profiles: default
2019-04-14 00:55:58.718  INFO 16112 --- [           main] com.example.demo.DemoApplicationKt       : Started DemoApplicationKt in 3.873 seconds (JVM running for 4.579)
Hello There My Kotlin!
```

What do you think? A good alternative to web3js or not really? Please leave your feedback and ask me any questions! If this is received well I'll make a full dapp with a frontend that builds on this!

Also, am I doing something wrong? Please leave a comment for that as well :) I'm always looking to improve my Kotlin, Sprinboot, and Ethereum skills!