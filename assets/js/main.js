/* LankaSky prototype — shared behaviour for all four pages.
   All flight data below is mock data for the prototype. */

const AIRPORTS = {
  CMB: "Colombo",
  JAF: "Jaffna",
  TRR: "Trincomalee",
  BTC: "Batticaloa",
  GIU: "Sigiriya",
  KDY: "Kandy",
  KCT: "Koggala",
  HRI: "Mattala",
};

// Approximate block times (minutes) from Colombo; other pairs are derived.
const FROM_CMB = { JAF: 60, TRR: 50, BTC: 55, GIU: 40, KDY: 30, KCT: 35, HRI: 45 };

function duration(from, to) {
  if (from === "CMB") return FROM_CMB[to];
  if (to === "CMB") return FROM_CMB[from];
  return Math.round((FROM_CMB[from] + FROM_CMB[to]) * 0.7);
}

function fmtTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function fmtDur(mins) {
  return `${Math.floor(mins / 60) ? Math.floor(mins / 60) + "h " : ""}${mins % 60}m`;
}

function fmtLKR(n) {
  return "LKR " + n.toLocaleString("en-LK");
}

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function toast(msg) {
  let el = $(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3200);
}

/* ---------- Navigation ---------- */
function initNav() {
  const page = document.body.dataset.page;
  $$(".nav-links a").forEach((a) => {
    if (a.dataset.page === page) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  const toggle = $(".nav-toggle");
  const links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

function fillAirportSelects() {
  $$("select[data-airports]").forEach((sel) => {
    const placeholder = sel.dataset.placeholder;
    if (placeholder) sel.add(new Option(placeholder, ""));
    Object.entries(AIRPORTS).forEach(([code, city]) => sel.add(new Option(`${city} (${code})`, code)));
    if (sel.dataset.default) sel.value = sel.dataset.default;
  });
}

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/* ---------- Home: booking widget ---------- */
function initBooking() {
  const form = $("#booking-form");
  if (!form) return;

  const from = $("#from"), to = $("#to");
  const depart = $("#depart"), ret = $("#return");
  depart.min = ret.min = todayISO();
  depart.value = todayISO(7);
  ret.value = todayISO(10);

  // Pre-fill destination from ?to=XXX (links from the Destinations page)
  const qTo = new URLSearchParams(location.search).get("to");
  if (qTo && AIRPORTS[qTo]) {
    to.value = qTo;
    if (from.value === qTo) from.value = qTo === "CMB" ? "JAF" : "CMB";
  }

  $$(".trip-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".trip-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      ret.disabled = tab.dataset.trip === "oneway";
    });
  });

  $("#swap").addEventListener("click", () => {
    [from.value, to.value] = [to.value, from.value];
  });

  depart.addEventListener("change", () => {
    ret.min = depart.value;
    if (ret.value < depart.value) ret.value = depart.value;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!from.value || !to.value) return toast("Please choose where you're flying from and to.");
    if (from.value === to.value) return toast("Origin and destination can't be the same.");
    renderResults(from.value, to.value, depart.value, Number($("#pax").value));
  });
}

function renderResults(from, to, date, pax) {
  const box = $("#results");
  const list = $("#results-list");
  const dur = duration(from, to);
  const seed = (from.charCodeAt(0) + to.charCodeAt(2)) % 5;
  const departures = [6 * 60 + 15, 9 * 60 + 40, 13 * 60 + 5, 16 * 60 + 30, 19 * 60 + 10];
  const fares = ["Saver", "Classic", "Flex"];

  list.innerHTML = departures.slice(0, 3 + (seed % 3)).map((dep, i) => {
    const base = 14500 + dur * 210 + ((seed + i) % 4) * 1850;
    const fno = `LS ${100 + Object.keys(AIRPORTS).indexOf(to) * 10 + i}`;
    return `
      <article class="flight-card">
        <div>
          <div class="fc-no">${fno}</div>
          <div class="fc-meta">ATR 72 · ${fares[i % 3]}</div>
        </div>
        <div class="fc-route">
          <div><div class="fc-time">${fmtTime(dep)}</div><div class="fc-code">${from}</div></div>
          <div style="flex:1"><div class="fc-line"></div><div class="fc-dur">${fmtDur(dur)} · Non-stop</div></div>
          <div style="text-align:right"><div class="fc-time">${fmtTime(dep + dur)}</div><div class="fc-code">${to}</div></div>
        </div>
        <div class="fc-price"><strong>${fmtLKR(base * pax)}</strong><small>${pax} passenger${pax > 1 ? "s" : ""}</small></div>
        <div class="fc-action"><button class="btn btn-outline btn-sm" type="button" data-fno="${fno}">Select</button></div>
      </article>`;
  }).join("");

  const nice = new Date(date + "T00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  $("#results-title").textContent = `${AIRPORTS[from]} → ${AIRPORTS[to]}`;
  $("#results-sub").textContent = `${nice} · ${list.children.length} flights found`;
  box.classList.add("show");
  box.scrollIntoView({ behavior: "smooth", block: "start" });

  $$(".fc-action .btn", list).forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".flight-card", list).forEach((c) => c.classList.remove("selected"));
      btn.closest(".flight-card").classList.add("selected");
      toast(`${btn.dataset.fno} selected — checkout isn't part of this prototype.`);
    });
  });
}

/* ---------- Destinations: filters ---------- */
function initFilters() {
  const buttons = $$(".filter-btn");
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$(".dest-card").forEach((card) => {
        card.hidden = f !== "all" && !card.dataset.tags.split(" ").includes(f);
      });
    });
  });
}

