// Le Complexe · prototype v2 (données fictives, tout reste dans ce navigateur)
const KEY = "complexe_demo_v1";
const DAY = 86400000;
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const SCENES = {
  sunset: { n: "Sunset", c1: "#f2a65a", c2: "#e9775f" },
  velours: { n: "Velours", c1: "#d9879b", c2: "#a4485a" },
  nuit: { n: "Nuit", c1: "#8a6fd1", c2: "#c0579a" },
  lagon: { n: "Lagon", c1: "#4fb3a8", c2: "#d7a35e" },
  focus: { n: "Focus", c1: "#f3e2c4", c2: "#c9a46a" },
};

const ICONS = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  team: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.6c2.6 0 4.6 1.6 5.5 4.4"/>',
  users: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  euro: '<path d="M18 6.5A7 7 0 1 0 18 17.5"/><path d="M4 10.5h9M4 13.5h9"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v8a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2z"/><path d="M13 6v12" stroke-dasharray="2 2"/>',
};
const ico = (k) => `<svg viewBox="0 0 24 24">${ICONS[k]}</svg>`;

/* ---------------- données ---------------- */
function today0() { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random())).slice(0, 8);

function seed() {
  const pros = [
    { id: "p1", name: "Sofia", act: "Pole dance", room: "lumiere", color: "#f2a65a", blocked: false },
    { id: "p2", name: "Inès", act: "Pilates", room: "cocon", color: "#d9879b", blocked: false },
    { id: "p3", name: "Jade", act: "Tatouage", room: "studio", color: "#8a6fd1", blocked: false },
    { id: "p4", name: "Lou", act: "Bijoux dentaires", room: "studio", color: "#4fb3a8", blocked: false, tbc: true },
  ];
  const rooms = [
    { id: "communs", name: "Accueil et vestiaires", on: false, scene: "sunset", temp: 25 },
    { id: "lumiere", name: "Salle Lumière", on: false, scene: "sunset", temp: 24, light: 80, vol: 45 },
    { id: "cocon", name: "Salle Cocon", on: false, scene: "velours", temp: 25, light: 60, vol: 30 },
    { id: "studio", name: "Studio Encre", on: false, scene: "focus", temp: 23, light: 90, vol: 25 },
  ];
  const S = [];
  const add = (proId, day, h, m, dur, title, cap, price, booked = []) =>
    S.push({ id: uid(), proId, day, start: h * 60 + m, dur, title, cap, price, booked });
  for (let d = 0; d < 7; d++) {
    const wd = new Date(today0() + d * DAY).getDay();
    if (wd === 0) continue;
    add("p1", d, 18, 0, 75, "Pole · Débutante", 8, 25, d === 1 ? ["c1"] : []);
    add("p1", d, 19, 30, 75, "Pole · Intermédiaire", 6, 25);
    add("p2", d, 9, 0, 60, "Pilates · Matwork", 8, 20, d === 2 ? ["c4", "c1"] : []);
    add("p2", d, 12, 15, 45, "Pilates · Pause midi", 8, 18);
    if (wd !== 1) { add("p3", d, 10, 0, 180, "Séance tatouage", 1, 50, d === 3 ? ["c3"] : []); add("p3", d, 14, 30, 150, "Séance tatouage", 1, 50); }
    if (wd === 6) add("p4", d, 11, 0, 45, "Pose de bijou dentaire", 1, 35);
  }
  // un créneau en cours pour Sofia (pour montrer le pilotage de sa salle)
  const st = Math.max(0, Math.floor((nowMin() - 20) / 5) * 5);
  add("p1", 0, Math.floor(st / 60), st % 60, 60, "Cours privé", 1, 45, ["c1"]);
  // l'essai d'hier de Clara
  add("p1", -1, 19, 30, 75, "Pole · Intermédiaire", 6, 25, ["c2"]);
  const trialClara = S[S.length - 1].id;
  const trialAwa = S.find((s) => s.proId === "p2" && s.booked.includes("c4")).id;

  return {
    seeded: today0(),
    role: "owner", proId: "p1", clientId: "c1",
    view: { owner: "home", pro: "plan", client: "book" },
    day: { owner: 0, pro: 0, client: 0 },
    pendingInvite: null,
    settings: { code: false, delay: 24, linkDays: 7, amb: { p3: true } },
    pros, rooms, slots: S,
    clients: [
      { id: "c1", name: "Nora", contact: "nora@exemple.fr", since: "sept.", access: { p1: { status: "unlocked", by: "p1" }, p2: { status: "unlocked", by: "p2" } } },
      { id: "c2", name: "Clara", contact: "06 94 •• •• 12", since: "hier", access: { p1: { status: "trial", slot: trialClara, by: "p1" } } },
      { id: "c3", name: "Maëlle", contact: "maelle@exemple.fr", since: "oct.", access: { p3: { status: "unlocked", by: "p3" } } },
      { id: "c4", name: "Awa", contact: "awa@exemple.fr", since: "lundi", access: { p2: { status: "trial", slot: trialAwa, by: "p2" } } },
    ],
    invites: [{ code: "LENA-7K2Q", proId: "p1", name: "Léna", created: Date.now() - DAY, used: false }],
  };
}

let st;
try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) { st = null; }
if (!st || st.seeded !== today0()) st = seed();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

/* ---------------- helpers métier ---------------- */
const pro = (id) => st.pros.find((p) => p.id === id);
const room = (id) => st.rooms.find((r) => r.id === id);
const client = (id) => st.clients.find((c) => c.id === id);
const slot = (id) => st.slots.find((s) => s.id === id);
const at = (s) => today0() + s.day * DAY + s.start * 60000;
const endAt = (s) => at(s) + s.dur * 60000;
const hm = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const dayLabel = (d) => d === 0 ? "Aujourd'hui" : d === 1 ? "Demain" : d === -1 ? "Hier" :
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(today0() + d * DAY));
const dayShort = (d) => new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(today0() + d * DAY)).replace(".", "");
const dayNum = (d) => new Date(today0() + d * DAY).getDate();
const euros = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const inviteValid = (i) => !i.used && !i.cancelled && Date.now() - i.created < st.settings.linkDays * DAY;
const linkFor = (code) => `${location.origin}${location.pathname}#invite=${code}`;
const initials = (n) => n.slice(0, 1).toUpperCase();
const slotsOf = (pid) => st.slots.filter((s) => s.proId === pid).sort((a, b) => at(a) - at(b));
const isLive = (s) => Date.now() >= at(s) - 10 * 60000 && Date.now() < endAt(s);
const trialsOf = (pid) => st.clients.filter((c) => c.access[pid]?.status === "trial");
const trialPast = (c, pid) => { const s = slot(c.access[pid]?.slot); return s && endAt(s) < Date.now(); };

