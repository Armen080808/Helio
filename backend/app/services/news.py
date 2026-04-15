import feedparser
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.news_article import NewsArticle

RSS_FEEDS = [
    ("Financial Post", "https://financialpost.com/feed", "Markets"),
    ("Globe and Mail Business", "https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/business/", "Banking"),
    ("Reuters Business", "https://feeds.reuters.com/reuters/businessNews", "Markets"),
    ("Bloomberg Canada", "https://feeds.bloomberg.com/markets/news.rss", "Markets"),
    ("Bay Street Bull", "https://baystreetbull.com/feed/", "Banking"),
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
