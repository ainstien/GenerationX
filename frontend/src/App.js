import React from 'react';
import './App.css';
import Chatbot from './components/Chatbot';
import PersonalityTest from './components/PersonalityTest';
import FAQ from './components/FAQ'; // Import FAQ

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>The Ainstien</h1>
        <p>Welcome to The Ainstien, your personal AI companion and personality analyst.</p>
      </header>

      {/* For now, components are stacked. Routing will be added later. */}
      <Chatbot />
      <PersonalityTest />
      <FAQ /> {/* Add FAQ component here */}

      <main>
        <section id='about'>
          <h2>About the App</h2>
          <p>
            The Ainstien offers two main features:
            <ul>
              <li><strong>Ainstien Chatbot:</strong> Engage in philosophical conversations with Ainstien, an AI with a unique personality.</li>
              <li><strong>Personality Test:</strong> Discover insights into your personality through a unique set of questions generated fresh for you.</li>
            </ul>
          </p>
        </section>
        <section id='navigation'>
          <h2>How to Navigate</h2>
          <p>Use the navigation bar (to be implemented) to switch between the Chatbot, Personality Test, and FAQ page.</p>
        </section>
        <section id='usage'>
          <h2>How to Use</h2>
          <p>
            <strong>Chatbot:</strong> Simply type your questions or thoughts into the chat interface and Ainstien will respond.
            <br />
            <strong>Personality Test:</strong> Answer the 11 questions presented to you, and receive a detailed analysis of your personality.
          </p>
        </section>
      </main>
      <footer>
        <p>Made by Aniruddha Choudhary</p>
      </footer>
    </div>
  );
}

export default App;
