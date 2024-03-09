import prisma from "../../@core/helpers/prisma";

export default async function notify(title, toUserId, text, fromUserId, storyId) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        text,
        toUserId,
        fromUserId,
        storyId,
      },
    });
  } catch (error) {
    console.log("Failed to send notification");
  }
}
