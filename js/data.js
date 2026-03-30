/* ══════════════════════════════════════════════════════
   DATA — Global state & storage helpers
══════════════════════════════════════════════════════ */
const PASSWORD = "0799";
let db        = JSON.parse(localStorage.getItem("Shaab_Master_DB"))    || { m:[], i:[], c:[] };
let employees = JSON.parse(localStorage.getItem("Shaab_Employees_DB")) || [];
let breaks    = JSON.parse(localStorage.getItem("Shaab_Breaks_DB"))    || [];
let sessions  = JSON.parse(localStorage.getItem("Shaab_Sessions_DB"))  || [];
let currentUser = null;

if (!db.inqSeq) db.inqSeq = 1;

const branches = {
  "عمان": ["الرئيسي","ماركا","الهاشمي","صويلح","الحرية","خلدا","نزال","الوحدات","مرج الحمام","وادي الرمم","المشاغل","طبربور","الرياضية","المنورة","ابو نصير","شارع المطار","الياسمين","الخريطة","اليادودة","طريق البحر الميت"],
  "اربد": ["ابو راشد","الطيارة","شارع ال30"],
  "الزرقاء": ["السعادة","شارع 36"],
  "مادبا": ["مادبا الشرقي","مادبا الغربي"],
  "الكرك": ["الكرك الثنية","الكرك الوسية"],
  "العقبة": ["الرئيسي","البيتزا","الثاني","الثالث","الرابع","الخامس","السادس","السابع","الثامن","التاسع","العاشر","الخلفي"],
  "محافظات بفرع واحد": ["المفرق","الرمثا","جرش","السلط"]
};

function save()          { localStorage.setItem("Shaab_Master_DB",    JSON.stringify(db));        renderAll(); }
function saveEmployees() { localStorage.setItem("Shaab_Employees_DB", JSON.stringify(employees)); }
function saveBreaks()    { localStorage.setItem("Shaab_Breaks_DB",    JSON.stringify(breaks));    }
function saveSessions()  { localStorage.setItem("Shaab_Sessions_DB",  JSON.stringify(sessions));  }
function now()  { return new Date().toLocaleString('ar-EG'); }
function iso()  { return new Date().toISOString().split('T')[0]; }
