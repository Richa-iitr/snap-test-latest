import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { ethers, Wallet } from 'ethers';
import openrpcDocument from './openrpc.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import { factoryAbi, acctAbi } from './abi';

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

<<<<<<< HEAD
export const onCronjob: OnRpcRequestHandler = async ({ request }) => {
  // creating state
  var state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as { testState: string[][] } | null;

  if (!state) {
    state = { testState: [] };
    // initialize state if empty and set default data
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'update', newState: state },
    });
  }
  /* 1 -> AAVE, 2-> COMPOUND 
  * 1. isStake
  * 2. Amount
  * 3. Time
  */
  if(state.testState.length == 0) {
    state.testState.push(['0', '0', '0', 'AAVE']);
    state.testState.push(['0', '0', '0', 'COMPOUND']);
  }

=======
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
>>>>>>> ec24d58 (create account successful)
  // const params = request.params as any[];
  switch (request.method) {
    case 'rpc.discover':
      return openrpcDocument;
    case 'swap': {
      break;
    }

    case 'create': {
      const provider = await getProvider();
<<<<<<< HEAD
      const account = await getAccount()
      const signer = provider.getSigner(account);

      const contractAddressCompound = '0x64078a6189Bf45f80091c6Ff2fCEe1B15Ac8dbde';
      const cEthContractCompound = new ethers.Contract(
        contractAddressCompound,
        abi_compound,
        signer,
      );

      // address of Aave lending pool
      const lendingPoolAddressAave = "0x7b5C526B7F8dfdff278b4a3e045083FBA4028790";
      const poolContractAave = new ethers.Contract(lendingPoolAddressAave, abi_aave, signer);

      const balanceContractAave = '0xe0bb4593f74B804B9aBd9a2Ec6C71663cEE64E29'
      const balanceContractAaveContract = new ethers.Contract(
        balanceContractAave,
        abi_aave_balance,
        signer,
      );

      // Goerli address of USDC
      const tokenAddressUSDC = "0x65aFADD39029741B3b8f0756952C74678c9cEC93";
      const tokenAddressAUSDC = '0x8Be59D90A7Dc679C5cE5a7963cD1082dAB499918';
      const tokenContractAave = new ethers.Contract(tokenAddressUSDC, tokenAbi_aave, signer);
      
      let isStaking = state.testState[0][0] == '1' || state.testState[1][0] == '1' ? '1' : '0';
      let amountAave = state.testState[0][1];
      let timeAave = state.testState[0][2]; 
      let amountComp = state.testState[1][1];
      let timeComp = state.testState[1][2];

      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Alert',
          fields: {
            title: 'Staking',
            description: isStaking =='1' ? `You are currently staking ${amountAave} ETH every ${timeAave} minutes in Aave \n You are currently staking ${amountComp} ETH every ${timeComp} minutes in Compound`: `You are not staking in Aave\n`,
            textAreaContent: `If you would like to change your staking amount, schedule or provider, write stake.
            If you would like to unstake, write unstake.
            If you would like to stop staking, write stop.`,
          }
        },
      });

      let choice = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Prompt',
          fields: {
            title: 'Staking',
            description: 'Enter your choice (stake, unstake or stop)',
            placeholder: 'Write here',
          },
        },
      });     

      if (choice == 'stake') {
        let prov = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Staking',
              description: 'Enter your choice (Aave or Compound)',
              placeholder: 'Write here',
            },
          },
        });

        let ethBalance = await provider.getBalance(account) as any / 10 ** ethDecimals;
        let usdcBalance = await tokenContractAave.balanceOf(account) as any / 10 ** 6;

        let amount = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Staking',
              description: `Choose your staking amount (ETH for Compound and USDC for Aave). Current ETH balance: ${ethBalance} and USDC balance: ${usdcBalance}`,
              placeholder: 'Enter the value',
            },
          },
        });

        let schedule = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Staking',
              description: `Choose your staking schedule in minutes`,
              placeholder: 'Enter the value in minutes',
            },
          },
        });

        if (prov == 'Compound') {
          state.testState[1][0] = '1';
          state.testState[1][1] = amount as string;
          state.testState[1][2] = schedule as string;
          state.testState[1][3] = prov as string;
          const tx = await cEthContractCompound.mint({
            value: ethers.utils.parseUnits(amount as string, 'ether'),
          });
          await tx.wait(1);
        } else if (prov == 'Aave') {
          
          state.testState[0][0] = '1';
          state.testState[0][1] = amount as string;
          state.testState[0][2] = schedule as string;
          state.testState[0][3] = prov as string;
          // check if the user has approved the token
          const allowance = await tokenContractAave.allowance(
            account,
            lendingPoolAddressAave,
          );
          if (allowance + 5 < ((amount as number) * Math.pow(10, 6))) {
            const tx = await tokenContractAave.approve(
              lendingPoolAddressAave,
              ((amount as number + 5) * Math.pow(10, 6)),
              {
                from: account,
              }
            );
            await tx.wait(1);
          }

          // supply the token to the pool
          const tx2 = await poolContractAave.supply(
            tokenAddressUSDC,
            ((amount as number) * Math.pow(10, 6)) as number,
            account as string,
            0,
            {
              from: account as string,
            }
          );
          await tx2.wait(1);
        } 
      }
      else if (choice == 'unstake') {
        let prov = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Prompt',
            fields: {
              title: 'Unstaking',
              description: 'Enter which provider you would like to unstake from (Aave or Compound)',
              placeholder: 'Write here',
            },
          },
        });

        if (prov == 'Compound') {
          
          state.testState[1][0] = '0';
          state.testState[1][1] = '0';
          state.testState[1][2] = '0';
          let unstakeTxn = await cEthContractCompound.redeem(await cEthContractCompound.balanceOf(account));
          await unstakeTxn.wait(1);
        } else if (prov == 'Aave') {

          state.testState[0][0] = '0';
          state.testState[0][1] = '0';
          state.testState[0][2] = '0';
          const staked = await balanceContractAaveContract.balanceOf(account, tokenAddressAUSDC); 
          const tx = await poolContractAave.withdraw(
            tokenAddressUSDC,
            staked as number,
            account,
            {
              from: account,
            }
          );
          await tx.wait(1);
        }

      }
      
      await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState: state },
      });

=======
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
        'swap(uint256[],address,address,uint256,uin256,bytes)',
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
>>>>>>> ec24d58 (create account successful)
    default:
      throw new Error('Method not found.');
  }
};