function clientCanBook(c, s) {
  const a = c.access[s.proId];
  if (!a || pro(s.proId).blocked) return false;
  if (a.status === "unlocked") return true;
  return a.status === "trial" && !a.slot;
}

/* ---------------- rendu ---------------- */
const scr = $("#scr");
function go(fn) {
  const run = () => { fn(); render(true); };
  if (document.startViewTransition && !reduced) document.startViewTransition(run); else run();
}
function render(top) {
  const y = scr.scrollTop;
  const r = st.role;
  const v = st.view[r];
  let html = "";
  if (r === "owner") html = { home: ownerHome, plan: ownerPlan, lieu: ownerLieu, pros: ownerPros, clients: ownerClients }[v]();
  if (r === "pro") html = (pro(st.proId).blocked ? blockedBanner() : "") + { plan: proPlan, clients: proClients, salle: proSalle, rev: proRev }[v]();
  if (r === "client") html = st.clientId ? { book: clientBook, mine: clientMine, me: clientMe }[v]() : (st.pendingInvite ? clientInvite() : clientWelcome());
  scr.innerHTML = html;
  scr.scrollTop = top ? 0 : y;
  renderTabs(); renderSwitcher(); renderGlow(); renderHowto();
  save();
}

function renderTabs() {
  const r = st.role;
  let tabs = [];
  if (r === "owner") tabs = [["home", "Accueil", "home"], ["plan", "Planning", "cal"], ["lieu", "Le lieu", "sun"], ["pros", "Pros", "team"], ["clients", "Clientes", "users"]];
  if (r === "pro") tabs = [["plan", "Planning", "cal"], ["clients", "Clientes", "users", trialsOf(st.proId).filter((c) => trialPast(c, st.proId)).length], ["salle", "Ma salle", "sun"], ["rev", "Revenus", "euro"]];
  if (r === "client") tabs = st.clientId ? [["book", "Réserver", "cal"], ["mine", "Mes séances", "ticket"], ["me", "Profil", "users"]] : [];
  const tb = $("#tabbar");
  tb.hidden = !tabs.length;
  tb.innerHTML = tabs.map(([k, l, i, n]) =>
    `<button class="tab" role="tab" data-a="tab" data-v="${k}" aria-selected="${st.view[r] === k}">${ico(i)}${l}${n ? `<span class="badge">${n}</span>` : ""}</button>`).join("");
}

function renderSwitcher() {
  document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-selected", b.dataset.role === st.role));
  const sel = $("#who");
  if (st.role === "owner") { sel.innerHTML = "<option>Marion ou Manon</option>"; sel.disabled = true; return; }
  sel.disabled = false;
  if (st.role === "pro") sel.innerHTML = st.pros.map((p) => `<option value="${p.id}" ${p.id === st.proId ? "selected" : ""}>${esc(p.name)} · ${esc(p.act)}</option>`).join("");
  if (st.role === "client") sel.innerHTML = st.clients.map((c) => `<option value="${c.id}" ${c.id === st.clientId ? "selected" : ""}>${esc(c.name)}</option>`).join("") +
    `<option value="" ${!st.clientId ? "selected" : ""}>Nouvelle personne</option>`;
}

function renderGlow() {
  let sc = "sunset";
  if (st.role === "owner") sc = room("lumiere").on ? room("lumiere").scene : "sunset";
  if (st.role === "pro") sc = room(pro(st.proId).room).scene;
  if (st.role === "client" && st.clientId) {
    const next = st.slots.filter((s) => s.booked.includes(st.clientId) && endAt(s) > Date.now()).sort((a, b) => at(a) - at(b))[0];
    if (next) sc = next.scene || room(pro(next.proId).room).scene;
  }
  const s = SCENES[sc];
  document.documentElement.style.setProperty("--glow", s.c1);
  document.documentElement.style.setProperty("--glow2", s.c2);
}

const HOWTO = {
  owner: ["« Ouvrir le lieu » : le scénario du matin, depuis chez vous.", "Onglet Pros : bloquez ou débloquez un compte.", "Onglet Clientes : qui a invité qui, et qui est débloquée.", "La roue crantée : les réglages (code d'accès en option)."],
  pro: ["Clientes → « Inviter » : un lien pour une seule personne.", "« Ouvrir comme la cliente » pour voir ce qu'elle reçoit.", "Après l'essai : Débloquer ou Ne pas donner suite.", "Ma salle : active seulement pendant vos créneaux (essayez Sofia, puis Jade)."],
  client: ["Sans invitation, on ne peut pas s'inscrire.", "Avec un lien : un compte, une seule réservation d'essai.", "Une fois débloquée : seulement les activités de la pro qui l'a débloquée.", "Essayez Nora (débloquée), Clara (essai fait), puis « Nouvelle personne »."],
};
function renderHowto() {
  $("#howto").innerHTML = `<b>À essayer</b><ol>${HOWTO[st.role].map((t) => `<li>${t}</li>`).join("")}</ol>`;
}

const hd = (small, title, act = "") => `<div class="hd"><div><small>${small}</small><h2>${title}</h2></div>${act ? `<div class="act">${act}</div>` : ""}</div>`;
const sec = (t, s = "") => `<div class="sec"><h3>${t}</h3>${s ? `<span>${s}</span>` : ""}</div>`;
const tg = (on, a, data = "", dis = false) => `<button class="tg" aria-pressed="${!!on}" data-a="${a}" ${data} ${dis ? "disabled" : ""}></button>`;
function days(role, from = 0) {
  let h = '<div class="days">';
  for (let d = from; d < 7; d++) h += `<button class="day" data-a="day" data-d="${d}" aria-pressed="${st.day[role] === d}"><small>${d === 0 ? "auj." : dayShort(d)}</small><b>${dayNum(d)}</b></button>`;
  return h + "</div>";
}
function slotRow(s, opts = {}) {
  const p = pro(s.proId), full = s.booked.length >= s.cap;
  const left = s.cap === 1 ? (full ? "Réservé" : "Libre") : `${s.booked.length}/${s.cap}`;
  const live = isLive(s) ? '<span class="pill ok">en cours</span>' : "";
  return `<div class="card g row ${opts.lock ? "lock" : ""}" ${opts.a ? `data-a="${opts.a}" data-id="${s.id}" role="button"` : ""}>
    <div class="time"><b>${hm(s.start)}</b><small>${s.dur} min</small></div>
    <div class="dot" style="background:${p.color};width:6px;height:38px;border-radius:4px"></div>
    <div class="grow"><b>${esc(s.title)}</b><small>${opts.showPro ? esc(p.name) + " · " : ""}${esc(room(p.room).name)} · ${euros(s.price)}</small></div>
    ${live || `<span class="pill ${full ? "mute" : ""}">${left}</span>`}</div>`;
}
const blockedBanner = () => `<div class="banner">⏸ Votre compte est suspendu par la propriétaire. Vos clientes ne voient plus vos créneaux et vous ne pouvez plus inviter ni piloter la salle.</div>`;

