# 2026W1-OTK

## Contributors
- Ahmad Abu-Shaqra (aabu0012@student.monash.edu)
- Immanuel Amalraj (iama0001@student.monash.edu)
- Kayden Nguyen (kngu0087@student.monash.edu)
- Nathan Bu (nbuu0001@student.monash.edu)
- Hydar Rabiaa (hrab0004@student.monash.edu)
- Maheshan Peiris (mpei0013@student.monash.edu)
- Joshua Gong (jgon0030@student.monash.edu)
- Nathan Yeoh (nyeo0003@student.monash.edu)
- Iris Neerakal (inee0001@student.monash.edu)
- Eric Blyth (ebly0002@student.monash.edu)
- Jordan Lee Russo (jrus0025@student.monash.edu)
- Justin La         (jlaa0008@student.monash.edu)
- Jasmine Paskah Wang (jwan0518@student.monash.edu)
- Gia Thinh Nguyen (gngu0011@student.monash.edu)

# Infrastructure & Architecture

The OTK project makes use of the MeteorJS framework, which is a real-time fullstack framework that runs using NodeJS. 

For more information about MeteorJS, refer to the MeteorJS docs:  
[https://docs.meteor.com/about/what-is.html](https://docs.meteor.com/about/what-is.html) 

Due to using MeteorJS, the project makes use of the NoSQL database MongoDB to store data. For more information about the database see the [Database](#database) section, which covers the structure of the save data.

There are also several plugins that are used to allow for easier and more consistent development. All these plugins already come installed with the project, so no further configuration nor changes are needed.  
TailwindCSS is a utility-first CSS framework that is used for the styling of the project.  
Motion is an animation library for React that is used for all animations in the project.  
Bcrypt is a hashing library used to encrypt user passwords.

## Frameworks and Plugins Used

Below is a full list of frameworks and plugins being used in the OTK project:

- MeteorJS  
- TailwindCSS  
- Motion  
- MongoDB  
- Bcrypt

The production deployment is hosted on Railway and can be accessed at:

[https://2026w1-otk-production.up.railway.app/](https://2026w1-otk-production.up.railway.app/)

# Game Architecture

OTK (OneTurnKill) is a card-based game where the player progresses through a series of stages by building a deck and defeating enemies within one turn.

## Deck Builder

Before starting a run, the player uses the deck builder to construct their deck.

The player must select 15 cards. The deck builder is divided into two main areas:

* **Current Deck** – displays the cards currently selected by the player.  
* **Available Cards** – displays cards that can be added to the deck.

Clicking a card in the Available Cards section adds it to the current deck. Clicking a card in the Current Deck section removes it from the deck.

Once the player has constructed their deck, they can start a run.

## Stages

A stage represents the player's progression through the sequence of bosses in a run. Each stage contains an enemy encounter that the player must defeat before progressing to the next stage.

The game continues until the player completes the required stages and finishes the run.

## Saving

Player progress is automatically saved during gameplay. The current game state is stored in the database so that the player can resume their progress without manually creating a save.

# Codebase Structure

As mentioned previously, this project uses MeteorJS and is structured similarly to most MeteorJS projects. This section will highlight key folders in the repository.  
In this section, it should be assumed that each file path will be beginning from the repository’s root folder.

## Client

The first notable folder is /client/, this folder contains the main HTML, CSS and JSX files that will be run. Notably, this is where TailwindCSS is imported and is where the website title and logo are defined.

## Imports

The most notable folder is /imports/, this folder contains the game code, the website code and the code that interfaces with the database, all in named subfolders.

### API

The /imports/api/ folder contains the code to interface with the database and is responsible for saving and reading information to and from the database collections.  
Any new code responsible for interfacing with external API endpoints should be located here, in an appropriately named subfolder.

### Engine

The /imports/engine/ folder contains the game code, this includes the code for the cards, the enemies, the player character, the deck builder and the game engine itself.  
All code for new cards and enemies should be located here, in the appropriately named subfolders.

### UI

The /imports/ui/ folder contains the code for the UI elements being displayed during the game. This includes the visual elements and the sound engine. These elements are later imported into the actual game itself for display.  
App.jsx, located in this folder, is the entry point for this project, it is the page that is directly displayed to the browser.  
Any new UI elements should be located here, in an appropriately named subfolder.

## Public/Assets

The /public/assets/ folder contains the assets for the game, this includes the art for the cards, enemies, backgrounds and player and all the game audio.  
Any new game assets should be located here, in an appropriately named subfolder.

## Test

The project contains both unit tests and integration tests.

Integration tests are located in /tests/, with tests/main.js responsible for importing the required test files.

Unit tests should be located in the same directory as the component or feature being tested. Unit test filenames should match the original file with .tests added before the file extension.

For example:

NoteItem.jsx  
NoteItem.tests.jsx

The test must also be imported into /tests/main.js where required.

## Project Structure Rules 

The following conventions should be followed when extending the project:

1. Use **one method per file**.  
2. Use **one publication per file**.  
3. When adding a file, import it into the nearest index.js.  
4. Create a new folder under /imports/api/ when adding a new feature.  
5. Keep unit tests in the same folder as the component or feature they test.  
6. Name unit test files using the original filename followed by .tests.  
7. Ensure new tests are imported through tests/main.js.

# Database

The OTK project makes use of the NoSQL database MongoDB to store game data. There are two main collections found in the system, those being users and userData.

It is recommended to download [Mongo Shell](https://www.mongodb.com/try/download/shell), or MongoSH, to be able to see the contents of the database using the command line.  
Once installed, ensure that the project is running and run the following command in another terminal window: mongosh mongodb://127.0.0.1:3001/meteor. This will open the mongosh terminal which allows for checking of the database contents.  
To see all collections run the following commander: show collection  
To see the contents of a specific collection run the following command: db.\<collectionName\>.find(), where \<collectionName\> is the name of the collection.

## users Collection

The users collection is used by the MeteorJS accounts system. This ensures that each user can only access their own save game. The majority of this collection is handled by MeteorJS. However, the password stored here is encrypted thanks to the Node Bcrypt library.  
Additionally, the \_id field in this collection is used for reference purposes in the userData collection, linking a logged in account to its game save data.

## userData Collection

The userData collection is used to store the game state and save data for a specific user.  
The userId field is used to associate an entry with a specific entry in the users collection.  
The nextDeck array houses the state of the deck currently made in the deckbuilder, for use in the next run.  
The gameState array houses the state of the user’s current run, including their deck, hand and enemy. The baseDeck array here is used to store the base state of the deck, to be used to reload the actual deck when transitioning to another stage. 

# Project Setup

## Local Setup

In order to setup the project locally, you will need to follow these steps:

1. Download and install [NodeJS](https://nodejs.org/en/download), the latest LTS version is recommended  
2. Verify the installation by running: node \--version and npm \--version in a terminal window. Both these commands such print a version number  
3. Download and install MeteorJS by running the following command in a terminal window: npx meteor  
4. This should install Meteor CLI globally. Verify the installation by running: meteor \--version. This should print a version number  
5. Clone the code repository locally by running the following command: git clone https://github.com/Monash-FIT3170/2026W1-OTK.git \<filePath\>. Where \<filePath\> is the path to the folder where the project will be cloned to  
6. Open a terminal window in the folder where the project was cloned  
7. Run the following command to start the project: meteor run

## Web Server Deployment

The production application is hosted on **Railway** and is connected to the project's GitHub repository. Deployments are automatically triggered when changes are pushed to the configured GitHub branch.

The application is containerised using **Docker** and managed using **Docker Compose**. A Docker volume is used for persistent data storage so that data is retained between container restarts or redeployments.

### **Deployment Process**

1. Make and test changes locally.  
2. Commit and push changes to the configured GitHub branch.  
3. Railway automatically detects the new commit and starts a deployment.  
4. Railway builds and deploys the application using the project's Docker configuration.  
5. Check the Railway deployment logs to confirm that the deployment completed successfully.

The production application can be accessed at:

[https://2026w1-otk-production.up.railway.app/](https://2026w1-otk-production.up.railway.app/) 

The Dockerfile and Docker Compose configuration should not be modified unnecessarily, as changes to these files can affect the production deployment.

# Adding Game Content

The game is designed so that new game content can be added by extending the existing base classes and registering the new content with the appropriate systems.

## Adding Cards

New cards should extend the base Card class located at:

/imports/engine/card/Card.ts

Create the new card in the /imports/engine/card/ directory and follow the implementation of existing cards. The card should then be added to CardRegistry.js so that it can be recognised and used by the game.

Card artwork should be placed in:

/public/sprites/cards

## Adding Enemies

New enemies should extend the base Enemy class located at:

/imports/engine/enemy/Enemy.js

Create the new enemy in /imports/engine/enemy/ and follow the structure of existing enemies. The enemy should then be added to EnemyRegistry.js.

Enemy artwork should be placed in:

/public/sprites/enemies

## Adding Background Scenes

Background scenes are managed using the stage background lookup table in stage.ts.

To add a new background:

1. Add the background asset to /public/images/.  
2. Import the asset where required.  
3. Add it to the background lookup table in stage.ts.  
4. Associate the background with the appropriate stage.

## Adding Sound

Game audio is managed through the SoundManager.

New sound assets should be placed in:

/public/sounds/

The new sound should then be imported/registered through the SoundManager where appropriate.

## General Guidelines

When adding new game content, use existing implementations as templates. This helps maintain consistency with the existing architecture and reduces the risk of introducing incompatible behaviour.

Any new files should follow the project's existing naming and organisation conventions. If the new content requires an API feature, follow the API structure described in the Codebase Structure section.

# Common Issues

- In order for the meteor run command to work, the file path to the folder in which the project was cloned cannot contain any spaces  
- If XAMPP is installed, you will need to stop all services running with it to ensure that Meteor can correctly run the application
