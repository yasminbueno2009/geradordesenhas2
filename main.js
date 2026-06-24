/* ─── Word list for passphrase (Portuguese nouns/adjectives) ─── */
const WORDS = [
  'abacaxi','abelha','abraço','acaso','acorde','agulha','alegre','alface',
  'almoço','amanha','ambigu','ancora','andorinha','anel','anime','anjo',
  'antiga','anzol','aquila','aranha','arco','ardor','areia','argila',
  'ativo','aurora','aviao','azulejo','babado','bagaco','balanço','banana',
  'barba','bastao','batata','batom','beleza','benigno','bicicleta','bigode',
  'bilhete','biscoito','bispo','bocado','boiao','bolha','bolo','bomba',
  'bordado','bosque','botao','branco','bravo','brejo','brinde','brisa',
  'bruxa','buraco','cabelo','cabeca','cachorro','caderno','caixote','calma',
  'caminho','caneta','canoa','cansado','capivara','cargo','carnaval','carta',
  'casaco','castelo','cavalo','cenoura','chuva','cidade','cipó','circo',
  'classe','claro','cobra','cogumelo','colmeia','coração','coruja','cozinha',
  'criança','cristal','cruzeiro','cubo','dança','delicado','desejo','diamante',
  'dinamo','dormir','dragão','duende','dupla','eclipse','elefante','energia',
  'enigma','escudo','espelho','estrada','ético','exame','faca','falcao',
  'farinha','farol','feitiço','ferver','fiorde','flecha','floresta','fonte',
  'força','forno','foguete','frango','fruta','fumaça','fungo','futuro',
  'gafanhoto','galinha','galopando','garfo','gaveta','gelo','gentil','girassol',
  'globo','gorjeta','grande','gruta','guarda','guitarra','hélice','hipeR',
  'hipnose','horizonte','hotel','humano','ibis','iceberg','ideia','idioma',
  'ilha','impulso','índigo','inteiro','inverno','ipê','janela','jardim',
  'jiboia','jogador','jornada','jubilo','jumento','junto','justo','karma',
  'kennel','kernel','koala','labirinto','lagarta','lagoa','lambada','lanterna',
  'lápis','lareira','larva','leão','leme','leque','libélula','limão',
  'língua','lisonja','livro','lontra','losango','louro','lúpulo','maçã',
  'macaco','madeira','magia','mangueira','maracas','marcante','martelo','massa',
  'mente','miragem','mococa','moeda','molde','montanha','morango','mosca',
  'motor','mundo','música','náiade','navio','nebulosa','neblina','nervo',
  'noite','nuvem','oceano','óculos','olhar','ondas','oportunidade','ostra',
  'otimismo','oxigênio','padeiro','palco','palhaco','palmeira','papagaio','paquete',
  'pardal','pavão','pedra','pêndulo','penhasco','pensar','pepino','perigo',
  'pétala','pharos','piloto','pinheiro','pintura','planeta','pluma','pombo',
  'portal','potência','praia','presença','princípio','pulo','quartzo','queda',
  'quilate','radar','raiz','raposa','rebelde','reflexo','reino','relevo',
  'relogio','remo','reparo','resgate','riacho','ribeiro','riqueza','rocha',
  'rodopio','roseta','roteiro','rúcula','sabedoria','saguaro','saída','salvo',
  'samba','sandalia','saúde','selva','semente','serpente','sinfonia','sistema',
  'sobrinha','solar','sombra','soneto','sopro','suave','sumo','surpresa',
  'tabuleiro','tamara','tapete','tartaruga','tesouro','toco','tomate','tornado',
  'torta','trovão','tucano','túnel','turquesa','último','unicornio','universo',
  'utopia','vagem','valor','varanda','veado','veleiro','veneno','ventania',
  'verde','vestido','viagem','vitória','volta','vortex','xadrez','xarope',
  'xerife','zabumba','zebra','zenite','zéfiro','zoologia'
];
 
/* ─── State ─── */
let mode = 'random';
let history = [];
 
