/**
 * Click-to-Copy Email Controller
 * Copies the email to clipboard and provides an instant "Copied!" visual badge
 */

export function initCopyEmail() {
    const copyBtns = document.querySelectorAll('.as-copy-email-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'abdullahmuk2025@gmail.com';

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    // Fallback for older browsers
                    const temp = document.createElement('textarea');
                    temp.value = email;
                    document.body.appendChild(temp);
                    temp.select();
                    document.execCommand('copy');
                    document.body.removeChild(temp);
                }

                const toast = btn.querySelector('.as-copied-toast');
                if (toast) {
                    toast.style.display = 'inline-block';
                    setTimeout(() => {
                        toast.style.display = 'none';
                    }, 2000);
                }
            } catch (err) {
                console.error('Failed to copy email to clipboard:', err);
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyEmail);
} else {
    initCopyEmail();
}
