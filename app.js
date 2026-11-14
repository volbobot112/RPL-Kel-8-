/* ==================================================================
   Icons (minimal inline SVGs)
   ================================================================== */
const ICONS = {
  search: `<path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="m21 21-4.35-4.35"/>`,
  plus: `<path d="M12 5v14"/><path d="M5 12h14"/>`,
  checkCircle: `<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>`,
  messageSquare: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  eye: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
  moon: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
  sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
  code2: `<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>`,
  arrowLeft: `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,
  thumbsUp: `<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>`,
  send: `<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>`,
  graduationCap: `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`,
  user: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  x: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  sparkles: `<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>`,
};

function renderIcon(iconName, { size = 16, color = "currentColor", strokeWidth = 2, extraClass = "" } = {}) {
  return `<svg class="icon ${extraClass}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${ICONS[iconName]}</svg>`;
}

/* ==================================================================
   Syntax highlighter
   ================================================================== */
const KEYWORDS = {
  python: ["def","return","if","elif","else","for","while","in","import","from","class","try","except","finally","with","as","pass","break","continue","and","or","not","is","None","True","False","lambda","yield","raise","self"],
  javascript: ["function","return","if","else","for","while","in","of","const","let","var","class","try","catch","finally","import","from","export","default","new","this","typeof","null","undefined","true","false","async","await","yield"],
  java: ["public","private","protected","class","static","void","int","String","double","boolean","if","else","for","while","return","new","try","catch","finally","import","package","extends","implements","this","null","true","false"],
  sql: ["SELECT","FROM","WHERE","JOIN","INNER","LEFT","RIGHT","ON","GROUP","BY","ORDER","HAVING","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","AS","AND","OR","NOT","NULL","DISTINCT","LIMIT"],
};

