"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require('dotenv').config();
var fs = require("fs");
var _a = require('discord.js'), Client = _a.Client, Collection = _a.Collection, Intents = _a.Intents, MessageActionRow = _a.MessageActionRow, MessageButton = _a.MessageButton, MessageEmbed = _a.MessageEmbed;
var client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
var commandFiles = fs.readdirSync('./commands').filter(function (file) { return file.endsWith('.js'); });
for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
    var file = commandFiles_1[_i];
    var command = require("./commands/" + file);
    client.commands.set(command.name, command);
}
client.once('ready', function () {
    console.log('Ready!');
});
var currentDeathrolls = [];
client.on('messageCreate', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!!((_a = client.application) === null || _a === void 0 ? void 0 : _a.owner)) return [3 /*break*/, 2];
                return [4 /*yield*/, ((_b = client.application) === null || _b === void 0 ? void 0 : _b.fetch())];
            case 1:
                _e.sent();
                _e.label = 2;
            case 2:
                if (!(message.content.toLowerCase() === '!deploy' && message.author.id === ((_c = client.application) === null || _c === void 0 ? void 0 : _c.owner.id))) return [3 /*break*/, 4];
                data = {
                    name: 'deathroll',
                    description: 'Starts a deahtroll against two players.',
                    options: [{
                            name: 'playerone',
                            type: 'USER',
                            description: 'Player to start the deathroll.',
                            required: true
                        },
                        {
                            name: 'playertwo',
                            type: 'USER',
                            description: 'Second player to roll.',
                            required: true
                        },
                        {
                            name: 'startnumber',
                            type: 'INTEGER',
                            description: 'The start integer.',
                            required: true
                        }]
                };
                return [4 /*yield*/, ((_d = client.guilds.cache.get(process.env.WALLA_ID)) === null || _d === void 0 ? void 0 : _d.commands.create(data))];
            case 3:
                _e.sent();
                console.log("Deployment done!");
                _e.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
var randomNumber = function (min, max) {
    return Math.floor(Math.random() * max) + min;
};
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var deathRollIndex, newRandomRoll_1, embed, row, embed, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isButton())
                    return [2 /*return*/];
                deathRollIndex = currentDeathrolls.findIndex(function (currentDeathRoll) { var _a, _b; return currentDeathRoll.interactionId === (((_a = interaction.message.interaction) === null || _a === void 0 ? void 0 : _a.id) || ((_b = interaction.message.reference) === null || _b === void 0 ? void 0 : _b.messageId)); });
                if (deathRollIndex === -1)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 8]);
                if (!(interaction.user === currentDeathrolls[deathRollIndex].currentPlayer))
                    return [2 /*return*/];
                newRandomRoll_1 = randomNumber(1, currentDeathrolls[deathRollIndex].currentRoll);
                if (!(newRandomRoll_1 === 1)) return [3 /*break*/, 3];
                embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Roll')
                    .setDescription(currentDeathrolls[deathRollIndex].currentPlayer.username + " rolls **" + newRandomRoll_1 + "** (1-" + currentDeathrolls[deathRollIndex].currentRoll + ").\n\nAnd loses the Death Roll - GG!");
                return [4 /*yield*/, interaction.reply({ embeds: [embed] }).then(function () {
                        currentDeathrolls[deathRollIndex] = {
                            interactionId: "",
                            startedBy: currentDeathrolls[deathRollIndex].startedBy,
                            playerOne: currentDeathrolls[deathRollIndex].playerOne,
                            playerTwo: currentDeathrolls[deathRollIndex].playerTwo,
                            startnumber: currentDeathrolls[deathRollIndex].startnumber,
                            currentRoll: newRandomRoll_1,
                            currentPlayer: currentDeathrolls[deathRollIndex].playerOne
                        };
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                row = new MessageActionRow()
                    .addComponents(new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Next roll')
                    .setStyle('PRIMARY'));
                embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Roll')
                    .setDescription(currentDeathrolls[deathRollIndex].currentPlayer.username + " rolls **" + newRandomRoll_1 + "** (1-" + currentDeathrolls[deathRollIndex].currentRoll + ").");
                return [4 /*yield*/, interaction.reply({ content: "<@" + ((currentDeathrolls[deathRollIndex].currentPlayer.id === currentDeathrolls[deathRollIndex].playerOne.id) ? currentDeathrolls[deathRollIndex].playerTwo.id : currentDeathrolls[deathRollIndex].playerOne.id) + ">", embeds: [embed], components: [row] }).then(function () {
                        currentDeathrolls[deathRollIndex] = {
                            interactionId: interaction.message.id,
                            startedBy: currentDeathrolls[deathRollIndex].startedBy,
                            playerOne: currentDeathrolls[deathRollIndex].playerOne,
                            playerTwo: currentDeathrolls[deathRollIndex].playerTwo,
                            startnumber: currentDeathrolls[deathRollIndex].startnumber,
                            currentRoll: newRandomRoll_1,
                            currentPlayer: (currentDeathrolls[deathRollIndex].currentPlayer.id === currentDeathrolls[deathRollIndex].playerOne.id) ? currentDeathrolls[deathRollIndex].playerTwo : currentDeathrolls[deathRollIndex].playerOne
                        };
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_1 = _a.sent();
                console.error(error_1);
                return [4 /*yield*/, interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })];
            case 7:
                _a.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isCommand())
                    return [2 /*return*/];
                if (!client.commands.has(interaction.commandName))
                    return [2 /*return*/];
                if (interaction.options._hoistedOptions[0].user.bot || interaction.options._hoistedOptions[1].user.bot)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 5]);
                currentDeathrolls.push({
                    interactionId: interaction.id,
                    startedBy: interaction.user,
                    playerOne: interaction.options._hoistedOptions[0].user,
                    playerTwo: interaction.options._hoistedOptions[1].user,
                    startnumber: interaction.options._hoistedOptions[2].value,
                    currentRoll: interaction.options._hoistedOptions[2].value,
                    currentPlayer: interaction.options._hoistedOptions[0].user
                });
                return [4 /*yield*/, client.commands.get(interaction.commandName).execute(interaction)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                console.error(error_2);
                return [4 /*yield*/, interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })];
            case 4:
                _a.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
client.login(process.env.TOKEN);
