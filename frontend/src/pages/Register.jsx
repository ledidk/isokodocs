import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { t } = useTranslation()
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.password_confirm) {
      setError(t('auth.passwords_not_match'))
      setLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError(t('auth.password_too_short'))
      setLoading(false)
      return
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name
    })

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t('auth.register')}</h2>

        {error && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>{t('auth.first_name')}</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder={t('auth.first_name_placeholder')}
              />
            </div>

            <div className="form-group">
              <label>{t('auth.last_name')}</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder={t('auth.last_name_placeholder')}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.username')} *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder={t('auth.username_placeholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('auth.email')} *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder={t('auth.email_placeholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('auth.password')} *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder={t('auth.password_placeholder')}
            />
            <small style={{ color: '#666' }}>{t('auth.password_help')}</small>
          </div>

          <div className="form-group">
            <label>{t('auth.confirm_password')} *</label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleInputChange}
              required
              placeholder={t('auth.confirm_password_placeholder')}
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? t('auth.registering') : t('auth.register')}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>
            {t('auth.have_account')}{' '}
            <Link to="/login" style={{ color: '#3498db' }}>
              {t('auth.login_here')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
