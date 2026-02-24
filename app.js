let mapping = {};

const chartRoot = document.getElementById("ipaChart");
const modal = document.getElementById("modal");
const player = document.getElementById("player");
const title = document.getElementById("modalTitle");
const closeBtn = document.getElementById("closeBtn");

const chartSections = [
  {
    title: "Pulmonic consonants",
    columns: ["Bilabial", "Labiodental", "Dental", "Alveolar", "Post-alveolar", "Retroflex", "Palatal", "Velar", "Uvular", "Pharyngeal", "Glottal"],
    rows: [
      { label: "Plosive", cells: [["p", "b"], [""], [""], ["t", "d"], [""], ["ʈ", "ɖ"], ["c", "ɟ"], ["k", "g"], ["q", "ɢ"], [""], ["ʔ"]] },
      { label: "Nasal", cells: [["m"], ["ɱ"], [""], ["n"], [""], ["ɳ"], ["ɲ"], ["ŋ"], ["ɴ"], [""], ["" ]] },
      { label: "Trill", cells: [["ʙ"], [""], [""], ["r"], [""], [""], [""], [""], ["ʀ"], [""], ["" ]] },
      { label: "Tap / flap", cells: [["ⱱ"], [""], [""], ["ɾ"], [""], ["ɽ"], [""], [""], [""], [""], ["" ]] },
      { label: "Fricative", cells: [["ɸ", "β"], ["f", "v"], ["θ", "ð"], ["s", "z"], ["ʃ", "ʒ"], ["ʂ", "ʐ"], ["ç", "ʝ"], ["x", "ɣ"], ["χ", "ʁ"], ["ħ", "ʕ"], ["h", "ɦ"]] },
      { label: "Lateral fricative", cells: [[""], [""], [""], ["ɬ", "ɮ"], [""], [""], [""], [""], [""], [""], ["" ]] },
      { label: "Approximant", cells: [[""], ["ʋ"], [""], ["ɹ"], [""], ["ɻ"], ["j"], ["ɰ"], [""], [""], ["" ]] },
      { label: "Lateral approximant", cells: [[""], [""], [""], ["l"], [""], ["ɭ"], ["ʎ"], ["ʟ"], [""], [""], ["" ]] }
    ]
  },
  {
    title: "Non-pulmonic consonants",
    columns: ["Click", "Implosive", "Ejective"],
    rows: [
      { label: "Symbols", cells: [["ʘ", "ǀ", "ǃ", "ǂ", "ǁ"], ["ɓ", "ɗ", "ʄ", "ɠ", "ʛ"], ["pʼ", "tʼ", "kʼ", "sʼ"]] }
    ]
  },
  {
    title: "Vowels",
    columns: ["Front", "Near-front", "Central", "Near-back", "Back"],
    rows: [
      { label: "Close", cells: [["i", "y"], [""], ["ɨ", "ʉ"], [""], ["ɯ", "u"]] },
      { label: "Near-close", cells: [["ɪ", "ʏ"], [""], [""], ["ʊ"], ["" ]] },
      { label: "Close-mid", cells: [["e", "ø"], [""], ["ɘ", "ɵ"], [""], ["ɤ", "o"]] },
      { label: "Mid", cells: [[""], [""], ["ə"], [""], ["" ]] },
      { label: "Open-mid", cells: [["ɛ", "œ"], [""], ["ɜ", "ɞ"], [""], ["ʌ", "ɔ"]] },
      { label: "Near-open", cells: [["æ"], [""], ["ɐ"], [""], ["" ]] },
      { label: "Open", cells: [["a", "ɶ"], [""], ["ä"], [""], ["ɑ", "ɒ"]] }
    ]
  }
];

function symbolButton(symbol) {
  if (!symbol) return '<span class="ipa-empty" aria-hidden="true">—</span>';
  return `<button class="cell" data-symbol="${symbol}" type="button">${symbol}</button>`;
}

function sectionTable(section) {
  const thead = section.columns.map((col) => `<th scope="col">${col}</th>`).join("");
  const rows = section.rows
    .map(
      (row) => `
      <tr>
        <th scope="row">${row.label}</th>
        ${row.cells
          .map(
            (symbols) => `<td><div class="cell-group">${symbols.map(symbolButton).join("")}</div></td>`
          )
          .join("")}
      </tr>`
    )
    .join("");

  return `
    <section class="ipa-section">
      <h2>${section.title}</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col" class="sticky-col">Manner / Height</th>
              ${thead}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderChart() {
  chartRoot.innerHTML = chartSections.map(sectionTable).join("");
}

fetch("mapping.json")
  .then((r) => r.json())
  .then((data) => (mapping = data))
  .catch(() => console.warn("Could not load mapping.json"));

function openModal(symbol) {
  const url = mapping[symbol];
  if (!url) {
    alert(`No video mapped for: ${symbol}`);
    return;
  }
  title.textContent = `/${symbol}/`;
  player.src = url;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  player.play().catch(() => {});
}

function closeModal() {
  player.pause();
  player.removeAttribute("src");
  player.load();
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

renderChart();

chartRoot.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-symbol]");
  if (!btn) return;
  openModal(btn.dataset.symbol);
});

player.addEventListener("ended", closeModal);
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
