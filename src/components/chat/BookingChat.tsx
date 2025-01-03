import React, { useState, useEffect, useRef } from 'react';
import { useProfileStore } from '../../stores/profileStore';
import { useBookingStore } from '../../stores/bookingStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface BookingChatProps {
  bookingId: string;
  recipientId: string;
}

export function BookingChat({ bookingId, recipientId }: BookingChatProps) {
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, fetchMessages } = useBookingStore();
  const { profile } = useProfileStore();

  useEffect(() => {
    fetchMessages(bookingId);
    const interval = setInterval(() => fetchMessages(bookingId), 5000);
    return () => clearInterval(interval);
  }, [bookingId, fetchMessages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(bookingId, recipientId, message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-black rounded-lg shadow-md">
      {/* Chat Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold">Booking Chat</h3>
        <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === profile?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender_id === profile?.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-black'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" variant="yellow">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
