const pageNames = {
  landing: "Home",
  overview: "Overview",
  assessment: "Career assessment",
  careers: "Explore careers",
  skills: "Skill intelligence",
  roadmap: "Learning roadmap",
  projects: "Project hub",
  jobs: "Jobs & internships",
  profile: "Your profile"
};

const navItems = [...document.querySelectorAll("[data-page]")];
const pageViews = [...document.querySelectorAll(".page-view")];
const sidebar = document.querySelector("#sidebar");
const mobileOverlay = document.querySelector("#mobile-overlay");
const toast = document.querySelector("#toast");
let toastTimer;

function showPage(page) {
  if (!pageNames[page]) return;
  pageViews.forEach((view) => view.classList.toggle("active", view.id === `page-${page}`));
  document.body.classList.toggle("landing-mode", page === "landing");
  document.querySelectorAll(".primary-nav [data-page]").forEach((item) => {
    const isActive = item.dataset.page === page;
    item.classList.toggle("active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  document.querySelector("#breadcrumb-current").textContent = pageNames[page];
  sidebar.classList.remove("open");
  mobileOverlay.classList.remove("show");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.body.classList.toggle("landing-mode", document.querySelector("#page-landing").classList.contains("active"));
navItems.forEach((item) => item.addEventListener("click", () => showPage(item.dataset.page)));
document.querySelectorAll("[data-page-link]").forEach((item) => item.addEventListener("click", (event) => {
  event.preventDefault();
  showPage(item.dataset.pageLink);
}));

document.querySelector("#menu-toggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
  mobileOverlay.classList.toggle("show", sidebar.classList.contains("open"));
});
mobileOverlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  mobileOverlay.classList.remove("show");
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

document.querySelector(".filter-button").addEventListener("click", () => {
  document.querySelector("#career-filter").focus();
  showToast("Choose a career area to narrow the recommendations.");
});
document.querySelector(".notification-button").addEventListener("click", () => {
  showToast("You’re all caught up.");
});
document.querySelector(".more-button").addEventListener("click", () => {
  showToast("Account options are part of this UI prototype.");
});
document.querySelectorAll(".interests-field .tag-list > span button").forEach((button) => {
  button.addEventListener("click", () => button.closest("span").remove());
});

const questions = [
  {
    category: "Problem solving",
    title: "When you come across a tricky problem, what do you usually do first?",
    answers: [
      "Break it into smaller pieces and tackle them one by one",
      "Look for patterns or similar problems I’ve solved before",
      "Talk it through with someone and get a fresh perspective",
      "Try a few different approaches and see what works"
    ]
  },
  {
    category: "Interests & motivation",
    title: "Which kind of activity makes you lose track of time?",
    answers: [
      "Creating something that works, from an app to a useful tool",
      "Finding patterns and making sense of information",
      "Making an experience clearer or more enjoyable for people",
      "Exploring a new idea and figuring out how it could be better"
    ]
  },
  {
    category: "Work style",
    title: "When working on a project, which role feels most natural?",
    answers: [
      "Planning the steps and making sure the details fit together",
      "Experimenting with ideas and learning by doing",
      "Listening to different perspectives and bringing people together",
      "Focusing deeply and polishing the details"
    ]
  },
  {
    category: "Strengths",
    title: "What do people most often come to you for help with?",
    answers: [
      "Untangling a difficult question or technical issue",
      "Explaining an idea in a clear, thoughtful way",
      "Coming up with fresh ideas or a creative approach",
      "Staying organized and following through"
    ]
  },
  {
    category: "Work environment",
    title: "What kind of work environment helps you do your best?",
    answers: [
      "A focused space where I can solve complex problems",
      "A collaborative team that shares ideas openly",
      "A flexible setting where I can try new approaches",
      "A clear plan with goals I can work toward"
    ]
  },
  {
    category: "Learning style",
    title: "When you want to learn a new skill, what works best for you?",
    answers: [
      "Building a small project with it right away",
      "Reading or watching a clear explanation first",
      "Practicing with someone and comparing approaches",
      "Trying examples and learning from what doesn’t work"
    ]
  },
  {
    category: "Motivation",
    title: "Which outcome would feel most rewarding to you?",
    answers: [
      "A useful product that people rely on",
      "A discovery that helps people make a better decision",
      "An experience that feels natural and welcoming",
      "A team solving a challenge that once seemed impossible"
    ]
  },
  {
    category: "Your direction",
    title: "What would you most like to gain from your next learning step?",
    answers: [
      "Confidence building and shipping real projects",
      "A stronger foundation in technical concepts",
      "A clearer picture of which career paths fit me",
      "Practice communicating and sharing my work"
    ]
  }
];
let questionIndex = 0;
const selectedAnswers = new Array(questions.length).fill(null);

function renderQuestion() {
  const question = questions[questionIndex];
  document.querySelector("#question-number").textContent = String(questionIndex + 1).padStart(2, "0");
  document.querySelector("#question-category").textContent = question.category;
  document.querySelector("#question-title").textContent = question.title;
  document.querySelector("#assessment-progress-fill").style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  document.querySelector("#assessment-mini-fill").style.width = `${(selectedAnswers.filter((answer) => answer !== null).length / questions.length) * 100}%`;
  const answered = selectedAnswers.filter((answer) => answer !== null).length;
  document.querySelector("#assessment-percent").textContent = `${Math.round((answered / questions.length) * 100)}%`;
  document.querySelector("#answered-count").textContent = answered;
  const list = document.querySelector("#answer-list");
  list.replaceChildren(...question.answers.map((answer, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = `answer-option${selectedAnswers[questionIndex] === index ? " selected" : ""}`;
    option.setAttribute("aria-pressed", String(selectedAnswers[questionIndex] === index));
    option.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span></span><span class="answer-check">✓</span>`;
    option.querySelectorAll("span")[1].textContent = answer;
    option.addEventListener("click", () => {
      selectedAnswers[questionIndex] = index;
      renderQuestion();
    });
    return option;
  }));
  document.querySelector("#previous-question").disabled = questionIndex === 0;
  document.querySelector("#next-question").innerHTML = questionIndex === questions.length - 1 ? "See your reflection <span>→</span>" : "Next question <span>→</span>";
}

document.querySelector("#previous-question").addEventListener("click", () => {
  if (questionIndex > 0) {
    questionIndex -= 1;
    renderQuestion();
  }
});
document.querySelector("#next-question").addEventListener("click", () => {
  if (selectedAnswers[questionIndex] === null) {
    showToast("Choose the answer that feels most like you to continue.");
    return;
  }
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
    return;
  }
  showToast(`${selectedAnswers.filter((answer) => answer !== null).length} of 8 answers complete. This prototype does not calculate a career result.`);
});
renderQuestion();

function filterCareerCards() {
  const search = document.querySelector("#career-search").value.trim().toLowerCase();
  const category = document.querySelector("#career-filter").value;
  document.querySelectorAll(".career-card").forEach((card) => {
    const matchesSearch = card.dataset.search.includes(search);
    const matchesCategory = category === "all" || card.dataset.category === category;
    card.hidden = !(matchesSearch && matchesCategory);
  });
}
document.querySelector("#career-search").addEventListener("input", filterCareerCards);
document.querySelector("#career-filter").addEventListener("change", filterCareerCards);

function filterJobs() {
  const search = document.querySelector("#job-search").value.trim().toLowerCase();
  const type = document.querySelector("#job-type-filter").value;
  const location = document.querySelector("#job-location-filter").value;
  let visible = 0;
  document.querySelectorAll(".job-card").forEach((card) => {
    const matches = card.dataset.search.includes(search)
      && (type === "all" || card.dataset.type === type)
      && (location === "all" || card.dataset.location === location);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  document.querySelector("#jobs-empty").hidden = visible !== 0;
}
["job-search", "job-type-filter", "job-location-filter"].forEach((id) => {
  const element = document.querySelector(`#${id}`);
  element.addEventListener(id === "job-search" ? "input" : "change", filterJobs);
});

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const saved = button.classList.toggle("saved");
    button.setAttribute("aria-pressed", String(saved));
    button.textContent = saved ? "♥" : "♡";
    const count = document.querySelectorAll(".save-button.saved").length;
    document.querySelector("#saved-count").textContent = count;
    showToast(saved ? "Sample opportunity saved in this preview." : "Sample opportunity removed from saved.");
  });
});

document.querySelectorAll(".task-action").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("task-done");
    button.firstChild.textContent = button.classList.contains("task-done") ? "✓  " : "○  ";
    showToast(button.classList.contains("task-done") ? "Nice work — task marked complete in this preview." : "Task moved back to your learning list.");
  });
});

document.querySelector("#save-profile").addEventListener("click", () => {
  showToast("Profile details saved in this preview only — no account or backend is connected.");
});