/* ---------------- PROPRIÉTAIRE ---------------- */
function ownerHome() {
  const todays = st.slots.filter((s) => s.day === 0).sort((a, b) => a.start - b.start);
  const month = 3420 + st.slots.filter((s) => s.day <= 0).reduce((t, s) => t + s.booked.length * s.price, 0);
  const trials = st.clients.filter((c) => Object.values(c.access).some((a) => a.status === "trial")).length;
  const on = st.rooms.filter((r) => r.on).length;
  const hour = new Date().getHours();
  return hd(dayLabel(0), hour < 12 ? "Bonjour" : hour < 18 ? "Bel après-midi" : "Bonsoir", `<button class="ibtn" data-a="settings" aria-label="Réglages">${ico("gear")}</button>`) +
    `<div class="big"><button class="btn" data-a="openAll">☀︎ Ouvrir le lieu</button><button class="btn ghost" data-a="closeAll">Tout éteindre</button></div>
    <div class="kpis">
      <div class="kpi g"><small>Séances aujourd'hui</small><b>${todays.length}</b></div>
      <div class="kpi g"><small>Ce mois-ci</small><b>${euros(month)}</b></div>
      <div class="kpi g ${trials ? "hot" : ""}" data-a="nav" data-v="clients" role="button"><small>Essais en cours</small><b>${trials}</b></div>
      <div class="kpi g" data-a="nav" data-v="lieu" role="button"><small>Salles allumées</small><b>${on}/${st.rooms.length}</b></div>
    </div>` +
    sec("Aujourd'hui", `${todays.length} créneaux`) +
    (todays.length ? todays.map((s) => slotRow(s, { showPro: true })).join("") : '<div class="empty">Rien de prévu aujourd\'hui.</div>');
}

function ownerPlan() {
  const d = st.day.owner;
  const list = st.slots.filter((s) => s.day === d).sort((a, b) => a.start - b.start);
  return hd("Toutes les salles", "Planning") + days("owner") + sec(dayLabel(d), `${list.length} créneaux`) +
    (list.length ? list.map((s) => slotRow(s, { showPro: true })).join("") : '<div class="empty">Le lieu est fermé ce jour-là.</div>') +
    `<div class="chips">${st.pros.map((p) => `<span class="chip"><i style="background:${p.color}"></i>${esc(p.name)} · ${esc(p.act)}</span>`).join("")}</div>`;
}

function sceneChips(r, a, dis = false) {
  return `<div class="chips">${Object.entries(SCENES).map(([k, s]) =>
    `<button class="chip" data-a="${a}" data-room="${r.id}" data-scene="${k}" aria-pressed="${r.scene === k && r.on}" ${dis ? "disabled" : ""}><i style="background:linear-gradient(135deg,${s.c1},${s.c2})"></i>${s.n}</button>`).join("")}</div>`;
}
function ownerLieu() {
  return hd("Pilotage à distance", "Le lieu") +
    `<div class="big"><button class="btn" data-a="openAll">☀︎ Ouvrir le lieu</button><button class="btn ghost" data-a="closeAll">Tout éteindre</button></div>` +
    st.rooms.map((r) => `<div class="card g">
      <div class="row"><div class="dot" style="background:linear-gradient(135deg,${SCENES[r.scene].c1},${SCENES[r.scene].c2});${r.on ? "" : "filter:grayscale(1) brightness(.5)"}"></div>
      <div class="grow"><b>${esc(r.name)}</b><small>${r.on ? `${SCENES[r.scene].n} · ${r.temp} °C` : "Éteinte"}${occupant(r)}</small></div>${tg(r.on, "roomOn", `data-room="${r.id}"`)}</div>
      ${sceneChips(r, "scene")}</div>`).join("") +
    sec("Automatismes") +
    `<div class="card g"><div class="row"><div class="grow"><b>Ambiance avant chaque créneau</b><small>La scène de la salle se lance 10 min avant, puis tout s'éteint 15 min après.</small></div>${tg(true, "noop")}</div></div>
     <div class="card g"><div class="row"><div class="grow"><b>Fermeture de sécurité à 23:00</b><small>Tout s'éteint, clim comprise, s'il n'y a plus de créneau.</small></div>${tg(true, "noop")}</div></div>
     <div class="banner info">Aussi dans l'app Maison d'Apple et avec Siri (« Dis Siri, ouvre le complexe »), avec le concentrateur resté sur place.</div>`;
}
function occupant(r) {
  const s = st.slots.find((x) => isLive(x) && pro(x.proId).room === r.id);
  return s ? ` · en cours : ${esc(pro(s.proId).name)}` : "";
}

function proStats(p) {
  const ss = slotsOf(p.id);
  const rev = 640 + ss.filter((s) => s.day <= 0).reduce((t, s) => t + s.booked.length * s.price, 0);
  const cl = st.clients.filter((c) => c.access[p.id]?.status === "unlocked").length;
  return { rev, cl, n: ss.filter((s) => s.day >= 0).length };
}
function ownerPros() {
  return hd(`${st.pros.length} pros dans le complexe`, "Les pros", `<button class="btn sm ghost" data-a="invitePro">+ Inviter</button>`) +
    st.pros.map((p) => {
      const s = proStats(p);
      return `<div class="card g ${p.blocked ? "lock" : ""}"><div class="row">
        <div class="av" style="background:${p.color}" data-a="proDetail" data-id="${p.id}" role="button">${initials(p.name)}</div>
        <div class="grow" data-a="proDetail" data-id="${p.id}" role="button"><b>${esc(p.name)} ${p.tbc ? '<span class="pill mute">à confirmer</span>' : ""}</b><small>${esc(p.act)} · ${esc(room(p.room).name)}<br>${s.cl} clientes · ${euros(s.rev)} ce mois-ci</small></div>
        ${tg(!p.blocked, "proBlock", `data-id="${p.id}"`)}</div></div>`;
    }).join("") +
    `<p class="empty" style="padding-top:6px">L'interrupteur active ou suspend le compte de la pro (absence, départ).</p>`;
}

