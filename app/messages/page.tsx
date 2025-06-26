"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase-context";
import MessagesWithUser from "@/app/messages/user-message-box";

interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  last_message: string | null;
  user1_name: string;
  user2_name: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  );
}

function useChats() {
  const { user, loading } = useSupabase();
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    async function fetchChats() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetch("/api/chats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!result.ok) {
          throw new Error("Failed to fetch chats!");
        } else {
          const data = await result.json();
          setChats(data.data || []);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch chats!");
      } finally {
        setIsLoading(false);
      }
    }

    fetchChats();
  }, [user, loading]);

  return { chats, error, isLoading };
}

function UsernameBox({
  chat,
  selectedChat,
  setSelectedChat,
}: {
  chat: Chat;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}) {
  return (
    <div
      key={chat.id}
      onClick={() => setSelectedChat(chat)}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        selectedChat?.id === chat.id
          ? "bg-emerald-50 border border-emerald-200"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {chat.user2_name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {chat.last_message || "No messages yet"}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <p className="text-xs text-gray-500">
            {new Date(chat.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MessagePage() {
  const { user, loading } = useSupabase();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { chats, isLoading, error } = useChats();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        </div>

        <div className="flex h-[600px]">
          {/* Chat List Sidebar */}
          <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
            <div className="p-4 space-y-2">
              {chats.map((chat) => (
                <div key={chat.id}>
                  <UsernameBox
                    chat={chat}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1">
            {selectedChat ? (
              <MessagesWithUser
                userId={
                  selectedChat.user2_id === user?.id
                    ? selectedChat.user1_id
                    : selectedChat.user2_id
                }
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