const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  nums:  '0123456789',
  syms:  '!@#$%^&*()-_=+[]{}|;:,.<>?'
};
 
/* ─── Crypto-safe random ─── */
function cryptoRandInt(max) {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  do { crypto.getRandomValues(arr); } while (arr[0] >= limit);
  return arr[0] % max;
}
 
function cryptoShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = cryptoRandInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
 
/* ─── Generators ─── */
function generateRandom(len) {
  const exclude = document.getElementById('exclude-input').value;
  let charset = '';
  const checks = { upper: 'cb-upper', lower: 'cb-lower', nums: 'cb-nums', syms: 'cb-syms' };
  const guarantees = [];
 
  for (const [key, id] of Object.entries(checks)) {
    if (document.getElementById(id).checked) {
      const chars = CHARSETS[key].split('').filter(c => !exclude.includes(c)).join('');
      if (chars) {
        charset += chars;
        guarantees.push(chars[cryptoRandInt(chars.length)]);
      }
    }
  }
 
  if (!charset) return '— selecione ao menos um tipo de caractere —';
 
  const password = [...guarantees];
  while (password.length < len) {
    password.push(charset[cryptoRandInt(charset.length)]);
  }
  return cryptoShuffle(password).join('').substring(0, len);
}
 
function generatePassphrase(words, sep) {
  const picked = [];
  for (let i = 0; i < words; i++) {
    picked.push(WORDS[cryptoRandInt(WORDS.length)]);
  }
  return picked.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(sep);
}
 
function generatePin(len) {
  let pin = '';
  for (let i = 0; i < len; i++) pin += cryptoRandInt(10).toString();
  return pin;
}
 
/* ─── Entropy & strength ─── */
function calcEntropy(pwd) {
  if (!pwd || pwd.startsWith('—')) return 0;
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;
  return Math.round(pwd.length * Math.log2(Math.max(pool, 1)));
}
 
function strengthInfo(bits) {
  if (bits < 28) return { level: 1, label: 'Péssima',   color: '#ef4444' };
  if (bits < 50) return { level: 2, label: 'Fraca',     color: '#f97316' };
  if (bits < 72) return { level: 3, label: 'Boa',       color: '#10b981' };
  if (bits < 90) return { level: 4, label: 'Excelente', color: '#6c63ff' };
                 return { level: 4, label: 'Perfeita',  color: '#6c63ff' };
}
 
function updateStrength(pwd) {
  const bits = calcEntropy(pwd);
  const info = strengthInfo(bits);
 
  document.getElementById('entropy-badge').textContent = bits + ' bits';
  document.getElementById('strength-label').textContent = info.label;
  document.getElementById('strength-label').style.color = info.color;
 
  for (let i = 1; i <= 4; i++) {
    const bar = document.getElementById('s' + i);
    bar.style.background = i <= info.level
      ? (i === 1 ? '#ef4444' : i === 2 ? '#f97316' : i === 3 ? '#10b981' : '#6c63ff')
      : 'var(--border)';
  }
}
 
/* ─── Main generate ─── */
function generate() {
  let pwd;
 
  if (mode === 'phrase') {
    const words = parseInt(document.getElementById('words-slider').value);
    const sep = document.getElementById('sep-select').value;
    pwd = generatePassphrase(words, sep);
  } else if (mode === 'pin') {
    const len = parseInt(document.getElementById('length-slider').value);
    pwd = generatePin(len);
  } else {
    const len = parseInt(document.getElementById('length-slider').value);
    pwd = generateRandom(len);
  }
 
  document.getElementById('password-display').value = pwd;
  updateStrength(pwd);
  addToHistory(pwd);
}
 
/* ─── Sliders ─── */
function updateSliderFill(el) {
  const pct = (el.value - el.min) / (el.max - el.min) * 100;
  el.style.background = `linear-gradient(to right, #6c63ff ${pct}%, var(--border) ${pct}%)`;
}
 
function onSlider(el) {
  document.getElementById('len-display').textContent = el.value;
  updateSliderFill(el);
  generate();
}
 
