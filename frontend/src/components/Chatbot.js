import React, { useState } from 'react';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newChatHistory = [...chatHistory, { type: 'user', text: message }];
    setChatHistory(newChatHistory);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setChatHistory([...newChatHistory, { type: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory([...newChatHistory, { type: 'bot', text: 'Sorry, I encountered an error.' }]);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
      <h2>Ainstien Chatbot</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
        {chatHistory.map((chat, index) => (
          <div key={index} style={{ textAlign: chat.type === 'user' ? 'right' : 'left', marginBottom: '5px' }}>
            <span style={{ background: chat.type === 'user' ? '#dcf8c6' : '#f1f0f0', padding: '5px 10px', borderRadius: '7px' }}>
              {chat.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        style={{ width: 'calc(100% - 90px)', padding: '10px' }}
      />
      <button onClick={handleSendMessage} style={{ width: '80px', padding: '10px' }}>Send</button>
    </div>
  );
}

export default Chatbot;
