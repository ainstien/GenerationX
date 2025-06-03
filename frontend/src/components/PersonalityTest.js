import React, { useState, useEffect } from 'react';

function PersonalityTest() {
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/personality-questions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestionData(data);
      } catch (error) {
        console.error('Error fetching personality question:', error);
        setError('Failed to load question. Please try again later.');
      }
    };

    fetchQuestion();
  }, []); // Empty dependency array means this runs once on mount

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  if (error) {
    return <div style={{ color: 'red', padding: '20px', margin: '20px', border: '1px solid #fcc' }}>{error}</div>;
  }

  if (!questionData) {
    return <div style={{ padding: '20px', margin: '20px' }}>Loading personality question...</div>;
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
      <h2>Personality Test</h2>
      <p><strong>Question:</strong> {questionData.question}</p>
      <form>
        {questionData.options && questionData.options.map(option => (
          <div key={option.id}>
            <input
              type='radio'
              id={option.id}
              name='personalityOption'
              value={option.id}
              checked={selectedOption === option.id}
              onChange={handleOptionChange}
            />
            <label htmlFor={option.id} style={{ marginLeft: '5px' }}>{option.text}</label>
          </div>
        ))}
      </form>
      {selectedOption && <p style={{ marginTop: '10px' }}>You selected: {selectedOption}</p>}
      {/* Further functionality like 'Next Question' or 'Submit' will be added later */}
    </div>
  );
}

export default PersonalityTest;
