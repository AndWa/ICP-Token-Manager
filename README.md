# ICP-Token-Manager

This project is a canister that leverages the Internet Computer Protocol (ICP) and the Azle framework. It is designed to interact with the CoinGecko API for fetching real-time cryptocurrency prices and enables users to manage a watchlist of their favorite cryptocurrencies.

## Key Components

- **CryptoToken**: Records the essential details of a cryptocurrency, such as its name and symbol.
- **UserFavorites**: Associates a user's unique Principal identifier with their list of favorite cryptocurrencies.
- **userFavoritesStorage**: Utilizes `StableBTreeMap` for stable storage, ensuring persistence of user favorites across system updates.

## Features

- **getCoinPrice**: Retrieves the current price of a specified cryptocurrency in USD from the CoinGecko API.
- **saveFavoriteToken**: Allows a user to add a cryptocurrency to their favorites list.
- **removeFavoriteToken**: Permits a user to remove a cryptocurrency from their favorites list.
- **getFavoriteTokens**: Fetches the list of a user's favorite cryptocurrencies.

## Interaction

Users can interact with the canister via its public methods. The application supports both reading and writing operations, enabling users to update their watchlist and access up-to-date pricing information.

## External HTTP Requests

The canister makes use of `managementCanister.http_request` to execute outbound HTTP requests to the CoinGecko API.

## Purpose

The provided code snippet serves an educational purpose, demonstrating how to build a canister on the ICP using the Azle framework.

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

## Get coin price by calling CoinGecko API

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
