import { Contract, ethers, Transaction } from "ethers";
import fs from "fs";
import path from "path";
const phrase = process.env.PHRASE;
const provider = new ethers.InfuraProvider(
  "sepolia",
  process.env.INFURA_API
);
export let a=1


let signer;
const filePath = path.join(process.cwd(), "wallets.json");

export let wallets:string[] = [];
let walletsForJS:wallets[] =[];

 interface wallets {
    index:number;
    address:string;
}


export async function createWallets() {
for (let i = 1; i<12;i++){
    const wallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`)
    .connect(provider);
    wallets.push(wallet.address);

}}


export async function start() {
    console.log("Генерация кошельков...");

for (let i = 1; i<12;i++){
    const wallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${i}`)
    .connect(provider);
       const  bal = await provider.getBalance(wallet.address);
    console.log("Balance ETH",bal);
    walletsForJS.push({index:i, address:wallet.address});
    if (i ==10){
        console.log("TRY TO TRANSFER")
        transfer()
    }

    try {
        const data = JSON.stringify(wallets, null, 2);
        fs.writeFileSync(filePath, data, "utf8");
        console.log("✅ Файл успешно записан по адресу:", filePath);
    } catch (err) {
        console.error("❌ Ошибка при записи файла:", err);
    }
}}

async function deployToken() {
    const wallet = ethers.HDNodeWallet.fromPhrase(phrase!).connect(provider);

    const abi = JSON.parse(fs.readFileSync("./src/abi.json", "utf8"));
    const bytecode = fs.readFileSync("./src/bytecode.bin","utf8").trim();
    console.log("Deploy strated from", wallet.address);
    const factory = new ethers.ContractFactory(abi,bytecode,wallet)
    try {
        const contract = await factory.deploy(wallet.address);
        console.log("Транзакция отправлена, ожидание подтверждения...");
        await contract.waitForDeployment();

        const address = await contract.getAddress();
        console.log("✅ Контракт успешно деплоирован!");
        console.log("Адрес контракта:", address);

    } 
    catch(error) {
    console.error("❌ Ошибка деплоя:", error);
    }
}

 function getData() {
 try {  const data = fs.readFileSync(filePath,{encoding: "utf8"});
   if (data) {
    wallets = JSON.parse(data);
    console.log(`✅ Загружено из файла с кошельками: ${wallets.length} объектов`);
   }} catch (err) {
        console.error("❌ Ошибка при чтении или парсинге JSON:", err);
        wallets = [];
    }
}


async function transfer() {
    try {
    const wallet = ethers.HDNodeWallet.fromPhrase(phrase!)
    .connect(provider);
    const  bal = await provider.getBalance(wallet.address);
    console.log("Balance ETH",bal);
    for (let index = 1; index < 10; index++) {
            const wallets = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${index}`)
    .connect(provider);

  let tx1 = await wallet.sendTransaction({to: wallets.address,value: ethers.parseEther("0.000444")})
        
let receipt = await tx1.wait();
const  bal2 = await provider.getBalance(wallet.address);
console.log("Balance ETH after transfer",bal2);
        if (index === 9){
            console.log("DONE!")
        }
}
    } catch (error) {
        console.error("❌ Ошибка при трансфере:", error);
    }
}


async function claim() {
    for (let index = 0; index < 10; index++){
    try { 
    let wallet = ethers.HDNodeWallet.fromPhrase(phrase!,undefined,`m/44'/60'/0'/0/${index}`)
    .connect(provider);
    const abi = ["function transfer() payable"];
    const address ="0xd3d48E66fa73Cd5943Ad05d9Afa47df365379d31"
    const contract = new Contract(address,abi,wallet)
    let tx = await (contract.publicMint!)({value:1});
    await tx.wait();
    console.log("Mint  №", index,"success" )
    }
    catch(e) {
        console.error("❌ Mint failed №:",index, e);
    }
}
}



// async function deploy() {
//         const wallet = ethers.HDNodeWallet.fromPhrase(phrase!)
//     .connect(provider);

//     const abi = JSON.parse(fs.readFileSync("./src/abi.json", "utf8"));
//     const bytecode = fs.readFileSync("./src/bytecode.bin","utf8").trim();
//     console.log("Deploy strated from", wallet.address);
//     const factory = new ethers.ContractFactory(abi, bytecode, wallet);
//     try {
//         const contract = await factory.deploy(wallet.address,0,10000);
//         console.log("Транзакция отправлена, ожидание подтверждения...");
//         await contract.waitForDeployment();

//         const address = await contract.getAddress();
//         console.log("✅ Контракт успешно деплоирован!");
//         console.log("Адрес контракта:", address);
//     } catch (error) {
//         console.error("❌ Ошибка деплоя:", error);
//     }
// }
// deploy()















// transferFrom1ToAll();
// async function transferFrom1ToAll() {
//     signer  = await provider.getSigner();
//     for (let i=1;i<10;i++)
//         {const tx = await signer.sendTransaction({
//             to: wallets[i],
//             value: "100"
//         });
//       let  receipt =await tx.wait;



//         }
    
// }

// }

// saveAdrees();

 //console.log("Адрес кошелька:", wallet.address);
//  const balnce = getBal();
// console.log("Balance ETH",balnce);

// function saveAdrees(){
//     fs.writeFile("wallets.json",JSON.stringify(wallets,null,2),(err)=>{
//           if (err) {
//     console.error("Ошибка записи:", err);
//     return;
//   }
//     })
// }

// start().catch(console.error);
//export let add = wallet.address;