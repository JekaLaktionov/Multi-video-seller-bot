export {};
import fetch from 'node-fetch';
import {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard,Context  } from 'grammy';
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import {hydrate  } from "@grammyjs/hydrate"
import { error } from 'console';



type VideoData = {

  body: string;
  starsLink: string;
  costIndex: number;
};


const videos: Record<number, VideoData> = {
  1: {
    body: `\"Как ЗАРАБОТАТЬ НА ТРЕЙДИНГЕ?\"\n\n` +
    `\"Почему там 97\% теряет ВСЁ\"\n\n` +
    `\"Рабочие \"Стратегии\" в трейдинге\"\n\n` +
    'Вот видос с ТИТАНОВОЙ базой по трейдингу 🦾, такое нельзя выкладывать в открытый доступ.\n'
    ,
    starsLink: 'https://t.me/d0getrader/1112',
    costIndex: 1,
  },
  2: {
    body: `*"100 МИЛЛИОНОВ ОТ COINBASE"* 💰🔥

*"Разобрано 2 ИИ проекта с ОГРОМНЫМ ПОТЕНЦИАЛОМ"* 🤖🚀

*"Ваш любимый HIGH RISK сегмент"* ⚡🎲

Видео представляет собой _детальный разбор_ и _инвест-тезис_ по двум ИИ проектам,  
а также **общие мысли по всему нарративу** 🤝📈  

Готовься: будет _анализ_, _аргументы_ и _честный взгляд на риски_ 💡⚠️`,
    starsLink: 'https://t.me/d0getrader/1134',
    costIndex: 2,
  },
  3: {
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
    costIndex:3
  },
  4: {
    body: `*"99% крипанов совершают ЭТУ ОШИБКУ"* ❗🔥

*"Моя ТЕХНОЛОГИЯ выбора и набора КРИПТО АКТИВОВ"* ⚙️💎

*"Активы для УСТОЙЧИВОГО РОСТА капитала"* 📈🌱

Сделал ролик по _наболевшей теме_ 🎥  
Разобрал одну **ГЛАВНУЮ ошибку** всех криптовалютчиков при работе с портфелем ⚠️  

Показал два примера:  
- _ПЛОХОГО_  портфеля ❌  
- _ХОРОШЕГО_  портфеля ✅  

И дал **чёткую технологию**, как собирать _ХОРОШИЙ \(прибыльный\)_ портфель шаг за шагом 💼✨`,
    starsLink:'https://t.me/d0getrader/1231',
    costIndex:4,
  },
    5: {
    body: `_КТО И НА ЧЁМ ( НА КОМ ) ЗАРАБАТЫВАЕТ В КРИПТЕ_ ?  🐋🍆🐹

_ПОЧЕМУ БУДУЧИ РИТЕЙЛОМ, ТЫ ОБРЕЧЁН ТЕРЯТЬ_?

_ПРАКТИЧЕСКИЕ СОВЕТЫ: КАК ПЕРЕЛОМИТЬ СИТУАЦИЮ_.

Сделал ролик на интересную тему. Изучил, на чём и как зарабатывают сильные мира сего в криптовалютах.
 Казалось бы, ответ очевиден на хомяках, но всё не так просто. 

По результатам исследования, сделал выводы, что конкретно нужно делать рядовому хомяку,
 чтобы значительно увеличить свои шансы на получение прибыли.`,
    starsLink:'https://t.me/d0getrader/1362',
    costIndex:5,
},
    6: {
    body: `_ПРОДАЮ ВСЮ АЛЬТУ_ !  😈

_ПОЧЕМУ ЦЕНЫ НА ЩИТКИ БУДУТ ИДТИ ТОЛЬКО ВНИЗ_?

_ЛУЧШАЯ ИНВЕСТИЦИЯ В КРИПТУ в ДАННЫЙ МОМЕНТ_.

Сделал ролик на тяжелую тему. Проговорил, что делаю сейчас с щитками и другой лоу кап-альтой.
Считаю, что холдить ИХ сейчас ОПАСНО, перелился в менее рисковый класс активов.Видос решил сделать, премиум, чтобы не сеять панику.`,
    starsLink:'https://t.me/d0getrader/1473',
    costIndex:6,
},
    7: {
    body: `.`,
    starsLink:'',
    costIndex:7,
},    8: {
    body: `.`,
    starsLink:'',
    costIndex:8,},
      9: {
    body: `.`,
    starsLink:'',
    costIndex:9,
  }}


