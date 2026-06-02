import { useState } from 'react';
import { detectSiteCity } from '../../utils/siteLogo';
import './DownloadsPage.css';

interface DownloadFile {
  name: string;
  description: string;
  url: string;
  format: 'CSV' | 'XLS' | 'ZIP';
  size?: string;
}

export default function DownloadsPage() {
  // Nginx maps /downloads/ → /var/images/autoparts/public-downloads/<city>/
  // so URLs stay the same; the right subfolder is served per domain.
  const city = detectSiteCity();
  const xlsName = city === 'spb'
    ? 'price_forward_spb_NDS'
    : 'price_forward_ekat_NDS';

  const downloads: DownloadFile[] = [
    {
      name: 'Прайс-лист (CSV)',
      description: 'Полный каталог товаров в формате CSV',
      url: '/downloads/PriceCVS/Forward_priceCSV.csv',
      format: 'CSV',
      size: '~500 KB'
    },
    {
      name: 'Прайс-лист (CSV архив)',
      description: 'Полный каталог товаров в формате CSV (ZIP архив)',
      url: '/downloads/PriceCVS/Forward_priceCSV.zip',
      format: 'ZIP',
      size: '~200 KB'
    },
    {
      name: 'Прайс-лист (Excel)',
      description: 'Полный каталог товаров в формате Excel',
      url: `/downloads/PriceXLS/${xlsName}.xls`,
      format: 'XLS',
      size: '~800 KB'
    },
    {
      name: 'Прайс-лист (Excel архив)',
      description: 'Полный каталог товаров в формате Excel (ZIP архив)',
      url: `/downloads/PriceXLS/${xlsName}.zip`,
      format: 'ZIP',
      size: '~400 KB'
    }
  ];

  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (file: DownloadFile) => {
    setDownloading(file.url);
    
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.url.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Reset after a delay
      setTimeout(() => setDownloading(null), 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloading(null);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'CSV':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        );
      case 'XLS':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <rect x="8" y="12" width="8" height="6"/>
          </svg>
        );
      case 'ZIP':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <path d="M12 18v-6"/>
            <path d="M9 15l3 3 3-3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="downloads-page">
      <div className="downloads-container">
        <div className="downloads-header">
          <h1>Скачать прайс-лист</h1>
          <p className="downloads-subtitle">
            Актуальные цены и наличие товаров для оптовых покупателей
          </p>
        </div>

        <div className="downloads-info-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
          <div>
            <strong>Важно:</strong> Прайс-лист обновляется автоматически каждые 30 минут.
            Цены указаны с НДС.
          </div>
        </div>

        <div className="downloads-grid">
          {downloads.map((file) => (
            <div key={file.url} className="download-card">
              <div className="download-icon">
                {getFormatIcon(file.format)}
                <span className="download-format-badge">{file.format}</span>
              </div>
              
              <div className="download-info">
                <h3 className="download-name">{file.name}</h3>
                <p className="download-description">{file.description}</p>
                {file.size && (
                  <span className="download-size">Размер: {file.size}</span>
                )}
              </div>
              
              <button
                className="download-btn"
                onClick={() => handleDownload(file)}
                disabled={downloading === file.url}
              >
                {downloading === file.url ? (
                  <>
                    <div className="button-spinner"></div>
                    Загрузка...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Скачать
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="downloads-help">
          <h2>Нужна помощь?</h2>
          <p>
            Если у вас возникли проблемы с загрузкой или вопросы по прайс-листу,
            свяжитесь с нами по телефону или email.
          </p>
        </div>
      </div>
    </div>
  );
}