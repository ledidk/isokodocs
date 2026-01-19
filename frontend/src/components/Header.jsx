import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

const Header = () => {
  const { user, logout } = useAuth()
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          IsokoDocs
        </Link>

        <nav className="nav-links">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/documents">{t('nav.browse')}</Link>

          {user ? (
            <>
              <Link to="/upload">{t('nav.upload')}</Link>
              {user.is_moderator && (
                <Link to="/moderator">{t('nav.moderator')}</Link>
              )}
              <span>{t('nav.welcome')}, {user.username}</span>
              <button onClick={logout} className="btn btn-secondary">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">{t('nav.login')}</Link>
              <Link to="/register">{t('nav.register')}</Link>
            </>
          )}

          <div className="language-switcher">
            <button
              onClick={() => changeLanguage('en')}
              className={`btn ${i18n.language === 'en' ? 'btn-primary' : 'btn-secondary'}`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className={`btn ${i18n.language === 'fr' ? 'btn-primary' : 'btn-secondary'}`}
            >
              FR
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
