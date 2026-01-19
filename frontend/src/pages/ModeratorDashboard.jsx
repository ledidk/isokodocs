import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const ModeratorDashboard = () => {
  const { t } = useTranslation()
  const { user, getAuthHeaders } = useAuth()

  const [pendingDocuments, setPendingDocuments] = useState([])
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('documents')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.is_moderator) {
      fetchData()
    }
  }, [user, activeTab])

  const fetchData = async () => {
    setLoading(true)

    try {
      if (activeTab === 'documents') {
        const response = await fetch('/api/documents/?status=pending')
        if (response.ok) {
          const data = await response.json()
          setPendingDocuments(data.results || data)
        }
      } else if (activeTab === 'reports') {
        const response = await fetch('/api/reports/')
        if (response.ok) {
          const data = await response.json()
          setReports(data.results || data)
        }
      } else if (activeTab === 'users') {
        const response = await fetch('/api/accounts/users/')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.results || data)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/approve/`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setPendingDocuments(prev => prev.filter(doc => doc.id !== documentId))
      }
    } catch (error) {
      console.error('Error approving document:', error)
    }
  }

  const rejectDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/reject/`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setPendingDocuments(prev => prev.filter(doc => doc.id !== documentId))
      }
    } catch (error) {
      console.error('Error rejecting document:', error)
    }
  }

  const resolveReport = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/resolve/`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setReports(prev => prev.filter(report => report.id !== reportId))
      }
    } catch (error) {
      console.error('Error resolving report:', error)
    }
  }

  const banUser = async (userId) => {
    try {
      const response = await fetch(`/api/accounts/users/${userId}/ban/`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: true } : u))
      }
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const unbanUser = async (userId) => {
    try {
      const response = await fetch(`/api/accounts/users/${userId}/unban/`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: false } : u))
      }
    } catch (error) {
      console.error('Error unbanning user:', error)
    }
  }

  if (!user?.is_moderator) {
    return (
      <div className="container">
        <div className="error">{t('moderator.access_denied')}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-title">{t('moderator.dashboard')}</div>

      {/* Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #dee2e6' }}>
          <button
            onClick={() => setActiveTab('documents')}
            className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t('moderator.pending_documents')} ({pendingDocuments.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t('moderator.reports')} ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t('moderator.users')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('loading.data')}</p>
        </div>
      ) : (
        <>
          {/* Pending Documents */}
          {activeTab === 'documents' && (
            <div>
              <h3>{t('moderator.pending_documents')}</h3>
              {pendingDocuments.length === 0 ? (
                <p>{t('moderator.no_pending_documents')}</p>
              ) : (
                <div className="document-grid">
                  {pendingDocuments.map(document => (
                    <div key={document.id} className="document-card">
                      <h3>{document.title}</h3>
                      <p>{document.description}</p>
                      <p><strong>{t('document.uploaded_by')}:</strong> {document.uploaded_by_username}</p>
                      <p><strong>{t('document.category')}:</strong> {document.category_name}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                          onClick={() => approveDocument(document.id)}
                          className="btn btn-primary"
                        >
                          ✅ {t('moderator.approve')}
                        </button>
                        <button
                          onClick={() => rejectDocument(document.id)}
                          className="btn btn-danger"
                        >
                          ❌ {t('moderator.reject')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reports */}
          {activeTab === 'reports' && (
            <div>
              <h3>{t('moderator.reports')}</h3>
              {reports.length === 0 ? (
                <p>{t('moderator.no_reports')}</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {reports.map(report => (
                    <div key={report.id} style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                      <h4>{report.document_title}</h4>
                      <p><strong>{t('report.reason')}:</strong> {t('report.' + report.reason)}</p>
                      <p><strong>{t('report.reported_by')}:</strong> {report.reported_by_username}</p>
                      <p><strong>{t('report.description')}:</strong> {report.description}</p>
                      <p><strong>{t('report.status')}:</strong> {report.status}</p>
                      <button
                        onClick={() => resolveReport(report.id)}
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem' }}
                      >
                        {t('moderator.resolve_report')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div>
              <h3>{t('moderator.users')}</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {users.map(user => (
                  <div key={user.id} style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                    <p><strong>{t('moderator.status')}:</strong> {user.is_banned ? t('moderator.banned') : t('moderator.active')}</p>
                    <p><strong>{t('moderator.role')}:</strong> {user.is_moderator ? t('moderator.moderator') : t('moderator.user')}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                      {user.is_banned ? (
                        <button
                          onClick={() => unbanUser(user.id)}
                          className="btn btn-primary"
                        >
                          {t('moderator.unban')}
                        </button>
                      ) : (
                        <button
                          onClick={() => banUser(user.id)}
                          className="btn btn-danger"
                        >
                          {t('moderator.ban')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ModeratorDashboard
