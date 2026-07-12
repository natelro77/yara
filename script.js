// ---------- Floating hearts background ----------
(function initFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const colors = ['hsl(340 70% 75%)', 'hsl(350 85% 82%)', 'hsl(15 70% 80%)', 'hsl(320 45% 78%)'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart-particle';
    heart.textContent = '❤';
    const size = 14 + Math.random() * 22;
    const duration = 14 + Math.random() * 12;
    const delay = Math.random() * 16;
    const drift = (Math.random() - 0.5) * 120;
    const opacity = 0.25 + Math.random() * 0.35;
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = size + 'px';
    heart.style.color = colors[i % colors.length];
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = delay + 's';
    heart.style.setProperty('--drift', drift + 'px');
    heart.style.setProperty('--heart-opacity', opacity);
    container.appendChild(heart);
  }
})();

// ---------- Music toggle ----------
(function initMusicToggle() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  let playing = false;

  btn.addEventListener('click', () => {
    playing = !playing;
    if (playing) {
      audio.volume = 0.35;
      audio.play().catch(() => {
        playing = false;
        btn.textContent = '🔇';
      });
      btn.textContent = '🎵';
    } else {
      audio.pause();
      btn.textContent = '🔇';
    }
  });
})();

// ---------- Stage machine ----------
const TOTAL_EGGS = 5;
const foundEggs = new Set();
let secretShown = false;

function showStage(id) {
  document.querySelectorAll('.stage').forEach((el) => {
    el.classList.remove('active', 'visible');
  });
  const target = document.getElementById(id);
  target.classList.add('active');
  // Force reflow so the fade-in transition runs.
  void target.offsetWidth;
  requestAnimationFrame(() => target.classList.add('visible'));
}

document.querySelectorAll('.easter-heart').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.egg;
    if (foundEggs.has(id)) return;
    foundEggs.add(id);
    btn.classList.add('found');
  });
});

// ---------- Landing ----------
document.getElementById('btn-begin').addEventListener('click', () => {
  showStage('stage-memories');
});

// ---------- Memories ----------
(function initMemories() {
  const opened = new Set();
  const cards = document.querySelectorAll('#stage-memories .flip-card');
  const continueBtn = document.getElementById('btn-continue-memories');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.querySelector('.flip-card-inner').classList.add('is-flipped');
      opened.add(card.dataset.card);
      if (opened.size === cards.length) {
        continueBtn.style.display = 'inline-block';
        continueBtn.classList.add('fade-in');
      }
    });
  });

  continueBtn.addEventListener('click', () => showStage('stage-quiz'));
})();

// ---------- Quiz ----------
(function initQuiz() {
  const QUESTIONS = [
    { id: 'q1', prompt: "Who's always right?", options: ['Me', 'You', 'Obviously you'] },
    { id: 'q2', prompt: "Who's cuter?", options: ['Nate', 'Yara', "That's not even a fair question"] },
  ];

  const box = document.getElementById('quiz-box');
  const continueBtn = document.getElementById('btn-continue-quiz');
  let step = 0;
  const answered = {};

  function render() {
    if (Object.keys(answered).length === QUESTIONS.length) {
      box.innerHTML = `
        <p class="font-script" style="font-size:1.8rem;color:var(--primary);margin:0;">You passed with flying colors.</p>
        <p style="font-size:0.9rem;color:var(--muted-foreground);margin:0;">(There was never a wrong answer.)</p>
      `;
      continueBtn.style.display = 'inline-block';
      continueBtn.classList.add('fade-in');
      return;
    }

    const q = QUESTIONS[step];
    box.innerHTML = `
      <p class="quiz-question">${q.prompt}</p>
      <div class="quiz-options">
        ${q.options.map((opt) => `<button class="quiz-option" data-option="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    box.querySelectorAll('.quiz-option').forEach((el) => {
      el.addEventListener('click', () => {
        answered[q.id] = el.dataset.option;
        box.innerHTML = `<p class="quiz-feedback fade-in">Correct 😂</p>`;
        setTimeout(() => {
          if (step < QUESTIONS.length - 1) step++;
          render();
        }, 1100);
      });
    });
  }

  render();
  continueBtn.addEventListener('click', () => showStage('stage-timeline'));
})();

// ---------- Timeline ----------
document.getElementById('btn-continue-timeline').addEventListener('click', () => {
  if (foundEggs.size >= TOTAL_EGGS && !secretShown) {
    secretShown = true;
    showStage('stage-secret');
  } else {
    showStage('stage-proposal');
    startProposal();
  }
});

document.getElementById('btn-continue-secret').addEventListener('click', () => {
  showStage('stage-proposal');
  startProposal();
});

// ---------- Proposal ----------
let proposalStarted = false;

