import pkg from 'discord.js';
import fs from 'fs'
import url from 'url'

export function bot() {
    const { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, GatewayIntentBits } = pkg;
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
    });


    let rawdata = fs.readFileSync('bloonstd6.json');
    //let bloonstdlinks = JSON.parse(rawdata);
    let botAvatar;
    let botUsername;



    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
        botAvatar = client.user.avatarURL()
        botUsername = client.user.username
        //console.log(bloonstdlinks[0].url);
        //console.log(bloonstdlinks[1].url)
        client.user.setPresence({
            activities: [{ name: `Bloons TD 6`, type: 0 }],

        });

        const activities = [
            {
                type: "WATCHING",
                activity: "invite codes"
            },
            {
                type: "PLAYING",
                activity: "Bloons TD 6"
            }

        ];
        /*
        const timeoutForNms = 3600000; // 10 seocnds
        let currentActivity = 0;
        setInterval(() => {
            console.log('set activity to %s type to %s', activities[currentActivity].activity, activities[currentActivity].type);
            client.user.setActivity(`${activities[currentActivity].activity}`, { type: `${activities[currentActivity].type}` });
            currentActivity++;
            if (currentActivity === activities.length) {
                currentActivity = 0;
            }
        }, timeoutForNms);
        */
        //console.log(addCode);

    });


    //import clipboard from 'clipboardy';

    var serverWhitelist = ["847527325587472454"]
    var nbr = 0;
    client.on('messageCreate', async message => {
        if (message.author.bot) return;
        //console.log(message.content)
        // Certain maps
        if (message.content == "!enable") {
            const serverGuild = message.guild.id;
            serverWhitelist.push(serverGuild)
            message.reply("Added guild to whitelist!")
        }
        //const serverQueue = queue.get(message.guild.id);
        if (serverWhitelist.includes(message.guild.id)) {
            if (message.content.includes('https://join.btd6.com/Coop/') || message.content.includes('https://join.btd6.com/Boss/')) {

                var string = message.content
                var matches = string.match(/\bhttps?:\/\/\S+/gi);
                var adr = matches[0];
                var q = url.parse(adr, true);
                var codepath = q.pathname
                var code = "Sorry";
                var gametype;
                if (string.includes('https://join.btd6.com/Coop/')) {
                    console.log('0');
                    gametype = "COOP"
                    code = codepath.replace('/Coop/', "");
                } else if (string.includes('https://join.btd6.com/Boss/')) {
                    console.log('1');
                    gametype = "BOSS"
                    code = codepath.replace('/Boss/', "");
                }
                //message.delete();
                //console.log(q.pathname);



                let inviteEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${botUsername}🐒`, iconURL: botAvatar })
                    .setColor('#FF3030')
                    .setTitle("🍌 [**" + gametype + "**] Invite | Join Bloons TD 6 now!")
                    .setThumbnail('https://media.pocketgamer.com/artwork/na-fbuja/1.png')
                    .setDescription('Use the command ``/monkifeed`` to be able to enable and disable the automatic Embed')
                    .addFields({ name: '🎮 Game Lobby Code', value: '```' + code + '```', inline: true })
                    .setTimestamp()
                    .setFooter({ text: `Requested by ${message.author.username}`, iconURL: botAvatar });

                let codeButton = new ButtonBuilder()
                    .setCustomId(code)
                    .setLabel('Copy')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📝')




                const inviteMsg = await message.channel.send({ embeds: [inviteEmbed], components: [new ActionRowBuilder().addComponents(codeButton)] });

                //var code = codepath.replace("/Coop/", "");

                console.log("This the code: " + code)
                const filter = i => i.customId === code;

                const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });
                collector.on('collect', async i => {
                    if (i.customId === code) {
                        try {
                            await i.deferUpdate();
                            //xsel.set(code)
                            console.log('data was copied to clipboard')
                            clipboardy.writeSync(code);
                            //clipboard(code)
                            nbr++;      
                            await i.editReply({ components: [new ActionRowBuilder().addComponents(codeButton)] });

                        }
                        catch (e) {
                            console.log(e)
                            await i.reply({ content: "I'm sorry some issue appeared!", ephemeral: true });
                        }


                    }
                });

                collector.on('end', collected => {
                    codeButton.setDisabled(true)
                    inviteMsg.edit({ embeds: [inviteEmbed], components: [new ActionRowBuilder().addComponents(codeButton)] });
                    //console.log(`Collected ${collected.size} items`);
                    console.log("Collected!");

                });
            }
        }

    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;
        if (interaction.isButton()) {
            console.log("is a button!");
            //await interaction.reply({ content: "I'm sorry this button is out of order!", ephemeral: true});
        }

        if (interaction.commandName === '!steam') {
            console.log(message)
        }
    });
    client.login("token here")

}
bot();
