/* ══════════════════════════════════════════════════════
   MISSING ITEMS — CRUD with 5-second confirm overlay
══════════════════════════════════════════════════════ */
let _pendingMontasia = null;
let _confirmTimer    = null;

function addMontasia() {
    const c = document.getElementById("mCityAdd").value;
    const b = document.getElementById("mBranchAdd").value;
    const n = document.getElementById("mNotes").value.trim();
    if (!c||!b||!n) return alert("يرجى إكمال البيانات");

    _pendingMontasia = { c, b, n };
    _showMontasiaConfirm();
}

function _showMontasiaConfirm() {
    let seconds = 5;
    document.getElementById("confirmCountdown").textContent = seconds;
    document.getElementById("confirmPreview").innerHTML =
        `<b style="color:var(--text-main)">${_pendingMontasia.b}</b> &nbsp;—&nbsp; <span>${_pendingMontasia.c}</span>
         <div style="font-size:13px;color:var(--text-dim);margin-top:6px;">${_pendingMontasia.n}</div>`;
    document.getElementById("montasiaConfirmOverlay").classList.remove("hidden");

    _confirmTimer = setInterval(() => {
        seconds--;
        const el = document.getElementById("confirmCountdown");
        el.textContent = seconds;
        el.classList.toggle("countdown-urgent", seconds <= 2);
        if (seconds <= 0) {
            clearInterval(_confirmTimer);
            _confirmTimer = null;
            _commitMontasia();
        }
    }, 1000);
}

function cancelMontasia() {
    clearInterval(_confirmTimer);
    _confirmTimer    = null;
    _pendingMontasia = null;
    document.getElementById("montasiaConfirmOverlay").classList.add("hidden");
}

function _commitMontasia() {
    document.getElementById("montasiaConfirmOverlay").classList.add("hidden");
    if (!_pendingMontasia) return;
    const { c, b, n } = _pendingMontasia;
    _pendingMontasia = null;
    db.m.unshift({ id:Date.now(), city:c, branch:b, notes:n, time:now(), iso:iso(),
        status:'قيد الانتظار', dt:'', addedBy:currentUser.name, deliveredBy:'' });
    save();
    document.getElementById("mNotes").value = "";
}

/* ── Delivery modal ── */
let _deliverId   = null;
let _deliverType = 'same';

function deliver(id) {
    const item = db.m.find(x => x.id===id);
    if (!item) return;
    _deliverId   = id;
    _deliverType = 'same';

    // معلومات المنتسية
    document.getElementById("deliveryItemInfo").innerHTML =
        `<b style="color:var(--text-main)">${item.branch}</b> &nbsp;—&nbsp; ${item.city}
         <div style="margin-top:4px;font-size:12px;">${item.notes.substring(0,60)}${item.notes.length>60?'...':''}</div>`;

    // إعادة ضبط الخيارات
    selectDeliveryType('same');

    // تعبئة قائمة المحافظات
    const cityEl = document.getElementById("deliverCitySelect");
    let opts = '<option value="">اختر المحافظة</option>';
    for (let c in branches) opts += `<option value="${c}">${c}</option>`;
    cityEl.innerHTML = opts;
    document.getElementById("deliverBranchSelect").innerHTML = '<option value="">اختر الفرع</option>';

    document.getElementById("deliveryModal").classList.remove("hidden");
}

function selectDeliveryType(type) {
    _deliverType = type;
    const sameCard  = document.getElementById("deliverSameBranchCard");
    const otherCard = document.getElementById("deliverOtherBranchCard");
    const selector  = document.getElementById("deliveryBranchSelector");

    sameCard.style.borderColor  = type === 'same'  ? 'var(--accent-red)' : '';
    sameCard.style.background   = type === 'same'  ? 'var(--soft-red)'   : '';
    otherCard.style.borderColor = type === 'other' ? 'var(--accent-red)' : '';
    otherCard.style.background  = type === 'other' ? 'var(--soft-red)'   : '';
    selector.style.display      = type === 'other' ? 'block' : 'none';
}

function confirmDeliver() {
    const item = db.m.find(x => x.id===_deliverId);
    if (!item) return cancelDeliver();

    if (_deliverType === 'other') {
        const city   = document.getElementById("deliverCitySelect").value;
        const branch = document.getElementById("deliverBranchSelect").value;
        if (!city || !branch) return alert("يرجى اختيار المحافظة والفرع");
        item.deliveryCity   = city;
        item.deliveryBranch = branch;
    }

    item.status      = 'تم التسليم';
    item.dt          = now();
    item.deliveredBy = currentUser.name;
    save();
    cancelDeliver();
}

function cancelDeliver() {
    _deliverId   = null;
    _deliverType = 'same';
    document.getElementById("deliveryModal").classList.add("hidden");
}

function approveMontasia(id) {
    const item = db.m.find(x => x.id===id);
    if (item) { item.status='قيد الانتظار'; save(); }
}

function confirmDeliverDirect(id) {
    const item = db.m.find(x => x.id===id);
    if (!item) return;
    item.status      = 'تم التسليم';
    item.dt          = now();
    item.deliveredBy = currentUser.name;
    save();
}

function rejectMontasia(id) {
    const item = db.m.find(x => x.id===id);
    if (item) { item.status='مرفوضة'; save(); }
}

function deleteMontasia(id) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    db.m = db.m.filter(x => x.id!==id); save();
}

function startEditMontasia(id) {
    const box = document.getElementById(`edit-${id}`);
    if (box) box.style.display = box.style.display==='none' ? 'block' : 'none';
}

function saveEditMontasia(id) {
    const newText = document.getElementById(`editText-${id}`).value.trim();
    if (!newText) return alert("يرجى كتابة التفاصيل");
    const item = db.m.find(x => x.id===id);
    if (item) { item.notes=newText; item.editedBy=currentUser.name; save(); }
}
