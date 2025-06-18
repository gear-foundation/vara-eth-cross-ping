# Relayer for CrossPing

This is the relayer for the Vara ↔ Ethereum CrossPing example.

The relayer listens for new messages on the Vara network, collects proofs, and delivers them to Ethereum for trustless processing via the Vara ↔ Ethereum Bridge.

## What does this application do?

- Listens to the Vara blockchain for `PingSent` and Merkle root events.
- Fetches Merkle proofs and message metadata from Vara.
- Waits for the Merkle root to be submitted to Ethereum (RelayerProxy).
- Submits messages (with proofs) to the Ethereum MessageQueue contract for final delivery.

It is implemented in Node.js, but any language can be used as long as it supports required APIs.


## Requirements

- Node.js (v18+ recommended)
- Yarn (`npm install -g yarn`)


## (`.env`)

Create a `.env` file in the project root with the following variables:

```env
VARA_RPC_URL=wss://testnet.vara.network
ETHEREUM_RPC_URL=wss://reth-rpc.gear-tech.io/ws
CROSS_PING_PROGRAM_ID=0x8e3f07ea8c47f40eb9958102005130944dab9a6ffbfe335c2e7f4a5082f51bf9
RELAYER_PROXY_ADDRESS=0x602Da93eee9C30Ed2d8c72032B8845cd76d917d2
MESSAGE_QUEUE_PROXY_ADDRESS=0x60430248f49376860e2047aCdaFF71D3Eb6ce41c
# PRIVATE_KEY=your_eth_private_key_here
```

## Building & Running

Install dependencies:

```sh
yarn install
```

Start the relayer:

```sh
yarn dev
```

## Project Structure

- `src/config.ts` — configuration constants and IDL's
- `src/vara.ts` — Vara connection & event listeners
- `src/ethereum.ts` — Ethereum connection & event listeners
- `src/main.ts` — entry point, listeners orchestration
- `.env` — environment variables (RPC endpoints, contract addresses, private key)