function escapeHtml(rawText) {
  return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function tokenizeLine(lineText, languageName) {
  const kw = KEYWORDS[languageName] || [];
  const commentRe = languageName === "python" ? "#.*" : languageName === "sql" ? "--.*" : "//.*";
  const kwPattern = kw.length ? `\\b(?:${kw.join("|")})\\b` : "(?!x)x";
  const flags = languageName === "sql" ? "gi" : "g";
  const combined = new RegExp(
    `(${commentRe})|('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")|(\\b\\d+(?:\\.\\d+)?\\b)|(${kwPattern})`,
    flags
  );
  const tokens = [];
  let lastIndex = 0, matchResult;
  while ((matchResult = combined.exec(lineText)) !== null) {
    if (matchResult.index > lastIndex) tokens.push({ t: lineText.slice(lastIndex, matchResult.index), k: "plain" });
    if (matchResult[1] !== undefined) tokens.push({ t: matchResult[1], k: "comment" });
    else if (matchResult[2] !== undefined) tokens.push({ t: matchResult[2], k: "string" });
    else if (matchResult[3] !== undefined) tokens.push({ t: matchResult[3], k: "number" });
    else if (matchResult[4] !== undefined) tokens.push({ t: matchResult[4], k: "keyword" });
    lastIndex = combined.lastIndex;
    if (matchResult[0].length === 0) combined.lastIndex += 1;
  }
  if (lastIndex < lineText.length) tokens.push({ t: lineText.slice(lastIndex), k: "plain" });
  return tokens;
}

function renderCodeBlock(codeText, languageName = "python", fileName = null) {
  const lines = codeText.replace(/\n$/, "").split("\n");
  const defaultName = `snippet.${languageName === "javascript" ? "js" : languageName === "python" ? "py" : languageName === "java" ? "java" : "sql"}`;
  const rows = lines.map((lineText, index) => {
    const toks = tokenizeLine(lineText, languageName).map(tok => {
      const cls = tok.k === "plain" ? "" : `tok-${tok.k}`;
      return `<span class="${cls}">${escapeHtml(tok.t)}</span>`;
    }).join("") || "&nbsp;";
    return `<tr><td class="ln">${index + 1}</td><td class="code">${toks}</td></tr>`;
  }).join("");

  return `
    <div class="codeblock">
      <div class="codeblock-bar">
        <span class="dot" style="background:#FF5F56"></span>
        <span class="dot" style="background:#FFBD2E"></span>
        <span class="dot" style="background:#27C93F"></span>
        <span class="codeblock-filename">${fileName || defaultName}</span>
        <span class="codeblock-lang">${languageName}</span>
      </div>
      <div class="codeblock-scroll">
        <table><tbody>${rows}</tbody></table>
      </div>
    </div>`;
}

/* ==================================================================
   Seed data
   ================================================================== */
const SEED_QUESTIONS = [
  {
    id: "q1", title: "Fungsi rekursif Python saya masuk infinite loop, kenapa?",
    tags: ["python", "rekursi", "algoritma"], author: "Nadira F.", createdAt: "2 jam lalu",
    views: 41, status: "solved",
    body: "Saya coba bikin fungsi rekursif untuk menghitung faktorial, tapi malah RecursionError. Base case-nya sudah saya taruh kok masih infinite. Ada yang tahu bagian mana yang salah?",
    codeLang: "python",
    code: "def faktorial(n):\n    hasil = n * faktorial(n - 1)\n    return hasil\n\nprint(faktorial(5))",
    answers: [
      {
        id: "a1", author: "Rafi Pratama", isTutor: true, upvotes: 12, isAccepted: true,
        body: "Base case-nya belum ada, jadi rekursi tidak pernah berhenti. Tambahkan kondisi berhenti saat n sama dengan 0 atau 1 sebelum melakukan pemanggilan berikutnya.",
        codeLang: "python",
        code: "def faktorial(n):\n    if n <= 1:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(5))  # 120",
      },
      {
        id: "a2", author: "Bintang W.", isTutor: false, upvotes: 3, isAccepted: false,
        body: "Setuju sama jawaban di atas. Tambahan saja, kalau n negatif fungsinya juga masih infinite, jadi mungkin perlu validasi input juga.",
        codeLang: "", code: "",
      },
    ],
  },
  {
    id: "q2", title: "React: state di useState tidak berubah setelah setInterval",
    tags: ["javascript", "react", "hooks"], author: "Dimas Aji", createdAt: "5 jam lalu",
    views: 67, status: "answered",
    body: "Saya bikin timer dengan setInterval di dalam useEffect, tapi angkanya stuck di 0 terus padahal interval-nya jalan (saya cek dengan console.log). Kira-kira closure-nya yang salah ya?",
    codeLang: "javascript",
    code: "function Timer() {\n  const [detik, setDetik] = useState(0);\n\n  useEffect(() => {\n    setInterval(() => {\n      setDetik(detik + 1);\n    }, 1000);\n  }, []);\n\n  return <p>{detik} detik</p>;\n}",
    answers: [
      {
        id: "a3", author: "Sari Handayani", isTutor: true, upvotes: 8, isAccepted: false,
        body: "Betul, ini classic stale closure. 'detik' di dalam callback selalu bernilai 0 karena effect hanya berjalan sekali. Gunakan functional update supaya selalu membaca nilai terbaru.",
        codeLang: "javascript",
        code: "useEffect(() => {\n  const id = setInterval(() => {\n    setDetik((prev) => prev + 1);\n  }, 1000);\n  return () => clearInterval(id);\n}, []);",
      },
    ],
  },
  {
    id: "q3", title: "Query JOIN di SQL saya mengembalikan baris kosong",
    tags: ["sql", "database"], author: "Putri Lestari", createdAt: "1 hari lalu",
    views: 29, status: "open",
    body: "Saya mau gabungkan tabel mahasiswa dan tabel nilai berdasarkan nim, tapi hasilnya selalu kosong walau kedua tabel ada isinya. Sudah saya cek nim-nya sama persis.",
    codeLang: "sql",
    code: "SELECT mahasiswa.nama, nilai.skor\nFROM mahasiswa\nJOIN nilai ON mahasiswa.nim = nilai.nim_mahasiswa\nWHERE nilai.semester = 5;",
    answers: [],
  },
  {
    id: "q4", title: "NullPointerException saat parsing array di Java, sumbernya di mana?",
    tags: ["java", "array", "debugging"], author: "Fajar Nugraha", createdAt: "2 hari lalu",
    views: 54, status: "solved",
    body: "Program saya crash dengan NullPointerException pas mengakses elemen array. Saya sudah deklarasikan array-nya, tapi belum saya isi nilainya satu per satu, apa itu masalahnya?",
    codeLang: "java",
    code: "int[] nilai = new int[5];\nString[] nama = new String[5];\n\nSystem.out.println(nama[0].length());",
    answers: [
      {
        id: "a4", author: "Rafi Pratama", isTutor: true, upvotes: 15, isAccepted: true,
        body: "Array of String otomatis terisi null saat dibuat dengan 'new String[5]', bukan string kosong. Karena itu memanggil .length() pada elemen yang masih null akan melempar NullPointerException. Isi dulu elemennya sebelum dipakai.",
        codeLang: "java",
        code: "String[] nama = new String[5];\nnama[0] = \"Andi\";\n\nSystem.out.println(nama[0].length()); // aman, hasil: 4",
      },
    ],
  },
];

const SUPPORTED_LANGS = ["python", "javascript", "java", "sql"];

/* ==================================================================
   App state
   ================================================================== */
const appState = {
  isDark: true,
  questions: JSON.parse(JSON.stringify(SEED_QUESTIONS)),
  view: "home",
  activeId: null,
  role: "penanya",
  search: "",
  activeTag: null,
  answerBody: "",
  answerCode: "",
  answerLang: "python",
  showCodeField: false,
  ask: { title: "", tags: "", body: "", lang: "python", code: "" },
};

function escapeAttr(rawAttr) {
  return String(rawAttr).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderStatusBadge(statusValue) {
  const statusMap = {
    solved: { label: "Solusi Terverifikasi", i: "checkCircle", fg: "var(--success)", bg: "var(--successSoft)" },
    answered: { label: "Menunggu verifikasi", i: "messageSquare", fg: "var(--warn)", bg: "var(--warnSoft)" },
    open: { label: "Belum dijawab", i: "sparkles", fg: "var(--textMuted)", bg: "var(--panelAlt)" },
  };
  const cfg = statusMap[statusValue];
  return `<span class="status-badge" style="background:${cfg.bg};color:${cfg.fg}">${renderIcon(cfg.i, { size: 13.5, strokeWidth: 2.4 })} ${cfg.label}</span>`;
}

function renderAvatar(userName, isTutor) {
  const initials = userName.split(" ").map(word => word[0]).slice(0, 2).join("").toUpperCase();
  return `<div class="avatar ${isTutor ? "tutor" : ""}">${initials}</div>`;
}

function renderTopBar() {
  return `
    <div class="topbar">
      <div class="topbar-inner">
        <button class="brand" data-action="go-home">
          <div class="brand-icon">${renderIcon("code2", { size: 18, color: "var(--accentText)", strokeWidth: 2.4 })}</div>
          <span class="brand-name">Tanya Baris</span>
        </button>
        <div class="spacer"></div>
        <div class="topbar-actions">
          <div class="role-toggle">
            <button class="role-btn ${appState.role === "penanya" ? "active" : ""}" data-action="set-role" data-role="penanya">
              ${renderIcon("user", { size: 13.5 })} Penanya
            </button>
            <button class="role-btn ${appState.role === "tutor" ? "active" : ""}" data-action="set-role" data-role="tutor">
              ${renderIcon("graduationCap", { size: 13.5 })} Peer Tutor
            </button>
          </div>
          <button class="btn-primary" data-action="go-ask">${renderIcon("plus", { size: 16, strokeWidth: 2.6 })} Ajukan Pertanyaan</button>
          <button class="icon-btn" data-action="toggle-theme" aria-label="Ganti tema">
            ${appState.isDark ? renderIcon("sun", { size: 16 }) : renderIcon("moon", { size: 16 })}
          </button>
        </div>
      </div>
    </div>`;
}

function getAllTags() {
  const tagSet = new Set();
  appState.questions.forEach(item => item.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet);
}

function getFilteredQuestions() {
  return appState.questions.filter(item => {
    const matchesSearch = !appState.search || item.title.toLowerCase().includes(appState.search.toLowerCase());
    const matchesTag = !appState.activeTag || item.tags.includes(appState.activeTag);
    return matchesSearch && matchesTag;
  });
}

function renderQuestionCard(questionItem) {
  const excerpt = questionItem.body.length > 130 ? questionItem.body.slice(0, 130) + "…" : questionItem.body;
  const tagSpans = questionItem.tags.slice(0, 3).map(tag => `<span class="meta-tag">#${tag}</span>`).join("");
  return `
    <button class="question-card" data-action="open-question" data-id="${escapeAttr(questionItem.id)}">
      ${renderAvatar(questionItem.author, false)}
      <div class="question-body">
        <h3 class="question-title">${escapeHtml(questionItem.title)}</h3>
        <p class="question-excerpt">${escapeHtml(excerpt)}</p>
        <div class="question-meta">
          ${renderStatusBadge(questionItem.status)}
          ${tagSpans}
          <span class="meta-fill"></span>
          <span class="meta-stat">${renderIcon("messageSquare", { size: 13 })} ${questionItem.answers.length}</span>
          <span class="meta-stat">${renderIcon("eye", { size: 13 })} ${questionItem.views}</span>
          <span class="meta-author">${escapeHtml(questionItem.author)} · ${escapeHtml(questionItem.createdAt)}</span>
        </div>
      </div>
    </button>`;
}

function renderHome() {
  const totalQuestions = appState.questions.length;
  const solvedCount = appState.questions.filter(item => item.status === "solved").length;
  const tutorCount = new Set(appState.questions.flatMap(item => item.answers.filter(ans => ans.isTutor).map(ans => ans.author))).size;
  const filteredList = getFilteredQuestions();
  const allTags = getAllTags();

  const tagPills = [
    `<button class="tag-pill ${!appState.activeTag ? "active" : ""}" data-action="set-tag" data-tag="">#semua</button>`,
    ...allTags.map(tag => `<button class="tag-pill ${appState.activeTag === tag ? "active" : ""}" data-action="set-tag" data-tag="${escapeAttr(tag)}">#${escapeHtml(tag)}</button>`)
  ].join("");

  const listHtml = filteredList.length === 0
    ? `<div class="empty-state">Tidak ada pertanyaan yang cocok. Coba kata kunci atau tag lain.</div>`
    : filteredList.map(renderQuestionCard).join("");

  return `
    <div>
      <div class="home-header">
        <h1>Forum diskusi &amp; tanya jawab pemrograman</h1>
        <p>Tanyakan kendala koding, jelajahi solusi yang sudah diverifikasi, atau bantu rekan lain sebagai peer tutor.</p>
      </div>

      <div class="stat-row">
        <div class="stat-card"><div class="stat-value">${totalQuestions}</div><div class="stat-label">Total pertanyaan</div></div>
        <div class="stat-card"><div class="stat-value">${solvedCount}/${totalQuestions}</div><div class="stat-label">Sudah terverifikasi</div></div>
        <div class="stat-card"><div class="stat-value">${tutorCount}</div><div class="stat-label">Peer tutor aktif</div></div>
      </div>

      <div class="search-row">
        <div class="search-box">
          ${renderIcon("search", { size: 16, color: "var(--textFaint)" })}
          <input id="search-input" type="text" placeholder="Cari judul pertanyaan..." value="${escapeAttr(appState.search)}" />
        </div>
      </div>

      <div class="tag-row">${tagPills}</div>
      <div class="question-list">${listHtml}</div>
    </div>`;
}

function renderDetail() {
  const questionItem = appState.questions.find(item => item.id === appState.activeId);
  if (!questionItem) { appState.view = "home"; return renderHome(); }

  const sortedAnswers = [...questionItem.answers].sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0));
  const tagSpans = questionItem.tags.map(tag => `<span class="meta-tag">#${escapeHtml(tag)}</span>`).join("");

  const answersHtml = sortedAnswers.map(ans => `
    <div class="answer-card ${ans.isAccepted ? "accepted" : ""}">
      <div class="answer-head">
        ${renderAvatar(ans.author, ans.isTutor)}
        <div>
          <div class="answer-author">${escapeHtml(ans.author)}${ans.isTutor ? `<span class="answer-tutor-tag"> · Peer Tutor</span>` : ""}</div>
        </div>
        <span class="meta-fill"></span>
        ${ans.isAccepted ? `<span class="answer-accepted-tag">${renderIcon("checkCircle", { size: 14 })} Solusi Terverifikasi</span>` : ""}
      </div>
      <p class="answer-body">${escapeHtml(ans.body)}</p>
      ${ans.code ? `<div style="margin-bottom:12px">${renderCodeBlock(ans.code, ans.codeLang)}</div>` : ""}
      <div class="answer-footer">
        <span class="answer-upvotes">${renderIcon("thumbsUp", { size: 13 })} ${ans.upvotes}</span>
        ${(appState.role === "penanya" && !ans.isAccepted && questionItem.status !== "solved")
          ? `<button class="accept-btn" data-action="accept-answer" data-qid="${escapeAttr(questionItem.id)}" data-aid="${escapeAttr(ans.id)}">${renderIcon("checkCircle", { size: 14 })} Tandai sebagai solusi</button>`
          : ""}
      </div>
    </div>`).join("");

  const answersSection = questionItem.answers.length === 0
    ? `<div class="no-answers">Belum ada tanggapan. Jadilah peer tutor pertama yang membantu!</div>`
    : answersHtml;

  const codeFieldHtml = !appState.showCodeField
    ? `<button class="insert-code-btn" data-action="show-code-field">${renderIcon("code2", { size: 14 })} Sisipkan blok kode</button>`
    : `
      <div style="margin-bottom:10px">
        <div class="code-field-head">
          <select id="answer-lang-select">
            ${SUPPORTED_LANGS.map(lang => `<option value="${lang}" ${appState.answerLang === lang ? "selected" : ""}>${lang}</option>`).join("")}
          </select>
          <button class="code-field-close" data-action="hide-code-field">${renderIcon("x", { size: 15 })}</button>
        </div>
        <textarea id="answer-code-input" class="code-input" rows="4" placeholder="contoh:&#10;def solusi():&#10;    return True">${escapeHtml(appState.answerCode)}</textarea>
        ${appState.answerCode ? renderCodeBlock(appState.answerCode, appState.answerLang) : ""}
      </div>`;

  const canSend = appState.answerBody.trim().length > 0;

  return `
    <div class="detail-wrap">
      <button class="back-btn" data-action="go-home">${renderIcon("arrowLeft", { size: 15 })} Kembali ke daftar pertanyaan</button>

      <div class="question-panel">
        <div class="panel-tags">${renderStatusBadge(questionItem.status)}${tagSpans}</div>
        <h1>${escapeHtml(questionItem.title)}</h1>
        <div class="panel-author">
          ${renderAvatar(questionItem.author, false)}
          <span class="panel-author-text">${escapeHtml(questionItem.author)} · ${escapeHtml(questionItem.createdAt)} · ${questionItem.views} dilihat</span>
        </div>
        <p class="panel-body">${escapeHtml(questionItem.body)}</p>
        ${questionItem.code ? renderCodeBlock(questionItem.code, questionItem.codeLang) : ""}
      </div>

      <h2 class="answers-heading">${questionItem.answers.length} tanggapan tutor</h2>
      <div class="answers-list">${answersSection}</div>

      <div class="answer-form">
        <div class="answer-form-head">
          ${renderIcon("graduationCap", { size: 16, color: "var(--accent)" })}
          <span>${appState.role === "tutor" ? "Tulis jawaban sebagai peer tutor" : "Tambahkan tanggapan"}</span>
        </div>
        <textarea id="answer-body-input" rows="3" placeholder="Jelaskan solusi atau tanggapan Anda..." style="margin-bottom:10px">${escapeHtml(appState.answerBody)}</textarea>
        ${codeFieldHtml}
        <button class="send-btn" data-action="submit-answer" ${canSend ? "" : "disabled"}
          style="background:${canSend ? "var(--accent)" : "var(--panelAlt)"};color:${canSend ? "var(--accentText)" : "var(--textFaint)"};cursor:${canSend ? "pointer" : "not-allowed"}">
          ${renderIcon("send", { size: 14 })} Kirim tanggapan
        </button>
      </div>
    </div>`;
}

