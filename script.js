// 1. Inisialisasi Audio
const music = document.getElementById("weddingMusic");
const musicIcon = document.getElementById("musicIcon");

// 2. Fungsi Putar Musik (Dipanggil saat Klik Pertama)
function playWeddingMusic() {
    if (music && music.paused) {
        music.play().then(() => {
            if (musicIcon) musicIcon.innerText = "▶︎"; 
            if (musicIcon) musicIcon.parentElement.style.opacity = "1";
        }).catch(e => console.log("Musik tertunda..."));
    }
}

// 3. Fungsi Buka Undangan (Jika Cover ada di halaman yang sama)
function openInvitation() {
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    
    if (cover) cover.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    
    document.body.style.overflow = 'auto'; 
    window.scrollTo(0, 0);

    // Trigger musik saat tombol "Open" diklik
    playWeddingMusic();
}

// 4. Tombol Scroll ke Bawah (Sudah digabung & diperbaiki)
function scrollNext() {
    // Jalankan musik sekaligus scroll ke section berikutnya
    playWeddingMusic();

    const nextSection = document.getElementById("next-section") || document.querySelector('.swastyastu-section');
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
}

// 5. Toggle Musik (On/Off)
function toggleMusic() {
    if (music.paused) {
        music.play();
        if (musicIcon) musicIcon.parentElement.style.opacity = "1";
    } else {
        music.pause();
        if (musicIcon) musicIcon.parentElement.style.opacity = "0.5";
    }
}

// 6. Logika Slide Gallery (Agar lancar)
function moveSlide(direction) {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    const frameWidth = grid.clientWidth;
    grid.scrollBy({
        left: direction * frameWidth,
        behavior: "smooth"
    });
}

// 7. Auto Play Musik jika ada Parameter ?play=true
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('play') === 'true') {
        document.body.addEventListener('click', playWeddingMusic, { once: true });
        document.body.addEventListener('touchstart', playWeddingMusic, { once: true });
        document.body.addEventListener('wheel', playWeddingMusic, { once: true });
    }
});

// 8. Countdown Logic (Tanggal disesuaikan ke 11 November 2026 sesuai undangan)
const targetDate = new Date("Nov 11, 2026 08:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff < 0) return;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    if (hoursEl) hoursEl.innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    if (minutesEl) minutesEl.innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    if (secondsEl) secondsEl.innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}, 1000);

document.addEventListener("DOMContentLoaded", function () {
    const galleryItems = document.querySelectorAll(".gallery-item");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    galleryItems.forEach(item => {
        observer.observe(item);
    });
});


// 🔥 Ganti URL di bawah ini dengan Web App URL milikmu dari Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztir_Hj7PeJRupi2S3IkenBtQQwpKPbViGnd0rfmQnFz1zu00wJ_tPCbH44BIeH1HgRQ/exec";

document.addEventListener("DOMContentLoaded", function () {
    const rsvpForm = document.getElementById("rsvpForm");
    const rsvpFeedback = document.getElementById("rsvpFeedback");
    const rsvpMessages = document.getElementById("rsvpMessages");
    const rsvpCount = document.getElementById("rsvpCount");
    const submitBtn = rsvpForm.querySelector(".rsvp-submit");

    // 1. Handle Submit Form RSVP ke Spreadsheet
    rsvpForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("rsvpName").value.trim();
        const message = document.getElementById("rsvpMessage").value.trim();
        const status = document.getElementById("rsvpStatus").value;

        if (!name || !message || !status) {
            rsvpFeedback.textContent = "Mohon lengkapi semua kolom!";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";
        rsvpFeedback.textContent = "";

        const formData = {
            name: name,
            message: message,
            status: status
        };

        fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Diperlukan untuk Google Apps Script Web App
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            rsvpFeedback.textContent = "Terima kasih! Ucapan & konfirmasi berhasil dikirim.";
            rsvpForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = "Send";
            
            // Muat ulang daftar ucapan setelah beberapa detik agar data terbaru muncul
            setTimeout(loadMessages, 1500);
        })
        .catch(error => {
            console.error("Error!", error);
            rsvpFeedback.textContent = "Maaf, terjadi kesalahan. Silakan coba lagi.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Send";
        });
    });

    // 2. Load / Ambil Data Ucapan dari Spreadsheet untuk Ditampilkan di Bawah
    function loadMessages() {
        if (!SCRIPT_URL.includes("http")) return; // Cegah error jika URL belum diisi

        fetch(SCRIPT_URL)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    rsvpMessages.innerHTML = `
                        <p class="rsvp-empty">
                            Jadilah yang pertama menyampaikan doa untuk Bayu & Yanti.
                        </p>`;
                    rsvpCount.textContent = "0 ucapan";
                    return;
                }

                rsvpCount.textContent = `${data.length} ucapan`;
                rsvpMessages.innerHTML = "";

                // Render setiap pesan ke dalam card HTML
                data.forEach(item => {
                    let statusClass = "rsvp-status";
                    if (item.status === "Tidak Hadir") statusClass += " status-no";
                    if (item.status === "Ragu-ragu") statusClass += " status-maybe";

                    const card = document.createElement("div");
                    card.className = "rsvp-message-card";
                    card.innerHTML = `
                        <div class="rsvp-message-top">
                            <h4 class="rsvp-message-name">${escapeHtml(item.name)}</h4>
                            <span class="${statusClass}">${escapeHtml(item.status)}</span>
                        </div>
                        <p class="rsvp-message-text">${escapeHtml(item.message)}</p>
                        <span class="rsvp-message-time">Baru saja</span>
                    `;
                    rsvpMessages.appendChild(card);
                });
            })
            .catch(err => console.error("Gagal memuat ucapan:", err));
    }

    // Fungsi keamanan kecil untuk mencegah XSS
    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;");
    }

    // Panggil fungsi saat halaman pertama kali dibuka
    loadMessages();
});