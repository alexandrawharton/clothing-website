/* ========================================
   AP STUDY HUB — script.js
   Features: Tab switching, accordion show/hide,
   flashcard flip game, progress tracker, countdown
   ======================================== */

// ── FLASHCARD DATA ──────────────────────────────────────────────

const flashcardData = {
  biology: [
    { q: "What is the powerhouse of the cell?", a: "The mitochondria — site of cellular respiration (ATP production via the electron transport chain)." },
    { q: "Describe the Central Dogma of Molecular Biology.", a: "DNA → (Transcription) → mRNA → (Translation) → Protein. Genetic info flows from DNA to RNA to protein." },
    { q: "What are the four levels of protein structure?", a: "Primary (amino acid sequence), Secondary (α-helix/β-sheet), Tertiary (3D folding), Quaternary (multiple polypeptides)." },
    { q: "Explain natural selection in one sentence.", a: "Individuals with heritable traits better suited to their environment survive longer and reproduce more, passing those traits on." },
    { q: "What is the difference between mitosis and meiosis?", a: "Mitosis produces 2 identical diploid cells (growth/repair); Meiosis produces 4 genetically unique haploid cells (gametes)." },
    { q: "What drives osmosis across a membrane?", a: "Water moves from an area of lower solute concentration (hypotonic) to higher solute concentration (hypertonic) across a semipermeable membrane." },
    { q: "What is an action potential?", a: "A rapid change in membrane potential caused by Na⁺ influx (depolarization) followed by K⁺ efflux (repolarization) — how neurons fire." },
    { q: "Define carrying capacity (K).", a: "The maximum population size an environment can sustain long-term given available resources." },
  ],
  chemistry: [
    { q: "State Le Chatelier's Principle.", a: "If a stress is applied to a system at equilibrium, the system shifts to relieve that stress and restore equilibrium." },
    { q: "What is the difference between ΔH and ΔG?", a: "ΔH = enthalpy (heat); ΔG = Gibbs free energy (ΔG = ΔH – TΔS). Spontaneous reactions have ΔG < 0." },
    { q: "Define electronegativity and its trend on the periodic table.", a: "Electronegativity is an atom's ability to attract bonding electrons. Increases up and to the right (fluorine is highest)." },
    { q: "What is a buffer solution?", a: "A solution that resists pH change when acid/base is added; made of a weak acid and its conjugate base (e.g. CH₃COOH/CH₃COO⁻)." },
    { q: "Explain the difference between SN1 and SN2 reactions.", a: "SN1: two-step, carbocation intermediate, racemization. SN2: one-step, backside attack, inversion of configuration (Walden inversion)." },
    { q: "What determines the rate law of a reaction?", a: "The rate law is determined experimentally and depends only on reactant concentrations and the rate constant k; rate = k[A]ᵐ[B]ⁿ." },
    { q: "What is Hess's Law?", a: "The enthalpy change of a reaction is the same regardless of the path taken — ΔH can be summed from component reactions." },
    { q: "Describe hybridization of sp³ carbon.", a: "One s orbital mixes with three p orbitals to form four equivalent sp³ orbitals arranged tetrahedrally (109.5°). Example: methane." },
  ],
  physics: [
    { q: "State Newton's Second Law.", a: "The net force on an object equals its mass times acceleration: F_net = ma. Direction of acceleration matches direction of net force." },
    { q: "What is the Work-Energy Theorem?", a: "The net work done on an object equals the change in its kinetic energy: W_net = ΔKE = ½mv² – ½mv₀²." },
    { q: "Define simple harmonic motion (SHM).", a: "Oscillatory motion where restoring force is proportional to and opposite to displacement: F = –kx. Period is independent of amplitude." },
    { q: "State Faraday's Law of Induction.", a: "An EMF is induced in a loop proportional to the rate of change of magnetic flux through the loop: ε = –ΔΦ/Δt." },
    { q: "What is the photoelectric effect?", a: "Light above a threshold frequency ejects electrons from a metal. Proved light behaves as photons (E = hf), foundational to quantum mechanics." },
    { q: "Explain the difference between elastic and inelastic collisions.", a: "Elastic: both momentum and kinetic energy are conserved. Inelastic: only momentum is conserved; kinetic energy is lost." },
    { q: "What does Gauss's Law state?", a: "The electric flux through a closed surface equals the enclosed charge divided by ε₀: Φ = Q_enc / ε₀." },
    { q: "Define the concept of a field in physics.", a: "A field assigns a value (scalar or vector) to every point in space describing a force's influence — e.g., electric, gravitational, magnetic fields." },
  ],
  psychology: [
    { q: "What is the difference between classical and operant conditioning?", a: "Classical: associating a neutral stimulus with an unconditioned stimulus (Pavlov). Operant: behavior shaped by consequences — reinforcement or punishment (Skinner)." },
    { q: "Describe the stages of Piaget's cognitive development.", a: "Sensorimotor (0–2), Preoperational (2–7), Concrete Operational (7–11), Formal Operational (12+). Each adds new thinking abilities." },
    { q: "What is the difference between long-term and short-term memory?", a: "Short-term (working) memory holds ~7 items for seconds/minutes. Long-term memory stores information indefinitely via consolidation." },
    { q: "Explain the bystander effect.", a: "People are less likely to help in an emergency when others are present due to diffusion of responsibility and pluralistic ignorance." },
    { q: "What is a neurotransmitter? Give three examples.", a: "A chemical messenger that crosses the synapse to communicate between neurons. Examples: dopamine (reward), serotonin (mood), GABA (inhibition)." },
    { q: "Define confirmation bias.", a: "The tendency to search for, interpret, and favor information that confirms one's preexisting beliefs, ignoring contradictory evidence." },
    { q: "What is the difference between the sympathetic and parasympathetic nervous systems?", a: "Sympathetic: 'fight-or-flight' — increases heart rate, dilates pupils. Parasympathetic: 'rest-and-digest' — slows heart rate, aids digestion." },
    { q: "Explain Maslow's Hierarchy of Needs.", a: "Pyramid of needs from basic (physiological, safety) to psychological (belonging, esteem) to self-actualization at the peak." },
  ]
};