function renderAsk() {
  const formData = appState.ask;
  const isFormValid = formData.title.trim().length > 0 && formData.body.trim().length > 0;

  return `
    <div class="ask-wrap">
      <button class="back-btn" data-action="go-home">${renderIcon("arrowLeft", { size: 15 })} Batal</button>

      <h1>Ajukan pertanyaan</h1>
      <p class="intro">Jelaskan kendala koding Anda sedetail mungkin agar peer tutor bisa membantu lebih cepat.</p>

      <div class="field-group">
        <div class="field">
          <label>Judul pertanyaan (Wajib)</label>
          <input type="text" id="ask-title" placeholder="Contoh: Kenapa loop saya tidak berhenti?" value="${escapeAttr(formData.title)}" />
        </div>

        <div class="field">
          <label>Tag (Opsional, pisahkan dengan koma)</label>
          <input type="text" id="ask-tags" style="font-family:var(--font-mono)" placeholder="python, rekursi, algoritma" value="${escapeAttr(formData.tags)}" />
        </div>

        <div class="field">
          <label>Deskripsi kendala (Wajib)</label>
          <textarea id="ask-body" rows="4" placeholder="Ceritakan apa yang sudah dicoba dan error yang muncul...">${escapeHtml(formData.body)}</textarea>
        </div>

        <div class="field">
          <label>Cuplikan kode (opsional)</label>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <select id="ask-lang">
              ${SUPPORTED_LANGS.map(lang => `<option value="${lang}" ${formData.lang === lang ? "selected" : ""}>${lang}</option>`).join("")}
            </select>
          </div>
          <textarea id="ask-code" rows="5" class="code-input" placeholder="tempel kode di sini...">${escapeHtml(formData.code)}</textarea>
          ${formData.code ? renderCodeBlock(formData.code, formData.lang) : ""}
        </div>

        <div class="ask-actions">
          <button class="btn-submit" data-action="submit-question"
            style="background:${isFormValid ? "var(--accent)" : "var(--panelAlt)"};color:${isFormValid ? "var(--accentText)" : "var(--textFaint)"};cursor:pointer">
            ${renderIcon("send", { size: 15 })} Kirim pertanyaan
          </button>
          <button class="btn-outline" data-action="go-home">Batal</button>
        </div>
      </div>
    </div>`;
}

