
const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client();

const antispam = require ('discord-anti-spam')

var anti_spam = require("discord-anti-spam");

var bot = new Discord.Client()

client.on('ready', () => {
  console.log('online!');
  client.user.setActivity(`Discord`);
});

client.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "help") {
     message.channel.sendMessage("List of commands: kick , ban , deletemessages , help , botinfo .")
  }

  if(command === "kick") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator","Admin","Mod","Discord Staff"].includes(r.name)) )
      return message.reply("you don't have permissions to use this");

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
    return message.reply("I cannot kick this user");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator "].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this person");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  if(command === "deletemessages") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator","Admin","Mod","Discord Staff"].includes(r.name)) )
      return message.reply("you don't have permissions to use this");

  const deleteCount = parseInt(args[0], 10);

  if(!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("say a number from 2 to 100");

  const fetched = await message.channel.fetchMessages({limit: deleteCount});
  message.channel.bulkDelete(fetched)
    .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
}
antispam(bot, {
  warnBuffer: 1,
  maxBuffer: 5,
  interval: 1000,
  warningMessage: "stop spam",
  banMessage: "Banned for spamming",
  maxDuplicatesWarning: 7,
  maxDuplicatesBan: 10,
  deleteMessagesAfterBanForPastDays: 7
});

});

client.on('message', message => {;
    if (message.content.startsWith('+botinfo')) {;
        var bot_embed = new Discord.RichEmbed()
        .setDescription(':newspaper:Information')
        .setColor('#bc0000')
        .addField('Creators', '```y0sch1#0910 and Wouter#0718```')
        .addField('Why we made this bot?', '```for HackWeek Discord Event```')
        .addField(':zap:Version of the bot', '```1.0```')
        .addField('What categorie is this bot?', '```Moderation ```')
        message.channel.sendEmbed(bot_embed);
    };
})

client.login(config.token);
