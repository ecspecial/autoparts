import { useEffect, useState } from 'react';
import { newsApi } from '../../api/news';
import type { NewsItem } from '../../api/news';
import './NewsPage.css';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi.getAll()
      .then(setNews)
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="news-page">
      <div className="news-page-container">
        <h1 className="news-page-title">Новости</h1>

        {loading && <p className="news-page-loading">Загрузка...</p>}

        {!loading && news.length === 0 && (
          <p className="news-page-empty">Новостей пока нет.</p>
        )}

        {!loading && news.length > 0 && (
          <div className="news-list">
            {news.map((item) => (
              <article key={item.filename} className="news-card">
                {item.date && (
                  <div className="news-date">{formatDate(item.date)}</div>
                )}
                <div
                  className="news-content"
                  dangerouslySetInnerHTML={{ __html: item.html }}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;