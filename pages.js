/* ══════════════════════════════════════════════════════
   PAGES — HTML templates for each tab
   (avoids fetch so the app works via file://)
══════════════════════════════════════════════════════ */
const PAGES = {

m: `
<div class="card" id="addMontasiaCard">
    <h3>تسجيل منتسية جديدة</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
        <select id="mCityAdd" onchange="updateBranches('mCityAdd','mBranchAdd')"></select>
        <select id="mBranchAdd"></select>
    </div>
    <textarea id="mNotes" placeholder="تفاصيل المنتسية..." rows="3"></textarea>
    <button class="btn btn-main" style="margin-top:15px" onclick="addMontasia()">حفظ البيانات</button>
</div>
<div class="search-bar search-bar-m">
    <div style="grid-column:1/-1;" class="search-section-title">🔍 خيارات البحث</div>
    <div><label>المحافظة</label><select id="searchCityM" onchange="updateBranches('searchCityM','searchBranchM');filterTable();"></select></div>
    <div><label>الفرع</label><select id="searchBranchM" onchange="filterTable()"><option value="">الكل</option></select></div>
    <div><label>التاريخ</label><div class="date-picker-wrap" onclick="openDatePicker('searchDateM')"><span class="date-display" id="searchDateM-display">📅 اختر التاريخ</span><input type="hidden" id="searchDateM"></div></div>
    <div><label>الحالة</label>
        <select id="searchStatusM" onchange="filterTable()">
            <option value="">الكل</option>
            <option value="بانتظار الموافقة">بانتظار الموافقة</option>
            <option value="قيد الانتظار">قيد الانتظار</option>
            <option value="تم التسليم">تم التسليم</option>
            <option value="مرفوضة">مرفوضة</option>
        </select>
    </div>
    <div><label>بحث بالنص</label><input type="text" id="searchTextM" placeholder="بحث في التفاصيل..." oninput="filterTable()"></div>
    <div><label>موظف الاستلام</label><select id="searchAddedByM" onchange="filterTable()"><option value="">الكل</option></select></div>
    <div><label>موظف التسليم</label><select id="searchDeliveredByM" onchange="filterTable()"><option value="">الكل</option></select></div>
    <button class="btn" style="background:var(--bg-input);color:var(--text-dim);align-self:end;" onclick="resetSearch('M')">تفريغ</button>
</div>
<div class="card">
    <table id="tableM">
        <thead><tr>
            <th style="width:14%">الفرع</th>
            <th>التفاصيل</th>
            <th style="width:13%">أضافه</th>
            <th style="width:15%">الوقت</th>
            <th style="width:12%">الحالة</th>
            <th style="width:16%">إجراء</th>
        </tr></thead>
        <tbody></tbody>
    </table>
</div>`,

o: `
<div class="card">
    <h3>📂 الطلبات قيد الانتظار</h3>
    <div class="search-bar search-bar-o" style="margin-bottom:20px;">
        <div style="grid-column:1/-1;" class="search-section-title">🔍 خيارات البحث</div>
        <div><label>المحافظة</label><select id="searchCityO" onchange="updateBranches('searchCityO','searchBranchO');filterTable();"></select></div>
        <div><label>الفرع</label><select id="searchBranchO" onchange="filterTable()"><option value="">الكل</option></select></div>
        <div><label>التاريخ</label><div class="date-picker-wrap" onclick="openDatePicker('searchDateO')"><span class="date-display" id="searchDateO-display">📅 اختر التاريخ</span><input type="hidden" id="searchDateO"></div></div>
        <div><label>بحث بالنص</label><input type="text" id="searchTextO" placeholder="بحث في التفاصيل..." oninput="filterTable()"></div>
        <div><label>موظف الاستلام</label><select id="searchAddedByO" onchange="filterTable()"><option value="">الكل</option></select></div>
        <button class="btn" style="background:var(--bg-input);color:var(--text-dim);align-self:end;" onclick="resetSearch('O')">تفريغ</button>
    </div>
    <table id="tableO">
        <thead><tr>
            <th style="width:18%">الفرع</th>
            <th>التفاصيل</th>
            <th style="width:13%">أضافه</th>
            <th style="width:18%">وقت الطلب</th>
            <th style="width:14%">إجراء</th>
        </tr></thead>
        <tbody></tbody>
    </table>
</div>`,

i: `
<div class="card" id="addInquiryCard">
    <h3>تسجيل استفسار عميل</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-bottom:15px;">
        <input type="text" id="iPhone" placeholder="رقم الهاتف">
        <select id="iCityAdd" onchange="updateBranches('iCityAdd','iBranchAdd')"></select>
        <select id="iBranchAdd"></select>
    </div>
    <div style="margin-bottom:15px;">
        <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">نوع الاستفسار</label>
        <select id="iType" onchange="toggleInquiryNotes()">
            <option value="">اختر نوع الاستفسار</option>
            <option value="شكوى">شكوى</option>
            <option value="استفسار عن توفر منتج">استفسار عن توفر منتج</option>
            <option value="استفسار عن سعر منتج">استفسار عن سعر منتج</option>
            <option value="توظيف">توظيف</option>
            <option value="طلبية">طلبية</option>
            <option value="تحويل لمول الشعب">تحويل لمول الشعب</option>
            <option value="أخرى">أخرى</option>
        </select>
    </div>
    <div id="iNotesBox" style="display:none;margin-bottom:15px;">
        <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">التفاصيل</label>
        <textarea id="iNotes" placeholder="اكتب التفاصيل هنا..." rows="3"></textarea>
    </div>
    <button class="btn btn-main" style="margin-top:5px" onclick="addInquiry()">حفظ الاستفسار</button>
</div>
<div class="search-bar search-bar-i">
    <div style="grid-column:1/-1;" class="search-section-title">🔍 خيارات البحث</div>
    <div><label>المحافظة</label><select id="searchCityI" onchange="updateBranches('searchCityI','searchBranchI');filterTable();"></select></div>
    <div><label>الفرع</label><select id="searchBranchI" onchange="filterTable()"><option value="">الكل</option></select></div>
    <div><label>التاريخ</label><div class="date-picker-wrap" onclick="openDatePicker('searchDateI')"><span class="date-display" id="searchDateI-display">📅 اختر التاريخ</span><input type="hidden" id="searchDateI"></div></div>
    <div><label>موظف الاستفسار</label><select id="searchAddedByI" onchange="filterTable()"><option value="">الكل</option></select></div>
    <button class="btn" style="background:var(--bg-input);color:var(--text-dim);align-self:end;" onclick="resetSearch('I')">تفريغ</button>
</div>
<div class="card">
    <table id="tableI">
        <thead><tr>
            <th style="width:6%">#</th>
            <th style="width:14%">الفرع</th>
            <th style="width:14%">الهاتف</th>
            <th>الموضوع</th>
            <th style="width:12%">أضافه</th>
            <th style="width:16%">الوقت</th>
        </tr></thead>
        <tbody></tbody>
    </table>
</div>`,

c: `
<div class="card" id="addControlCard">
    <h3>تسجيل شكوى سيطرة</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
        <select id="cCityAdd" onchange="updateBranches('cCityAdd','cBranchAdd')"></select>
        <select id="cBranchAdd"></select>
    </div>
    <div style="background:rgba(25,118,210,0.07);border:1px solid rgba(25,118,210,0.2);border-radius:14px;padding:16px;margin-bottom:15px;">
        <div style="font-size:13px;color:#64b5f6;font-weight:700;margin-bottom:10px;">👤 معلومات الزبون (اختياري)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <input type="text" id="cCustomerName" placeholder="اسم الزبون">
            <input type="text" id="cCustomerPhone" placeholder="رقم الهاتف">
            <input type="text" id="cCustomerOrder" placeholder="رقم الطلبية / تفاصيل أخرى">
        </div>
    </div>
    <div style="margin-bottom:15px;">
        <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">🔗 ربط بشكوى في الاستفسارات (اختياري)</label>
        <select id="cLinkedInquiry" style="width:100%;" onchange="onLinkedInquiryChange()">
            <option value="">— بدون ربط —</option>
        </select>
        <div id="linkedInqPreview" style="display:none;margin-top:8px;padding:10px 14px;background:rgba(156,39,176,0.1);border:1px solid rgba(156,39,176,0.3);border-radius:10px;font-size:12px;color:#ce93d8;">
            🔗 <span id="linkedInqPreviewText"></span>
        </div>
    </div>
    <label style="font-size:13px;color:var(--text-dim);">المرفقات (صور أو ملفات):</label>
    <input type="file" id="cFile" style="margin-bottom:15px;background:none;border:none;">
    <textarea id="cNotes" placeholder="نص الملاحظة الواردة من السيطرة..." rows="3"></textarea>
    <button class="btn btn-main" style="margin-top:15px" onclick="addControl()">إرسال الشكوى</button>
</div>
<div class="search-bar search-bar-c">
    <div style="grid-column:1/-1;" class="search-section-title">🔍 خيارات البحث</div>
    <div><label>المحافظة</label><select id="searchCityC" onchange="updateBranches('searchCityC','searchBranchC');filterTable();"></select></div>
    <div><label>الفرع</label><select id="searchBranchC" onchange="filterTable()"><option value="">الكل</option></select></div>
    <div><label>التاريخ</label><div class="date-picker-wrap" onclick="openDatePicker('searchDateC')"><span class="date-display" id="searchDateC-display">📅 اختر التاريخ</span><input type="hidden" id="searchDateC"></div></div>
    <div><label>نص الشكوى</label><input type="text" id="searchTextC" placeholder="بحث..." oninput="filterTable()"></div>
    <button class="btn" style="background:var(--bg-input);color:var(--text-dim);align-self:end;" onclick="resetSearch('C')">تفريغ</button>
</div>
<div class="card">
    <table id="tableC">
        <thead><tr>
            <th style="width:14%">الفرع</th>
            <th>الشكوى والمرفق</th>
            <th style="width:12%">الموظف</th>
            <th style="width:16%">وقت الإرسال</th>
            <th style="width:16%">إجراء المدير</th>
        </tr></thead>
        <tbody></tbody>
    </table>
</div>`,

b: `
<div class="card">
    <h3>☕ استراحة / اجتماع</h3>
    <p style="color:var(--text-dim);font-size:13px;margin-top:-10px;">اختر نوع الغياب لبدء تسجيل الوقت</p>
    <div class="break-grid">
        <div class="break-btn-card" onclick="startBreak('استراحة')"><span class="break-icon">☕</span>استراحة</div>
        <div class="break-btn-card" onclick="startBreak('اجتماع')"><span class="break-icon">🤝</span>اجتماع</div>
    </div>
</div>
<div class="card" id="breakHistoryCard">
    <h3 style="margin-bottom:20px;">سجل الاستراحات اليوم</h3>
    <table id="tableBreak">
        <thead><tr>
            <th style="width:25%">النوع</th>
            <th style="width:30%">وقت البدء</th>
            <th style="width:20%">المدة</th>
            <th style="width:25%">وقت الانتهاء</th>
        </tr></thead>
        <tbody></tbody>
    </table>
</div>`,

e: `
<div class="card">
    <h3>👤 إضافة موظف جديد</h3>
    <p style="color:var(--text-dim);font-size:13px;margin-top:-10px;">الرقم الوظيفي يُستخدم كباسوورد دخول للنظام</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-bottom:15px;">
        <div>
            <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">الاسم الكامل</label>
            <input type="text" id="eName" placeholder="اسم الموظف">
        </div>
        <div>
            <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">المسمى الوظيفي</label>
            <select id="eTitle">
                <option value="">اختر المسمى الوظيفي</option>
                <option value="مدير الكول سنتر">مدير الكول سنتر</option>
                <option value="موظف كول سنتر">موظف كول سنتر</option>
                <option value="قسم السيطرة">قسم السيطرة</option>
            </select>
        </div>
        <div>
            <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">الرقم الوظيفي (باسوورد الدخول)</label>
            <input type="text" id="eId" placeholder="مثال: 1234">
        </div>
    </div>
    <button class="btn btn-main" onclick="addEmployee()">➕ إضافة الموظف</button>
</div>
<div class="card">
    <h3 style="margin-bottom:20px;">قائمة الموظفين المسجلين</h3>
    <table id="tableE">
        <thead><tr>
            <th style="width:5%">#</th>
            <th style="width:30%">الاسم الكامل</th>
            <th style="width:30%">المسمى الوظيفي</th>
            <th style="width:20%">الرقم الوظيفي</th>
            <th style="width:15%">حذف</th>
        </tr></thead>
        <tbody></tbody>
    </table>
</div>`,

s: `
<div class="card">
    <h3>📊 إحصائية الموظفين</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
        <div>
            <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">اختر الموظف</label>
            <select id="statEmpSelect" onchange="renderStats()"><option value="">اختر موظفاً</option></select>
        </div>
        <div>
            <label style="font-size:13px;color:var(--text-dim);display:block;margin-bottom:5px;">اليوم</label>
            <input type="date" id="statDate" onchange="renderStats()" style="color:white;">
        </div>
    </div>
    <div id="statsResult"></div>
</div>`

};
