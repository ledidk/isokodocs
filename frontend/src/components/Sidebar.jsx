import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Sidebar = ({ categories }) => {
  const { t } = useTranslation()

  return (
    <aside className="sidebar">
      <h3>{t('sidebar.categories')}</h3>
      <ul className="category-list">
        <li>
          <Link to="/documents">
            <span>📚</span>
            {t('sidebar.all_documents')}
          </Link>
        </li>
        {categories.map(category => (
          <li key={category.id}>
            <Link to={`/category/${category.id}`}>
              <span>{category.icon}</span>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      <h3>{t('sidebar.help')}</h3>
      <ul className="category-list">
        <li>
          <Link to="/terms">
            <span>📋</span>
            {t('sidebar.terms')}
          </Link>
        </li>
        <li>
          <Link to="/privacy">
            <span>🔒</span>
            {t('sidebar.privacy')}
          </Link>
        </li>
        <li>
          <Link to="/takedown">
            <span>⚖️</span>
            {t('sidebar.takedown')}
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
