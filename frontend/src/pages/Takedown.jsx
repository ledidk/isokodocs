import { useTranslation } from 'react-i18next'

const Takedown = () => {
  const { t } = useTranslation()

  return (
    <div className="container">
      <div className="page-title">{t('takedown.title')}</div>

      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        <p><em>{t('takedown.last_updated')}: January 2024</em></p>

        <h2>{t('takedown.policy')}</h2>
        <p>{t('takedown.policy_text')}</p>

        <h2>{t('takedown.report_copyright')}</h2>
        <p>{t('takedown.report_copyright_text')}</p>

        <h2>{t('takedown.what_happens')}</h2>
        <ul>
          <li>{t('takedown.step_1')}</li>
          <li>{t('takedown.step_2')}</li>
          <li>{t('takedown.step_3')}</li>
          <li>{t('takedown.step_4')}</li>
        </ul>

        <h2>{t('takedown.counter_notification')}</h2>
        <p>{t('takedown.counter_notification_text')}</p>

        <h2>{t('takedown.contact')}</h2>
        <p>{t('takedown.contact_text')}</p>

        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem' }}>
          <h3>{t('takedown.report_form')}</h3>
          <p>{t('takedown.report_instructions')}</p>
          <p><strong>{t('takedown.email')}:</strong> takedown@isokodocs.com</p>
        </div>
      </div>
    </div>
  )
}

export default Takedown
