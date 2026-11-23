const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'public', 'images', 'services');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function svgHeader() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="50%" stop-color="#191919"/>
      <stop offset="100%" stop-color="#0E0E0E"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5CCA0"/>
      <stop offset="50%" stop-color="#C6A66B"/>
      <stop offset="100%" stop-color="#94743C"/>
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C6A66B" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#C6A66B" stop-opacity="0"/>
    </radialGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="20" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#bgGrad)"/>
  <circle cx="800" cy="500" r="550" fill="url(#goldGlow)"/>
  <path d="M0,100 L1600,100 M0,900 L1600,900 M100,0 L100,1000 M1500,0 L1500,1000" stroke="#2A2A2A" stroke-width="1" opacity="0.4"/>
`;
}

// 1. Website Design & Development
const websiteDesignSvg = svgHeader() + `
  <g filter="url(#subtleShadow)">
    <rect x="260" y="180" width="1080" height="640" rx="16" fill="#181818" stroke="#2E2E2E" stroke-width="2"/>
    <rect x="260" y="180" width="1080" height="55" rx="16" fill="#202020"/>
    <circle cx="300" cy="208" r="6" fill="#FF5F56" opacity="0.8"/>
    <circle cx="320" cy="208" r="6" fill="#FFBD2E" opacity="0.8"/>
    <circle cx="340" cy="208" r="6" fill="#27C93F" opacity="0.8"/>
    <rect x="400" y="195" width="460" height="26" rx="6" fill="#141414" stroke="#2A2A2A"/>
    <text x="420" y="212" font-family="monospace" font-size="11" fill="#99958D">https://multicreatives.agency/website-design</text>
    <rect x="310" y="270" width="400" height="240" rx="10" fill="#1F1F1F" stroke="#333333"/>
    <rect x="735" y="270" width="555" height="240" rx="10" fill="#1F1F1F" stroke="#333333"/>
    <rect x="310" y="535" width="980" height="230" rx="10" fill="#161616" stroke="#2A2A2A"/>
    <polyline points="765,450 840,410 920,430 1000,360 1080,380 1160,320 1250,340" fill="none" stroke="url(#goldGrad)" stroke-width="3.5"/>
    <circle cx="1160" cy="320" r="6" fill="#C6A66B"/>
    <text x="350" y="340" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="700" fill="#F5F1E8">WEBSITE ARCHITECTURE</text>
    <text x="350" y="370" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#C6A66B">Sub-second rendering &amp; luxury design</text>
  </g>
</svg>`;

// 2. Web Applications Development
const webAppsSvg = svgHeader() + `
  <g filter="url(#subtleShadow)">
    <rect x="280" y="220" width="280" height="540" rx="12" fill="#1A1A1A" stroke="#C6A66B" stroke-width="2"/>
    <rect x="600" y="220" width="400" height="540" rx="12" fill="#181818" stroke="#2E2E2E" stroke-width="2"/>
    <rect x="1040" y="220" width="280" height="540" rx="12" fill="#1A1A1A" stroke="#2E2E2E" stroke-width="2"/>
    <rect x="310" y="270" width="220" height="36" rx="8" fill="#242424"/>
    <rect x="310" y="325" width="220" height="140" rx="10" fill="#202020" stroke="#333333"/>
    <rect x="310" y="485" width="100" height="30" rx="6" fill="#C6A66B"/>
    <rect x="640" y="270" width="320" height="40" rx="8" fill="#242424"/>
    <rect x="640" y="330" width="150" height="100" rx="8" fill="#202020"/>
    <rect x="810" y="330" width="150" height="100" rx="8" fill="#202020"/>
    <text x="800" y="680" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="16" font-weight="700" fill="#C6A66B" letter-spacing="2">WEB APPLICATION COCKPIT</text>
  </g>
