export {};
import fetch from 'node-fetch';
import {Bot, GrammyError, HttpError, InlineKeyboard, InputFile  } from 'grammy';
import dotenv from 'dotenv';
dotenv.config();

// Global handlers for unhandled errors/rejections
// (helps identify why process exits when bot is idle)
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

import express from "express";
import {hydrate  } from "@grammyjs/hydrate"

import { createWallets, wallets,wallet,grabFromWallets } from "./walletSoft.js";
import { initDatabase } from './dataBase.js';
import { User } from './modeles/user.js';
import { Ibuyer,buyer } from './modeles/buyers.js';
import { Counter } from './modeles/counter.js';
import {getUserIds,userPromoData} from './botPromoCall.js';
import { text } from 'stream/consumers';



await createWallets();

const OWNER = 2040246430;


type VideoData = {

  body: string;
  starsLink: string;
  costIndex: number;
};





const videos: Record<number, VideoData> = {
  1: {
    body: `_Почему ТЫ не заработаешь на АЛЬТЕ?_ 💸

_Сколько ИКСОВ реально можно забрать с КРИПТЫ?_ 🚀

_Что покупать, чтобы не стать кормом КИТОВ?_ 🐳

__Я провёл детальный анализ доходности альткоинов за 5 лет (год-к-году)__.
📊 *Вычислил вероятность купить скам даже в ТОП-100,*
🔍 выявил самые надёжные и качественные альткоины,
📉 разобрался, какие монеты стабильно обнуляются и почему.

На создание этой базы я потратил 7 часов исследований.
И такой контент объективно не выгоден блогерам, биржам и маркетмейкерам — он мешает им зарабатывать.

Поэтому выкладывать это в открытый доступ — нет смысла. 🔒`,
    starsLink:'https://t.me/d0getrader/1179',
    costIndex:1
  },
  2: {
    body: `*"99% криптанов совершают ЭТУ ОШИБКУ"* ❗🔥

*"Моя ТЕХНОЛОГИЯ выбора и набора КРИПТО АКТИВОВ"* ⚙️💎

*"Активы для УСТОЙЧИВОГО РОСТА капитала"* 📈🌱

Сделал ролик по _наболевшей теме_ 🎥  
Разобрал одну **ГЛАВНУЮ ошибку** всех криптовалютчиков при работе с портфелем ⚠️  

Показал два примера:  
- _ПЛОХОГО_  портфеля ❌  
- _ХОРОШЕГО_  портфеля ✅  

И дал **чёткую технологию**, как собирать _ХОРОШИЙ \(прибыльный\)_ портфель шаг за шагом 💼✨`,
    starsLink:'https://t.me/d0getrader/1231',
    costIndex:2,
  },
    3: {
    body: `_КТО И НА ЧЁМ ( НА КОМ ) ЗАРАБАТЫВАЕТ В КРИПТЕ_ ?  🐋🍆🐹

_ПОЧЕМУ БУДУЧИ РИТЕЙЛОМ, ТЫ ОБРЕЧЁН ТЕРЯТЬ_?

_ПРАКТИЧЕСКИЕ СОВЕТЫ: КАК ПЕРЕЛОМИТЬ СИТУАЦИЮ_.

Сделал ролик на интересную тему. Изучил, на чём и как зарабатывают сильные мира сего в криптовалютах.
 Казалось бы, ответ очевиден на хомяках, но всё не так просто. 

По результатам исследования, сделал выводы, что конкретно нужно делать рядовому хомяку,
 чтобы значительно увеличить свои шансы на получение прибыли.`,
    starsLink:'https://t.me/d0getrader/1362',
    costIndex:3,
},
    4: {
    body: `_ПРОДАЮ ВСЮ АЛЬТУ_ !  😈

_ПОЧЕМУ ЦЕНЫ НА ЩИТКИ БУДУТ ИДТИ ТОЛЬКО ВНИЗ_?

_ЛУЧШАЯ ИНВЕСТИЦИЯ В КРИПТУ в ДАННЫЙ МОМЕНТ_.

Сделал ролик на тяжелую тему. Проговорил, что делаю сейчас с щитками и другой лоу кап-альтой.
Считаю, что холдить ИХ сейчас ОПАСНО, перелился в менее рисковый класс активов.Видос решил сделать, премиум, чтобы не сеять панику.`,
    starsLink:'https://t.me/d0getrader/1473',
    costIndex:4,
},
    5: {
    body: `    _4 ПРИЗНАКА ХОМЯКА_🐹
    
    _Из-за ЭТО ЛЮДИ ТЕРЯЮТ МИЛЛИОНЫ_
    
    _Как СТАТЬ АЛЬФА-ХОМЯКОМ и начать зарабатывать_!
    
    Я сделал ультимативный ролик, в который вложил 4 года своего опыта, и дал ответ на простой вопрос: "Как хомяки теряют деньги?"

    Дело даже не в альтсезоне, а в ряде очень ГРУБЫХ ошибок и ловушек мышления. Как обычно, предложил и решения этих проблем.
    `,
    starsLink:'',
    costIndex:5,
},    6: {
    body: `_ПРОЕКТ УРОВНЯ AAVE с недооценкой х10_  ! ⭐

_Разобрал ДВЕ УНИКАЛЬНЫЕ МЕТРИКИ_ 

_АЛЬТКОИН - С РЕКОРДНЫМИ ПОКАЗАТЕЛЯМИ_. ✨

Фундаментал уровня Blue Chip (Aave 2.0). Проект не просто копирует гигантов, он создает инфраструктуру ликвидности нового поколения. В то время как Aave доминирует в кредитовании, этот актив захватывает рынок динамических маркет-мейкеров. Это база, на которой строится весь современный DeFi.
`,
    starsLink:'https://t.me/d0getrader/1698',
    costIndex:6,},
      7: {
    body: `_ЕДИНСТВЕННАЯ РАБОЧАЯ СТРАТЕГИЯ В КРИПТЕ_  ! 🔥

_КАК ЗАРАБАТЫВАТЬ БЕЗ АЛЬТСЕЗОНА_ ? ⭐

_ПОЛНЫЙ РАЗБОР DEFI и ИДЕЯ на фарм стейблов с APR 200%  _. ✅

Данный ролик это ПОЛНЫЙ гайд от А до Я, на СТРАТЕГИЮ портфельного управления в крипте,
разобрал вообще всё и от того какие активы и как набирать, до DEFI в которых фармлю сам.
Ролик получился максимально понятный с обилием инфографиков и примеров.
Планирую увеличить капитал в 5-6 раз за будущюю бычку, по этой СТРАТЕГИИ. 
`,
    starsLink:'https://t.me/d0getrader/1850',
    costIndex:7,
  }}


