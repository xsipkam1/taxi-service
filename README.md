# WEBOVÁ APLIKÁCIA PRE SPRÁVU TAXISLUŽBY
Michal Šípka 2024

Aplikácia je funkčná a poskytuje tri perspektívy - administrátor, vodič a zákazník. Administrátor má možnosť spravovať celú taxislužbu, vrátane pridávania a odstraňovania vodičov a zákazníkov, ako aj monitorovania výkonu taxislužby. Zákazníci môžu vyhľadávať nové jazdy na základe svojich preferencií, vytvárať až tri typy objednávok - rýchla jazda, objednávka konkrétneho vodiča alebo vozidla, ohodnotiť dokončené jazdy, sledovať proces vybavenia svojich objednávok a spravovať svoj profil. Vodiči môžu prijímať alebo zamietať objednávky jázd, sledovať recenzie od zákazníkov, pozorovať svoje nadchádzajúce jazdy a históriu svojich jázd a spravovať svoj profil.

## Zákazník

Na to, aby sa používateľ stal zákazníkom a mohol si objednávať jazdy, sa musí najprv zaregistrovať a potom prihlásiť. Po prihlásení mu systém umožní vykonávať všetky akcie,
ktoré sú zhrnuté vo funkcionálnych požiadavkách.

#### Funkcionálne požiadavky zákazníka:

* vyhľadanie dostupných vodičov a vozidiel pre danú trasu v daný čas s určitým počtom cestujúcich,
* vytvorenie objednávky hromadne alebo na základe konkrétneho vodiča alebo vozidla,
* prezeranie osobného profilu spolu s možnosťami spravovať profil - zahŕňa zmenu profilovej fotky, vymazanie profilovej fotky, vymazanie profilu a zmenu hesla,
* prezerať zoznam aktívnych objednávok - zahŕňa objednávky čakajúce na potvrdenie vodičom a objednávky akceptované vodičom, pričom objednávky, ktoré doposiaľ neboli potvrdené vodičom, môže zákazník zrušiť,
* prezerať osobnú históriu objednávok - zahŕňa objednávky, ktoré vodiči zamietli alebo nepotvrdili včas a objednávky, ktoré boli úspešne dokončené, pričom pri úspešne dokončených jazdách môže zákazník zanechať recenziu pre vodiča a neskôr ju zmeniť.

## Vodič

Ak sa chce používateľ stať vodičom danej taxislužby, musí najprv na hlavnej stránke podať žiadosť prostredníctvom formulára. Táto žiadosť sa zobrazí v administrátorovej sekcii pre spravovanie vodičov, kde sa môže administrátor rozhodnúť, či žiadosť akceptuje alebo zamietne. Po prijatí žiadosti vytvorí administrátor profil pre vodiča, ktorý sa už potom môže prihlásiť do systému. Po prihlásení môže vykonávať všetky akcie, ktoré sú zhrnuté vo funkcionálnych požiadavkách.

#### Funkcionálne požiadavky vodiča:

* prezeranie osobného profilu spolu s recenziami a možnosťami spravovať profil - zahŕňa zmenu profilovej fotky, vymazanie profilovej fotky, vymazanie profilu a zmenu hesla,
* prezerať zoznam aktívnych objednávok - zahŕňa všetky už prijaté, resp. nadchádzajúce jazdy a žiadosti o jazdu od zákazníkov, pričom vodič má schopnosť túto žiadosť prijať alebo zamietnuť,
* prezerať osobnú históriu objednávok - zahŕňa objednávky, ktoré vodič zamietol alebo nepotvrdil včas a úspešne dokončené objednávky, pričom pri dokončených jazdách si môže prezerať recenziu od zákazníka, ak nejakú zanechal.

## Administrátor

Administrátor sa priamo registrovať nedá. Administrátorom môže byť len ten používateľ, ktorý má prístup k zdrojovému kódu alebo k databáze. Jeden administrátor sa však už predvolene v systéme nachádza a po prihlásení môže vykonávať všetky akcie, ktoré sú zhrnuté vo funkcionálnych požiadavkách. 

#### Funkcionálne požiadavky administrátora:

* prezeranie celkového výkonu taxislužby,
* prezeranie a spravovanie uchádzačov o pracovnú pozíciu vodiča - zahŕňa akceptovanie alebo zamietnutie žiadosti, pričom pri akceptovaní musí vytvoriť nový profil vodiča,
* prezeranie a spravovanie aktuálnych vodičov, pričom sa môže nastaviť nová cena/km, nové vozidlo alebo vymazať profil alebo recenzia na profile vodiča,
* prezeranie zákazníkov a možnosť vymazania ich profilu.

# INŠTALAČNÁ PRÍRUČKA

K úspešnému spusteniu aplikácie je potrebné mať v systéme nainštalované:
* MySQL server (verzia 8.0.34)
* Java (verzia 17)
* IntelliJ IDEA
* Visual Studio Code
* MySQL Workbench
* Node Package Manager

Taktiež je potrebné mať vytvorený účet na Mapbox API a Cloudinary API:
* https://www.mapbox.com/
* https://cloudinary.com/

## Postup:
1. Vytvorenie MySQL databázy
* V MySQL Workbench vytvoriť novú databázu pomocou príkazu CREATE DATABASE nazovdatabazy;

2. Nastavenie Spring Boot aplikácie pre prístup k MySQL databáze
* V adresári v súbore bc-backend/src/main/resources/application.properties nahradiť spring.datasource.username=meno a spring.datasource.password=heslo skutočným prihlasovacím menom a heslom pre prístup k MySQL databáze
* V adresári v súbore bc-backend/src/main/resources/application.properties nahradiť spring.datasource.url=jdbc:mysql://localhost:3306/nazovdatabazy skutočným názvom MySQL databázy

3. Nastavenie React aplikácie pre prístup k Mapbox API a Cloudinary API
* Otvoriť terminál a napísať príkaz npm i (stiahne všetky potrebné balíky)
* V koreňovom adresári vytvoriť súbor s názvom .env.local
* Do súboru .env.local treba vložiť následujúci text a nahradiť mapbox_token, meno_cloudinary_cloudu a meno_cloudinary_presetu skutočnými hodnotami tokenov z Mapboxu a Cloudinary:
VITE_TOKEN = ’pk.mapbox_token’
VITE_CLOUD_NAME = ’meno_cloudinary_cloudu’
VITE_CLOUD_PRESET = ’meno_cloudinary_presetu’

4. Spustenie aplikácie
* Spustiť Spring Boot server v Intellij IDEA (Shift+F10)
* Spustiť React aplikáciu cez Visual Studio Code - v termináli zadať príkaz npm run dev
* Otvoriť prehliadač a zadať adresu http://localhost:5173/