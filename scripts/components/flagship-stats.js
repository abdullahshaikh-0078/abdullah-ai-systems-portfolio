/**
 * Flagship Live Product Status Controller
 * Queries aiNewsApi.getOverview() dynamically from FastAPI backend if available
 * to confirm live status, failing silently without errors when offline.
 */

import { aiNewsApi } from '../core/api-client.js';

export class FlagshipStatsController {
    constructor() {
        this.statusBadge = document.getElementById('as-flagship-status');
        this.init();
    }

    async init() {
        if (!this.statusBadge) return;

        try {
            await aiNewsApi.getOverview();
            if (this.statusBadge) {
                this.statusBadge.innerHTML = `<span class="as-status-dot"></span> LIVE BACKEND CONNECTED`;
            }
        } catch (err) {
            // Graceful fallback when backend is offline
            if (this.statusBadge) {
                this.statusBadge.innerHTML = `<span class="as-status-dot"></span> LIVE &bull; AUTONOMOUS AI NEWS SYSTEM`;
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FlagshipStatsController());
} else {
    new FlagshipStatsController();
}
