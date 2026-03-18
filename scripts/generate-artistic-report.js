const fs = require('fs');
const path = require('path');

const RESULTS_FILE = 'test-results.json';
const OUTPUT_DIR = 'reports';
const ATTACHMENTS_DIR = path.join(OUTPUT_DIR, 'attachments');

// Ensure output directories exist
if (!fs.existsSync(ATTACHMENTS_DIR)) {
    fs.mkdirSync(ATTACHMENTS_DIR, { recursive: true });
}

if (!fs.existsSync(RESULTS_FILE)) {
    console.error(`Error: ${RESULTS_FILE} not found. Run tests first.`);
    process.exit(1);
}

const rawData = fs.readFileSync(RESULTS_FILE);
const results = JSON.parse(rawData);

// Aggregate Statistics
let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;
let durationMs = 0;

const testDetails = [];

results.suites.forEach(suite => processSuite(suite));

function processSuite(suite) {
    if (suite.suites) suite.suites.forEach(s => processSuite(s));
    if (suite.specs) {
        suite.specs.forEach(spec => {
            spec.tests.forEach(test => {
                total++;
                const result = test.results[0]; // Take the first execution result
                durationMs += result.duration;

                let status = result.status;
                if (status === 'passed') passed++;
                else if (status === 'failed' || status === 'timedOut') failed++;
                else if (status === 'skipped') skipped++;

                // Collect attachments (screenshots/videos)
                const attachments = [];
                if (result.attachments) {
                    result.attachments.forEach(att => {
                        const ext = path.extname(att.path);
                        const fileName = `${spec.id || 'test'}_${Date.now()}${ext}`;
                        const destPath = path.join(ATTACHMENTS_DIR, fileName);
                        
                        try {
                            fs.copyFileSync(att.path, destPath);
                            attachments.push({
                                name: att.name,
                                contentType: att.contentType,
                                path: `attachments/${fileName}`
                            });
                        } catch (e) {
                            console.warn(`Could not copy attachment: ${att.path}`);
                        }
                    });
                }

                testDetails.push({
                    title: spec.title,
                    module: path.basename(suite.file || 'Unknown').replace('.spec.ts', ''),
                    status: status,
                    duration: (result.duration / 1000).toFixed(2) + 's',
                    error: result.error ? result.error.message : null,
                    attachments: attachments
                });
            });
        });
    }
}

// Group by Module
const groupedModules = {};
testDetails.forEach(test => {
    if (!groupedModules[test.module]) {
        groupedModules[test.module] = [];
    }
    groupedModules[test.module].push(test);
});

const durationSec = (durationMs / 1000).toFixed(1) + 's';
const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

