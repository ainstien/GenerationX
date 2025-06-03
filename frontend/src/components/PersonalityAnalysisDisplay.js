import React from 'react';

const renderScoreDescription = (description) => {
  let colorClass = 'bg-gray-200 text-gray-700';
  if (description.toLowerCase().includes('high')) colorClass = 'bg-green-200 text-green-800';
  if (description.toLowerCase().includes('low')) colorClass = 'bg-red-200 text-red-800';
  if (description.toLowerCase().includes('moderate')) colorClass = 'bg-yellow-200 text-yellow-800';
  if (description.toLowerCase().includes('introversion')) colorClass = 'bg-blue-200 text-blue-800';
  if (description.toLowerCase().includes('extroversion')) colorClass = 'bg-purple-200 text-purple-800';
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>{description}</span>;
};

function PersonalityAnalysisDisplay({ analysisResult, onRetakeTest }) {
  if (!analysisResult) return null;
  const { overall_summary, key_traits, detailed_narrative, compatibility_note } = analysisResult;

  return (
    <div className='max-w-3xl mx-auto p-6 md:p-8 bg-white shadow-2xl rounded-xl border border-gray-200'>
      <h2 className='text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight'>Your Personality Analysis</h2>
      <section className='mb-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-inner'>
        <h3 className='text-2xl font-bold text-indigo-700 mb-3'>Overall Summary</h3>
        <p className='text-gray-700 text-lg leading-relaxed'>{overall_summary}</p>
      </section>
      <section className='mb-8'>
        <h3 className='text-2xl font-bold text-gray-700 mb-5 text-center'>Key Traits Unveiled</h3>
        <div className='grid md:grid-cols-2 gap-6'>
          {key_traits && key_traits.map((trait, index) => (
            <div key={index} className='p-5 bg-gray-50 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300'>
              <h4 className='text-xl font-semibold text-gray-700 mb-2'>{trait.trait_name}</h4>
              <div className='mb-3'>
                {renderScoreDescription(trait.score_description)}
              </div>
              <p className='text-sm text-gray-600 leading-normal'>{trait.elaboration}</p>
            </div>
          ))}
        </div>
      </section>
      <section className='mb-8 p-6 bg-teal-50 rounded-lg shadow-inner'>
        <h3 className='text-2xl font-bold text-teal-700 mb-3'>Detailed Narrative</h3>
        <p className='text-gray-700 text-lg leading-relaxed whitespace-pre-line'>{detailed_narrative}</p>
      </section>
      {compatibility_note && (
        <section className='p-6 bg-pink-50 rounded-lg shadow-inner'>
          <h3 className='text-2xl font-bold text-pink-700 mb-3'>Ainstien\'s Philosophical Note</h3>
          <p className='text-gray-700 text-lg leading-relaxed italic'>{compatibility_note}</p>
        </section>
      )}
      <div className='text-center mt-10'>
        <button
          onClick={onRetakeTest} // Use the passed function
          className='px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors'
        >
          Retake Test
        </button>
      </div>
    </div>
  );
}
export default PersonalityAnalysisDisplay;
