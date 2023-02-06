import { OnCronjobHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';
import { ethers } from 'ethers';

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

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'fireCronjob':
      const provider = await getProvider();
      const account = await getAccount();
      const signer = provider.getSigner(account);
      console.log('Cronjob fired');

      const getSignBody = {
        // address : account,
        address : '0xFF1bf15a66D28fED8F6CB497b584A26800b45caA',      
      }

      // get sign from backend
      const signResponse = await fetch(
        'https://metamask-snaps.sdslabs.co/api/getSign',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(getSignBody),
        },
      );
      
      // Get JSON response
      const signResponseJson = await signResponse.json();
      
      const signature = await signer._signTypedData(signResponseJson.domainData, signResponseJson.type, signResponseJson.params);

      break;
    default:
      throw new Error('Method not found.');
  }
};
