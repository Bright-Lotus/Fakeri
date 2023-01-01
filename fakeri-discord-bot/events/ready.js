const { giftsDrop } = require('../handlers/dropHandler');
const figlet = require('figlet');
const chalk = require('chalk');
const { ActivityType } = require('discord.js');
const { timeoutManager } = require('../handlers/timeoutsHandler');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const botStatuses = [
			{ name: 'Aelram', type: ActivityType.Watching },
			{ name: 'El Evento', type: ActivityType.Competing },
			{ name: 'Comprenle a Nora!', type: ActivityType.Streaming },
			{ name: 'Es Faker Cry pero no le digan a Luis', type: ActivityType.Watching },
			{ name: 'Cuidado con la muerte! Se pueden morir.', type: ActivityType.Playing },
			{ name: 'Nuevas misiones el 5 de Enero', type: ActivityType.Playing },
			{ name: 'Tilin es el impostor', type: ActivityType.Streaming },
			{ name: 'Que bacaneria, aqui con mi compa, Ete Sech', type: ActivityType.Listening },
			{ name: 'La cumbia del tilin', type: ActivityType.Listening },
			{ name: 'Luis haga stream', type: ActivityType.Streaming },
			{ name: 'Navidad se acaba cuando se acabe el Evento', type: ActivityType.Playing },
			{ name: 'Esos regalos se ven jugosos', type: ActivityType.Watching },
			{ name: 'Abrir regalos', type: ActivityType.Playing },
			{ name: 'Le quiero poner un apodo a Luis pero no se me ocurre nada', type: ActivityType.Competing },
			{ name: 'Arissa es muy amable, pero cruel cuando debe', type: ActivityType.Watching },
			{ name: 'Abe tiene 60 años por si no sabian', type: ActivityType.Playing },
			{ name: 'Lyra no piensa antes de meterse primera en la batalla', type: ActivityType.Watching },
			{ name: 'Nora a veces es como si fuera fria', type: ActivityType.Watching },
			{ name: 'Si ven bugs o comportamiento inesperado, reportenlo!', type: ActivityType.Playing },
			{ name: 'Hagamos golpe de estado a este server...', type: ActivityType.Playing },
			{ name: 'Aqui con mi compa, Ete Sech', type: ActivityType.Playing },
			{ name: 'So - El gran comediante Contodocirco', type: ActivityType.Playing },
			{ name: 'Que - Persona que no tuvo cuidado', type: ActivityType.Playing },
			{ name: 'No.. no le creo que sech era el impostor', type: ActivityType.Playing },
			{ name: '"Fakeri" fue todo idea de Luis, molesta mucho con eso de Faker Pipipi', type: ActivityType.Playing },
			{ name: 'Luis es super raro', type: ActivityType.Playing },
			{ name: 'Mucho Luis pero es que la creadora mia esta obsesionada', type: ActivityType.Watching },
			{ name: 'Guerra Civil', type: ActivityType.Streaming },
			{ name: 'meow', type: ActivityType.Playing },
			{ name: 'Arissa podria tener un crush en alguien', type: ActivityType.Watching },
			{ name: 'Abe sera inmortal? Yo digo que si', type: ActivityType.Watching },
			{ name: 'La espada de Lyra es hecha de un material muy especial', type: ActivityType.Watching },
			{ name: 'Diganle a Luis que no se olvide de hacer stream', type: ActivityType.Playing },
			{ name: 'Contododinero', type: ActivityType.Watching },
			{ name: 'Pa cuando nuevo video Luis', type: ActivityType.Watching },
			{ name: 'No olviden de comprar consumibles!', type: ActivityType.Playing },
			{ name: 'Los monstruos elite dan 30% mas de recompensas', type: ActivityType.Playing },
			{ name: 'Los monstruos ganan una cantidad considerable de stats dependiendo del LVL del jugador', type: ActivityType.Playing },
			{ name: 'El nivel maximo que pueden obtener es 100!', type: ActivityType.Streaming },
			{ name: 'El torneo de Luis', type: ActivityType.Competing },
			{ name: 'No se olviden de completar las misiones!', type: ActivityType.Watching },
			{ name: 'ttv/luisyepez221 c:', type: ActivityType.Watching },
			{ name: 'No olviden comprar consumibles y armaduras!', type: ActivityType.Playing },
			{ name: 'Equipen objetos con /inventory', type: ActivityType.Playing },
			{ name: 'Si me gustan mucho los gatos', type: ActivityType.Playing },
			{ name: 'Codigo LUISIN en la tienda', type: ActivityType.Playing },
			{ name: 'Lu', type: ActivityType.Watching },
			{ name: 'Muchos bugs y comportamientos inesperados...', type: ActivityType.Watching },
			{ name: 'WoW tilin', type: ActivityType.Listening },
			{ name: '221', type: ActivityType.Playing },
			{ name: 'Ayeye', type: ActivityType.Playing },
			{ name: 'Son Robots!', type: ActivityType.Watching },
			{ name: 'Jojos', type: ActivityType.Watching },
			{ name: 'Faker Whats was that', type: ActivityType.Listening },
			{ name: 'Faker pipipi 2', type: ActivityType.Playing },
		];
		client.user.setPresence({ activities: [ botStatuses[ Math.floor(Math.random() * botStatuses.length) ] ] });
		// Choose a random status from botStatuses and set it to the client
		setInterval((bot, statuses) => {
			bot.user.setPresence({ activities: [ statuses[ Math.floor(Math.random() * statuses.length) ] ] });
		}, 6e5, client, botStatuses);
		await giftsDrop(client);
		await timeoutManager(client);
		setInterval(async (botClient) => {
			await giftsDrop(botClient);
		}, (36e5 * 24), client);
		figlet('Fakeri', {
			font: 'Graffiti',
			horizontalLayout: 'default',
			verticalLayout: 'default',
			width: 80,
			whitespaceBreak: true,
		}, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log(chalk.blueBright(data));
			figlet('Online', {
				font: 'Graffiti',
				horizontalLayout: 'default',
				verticalLayout: 'default',
				width: 80,
				whitespaceBreak: true,
			}, (err, dataOnline) => {
				if (err) {
					console.error(err);
					return;
				}
				console.log(chalk.greenBright(dataOnline));
			});
		});
	},
};