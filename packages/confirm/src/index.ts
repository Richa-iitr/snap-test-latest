import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { ethers, Wallet } from 'ethers';
// eslint-disable-next-line import/no-extraneous-dependencies
import BigNumber from 'bignumber.js';
import openrpcDocument from './openrpc.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import { factoryAbi, acctAbi, erc20Abi, uniswapQuoterAbi } from './abi';
import { erc20tokens, dexs, deployments } from './constants';

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

//off-chain calculation for the amount received per amount in, this is used to check for MEV resistance
const calculateUnitAmt = (
  amountIn: any,
  decimalsIn: any,
  amountOut: any,
  decimalsOut: any,
  slippage: any,
) => {
  const resultantAmountOut = amountOut / 10 ** decimalsOut;
  const amountIn_ = amountIn / 10 ** decimalsIn;
  let unitAmt: any = resultantAmountOut / amountIn_;

  unitAmt *= (100 - slippage) / 100;
  unitAmt *= 10 ** 18;
  return unitAmt;
};

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  // not needed for uniswapV2, fetch from API for 1inch,0x, paraswap.
  const callData = '0x00';

  switch (request.method) {
    case 'rpc.discover':
      return openrpcDocument;

    //performs mev resistant swap
    case 'swap': {
      const provider = await getProvider();
      const account = await getAccount();
      const owner = provider.getSigner(account);

      const state: any = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });

      if (state && state.account && state.account.length > 0) {
        const sca = state.account[0].toString();
        const smartAccount = new ethers.Contract(sca, acctAbi, owner);
        const inputParams = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Swap Inputs',
              description:
                'Enter the tokens and the amount to be swapped and the slippage acceptable in percentage separated by commas. Example: UNI,WETH,100,0.5',
            },
          },
        });

        const inputDexOrder = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Dex order',
              description:
                'Enter the order of dex separated by commas. Example: UNISWAPV2,ONEINCH,PARASWAP,ZEROEX',
            },
          },
        });

        const input = (inputParams as string).split(',');
        const tokenIn =
          erc20tokens[input[0] as keyof typeof erc20tokens].address;
        const tokenOut =
          erc20tokens[input[1] as keyof typeof erc20tokens].address;
        const decimalsIn =
          erc20tokens[input[0] as keyof typeof erc20tokens].decimals;
        const decimalsOut =
          erc20tokens[input[1] as keyof typeof erc20tokens].decimals;

        const inputDexOrder_ = (inputDexOrder as string).split(',');
        let dex = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < inputDexOrder_.length; i++) {
          dex.push(dexs[inputDexOrder_[i] as keyof typeof dexs]);
        }

        // Find decimals of tokenIn
        const tokenInContract = new ethers.Contract(tokenIn, erc20Abi, owner);
        const uniswapQuoter = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
        const uniswapQuoterInstance = new ethers.Contract(
          uniswapQuoter,
          uniswapQuoterAbi,
          owner,
        );
        const amtIn: any = ethers.utils.parseUnits(input[2], decimalsIn);
        const slippage = new BigNumber(input[3]).toNumber();
        // Check allowance
        const allowance = await tokenInContract.allowance(account, sca);
        if (allowance.lt(amtIn)) {
          const tx = await tokenInContract.connect(owner).approve(sca, amtIn);
          await tx.wait();
        }

        const expectedAmountOut = await uniswapQuoterInstance.getAmountOut(
          amtIn,
          tokenIn,
          tokenOut,
        );

        const unitAmt = calculateUnitAmt(
          amtIn,
          decimalsIn,
          expectedAmountOut,
          decimalsOut,
          slippage,
        );

        const txn = await smartAccount
          .connect(owner)
          .swap(dex, tokenIn, tokenOut, amtIn, unitAmt.toFixed(0), callData);
        await txn.wait();
        return await snap.request({
          method: 'snap_notify',
          params: {
            type: 'inApp',
            message: `Swap successful`,
          },
        });
      }
      return 'null';
    }

    //creates a new smart account
    case 'create': {
      const provider = await getProvider();
      const account = await getAccount();
      const owner = provider.getSigner(account);
      const acontract = new ethers.Contract(
        deployments.accountFactory,
        factoryAbi,
        owner,
      );

      const swap_ = deployments.safeSwapModule;
      const batch_ = deployments.batchTxModule;

      const swapSigs = [
        'swap(uint256[],address,address,uint256,uint256,bytes)',
      ].map((a) => ethers.utils.id(a).slice(0, 10));
      const batchSigs = ['sendBatchedTransactions(address[],bytes[])'].map(
        (a) => ethers.utils.id(a).slice(0, 10),
      );

      const aa = await acontract
        .connect(owner)
        .createClone(
          deployments.baseAccount,
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
            prompt: 'Account created',
            description: 'You smart contract account address',
            textAreaContent: `Your smart account is deployed to ${acct_}`,
          },
        ],
      });
    }
    default:
      throw new Error('Method not found.');
  }
};
