// ---------------------------
// Simple gamer-style UI
// ---------------------------

const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll("[data-tab-content]");
const statusText = document.getElementById("statusText");

const savingsFill = document.getElementById("savingsFill");
const debtFill = document.getElementById("debtFill");
const incomeFill = document.getElementById("incomeFill");

const savingsValue = document.getElementById("savingsValue");
const debtValue = document.getElementById("debtValue");
const incomeValue = document.getElementById("incomeValue");

const updateDemo = document.getElementById("updateDemo");
const resetDemo = document.getElementById("resetDemo");

const contractViewer = document.getElementById("contractViewer");
const downloadContract = document.getElementById("downloadContract");
const copyContract = document.getElementById("copyContract");

const themeSelect = document.getElementById("themeSelect");
const contractMode = document.getElementById("contractMode");
const autoSound = document.getElementById("autoSound");

const soundToggle = document.getElementById("soundToggle");

// ---------------------------
// Sound effects
// ---------------------------
const sounds = {
  click: new Audio("assets/click.mp3"),
  achievement: new Audio("assets/achievement.mp3")
};
let soundEnabled = true;

function playSound(name){
  if(!soundEnabled) return;
  if(!autoSound.checked) return;
  const s = sounds[name];
  if(s){
    s.currentTime = 0;
    s.play().catch(() => {});
  }
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
});

// ---------------------------
// Tabs
// ---------------------------
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    playSound("click");
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    contents.forEach(c => c.classList.add("hidden"));
    const target = document.getElementById(tab.dataset.tab);
    target.classList.remove("hidden");
  });
});

// ---------------------------
// Demo progress logic
// ---------------------------
let demo = {
  savings: 0,
  debt: 0,
  income: 0
};

function renderProgress(){
  savingsFill.style.width = Math.min(100, demo.savings) + "%";
  debtFill.style.width = Math.min(100, demo.debt) + "%";
  incomeFill.style.width = Math.min(100, demo.income) + "%";

  savingsValue.textContent = `$${Math.round(demo.savings * 100) / 100}`;
  debtValue.textContent = `$${Math.round(demo.debt * 100) / 100}`;
  incomeValue.textContent = `$${Math.round(demo.income * 100) / 100}`;

  if(demo.savings >= 80){
    statusText.textContent = "Achievement Unlocked: Momentum";
    playSound("achievement");
  }
}

updateDemo.addEventListener("click", () => {
  playSound("click");
  demo.savings += 15;
  demo.debt += 10;
  demo.income += 12;
  renderProgress();
});

resetDemo.addEventListener("click", () => {
  playSound("click");
  demo = { savings: 0, debt: 0, income: 0 };
  renderProgress();
  statusText.textContent = "Online";
});

// ---------------------------
// Contract text
// ---------------------------
const contractSimple = `
Path to Independence Contract (Simple)

1) Keep the mission real.
2) Track your savings.
3) Cut debt.
4) Level up income.
5) Repeat.

This is your quest log.
`;

const contractDetailed = `
Path to Independence Contract (Detailed)

1) Goal: Build financial stability through consistent saving and smart spending.
2) Track progress weekly and adjust the plan as needed.
3) Reduce debt using a prioritized payoff strategy.
4) Increase income via skill upgrades, career growth, and side missions.
5) Maintain health, relationships, and focus while building wealth.
6) Celebrate milestones, but never lose the mission.

Signed,
The Future You
`;

function renderContract(){
  const mode = contractMode.value;
  contractViewer.textContent = mode === "detailed" ? contractDetailed : contractSimple;
}

contractMode.addEventListener("change", () => {
  playSound("click");
  renderContract();
  saveSettings();
});

// ---------------------------
// Download contract as PDF (simple method)
// ---------------------------
downloadContract.addEventListener("click", () => {
  playSound("click");
  const text = contractViewer.textContent;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "path-to-independence-contract.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

copyContract.addEventListener("click", async () => {
  playSound("click");
  try {
    await navigator.clipboard.writeText(contractViewer.textContent);
    statusText.textContent = "Copied to clipboard";
  } catch (e) {
    statusText.textContent = "Clipboard blocked";
  }
});

// ---------------------------
// Themes
// ---------------------------
function applyTheme(theme){
  const root = document.documentElement;
  if(theme === "matrix"){
    root.style.setProperty("--accent", "#22c55e");
    root.style.setProperty("--accent2", "#16a34a");
    root.style.setProperty("--bg1", "#040806");
    root.style.setProperty("--bg2", "#06100c");
    root.style.setProperty("--panel", "#06110b");
    root.style.setProperty("--panel2", "#040806");
  } else if(theme === "night"){
    root.style.setProperty("--accent", "#8b5cf6");
    root.style.setProperty("--accent2", "#f472b6");
    root.style.setProperty("--bg1", "#05060b");
    root.style.setProperty("--bg2", "#07080f");
    root.style.setProperty("--panel", "#07080f");
    root.style.setProperty("--panel2", "#05060b");
  } else {
    root.style.setProperty("--accent", "#7C3AED");
    root.style.setProperty("--accent2", "#22D3EE");
    root.style.setProperty("--bg1", "#070A12");
    root.style.setProperty("--bg2", "#0B0F1D");
    root.style.setProperty("--panel", "#0D1224");
    root.style.setProperty("--panel2", "#0B0F1D");
  }
}

themeSelect.addEventListener("change", () => {
  playSound("click");
  applyTheme(themeSelect.value);
  saveSettings();
});

// ---------------------------
// Local settings
// ---------------------------
function saveSettings(){
  const settings = {
    theme: themeSelect.value,
    contractMode: contractMode.value,
    autoSound: autoSound.checked
  };
  localStorage.setItem("ptiSettings", JSON.stringify(settings));
}

function loadSettings(){
  const raw = localStorage.getItem("ptiSettings");
  if(!raw) return;
  try{
    const settings = JSON.parse(raw);
    themeSelect.value = settings.theme || "neon";
    contractMode.value = settings.contractMode || "simple";
    autoSound.checked = settings.autoSound ?? true;
  }catch(e){}
}

loadSettings();
applyTheme(themeSelect.value);
renderContract();
renderProgress();
