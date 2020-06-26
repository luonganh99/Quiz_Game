// Create structure for the game

const CORRECT_BONUS = 10;

let isPlaying,
    avaiableQuestions,
    questionCounter,
    score,
    currentQuestion,
    sumOfQuestions,
    sessionToken;
const questionMarkup = document.getElementById('question');
const choicesMarkup = Array.from(document.getElementsByClassName('specific-answer'));
const scoreMarkup = document.getElementById('score');
const currentQuestionMarkup = document.getElementById('current-question');
const totalQuesionMarkup = document.getElementById('total-question');

const getQuestions = async () => {
    let allQuestions = [];

    // Retrieve Session Token
    sessionToken = await fetch('https://opentdb.com/api_token.php?command=request').then((res) =>
        res.json()
    );
    allQuestions = await fetch(
        `https://opentdb.com/api.php?amount=10&category=28&difficulty=easy&type=multiple&token=${sessionToken.token}`
    )
        .then((res) => res.json())
        .then((allFetchQuestions) => {
            return allFetchQuestions.results.map((q) => ({
                question: q.question,
                correct_answer: q.correct_answer,
                incorrect_answers: q.incorrect_answers,
            }));
        });

    // Display total question
    sumOfQuestions = allQuestions.length;
    totalQuesionMarkup.textContent = `${sumOfQuestions}`;

    //Format questions
    avaiableQuestions = allQuestions.map((q) => {
        let choices = [];
        choices = [...q.incorrect_answers, q.correct_answer];

        let randomIndex = Math.floor(Math.random() * 3);
        let temp = choices[3];
        choices[3] = choices[randomIndex];
        choices[randomIndex] = temp;

        return {
            question: q.question,
            choices,
            answer: randomIndex,
        };
    });
};

const addClickListener = () => {
    choicesMarkup.forEach((choice, index) => {
        choice.addEventListener('click', () => {
            // Check choice (closures)
            if (currentQuestion.answer === index) {
                score += CORRECT_BONUS;
                scoreMarkup.textContent = `${score}`;
                Swal.fire({
                    icon: 'success',
                    title: "<h3>Yeahh! You're right!</h3>",
                    showConfirmButton: true,
                    imageUrl: './imgs/right.png',
                    imageHeight: 300,
                    imageWidth: 500,
                    width: '60rem',
                    background: '#222831',
                    confirmButtonText: '<p>Continue</p>',
                    confirmButtonColor: '#271530',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "<h3>Sadlly! It's wrong!</h3>",
                    html: `<p>The right anwser is '${
                        currentQuestion.choices[currentQuestion.answer]
                    }'</p>`,
                    showConfirmButton: true,
                    imageUrl: './imgs/wrong.jpg',
                    imageHeight: 300,
                    imageWidth: 500,
                    width: '60rem',
                    background: '#222831',
                    confirmButtonText: '<p>Continue</p>',
                    confirmButtonColor: '#271530',
                });
            }

            // Check ending
            if (questionCounter === sumOfQuestions) {
                isPlaying = false;
                displayResults();
            } else {
                // Remove old question
                avaiableQuestions = avaiableQuestions.filter(
                    (q) => q.question !== currentQuestion.question
                );

                // Display next question
                displayNewQuestion();
            }
        });
    });
};

const displayNewQuestion = () => {
    // Increase Counter
    questionCounter++;

    // Display Counter
    currentQuestionMarkup.textContent = `${questionCounter}`;

    // Random questions
    let randomQuestionIndex = Math.floor(Math.random() * avaiableQuestions.length);
    currentQuestion = avaiableQuestions[randomQuestionIndex];

    // Display question
    questionMarkup.innerHTML = currentQuestion.question;

    // Display choices
    choicesMarkup.forEach((choice, index) => {
        choice.textContent = `${currentQuestion.choices[index]}`;
    });
};

const displayResults = () => {
    // Alert show result and Play Again Button
    if (score !== 0) {
        Swal.fire({
            title: '<h1>Congratulation</h1>',
            imageUrl: './imgs/congratulation.jpg',
            imageHeight: 300,
            imageWidth: 500,
            width: '60rem',
            background: '#222831',
            confirmButtonColor: '#271530',
            imageAlt: 'Congratulation',
            html: `<h3> You got ${score} points in total !</h3>`,
            confirmButtonText: '<p>Play Again</p>',
        });
    } else {
        Swal.fire({
            title: '<h1>Unfortunately</h1>',
            imageUrl: './imgs/fail.png',
            imageHeight: 300,
            imageWidth: 500,
            width: '60rem',
            background: '#222831',
            confirmButtonColor: '#271530',
            imageAlt: 'unfortunately',
            html: `<h3> You do not have any point !</h3>`,
            confirmButtonText: '<p>Play Again</p>',
        });
    }

    // Reset Game
    initGame();
};

const initGame = async () => {
    isPlaying = true;
    score = 0;
    questionCounter = 0;
    currentQuestion = 0;
    sumOfQuestions = 0;
    avaiableQuestions = '';

    // Init Score and Question
    scoreMarkup.textContent = '0';
    currentQuestionMarkup.textContent = '0';
    totalQuesionMarkup.textContent = '0';

    // Get questions and anwsers
    await getQuestions();

    // Display random question and answers
    displayNewQuestion();
};

// Add Listener
addClickListener();
initGame();
