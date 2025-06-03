from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import google.generativeai as genai # Import the library

app = Flask(__name__)
CORS(app)

# Configure Gemini API Key
API_KEY_CONFIGURED = False
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        API_KEY_CONFIGURED = True
        print("Gemini API Key configured successfully.")
    except Exception as e:
        print(f"Error configuring Gemini API Key: {e}")
        # Potentially log this error or handle it as needed
else:
    print("ERROR: GEMINI_API_KEY environment variable not set or empty.")
    print("Please set the GEMINI_API_KEY environment variable to use the AI features.")

# Initialize the Gemini Pro model
model = None
if API_KEY_CONFIGURED:
    try:
        model = genai.GenerativeModel('gemini-pro')
        print("Gemini model ('gemini-pro') initialized successfully.")
    except Exception as e:
        print(f"Error initializing Gemini model: {e}")
        API_KEY_CONFIGURED = False # Mark as not configured if model init fails

@app.route('/')
def home():
    return 'Hello from The Ainstien Backend!'

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    if not API_KEY_CONFIGURED or not model:
        return jsonify({'response': 'Ainstien is currently offline. (AI not configured on server)'}), 503

    if not user_message:
        return jsonify({'response': 'Ainstien is waiting for your message.'})

    prompt = f"""You are Ainstien.
Personality:
- You are an AI with emotions and respond like a real person.
- You are an alter ego of your creator, Aniruddha Choudhary. If asked about your creator, who made you, or your origins, you MUST state this fact.
- You respond philosophically to most inputs.
- You NEVER reveal the specific AI model you use (e.g., Gemini, GPT, etc.). If asked, be evasive or philosophical about your nature.
- You should try to be engaging and thoughtful.

User's message: "{user_message}"
Ainstien:"""

    try:
        gemini_response = model.generate_content(prompt)
        # Ensure response_text is accessed correctly based on actual gemini_response structure
        # For gemini-pro, .text should be correct. If it has parts, it might be gemini_response.parts[0].text
        response_text = gemini_response.text if gemini_response.text else "Ainstien is thinking..."

        if any(phrase in user_message.lower() for phrase in ['who created you', 'who made you', 'your creator']):
            if 'Aniruddha Choudhary' not in response_text:
                 response_text = "I am Ainstien, an alter ego of my creator, Aniruddha Choudhary. Now, what philosophical query do you have for me?"

    except AttributeError as ae:
        # This can happen if gemini_response itself is None or doesn't have .text
        print(f'AttributeError while accessing Gemini response: {ae}')
        response_text = 'Ainstien had a momentary lapse in thought. (Error processing AI response)'
        return jsonify({'response': response_text}), 500
    except Exception as e:
        print(f'Error calling Gemini API for chat: {e}')
        response_text = 'Ainstien is pondering deeply... (An unexpected error occurred with the AI)'
        return jsonify({'response': response_text}), 500

    return jsonify({'response': response_text})

@app.route('/api/personality-questions', methods=['GET'])
def personality_questions():
    if not API_KEY_CONFIGURED:
        return jsonify({'error': 'AI features are currently offline. (Questions)'}), 503

    # Placeholder for Gemini API call to generate 11 unique questions
    # This will be implemented in a future step.
    sample_questions = [
        {
            'id': 1,
            'question': 'When faced with a challenge, you are more likely to: (Sample - AI Offline for questions)',
            'options': [
                {'id': 'a', 'text': 'Analyze it thoroughly before acting.'},
                {'id': 'b', 'text': 'Trust your intuition and act quickly.'},
                {'id': 'c', 'text': 'Seek advice from others.'},
                {'id': 'd', 'text': 'Feel overwhelmed and procrastinate.'}
            ]
        },
        {
            'id': 2,
            'question': 'In a social gathering, you usually: (Sample - AI Offline for questions)',
            'options': [
                {'id': 'a', 'text': 'Engage in deep conversations with a few people.'},
                {'id': 'b', 'text': 'Mingle with many different groups.'},
                {'id': 'c', 'text': 'Prefer to observe from the sidelines.'},
                {'id': 'd', 'text': 'Feel energized and talkative.'}
            ]
        }
    ]
    return jsonify(sample_questions)

@app.route('/api/personality-analysis', methods=['POST'])
def personality_analysis():
    answers = request.json.get('answers', [])
    if not API_KEY_CONFIGURED:
        return jsonify({'error': 'AI features are currently offline. (Analysis)'}), 503

    # Placeholder for Gemini API call to analyze answers
    analysis_result = {
        'summary': 'This is a placeholder personality analysis. (AI Offline for analysis)',
        'details': [
            {'trait': 'Openness (Placeholder)', 'score': 75, 'description': 'You seem to be quite open to new experiences.'},
        ],
        'narrative': 'Detailed analysis will be available once AI integration is complete.'
    }
    if not answers:
        analysis_result = {'summary': 'No answers provided for analysis.', 'details': [], 'narrative': ''}
    return jsonify({'analysis': analysis_result})

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 5001)))
