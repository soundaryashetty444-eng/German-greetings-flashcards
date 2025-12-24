const greetings = [
    { de: "Hallo", en: "Hello" },
    { de: "Guten Morgen", en: "Good Morning" },
    { de: "Guten Abend", en: "Good Evening" },
    { de: "Tschüss", en: "Goodbye" },
    { de: "Danke", en: "Thank you" },
    { de: "Bitte", en: "Please / You're welcome" },
    { de: "Wie geht's?", en: "How are you?" },
    { de: "Ich liebe dich", en: "I love you" },
    { de: "Entschuldigung", en: "Excuse me / Sorry" },
    { de: "Gute Nacht", en: "Good Night" },
    { de: "Willkommen", en: "Welcome" },
    { de: "Auf Wiedersehen", en: "See you again" }
];

let index = 0;

// Flashcard elements
const cardText = document.getElementById("card-text");
const flashcard = document.getElementById("flashcard");
const flashControls = document.getElementById("flash-controls");
const testBtn = document.getElementById("test-btn");

// Test elements
const testArea = document.getElementById("test-area");
const question = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const result = document.getElementById("result");

let testQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = [];

// Flashcards
function showCard() {
    cardText.textContent = `${greetings[index].de} — ${greetings[index].en}`;
}

function nextCard() {
    index = (index + 1) % greetings.length;
    showCard();
}

function prevCard() {
    index = (index - 1 + greetings.length) % greetings.length;
    showCard();
}

// Test Mode
function startTest() {
    flashcard.classList.add("hidden");
    flashControls.classList.add("hidden");
    testBtn.classList.add("hidden");

    testArea.classList.remove("hidden");

    // Initialize test
    testQuestions = [...greetings];
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = [];
    loadQuestion();
}

function closeTest() {
    testArea.classList.add("hidden");
    flashcard.classList.remove("hidden");
    flashControls.classList.remove("hidden");
    testBtn.classList.remove("hidden");

    result.textContent = "";
}

// Load a question
function loadQuestion() {
    if (currentQuestionIndex >= testQuestions.length) {
        showWrongAnswers();
        return;
    }

    const current = testQuestions[currentQuestionIndex];
    question.textContent = `What does "${current.de}" mean?`;

    // Get 3 random options + correct one
    let options = greetings
        .map(g => g.en)
        .filter(en => en !== current.en)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    options.push(current.en);
    options.sort(() => 0.5 - Math.random());

    // Display options
    optionsDiv.innerHTML = "";
    options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option, current.en);
        optionsDiv.appendChild(btn);
    });

    result.textContent = "";
}

// Check answer
function checkAnswer(selected, correct) {
    if (selected === correct) {
        result.textContent = "✅ Correct!";
        score++;
    } else {
        result.textContent = `❌ Wrong! Correct answer: ${correct}`;
        wrongAnswers.push(testQuestions[currentQuestionIndex]);
    }

    currentQuestionIndex++;

    setTimeout(loadQuestion, 1000);
}

// Show wrong answers at the end
function showWrongAnswers() {
    question.textContent = `Test Complete! Your Score: ${score} / ${testQuestions.length}`;
    optionsDiv.innerHTML = "";

    if (wrongAnswers.length > 0) {
        const info = document.createElement("p");
        info.textContent = "Review these words you missed:";
        optionsDiv.appendChild(info);

        wrongAnswers.forEach(w => {
            const p = document.createElement("p");
            p.textContent = `${w.de} — ${w.en}`;
            optionsDiv.appendChild(p);
        });
    } else {
        const p = document.createElement("p");
        p.textContent = "Excellent! You got all correct!";
        optionsDiv.appendChild(p);
    }

    // Back button to return
    const backBtn = document.createElement("button");
    backBtn.textContent = "Back to Flashcards";
    backBtn.classList.add("back-btn");
    backBtn.onclick = closeTest;
    optionsDiv.appendChild(backBtn);
}

showCard();