// Generate HTML Content
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ParaBank | Test Intelligence Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary: #6366f1;
            --primary-light: #818cf8;
            --success: #10b981;
            --danger: #f43f5e;
            --warning: #f59e0b;
            --info: #3b82f6;
            --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            --glass-bg: rgba(255, 255, 255, 0.75);
            --glass-border: rgba(255, 255, 255, 0.5);
            --text-main: #0f172a;
            --text-muted: #64748b;
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Outfit', sans-serif; }
        body { background: var(--bg-gradient); background-attachment: fixed; color: var(--text-main); min-height: 100vh; padding: 1.5rem; display: flex; justify-content: center; overflow-x: hidden; }
        .dashboard { width: 100%; max-width: 1100px; display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.8s ease-out; padding-bottom: 5rem; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .glass-card { background: var(--glass-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--glass-border); border-radius: 1.5rem; box-shadow: var(--shadow-lg); padding: 2rem; }
        
        header { display: flex; flex-direction: column; gap: 1rem; text-align: center; }
        @media (min-width: 768px) { header { flex-direction: row; justify-content: space-between; align-items: flex-end; text-align: left; } }
        .brand h1 { font-size: 2.5rem; font-weight: 700; background: linear-gradient(to right, var(--primary), var(--info)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.05em; }
        .brand p { color: var(--text-muted); font-size: 1.125rem; }
        .meta h2 { font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; }
        .meta p { font-weight: 600; color: var(--primary); }

        .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (min-width: 992px) { .metrics { grid-template-columns: repeat(5, 1fr); } }
        .metric-item { display: flex; flex-direction: column; gap: 0.25rem; padding: 1.25rem; border-radius: 1.25rem; background: rgba(255, 255, 255, 0.4); border: 1px solid var(--glass-border); text-align: center; }
        .metric-label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
        .metric-value { font-size: 1.75rem; font-weight: 700; }
        .metric-value.success { color: var(--success); }
        .metric-value.danger { color: var(--danger); }
        .metric-value.warning { color: var(--warning); }

        .main-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 992px) { .main-layout { grid-template-columns: 350px 1fr; } }

        .chart-box { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .chart-wrapper { position: relative; width: 100%; max-width: 250px; }
        .chart-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        .chart-label span { display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
        .chart-label strong { font-size: 1.5rem; font-weight: 700; }

        .highlights { display: flex; flex-direction: column; gap: 1rem; }
        .highlight-card { display: flex; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.4); border: 1px solid var(--glass-border); border-radius: 1rem; }
        .icon-box { width: 32px; height: 32px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .icon-box.danger { background: #fee2e2; color: var(--danger); }
        .icon-box.warning { background: #fef3c7; color: var(--warning); }
        .icon-box.success { background: #d1fae5; color: var(--success); }
        .info-box h4 { font-size: 0.9rem; font-weight: 700; }
        .info-box p { font-size: 0.8rem; color: var(--text-muted); }

        .btn-toggle { width: 100%; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 1rem; font-weight: 600; cursor: pointer; margin-top: 1rem; box-shadow: var(--shadow-lg); transition: background 0.2s; }
        .btn-toggle:hover { background: var(--primary-light); }
        
        .details-wrapper { display: none; margin-top: 1rem; }
        .details-wrapper.open { display: block; }
        
        .module-section { margin-top: 2rem; }
        .module-header { font-size: 1.1rem; font-weight: 700; color: var(--primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
        .module-header::before { content: ''; display: inline-block; width: 4px; height: 18px; background: var(--primary); border-radius: 2px; }

        .table-container { width: 100%; overflow-x: auto; border-radius: 1rem; border: 1px solid var(--glass-border); background: rgba(255, 255, 255, 0.1); margin-bottom: 1.5rem; }
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        th { background: rgba(255, 255, 255, 0.4); padding: 1rem; text-align: left; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--glass-border); }
        td { padding: 1rem; font-size: 0.85rem; border-bottom: 1px solid var(--glass-border); vertical-align: top; background: rgba(255, 255, 255, 0.05); }
        tr:last-child td { border-bottom: none; }
        
        .badge { padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; display: inline-block; }
        .badge.passed { background: #d1fae5; color: var(--success); }
        .badge.failed { background: #fee2e2; color: var(--danger); }
        .badge.skipped { background: #fef3c7; color: var(--warning); }

        .media-container { display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; }
        .media-item { cursor: pointer; border-radius: 0.5rem; border: 1px solid var(--glass-border); padding: 0.3rem 0.6rem; background: white; font-size: 0.75rem; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s; }
        .media-item:hover { background: #f1f5f9; }
        
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); justify-content: center; align-items: center; padding: 1rem; }
        .modal-content { max-width: 100%; max-height: 85vh; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.1); }
        .close-modal { position: absolute; top: 20px; right: 30px; color: white; font-size: 40px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
        .close-modal:hover { opacity: 1; }
        
        @media (max-width: 600px) {
            .metric-value { font-size: 1.4rem; }
            .brand h1 { font-size: 2rem; }
            .glass-card { padding: 1.25rem; }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <header class="glass-card">
            <div class="brand">
                <h1>ParaBank Intelligence</h1>
                <p>Categorized Test Automation Insights</p>
            </div>
            <div class="meta">
                <h2>Execution Data</h2>
                <p id="timestamp">${new Date().toLocaleString()}</p>
            </div>
        </header>

        <div class="metrics glass-card">
            <div class="metric-item"><span class="metric-label">Total</span><span class="metric-value">${total}</span></div>
            <div class="metric-item"><span class="metric-label">Passed</span><span class="metric-value success">${passed}</span></div>
            <div class="metric-item"><span class="metric-label">Failed</span><span class="metric-value danger">${failed}</span></div>
            <div class="metric-item"><span class="metric-label">Skipped</span><span class="metric-value warning">${skipped}</span></div>
            <div class="metric-item"><span class="metric-label">Duration</span><span class="metric-value">${durationSec}</span></div>
        </div>

        <div class="main-layout">
            <div class="glass-card chart-box">
                <div class="chart-wrapper">
                    <canvas id="statusChart"></canvas>
                    <div class="chart-label"><span>Pass Rate</span><strong>${passRate}%</strong></div>
                </div>
            </div>

            <div class="glass-card content-box">
                <h3>🔍 Execution Summary</h3>
                <div class="highlights">
                    ${failed > 0 ? `
                        <div class="highlight-card">
                            <div class="icon-box danger">⚠️</div>
                            <div class="info-box"><h4>Critical Defects</h4><p>${failed} test failures detected. Check module-wise details below.</p></div>
                        </div>
                    ` : `
                        <div class="highlight-card">
                            <div class="icon-box success">✨</div>
                            <div class="info-box"><h4>High Integrity Run</h4><p>All test modules passed within expected performance thresholds.</p></div>
                        </div>
                    `}
                </div>
            </div>
        </div>

        <div>
            <button class="btn-toggle" onclick="toggleDetails()" id="toggleBtn">View Module Detailed Analysis</button>
            <div class="details-wrapper" id="detailsWrapper">
                ${Object.keys(groupedModules).map(moduleName => `
                    <div class="module-section">
                        <div class="module-header">${moduleName}</div>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 45%;">Test Spec</th>
                                        <th style="width: 35%;">Result / Media</th>
                                        <th style="width: 20%;">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${groupedModules[moduleName].map(test => `
                                        <tr>
                                            <td><strong>${test.title}</strong>${test.error ? `<br><small style="color:var(--danger); display:block; margin-top:4px;">${test.error.split('\n')[0]}</small>` : ''}</td>
                                            <td>
                                                <span class="badge ${test.status}">${test.status}</span>
                                                ${test.attachments.length > 0 ? `
                                                    <div class="media-container">
                                                        ${test.attachments.map(att => `
                                                            <div class="media-item" onclick="openMedia('${att.path}', '${att.contentType}')">
                                                                ${att.contentType.includes('image') ? '🖼️' : '🎥'} ${att.name || (att.contentType.includes('image') ? 'Screenshot' : 'Video')}
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                ` : ''}
                                            </td>
                                            <td>${test.duration}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <div id="mediaModal" class="modal" onclick="closeMedia()">
        <span class="close-modal">&times;</span>
        <div id="modalBody"></div>
    </div>

    <script>
        const ctx = document.getElementById('statusChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pass', 'Fail', 'Skip'],
                datasets: [{
                    data: [${passed}, ${failed}, ${skipped}],
                    backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '82%',
                plugins: { legend: { display: false } }
            }
        });

        function toggleDetails() {
            const wrapper = document.getElementById('detailsWrapper');
            const btn = document.getElementById('toggleBtn');
            const isOpen = wrapper.classList.toggle('open');
            btn.textContent = isOpen ? 'Hide Module Detailed Analysis' : 'View Module Detailed Analysis';
            
            // Fix for scrolling: scroll to the revealed section
            if(isOpen) {
               window.scrollTo({ top: btn.offsetTop - 20, behavior: 'smooth' });
            }
        }

        function openMedia(path, type) {
            const modal = document.getElementById('mediaModal');
            const body = document.getElementById('modalBody');
            body.innerHTML = type.includes('image') 
                ? \`<img src="\${path}" class="modal-content">\`
                : \`<video src="\${path}" controls autoplay class="modal-content"></video>\`;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Stop background scroll
        }

        function closeMedia() {
            document.getElementById('mediaModal').style.display = 'none';
            document.getElementById('modalBody').innerHTML = '';
            document.body.style.overflow = ''; // Resume background scroll
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), htmlContent);
console.log('✅ artistic Report Generated at reports/index.html');
