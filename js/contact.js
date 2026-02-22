// ===== contact.js — Contact form validation =====

function resetForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;
    form.reset();
    form.style.display = '';
    success.style.display = 'none';
    document.getElementById('charCount').textContent = '0';
}

(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Character counter
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            charCount.textContent = len;
            charCount.style.color = len > 450 ? '#ef4444' : '';
            if (len > 500) textarea.value = textarea.value.substring(0, 500);
        });
    }

    // Validation helpers
    function setError(fieldId, errId, msg) {
        const field = document.getElementById(fieldId);
        const errEl = document.getElementById(errId);
        if (!field || !errEl) return;
        field.parentElement.classList.toggle('error', !!msg);
        errEl.textContent = msg || '';
    }

    function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const fname = document.getElementById('fname')?.value.trim();
        const lname = document.getElementById('lname')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        // First name
        if (!fname) { setError('fname', 'fnameError', 'First name is required.'); valid = false; }
        else { setError('fname', 'fnameError', ''); }

        // Last name
        if (!lname) { setError('lname', 'lnameError', 'Last name is required.'); valid = false; }
        else { setError('lname', 'lnameError', ''); }

        // Email
        if (!email) { setError('email', 'emailError', 'Email is required.'); valid = false; }
        else if (!validateEmail(email)) { setError('email', 'emailError', 'Please enter a valid email.'); valid = false; }
        else { setError('email', 'emailError', ''); }

        // Message
        if (!message || message.length < 10) { setError('message', 'messageError', 'Message must be at least 10 characters.'); valid = false; }
        else { setError('message', 'messageError', ''); }

        if (!valid) return;

        // Send to real email via FormSubmit AJAX API
        const btn = document.getElementById('submitBtn');
        const btnText = btn?.querySelector('.btn-text');
        const btnLoading = btn?.querySelector('.btn-loading');
        if (btn) {
            btn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = '';
        }

        const subjectEl = document.getElementById('subject');
        let subjectText = "New Portfolio Contact Message";
        if (subjectEl && subjectEl.selectedIndex > 0) {
            // grab the text without the emoji if possible, or just the whole text
            subjectText = subjectEl.options[subjectEl.selectedIndex].text;
        }

        fetch("https://formsubmit.co/ajax/akshaynathmr121@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: fname + " " + lname,
                email: email,
                _subject: subjectText,
                message: message
            })
        })
            .then(response => response.json())
            .then(data => {
                form.style.display = 'none';
                const success = document.getElementById('formSuccess');
                if (success) success.style.display = '';
            })
            .catch(error => {
                console.error("Form submission error:", error);
                alert("Oops! Something went wrong while sending your message. Please try again.");
            })
            .finally(() => {
                if (btn) {
                    btn.disabled = false;
                    if (btnText) btnText.style.display = '';
                    if (btnLoading) btnLoading.style.display = 'none';
                }
            });
    });
})();