export const VIP:number[] = [7600112142,5566365178,779295871,1003781365,318588201];
let  tempVIP:number[] = []
const VIP_DISCOUNT = 5;






const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const WALLET: wallet = {index:0,address: process.env.MY_WALLET!};
const options = {method: 'GET', body: null};
const API_BLCK = process.env.BLOCKSCOUT_API;




enum Chain {
  ARBITRUM = "ARBITRUM",
  ETH = "ETH",
  BASE = "BASE",
  OP = "OP",
  zkSync_Mainnet = "zkSync_Mainnet",
  POLYGON = "POLYGON",
  LINEA = "LINEA",
  SCROLL = "SCROLL",
  MANTLE = "MANTLE",
  SEPOLIA ="SEPOLIA"
}




export const chainConfig: Record<Chain, ChainConfig> = {
  [Chain.ARBITRUM]: {
    chainId: 42161,
    tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    explorerTx: 'https://arbiscan.io/tx/',
    name:"ARBITRUM",
  },
  [Chain.ETH]: {
    chainId: 1,
    tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    explorerTx: 'https://etherscan.io/tx/',
    name:"ETH MAIN",
  },
  [Chain.zkSync_Mainnet]: {
    chainId: 324,
    tokenAddress: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
    explorerTx: 'https://explorer.zksync.io/tx/',
    name:"zkSync",
  },

  [Chain.POLYGON]: {
    chainId: 137,
    tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    explorerTx: 'https://polygonscan.com/tx/',
    name:"POLYGON",
  },
  [Chain.LINEA]:{
    chainId:59144,
    tokenAddress:'0xa219439258ca9da29e9cc4ce5596924745e12b93',
    explorerTx:'https://lineascan.build/tx/',
    name:"Linea",
  },
    [Chain.SCROLL]:{
    chainId:534352,
    tokenAddress:'0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
    explorerTx:'https://scrollscan.com/tx/',
    name:"SCROLL",
  },
      [Chain.BASE]:{
    chainId:8453,
    tokenAddress:'0xfde4c96c8593536e31f229ea8f37b2ada2699bb2',
    explorerTx:'https://base.blockscout.com/tx/',
    baseUrl:"https://base.blockscout.com/",
    name:"BASE"},

    [Chain.OP]:{
    chainId:10,
    tokenAddress:'0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    explorerTx:'https://explorer.optimism.io/tx/',
    baseUrl:"https://explorer.optimism.io/",
    name:"OP"
  },
  [Chain.MANTLE]: {
    chainId: 5000,
    tokenAddress: '0x779Ded0c9e1022225f8E0630b35a9b54bE713736',
    explorerTx: 'https://explorer.mantle.xyz/tx/',
    name: "MANTLE"
  },
    [Chain.SEPOLIA]: {
    chainId: 11155111,
    tokenAddress: '0x2b896208408A0a612FecfD0d01d678bB904dd8dF',
    explorerTx: 'https://sepolia.etherscan.io/tx/',
    name: "TESTNET"
  }};



const allChainNames = Object.values(Chain);


const chainBord = new InlineKeyboard();

for (const chainName of allChainNames) {
  const chain = chainConfig[chainName];
  if (!chain) continue;

  chainBord.text(chainName, `chain_${chainName}`).row();
}

chainBord.text(`Какие токены принимает бот?`,`token`).row().text("Назад", "back");


type ChainConfig = {
  chainId: number;
  tokenAddress: string;
  explorerTx: string;
  baseUrl?:string;
  name:string;
};


let promoOn = false; //promotion swith
let discount=0;

const bot = new Bot(process.env.TELEGRAM_TOKEN!);


bot.use(hydrate()as any);



// costs
const costs = Array.from({ length: 20 }, (_, i) =>
  Number(process.env[`PRICE${i}`] ?? 0)
);


const urlArr = Array.from({ length: 20 }, (_, i) =>
  (process.env[`SELLIG_VIDEO${i}`])
);

console.log("Старая",urlArr)

