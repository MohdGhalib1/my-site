/* ══════════════════════════════════════════════════════
   EMPLOYEES — Add, delete, render
══════════════════════════════════════════════════════ */
function addEmployee() {
    const name=document.getElementById("eName").value.trim(),
          title=document.getElementById("eTitle").value.trim(),
          empId=document.getElementById("eId").value.trim();
    if (!name||!title||!empId) return alert("يرجى إكمال جميع البيانات");
    if (employees.some(e => e.empId===empId)) return alert("هذا الرقم الوظيفي مستخدم مسبقاً");
    employees.unshift({ id:Date.now(), name, title, empId });
    saveEmployees();
    document.getElementById("eName").value = document.getElementById("eTitle").value = document.getElementById("eId").value = "";
    populateEmployeeDropdowns();
    renderEmployees();
}

function deleteEmployee(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;
    employees = employees.filter(e => e.id!==id);
    saveEmployees();
    populateEmployeeDropdowns();
    renderEmployees();
}

function renderEmployees() {
    const tbody = document.querySelector("#tableE tbody"); if (!tbody) return;
    if (!employees.length) {
        tbody.innerHTML=`<tr><td colspan="5" style="color:var(--text-dim);padding:30px;">لا يوجد موظفون مسجلون بعد</td></tr>`;
        return;
    }
    tbody.innerHTML = employees.map((e,i) => `<tr>
        <td>${i+1}</td><td><b>${e.name}</b></td>
        <td><span class="emp-badge">${e.title}</span></td>
        <td><span class="emp-id-display">${e.empId}</span></td>
        <td><button class="btn-delete-sm" onclick="deleteEmployee(${e.id})">🗑 حذف</button></td>
    </tr>`).join('');
}
