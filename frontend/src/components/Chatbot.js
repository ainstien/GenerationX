import React, { useState, useEffect, useRef } from 'react'; // Added useEffect, useRef

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAiOffline, setIsAiOffline] = useState(false);
  const chatEndRef = useRef(null); // For scrolling to bottom

  // Scroll to bottom effect
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessageEntry = { type: 'user', text: message };
    const newChatHistory = [...chatHistory, userMessageEntry];
    setChatHistory(newChatHistory);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageEntry.text }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 503 || (data.response && data.response.includes('offline'))) setIsAiOffline(true);
        setChatHistory([...newChatHistory, { type: 'bot', text: data.response || 'An error occurred.', isError: true }]);
      } else {
        setIsAiOffline(false);
        setChatHistory([...newChatHistory, { type: 'bot', text: data.response }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsAiOffline(false);
      setChatHistory([...newChatHistory, { type: 'bot', text: 'Sorry, I couldn\'t connect to Ainstien. Please check your connection.', isError: true }]);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4 md:p-6 bg-white shadow-xl rounded-lg border border-gray-200'>
      <h2 className='text-3xl font-bold text-gray-800 text-center mb-6 border-b-2 border-indigo-500 pb-3'>Ainstien Chatbot</h2>

      {isAiOffline && (
        <div className='p-3 mb-4 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md shadow-sm'>
          Ainstien's AI capabilities are currently offline. This might be due to server configuration.
        </div>
      )}

      {/* Chat history */}
      <div className='h-96 overflow-y-auto p-4 mb-4 bg-gray-50 border border-gray-200 rounded-md custom-scrollbar'>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex mb-3 ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${
                chat.type === 'user'
                  ? 'bg-indigo-500 text-white'
                  : (chat.isError ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800')
              }`}
            >
              <p className='text-sm break-words'>{chat.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Anchor for scrolling */}
      </div>

      {/* Message input */}
      <div className='flex space-x-2'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isAiOffline && handleSendMessage()}
          placeholder={isAiOffline ? 'AI is offline' : 'Chat with Ainstien...'}
          disabled={isAiOffline}
          className='flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow disabled:bg-gray-100 disabled:cursor-not-allowed'
        />
        <button
          onClick={handleSendMessage}
          disabled={isAiOffline || !message.trim()}
          className='px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          Send
        </button>
      </div>
    </div>
  );
}
export default Chatbot;
