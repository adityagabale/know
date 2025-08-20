// Simple renderer pulling from data/resume.json
async function loadResume() {
  const res = await fetch('data/resume.json', {cache: 'no-cache'});
  const data = await res.json();

  // Basics
  document.getElementById('name').textContent = data.basics.name;
  document.getElementById('label').textContent = data.basics.label;
  const emailA = document.getElementById('email');
  emailA.textContent = data.basics.email;
  emailA.href = `mailto:${data.basics.email}`;
  const websiteA = document.getElementById('website');
  websiteA.textContent = data.basics.url.replace(/^https?:\/\//,'').replace(/\/$/, '');
  websiteA.href = data.basics.url;
  document.getElementById('location').textContent = data.basics.location.address || '';

  document.getElementById('summary').textContent = data.basics.summary;

  const highlights = [
    "Cut processing latency from 5 minutes to 5ms",
    "Zero-downtime across 45+ microservices",
    "Migration to Java 17, reducing vulnerabilities",
    "Trade version sequencing in distributed system",
    "Keycloak SSO, ES fuzzy search, SSE (HTTP/2)",
    "Automated DR with Jenkins + Rundeck"
  ];
  const chips = document.getElementById('highlights');
  highlights.forEach(h => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = h;
    chips.appendChild(span);
  });

  // Experience
  const exp = document.getElementById('experience');
  data.work.forEach(w => {
    const el = document.createElement('div');
    el.className = 'experience-item';
    const range = `${w.startDate}${w.endDate ? ' – ' + w.endDate : ' – Present'}`;
    el.innerHTML = `
      <h3>${w.position} — ${w.name}</h3>
      <div class="experience-meta">${range} • ${w.url ? `<a href="${w.url}" target="_blank" rel="noreferrer">${new URL(w.url).hostname}</a>` : ''}</div>
      <p>${w.summary || ''}</p>
      ${w.highlights && w.highlights.length ? '<ul>' + w.highlights.map(h => `<li>${h}</li>`).join('') + '</ul>' : ''}
    `;
    exp.appendChild(el);
  });

  // Skills
  const sg = document.getElementById('skills');
  data.skills.forEach(group => {
    const wrap = document.createElement('div');
    wrap.className = 'skill-group';
    wrap.innerHTML = `<h3>${group.name}</h3>`;
    const badges = document.createElement('div');
    badges.className = 'badges';
    group.keywords.forEach(k => {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = k;
      badges.appendChild(b);
    });
    wrap.appendChild(badges);
    sg.appendChild(wrap);
  });

  // Profiles
  const pf = document.getElementById('profiles');
  data.basics.profiles.forEach(p => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = p.url; a.target = "_blank"; a.rel = "noreferrer";
    a.textContent = `${p.network}: ${p.username}`;
    li.appendChild(a);
    pf.appendChild(li);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
}

// Dark/light mode toggle with localStorage
(function initMode(){
  const mode = localStorage.getItem('mode') || 'dark';
  if (mode === 'light') document.documentElement.classList.add('light');
  const btn = document.getElementById('modeToggle');
  const setIcon = () => btn.textContent = document.documentElement.classList.contains('light') ? '🌞' : '🌙';
  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('mode', document.documentElement.classList.contains('light') ? 'light' : 'dark');
    setIcon();
  });
  setIcon();
})();

loadResume();