function startProposal() {
  if (proposalStarted) return;
  proposalStarted = true;

  const lines = ['Yara...', "You've become someone incredibly special to me.", 'So I have one question...'];
  const typingEl = document.getElementById('typing-text');
  const questionWrap = document.getElementById('proposal-question-wrap');
  const charDelay = 45;
  const linePause = 950;

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        typingEl.style.display = 'none';
        questionWrap.classList.add('visible');
      }, linePause);
      return;
    }
    const line = lines[lineIndex];
    let i = 0;
    typingEl.textContent = '';
    const interval = setInterval(() => {
      i++;
      typingEl.textContent = line.slice(0, i);
      if (i === line.length) {
        clearInterval(interval);
        lineIndex++;
        setTimeout(typeLine, linePause);
      }
    }, charDelay);
  }

  typeLine();
  initNoButtonEscalation();
}

function initNoButtonEscalation() {
  const yesBtn = document.getElementById('btn-yes');
  const noBtn = document.getElementById('btn-no');
  const responseBox = document.getElementById('no-response');
  const responseTitle = document.getElementById('no-response-title');
  const responseSubtitle = document.getElementById('no-response-subtitle');
  const finalMessage = document.getElementById('final-message');
  const restoredNote = document.getElementById('restored-note');
  const proposalButtons = document.getElementById('proposal-buttons');

  const NO_MESSAGES = {
    1: { title: '🥺 Really?', subtitle: 'I spent all this time making this...' },
    2: { title: 'You\u2019re making the website sad.' },
    3: { title: 'I think that button might be broken...' },
    4: { title: '⚠ Error 404', subtitle: '"No" not found.' },
  };

  let noClicks = 0;
  let restored = false;
  let dodging = false;

  function randomOffset() {
    return {
      x: (Math.random() - 0.5) * 260,
      y: (Math.random() - 0.5) * 140,
    };
  }

  function applyYesScale() {
    const scale = 1 + Math.min(noClicks, 4) * 0.11;
    yesBtn.style.transform = `scale(${scale})`;
  }

  function showResponse() {
    const msg = NO_MESSAGES[Math.min(noClicks, 4)];
    if (!msg) {
      responseBox.classList.remove('visible');
      return;
    }
    responseTitle.textContent = msg.title;
    responseSubtitle.textContent = msg.subtitle || '';
    responseBox.classList.add('visible');
  }

  noBtn.addEventListener('mouseenter', () => {
    if (dodging) {
      const { x, y } = randomOffset();
      noBtn.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  noBtn.addEventListener('click', () => {
    if (restored) {
      showStage('stage-declined');
      return;
    }

    noClicks++;
    applyYesScale();
    showResponse();

    if (noClicks === 4) {
      noBtn.classList.add('shake');
      setTimeout(() => noBtn.classList.remove('shake'), 500);
    }
    if (noClicks >= 4 && noClicks < 6) {
      dodging = true;
    }
    if (noClicks >= 5) {
      const { x, y } = randomOffset();
      noBtn.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (noClicks >= 6) {
      setTimeout(showFinalMessage, 500);
    }
  });

  function showFinalMessage() {
    responseBox.classList.remove('visible');
    proposalButtons.style.display = 'none';
    finalMessage.classList.add('visible');

    const paragraphs = finalMessage.querySelectorAll('p');
    paragraphs.forEach((p, i) => {
      setTimeout(() => p.classList.add('shown'), i * 1400);
    });

    const totalDelay = (paragraphs.length - 1) * 1400 + 1800;
    setTimeout(restore, totalDelay);
  }

  function restore() {
    dodging = false;
    restored = true;
    noBtn.style.transform = 'translate(0, 0)';
    finalMessage.classList.remove('visible');
    proposalButtons.style.display = 'flex';
    restoredNote.style.display = 'block';
  }

  yesBtn.addEventListener('click', () => {
    showStage('stage-success');
    celebrateYes();
  });
}

// ---------- Success ----------
function celebrateYes() {
  spawnSparkles();

  if (typeof confetti !== 'function') return;

  const colors = ['#f9a8c4', '#fbcfe8', '#fde68a', '#fecaca', '#ffffff'];
  const end = Date.now() + 3000;

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors, scalar: 1.1 });

  setTimeout(() => {
    const heart = confetti.shapeFromText ? confetti.shapeFromText({ text: '❤️', scalar: 4 }) : undefined;
    confetti({
      particleCount: 40,
      spread: 90,
      origin: { y: 0.4 },
      shapes: heart ? [heart] : undefined,
      scalar: 2,
    });
  }, 400);
}

function spawnSparkles() {
  const container = document.getElementById('success-sparkles');
  container.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = '✨';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 2 + 's';
    s.style.fontSize = '18px';
    container.appendChild(s);
  }
}
