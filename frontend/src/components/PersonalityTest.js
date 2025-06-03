import React, { useState, useEffect } from 'react';
import PersonalityAnalysisDisplay from './PersonalityAnalysisDisplay';

function PersonalityTest() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAiOffline, setIsAiOffline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const resetTestState = () => {
    setQuestions([]); setCurrentQuestionIndex(0); setSelectedAnswers({}); setError('');
    setIsLoading(true); setIsAiOffline(false); setIsSubmitting(false); setAnalysisResult(null);
  };

  const fetchInitialQuestions = async () => {
    resetTestState();
    try {
      const response = await fetch('http://localhost:5001/api/personality-questions');
      const data = await response.json();
      if (!response.ok) {
        setIsAiOffline(response.status === 503 || (data.error && data.error.includes('offline')));
        throw new Error(data.error || 'Network response was not ok');
      }
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        const initialAnswers = {};
        data.questions.forEach(q => { initialAnswers[q.id] = null; });
        setSelectedAnswers(initialAnswers);
      } else {
        setError(data.error || 'No questions received. AI might be having trouble generating them.');
        setQuestions([]);
      }
    } catch (err) {
      console.error('Error fetching personality questions:', err.message);
      setError('Failed to load questions. ' + err.message);
      setQuestions([]);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchInitialQuestions(); }, []);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (Object.values(selectedAnswers).some(ans => ans === null)) {
      alert('Please answer all questions before submitting.'); return;
    }
    setIsSubmitting(true); setError('');
    try {
      const response = await fetch('http://localhost:5001/api/personality-analysis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      const data = await response.json();
      if (!response.ok) {
        setIsAiOffline(response.status === 503 || (data.error && data.error.includes('offline')));
        throw new Error(data.error || 'Analysis request failed');
      }
      setAnalysisResult(data.analysis);
    } catch (err) {
      console.error('Error submitting analysis:', err.message);
      setError('Failed to get analysis. ' + err.message);
    } finally { setIsSubmitting(false); }
  };

  if (analysisResult) {
    return <PersonalityAnalysisDisplay analysisResult={analysisResult} onRetakeTest={fetchInitialQuestions} />;
  }

  const commonMessageStyles = 'text-center p-6 text-lg rounded-md shadow-md';
  if (isLoading) return <div className={`${commonMessageStyles} bg-blue-50 text-blue-700 border border-blue-200`}>Loading personality questions...</div>;
  if (error && !isAiOffline) return <div className={`${commonMessageStyles} bg-red-50 text-red-700 border border-red-200`}>{error}</div>;
  if (isAiOffline) return <div className={`${commonMessageStyles} bg-yellow-50 text-yellow-700 border border-yellow-200`}>Personality Test AI is currently offline. Please try again later.</div>;
  if (questions.length === 0 && !isLoading) return <div className={`${commonMessageStyles} bg-gray-50 text-gray-700 border border-gray-200`}>No personality questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <div className={`${commonMessageStyles} bg-gray-50 text-gray-700 border border-gray-200`}>Please wait...</div>;

  return (
    <div className='max-w-3xl mx-auto p-6 md:p-8 bg-white shadow-2xl rounded-xl border border-gray-200'>
      <h2 className='text-3xl font-bold text-gray-800 text-center mb-2'>
        Personality Test
      </h2>
      <p className='text-center text-gray-500 mb-6 text-sm'>Question {currentQuestionIndex + 1} of {questions.length}</p>

      <div className='p-6 mb-6 bg-indigo-50 border border-indigo-200 rounded-lg shadow min-h-[120px] flex items-center justify-center'>
        <p className='text-xl text-indigo-800 text-center'><strong>{currentQuestion.question_text}</strong></p>
      </div>

      <form className='space-y-4 mb-8'>
        {currentQuestion.options && currentQuestion.options.map(option => (
          <label
            key={option.option_id}
            htmlFor={`${currentQuestion.id}-${option.option_id}`}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-150 ease-in-out
                        ${selectedAnswers[currentQuestion.id] === option.option_id ? 'border-indigo-500 bg-indigo-100 shadow-lg scale-105' : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'}
                        ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input
              type='radio'
              id={`${currentQuestion.id}-${option.option_id}`}
              name={`question-${currentQuestion.id}`}
              value={option.option_id}
              checked={selectedAnswers[currentQuestion.id] === option.option_id}
              onChange={() => handleOptionChange(currentQuestion.id, option.option_id)}
              disabled={isSubmitting}
              className='form-radio h-5 w-5 text-indigo-600 focus:ring-0 focus:ring-offset-0 invisible' // Hide actual radio, style label
            />
            <span className='ml-3 text-md font-medium text-gray-700'>{option.option_text}</span>
          </label>
        ))}
      </form>

      <div className='flex justify-between items-center mt-6'>
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className='px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className='px-6 py-3 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.values(selectedAnswers).some(ans => ans === null)}
            className='px-6 py-3 text-sm font-semibold text-white bg-green-600 border border-transparent rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Analyzing...' : 'Finish & Get Analysis'}
          </button>
        )}
      </div>
    </div>
  );
}
export default PersonalityTest;