const sumCosts =
  costs
    .filter(Number.isFinite)
    .reduce((sum, cost) => sum + cost, 0) * 0.8;




    
const Allurl: string[] = urlArr.filter(
  (v): v is string => typeof v === "string"
);

console.log("Новая",Allurl)

//@user id -> timer
const userIntervals = new Map<number, NodeJS.Timeout>();
const userTimeouts = new Map<number, NodeJS.Timeout>();

// user id -> cost and video id
const userPayMap = new Map<number,UserPayState >();

// Cleanup user state function
function cleanupUserState(chatId: number,saveCost = 1000,defVideoID:string[] =[]) {
  const intervalId = userIntervals.get(chatId);
  if (intervalId) clearInterval(intervalId);
  
  const timeoutId = userTimeouts.get(chatId);
  if (timeoutId) clearTimeout(timeoutId);
  
  userIntervals.delete(chatId);
  userTimeouts.delete(chatId);
  oneClickOneMove.delete(chatId);
  console.log("КЛЮЧ УДАЛЁН",console.log(oneClickOneMove.get(chatId)))
  const state = userPayMap.get(chatId);
  if (state) {
    state.cost = saveCost;
    state.videoUrl = defVideoID;
  }
}


type UserPayState = {
  cost: number;
  videoUrl: string[];
  chain: Chain;
  wallet:string;
  menuId?:number
};


// user id -> flag
let oneClickOneMove= new Map<number, boolean>;

let  antiSpam = new Map<number,number>(); // for detecting spamers



interface TokenTx {
  hash: string;
  from: string;
  to: string;
  value: number;
  tokenSymbol: string;
  timeStamp: number;
  tokenDecimal:number;
}

let lastTxHash:string;


let buyers:Ibuyer []= [];


const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR   = 60 * MINUTE;
const timeGap = 12 * HOUR;

bot.api.setMyCommands([
  {
    command: "start", description: "Запуск бота" 
  },
])

async function getStartMess() {
  
  let StartText = `🎥 Здарова, криптовалютчик\!  
Бот для доступа к эксклюзивному контенту на связи 👋💎  

Перед использованием бота прочитай *простые правила* ⬇️

1️⃣ - Нажимай **«Оплачено»** только после отправки USDT 💸  
2️⃣ - Оплачивай **точную сумму**, которую просит бот (со всеми копейками) ✔️  
3️⃣ - Во время проверки платежа **не выходи в меню** — просто жди, бот ответит автоматически ⏳🤖
`
return StartText;
}

async function getNextSequence(nameCounter:string) {
   const result = await Counter.findOneAndUpdate(
    {name:nameCounter},
    {$inc:{value: 1}},
    {returnDocument: 'after',                     
      upsert: true}
   );
   return result.value
}




bot.command("start", async (ctx) => {
  let text =await getStartMess();
  
  if(!ctx.from){
    return ctx.reply("User data not available")
  }
  let chatId = ctx.from.id;
  if (await handleSpamResponse(ctx, chatId)) return;
    const data = getOrCreateUserState(chatId);
    
  if (ctx.message) {
    await ctx.api.deleteMessage(
      chatId,
      ctx.message.message_id
    );
  }

  if (data.menuId) {
    try {
      await bot.api.deleteMessage(chatId, data.menuId);
    } catch (e) {
      console.log("Cant delete menu");
    }
  }
  const mess = await ctx.reply(
   escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: menuboard
    }
  );

 if(mess){ data.menuId = mess.message_id}
});



