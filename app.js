const token = "560645937:AAGefTAhQVazfQTfZeDrTz1omQmTapUkBDY";
const prodToken = "548487175:AAENt8DPxkD4MPWErMVJrjLb4p9GwSsDBo0";

const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const express = require('express')
const bot = new Telegraf(token)

const sayYoMiddleware = ({ reply }, next) => reply('yo').then(() => next())
const session = require('telegraf/session')
const randomPhoto = 'https://picsum.photos/200/300/?random'
const words = require('./dictionary');
const axios = require('axios');

bot.use(session())

bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))

bot.command('novinky', (ctx) => ctx.reply('https://www.bitcoach.net/news'));
bot.command('cat', ({ replyWithPhoto }) => replyWithPhoto(randomPhoto))
bot.command('admin', (ctx) => ctx.reply('Naši admini sú: @Lubos43 a @Mesty17'));

// Wow! RegEx
bot.hears(/reverse (.+)/, ({ match, reply }) => reply(match[1].split('').reverse().join('')))

bot.command('mcap', ({match, replyWithHTML}) => {
    axios.get('https://api.coinmarketcap.com/v2/global/')
    .then( response => {

    replyWithHTML('<b>Celkovy cap: </b>' + response.data.data.quotes.USD.total_market_cap.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '$\n'
                    + '<b>Zmena za 24 hodin: </b>' + response.data.data.quotes.USD.total_volume_24h.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '$\n');
})
.catch(error => {
    replyWithHTML("Prr nie tak rychlo ");
})});

bot.hears(/p (.+)/, ({match, replyWithHTML}) => {
    axios.get('https://api.coinmarketcap.com/v2/listings/')
    .then(response => {
        // console.log(JSON.stringify(response.data));
        var found = response.data.data.find(coin => coin.symbol.toLowerCase() === match[1].toLowerCase());
       if (!found) {
           replyWithHTML("Nic som nenasiel 🙁 ");
       } else {

           axios.get('https://api.coinmarketcap.com/v2/ticker/'+found.id)
               .then(response => {
                   console.log(response.data.data);
                   var change = response.data.data.quotes.USD.percent_change_24h;
                   var changeString;
                   if (change > 0) {
                       changeString = '<i color="green">'+change+'</i>'
                   } else {
                       changeString = '<i color="red">'+change+'</i>'
                   }
                replyWithHTML('<b>Meno:</b> ' + response.data.data.name +
                        '\n<b>Zmena za 24 hodin:</b> ' + changeString + '%\n'
                    + '<b>Market cap:</b> ' + response.data.data.quotes.USD.market_cap.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '$\n')
               })
           .catch(error => {
               replyWithHTML("Prr nie tak rychlo ");
           });
       }
        //reply(JSON.stringify());
    })
    .catch(error => {
        replyWithHTML("Prr nie tak rychlo ");
    });
})


bot.hears(/find (.*)/, ({match, reply}) => reply(`https://www.google.com/search?q=${match[1]}`))
bot.hears('top', ({reply}) => reply('https://bitcoach.net'));
// Login widget events
bot.on('connected_website', ({ reply }) => reply('Website connected'))

bot.on('new_chat_members', (ctx) => {
    for(let user of ctx.message.new_chat_members) {
        console.log(user);
        ctx.reply(`Vitaj ${user.first_name}! Nezabudni si prečítať pravidlá v pripnutej správe a pridať sa aj do nášho channelu: https://t.me/bitcoach`)
    }
    });

// Text messages handling
// bot.hears('bitcoach', sayYoMiddleware, (ctx) => {
//     ctx.session.counter = ctx.session.counter || 0
//     ctx.session.counter++
// return ctx.replyWithMarkdown(`Bitcoach counter:_ ${ctx.session.counter}`)
// })

bot.hears(/ban (.*)/, (ctx) => {
    console.log(ctx);
    ctx.reply(`https://www.google.com/search`);
})

bot.command((ctx) => {
        const key = ctx.message.text.replace('/', '');
        if (words[key]) {
            return ctx.reply(words[key]);
        }
})

bot.startPolling()
