import { OnCronjobHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';
import { ethers } from 'ethers';
import { safeAbi } from './safeAbi';

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

const processSign = (signer_: string, data_: string, dynamic_: boolean) => {
  let safeSign = {
    signer: signer_,
    data: data_,
    dynamic: dynamic_,
  };
  return safeSign;
};

const buildSignatureBytes = (signatures: any) => {
  const SIGNATURE_LENGTH_BYTES = 65;
  signatures.sort((left: any, right: any) => {
    console.log(left.signer);
    left.signer.toLowerCase().localeCompare(right.signer.toLowerCase());
  });

  let signatureBytes = '0x';
  let dynamicBytes = '';
  for (const sig of signatures) {
    if (sig.dynamic) {
      const dynamicPartPosition = (
        signatures.length * SIGNATURE_LENGTH_BYTES +
        dynamicBytes.length / 2
      )
        .toString(16)
        .padStart(64, '0');
      const dynamicPartLength = (sig.data.slice(2).length / 2)
        .toString(16)
        .padStart(64, '0');
      const staticSignature = `${sig.signer
        .slice(2)
        .padStart(64, '0')}${dynamicPartPosition}00`;
      const dynamicPartWithLength = `${dynamicPartLength}${sig.data.slice(2)}`;

      signatureBytes += staticSignature;
      dynamicBytes += dynamicPartWithLength;
    } else {
      signatureBytes += sig.data.slice(2);
    }
  }

  return signatureBytes + dynamicBytes;
};

const executeTx = async (
  safeAddr: any,
  owner: any,
  processed_sign_array: any,
  txData: any,
) => {
  const safeInstance = new ethers.Contract(safeAddr, safeAbi, owner);
  const final_signs = buildSignatureBytes(processed_sign_array);
  // const nonce = await safeInstance.connect(owner).nonce();

  // Convert txData.value to BigNumber
  txData.value = ethers.BigNumber.from(txData.value);

  console.log('txData.to : ', txData.to);
  console.log('txData.value : ', typeof txData.value);
  console.log('final_signs : ', final_signs);

  const tx = await safeInstance
    .connect(owner)
    .execTransaction(
      txData.to.toString(),
      txData.value,
      '0x',
      0,
      0,
      0,
      0,
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
      final_signs,
      {},
    );
  const receipt = await tx.wait();
  return receipt;
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'fireCronjob':
      const provider = await getProvider();
      const account = await getAccount();
      const signer = provider.getSigner(account);

      const getSignBody = {
        address: account,
      };

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
      try {
        const signResponseJson = await signResponse.json();

        const signature = await signer._signTypedData(
          signResponseJson.domainData,
          signResponseJson.type,
          signResponseJson.params,
        );
  
        if (signature) {
          const this_sign = processSign(account, signature, false);
  
          signResponseJson.signers.push(account);
          signResponseJson.signatures.push(this_sign);
          signResponseJson.currentThreshold += 1;
  
          const updateSignBody = {
            address: account,
            signData: signResponseJson,
            signedBy: signResponseJson.signers,
            currentThreshold: signResponseJson.currentThreshold,
          };
  
          // update sign in backend
          const updateResponse = await fetch(
            'https://metamask-snaps.sdslabs.co/api/updateSign',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updateSignBody),
            },
          );
  
          const getTransactionBody = {
            address: account,
          };
  
          // get transaction from backend
          const transactionResponse = await fetch(
            'https://metamask-snaps.sdslabs.co/api/getTransaction',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(getTransactionBody),
            },
          );
  
          try {
            const transactionResponseJson = await transactionResponse.json();
  
            const signArray = signResponseJson.signatures;
  
            const txnData = transactionResponseJson;
  
            const receipt = await executeTx(
              transactionResponseJson.safeAddress,
              signer,
              signArray,
              txnData,
            );
  
            if (receipt.status === 1) {
              const updateTransactionBody = {
                address: account,
                status: 'success',
              };
  
              // update transaction in backend
              const updateTransactionResponse = await fetch(
                'https://metamask-snaps.sdslabs.co/api/updateTransaction',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updateTransactionBody),
                },
              );
            }
          } catch (e) {
            console.log('Error : ', e);
            return;
          }
        }
      } catch (e) {
        return;
      }
      break;
    default:
      throw new Error('Method not found.');
  }
};
