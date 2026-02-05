const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`로그인 성공: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // ",roblox avatar 유저네임" 형태
    if (!message.content.toLowerCase().startsWith(',roblox avatar')) return;

    const parts = message.content.trim().split(/\s+/); // 공백 여러개도 처리
    const username = parts[2];

    if (!username) {
        return message.reply('닉네임을 입력해줘! 예: `,roblox avatar fairplayer978`');
    }

    try {
        const userRes = await axios.post(
            'https://users.roblox.com/v1/usernames/users',
            { usernames: [username], excludeBannedUsers: true }
        );

        if (!userRes.data?.data?.length) {
            return message.reply('유저를 찾을 수 없어!');
        }

        const userId = userRes.data.data[0].id;

        const avatarUrl =
            `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`;

        const avatarRes = await axios.get(avatarUrl);

        const image = avatarRes.data?.data?.[0]?.imageUrl;
        if (!image) return message.reply('아바타 이미지를 가져오지 못했어.');

        return message.reply(image);
    } catch (err) {
        console.error(err);
        return message.reply('유저를 찾을 수 없거나 오류 발생');
    }
});

// ✅ Railway/로컬 모두 환경변수로
client.login(process.env.DISCORD_TOKEN);
