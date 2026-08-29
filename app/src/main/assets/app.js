// --- Quiz Questions Data Store ---
const QUIZ_DATA = {
  "web-dev": {
    title: "Web Development",
    iconClass: "fa-solid fa-code",
    themeClass: "category-web-dev",
    description: "HTML, CSS, JavaScript, and modern browser architectures.",
    questions: [
      {
        question: "Which of the following is NOT a valid value for the CSS 'position' property?",
        options: ["static", "relative", "inline", "sticky"],
        answer: 2 // 'inline' is not a position value
      },
      {
        question: "What does DOM stand for in web development?",
        options: [
          "Document Object Model",
          "Data Oriented Module",
          "Direct Object Mapping",
          "Distributed Object Management"
        ],
        answer: 0
      },
      {
        question: "Which JavaScript array method returns a new array with all elements that pass a test?",
        options: ["map()", "filter()", "forEach()", "reduce()"],
        answer: 1
      },
      {
        question: "Which HTML5 tag is used to specify footer information for a document or section?",
        options: ["<bottom>", "<section-footer>", "<footer>", "<aside>"],
        answer: 2
      },
      {
        question: "What is the default value of the CSS 'display' property for a <div> element?",
        options: ["inline", "block", "inline-block", "flex"],
        answer: 1
      }
    ]
  },
  "science": {
    title: "Science & Space",
    iconClass: "fa-solid fa-flask",
    themeClass: "category-science",
    description: "Explore physics, chemistry, space discovery, and biology.",
    questions: [
      {
        question: "What is the approximate speed of light in a vacuum?",
        options: [
          "150,000 kilometers per second",
          "300,000 kilometers per second",
          "450,000 kilometers per second",
          "600,000 kilometers per second"
        ],
        answer: 1
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: 1
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Pb"],
        answer: 2
      },
      {
        question: "What force holds galaxies together?",
        options: ["Gravity", "Electromagnetism", "Strong Nuclear Force", "Centrifugal Force"],
        answer: 0
      },
      {
        question: "What is the main gas found in the air we breathe?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        answer: 2
      }
    ]
  },
  "geography": {
    title: "Geography",
    iconClass: "fa-solid fa-earth-americas",
    themeClass: "category-geography",
    description: "World maps, capitals, continents, oceans, and landmarks.",
    questions: [
      {
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Pacific Ocean"],
        answer: 3
      },
      {
        question: "What is the capital city of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        answer: 2
      },
      {
        question: "Which country has the longest coastline in the world?",
        options: ["Canada", "Russia", "United States", "Australia"],
        answer: 0
      },
      {
        question: "Which river flows through Paris?",
        options: ["Danube", "Seine", "Thames", "Rhine"],
        answer: 1
      },
      {
        question: "In which continent is the Sahara Desert located?",
        options: ["Asia", "Africa", "South America", "Australia"],
        answer: 1
      }
    ]
  },
  "history": {
    title: "History",
    iconClass: "fa-solid fa-hourglass-half",
    themeClass: "category-history",
    description: "Major historical milestones, ancient times, and figures.",
    questions: [
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
        answer: 2
      },
      {
        question: "In which year did the Titanic sink?",
        options: ["1905", "1912", "1920", "1931"],
        answer: 1
      },
      {
        question: "Which ancient civilization built the Colosseum in Rome?",
        options: ["The Greeks", "The Egyptians", "The Romans", "The Persians"],
        answer: 2
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Vincent van Gogh"],
        answer: 1
      },
      {
        question: "Which empire was ruled by Julius Caesar?",
        options: ["Roman Empire", "Ottoman Empire", "British Empire", "Mongol Empire"],
        answer: 0
      }
    ]
  }
};

// --- App State ---
let currentQuizKey = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // Records user choice index for each question
let selectedOptionIndex = null;
let isAnswerSubmitted = false;

// --- DOM Elements ---
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const categoriesGrid = document.getElementById("quiz-categories-grid");
const startRandomQuizBtn = document.getElementById("start-random-quiz-btn");

// Screens
const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Quiz Screen Elements
const quitQuizBtn = document.getElementById("quit-quiz-btn");
const currentQuizCategory = document.getElementById("current-quiz-category");
const currentLiveScore = document.getElementById("current-live-score");
const quizProgressBar = document.getElementById("quiz-progress-bar");
const currentQuestionNum = document.getElementById("current-question-num");
const totalQuestionsNum = document.getElementById("total-questions-num");
const quizQuestionText = document.getElementById("quiz-question-text");
const quizOptionsList = document.getElementById("quiz-options-list");
const submitAnswerBtn = document.getElementById("submit-answer-btn");
const nextQuestionBtn = document.getElementById("next-question-btn");

