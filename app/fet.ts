import { useUser } from "@clerk/nextjs";

export const fetchUsers = async () => {
  try {
    const { user: clerkUser } = useUser();

    if (!clerkUser) {
      throw new Error("No Clerk user found.");
    }

    let mongoUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!mongoUser) {
      const username =
        clerkUser.username ??
        `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

      const newUser = {
        clerkUserId: clerkUser.id,
        username,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        profilePic: clerkUser.imageUrl,
      };

      mongoUser = await prisma.user.create({ data: newUser });
    }

    const quizResults = await prisma.quizResult.findMany({
      where: { userId: mongoUser.id },
    });

    return { data: { user: mongoUser, quizResults } };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch user data." };
  }
};