function render() {
  document.documentElement.setAttribute("data-theme", appState.isDark ? "dark" : "light");
  document.body.setAttribute("data-theme", appState.isDark ? "dark" : "light");

  let pageBody = "";
  if (appState.view === "home") pageBody = renderHome();
  else if (appState.view === "detail") pageBody = renderDetail();
  else if (appState.view === "ask") pageBody = renderAsk();

  document.getElementById("app").innerHTML = `
    ${renderTopBar()}
    <div class="content">${pageBody}</div>
  `;

  wireInputs();
}

/* Penerapan prinsip DRY untuk pengaturan visual tombol */
function aturTampilanTombol(selectorTombol, kondisiAktif, kunciDisabled = false) {
  const tombol = document.querySelector(selectorTombol);
  if (!tombol) return;
  if (kunciDisabled) tombol.disabled = !kondisiAktif;
  tombol.style.background = kondisiAktif ? "var(--accent)" : "var(--panelAlt)";
  tombol.style.color = kondisiAktif ? "var(--accentText)" : "var(--textFaint)";
  tombol.style.cursor = (kondisiAktif || !kunciDisabled) ? "pointer" : "not-allowed";
}

function wireInputs() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      appState.search = e.target.value;
      renderHomeInPlace();
    });
  }

  const answerBodyInput = document.getElementById("answer-body-input");
  if (answerBodyInput) {
    answerBodyInput.addEventListener("input", e => {
      appState.answerBody = e.target.value;
      aturTampilanTombol('[data-action="submit-answer"]', appState.answerBody.trim().length > 0, true);
    });
  }

  const answerCodeInput = document.getElementById("answer-code-input");
  if (answerCodeInput) {
    answerCodeInput.addEventListener("input", e => { appState.answerCode = e.target.value; render(); restoreFocus("answer-code-input"); });
  }

  const answerLangSelect = document.getElementById("answer-lang-select");
  if (answerLangSelect) {
    answerLangSelect.addEventListener("change", e => { appState.answerLang = e.target.value; render(); });
  }

  const askTitle = document.getElementById("ask-title");
  if (askTitle) {
    askTitle.addEventListener("input", e => {
      appState.ask.title = e.target.value;
      aturTampilanTombol('[data-action="submit-question"]', appState.ask.title.trim().length > 0 && appState.ask.body.trim().length > 0, false);
    });
  }

  const askTags = document.getElementById("ask-tags");
  if (askTags) askTags.addEventListener("input", e => { appState.ask.tags = e.target.value; });

  const askBody = document.getElementById("ask-body");
  if (askBody) {
    askBody.addEventListener("input", e => {
      appState.ask.body = e.target.value;
      aturTampilanTombol('[data-action="submit-question"]', appState.ask.title.trim().length > 0 && appState.ask.body.trim().length > 0, false);
    });
  }

  const askLang = document.getElementById("ask-lang");
  if (askLang) askLang.addEventListener("change", e => { appState.ask.lang = e.target.value; render(); });

  const askCode = document.getElementById("ask-code");
  if (askCode) askCode.addEventListener("input", e => { appState.ask.code = e.target.value; render(); restoreFocus("ask-code"); });
}

