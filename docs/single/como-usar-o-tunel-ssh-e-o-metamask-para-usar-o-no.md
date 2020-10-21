---
title: Como usar o túnel SSH e o MetaMask para usar o nó remoto do Ethereum
summary: Warning- We found this translation of Daniel Ellisons post and thought wed cross-post it, but we have no idea as to the quality of the translation. Configurar um túnel SSH ConfiguraçãoO que? Este é o processo confuso que mencionei antes. Eu não entrarei em detalhes aqui, mas na verdade permite que solicitações do computador local sejam automaticamente encaminhadas para outro computador, caso em que ele está sendo executado geth O VPS do nó. Quando configurarmos o MetaMask mais tarde, entenderemo
authors:
  - Kauri Team (@kauri)
date: 2019-08-13
some_url: 
---

# Como usar o túnel SSH e o MetaMask para usar o nó remoto do Ethereum


> **Warning**: We found this translation of [Daniel Ellison's post](https://kauri.io/article/348d6c66da2949978c85bf2cd913d0ac/v5/make-use-of-your-remote-ethereum-node-using-an-ssh-tunnel-and-metamask) and thought we'd cross-post it, but we have no idea as to the quality of the translation.

---

### Configurar um túnel SSH

ConfiguraçãoO que? Este é o processo confuso que mencionei antes. Eu não entrarei em detalhes aqui, mas na verdade permite que solicitações do computador local sejam automaticamente encaminhadas para outro computador, caso em que ele está sendo executado `geth` O VPS do nó. Quando configurarmos o MetaMask mais tarde, entenderemos por que isso é necessário.

### Obtenha o endereço IP do VPS
Para encaminhar a solicitação ao seu VPS, você precisa saber seu endereço IP. Isso é feito retornando ao seu painel Linode e indo para a esquerda _Linodes_ Tabula ção para determinar. Você deve ver o endereço IP do seu nó à direita, logo abaixo da localização geográfica do seu VPS. Parece assim: `172.16.389.54`. Anote o IP, vamos usá-lo em breve.

### SSH no Windows
A partir de abril de 2018, o Windows 10 tem o OpenSSH instalado por padrão. Isso fornece `ssh.exe` E vários outros utilitários SSH. No momento desta publicação, para verificar o status do SSH no Windows, fiz o download do ISO 10 do Windows mais recente e instalei-o na máquina virtual. O OpenSSH já está instalado e pode ser obtido dele `Cmd.exe`. Se você tiver o Windows 10 instalado, mas não tiver o OpenSSH instalado, siga este [Artigo da MicrosoftInstruções para fazer isso](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_overview). Se você estiver usando uma versão mais antiga do Windows, poderá usar vários utilitários para fornecer a funcionalidade SSH.

### Iniciar túnel
Nós assumimos que você tem o direito Ssh Acesso da linha de comando ao cliente. O comando a seguir configura um túnel SSH. Este comando é o mesmo nas três plataformas.

```shell
ssh -N -v Usuário@172.16.389.54 -L 8545: localhost:8545
```

O `-N` Trocar notificação `ssh` Não execute comandos remotos. Queremos uma conexão contínua ou Túnel Vá para o nosso nó. Não há execução remota do comando neste momento. O `-v` MudarSshSaída de algumas informações de log à medida que são executadas. Em seguida, fornecemos o nome de usuário e o endereço IP para efetuar login em nosso VPS. O resto configura o próprio túnel, especificando o computador local `8545` Qualquer coisa recebida na porta (a porta na qual o nó está escutando solicitações RPC) deveCom segurança através do túnelEncaminhar para a mesma porta no nó. Este é o ponto mais importante: ninguém mais pode fazer isso, exceto você. Seu nó não será atacado devido à porta RPC exposta.

### Configurando MetaMask
Esta é a parte mais simples do desbaste de todo o túnel. Eu suponho que você deixou o túnel SSH e você pode ver sua saída de log. No navegador, clique na cabeça de raposa no canto superior direito da janela do navegador para ativar o MetaMask. No topo da janela MetaMask está a rede Ethereum atualmente selecionada. Se você estiver usando beta dApps, ele pode dizer como Rinkeby Test Network. Clique no nome e você verá um menu suspenso. O topo é Rede Ethereum Principal. Este é o nosso destino final, mas não queremos usar este item de menu. Se você fizer isso, o MetaMask se conectará ao nó Infura para derrotar o propósito completo desta longa jornada. Na parte inferior da lista, você verá Localhost 8545. Clique nele para ver a saída do túnel SSH. Você deve ver uma linha semelhante a esta:

```shell
Debug1: conexão à porta 8545 Encaminhando para a porta localhost 8545 Solicitado. Debug1: canal 1: Novo (direct-tcpip)
```

MetaMask agora deve tê-lo no topo Localhost 8545 Você deveria ver no meio Depositar E EnviarBotão Se sim, agora você está remoto `geth` O nó está conectado ao MetaMask, embora o MetaMask ache que está conectado à máquina local.

### Tornar permanente permanente

Agora você tem um totalmente funcional Geth Node e pode ser tunelado remotamente via MetaMask e SSH Com segurança Conecte-se a este nó. Parabéns, claro, o computador caiu ou deliberadamente fechado. Para evitar configurar tudo novamente ao reiniciar, precisamos fazer duas coisas: primeiro, configurar Geth O nó inicia automaticamente no VPS, dois, de alguma forma, fazendo o mesmo para o túnel SSH em nossa máquina local.

### Persistência remota
Relativamente falando, esta é uma parte simples do processo permanente. Nós só precisamos lidar com um sistema operacional Linux, e nós estabelecemos uma maneira de iniciar a tarefa automaticamente: `systemd`. Além da política do Linux, vamos começar.

`systemd` Manipulando processos na maioria dos sistemas Linux, o Ubuntu não é exceção. Para isso, ele vai ler `.service` Arquivo Para nos fazer `geth` O nó é iniciado automaticamente na inicialização, precisamos fornecer um `geth.service` Arquivo Retorno e de Linodes A guia inicia o console. Se o seu `geth` O nó ainda está em execução e deve ser desligado. Como antes, digite o seguinte para reconectar ao seu `geth` Nó:

```shell
$ tmux attach -t 0
```

Pare seu `geth` Node Ctrl-c. Novamente, aguarde até que você esteja no prompt de comando e digite Ctrl-d Remover `tmux`. Por favor, substitua-o na linha de comando. `user` Em `User=user` O nome de usuário que você forneceu antes:

```
$ cat > geth.service <<EOF
[Unit]
Description=Go Ethereum client

[Service]
User=user
Type=simple
Restart=always
ExecStart=/usr/bin/geth --rpc --rpcaddr localhost --rpcport 8545

[Install]
WantedBy=default.target
EOF
```

Isso vai `geth.service` Crie um arquivo no diretório atual. Você precisa fazer algo para disponibilizá-lo Systemd:

```shell
$ sudo mv geth.service /etc/systemd/system/
$ sudo systemctl daemon-reload
$ sudo systemctl enable geth.service
$ sudo systemctl start geth.service
```

Para verificar o status de um serviço, use o seguinte comando:

```shell
$ sudo systemctl status geth.service
```

Em algum lugar perto do começo da saída, você verá `active (running)`. Se você não fizer isso, uma mensagem de erro será exibida abaixo. Boa sorte para ver a saída contínua `geth`, digite o seguinte:

```shell
$ sudo journalctl -f -u geth.service
```

Se tudo correr bem, você verá a inclusão `Imported new chain segment` O fluxo da linha Digite Ctrl-c Para parar a saída. Não se preocupe, isso não vai acabar com você geth node Ele só pára de mostrarSystemdSaída de log.

A partir de agora, quando o seu VPS for reiniciado por qualquer motivo Geth Ele será reiniciado automaticamente quando for iniciado.

### Permanente local
Você iniciou com sucesso o túnel SSH no seu computador, mas assim que você desligar o terminal ou colocar o laptop para dormir, o túnel será desconectado e desconectado. Isto é obviamente sub-ótimo. É um pouco complicado iniciar uma sessão de terminal e reativar o túnel. O problema é que os três principais sistemas operacionais têm três maneiras diferentes de configurar serviços permanentes, como o tunelamento SSH.

###  Par de chaves SSH

Para automatizar qualquer um dos itens a seguir, você precisa ter uma chave privada SSH e uma chave pública. Se você costumaSshDigite o computador remoto sem fornecer cryptocurrency, então você já configurou. Mesmo neste caso, você precisa enviar a chave pública para o computador remoto em execução.Geth. Instruções sobre como fazer isso – e como gerar um par de chaves SSH primeiro quando necessário – [Este artigo do Linode](https://www.linode.com/docs/security/authentication/use-public-key-authentication-with-ssh/) Ou De [Atlassian Este artigode](https://confluence.atlassian.com/bitbucketserver/creating-ssh-keys-776639788.html).

A explicação é muito boa. Esses artigos são longos e tecnicamente fortes, o uso de chaves SSH para modificação é um processo bem conhecido, portanto, não é necessário repetir essas instruções aqui. Se você pode digitar:

```shell
$ ssh Usuário@172,16.389,54
```

Forneça seu próprio nome de usuário e controle remotoGethO IP do nó, e você pode entrar sem fornecer uma criptomoeda, você está muito feliz. Se esse não for o caso, nenhum dos itens a seguir funcionará.

### Linux

O processo de tornar o túnel SSH permanente é semelhante ao nosso processo no VPS. Nós instalamos um `persistent.ssh.tunnel.service` Arquive e configure-o para que o serviço seja iniciado a partir do sistema. Além de ser diferente `ExecStart` A única grande diferença em uma linha é que precisamos adicionar uma linha com um pequeno atraso de inicialização antes da linha para garantir que a rede esteja pronta antes do início do serviço. Lembre-se, claro, substituir `user` Em `User=user` Use seu nome de usuário na área de trabalho e `User@172.16.389.54` Seu nome de usuário está no sistema remoto e seu endereço IP.

```
$ cat > persistent.ssh.tunnel.service <<EOF
[Unit]
Description=Persistent SSH Tunnel

[Service]
User=user
Type=simple
Restart=always
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/ssh -N -v user@172.16.389.54 -L 8545:localhost:8545

[Install]
WantedBy=default.target
EOF
```

Isso vai `persistent.ssh.tunnel.service` Crie um arquivo no diretório atual. Como antes, você precisa fazer algo para disponibilizá-lo SystemdD esta vez no seu sistema local:

S sudo systemvl persistent.ssh.tunnel

Para verificar se o serviço foi iniciado com êxito, digite o seguinte:

```shell
$ sudo mv persistent.ssh.tunnel.service /etc/systemd/system/
$ sudo systemctl daemon-reload
$ sudo systemctl enable persistent.ssh.tunnel.service
$ sudo systemctl start persistent.ssh.tunnel.service
```

### macOS

da Apple tem seu próprio jeito de configurar serviços persistentes Launchctl. Com Systemd Linux é semelhante, você fornece o arquivo de configuração – desta vez é [Documento XML](https://en.wikipedia.org/wiki/XML) Em vez de [Formulário de arquivo INI](https://en.wikipedia.org/wiki/INI_file) – Em seguida, use o documento XML para instalar e ativar o serviço. Primeiro, criamos esse arquivo e fornecemos nosso nome de usuário e endereço IP do VPS como de costume `user@172.16.389.54`. Novamente, forneça seu nome de usuário do macOS `UserName`.

```shell
$ cat > com.persistent.ssh.tunnel.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.persistent.ssh.tunnel</string>
  <key>UserName</key>
  <string>user</string>
  <key>StandardErrorPath</key>
  <string>/tmp/persistent.ssh.tunnel.err</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/ssh</string>
    <string>-N</string>
    <string>-v</string>
    <string>user@172.16.389.54</string>
    <string>-L</string>
    <string>8545:localhost:8545</string>
  </array>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
EOF
```

Criar `com.persistent.ssh.tunnel.plist` Após o arquivo, mova-o para Launchctl O local onde esses arquivos devem residir. Finalmente, o comando o instala no sistema e inicia o processo em execução em segundo plano.

```shell
$ sudo mv com.persistent.ssh.tunnel.plist / Biblioteca / LaunchDaemons / 
$ sudo launchctl load /Library/LaunchDaemons/com.persistent.ssh.tunnel.plist
```

Instalação `.plist` Arquivo `/ Library / LaunchDaemons/` Disponibilizá-lo para qualquer usuário no sistema, não depende do seu login para tornar o túnel ativo.

### Windows

Para configurar um serviço de persistência no Windows, você precisa baixar um utilitário que forneça essa funcionalidade. Estou usando o código aberto, livre e domínio público [NSSM](https://nssm.cc/) ,Então você precisa continuar antes de continuarInstalar.

As etapas a seguir são criadas `persistent-ssh-tunnel` Preste serviços de manutenção e ajuste vários parâmetros de modo que você possa usá-lo para conectar MetaMask a seu Geth Node Nssm Por uma questão de clareza, eu forneci comandos e respostas. Para executar esses comandos, você precisa iniciar uma sessão de terminal como administrador do Windows. Você pode fazer isso abrindo o menu Iniciar e digitando Cmd. Isso deve destacar o prompt de comandoMelhor jogo Menu Selecione Executar como administrador à direita. Clique em Sim para permitir que este aplicativo faça alterações. Se tudo correr bem, você verá uma janela de terminal preta aberta com um prompt de comando. Por favor, digite os seguintes comandos cuidadosamente para garantir que você não `C:\Windows\system32>` Digite um prompt de comando para garantir que cada comando obtenha uma resposta semelhante à fornecida aqui. Substituir pelo nome de usuário do Windows usuário(reservado `.\`) e de login do Windows `password`. Também forneça seu nome de usuário e controle remoto `Geth` Endereço IP do nó `user@172.16.389.54`.

```shell
C:\Windows\system32>nssm install persistent-ssh-tunnel "C:\Windows\System32\OpenSSH\ssh.exe" "-N -v user@172.16.389.54 -L 8545:localhost:8545"
Service "persistent-ssh-tunnel" installed successfully!

C:\Windows\system32>nssm set persistent-ssh-tunnel ObjectName ".\user" "password"
Set parameter "ObjectName" for service "persistent-ssh-tunnel".

C:\Windows\system32>nssm set persistent-ssh-tunnel DisplayName "Persistent SSH Tunnel"
Set parameter "DisplayName" for service "persistent-ssh-tunnel".

C:\Windows\system32>nssm set persistent-ssh-tunnel Description "Establishes a persistent SSH tunnel between a remote server and the local computer."
Set parameter "Description" for service "persistent-ssh-tunnel".

C:\Windows\system32>nssm start persistent-ssh-tunnel
persistent-ssh-tunnel: START: The operation completed successfully.

```

### Testar um túnel SSH persistente

Supondo que tudo corra bem, agora você pode executar serviços do sistema em execução em segundo plano no Windows, Linux ou macOS e iniciar sempre que o computador local for reiniciado. Para testá-lo, abra o navegador onde o MetaMask está instalado e siga as instruções acima.Configurando MetaMaskInstruções para fazer isso. MetaMask deve ser conectado novamenteLocalhost 8545 Mas desta vez ele usa o serviço de segundo plano para encapsular o pedido para o seu Geth VPS. Você não precisa mais considerar estabelecer uma conexão com um nó Ethereum remoto.

### Conclusão

Por conveniência, fiz escolhas específicas nesses artigos. Por exemplo, optei por usar o VPS para nossos nós Ethereum, que na verdade é um provedor específico de VPS. Como mencionado acima, isso requer dinheiro. Desenvolvedores de aplicativos que geram receita do projeto devem considerar essa rota. Por outro lado, alguém que é apenas curioso e quer seguir os passos descritos pode configurar o VPS, seguir o tutorial e aprender todo o conhecimento após o teste, fechando e excluindo o VPS. Isso custa apenas alguns centavos no final: se você gastar duas horas para concluir este tutorial, suponhaLinode 16GB VPS, você tem que pagar US $ 24. Mesmo considerando o tempo de sincronização, você ainda tem apenas alguns dólares.

Você também é livre para escolher outros provedores VPS. Oceano DigitalGotículasO preço é muito competitivo. O processo aqui deve funcionar igualmente bem em gotículas. A AWS da Amazon também é possível. Usar seu próprio hardware pode economizar custos mensais, mas o processo se torna mais complicado e não é adequado para artigos para técnicos de médio porte.

Outra opção que fiz foi usar a distribuição Ubuntu Linux como nosso Geth O sistema operacional do nó. O Ubuntu é uma das distribuições mais populares, mas podemos dizer que você pode escolher outraVários Distribuição Linux. Se você está mais familiarizado com outra distribuição, então você deve ser capaz de lidar com a diferença entre sua escolha e as instruções baseadas no Ubuntu acima.

Eu escolhi um utilitário de serviço do sistema para o Windows, sem alternativas, e cobri o aspecto do SSH no sistema operacional. Da mesma forma, se eu quiser acessar todos os aspectos de todos os softwares em todas as plataformas, esses artigos abordarão novelas. Peço desculpas àqueles que querem mais detalhes. Se você tiver dúvidas sobre essas coisas, poste uma resenha.

Esta é definitivamente uma longa jornada. Eu sei que tudo isso é um pouco ambicioso, especialmente para aqueles com baixo conteúdo técnico. Espero que você possa seguir estas instruções e terminar com seu próprio nó remoto Ethereum, conectando-se ao MetaMask através de um túnel SSH seguro. Se você tiver alguma dúvida ou precisar de ajuda com esse processo, poste um comentário aqui. Estou feliz em ajudar.


---

- **Kauri original title:** Como usar o túnel SSH e o MetaMask para usar o nó remoto do Ethereum
- **Kauri original link:** https://kauri.io/como-usar-o-tunel-ssh-e-o-metamask-para-usar-o-no/b78fc3fef28d419db0d327840175b275/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2019-08-13
- **Kauri original tags:** metamask, ethereum, geth, linux, ssh-tunnel, windows, macos
- **Kauri original hash:** QmWJPafWmzPjnHPMAQHsNix1XwxjWHfMGrXJMz2eHDrsUe
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



