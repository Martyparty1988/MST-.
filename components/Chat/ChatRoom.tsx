
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../services/db';
import { ChatMessage } from '../../types';

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const msgs = await db.chatMessages.orderBy('timestamp').toArray();
    setMessages(msgs);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: 'worker-1',
      senderName: 'Martin S.',
      text: newMessage,
      timestamp: new Date(),
      read: false
    };

    await db.chatMessages.add(msg);
    setNewMessage('');
    fetchMessages();

    // Mock response from server/other worker
    setTimeout(async () => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'worker-2',
        senderName: 'Jan Admin',
        text: 'Rozumím, zkontroluju ty trackery na poli 175.',
        timestamp: new Date(),
        read: false
      };
      await db.chatMessages.add(reply);
      fetchMessages();
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-2xl mx-auto glass rounded-3xl overflow-hidden relative">
      <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500" />
        <div>
          <h3 className="font-bold">Firemní Chat</h3>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.senderId === 'worker-1' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.senderId === 'worker-1' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                : 'bg-white/10 text-white rounded-tl-none border border-white/5'
            }`}>
              <p className="text-[10px] font-bold text-white/40 mb-1">{m.senderName}</p>
              <p>{m.text}</p>
              <p className="text-[9px] text-white/30 mt-1 text-right">
                {new Date(m.timestamp).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-white/20 italic py-12">Historie chatu je prázdná.</p>}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
        <input 
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Napište zprávu..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
        />
        <button type="submit" className="bg-indigo-600 px-6 rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
          Odeslat
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