function renderHomeInPlace() {
  const content = document.querySelector(".content");
  if (content) content.innerHTML = renderHome();
  const el = document.getElementById("search-input");
  if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length; }
  wireInputs();
}

function restoreFocus(elementId) {
  const el = document.getElementById(elementId);
  if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length; }
}

function resetAnswerForm() {
  appState.answerBody = "";
  appState.answerCode = "";
  appState.answerLang = "python";
  appState.showCodeField = false;
}

function resetAskForm() {
  appState.ask = { title: "", tags: "", body: "", lang: "python", code: "" };
}

document.getElementById("app").addEventListener("click", e => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  const action = target.getAttribute("data-action");

  switch (action) {
    case "go-home":
      appState.view = "home";
      render();
      break;

    case "go-ask":
      resetAskForm();
      appState.view = "ask";
      render();
      break;

    case "toggle-theme":
      appState.isDark = !appState.isDark;
      render();
      break;

    case "set-role":
      appState.role = target.getAttribute("data-role");
      render();
      break;

    case "set-tag": {
      const tag = target.getAttribute("data-tag");
      appState.activeTag = appState.activeTag === tag ? null : (tag || null);
      renderHomeInPlace();
      break;
    }

    case "open-question":
      appState.activeId = target.getAttribute("data-id");
      appState.view = "detail";
      resetAnswerForm();
      render();
      break;

    case "accept-answer": {
      const qId = target.getAttribute("data-qid");
      const aId = target.getAttribute("data-aid");
      const questionItem = appState.questions.find(item => item.id === qId);
      if (questionItem) {
        questionItem.status = "solved";
        questionItem.answers.forEach(ans => { ans.isAccepted = ans.id === aId; });
      }
      render();
      break;
    }

    case "show-code-field":
      appState.showCodeField = true;
      render();
      restoreFocus("answer-code-input");
      break;

    case "hide-code-field":
      appState.showCodeField = false;
      appState.answerCode = "";
      render();
      break;

    case "submit-answer": {
      if (!appState.answerBody.trim()) break;
      const questionItem = appState.questions.find(item => item.id === appState.activeId);
      if (questionItem) {
        if (questionItem.status === "open") questionItem.status = "answered";
        questionItem.answers.push({
          id: `a_${Date.now()}`,
          author: appState.role === "tutor" ? "Anda (Peer Tutor)" : "Anda",
          isTutor: appState.role === "tutor",
          upvotes: 0,
          isAccepted: false,
          body: appState.answerBody,
          code: appState.showCodeField ? appState.answerCode : "",
          codeLang: appState.answerLang,
        });
      }
      resetAnswerForm();
      render();
      break;
    }

    case "submit-question": {
      try {
        const formData = appState.ask;
        const daftarTagBersih = formData.tags
          .split(",")
          .map(tagItem => sanitasiInputTeks(tagItem))
          .filter(Boolean);

        // Panggil fungsi validasi dari modul validasiPertanyaan.js
        validasiFormPertanyaan(formData.title, formData.body, daftarTagBersih);

        const pertanyaanBaru = {
          id: `q_${Date.now()}`,
          title: sanitasiInputTeks(formData.title),
          tags: daftarTagBersih,
          author: "Anda",
          createdAt: "baru saja",
          views: 0,
          status: "open",
          body: sanitasiInputTeks(formData.body),
          codeLang: formData.lang,
          code: formData.code,
          answers: [],
        };

        appState.questions.unshift(pertanyaanBaru);
        appState.activeId = pertanyaanBaru.id;
        appState.view = "detail";
        resetAnswerForm();
        resetAskForm();
        render();
      } catch (errorValidasi) {
        alert(`[VALIDASI GAGAL] ${errorValidasi.message}`);
      }
      break;
    }
  }
});

render();