# OTK — Project Structure

```
otk/
  docs/                   documentation
    /testing              example code snippets for writing frontend and backend tests
  .github/                GitHub Actions
  public/
    sounds/
    images/
  client/
    main.jsx              
  server/
    main.js               
  tests/                  integration tests (unit tests belong in relevant folders)
    main.js               unit test imports
  imports/
    engine/               game logic
      card/
        Card.js
        CardRegistry.js
      enemy/
        Enemy.js
        EnemyRegistry.js
      GameEngine.js
      DeckBuilder.js
    api/                  {feature}/{methods,publications, collections}
      {feature}/          
        publications.js
        methods/          
          {action}.js
          index.js        imports all methods in this folder
        collections/
          {Name}.js
          index.js        imports all collections in this folder
        index.js          imports methods/, collections/, publications
    ui/                   
      hooks/              custom hooks
      screens/            e.g. main menu, stage, game end pages
      components/
```

## Rules
- One method per file, one publication per file
- When you add a file, add it to the nearest `index.js`
- All unit tests are written in the same folder as the component / feature
- Name unit test file the same as the original (eg. testing NoteItem.jsx => NoteItem.tests.jsx)
- Import the path to the test in tests/main.js
- New feature → new folder under `api/`