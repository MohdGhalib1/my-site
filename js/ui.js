/* ══════════════════════════════════════════════════════
   UI — Tabs, init, dropdowns
══════════════════════════════════════════════════════ */
function switchTab(t) {
    ['m','o','i','c','b','e','s'].forEach(id => {
        const btn = document.getElementById(`tab-${id}`);
        if (btn) btn.classList.toggle('active', t === id);
    });

    document.getElementById('page-container').innerHTML = PAGES[t];

    setupCitySelects();

    if (t === 'e') {
        renderEmployees();
    } else if (t === 'b') {
        renderBreakHistory();
    } else if (t === 's') {
        document.getElementById('statDate').value = iso();
        populateStatSelect();
        renderStats();
    } else {
        populateEmployeeDropdowns();
        renderAll();
    }

    // Apply permission gates for add-form cards
    const permGates = { addMontasiaCard:'addM', addInquiryCard:'addI', addControlCard:'addC' };
    Object.entries(permGates).forEach(([id, p]) => {
        const el = document.getElementById(id);
        if (el) el.style.display = perm(p) ? '' : 'none';
    });
}

function init() {
    if (perm('viewStats'))  document.getElementById('tab-s').classList.remove('hidden');
    if (!perm('addEmp'))    document.getElementById('tab-e').classList.add('hidden');
    if (!perm('viewBreak')) document.getElementById('tab-b').classList.add('hidden');
    switchTab('m');
}

function setupCitySelects() {
    const citySelects = ['mCityAdd','iCityAdd','cCityAdd','searchCityM','searchCityC','searchCityO','searchCityI'];
    let options = '';
    for (let c in branches) options += `<option value="${c}">${c}</option>`;
    citySelects.forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        el.innerHTML = (id.startsWith('search') ? '<option value="">الكل</option>' : '<option value="">اختيار المحافظة</option>') + options;
    });
}

function updateBranches(cityId, branchId) {
    const city = document.getElementById(cityId).value;
    let html = cityId.includes('search') ? '<option value="">الكل</option>' : '<option value="">الفرع</option>';
    if (city && branches[city]) branches[city].forEach(b => html += `<option value="${b}">${b}</option>`);
    document.getElementById(branchId).innerHTML = html;
}

function populateEmployeeDropdowns() {
    ['searchAddedByM','searchDeliveredByM','searchAddedByO','searchAddedByI'].forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        const cur = el.value;
        el.innerHTML = '<option value="">الكل</option><option value="المدير">المدير</option>';
        employees.forEach(e => el.innerHTML += `<option value="${e.name}">${e.name}</option>`);
        if (cur) el.value = cur;
    });
    populateLinkedInquirySelect();
}

function populateLinkedInquirySelect() {
    const sel = document.getElementById('cLinkedInquiry'); if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">— بدون ربط —</option>';
    const reservedSeqs = new Set(
        db.c.filter(c => c.linkedInqSeq && c.status !== 'محذوف').map(c => String(c.linkedInqSeq))
    );
    const complaints = db.i.filter(x => x.type === 'شكوى');
    complaints.forEach(x => {
        const seqStr = String(x.seq);
        const isReserved = reservedSeqs.has(seqStr);
        const preview = x.notes ? x.notes.substring(0, 25) : '...';
        const label = isReserved
            ? `🔒 محجوزة — #${x.seq} — ${x.branch} — ${x.phone}`
            : `#${x.seq} — ${x.branch} — ${x.phone} — ${preview}`;
        sel.innerHTML += `<option value="${x.seq}" ${isReserved ? 'disabled style="color:#666"' : ''}>${label}</option>`;
    });
    if (cur && !reservedSeqs.has(String(cur))) sel.value = cur;
}

function onLinkedInquiryChange() {
    const sel = document.getElementById('cLinkedInquiry');
    const seqVal = sel.value;
    const preview = document.getElementById('linkedInqPreview');
    const previewText = document.getElementById('linkedInqPreviewText');

    if (!seqVal) {
        preview.style.display = 'none';
        return;
    }

    const inq = db.i.find(x => String(x.seq) === String(seqVal));
    if (!inq) return;

    document.getElementById('cCustomerPhone').value = inq.phone || '';
    if (!document.getElementById('cCustomerName').value) {
        document.getElementById('cCustomerName').value = '';
    }

    preview.style.display = 'block';
    previewText.textContent = `مرتبط بالاستفسار #${inq.seq} — ${inq.branch} — ${inq.phone}${inq.notes ? ' — ' + inq.notes.substring(0,40) : ''}`;
}
