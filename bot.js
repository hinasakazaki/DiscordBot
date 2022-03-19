var logger = require('winston');

const fs = require('fs') //importing file save

// Configure logger settings

logger.remove(logger.transports.Console);

logger.add(new logger.transports.Console, {

    colorize: true
});

const peoplePath = 'people.json';
let INTRO = "intro";
let KARMA = "karma";
let IRL_KARMA = "irl_karma";
logger.level = 'debug';

// Initialize Discord Bot
const {
    Client,
    Intents,
    MessageEmbed
} = require("discord.js");

const client = new Client({

    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],


});

client.on('ready', function(evt) {

    logger.info('Connected');

    logger.info('Logged in as: ');

    logger.info(client.username + ' - (' + client.id + ')');
});

client.on('messageCreate', (message) => {

    // Our bot needs to know if it will execute a command

    // It will listen for messages that will start with `!`

    if (message.content.substring(0, 1) == '!') {
        const channelID = message.channelID;

        var args = message.content.substring(1).split(' ');

        var cmd = args[0];
        args = args.splice(1);

        switch (cmd) {

            case 'help':
                const embed = new MessageEmbed();
                embed.setTitle(`Hi! I'm CommunityBot!`)
                embed.setDescription(`A bot to help out a community with buy/sell/trade and IRL interactions!`);
                embed.setColor('#FFC0CB');
                embed.addField('!introduce', `Introduce yourself with this command.`, true);
                embed.addField('!who', `Find out who someone is by @-them with this command.`, true);
                embed.addField('!irlkarma', `Give someone credibility by @-them with this command and a quick message about the interaction.`, true);
                message.channel.send({
                    embeds: [embed]
                });
                break;

            case 'introduce':
                var user_id = message.author.id
                var peopleRead = fs.readFileSync(peoplePath);
                var peopleJson = JSON.parse(peopleRead);

                logger.info("Writing profile for user ID" + user_id);
                if (!peopleJson[user_id]) {
                    peopleJson[user_id] = {}
                    peopleJson[user_id][KARMA] = 0
                    peopleJson[user_id][IRL_KARMA] = {}
                }
                peopleJson[user_id][INTRO] = message.content.split('introduce')[1];
                fs.writeFileSync(peoplePath, JSON.stringify(peopleJson));
                message.channel.send('Successfully recorded profile.');
                break;

            case 'who':
                var peopleJson = JSON.parse(fs.readFileSync(peoplePath));
                var taggedUser = message.mentions.users.first() || message.author;
                if (!taggedUser) {
                    message.channel.send('Please tag someone when using the !who command.');
                } else if (peopleJson[taggedUser.id]) {
                    //this checks if data for the user has already been created
                    let data = peopleJson[taggedUser.id.toString()];
                    const embed = new MessageEmbed();
                    embed.setTitle(`${taggedUser.username}`)
                    embed.setDescription(`${data[INTRO]}`);
                    embed.setColor('#FFC0CB');
                    embed.setThumbnail(taggedUser.displayAvatarURL());
                    embed.addField('Joined discord', `${taggedUser.createdAt}`, true);
                    var feedbacks = '';
                    for (const pair of data[IRL_KARMA]) {
                        feedbacks += pair['author'] + ': ' + pair['feedback'] + '\n';
                    }
                    embed.setFooter({
                        text: 'People who met them IRL say... \n' + feedbacks.slice(0, -1)
                    });
                    message.channel.send({
                        embeds: [embed]
                    });
                } else {
                    message.channel.send(
                        'That user is not identified. To identify, the user must message !introduce with their intro.'
                    );
                }
                break;

            case 'irlkarma':
                var peopleJson = JSON.parse(fs.readFileSync(peoplePath))
                var taggedUser = message.mentions.users.first();
                if (!taggedUser) {
                    message.channel.send('Please tag someone when giving them IRL karma.');
                } else {
                    user_id = taggedUser.id;
                    var feedback = message.content.split(taggedUser.username)[1];
                    if (!peopleJson[user_id]) {
                        peopleJson[user_id] = {}
                    }
                    if (!peopleJson[user_id][IRL_KARMA]) {

                        peopleJson[user_id][IRL_KARMA] = []
                    }
                    var authorname = message.author.username;
                    peopleJson[user_id][IRL_KARMA].push({
                        feedback: feedback,
                        author: authorname
                    })
                    fs.writeFileSync(peoplePath, JSON.stringify(peopleJson));
                    message.channel.send('Successfully recorded your feedback to ' + taggedUser.username + ".");
                }
                break;
            case 'karma':
                var peopleJson = JSON.parse(fs.readFileSync(peoplePath))
                var taggedUser = message.mentions.users.first();
                if (taggedUser == message.author) {
                    message.channel.send('Silly you! You can\'t give karma to yourself!');
                } else if (!taggedUser) {
                    message.channel.send('Please tag someone when giving BST karma.');
                } else {
                    logger.info("Tagged user: " + taggedUser.id);
                    user_id = taggedUser.id;
                    if (!peopleJson[user_id]) {
                        peopleJson[user_id] = {}
                        peopleJson[user_id][KARMA] = 1
                    } else {
                        var currentKarma = peopleJson[user_id][KARMA];
                        peopleJson[user_id][KARMA] = currentKarma + 1;
                    }
                    fs.writeFileSync(peoplePath, JSON.stringify(peopleJson));
                    message.channel.send(
                        'Successfully recorded ' + peopleJson[user_id][KARMA] + ' points for ' + taggedUser.username + "."
                    );
                }
                break;
        }

    }
});
client.login("YOUR_TOKEN_HERE");