function escapeMarkdownV2(text: string) {
  return text.replace(/([\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

function createPayUrl(CHAIN:string,ADDRESS:string,chainEnum:Chain,wallet:string) {
  let url;
  if (Number(CHAIN) === chainConfig[Chain.BASE].chainId || Number(CHAIN) === chainConfig[Chain.OP].chainId) 
    {
    url = `${chainConfig[chainEnum]?.baseUrl}api?module=account&action=tokentx&contractaddress=${ADDRESS}&address=${wallet}&page=1&offset=1&sort=desc&apikey=${API_BLCK}`;
     console.log(url)
       return url;
  } else {
    url = `https://api.etherscan.io/v2/api?apikey=${ETHERSCAN_API_KEY}&chainid=${CHAIN}&module=account&action=tokentx&contractaddress=${ADDRESS}&address=${wallet}&startblock=0&endblock=9999999999&page=1&offset=1&sort=desc`;
   return url; 
  }

}


  const menuboard = new InlineKeyboard()
  .text(`Правила использования бота`,"rules").row()
  .text("Закрытая видеобиблиотека", "videoboards").row()
  .text(`Консультации по криптовалюте`,"cons").row()
  .text(`Проверка VIP статуса`,"vipCheck").row()
  .text(`Смена блокчейна для оплаты`,`chainSwith`).row();
  

  const videoboard = new InlineKeyboard()
    for (const [index,cost] of costs.entries()){
    if (!cost) continue;
  videoboard.text(`Видео ${index} - ${cost}$`,`video${index}`).row()

  }
   videoboard.text(`Все видео в один клик - ${sumCosts}$`,"videoAll").row()
    .text("Назад","back").row();


  

bot.callbackQuery("menu", async (ctx) => {
  await ctx.answerCallbackQuery("Загрузка списка....");
    let chatId = ctx.chat!.id;
  if (await handleSpamResponse(ctx, chatId)) return;
  let text = `
Добро пожаловать в меню бота.
Ниже, описано, что делают кнопки меню 👇

1️⃣ — Правила, советую ознакомится!

2️⃣ — Видео библиотека с моими непубличными роликами и идеями.

3️⃣ — Для получения консультации и ПРЯМОГО общения со мной, нажми сюда

`

  await ctx.editMessageText(escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: menuboard
    }
  );
});


async function getVideoText(){
  let text = `
🎥 Вот список видео.
Подробнее о каждом ролике можно прочитать, кликнув на соответствующую кнопку ниже.
Здесь — краткая характеристика каждого выпуска 👇

1️⃣ — Мощное исследование: _7 часов анализа альткоинов, уложенные в 15 минут интенсивного контента_ 📊

2️⃣ — Технология успешного набора портфеля: какие ошибки совершают  все, и как их избежать 💼

3️⃣ — Как обычные хомяки становятся кормом для рынка, и _что делать_, чтобы не повторить их путь 🐹➡️🐳

4️⃣ - Что делать с щитками, чтобы вынять, хоть что-то, инвест тезис по мощной акции⚠️

5️⃣ - Популярно объясню КАК и ПОЧЕМУ, 99% участников рынка теряет деньги 💀

6️⃣ - Мощнейший DEFI - уровня AAVE с дикой недооценкой🏵️

7️⃣ - _ГАЙД ПО ИНВЕСТИРОВАНИЮ В КРИПТЕ — СТРАТЕГИЯ НА ДЕСЯТИЛЕТИЯ_ 🚀`
return text
}

bot.callbackQuery("vipCheck", async (ctx) =>{
      if(!ctx.from){
    return ctx.reply("User data not available")
  }
      let {id,username,first_name} = ctx.from;
    let chatId = id;
  if (await handleSpamResponse(ctx, chatId)) return;
  await ctx.answerCallbackQuery("Загрузка списка VIP-ов");
  const isVip = VIP.includes(chatId) || tempVIP.includes(chatId);
  let text;
  if(isVip){
     text =`Приветствую ${first_name} с твоим вип статусом всё в порядке!
   Ты УЖЕ получаешь скидки на свежий контент в будущем твои преимущества будут расширены.
   Спасибо за поддержку ❤️‍🔥` 
  } else {
     text = `Приветствую ${first_name} ты к сожалению НЕ VIP, следи за каналом и объявлениями там.
    Возможности получить VIP статус, всегда будут! `
  }
    await ctx.editMessageText(escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: boardBacktoMENU
    }
  );
})

bot.callbackQuery("videoboards", async (ctx) => {
    if(!ctx.from){
    return ctx.reply("User data not available")
  }
    let {id,username,first_name} = ctx.from;
    let chatId = id;
  if (await handleSpamResponse(ctx, chatId)) return;
  await ctx.answerCallbackQuery("Загрузка списка....");
  let text = await getVideoText();
  console.log("Befor",wallets.length)
  if (wallets.length ===0){
  await createWallets();
  }
  console.log("After",wallets.length)

  
  let data = getOrCreateUserState(chatId)
//


if (!data.wallet) {
  const userFromDB = await getUserData(chatId);

  if (userFromDB) {

    data.wallet = userFromDB;
  } else {
    const seq = await getNextSequence("id");
    const idx = (seq - 1) % Math.max(1, wallets.length);
    data.wallet = wallets[idx]?.address ?? WALLET.address;
   await registerUser(chatId,data.wallet,first_name||"Satoshi",username||"Nakamoto")
    console.log(data.wallet, idx);
  }
}


   
  
  await ctx.editMessageText(escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: videoboard
    }
  );
});



function buildVideoMessage(videos:VideoData, cost: number,addMes:string,chainConf:ChainConfig,wallet:string) {
  const text = 
    escapeMarkdownV2(videos.body) +
    "\n\n";

  const requisites =
    `Для покупки отправьте USDT 💵 в сети *${chainConf.name}*\n` +
    `К ОПЛАТЕ \\- \`${cost}\` USDT\n` +
    `На адрес \\- \`${wallet}\`\n\n`;

  const stars = 
    `🌟[За STARS купить тут](${videos.starsLink})`+"\n";

  return escapeMarkdownV2(addMes)+ text + requisites + stars;
}

function checkSpam(chatId: number): boolean {
  return oneClickOneMove.get(chatId) === true;
}

async function handleSpamResponse(ctx: any, chatId: number, message: string = "⛔ Не нужно уходить, всё работает!"): Promise<boolean> {
  if (checkSpam(chatId)) {
    await ctx.answerCallbackQuery({ text: message, show_alert: true });
    return true;
  }
  return false;
}


bot.callbackQuery(/^chain_(.+)$/, async (ctx) => {
  const chainKey = ctx.match[1] as Chain;

  if (!(chainKey in chainConfig)) {
    return ctx.answerCallbackQuery("Неизвестная сеть");
  }

  const chatId = ctx.chat!.id;
  const state = getOrCreateUserState(chatId);

  state.chain = chainKey;

  await ctx.answerCallbackQuery(
    `Установлен чейн ${chainConfig[chainKey].name}`
  );
});





bot.callbackQuery("chainSwith", async(ctx) => {
  let chatId= ctx.chat!.id;
  let data = getOrCreateUserState(chatId);
 let chain = chainConfig[data.chain ?? Chain.ARBITRUM]

  let text =`✅ Текущая сеть: **${chain.name}**

🔗 Контракт USDT: ${chain.tokenAddress}`;
  await ctx.answerCallbackQuery(`Меню чейнов`);
    await ctx.editMessageText(escapeMarkdownV2(text), {
    parse_mode: "MarkdownV2",
    reply_markup: chainBord
  });
})





bot.callbackQuery(/^video(\d+)$/, async (ctx) => {
  
  const id = Number(ctx.match[1]); 
  
  const video = videos[id];
  if (!video) {
    await ctx.answerCallbackQuery("Видео не найдено");
    return;
  }
  
  let chatId = ctx.chat!.id;
  await ctx.answerCallbackQuery(`Загрузка видео ${id}`);
  let mes:string="";
   
  let data = getOrCreateUserState(chatId);
    const saveCost = costs[video.costIndex];

    if (!costs ||video.costIndex === undefined||saveCost === undefined){
          await ctx.answerCallbackQuery("Цена не найдена");
    return;
    }
    
  let cost =  saveCost;
   let userWallet = data.wallet;
  if(!userWallet || userWallet===WALLET.address){
    const baseCost = await genCost(saveCost);
    cost = baseCost;
    userWallet = WALLET.address;
  }


  if (promoOn && id !=6) {

    cost = Number((cost - discount).toFixed(4));
        mes =`
🈹Работают СКИДКИ!

❌Старая цена = ${saveCost}
✔️Новая  цена = ${cost} 

`
  }
 
    let chain = chainConfig[data?.chain ?? Chain.ARBITRUM];

// DEV FUNCTION
    // if(OWNER == chatId){
    //   cost = Number((cost * 0.02).toFixed(4))
    // }

    //
    const isVip = VIP.includes(chatId) || tempVIP.includes(chatId);
  if (isVip && id ==7){
  mes =`Благодарю уважаемых VIPов🤝, ваша скидка составляет ${VIP_DISCOUNT}$. Спасибо за поддержку!`;
    
    cost = Number((saveCost - VIP_DISCOUNT).toFixed(4));

  }
  const text = buildVideoMessage(video!, cost,mes,chain,userWallet);
  data.cost = cost;
  data.videoUrl = [id.toString()];
  
  const inlineKeyboard = new InlineKeyboard()
    .text(`Оплачено`, `pay:`).row()
    .text("Назад к списку", "ToVideo");

  await ctx.editMessageText(text, {
    parse_mode: "MarkdownV2",
    reply_markup: inlineKeyboard
  });
});



function getOrCreateUserState(chatId: number): UserPayState {
  let state = userPayMap.get(chatId);
  if (!state) {
    state = getUserDefault();
    userPayMap.set(chatId, state);
  }
  return state;
}


async function registerUser(chatId: number, walletAddress: string, name: string, username?: string) {
  try {
    const newUser = await User.create({
      telegramId: chatId,
      wallet: walletAddress,
      firstName: name,
      username: username || 'н/д'
    });
    
    console.log("✅ Юзер сохранен в базу:", newUser._id);
    return newUser;
  } catch (error: any) {
    if (error.code === 11000) {
      console.error("❌ Ошибка: Такой Telegram ID или кошелек уже есть в базе!");
    } else {
      console.error("❌ Ошибка при создании юзера:", error.message);
    }
  }
}


async function getUserData(chatId: number) {
  try {
    const user = await User.findOne({ telegramId: chatId });
    if (!user) {
      console.log("Пользователь не найден в базе");
      return null;
    }

    console.log("Данные пользователя получены:", user.firstName);
    return user.wallet;
  } catch (error) {
    console.error("Ошибка при поиске пользователя:", error);
    throw error;
  }
}

function getUserDefault(): UserPayState {
  console.log("Работает")
  return {
    cost: 1000,
    videoUrl:[],
    chain: Chain.ARBITRUM,
    wallet:""
  };
}




bot.callbackQuery("videoAll", async (ctx)=>{
    let chatId = ctx.chat!.id; 
  if (await handleSpamResponse(ctx, chatId)) return;
 await ctx.answerCallbackQuery("Загрузка всех видео");

let cost = Math.ceil(sumCosts);
console.log(costs)
const sumCostsOld =   costs
    .filter(Number.isFinite)
    .reduce((sum, cost) => sum + cost, 0);
let niceText;
let {chain,wallet} = getOrCreateUserState(chatId);
let chainName = chainConfig[chain].name;
console.log(sumCostsOld)
let text =`Все ролики - за один клик, хорошеe решение. 
По отдельности цена составила бы ${sumCostsOld}$. 
А так это выгоднее на 20%.

`;
  const requvisits = `Для покупки отправьте USDT💵 в сети ${chainName}
К ОПЛАТЕ \\\- \`${cost}\` USDT
На адресс \\\- \`${wallet}\``;


 niceText = escapeMarkdownV2(text) + requvisits;
  let idVideo = 999;
  
  userPayMap.set(chatId,{cost,videoUrl:[idVideo.toString()],chain,wallet});
  const inlineVideo = new InlineKeyboard()  
  .text(`Оплачено - ${cost}`,`pay:`).row()
  .text(`Назад к списку`,"ToVideo").row()


  await ctx.editMessageText(niceText,
      {
        parse_mode: "MarkdownV2",
      reply_markup: inlineVideo,
    });
})

bot.callbackQuery("cons", async (ctx) => {
  await ctx.answerCallbackQuery("Загрузка");

const stars = `

👉[БОТ ДЛЯ КОНСУЛЬТАЦИЙ](https://t.me/DogeTraderAdvisorBot)`


  const text = `Крипта — это не только пампы и сливы.
Это структурная работа с активами, риском и временем.
Если хочешь понять, куда двигаться дальше и как выстроить свою стратегию — пиши специальному боту внизу.
Разберём портфель, определим точки входа, подскажу ошибки и дам ясный план действий.`
    ;

  let niceText: string;



    niceText = escapeMarkdownV2(text)  + stars;
  
  const inlineVideo = new InlineKeyboard()
    .text(`Назад к списку`, "back").row();
  
  await ctx.editMessageText(
    niceText,
    {
      parse_mode: "MarkdownV2",
      reply_markup: inlineVideo,
    }
  );
});

bot.callbackQuery("back", async (ctx) => {
  let chatId = ctx.chat!.id; 
  if (await handleSpamResponse(ctx, chatId)) return;
  await ctx.answerCallbackQuery("Возврашаемся назад");
  let text = await getStartMess();
  await ctx.editMessageText(
   escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: menuboard
    }
  );
});

