import {
  Canister,
  Err,
  None,
  Ok,
  Principal,
  Record,
  Result,
  Some,
  StableBTreeMap,
  Vec,
  ic,
  query,
  text,
  update,
} from "azle";

import {
  HttpResponse,
  HttpTransformArgs,
  managementCanister,
} from "azle/canisters/management";

// Define a record for a crypto token with just the name and symbol
const CryptoToken = Record({
  name: text,
  symbol: text,
});

// Define a record for user's favorite tokens
const UserFavorites = Record({
  id: Principal,
  favorites: Vec(CryptoToken),
});

// Define a simple storage structure for user favorites
const userFavoritesStorage = StableBTreeMap(Principal, UserFavorites, 1);

/**
 * Defines a Canister object with three methods:
 * - getCoinPrice: retrieves the price of a given cryptocurrency using the CoinGecko API.
 * - saveFavoriteToken: saves a given CryptoToken as a favorite for the current user.
 * - removeFavoriteToken: removes CryptoToken as a favorite for the current user.
 * - getFavoriteTokens: retrieves the list of favorite CryptoTokens for the current user.
 */
export default Canister({
  getCoinPrice: update([text], Result(text, text), async (coinId) => {
    const coin = coinId.toLowerCase();

    const response = await ic.call(managementCanister.http_request, {
      args: [
        {
          url: `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`,
          max_response_bytes: Some(5_000n),
          method: {
            get: null,
          },
          headers: [],
          body: None,
          transform: Some({
            function: [ic.id(), "transformHttpResponse"] as [Principal, string],
            context: Uint8Array.from([]),
          }),
        },
      ],
      cycles: 90_000_000n,
    });

    if (Number(response.status) !== 200) {
      return Err("Failed to get coin price");
    }

    var body = JSON.parse(new TextDecoder().decode(response.body));

    if (!body[coin]) {
      return Err("Coin not found");
    }

    const price = body[coin].usd;
    return Ok(`The price of ${coin} is $${price}`);
  }),

  saveFavoriteToken: update([CryptoToken], Result(text, text), (token) => {
    const userId = ic.caller();

    const entry = {
      id: userId,
      favorites: [token],
    };

    if (userFavoritesStorage.containsKey(userId) === false) {
      userFavoritesStorage.insert(userId, entry);
    } else {
      const favorites = userFavoritesStorage.get(userId);
      entry.favorites = [...favorites.Some.favorites, token];
      userFavoritesStorage.insert(userId, entry);
    }

    return Ok(`Token ${token.name} added to favorites`);
  }),
  removeFavoriteToken: update([text], Result(text, text), (tokenSymbol) => {
    const userId = ic.caller();

    if (userFavoritesStorage.containsKey(userId) === false) {
      return Err("No favorites found");
    }

    const tokens = userFavoritesStorage.get(userId).Some.favorites;

    const token: typeof CryptoToken = tokens.find(
      (token: typeof CryptoToken) => token.symbol === tokenSymbol
    );

    if (!token) {
      return Err("Token not found");
    }

    const favorites = tokens.filter(
      (token: typeof CryptoToken) => token.symbol !== tokenSymbol
    );

    const entry = {
      id: userId,
      favorites: favorites,
    };

    userFavoritesStorage.insert(userId, entry);

    return Ok(`Token ${token.name} removed from favorites`);
  }),

  getFavoriteTokens: query([], Result(Vec(CryptoToken), text), () => {
    const userId = ic.caller();

    if (userFavoritesStorage.containsKey(userId) === false) {
      return Err("No favorites found");
    }

    const favorites = userFavoritesStorage.get(userId);

    return favorites ? Ok(favorites.Some.favorites) : Err("No favorites found");
  }),
  transformHttpResponse: query([HttpTransformArgs], HttpResponse, (args) => {
    return {
      ...args.response,
      headers: [],
    };
  }),
});
