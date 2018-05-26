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


bot.command((ctx) => {
        const key = ctx.message.text.replace('/', '');
        if (words[key]) {
            return ctx.reply(words[key]);
        }
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


bot.startPolling()
