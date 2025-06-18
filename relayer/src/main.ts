import { connectVara, sails, listenMerkleRootChanged, listenPingSent, getMerkleProof } from './vara';
import { connectEthereum, listenRelayerProxy, createWallet, sendProcessMessage } from './ethereum';
import type { PingSentEvent, PingMessage, MerkleProof } from './types';

let latestVaraMerkleRoot: string | null = null;
let latestEthereumMerkleRoot: string | null = null;
let pingMessages: PingMessage[] = [];

async function main() {
    try {
        // 1. Connect to Vara & Ethereum
        const varaApi = await connectVara();
        const ethApi = await connectEthereum();
        const wallet = createWallet(ethApi);

        // 2. Listen to MerkleRoot updates from Vara
        listenMerkleRootChanged(varaApi, (root) => {
            console.log('✅ [Vara] New Merkle Root:', root);
            latestVaraMerkleRoot = root;
        });

        // 3. Listen to PingSent events in Vara & collect proofs
        listenPingSent(sails, async (event: PingSentEvent) => {
            if (!latestVaraMerkleRoot) {
                console.warn('[WARN] Merkle Root not yet received!');
                return;
            }
            const { sender, to, messageHash, nonce } = event;
            const proofObj = await getMerkleProof(varaApi, messageHash as `0x${string}`);
            const proof = proofObj.toHuman() as unknown as MerkleProof;

            const pingData: PingMessage = { 
                sender, 
                to, 
                messageHash, 
                nonce, 
                merkleRoot: proof.root,
                proof: proof.proof,
                number_of_leaves: proof.number_of_leaves,
                leaf_index: proof.leaf_index,
                leaf: proof.leaf
            };
            pingMessages.push(pingData);
            console.log('📥 Saved new PingMessage:', pingData);
        });

        // 4. Listen to MerkleRoot events from Ethereum
        listenRelayerProxy(ethApi, (root, blockNumber) => {
            if (pingMessages.length === 0) return;
            latestEthereumMerkleRoot = root;
            // check if the root is the same as the latestMerkleRoot with our massages
            const toRelay = pingMessages.filter(msg => msg.merkleRoot === root);
            if (toRelay.length === 0) {
                console.log('[Ethereum] No messages for this Merkle Root:', root);
                return;
            }
            console.log(`✅ [Ethereum] MerkleRootSubmitted: ${root}. Relaying ${toRelay.length} messages.`);

            toRelay.forEach(pingMessage => {
                sendProcessMessage(
                    wallet,
                    Number(blockNumber),
                    Number(pingMessage.number_of_leaves),
                    Number(pingMessage.leaf_index),
                    Number(pingMessage.nonce),
                    pingMessage.sender,
                    pingMessage.to,
                    pingMessage.sender, // payload like set of bytes
                    pingMessage.proof
                );
            });

            pingMessages = pingMessages.filter(msg => msg.merkleRoot !== root);
        });

    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

main().catch(console.error);