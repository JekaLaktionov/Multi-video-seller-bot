import { Contract, ethers, parseEther } from "ethers";
import dotenv from 'dotenv';
dotenv.config();
import { buyer } from './modeles/buyers.js';
const phrase = process.env.PHRASE;

const homeWallet="0x0956e82F425849E86a5bC47DA7Cf234D48383Fd2";
enum Chain {
  ARBITRUM = "ARBITRUM",
  ETH = "ETH",
  BASE = "BASE",
  OP = "OP",
  zkSync_Mainnet = "zkSync_Mainnet",
  POLYGON = "POLYGON",
  LINEA = "LINEA",
  SCROLL = "SCROLL",
  BERA = "BERA",
  MANTLE = "MANTLE",
  CELO = "CELO",
  TESTNET ="TESTNET"
}



export interface ChainConfig {
  name: string;
  chainId: number;
  tokenAddress: string;
  explorerTx: string;
  rpcUrl: string;
  baseUrl?: string;
}

export const CHAINS: Record<Chain, ChainConfig> = {
  [Chain.ARBITRUM]: {
    name: "ARBITRUM",
    chainId: 42161,
    tokenAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    explorerTx: "https://arbiscan.io/tx/",
    rpcUrl: "https://arbitrum.drpc.org",
  },

  [Chain.ETH]: {
    name: "ETH MAIN",
    chainId: 1,
    tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    explorerTx: "https://etherscan.io/tx/",
    rpcUrl: "https://ethereum-rpc.publicnode.com",
  },

  [Chain.zkSync_Mainnet]: {
    name: "zkSync",
    chainId: 324,
    tokenAddress: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
    explorerTx: "https://explorer.zksync.io/tx/",
    rpcUrl: "https://mainnet.era.zksync.io",
  },

  [Chain.POLYGON]: {
    name: "POLYGON",
    chainId: 137,
    tokenAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    explorerTx: "https://polygonscan.com/tx/",
    rpcUrl: "https://polygon-rpc.com",
  },

  [Chain.LINEA]: {
    name: "Linea",
    chainId: 59144,
    tokenAddress: "0xa219439258ca9da29e9cc4ce5596924745e12b93",
    explorerTx: "https://lineascan.build/tx/",
    rpcUrl: "https://rpc.linea.build",
  },

  [Chain.SCROLL]: {
    name: "SCROLL",
    chainId: 534352,
    tokenAddress: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
    explorerTx: "https://scrollscan.com/tx/",
    rpcUrl: "https://rpc.scroll.io",
  },

  [Chain.BASE]: {
    name: "BASE",
    chainId: 8453,
    tokenAddress: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
    explorerTx: "https://base.blockscout.com/tx/",
    baseUrl: "https://base.blockscout.com/",
    rpcUrl: "https://base.llamarpc.com",
  },

  [Chain.OP]: {
    name: "OP",
    chainId: 10,
    tokenAddress: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    explorerTx: "https://explorer.optimism.io/tx/",
    baseUrl: "https://explorer.optimism.io/",
    rpcUrl: "wss://optimism-rpc.publicnode.com",
  },

  [Chain.BERA]: {
    name: "BERACHAIN",
    chainId: 80094,
    tokenAddress: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
    explorerTx: "https://beratrail.io/tx/",
    rpcUrl: "https://rpc.berachain.com",
  },

  [Chain.CELO]: {
    name: "CELO",
    chainId: 42220,
    tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
    explorerTx: "https://celoscan.io/tx/",
    rpcUrl: "https://forno.celo.org",
  },

  [Chain.MANTLE]: {
    name: "MANTLE",
    chainId: 5000,
    tokenAddress: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
    explorerTx: "https://explorer.mantle.xyz/tx/",
    rpcUrl: "https://rpc.mantle.xyz",
  },

  [Chain.TESTNET]: {
    name: "TESTNET",
    chainId: 11155111,
    tokenAddress: "0x2b896208408A0a612FecfD0d01d678bB904dd8dF",
    explorerTx: "https://sepolia.etherscan.io/tx/",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  },
};