</svg>`;

// 3. Software & Systems Development
const softwareSystemsSvg = svgHeader() + `
  <g filter="url(#subtleShadow)">
    <rect x="300" y="240" width="1000" height="520" rx="16" fill="#171717" stroke="#2E2E2E" stroke-width="2"/>
    <rect x="340" y="280" width="450" height="440" rx="10" fill="#121212" stroke="#282828"/>
    <text x="370" y="330" font-family="monospace" font-size="14" fill="#C6A66B">const systems = new EnterpriseCore({</text>
    <text x="390" y="360" font-family="monospace" font-size="13" fill="#99958D">  architecture: "Microservices",</text>
    <text x="390" y="390" font-family="monospace" font-size="13" fill="#99958D">  resilience: "99.99%",</text>
    <text x="390" y="420" font-family="monospace" font-size="13" fill="#99958D">  security: "Zero-Trust Encrypted"</text>
    <text x="370" y="450" font-family="monospace" font-size="14" fill="#C6A66B">});</text>
    <circle cx="960" cy="360" r="40" fill="#1C1C1C" stroke="#C6A66B" stroke-width="2"/>
    <circle cx="1140" cy="460" r="40" fill="#1C1C1C" stroke="#C6A66B" stroke-width="2"/>
    <circle cx="960" cy="560" r="40" fill="#1C1C1C" stroke="#C6A66B" stroke-width="2"/>
    <line x1="960" y1="400" x2="1140" y2="460" stroke="url(#goldGrad)" stroke-width="2"/>
    <line x1="1140" y1="460" x2="960" y2="560" stroke="url(#goldGrad)" stroke-width="2"/>
  </g>
</svg>`;

// 4. AI & Automation Solutions
const aiAutomationSvg = svgHeader() + `
  <g filter="url(#subtleShadow)">
    <rect x="280" y="200" width="1040" height="600" rx="16" fill="#161616" stroke="#2E2E2E" stroke-width="2"/>
    <circle cx="800" cy="500" r="220" fill="none" stroke="#2A2A2A" stroke-width="1.5"/>
    <circle cx="800" cy="500" r="150" fill="none" stroke="#333333" stroke-width="1.5"/>
    <circle cx="800" cy="500" r="80" fill="none" stroke="#C6A66B" stroke-width="1" stroke-dasharray="4,4"/>
    <circle cx="800" cy="500" r="18" fill="url(#goldGrad)"/>
    <!-- Orbiting AI Nodes -->
    <circle cx="650" cy="500" r="12" fill="#C6A66B"/>
    <circle cx="950" cy="500" r="12" fill="#C6A66B"/>
    <circle cx="800" cy="350" r="12" fill="#C6A66B"/>
    <circle cx="800" cy="650" r="12" fill="#C6A66B"/>
    <line x1="650" y1="500" x2="950" y2="500" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6"/>
    <line x1="800" y1="350" x2="800" y2="650" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6"/>
    <text x="800" y="270" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="18" font-weight="700" fill="#C6A66B" letter-spacing="3">NEURAL AUTOMATION PIPELINE</text>
  </g>
</svg>`;

// 5. Graphic Design
const graphicDesignSvg = svgHeader() + `
  <g filter="url(#subtleShadow)">
    <rect x="340" y="220" width="480" height="560" rx="8" fill="#1C1C1C" stroke="#2E2E2E" stroke-width="2"/>
    <rect x="860" y="220" width="400" height="560" rx="8" fill="#222222" stroke="#2E2E2E" stroke-width="2"/>
    <line x1="820" y1="220" x2="820" y2="780" stroke="#C6A66B" stroke-width="3" opacity="0.7"/>
    <g transform="translate(500, 380) scale(0.6)">
      <rect x="20" y="0" width="36" height="160" rx="18" transform="rotate(45, 38, 80)" fill="url(#goldGrad)"/>
      <rect x="80" y="0" width="36" height="160" rx="18" transform="rotate(45, 98, 80)" fill="url(#goldGrad)"/>
      <polygon points="-20,130 -10,120 0,130 -10,140" fill="url(#goldGrad)"/>
    </g>
    <text x="580" y="570" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="22" font-weight="700" fill="#F5F1E8" letter-spacing="4">MULTI CREATIVES</text>
    <text x="580" y="605" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="500" fill="#C6A66B" letter-spacing="3">GRAPHIC &amp; BRAND DESIGN MANUAL</text>
    <rect x="910" y="290" width="140" height="10" rx="3" fill="#C6A66B" opacity="0.7"/>
    <rect x="910" y="330" width="300" height="6" rx="3" fill="#333333"/>
    <rect x="910" y="350" width="260" height="6" rx="3" fill="#333333"/>
    <rect x="910" y="370" width="280" height="6" rx="3" fill="#333333"/>
    <rect x="910" y="420" width="70" height="70" rx="8" fill="#111111" stroke="#C6A66B" stroke-width="1.5"/>
    <rect x="995" y="420" width="70" height="70" rx="8" fill="#C6A66B"/>
    <rect x="1080" y="420" width="70" height="70" rx="8" fill="#F5F1E8"/>
  </g>
