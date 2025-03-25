import React from 'react'

export default function PrivacyPolicyModal() {
    return (
        <div className='container overflow-y-auto px-6 py-8 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Datenschutzerklärung</h1>
            <div className='h-1 w-20 bg-[#5B9279] mb-8'></div>
            <div className='space-y-8 mt-8'>
                <section className='bg-white rounded-lg p-6 shadow-sm border border-gray-100'>
                    <h2 className='text-xl font-bold mb-4 text-gray-800 flex items-center'>
                        <span className='w-8 h-8 rounded-full bg-[#5B9279]/10 text-[#5B9279] flex items-center justify-center mr-3 text-sm'>1</span>
                        Verantwortliche Stelle
                    </h2>
                    <p className='text-sm text-gray-700'>
                        Verantwortlich für die Datenverarbeitung ist:<br />
                        FeetF1rst GmbH<br />
                        Erlenweg 4<br />
                        info@feetf1rst.com
                    </p>
                </section>

                <section>
                    <h2 className='text-xl font-bold mb-3'>2. Zwecke und Rechtsgrundlagen der Datenverarbeitung</h2>
                    <p className='text-sm text-gray-700 mb-4'>
                        Wir verarbeiten personenbezogene Daten ausschließlich im Einklang mit der EU-Datenschutz-Grundverordnung (DSGVO).
                    </p>

                    <h3 className='text-lg font-semibold mb-2'>a) Newsletter-Versand</h3>
                    <p className='text-sm text-gray-700 mb-2'>
                        Wenn Sie sich für unseren Newsletter anmelden, speichern wir Ihre E-Mail-Adresse, um Ihnen regelmäßig Informationen über unsere Produkte und Angebote zu senden.
                    </p>
                    <p className='text-sm text-gray-700 mb-2'>
                        Rechtsgrundlage: Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO
                    </p>
                    <p className='text-sm text-gray-700 mb-4'>
                        Widerruf: Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, z. B. über den Abmeldelink im Newsletter oder per E-Mail an uns.
                    </p>

                    <h3 className='text-lg font-semibold mb-2'>b) Durchführung eines Fußscans</h3>
                    <p className='text-sm text-gray-700 mb-2'>
                        Wenn Sie unseren Fußscan-Service nutzen, erfassen wir Daten zur Fußform (biometrische Merkmale), um personalisierte Produktempfehlungen oder maßgeschneiderte Lösungen bereitzustellen.
                    </p>
                    <p className='text-sm text-gray-700 mb-2'>
                        Rechtsgrundlage: Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO (besondere Kategorien personenbezogener Daten)
                    </p>
                    <p className='text-sm text-gray-700'>
                        Verwendungszweck: Nur zur Analyse und Beratung im Rahmen unseres Angebots. Keine Weitergabe an Dritte ohne Ihre ausdrückliche Zustimmung.
                    </p>
                </section>

                <section>
                    <h2 className='text-xl font-bold mb-3'>3. Speicherdauer</h2>
                    <p className='text-sm text-gray-700'>
                        Wir speichern Ihre Daten nur so lange, wie dies für die genannten Zwecke erforderlich ist bzw. bis Sie Ihre Einwilligung widerrufen. Danach werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                    </p>
                </section>

                <section>
                    <h2 className='text-xl font-bold mb-3'>4. Weitergabe von Daten</h2>
                    <p className='text-sm text-gray-700'>
                        Wir geben Ihre Daten grundsätzlich nicht an Dritte weiter. Sofern externe Dienstleister (z. B. Newsletter-Dienste oder Hosting-Anbieter) eingesetzt werden, erfolgt dies nur auf Grundlage eines Auftragsverarbeitungsvertrags gemäß Art. 28 DSGVO.
                    </p>
                </section>

                <section>
                    <h2 className='text-xl font-bold mb-3'>5. Betroffenenrechte</h2>
                    <p className='text-sm text-gray-700 mb-3'>Sie haben das Recht:</p>
                    <ul className='list-disc pl-5 text-sm text-gray-700 space-y-1'>
                        <li>auf Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                        <li>auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                        <li>auf Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                        <li>auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                        <li>auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                        <li>auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                        <li>und das Recht, eine erteilte Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO)</li>
                    </ul>
                    <p className='text-sm text-gray-700 mt-3'>
                        Außerdem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
                    </p>
                </section>

                <section>
                    <h2 className='text-xl font-bold mb-3'>6. Datensicherheit</h2>
                    <p className='text-sm text-gray-700'>
                        Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten gegen Verlust, Manipulation und unbefugten Zugriff zu schützen.
                    </p>
                </section>

                <section>
                    <h2 className='text-xl font-bold mb-3'>7. Kontakt</h2>
                    <p className='text-sm text-gray-700'>
                        Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
                        Haidacher Damian<br />
                        info@feetf1rst.com
                    </p>
                </section>
            </div>
        </div>
    )
}