bot.callbackQuery("backToChains", async (ctx) => {
  let chatId = ctx.chat!.id; 
  if (await handleSpamResponse(ctx, chatId)) return;
    let data = getOrCreateUserState(chatId);
 let chain = chainConfig[data.chain ?? Chain.ARBITRUM];
  await ctx.answerCallbackQuery("Возврашаемся назад");
    let text =`✅ Текущая сеть: **${chain.name}**

🔗 Контракт USDT: ${chain.tokenAddress}`;
  await ctx.editMessageText(
   escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: chainBord
    }
  );
});

bot.callbackQuery("ToVideo", async (ctx) => {
  let chatId= ctx.chat?.id;
     if (await handleSpamResponse(ctx, chatId!, "⛔ Не нужно уходить, дождитесь конца проверки!")) return;

  await ctx.answerCallbackQuery("Возврашаемся назад");
  let text =await getVideoText();
  await ctx.editMessageText(
   escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: videoboard
    }
  );
});


const boardBacktoMENU = new InlineKeyboard().text("Назад","back");
bot.callbackQuery("rules", async (ctx)=>{
  ctx.answerCallbackQuery("Загружаю правила");

  let text = `🎥 Здарова, криптовалютчик\!  
Бот для доступа к эксклюзивному контенту на связи 👋💎  

Перед использованием бота прочитай *простые правила* ⬇️

1️⃣ - Нажимай **«Оплачено»** только после отправки USDT 💸  
2️⃣ - Оплачивай **точную сумму**, которую просит бот (со всеми копейками) ✔️  
3️⃣ - Во время проверки платежа **не выходи в меню** — просто жди, бот ответит автоматически ⏳🤖
`
  await ctx.editMessageText(
   escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: boardBacktoMENU
    }
  );
});


