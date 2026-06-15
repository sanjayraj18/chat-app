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

  async getRecentChats(userId: string) {
    const latestDMs = await prisma.directMessage.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      distinct: ["senderId", "receiverId"],
      take: 15,
      include: { sender: true, receiver: true },
    });

    const latestGroupMessages = await prisma.groupMessage.findMany({
      where: {
        group: {
          members: { some: { userId } },
        },
      },
      orderBy: { createdAt: "desc" },
      distinct: ["groupId"],
      take: 10,
      include: { group: true, sender: true },
    });

    // 3. THE PAIN: Manual Merging and Sorting
    // We have two different types of objects, now we must combine them
    const combined = [
      ...latestDMs.map((dm) => ({
        ...dm,
        chatType: "DIRECT" as const,
        chatTitle:
          dm.senderId === userId
            ? dm.receiver.displayName
            : dm.sender.displayName,
      })),
      ...latestGroupMessages.map((gm) => ({
        ...gm,
        chatType: "GROUP" as const,
        chatTitle: gm.group.group_name,
      })),
    ];

    return combined
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }
}