function accessPills(c) {
  return Object.entries(c.access).map(([pid, a]) => {
    const p = pro(pid);
    const cls = a.status === "unlocked" ? "ok" : a.status === "trial" ? "" : "mute";
    const lbl = a.status === "unlocked" ? "débloquée" : a.status === "trial" ? (trialPast(c, pid) ? "essai fait" : a.slot ? "essai réservé" : "essai à réserver") : "sans suite";
    return `<span class="pill ${cls}">${esc(p.act)} · ${lbl}</span>`;
  }).join(" ");
}
function ownerClients() {
  const pend = st.invites.filter(inviteValid);
  return hd(`${st.clients.length} clientes · sur invitation`, "Clientes", `<button class="btn sm ghost" data-a="invite">+ Inviter</button>`) +
    st.clients.map((c) => `<div class="card g" data-a="clientDetail" data-id="${c.id}" role="button"><div class="row"><div class="av">${initials(c.name)}</div>
      <div class="grow"><b>${esc(c.name)}</b><small>Invitée par ${esc(pro(Object.values(c.access)[0].by).name)} · depuis ${esc(c.since)}</small></div></div>
      <div class="chips" style="margin-top:10px">${accessPills(c)}</div></div>`).join("") +
    (pend.length ? sec("Invitations en attente") + pend.map(inviteRow).join("") : "");
}
function inviteRow(i) {
  const left = Math.max(1, Math.ceil((i.created + st.settings.linkDays * DAY - Date.now()) / DAY));
  return `<div class="card g row"><div class="grow"><b>${esc(i.name)}</b><small>Lien de ${esc(pro(i.proId).name)} · expire dans ${left} j</small></div>
    <button class="btn sm ghost" data-a="openInvite" data-code="${i.code}">Ouvrir</button><button class="btn sm ghost" data-a="cancelInvite" data-code="${i.code}" aria-label="Annuler">✕</button></div>`;
}

/* ---------------- PRO ---------------- */
function proPlan() {
  const p = pro(st.proId), d = st.day.pro;
  const list = slotsOf(p.id).filter((s) => s.day === d);
  return hd(`${esc(p.act)} · ${esc(room(p.room).name)}`, `Bonjour ${esc(p.name)}`, `<button class="btn sm ghost" data-a="newSlot" ${p.blocked ? "disabled" : ""}>+ Créneau</button>`) +
    days("pro") + sec(dayLabel(d), `${list.length} créneaux`) +
    (list.length ? list.map((s) => slotRow(s, { a: "slotDetail" })).join("") : '<div class="empty">Aucun créneau ce jour-là.</div>');
}

function proClients() {
  const p = pro(st.proId);
  const trials = trialsOf(p.id).sort((a, b) => trialPast(b, p.id) - trialPast(a, p.id));
  const unlocked = st.clients.filter((c) => c.access[p.id]?.status === "unlocked");
  const pend = st.invites.filter((i) => i.proId === p.id && inviteValid(i));
  return hd("Sur invitation uniquement", "Mes clientes") +
    `<button class="btn" data-a="invite" ${p.blocked ? "disabled" : ""}>Inviter une cliente</button>` +
    sec("Essais à décider", trials.length ? String(trials.length) : "") +
    (trials.length ? trials.map((c) => {
      const s = slot(c.access[p.id].slot), past = trialPast(c, p.id);
      const info = !s ? "Compte créé, essai pas encore réservé" : past ? `Séance faite ${dayLabel(s.day).toLowerCase()} · à vous de décider` : `Essai prévu ${dayLabel(s.day).toLowerCase()} à ${hm(s.start)}`;
      return `<div class="card g ${past ? "" : ""}" style="${past ? "border-color:rgba(242,166,90,.55)" : ""}"><div class="row"><div class="av">${initials(c.name)}</div>
        <div class="grow"><b>${esc(c.name)}</b><small>${info}</small></div></div>
        <div class="btns"><button class="btn sm" data-a="unlock" data-id="${c.id}">Débloquer</button><button class="btn sm ghost" data-a="decline" data-id="${c.id}">Ne pas donner suite</button></div>
        ${past ? "" : '<small style="display:block;color:var(--ink3);font-size:11.5px;margin-top:8px">En vrai, ces boutons apparaissent après la séance. Ici, vous pouvez décider tout de suite.</small>'}</div>`;
    }).join("") : '<div class="empty">Aucun essai en attente.</div>') +
    (pend.length ? sec("Liens envoyés") + pend.map(inviteRow).join("") : "") +
    sec("Clientes débloquées", String(unlocked.length)) +
    (unlocked.length ? unlocked.map((c) => `<div class="card g row"><div class="av">${initials(c.name)}</div><div class="grow"><b>${esc(c.name)}</b><small>${st.slots.filter((s) => s.proId === p.id && s.booked.includes(c.id)).length} séance(s) réservée(s) · ${esc(c.contact)}</small></div><span class="pill ok">débloquée</span></div>`).join("") : '<div class="empty">Pas encore de cliente débloquée.</div>');
}

