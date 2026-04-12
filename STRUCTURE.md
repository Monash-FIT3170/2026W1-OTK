# OTK — Project Structure

```
otk/
  public/
    sounds/
    images/
  client/
    main.jsx              
  server/
    main.js               
  tests/                  mirrors imports/ exactly
    engine/
    api/
    ui/
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
- Every file in `imports/` has a matching test in `tests/`
- New feature → new folder under `api/`