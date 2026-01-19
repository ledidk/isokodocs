import { useTranslation } from 'react-i18next'

const Privacy = () => {
  const { t } = useTranslation()

  return (
    <div className="container">
      <div className="page-title">{t('privacy.title')}</div>

      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        <p><em>{t('privacy.last_updated')}: January 2024</em></p>

        <h2>{t('privacy.information_collection')}</h2>
        <p>{t('privacy.information_collection_text')}</p>

        <h2>{t('privacy.how_we_use')}</h2>
        <ul>
          <li>{t('privacy.use_1')}</li>
          <li>{t('privacy.use_2')}</li>
          <li>{t('privacy.use_3')}</li>
          <li>{t('privacy.use_4')}</li>
        </ul>

        <h2>{t('privacy.data_sharing')}</h2>
        <p>{t('privacy.data_sharing_text')}</p>

        <h2>{t('privacy.data_security')}</h2>
        <p>{t('privacy.data_security_text')}</p>

        <h2>{t('privacy.cookies')}</h2>
        <p>{t('privacy.cookies_text')}</p>

        <h2>{t('privacy.user_rights')}</h2>
        <p>{t('privacy.user_rights_text')}</p>

        <h2>{t('privacy.contact')}</h2>
        <p>{t('privacy.contact_text')}</p>
      </div>
    </div>
  )
}

export default Privacy
