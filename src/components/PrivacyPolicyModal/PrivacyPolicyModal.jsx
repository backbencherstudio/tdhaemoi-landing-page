import React from 'react'

export default function PrivacyPolicyModal() {
    return (
        <div className='container overflow-y-auto'>
            <h1 className='text-2xl font-bold'>Datenschutzrichtlinie von FeetF1rst </h1>
            <p className='text-sm text-gray-700 my-5 font-italic'>Zuletzt aktualisiert: 13. März 2025 </p>
            <p className='text-sm text-gray-700 my-5'>FeetF1rst ("wir", "uns" oder "unser") legt höchsten Wert auf den Schutz Ihrer personenbezogenen Daten. Diese Datenschutzrichtlinie beschreibt, welche Informationen wir erfassen, wie wir sie nutzen und weitergeben sowie welche Rechte Sie in Bezug auf Ihre Daten haben.</p>
            <p className='text-sm text-gray-700 my-5'>Bitte lesen Sie diese Datenschutzrichtlinie sorgfältig durch. Durch die Nutzung unserer Dienste stimmen Sie der Verarbeitung Ihrer Daten gemäß dieser Richtlinie zu.</p>

            <div>
                <ol className="list-decimal pl-5 space-y-3">
                    <li className="font-bold">Änderungen dieser Datenschutzrichtlinie</li>
                    <p className="text-sm text-gray-700 pl-5">Wir behalten uns das Recht vor, diese Datenschutzrichtlinie jederzeit zu aktualisieren, um Änderungen unserer Praktiken widerzuspiegeln oder aus rechtlichen oder betrieblichen Gründen anzupassen. Die überarbeitete Datenschutzrichtlinie wird in unserer Software und auf unserer Website veröffentlicht, wobei das "Zuletzt aktualisiert"-Datum angepasst wird.</p>

                    <li className="font-bold">Welche personenbezogenen Daten erfassen wir?</li>
                    <p className="text-sm text-gray-700 pl-5">Die Art der erfassten personenbezogenen Daten hängt von Ihrer Nutzung unserer Dienste ab. "Personenbezogene Daten" sind alle Informationen, die Sie direkt oder indirekt identifizieren können. Dazu gehören:</p>

                    <p className="font-semibold pl-5">Direkt von Ihnen bereitgestellte Daten:</p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li><span className="font-semibold">Kontaktdaten:</span> Name, E-Mail-Adresse, Telefonnummer. </li>
                        <li><span className="font-semibold">Konto-Informationen:</span> Benutzername, Passwort, Sicherheitsfragen. </li>

                        <li><span className="font-semibold">Nutzungsdaten:</span> Scans und Fußanalyse-Ergebnisse. </li>

                        <li><span className="font-semibold">QR-Code-Zugang:</span> Generierung eines personalisierten QR-Codes, um Ihnen Zugang zu Ihren Scan-Ergebnissen und Empfehlungen in unserer App zu ermöglichen. </li>

                    </ul>

                    <p className="font-semibold pl-5">Automatisch erfasste Daten: </p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li><span className="font-semibold">Geräte- und Verbindungsdaten:</span> IP-Adresse, Browsertyp, Betriebssystem, Gerätemodell.  </li>
                        <li><span className="font-semibold">Nutzungsverhalten:</span> Interaktionen mit unserer Software, Zeitstempel der Nutzung, bevorzugte Einstellungen</li>
                        <li><span className="font-semibold">Standortdaten:</span> Falls Sie zustimmen, können Standortdaten zur Optimierung der empfohlenen Dienstleistungen erfasst werden. </li>
                    </ul>


                    <p className="font-semibold pl-5">Von Dritten erhaltene Daten: </p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">

                        <li><span className="font-semibold">Zahlungsanbieter:</span> Falls eine kostenpflichtige Nutzung vorliegt, werden Zahlungsinformationen ausschließlich von unseren Zahlungsdienstleistern verarbeitet. </li>

                        <li><span className="font-semibold">Analysedienste:</span> Wir nutzen Analyse-Tools zur Verbesserung der Benutzerfreundlichkeit unserer Software.  </li>
                    </ul>


                    <li className="font-bold">Wie verwenden wir Ihre personenbezogenen Daten? </li>


                    <p className='text-gray-700'>Wir verwenden Ihre Daten ausschließlich für die folgenden Zwecke:  </p>
                    <p className="font-semibold pl-5">Bereitstellung unserer Dienste: </p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li>Durchführung von Fußanalysen in Geschäften und Bereitstellung personalisierter Schuhempfehlungen.</li>

                        <li>Erstellung und Versand eines QR-Codes per E-Mail zur Nutzung unserer App.</li>

                        <li>Speicherung Ihrer Scan-Ergebnisse für zukünftige Beratungen.</li>

                        <li>Bereitstellung eines individuellen Kundenprofils zur besseren Betreuung.</li>
                    </ul>

                    <p className="font-semibold pl-5">Sicherheit und Betrugsprävention: </p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li>Schutz unserer Software vor unbefugtem Zugriff und Missbrauch. </li>
                        <li>Erkennung und Verhinderung betrügerischer Aktivitäten. </li>
                        <li>Sicherstellung der Datenintegrität und -sicherheit. </li>
                    </ul>

                    <p className="font-semibold pl-5">Marketing und Kommunikation: </p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li>Falls Sie zugestimmt haben, senden wir Ihnen Werbeangebote oder relevante Produktvorschläge.</li>
                        <li>Personalisierung unserer Marketingkommunikation basierend auf Ihren Interessen. </li>
                        <li>Bereitstellung von Service-Benachrichtigungen und Updates. </li>
                    </ul>

                    <p className="font-semibold pl-5">Analyse und Verbesserung: </p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li>Verbesserung der Benutzerfreundlichkeit unserer Software und Dienstleistungen. </li>
                        <li>Fehlerbehebung und Optimierung unserer Software. </li>
                        <li>Entwicklung neuer Funktionen basierend auf anonymisierten Nutzungsdaten.  </li>
                    </ul>

                    <li className="font-bold">Cookies und Tracking-Technologien</li>
                    <p className='text-sm text-gray-700 pl-5'>Unsere Software verwendet Cookies und ähnliche Technologien, um Nutzungsdaten zu erfassen und Ihnen ein optimiertes Erlebnis zu bieten. Sie können Ihre Cookie-Einstellungen jederzeit anpassen. </p>

                    {/* 5number  */}
                    <li className="font-bold">Weitergabe personenbezogener Daten</li>
                    <p className='  pl-5'>Wir geben personenbezogene Daten nur in folgenden Fällen weiter:</p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li><span className="font-semibold">Dienstleister:</span> Externe Anbieter, die uns beim Betrieb unserer Software unterstützen (z. B. Hosting, Zahlungsabwicklung, Analysen). </li>
                        <li><span className="font-semibold">Geschäfts- und Marketingpartner:</span> Falls Sie zustimmen, um relevante Angebote bereitzustellen. </li>
                        <li><span className="font-semibold">Gesetzliche Anforderungen: </span>Falls erforderlich, um gesetzliche Verpflichtungen zu erfüllen oder auf behördliche Anfragen zu reagieren. </li>

                    </ul>
                    <p className='text-gray-700'>Wir verkaufen oder vermieten keine personenbezogenen Daten an Dritte. </p>

                    {/* number 6 */}
                    <li className="font-bold">Ihre Rechte</li>
                    <p className='text-gray-700'>Je nach Standort haben Sie möglicherweise die folgenden Rechte: </p>
                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li><span className="font-semibold">Auskunft:</span> Sie können eine Kopie Ihrer gespeicherten personenbezogenen Daten anfordern.  </li>

                        <li><span className="font-semibold">Berichtigung:</span> Falls Ihre Daten ungenau oder unvollständig sind, können Sie deren Korrektur verlangen.  </li>

                        <li><span className="font-semibold">Löschung:</span> Sie haben das Recht, die Löschung Ihrer Daten zu beantragen. </li>


                        <li><span className="font-semibold">Einschränkung der Verarbeitung:</span> Sie können verlangen, dass wir die Verarbeitung Ihrer Daten einschränken.  </li>


                        <li><span className="font-semibold">Widerspruch:</span> Sie können gegen bestimmte Verarbeitungen Ihrer Daten Widerspruch einlegen. </li>

                        <li><span className="font-semibold">Widerruf der Einwilligung:</span> Falls die Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese jederzeit widerrufen. </li>
                    </ul>
                    <p className='text-gray-700'>Sie können diese Rechte ausüben, indem Sie uns über die unten angegebenen Kontaktinformationen erreichen. </p>

                    <li className='font-bold'>Sicherheit und Aufbewahrung Ihrer Daten</li>
                    <p className='text-gray-700'>Wir setzen angemessene technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten vor Verlust, Missbrauch oder unbefugtem Zugriff zu schützen. Ihre Daten werden nur so lange aufbewahrt, wie es für die Bereitstellung unserer Dienste erforderlich ist oder gesetzliche Anforderungen es verlangen. </p>

                    <li className='font-bold'>Internationale Datenübermittlung</li>
                    <p className='text-gray-700'>Falls wir Daten in Länder außerhalb der EU oder des EWR übertragen, stellen wir sicher, dass angemessene Schutzmaßnahmen vorhanden sind (z. B. durch Standardvertragsklauseln der EU-Kommission). </p>

                    <li className='font-bold'>Kontakt</li>
                    <p className='text-gray-700'>Falls Sie Fragen zu dieser Datenschutzrichtlinie haben oder eines Ihrer Rechte ausüben möchten, kontaktieren Sie uns unter: </p>

                    <ul className="list-disc pl-10 text-sm text-gray-700 space-y-2">
                        <li><span className='font-semibold'>E-Mail:</span> info@feetf1rst.com  </li>

                        <li><span className='font-semibold'>Adresse:</span> Pipenstraße 5, Bruneck, BZ, 39031, IT </li>
                    </ul>
                    <p className='text-gray-700'>Diese Datenschutzrichtlinie entspricht den Anforderungen der Datenschutz-Grundverordnung (DSGVO) und anderen geltenden Datenschutzgesetzen und wird regelmäßig überprüft, um sicherzustellen, dass sie den aktuellen gesetzlichen und geschäftlichen Anforderungen entspricht. </p>
                </ol>


            </div>
        </div>
    )
}
