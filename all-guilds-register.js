// ==========================================
// 🤖 NeuroViaBot - All Guilds Command Registration
// ==========================================

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Komutları yükle
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Komut yüklendi: ${command.data.name}`);
    } else {
        console.log(`⚠️ Komut geçersiz: ${file}`);
    }
}

// REST instance oluştur
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Komutları kaydet
(async () => {
    try {
        console.log(`🔄 ${commands.length} slash komutu kaydediliyor...`);

        // Global komutları kaydet
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ ${data.length} global slash komutu başarıyla kaydedildi!`);
        
        // Her komut için detay
        data.forEach(cmd => {
            console.log(`  - ${cmd.name}: ${cmd.description}`);
        });

    } catch (error) {
        console.error('❌ Komut kaydetme hatası:', error);
    }
})();
