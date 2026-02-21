import mongoose from 'mongoose';
import 'dotenv/config'; // Одной этой строки достаточно для загрузки .env

const uri = process.env.MONGO;

if (!uri) {
  console.error("❌ MongoDB: Переменная MONGO не задана в .env файле.");
  process.exit(1);
}

/**
 * Инициализация подключения к MongoDB через Mongoose
 */
export async function initDatabase() {
  try {
    // В Mongoose 6+ опции useNewUrlParser и useUnifiedTopology включены по умолчанию
    await mongoose.connect(uri!, {
      serverApi: {
        version: '1', // ServerApiVersion.v1
        strict: true,
        deprecationErrors: true,
      },
      dbName: "video_seller_db" // Сразу указываем название базы данных
    });

    const connection = mongoose.connection;

    connection.on('error', (err) => {
      console.error('❌ MongoDB: Ошибка во время работы:', err);
    });

    console.log("✅ MongoDB (Mongoose): Соединение установлено.");
  } catch (error) {
    console.error("❌ MongoDB: Не удалось подключиться при старте:", error);
    process.exit(1);
  }
}


