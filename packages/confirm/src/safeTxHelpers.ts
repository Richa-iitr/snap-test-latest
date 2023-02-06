import { ethers } from 'ethers';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  safeAbi,
} from './abi';

export const processSign = (signer_: string, data_: string, dynamic_: boolean) => {
  let safeSign = {
    signer: signer_,
    data: data_,
    dynamic: dynamic_
  }
  return safeSign;
}

export const calculateUnitAmt = (
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

export const buildSignatureBytes = (signatures: any) => {
  const SIGNATURE_LENGTH_BYTES = 65;
  signatures.sort((left: any, right: any) => {
    console.log(left.signer);
    left.signer.toLowerCase().localeCompare(right.signer.toLowerCase());
  });

  let signatureBytes = "0x";
  let dynamicBytes = "";
  for (const sig of signatures) {
    if (sig.dynamic) {
      const dynamicPartPosition = (
        signatures.length * SIGNATURE_LENGTH_BYTES +
        dynamicBytes.length / 2
      )
        .toString(16)
        .padStart(64, "0");
      const dynamicPartLength = (sig.data.slice(2).length / 2)
        .toString(16)
        .padStart(64, "0");
      const staticSignature = `${sig.signer
        .slice(2)
        .padStart(64, "0")}${dynamicPartPosition}00`;
      const dynamicPartWithLength = `${dynamicPartLength}${sig.data.slice(2)}`;

      signatureBytes += staticSignature;
      dynamicBytes += dynamicPartWithLength;
    } else {
      signatureBytes += sig.data.slice(2);
    }
  }

  return signatureBytes + dynamicBytes;
};

export const executeTx = async (safeAddr: any, owner:any,processed_sign_array: any, txData: any ) => {
  const safeInstance = new ethers.Contract(safeAddr, safeAbi, owner);
  const final_signs = buildSignatureBytes(processed_sign_array);
  const nonce = await safeInstance.connect(owner).nonce();

  const tx =await safeInstance.connect(owner).execTransaction(
    txData.to,
    txData.value,
    "0x",
    0,
    0,
    0,
    0,
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    nonce
  )
  const receipt = await tx.wait();
  console.log(receipt);

}

export const signTx = async (safeAddress: string, owner: any, domaindata: any, types: any, values: any, current_threshold: number) => {
  const safeInstance = new ethers.Contract(safeAddress, safeAbi, owner);
  
  const signature = await owner._signTypedData(domaindata, types, values);

  if (signature) {
    const this_sign = processSign(owner.address, signature, false);
    current_threshold = current_threshold+1;
    if(current_threshold === await safeInstance.connect(owner).getThreshold()){
      let sign_array:any[] = [];
      let txData:any;
      await executeTx(safeInstance, owner, sign_array, txData)
    }
    // append this sign to the backend 
  } else {
    console.log("Failed");
  }
  return signature;
}

export const initiateTx = async (safeInstance: any, owner: any, toAddr: string, value: string, current_threshold: number, account: string) => {
  // EIP712Domain(uint256 chainId,address verifyingContract)
  const domain = [
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ];

  // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
  const types = {
    SafeTx: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "operation", type: "uint8" },
      { name: "safeTxGas", type: "uint256" },
      { name: "baseGas", type: "uint256" },
      { name: "gasPrice", type: "uint256" },
      { name: "gasToken", type: "address" },
      { name: "refundReceiver", type: "address" },
      { name: "nonce", type: "uint256" },
    ],
  };

  const domaindata = {
    chainId: await safeInstance.connect(owner).getChainId(),
    verifyingContract: safeInstance.address,
  };

  const values = {
    to: toAddr,
    value: ethers.utils.parseUnits(value, 18),
    data: "0x",
    operation: 0,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: "0x0000000000000000000000000000000000000000",
    refundReceiver: "0x0000000000000000000000000000000000000000",
    nonce: await safeInstance.connect(owner).nonce(),
  };
  //sign the data with EIP 712 standard
  const signature = await owner._signTypedData(domaindata, types, values);

  const signTxData = {
    safeAddress: safeInstance.address,
    domainData: domaindata,
    type: types,
    params: values,
    signers: [],
    signatures: [],
    currentThreshold: current_threshold,
  }

  const executeTxData = {
    safeAddress: safeInstance.address,
    to: toAddr,
    value: ethers.utils.parseUnits(value, 18).toString(),
  }

  if (signature) {
    const this_sign = processSign(account, signature, false);

    signTxData.signers.push(account);
    signTxData.signatures.push(this_sign);
    current_threshold = current_threshold + 1;

    console.log("signTxData", signTxData);
    
  const signBody = {
    address: account,
    signData: JSON.stringify(signTxData),
    signedBy: signTxData.signers,
    currentThreshold: signTxData.currentThreshold,
  }

  console.log(signBody)

  // send signTxData to backend
  const response = await fetch(
    'https://metamask-snaps.sdslabs.co/api/sendSign',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signBody),
    },
  );

  const txnBody = {
    address: account,
    txnData: JSON.stringify(executeTxData),
  }

  // send txn to backend
  const txnResponse = await fetch(
    'https://metamask-snaps.sdslabs.co/api/sendTransaction',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(txnBody),
    },
  );

    if(current_threshold === await safeInstance.connect(owner).getThreshold()){
      let sign_array: any[] = [];
      let txData: any;
      await executeTx(safeInstance, owner, sign_array, txData)
    }
    // append this sign to the backend 
  } else {
    console.log("Failed");
  }
  return signature;
};
