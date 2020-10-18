---
title: Pantheon - The Enterprise Ethereum Client
summary: Pantheon is a suite of ETH-based services created by PegaSys, and aims to create an ethereum client that develops its enterprise-focused features in lock-step with the evolution of the public Ethereum blockchain. Pantheon helps enterprises profit from the Ethereum public blockchain while explicitly following the Enterprise Ethereum Alliance (EEA) standards. Pantheon is focused on being fully interoperable with other Ethereum technology including Geth, Parity, etc. Pantheon uses the Apache 2.0 op
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-03-01
some_url: 
---

# Pantheon - The Enterprise Ethereum Client

![](https://ipfs.infura.io/ipfs/Qme8Rk7peKJkFMQfhpVhNsyKLaaNYBanGdSNjqpu91hgK7)


Pantheon is a suite of ETH-based services created by PegaSys, and aims to create an ethereum client that develops its enterprise-focused
features in lock-step with the evolution of the public Ethereum
blockchain. Pantheon helps enterprises profit from the Ethereum public
blockchain while explicitly following the [Enterprise Ethereum Alliance](https://bitcoinexchangeguide.com/enterprise-ethereum-alliance-eea-welcomes-ebay-foxconn-to-blockchain-consortium/)
(EEA) standards. Pantheon is focused on being fully interoperable with
other Ethereum technology including Geth, Parity, etc.

Pantheon uses the Apache 2.0 open source software license and Java to
create a new Ethereum client that is easier to program, gives more
flexibility and freedom than the GPL.

Pantheon provides:

- Main-net compatibility
- Consensus algorithms
- Enhanced privacy features
- Permissioning controls
- A command line interface
- JSON-RPC API for running, maintaining, debugging, and monitoring node operations in an Ethereum network.

### Installation

#### Install on macOS Using Homebrew

```shell
brew tap pegasyseng/pantheon
brew install pantheon
```

#### Install on Windows with Chocolatey

```shell
choco install pantheon
```

#### Install from Packaged Binaries

Download the Pantheon [packaged binaries](https://bintray.com/consensys/pegasys-repo/pantheon/_latestVersion#files).
Unpack the downloaded files and in the unpacked directory run:

```shell
bin/pantheon --help
```

### Build from source

Pantheon requires Java 8+ to compile, earlier versions are not
supported. Pantheon is currently supported only on 64-bit versions of
Windows, and requires a 64-bit version of JDK/JRE. It's recommended to remove any 32-bit JDK/JRE installations.

Clone the repo:

```shell
git clone --recursive https://github.com/PegaSysEng/pantheon.git
```

In the _pantheon_ directory build Pantheon with the Gradle wrapper `gradlew`, omitting tests:

```shell
./gradlew build -x test
```

To run `gradlew`, you must have the `JAVA_HOME` system variable set to the Java installation directory.

Go to the distribution directory:

```shell
cd build/distributions/
```

Expand the distribution archive:

```shell
tar -xzf pantheon-{version}.tar.gz
```

Move to the expanded folder and display the Pantheon help to confirm
installation.

```shell
cd pantheon-{version}/
bin/pantheon --help
```

### Installation on a VM

You can run Pantheon on a virtual machine (VM) on a cloud service such
as AWS or Azure, or locally using a VM manager such as
[VirtualBox](https://www.virtualbox.org/).

If you set up your own VM locally using a VM manager such as
[VirtualBox](https://www.virtualbox.org/), there are a few
considerations:

- Make sure that you enable Intel Virtualization Technology (VTx) and Virtualization Technology for Directed I/O (VT-d) in the BIOS settings.
- On Windows, you might need to disable Hyper-V in the Windows Feature list.

It is recommended that you create a VM with the following attributes:

- Memory size set to 4096
- Create a virtual hard disk with at least 10 GB
- Virtual hard disk file type: VDI (if you need to share it with other apps, use VHD)
- (Optional) You can create a shared directory to copy block files or genesis files from the host computer to the VM. For details on how to create a shared directory, see "Share Folders" in [Install Ubuntu on Oracle VirtualBox](https://linus.nci.nih.gov/bdge/installUbuntu.html).

### Next Steps

- [The build from source tutorial](https://docs.pantheon.pegasys.tech/en/latest/Installation/Build-From-Source/)
- [The Private Network Quickstart](https://docs.pantheon.pegasys.tech/en/latest/Tutorials/Private-Network-Quickstart/)
- [Starting Pantheon](https://docs.pantheon.pegasys.tech/en/latest/Getting-Started/Starting-Pantheon/)
- [The Pantheon knowledge base](https://docs.pantheon.pegasys.tech/en/stable/)



---

- **Kauri original link:** https://kauri.io/pantheon-the-enterprise-ethereum-client/48c4c61a77304ecab8df7247aa1900ac/a
- **Kauri original author:** Chris Ward (@chrischinchilla)
- **Kauri original Publication date:** 2019-03-01
- **Kauri original tags:** ethereum, library, enterprise, pantheon, sdk
- **Kauri original hash:** QmYrQXKqFndyoNJim1ptxNvZ4UnGwccCvKd3UBXY9GG2jz
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



