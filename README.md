# MetaTransaction using Hardhat

This project demonstrates how to implement a MetaTransaction using Hardhat, a popular development environment for building Ethereum applications. In this project, we use the Hardhat framework to deploy and test a smart contract that allows a user to send tokens to another address through a relayer.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14.17.0 or higher)
- npm (v7.20.0 or higher)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Akkii4/MetaTransaction
```

2. Install the dependencies:

```sh
npm install
```

### Usage

1. Compile the contracts:

```sh
npx hardhat compile
```

2. Run the tests:

```sh
npx hardhat test
```

The tests demonstrate how to deploy the MetaTokenSender and RandomToken contracts, mint tokens to a user address, and execute a transfer of tokens through a relayer using a MetaTransaction.

## Contracts

### RandomToken

This contract represents a simple ERC20 token that is used for the purpose of demonstrating MetaTransactions. The contract allows the owner to mint new tokens and transfer tokens to other addresses.

### TokenSender

This contract implements a MetaTransaction for transferring tokens. The contract has a `transferWithNonce` function that takes the following parameters:

- `from`: the address of the user who wants to send tokens
- `amount`: the amount of tokens to send
- `to`: the address of the recipient
- `token`: the address of the token contract
- `nonce`: a unique number that is incremented for each MetaTransaction
- `signature`: the signature of the user on the MetaTransaction message hash

The `transferWithNonce` function is designed to be called by a relayer on behalf of the user. The function checks the signature of the user and transfers the tokens if the signature is valid.

## Contributing

Contributions are welcome! If you find any issues or would like to suggest improvements, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
