/* ══════════════════════════════════════════════════════
   AUTH — Login, logout, permissions
══════════════════════════════════════════════════════ */
function perm(p) {
    if (!currentUser) return false;
    const r = currentUser.isAdmin ? 'admin' : (currentUser.role || 'cc_employee');
    const P = {
        // المدير الرئيسي — كامل الصلاحيات
        admin: [
            'addM','approveM','editM','deliverM','rejectM','deleteM',
            'addI','viewI',
            'addC','editC','approveC','returnC','deleteC','auditC',
            'addEmp','viewStats','viewBreak','viewLinkBadge'
        ],
        // مدير الكول سنتر
        cc_manager: [
            'addM','editM','deliverM','rejectM','deleteM',
            'addI','viewI',
            'addC','editC','approveC','returnC','deleteC',
            'addEmp','viewStats','viewBreak','viewLinkBadge'
        ],
        // موظف كول سنتر
        cc_employee: [
            'addM','deliverM',
            'addI','viewI',
            'addC',
            'viewBreak','viewLinkBadge'
        ],
        // قسم السيطرة — عرض فقط + الرد على الشكاوي
        control: [
            'auditC'
        ]
    };
    return (P[r]||[]).includes(p);
}

function recordLogin() {
    if (!currentUser || currentUser.isAdmin) return;
    sessions.push({
        id: Date.now(),
        empId: currentUser.empId,
        empName: currentUser.name,
        loginIso: new Date().toISOString(),
        logoutIso: null,
        date: iso()
    });
    saveSessions();
}

function recordLogout() {
    if (!currentUser || currentUser.isAdmin) return;
    const s = [...sessions].reverse().find(s => s.empId === currentUser.empId && !s.logoutIso);
    if (s) { s.logoutIso = new Date().toISOString(); saveSessions(); }
}

function doLogout() {
    recordLogout();
    location.reload();
}

function login() {
    const pass = document.getElementById("passInput").value;
    if (pass === PASSWORD) {
        currentUser = { name:"المدير", title:"مدير النظام", empId:PASSWORD, isAdmin:true };
    } else {
        const emp = employees.find(e => e.empId === pass);
        if (!emp) return alert("الرقم الوظيفي غير صحيح");
        let role = 'cc_employee';
        if (emp.title === 'مدير الكول سنتر') role = 'cc_manager';
        else if (emp.title === 'موظف كول سنتر') role = 'cc_employee';
        else if (emp.title === 'قسم السيطرة') role = 'control';
        currentUser = { ...emp, isAdmin:false, role };
    }
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainApp").style.display   = "flex";
    setProfileUI();
    recordLogin();
    init();
}

function setProfileUI() {
    document.getElementById("sidebarName").textContent  = currentUser.name;
    document.getElementById("sidebarTitle").textContent = currentUser.title;
    document.getElementById("profileBtn").style.display = "flex";

    // إظهار/إخفاء التبويبات حسب الصلاحيات
    if (perm('viewI'))      document.getElementById("tab-i").classList.remove("hidden");
    if (!perm('viewBreak')) document.getElementById("tab-b").classList.add("hidden");
    if (!perm('addEmp'))    document.getElementById("tab-e").classList.add("hidden");
    if (perm('viewStats'))  document.getElementById("tab-s").classList.remove("hidden");
}

function openProfile() {
    document.getElementById("modalName").textContent        = currentUser.name;
    document.getElementById("modalTitleTop").textContent    = currentUser.title;
    document.getElementById("modalNameDetail").textContent  = currentUser.name;
    document.getElementById("modalTitleDetail").textContent = currentUser.title;
    document.getElementById("modalEmpId").textContent       = currentUser.empId;
    document.getElementById("profileModal").classList.remove("hidden");
}

function closeProfile() { document.getElementById("profileModal").classList.add("hidden"); }
