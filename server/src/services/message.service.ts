import { ConversationModel } from "models/conversations.model";
import { MessageModel } from "models/messages.model";
import { Service } from "typedi";

@Service()
export class MessageService {
  public async sendMessage(
    message: string,
    senderId: string,
    receiverId: string,
  ) {
    let conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    return newMessage;
  }

  public async getMessage(senderId: string, userToChatId: string) {
    const conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    return conversation?.messages;
  }
}
