import { GearApi, Proof, HexString } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { H256 } from '@polkadot/types/interfaces';
import { VARA_RPC_URL, CROSS_PING_IDL, CROSS_PING_PROGRAM_ID } from './config';

import { PingSentEvent } from './types';

export let varaProvider: GearApi | null = null;
export let sails: Sails;

export async function connectVara(): Promise<GearApi> {
    if (varaProvider) return varaProvider;

    varaProvider = await GearApi.create({ providerAddress: VARA_RPC_URL });
    const parser = await SailsIdlParser.new();
    sails = new Sails(parser);
    sails.parseIdl(CROSS_PING_IDL);
    sails.setApi(varaProvider);
    sails.setProgramId(CROSS_PING_PROGRAM_ID);

    console.log('✅ Connected to Vara!');
    return varaProvider;
}

export async function listenMerkleRootChanged(api: GearApi, onRoot: (root: string) => void) {
  const unsub = await api.query.system.events((events) => {
    events.forEach(({ event }) => {
      const { section, method, data } = event;

      if (section === 'gearEthBridge' && method === 'QueueMerkleRootChanged') {
        const merkleRoot = data[0] as H256;

        console.log('📦 Merkle Root Event Detected:', merkleRoot.toHex());
        onRoot(merkleRoot.toHex());
      }
    });
  });

  return unsub;
}

export async function listenPingSent(sails: Sails, onPingSent: (event: PingSentEvent) => void) {
    sails.services.CrossPing.events.PingSent.subscribe((data: any) => {
        onPingSent({
        sender: data.sender,
        to: data.to,
        nonce: data.nonce,
        messageHash: data.message_hash,
        });
    });
}

export async function getMerkleProof(api: GearApi, messageHash: HexString): Promise<Proof> {
  try {
    return await api.ethBridge.merkleProof(messageHash);
  } catch (error) {
    console.error('Failed to get merkle proof:', error);
    throw error;
  }
}