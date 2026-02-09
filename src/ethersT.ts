import { Contract, ethers, formatUnits, Transaction } from "ethers";
import fs from "fs";
import path from "path";
import 'dotenv/config';
import { error } from "console";

const filePath = path.join(process.cwd(), "walletsBalance.json");
const arrWalletsPath = path.join(process.cwd(), "arrWallets.json")
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




// const URL = "https://rpc.moderato.tempo.xyz";


// const provider = new ethers.JsonRpcProvider(URL, {
//     name: "tempo",
//     chainId: 42431
// });



const contractAddress ="0x79D63D5D15e644A355a2D217dEf9E7393b886939";


let arrWallets:string[]=[];

let walletsBalances:walletsBalance[]=[];

interface walletsBalance {
  address:string
  tokenAddres:string
  index:number
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

let tempoToken1="0x20c0000000000000000000000000000000000000"


function even_or_odd(n:number) {
      return n % 2 === 0 ? "Even" : "Odd"
}


async function testConnection() {
    try {
        if(arrWallets.length == 0){
          getData();
        }
        const network = await provider.getNetwork();
        console.log("Подключено к",network.name);
        console.log("Chain ID:", network.chainId.toString());
    } catch (error) {
        console.error("Ошибка подключения:", error);
    }
}

testConnection();





transferETH();
async function transferETH() {
  const wallet = ethers.HDNodeWallet.fromPhrase(phrase!).connect(provider);
  for(let i=1;i<15;i++){
    console.log ("Start transfering ETH MEGA" )
   let wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
   let amountWei = getRandomValue() / 10000;
   const AMOUNT = ethers.parseEther(amountWei.toString());
   const tx = await wallet.sendTransaction({to:wallets.address,value:AMOUNT,nonce:await wallet.getNonce("latest")});
   await tx.wait();
   console.log(i,wallets.address );
  }
}

async function claimTestTokens() {
  let rawData ="0x40c10f19000000000000000000000000dc5a37c1147304a62d5adbb5664be00a9a0dee6e0000000000000000000000000000000000000000000000000de0b6b3a7640000"
  
  const wallet = ethers.HDNodeWallet.fromPhrase(phrase!).connect(provider);
  const v = getRandomValue().toString()
  const amount = ethers.parseUnits(v, 9);
  const address =await wallet.getAddress();
  const contractMint = new Contract(mintContract,mintAbi,wallet);
  const tx = await contractMint.mint!(address,amount)
  await tx.wait();
  console.log(tx.hash)
}









async function checkBalance() {
  console.log("Start check Balance");
  const abi = ["function balanceOf(address account) returns (uint256)"];
  for (let i=0;i<13;i++){
    const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
        const contract = new Contract(tempoToken1,abi,wallets);
   const balanceRaw = await contract.balanceOf!.staticCall(wallets.address);
   let balance = ethers.formatUnits(balanceRaw,6);
    // walletsBalances.push({
    //     address:wallets.address,
    // })
    console.log(i,balance);
    
    await new Promise(v => setTimeout(v,350));
  }
        try {
          const data = JSON.stringify(walletsBalances,null, 2);
          fs.writeFileSync(filePath, data, "utf8");
          console.log("✅ Файл успешно записан по адресу:", filePath);
      } catch (err) {
          console.error("❌ Ошибка при записи файла:", err);
      }
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


const walletMap = Object.fromEntries(
  walletsBalances.map(w => [w.index, w])
);

//,{nonce:await wallets.getNonce("latest")}

async function createAndSendNFTs() {
  console.log("Start NFT farm");
  const abiTransferFrom = [
  "function transferFrom(address from, address to, uint256 tokenId)"
];
  for (let i=5;i<51;i++) {
  const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
    const bytecode = (fs.readFileSync("./src/nftByteCode.bin", "utf8")).trim();
  const abiCode = JSON.parse(fs.readFileSync("./src/nftAbi.json", "utf8"));
  const factory = new ethers.ContractFactory(abiCode, bytecode, wallets);  
  try {
   const contractNFT = await factory.deploy(0,5 + getRandomValue());
    console.log("Deploy start");
    await contractNFT.waitForDeployment();
    await new Promise(r => setTimeout(r, 1000 + getRandomValue()));
   let addressNFT = await contractNFT.getAddress();
   const contractTransferFrom = new Contract(addressNFT, abiTransferFrom, wallets);
   
   for (let j = 0; j < 3; j++) {
     const randomUser = await getRandomLastSender();
     console.log("Random", randomUser, "Wallet", wallets.address);
     const tx = await contractTransferFrom.transferFrom!(wallets.address, randomUser, j);
     await tx.wait();
     console.log(`NFT ${j} sent to ${randomUser}, tx: ${tx.hash}, from ${i}`);
   }
   
  } catch (error) {
    console.log("Error with deploy", error)
  }
  }
}





async function farm() {
  console.log("Start FARMING");
  const abi = ["function balanceOf(address account) returns (uint256)"];
  const transferAbi = [
  "function transfer(address to, uint256 amount) returns (bool)"
];
 
  for (let i=2;i<280;i++){
    const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`).connect(provider);
   
    const RandomValue = getRandomValue().toString()
    const amount = ethers.parseUnits(RandomValue, 6);
  const address =await wallets.getAddress();
    try {
      let item = walletMap[i]?.tokenAddres;

  if (!item) {
  console.log("No contract for index", i);
  continue;
}
      const contractTransfer = new Contract(item,transferAbi,wallets);
      const randomUser =await getRandomLastSender();
      console.log(randomUser);
      const tx = await contractTransfer.transfer!(randomUser,amount,{nonce:await wallets.getNonce("latest")});
      await tx.wait();
      console.log(tx.hash);
    } catch (e) {
      console.log("Transfer error on", i, e);
    }



  // const bytecode = (fs.readFileSync("./src/tokenByte.bin", "utf8")).trim();
  // const abiCode = JSON.parse(fs.readFileSync("./src/tokenAbi.json", "utf8"));
  // const factory = new ethers.ContractFactory(abiCode, bytecode, wallets);
  // try{
  //   const contract = await factory.deploy( wallets.address,{nonce:await wallets.getNonce("latest")});
  //           console.log("Транзакция отправлена, ожидание подтверждения...");
  //       await contract.waitForDeployment();
  //               addressToken = await contract.getAddress();
  //       console.log("✅ Контракт успешно деплоирован!");
  //       console.log("Адрес контракта:", addressToken);
  // }
  
  // catch(error){
  //   console.error("❌ Ошибка деплоя:", error);
  // }

//   const contractTransfer = new Contract(addressToken,transferAbi,wallets);
//   const tx = await contractTransfer.transfer!(address,amount,{nonce:await wallets.getNonce("latest")})
//  await tx.wait();
//    const contract = new Contract(addressToken,abi,wallets);
//   const balanceRaw = await contract.balanceOf!.staticCall(wallets.address);
//   let balance = ethers.formatUnits(balanceRaw,18);

    // walletsBalances.push({
    //     address:wallets.address,
    //     tokenAddres: addressToken,
    //     index:i
    // })
    // arrWallets.push(wallets.address);
    console.log(i);
  }
      // try {
      //     const data = JSON.stringify(walletsBalances,null, 2);
          
      //     fs.writeFileSync(filePath, data, "utf8");
          
      //     console.log("✅ Файл успешно записан по адресу:", filePath);
      // } catch (err) {
      //     console.error("❌ Ошибка при записи файла:", err);
      // }

}


getRandomLastSender()
async function getRandomLastSender() {
  let i = 1;
    try {

        const blockNumber = await provider.getBlockNumber();
        console.log(blockNumber);
        let rWallet;
        const block = await provider.getBlock(blockNumber);

        if (!block || block.transactions.length === 0) {
            console.log(`Блок ${blockNumber} пустой, ищу в предыдущем...`);
            return; 
        }
        const transactions = block.transactions;

        let value = getRandomValue();


        
        const randomTx = transactions[value];
                if(!randomTx)
        {
          rWallet = arrWallets[i]
          i++;
        } else {
        const singleTx = await block.getTransaction(randomTx);
         rWallet = singleTx.from;
        }
        console.log(`📦 Блок: ${blockNumber}`);
        console.log(`🔗 Всего транзакций: ${transactions.length}`);
        


        console.log(`👤 Случайный отправитель: ${rWallet}`);

        return rWallet;

    } catch (error) {
        console.error("Ошибка при получении адреса:", error);
    }
}


 function getData() {
 try {  const data = fs.readFileSync(arrWalletsPath,{encoding: "utf8"});
        const data2 = fs.readFileSync(filePath,{encoding:"utf8"})
   if (data) {
    arrWallets = JSON.parse(data);
    walletsBalances = JSON.parse(data2);
    console.log(`✅ Загружено из файла с кошельками: ${arrWallets.length} объектов`);
   }} catch (err) {
        console.error("❌ Ошибка при чтении или парсинге JSON:", err);
        arrWallets = [];
    }
}

