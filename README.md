# AstroGlide

AstroGlide ist ein schnelles und spannendes Browser-Spiel, bei dem du deine Geschicklichkeit und Reaktionszeit unter Beweis stellen kannst. Ziel ist es, so viele Punkte wie möglich zu sammeln und dich in der Highscore-Liste ganz oben zu platzieren!

---

## Features

- Speicherung von Spielernamen und Punktzahlen in MySQL
- Einfaches und intuitives Gameplay
- Highscore-System mit Echtzeit-Punkte-Speicherung
- Schutz vor unerwünschten oder anstößigen Spielernamen durch eine umfassende Blacklist
- Sichere Punkteübertragung mittels Hash-basiertem Token-Verfahren
- Anzeige der Top 5 Highscores

---

## Installation & Nutzung

1. **Datenbank einrichten:**

   Erstelle eine MySQL-Datenbank (z.B. `astroglide`) und füge folgende Tabelle hinzu:

   ```sql
   CREATE TABLE IF NOT EXISTS astroglide (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       score INT NOT NULL,
       datum DATETIME NOT NULL
   );

2. **Konfiguration:**

   - Passe die Verbindungsdaten in `config.php` an deine Datenbank an.
   - Lade alle Dateien auf deinen Webserver hoch.

3. **Spiel starten:**

   - Rufe die Webseite auf, die das Spiel und den Scoreboard-Endpunkt enthält.
   - Punkte werden nach jedem Spiel automatisch gespeichert und können über das Scoreboard abgefragt werden.

---

## API Endpunkte

- `GET` Anfrage:
  - Gibt die Top 5 Highscores als JSON zurück.

- `POST` Anfrage:
  - Erwartet folgende POST-Parameter:
    - `dataname` (Spielername)
    - `datapunkte` (erzielte Punkte)
    - `timestamp` (Zeitstempel)
    - `datamaxfallspeed` (Token zur Validierung)
  - Speichert den Score, wenn alle Prüfungen erfolgreich sind.

---

## Sicherheit

- Der Name wird auf erlaubte Zeichen (Buchstaben, Zahlen, Unterstriche) geprüft.
- Es gibt eine umfangreiche Blacklist, die unerwünschte oder beleidigende Namen filtert.
- Die Punkte werden mit einem HMAC-SHA256 Hash verifiziert, um Manipulationen zu verhindern.

---

## Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe `LICENSE` für Details.

---

## Kontakt

Bei Fragen oder Problemen kannst du ein Issue im Repository öffnen oder mich direkt kontaktieren.

---

Viel Spaß beim Spielen und viel Erfolg auf der Highscore-Liste!
