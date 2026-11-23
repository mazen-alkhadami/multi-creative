const http = require('http');

const allUrls = [
  // 12 core static pages
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/blog',
  '/quote-builder',
  '/print-configurator',
  '/request-project',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',

  // 7 services
  '/services/website-design-development',
  '/services/web-applications-development',
  '/services/software-systems-development',
  '/services/ai-automation-solutions',
  '/services/graphic-design',
  '/services/printing-services',
  '/services/promotional-gifts',

  // 6 portfolio
  '/portfolio/sovereign-capital-portal',
  '/portfolio/logistics-workflow-dashboard',
  '/portfolio/core-erp-financial-engine',
  '/portfolio/automated-claims-pipeline',
  '/portfolio/aurum-luxury-identity',
  '/portfolio/obsidian-executive-gifts',

  // 4 blog posts
  '/blog/how-a-professional-website-makes-a-difference-in-business',
  '/blog/artificial-intelligence-and-the-future-of-business',
  '/blog/a-strong-visual-identity-is-more-than-just-a-logo',
  '/blog/printing-and-promotional-gifts-as-brand-memory',

  // PWA & SEO & API
  '/manifest.webmanifest',
  '/sw.js',
  '/robots.txt',
  '/sitemap.xml',
  '/api/assistant',

  // Static assets
  '/images/logo-original.png',
  '/images/logo-gold.png',
  '/images/logo-light.png',
  '/images/logo-dark.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable.png',
  '/icons/apple-touch-icon.png',
  '/images/services/website-design-development.svg',
  '/images/services/web-applications-development.svg',
  '/images/services/software-systems-development.svg',
  '/images/services/ai-automation-solutions.svg',
  '/images/services/graphic-design.svg',
  '/images/services/printing-services.svg',
  '/images/services/promotional-gifts.svg'
];

async function runAudit() {
  console.log(`Starting comprehensive audit of ${allUrls.length} URLs on production build...`);
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const urlPath of allUrls) {
    const isApi = urlPath === '/api/assistant';
    const method = isApi ? 'POST' : 'GET';
    const postData = isApi ? JSON.stringify({ query: 'خدماتكم', lang: 'ar' }) : null;

    await new Promise(resolve => {
      const options = {
        hostname: 'localhost',
        port: 3005,
        path: urlPath,
        method: method,
        headers: isApi ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        } : {}
      };

      const req = http.request(options, res => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            console.log(`[PASS] ${res.statusCode} ${method} ${urlPath} (${res.headers['content-type'] || 'no-type'})`);
            passed++;
          } else {
            console.error(`[FAIL] ${res.statusCode} ${method} ${urlPath}`);
            failures.push({ url: urlPath, code: res.statusCode });
            failed++;
          }
          resolve();
        });
      });

      req.on('error', err => {
        console.error(`[ERR] ${method} ${urlPath}:`, err.message);
        failures.push({ url: urlPath, error: err.message });
        failed++;
        resolve();
      });

      if (postData) req.write(postData);
      req.end();
    });
  }

  console.log('\n=======================================');
  console.log(`Audit Summary: ${passed} Passed, ${failed} Failed out of ${allUrls.length}`);
  if (failures.length > 0) {
    console.log('Failures:', JSON.stringify(failures, null, 2));
  } else {
    console.log('ALL URLS AND ASSETS RETURNED HEALTHY STATUS CODES (200 OK)!');
  }
}

runAudit();
