import dotenv from 'dotenv';
dotenv.config();
import { User } from './modeles/user.js';
import { VIP } from './botMultiVideo.js';
const ManualID=[];

export async function getUserIds() {
    try {
        const data = await User.find({}).lean();

            const goodData =  data.map(i =>({
              id: i._id,
              tgId: i.telegramId,
              firstName: i.firstName
            }))
            console.log(goodData);
            return goodData;
    } catch (error) {
      console.error(  "Ошибка при получении покупателей:", error)
    }
}

// export async function spamPromo(tgId:number[]) {

//     VIP.push(...tgId);
// }
