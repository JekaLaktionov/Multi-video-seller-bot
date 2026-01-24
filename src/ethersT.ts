import { Contract, ethers, formatUnits, Transaction } from "ethers";
import fs from "fs";
import path from "path";
import 'dotenv/config';

const filePath = path.join(process.cwd(), "walletsBalance.json");
const phrase = process.env.PHRASE;
// const provider = new ethers.InfuraProvider(
//   "sepolia",
//   process.env.INFURA_API
// );

const URL = "https://carrot.megaeth.com/rpc";


const provider = new ethers.JsonRpcProvider(URL, {
    name: "megaeth-carrot",
    chainId: 6343
});


const contractAddress ="0x79D63D5D15e644A355a2D217dEf9E7393b886939";

let walletsBalances:walletsBalance[]=[];

interface walletsBalance {
  address:string
  balance:string
}

 function getRandomValue() {
   let min = Math.ceil(1);
  let max = Math.floor(10);
  return Math.floor(Math.random() * (max - min) + min)
}

let mintContract ="0x176735870dc6C22B4EBFBf519DE2ce758de78d94"
let mintContract2="0xF82ff0799448630eB56Ce747Db840a2E02Cde4D8";
let mintContract3="0xFaf334e157175Ff676911AdcF0964D7f54F2C424";
let mintAbi=["function mint(address to, uint256 amount) returns (bool)"]





async function testConnection() {
    try {
        const network = await provider.getNetwork();
        console.log("Подключено к",network.name);
        console.log("Chain ID:", network.chainId.toString());
    } catch (error) {
        console.error("Ошибка подключения:", error);
    }
}

testConnection();





async function transferETH() {
  const wallet = ethers.HDNodeWallet.fromPhrase(phrase!).connect(provider);
  for(let i=1;i<300;i++){
    console.log ("Start transfering ETH MEGA" )
   let wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
   let amountWei = getRandomValue() / 10000;
   const AMOUNT = ethers.parseEther(amountWei.toString());
   const tx = await wallet.sendTransaction({to:wallets.address,value:AMOUNT,nonce:await wallet.getNonce("latest")});
   await tx.wait();
   console.log(i);
  }
}

async function claimTestTokens() {
  let rawData ="0x40c10f19000000000000000000000000dc5a37c1147304a62d5adbb5664be00a9a0dee6e0000000000000000000000000000000000000000000000000de0b6b3a7640000"
  const wallet = ethers.HDNodeWallet.fromPhrase(phrase!).connect(provider);
  const amount = ethers.parseUnits("2", 6);
  const address =await wallet.getAddress();
  const contractMint = new Contract(mintContract3,mintAbi,wallet);
  const tx = await contractMint.mint!(address,amount)
  await tx.wait();
  console.log(tx.hash)
}












async function transfer() {
    console.log("Start transfer")
    const wallet = ethers.HDNodeWallet.fromPhrase(phrase!).connect(provider);

    const addressBot = "0x1853d4779da48441f1019837aBa50C2779833FDd";
    const abi = ["function transfer(address to, uint256 amount) returns (bool)"];
    for(let i=1;i<12;i++){
    const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
              let value = getRandomValue();
        const amount = ethers.parseUnits( value.toString(),6);
    const contract = new Contract(contractAddress,abi,wallet)
const tx = await contract.transfer!(wallets, amount);
await tx.wait();
console.log(tx.hash);
    }
}
checkBalance()
async function checkBalance() {
  console.log("Start checkig Balance");
  const abi = ["function balanceOf(address account) returns (uint256)"];
  for (let i=1;i<291;i++){
    const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
      const amount = ethers.parseUnits("1", 18);
  const address =await wallets.getAddress();
  const contractMint = new Contract(mintContract2,mintAbi,wallets);
  const tx = await contractMint.mint!(address,1000000000,{nonce:await wallets.getNonce("latest")})
  await tx.wait();
    //const contract = new Contract(mintContract3,abi,wallets);
   // const balanceRaw = await contract.balanceOf!.staticCall(wallets.address);
   // let balance = ethers.formatUnits(balanceRaw,6);
    let balance = "0";
    walletsBalances.push({
        address:wallets.address,
  balance:balance
    })
    console.log(i,balance);
  }
      try {
          const data = JSON.stringify(walletsBalances,null, 2);
          fs.writeFileSync(filePath, data, "utf8");
          console.log("✅ Файл успешно записан по адресу:", filePath);
      } catch (err) {
          console.error("❌ Ошибка при записи файла:", err);
      }

}
