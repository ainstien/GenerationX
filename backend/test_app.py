import pytest
from app import app as flask_app # Import your Flask app instance

@pytest.fixture
def app():
    # Setup: any setup needed before yielding the app
    flask_app.config.update({
        "TESTING": True,
    })
    # You might want to mock os.environ.get('GEMINI_API_KEY') here
    # if your app initialization relies heavily on it during tests
    # or ensure your tests can run with API_KEY_CONFIGURED = False
    yield flask_app
    # Teardown: any cleanup after tests

@pytest.fixture
def client(app):
    return app.test_client()

def test_home_endpoint(client):
    """Test the home endpoint."""
    response = client.get('/')
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['message'] == 'Hello from The Ainstien Backend!'

def test_status_endpoint_without_api_key(client):
    """Test the status endpoint when GEMINI_API_KEY is not set."""
    # In a typical test environment, GEMINI_API_KEY would not be set,
    # so API_KEY_CONFIGURED should be False.
    response = client.get('/api/status')
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'ai_service_configured' in json_data
    assert 'model_initialized' in json_data
    assert json_data['ai_service_configured'] is False
    assert json_data['model_initialized'] is False

def test_chat_endpoint_when_ai_offline(client):
    """Test the chat endpoint when AI services are offline (no API key)."""
    response = client.post('/api/chat', json={'message': 'Hello'})
    assert response.status_code == 503
    json_data = response.get_json()
    assert 'Ainstien is currently offline' in json_data['response']

def test_personality_questions_endpoint_when_ai_offline(client):
    """Test the personality questions endpoint when AI services are offline."""
    response = client.get('/api/personality-questions')
    assert response.status_code == 503
    json_data = response.get_json()
    assert 'Personality Test AI is currently offline' in json_data['error']
    assert json_data['questions'] == []

def test_personality_analysis_endpoint_when_ai_offline(client):
    """Test the personality analysis endpoint when AI services are offline."""
    response = client.post('/api/personality-analysis', json={'answers': {'q1': 'a'}})
    assert response.status_code == 503
    json_data = response.get_json()
    assert 'Personality Analysis AI is currently offline' in json_data['error']

def test_chat_endpoint_empty_message(client):
    """Test the chat endpoint with an empty message when AI is (theoretically) online."""
    # This test implicitly assumes API_KEY_CONFIGURED could be true,
    # but the more specific test is 'test_chat_endpoint_when_ai_offline'.
    # If AI is offline, it hits that 503 first. If online, it should give 400 for empty.
    # For now, we only test the offline path directly.
    # To properly test the 400, we'd need to mock API_KEY_CONFIGURED = True and model existence.
    # For this setup, we are testing the state where API key is NOT set.
    if not flask_app.config.get("API_KEY_CONFIGURED", False): # Accessing the app's var
        response = client.post('/api/chat', json={'message': ''})
        assert response.status_code == 503 # Expect 503 due to AI offline
    # else:
    #   # This part would run if you mock API_KEY_CONFIGURED to True
    #   response = client.post('/api/chat', json={'message': ''})
    #   assert response.status_code == 400
    #   json_data = response.get_json()
    #   assert 'Ainstien is waiting for your message' in json_data['response']

# To run these tests:
# 1. Ensure you are in the 'backend' directory.
# 2. Ensure your virtual environment (if any) is activated.
# 3. Run 'pytest' in your terminal.
# Note: Tests requiring an actual GEMINI_API_KEY to be set and valid to test Gemini responses
# would need that key available in the test environment or extensive mocking of the genai library.
# These current tests focus on behavior when the API key is *not* available.
