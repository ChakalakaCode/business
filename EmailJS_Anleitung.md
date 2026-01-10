# EmailJS Einrichtungsanleitung für mutlu.arabul97@gmail.com

Folgen Sie diesen Schritten, um das Kontaktformular mit EmailJS zu verbinden:

## 1. EmailJS Konto einrichten
1. Besuchen Sie https://www.emailjs.com/
2. Klicken Sie auf "Sign Up Free"
3. Registrieren Sie sich mit Ihrer Email: **mutlu.arabul9797@gmail.com**
4. Verifizieren Sie Ihre Email-Adresse

## 2. Gmail Service einrichten
1. Loggen Sie sich in Ihr EmailJS Dashboard ein
2. Gehen Sie zu "Email Services"
3. Klicken Sie auf "Add New Service"
4. Wählen Sie **Gmail** als Service
5. Geben Sie einen Namen ein: z.B. "WebPro Contact Service"
6. Klicken Sie auf "Connect account"
7. Melden Sie sich mit **mutlu.arabul97@gmail.com** an
8. Erlauben Sie den Zugriff für EmailJS
9. Notieren Sie sich die **Service ID** (z.B. service_xxxxxxxxx)

## 3. Email Template erstellen
1. Gehen Sie zu "Email Templates"
2. Klicken Sie auf "Create New Template"
3. Verwenden Sie dieses Template:

**Betreff:** Neue Kontaktanfrage von {{from_name}}

**Inhalt:**
```
Hallo,

Sie haben eine neue Kontaktanfrage über Ihre Website erhalten:

---
Kundendaten:
Name: {{from_name}}
Unternehmen: {{from_company}}
E-Mail: {{from_email}}
Telefon: {{from_phone}}

Nachricht:
{{message}}

Gesendet am: {{timestamp}}
---

Viele Grüße,
Ihr WebPro Design Kontaktformular
```

4. Klicken Sie auf "Save"
5. Notieren Sie sich die **Template ID** (z.B. template_xxxxxxxxx)

## 4. Public Key finden
1. Gehen Sie zu "Account" in Ihrem EmailJS Dashboard
2. Kopieren Sie Ihre **Public Key** (beginnt mit "B_")

## 5. Konfiguration eintragen
Öffnen Sie die Datei `script.js` und ersetzen Sie die Platzhalter:

```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'IHRE_PUBLIC_KEY',     // Hier Ihre Public Key eintragen
    SERVICE_ID: 'IHRE_SERVICE_ID',     // Hier Ihre Service ID eintragen  
    TEMPLATE_ID: 'IHRE_TEMPLATE_ID'     // Hier Ihre Template ID eintragen
};
```

Beispiel mit echten Werten:
```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'B_xxxxxxxxxxxxxxxxxxxxxxx',
    SERVICE_ID: 'service_xxxxxxxxx',
    TEMPLATE_ID: 'template_xxxxxxxxx'
};
```

## 6. Testen
1. Laden Sie die Website neu
2. Füllen Sie das Kontaktformular aus
3. Prüfen Sie Ihren Gmail-Posteingang (auch Spam-Ordner)

## Wichtige Hinweise für Gmail
- Das kostenlose EmailJS-Konto bietet 200 Emails/Monat
- Gmail hat ein tägliches Sendelimit (ca. 500 Emails)
- Für höhere Volumen können Sie ein Transactional Service in Betracht ziehen
- Die Emails werden von Ihrer Gmail-Adresse gesendet

## Funktionsweise
- Bei erfolgreichem Versand erhalten Sie eine Email mit allen Formulardaten
- Die Daten werden zusätzlich im Admin-Dashboard gespeichert
- Bei Fehlern wird eine lokale Sicherung erstellt
- Benutzer erhalten eine Erfolgsmeldung

## Sicherheit
- Ihre Email-Adresse ist nicht im Code sichtbar
- Die Kommunikation läuft über sichere EmailJS-Server
- Kein Backend erforderlich
