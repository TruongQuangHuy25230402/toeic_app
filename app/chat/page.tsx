"use client";
import React, { useEffect, useState } from "react";
import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import Users from "@/components/userjs/Users";
import ChatRoom from "@/components/chatjs/ChatRoom";

function Page() {
  const auth = getAuth(app);
  const [user, setUser] = useState<any>(null); // or define type for user
  const router = useRouter();
  const [selectedChatroom, setSelectedChatroom] = useState<any>(null); // or define type for chatroom

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const docRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.error("No user document found in Firestore for this user.");
          }
        } else {
          setUser(null);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (user === null) return <div className="text-4xl">Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Left side users */}
      <div className="flex-shrink-0 w-3/12">
        <Users userData={user} setSelectedChatroom={setSelectedChatroom} />
      </div>

      {/* Right side chat room */}
      <div className="flex-grow w-9/12">
        {selectedChatroom ? (
          <>
            <ChatRoom user={user} selectedChatroom={selectedChatroom} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-full">
              <div className="text-2xl text-gray-400">Select a chatroom</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
