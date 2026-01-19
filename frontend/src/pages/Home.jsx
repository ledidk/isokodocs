import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Home = ({ categories }) => {
  const { t } = useTranslation()

  return (
    <div className="container">
      <div className="page-title">{t('home.welcome')}</div>

      <div className="hero-section" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2>{t('home.subtitle')}</h2>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          {t('home.description')}
        </p>
        <Link to="/documents" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          {t('home.browse_documents')}
        </Link>
      </div>

      <div className="categories-section">
        <h3 style={{ marginBottom: '2rem', color: '#2c3e50' }}>{t('home.popular_categories')}</h3>

        <div className="document-grid">
          {categories.slice(0, 6).map(category => (
            <div key={category.id} className="document-card">
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '3rem' }}>{category.icon}</span>
              </div>
              <h3 style={{ textAlign: 'center' }}>{category.name}</h3>
              <p style={{ textAlign: 'center', color: '#666' }}>{category.description}</p>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to={`/category/${category.id}`} className="btn btn-secondary">
                  {t('home.browse_category')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '2rem', color: '#2c3e50' }}>{t('home.features')}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h4>{t('home.feature_search')}</h4>
            <p>{t('home.feature_search_desc')}</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
            <h4>{t('home.feature_multilingual')}</h4>
            <p>{t('home.feature_multilingual_desc')}</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h4>{t('home.feature_moderation')}</h4>
            <p>{t('home.feature_moderation_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
