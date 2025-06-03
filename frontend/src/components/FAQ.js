import React from 'react';

function FAQ() {
  const faqs = [
    {
      question: 'What is The Ainstien?',
      answer: 'The Ainstien is a web application featuring an AI chatbot named Ainstien for philosophical discussions and a personality test that provides unique questions and detailed analysis.'
    },
    {
      question: 'Who created The Ainstien?',
      answer: 'The Ainstien is created by Aniruddha Choudhary.'
    },
    {
      question: 'How does the Ainstien chatbot work?',
      answer: 'Ainstien uses a powerful AI model to understand and generate human-like responses. It is designed to be philosophical and will tell you it is an alter ego of its creator if asked. It does not reveal the specific AI model it uses.'
    },
    {
      question: 'How are the personality test questions generated?',
      answer: 'The personality test questions are dynamically generated for each session using an advanced AI, ensuring a unique experience every time. The analysis is also AI-generated based on your responses.'
    },
    {
      question: 'Is my data safe?',
      answer: 'We prioritize user privacy. Chat interactions and personality test responses are processed to provide the service and are not stored long-term with personal identifiers without your consent. (Note: This is a placeholder answer; a real application would need a detailed privacy policy).'
    }
  ];

  const faqStyles = {
    container: {
      border: '1px solid #ccc',
      padding: '20px',
      margin: '20px',
      backgroundColor: '#f9f9f9'
    },
    item: {
      marginBottom: '20px',
      borderBottom: '1px solid #eee',
      paddingBottom: '15px'
    },
    question: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '5px'
    },
    answer: {
      color: '#555',
      lineHeight: '1.6'
    }
  };

  return (
    <div style={faqStyles.container}>
      <h2>Frequently Asked Questions (FAQ)</h2>
      {faqs.map((faq, index) => (
        <div key={index} style={faqStyles.item}>
          <p style={faqStyles.question}>{faq.question}</p>
          <p style={faqStyles.answer}>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

export default FAQ;
