function showQuiz(questions) {
  let html = "";

  questions.forEach((q, i) => {
    html += `
      <div class="question-box">
        <p><b>${i + 1}. ${q.question}</b></p>

        ${Object.entries(q.options)
          .map(
            ([key, value]) => `
          <label>
            <input type="radio" name="q${i}" value="${key}" />
            <b>${key}</b>: ${value}
          </label><br>
        `
          )
          .join("")}
      </div>
    `;
  });

  html += `<button onclick="submitQuiz()">Submit Quiz</button>`;
  document.getElementById("main").innerHTML = html;
}
async function submitQuiz() {
  userAnswers = [];

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    userAnswers.push(selected ? selected.value : null);
  });

  const correctAnswers = questions.map(q => q.answer);

  const res = await fetch("http://127.0.0.1:5000/api/score-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userAnswers,
      correctAnswers
    })
  });

  const data = await res.json();

  document.getElementById("main").innerHTML = `
    <h2>Your Score: ${data.score} / ${data.total}</h2>
    <button onclick="showTopicInput()">Play Again</button>
  `;
}
