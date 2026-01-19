import { useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DocumentCard from '../components/DocumentCard'

const DocumentList = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categoryId } = useParams()

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(categoryId || '')
  const [language, setLanguage] = useState(searchParams.get('language') || '')
  const [license, setLicense] = useState(searchParams.get('license') || '')
  const [sort, setSort] = useState(searchParams.get('ordering') || '-created_at')

  useEffect(() => {
    fetchDocuments()
  }, [searchParams])

  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams(searchParams)
      if (categoryId) {
        params.set('category', categoryId)
      }

      const response = await fetch(`/api/documents/?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.results || data)
        setPagination(data)
      } else {
        setError(t('errors.fetch_documents'))
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setError(t('errors.network'))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (language) params.set('language', language)
    if (license) params.set('license', license)
    if (sort !== '-created_at') params.set('ordering', sort)

    setSearchParams(params)
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{t('loading.documents')}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-title">{t('documents.browse')}</div>

      {/* Search and Filters */}
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label>{t('filters.search')}</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('filters.search_placeholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('filters.language')}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">{t('filters.all_languages')}</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('filters.license')}</label>
            <select value={license} onChange={(e) => setLicense(e.target.value)}>
              <option value="">{t('filters.all_licenses')}</option>
              <option value="cc-by">CC BY</option>
              <option value="cc-by-sa">CC BY-SA</option>
              <option value="public-domain">Public Domain</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('filters.sort')}</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="-created_at">{t('sort.newest')}</option>
              <option value="-view_count">{t('sort.most_viewed')}</option>
              <option value="-download_count">{t('sort.most_downloaded')}</option>
              <option value="title">{t('sort.title_az')}</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {t('filters.search')}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {/* Results */}
      <div style={{ marginBottom: '2rem' }}>
        <p>{t('documents.found', { count: pagination?.count || documents.length })}</p>
      </div>

      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>{t('documents.no_results')}</p>
        </div>
      ) : (
        <div className="document-grid">
          {documents.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.next && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            className="btn btn-secondary"
          >
            {t('pagination.load_more')}
          </button>
        </div>
      )}
    </div>
  )
}

export default DocumentList
