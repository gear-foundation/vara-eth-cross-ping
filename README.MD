# Vara ↔ Ethereum Cross-Chain Ping (Minimal Example)

This is a minimal working example of a cross-chain application (Ping) demonstrating secure message delivery from the Vara network to Ethereum via the Vara ↔ Ethereum Bridge.

The project consists of three main components:

- `cross-ping/` – The Vara-side program (Rust): sends a cross-chain Ping message.
- `relayer/` – The permissionless relayer (Node.js): delivers messages and proofs from Vara to Ethereum.
- `ping-receiver/` – The destination contract (Solidity): receives messages and emits a Pong event on Ethereum.

**What does this example show?**
- End-to-end flow: How to send, relay, and receive a message across two independent blockchains using trustless infrastructure.
- Minimal, production-like code: All business logic is in the application layer, while cryptographic security and cross-chain proof-of-delivery are handled by the bridge protocol.

---

_This example is intended for developers interested in cross-chain messaging, bridge integration, and hands-on experimentation. It can serve as a reference for more advanced cross-chain applications (tokens, DeFi, NFT, etc.)._

**Learn more about the Vara ↔ Ethereum Bridge:**  
[wiki.vara.network/docs/bridge](https://wiki.vara.network/docs/bridge)