# ICP-Token-Manager

This is a simple canister that uses the CoinGecko API to get the price of a given cryptocurrency. It also allows users to save their favorite tokens and retrieve them later.

## How to run the project

- Clone the repository

```bash
git clone https://github.com/AndWa/ICP-Token-Manager.git
```

- Install dependencies

```bash
npm install
```

- Start DFX (More about the flags can be found [here](https://internetcomputer.org/docs/current/references/cli-reference/dfx-start#flags))

```bash
dfx start --background --clean
```

- Deploy canister

```bash
dfx deploy
```

Once the command completes, you should see a message indicating the successful deployment of your canisters. The output will include URLs for interacting with your backend canister through the Candid interface.

Example:

```bash
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    token_manager: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
```

- Stop DFX when done

```bash
dfx stop
```

# Use cases

Use cases can be done through the **Candid interface** or using the command line with the commands below.

## Get coin price by calling coingecko api

```bash
dfx canister call token_manager getCoinPrice '("internet-computer")'
```

You will get a message (will be different because of the token price):

```rust
(variant { Ok = "The price of internet-computer is $4.58" })
```

## Add coin to favorites

```bash
dfx canister call token_manager saveFavoriteToken '(record {"name"="Internet Computer"; "symbol"="ICP";})'
```

You will get a message:

```rust
(variant { Ok = "Token Internet Computer added to favorites" })
```

## Get all favorites

```bash
dfx canister call token_manager getFavoriteTokens
```

You will get a message:

```rust
(variant { Ok = vec { record { name = "Internet Computer"; symbol = "ICP" } } })
```

## Remove coin from favorites

```bash
dfx canister call token_manager removeFavoriteToken '("ICP")'
```

You will get a message:

```rust
(variant { Ok = "Token Internet Computer removed from favorites" })
```
