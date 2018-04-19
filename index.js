/* question tracking */
let currentQuestionIndex = 0;

/* score tracking */
let currentScore = 0;

/* template to pass through each question from the object */
function buildTemplate(question) {
  let questionString = "";
  question.questionOptions.forEach((currentQuestion, index) => {
    questionString += `
    <label id="label-${index}">
      <input type="radio" name="badass-woman" class="question-input" value="${index}" required>
      ${currentQuestion}
    </label>
    <br>`;
  });
  return `<li>
            <form id="question-form">
              <h3 id="question-text">${question.questionText}</h3>
                <div aria-labelledby="question-text">
                  ${questionString}
                </div>
              <button name="button" type="submit" class="submit-cta">Submit</button>
            </form>
          </li>`;
}

/* start quiz */
function startQuiz() {
  $(".start-cta").on("click", function() {
    $("#start-quiz").hide();
    renderNewQuestion();
    renderQuestionCount();
    $(".quiz-question, #quiz-tracking").show("slow");
  });
}

/* check answer */
function checkAnswer() {
  let currentQuestion = storeQuestions.questions[currentQuestionIndex];
  const checked = $("input[name=badass-woman]:checked").val();

  if (checked === currentQuestion.correctAnswer) {
    keepScore();
  } else {
    $(`#label-${checked}`).addClass("red");
    $("#myModal").show("slow");
    $(".modal-header").text(
      "Good guess, but the right badass woman is " +
        currentQuestion.correctAnswer +
        "!"
    );
    closeModal();
  }
  $(`#label-${currentQuestion.correctAnswer}`).addClass("green");
  return true;
}

/* modal closeout */
function closeModal() {
  $("#myModal").on("click", ".close-modal", function() {
    $("#myModal").hide("slow");
    return false;
  });
}

/* keep score */
function keepScore() {
  currentScore++;
  $(".quiz-score").text("You got " + currentScore + " right");
}

/* final score */
function finalScore() {
  const scoreSum = currentScore * 10 + "%";
  $(".final-score").text(scoreSum);
}

/* render question count */
function renderQuestionCount() {
  $(".current-question").text(currentQuestionIndex + 1);
}

/* render new question */
function renderNewQuestion() {
  $(".question-list").html(
    buildTemplate(storeQuestions.questions[currentQuestionIndex])
  );

  $(".question-input").click(checkAnswer);

  $("#quiz-question, #quiz-tracking").show("slow");
}

/* submit -> show next question & increment question count */
function submitListener() {
  $(".question-list").on("submit", "#question-form", onSubmit);
  $(document).keyup(function() {
    if (event.keyCode == 13) {
      onSubmit();
    }
  });
}

function onSubmit() {
  let currentQuestion = storeQuestions.questions[currentQuestionIndex];
  if (currentQuestionIndex < storeQuestions.questions.length - 1) {
    if (checkAnswer(currentQuestion)) {
      currentQuestionIndex++;
      renderQuestionCount();
      renderNewQuestion();
    }
  } else {
    checkAnswer(currentQuestion);
    $("#quiz-question, #quiz-tracking").hide();
    $(".final-score").text(finalScore);
    $("#results").show("slow");
    if (currentScore <= 4) {
      $("#bad-results").show("slow");
      $("#good-results").hide();
    } else {
      $("#good-results").show("slow");
      $("#bad-results").hide();
    }
  }
}

/* restart the quiz - reset everything */
function newQuiz() {
  $(".take-quiz-cta").on("click", function() {
    $("#results").hide();
    $("#bad-results").hide();
    $("#good-results").hide();
    $("#start-quiz").show();
    $("#quiz-question, #quiz-tracking").hide();
    currentQuestionIndex = 0;
    currentScore = 0;
    $(".quiz-score").text("None right so far");
  });
}

/* call the functions */
$(function() {
  startQuiz();
  submitListener();
  newQuiz();
});
