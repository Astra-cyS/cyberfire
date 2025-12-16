/* ===============================
   المتغيرات العامة
================================ */
let xp = localStorage.getItem("xp")
    ? parseInt(localStorage.getItem("xp"))
    : 0;

const levelRequirements = {
    "Foundations": 0,
    "Networking": 50,
    "Web Security": 120
};

/* ===============================
   تحديث شريط التقدم
================================ */
function updateProgress() {
    const xpBar = document.getElementById("progress-bar");
    if (xpBar) {
        xpBar.style.width = (xp % 100) + "%";
    }
}

/* ===============================
   عرض المستويات
================================ */
function showLevels() {
    fetch("lessons.json")
        .then(res => res.json())
        .then(data => {
            const content = document.getElementById("content");
            content.innerHTML = "<h2>Choose Level</h2>";

            Object.keys(data).forEach(level => {
                const requiredXP = levelRequirements[level] || 0;
                const locked = xp < requiredXP;

                content.innerHTML += `
                    <div class="card"
                        style="opacity:${locked ? 0.4 : 1}"
                        onclick="${
                            locked
                                ? `alert('🔒 يتطلب ${requiredXP} XP')`
                                : `showLessons('${level}')`
                        }">
                        <h3>${level}</h3>
                    </div>
                `;
            });
        })
        .catch(err => alert("خطأ في تحميل المستويات"));
}

/* ===============================
   عرض الدروس داخل مستوى
================================ */
function showLessons(level) {
    fetch("lessons.json")
        .then(res => res.json())
        .then(data => {
            const content = document.getElementById("content");
            content.innerHTML = `<h2>${level}</h2>`;

            data[level].forEach((lesson, index) => {
                content.innerHTML += `
                    <div class="card" onclick="showLesson('${level}', ${index})">
                        <p>${lesson.title}</p>
                    </div>
                `;
            });
        })
        .catch(err => alert("خطأ في تحميل الدروس"));
}

/* ===============================
   عرض درس واحد
================================ */
function showLesson(level, lessonId) {
    fetch("lessons.json")
        .then(res => res.json())
        .then(data => {
            const lesson = data[level][lessonId];
            const content = document.getElementById("content");

            content.innerHTML = `
                <img src="${lesson.image}" style="width:100%;border-radius:12px;">
                <h2>${lesson.title}</h2>
                <p>${lesson.content}</p>
                <button onclick="showLessons('${level}')">⬅ رجوع</button>
            `;

            // ✅ تحقق: هل هذا آخر درس في Foundations؟
            if (level === "Foundations" && lessonId === data[level].length - 1) {
                localStorage.setItem("foundations_completed", "true");
                console.log("Foundations completed ✅");
            }
        })
        .catch(err => alert("خطأ في تحميل الدرس"));
                            }

/* ===============================
   تشغيل التطبيق
================================ */
updateProgress();
