const { Bot,InlineKeyboard } = require ("grammy");
const { run } = require ("@grammyjs/runner");
const fs = require ("fs");

const bot = new Bot("5505867492:AAGYzTpJVUpFHu3W8OhPFGuq9K6G2_7ug8U");

// Function Request To Api
async function tiktok(url){
  response = await fetch(`https://dl1.tikmate.cc/listFormats?url=${url}&update=1`,{
    method: "GET",
    headers: {"origin":"https://tikmate.cc","referer":"https://tikmate.cc/","user-agent":"Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"}
  });
  data = await response.json();
  return data;
}

bot.command("start",async (m) => {
  const keybaord = new InlineKeyboard().url("◜ꪜꫀꪀ᥆ꪑ◞","https://t.me/e_e_9_9")
  await m.reply(`*Welcome to this bot. You can download videos from Tik Tok. Just send a video link from Tik Tok and I will download it immediately. *`,{parse_mode: "Markdown",reply_markup: keybaord})
})

bot.on("message::url",async (m) => {
  if (m.message.text.split(" ").length == 1){
    request = await tiktok(m.message.text)
    if (request.error == false){
      const keyboard = new InlineKeyboard()
  .url("Dev Venom", "https://t.me/e_e_9_9").row().text("audio","Audio");
      await m.replyWithVideo(request.formats.video[0].url,{reply_markup: keyboard});
      let id = m.message.from.id;
      let urlAudio = request.formats.audio[1].url
      await fs.writeFile(`audio${id}.txt`,urlAudio,function (err) {
        if (err) throw err;
        console.log(true);});
    }else {
      await m.reply("Error Link")
    }
  }else{
    return false
  }
  
});


bot.callbackQuery("Audio",async (call) => {
  id = call.update.callback_query.from.id
  await fs.readFile(`audio${id}.txt`, async (err,data) => {
    if (err) throw err;
    await bot.api.deleteMessage(call.update.callback_query.message.chat.id,call.update.callback_query.message.message_id)
    await bot.api.sendAudio(id,data.toString("utf-8"))
  });
})


run(bot);