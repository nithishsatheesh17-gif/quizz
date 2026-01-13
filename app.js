let questions = [];
let userAnswers = [];

function showTopicInput() {
  document.getElementById("main").innerHTML = `
    <input id="topicInput" placeholder="Enter topic" />
    <button onclick="generateQuiz()">Generate Quiz</button>
  `;
}

async function generateQuiz() {
  const topic = document.getElementById("topicInput").value;

  const res = await fetch("http://127.0.0.1:5000/api/generate-quiz",
     {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic })
  });

  const data = await res.json();
  questions = data.questions;
  showQuiz(questions);
}

// Load first screen
showTopicInput();
