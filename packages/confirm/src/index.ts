import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { ethers } from 'ethers';
import openrpcDocument from './openrpc.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createAbi, acctAbi } from './abi';

export const createAccount = async (): Promise<string> => {
  const provider = new ethers.providers.Web3Provider(snap as any);
  await provider.send('eth_requestAccounts', []);
  const owner = provider.getSigner();
  console.log(owner);
  const result = await snap.request({
    method: 'snap_confirm',
    params: [
      {
        prompt: 'Create Account',
        description: 'Create smart account',
        textAreaContent: `Your smart account will be deployed with methods store ${owner._address}`,
      },
    ],
  });

  if (result === false) {
    return '';
  }

  const acontract = new ethers.Contract(
    '0xe1bC2DF8Be88939E17Eb5cCfa89Dd7d7fdDaEeF8',
    createAbi,
    owner,
  );

  // const aa = await acontract.createClone(
  //   '0xa51D9181aC7a8Cc12060483cD42b89216b2d26D4',
  // );
  // const rc = await aa.wait();
  // const event_ = rc.events.find((x: any) => x.event === 'cloneCreated');
  // const adr = event_.args.clone;

  // await snap.request({
  //   method: 'snap_manageState',
  //   params: { operation: 'update', newState: `${adr.toString()}` },
  // });
  const adr = '';

  return adr;
};

// export const initiateTx = async (): Promise<boolean> => {
//   const verified = true;
//   if (verified) {
//     const state: any = await snap.request({
//       method: 'snap_manageState',
//       params: { operation: 'get' },
//     });

//     const account = state.account.toString();
//     if (account) {
//       const acontract = new ethers.Contract(account, acctAbi, owner);
//       const tx = await acontract._delegateCall(
//         '0xCDd8e1F86CA5A5a83ED55789325E7A0F012ba93A',
//         '0x6057361d000000000000000000000000000000000000000000000000000000000000000c',
//       );
//       await tx.wait();
//     } else {
//       console.log('failed-account-fetch');
//     }
//   }
//   return verified;
// };

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  // const params = request.params as any[];
  switch (request.method) {
    case 'rpc.discover':
      return openrpcDocument;
    // case 'confirm':
    //   return new Promise(() => {
    //     initiateTx().then((result) => {
    //       console.log(result);
    //     });
    //   });
    case 'create':
      return new Promise(() => {
        createAccount().then((adr: any) => {
          console.log(adr);
        });
      });
    default:
      throw new Error('Method not found.');
  }
};
