# NOBRAIN

The world's least intelligent AI. A meme and community site: poke the empty head, ask it something useless, and make a meme.

NOBRAIN is not a trading bot, not financial advice, and not a promise of future value.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

```bash
npm run build
npm start
```

## Change the project details

Edit [`src/config/project.ts`](src/config/project.ts). That file holds the token name, symbol, contract, network, supply label, trade URL, X URL, and community URL.

You can also set the same values with environment variables. Copy [`.env.example`](.env.example) to `.env.local`.

Placeholder values (`YOUR_CONTRACT_ADDRESS`, `YOUR_TRADE_URL`, and the rest) stay visible until you replace them. The site will not invent a contract address.

## Connect a real answer model

The ask box uses a local joke library until you set a server-side endpoint.

- `NOBRAIN_AI_API_URL` — full chat-completions URL, or a custom endpoint
- `NOBRAIN_AI_API_KEY` — sent only from the server as `Authorization: Bearer`
- `NOBRAIN_AI_MODEL` — when set, the server sends an OpenAI-style chat body

Leave `NOBRAIN_AI_MODEL` empty to POST `{ "question": "..." }` and read `{ "text": "..." }`.

If the remote call fails, the site falls back to the local lines in `src/data/responses.ts`.

Do not put the API key in a `NEXT_PUBLIC_` variable.

## Connect market data

Leave `BLOCKCHAIN_API_URL` empty and the token section says **DATA CONNECTION OFFLINE**. The watch feed says **WAITING FOR REAL NETWORK DATA...**

When you set `BLOCKCHAIN_API_URL`, the server fetches it. `BLOCKCHAIN_API_KEY` is optional and stays on the server. The JSON shape is documented in `.env.example`. Missing fields are shown as an error, not filled in with fake numbers.

## Connect a community feed

`COMMUNITY_API_URL` can return `{ "posts": [...] }`. Until then, the gallery is marked **DEMO** / **SAMPLE DATA**.

## Where things live

- `src/components` — page sections
- `src/data` — jokes, decisions, meme copy, lore
- `src/lib/answers.ts` — local reply picker
- `src/lib/blockchain` — chain types and the server fetch
- `src/app/api` — ask, market, transactions, community
- `src/config/project.ts` — the one file for public project info
