"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export default function MessagePage() {
  const { supabase, user, loading } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    // // Fetch existing messages
    // const fetchMessages = async () => {
    //   const { data, error } = await supabase
    //     .from("messages")
    //     .select("*")
    //     .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    //     .order("created_at", { ascending: true });

    //   if (data) {
    //     setMessages(data);
    //   }
    // };

    // fetchMessages();

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
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId.trim()) return;


    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newMessage,
        receiver_id: receiverId,
      }),
    });
    if(!response.ok) {
      console.error("Failed to send message");
      return;
    }

    const data = await response.json();
    const messageData = data.data;
    const messageId = messageData.id;

    setMessages((current) => [...current, {
      id: messageId,
      content: newMessage,
      sender_id: user?.id || "",
      receiver_id: receiverId,
      created_at: new Date().toISOString(),
    }]);

    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        </div>
        
        <div className="h-[600px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`max-w-[80%] ${
                message.sender_id === user?.id
                  ? "ml-auto bg-emerald-50 border-emerald-100"
                  : "mr-auto bg-gray-50"
              }`}
            >
              <CardContent className="p-3">
                <p className="text-sm text-gray-800">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter receiver ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
    </div>
  );
}
