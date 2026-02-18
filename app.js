let questions = [];
let userAnswers = [];

function showTopicInput() {
  document.getElementById("main").innerHTML = `
    <input id="topicInput" placeholder="Enter topic" />
    <button onclick="generateQuiz()">Generate Quiz</button>
  `;
}

async function generateQuiz() {

  const topic = document.getElementById("topicInput").value.trim();

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  document.getElementById("main").innerHTML = "Generating quiz...";

  try {

    const res = await fetch("http://127.0.0.1:5000/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Server error");
    }

    const data = await res.json();

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid quiz format");
    }

    questions = data.questions;

    showQuiz(questions);

  } catch (err) {

    console.error("Quiz generation failed:", err);
    alert("Quiz failed. Check backend console.");
    showTopicInput();
  }
}

function showQuiz(questions) {

  if (!questions || !Array.isArray(questions)) {
    alert("Quiz data missing!");
    return;
  }

  let html = "";

  questions.forEach((q, i) => {
    html += `
      <div class="question-box">
        <p><b>${i + 1}. ${q.question}</b></p>

        ${Object.entries(q.options)
          .map(([key, value]) => `
            <label>
              <input type="radio" name="q${i}" value="${key}" />
              <b>${key}</b>: ${value}
            </label><br>
          `)
          .join("")}
      </div>
    `;
  });

  html += `<button onclick="submitQuiz()">Submit Quiz</button>`;

  document.getElementById("main").innerHTML = html;
}

async function submitQuiz() {

  if (!questions.length) {
    alert("Quiz missing!");
    return;
  }

  userAnswers = [];

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    userAnswers.push(selected ? selected.value : null);
  });

  try {

    const res = await fetch("http://127.0.0.1:5000/api/score-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAnswers,
        correctAnswers: questions.map(q => q.answer)
      })
    });

    if (!res.ok) throw new Error("Scoring failed");

    const data = await res.json();

    document.getElementById("main").innerHTML = `
      <h2>Your Score: ${data.score} / ${data.total}</h2>
      <button onclick="showTopicInput()">Play Again</button>
    `;

  } catch (err) {

    console.error("Scoring error:", err);
    alert("Failed to score quiz.");
  }
}

// Start app
showTopicInput();
