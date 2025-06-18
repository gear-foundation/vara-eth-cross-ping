import { ethers } from 'ethers';

import { ETHEREUM_RPC_URL, RELAYER_PROXY_ADDRESS, MESSAGE_QUEUE_PROXY_ADDRESS, PRIVATE_KEY, RELAYER_PROXY_ABI, MESSAGE_QUEUE_PROXY_ABI } from './config';

export let walletSigner: ethers.Wallet | null = null;
export let ethereumProvider: ethers.WebSocketProvider | null = null;

// 1. Connects to the Ethereum Holesky RPC
export async function connectEthereum(): Promise<ethers.WebSocketProvider> {
    if (ethereumProvider) return ethereumProvider;
    ethereumProvider = new ethers.WebSocketProvider(ETHEREUM_RPC_URL);
    await ethereumProvider.getBlockNumber();
    console.log('✅ Connected to Ethereum!');
    return ethereumProvider;
}

// 2. Creates a wallet from the PRIVATE_KEY
export function createWallet(provider: ethers.WebSocketProvider): ethers.Wallet {
    if (!PRIVATE_KEY) throw new Error('No PRIVATE_KEY in env!');
    walletSigner = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('👛 Wallet connected:', walletSigner.address);
    return walletSigner;
}

// 3. Listens for MerkleRoot events from the RelayerProxy
export function listenRelayerProxy(
    provider: ethers.Provider,
    onMerkleRoot: (merkleRoot: string, blockNumber: ethers.BigNumberish) => void
) {
    const relayerProxy = new ethers.Contract(RELAYER_PROXY_ADDRESS, RELAYER_PROXY_ABI, provider);
    relayerProxy.on('MerkleRoot', (blockNumber: ethers.BigNumberish, merkleRoot: string, event) => {
        console.log('🟢 MerkleRoot event received (ethers):', { blockNumber, merkleRoot, event });
        onMerkleRoot(merkleRoot, blockNumber);
    });
    console.log('🔔 Listening RelayerProxy contract for MerkleRoot events:', RELAYER_PROXY_ADDRESS);
}

// 4. Sends processMessage to MessageQueueProxy
export async function sendProcessMessage(
    signer: ethers.Signer,
    block_number: number,
    total_leaves: number,
    leaf_index: number,
    nonce: number,
    sender: string,
    receiver: string,
    data: string,
    proof: string[]
) {
    const contract = new ethers.Contract(
        MESSAGE_QUEUE_PROXY_ADDRESS,
        MESSAGE_QUEUE_PROXY_ABI,
        signer
    );

    const formattedNonce = numberToBytes32LE(nonce);
    const message = { nonce: formattedNonce, sender, receiver, data };

    console.log("trx", 
        block_number,
        total_leaves,
        leaf_index,
        message,
        proof,
    );

    const tx = await contract.processMessage(
        block_number,
        total_leaves,
        leaf_index,
        message,
        proof,
        { gasLimit: 20_000_000 }
    );
    console.log("Tx sent:", tx.hash);
    await tx.wait();
    console.log("Tx confirmed!");
    return tx;
}

function numberToBytes32LE(nonce: number) {
    let hex = nonce.toString(16).padStart(64, '0');
    let bytes = (hex.match(/../g) || []).reverse().join('');
    return '0x' + bytes;
}