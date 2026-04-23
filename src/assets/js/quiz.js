// QUIZ_DATA and VERDICT_DATA are injected by index.njk from the _data/ JSON files

const stage = document.getElementById('stage');
const progress = document.getElementById('progress');
let current = 0;
const chosen = [];

function renderStage() {
  if (current >= QUIZ_DATA.length) return renderVerdict();

  const q = QUIZ_DATA[current];

  const echoHTML = chosen.length
    ? `<div class="echo">${chosen.map((c, i) => `<span>${String(i + 1).padStart(2, '0')}<b>${c}</b></span>`).join('')}</div>`
    : '';

  stage.innerHTML = `
    ${echoHTML}
    <div class="kicker">${q.kicker}</div>
    <h2 class="headline">${q.headline}</h2>
    <p class="dek">${q.dek}</p>
    <div class="options">
      ${q.options.map((opt, i) => `
        <button class="option" data-index="${i}">
          <div class="opt-num">${String(i + 1).padStart(2, '0')} — Choice</div>
          <div class="opt-title">${opt.title}</div>
          <div class="opt-desc">${opt.desc}</div>
        </button>
      `).join('')}
    </div>
    <div class="stage-foot">
      <button id="backBtn" ${current === 0 ? 'disabled' : ''}>← Previous</button>
      <span>${current + 1} of ${QUIZ_DATA.length}</span>
    </div>
  `;

  updateProgress();

  stage.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index, 10);
      chosen[current] = QUIZ_DATA[current].options[i].title;
      current++;
      renderStage();
    });
  });

  const back = document.getElementById('backBtn');
  if (back) back.addEventListener('click', () => {
    if (current > 0) { current--; chosen.pop(); renderStage(); }
  });
}

function updateProgress() {
  progress.querySelectorAll('.node').forEach((n, i) => {
    n.classList.remove('active', 'done');
    if (i < current) n.classList.add('done');
    else if (i === current) n.classList.add('active');
  });
}

function renderVerdict() {
  progress.querySelectorAll('.node').forEach(n => {
    n.classList.remove('active');
    n.classList.add('done');
  });

  const v = VERDICT_DATA;

  stage.classList.remove('stage');
  stage.classList.add('verdict');
  stage.innerHTML = `
    <div class="echo" style="margin-top: 4px;">
      ${chosen.map((c, i) => `<span>${String(i + 1).padStart(2, '0')}<b>${c}</b></span>`).join('')}
    </div>

    <div class="verdict-kicker">${v.kicker}</div>

    <div class="verdict-grid">
      <div class="verdict-main">
        <div style="font-family: 'Bodoni Moda', serif; font-style: italic; font-size: 14px; margin-bottom: 6px;">${v.intro}</div>
        <h2 class="verdict-name"><em>${v.name}</em></h2>
        <a class="verdict-url" href="${v.url}" target="_blank" rel="noopener">
          ${v.urlDisplay}<span class="arr">↗</span>
        </a>
        <div class="verdict-body">
          ${v.body.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>

      <aside class="verdict-side">
        <div>
          <h4>${v.attributesHeading}</h4>
          <ul>
            ${v.attributes.map(a => `<li><span>${a.label}</span><span>${a.value}</span></li>`).join('')}
          </ul>
        </div>
        <div style="font-family: 'Bodoni Moda', serif; font-style: italic; font-size: 13px; line-height: 1.5; color: var(--bee);">
          ${v.quote}
        </div>
      </aside>
    </div>

    <div class="restart-row">
      <span>${v.endNote}</span>
      <button id="restart">↻ Start again</button>
    </div>
  `;

  document.getElementById('restart').addEventListener('click', () => {
    current = 0;
    chosen.length = 0;
    stage.classList.remove('verdict');
    stage.classList.add('stage');
    renderStage();
  });
}

renderStage();
