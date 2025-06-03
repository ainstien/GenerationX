import React, { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null); // For accordion behavior

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
      answer: 'Ainstien uses a powerful AI model (Gemini) to understand and generate human-like responses. It is designed to be philosophical, identify as an alter ego of its creator, and never reveal the specific AI model it uses.'
    },
    {
      question: 'How are the personality test questions generated?',
      answer: 'The 11 personality test questions are dynamically generated for each session using the Gemini AI, ensuring a unique experience every time. The analysis is also AI-generated based on your responses.'
    },
    {
      question: 'Is my data safe?',
      answer: 'We prioritize user privacy. Chat interactions and personality test responses are processed to provide the service. We do not store your personal test results or chat logs with personal identifiers without explicit consent. (This is a general statement; a production app would have a detailed privacy policy linked here).'
    }
  ];

  const toggleFAQ = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='max-w-3xl mx-auto p-4 md:p-6 bg-white shadow-xl rounded-lg border border-gray-200'>
      <h2 className='text-3xl font-bold text-gray-800 text-center mb-8 border-b-2 border-indigo-500 pb-4'>Frequently Asked Questions</h2>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <div key={index} className='border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <button
              onClick={() => toggleFAQ(index)}
              className='w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none transition-colors duration-150'
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
              </svg>
            </button>
            {openIndex === index && (
              <div className='p-5 border-t border-gray-200 bg-white'>
                <p className='text-gray-600 leading-relaxed'>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default FAQ;
