const { ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch'); // Importing fetch for making HTTP requests
const searchByName = require('../../utils/searchByName');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'price',
    description: 'Check the price of an item.',
    testOnly: false,
    options: [
        {
            name: 'target-item',
            description: 'Name of the item you want to check the price for.',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    callback: async (client, interaction) => {
        try {
            const targetItem = interaction.options.getString('target-item');
            const itemData = searchByName(targetItem); // Assuming searchByName returns an object with item data
            if (!itemData || !itemData.id) {
                return interaction.reply(`${targetItem} not found or price data unavailable.`);
            }
            const targetId = itemData.id;
            const url = `https://www.ge-tracker.com/api/items/${targetId}`;
            const response = await fetch(url);
            const responseData = await response.json();
            if (responseData && responseData.data) {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(responseData.data.name.toString())
                    .setURL(responseData.data.url.toString())
                    .setDescription(`**Overall Price:** ${addCommas(responseData.data.overall)} coins`)
                    .setThumbnail('https://secure.runescape.com/m=itemdb_oldschool/1710930605219_obj_sprite.gif?id=' + targetId)
                    .addFields(
                        { name: 'Buying price', value: addCommas(responseData.data.buying), inline: true },
                        { name: 'Buying Quantity', value: addCommas(responseData.data.buyingQuantity), inline: true },
                        { name: 'Last Known Buy Time', value: epochToDate(responseData.data.lastKnownBuyTime.toString()), inline: true },
                        { name: 'Selling Price', value: addCommas(responseData.data.selling), inline: true },
                        { name: 'Selling Quantity', value: addCommas(responseData.data.sellingQuantity), inline: true },
                        { name: 'Last Known Sell Time', value: epochToDate(responseData.data.lastKnownSellTime.toString()), inline: true },
                        { name: 'Buy/Sell Ratio', value: responseData.data.buySellRatio.toString(), inline: true },

                    )
                    .setTimestamp(new Date(responseData.data.updatedAt))
                   

                interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply(`${targetItem} not found or price data unavailable.`);
            }
        } catch (error) {
            console.error('Error fetching price:', error);
            interaction.reply('An error occurred while fetching the price.');
        }
    },
};



function epochToDate(epochTime) {
    const date = new Date(epochTime);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthAbbreviation = months[date.getMonth()];
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    const dateString = `${monthAbbreviation}, ${day} ${hours}:${minutes}`;

    return dateString;
}

function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