// Result Screen Elements
const resultGreeting = document.getElementById("result-greeting");
const scoreRingFill = document.getElementById("score-ring-fill");
const resultScorePercent = document.getElementById("result-score-percent");
const resultScoreFraction = document.getElementById("result-score-fraction");
const statsCorrect = document.getElementById("stats-correct");
const statsIncorrect = document.getElementById("stats-incorrect");
const toggleReviewBtn = document.getElementById("toggle-review-btn");
const reviewBreakdownPanel = document.getElementById("review-breakdown-panel");
const reviewQuestionsList = document.getElementById("review-questions-list");
const retryQuizBtn = document.getElementById("retry-quiz-btn");
const goHomeBtn = document.getElementById("go-home-btn");
const headerLogo = document.getElementById("header-logo");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderCategories();
  setupEventListeners();
});

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggleBtn.querySelector("i");
  if (theme === "dark") {
    icon.className = "fa-solid fa-sun";
  } else {
    icon.className = "fa-solid fa-moon";
  }
}

// --- Render Category Grid ---
function renderCategories() {
  categoriesGrid.innerHTML = "";
  for (const [key, category] of Object.entries(QUIZ_DATA)) {
    const totalQuestions = category.questions.length;
    
    const card = document.createElement("div");
    card.className = `category-card ${category.themeClass}`;
    card.setAttribute("data-category-key", key);
    card.id = `category-card-${key}`;
    
    card.innerHTML = `
      <div class="category-icon-wrapper">
        <i class="${category.iconClass}"></i>
      </div>
      <h3>${category.title}</h3>
      <p>${category.description}</p>
      <div class="card-footer">
        <span class="question-count">${totalQuestions} Questions</span>
        <div class="play-arrow">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
    `;
    
    card.addEventListener("click", () => startQuiz(key));
    categoriesGrid.appendChild(card);
  }
}

// --- Setup Actions & Listeners ---
function setupEventListeners() {
  // Logo acts as home button
  headerLogo.addEventListener("click", navigateToHome);

  // Random Quiz
  startRandomQuizBtn.addEventListener("click", () => startQuiz("random"));

  // Exit Quiz
  quitQuizBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to exit the quiz? Your progress will be lost.")) {
      navigateToHome();
    }
  });

  // Submit Answer
  submitAnswerBtn.addEventListener("click", submitAnswer);

  // Next Question
  nextQuestionBtn.addEventListener("click", nextQuestion);

  // Results Actions
  retryQuizBtn.addEventListener("click", restartCurrentQuiz);
  goHomeBtn.addEventListener("click", navigateToHome);

  // Toggle Review
  toggleReviewBtn.addEventListener("click", toggleDetailedReview);
}

// --- Navigation helper ---
function switchScreen(activeScreen) {
  [homeScreen, quizScreen, resultScreen].forEach(screen => {
    screen.classList.remove("active");
  });
  activeScreen.classList.add("active");
}

function navigateToHome() {
  currentQuizKey = null;
  currentQuestions = [];
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  selectedOptionIndex = null;
  isAnswerSubmitted = false;
  
  // Collapse review panel if it was open
  reviewBreakdownPanel.classList.add("hidden");
  toggleReviewBtn.innerHTML = '<i class="fa-solid fa-list-check"></i> Show Detailed Review';

  switchScreen(homeScreen);
}

// --- Quiz Logic Flow ---
function startQuiz(categoryKey) {
  currentQuizKey = categoryKey;
  score = 0;
  currentQuestionIndex = 0;
  userAnswers = [];
  selectedOptionIndex = null;
  isAnswerSubmitted = false;

  if (categoryKey === "random") {
    // Collect all questions from all categories
    let allQuestions = [];
    for (const cat of Object.values(QUIZ_DATA)) {
      allQuestions = allQuestions.concat(cat.questions);
    }
    // Shuffle and pick 10 (or less if not enough)
    currentQuestions = shuffleArray([...allQuestions]).slice(0, 10);
    currentQuizCategory.textContent = "Random Mix";
  } else {
    const category = QUIZ_DATA[categoryKey];
    // Copy and optionally shuffle questions of this category
    currentQuestions = [...category.questions];
    currentQuizCategory.textContent = category.title;
  }

  totalQuestionsNum.textContent = currentQuestions.length;
  currentLiveScore.textContent = score;

  loadQuestion();
  switchScreen(quizScreen);
}

function loadQuestion() {
  selectedOptionIndex = null;
  isAnswerSubmitted = false;

  submitAnswerBtn.classList.remove("hidden");
  submitAnswerBtn.disabled = true;
  nextQuestionBtn.classList.add("hidden");

  // Progress update
  const total = currentQuestions.length;
  const progressPercent = (currentQuestionIndex / total) * 100;
  quizProgressBar.style.width = `${progressPercent}%`;

  currentQuestionNum.textContent = currentQuestionIndex + 1;

  const currentQuestion = currentQuestions[currentQuestionIndex];
  quizQuestionText.textContent = currentQuestion.question;

  // Render options
  quizOptionsList.innerHTML = "";
  currentQuestion.options.forEach((option, idx) => {
    const optionBtn = document.createElement("button");
    optionBtn.className = "option-btn";
    optionBtn.id = `option-btn-${idx}`;
    
    // Alphabet badge helper
    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
    
    optionBtn.innerHTML = `
      <span class="option-badge">${optionLetter}</span>
      <span class="option-text">${escapeHTML(option)}</span>
    `;

    optionBtn.addEventListener("click", () => selectOption(idx));
    quizOptionsList.appendChild(optionBtn);
  });
}

