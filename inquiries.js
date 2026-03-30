/* ══════════════════════════════════════════════════════
   INQUIRIES — CRUD operations
══════════════════════════════════════════════════════ */
function toggleInquiryNotes() {
    const t = document.getElementById("iType").value;
    document.getElementById("iNotesBox").style.display = (t==="شكوى"||t==="أخرى") ? "block" : "none";
}

function addInquiry() {
    const b=document.getElementById("iBranchAdd").value, p=document.getElementById("iPhone").value,
          c=document.getElementById("iCityAdd").value,   t=document.getElementById("iType").value;
    const needsNotes = (t==="شكوى"||t==="أخرى");
    const n = needsNotes ? document.getElementById("iNotes").value.trim() : "";
    if (!b||!p||!c||!t) return alert("يرجى إكمال البيانات");
    if (needsNotes&&!n) return alert("يرجى كتابة التفاصيل");
    if (!db.inqSeq) db.inqSeq = 1;
    db.i.unshift({ id:Date.now(), seq:db.inqSeq++, city:c, branch:b, phone:p, type:t, notes:n,
        time:now(), iso:iso(), addedBy:currentUser.name });
    save();
    document.getElementById("iPhone").value="";
    document.getElementById("iType").value="";
    document.getElementById("iNotes").value="";
    document.getElementById("iNotesBox").style.display="none";
    populateLinkedInquirySelect();
}

function jumpToInquiry(seq) {
    switchTab('i');
    setTimeout(() => {
        const rows = document.querySelectorAll('#tableI tbody tr');
        rows.forEach(r => {
            r.style.outline = '';
            const seqCell = r.querySelector('.seq-badge');
            if (seqCell && seqCell.textContent.trim() === '#'+seq) {
                r.style.outline = '2px solid var(--accent-red)';
                r.scrollIntoView({ behavior:'smooth', block:'center' });
            }
        });
    }, 200);
}
