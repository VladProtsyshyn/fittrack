import "../styles/main.css";

const API_URL = "http://localhost:3001";
const plansList = document.querySelector(".plans-list");
const form = document.querySelector(".plan-form");

async function loadPlans() {
    const res = await fetch(`${API_URL}/plans`);
    if (!res.ok) throw new Error("Failed to load plans");
    return res.json();
}

function renderPlans(plans) {
    plansList.innerHTML = "";

    plans.forEach((plan) => {
        const div = document.createElement("div");
        div.classList.add("plan-card");
        div.dataset.id = plan.id;

        div.innerHTML = `
        <h3>${escapeHtml(plan.title)}</h3>
        <p><strong>Day:</strong> ${escapeHtml(plan.day)}</p>
        <p><strong>Type:</strong> ${escapeHtml(plan.type)}</p>
        <p>${escapeHtml(plan.notes || "")}</p>
        <p><strong>Duration:</strong> ${Number(plan.durationMin)} min</p>
        `;

        plansList.appendChild(div);
    });
}

async function createPlan(payload) {
    const res = await fetch(`${API_URL}/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create plan");
        return res.json();
}

async function refresh() {
    const plans = await loadPlans();
    renderPlans(plans);
}

function getFormData(formEl) {
    const fd = new FormData(formEl);

    return {
        day: fd.get("day"),
        title: fd.get("title").trim(),
        type: fd.get("type").trim(),
        notes: (fd.get("notes") || "").trim(),
        durationMin: Number(fd.get("durationMin")),
        updatedAt: new Date().toISOString(),
    };
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const payload = getFormData(form);

        if (!payload.title || !payload.type || !payload.day) return;

        await createPlan(payload);
        form.reset();
        form.querySelector('input[name="durationMin"]').value = 45;

        await refresh();
        } catch (err) {
        console.error(err);
        alert("Не вдалось додати план. Перевір консоль.");
    }
});

refresh().catch((err) => console.error(err));