const VIP:number[] = [7600112142,5566365178];
const VIP_DISCOUNT = 2;



const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'; //token
const CHAIN = '42161';
const WALLET = process.env.MY_WALLET!;
const url = `https://api.etherscan.io/v2/api?apikey=${ETHERSCAN_API_KEY}&chainid=${CHAIN}&module=account&action=tokentx&contractaddress=${ADDRESS}&address=${WALLET}&startblock=0&endblock=9999999999&page=1&offset=1&sort=desc`;
const options = {method: 'GET', body: null};

let promoOn = false; //promotion swith
let discount=0;

const bot = new Bot(process.env.TELEGRAM_TOKEN!);


bot.use(hydrate()as any);



// costs
const costs = Array.from({ length: 10 }, (_, i) =>
  Number(process.env[`PRICE${i}`])
);


const urlArr = Array.from({ length: 10 }, (_, i) =>
  (process.env[`SELLIG_VIDEO${i}`])
);


const sumCosts = (costs[1]! + costs[2]! + costs[3]! + costs[4]! + costs[5]! + costs[6]! )*0.80;
  let Allurl=[
    process.env.SELLIG_VIDEO1!,
    process.env.SELLIG_VIDEO2!,
    process.env.SELLIG_VIDEO3!,
    process.env.SELLIG_VIDEO4!,
    process.env.SELLIG_VIDEO5!,
    process.env.SELLIG_VIDEO6!
  ];





//@user id -> timer
const userIntervals = new Map<number, NodeJS.Timeout>();
const userTimeouts = new Map<number, NodeJS.Timeout>();
let oneClickOneMove= new Map<number, boolean>;

let  antiSpam = new Map<number,number>(); // for detecting spamers


interface TokenTx {
  hash: string;
  from: string;
  to: string;
  value: number;
  tokenSymbol: string;
  timeStamp: number;
}

let lastTxHash:string;

type buyer = {
  chatId:number;
  video:number;
  counter:number;
}

let buyers:buyer []= [];
let buyerCounter:number =0;

const timeGap:number= 400;

