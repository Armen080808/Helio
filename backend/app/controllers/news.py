from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.news_article import NewsArticle
from ..schemas.news_article import NewsArticleOut

router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("/", response_model=list[NewsArticleOut])
def list_news(
    category: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(NewsArticle)
    if category:
        q = q.filter(NewsArticle.category == category)
    return q.order_by(NewsArticle.published_at.desc().nullslast()).limit(30).all()