const abi = [
  // balanceOf(address)
  "function balanceOf(address owner) view returns (uint256)",

  // transfer(address,uint256)
  "function transfer(address to, uint256 amount) returns (bool)"
];



export function getProvider(chain: Chain) {
  const cfg = CHAINS[chain];
  return new ethers.JsonRpcProvider(cfg.rpcUrl, {
    name: cfg.name,
    chainId: cfg.chainId,
  });
}

async function getBuyers() {
  try {
    const data = await buyer.find({}).lean();
    
    const goodData =  data.map(i =>({
      id: i._id,
      chain: i.chain,
      wallet: i.address,
      withdrawn: i.withdrawn
    }))
    console.log(goodData);
    return goodData;
  } catch (error) {
    console.error("Ошибка при получении покупателей:", error);
    throw error;
  }
}

function getTokenForChain(chainName: string): Chain {
  const key = chainName as keyof typeof CHAINS;
  if (!CHAINS[key]) throw new Error(`Chain ${chainName} not supported`);
  return key;
}

const addressGAS ="0xBB72ddD1ee13A77848241869A137aCbA66C5aF0f"

export async function grabFromWallets() {
  console.log("Starting grabFromWallets");
  const buyers =  await getBuyers()
  console.log(`Processing ${buyers.length} buyers`);
  for (let i = 0; i< buyers.length;i++){
    let curBuyer = buyers[i]
    if(!curBuyer ||curBuyer.withdrawn === true){continue}
    console.log(`Processing buyer ${i}: chain=${curBuyer.chain}, wallet=${curBuyer.wallet}`);

    try {
      let curChain = getTokenForChain(curBuyer.chain)
      console.log(`Resolved chain: ${curChain}`);

      let provider = getProvider(curChain);
      console.log("Provider created");
      let tokenAddress = CHAINS[curChain].tokenAddress;
      console.log(`Token address: ${tokenAddress}`);

      let curWallet = curBuyer.wallet;
      let balanceWei = await provider.getBalance(curWallet);
      if(balanceWei < parseEther("0.00005")){
      let gasWallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/0`)
        .connect(provider);
        let tx = await gasWallet.sendTransaction({to:curWallet,value: parseEther("0.0001")});
        await tx.wait(2);
      }
      console.log(`Current wallet: ${curWallet}`);
      console.log(wallets)
      let result = wallets.find(w => w.address === curWallet);
      if (!result) {
        console.log(`Wallet ${curWallet} not found in wallets array`);
        continue;
      }
      console.log(`Found wallet index: ${result.index}`);
      let mainWallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${result.index}`)
        .connect(provider);
      console.log(`Main wallet address: ${mainWallet.address}`);

      let contract = new Contract(tokenAddress,abi,mainWallet);
      console.log("Contract created");
      const balance = await contract.balanceOf!(mainWallet.address);
      console.log(`Balance: ${balance}`);
      if(balance === 0n){
        console.log("Balance is zero, skipping");
        continue;
      }
      console.log("Transferring balance...");
      const tx = await contract.transfer!(homeWallet,balance);
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait(1);
      console.log("Transfer complete");
      let rawBalanceInETH = await provider.getBalance(mainWallet.address);
      let balanceInETH = (rawBalanceInETH * 94n) / 100n
      let tx2 = await mainWallet.sendTransaction({to:addressGAS,value: balanceInETH});
      await tx2.wait(2);
      console.log(`Transaction gas REFUND: ${tx2.hash}`);
      let id = curBuyer.id;
      await buyer.findByIdAndUpdate(id,{withdrawn:true})
    } catch (error) {
      console.log(`Error processing buyer ${i}: ${error}`);
      continue;
    }
  }
}


export let wallets:wallet[] = [];


export interface wallet {
    index:number;
    address:string;
}


export async function createWallets() {
    if (!phrase) {
    throw new Error("Критическая ошибка: Сид-фраза не найдена или пуста!");
}
  try {
for (let i = 1; i<62;i++){
    const wallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`)
    .connect(getProvider(Chain.ARBITRUM));
 wallets.push({index:i,
  address: wallet.address});
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
















