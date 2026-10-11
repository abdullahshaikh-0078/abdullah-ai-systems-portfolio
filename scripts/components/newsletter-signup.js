/**
 * AI News Platform - Client Newsletter & Customization Controller
 * Connects frontend UI to FastAPI backend at /api/v1/newsletter
 * Handles quick subscribe, modal preferences, interactive frequency selection,
 * client validation, and persistent state.
 */

import { aiNewsApi } from '../core/api-client.js';

export class NewsletterSignupController {
    constructor() {
        // Quick subscribe elements
        this.form = document.getElementById('as-newsletter-form');
        this.emailInput = document.getElementById('as-newsletter-email');
        this.submitBtn = document.getElementById('as-newsletter-submit-btn');
        this.btnText = this.submitBtn ? this.submitBtn.querySelector('.as-btn-text') : null;
        this.btnSpinner = this.submitBtn ? this.submitBtn.querySelector('.as-btn-spinner') : null;
        this.feedback = document.getElementById('as-newsletter-feedback');

        // Customization modal elements
        this.modal = document.getElementById('as-customization-modal');
        this.modalContainer = this.modal ? this.modal.querySelector('.as-modal-container') : null;
        this.toggleBtn = document.getElementById('as-customization-toggle-btn');
        this.closeBtn = document.getElementById('as-modal-close-btn');
        this.cancelBtn = document.getElementById('as-modal-cancel-btn');
        this.modalForm = document.getElementById('as-customization-form');
        this.modalName = document.getElementById('as-modal-name');
        this.modalEmail = document.getElementById('as-modal-email');
        this.weeklyGroup = document.getElementById('as-weekly-day-group');
        this.prefDay = document.getElementById('as-pref-day');
        this.prefTime = document.getElementById('as-pref-time');
        this.prefTimezone = document.getElementById('as-pref-timezone');
        this.modalFeedback = document.getElementById('as-modal-feedback');
        this.modalSaveBtn = document.getElementById('as-modal-save-btn');
        this.modalSaveText = this.modalSaveBtn ? this.modalSaveBtn.querySelector('.as-save-text') : null;
        this.modalSaveSpinner = this.modalSaveBtn ? this.modalSaveBtn.querySelector('.as-save-spinner') : null;

        this.isSubmitting = false;
        this.lastFocusedElement = null;

        this.init();
    }

