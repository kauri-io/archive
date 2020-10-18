---
title: Utilisez votre nœud Ethereum distant en utilisant un tunnel SSH et MetaMask
summary: Warning- We found this translation of Daniel Ellisons post and thought wed cross-post it, but we have no idea as to the quality of the translation. dans le première partie de cette série, nous avons appris comment installer et synchroniser une geth noeud avec la chaîne de blocs Ethereum sur un serveur virtuel privé (VPS). Dans cette seconde partie, nous explorons garantir accès à distance à ce nœud Ethereum via MetaMask.We explique également comment faire en sorte que tout continue à survivre au
authors:
  - Kauri Team (@kauri)
date: 2019-08-15
some_url: 
---

# Utilisez votre nœud Ethereum distant en utilisant un tunnel SSH et MetaMask


> **Warning**: We found this translation of [Daniel Ellison's post](https://kauri.io/article/348d6c66da2949978c85bf2cd913d0ac/v5/make-use-of-your-remote-ethereum-node-using-an-ssh-tunnel-and-metamask) and thought we'd cross-post it, but we have no idea as to the quality of the translation.

---

dans le [première partie](https://medium.com/@zigguratt/how-to-install-and-synchronize-your-own-remote-ethereum-node-5d875c684504) de cette série, nous avons appris comment installer et synchroniser une `geth` noeud avec la chaîne de blocs Ethereum sur un serveur virtuel privé (VPS). Dans cette seconde partie, nous explorons _garantir_ accès à distance à ce nœud Ethereum via MetaMask.We explique également comment faire en sorte que tout continue à survivre aux crashs et aux arrêts.

### Mise en place d'un tunnel SSH

Mise en place d'un _quoi?_ C'est le processus déroutant que j'ai mentionné plus tôt. Je n'entrerai pas dans les détails ici, mais en réalité, cela permet aux demandes adressées à votre ordinateur local d'être automatiquement transférées à un autre ordinateur. Dans ce cas, le VPS exécutant votre `geth` nœud. Nous comprendrons pourquoi nous en avons besoin lors de la création ultérieure de MetaMask.

### Obtention de l'adresse IP de votre VPS

Afin de transférer les demandes à votre SMV, vous devez connaître son adresse IP. Ceci est déterminé en retournant à votre tableau de bord Linode et en allant à la _Linodes_ onglet à gauche. L'adresse IP de votre nœud devrait apparaître à droite, juste en dessous de l'emplacement géographique de votre VPS. Cela ressemble à quelque chose comme ça: `172.16.389.54`. Prenez note de cette adresse IP; nous allons l'utiliser bientôt.

### SSH sous Windows

Depuis la mise à jour d'avril 2018, OpenSSH est installé par défaut sur Windows 10. Cela fournit `ssh.exe` ainsi que plusieurs autres utilitaires SSH. Pour vérifier l'état de SSH sous Windows au moment de la rédaction, j'ai téléchargé le dernier ISO de Windows 10 et je l'ai installé sur une machine virtuelle. OpenSSH était déjà installé et disponible à partir de `cmd.exe`. Si vous avez Windows 10 mais que OpenSSH n'est pas installé, suivez les instructions de cette [Article de Microsoft](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_overview). Si vous possédez une version plus ancienne de Windows, plusieurs utilitaires disponibles fourniront des fonctionnalités SSH.

### Initier le tunnel

Nous partons de là en supposant que vous avez un accès en ligne de commande à un `ssh` client. La commande suivante configure le tunnel SSH. Cette commande est identique sur les trois plates-formes.

```shell
ssh -N -v utilisateur@172.16.389.54 -L 8545: hôte local: 8545
```

le `-N` commutateur dit
`ssh` ne pas exécuter une commande à
distance. Nous voulons une connexion continue, ou _tunnel_, à notre
noeud. Aucune commande à exécuter à distance à ce stade. le
`-v` commutateur fait `ssh` afficher des informations de journalisation pendant son
exécution. Nous fournissons ensuite le nom d'utilisateur et l'adresse IP
afin de vous connecter à notre VPS. Le reste configure le tunnel
lui-même, en spécifiant que tout ce que votre machine locale reçoit sur
le port `8545` (le port sur lequel votre
nœud écoute les demandes RPC) doit être transféré vers le même port sur
votre nœud _en toute sécurité dans le tunnel_. C'est le point le plus
important: personne d'autre ne peut le faire, sauf vous. Votre nœud est
à l'abri des exploits dus à un port RPC exposé.

C’est la partie la plus facile de tout le kerfuffle du tunnel. Je
suppose que vous avez laissé le tunnel SSH en marche et que vous pouvez
voir sa sortie de journal. Dans votre navigateur, activez MetaMask en
cliquant sur la tête de renard en haut à droite de la fenêtre de votre
navigateur. En haut de la fenêtre MetaMask se trouve le réseau Ethereum
actuellement choisi. Si vous utilisiez des versions bêta dapps, il est
probable que _Réseau de test Rinkeby_. Cliquez sur ce nom et vous verrez
un menu déroulant. Au sommet est _Réseau Ethereum principal_. C’est
notre destination finale, mais nous ne voulons pas utiliser cet élément
de menu. Si vous le faites, MetaMask se connecte à un nœud Infura,
annulant ainsi l’objectif de ce long voyage. Plus bas dans la liste,
vous voyez _Localhost 8545_. Cliquez dessus pour regarder la sortie de
votre tunnel SSH. Vous devriez voir les lignes ressembler à ceci:

    debug1: connexion au port 8545 transmettant au port localhost 8545 demandé.debug1: channel 1: new [direct-tcpip]

MetaMask devrait maintenant avoir _Localhost 8545_ au sommet et vous devriez voir _Dépôt_ et _Envoyer_ boutons au milieu. Si oui, vous avez maintenant connecté votre télécommande `geth` noeud vers MetaMask, bien que MetaMask pense s'être connecté à votre ordinateur local.

### Faire du permanent impermanent

Vous avez maintenant un pleinement fonctionnel `geth` noeud et sont capables de se connecter à distance _et en toute sécurité_ à travers MetaMask et un tunnel SSH. Toutes nos félicitations! Bien sûr, les ordinateurs tombent en panne ou sont arrêtés délibérément. Afin de ne pas avoir à tout configurer à nouveau lors d'un redémarrage, nous devons faire deux choses: premièrement, configurer notre `geth` nœud pour démarrer automatiquement sur le SMV et deux, en quelque sorte faire la même chose pour le tunnel SSH sur notre machine locale.

### Permanence à distance

En termes relatifs, c'est la partie la plus facile du processus de permanence. Nous n'avons affaire qu'à un seul système d'exploitation, Linux, et il existe un moyen bien établi de démarrer des tâches automatiquement: `systemd`. La politique Linux mise à part, commençons.

`systemd` gère les processus sur la plupart des systèmes Linux, Ubuntu ne faisant pas exception. Pour ce faire, il lit `.un service` des dossiers. Avoir notre `geth` nœud démarre automatiquement au démarrage, nous devons fournir un `geth.service` fichier. Retournez et lancez la console depuis le _Linodes_ languette. Si ton `geth` noeud est toujours en cours d'exécution, vous devez le fermer. Comme précédemment, tapez ce qui suit pour vous reconnecter à votre `geth` nœud:

```shell
$ tmux attach -t 0
```

Arrête ton `geth` noeud avec
`ctrl-c`. Encore une fois, attendez que
vous soyez à une invite de commande, puis tapez `ctrl-d` sortir de `tmux`. Tapez
ce qui suit sur la ligne de commande, en remplaçant
`utilisateur` dans
`Utilisateur = utilisateur` pour le nom
d'utilisateur que vous avez fourni précédemment:

```shell
$ cat> geth.service << EOF
[Unit]
Description = Aller client Ethereum
[Service]
Utilisateur = utilisateur
Type = simple
Redémarrer = toujours
ExecStart = / usr / bin / geth --rpc --rpcaddr localhost --rpcport 8545
[Install]
WantedBy = default.target
EOF
```

Cela crée un `geth.service` fichier dans le répertoire en cours. Vous devez faire quelques choses pour le rendre disponible à `systemd`:

```shell
$ sudo mv geth.service / etc / systemd / system /
$ sudo systemctl daemon-reload
$ sudo systemctl enable geth.service
$ sudo systemctl start geth.service
```

Pour vérifier le statut du service, utilisez ceci:

    $ sudo systemctl status geth.service

Quelque part vers le début de la sortie, vous verrez `actif (en cours d'exécution)`. Si vous ne le faites pas, il y aura des messages d'erreur ci-dessous. Bonne chance! Pour voir une sortie continue de `geth`, tapez ce qui suit:

```shell
$ sudo journalctl -f -u geth.service
```

Si tout va bien, vous verrez un flux de lignes contenant _Nouveau
segment de chaîne importé_. Type `ctrl-c`
pour arrêter la sortie. Ne vous inquiétez pas, cela n'arrête pas votre
`geth` nœud. Il ne cesse de montrer le
`systemd` enregistrer la sortie.

A partir de maintenant, lorsque votre VPS redémarre pour une raison
quelconque `geth` redémarre
automatiquement.

### Permanence locale

Vous avez démarré avec succès un tunnel SSH sur votre machine, mais dès
que vous fermez le terminal ou mettez votre ordinateur portable en
veille, le tunnel se déconnecte et la connexion est interrompue. Ceci
est évidemment sous-optimal. Devoir démarrer une session de terminal et
réactiver le tunnel est un peu fastidieux. Le problème est que les trois
principaux systèmes d'exploitation disposent de trois manières
différentes pour configurer des services permanents tels que notre
tunnel SSH.

#### Paires de clés SSH

Pour que l'un des éléments suivants fonctionne automatiquement, vous
devez disposer de clés privées et publiques SSH. Si vous régulièrement
`ssh` dans des machines distantes sans
avoir besoin de fournir un mot de passe, vous êtes déjà configuré. Même
dans ce cas, vous devez envoyer votre clé publique à la machine distante
exécutée. `geth`. Pour obtenir des
instructions sur la procédure à suivre – et comment générer une paire de
clés SSH en premier lieu si vous en avez besoin – [cet article de Linode](https://www.linode.com/docs/security/authentication/use-public-key-authentication-with-ssh/)
ou [celui de Atlassian](https://confluence.atlassian.com/bitbucketserver/creating-ssh-keys-776639788.html)
explique les choses assez bien. Ces articles sont déjà très longs et
très techniques. fouiller avec des clés SSH est un processus bien connu,
il n'est donc pas nécessaire de répéter ces instructions ici. Si vous
pouvez taper:

    $ ssh utilisateur@172.16.389.54

fournir votre propre nom d'utilisateur et l'adresse IP de votre télécommande `geth` Si vous êtes connecté sans avoir à fournir de mot de passe, vous êtes prêt à partir. Si ce n'est pas le cas, aucune des solutions suivantes ne fonctionnera.

#### Linux

Le processus de création d'un tunnel SSH permanent est similaire à celui utilisé sur notre système VPS. Nous installons un `persistent.ssh.tunnel.service` archivez et configurez les éléments pour que le service démarre avec le système. La seule différence majeure, mis à part la nécessité nécessairement différente `ExecStart` line, c'est que nous devons faire précéder cette ligne d'une ligne spécifiant un léger délai de démarrage pour nous assurer que le réseau est prêt avant le démarrage du service. Rappelez-vous, bien sûr, pour remplacer `utilisateur` dans `Utilisateur = utilisateur` avec votre propre nom d'utilisateur et `utilisateur@172.16.389.54` avec votre nom d'utilisateur sur le système distant et son adresse IP.

```shell
$ cat> persistent.ssh.tunnel.service << EOF
[Unit]
Description = Tunnel SSH persistant
[Service]
Utilisateur = utilisateur
Type = simple
Redémarrer = toujours
ExecStartPre = / bin / sleep 10
ExecStart = / usr / bin / ssh -N -v utilisateur@172.16.389.54 -L 8545: localhost: 8545
[Install]
WantedBy = default.target
EOF
```

Cela crée un `persistent.ssh.tunnel.service` fichier dans le répertoire en cours. Comme auparavant, vous devez faire quelques choses pour le rendre disponible à `systemd`, cette fois sur votre système local:

```shell
$ sudo mv persistent.ssh.tunnel.service / etc / systemd / system /
$ sudo systemctl daemon-reload
$ sudo systemctl enable persistent.ssh.tunnel.service
$ sudo systemctl start persistent.ssh.tunnel.service
```

Pour vérifier que le service a démarré avec succès, tapez ce qui suit:

    $ sudo systemctl status persistent.ssh.tunnel.service

#### macOS

MacOS d'Apple a sa propre façon de configurer des services persistants en utilisant `launchctl`. Semblable à `systemd` sous Linux, vous fournissez un fichier de configuration – cette fois sous la forme d'un [Document XML](https://en.wikipedia.org/wiki/XML) au lieu d'un [Fichier INI](https://en.wikipedia.org/wiki/INI_file) – puis installez et activez le service à l'aide de ce document XML. Tout d'abord, nous créons ce fichier, en fournissant comme d'habitude le nom d'utilisateur et l'adresse IP de notre VPS pour Windows. `utilisateur@172.16.389.54`. De plus, indiquez votre nom d'utilisateur macOS sous `Nom d'utilisateur`.

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

Une fois que vous avez créé le
`com.persistent.ssh.tunnel.plist`
fichier, déplacez-le vers un emplacement dans lequel
`launchctl` s'attend à ce que ces
fichiers résident. Enfin, donnez-lui la commande pour l'installer dans
le système et démarrer le processus en arrière-plan.

```shell
$ sudo mv com.persistent.ssh.tunnel.plist /Library/LaunchDaemons/
$ sudo launchctl load /Library/LaunchDaemons/com.persistent.ssh.tunnel.plist
```

Installer le `.pliste` déposer dans `/ Bibliothèque / LaunchDaemons /` le met à la disposition de tout utilisateur du système; cela ne dépend pas de votre connexion pour que le tunnel soit actif.

#### Windows

Pour configurer un service persistant dans Windows, vous devez télécharger un utilitaire offrant cette fonctionnalité. Celui que j'ai utilisé est le libre, l'open source et le domaine public [NSSM](https://nssm.cc/) alors vous devez [installez ça](https://nssm.cc/release/nssm-2.24.zip) avant de procéder.

Les étapes ci-dessous créent le `tunnel ssh persistant` service et définit divers paramètres afin que vous puissiez l'utiliser pour connecter MetaMask à votre `geth` nœud. J'ai fourni les commandes ainsi que les réponses de `nssm` pour plus de clarté. Pour exécuter ces commandes, vous devez démarrer une session de terminal en tant qu'administrateur Windows. Vous pouvez le faire en ouvrant le menu Démarrer et en tapant `cmd`. Cela devrait amener un _Meilleure correspondance_ menu avec _Invite de commande_ a souligné. À droite choisir _Exécuter en tant qu'administrateur_. Cliquez sur _Oui_ pour permettre à cette application d'apporter des modifications. Si tout se passe bien, une fenêtre de terminal noire s'ouvre avec l'invite de commande. `C: Windows system32>`. Tapez soigneusement les commandes ci-dessous, en vous assurant que _ne pas_ taper l'invite de commande! Assurez-vous que chaque commande obtient une réponse similaire à celle fournie ici. Remplacez votre nom d'utilisateur Windows par `.utilisateur` (en gardant le `.`) et votre mot de passe de connexion Windows pour `mot de passe`. Indiquez également votre nom d'utilisateur et l'adresse IP de votre télécommande `geth` noeud dans `utilisateur@172.16.389.54`.

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

#### Test du tunnel SSH persistant

En supposant que tout se passe bien, vous disposez maintenant d'un service système sous Windows, Linux ou macOS qui s'exécute en arrière-plan et démarre à chaque redémarrage de votre ordinateur local. Pour le tester, ouvrez un navigateur sur lequel MetaMask est installé et suivez les instructions ci-dessus. _Configuration du méta-masque_. MetaMask devrait à nouveau se connecter à _Localhost 8545_, mais cette fois-ci, le service d'arrière-plan utilise les tunnels qui demandent `geth` VPS. Vous n'avez plus besoin de penser à établir une connexion avec votre nœud Ethereum distant.

### Conclusion

Par souci d'opportunité, j'ai fait des choix spécifiques dans ces articles. Par exemple, j'ai choisi d'utiliser un VPS, et même un fournisseur de VPS particulier, pour notre nœud Ethereum. Comme expliqué ci-dessus, cela coûte de l'argent. Les développeurs dapp qui perçoivent des revenus de leur projet doivent absolument envisager cet itinéraire. D'autre part, quelqu'un qui est simplement curieux et qui souhaite suivre les étapes décrites peut configurer un VPS, suivre le tutoriel, et après l'avoir testé et avoir appris tout ce qu'il y a à apprendre, éteignez et supprimez le VPS. Cela ne coûterait que quelques centimes: si cela vous prenait deux heures pour terminer ce tutoriel, vous perdriez 24 ¢ US, en supposant un _Linode 16 Go_ VPS.

Vous êtes également libre de choisir un autre fournisseur VPS. Océan numérique _Gouttelettes_ sont à des prix compétitifs. Le processus ici devrait fonctionner aussi bien sur une gouttelette. AWS d'Amazon est également une possibilité. L'utilisation de votre propre matériel permettrait d'économiser des coûts mensuels, mais le processus deviendrait beaucoup plus complexe et aurait été inapproprié pour un article destiné à des personnes moyennement techniques.

Un autre choix que j'ai fait est d'utiliser la distribution Linux Ubuntu comme système d'exploitation de notre système. `geth` nœud. Ubuntu est l'une des distributions les plus populaires, mais il y a, dirons-nous, _nombreuses_ autres distributions Linux que vous pourriez choisir. Si vous êtes plus familier avec une autre distribution, vous devriez être capable de gérer les différences entre votre choix et les instructions ci-dessus basées sur Ubuntu.

J'ai choisi un utilitaire de service système pour Windows, n'offrant aucune alternative, et j'ai passé en revue les aspects SSH de ce système d'exploitation. Encore une fois, ces articles s'approcheraient de nouveautés si je devais aborder tous les aspects du logiciel sur toutes les plates-formes. Je présente mes excuses à ceux qui voulaient plus de détails. S'il vous plaît laissez un commentaire si vous avez des questions sur ces choses.

Cela a certainement été un long voyage. Je sais que tout est un peu ambitieux, en particulier pour ceux qui ont une technique moins technique. J'espère que vous avez pu suivre ces instructions et vous retrouver avec votre propre nœud Ethereum distant, en vous y connectant avec MetaMask via un tunnel SSH sécurisé. Si vous avez des questions ou avez besoin d'aide pour le processus, laissez un commentaire ici. Je serais heureux d'aider.
