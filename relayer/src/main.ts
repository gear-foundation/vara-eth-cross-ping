import { relayVaraToEth, waitForMerkleRootAppearedInMessageQueue } from '@gear-js/bridge';
import { connectVara, listenPingSent } from './vara.js';
import { ethereumPublicClient, ethereumWalletClient, account } from './ethereum.js';
import { MESSAGE_QUEUE_PROXY_ADDRESS } from './config.js';

async function main() {
  const gearApi = await connectVara();

  await listenPingSent(async ({ nonce, blockNumber, messageHash }) => {
    console.log(`[Relay] PingSent: nonce=${nonce}, block=${blockNumber}, hash=${messageHash}`);

    const appeared = await waitForMerkleRootAppearedInMessageQueue(
      blockNumber,
      ethereumPublicClient,
      MESSAGE_QUEUE_PROXY_ADDRESS
    );

    if (!appeared) {
      console.error(`[Relay] ❌ Merkle root not found`);
      return;
    }

    console.log(`[Relay] ✅ Merkle root found. Relaying...`);

    try {
      const result = await relayVaraToEth(
        nonce,
        blockNumber,
        ethereumPublicClient,
        ethereumWalletClient,
        account,
        gearApi,
        MESSAGE_QUEUE_PROXY_ADDRESS,
        (status, details) => {
          console.log(`[Relay] [Status]`, status, details);
        }
      );

      if (result.error) {
        console.error(`[Relay] ❌ Error:`, result.error);
      } else {
        console.log(`[Relay] ✅ Success: txHash=${result.transactionHash}`);
      }
    } catch (err) {
      console.error(`[Relay] ❌ Exception:`, err);
    }
  });
}

main().catch((e) => {
  console.error(`[Relay] ❌ Fatal:`, e);
  process.exit(1);
});