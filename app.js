let mapping = {};

const grid = document.getElementById("ipaGrid");
const modal = document.getElementById("modal");
const player = document.getElementById("player");
const title = document.getElementById("modalTitle");
const closeBtn = document.getElementById("closeBtn");

fetch("mapping.json")
  .then(r => r.json())
  .then(data => (mapping = data))
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

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-symbol]");
  if (!btn) return;
  openModal(btn.dataset.symbol);
});

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
