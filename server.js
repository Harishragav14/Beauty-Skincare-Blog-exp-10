const http = require('http');

const PORT = 3000;

const styles = `
  * { box-sizing: border-box; }
  :root { --ink:#302b2b; --muted:#817777; --rose:#b96f79; --rose-dark:#94545f; --cream:#fbf7f2; --line:#eadfd9; --sage:#a7ad96; }
  body { margin:0; color:var(--ink); background:var(--cream); font-family: Georgia, 'Times New Roman', serif; }
  a { color:inherit; text-decoration:none; }
  .announcement { background:#ead6d0; text-align:center; padding:9px 16px; font:11px Arial,sans-serif; letter-spacing:2px; text-transform:uppercase; color:#694d4b; }
  header { background:rgba(251,247,242,.96); border-bottom:1px solid var(--line); }
  .nav { max-width:1180px; margin:auto; padding:22px 28px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
  .brand { font-size:25px; letter-spacing:2px; font-weight:bold; white-space:nowrap; }
  .brand span { color:var(--rose); font-style:italic; }
  nav { display:flex; gap:30px; align-items:center; font:11px Arial,sans-serif; letter-spacing:1.6px; text-transform:uppercase; }
  nav a { color:#645b58; transition:color .2s; } nav a:hover { color:var(--rose-dark); }
  .nav-cta { border:1px solid #c58b8e; padding:11px 16px; color:var(--rose-dark); }
  .hero { max-width:1180px; margin:34px auto 70px; padding:0 28px; display:grid; grid-template-columns:1.02fr .98fr; min-height:470px; background:#f0e6df; }
  .hero-copy { padding:72px 55px 62px 58px; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; }
  .eyebrow { font:10px Arial,sans-serif; letter-spacing:3px; text-transform:uppercase; color:var(--rose-dark); }
  h1 { font-size:clamp(42px,5vw,66px); line-height:1.04; font-weight:normal; margin:22px 0 18px; letter-spacing:-1.5px; }
  h1 em { color:var(--rose); }
  .hero-copy p { max-width:420px; color:#716765; font:14px/1.9 Arial,sans-serif; margin:0 0 28px; }
  .button { display:inline-block; background:var(--rose); color:white; padding:15px 23px; font:10px Arial,sans-serif; letter-spacing:2px; text-transform:uppercase; }
  .hero-art { min-height:470px; position:relative; overflow:hidden; background:linear-gradient(145deg,#d6b9ae,#eee0d7 52%,#c9b9a7); display:flex; align-items:center; justify-content:center; }
  .sun { position:absolute; width:310px; height:310px; border-radius:50%; background:#f7e9d9; top:50px; right:65px; opacity:.8; }
  .bottle { position:absolute; bottom:58px; width:145px; height:255px; border-radius:25px 25px 18px 18px; background:linear-gradient(90deg,#b5a08c,#eee0c9 40%,#b6a28f); box-shadow:20px 24px 35px #705d5040; transform:rotate(-7deg); display:flex; justify-content:center; align-items:center; }
  .bottle:before { content:''; position:absolute; top:-38px; width:58px; height:42px; border-radius:8px 8px 2px 2px; background:#8b796b; }
  .bottle-label { background:#f8f0e6; width:100px; padding:18px 7px; text-align:center; color:#79675d; font:9px Arial,sans-serif; letter-spacing:2px; line-height:1.8; }
  .leaf { position:absolute; width:115px; height:220px; border-radius:100% 0 100% 0; background:linear-gradient(130deg,#7f8b70,#c1c3a5); opacity:.85; transform:rotate(35deg); left:45px; bottom:30px; }
  .leaf.two { left:auto; right:25px; bottom:5px; transform:rotate(-35deg) scale(.8); }
  .hero-note { position:absolute; bottom:22px; right:25px; color:#fffaf4; font:10px Arial,sans-serif; letter-spacing:2px; text-transform:uppercase; }
  .section { max-width:1180px; margin:0 auto 76px; padding:0 28px; }
  .section-head { text-align:center; margin-bottom:34px; }
  .section-head h2 { font-weight:normal; font-size:37px; margin:12px 0 10px; }
  .section-head p { color:var(--muted); font:13px/1.7 Arial,sans-serif; margin:0; }
  .features { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  .feature { background:#fffdfa; border:1px solid var(--line); }
  .feature-art { height:190px; display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden; }
  .feature-art.one { background:#eadbd4; } .feature-art.two { background:#e5e6d9; } .feature-art.three { background:#e8d9d5; }
  .orb { width:125px; height:125px; border-radius:50%; background:radial-gradient(circle at 35% 30%,#fff8ed,#cba99a); box-shadow:15px 18px 28px #6d554522; }
  .feature-art.two .orb { background:radial-gradient(circle at 35% 30%,#f8f5e9,#a9b095); }
  .feature-art.three .orb { background:radial-gradient(circle at 35% 30%,#fff4eb,#c18d91); }
  .feature-body { padding:23px 24px 26px; }
  .tag { color:var(--rose-dark); font:9px Arial,sans-serif; letter-spacing:2px; text-transform:uppercase; }
  .feature h3 { font-size:22px; font-weight:normal; margin:11px 0 9px; }
  .feature p { color:var(--muted); font:12px/1.8 Arial,sans-serif; margin:0 0 18px; }
  .read { color:var(--rose-dark); font:10px Arial,sans-serif; letter-spacing:1.5px; text-transform:uppercase; border-bottom:1px solid #c58b8e; padding-bottom:4px; }
  .quote { background:#e9ddd5; padding:54px 25px; text-align:center; margin-bottom:70px; }
  .quote blockquote { max-width:700px; margin:0 auto 15px; font-size:30px; line-height:1.35; font-style:italic; color:#554744; }
  .quote small { font:10px Arial,sans-serif; letter-spacing:2px; color:#8a6a66; text-transform:uppercase; }
  .newsletter { max-width:760px; margin:0 auto 75px; padding:0 28px; text-align:center; }
  .newsletter h2 { font-size:34px; font-weight:normal; margin:10px 0; }
  .newsletter p { color:var(--muted); font:13px/1.8 Arial,sans-serif; }
  .newsletter-form { display:flex; max-width:490px; margin:24px auto 0; }
  .newsletter-form input { flex:1; min-width:0; border:1px solid var(--line); background:#fffdfa; padding:15px; font:12px Arial,sans-serif; outline:none; }
  .newsletter-form button { border:0; background:var(--rose); color:white; padding:0 20px; font:10px Arial,sans-serif; letter-spacing:1px; text-transform:uppercase; cursor:pointer; }
  footer { background:#393331; color:#f8eee8; padding:35px 28px; text-align:center; }
  footer .brand { font-size:20px; } footer p { color:#c7b8b1; font:10px Arial,sans-serif; letter-spacing:1px; margin:13px 0 0; }
  .server-info { max-width:1180px; margin:0 auto 35px; padding:0 28px; }
  .server-info-inner { border:1px dashed #c9b5ad; background:#fffaf6; padding:17px 20px; display:flex; flex-wrap:wrap; gap:12px 28px; font:11px Arial,sans-serif; color:#756a66; }
  .server-info strong { color:var(--rose-dark); }
  .notice { max-width:1180px; margin:0 auto 25px; padding:0 28px; color:var(--rose-dark); font:12px Arial,sans-serif; }
  @media(max-width:760px) { .nav { flex-wrap:wrap; justify-content:center; } nav { gap:15px; flex-wrap:wrap; justify-content:center; } .hero { grid-template-columns:1fr; } .hero-copy { padding:48px 30px; } .hero-art { min-height:340px; } .features { grid-template-columns:1fr; } .quote blockquote { font-size:24px; } }
`;