function onWordsSlider(el) {
  document.getElementById('words-display').textContent = el.value;
  updateSliderFill(el);
  generate();
}
 
/* ─── Mode switch ─── */
function setMode(m) {
  mode = m;
 
  ['random', 'phrase', 'pin'].forEach(t => {
    document.getElementById('tab-' + t).classList.toggle('active', t === m);
    document.getElementById('tab-' + t).setAttribute('aria-selected', t === m);
  });
 
  const phraseSettings = document.getElementById('phrase-settings');
  const charToggles    = document.getElementById('char-toggles');
  const lenSection     = document.getElementById('length-section');
  const slider         = document.getElementById('length-slider');
 
  if (m === 'phrase') {
    phraseSettings.classList.add('visible');
    charToggles.style.display = 'none';
    lenSection.style.display  = 'none';
  } else if (m === 'pin') {
    phraseSettings.classList.remove('visible');
    charToggles.style.display = 'none';
    lenSection.style.display  = 'block';
    slider.min = 4; slider.max = 12; slider.value = 6;
    document.getElementById('len-display').textContent = 6;
  } else {
    phraseSettings.classList.remove('visible');
    charToggles.style.display = 'block';
    lenSection.style.display  = 'block';
    slider.min = 4; slider.max = 128; slider.value = 16;
    document.getElementById('len-display').textContent = 16;
  }
 
  updateSliderFill(slider);
  generate();
}
 
/* ─── Toggle character sets ─── */
function toggleChar(key, label) {
  const cb = document.getElementById('cb-' + key);
  const checked = ['upper', 'lower', 'nums', 'syms']
    .filter(k => document.getElementById('cb-' + k).checked);
 
  // Prevent deselecting the last active charset
  if (checked.length === 1 && checked[0] === key) return;
 
  cb.checked = !cb.checked;
  label.classList.toggle('active', cb.checked);
  generate();
}
 
/* ─── Copy to clipboard ─── */
async function copyPassword() {
  const pwd = document.getElementById('password-display').value;
  if (!pwd || pwd.startsWith('—')) return;
 
  try {
    await navigator.clipboard.writeText(pwd);
    const btn = document.getElementById('copy-btn');
    btn.classList.add('copied');
    btn.textContent = '✓';
    showToast('Senha copiada!');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = '📋';
    }, 1800);
  } catch {
    showToast('Não foi possível copiar');
  }
}
 
/* ─── History ─── */
function addToHistory(pwd) {
  if (!pwd || pwd.startsWith('—')) return;
  const bits = calcEntropy(pwd);
  const info = strengthInfo(bits);
  history.unshift({ pwd, label: info.label, color: info.color });
  if (history.length > 8) history.pop();
  renderHistory();
}
 
function renderHistory() {
  const el = document.getElementById('history-list');
  if (!history.length) {
    el.innerHTML = '<div style="color:var(--muted);font-size:13px;text-align:center;padding:12px 0">Nenhuma senha gerada ainda</div>';
    return;
  }
  el.innerHTML = history.map((item, i) => `
    <div class="history-item" onclick="useHistoryItem(${i})" title="Clique para usar esta senha">
      <span class="h-icon">🔒</span>
      <span class="h-pwd">${escapeHtml(item.pwd)}</span>
      <span class="h-badge" style="background:${item.color}22;color:${item.color}">${item.label}</span>
    </div>
  `).join('');
}
 
function useHistoryItem(i) {
  const item = history[i];
  document.getElementById('password-display').value = item.pwd;
  updateStrength(item.pwd);
  showToast('Senha selecionada!');
}
 
function clearHistory() {
  history = [];
  renderHistory();
}
 
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
 
/* ─── Toast notification ─── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}
 
/* ─── Keyboard shortcuts ─── */
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate();
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement.id !== 'password-display') copyPassword();
});
 
/* ─── Separator select listener ─── */
document.getElementById('sep-select').addEventListener('change', generate);
 
/* ─── Init ─── */
updateSliderFill(document.getElementById('length-slider'));
generate();
 