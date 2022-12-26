# Quests
This file contains all the information about the quests system.

## Quest Types
The bot uses numbers to identify the quest type, here are the types and their numbers:
1 = Send Message

2 = React with emoji to messages

3 = Send message with certain letter

4 = Completion quest

5 = Send message with certain content

6 = Emote in channel

7 = Participate in a gift drop

8 = Kill a monster

9 = Level up

### Quest Type 1: Send Message
This quest type is the most basic one, the user has to send a certain amount of messages in a channel.
The channel is specified in the quest object as a targetChannel property, and the goal is also specified in the quest object.

### Quest Type 2: React with emoji to messages
This quest type is similar to the first one, but instead of sending messages, the user has to react with a certain emoji to a certain amount of messages.
The emoji is specified in the quest object as a targetEmoji property, and the goal is also specified in the quest object.

### Quest Type 3: Send message with certain letter
This quest type is similar to the first one, but instead of sending messages, the user has to send a message that includes a letter.
The letter is specified in the quest object as a targetLetter property, and the goal is also specified in the quest object.

### Quest Type 4: Completion quest
This quest type is purely to specify the bot that that quest is a completion quest.
Meaning in resets progress when the user completes it.