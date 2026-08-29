export function PrivacyPage() {
  return (
    <article className="policy-page">
      <header className="page-intro">
        <p className="eyebrow">Effective 29 August 2026</p>
        <h1>Privacy policy</h1>
        <p>This page explains what the itinerary stores and which online services it contacts.</p>
      </header>

      <section>
        <h2>Data stored on this device</h2>
        <p>The app can store saved places, completed items, booking states, actual spend, and private notes in this browser. This data stays in local storage. The app has no account or sync service.</p>
        <p>You can export this data as a JSON file. You can also import a file or reset all local data from the Budget page.</p>
      </section>

      <section>
        <h2>Data this app does not collect</h2>
        <p>The app has no analytics, ads, cookies, contact form, or location tracking. It does not ask for an email address. It does not store booking codes, card data, passport data, or room codes in the public source.</p>
      </section>

      <section>
        <h2>Online requests</h2>
        <p>The app contacts Open-Meteo when it checks a forecast. The map loads tiles from OpenStreetMap. GitHub Pages serves the site. These services may receive normal web request data, such as an IP address and browser details. This app cannot read their server logs.</p>
        <ul>
          <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub privacy statement</a></li>
          <li><a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">OpenStreetMap Foundation privacy policy</a></li>
          <li><a href="https://open-meteo.com/en/terms" target="_blank" rel="noopener noreferrer">Open-Meteo terms and privacy details</a></li>
        </ul>
      </section>

      <section>
        <h2>External links</h2>
        <p>Booking.com, Google Maps, rental firms, restaurants, and tour firms apply their own privacy rules when you open their pages.</p>
      </section>
    </article>
  )
}
