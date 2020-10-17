---
title: Lint your Solidity contracts with Solhint
summary: Solhint is an open source project for linting Solidity code. This project provides both Security and Style Guide validations. Installation You can install Solhint using npm-npm install -g solhint - verify that it was installed correctly solhint -V Usage For linting Solidity files you need to run Solhint with one or more Globs as arguments. For example, to lint all files inside contracts directory, you can do-solhint contracts/**/*.sol To lint a single file-solhint contracts/MyToken.sol Solhint c
authors:
  - Kauri Team (@kauri)
date: 2019-06-05
some_url: 
---

# Lint your Solidity contracts with Solhint

Solhint is an open source project for linting [Solidity](http://solidity.readthedocs.io/en/develop/) code. This project
provides both **Security** and **Style Guide** validations.

## Installation

You can install Solhint using **npm**:

```sh
npm install -g solhint

# verify that it was installed correctly
solhint -V
```

## Usage

For linting Solidity files you need to run Solhint with one or more [Globs](https://en.wikipedia.org/wiki/Glob_(programming)) as arguments. For example, to lint all files inside `contracts` directory, you can do:

```sh
solhint "contracts/**/*.sol"
```

To lint a single file:

```sh
solhint contracts/MyToken.sol
```

Solhint command description:

```text
Usage: solhint [options] <file> [...other_files]

Linter for Solidity programming language


Options:

  -V, --version                              output the version number
  -f, --formatter [name]                     report formatter name (stylish, table, tap, unix)
  -w, --max-warnings [maxWarningsNumber]     number of warnings to trigger nonzero
  -c, --config [file_name]                   file to use as your .solhint.json
  -q, --quiet                                report errors only - default: false
  --ignore-path [file_name]                  file to use as your .solhintignore
  -h, --help                                 output usage information



Commands:

  stdin [options]         put source code to stdin of this utility
  init-config             create sample solhint config in current folder
```

## Configuration

You use a `.solhint.json` file to configure Solhint globally. This file has the following
format:

```json
  {
    "extends": "solhint:default",
    "plugins": [],
    "rules": {
      "avoid-throw": false,
      "avoid-suicide": "error",
      "avoid-sha3": "warn"
    }
  }
```

To ignore files / folders that do not require validation you may use `.solhintignore` file. It supports rules in
`.gitignore` format.

```text
node_modules/
additional-tests.sol
```

### Configure linter with comments

You can use comments in the source code to configure solhint in a given line or file.

For example, to disable all validations in the line following a comment:

```javascript
  // solhint-disable-next-line
  uint[] a;
```

You can disable a single rule on a given line. For example, to disable validation of fixed compiler
version in the next line:

```text
  // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
  pragma solidity ^0.4.4;
```

Disable validation on current line:

```text
  pragma solidity ^0.4.4; // solhint-disable-line
```

Disable validation of fixed compiler version validation on current line:

```text
  pragma solidity ^0.4.4; // solhint-disable-line compiler-fixed, compiler-gt-0_4
```

You can disable a rule for a group of lines:

```javascript
  /* solhint-disable avoid-throw */
  if (a > 1) {
    throw;
  }
  /* solhint-enable avoid-throw */
```

Or disable all validations for a group of lines:

```javascript
  /* solhint-disable */
  if (a > 1) {
    throw;
  }
  /* solhint-enable */
```

## Rules
### Security Rules
[Full list with all supported Security Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md#security-rules)
### Style Guide Rules
[Full list with all supported Style Guide Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md#style-guide-rules)
### Best Practices Rules
[Full list with all supported Best Practices Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md#best-practise-rules)

## More details

* Read the full [Solhint documentation](https://protofire.github.io/solhint/).
* [Roadmap](https://github.com/protofire/solhint/blob/master/ROADMAP.md): The core project's roadmap - what the core team is looking to work on in the near future.
* [Contributing](https://github.com/protofire/solhint/blob/master/CONTRIBUTING.md): The core Solhint team :heart: contributions. This describes how you can contribute to the Solhint Project.
* [Shareable configs](https://github.com/protofire/solhint/blob/master/docs/shareable-configs.md): How to create and share your own configurations.
* [Writing plugins](https://github.com/protofire/solhint/blob/master/docs/writing-plugins.md): How to extend Solhint with your own rules.

## IDE Integrations

  - **[Sublime Text 3](https://packagecontrol.io/search/solhint)**
  - **[Atom](https://atom.io/packages/atom-solidity-linter)**
  - **[Vim](https://github.com/sohkai/syntastic-local-solhint)**
  - **[JetBrains IDEA, WebStorm, CLion, etc.](https://plugins.jetbrains.com/plugin/10177-solidity-solhint)**
  - **[VS Code: Solidity by Juan Blanco](
         https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)**
  - **[VS Code: Solidity Language Support by CodeChain.io](
         https://marketplace.visualstudio.com/items?itemName=kodebox.solidity-language-server)**