/* ---------- Flight status ---------- */
const STATUS_LABEL = {
  ontime: "On time", boarding: "Boarding", delayed: "Delayed",
  departed: "Departed", landed: "Landed", cancelled: "Cancelled",
};

const SCHEDULE = [
  { fno: "LS 110", from: "CMB", to: "JAF", dep: "06:15", status: "landed",   gate: "D2", progress: 100 },
  { fno: "LS 140", from: "CMB", to: "GIU", dep: "07:30", status: "landed",   gate: "D4", progress: 100 },
  { fno: "LS 120", from: "CMB", to: "TRR", dep: "09:40", status: "departed", gate: "D1", progress: 62 },
  { fno: "LS 171", from: "KCT", to: "CMB", dep: "10:20", status: "departed", gate: "A1", progress: 35 },
  { fno: "LS 150", from: "CMB", to: "KDY", dep: "11:05", status: "boarding", gate: "D3", progress: 0 },
  { fno: "LS 131", from: "BTC", to: "CMB", dep: "12:30", status: "delayed",  gate: "B2", progress: 0, note: "New departure 13:15" },
  { fno: "LS 160", from: "CMB", to: "KCT", dep: "13:05", status: "ontime",   gate: "D2", progress: 0 },
  { fno: "LS 111", from: "JAF", to: "CMB", dep: "14:20", status: "ontime",   gate: "A3", progress: 0 },
  { fno: "LS 170", from: "CMB", to: "HRI", dep: "16:30", status: "cancelled",gate: "—",  progress: 0, note: "Rebooked on LS 172" },
  { fno: "LS 141", from: "GIU", to: "CMB", dep: "17:45", status: "ontime",   gate: "A2", progress: 0 },
  { fno: "LS 130", from: "CMB", to: "BTC", dep: "19:10", status: "ontime",   gate: "D4", progress: 0 },
];

function addMins(hhmm, mins) {
  const [h, m] = hhmm.split(":").map(Number);
  return fmtTime(h * 60 + m + mins);
}

function pill(status) {
  return `<span class="pill pill-${status}">${STATUS_LABEL[status]}</span>`;
}

function initStatus() {
  const board = $("#board-body");
  if (!board) return;

  board.innerHTML = SCHEDULE.map((f) => `
    <tr data-fno="${f.fno}" style="cursor:pointer">
      <td class="fno">${f.fno}</td>
      <td>${AIRPORTS[f.from]} <small style="color:var(--muted)">${f.from}</small></td>
      <td>${AIRPORTS[f.to]} <small style="color:var(--muted)">${f.to}</small></td>
      <td>${f.dep}</td>
      <td>${addMins(f.dep, duration(f.from, f.to))}</td>
      <td>${f.gate}</td>
      <td>${pill(f.status)}</td>
    </tr>`).join("");

  $$("tr", board).forEach((tr) => tr.addEventListener("click", () => showTrack(SCHEDULE.find((f) => f.fno === tr.dataset.fno))));

  $$(".status-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".status-tab").forEach((t) => t.classList.toggle("active", t === tab));
      $$(".status-form").forEach((f) => { f.hidden = f.id !== tab.dataset.target; });
    });
  });

  $$(".status-form input[type=date]").forEach((d) => { d.value = todayISO(); });

  $("#by-number").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("#fno").value.toUpperCase().replace(/\s+/g, "").replace(/^(LS)?/, "LS ");
    const hit = SCHEDULE.find((f) => f.fno === q);
    hit ? showTrack(hit) : toast(`No flight found for "${$("#fno").value}". Try LS 120.`);
  });

  $("#by-route").addEventListener("submit", (e) => {
    e.preventDefault();
    const from = $("#s-from").value, to = $("#s-to").value;
    const hit = SCHEDULE.find((f) => f.from === from && f.to === to);
    hit ? showTrack(hit) : toast(`No ${from} → ${to} flight today. Try Colombo → Trincomalee.`);
  });
}

function showTrack(f) {
  const dur = duration(f.from, f.to);
  const box = $("#status-result");
  box.innerHTML = `
    <div class="track">
      <div class="track-head">
        <div><h3 style="margin:0">${f.fno} · ${AIRPORTS[f.from]} to ${AIRPORTS[f.to]}</h3>
        <span style="color:var(--muted)">${f.note || "Operated by LankaSky · ATR 72-600"}</span></div>
        ${pill(f.status)}
      </div>
      <div class="track-route">
        <div class="track-end"><strong>${f.from}</strong><span>${f.dep} · ${AIRPORTS[f.from]}</span></div>
        <div class="track-bar">
          <div class="fill" style="width:${f.progress}%"></div>
          <div class="plane" style="left:${Math.min(Math.max(f.progress, 4), 96)}%">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)"/></svg>
          </div>
        </div>
        <div class="track-end right"><strong>${f.to}</strong><span>${addMins(f.dep, dur)} · ${AIRPORTS[f.to]}</span></div>
      </div>
      <div class="track-info">
        <div><small>Gate</small><b>${f.gate}</b></div>
        <div><small>Terminal</small><b>Domestic</b></div>
        <div><small>Flight time</small><b>${fmtDur(dur)}</b></div>
        <div><small>Baggage</small><b>${f.status === "landed" ? "Belt 2" : "—"}</b></div>
      </div>
    </div>`;
  box.classList.add("show");
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- Contact form ---------- */
function initContact() {
  const form = $("#contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    toast("Thanks! Our team will get back to you within 24 hours.");
  });
}

function initNewsletter() {
  $$(".newsletter").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    toast("You're on the list — watch your inbox for fare deals.");
  }));
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  fillAirportSelects();
  initBooking();
  initFilters();
  initStatus();
  initContact();
  initNewsletter();
});
