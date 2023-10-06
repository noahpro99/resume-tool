import requests
from bs4 import BeautifulSoup
import csv
import time
import re
from googlesearch import search
import pandas as pd

      
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def google_search(query):
    return search(query, num_results=3)

def extract_text(url):
    try:
        response = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup.text
    except Exception as e:
        print(f"Failed to fetch URL {url}. Reason: {e}")
        return ""

def find_pattern(text):
    # Look for patterns like "1.", "2.", "Q1.", "Q2." with at least 30 characters in between
    pattern = re.compile(r'(?:(?:\d+\.|Q\d+\.)\s?)(.{15,150}?\?)', re.DOTALL)
    matches = pattern.findall(text)
    return matches

def clean_text(text):
    # Removing any extra spaces, new lines or other unwanted characters
    text = text.strip()  # Remove spaces at the beginning and end
    text = re.sub(r'\n+', '\n', text)  # Replace multiple newlines with a single newline
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with a single space
    text = text.encode('utf-8', 'ignore').decode('utf-8', 'ignore')
    return text

def main():
    jobs = pd.read_csv("data/Job.csv")
    job_titles = jobs["title"].sample(5).tolist()
    
    with open("data/interview_questions.csv", "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(["Job Title", "url", "Question"])

        for job_title in job_titles:
            query = f"{job_title} interview questions"
            print(f"Searching for {query}...")
            
            search_results = google_search(query)

            for url in search_results:
                if url.endswith((".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".csv")):
                    continue
                print(f"Fetching {url}...")
                try:
                    text_content = extract_text(url)
                    questions = find_pattern(text_content)

                    for question in questions:
                        writer.writerow([job_title, url, clean_text(question)])
                except Exception as e:
                    print(f"Failed to fetch URL {url} and extract text. Reason: {e}")
                
                # Pause to avoid too many rapid requests
                print("waiting one sec"); time.sleep(1)

if __name__ == "__main__":
    main()