function proSalle() {
  const p = pro(st.proId), r = room(p.room);
  const live = slotsOf(p.id).find(isLive);
  const next = slotsOf(p.id).find((s) => at(s) > Date.now());
  const can = live && !p.blocked;
  return hd(esc(r.name), "Ma salle") +
    (can ? `<div class="hero g"><div class="tag">● En cours · jusqu'à ${hm(live.start + live.dur)}</div><h3>${esc(live.title)}</h3><p>Vous pilotez ${esc(r.name)} jusqu'à la fin de votre créneau.</p></div>`
      : `<div class="hero g"><div class="tag">Hors créneau</div><h3>Disponible pendant vos créneaux</h3><p>${next ? `Prochain : ${dayLabel(next.day).toLowerCase()} à ${hm(next.start)}. Les commandes s'ouvrent 10 min avant.` : "Aucun créneau à venir."}</p></div>`) +
    `<div class="card g ${can ? "" : "lock"}"><div class="row"><div class="grow"><b>Lumière et musique</b><small>${r.on ? SCENES[r.scene].n : "Éteinte"}</small></div>${tg(r.on, "roomOn", `data-room="${r.id}"`, !can)}</div>
      ${sceneChips(r, "scene", !can)}
      <label class="field" style="margin:14px 0 0"><span>Intensité · ${r.light}%</span><input class="slider" type="range" min="0" max="100" value="${r.light}" data-a="light" data-room="${r.id}" ${can ? "" : "disabled"}></label>
      <label class="field" style="margin:6px 0 0"><span>Volume · ${r.vol}%</span><input class="slider" type="range" min="0" max="100" value="${r.vol}" data-a="vol" data-room="${r.id}" ${can ? "" : "disabled"}></label></div>` +
    sec("Mes clientes et l'ambiance") +
    `<div class="card g row"><div class="grow"><b>Proposer le choix de l'ambiance</b><small>À la réservation, vos clientes peuvent choisir leur ambiance. Désactivé par défaut.</small></div>${tg(st.settings.amb[p.id], "ambClient", `data-id="${p.id}"`)}</div>
    <div class="banner info">Le serveur vérifie trois choses avant chaque ordre : qui vous êtes, que votre créneau est en cours, et que c'est bien votre salle. Personne d'autre ne peut toucher à la salle pendant ce temps.</div>`;
}

function proRev() {
  const p = pro(st.proId), s = proStats(p);
  const up = slotsOf(p.id).filter((x) => x.day >= 0 && x.booked.length);
  return hd("Novembre", "Mes revenus") +
    `<div class="kpis"><div class="kpi g"><small>Ce mois-ci</small><b>${euros(s.rev)}</b></div><div class="kpi g"><small>Clientes</small><b>${s.cl}</b></div></div>` +
    sec("À venir, déjà payé") +
    (up.length ? up.map((x) => `<div class="card g row"><div class="time"><b>${hm(x.start)}</b><small>${x.day === 0 ? "auj." : dayShort(x.day)}</small></div><div class="grow"><b>${esc(x.title)}</b><small>${x.booked.map((id) => esc(client(id)?.name)).join(", ")}</small></div><span class="pill ok">${euros(x.price * x.booked.length)}</span></div>`).join("") : '<div class="empty">Rien pour le moment.</div>') +
    `<div class="banner info">En production, les paiements arrivent directement sur votre compte (Stripe Connect). Le lieu prend sa part automatiquement.</div>`;
}

/* ---------------- CLIENTE ---------------- */
function clientWelcome() {
  const pend = st.invites.filter(inviteValid);
  return `<div style="text-align:center;padding:40px 6px 10px"><img src="../app/icon-192.png" alt="" style="width:84px;height:84px;border-radius:22px;box-shadow:0 18px 40px -12px var(--glow)">
    <h2 style="font-size:32px;margin:18px 0 8px">Le Complexe</h2><p style="color:var(--ink2)">L'accès se fait sur invitation. Demandez un lien à votre coach ou à votre artiste.</p></div>` +
    sec("Liens reçus sur ce téléphone (démo)") +
    (pend.length ? pend.map((i) => `<div class="card g row" data-a="openInvite" data-code="${i.code}" role="button"><div class="grow"><b>Invitation pour ${esc(i.name)}</b><small>De la part de ${esc(pro(i.proId).name)} · ${esc(pro(i.proId).act)}</small></div><span class="pill">Ouvrir</span></div>`).join("")
      : '<div class="empty">Aucun lien. Passez en « Pro » et générez-en un.</div>');
}

function clientInvite() {
  const i = st.invites.find((x) => x.code === st.pendingInvite);
  if (!i || !inviteValid(i)) return `<div class="empty" style="padding-top:80px">Ce lien n'est plus valable. Il a déjà servi, a expiré ou a été annulé.</div><button class="btn ghost" data-a="leaveInvite">Retour</button>`;
  const p = pro(i.proId);
  return `<div class="hero g" style="margin-top:10px"><div class="tag">Invitation personnelle</div><h3>${esc(p.name)} vous invite au Complexe</h3><p>${esc(p.act)} · ${esc(room(p.room).name)}. Ce lien est à votre nom et ne sert qu'une fois.</p></div>
    <form data-form="signup">
      <label class="field"><span>Prénom</span><input name="name" required value="${esc(i.name)}" autocomplete="given-name"></label>
      <label class="field"><span>E-mail ou téléphone</span><input name="contact" required placeholder="vous@exemple.fr" autocomplete="email"></label>
      <label class="check"><input type="checkbox" name="ok" required> J'ai lu et j'accepte le règlement intérieur et la décharge de responsabilité.</label>
      <button class="btn" type="submit">Créer mon compte</button>
    </form>
    <p style="color:var(--ink3);font-size:12.5px;margin-top:12px;text-align:center">Pas de mot de passe : en vrai, vous recevez un lien ou un code de connexion.</p>`;
}

function clientBook() {
  const c = client(st.clientId), d = st.day.client;
  const trial = Object.entries(c.access).find(([, a]) => a.status === "trial");
  const anyOpen = st.slots.some((s) => clientCanBook(c, s));
  const list = st.slots.filter((s) => s.day === d && at(s) > Date.now() && clientCanBook(c, s)).sort((a, b) => a.start - b.start);
  let top = "";
  if (trial && !trial[1].slot) top = `<div class="banner info">✦ Votre réservation d'essai avec ${esc(pro(trial[0]).name)}. Vous pouvez en faire une seule. Ensuite, ${esc(pro(trial[0]).name)} vous ouvrira la suite.</div>`;
  if (!anyOpen) return hd(`Bonjour ${esc(c.name)}`, "Réserver") + waitingCard(c);
  return hd(`Bonjour ${esc(c.name)}`, "Réserver") + top + days("client") + sec(dayLabel(d)) +
    (list.length ? list.map((s) => slotRow(s, { a: "book", showPro: true })).join("") : '<div class="empty">Aucun créneau ouvert pour vous ce jour-là.</div>') +
    `<p style="color:var(--ink3);font-size:12.5px;text-align:center;margin-top:8px">Vous voyez seulement les activités qui vous ont été ouvertes.</p>`;
}
function waitingCard(c) {
  const t = Object.entries(c.access).find(([, a]) => a.status === "trial" && a.slot);
  if (t) { const s = slot(t[1].slot), p = pro(t[0]);
    return `<div class="hero g"><div class="tag">${trialPast(c, t[0]) ? "Séance d'essai faite" : "Essai réservé"}</div><h3>${trialPast(c, t[0]) ? `Merci d'être venue !` : `${dayLabel(s.day)} à ${hm(s.start)}`}</h3><p>${trialPast(c, t[0]) ? `${esc(p.name)} vous ouvrira l'accès aux prochaines réservations très vite.` : `${esc(s.title)} avec ${esc(p.name)}. Après la séance, ${esc(p.name)} vous ouvrira l'accès aux prochaines réservations.`}</p></div>`; }
  return `<div class="hero g"><div class="tag">Pas de créneau ouvert</div><h3>Rien à réserver pour le moment</h3><p>Vos accès ne sont plus actifs. Contactez votre coach ou votre artiste.</p></div>`;
}

function clientMine() {
  const c = client(st.clientId);
  const mine = st.slots.filter((s) => s.booked.includes(c.id)).sort((a, b) => at(a) - at(b));
  const up = mine.filter((s) => endAt(s) > Date.now()), past = mine.filter((s) => endAt(s) <= Date.now());
  const row = (s) => { const p = pro(s.proId), late = at(s) - Date.now() < st.settings.delay * 3600000;
    return `<div class="card g"><div class="row"><div class="time"><b>${hm(s.start)}</b><small>${s.day === 0 ? "auj." : dayShort(s.day)}</small></div><div class="grow"><b>${esc(s.title)}</b><small>${esc(p.name)} · ${esc(room(p.room).name)}${s.scene ? ` · ambiance ${SCENES[s.scene].n}` : ""}</small></div>${isLive(s) ? '<span class="pill ok">en cours</span>' : ""}</div>
      ${st.settings.code ? `<div class="line" style="margin-top:10px"><span>Code d'accès</span><b style="letter-spacing:.2em">${codeFor(s, c)}</b></div>` : ""}
      ${endAt(s) > Date.now() && !isLive(s) ? `<div class="btns"><button class="btn sm ghost" data-a="cancel" data-id="${s.id}" ${late ? "disabled" : ""}>${late ? `Annulation possible jusqu'à ${st.settings.delay} h avant` : "Annuler"}</button></div>` : ""}</div>`; };
  return hd(esc(c.name), "Mes séances") + sec("À venir") + (up.length ? up.map(row).join("") : waitingOr(c)) +
    (past.length ? sec("Passées") + past.map((s) => `<div class="card g row lock"><div class="time"><b>${hm(s.start)}</b><small>${dayShort(s.day)}</small></div><div class="grow"><b>${esc(s.title)}</b><small>${esc(pro(s.proId).name)}</small></div></div>`).join("") : "");
}
const waitingOr = (c) => Object.values(c.access).some((a) => a.status === "trial") ? waitingCard(c) : '<div class="empty">Aucune séance à venir.</div>';
const codeFor = (s, c) => String(1000 + ((parseInt(s.id, 16) || 7) + c.id.charCodeAt(1) * 97) % 9000);

function clientMe() {
  const c = client(st.clientId);
  return hd("Profil", esc(c.name)) +
    `<div class="card g row"><div class="av">${initials(c.name)}</div><div class="grow"><b>${esc(c.name)}</b><small>${esc(c.contact)} · membre depuis ${esc(c.since)}</small></div></div>` +
    sec("Mes accès") +
    Object.entries(c.access).map(([pid, a]) => { const p = pro(pid);
      const lbl = a.status === "unlocked" ? '<span class="pill ok">ouvert</span>' : a.status === "trial" ? '<span class="pill">essai</span>' : '<span class="pill mute">terminé</span>';
      return `<div class="card g row"><div class="dot" style="background:${p.color}">${initials(p.name)}</div><div class="grow"><b>${esc(p.act)}</b><small>avec ${esc(p.name)}</small></div>${lbl}</div>`; }).join("") +
    sec("Documents") +
    `<div class="card g row"><div class="grow"><b>Règlement intérieur et décharge</b><small>Signés à l'inscription</small></div><span class="pill ok">✓</span></div>` +
    sec("Application") +
    `<div class="card g"><b style="font-size:14.5px">Ajouter à l'écran d'accueil</b><small style="display:block;color:var(--ink3);font-size:12.5px">Dans Safari : ⋯ → Partager → « Sur l'écran d'accueil ». L'app s'ouvre ensuite en plein écran, avec ses notifications.</small></div>`;
}

/* ---------------- feuilles ---------------- */
const sheet = $("#sheet"), sheetBody = $("#sheetBody");
function openSheet(html) {
  sheetBody.innerHTML = html;
  const dev = $("#device").getBoundingClientRect();
  if (innerWidth > 820) { sheet.style.width = dev.width + "px"; sheet.style.marginBottom = Math.max(0, innerHeight - dev.bottom) + "px"; sheet.style.marginLeft = dev.left + "px"; }
  else { sheet.style.width = ""; sheet.style.marginBottom = ""; sheet.style.marginLeft = ""; }
  if (!sheet.open) sheet.showModal();
}
const closeSheet = () => sheet.close();
sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  try { t.hidePopover(); t.showPopover(); } catch (e) { t.style.display = "block"; }
  clearTimeout(toast.h);
  toast.h = setTimeout(() => { try { t.hidePopover(); } catch (e) { t.style.display = ""; } }, 2600);
}

function inviteSheet(forced) {
  const pid = st.role === "pro" ? st.proId : null;
  openSheet(`<h3>Inviter une cliente</h3><p class="meta">Un lien pour une seule personne, valable ${st.settings.linkDays} jours. Elle aura droit à une réservation d'essai.</p>
    <form data-form="invite">
      ${pid ? "" : `<label class="field"><span>Pour quelle activité ?</span><select name="pro" style="width:100%;height:48px;border-radius:14px;border:1px solid var(--line);background:rgba(0,0,0,.2);padding:0 12px">${st.pros.filter((p) => !p.blocked).map((p) => `<option value="${p.id}">${esc(p.act)} · ${esc(p.name)}</option>`).join("")}</select></label>`}
      <label class="field"><span>Prénom de la personne</span><input name="name" required placeholder="Ex. Léna" autocomplete="off"></label>
      <button class="btn" type="submit">Créer le lien</button></form>`);
}
function linkSheet(i) {
  openSheet(`<div class="done"><div class="ring"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h3>Lien prêt pour ${esc(i.name)}</h3>
    <p class="meta">À envoyer en DM Instagram, par SMS ou WhatsApp. Il ne marche qu'une fois.</p></div>
    <div class="lnk">${esc(linkFor(i.code))}</div>
    <div class="btns"><button class="btn ghost" data-a="copy" data-code="${i.code}">Copier</button>${navigator.share ? `<button class="btn ghost" data-a="share" data-code="${i.code}">Envoyer…</button>` : ""}</div>
    <button class="btn" style="margin-top:10px" data-a="openInvite" data-code="${i.code}">Ouvrir comme ${esc(i.name)} (démo)</button>`);
}

function bookSheet(s) {
  const p = pro(s.proId), c = client(st.clientId), r = room(p.room);
  const trial = c.access[p.id].status === "trial";
  const amb = st.settings.amb[p.id];
  openSheet(`<h3>${esc(s.title)}</h3><p class="meta">${dayLabel(s.day)} · ${hm(s.start)} · ${esc(p.name)} · ${esc(r.name)}</p>
    ${trial ? '<div class="banner info">✦ C\'est votre réservation d\'essai.</div>' : ""}
    ${amb ? `<div class="sec" style="margin-top:4px"><h3>Votre ambiance</h3><span>proposée par ${esc(p.name)}</span></div><div class="chips" id="ambPick">${Object.entries(SCENES).map(([k, x], n) => `<button class="chip" data-a="pickAmb" data-scene="${k}" aria-pressed="${n === 0}"><i style="background:linear-gradient(135deg,${x.c1},${x.c2})"></i>${x.n}</button>`).join("")}</div>` : ""}
    <div class="line" style="margin-top:14px"><span>Durée</span><b>${s.dur} min</b></div><div class="line"><span>Tarif</span><b>${euros(s.price)}</b></div>
    <button class="btn" style="margin-top:12px" data-a="pay" data-id="${s.id}">Payer avec Apple Pay</button>
    <p style="text-align:center;color:var(--ink3);font-size:12px;margin-top:8px">Carte, Apple Pay, Google Pay · paiement sécurisé (simulé)</p>`);
}

/* ---------------- actions ---------------- */
const A = {
  tab: (d) => go(() => { st.view[st.role] = d.v; }),
  nav: (d) => go(() => { st.view[st.role] = d.v; }),
  day: (d) => { st.day[st.role] = +d.d; render(); },
  noop: () => toast("Réglage modifiable en production."),
  settings: () => openSheet(`<h3>Réglages</h3><p class="meta">Pour Marion et Manon.</p>
    <div class="line"><span>Sur invitation uniquement</span><b>Toujours activé</b></div>
    <div class="line"><span>Validité d'un lien</span><b>${st.settings.linkDays} jours · 1 personne</b></div>
    <div class="line"><span>Annulation possible jusqu'à</span><b>${st.settings.delay} h avant</b></div>
    <div class="sec"><h3>Options</h3></div>
    <div class="card g row"><div class="grow"><b>Code d'accès par réservation</b><small>Option. Rien ne change pour l'entrée tant que c'est désactivé.</small></div>${tg(st.settings.code, "codeOpt")}</div>
    <div class="sec"><h3>Choix de l'ambiance par les clientes</h3><span>chaque pro décide</span></div>
    ${st.pros.map((p) => `<div class="card g row"><div class="grow"><b>${esc(p.act)}</b><small>${esc(p.name)}</small></div>${tg(st.settings.amb[p.id], "ambClient", `data-id="${p.id}"`)}</div>`).join("")}`),
  codeOpt: (d, el) => { st.settings.code = !st.settings.code; el.setAttribute("aria-pressed", st.settings.code); render(); toast(st.settings.code ? "Code d'accès activé (option)." : "Code d'accès désactivé."); },
  ambClient: (d, el) => { st.settings.amb[d.id] = !st.settings.amb[d.id]; el.setAttribute("aria-pressed", !!st.settings.amb[d.id]); render(); },
  openAll: () => { st.rooms.forEach((r) => { if (r.id === "communs" || st.slots.some((s) => s.day === 0 && pro(s.proId).room === r.id)) r.on = true; }); render(); toast("☀︎ Le lieu s'ouvre : lumières, clim et musique des salles du jour."); },
  closeAll: () => { st.rooms.forEach((r) => (r.on = false)); render(); toast("Tout est éteint."); },
  roomOn: (d) => { const r = room(d.room); if (!guardRoom(r)) return; r.on = !r.on; render(); },
  scene: (d) => { const r = room(d.room); if (!guardRoom(r)) return; r.scene = d.scene; r.on = true; render(); toast(`${r.name} : ambiance ${SCENES[d.scene].n}.`); },
  proBlock: (d) => { const p = pro(d.id); p.blocked = !p.blocked; if (p.blocked) st.invites.filter((i) => i.proId === p.id && !i.used).forEach((i) => (i.cancelled = true)); render(); toast(p.blocked ? `Compte de ${p.name} suspendu. Ses liens non utilisés sont annulés.` : `Compte de ${p.name} réactivé.`); },
  proDetail: (d) => { const p = pro(d.id), s = proStats(p);
    openSheet(`<h3>${esc(p.name)}</h3><p class="meta">${esc(p.act)} · ${esc(room(p.room).name)}${p.tbc ? " · activité à confirmer" : ""}</p>
      <div class="kpis"><div class="kpi g"><small>Ce mois-ci</small><b>${euros(s.rev)}</b></div><div class="kpi g"><small>Clientes</small><b>${s.cl}</b></div></div>
      <div class="line" style="margin-top:12px"><span>Créneaux à venir</span><b>${s.n}</b></div><div class="line"><span>Essais en cours</span><b>${trialsOf(p.id).length}</b></div>
      <div class="banner info" style="margin-top:12px">Vous voyez les comptes des pros pour le prototype. La question sera posée dans le devis : à valider côté RGPD et contrats.</div>`); },
  invitePro: () => toast("Invitation d'une pro : même principe, un lien personnel (simulé)."),
  clientDetail: (d) => { const c = client(d.id);
    openSheet(`<h3>${esc(c.name)}</h3><p class="meta">${esc(c.contact)} · depuis ${esc(c.since)}</p>` +
      Object.entries(c.access).map(([pid, a]) => `<div class="card g"><div class="row"><div class="grow"><b>${esc(pro(pid).act)}</b><small>avec ${esc(pro(pid).name)}</small></div>${accessPills({ access: { [pid]: a }, id: c.id })}</div>
        ${a.status === "trial" ? `<div class="btns"><button class="btn sm" data-a="unlock" data-id="${c.id}" data-pro="${pid}">Débloquer</button><button class="btn sm ghost" data-a="decline" data-id="${c.id}" data-pro="${pid}">Ne pas donner suite</button></div>` : ""}</div>`).join("")); },
  invite: () => inviteSheet(),
  openInvite: (d) => { closeSheet(); go(() => { st.role = "client"; st.clientId = null; st.pendingInvite = d.code; }); },
  leaveInvite: () => go(() => { st.pendingInvite = null; }),
  cancelInvite: (d) => { st.invites.find((i) => i.code === d.code).cancelled = true; render(); toast("Lien annulé."); },
  copy: async (d) => { try { await navigator.clipboard.writeText(linkFor(d.code)); toast("Lien copié."); } catch (e) { toast("Copie impossible ici, sélectionnez le lien."); } },
  share: async (d) => { try { await navigator.share({ title: "Le Complexe", text: "Votre invitation personnelle", url: linkFor(d.code) }); } catch (e) {} },
  unlock: (d) => { const c = client(d.id), pid = d.pro || st.proId; c.access[pid].status = "unlocked"; closeSheet(); render(); toast(`${c.name} est débloquée pour ${pro(pid).act}.`); },
  decline: (d) => { const c = client(d.id), pid = d.pro || st.proId; c.access[pid].status = "declined"; closeSheet(); render(); toast(`Sans suite pour ${c.name}. Elle n'est pas prévenue d'un refus : son essai se termine.`); },
  slotDetail: (d) => { const s = slot(d.id);
    openSheet(`<h3>${esc(s.title)}</h3><p class="meta">${dayLabel(s.day)} · ${hm(s.start)} · ${s.dur} min · ${euros(s.price)}</p>
      <div class="sec" style="margin-top:0"><h3>Inscrites</h3><span>${s.booked.length}/${s.cap}</span></div>
      ${s.booked.length ? s.booked.map((id) => { const c = client(id); const t = c.access[s.proId]?.status === "trial"; return `<div class="card g row"><div class="av">${initials(c.name)}</div><div class="grow"><b>${esc(c.name)}</b><small>${t ? "séance d'essai" : "cliente débloquée"}${s.scene ? ` · ambiance ${SCENES[s.scene].n}` : ""}</small></div></div>`; }).join("") : '<div class="empty">Personne pour le moment.</div>'}`); },
  newSlot: () => openSheet(`<h3>Nouveau créneau</h3><p class="meta">${dayLabel(st.day.pro)} · ${esc(room(pro(st.proId).room).name)}</p>
    <form data-form="slot"><label class="field"><span>Intitulé</span><input name="title" required value="${esc(pro(st.proId).act)}"></label>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px"><label class="field"><span>Heure</span><input name="time" type="time" required value="17:00"></label><label class="field"><span>Places</span><input name="cap" type="number" min="1" max="30" value="6"></label><label class="field"><span>Prix (€)</span><input name="price" type="number" min="0" value="25"></label></div>
    <button class="btn" type="submit">Ajouter</button></form>`),
  book: (d) => bookSheet(slot(d.id)),
  pickAmb: (d, el) => { el.parentElement.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === el)); },
  pay: (d) => {
    const s = slot(d.id), c = client(st.clientId), a = c.access[s.proId];
    const pick = sheetBody.querySelector('#ambPick [aria-pressed="true"]');
    if (!clientCanBook(c, s) || s.booked.length >= s.cap) { toast("Ce créneau n'est plus disponible."); return closeSheet(); }
    s.booked.push(c.id); if (pick) s.scene = pick.dataset.scene;
    if (a.status === "trial") a.slot = s.id;
    openSheet(`<div class="done"><div class="ring"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h3>C'est réservé.</h3>
      <p class="meta">${esc(s.title)} · ${dayLabel(s.day).toLowerCase()} à ${hm(s.start)}${s.scene ? ` · ambiance ${SCENES[s.scene].n}` : ""}</p>
      ${st.settings.code ? `<div class="code">${codeFor(s, c)}</div><p class="meta">Code d'accès, actif 15 min avant le créneau.</p>` : ""}
      ${a.status === "trial" ? `<div class="banner info" style="text-align:left">Après la séance, ${esc(pro(s.proId).name)} vous ouvrira l'accès aux prochaines réservations.</div>` : ""}
      <button class="btn ghost" data-a="closeSheet">Fermer</button></div>`);
    render();
  },
  closeSheet: () => closeSheet(),
  cancel: (d) => { const s = slot(d.id), c = client(st.clientId); s.booked = s.booked.filter((x) => x !== c.id); const a = c.access[s.proId]; if (a?.slot === s.id) a.slot = null; render(); toast("Réservation annulée. Remboursement automatique."); },
};
function guardRoom(r) {
  if (st.role === "owner") return true;
  const p = pro(st.proId);
  if (p.blocked || p.room !== r.id || !slotsOf(p.id).some(isLive)) { toast("Refusé : hors de votre créneau ou de votre salle."); return false; }
  return true;
}

const FORMS = {
  invite: (f) => {
    const pid = f.pro?.value || st.proId;
    const code = `${f.name.value.trim().toUpperCase().normalize("NFD").replace(/[^A-Z]/g, "").slice(0, 4) || "INV"}-${uid().slice(0, 4).toUpperCase()}`;
    const i = { code, proId: pid, name: f.name.value.trim(), created: Date.now(), used: false };
    st.invites.push(i); render(); linkSheet(i);
  },
  signup: (f) => {
    const i = st.invites.find((x) => x.code === st.pendingInvite);
    if (!i || !inviteValid(i)) return render();
    const c = { id: "c" + uid(), name: f.name.value.trim(), contact: f.contact.value.trim(), since: "aujourd'hui", access: { [i.proId]: { status: "trial", slot: null, by: i.proId } } };
    st.clients.push(c); i.used = true; i.clientId = c.id;
    go(() => { st.clientId = c.id; st.pendingInvite = null; st.view.client = "book"; st.day.client = 0; });
    toast(`Bienvenue ${c.name} ! Choisissez votre séance d'essai.`);
  },
  slot: (f) => {
    const [h, m] = f.time.value.split(":").map(Number);
    st.slots.push({ id: uid(), proId: st.proId, day: st.day.pro, start: h * 60 + m, dur: 60, title: f.title.value.trim(), cap: +f.cap.value || 1, price: +f.price.value || 0, booked: [] });
    closeSheet(); render(); toast("Créneau ajouté. Vos clientes débloquées le voient déjà.");
  },
};

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-a]");
  if (!el || el.disabled || el.tagName === "INPUT") return;
  const fn = A[el.dataset.a];
  if (fn) { e.preventDefault(); fn(el.dataset, el); }
});
document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset?.a === "light" || el.dataset?.a === "vol") {
    const r = room(el.dataset.room);
    if (!guardRoom(r)) return;
    r[el.dataset.a] = +el.value; r.on = true;
    el.previousElementSibling.textContent = `${el.dataset.a === "light" ? "Intensité" : "Volume"} · ${el.value}%`;
    save();
  }
});
document.addEventListener("submit", (e) => {
  const f = e.target.closest("form[data-form]");
  if (!f) return;
  e.preventDefault();
  FORMS[f.dataset.form](f.elements);
});
document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => go(() => { st.role = b.dataset.role; })));
$("#who").addEventListener("change", (e) => go(() => {
  if (st.role === "pro") st.proId = e.target.value;
  if (st.role === "client") { st.clientId = e.target.value || null; st.pendingInvite = null; st.view.client = "book"; }
}));
$("#reset").addEventListener("click", () => { st = seed(); render(true); toast("Démo réinitialisée."); });

// lien d'invitation reçu (#invite=CODE)
function readHash() {
  const m = location.hash.match(/invite=([A-Z0-9-]+)/i);
  if (m) { st.role = "client"; st.clientId = null; st.pendingInvite = m[1].toUpperCase(); history.replaceState(null, "", location.pathname + location.search); }
}
addEventListener("hashchange", () => { readHash(); render(true); });
readHash();
// liens directs pour la démo : ?role=pro&who=p1&view=salle
{
  const q = new URLSearchParams(location.search);
  if (q.get("role") in st.view) st.role = q.get("role");
  if (q.get("who")) { if (st.role === "pro" && pro(q.get("who"))) st.proId = q.get("who"); if (st.role === "client") st.clientId = client(q.get("who")) ? q.get("who") : null; }
  if (q.get("view")) st.view[st.role] = q.get("view");
}
render(true);
setInterval(() => { if (!sheet.open && document.visibilityState === "visible" && !document.activeElement?.matches("input")) render(); }, 60000);
