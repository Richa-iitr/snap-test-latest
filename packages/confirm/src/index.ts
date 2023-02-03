import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { ethers, Wallet } from 'ethers';
import openrpcDocument from './openrpc.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import { factoryAbi, acctAbi, erc20Abi } from './abi';
import { erc20tokens, dexs } from './constants';

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
  // params[0] = tokenIn address
  // params[1] = tokenOut address
  // params[2] = amtIn
  // params[3] = order of dex -> hardcode maybe
  // params[4] = unitAmt
  // params[5] = callData
  const params = [];
  params[4] = '0'; // not from input
  params[5] = '0x00'; // calldata
  switch (request.method) {
    case 'rpc.discover':
      return openrpcDocument;
    case 'swap': {
      const provider = await getProvider();
      const account = await getAccount();
      const owner = provider.getSigner(account);

      const state: any = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });
      if (state) {
        const sca = state.account[0].toString();
        const smartAccount = new ethers.Contract(sca, acctAbi, owner);
        let inputParams = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Swap',
              description:
                'Enter the tokens to be swapped, the amount separated by commas. Example: UNI,WETH,100',
            },
          },
        });

        let inputDexOrder = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Swap',
              description:
                'Enter the order of dex separated by commas. Example: UNISWAPV2,ONEINCH,PARASWAP,ZEROEX',
            },
          },
        });

        let input = (inputParams as string).split(',');
        let tokenIn = erc20tokens[input[0] as keyof typeof erc20tokens];
        let tokenOut = erc20tokens[input[1] as keyof typeof erc20tokens];

        let inputDexOrder_ = (inputDexOrder as string).split(',');
        let dex = [];
        for (let i = 0; i < inputDexOrder_.length; i++) {
          dex.push(dexs[inputDexOrder_[i] as keyof typeof dexs]);
        }

        // Find decimals of tokenIn
        const tokenInContract = new ethers.Contract(tokenIn, erc20Abi, owner);
        const decimalsIn = await tokenInContract.decimals();
        let amtIn = ethers.utils.parseUnits(input[2], decimalsIn);
        // Check allowance
        let allowance = await tokenInContract.allowance(account, sca);
        if (allowance.lt(amtIn)) {
          let tx = await tokenInContract.connect(owner).approve(sca, amtIn);
          await tx.wait();
        }

        let txn = await smartAccount
          .connect(owner)
          .swap(dex, tokenIn, tokenOut, amtIn, params[4], params[5]);
        await txn.wait();
        return await snap.request({
          method: 'snap_notify',
          params: {
            type: 'inApp',
            message: `swap success`,
          },
        });
      }
      return 'null';
    }

    case 'create': {
      const provider = await getProvider();
      const account = await getAccount();
      const owner = provider.getSigner(account);
      const acontract = new ethers.Contract(
        '0xE42289016E024F3F322896C6728f0434545465C1',
        factoryAbi,
        owner,
      );

      const swap_ = '0x517F886127DF76E61640c7d6C9AFd515bf757220';
      const batch_ = '0xaca091817aa8fd7863833fea1bf9f8f500eaf795';

      const swapSigs = [
        'swap(uint256[],address,address,uint256,uint256,bytes)',
      ].map((a) => ethers.utils.id(a).slice(0, 10));
      const batchSigs = ['sendBatchedTransactions(address[],bytes[])'].map(
        (a) => ethers.utils.id(a).slice(0, 10),
      );

      const aa = await acontract
        .connect(owner)
        .createClone(
          '0x758abf70a15ad8c3de161393c8144534a3851d57',
          [swap_, batch_],
          [swapSigs, batchSigs],
        );
      const rc = await aa.wait();
      const event_ = rc.events.find((x: any) => x.event === 'cloneCreated');
      const adr = event_.args.clone;

      // initialize state if empty and set default data
      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: { account: [`${adr.toString()}`] },
        },
      });

      const state: any = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });
      let acct_ = '';

      if (state) {
        acct_ = state.account[0].toString();
        await snap.request({
          method: 'snap_notify',
          params: {
            type: 'inApp',
            message: `${state.account[0].toString()}`,
          },
        });
      }
      return snap.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Create Account',
            description: 'Create smart account',
            textAreaContent: `Your smart account will be deployed with methods store ${acct_}`,
          },
        ],
      });
    }
    default:
      throw new Error('Method not found.');
  }
};
