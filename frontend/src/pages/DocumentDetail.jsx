import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const DocumentDetail = () => {
  const { t } = useTranslation()
  const { documentId } = useParams()
  const { user, getAuthHeaders } = useAuth()

  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')

  useEffect(() => {
    fetchDocument()
  }, [documentId])

  const fetchDocument = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/documents/${documentId}/`)
      if (response.ok) {
        const data = await response.json()
        setDocument(data)
      } else if (response.status === 404) {
        setError(t('errors.document_not_found'))
      } else {
        setError(t('errors.fetch_document'))
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      setError(t('errors.network'))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download/`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = document.file_name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Refresh document to update download count
        fetchDocument()
      }
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const handleReport = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/reports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          document: documentId,
          reason: reportReason,
          description: reportDescription
        })
      })

      if (response.ok) {
        alert(t('report.success'))
        setShowReportForm(false)
        setReportReason('')
        setReportDescription('')
      } else {
        alert(t('report.error'))
      }
    } catch (error) {
      console.error('Report error:', error)
      alert(t('report.error'))
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{t('loading.document')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <Link to="/documents" className="btn btn-secondary">
          {t('back_to_documents')}
        </Link>
      </div>
    )
  }

  if (!document) {
    return null
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/documents" className="btn btn-secondary">
          ← {t('back_to_documents')}
        </Link>
      </div>

      <div className="page-title">{document.title}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* PDF Preview */}
        <div>
          <div className="pdf-container">
            <iframe
              src={document.file_url}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
              title={document.title}
            />
          </div>
        </div>

        {/* Document Info */}
        <div>
          <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
            <h3>{t('document.details')}</h3>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.description')}:</strong>
              <p>{document.description}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.category')}:</strong> {document.category_name}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.language')}:</strong> {document.language.toUpperCase()}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.license')}:</strong> {document.license}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.tags')}:</strong> {document.tags.join(', ') || t('document.no_tags')}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.uploaded_by')}:</strong> {document.uploaded_by_username}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.uploaded_at')}:</strong> {formatDate(document.created_at)}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.views')}:</strong> {document.view_count}
              <br />
              <strong>{t('document.downloads')}:</strong> {document.download_count}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('document.status')}:</strong>
              <span className={`status-badge ${document.status}`}>
                {t(`status.${document.status}`)}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={handleDownload} className="btn btn-primary">
                📥 {t('document.download')}
              </button>

              {user && (
                <button
                  onClick={() => setShowReportForm(!showReportForm)}
                  className="btn btn-danger"
                >
                  🚨 {t('document.report')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3>{t('report.title')}</h3>
          <form onSubmit={handleReport}>
            <div className="form-group">
              <label>{t('report.reason')}</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
              >
                <option value="">{t('report.select_reason')}</option>
                <option value="copyright">{t('report.copyright')}</option>
                <option value="spam">{t('report.spam')}</option>
                <option value="personal_info">{t('report.personal_info')}</option>
                <option value="other">{t('report.other')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('report.description')}</label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder={t('report.description_placeholder')}
                rows="4"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-danger">
                {t('report.submit')}
              </button>
              <button
                type="button"
                onClick={() => setShowReportForm(false)}
                className="btn btn-secondary"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default DocumentDetail