</svg>`;

// 6. Printing Services
const printingServicesSvg = svgHeader() + `
  <g filter="url(#subtleShadow)">
    <polygon points="800,200 1180,360 800,520 420,360" fill="#222222" stroke="#C6A66B" stroke-width="1.5"/>
    <polygon points="420,360 800,520 800,800 420,640" fill="#1A1A1A" stroke="#2E2E2E" stroke-width="1.5"/>
    <polygon points="800,520 1180,360 1180,640 800,800" fill="#161616" stroke="#2E2E2E" stroke-width="1.5"/>
    <polygon points="750,225 850,265 850,500 750,460" fill="url(#goldGrad)" opacity="0.85"/>
    <circle cx="610" cy="500" r="45" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
    <text x="610" y="506" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="12" font-weight="700" fill="#C6A66B" letter-spacing="2">PRINT FINISH</text>
  </g>
</svg>`;

// 7. Promotional Gifts
const promotionalGiftsSvg = svgHeader() + `
  <g filter="url(#subtleShadow)">
    <!-- VIP Gift Box & Artifact Suite -->
    <rect x="340" y="240" width="920" height="520" rx="20" fill="#181818" stroke="#C6A66B" stroke-width="2"/>
    <rect x="380" y="280" width="380" height="440" rx="12" fill="#202020" stroke="#333333"/>
    <circle cx="570" cy="460" r="60" fill="#151515" stroke="url(#goldGrad)" stroke-width="2"/>
    <text x="570" y="466" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="13" font-weight="700" fill="#C6A66B" letter-spacing="3">VIP GIFT</text>
    <!-- Executive Accessories on Right -->
    <rect x="800" y="280" width="420" height="120" rx="10" fill="#222222" stroke="#2E2E2E"/>
    <rect x="800" y="420" width="420" height="130" rx="10" fill="#222222" stroke="#2E2E2E"/>
    <rect x="800" y="570" width="420" height="150" rx="10" fill="#222222" stroke="#2E2E2E"/>
    <text x="1010" y="345" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="14" font-weight="600" fill="#F5F1E8">Executive Metal Accessories</text>
    <text x="1010" y="485" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="14" font-weight="600" fill="#C6A66B">Bespoke Leather Goods</text>
    <text x="1010" y="645" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="14" font-weight="600" fill="#99958D">Custom Event Keepsakes</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(targetDir, 'website-design-development.svg'), websiteDesignSvg);
fs.writeFileSync(path.join(targetDir, 'web-applications-development.svg'), webAppsSvg);
fs.writeFileSync(path.join(targetDir, 'software-systems-development.svg'), softwareSystemsSvg);
fs.writeFileSync(path.join(targetDir, 'ai-automation-solutions.svg'), aiAutomationSvg);
fs.writeFileSync(path.join(targetDir, 'graphic-design.svg'), graphicDesignSvg);
fs.writeFileSync(path.join(targetDir, 'printing-services.svg'), printingServicesSvg);
fs.writeFileSync(path.join(targetDir, 'promotional-gifts.svg'), promotionalGiftsSvg);

console.log('Successfully generated the 7 corrected service visuals!');
