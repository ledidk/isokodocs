import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const Upload = () => {
  const { t } = useTranslation()
  const { user, getAuthHeaders } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'en',
    tags: '',
    license: 'cc-by',
    file: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchCategories()
  }, [user, navigate])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.results || data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError(t('upload.errors.invalid_file_type'))
        return
      }

      // Validate file size (50MB)
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        setError(t('upload.errors.file_too_large'))
        return
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }))
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('category', formData.category)
      submitData.append('language', formData.language)
      submitData.append('license', formData.license)
      submitData.append('file', formData.file)

      // Handle tags
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        submitData.append('tags', JSON.stringify(tagsArray))
      }

      const response = await fetch('/api/documents/', {
        method: 'POST',
        headers: {
          ...getAuthHeaders()
        },
        body: submitData
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          title: '',
          description: '',
          category: '',
          language: 'en',
          tags: '',
          license: 'cc-by',
          file: null
        })
        // Reset file input
        document.getElementById('file-input').value = ''
      } else {
        const errorData = await response.json()
        setError(errorData.detail || t('upload.errors.upload_failed'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(t('upload.errors.network'))
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container">
      <div className="page-title">{t('upload.title')}</div>

      {success && (
        <div className="success" style={{ marginBottom: '2rem' }}>
          {t('upload.success')}
        </div>
      )}

      {error && (
        <div className="error" style={{ marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="form-group">
          <label>{t('upload.title_label')} *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder={t('upload.title_placeholder')}
          />
        </div>

        <div className="form-group">
          <label>{t('upload.description_label')} *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder={t('upload.description_placeholder')}
          />
        </div>

        <div className="form-group">
          <label>{t('upload.category_label')} *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">{t('upload.select_category')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t('upload.language_label')} *</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            required
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t('upload.license_label')} *</label>
          <select
            name="license"
            value={formData.license}
            onChange={handleInputChange}
            required
          >
            <option value="cc-by">Creative Commons BY</option>
            <option value="cc-by-sa">Creative Commons BY-SA</option>
            <option value="public-domain">Public Domain</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t('upload.tags_label')}</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder={t('upload.tags_placeholder')}
          />
          <small style={{ color: '#666' }}>{t('upload.tags_help')}</small>
        </div>

        <div className="form-group">
          <label>{t('upload.file_label')} *</label>
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          <small style={{ color: '#666' }}>
            {t('upload.file_help')}
          </small>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem' }}
          >
            {loading ? t('upload.uploading') : t('upload.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Upload
