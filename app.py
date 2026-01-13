from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500"]}})

@app.route("/api/generate-quiz", methods=["POST"])
def generate_quiz():
    try:
        data = request.json
        topic = data.get("topic")

        prompt = f"""
Generate 10 multiple-choice questions about {topic}.
Return JSON only in this exact structure:

{{
  "questions": [
    {{
      "question": "...",
      "options": {{
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      }},
      "answer": "A"
    }}
  ]
}}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )


        # Extract text safely
        ai_text = response.choices[0].message.content.strip()

        import json
        quiz = json.loads(ai_text)

        return jsonify(quiz)

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/score-quiz", methods=["POST"])
def score_quiz():
    try:
        data = request.json
        user = data["userAnswers"]
        correct = data["correctAnswers"]

        score = sum(1 for u, c in zip(user, correct) if u == c)

        return jsonify({"score": score, "total": len(correct)})

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🔥 Running Flask backend")
    app.run(debug=True)
