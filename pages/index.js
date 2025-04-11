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

  const sugestões = [
    "Ajude-me a diagnosticar um caso suspeito de cinomose.",
    "Quais exames devo solicitar para um gato com anemia?",
    "Como conduzir o tratamento de uma piometra canina?",
    "Diferenciais clínicos de vômito crônico em cães",
    "Protocolos vacinais para animais resgatados",
    "Conduta diante de insuficiência renal em felinos",
  ];

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-50 to-rose-100 text-gray-800">
      <aside className="md:w-1/4 w-full p-4 md:p-6 border-b md:border-b-0 md:border-r border-rose-200 bg-white shadow-md">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-rose-900">Sugestões clínicas</h2>
        <ul className="space-y-2">
          {sugestões.map((s, i) => (
            <li key={i}>
              <button
                onClick={() => setInput(s)}
                className="w-full text-left px-3 py-2 bg-rose-100 hover:bg-rose-200 rounded-xl text-sm"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex-1 p-4 md:p-6 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold text-rose-900 mb-4 text-center md:text-left">VetMint - IA para Veterinários</h1>

        <div className="flex-1 bg-white rounded-xl shadow p-4 overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-full md:max-w-[80%] ${msg.sender === 'user' ? 'ml-auto bg-rose-500 text-white' : 'bg-rose-100 text-rose-900'}`}
            >
              <p><strong>{msg.sender === 'user' ? 'Você' : 'VetMint'}:</strong> {msg.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida clínica..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-rose-500 text-white px-6 py-3 rounded-xl hover:bg-rose-600"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>

        <footer className="mt-8 text-sm text-center text-rose-800">
          © VetMint 2025 — IA Clínica para Médicos Veterinários
        </footer>
      </section>
    </main>
  );
}
