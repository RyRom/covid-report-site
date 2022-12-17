randomizeQuestions();

document.querySelector("#showDetails").addEventListener("click", checkAnswer);

async function randomizeQuestions() {
    let questionId = document.querySelector("#questionId").value;

    let url = `/api/answers/${questionId}`;
    let response = await fetch(url);
    let data = await response.json();

    let answers = [ data[0].choice1, data[0].choice2, data[0].choice3, data[0].choice4 ];
    answers = _.shuffle(answers); // Shuffle w/ underscore

    document.querySelector("#answers").innerHTML = "<option value=''>Select an answer</option>"
    for (let i = 0; i < answers.length; i++) {
        document.querySelector("#answers").innerHTML +=
        `<option value="${answers[i]}">${answers[i]}</option>`;
    }

}

async function checkAnswer() {
    let questionId = document.querySelector("#questionId").value;
    let answer = document.querySelector("#answers").value;

    let url = `/api/check/${questionId}/${answer}`;
    let response = await fetch(url);
    let data = await response.text();

    if (data == "Correct") {
        document.querySelector('#grade').style.color = "Green";
        document.querySelector("#grade").innerHTML = "Correct!";
    } else {
        document.querySelector('#grade').style.color = "Red";
        document.querySelector("#grade").innerHTML = "Incorrect!";
    }
}