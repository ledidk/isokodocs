import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const DocumentCard = ({ document }) => {
  const { t } = useTranslation()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge approved">{t('status.approved')}</span>
      case 'pending':
        return <span className="status-badge pending">{t('status.pending')}</span>
      case 'rejected':
        return <span className="status-badge rejected">{t('status.rejected')}</span>
      default:
        return null
    }
  }

  return (
    <div className="document-card">
      <h3>
        <Link to={`/document/${document.id}`}>
          {document.title}
        </Link>
      </h3>

      <p>{document.description}</p>

      <div className="document-meta">
        <div>
          <span>{t('document.category')}: {document.category_name}</span>
          <br />
          <span>{t('document.language')}: {document.language.toUpperCase()}</span>
          <br />
          <span>{t('document.license')}: {document.license}</span>
        </div>

        <div>
          <span>{t('document.views')}: {document.view_count}</span>
          <br />
          <span>{t('document.downloads')}: {document.download_count}</span>
          <br />
          <span>{t('document.uploaded')}: {formatDate(document.created_at)}</span>
        </div>
      </div>

      {getStatusBadge(document.status)}

      <div style={{ marginTop: '1rem' }}>
        <Link to={`/document/${document.id}`} className="btn btn-primary">
          {t('document.view')}
        </Link>
      </div>
    </div>
  )
}

export default DocumentCard
