import { useTranslation } from 'react-i18next'

const Terms = () => {
  const { t } = useTranslation()

  return (
    <div className="container">
      <div className="page-title">{t('terms.title')}</div>

      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        <p><em>{t('terms.last_updated')}: January 2024</em></p>

        <h2>{t('terms.acceptance')}</h2>
        <p>{t('terms.acceptance_text')}</p>

        <h2>{t('terms.use_license')}</h2>
        <p>{t('terms.use_license_text')}</p>

        <h2>{t('terms.user_content')}</h2>
        <p>{t('terms.user_content_text')}</p>

        <h2>{t('terms.prohibited_uses')}</h2>
        <ul>
          <li>{t('terms.prohibited_1')}</li>
          <li>{t('terms.prohibited_2')}</li>
          <li>{t('terms.prohibited_3')}</li>
          <li>{t('terms.prohibited_4')}</li>
        </ul>

        <h2>{t('terms.moderation')}</h2>
        <p>{t('terms.moderation_text')}</p>

        <h2>{t('terms.disclaimer')}</h2>
        <p>{t('terms.disclaimer_text')}</p>

        <h2>{t('terms.contact')}</h2>
        <p>{t('terms.contact_text')}</p>
      </div>
    </div>
  )
}

export default Terms
