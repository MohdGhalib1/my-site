/* ══════════════════════════════════════════════════════
   RENDER — Filter & render all tables
══════════════════════════════════════════════════════ */
function filterTable() { renderAll(); }

function resetSearch(t) {
    const clear = (ids) => ids.forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    const clearDate = (fieldId) => {
        const el=document.getElementById(fieldId); if(el) el.value='';
        const disp=document.getElementById(fieldId+'-display'); if(disp){ disp.textContent='📅 اختر التاريخ'; disp.classList.remove('selected'); }
    };
    if (t==='M') {
        clear(['searchCityM','searchStatusM','searchTextM','searchAddedByM','searchDeliveredByM']);
        document.getElementById('searchBranchM').innerHTML='<option value="">الكل</option>';
        clearDate('searchDateM');
    } else if (t==='O') {
        clear(['searchCityO','searchTextO','searchAddedByO']);
        document.getElementById('searchBranchO').innerHTML='<option value="">الكل</option>';
        clearDate('searchDateO');
    } else if (t==='I') {
        clear(['searchCityI','searchAddedByI']);
        document.getElementById('searchBranchI').innerHTML='<option value="">الكل</option>';
        clearDate('searchDateI');
    } else if (t==='C') {
        clear(['searchCityC','searchTextC']);
        document.getElementById('searchBranchC').innerHTML='<option value="">الكل</option>';
        clearDate('searchDateC');
    }
    renderAll();
}

