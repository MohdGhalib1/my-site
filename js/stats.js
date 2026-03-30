/* ══════════════════════════════════════════════════════
   STATS — Employee statistics view
══════════════════════════════════════════════════════ */
function populateStatSelect() {
    const sel = document.getElementById("statEmpSelect");
    const cur = sel.value;
    sel.innerHTML = '<option value="">اختر موظفاً</option>';
    employees.forEach(e => sel.innerHTML += `<option value="${e.empId}">${e.name}</option>`);
    if (cur) sel.value = cur;
}

function renderStats() {
    const empId = document.getElementById("statEmpSelect").value;
    const date  = document.getElementById("statDate").value;
    const div   = document.getElementById("statsResult");
    if (!empId||!date) { div.innerHTML=`<p style="color:var(--text-dim)">اختر موظفاً وتاريخاً</p>`; return; }

    const emp      = employees.find(e => e.empId===empId);
    const empBreaks= breaks.filter(b => b.empId===empId && b.date===date);
    const empSess  = sessions.filter(s => s.empId===empId && s.date===date);

    let html = '';

    // ── بلوك الدخول/الخروج ──
    if (empSess.length) {
        html += `<div style="background:rgba(255,255,255,0.03);border-radius:14px;padding:18px;margin-bottom:16px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:12px;color:var(--text-dim);">🕐 سجل الدخول والخروج</div>`;
        empSess.forEach(s => {
            const loginTime  = new Date(s.loginIso).toLocaleTimeString('ar-EG');
            const logoutTime = s.logoutIso ? new Date(s.logoutIso).toLocaleTimeString('ar-EG') : null;
            html += `<div class="stat-row">
                <span><span class="session-online">دخول ${loginTime}</span></span>
                <span>${logoutTime
                    ? `<span class="session-offline">خروج ${logoutTime}</span>`
                    : `<span class="session-online">🟢 ما زال فاتح الموقع</span>`
                }</span>
            </div>`;
        });
        html += `</div>`;
    } else {
        html += `<div style="background:rgba(255,255,255,0.03);border-radius:14px;padding:14px;margin-bottom:16px;color:var(--text-dim);font-size:13px;">لا يوجد تسجيل دخول لهذا الموظف في هذا اليوم</div>`;
    }

    // ── بلوك الاستراحات ──
    if (empBreaks.length) {
        const totalSec = empBreaks.reduce((s,b) => s+b.duration, 0);
        html += `<div style="background:rgba(255,255,255,0.03);border-radius:14px;padding:18px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-weight:700;font-size:15px;">${emp?.name||empId}</span>
                <span style="color:var(--text-dim);font-size:13px;">${date}</span>
            </div>
            <div style="font-size:13px;color:var(--text-dim);">إجمالي وقت الغياب: <span style="color:var(--accent-red);font-family:monospace;font-weight:700;">${fmtDuration(totalSec)}</span></div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:14px;padding:18px;">
            ${empBreaks.map(b=>`
            <div class="stat-row">
                <span class="stat-type"><span class="emp-badge">${b.type}</span></span>
                <span style="color:var(--text-dim);font-size:12px;">${new Date(b.startIso).toLocaleTimeString('ar-EG')} ← ${new Date(b.endIso).toLocaleTimeString('ar-EG')}</span>
                <span class="stat-dur">${fmtDuration(b.duration)}</span>
            </div>`).join('')}
        </div>`;
    } else {
        html += `<p style="color:var(--text-dim);font-size:13px;">لا توجد استراحات مسجلة لهذا اليوم</p>`;
    }

    div.innerHTML = html;
}
