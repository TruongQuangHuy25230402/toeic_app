"use server"


import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const fetchUsers = async () => {
  console.log('fetchUsers function called');
    try {
      
      const clerkUser = await currentUser()
      console.log('Clerk User:', clerkUser);

      let mongoUser = null
    
      mongoUser = await prisma.user.findUnique({
        where: {
          clerkUserId: clerkUser?.id
        }
      })
  
      if (!mongoUser) {
        let username = clerkUser?.username
        if (!username) {
          username = clerkUser?.firstName + " " + clerkUser?.lastName
        }
        const newUser: any = {
          clerkUserId: clerkUser?.id,
          username,
          email: clerkUser?.emailAddresses[0].emailAddress,
          profilePic: clerkUser?.imageUrl
        }
        mongoUser = await prisma.user.create({
          data: newUser
        })
      }
  
      const quizResults = await prisma.quizResult.findMany({
        where: {
          userId: mongoUser.id
        }
      })
  
      return {
        data: {
          user: mongoUser,
          quizResults
        }
      }
    } catch (error) {
      console.log(error)
    }
  }