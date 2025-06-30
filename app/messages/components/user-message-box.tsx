"use client";

import { useState, useEffect, useRef } from "react";
import { useSupabase } from "@/lib/supabase-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  reated_at: string;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  receiver?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

const getUserInitials = (
  user: { id: string; first_name: string; last_name: string } | undefined
) => {
  if (user?.first_name && user?.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`;
  }
  return "";
};

export default function MessagesWithUser({ userId }: { userId: string }) {
  const { supabase, user, loading } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch messages on load
  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const fetchMessages = async () => {
      try {
        const result = await fetch(`/api/messages/${userId}`);
        if (!result.ok) {
          setError("An error occurred while fetching messages!");
          return;
        }
        const data = await result.json();
        setMessages(data);
      } catch (err) {
        setError("An error occurred while fetching messages!");
      }
    };

    fetchMessages();
  }, [user, loading, userId]);

  // Subscribe to new messages
  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const channel = supabase
      .channel("room-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          if (
            payload.new.sender_id === userId &&
            payload.new.receiver_id === user.id
          ) {
            console.log("SETTING A MESSAGE SENT BY USER", payload.new);
            // Create a message object with the new format
            const newMessage: Message = {
              id: payload.new.id,
              content: payload.new.content,
              sender_id: payload.new.sender_id,
              receiver_id: payload.new.receiver_id,
              reated_at: payload.new.reated_at,
              sender: {
                id: payload.new.sender_id,
                first_name: "", // Will be populated when fetched
                last_name: "",
              },
              receiver: {
                id: payload.new.receiver_id,
                first_name: "", // Will be populated when fetched
                last_name: "",
              },
            };
            setMessages((current) => [...current, newMessage]);
          }
        }
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, loading, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          receiver_id: userId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send message");
        setError("An error occurred sending message!");
        setNewMessage("");
        return;
      }

      const data = await response.json();
      const [messageData] = data.data;
      const messageId = messageData.id;

      // Create a new message object with the sender and receiver data
      const newMessageObj: Message = {
        id: messageId,
        content: newMessage,
        sender_id: user?.id || "",
        receiver_id: userId,
        reated_at: new Date().toISOString(),
        sender: {
          id: user?.id || "",
          first_name: user?.user_metadata?.first_name || "",
          last_name: user?.user_metadata?.last_name || "",
        },
        receiver: {
          id: userId,
          first_name: "", // This will be populated when the message is fetched
          last_name: "",
        },
      };
      setMessages((current) => [...current, newMessageObj]);
    } catch (err) {
      setError("An error occurred sending message!");
    }

    setNewMessage("");
  };

  const deleteMessage = async (messageId: string) => {
    setError("");
    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
        }),
      });

      if (!response.ok) {
        setError("An error occurred deleting message!");
        return;
      }

      setMessages((current) =>
        current.filter((message) => message.id !== messageId)
      );
    } catch (err) {
      setError("An error occurred deleting message!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
      </div>

      {/* Recipient Header */}
      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700">
                {getUserInitials(
                  messages.length > 0 ? messages[0].receiver : undefined
                )}
              </span>
            </div>
            <div>
              <Link
                href={`/profile/${userId}`}
                className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors duration-200"
              >
                {messages.length > 0 &&
                messages[0].receiver?.first_name &&
                messages[0].receiver?.last_name
                  ? `${messages[0].receiver.first_name} ${messages[0].receiver.last_name}`
                  : "Loading..."}
              </Link>
              <p className="text-xs text-gray-500">Click to view profile</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} ref={bottomRef}>
            <Card
              className={`max-w-[80%] relative ${
                message.sender_id === user?.id
                  ? "ml-auto bg-emerald-50 border-emerald-100"
                  : "mr-auto bg-gray-50"
              }`}
            >
              {message.sender_id === user?.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMessage(message.id)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-500 hover:text-red-500"
                >
                  ×
                </Button>
              )}
              <CardContent className="p-3">
                <p className="text-sm text-gray-800">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.reated_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
