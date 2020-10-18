---
title: System Description Document
summary: System Description The System Description Document \\(SDD\\) is a top level informal document that describes what the system will do. It should describe the “System” or “Product” from a users’ perspective. This is the first document that any auditor or contractor would read. From it they should understand what the system does. Why do a System Description Document? This is the first document any outside auditor will read. It gives them context and perspective. Who reads the System Description Doc
authors:
  - Rex Hygate (@rhygate)
date: 2019-03-13
some_url: 
---

# System Description Document


## System Description

The System Description Document \(SDD\) is a top level informal document that describes what the system will do. It should describe the “System” or “Product” from a users’ perspective. This is the first document that any auditor or contractor would read. From it they should understand what the system does.

#### Why do a System Description Document?

This is the first document any outside auditor will read. It gives them context and perspective.

#### Who reads the System Description Document?

Any third party that will be working with the smart contracts should read the SDD first. This will include auditors, but could also include new colloborators that join your project.

### What is Included in the SDD?

The document does not formally trace to any requirements or tests. This means the document can be in any format. Think of it as the “spirit of the application”.

It can include web as well as smart contracts aspects of the application. It should include the business aspects of the project and a description of any tokens, their uses and life cycle. It can include a list of the goals for the smart contracts. It can be an excerpt of the white paper but should be an independent document.

#### Description from the Users Point of View

The SDD should describe what the user does and why. Describe their business incentives for using the application. Ideally it would have a users instruction manual and a set of user stories but that is not required.

#### Tokens

This is the only document where you can describe the uses and lifecycle of a token from a business perspective. It is important for an auditor to know which tokens will hold a high value.

#### Diagrams

This is a good place to include any relevant flow diagrams explaining your system or aspects of it. Many other documents of this process \(requirements, code, tests, etc\) often are text files that cannot carry documents, so put the diagrams in this document and reference them elsewhere.

#### Web Aspect of the Application

While this section can simply describe a web application, consider mentioning other aspects important to the smart contract. How many instances can be called in parallel? Are there any aspects in the design of the web application that will affect the smart contract \(e.g. the owner is assumed to use it only in a certain way\)? State any relevant assumptions.

#### Hardware

If your Application uses hardware such as an Internet of Things device, this is the place to describe it. If the device will interact with the Blockchain then its code will have its own set of requirements.

### Examples

Check [here ](../examples.md)for a description of the examples used below.

[Example 1 - CryptoZombies Lesson 4](https://github.com/SecurEth/CryptoZombiesT2/blob/master/Lesson4/doc/SystemDefinitionDoc.md)

[Example 2 - Tiny DNS](https://github.com/SecurEth/guidelines/blob/master/project-planning/example1-tinyDNS.md)

[Example 3 - Wayback](https://github.com/SecurEth/Wayback/blob/master/docs/01%20-%20System%20Description%20Document.md)

### Template

What is the top level of your System/Application/Product?

What does the User see and do with the Application?

Describe any tokens involved in the system, including value and flow.

###  

Got a comment?  Check out our [Gitter Channel](https://gitter.im/SecurEth_Guidelines/community#)!

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/)






---

- **Kauri original title:** System Description Document
- **Kauri original link:** https://kauri.io/system-description-document/a3a29cf21736417684361836693388e5/a
- **Kauri original author:** Rex Hygate (@rhygate)
- **Kauri original Publication date:** 2019-03-13
- **Kauri original tags:** solidity-guidelines-developer-vyper
- **Kauri original hash:** QmSme42poZqdd52FbHohuLgqRtopUdXQsUJboimxgs5J2G
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



