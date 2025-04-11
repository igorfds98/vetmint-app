import { useState } from 'react';

export default function VetMint() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Erro ao responder. Tente novamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-pink-50 to-rose-100">
      <h1 className="text-3xl font-bold text-center text-rose-900 mb-6">VetMint - IA Veterinária</h1>
      <div className="bg-white rounded-lg shadow p-4 h-96 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-[80%] ${msg.sender === 'user' ? 'ml-auto bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'}`}
          >
            <p><strong>{msg.sender === 'user' ? 'Você' : 'VetMint'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua dúvida veterinária..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-rose-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </main>
  );
}
