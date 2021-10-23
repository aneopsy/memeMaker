import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import { RPC_DEVNET, RPC_MAINNET_BETA } from "./constants";

export function getConnection(env: string): anchor.web3.Connection {
  switch (env) {
    case "mainnet-beta":
      env = RPC_MAINNET_BETA;
      break;
    case "devnet":
      env = RPC_DEVNET;
      break;
    default:
      env = `https://api.${env}.solana.com/`;
  }

  return new anchor.web3.Connection(env);
}

export const getHistory = (
  connection: web3.Connection,
  publicKey: web3.PublicKey,
  options: {
    before?: web3.TransactionSignature;
    until?: web3.TransactionSignature;
    limit: number;
  }
): Promise<any> => {
  return connection.getConfirmedSignaturesForAddress2(publicKey, options);
};

export const getAllHistory = async (
  connection: web3.Connection,
  mint: web3.PublicKey
) => {
  let txs = [];
  do {
    const result: any[] = await getHistory(connection, mint, {
      limit: 20,
      before: txs[txs.length - 1]?.signature,
    });
    if (!result.length) break;
    result.map((tx) => txs.push(tx));
  } while (true);
  return txs;
};
