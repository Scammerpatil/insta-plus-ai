import sys
import os
import locale
import json
import pandas as pd
from transformers import pipeline
import joblib

pipe = pipeline("text-classification", model="ganeshkharad/gk-hinglish-sentiment")


# Configure encoding
sys.stdout.reconfigure(encoding="utf-8")
os.environ["PYTHONIOENCODING"] = "utf-8"
locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")


def analyze_sentiment(text):
    """Analyze text sentiment and return (label, confidence)."""
    result = pipe(text)
    label = "negative" if result[0]['label'] == 'LABEL_0' else "neutral" if result[0]['label'] == 'LABEL_1' else "positive"
    confidence = result[0]['score']

    return label, confidence

def process_instagram_data(profile_path, post_path, output_path):
    # Load profile data
    with open(profile_path, "r", encoding="utf-8") as f:
        profile_data = json.load(f)

    # Check weather the profile is a bot or not
    model = joblib.load("python/model/bot_detection_model.pkl")
    scalar = joblib.load("python/model/bot_detection_scalar.pkl")
    features = pd.DataFrame([{'profile_pic': int(profile_data.get("hasProfilePic", False)),
                               'nums_length_username': len(profile_data.get("username", "")),
                               'fullname_words': len(profile_data.get("fullName", "").split()),
                               'nums_length_fullname': len(profile_data.get("fullName", "")),
                               'name_length': len(profile_data.get("username", "")),
                               'description_length': len(profile_data.get("biography", "")),
                               'external_url': int(bool(profile_data.get("externalUrl", ""))),
                               'private': int(profile_data.get("isPrivate", False)),
                               'posts': profile_data.get("postsCount", 0),
                               'followers': profile_data.get("followersCount", 0),
                               'follows': profile_data.get("followsCount", 0)}])
    features_scaled = scalar.transform(features)
    bot_prediction = model.predict(features_scaled)
    profile_data['isBot'] = bool(bot_prediction[0])
    profile_data['botConfidenceScore'] = model.predict_proba(features_scaled)[0][1] * 100
    # Load posts data
    with open(post_path, "r", encoding="utf-8") as f:
        posts_data = json.load(f)

    # ---- PROFILE SUMMARY ----
    processed_data = {
        "fullName": profile_data.get("fullName", ""),
        "username": profile_data.get("username", ""),
        "biography": profile_data.get("biography", ""),
        "followersCount": profile_data.get("followersCount", 0),
        "followsCount": profile_data.get("followsCount", 0),
        "postsCount": profile_data.get("postsCount", 0),
        "profilePicUrl": profile_data.get("profilePicUrlHD") or profile_data.get("profilePicUrl"),
        "isBot": profile_data.get("isBot", False),
        "botConfidenceScore": profile_data.get("botConfidenceScore", 0.0)
    }

    # Biography sentiment
    bio_sentiment, bio_score = analyze_sentiment(profile_data.get("biography", ""))
    processed_data["biographySentiment"] = {
        "sentiment": bio_sentiment,
        "score": bio_score
    }

    total_likes = 0
    total_comments = 0
    sentiment_summary = []

    latest_posts = []
    sentiment_response = []

    for post in posts_data:
        post_caption = post.get("caption", "")
        like_count = post.get("likesCount", 0)
        comment_count = post.get("commentsCount", 0)
        total_likes += like_count
        total_comments += comment_count

        # Sentiment of post caption
        caption_sentiment, caption_score = analyze_sentiment(post_caption)

        # Comments sentiment
        comments_data = []
        sentiment_stats = {"positive": 0, "negative": 0, "neutral": 0}

        for comment in post.get("latestComments", []):
            text = comment.get("text", "")
            sentiment, score = analyze_sentiment(text)
            comments_data.append({
                "user": comment.get("ownerUsername"),
                "text": text,
                "sentiment": sentiment,
                "profile_pic_url": comment.get("ownerProfilePicUrl"),
                "confidence": abs(score)
            })
            sentiment_stats[sentiment] += 1

        # Append processed post
        latest_posts.append({
            "id": post.get("id"),
            "shortcode": post.get("shortCode"),
            "displayUrl": post.get("displayUrl"),
            "alt": post.get("alt", ""),
            "caption": post_caption,
            "hashtags": post.get("hashtags", []),
            "likeCount": like_count,
            "commentCount": comment_count,
            "takenAtTimestamp": post.get("timestamp"),
            "captionSentiment": caption_sentiment
        })

        sentiment_response.append({
            "postUrl": post.get("url"),
            "comments": comments_data,
            "summary": sentiment_stats
        })

    processed_data["totalLikes"] = total_likes
    processed_data["totalComments"] = total_comments
    processed_data["latestPosts"] = latest_posts
    processed_data["sentimentResponse"] = sentiment_response

    # Save to output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(processed_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Processed file created: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Please provide the path to the sentiment analysis file and the output file.")
        sys.exit(1)
    
    profile_file_path = sys.argv[1]
    post_file_path = sys.argv[2]
    output_path = sys.argv[3]
    print(f"Reading sentiment analysis file from: {profile_file_path}")
    process_instagram_data(profile_file_path, post_file_path, output_path)
