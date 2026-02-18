function showQuiz(questions) {

  // 🔒 Safety check
  if (!questions || !Array.isArray(questions)) {
    console.error("Invalid quiz data:", questions);
    alert("Quiz failed to load.");
    return;
  }

  let html = "";

  questions.forEach((q, i) => {

    // 🔒 Question validation
    if (!q.question || !q.options) return;

    html += `
      <div class="question-box">
        <p><b>${i + 1}. ${q.question}</b></p>
    `;

    Object.entries(q.options).forEach(([key, value]) => {
      html += `
        <label>
          <input type="radio" name="q${i}" value="${key}" />
          <b>${key}</b>: ${value}
        </label><br>
      `;
    });

    html += `</div>`;
  });

  html += `<button onclick="submitQuiz()">Submit Quiz</button>`;

  document.getElementById("main").innerHTML = html;
}


async function submitQuiz() {

  if (!questions || !questions.length) {
    alert("Quiz data missing!");
    return;
  }

  let userAnswers = [];

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
        correctAnswers: questions.map(q => q.answer || null)
      })
    });

    if (!res.ok) throw new Error("Score API failed");

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
