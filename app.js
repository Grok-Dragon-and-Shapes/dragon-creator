const SCALES = [
  { id: 'fine', label: 'Мелкая' },
  { id: 'plate', label: 'Пластины' },
  { id: 'spike', label: 'Шипы' }
];

const WINGS = [
  { id: 'bat', label: 'Перепончатые' },
  { id: 'feather', label: 'Перьевые' },
  { id: 'stub', label: 'Короткие' }
];

const COLORS = [
  { id: 'emerald', label: 'Изумрудный', main: '#2e8b57', dark: '#1b5e3b' },
  { id: 'ruby', label: 'Рубиновый', main: '#b22234', dark: '#6e1220' },
  { id: 'sapphire', label: 'Сапфировый', main: '#2456a6', dark: '#15336b' },
  { id: 'gold', label: 'Золотой', main: '#d4a017', dark: '#8a6410' },
  { id: 'obsidian', label: 'Обсидиановый', main: '#4a5061', dark: '#22252e' }
];

const WING_SHAPES = {
  bat: `<path d='M125 120 C95 30 35 20 12 62 C42 60 56 76 63 96 C42 94 26 106 20 126 C52 118 88 128 125 142 Z'/>`,
  feather: `<path d='M125 118 C100 70 70 50 28 52 C58 66 70 80 74 98 C56 92 40 100 34 116 C62 110 84 120 125 142 Z'/><ellipse cx='30' cy='44' rx='12' ry='5' transform='rotate(-20 30 44)'/><ellipse cx='48' cy='36' rx='12' ry='5' transform='rotate(-10 48 36)'/>`,
  stub: `<path d='M125 120 C112 92 88 82 66 86 C78 98 84 108 84 122 C98 126 112 132 125 142 Z'/>`
};

const DEFS = `<defs>
  <pattern id='pat-fine' width='12' height='12' patternUnits='userSpaceOnUse'>
    <circle cx='6' cy='6' r='4.5' fill='none' stroke='#000' stroke-opacity='.35' stroke-width='1.2'/>
  </pattern>
  <pattern id='pat-plate' width='22' height='16' patternUnits='userSpaceOnUse'>
    <rect x='1' y='1' width='20' height='14' rx='5' fill='none' stroke='#000' stroke-opacity='.35' stroke-width='1.5'/>
  </pattern>
  <pattern id='pat-spike' width='20' height='20' patternUnits='userSpaceOnUse'>
    <path d='M10 2 L14 10 L6 10 Z' fill='#000' fill-opacity='.3'/>
  </pattern>
</defs>`;

const state = { scale: 'fine', wing: 'bat', color: 'emerald' };

function buildSpikes(dark) {
  let out = '';
  for (let x = 98; x <= 178; x += 16) {
    out += `<path d='M${x} 110 L${x + 8} 84 L${x + 16} 110 Z' fill='${dark}'/>`;
  }
  return out;
}

function buildSvg(s) {
  const c = COLORS.find(x => x.id === s.color);
  const wingEl = `<g fill='${c.dark}' stroke='${c.dark}' stroke-width='2' stroke-linejoin='round'>${WING_SHAPES[s.wing]}</g>`;
  const spikes = s.scale === 'spike' ? buildSpikes(c.dark) : '';
  return `<svg viewBox='0 0 300 220' role='img' aria-label='Дракон ${c.label}'>
    ${DEFS}
    ${wingEl}
    <g transform='translate(300 0) scale(-1 1)'>${wingEl}</g>
    <path d='M85 150 C40 170 30 200 15 190 C35 185 45 160 80 140 Z' fill='${c.main}' stroke='${c.dark}' stroke-width='2'/>
    ${spikes}
    <ellipse cx='150' cy='135' rx='72' ry='46' fill='${c.main}' stroke='${c.dark}' stroke-width='2'/>
    <ellipse cx='150' cy='135' rx='72' ry='46' fill='url(#pat-${s.scale})'/>
    <ellipse cx='150' cy='152' rx='48' ry='22' fill='#f3e3b5' opacity='.85'/>
    <rect x='115' y='165' width='16' height='34' rx='7' fill='${c.dark}'/>
    <rect x='167' y='165' width='16' height='34' rx='7' fill='${c.dark}'/>
    <path d='M185 110 C198 92 204 82 210 70 L242 72 C234 100 224 122 214 146 Z' fill='${c.main}' stroke='${c.dark}' stroke-width='2'/>
    <path d='M218 44 L222 18 L234 42 Z' fill='${c.dark}'/>
    <ellipse cx='232' cy='62' rx='30' ry='22' fill='${c.main}' stroke='${c.dark}' stroke-width='2'/>
    <ellipse cx='232' cy='62' rx='30' ry='22' fill='url(#pat-${s.scale})'/>
    <path d='M254 56 L284 66 L254 72 Z' fill='${c.main}' stroke='${c.dark}' stroke-width='2' stroke-linejoin='round'/>
    <circle cx='240' cy='56' r='6' fill='#fff'/>
    <circle cx='242' cy='56' r='3' fill='#111'/>
  </svg>`;
}

function render() {
  const scale = SCALES.find(x => x.id === state.scale);
  const wing = WINGS.find(x => x.id === state.wing);
  const color = COLORS.find(x => x.id === state.color);
  document.getElementById('preview').innerHTML = buildSvg(state);
  document.getElementById('caption').textContent = `${color.label} дракон: чешуя «${scale.label.toLowerCase()}», крылья «${wing.label.toLowerCase()}»`;
}

const groups = [
  { key: 'scale', containerId: 'scales', items: SCALES },
  { key: 'wing', containerId: 'wings', items: WINGS },
  { key: 'color', containerId: 'colors', items: COLORS }
];

function buildGroup({ key, containerId, items }) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = key;
    input.value = item.id;
    input.checked = state[key] === item.id;
    input.addEventListener('change', () => {
      state[key] = item.id;
      render();
    });
    label.append(input, item.label);
    container.append(label);
  });
}

groups.forEach(buildGroup);

document.getElementById('randomBtn').addEventListener('click', () => {
  groups.forEach(({ key, containerId, items }) => {
    const pick = items[Math.floor(Math.random() * items.length)];
    state[key] = pick.id;
    document.querySelector(`#${containerId} input[value='${pick.id}']`).checked = true;
  });
  render();
});

render();
