const { SlashCommandBuilder } = require('discord.js');
const ReadText = require('text-from-image');
const fetch = require('node-fetch');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('ffprobe-static').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);
const Buffer = require('buffer').Buffer;
const fs = require('node:fs');
const { imageToChunks } = require('split-images');
const sizeOf = require('image-size');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.deferReply();
		const filter = m => m.content.toLowerCase().includes('tenor');
		const collector = interaction.channel.createMessageCollector({ filter, time: 20000 });

		collector.on('collect', async m => {
			console.log(`Collected ${m.attachments}`);
			console.log(m.embeds[0]?.data?.video);
			await fetchFile(m.embeds[0]?.data.video.url).then(async () => {
				console.log('bruh!');
				await mp4toframe('C:/Users/djblu/BattleBot/tenorgif.mp4', './').then(async () => {
					await ReadText('./tn.png').then(async (text) => {
						console.log((text.includes('hello chat')));
						if (text.includes('hello chat') == false && text.includes('goodbye chat') == false) {
							const dimensions = sizeOf('./tn.png');
							const chunkSize = dimensions.height / 2;

							await imageToChunks('./tn.png', chunkSize).then((chunks) => {
								let i = 0;
								chunks.forEach(c => {
									i++;
									fs.writeFileSync(`slice_${i}.png`, c);
								});
							});

							await ReadText('./slice_1.png').then((textSlice1) => {
								console.log(textSlice1);
								if (!textSlice1.toLowerCase().includes('hello chat') || !textSlice1.toLowerCase().includes('goodbye chat')) {
									return;
								}
								interaction.editReply(textSlice1);
							});

							await ReadText('./slice_2.png').then((textSlice2) => {
								console.log(textSlice2);
								if (!textSlice2.toLowerCase().includes('hello chat') || !textSlice2.toLowerCase().includes('goodbye chat')) {
									return;
								}
								interaction.editReply(textSlice2);
							});
							interaction.reply(text);
						}
					}).catch(err => {
						console.log(err);
					});
				});
				console.log('hewo');
			});
		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});


		console.log(interaction);
	},
};

async function fetchFile(url) {
	await fetch(url).then(function (resp) {
		return resp.blob();
	}).then(async function (blob) {
		let buffer = await blob.arrayBuffer();
		buffer = Buffer.from(buffer);
		fs.createWriteStream('tenorgif.mp4').write(buffer);
	});

}

async function mp4toframe(url, des) {
	return new Promise((resolve) => {
		ffmpeg(url)
			.screenshots(({ count: 1, folder: des }))
			.on('end', () => {
				console.log('Finished proccessing video.');
				resolve();
			});
	});
}