    init() {
        // Auto-detect timezone
        this.initTimezone();

        // Bind quick subscribe
        if (this.form && !this.form.dataset.bound) {
            this.form.dataset.bound = 'true';
            this.form.addEventListener('submit', (e) => this.handleQuickSubscribe(e));
        }

        // Bind modal open/close
        if (this.toggleBtn && !this.toggleBtn.dataset.bound) {
            this.toggleBtn.dataset.bound = 'true';
            this.toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal();
            });
        }

        if (this.closeBtn && !this.closeBtn.dataset.bound) {
            this.closeBtn.dataset.bound = 'true';
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        if (this.cancelBtn && !this.cancelBtn.dataset.bound) {
            this.cancelBtn.dataset.bound = 'true';
            this.cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        // Overlay click & Escape
        if (this.modal && !this.modal.dataset.bound) {
            this.modal.dataset.bound = 'true';
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('open')) {
                    this.closeModal();
                } else if (e.key === 'Tab' && this.modal.classList.contains('open')) {
                    this.handleFocusTrap(e);
                }
            });
        }

        // Frequency radio change listeners
        this.initFrequencyRadios();

        // Clear input error states on type
        this.initInputClearEvents();

        // Modal form submit
        if (this.modalForm && !this.modalForm.dataset.bound) {
            this.modalForm.dataset.bound = 'true';
            this.modalForm.addEventListener('submit', (e) => this.handleCustomizationSave(e));
        }

        // Load saved preferences if any
        this.loadSavedPreferences();

        window.__newsletterController = this;
    }

    initTimezone() {
        if (!this.prefTimezone) return;
        try {
            const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (detected && !this.prefTimezone.value) {
                this.prefTimezone.value = detected;
            }
        } catch (e) {
            if (!this.prefTimezone.value) this.prefTimezone.value = 'UTC';
        }
    }

    initFrequencyRadios() {
        const radios = document.querySelectorAll('input[name="as-frequency"]');
        radios.forEach((radio) => {
            radio.addEventListener('change', () => {
                this.syncFrequencyState();
            });
        });
        this.syncFrequencyState();
    }

    syncFrequencyState() {
        const selected = document.querySelector('input[name="as-frequency"]:checked');
        const val = selected ? selected.value : 'DAILY';

        // Update card selected class
        const cards = document.querySelectorAll('.as-radio-card');
        cards.forEach((card) => {
            const input = card.querySelector('input[type="radio"]');
            if (input && input.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Show/hide weekly day group
        if (this.weeklyGroup) {
            if (val === 'WEEKLY') {
                this.weeklyGroup.style.display = 'block';
            } else {
                this.weeklyGroup.style.display = 'none';
            }
        }
    }

    initInputClearEvents() {
        const inputs = [this.emailInput, this.modalEmail, this.modalName];
        inputs.forEach((input) => {
            if (!input) return;
            input.addEventListener('input', () => {
                input.classList.remove('as-input-error');
                if (input === this.emailInput) this.clearFeedback();
                if (input === this.modalEmail || input === this.modalName) this.clearModalFeedback();
            });
        });
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim().toLowerCase());
    }

    showFeedback(message, type = 'success') {
        if (!this.feedback) return;
        this.feedback.textContent = message;
        this.feedback.className = `as-newsletter-feedback ${type}`;
        this.feedback.style.display = 'block';
    }

    clearFeedback() {
        if (!this.feedback) return;
        this.feedback.style.display = 'none';
        this.feedback.textContent = '';
        this.feedback.className = 'as-newsletter-feedback';
    }

    showModalFeedback(message, type = 'success') {
        if (!this.modalFeedback) return;
        this.modalFeedback.textContent = message;
        this.modalFeedback.className = `as-modal-feedback ${type}`;
        this.modalFeedback.style.display = 'block';
    }

    clearModalFeedback() {
        if (!this.modalFeedback) return;
        this.modalFeedback.style.display = 'none';
        this.modalFeedback.textContent = '';
        this.modalFeedback.className = 'as-modal-feedback';
    }

    openModal() {
        if (!this.modal) {
            this.modal = document.getElementById('as-customization-modal');
        }
        if (!this.modal) return;

        this.lastFocusedElement = document.activeElement;
        this.clearModalFeedback();

        // Carry entered email from main page into modal if available
        if (this.emailInput && this.emailInput.value.trim() && this.modalEmail) {
            this.modalEmail.value = this.emailInput.value.trim();
        }

        // Refresh timezone if not yet filled
        this.initTimezone();
        this.syncFrequencyState();

        this.modal.style.display = 'flex';
        // Force reflow for smooth transition
        void this.modal.offsetHeight;
        this.modal.classList.add('open');
        this.modal.setAttribute('aria-hidden', 'false');

        // Focus first field
        if (this.modalName && !this.modalName.value) {
            this.modalName.focus();
        } else if (this.modalEmail) {
            this.modalEmail.focus();
        }
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('open');
        this.modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.clearModalFeedback();
            if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                this.lastFocusedElement.focus();
            }
        }, 200);
    }

    handleFocusTrap(e) {
        if (!this.modal || !this.modal.classList.contains('open')) return;
        const focusable = this.modal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }

    getSelectedTopics() {
        const checked = document.querySelectorAll('input[name="topics"]:checked');
        return Array.from(checked).map((c) => c.value);
    }

    getSelectedContentTypes() {
        const checked = document.querySelectorAll('input[name="content_types"]:checked');
        return Array.from(checked).map((c) => c.value);
    }

    loadSavedPreferences() {
        try {
            const raw = localStorage.getItem('as_newsletter_preferences');
            if (!raw) return;
            const prefs = JSON.parse(raw);
            if (prefs.email) {
                if (this.modalEmail) this.modalEmail.value = prefs.email;
                if (this.emailInput && !this.emailInput.value) this.emailInput.value = prefs.email;
            }
            if (prefs.name && this.modalName) {
                this.modalName.value = prefs.name;
            }
            if (prefs.frequency) {
                const radio = document.querySelector(`input[name="as-frequency"][value="${prefs.frequency}"]`);
                if (radio) radio.checked = true;
                this.syncFrequencyState();
            }
            if (prefs.delivery_day && this.prefDay) {
                this.prefDay.value = prefs.delivery_day;
            }
            if (prefs.delivery_time && this.prefTime) {
                this.prefTime.value = prefs.delivery_time;
            }
            if (prefs.timezone && this.prefTimezone) {
                this.prefTimezone.value = prefs.timezone;
            }
        } catch (e) {
            // Ignore parse errors
        }
    }

    async handleQuickSubscribe(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (this.isSubmitting) return;

        const email = this.emailInput ? this.emailInput.value.trim() : '';
        if (!this.validateEmail(email)) {
            if (this.emailInput) this.emailInput.classList.add('as-input-error');
            this.showFeedback('Please enter a valid email address.', 'error');
            if (this.emailInput) this.emailInput.focus();
            return;
        }

        if (this.emailInput) this.emailInput.classList.remove('as-input-error');
        this.clearFeedback();
        this.isSubmitting = true;

        if (this.submitBtn) this.submitBtn.disabled = true;
        if (this.btnSpinner) this.btnSpinner.style.display = 'inline-block';
        if (this.btnText) this.btnText.textContent = 'Subscribing...';

        const payload = {
            email: email,
            frequency: 'DAILY',
            preferred_channel: 'EMAIL',
            topics: this.getSelectedTopics()
        };

        try {
            const res = await aiNewsApi.subscribeToAINews(payload);

            // Update local subscriber records on successful subscription
            try {
                const subs = JSON.parse(localStorage.getItem('as_subscribers') || '[]');
                if (!subs.includes(email)) subs.push(email);
                localStorage.setItem('as_subscribers', JSON.stringify(subs));
                localStorage.setItem('as_newsletter_email', email);
            } catch (lsErr) { }

            // Sync to modal email if empty
            if (this.modalEmail && !this.modalEmail.value) {
                this.modalEmail.value = email;
            }

            const successMsg = (res && res.message)
                ? res.message
                : "You're subscribed! The Daily AI Digest will be delivered to your inbox.";

            this.showFeedback(successMsg, 'success');
            if (this.emailInput) this.emailInput.value = '';
        } catch (err) {
            console.error('Subscription error:', err);
            let userMsg = "We couldn't complete your subscription right now. Please try again.";
            if (err && err.message) {
                if (err.status === 0 || err.code === 'NETWORK_ERROR') {
                    userMsg = "Unable to connect to the newsletter server. Please try again in a few moments.";
                } else {
                    userMsg = err.message;
                }
            }
            this.showFeedback(userMsg, 'error');
        } finally {
            this.isSubmitting = false;
            if (this.submitBtn) this.submitBtn.disabled = false;
            if (this.btnSpinner) this.btnSpinner.style.display = 'none';
            if (this.btnText) this.btnText.textContent = 'Subscribe';
        }
    }

    async handleCustomizationSave(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (this.isSubmitting) return;

        // Validation: Name is required
        const name = this.modalName ? this.modalName.value.trim() : '';
        if (!name) {
            if (this.modalName) {
                this.modalName.classList.add('as-input-error');
                this.modalName.focus();
            }
            this.showModalFeedback('Please enter your name.', 'error');
            return;
        }
        if (this.modalName) this.modalName.classList.remove('as-input-error');

        // Validation: Email is required & valid format
        const email = this.modalEmail ? this.modalEmail.value.trim() : '';
        if (!this.validateEmail(email)) {
            if (this.modalEmail) {
                this.modalEmail.classList.add('as-input-error');
                this.modalEmail.focus();
            }
            this.showModalFeedback('Please enter a valid email address.', 'error');
            return;
        }
        if (this.modalEmail) this.modalEmail.classList.remove('as-input-error');

        // Delivery frequency & conditional day
        const freqInput = document.querySelector('input[name="as-frequency"]:checked');
        const frequency = freqInput ? freqInput.value : 'DAILY';
        const deliveryDay = (frequency === 'WEEKLY' && this.prefDay) ? this.prefDay.value : null;

        // Delivery time
        const deliveryTime = this.prefTime ? this.prefTime.value : '08:00 AM';
        const timezone = this.prefTimezone ? (this.prefTimezone.value.trim() || 'UTC') : 'UTC';

        // Topics & Content Preferences
        const topics = this.getSelectedTopics();
        const contentTypes = this.getSelectedContentTypes();

        this.clearModalFeedback();
        this.isSubmitting = true;

        if (this.modalSaveBtn) this.modalSaveBtn.disabled = true;
        if (this.modalSaveSpinner) this.modalSaveSpinner.style.display = 'inline-block';
        if (this.modalSaveText) this.modalSaveText.textContent = 'Saving...';

        const payload = {
            name: name,
            email: email,
            frequency: frequency,
            delivery_day: deliveryDay,
            delivery_time: deliveryTime,
            timezone: timezone,
            topics: topics,
            content_types: contentTypes,
            preferred_channel: 'EMAIL'
        };

        try {
            // Submit to backend
            await aiNewsApi.subscribeToAINews({
                email: email,
                name: name,
                frequency: frequency,
                preferred_channel: 'EMAIL',
                topics: topics
            });

            // Save to localStorage upon successful backend confirmation
            try {
                localStorage.setItem('as_newsletter_preferences', JSON.stringify(payload));
                localStorage.setItem('as_newsletter_email', email);
                const subs = JSON.parse(localStorage.getItem('as_subscribers') || '[]');
                if (!subs.includes(email)) subs.push(email);
                localStorage.setItem('as_subscribers', JSON.stringify(subs));
            } catch (lsErr) { }

            // Sync email to main page input if present
            if (this.emailInput) {
                this.emailInput.value = email;
            }

            // Subtle success feedback
            this.showModalFeedback('Preferences saved.', 'success');

            // Close modal after brief confirmation
            setTimeout(() => {
                this.closeModal();
            }, 1200);
        } catch (err) {
            console.error('Customization save error:', err);
            let userMsg = "We couldn't save your preferences right now. Please try again.";
            if (err && err.message) {
                if (err.status === 0 || err.code === 'NETWORK_ERROR') {
                    userMsg = "Unable to connect to server. Please check your connection and try again.";
                } else {
                    userMsg = err.message;
                }
            }
            this.showModalFeedback(userMsg, 'error');
        } finally {
            this.isSubmitting = false;
            if (this.modalSaveBtn) this.modalSaveBtn.disabled = false;
            if (this.modalSaveSpinner) this.modalSaveSpinner.style.display = 'none';
            if (this.modalSaveText) this.modalSaveText.textContent = 'Save Preferences';
        }
    }
}

// Global helper access for inline triggers
window.openCustomizationModal = () => {
    if (!window.__newsletterController) {
        window.__newsletterController = new NewsletterSignupController();
    }
    window.__newsletterController.openModal();
};

window.closeCustomizationModal = () => {
    if (window.__newsletterController) {
        window.__newsletterController.closeModal();
    }
};

function initController() {
    if (!window.__newsletterController) {
        new NewsletterSignupController();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initController);
} else {
    initController();
}
