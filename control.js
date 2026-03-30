/* ══════════════════════════════════════════════════════
   CONTROL — Complaints CRUD with manager approval
══════════════════════════════════════════════════════ */
function addControl() {
    const b=document.getElementById("cBranchAdd").value, n=document.getElementById("cNotes").value.trim(),
          c=document.getElementById("cCityAdd").value;
    if (!b||!n||!c) return alert("يرجى إكمال البيانات");
    const custName  = document.getElementById("cCustomerName").value.trim();
    const custPhone = document.getElementById("cCustomerPhone").value.trim();
    const custOrder = document.getElementById("cCustomerOrder").value.trim();
    const linkedSeq = document.getElementById("cLinkedInquiry").value;
    const customer  = (custName||custPhone||custOrder) ? { name:custName, phone:custPhone, order:custOrder } : null;

    const fileInput = document.getElementById("cFile");
    const base = { id:Date.now(), city:c, branch:b, notes:n, audit:'', time:now(), iso:iso(),
        addedBy:currentUser.name, status:'بانتظار الموافقة', customer, linkedInqSeq: linkedSeq||null };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            db.c.unshift({ ...base, file:e.target.result });
            save();
            resetControlForm();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        db.c.unshift({ ...base, file:null });
        save();
        resetControlForm();
    }
}

function resetControlForm() {
    document.getElementById("cNotes").value = "";
    document.getElementById("cFile").value  = "";
    document.getElementById("cCustomerName").value  = "";
    document.getElementById("cCustomerPhone").value = "";
    document.getElementById("cCustomerOrder").value = "";
    document.getElementById("cLinkedInquiry").value = "";
    const preview = document.getElementById('linkedInqPreview');
    if (preview) preview.style.display = 'none';
    populateLinkedInquirySelect();
}

function approveControl(id) {
    const item = db.c.find(x => x.id===id);
    if (item) { item.status='تمت الموافقة'; item.approvedBy=currentUser.name; save(); }
}

function editControl(id) {
    const box = document.getElementById(`cedit-${id}`);
    if (box) box.style.display = box.style.display==='none' ? 'block' : 'none';
}

function saveEditControl(id) {
    const v = document.getElementById(`ceditText-${id}`).value.trim();
    if (!v) return alert("يرجى كتابة التعديل");
    const item = db.c.find(x => x.id===id);
    if (item) { item.notes=v; item.editedBy=currentUser.name; save(); }
}

function returnControl(id) {
    const item = db.c.find(x => x.id===id);
    if (item) { item.status='مُرجعة للتعديل'; save(); }
}

function deleteControl(id) {
    if (!confirm("هل أنت متأكد من حذف هذه الشكوى؟")) return;
    db.c = db.c.filter(x => x.id!==id);
    save();
    populateLinkedInquirySelect();
}

function saveReturnEdit(id) {
    const v = document.getElementById(`returnEdit-${id}`).value.trim();
    if (!v) return alert("يرجى كتابة التعديل");
    const item = db.c.find(x => x.id===id);
    if (item) { item.notes=v; item.status='بانتظار الموافقة'; item.editedBy=currentUser.name; save(); }
}

function saveAudit(id) {
    if (!perm('auditC') && !currentUser?.isAdmin) return;
    const val = document.getElementById(`audit-${id}`).value.trim();
    if (!val) return alert("يرجى كتابة الرد أولاً");
    const idx = db.c.findIndex(x => x.id===id);
    if (idx!==-1) { db.c[idx].audit=val; localStorage.setItem("Shaab_Master_DB",JSON.stringify(db)); renderAll(); }
}