bot.callbackQuery("token", async (ctx) => {
    ctx.answerCallbackQuery("Загружаю список токенов");
const board = new InlineKeyboard().text("Назад","backToChains");
  let chainList = allChainNames
  .map(id =>{
    let chain = chainConfig[id];
    if (chain){
      return ` \\- **${chain?.name}**\\: \n \`${chain?.tokenAddress}\``;
    }
    return null;
  })
  .filter(item=>item !== null)
  .join("\n")
  let mes=`Для оплаты бот использует USDT\\.

  Адрес контракта \— это уникальный идентификатор монеты в блокчейне\\, который позволяет подтвердить\\, что выводимый токен совпадает с выбранным вами токеном\\.
  
  Бот принимает оплату только официальными токенами с указаных ниже смарт\\-контрактов\\:
  ${chainList}` 
  await ctx.editMessageText(
    (mes),
    {
      parse_mode: "MarkdownV2",
      reply_markup: board
    }
  );
});


bot.on("callback_query:data", async (ctx) =>{
  ctx.answerCallbackQuery("Проверяем платёж");
  let chatId = ctx.chat!.id;
  let n:string;
  if (oneClickOneMove.has(chatId)){
    console.log("АНТИСПАМ");
    console.log(userPayMap.get(chatId)?.cost)
   return await handleSpamResponse(ctx,chatId);
   
  } 
    //normal logic
console.log("normal logic");
    const callback = ctx.callbackQuery.data
    if (callback.startsWith("pay:")) {

      const data = userPayMap.get(chatId);
if (!data) {
    console.log(`Error: data is undefined for user ${chatId}`);
    return await ctx.reply("❌ Сессия оплаты истекла или была прервана.\nВаш платеж никуда НЕ пропал!\n Пожалуйста, создайте заказ заново через /start выберите тот же ролик и нажмите оплачено.");
  }
    let urls:string[]|undefined =[...data?.videoUrl];
      
      
      console.log(oneClickOneMove.get(chatId))
      console.log("DEBUG data:", data);
      console.log("DEBUG urls:", urls, typeof urls);


    if (urls === undefined || urls.length === 0 || urls[0] === undefined) {
    return console.log("Error in urls: array is undefined or empty.");
}
    if (urls[0] == "999") {
       urls = Allurl
    } else {
     n = urls[0];
     const index = Number(n);
     const newUrl: string | undefined = urlArr[index]; 

if (newUrl === undefined) {
    return console.log("Error: Selected video URL is not defined in environment variables.");
}
    urls[0] = newUrl;
    }
    oneClickOneMove.set(chatId,true);    
// ♻️ Очистка старых таймеров
  userIntervals.get(chatId) && clearInterval(userIntervals.get(chatId)!);
  userTimeouts.get(chatId) && clearTimeout(userTimeouts.get(chatId)!);

    console.log("♻️ Старый интервал очищен");

    let cost = data?.cost;
    let chain = data?.chain;


    console.log(`💰 Оплата: ${cost}, 🎥 URL: ${urls}`);
  let  intervalId = setInterval(async () => {
  try {
   let done = await checkTrans(cost,urls,chatId,n,chain,data?.wallet);
   if (done) {
     cleanupUserState(chatId);
        console.log("✔️ УСПЕШНО. Мониторинг остановлен.");
   }
  } catch (err) {
    console.error("⚠️ Ошибка внутри checkTrans:", err);
  }
}, 10 * 1000);
userIntervals.set(chatId, intervalId);


 let timeoutId = setTimeout(async () => {
  if (!oneClickOneMove.has(chatId)) return;
  const message = "⏹❌ Время оплаты вышло.\nПопробуйте снова нажать Оплачено!\nВозникли неполадки? Пишите сюда — @Legemetonus";

  try {
    await bot.api.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log('✅ Сообщение об окончании отправлено.');
  } catch (err) {
    console.error('❌ Ошибка при отправке сообщения:', err);
  }
  cleanupUserState(chatId,cost,data?.videoUrl);
  console.log('⏹ Мониторинг остановлен timeout.');
}, 4 * 60 * 1000);
userTimeouts.set(chatId, timeoutId);
  console.log(oneClickOneMove.get(chatId))
await ctx.answerCallbackQuery({
  text: "💸 Бот уже ищет ваш платёж в блокчейне.\n\n⏳ Подтверждение может занять пару минут.",
  show_alert: false,
});
}} );

