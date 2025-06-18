export interface PingSentEvent {
    sender: string;
    to: string;
    nonce: number | null;
    messageHash: string;
}

export interface PingMessage {
    sender: string;
    to: string;
    messageHash: string;
    nonce: number | null;
    merkleRoot: string;
    proof: string[];
    number_of_leaves: string;
    leaf_index: string;
    leaf: string;
}
export interface MerkleProof {
    root: string;
    proof: string[];
    number_of_leaves: string;
    leaf_index: string;
    leaf: string;
}
export interface MerkleRootSubmittedEvent {
    root: string;
}

export interface VaraApi {
    events: {
        subscribeToNewEvents: (callback: (event: any) => void) => void;
    };
    rpc: {
        gearEthBridge_merkleProof: (messageHash: string) => Promise<MerkleProof>;
    };
}

export interface EthereumProvider {
    provider: any;
    wallet: any;
    contract: any;
} 