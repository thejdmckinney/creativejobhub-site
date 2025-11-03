<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
    <title><xsl:value-of select="/rss/channel/title"/></title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <style>
        :root {
            --bg: #0b1220;
            --panel: #111827;
            --muted: #9ca3af;
            --text: #e5e7eb;
            --brand: #0ea5e9;
            --brand-2: #22c55e;
            --ring: rgba(148,163,184,.15);
        }
        
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
            line-height: 1.6;
            color: var(--text);
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: 
                radial-gradient(1200px 600px at 10% -10%, rgba(34,197,94,.12), transparent 60%),
                radial-gradient(900px 500px at 90% -20%, rgba(14,165,233,.12), transparent 60%),
                var(--bg);
            min-height: 100vh;
        }
        
        .header {
            background: linear-gradient(135deg, var(--brand), #0284c7);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
            border: 1px solid var(--ring);
        }
        
        .header h1 {
            margin: 0 0 10px;
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .feed-info {
            background: var(--panel);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 1px solid var(--ring);
        }
        
        .feed-info h2 {
            margin: 0 0 15px;
            color: var(--text);
            font-size: 1.5rem;
        }
        
        .feed-info p {
            color: var(--muted);
            margin-bottom: 12px;
        }
        
        .feed-url {
            background: var(--bg);
            padding: 12px;
            border-radius: 6px;
            font-family: ui-monospace, "SF Mono", Consolas, monospace;
            word-break: break-all;
            font-size: 14px;
            color: var(--brand);
            border: 1px solid var(--ring);
        }
        
        .posts {
            background: var(--panel);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--ring);
        }
        
        .posts h2 {
            margin: 0;
            padding: 20px;
            background: var(--bg);
            border-bottom: 1px solid var(--ring);
            color: var(--text);
            font-weight: 700;
        }
        
        .post {
            padding: 25px;
            border-bottom: 1px solid var(--ring);
        }
        
        .post:last-child {
            border-bottom: none;
        }
        
        .post h3 {
            margin: 0 0 10px;
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .post h3 a {
            color: var(--brand);
            text-decoration: none;
        }
        
        .post h3 a:hover {
            color: #38bdf8;
            text-decoration: underline;
        }
        
        .post-meta {
            color: var(--muted);
            font-size: 14px;
            margin-bottom: 12px;
        }
        
        .post-description {
            color: #cbd5e1;
            line-height: 1.7;
        }
        
        .cta {
            text-align: center;
            margin-top: 30px;
            padding: 25px;
            background: var(--panel);
            border-radius: 12px;
            border: 1px solid var(--ring);
        }
        
        .cta h3 {
            margin: 0 0 12px;
            color: var(--text);
            font-weight: 600;
        }
        
        .cta p {
            color: var(--muted);
            margin-bottom: 20px;
        }
        
        .btn {
            display: inline-block;
            background: var(--brand-2);
            color: #0f172a;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 0 8px;
            transition: all 0.2s ease;
        }
        
        .btn:hover {
            background: #16a34a;
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--text);
            border: 1px solid var(--ring);
        }
        
        .btn-secondary:hover {
            background: var(--ring);
            color: var(--text);
        }
        
        strong {
            color: var(--text);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1><xsl:value-of select="/rss/channel/title"/></h1>
        <p><xsl:value-of select="/rss/channel/description"/></p>
    </div>

    <div class="feed-info">
        <h2>📡 RSS Feed</h2>
        <p>This is an RSS feed. You can subscribe to it in your favorite RSS reader to get notified about new posts.</p>
        <p><strong>Feed URL:</strong></p>
        <div class="feed-url">https://creativejobhub.com/blog/feed.xml</div>
    </div>

    <div class="posts">
        <h2>Recent Posts</h2>
        <xsl:for-each select="/rss/channel/item">
            <div class="post">
                <h3><a href="{link}"><xsl:value-of select="title"/></a></h3>
                <div class="post-meta">
                    Published on <xsl:value-of select="pubDate"/> 
                    <xsl:if test="category"> • <strong><xsl:value-of select="category"/></strong></xsl:if>
                </div>
                <div class="post-description">
                    <xsl:value-of select="description"/>
                </div>
            </div>
        </xsl:for-each>
    </div>

    <div class="cta">
        <h3>Like what you read?</h3>
        <p>Get more field service management insights and grow your business with Creative Job Hub.</p>
        <a href="https://creativejobhub.com/blog/" class="btn btn-secondary">Visit Blog</a>
        <a href="https://app.creativejobhub.com/auth?mode=signup" class="btn">Start Free</a>
    </div>
</body>
</html>
</xsl:template>

</xsl:stylesheet>