import sys
import os
import locale
import json
from transformers import pipeline

pipe = pipeline("text-classification", model="ganeshkharad/gk-hinglish-sentiment")
import torch

# Configure encoding
sys.stdout.reconfigure(encoding="utf-8")
os.environ["PYTHONIOENCODING"] = "utf-8"
locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")


def get_sentiment(text):
    """Analyze text sentiment and return (label, confidence)."""
    max_length = 512
    if len(text) > max_length:
        text = text[:max_length]
    result = pipe(text)
    label = result[0]['label']
    confidence = result[0]['score']

    return label, confidence

def analyze_sentiment(file_path, output_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        if not isinstance(data, list):
            print("Error: JSON file must contain an array of comment objects.")
            return

        print(f"Processing {len(data)} comments...")
        results = []

        for comment in data:
            text = comment.get("text", "")
            user = comment.get("owner", {}).get("username", "unknown")
            profile_pic_url = comment.get("owner", {}).get("profile_pic_url", "")

            sentiment, confidence = get_sentiment(text)

            results.append({
                "user": user,
                "text": text,
                "sentiment": "negative" if sentiment == "LABEL_0" else ("positive" if sentiment == "LABEL_2" else "neutral"),
                "profile_pic_url": profile_pic_url,
                "confidence": confidence
            })
            with open(output_path, 'w', encoding='utf-8') as outfile:
                json.dump(results, outfile, ensure_ascii=False, indent=4)

    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except json.JSONDecodeError:
        print("Error: Failed to parse JSON file. Please check its format.")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Please provide the path to the sentiment analysis file and the output file.")
        sys.exit(1)
    
    file_path = sys.argv[1]
    output_path = sys.argv[2]
    print(f"Reading sentiment analysis file from: {file_path}")
    analyze_sentiment(file_path, output_path)
