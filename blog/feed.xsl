<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
    <title><xsl:value-of select="/rss/channel/title"/></title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        .header {
            background: #0ea5e9;
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px;
            font-size: 2.5rem;
        }
        .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        .feed-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        .feed-info h2 {
            margin: 0 0 15px;
            color: #1e293b;
            font-size: 1.5rem;
        }
        .feed-url {
            background: #f1f5f9;
            padding: 12px;
            border-radius: 6px;
            font-family: monospace;
            word-break: break-all;
            font-size: 14px;
            color: #475569;
        }
        .posts {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .posts h2 {
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
        }
        .post {
            padding: 25px;
            border-bottom: 1px solid #f1f5f9;
        }
        .post:last-child {
            border-bottom: none;
        }
        .post h3 {
            margin: 0 0 10px;
            font-size: 1.3rem;
        }
        .post h3 a {
            color: #0ea5e9;
            text-decoration: none;
        }
        .post h3 a:hover {
            text-decoration: underline;
        }
        .post-meta {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 12px;
        }
        .post-description {
            color: #475569;
            line-height: 1.7;
        }
        .cta {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .btn {
            display: inline-block;
            background: #22c55e;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 0 10px;
        }
        .btn:hover {
            background: #16a34a;
        }
        .btn-secondary {
            background: #6b7280;
        }
        .btn-secondary:hover {
            background: #4b5563;
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