function selectOption(index) {
  if (isAnswerSubmitted) return;

  selectedOptionIndex = index;
  submitAnswerBtn.disabled = false;

  // Visual state update
  const options = quizOptionsList.querySelectorAll(".option-btn");
  options.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

function submitAnswer() {
  if (selectedOptionIndex === null || isAnswerSubmitted) return;

  isAnswerSubmitted = true;
  submitAnswerBtn.classList.add("hidden");
  nextQuestionBtn.classList.remove("hidden");

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const correctIndex = currentQuestion.answer;
  const isCorrect = (selectedOptionIndex === correctIndex);

  // Store user's response
  userAnswers.push(selectedOptionIndex);

  // Update Score
  if (isCorrect) {
    score++;
    currentLiveScore.textContent = score;
  }

  // Update visual states for options
  const options = quizOptionsList.querySelectorAll(".option-btn");
  options.forEach((btn, idx) => {
    btn.classList.add("disabled"); // prevent further click visually
    
    if (idx === correctIndex) {
      btn.classList.add("correct");
      // Add check icon
      btn.innerHTML += ` <i class="fa-solid fa-circle-check" style="margin-left: auto; color: var(--success);"></i>`;
    } else if (idx === selectedOptionIndex && !isCorrect) {
      btn.classList.add("incorrect");
      // Add cross icon
      btn.innerHTML += ` <i class="fa-solid fa-circle-xmark" style="margin-left: auto; color: var(--error);"></i>`;
    }
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    loadQuestion();
  } else {
    // Finish Quiz, show final progress update to 100%
    quizProgressBar.style.width = `100%`;
    setTimeout(showResults, 300);
  }
}

// --- Results Display ---
function showResults() {
  switchScreen(resultScreen);

  const total = currentQuestions.length;
  const percentage = Math.round((score / total) * 100);

  // Set greeting based on score
  if (percentage >= 80) {
    resultGreeting.textContent = "Outstanding Performance!";
  } else if (percentage >= 50) {
    resultGreeting.textContent = "Well Done!";
  } else {
    resultGreeting.textContent = "Keep Practicing!";
  }

  // Set statistics numbers
  statsCorrect.textContent = score;
  statsIncorrect.textContent = total - score;

  // Animate Fraction & Percentage text
  resultScorePercent.textContent = `${percentage}%`;
  resultScoreFraction.textContent = `${score} / ${total}`;

  // SVG Ring Animation
  // Radius = 70. Circumference = 2 * PI * r = ~439.8
  const strokeDashOffset = 440 - (440 * percentage) / 100;
  scoreRingFill.style.strokeDashoffset = strokeDashOffset;

  // Build Review Items
  renderDetailedReview();
}

function renderDetailedReview() {
  reviewQuestionsList.innerHTML = "";
  
  currentQuestions.forEach((q, idx) => {
    const userChoiceIdx = userAnswers[idx];
    const correctIdx = q.answer;
    const isCorrect = (userChoiceIdx === correctIdx);

    const reviewItem = document.createElement("div");
    reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;

    reviewItem.innerHTML = `
      <div class="review-q-text">Q${idx + 1}: ${escapeHTML(q.question)}</div>
      <div class="review-ans-info">
        <div class="review-user-choice">
          <strong>Your Answer:</strong> ${q.options[userChoiceIdx] !== undefined ? escapeHTML(q.options[userChoiceIdx]) : 'No Answer'} 
          ${isCorrect ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>'}
        </div>
        ${!isCorrect ? `
        <div class="review-correct-ans">
          <strong>Correct Answer:</strong> ${escapeHTML(q.options[correctIdx])}
        </div>` : ''}
      </div>
    `;

    reviewQuestionsList.appendChild(reviewItem);
  });
}

// --- Toggle Detailed Review Panel ---
function toggleDetailedReview() {
  const isHidden = reviewBreakdownPanel.classList.contains("hidden");
  if (isHidden) {
    reviewBreakdownPanel.classList.remove("hidden");
    toggleReviewBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Detailed Review';
    reviewBreakdownPanel.scrollIntoView({ behavior: 'smooth' });
  } else {
    reviewBreakdownPanel.classList.add("hidden");
    toggleReviewBtn.innerHTML = '<i class="fa-solid fa-list-check"></i> Show Detailed Review';
  }
}

function restartCurrentQuiz() {
  reviewBreakdownPanel.classList.add("hidden");
  toggleReviewBtn.innerHTML = '<i class="fa-solid fa-list-check"></i> Show Detailed Review';
  startQuiz(currentQuizKey);
}

// --- Utility Functions ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
