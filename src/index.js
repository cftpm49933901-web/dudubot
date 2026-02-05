const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
    console.log(`로그인 성공: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith(',roblox avatar')) {
        const username = message.content.split(' ')[2];

        if (!username) {
            return message.reply('닉네임을 입력해줘!');
        }

        try {
            // 유저 ID 가져오기
            const userRes = await axios.post(
                'https://users.roblox.com/v1/usernames/users',
                {
                    usernames: [username],
                    excludeBannedUsers: true
                }
            );

            const userId = userRes.data.data[0].id;

            // 아바타 이미지 가져오기
            const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`;

            const avatarRes = await axios.get(avatarUrl);

            const image = avatarRes.data.data[0].imageUrl;

            message.reply(image);

        } catch (err) {
            message.reply('유저를 찾을 수 없거나 오류 발생');
        }
    }
});

client.login('MTQ2ODg5MjE1NjU3MDc2MzI2Nw.GoqLQZ.HYgFSwYOY42JR-ivUV3n_m8Yuw177Ojdch2BAk');
