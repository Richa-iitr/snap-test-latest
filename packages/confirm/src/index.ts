import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { ethers, Wallet } from 'ethers';
import openrpcDocument from './openrpc.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import { batchAbi } from './batchAbi';

const getAccount = async () => {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  return accounts[0];
};

const getProvider = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  return provider;
};

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'rpc.discover':
      return openrpcDocument;
    case 'confirm':
      const account = await getAccount();
      const provider = await getProvider();
      const signer = provider.getSigner(account);

      const contractAddress = '0xaCA091817aa8fD7863833Fea1BF9f8f500Eaf795'; // Batch contract address
      const contract = new ethers.Contract(contractAddress, batchAbi, signer);

      const txns = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Prompt',
          fields: {
            title: 'Batch Transactions',
            description:
              'Enter the transactions you want to batch separated by commas',
            placeholder: '0x...',
          },
        },
      });

      const txndatas = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Prompt',
          fields: {
            title: 'Batch Transactions',
            description:
              'Enter the transaction data you want to batch separated by commas',
            placeholder: '0x...',
          },
        },
      });

      const txnsArray = (txns as string).split(',');
      const txndatasArray = (txndatas as string).split(',');
      const txnsArrayClean = txnsArray.map((txn) => txn.trim());
      const txndatasArrayClean = txndatasArray.map((txn) => txn.trim());

      const tx = await contract
        .connect(signer)
        .sendBatchedTransactions(txnsArrayClean, txndatasArrayClean);
      await tx.wait(1);
      break;
    default:
      throw new Error('Method not found.');
  }
};
