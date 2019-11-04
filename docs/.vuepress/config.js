module.exports = {
  title: 'Haven',
  description: 'GDPR-ready cookie consent manager with zero dependencies.',
  base: '/haven/',
  themeConfig: {
    sidebar: [
      {
        title: 'Getting Started',
        collapsable: false,
        children: [
          ['', 'Introduction'],
          'getting-started',
          'cookie-purposes',
          'service-injection',
          'cookie-notification',
          'cookie-preferences',
          'consent-revoke',
          'configuration',
          'events',
        ]
      },
    ],
    lastUpdated: 'Last Updated'
  }
};
