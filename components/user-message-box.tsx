"use client";

import { useState, useEffect, useRef } from "react";
import { useSupabase } from "@/lib/supabase-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  reated_at: string;
}

export default function MessagesWithUser({ userId }: { userId: string }) {
  const { supabase, user, loading } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    // Fetch existing messages
    const fetchMessages = async () => {
      const result = await fetch(`/api/messages/${userId}`);
      const data = await result.json();
      setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
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
            setMessages((current) => [...current, payload.new as Message]);
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
      return;
    }

    const data = await response.json();
    const [messageData] = data.data;
    const messageId = messageData.id;

    console.log(messageData);

    setMessages((current) => [
      ...current,
      {
        id: messageId,
        content: newMessage,
        sender_id: user?.id || "",
        receiver_id: userId,
        reated_at: new Date().toISOString(),
      },
    ]);

    setNewMessage("");
  };

  const deleteMessage = async (messageId: string) => {
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
      console.error("Failed to delete message");
      return;
    }

    setMessages((current) => current.filter((message) => message.id !== messageId));
  }

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
