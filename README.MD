# Vara ↔ Ethereum Cross-Chain Ping

This is a minimal working example of a cross-chain application (Ping) demonstrating secure message delivery from the Vara network to Ethereum via the Vara ↔ Ethereum Bridge.

The project consists of three main components:

- `cross-ping/` – The Vara-side program (Rust): sends a cross-chain Ping message.
- `relayer/` – The permissionless relayer (Node.js): delivers messages and proofs from Vara to Ethereum.
- `ping-receiver/` – The destination contract (Solidity): receives messages and emits a Pong event on Ethereum.

---

# Run Order

To run the Vara ↔ Ethereum Cross-Chain Ping example end-to-end, follow these steps:

1. **Deploy the Solidity Receiver Contract (`ping-receiver`)**
   - Deploy `PingReceiver.sol` to Ethereum (Holesky testnet).
   - Save the deployed contract address for use in the next step.

2. **Deploy the Vara Contract (`cross-ping`)**
   - Deploy the `cross-ping` program to the Vara network (testnet).
   - When deploying, set the `destination` parameter to the Ethereum address of your deployed `PingReceiver` contract.

3. **Configure and Start the Relayer**
   - In the `relayer/` directory, create a `.env` file with all required RPC endpoints and contract addresses.
   - Install dependencies and start the relayer:

4. **Send a Ping Message from Vara**
   - Call the `ping` function in your Vara contract to initiate a cross-chain message.
   - The relayer will automatically detect, process, and deliver the message to Ethereum.

5. **Check Delivery**
   - In the relayer console, verify message processing and transaction hash.
   - On Ethereum (e.g., Etherscan), confirm that your `PingReceiver` contract emitted the `PongEmitted` event.


**Note:**  
Merkle Root updates on the Ethereum side will take some time (typically around 10–20 minutes), so message delivery will not be instant.

---

**What does this example show?**
- End-to-end flow: How to send, relay, and receive a message across two independent blockchains using trustless infrastructure.
- Minimal, production-like code: All business logic is in the application layer, while cryptographic security and cross-chain proof-of-delivery are handled by the bridge protocol.

---

_This example is intended for developers interested in cross-chain messaging, bridge integration, and hands-on experimentation. It can serve as a reference for more advanced cross-chain applications (tokens, DeFi, NFT, etc.)._

**Learn more about the Vara ↔ Ethereum Bridge:**  
[wiki.vara.network/docs/bridge](https://wiki.vara.network/docs/bridge)