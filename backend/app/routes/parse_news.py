from flask import Blueprint, request, jsonify
from ..utils.utils import get_qa_chain, get_qa_chain_different
import requests
from bs4 import BeautifulSoup
import json

def web_scraping(url):
    # Send a GET request to the URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract the text from the webpage, you can adjust to target specific tags
        text = ""
        for tag in soup.find_all(['p', 'div', 'span']):  # Adjust tag types as necessary
            text += tag.get_text(strip=True)
        
        return text
    else:
        raise Exception(f"Error: Unable to fetch URL content (status code: {response.status_code})")

bp = Blueprint('parse_news', __name__)

@bp.route('/parse_news', methods=['POST'])
def parse_news():
    try:
        # Get the URL from the request
        data = request.json
        url = data.get('url', '')

        if not url:
            return jsonify({'error': 'URL is required'}), 400

        # Scrape the data from the URL
        scraped_text = web_scraping(url)

        print("Printing scraped text: ")
        print(scraped_text)
        print(" :end of scraped text")

        # Initialize the QA chain
        qa_chain = get_qa_chain_different()

        # Example prompt with structured output format
        prompt = """
        Please respond to the following request without considering any previous context:

        You are an AI assistant tasked with extracting relevant news from the given text. Use the following JSON format for your response. If the text does not contain relevant news, return "No Stories Found".

        JSON Format:
        [
            {
                "header": "Example Header",
                "summary": [
                    "Example summary point 1.",
                    "Example summary point 2.",
                    "Example summary point 3."
                ]
            }
        ]

        Given Text:
        {scraped_text}

        Extract the most important news stories related to copper mining in Arizona from the above text.
        """

        qa_chain.memory.clear()

        # Run the prompt through the QA chain
        response = qa_chain.run({"context": scraped_text, "question": prompt})

        # Parse the response from the model
        try:
            # Clean and parse the response
            cleaned_response = response.strip('```json\n').strip('\n```')
            news_data = json.loads(cleaned_response)
        except json.JSONDecodeError:
            # Handle JSON decoding errors
            news_data = [{"error": "LLM response is not properly formatted as JSON"}]
        except Exception as e:
            news_data = [{"error": str(e)}]

        return jsonify(news_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