async function genCost(rawcost:number) {
  let n = 4;
  let factor = 10 ** n;
  let costB: number= rawcost + Math.random() / 10;
  let cost = Math.trunc(costB * factor) / factor;  
  return cost
}



async function checkTrans(cost: number, urlVs: string[],chatId:number,n:string,chain:Chain,wallet:string) {
 let chainData = chainConfig[chain];


const controller = new AbortController();
let url = createPayUrl(chainData.chainId.toString(), chainData.tokenAddress,chain,wallet).trim();
console.log("URL=", url)
const timeout = setTimeout(() => controller.abort(), 6000);
try {
    const response = await fetch(url, {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  },
  signal: controller.signal
});

      let data: any;
console.log("📊 Статус ответа:", response.status, response.statusText);
    try {
      data = await response.json();
    } catch (parseErr) {
      const text = await response.text();
      console.error("❌ Ответ от API не JSON. Текст ответа:", text.slice(0, 400));
      return;
    }




  let time = Math.floor(Date.now()/ 1000)

      if (data.status === '1') {
      const tx:TokenTx = data.result[0];
      console.log( tx+ "ОТПРАВКА-"+ tx.from+ "ЦЕНА-"+ tx.value+"TIME -"+ tx.timeStamp);
      let decimals =10 ** (tx.tokenDecimal);
      if (tx.hash !== lastTxHash && tx.from.toLowerCase() !== wallet.toLowerCase() && (tx.value) >= (cost) * decimals && 
        time - tx.timeStamp <= timeGap)
       { 
        lastTxHash = tx.hash;
                const links = urlVs
          .map((u, i) => `${i + 1}) ${u}`)
          .join("\n");
       let amount =   Number(tx.value) / 1e6
        const message = `
✅ *УСПЕШНАЯ транзакция!*

ВАШ РОЛИК, ПРИЯТНОГО ПРОСМОТРА 🔥
${links}

Hash: [${tx.hash}](${chainData.explorerTx}${tx.hash})
От: ${tx.from}
Кому: ${tx.to}
Сумма: ${amount} ${tx.tokenSymbol}
Время: ${tx.timeStamp};
        `;
            const newBuyer = new buyer({chatId,
      video: n,
      counter: await buyer.countDocuments(),
      chain:chainData.name,
      address:wallet,
      txHash:tx.hash,
  amount,withdrawn:false
    });
    await newBuyer.save();
    
        await bot.api.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        await bot.api.sendMessage(OWNER, message, { parse_mode: 'Markdown' });
        console.log('✅ Отправлено в Telegram');
        return true;
      }
    }


} catch (e: any) {
  if (e.name === 'AbortError') {
    console.log("⚠️ Запрос отменен по тайм-ауту (6 секунд вышли)");
  } else {
    console.error("❌ Ошибка запроса:", e.message);
  }
}
finally {console.log("Fetch killed");
   clearTimeout(timeout);}
return false }



bot.command("getUSDT",async(ctx)=>{
      if (!onlyOwner(ctx.from!.id)){
      console.log("only owner!")
    return
  }
  grabFromWallets();
})

