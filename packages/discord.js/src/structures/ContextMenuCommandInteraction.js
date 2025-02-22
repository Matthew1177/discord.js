'use strict';

const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const CommandInteraction = require('./CommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');

/**
 * Represents a context menu interaction.
 * @extends {CommandInteraction}
 */
class ContextMenuCommandInteraction extends CommandInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * The target of the interaction, parsed into options
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new CommandInteractionOptionResolver(
      this.client,
      this.resolveContextMenuOptions(data.data),
      this.transformResolved(data.data.resolved),
    );

    /**
     * The id of the target of the interaction
     * @type {Snowflake}
     */
    this.targetId = data.data.target_id;

    /**
     * The type of the target of the interaction; either {@link ApplicationCommandType.User}
     * or {@link ApplicationCommandType.Message}
     * @type {ApplicationCommandType.User|ApplicationCommandType.Message}
     */
    this.targetType = data.data.type;
  }

  /**
   * Resolves and transforms options received from the API for a context menu interaction.
   * @param {APIApplicationCommandInteractionData} data The interaction data
   * @returns {CommandInteractionOption[]}
   * @private
   */
  resolveContextMenuOptions({ target_id, resolved }) {
    const result = [];

    if (resolved.users?.[target_id]) {
      result.push(
        this.transformOption({ name: 'user', type: ApplicationCommandOptionType.User, value: target_id }, resolved),
      );
    }

    if (resolved.messages?.[target_id]) {
      result.push({
        name: 'message',
        type: '_MESSAGE',
        value: target_id,
        message: this.channel?.messages._add(resolved.messages[target_id]) ?? resolved.messages[target_id],
      });
    }

    return result;
  }
}

module.exports = ContextMenuCommandInteraction;
