const content = document.getElementById("content");

function showHome() {
    content.innerHTML = `
        <h2>🔥 مرحبًا بك في CyberFire 🔥</h2>
        <p>منصة عربية لتعليم الأمن السيبراني والهاكر الأخلاقي خطوة بخطوة.</p>
    `;
}

function showLessons() {
    fetch("lessons.json")
        .then(res => res.json())
        .then(data => {
            content.innerHTML = "<h2>📚 الدروس</h2>";
            data.forEach(lesson => {
                content.innerHTML += `
                    <div class="card">
                        <h3>${lesson.title}</h3>
                        <p>${lesson.content}</p>
                    </div>
                `;
            });
        });
}

function showChallenges() {
    content.innerHTML = `
        <h2>💣 التحديات</h2>
        <div class="card">
            <p>ما معنى XSS؟</p>
            <button onclick="alert('Cross Site Scripting 😈')">إظهار الإجابة</button>
        </div>
    `;
}
function updateProgress() {
    const bar = document.getElementById("progress-bar");
    let percent = Math.min((xp / 100) * 100, 100);
    bar.style.width = percent + "%";
}
function showAbout() {
    content.innerHTML = `
        <h2>👨‍💻 من نحن</h2>
        <p>مشروع عربي لنشر الوعي بالأمن السيبراني بشكل أخلاقي وقانوني.</p>
    `;
}
function showRoadmap() {
    fetch("roadmap.json")
        .then(res => res.json())
        .then(data => {
            content.innerHTML = "<h2>🧭 خارطة الطريق</h2>";

            data.forEach(level => {
                if (xp >= level.minXP) {
                    content.innerHTML += `
                        <div class="card">
                            <h3>${level.level}</h3>
                            <ul>
                                ${level.topics.map(t => `<li>${t}</li>`).join("")}
                            </ul>
                        </div>
                    `;
                } else {
                    content.innerHTML += `
                        <div class="card" style="opacity:0.3">
                            <h3>${level.level}</h3>
                            <p>🔒 افتح هذا المستوى عند XP ${level.minXP}</p>
                        </div>
                    `;
                }
            });
        });
}
let earnedBadges = JSON.parse(localStorage.getItem("badges")) || [];

function checkBadges() {
    fetch("badges.json")
        .then(res => res.json())
        .then(data => {
            data.forEach(badge => {
                if (xp >= badge.xp && !earnedBadges.includes(badge.name)) {
                    earnedBadges.push(badge.name);
                    localStorage.setItem("badges", JSON.stringify(earnedBadges));
                    alert("🏆 حصلت على شارة: " + badge.name);
                }
            });
        });
}
function showTerminal() {
    content.innerHTML = `
        <h2>🖥️ CyberFire Terminal</h2>
        <div id="terminal">
            <div id="output">type <b>help</b> to begin...</div>
            <input id="cmd" placeholder="root@cyberfire:~#" onkeydown="handleCmd(event)">
        </div>
    `;
}
function handleCmd(e) {
    if (e.key !== "Enter") return;

    const input = e.target;
    const cmd = input.value.trim();
    const output = document.getElementById("output");

    output.innerHTML += `<br><span>> ${cmd}</span>`;

    if (cmd === "help") {
        output.innerHTML += "<br>commands: help, ls, cat flag";
    } 
    else if (cmd === "ls") {
        output.innerHTML += "<br>flag.txt";
    } 
    else if (cmd === "cat flag") {
        output.innerHTML += "<br>FLAG{CYBERFIRE_BEGINNER}";
        if (!localStorage.getItem("ctf")) {
            xp += 20;
            localStorage.setItem("xp", xp);
            localStorage.setItem("ctf", "done");
            updateProgress();
            checkBadges();
            alert("🔥 CTF Completed! +20 XP");
        }
    } 
    else {
        output.innerHTML += "<br>command not found";
    }

    input.value = "";
}

// تشغيل الصفحة الرئيسية عند الفتح
showHome();
let xp = localStorage.getItem("xp")
    ? parseInt(localStorage.getItem("xp"))
    : 0;
    updateProgress();

function showQuiz() {
    fetch("quiz.json")
        .then(res => res.json())
        .then(data => {
            content.innerHTML = `
    <h2>🧠 الاختبار</h2>
    <p>XP: ${xp}</p>
    <button onclick="resetXP()">تصفير XP</button>
`;

            data.forEach((q, index) => {
                content.innerHTML += `
                    <div class="card">
                        <p>${q.question}</p>
                        ${q.options.map((opt, i) =>
                            `<button onclick="checkAnswer(${index}, ${i})">${opt}</button>`
                        ).join("")}
                    </div>
                `;
            });

            window.quizData = data;
            updateProgress();
        });
}

function checkAnswer(qIndex, optIndex) {
    if (optIndex === quizData[qIndex].answer) {
        xp += 10;
        localStorage.setItem("xp", xp);
        updateProgress();
        checkBadges();
        alert("✅ إجابة صحيحة! +10 XP");
    } else {
        alert("❌ إجابة خاطئة");
    }
    showQuiz();
}
function showBadges() {
    content.innerHTML = "<h2>🏆 شاراتك</h2>";

    if (earnedBadges.length === 0) {
        content.innerHTML += "<p>لم تحصل على شارات بعد 😈</p>";
        return;
    }

    earnedBadges.forEach(b => {
        content.innerHTML += `
            <div class="card">
                <h3>${b}</h3>
            </div>
        `;
    });
}
function resetXP() {
    localStorage.removeItem("xp");
    xp = 0;
    alert("🔥 تم تصفير XP");
    showQuiz();
    updateProgress();
}
