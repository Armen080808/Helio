import feedparser
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.news_article import NewsArticle

RSS_FEEDS = [
    # Canadian Finance
    ("Financial Post", "https://financialpost.com/feed", "Bay Street"),
    ("Globe and Mail Business", "https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/business/", "Bay Street"),
    ("Bay Street Bull", "https://baystreetbull.com/feed/", "Bay Street"),
    # Markets
    ("Reuters Business", "https://feeds.reuters.com/reuters/businessNews", "Markets"),
    ("Bloomberg Markets", "https://feeds.bloomberg.com/markets/news.rss", "Markets"),
    ("MarketWatch", "https://feeds.marketwatch.com/marketwatch/topstories/", "Markets"),
    # M&A / Deals
    ("Deal Law Wire", "https://www.deallawwire.com/feed/", "Deals"),
    ("Reuters M&A", "https://feeds.reuters.com/news/mergers", "Deals"),
    # Economy / Macro
    ("Bank of Canada", "https://www.bankofcanada.ca/feed/", "Macro"),
    ("Reuters Economy", "https://feeds.reuters.com/reuters/economicNews", "Macro"),
]


def fetch_and_store_news(db: Session):
    count = 0
    for source, url, category in RSS_FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:10]:
                link = entry.get("link", "")
                if not link or db.query(NewsArticle).filter(NewsArticle.url == link).first():
                    continue
                published = None
                if hasattr(entry, "published_parsed") and entry.published_parsed:
                    published = datetime(*entry.published_parsed[:6])
                article = NewsArticle(
                    title=entry.get("title", "")[:1000],
                    url=link[:2000],
                    source=source,
                    summary=entry.get("summary", "")[:2000] if hasattr(entry, "summary") else None,
                    published_at=published,
                    category=category,
                )
                db.add(article)
                count += 1
        except Exception as e:
            print(f"[NEWS] Failed {source}: {e}")
    db.commit()
    print(f"[NEWS] Added {count} articles")