bot.command("turnOnPromo",async(ctx)=>{
    if (!onlyOwner(ctx.from!.id)){
      console.log("only owner!")
    return
  }
  const parts = ctx.message!.text.split(" ");
  const discountPart = Number(parts[1]);
  discount = discountPart;
  promoOn = true;
    await ctx.reply(
    `Промо режим активен скидка составляет \`${discount}\` `,
    {
      parse_mode: "MarkdownV2",
      
    }
  );
})

bot.command("turnOFFPromo",async(ctx)=>{
    if (!onlyOwner(ctx.from!.id)){
    return
  }
  discount = 0;
  promoOn = false;
    await ctx.reply(
    `Промо режим выключен скидка равна \`${discount}\` `,
    {
      parse_mode: "MarkdownV2",
      
    }
  );
})

bot.command("buyersList", async (ctx) => {  //hidden command for get buyers list  
  if (!onlyOwner(ctx.from!.id)){
    return
  }
  await ctx.reply (
  JSON.stringify(buyers, null, 2)
);
});


bot.command("sendData", async (ctx) => {
  if (!onlyOwner(ctx.from!.id)){
    return
  }
  try {
    const buyersFromDb = await buyer.find().lean();
    const jsonString = JSON.stringify(buyersFromDb, null, 2);
    const buffer = Buffer.from(jsonString, 'utf8');

    await ctx.replyWithDocument(new InputFile(buffer, "buyersData.json"), {
      caption: `📊 Актуальная копия базы данных.\nЧисло покупателей = ${buyersFromDb.length}`,
    });
  } catch (error) {
    console.error("Ошибка при получении/отправке данных из Mongo:", error);
    await ctx.reply("Не удалось получить данные из базы данных.");
  }
});





bot.catch((err)=>{
    const ctx = err.ctx;
    console.error(`Error while update ${ctx.update.update_id}`);
    const e = err.error;
    if (e instanceof GrammyError){console.error
        (`Error in request: ${e.description}`);}
        else if (e instanceof HttpError){console.error
            ("Error in network TG",e);
         } else {console.error("Unknown error", e);
         }
})



async function sendError(id:number,){
  const mes = "Произошла ФАТАЛЬНАЯ ОШИБКА ❌";
  console.log()
  try{
  await bot.api.sendMessage(id,mes)
  } catch (error) {
console.error("Ошибка при отправке cообщения об ошибке:", error);
  }
}
const ManualID=[2040246430,7469672024,460922550];


bot.command("startSpam", async (ctx) => {
  if (!onlyOwner(ctx.from!.id)){
    return
  }
  try {
   let data =await getUserIds()
   if(!data){
    await ctx.reply("Данных юзеров НЕТ");
    return 
   }
    spamPromo(data)
    await ctx.reply("Пошёл спам");
  } catch (error) {
    console.error("Ошибка при cпаме", error);
    await ctx.reply("Ошибка при cпаме");
  }
});



 async function spamPromo(userData:userPromoData []) {

    
    for(const user of userData.filter(user => user !== undefined && user !== null)){
          const mes =`🔥 Специальное предложение — только на 48 часов

Я открыл временный VIP-доступ на **2 дня**, чтобы ты - ${user.firstName} мог получить максимум пользы и посмотреть весь закрытый контент без ограничений 👑

Плюс — действует **персональная скидка на мой последний гайд** 💸
Это финальная версия с самыми актуальными стратегиями, схемами и DEFI, которые я сам использую.

⏳ После окончания 48 часов VIP закроется, а скидка исчезнет.

Если давно думал взять — сейчас лучший момент 👇
👉 Гайд со скидкой и VIP доступ УЖЕ В БОТЕ!

Не откладывай — предложение временное ⚡
`
    await bot.api.sendMessage(user.tgId,mes)
    }
    tempVIP.push(...userData.map(a => a.tgId));
    const intervalVIP = setInterval(() => {
  if (Date.now() >= endTime) {
    clearInterval(intervalVIP)
    tempVIP.length =0;
    console.log("Время вышло");
  }
},30 * 60 * 1000)
}

const endTime = Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000






bot.command("clearTempVIP", async (ctx) => {
  if (!onlyOwner(ctx.from!.id)){
    return
  }
  try {
    if(tempVIP.length !=0){
    tempVIP.length =0;
    await ctx.reply("Данные юзеров стерты");
    return 
   }

    await ctx.reply(`Данные юзеров УЖЕ стерты, ${tempVIP.length}`);
  } catch (error) {
    console.error("Ошибка при удаление временных випов", error);
    await ctx.reply("Ошибка при удаление временных випов");
  }
});






const app = express();
const port = process.env.PORT || 3000;


function onlyOwner(id: number): boolean {
  return id === OWNER;
}



app.get('/', (req, res) => {
  res.status(200).send('Bot & DB are Alive! 🚀');
});

async function bootstrap() {
  
  await initDatabase();

  
  app.listen(port, () => {
    console.log(`🌍 Express: Слушает порт ${port}`);
  });

  
  bot.start({
    onStart: () => console.log('🤖 Bot: Запущен через long polling')
  });
}

bootstrap().catch(console.dir);

// let data =await getUserIds();

// let actualData = data!.filter(item =>
//   !VIP.includes(item.tgId)
// )


// from ts to js
//npm install
//npx tsc
//ls dist


//for deploy
//npm install npm run build
//node dist/botMultiVideo.js


// прем покупатели 7600112142,5566365178
//"start": "nodemon --ignore '*.json' src/botMultiVideo.ts"