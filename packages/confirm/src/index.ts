import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { ethers, Wallet } from 'ethers';
import openrpcDocument from './openrpc.json';
import { acctAbi } from './smart-contract-abi';

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
  // const params = request.params as any[];
  switch (request.method) {
    case 'rpc.discover':
      return openrpcDocument;
    case 'create':
      const account = await getAccount();
      const provider = await getProvider();
      const signer = provider.getSigner(account);
      const smart_account_state: any = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });

      let contractAddresses = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Prompt',
          fields: {
            title: 'Batch Transactions',
            description: 'Enter the contract addresses separated by commas',
            placeholder: 'Addresses',
          },
        },
      });

      let contractAddressesArray = (contractAddresses as string).split(',');

      let callDatas = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Prompt',
          fields: {
            title: 'Batch Transactions',
            description: 'Enter the call datas separated by commas',
            placeholder: 'Call Datas',
          },
        },
      });

      let callDatasArray = (callDatas as string).split(',');

      if (smart_account_state) {
        const sca = smart_account_state.account[0].toString();
        const smartAccount = new ethers.Contract(sca, acctAbi, signer);

        const tx = await smartAccount
          .connect(signer)
          .sendBatchedTransactions(contractAddressesArray, callDatasArray);

        await tx.wait(1);
      }
      break;
    default:
      throw new Error('Method not found.');
  }
};