bot.api.setMyCommands([
    {
      command: "token", description: "Смарт контракт токена для оплаты" 
  },
  {
    command: "start", description: "Запуск бота" 
  },
  {
      command: "token", description: "Смарт контракт токена для оплаты (ЧЕМ ПЛАТИТЬ)" 
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

bot.command("start", async (ctx) => {
  let text =await getStartMess();
  await ctx.reply(
   escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: menuboard
    }
  );
});




function escapeMarkdownV2(text: string) {
  return text.replace(/([\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}


  const menuboard = new InlineKeyboard()
  .text(`Правила использования бота`,"rules").row()
  .text("Закрытая видеобиблиотека", "videoboards").row()
  .text(`Консультации по криптовалюте`,"cons").row();

  const videoboard = new InlineKeyboard()
  .text(`Видео 1 - ${costs[1]}$`,"video1").row()
  .text(`Видео 2 - ${costs[2]}$`,"video2").row()
  .text(`Видео 3 - ${costs[3]}$`,"video3").row()
  .text(`Видео 4 - ${costs[4]}$`,"video4").row()
  .text(`Видео 5 - ${costs[5]}$`,"video5").row()
  .text(`Видео 6 - ${costs[6]}$`,"video6").row()
  .text(`Все видео в один клик - ${sumCosts}$`,"videoAll").row()
  .text("Назад","back").row();



bot.callbackQuery("menu", async (ctx) => {
  await ctx.answerCallbackQuery("Загрузка списка....");
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

1️⃣ — Разобрал _трейдинг от А до Я_ и объяснил, почему он не работает у 99% трейдеров ⚠️📉

2️⃣ — Мой инвест-тезис по *двум перспективным альтам* 🚀

3️⃣ — Мощное исследование: _7 часов анализа альткоинов, уложенные в 15 минут интенсивного контента_ 📊

4️⃣ — Технология успешного набора портфеля: какие ошибки совершают  все, и как их избежать 💼

5️⃣ — Как обычные хомяки становятся кормом для рынка, и _что делать_, чтобы не повторить их путь 🐹➡️🐳

6️⃣ - Что делать с щитками, чтобы вынять, хоть что-то, инвест тезис по мощной акции⚠️`
return text
}


bot.callbackQuery("videoboards", async (ctx) => {
  await ctx.answerCallbackQuery("Загрузка списка....");
  let text = await getVideoText();
  await ctx.editMessageText(escapeMarkdownV2(text),
    {
      parse_mode: "MarkdownV2",
      reply_markup: videoboard
    }
  );
});



function buildVideoMessage(videos:VideoData, cost: number,vipMes:string) {
  const text = 
    escapeMarkdownV2(videos.body) +
    "\n\n";

  const requisites =
    `Для покупки отправьте USDT 💵 в сети ARBITRUM\n` +
    `К ОПЛАТЕ \\- \`${cost}\` USDT\n` +
    `На адрес \\- \`${WALLET}\`\n\n`;

  const stars = 
    `🌟[За STARS купить тут](${videos.starsLink})`+"\n";

  return text + requisites + stars + escapeMarkdownV2(vipMes);
}





bot.callbackQuery(/^video(\d+)$/, async (ctx) => {
  const id = Number(ctx.match[1]); 
  const video = videos[id];

  if (!video) {
    await ctx.answerCallbackQuery("Видео не найдено");
    return;
  }
  
  await ctx.answerCallbackQuery(`Загрузка видео ${id}`);
  let mes:string="";
  const baseCost = await genCost(costs[video!.costIndex]!);
  let cost =  baseCost;
  if (promoOn) {
    cost = Number((cost - discount).toFixed(4));
  }
  let chatId = ctx.chat!.id;
  if (VIP.includes(chatId)){
  mes =`Благодарю уважаемых VIPов🤝, ваша скидка составляет ${VIP_DISCOUNT}$. Спасибо за поддержку!`;
    
    cost = Number((baseCost - VIP_DISCOUNT).toFixed(4));

  }
  const text = buildVideoMessage(video!, cost,mes);

  const inlineKeyboard = new InlineKeyboard()
    .text(`Оплачено`, `pay:${cost},${id}`).row()
    .text("Назад к списку", "ToVideo");

  await ctx.editMessageText(text, {
    parse_mode: "MarkdownV2",
    reply_markup: inlineKeyboard
  });
});



bot.callbackQuery("videoAll", async (ctx)=>{
  ctx.answerCallbackQuery("Загрузка всех видео");
let cost =await genCost(sumCosts);

const sumCostsOld = (costs[1]! + costs[2]! + costs[3]! + costs[4]! + costs[5]! + costs[6]! )
let niceText;
let text =`Все ролики - за один клик, хорошеe решение. 
По отдельности цена составила бы ${sumCostsOld}$. 
А так это выгоднее на 20%.

`;
  const requvisits = `Для покупки отправьте USDT💵 в сети ARBITRUM
К ОПЛАТЕ \\\- \`${cost}\` USDT
На адресс \\\- \`${WALLET}\``;


 niceText = escapeMarkdownV2(text) + requvisits;
   

  const inlineVideo = new InlineKeyboard()  
  .text(`Оплачено - ${cost}`,`pay:${cost},999`).row()
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



bot.callbackQuery("ToVideo", async (ctx) => {
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



bot.callbackQuery("rules", async (ctx)=>{
  ctx.answerCallbackQuery("Загружаю правила");
const board = new InlineKeyboard().text("Назад","back");
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
      reply_markup: board
    }
  );
});


bot.command("token", async (ctx) => {

  await ctx.reply(
    `  Сеть ARBITRUM USDT \$ \n\n Смарт контракт токена\, который принимает бот   \`${ADDRESS}\` \n\n СЮДА НЕ ПЛАТИТЬ`,
    {
      parse_mode: "MarkdownV2"
    }
  );
});


bot.on("callback_query:data", async (ctx) =>{
  let chatId = ctx.chat!.id;
  let n:number;
  if (oneClickOneMove.get(chatId) == true){
    console.log("АНТИСПАМ");
   return await ctx.reply ("⛔ Не нужно спамить, всё работает!");
   
  } 
    //normal logic

    const callback = ctx.callbackQuery.data
    if (callback.startsWith("pay:")) {
 const oldInt = userIntervals.get(chatId);
if (oldInt) clearInterval(oldInt);

const oldTimeout = userTimeouts.get(chatId);
if (oldTimeout) clearTimeout(oldTimeout);
    console.log("♻️ Старый интервал очищен");

      oneClickOneMove.set(chatId,true);
    const payload = callback.replace("pay:", "");
    let parts = payload.split(",");
    let costStr = parts.shift();
    let urls:string[] = [];;
    if (parts[0] == "999") {
       urls = Allurl
    } else {
     n = Number(parts[0])
     if (urlArr[n] == undefined) {throw new Error("Error in n - URL")}
     urls[0] = urlArr[n]!;}
    let cost = parseFloat(costStr!);

    
    console.log(`💰 Оплата: ${cost}, 🎥 URL: ${urls}`);
  let  intervalId = setInterval(async () => {
  try {
   let done = await checkTrans(cost,urls,chatId,n);
   if (done) {
     clearInterval(intervalId);
        userIntervals.delete(chatId);

        const timeoutId = userTimeouts.get(chatId);
        if (timeoutId) clearTimeout(timeoutId);

        userTimeouts.delete(chatId);
        oneClickOneMove.delete(chatId)
        console.log("✔️ УСПЕШНО. Мониторинг остановлен.");
   }
  } catch (err) {
    console.error("⚠️ Ошибка внутри checkTrans:", err);
  }
}, 10 * 1000);
userIntervals.set(chatId, intervalId);


 let timeoutId = setTimeout(async () => {
  if (!oneClickOneMove.has(chatId)) return;
  const message = "⏹❌ Время оплаты вышло.\nПерезапустите бота и попробуйте снова!\nВозникли неполадки? Пишите сюда — @Legemetonus";

  try {
    await bot.api.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log('✅ Сообщение об окончании отправлено.');
  } catch (err) {
    console.error('❌ Ошибка при отправке сообщения:', err);
  }
  clearInterval(intervalId);
  userIntervals.delete(chatId);
  userTimeouts.delete(chatId);
  oneClickOneMove.delete(chatId);
  console.log('⏹ Мониторинг остановлен timeout.');
}, 4 * 60 * 1000);
userTimeouts.set(chatId, timeoutId);
  console.log(oneClickOneMove.get(chatId))
  await ctx.reply(
    "💸 После оплаты **отправьте одним сообщением** ваш `tx.hash`.\n\n⏳ *Подтверждение может занять пару минут.*",
  { parse_mode: "Markdown" })
}} );

async function genCost(rawcost:number) {
  let n = 4;
  let factor = 10 ** n;
  let costB: number= rawcost + Math.random() / 10;
  let cost = Math.trunc(costB * factor) / factor;  
  return cost
}

async function checkTrans(cost: number, urlVs: string[],chatId:number,n:number) {

try {
  const response = await fetch(url, options);
      let data: any;
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
      console.log( tx, "ОТПРАВКА-", tx.from, "ЦЕНА-", tx.value,"TIME -", tx.timeStamp);
      console.log( lastTxHash);
      if (tx.hash !== lastTxHash && tx.from.toLowerCase() !== WALLET.toLowerCase() && Number(tx.value) / 1e6 >= cost && 
        time - tx.timeStamp <= timeGap)
       { 
        lastTxHash = tx.hash;
                const links = urlVs
          .map((u, i) => `${i + 1}) ${u}`)
          .join("\n");
        const message = `
✅ *УСПЕШНАЯ транзакция!*

ВАШ РОЛИК, ПРИЯТНОГО ПРОСМОТРА 🔥
${links}

Hash: [${tx.hash}](https://arbiscan.io/tx/${tx.hash})
От: ${tx.from}
Кому: ${tx.to}
Сумма: ${Number(tx.value) / 1e6} ${tx.tokenSymbol}
Время: ${tx.timeStamp};
        `;
        buyerCounter++;
  buyers.push({
  chatId,
  video: n,
  counter: buyerCounter
});

        await bot.api.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        console.log('✅ Отправлено в Telegram');
        return true;
      }
    }


} catch (error) {
  console.error(error);
  
}return false }


bot.command("debanUeban", async (ctx) => {  //hidden command for unban user by ID
    const parts = ctx.message!.text.split(" ");
  const targetId = Number(parts[1]);
  antiSpam.set(targetId, 0);
  await ctx.reply(
    `Юзер ➖ \`${targetId}\` разбанен `,
    {
      parse_mode: "MarkdownV2",
      
    }
  );
});


bot.command("turnOnPromo",async(ctx)=>{
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
    
  await ctx.reply (
  JSON.stringify(buyers, null, 2)
);
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






const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot is running"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




bot.start({
  onStart: () => console.log('Bot started with long polling')
});

// from ts to js
//npm install
//npx tsc
//ls dist


//for deploy
//npm install npm run build
//node dist/botMultiVideo.js


// прем покупатели 7600112142,5566365178