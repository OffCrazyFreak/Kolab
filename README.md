# Kolab

## Description
Web app for managing collaboration status records with companies per project.

## Visuals
*Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.*

## License
Licensed under GNU GPL v3 license.


## How to run

### Backend

1. Download and install [Java JDK 17](https://www.oracle.com/java/technologies/downloads/#jdk17-windows), [Gradle](https://gradle.org/install/) and [PostgreSQL](https://drive.google.com/file/d/1hChUO7OT8dlp7L3fN8c3vHBEvyK5QFE0/view?usp=sharing)
2. Create postgreSQL database with name `your_database_name` (for example `kolab-dev`)
3. Open Backend folder as project using your favorite editor
4. Add environment variables to project
    - In [Intellij IDEA](https://www.twilio.com/blog/set-up-env-variables-intellij-idea-java) (`SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/your_database_name; SPRING_DATASOURCE_USERNAME=your_superuser_username; SPRING_DATASOURCE_PASSWORD=your_superuser_password;`)
    - In [Eclipse](https://examples.javacodegeeks.com/java-development/desktop-java/ide/eclipse/eclipse-environment-variable-setup-example/)
5. Run and stop `BackendApplication` class in `src/main/java/com.example.backend` to create all relations (tables) in the database
6. Add initial user to database with command `INSERT INTO app_user (id, firstname, lastname, nickname, loginmail, notificationemail, authority, description) VALUES (0, 'YourName', 'YourSurname', 'YourNickname', 'IMPORTANTYourEmail@gmail.com',  'IMPORTANTYourEmail@gmail.com', 0, null);`
    
### Frontend

1. Download and install [node.js with npm](https://nodejs.org/en/download)
2. Open terminal and change current directory to Frontend: `cd Frontend`
3. Install node modules: `npm install .`
4. Start React app: `npm start`


## Dodatne upute za rad s git

### Postupak za rad na kodu.

#### Ažuriranje lokalnog repozitorija

Prebaci se na granu develop ili devdoc:

1. `git checkout develop/devdoc`

Povuci promjene s udaljenog repozitorija na svoj lokalni repozitorij:

2. `git pull`

#### Rad na promjenama

U lokalnom repozitoriju stvori novu vlastitu granu za rad:

3. `git checkout -b develop/devdoc-feature/bugfix-nazivFeaturea/nazivBugFixa`

*Unesi izmjene...*  
Dodaj sve izmjenjene datoteke u međupodručje:

4. `git add .`

Potvrdi sve promjene u međupodručju s opisnom porukom:

5. `git commit -m "Opisna poruka sto se promijenilo."`

#### Ponovno ažuriranje lokalnog repozitorija

Prebaci se na granu develop ili devdoc:

6. `git checkout develop/devdoc`

Povuci promjene s remote repozitorija na svoj lokalni repozitorij:

7. `git pull`

#### Spajanje promjena na vlastitoj grani

Prebaci se na vlastitu granu za rad:

8. `git checkout develop/devdoc-feature/bugfix-nazivFeaturea/nazivBugFixa`

Spoji promjene iz glavne grane (develop ili devdoc) na vlastitu granu:

9. `git merge develop/devdoc`

*Popravi konfilkte (ako postoje) i provjeri radi li sve...*
* *Više informacija o konfliktima na [linku](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) pod naslovom Basic Merge Conflicts.*

#### Spajanje promjena na glavnoj grani

Prebaci se na granu develop ili devdoc:

10.  `git checkout develop/devdoc`

Spoji promjene iz vlastite grane na glavnu granu (develop ili devdoc):

11.  `git merge develop/devdoc-feature/bugfix-nazivFeaturea/nazivBugFixa`

Izbriši vlastitu granu:

12.  `git branch -d develop/devdoc-feature/bugfix-nazivFeaturea/nazivBugFixa`

#### Ažuriranje udaljenog repozitorija

Spremi promjene na udaljeni repozitorij:

13.  `git push`

### Dodatne korisne naredbe

Prikaz svih grana na lokalnom repozitoriju:

`git branch -a`

Ažuriranje popisa grana lokalnog repozitorija s popisom grana udaljenog repozitorija:

`git remote update origin --prune`

ili

```
git branch -r | grep -v '\->' | sed "s,\x1B\[[0-9;]*[a-zA-Z],,g" | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
git fetch --all
git pull --all
```

* *Više informacija na linkovima: [1](https://stackoverflow.com/questions/36358265/when-does-git-refresh-the-list-of-remote-branches), [2](https://stackoverflow.com/questions/10312521/how-do-i-fetch-all-git-branches) i [3](https://stackoverflow.com/questions/17712468/what-is-the-difference-between-git-remote-update-git-fetch-and-git-pull).*

Brisanje grane na udaljenom repozitoriju:

`git push -d origin nazivGraneZaBrisanje`

* *Više informacija o brisanju grana na [linku](https://stackoverflow.com/questions/2003505/how-do-i-delete-a-git-branch-locally-and-remotely) prvi odgovor.*
