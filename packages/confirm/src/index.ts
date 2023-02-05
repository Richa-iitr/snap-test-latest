import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { ethers } from 'ethers';
// eslint-disable-next-line import/no-extraneous-dependencies
import BigNumber from 'bignumber.js';
import openrpcDocument from './openrpc.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  factoryAbi,
  acctAbi,
  erc20Abi,
  safeAbi,
  uniswapQuoterAbi,
  multisigFactoryAbi,
} from './abi';
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
  // const params = request.params as any[];
  // params[0] = tokenIn address
  // params[1] = tokenOut address
  // params[2] = amtIn
  // params[3] = order of dex -> hardcode maybe
  // params[4] = unitAmt
  // params[5] = callData
  const callData = '0x00'; // not needed for uniswapV2, fetch from API for 1inch,0x, paraswap
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
        const inputParams = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Swap',
              description:
                'Enter the tokens to be swapped, the amount and the slippage in percentage separated by commas. Example: UNI,WETH,100,0.5',
            },
          },
        });

        const inputDexOrder = await snap.request({
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
        await snap.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: 'Account created',
              description: 'You smart contract account address',
              textAreaContent: `${unitAmt}, ${slippage}, ${expectedAmountOut}, ${amtIn}`,
            },
          ],
        });

        const txn = await smartAccount
          .connect(owner)
          .swap(dex, tokenIn, tokenOut, amtIn, unitAmt.toFixed(0), callData);
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

      const swap_ = '0x89012390386aD3337dDd6735B9EAe5e2FAACb21f';
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
            prompt: 'Account created',
            description: 'You smart contract account address',
            textAreaContent: `Your smart account is deployed to ${acct_}`,
          },
        ],
      });
    }

    case 'initiateTx': {
      const provider = await getProvider();
      const account = await getAccount();
      const owner = provider.getSigner(account);
      const state: any = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });
      let safe = state.safeAccount[0].toString();

      // eslint-disable-next-line no-negated-condition
      if (!safe) {
        await snap.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: 'No Safe!',
              description: "Safe doesn't exists",
              textAreaContent: `Create a safe first`,
            },
          ],
        });
      } else {
        const sendEthInputs = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Tx Setup',
              description:
                'Enter the address to make send ethers and the value to be sent, separated by comma',
            },
          },
        });

        // to be removed: only for testing
        await snap.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: 'Account created',
              description: 'You smart contract account address',
              textAreaContent: `${sendEthInputs}`,
            },
          ],
        });
        const input = (sendEthInputs as string).split(',');
        const toAddr = input[0];
        const value = input[1];
        const safeInstance = new ethers.Contract(safe, safeAbi, owner);

        // let current_threshold = 1; //fetch from api
        const threshold = await safeInstance.connect(owner).getThreshold();
        await snap.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: 'Account created',
              description: 'You smart contract account address',
              textAreaContent: `${threshold}`,
            },
          ],
        });

        // EIP712Domain(uint256 chainId,address verifyingContract)
        const domain = {
          name: 'EIP712Domain',
          chainId: 5,
          verifyingContract: '0xfD51f05Fe00450D774f40d26B3C244F94DBbdE8B',
        };

        // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
        const types = {
          SafeTx: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'data', type: 'bytes' },
            { name: 'operation', type: 'uint8' },
            { name: 'safeTxGas', type: 'uint256' },
            { name: 'baseGas', type: 'uint256' },
            { name: 'gasPrice', type: 'uint256' },
            { name: 'gasToken', type: 'address' },
            { name: 'refundReceiver', type: 'address' },
            { name: 'nonce', type: 'uint256' },
          ],
        };

        const values = {
          to: toAddr,
          value,
          data: '0x00',
          operation: 1,
          safeTxGas: 33756,
          baseGas: 12000000000,
          gasPrice: 15000000000,
          gasToken: '0x0000000000000000000000000000000000000000',
          refundReceiver: '0x0000000000000000000000000000000000000000',
          nonce: await provider.getTransactionCount(account),
        };

        const signature = await owner._signTypedData(domain, types, values);
        if (signature) {
          await snap.request({
            method: 'snap_confirm',
            params: [
              {
                prompt: 'Account created',
                description: 'You smart contract account address',
                textAreaContent: `${signature}`,
              },
            ],
          });
        }
      }

      break;
    }

    case 'createSafe': {
      const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
      const provider = await getProvider();
      const account = await getAccount();
      const owner = provider.getSigner(account);

      const sigfactory = new ethers.Contract(
        '0x0Fa4E505896e5DCAA28dF8AdCDe0e4b521E4b4a6',
        multisigFactoryAbi,
        owner,
      );

      const state: any = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });
      let safe = state.safeAccount[0].toString();

      let safeAddress: any;
      let safeOwnerAddresses = [];
      let safeThreshold: any;

      if (!safe) {
        const inputOwners = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Safe Setup',
              description:
                "Enter the owners of the safe separated by comma. e.g. ['0xaddedf...','0xgdgjenk...']",
            },
          },
        });

        const input = (inputOwners as string).split(',');

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < input.length; i++) {
          safeOwnerAddresses.push(input[i]);
        }

        safeThreshold = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Safe Setup',
              description:
                'Enter the threshold of signatures to be signed for execution of transaction',
            },
          },
        });

        const safeImpl_ = '0x3E5c63644E683549055b9Be8653de26E0B4CD36E';
        const tx = await sigfactory
          .connect(owner)
          .createSafe(
            safeImpl_,
            safeOwnerAddresses,
            safeThreshold,
            ZERO_ADDR,
            '0x00',
            ZERO_ADDR,
            ZERO_ADDR,
            '0',
            ZERO_ADDR,
          );
        const rc = await tx.wait();
        const event_ = rc.events.find((x: any) => x.event === 'SafeCreated');
        safeAddress = event_.args.clone;
        await snap.request({
          method: 'snap_manageState',
          params: {
            operation: 'update',
            newState: { safeAccount: [`${safeAddress.toString()}`] },
          },
        });
      }

      // Send post request to backend
      const response = await fetch('http://20.102.71.147:3000/api/sendSafe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          safeAddress,
          safeOwnerAddresses,
          safeThreshold,
        }),
      });

      return await snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: `${safeAddress}`,
        },
      });
    }
    default:
      throw new Error('Method not found.');
  }
};
