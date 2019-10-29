const Telegraf = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent');
require('dotenv').config();

let TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(TOKEN, {
    telegram: {               
        agent: new HttpsProxyAgent(process.env.HTTPS_PROXY_AGENT),
        webhookReply: true  
    }
})

/*     bot.use((ctx, next) => {
        const start = new Date()
        return next().then(() => {
            const ms = new Date() - start
            console.log('Задержка %sms', ms)
            if (ctx.message) {
                console.log(ctx.message)
            }
        })
    }) */

bot.hears(/дей|Тарга|дракон|Кхалиси|Сноу/i, ctx => ctx.reply(Deineris(ctx.message.text)))

bot.on('text', (ctx, next) => {
    if (EnglishCheck(ctx.message.text)){
        //console.log('found english!')
        return next();
    }
     if (Math.random() > 0.05) {
        return next()
    }
    //console.log('Рандом! От: ' + ctx.message.from.username + ', Текст: ' + ctx.message.text);
 
    let mock = Deineris(ctx.message.text);
    if (mock != ctx.message.text) {
        ctx.reply(mock);
    }
    return Promise.all([
        next()
    ])

})

function EnglishCheck(string){
    const reg = RegExp('[a-zA-Z]');
    return reg.test(string)
}

function Deineris(string) {
    let sep_string = string.split('');
    let syllables = 'аАеЕёЁиИйЙоОуУъыьэЭюЮяЯ';
    let arrr = 'Яя';
    for (let i = 0; i < sep_string.length; i++) {
        switch (sep_string[i]) {
            case 'у':
                sep_string[i] = 'ю'
                break;
            case 'У':
                sep_string[i] = 'Ю'
                break;
            case 'е':
                sep_string[i] = 'и'
                break;
            case 'Е':
                sep_string[i] = 'И'
                break;
            case 'ж':
                sep_string[i] = 'з'
                break;
            case 'Ж':
                sep_string[i] = 'З'
                break;
            case 'р':
                if (!sep_string[i - 1]) break;
                if (syllables.includes(sep_string[i])) { sep_string[i] = 'й' }
                else { sep_string[i] = 'ь' };
                break;
            case 'Р':
                if (!sep_string[i - 1]) break;
                if (syllables.includes(sep_string[i])) { sep_string[i] = 'Й' }
                else { sep_string[i] = 'Ь' };
                break;
            case 'а':
                if (!sep_string[i + 1] || sep_string[i + 1] == ' ' || arrr.includes(sep_string[i + 1]) || arrr.includes(sep_string[i - 1])) break;
                sep_string[i] = 'я'
                break;
            case 'А':
                if (!sep_string[i + 1] || sep_string[i + 1] == ' ' || arrr.includes(sep_string[i + 1]) || arrr.includes(sep_string[i - 1])) break;
                sep_string[i] = 'Я'
                break;
            default:
            break;
        }
    }
    return sep_string.join('');
}

bot.launch()