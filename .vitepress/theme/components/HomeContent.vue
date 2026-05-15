<script setup lang="ts">
import { ref } from 'vue'

const openFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const features = [
  { label: 'Pricing', billmora: 'Free forever', whmcs: '~$15.95/mo', blesta: '~$7.95/mo', type: 'text' },
  { label: 'Open Source', billmora: true, whmcs: false, blesta: false },
  { label: 'No License Fees', billmora: true, whmcs: false, blesta: false },
  { label: 'Plugin-Based Provisioning', billmora: true, whmcs: true, blesta: true },
  { label: 'Domain Management', billmora: true, whmcs: true, blesta: true },
  { label: 'Automation Engine', billmora: true, whmcs: true, blesta: true },
  { label: 'Support Ticket System', billmora: true, whmcs: true, blesta: true },
  { label: 'Custom Theme Support', billmora: true, whmcs: true, blesta: true },
  { label: 'Audit Logs', billmora: true, whmcs: false, blesta: false },
  { label: 'Broadcast Announcements', billmora: true, whmcs: true, blesta: false },
  { label: 'Multi-Language (i18n)', billmora: true, whmcs: true, blesta: true },
  { label: 'Docker Support', billmora: true, whmcs: false, blesta: false },
  { label: 'One-Click Updates', billmora: true, whmcs: true, blesta: true },
  { label: 'Community Marketplace', billmora: true, whmcs: true, blesta: false },
  { label: 'Community-Driven', billmora: true, whmcs: false, blesta: false },
]

const faqs = [
  {
    question: 'Is Billmora really free?',
    answer: 'Yes. Billmora is fully open-source under the MIT License. There are no license fees, no per-seat charges, and no hidden costs. You are free to use, modify, and distribute it.',
  },
  {
    question: 'What are the server requirements?',
    answer: 'Billmora runs on PHP 8.2+, Laravel 11, MySQL/MariaDB, and Node.js (for asset building). A standard VPS or shared hosting environment is sufficient.',
  },
  {
    question: 'Does Billmora support multiple payment gateways?',
    answer: 'Yes. Payment gateways are implemented as plugins. You can install, configure, and use multiple gateways simultaneously. The community marketplace provides additional gateway integrations.',
  },
  {
    question: 'Can I use Billmora for domains?',
    answer: 'Yes. Billmora includes a built-in domain management system with a registrar plugin architecture, TLD price management, WHOIS lookup, and registrant profile management.',
  },
  {
    question: 'How do I get support?',
    answer: 'Community support is available through our Discord server. For bug reports and feature requests, please open an issue on GitHub.',
  },
  {
    question: 'Can I contribute to Billmora?',
    answer: 'Absolutely. Contributions are welcome — whether it\'s code, documentation, translations, or plugins. See the Contributing Guide on GitHub to get started.',
  },
]

// ── Sponsors Data ──
const diamondSponsors = [
  { name: 'Octavia', logo: 'https://assets.octavia.id/logo/secondary-nobg.png', url: 'https://octavia.id' }
]

const emeraldSponsors = [
  // { name: 'Name of Sponsor', logo: 'https://url-logo.png', url: 'https://website-sponsor.com' }
]
</script>

<template>
  <div class="home-sections">
    <!-- ── Comparison ── -->
    <section class="section comparison-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-eyebrow">Comparison</span>
          <h2 class="section-title">Why Billmora?</h2>
          <p class="section-subtitle">
            See how Billmora stacks up against the industry's most popular billing platforms.
          </p>
        </div>

        <div class="comparison-grid">
          <div class="grid-header">
            <div class="grid-col-feature">Feature</div>
            <div class="grid-col-billmora">
              <span class="billmora-text-badge">Billmora</span>
            </div>
            <div class="grid-col-other">WHMCS</div>
            <div class="grid-col-other">Blesta</div>
          </div>

          <div class="grid-body">
            <div v-for="(row, i) in features" :key="i" class="grid-row" :class="{ 'highlight-row': row.billmora && !row.whmcs && !row.blesta }">
              <div class="grid-col-feature">{{ row.label }}</div>
              <div class="grid-col-billmora">
                <span v-if="row.type === 'text'" class="val-text val-free">{{ row.billmora }}</span>
                <span v-else-if="row.billmora === true" class="val-icon val-yes">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span v-else class="val-icon val-no">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
              </div>
              <div class="grid-col-other">
                <span v-if="row.type === 'text'" class="val-text">{{ row.whmcs }}</span>
                <span v-else-if="row.whmcs === true" class="val-icon val-yes-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span v-else class="val-icon val-no">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
              </div>
              <div class="grid-col-other">
                <span v-if="row.type === 'text'" class="val-text">{{ row.blesta }}</span>
                <span v-else-if="row.blesta === true" class="val-icon val-yes-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span v-else class="val-icon val-no">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ── -->
    <section class="section faq-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-eyebrow">FAQ</span>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">
            Everything you need to know before getting started with Billmora.
          </p>
        </div>

        <div class="faq-list">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="faq-item"
            :class="{ open: openFaq === i }"
            @click="toggleFaq(i)"
          >
            <div class="faq-question">
              <span>{{ faq.question }}</span>
              <div class="faq-icon-wrapper">
                <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <div class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Sponsors ── -->
    <section class="section sponsors-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-eyebrow">Sponsors</span>
          <h2 class="section-title">Backed By</h2>
          <p class="section-subtitle">
            Billmora is free and open-source, sustained by our incredible sponsors.
          </p>
        </div>

        <div class="sponsors-grid">
          <!-- Diamond Tier -->
          <div class="sponsor-tier diamond">
            <div class="tier-logos">
              <template v-if="diamondSponsors.length > 0">
                <a v-for="(sponsor, i) in diamondSponsors" :key="i" :href="sponsor.url" class="sponsor-logo-box large" target="_blank" rel="noopener">
                  <img :src="sponsor.logo" :alt="sponsor.name" class="sponsor-img" />
                </a>
              </template>
              <a v-else href="https://github.com/sponsors/Billmora" class="sponsor-empty-logo large" target="_blank" rel="noopener">
                <span>Become a Diamond Sponsor</span>
              </a>
            </div>
          </div>
          
          <!-- Emerald Tier -->
          <div class="sponsor-tier emerald">
            <div class="tier-logos">
              <template v-if="emeraldSponsors.length > 0">
                <a v-for="(sponsor, i) in emeraldSponsors" :key="i" :href="sponsor.url" class="sponsor-logo-box medium" target="_blank" rel="noopener">
                  <img :src="sponsor.logo" :alt="sponsor.name" class="sponsor-img" />
                </a>
              </template>
              <template v-else>
                <a href="https://github.com/sponsors/Billmora" class="sponsor-empty-logo medium" target="_blank" rel="noopener">
                  <span>Your Logo</span>
                </a>
                <a href="https://github.com/sponsors/Billmora" class="sponsor-empty-logo medium" target="_blank" rel="noopener">
                  <span>Your Logo</span>
                </a>
                <a href="https://github.com/sponsors/Billmora" class="sponsor-empty-logo medium" target="_blank" rel="noopener">
                  <span>Your Logo</span>
                </a>
              </template>
            </div>
          </div>
        </div>

        <div class="sponsors-cta">
          <a href="https://github.com/sponsors/Billmora" class="btn btn-outline" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            Sponsor us on GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Global/Reset within component ── */
