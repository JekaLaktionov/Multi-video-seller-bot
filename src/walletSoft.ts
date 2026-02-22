import { Contract, ethers, Transaction } from "ethers";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { initDatabase,} from './dataBase.js';
import {Document} from 'mongoose';
const phrase = process.env.PHRASE;

interface WalletData extends Document {
  address:string,
  index:number,
  time:string
}




type ChainName =
  | "ETH"
  | "BASE"
  | "OP"
  | "zkSync_Mainnet"
  | "POLYGON"
  | "LINEA"
  | "SCROLL"
  | "BERA"
  | "MANTLE"
  | "CELO";

type ChainConfig = {
  name: string;
  chainId: number;
  url: string;
};

export const CHAINS: Record<ChainName, ChainConfig> = {
  ETH: {
    name: "ETH",
    chainId: 1,
    url: "https://rpc.ankr.com/eth",
  },
  BASE: {
    name: "BASE",
    chainId: 8453,
    url: "https://mainnet.base.org",
  },
  OP: {
    name: "OP",
    chainId: 10,
    url: "https://mainnet.optimism.io",
  },
  zkSync_Mainnet: {
    name: "zkSync_Mainnet",
    chainId: 324,
    url: "https://mainnet.era.zksync.io",
  },
  POLYGON: {
    name: "POLYGON",
    chainId: 137,
    url: "https://polygon-rpc.com",
  },
  LINEA: {
    name: "LINEA",
    chainId: 59144,
    url: "https://rpc.linea.build",
  },
  SCROLL: {
    name: "SCROLL",
    chainId: 534352,
    url: "https://rpc.scroll.io",
  },
  BERA: {
    name: "BERA",
    chainId: 80094,
    url: "https://rpc.berachain.com",
  },
  MANTLE: {
    name: "MANTLE",
    chainId: 5000,
    url: "https://rpc.mantle.xyz",
  },
  CELO: {
    name: "CELO",
    chainId: 42220,
    url: "https://forno.celo.org",
  },
};

export function getProvider(chain: ChainName) {
  const cfg = CHAINS[chain];
  return new ethers.JsonRpcProvider(cfg.url, {
    name: cfg.name,
    chainId: cfg.chainId,
  });
}


const filePath = path.join(process.cwd(), "wallets.json");

export let wallets:string[] = [];
let walletsForJS:wallets[] =[];

 interface wallets {
    index:number;
    address:string;
}


export async function createWallets() {
    if (!phrase) {
    throw new Error("Критическая ошибка: Сид-фраза не найдена или пуста!");
}
  try {
for (let i = 1; i<12;i++){
    const wallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`)
    .connect(getProvider("ETH"));
     let timeStamp = Date();
 wallets.push(  wallet.address);

}} catch(error) {
  console.log(error)
}
}

// export async function grabToAll() {
//     for (let i = 1; i<32;i++){
//     const wallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/1`)
//     .connect(provider);
//     const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`)
//     .connect(provider);}
// }
















