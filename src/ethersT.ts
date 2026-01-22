import { Contract, ethers, formatUnits, Transaction } from "ethers";
import fs from "fs";
import path from "path";
import 'dotenv/config';

const filePath = path.join(process.cwd(), "walletsBalance.json");
const phrase = process.env.PHRASE;
const provider = new ethers.InfuraProvider(
  "sepolia",
  process.env.INFURA_API
);

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
  for (let i=1;i<12;i++){
    const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
    const contract = new Contract(contractAddress,abi,wallets);
    const balanceRaw = await contract.balanceOf!.staticCall(wallets.address);
    let balance = ethers.formatUnits(balanceRaw,6);
    walletsBalances.push({
        address:wallets.address,
  balance:balance
    })
    console.log(i);
  }
      try {
          const data = JSON.stringify(walletsBalances,null, 2);
          fs.writeFileSync(filePath, data, "utf8");
          console.log("✅ Файл успешно записан по адресу:", filePath);
      } catch (err) {
          console.error("❌ Ошибка при записи файла:", err);
      }

}