.home-sections {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Add margin top to separate from hero */
  margin-top: 4rem;
}

.section {
  width: 100%;
  padding: 6rem 1.5rem;
  display: flex;
  justify-content: center;
}

.section-inner {
  width: 100%;
  max-width: 1152px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 700px;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
  padding: 0.35rem 1rem;
  border-radius: 9999px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  margin: 0 0 1.25rem 0;
  border: none !important; /* Override vp-doc */
  padding: 0 !important; /* Override vp-doc */
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

/* ── Comparison Grid ── */
.comparison-grid {
  width: 100%;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
  font-family: var(--vp-font-family-base);
}

.dark .comparison-grid {
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.3);
}

.grid-header {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 1fr;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
}

.grid-col-feature, .grid-col-billmora, .grid-col-other {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
}

.grid-header .grid-col-feature {
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  justify-content: flex-start;
}

.grid-header .grid-col-billmora, .grid-header .grid-col-other {
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.grid-col-billmora {
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
  border-left: 1px solid var(--vp-c-divider);
  border-right: 1px solid var(--vp-c-divider);
}

.billmora-text-badge {
  color: var(--vp-c-brand-1);
  font-weight: 800;
  font-size: 1.125rem;
}

.grid-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 1fr;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.2s;
}

.grid-row:last-child {
  border-bottom: none;
}

.grid-row:hover {
  background: var(--vp-c-bg-mute);
}

.highlight-row {
  background: color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent);
}

.grid-row .grid-col-feature {
  font-weight: 600;
  color: var(--vp-c-text-2);
  justify-content: flex-start;
}

.grid-row:hover .grid-col-feature {
  color: var(--vp-c-text-1);
}

.grid-row .grid-col-billmora, .grid-row .grid-col-other {
  justify-content: center;
}

.val-text {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.val-free {
  color: var(--vp-c-brand-1);
  font-weight: 800;
}

.val-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.val-yes {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
}

.val-yes svg {
  width: 16px;
  height: 16px;
}

.val-yes-muted {
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-mute);
}

.val-yes-muted svg {
  width: 16px;
  height: 16px;
}

.val-no {
  color: var(--vp-c-text-3);
}

.val-no svg {
  width: 16px;
  height: 16px;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .grid-header, .grid-row {
    grid-template-columns: 1fr 1fr;
  }
  .grid-col-other {
    display: none !important;
  }
  .grid-col-billmora {
    border-right: none;
  }
}

/* ── FAQ ── */
.faq-list {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px -10px color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
}

.faq-item.open {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 2%, var(--vp-c-bg-soft));
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
  user-select: none;
}

.faq-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
}

.faq-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.open .faq-icon-wrapper {
  background: var(--vp-c-brand-1);
  color: white;
}

.faq-item.open .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 1.5rem;
}

.faq-item.open .faq-answer {
  max-height: 300px; /* arbitrary large height */
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.faq-answer p {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

/* ── Sponsors ── */
.sponsors-section {
  padding-bottom: 8rem;
}

.sponsors-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.sponsor-tier {
  width: 100%;
  display: flex;
  justify-content: center;
}

.tier-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.sponsor-empty-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.sponsor-empty-logo:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
}

.sponsor-empty-logo.large {
  width: 100%;
  max-width: 600px;
  height: 120px;
}

.sponsor-empty-logo.medium {
  width: calc(33.333% - 1rem);
  max-width: 250px;
  height: 80px;
}

.sponsor-logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  overflow: hidden;
  padding: 1.5rem;
}

.sponsor-logo-box:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px -5px color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
}

.sponsor-logo-box.large {
  width: 100%;
  max-width: 600px;
  height: 120px;
}

.sponsor-logo-box.medium {
  width: calc(33.333% - 1rem);
  max-width: 250px;
  height: 80px;
}

.sponsor-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

@media (max-width: 640px) {
  .sponsor-empty-logo.medium,
  .sponsor-logo-box.medium {
    width: calc(50% - 0.5rem);
  }
}

.sponsors-cta {
  display: flex;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn svg {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 4px 14px 0 color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent);
}

.btn-secondary {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
</style>