function page(content, title = 'The Glow Journal | Beauty & Skincare') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="The Glow Journal — thoughtful skincare rituals, beauty notes and everyday glow inspiration.">
  <title>${title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="announcement">A little time for yourself, every day · Welcome to The Glow Journal</div>
  <header><div class="nav">
    <a class="brand" href="/">the glow <span>journal.</span></a>
    <nav><a href="/">Home</a><a href="/about">Our philosophy</a><a href="/#rituals">Skincare notes</a><a href="/#newsletter">Join us</a></nav>
    <a class="nav-cta" href="/#newsletter">GET THE GLOW LETTER</a>
  </div></header>
  ${content}
  <footer><div class="brand">the glow <span>journal.</span></div><p>BEAUTY IN YOUR OWN RHYTHM · MADE FOR SLOWER, SOFTER DAYS</p></footer>
</body>
</html>`;
}

const home = `
  <main>
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">Your gentle guide to good skin</div>
        <h1>Glow begins<br>with <em>self-care.</em></h1>
        <p>Thoughtful skincare, simple rituals and little reminders to feel good in the skin you are in. Find your rhythm, keep it gentle, and let your natural glow shine.</p>
        <a class="button" href="#rituals">EXPLORE THE JOURNAL</a>
      </div>
      <div class="hero-art" aria-label="Illustration of a skincare bottle">
        <div class="sun"></div><div class="leaf"></div><div class="leaf two"></div>
        <div class="bottle"><div class="bottle-label">THE GLOW<br>JOURNAL<br><br>DAILY<br>ESSENCE</div></div>
        <div class="hero-note">Nourish · Restore · Radiate</div>
      </div>
    </section>

    <section class="section" id="rituals">
      <div class="section-head"><div class="eyebrow">A softer kind of beauty routine</div><h2>Notes for your natural glow</h2><p>Small, mindful steps that make caring for your skin feel like a treat.</p></div>
      <div class="features">
        <article class="feature"><div class="feature-art one"><div class="orb"></div></div><div class="feature-body"><div class="tag">01 · The basics</div><h3>Build a gentle routine</h3><p>Discover the everyday essentials: cleanse, moisturise and protect. A simple routine can be a lovely place to begin.</p><a class="read" href="/about">READ THE NOTE →</a></div></article>
        <article class="feature"><div class="feature-art two"><div class="orb"></div></div><div class="feature-body"><div class="tag">02 · Skin wisdom</div><h3>Get to know your skin</h3><p>Learn about common skin types and pay attention to what makes your own skin feel comfortable and balanced.</p><a class="read" href="/about">READ THE NOTE →</a></div></article>
        <article class="feature"><div class="feature-art three"><div class="orb"></div></div><div class="feature-body"><div class="tag">03 · Little rituals</div><h3>Make room for self-care</h3><p>Slow down, stay consistent and enjoy the small moments in your routine. Your skin deserves patience, not pressure.</p><a class="read" href="/about">READ THE NOTE →</a></div></article>
      </div>
    </section>

    <section class="quote"><blockquote>“The most beautiful routine is the one that helps you feel at home in your own skin.”</blockquote><small>A gentle reminder from The Glow Journal</small></section>

    <section class="newsletter" id="newsletter"><div class="eyebrow">A note in your inbox</div><h2>Stay in your glow era.</h2><p>Fresh skincare notes, thoughtful tips and a little inspiration for your everyday ritual.</p><form class="newsletter-form" action="/subscribe" method="GET"><input type="email" name="email" placeholder="Your email address" aria-label="Your email address" required><button type="submit">COUNT ME IN</button></form></section>
  </main>
  <section class="server-info"><div class="server-info-inner"><span><strong>SERVER STATUS</strong> · Request received successfully</span><span><strong>REQUEST URL</strong> · <span id="request-url">/</span></span><span><strong>REQUEST METHOD</strong> · <span id="request-method">GET</span></span><span><strong>HTTP STATUS</strong> · 200 OK</span></div></section>
  <script>document.getElementById('request-url').textContent = window.location.pathname + window.location.search; document.getElementById('request-method').textContent = 'GET';</script>
`;

const about = `
  <main>
    <section class="hero" style="min-height:360px;grid-template-columns:1fr;">
      <div class="hero-copy" style="max-width:760px;margin:auto;text-align:center;align-items:center;padding:65px 30px;">
        <div class="eyebrow">The heart behind the journal</div><h1>Beauty, with a little more <em>kindness.</em></h1>
        <p>We believe skincare does not need to be complicated. The Glow Journal is a calm corner for learning the basics, finding simple rituals and celebrating your skin at every stage.</p>
        <a class="button" href="/">BACK TO HOME</a>
      </div>
    </section>
    <section class="section"><div class="section-head"><div class="eyebrow">Our philosophy</div><h2>Keep it simple. Keep it yours.</h2><p>Listen to your skin, introduce products thoughtfully and remember that consistency matters more than having a crowded shelf.</p></div><div class="features"><article class="feature"><div class="feature-body"><div class="tag">01 · Gentle</div><h3>Less, but intentional</h3><p>Choose a routine that feels comfortable and manageable for your everyday life.</p></div></article><article class="feature"><div class="feature-body"><div class="tag">02 · Informed</div><h3>Learn as you go</h3><p>Understand what your products do and introduce new skincare one step at a time.</p></div></article><article class="feature"><div class="feature-body"><div class="tag">03 · Personal</div><h3>Your skin, your pace</h3><p>Every person's skin is different. Let your routine reflect your own needs and comfort.</p></div></article></div></section>
  </main>
  <section class="server-info"><div class="server-info-inner"><span><strong>SERVER STATUS</strong> · Request received successfully</span><span><strong>REQUEST URL</strong> · /about</span><span><strong>REQUEST METHOD</strong> · GET</span><span><strong>HTTP STATUS</strong> · 200 OK</span></div></section>
`;

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  let statusCode = 200;
  let html;

  if (pathname === '/' || pathname === '/home') {
    html = page(home);
  } else if (pathname === '/about') {
    html = page(about, 'Our Philosophy | The Glow Journal');
  } else if (pathname === '/subscribe') {
    const email = new URL(req.url, `http://${req.headers.host || 'localhost'}`).searchParams.get('email');
    const safeEmail = String(email || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
    html = page(`<main><section class="hero" style="min-height:360px;grid-template-columns:1fr;"><div class="hero-copy" style="max-width:760px;margin:auto;text-align:center;align-items:center;padding:65px 30px;"><div class="eyebrow">A little more glow in your inbox</div><h1>Thank you for <em>joining us.</em></h1><p>Your sign-up request has been received${safeEmail ? ` for <strong>${safeEmail}</strong>` : ''}. This demonstration shows how the Node.js server can handle a different URL route.</p><a class="button" href="/">RETURN HOME</a></div></section></main>`, 'Thank You | The Glow Journal');
  } else {
    statusCode = 404;
    html = page(`<main><section class="hero" style="min-height:360px;grid-template-columns:1fr;"><div class="hero-copy" style="max-width:760px;margin:auto;text-align:center;align-items:center;padding:65px 30px;"><div class="eyebrow">A little detour</div><h1>Page not <em>found.</em></h1><p>The page you are looking for is not part of this journal. Let's take you back to the beginning.</p><a class="button" href="/">BACK TO HOME</a></div></section></main>`, 'Page Not Found | The Glow Journal');
  }

  // Send the HTTP status code and response headers before returning the HTML.
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=UTF-8',
    'Cache-Control': 'no-store'
  });
  res.end(html);

  console.log(`${req.method} ${req.url} - ${statusCode}`);
});

server.listen(PORT, () => {
  console.log(`The Glow Journal server is running at http://localhost:${PORT}`);
  console.log('Press Ctrl + C to stop the server.');
});