function renderAll() {
    const isAdmin = currentUser?.isAdmin;
    const get = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };

    /* ─ tableM ─ */
    const tbodyM = document.querySelector("#tableM tbody");
    if (tbodyM) {
        const fM = {
            city:        get("searchCityM"),
            branch:      get("searchBranchM"),
            date:        get("searchDateM"),
            status:      get("searchStatusM"),
            text:        get("searchTextM").toLowerCase(),
            addedBy:     get("searchAddedByM"),
            deliveredBy: get("searchDeliveredByM")
        };
        const resM = db.m.filter(x =>
            (!fM.city        || x.city===fM.city) &&
            (!fM.branch      || x.branch===fM.branch) &&
            (!fM.date        || x.iso.startsWith(fM.date)) &&
            (!fM.status      || x.status===fM.status) &&
            (!fM.text        || x.notes.toLowerCase().includes(fM.text)) &&
            (!fM.addedBy     || (x.addedBy||'').includes(fM.addedBy)) &&
            (!fM.deliveredBy || (x.deliveredBy||'').includes(fM.deliveredBy))
        );
        tbodyM.innerHTML = resM.map(x => {
            let statusClass = x.status==='تم التسليم' ? 'done' : x.status==='مرفوضة' ? 'rejected' : x.status==='بانتظار الموافقة' ? 'awaiting' : 'pending';
            let actions = '';
            if (perm('approveM') && x.status==='بانتظار الموافقة') actions += `<button class="btn-approve" onclick="approveMontasia(${x.id})">✓ موافقة</button>`;
            if (perm('editM'))   actions += `<button class="btn-edit-sm" onclick="startEditMontasia(${x.id})">✏️ تعديل</button>`;
            if (perm('deliverM') && x.status==='قيد الانتظار') actions += `<button class="btn-deliver" onclick="deliver(${x.id})" style="margin:2px">تسليم</button>`;
            if (perm('rejectM')  && (x.status==='قيد الانتظار'||x.status==='بانتظار الموافقة')) actions += `<button class="btn-reject"  onclick="rejectMontasia(${x.id})">رفض</button>`;
            if (perm('deleteM'))  actions += `<button class="btn-delete-sm" onclick="deleteMontasia(${x.id})">🗑</button>`;
            const editBox = perm('editM') ? `
                <div class="inline-edit-box" id="edit-${x.id}" style="display:none;">
                    <textarea id="editText-${x.id}" rows="2" style="margin-bottom:8px;">${x.notes}</textarea>
                    <button class="btn-main btn" style="width:100%;padding:8px;font-size:12px;" onclick="saveEditMontasia(${x.id})">حفظ التعديل</button>
                </div>` : '';
            const deliveryBranchNote = x.deliveryBranch
                ? `<div class="added-by" style="color:#64b5f6;">🔀 سُلِّم لـ: ${x.deliveryBranch} — ${x.deliveryCity}</div>` : '';
            const deliveredRow = x.deliveredBy
                ? `<div class="added-by">📦 سلّمه: ${x.deliveredBy}</div>${deliveryBranchNote}` : '';
            return `<tr>
                <td><b>${x.branch}</b><br><small>${x.city}</small></td>
                <td><span class="text-box-cell">${x.notes}</span>${editBox}</td>
                <td><div class="added-by" style="font-size:12px;color:var(--text-main);">📥 ${x.addedBy||'—'}</div>${deliveredRow}</td>
                <td><small>${x.time}</small>${x.dt?`<br><small style="color:var(--text-dim)">${x.dt}</small>`:''}</td>
                <td><span class="status-badge ${statusClass}">${x.status}</span></td>
                <td>${actions}</td>
            </tr>`;
        }).join('');
    }

    /* ─ tableO ─ */
    const tbodyO = document.querySelector("#tableO tbody");
    if (tbodyO) {
        const fO = {
            city:    get("searchCityO"),
            branch:  get("searchBranchO"),
            date:    get("searchDateO"),
            text:    get("searchTextO").toLowerCase(),
            addedBy: get("searchAddedByO")
        };
        const resO = db.m.filter(x =>
            (x.status==='قيد الانتظار' || x.status==='بانتظار الموافقة') &&
            (!fO.city    || x.city===fO.city) &&
            (!fO.branch  || x.branch===fO.branch) &&
            (!fO.date    || x.iso.startsWith(fO.date)) &&
            (!fO.text    || x.notes.toLowerCase().includes(fO.text)) &&
            (!fO.addedBy || (x.addedBy||'').includes(fO.addedBy))
        );
        tbodyO.innerHTML = resO.map(x => {
            let actionBtn = '—';
            if (x.status==='بانتظار الموافقة' && perm('approveM'))
                actionBtn = `<button class="btn-approve" onclick="approveMontasia(${x.id})">✓ موافقة</button>`;
            else if (x.status==='قيد الانتظار' && perm('deliverM'))
                actionBtn = `<button class="btn-deliver" onclick="deliver(${x.id})">تسليم</button>`;
            const statusDot = x.status==='بانتظار الموافقة'
                ? `<span class="status-badge awaiting" style="font-size:11px;padding:2px 8px;">${x.status}</span><br>`
                : '';
            return `<tr>
                <td><b>${x.branch}</b><br><small>${x.city}</small></td>
                <td><span class="text-box-cell">${x.notes}</span></td>
                <td><small style="color:var(--text-main)">📥 ${x.addedBy||'—'}</small></td>
                <td>${statusDot}<small>${x.time}</small></td>
                <td>${actionBtn}</td>
            </tr>`;
        }).join('') || `<tr><td colspan="5" style="color:var(--text-dim);padding:20px;">لا توجد نتائج</td></tr>`;
    }

    /* ─ tableI ─ */
    const tbodyI = document.querySelector("#tableI tbody");
    if (tbodyI) {
        const fI = {
            city:    get("searchCityI"),
            branch:  get("searchBranchI"),
            date:    get("searchDateI"),
            addedBy: get("searchAddedByI")
        };
        const resI = db.i.filter(x =>
            (!fI.city    || x.city===fI.city) &&
            (!fI.branch  || x.branch===fI.branch) &&
            (!fI.date    || x.iso.startsWith(fI.date)) &&
            (!fI.addedBy || (x.addedBy||'').includes(fI.addedBy))
        );
        tbodyI.innerHTML = resI.map(x => `<tr>
            <td><span class="seq-badge" title="الرقم التسلسلي">#${x.seq||'—'}</span></td>
            <td><b>${x.branch}</b><br><small>${x.city}</small></td>
            <td>${x.phone}</td>
            <td><span class="emp-badge">${x.type||'—'}</span>${x.notes?`<br><span class="text-box-cell" style="font-size:13px;color:var(--text-dim)">${x.notes}</span>`:''}</td>
            <td><small style="color:var(--text-main)">${x.addedBy||'—'}</small></td>
            <td><small>${x.time}</small></td>
        </tr>`).join('');
    }

    /* ─ tableC ─ */
    const tbodyC = document.querySelector("#tableC tbody");
    if (tbodyC) {
        const fC = {
            city:   get("searchCityC"),
            branch: get("searchBranchC"),
            date:   get("searchDateC"),
            text:   get("searchTextC").toLowerCase()
        };
        const resC = db.c.filter(x =>
            (!fC.city   || x.city===fC.city) &&
            (!fC.branch || x.branch===fC.branch) &&
            (!fC.date   || x.iso.startsWith(fC.date)) &&
            (!fC.text   || x.notes.toLowerCase().includes(fC.text))
        );
        tbodyC.innerHTML = resC.map(x => {
            let custHtml = '';
            if (x.customer && (x.customer.name||x.customer.phone||x.customer.order)) {
                custHtml = `<div class="customer-info-box">
                    👤 ${x.customer.name ? `<b>الاسم:</b> ${x.customer.name} ` : ''}
                    ${x.customer.phone ? `<b>الهاتف:</b> ${x.customer.phone} ` : ''}
                    ${x.customer.order ? `<b>الطلبية:</b> ${x.customer.order}` : ''}
                </div>`;
            }
            const linkHtml = (x.linkedInqSeq && perm('viewLinkBadge'))
                ? `<div><span class="linked-inq" onclick="jumpToInquiry(${x.linkedInqSeq})" title="انتقل للاستفسار المرتبط">🔗 استفسار #${x.linkedInqSeq}</span></div>`
                : '';
            const fileLink = x.file ? `<br><a href="${x.file}" target="_blank" class="btn-attach">📎 عرض المرفق</a>` : '';

            let cStatusBadge = '';
            if (x.status==='تمت الموافقة')       cStatusBadge = `<span class="status-badge done">${x.status}</span>`;
            else if (x.status==='مُرجعة للتعديل') cStatusBadge = `<span class="status-badge returned">${x.status}</span>`;
            else                                   cStatusBadge = `<span class="status-badge awaiting">${x.status||'بانتظار الموافقة'}</span>`;

            let auditHtml = '';
            if (perm('auditC')) {
                auditHtml = x.audit
                    ? `<div class="final-audit-text">رد قسم السيطرة: ${x.audit}</div>`
                    : `<div class="audit-box">
                        <label>رد قسم السيطرة:</label>
                        <textarea id="audit-${x.id}" rows="2" placeholder="اكتب الرد هنا..."></textarea>
                        <button class="btn btn-main" style="width:100%;margin-top:10px;font-size:12px;padding:8px;" onclick="saveAudit(${x.id})">إرسال الرد</button>
                      </div>`;
            } else if (x.audit) {
                auditHtml = `<div class="final-audit-text">رد قسم السيطرة: ${x.audit}</div>`;
            } else if (isAdmin && x.status==='تمت الموافقة') {
                auditHtml = `<div class="audit-box">
                    <label>إضافة نتيجة التدقيق:</label>
                    <textarea id="audit-${x.id}" rows="2" placeholder="اكتب النتيجة النهائية هنا..."></textarea>
                    <button class="btn btn-main" style="width:100%;margin-top:10px;font-size:12px;padding:8px;" onclick="saveAudit(${x.id})">حفظ واعتماد النتيجة</button>
                  </div>`;
            }

            const returnEditBox = (x.status==='مُرجعة للتعديل' && !isAdmin && x.addedBy===currentUser.name && perm('addC'))
                ? `<div class="inline-edit-box" style="margin-top:10px;">
                    <textarea id="returnEdit-${x.id}" rows="2" style="margin-bottom:8px;">${x.notes}</textarea>
                    <button class="btn-main btn" style="width:100%;padding:8px;font-size:12px;" onclick="saveReturnEdit(${x.id})">إعادة إرسال</button>
                   </div>` : '';

            let adminActions = '';
            if (perm('approveC') && x.status!=='تمت الموافقة') adminActions += `<button class="btn-approve" onclick="approveControl(${x.id})">✓ موافقة</button>`;
            if (perm('editC'))    adminActions += `<button class="btn-edit-sm" onclick="editControl(${x.id})">✏️ تعديل</button>`;
            if (perm('returnC') && x.status!=='مُرجعة للتعديل') adminActions += `<button class="btn-return" onclick="returnControl(${x.id})">↩ إرجاع</button>`;
            if (perm('deleteC'))  adminActions += `<button class="btn-delete-sm" onclick="deleteControl(${x.id})">🗑</button>`;

            const adminEditBox = perm('editC') ? `
                <div class="inline-edit-box" id="cedit-${x.id}" style="display:none;margin-top:10px;">
                    <textarea id="ceditText-${x.id}" rows="2" style="margin-bottom:8px;">${x.notes}</textarea>
                    <button class="btn-main btn" style="width:100%;padding:8px;font-size:12px;" onclick="saveEditControl(${x.id})">حفظ التعديل</button>
                </div>` : '';

            return `<tr>
                <td><b>${x.branch}</b><br><small>${x.city}</small><br>${cStatusBadge}</td>
                <td>
                    <span class="text-box-cell">${x.notes}</span>
                    ${custHtml}${linkHtml}${fileLink}${auditHtml}${returnEditBox}${adminEditBox}
                </td>
                <td><small style="color:var(--text-main)">📥 ${x.addedBy||'—'}</small></td>
                <td><small>${x.time}</small></td>
                <td>${adminActions}</td>
            </tr>`;
        }).join('');
    }
}
