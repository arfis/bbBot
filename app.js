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
        var found = response.data.data.find(coin => coin.symbol.toLowerCase() === match[1].toLowerCase());
       if (!found) {
           replyWithHTML("Nic som nenasiel 🙁 ");
       } else {

           axios.get('https://api.coinmarketcap.com/v2/ticker/'+found.id+'/?convert=ETH')
               .then(response => {
                   const data = response.data.data;

                   var changeUSD = data.quotes.USD.percent_change_24h;
                   var changeETH = data.quotes.ETH.percent_change_24h;
                   var priceUSD = '$' + data.quotes.USD.price;
                    var priceETH = data.quotes.ETH.price;
                    var volume = data.quotes.USD.market_cap ? '$' + data.quotes.USD.market_cap.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') : '-';
                    var name = data.name;

           axios.get('https://api.coinmarketcap.com/v2/ticker/'+found.id+'/?convert=BTC')
               .then(response => {
                 var priceBTC = '$' + response.data.data.quotes.BTC.price;
                 var changeBTC = response.data.data.quotes.BTC.percent_change_24h;

                 changeETH = getChangeWithSmiley(changeETH);
                 changeBTC = getChangeWithSmiley(changeBTC);
                 changeUSD = getChangeWithSmiley(changeUSD);

           replyWithHTML('<b>'+name+':</b> ' + priceUSD + ' | ' + changeUSD + '\n'
               +'<b>ETH: </b>'+ priceETH + ' | ' + changeETH + '\n'
               +'<b>BTC: </b>'+ priceBTC + ' | ' + changeBTC + '\n'
               + '<b>Objem: </b>' + volume);
           })
           .catch(error => {
               replyWithHTML('Daj mi chvilku oddychu');
           })

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

function getChangeWithSmiley(change) {
    if (change) {
        changeAbs = Math.abs(change);
        if (changeAbs > 80) {
            return change += change > 0 ? '% 🤑' : '% 😭';
        } else if (changeAbs > 30) {
            return change += change > 0 ? '% 😍' : '% 😢';
        } else {
            return change += change > 0 ? '% 🙂' : '% 🙁';
        }
    } else {
        return change;
    }
}
bot.hears(/find (.*)/, ({match, reply}) => reply(`https://www.google.com/search?q=${match[1]}`))
bot.hears('top', ({reply}) => reply('https://bitcoach.net'));
// Login widget events
bot.on('connected_website', ({ reply }) => reply('Website connected'))

bot.on('new_chat_members', (ctx) => {
    for(let user of ctx.message.new_chat_members) {
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
