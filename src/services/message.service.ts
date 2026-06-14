import prisma from "../db/db";

export class MessageService {
  async saveDirectMessage(
    senderId: string,
    receiverId: string,
    message: string,
  ) {
    try {
      return await prisma.directMessage.create({
        data: { senderId, receiverId, message },
        include: { sender: true },
      });
    } catch (err) {
      console.warn("Error in saving the direct message");
      throw err;
    }
  }

  async saveGroupMessage(senderId: string, groupId: string, message: string) {
    try {
      return await prisma.groupMessage.create({
        data: { senderId, groupId, message },
        include: { sender: true },
      });
    } catch (err) {
      console.warn("Error in saving the direct message");
      throw err;
    }
  }

  async getDirectMessage(userA: string, userB: string, limit: number = 20) {
    try {
      return await prisma.directMessage.findMany({
        where: {
          OR: [
            { senderId: userA, receiverId: userB },
            { senderId: userB, receiverId: userA },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit, //dont fetch 1m message at the time
        include: { sender: true },
      });
    } catch (err) {
      console.warn("error in fetching messages");
      throw err;
    }
  }
}
