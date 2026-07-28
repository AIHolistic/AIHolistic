/**
 * ══════════════════════════════════════════════════════════════
 * CLOUDFLARE WORKER HYBRID — AI Holistic & Akomoda Network
 * Solusi Ultimate: Google Sheets Engine + SEO Security Headers + 301 Redirects
 * Versi: 4.0 (Production Ready - Caching, Dynamic SEO, and Multi-Domain Sync)
 * ══════════════════════════════════════════════════════════════
 */

// 1. FUNGSI SANITASI (Mencegah Error XML & HTML Break)
function escapeXml(unsafeStr) {
    if (!unsafeStr) return '';
    return String(unsafeStr).replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// 2. SEO SECURITY HEADERS (Jaminan Keamanan & Trust Signal Google)
function addSEOHeaders(response, customHeaders = {}) {
    const newHeaders = new Headers(response.headers);

    // Ambil security headers bawaan
    newHeaders.set("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    // Set custom headers jika ada tambahan
    for (const [key, value] of Object.entries(customHeaders)) {
        newHeaders.set(key, value);
    }

    // Cache control untuk aset statis atau halaman dinamis
    const url = response.url || "";
    if (url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|webp)$/)) {
        newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
        newHeaders.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const host = request.headers.get("Host") || "";
        const path = decodeURIComponent(url.pathname.replace(/^\/|\/$/g, ''));
        const pathLower = path.toLowerCase();
        const rawPathWithSlash = url.pathname;

        // 3. PERISAI ANTI-LOOP ABSOLUT
        if (request.headers.get("X-Bypass") === "true") {
            return fetch(request);
        }

        // CONFIG: Tentukan di mana file web statis / Cloud Run backend Anda disimpan
        // Default otomatis mengarah ke Google Cloud Run Akomoda Glosarium Digital
        const STATIC_FRONTEND_ORIGIN = env.STATIC_FRONTEND_ORIGIN || "https://ais-pre-mjh7anx7aqhqesbczh25v2-320659909126.asia-southeast1.run.app";

        // 4. ROUTE: REDIRECTS 301
        const REDIRECTS = {
            "/artikel":                         "/pro/",
            "/artikel/":                        "/pro/",
            "/manifesto-bisnis-tanpa-basa-basi":"/pro/bisnis-tanpa-basa-basi.html",
            "/manifesto-bisnis-tanpa-basa-basi/":"/pro/bisnis-tanpa-basa-basi.html",
            "/pro":                             "/pro/",
            "/hire":                            "/pro/#hire",
            "/jv":                              "/pro/#jv",
            "/joint-venture":                   "/pro/#jv",
            "/support":                         "mailto:support@akomodanetwork.com",
            "/backer":                          "https://t.me/jimkoto",
            "/wa":                              "https://t.me/jimkoto",
            "/telegram":                        "https://t.me/jimkoto",
            "/contact":                         "mailto:support@akomodanetwork.com",
        };
        if (REDIRECTS[rawPathWithSlash]) {
            return Response.redirect("https://" + host + REDIRECTS[rawPathWithSlash], 301);
        }

        // 5. ROUTE KHUSUS: LANDING PAGE PENAWARAN ASET (100% Uptime di Edge)
        if (pathLower === "for-sale-read-on-the-sign.html" || pathLower === "for-sale-read-on-the-sign") {
            const htmlOffer = `<!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>A Digital House for Sale (You Can Read It on the Sign) | Premium Asset Acquisition</title>
                <meta name="description" content="Akuisisi domain premium portaltangerangraya.com & kotobatuah.web.id lengkap dengan arsitektur SEO Ekstrem. Menerima Fiat, ZIL Crypto, & Pi Coin. Buka peluang Joint Venture.">
                <meta name="keywords" content="premium domain for sale, beli website media lokal, joint venture digital, web code script full, portaltangerangraya.com, kotobatuah.web.id, Zilliqa crypto payment, Pi Coin payment, web developer hire, koto.biz.id, extreme SEO architecture">
                <meta name="author" content="James Isa (Jim Koto) - Akomoda Network">
                <meta property="og:title" content="A Digital House for Sale (You Can Read It on the Sign)">
                <meta property="og:description" content="Premium domains ready for acquisition. Full source code included. Crypto & Fiat accepted.">
                <meta property="og:type" content="article">
                <style>
                    body {
                        background-color: #f8fafc;
                        font-family: system-ui, -apple-system, sans-serif;
                        line-height: 1.6;
                        color: #1e293b;
                        margin: 0;
                        padding: 0;
                    }
                    article {
                        max-width: 800px;
                        margin: 40px auto;
                        background: #ffffff;
                        padding: 40px;
                        border-radius: 24px;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                        border: 1px solid #f1f5f9;
                    }
                    header {
                        text-align: center;
                        margin-bottom: 40px;
                        border-bottom: 2px solid #f1f5f9;
                        padding-bottom: 30px;
                    }
                    h1 {
                        font-size: clamp(1.8rem, 4vw, 2.5rem);
                        color: #0f172a;
                        margin-bottom: 10px;
                        font-weight: 850;
                        letter-spacing: -0.03em;
                    }
                    h2 {
                        font-size: 1.15rem;
                        color: #64748b;
                        font-weight: 500;
                    }
                    h3 {
                        color: #4f46e5;
                        margin-top: 30px;
                        font-size: 1.3rem;
                    }
                    p {
                        font-size: 1rem;
                        color: #334155;
                        margin-bottom: 20px;
                    }
                    .badge-list {
                        list-style-type: none;
                        padding-left: 0;
                    }
                    .badge-list li {
                        margin-bottom: 15px;
                        background: #fafafa;
                        border: 1px solid #f3f4f6;
                        padding: 15px;
                        border-radius: 12px;
                    }
                    .grid-payments {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 20px;
                        margin-top: 20px;
                    }
                    .payment-card {
                        background: #1e293b;
                        color: #f8fafc;
                        padding: 20px;
                        border-radius: 16px;
                    }
                    a {
                        color: #4f46e5;
                        text-decoration: none;
                        font-weight: 600;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    footer {
                        text-align: center;
                        border-top: 2px solid #f1f5f9;
                        padding-top: 30px;
                        margin-top: 40px;
                        font-size: 0.9rem;
                        color: #64748b;
                    }
                </style>
            </head>
            <body>
                <article>
                    <header>
                        <h1>"A House for Sale, You Can Read It on the Sign"</h1>
                        <h2>Premium Digital Asset Acquisition & Joint Venture Opportunities</h2>
                    </header>

                    <section>
                        <p><strong>[ID]</strong> Memasuki fase baru dalam konsolidasi ekosistem digital, kami membuka peluang emas bagi investor, agensi, maupun developer untuk mengakuisisi aset digital premium kami atau menjalin kemitraan strategis (Joint Venture).</p>
                        <p style="font-style: italic; color: #64748b;"><strong>[EN]</strong> Entering a new phase of digital ecosystem consolidation, we are opening golden opportunities for investors, agencies, and developers to acquire our premium digital assets or establish a strategic Joint Venture.</p>
                    </section>

                    <section style="background: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0;">
                        <h3 style="color: #4f46e5; margin-top: 0;">🌐 Premium Domains on the Market</h3>
                        <ul class="badge-list">
                            <li>
                                <strong style="color: #0f172a; font-size: 1.1rem;">1. portaltangerangraya.com</strong><br>
                                <span style="font-size: 0.9rem; color: #475569;">Aset bernilai tinggi untuk jaringan media lokal, portal berita komprehensif, atau strategi penetrasi SEO regional. <em style="color: #64748b;">(High-value asset for local media networks, news portals, or regional SEO penetration strategies).</em></span>
                            </li>
                            <li style="margin-bottom: 0;">
                                <strong style="color: #0f172a; font-size: 1.1rem;">2. kotobatuah.web.id</strong><br>
                                <span style="font-size: 0.9rem; color: #475569;">Identitas premium berkarakter kuat untuk portofolio perusahaan, yayasan, atau entitas bisnis dengan nilai historis. <em style="color: #64748b;">(Premium identity with strong character for corporate portfolios, foundations, or historical business entities).</em></span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3>💼 What's Included (Value Proposition)</h3>
                        <p><strong>[ID]</strong> Setiap akuisisi tidak hanya berupa nama domain, tetapi didukung penuh dengan infrastruktur <em>Extreme SEO</em>:</p>
                        <ul style="padding-left: 20px; color: #334155;">
                            <li><strong>Full Script Code & Web Theme:</strong> Kepemilikan penuh atas kode sumber yang telah dioptimasi.</li>
                            <li><strong>Serverless Architecture Ready:</strong> Kompatibel penuh untuk <em>deploy</em> via Cloudflare Workers & D1/Google Sheets database.</li>
                            <li><strong>100% Responsive Design:</strong> Tampilan sempurna di berbagai OS, Desktop, PC, Tablet, dan Mobile (Mobile-first indexing).</li>
                            <li><strong>Zero-Downtime Blueprint:</strong> Skema arsitektur tahan banting terhadap lonjakan trafik.</li>
                        </ul>
                    </section>

                    <section style="border-left: 4px solid #4f46e5; padding-left: 20px; margin: 30px 0;">
                        <h3 style="color: #0f172a; margin-top: 0;">🤝 Hire Us or Joint Venture (JV)</h3>
                        <p>Selain akuisisi penuh, kami terbuka untuk kolaborasi strategis atau dukungan teknis lanjutan untuk mengelola aset ini.</p>
                        <p style="font-size: 1.1rem; margin-bottom: 0;">👉 <strong>Submit your proposal at: <a href="https://jimkoto.my.id/pro">https://jimkoto.my.id/pro</a></strong></p>
                    </section>

                    <section class="grid-payments">
                        <div class="payment-card">
                            <strong style="color: #10b981; font-size: 1.1rem; display: block; margin-bottom: 10px;">1. Cryptocurrency</strong>
                            <ul style="padding-left: 20px; font-size: 0.85rem; margin: 0; color: #cbd5e1;">
                                <li><strong>Zilliqa (ZIL):</strong> <code style="word-break: break-all; color: #38bdf8;">zil1a7zrg6qwx99d0lvlshqq6jzstwa3fxhs9efdl0</code></li>
                                <li><strong>Pi Network:</strong> Coin PI Accepted</li>
                            </ul>
                        </div>
                        <div class="payment-card" style="background: #0f172a;">
                            <strong style="color: #38bdf8; font-size: 1.1rem; display: block; margin-bottom: 10px;">2. Fiat Money</strong>
                            <ul style="padding-left: 20px; font-size: 0.85rem; margin: 0; color: #cbd5e1;">
                                <li>Indonesian Rupiah (IDR) via Bank Transfer or QRIS</li>
                                <li>US Dollar (USD) via International Transfer</li>
                            </ul>
                        </div>
                    </section>

                    <footer>
                        <p style="margin-bottom: 5px;">Contact for Inquiries & Negotiations:</p>
                        <p style="font-size: 1.1rem; font-weight: 700; margin-top: 5px;">
                            ✉️ <a href="mailto:akomodanetwork@gmail.com">akomodanetwork@gmail.com</a><br>
                            ✉️ <a href="mailto:whoami@aiholistic.xyz">whoami@aiholistic.xyz</a>
                        </p>
                        <p style="margin-top: 30px; font-size: 0.75rem; color: #94a3b8;">
                            Developed and Maintained by <strong>Akomoda Network</strong>.
                        </p>
                    </footer>
                </article>
            </body>
            </html>`;
            
            const responseOffer = new Response(htmlOffer, {
                status: 200,
                headers: { "Content-Type": "text/html;charset=UTF-8" }
            });
            return addSEOHeaders(responseOffer);
        }

        // 6. DEBUGGER DATABASE GOOGLE SHEETS
        if (pathLower === "debug-db") {
            if (!env.SHEET_ID || !env.API_KEY) {
                return new Response(JSON.stringify({ status: "GAGAL", pesan: "Keys belum di-input di Environment Variables Cloudflare!" }, null, 2), { headers: { "Content-Type": "application/json" } });
            }
            try {
                const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEET_ID}/values/PROD_ENGINE?key=${env.API_KEY}`;
                const testRes = await fetch(testUrl);
                const data = await testRes.json();
                return new Response(JSON.stringify({ status: "SUKSES", nama_tab: "PROD_ENGINE", jumlah_baris: data.values ? data.values.length : 0 }, null, 2), { headers: { "Content-Type": "application/json" } });
            } catch (e) {
                return new Response("Error: " + e.message, { status: 500 });
            }
        }

        // 7. BYPASS FILE STATIS (Jangan ganggu jalurnya gambar/css/js)
        const staticExtensions = [".css", ".js", ".json", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".webp"];
        if (request.method !== "GET" || staticExtensions.some(ext => pathLower.endsWith(ext))) {
            const response = await fetch(request);
            return addSEOHeaders(response);
        }

        const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Content-Type": "application/json" };
        if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

        // 8. API REDIRECT CONTACT OFFICIAL (Identitas Hubungan Bisnis Akomoda Network)
        if ((host.includes("api.aiholistic.xyz") || host.includes("gate.akomodanetwork.com")) && path === "") {
            return Response.redirect("https://t.me/jimkoto", 302);
        }

        // 9. ENGINE PARSING GOOGLE SHEETS DENGAN CLOUDFLARE CACHE (Super Cepat & Anti-Limit)
        async function getDynamicDatabase() {
            if (!env.SHEET_ID || !env.API_KEY) return [];
            
            const cache = caches.default;
            const cacheKey = new Request(`https://${host}/__internal_db_cache`, request);
            let cachedResponse = await cache.match(cacheKey);

            if (!cachedResponse) {
                try {
                    const [coreRes, prodRes] = await Promise.all([
                        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.SHEET_ID}/values/CORE_ENGINE?key=${env.API_KEY}`),
                        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.SHEET_ID}/values/PROD_ENGINE?key=${env.API_KEY}`)
                    ]);

                    const parseData = await Promise.all([
                        coreRes.ok ? coreRes.json() : { values: [] },
                        prodRes.ok ? prodRes.json() : { values: [] }
                    ]);

                    let combinedData = [];

                    parseData.forEach(data => {
                        if (data.values && data.values.length > 0) {
                            const headers = data.values[0].map(h => h.toUpperCase().trim());
                            const rows = data.values.slice(1).map(row => {
                                let obj = {};
                                const getVal = (possibleHeaders) => {
                                    for (let hName of possibleHeaders) {
                                        const idx = headers.findIndex(h => h === hName || h.includes(hName));
                                        if (idx !== -1 && row[idx] !== undefined) return row[idx];
                                    }
                                    return "";
                                };
                                obj.slug = getVal(["SLUG", "URL"]);
                                obj.title = getVal(["TITLE", "JUDUL", "NAMA"]);
                                obj.content = getVal(["CONTENT", "BODY", "ARTIKEL"]);
                                obj.image = getVal(["IMAGE", "GAMBAR", "FOTO"]);
                                obj.desc = getVal(["DESC", "SUMMARY"]);
                                obj.kategori = getVal(["KATEGORI", "LABEL"]);
                                obj.domain = getVal(["DOMAIN", "HOST"]);
                                return obj;
                            });
                            combinedData = combinedData.concat(rows.filter(r => r.slug && r.title));
                        }
                    });

                    cachedResponse = new Response(JSON.stringify(combinedData), {
                        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" } 
                    });
                    
                    ctx.waitUntil(cache.put(cacheKey, cachedResponse.clone()));
                } catch (e) { 
                    return []; 
                }
            }
            
            try {
                return await cachedResponse.json();
            } catch (err) {
                return [];
            }
        }

        const rawData = await getDynamicDatabase();
        const tenantData = rawData.filter(row => {
            const domainVal = (row.domain || "").toLowerCase().trim();
            return domainVal === "" || domainVal === "all" || host.includes(domainVal);
        });

        if (url.pathname === "/get-data" || url.pathname === "/api/get-data") {
            const dataResponse = new Response(JSON.stringify(tenantData), { headers: corsHeaders });
            dataResponse.headers.set("Cache-Control", "public, max-age=300");
            return dataResponse;
        }

        // 10. ROBOTS.TXT (Gabungan Proteksi AI Crawler)
        if (url.pathname === "/robots.txt") {
            const robotsData = `Sitemap: https://${host}/sitemap.xml\n\nUser-agent: *\nContent-Signal: search=yes,ai-train=no\nAllow: /\nDisallow: /admin/\nDisallow: /private/\nDisallow: /.env\nDisallow: /config/\nCrawl-delay: 1\n\nUser-agent: Amazonbot\nDisallow: /\nUser-agent: Applebot-Extended\nDisallow: /\nUser-agent: Bytespider\nDisallow: /\nUser-agent: CCBot\nDisallow: /\nUser-agent: ClaudeBot\nDisallow: /\nUser-agent: CloudflareBrowserRenderingCrawler\nDisallow: /\nUser-agent: Google-Extended\nDisallow: /\nUser-agent: GPTBot\nDisallow: /\nUser-agent: meta-externalagent\nDisallow: /`;
            return new Response(robotsData, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
        }

        // 11. SITEMAP.XML DINAMIS (Dibuat otomatis dari baris Google Sheets Anda)
        if (url.pathname === "/sitemap.xml") {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
            tenantData.forEach(r => {
                if (r.slug && !r.slug.startsWith('http') && r.slug !== "/") {
                    xml += `  <url>\n    <loc>https://${host}/${escapeXml(r.slug.replace(/^\/|\/$/g, ''))}</loc>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
                }
            });
            xml += `  <url>\n    <loc>https://${host}/</loc>\n    <changefreq>daily</changefreq>\n  </url>\n</urlset>`;
            
            return new Response(xml, { 
                headers: { 
                    "Content-Type": "application/xml; charset=utf-8",
                    "Cache-Control": "public, max-age=3600" 
                } 
            });
        }

        // 12. INJEKSI SEO & FIX SCRIPT BOCOR (Menangkap Meta-data dari Google Sheets untuk Sosmed)
        if (path !== "") {
            const artikel = tenantData.find(r => (r.slug || "").replace(/^\/|\/$/g, '').toLowerCase() === pathLower);
            if (artikel) {
                try {
                    let baseHtmlUrl = `https://${host}/`;
                    if (STATIC_FRONTEND_ORIGIN) {
                        baseHtmlUrl = STATIC_FRONTEND_ORIGIN.endsWith('/') ? STATIC_FRONTEND_ORIGIN : `${STATIC_FRONTEND_ORIGIN}/`;
                    }
                    const baseReq = new Request(baseHtmlUrl, { headers: { "X-Bypass": "true", "Accept": "text/html" } });
                    const baseRes = await fetch(baseReq);
                    let html = await baseRes.text();
                    
                    const title = artikel.title || host;
                    const cleanDesc = (artikel.desc || artikel.content || '').replace(/(<([^>]+)>)/gi, "").substring(0, 150).replace(/"/g, '') + '...';
                    
                    let finalImageUrl = artikel.image || `https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200`;
                    if (finalImageUrl.includes("drive.google.com")) {
                        const match = finalImageUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{25,})/);
                        if (match) finalImageUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                    }
                    artikel.finalImage = finalImageUrl; 

                    const safeJsonData = JSON.stringify(artikel).replace(/</g, '\\u003c');

                    const seoBlock = `
                        <title>${escapeXml(title)} | ${host}</title>
                        <meta name="description" content="${escapeXml(cleanDesc)}">
                        <meta property="og:title" content="${escapeXml(title)} | ${host}">
                        <meta property="og:description" content="${escapeXml(cleanDesc)}">
                        <meta property="og:image" content="${escapeXml(finalImageUrl)}">
                        <meta property="og:url" content="https://${host}/${escapeXml(path)}">
                        <meta property="og:type" content="article">
                        <meta name="twitter:card" content="summary_large_image">
                        <meta name="twitter:image" content="${escapeXml(finalImageUrl)}">
                        <script>window.__SHEET_DATA__ = ${safeJsonData};</script>
                    `;

                    html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '');
                    html = html.replace('</head>', `${seoBlock}\n</head>`);

                    const finalResponse = new Response(html, { headers: { "Content-Type": "text/html" } });
                    return addSEOHeaders(finalResponse);
                } catch (err) {
                    const response = await fetch(request);
                    return addSEOHeaders(response);
                }
            }
        }

        // 13. AUTO-INDEX RESOLVER & PROXY BACKEND (Solusi Reverse Proxy Tanpa Redirect)
        let finalOriginUrl = new URL(request.url);
        let targetHost = "ais-pre-mjh7anx7aqhqesbczh25v2-320659909126.asia-southeast1.run.app";
        if (STATIC_FRONTEND_ORIGIN) {
            const sOrigin = new URL(STATIC_FRONTEND_ORIGIN);
            targetHost = sOrigin.host;
            finalOriginUrl.protocol = sOrigin.protocol;
            finalOriginUrl.host = sOrigin.host;
            
            // Jika STATIC_FRONTEND_ORIGIN memiliki subfolder (seperti /kosakata), gabungkan path-nya secara otomatis
            if (sOrigin.pathname !== '/' && sOrigin.pathname !== '') {
                const subfolder = sOrigin.pathname.replace(/^\/|\/$/g, '');
                if (!finalOriginUrl.pathname.startsWith('/' + subfolder)) {
                    // Pastikan pathname tidak ganda
                    finalOriginUrl.pathname = '/' + subfolder + (finalOriginUrl.pathname === '/' ? '/' : finalOriginUrl.pathname);
                }
            }
        }

        try {
            // Header proxy untuk dikirimkan ke Cloud Run backend
            const proxyHeaders = new Headers(request.headers);
            proxyHeaders.set("Host", targetHost);
            proxyHeaders.set("X-Forwarded-Host", host);
            proxyHeaders.set("X-Forwarded-Proto", "https");

            const proxyReq = new Request(finalOriginUrl.toString(), {
                method: request.method,
                headers: proxyHeaders,
                body: (request.method !== 'GET' && request.method !== 'HEAD') ? request.body : null,
                redirect: 'manual'
            });

            let response = await fetch(proxyReq);

            // Salin header response untuk dimodifikasi
            const newHeaders = new Headers(response.headers);

            // Jika backend memberikan 301/302 Redirect, ganti Location header agar tetap di domain utama
            const locationHeader = newHeaders.get("Location") || newHeaders.get("location");
            if (locationHeader && locationHeader.includes(targetHost)) {
                newHeaders.set("Location", locationHeader.replaceAll(targetHost, host));
            }

            // Jika response berupa HTML/JS/JSON, ubah teks yang mengarah ke ais-pre Cloud Run menjadi domain utama
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("text/html") || contentType.includes("application/javascript") || contentType.includes("application/json")) {
                let text = await response.text();
                text = text.replaceAll(targetHost, host);
                newHeaders.delete("content-length");
                const modifiedResponse = new Response(text, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
                return addSEOHeaders(modifiedResponse);
            }

            const modifiedResponse = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders
            });
            return addSEOHeaders(modifiedResponse);
        } catch (err) {
            return new Response("Ekosistem Utama Sedang Mengudara. Silakan Coba Beberapa Saat Lagi.", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
        }
    }
};
