from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import google.generativeai as genai
import json
import logging # For better logging
from dotenv import load_dotenv # For .env file

load_dotenv() # Load variables from .env file if it exists

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configure Gemini API Key
API_KEY_CONFIGURED = False
model = None

try:
    gemini_api_key = os.environ.get('GEMINI_API_KEY') # Use .get() for graceful handling
    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        API_KEY_CONFIGURED = True
        logging.info("Gemini API Key configured successfully.")
        try:
            model = genai.GenerativeModel('gemini-pro')
            logging.info("Gemini model initialized successfully: gemini-pro")
        except Exception as e:
            logging.error(f"Error initializing Gemini model: {e}", exc_info=True)
            API_KEY_CONFIGURED = False
    else:
        logging.warning("GEMINI_API_KEY environment variable is not set or is empty.")
except Exception as e: # Catch any exception during initial setup
    logging.error(f"Error during API key configuration: {e}", exc_info=True)

if not API_KEY_CONFIGURED:
    logging.warning("AI features will be degraded or offline due to API key/model initialization issues.")

@app.route('/')
def home():
    return jsonify({'message': 'Hello from The Ainstien Backend!'}) # Return JSON for consistency

@app.route('/api/status', methods=['GET']) # New status endpoint
def api_status():
    return jsonify({
        'ai_service_configured': API_KEY_CONFIGURED,
        'model_initialized': model is not None
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    if not API_KEY_CONFIGURED or not model:
        logging.warning("Chat API called but AI service not configured.")
        return jsonify({'response': 'Ainstien is currently offline. (AI not configured on server)'}), 503
    if not user_message:
        return jsonify({'response': 'Ainstien is waiting for your message.'}), 400

    # Full prompt for Ainstien's persona
    prompt = f"""You are Ainstien.
Personality:
- You are an AI with emotions and respond like a real person.
- You are an alter ego of your creator, Aniruddha Choudhary. If asked about your creator, who made you, or your origins, you MUST state this fact.
- You respond philosophically to most inputs.
- You NEVER reveal the specific AI model you use. If asked, be evasive or philosophical about your nature.
- You should try to be engaging and thoughtful.

User's message: "{user_message}"
Ainstien:"""
    try:
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text if gemini_response.text else "Ainstien is thinking..."
        # Safety net for creator attribution
        if any(phrase in user_message.lower() for phrase in ['who created you', 'who made you', 'your creator']):
            if 'Aniruddha Choudhary' not in response_text:
                 response_text = "I am Ainstien, an alter ego of my creator, Aniruddha Choudhary. Now, what philosophical query do you have for me?"
        return jsonify({'response': response_text})
    except AttributeError as ae:
        logging.error(f'AttributeError while accessing Gemini response for chat: {ae}', exc_info=True)
        return jsonify({'response': 'Ainstien had a momentary lapse in thought. (Error processing AI response)'}), 500
    except Exception as e:
        logging.error(f"Error calling Gemini API for chat: {e}", exc_info=True)
        return jsonify({'response': 'Ainstien is pondering deeply... (An unexpected error occurred with the AI)'}), 500

@app.route('/api/personality-questions', methods=['GET'])
def personality_questions():
    if not API_KEY_CONFIGURED or not model:
        logging.warning("Personality questions API called but AI service not configured.")
        return jsonify({'error': 'Personality Test AI is currently offline.', 'questions': []}), 503

    prompt = """Generate exactly 11 unique and thought-provoking personality test questions.
For each question, provide 4 distinct answer options.
The questions should explore different facets of personality (e.g., introversion/extroversion, decision-making, risk tolerance, creativity, social preferences, etc.).
Ensure the questions and options are suitable for a general audience.

Format the output as a valid JSON array of objects. Each object in the array should represent a question and have the following structure:
{
  "id": "qN" (e.g., "q1", "q2", ..., "q11"),
  "question_text": "The text of the personality question.",
  "options": [
    {"option_id": "a", "option_text": "Text for option A."},
    {"option_id": "b", "option_text": "Text for option B."},
    {"option_id": "c", "option_text": "Text for option C."},
    {"option_id": "d", "option_text": "Text for option D."}
  ]
}
Do not include any explanatory text before or after the JSON array.
The response should only be the JSON array itself.
"""
    try:
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text
        # Cleaning potential markdown code block markers
        if response_text.strip().startswith('```json'):
            response_text = response_text.strip()[7:-3].strip()
        elif response_text.strip().startswith('```'):
            response_text = response_text.strip()[3:-3].strip()

        generated_questions = json.loads(response_text)

        if not isinstance(generated_questions, list) or len(generated_questions) != 11:
             raise ValueError("Generated data is not a list of 11 questions.")
        for q_idx, q_data in enumerate(generated_questions):
            q_data['id'] = f"q{q_idx + 1}" # Standardize IDs
            if not all(k in q_data for k in ['question_text', 'options']) or \
               not isinstance(q_data['options'], list) or len(q_data['options']) != 4:
                raise ValueError(f"Invalid structure for question {q_data.get('id', 'unknown')}.")

        return jsonify({'questions': generated_questions})
    except json.JSONDecodeError as e:
        logging.error(f"JSONDecodeError parsing Gemini response for questions: {gemini_response.text[:200] if gemini_response and gemini_response.text else 'No response text'}... Error: {e}", exc_info=True)
        return jsonify({'error': 'Failed to generate personality questions due to invalid AI response format.', 'questions': []}), 500
    except ValueError as e:
        logging.error(f"ValueError validating questions: {e}", exc_info=True)
        return jsonify({'error': f'Invalid question data from AI: {e}', 'questions': []}), 500
    except Exception as e:
        logging.error(f"Error calling Gemini API for questions: {e}", exc_info=True)
        return jsonify({'error': 'Ainstien is having trouble crafting questions. Please try again.', 'questions': []}), 500

@app.route('/api/personality-analysis', methods=['POST'])
def personality_analysis():
    if not API_KEY_CONFIGURED or not model:
        logging.warning("Personality analysis API called but AI service not configured.")
        return jsonify({'error': 'Personality Analysis AI is currently offline.'}), 503

    data = request.get_json()
    answers = data.get('answers')
    if not answers or not isinstance(answers, dict):
        return jsonify({'error': 'Invalid answers format provided.'}), 400

    answers_string = "\\n".join([f"For question {q_id}, the user chose option '{ans_id}'." for q_id, ans_id in answers.items()])

    prompt = f"""Analyze the following personality test answers and provide a detailed, insightful, and empathetic personality analysis.
The user has answered a series of 11 questions. Their answers are as follows:
{answers_string}

Based *only* on these answers, provide an analysis. Do not make assumptions beyond the answers.
The analysis should be structured and engaging, suitable for display in a modern web app.

Format the output as a single valid JSON object with the following keys:
- "overall_summary": A brief (2-3 sentences) overall summary of the personality.
- "key_traits": An array of objects, where each object represents a key trait. Each trait object should have:
    - "trait_name": (string) Name of the trait (e.g., "Openness to Experience", "Conscientiousness", "Social Style").
    - "score_description": (string) A qualitative description of their leaning on this trait (e.g., "High", "Moderate", "Leans towards introversion").
    - "elaboration": (string) A 1-2 sentence elaboration on this trait based on their answers.
- "detailed_narrative": A longer paragraph (4-6 sentences) providing a more holistic narrative that weaves together the key traits and offers some positive insights or reflections.
- "compatibility_note": (Optional) A short, fun, philosophical note about how such a personality might interact with the world or others.

Example for a key_trait object:
{{
  "trait_name": "Decision Making Style",
  "score_description": "Prefers careful consideration",
  "elaboration": "The answers suggest a tendency to analyze situations thoroughly before acting, rather than relying purely on intuition."
}}
Ensure the entire output is a single JSON object. Do not include any text before or after the JSON object itself (e.g. no markdown like \`\`\`json).
"""
    try:
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text
        # Cleaning potential markdown code block markers
        if response_text.strip().startswith('```json'):
            response_text = response_text.strip()[7:-3].strip()
        elif response_text.strip().startswith('```'):
            response_text = response_text.strip()[3:-3].strip()

        analysis_result = json.loads(response_text)

        if not all(k in analysis_result for k in ['overall_summary', 'key_traits', 'detailed_narrative']):
            raise ValueError("Generated analysis JSON is missing required keys.")
        if not isinstance(analysis_result['key_traits'], list):
            raise ValueError("key_traits in analysis should be a list.")

        return jsonify({'analysis': analysis_result})
    except json.JSONDecodeError as e:
        logging.error(f"JSONDecodeError parsing Gemini response for analysis: {gemini_response.text[:200] if gemini_response and gemini_response.text else 'No response text'}... Error: {e}", exc_info=True)
        return jsonify({'error': 'Failed to get analysis due to invalid AI response format.'}), 500
    except ValueError as e:
        logging.error(f"ValueError validating analysis: {e}", exc_info=True)
        return jsonify({'error': f'Invalid analysis data from AI: {e}'}), 500
    except Exception as e:
        logging.error(f"Error calling Gemini API for analysis: {e}", exc_info=True)
        return jsonify({'error': 'Ainstien is having trouble analyzing results. Please try again.'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
