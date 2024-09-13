import requests
import json
import os

# Replace with your server's URL
# SERVER_URL = "http://localhost:8000"
SERVER_URL = "http://127.0.0.1:5000"


def upload_pdf(file_path):
    print(file_path)
    url = f"{SERVER_URL}/upload_file"

    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'rb') as file:
        files = {'file': (os.path.basename(file_path),
                          file, 'application/pdf')}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        print("File uploaded successfully!")
        print(response.json())
    else:
        print(f"Error uploading file: {response.status_code}")
        print(response.text)


def search_similar(query):
    url = f"{SERVER_URL}/search"
    data = {"query": query}

    response = requests.post(url, json=data)

    if response.status_code == 200:
        results = response.json()['results']
        print(f"Found {len(results)} similar documents:")
        for i, result in enumerate(results, 1):
            print(f"\n{i}. Content: {result['content'][:100]}...")
            print(f"   Score: {result['score']}")
    else:
        print(f"Error searching: {response.status_code}")
        print(response.text)


def ask_question(question):
    url = f"{SERVER_URL}/ask_question"
    data = {"question": question}

    response = requests.post(url, json=data)

    if response.status_code == 200:
        answer = response.json()['answer']
        print(f"Q: {question}")
        print(f"A: {answer}")
    else:
        print(f"Error asking question: {response.status_code}")
        print(response.text)


def web_scapper(job_url):
    url = f"{SERVER_URL}/scrape"
    data = {"url": job_url}
    print(data)

    response = requests.post(url, json=data)

    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error scrapping: {response.status_code}")
        print(response.text)


def main():
    while True:
        print("\n1. Upload PDF")
        print("2. Search similar content")
        print("3. Ask a question")
        print("4. Web Scrapper")
        print("5. Exit")

        choice = input("Enter your choice (1-4): ")

        if choice == '1':
            file_path = input("Enter the path to the PDF file: ")
            upload_pdf(file_path)
        elif choice == '2':
            query = input("Enter your search query: ")
            search_similar(query)
        elif choice == '3':
            question = input("Enter your question: ")
            ask_question(question)
        elif choice == '4':
            url = input("Enter the URL: ")
            web_scapper(url)
        elif choice == '5':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