// ── STATE ────────────────────────────────────────────────────────

let currentSubject = 'biology';
let currentCardIndex = 0;
let isFlipped = false;
let score = { correct: 0, total: 0 };

// ── DOM READY ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initTabs();
  initAccordions();
  initFlashcards();
  initProgressBars();
  updateScoreDisplay();
});

// ── COUNTDOWN TO AP EXAM ─────────────────────────────────────────

function initCountdown() {
  const bar = document.getElementById('countdownText');
  if (!bar) return;

  function update() {
    // AP exams run May–June; target next May 5
    const now = new Date();
    let target = new Date(now.getFullYear(), 4, 5); // May 5 this year
    if (now >= target) target = new Date(now.getFullYear() + 1, 4, 5);
    const diff = target - now;
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    bar.innerHTML = `📅 AP Exams <span>|</span> <strong>${days} days, ${hours} hours</strong> until your next AP exam — keep studying!`;
  }

  update();
  setInterval(update, 60000);
}

// ── SUBJECT TABS ─────────────────────────────────────────────────

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.subject-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

// ── ACCORDION SHOW/HIDE ──────────────────────────────────────────

function initAccordions() {
  const toggles = document.querySelectorAll('.topic-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.topic-card');
      const isOpen = card.classList.contains('open');

      // Close all in the same panel
      const panel = card.closest('.subject-panel');
      panel.querySelectorAll('.topic-card.open').forEach(c => {
        if (c !== card) c.classList.remove('open');
      });

      // Toggle this one
      card.classList.toggle('open', !isOpen);
    });
  });
}

// ── EXPAND / COLLAPSE ALL (per panel) ────────────────────────────

function expandAll(panelId) {
  document.querySelectorAll(`#${panelId} .topic-card`).forEach(c => c.classList.add('open'));
}

function collapseAll(panelId) {
  document.querySelectorAll(`#${panelId} .topic-card`).forEach(c => c.classList.remove('open'));
}

// ── FLASHCARD GAME ───────────────────────────────────────────────

function initFlashcards() {
  const select = document.getElementById('flashSubjectSelect');
  if (select) {
    select.addEventListener('change', () => {
      currentSubject = select.value;
      currentCardIndex = 0;
      score = { correct: 0, total: 0 };
      isFlipped = false;
      renderCard();
      updateScoreDisplay();
    });
    currentSubject = select.value;
  }

  const card = document.getElementById('flashcard');
  if (card) {
    card.addEventListener('click', flipCard);
  }

  renderCard();
}

function renderCard() {
  const cards = flashcardData[currentSubject];
  if (!cards) return;
  const card = cards[currentCardIndex % cards.length];

  const front = document.getElementById('cardFront');
  const back  = document.getElementById('cardBack');
  if (!front || !back) return;

  front.querySelector('.card-text').textContent = card.q;
  back.querySelector('.card-text').textContent  = card.a;

  const fc = document.getElementById('flashcard');
  fc.classList.remove('flipped');
  isFlipped = false;

  const counter = document.getElementById('cardCounter');
  if (counter) {
    counter.textContent = `Card ${(currentCardIndex % cards.length) + 1} of ${cards.length}`;
  }
}

function flipCard() {
  const fc = document.getElementById('flashcard');
  fc.classList.toggle('flipped');
  isFlipped = !isFlipped;
}

function nextCard() {
  const cards = flashcardData[currentSubject];
  currentCardIndex = (currentCardIndex + 1) % cards.length;
  renderCard();
}

function prevCard() {
  const cards = flashcardData[currentSubject];
  currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
  renderCard();
}

function markCorrect() {
  score.correct++;
  score.total++;
  updateScoreDisplay();
  nextCard();
}

function markIncorrect() {
  score.total++;
  updateScoreDisplay();
  nextCard();
}

function shuffleCards() {
  const cards = flashcardData[currentSubject];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  currentCardIndex = 0;
  renderCard();
}

function updateScoreDisplay() {
  const el = document.getElementById('gameScore');
  if (!el) return;
  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : '—';
  el.textContent = `✓ ${score.correct} / ${score.total}  ${score.total > 0 ? '(' + pct + '%)' : ''}`;
}

// ── PROGRESS BARS ─────────────────────────────────────────────────

function initProgressBars() {
  // Animate on load
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const target = bar.dataset.width;
      bar.style.width = target;
    });
  }, 400);
}
