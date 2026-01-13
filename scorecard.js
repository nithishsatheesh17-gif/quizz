function showScore(scoreData) {
  document.getElementById("main").innerHTML = `
    <h2>Your Score</h2>
    <p>You scored <b>${scoreData.score}</b> out of <b>${scoreData.total}</b></p>
    
    <button onclick="showTopicInput()">Try Another Quiz</button>
  `;
}
