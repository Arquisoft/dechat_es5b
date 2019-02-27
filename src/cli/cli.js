const IdentityManager = require('../node_modules/@solid/cli/src/IdentityManager');
const SolidClient = require('../node_modules/@solid/cli/src/SolidClient');
const Core = require('./core');
const core = new Core(fetch);
const namespaces = require('./namespaces');

let userWebId;


showMainMenu();

function showMainMenu() {
    inquirer
      .prompt([
        {
          name: 'main-menu',
          type: 'list',
          message: 'What do you want to do?',
          choices: ['Log in', 'Quit'],
          'default': 0
        }
      ])
      .then(answers => {
        const item = answers['main-menu'];
  
        switch(item) {
          case 'Log in':
            login();
            break;
          case 'Quit':
            quit();
        }
      });
}

function showGameMenu() {
    inquirer
      .prompt([
        {
          name: 'game-menu',
          type: 'list',
          message: 'What do you want to do?',
          choices: ['New chat', 'Continue chat', 'Quit'],
          'default': 0
        }
      ])
      .then(answers => {
        const item = answers['game-menu'];
  
        switch (item) {
          case 'New chat':
            showNewGameMenu();
            break;
          case 'Continue chat':
            showContinueGameMenu();
            break;
          case 'Quit':
            quit();
        }
  
      });
}

async function showNewGameMenu() {
    const friends = {};
    const allFriends = await core.getAllObjectsFromPredicateForResource(userWebId, namespaces.foaf + 'knows');
  
    for (const friend of allFriends) {
      let name = await core.getFormattedName(friend.value);
  
      friends[name] = friend.value;
    }
  
    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: 'What is the name of the game?'
        }, {
          name: 'friend',
          type: 'list',
          message: 'Who is your friend',
          choices: Object.keys(friends)
        }
      ])
      .then(async answers => {
        oppWebId = friends[answers['friend']];
  
        askForDataUrl(async url => {
          userDataUrl = url;
          semanticGame = await core.setUpNewGame(userDataUrl, userWebId, oppWebId, null, answers['name'], dataSync);
  
          showGame();
        });
      });
}


async function showContinueGameMenu() {
    process.stdout.write('Loading your games...');
    const games = await core.getGamesToContinue(userWebId);
    const gamesMap = {};
  
    if (games.length > 0) {
  
      for (const game of games) {
        let name = await core.getObjectFromPredicateForResource(game.gameUrl, namespaces.schema + 'name');
  
        if (!name) {
          name = game.gameUrl;
        } else {
          name = name.value;
        }
  
        const loader = new Loader(fetch);
        const oppWebId = await loader.findWebIdOfOpponent(game.gameUrl, userWebId);
        const oppName = await core.getFormattedName(oppWebId);
  
        game.oppWebId = oppWebId;
        game.oppName = oppName;
        game.name = name;
  
        const str = `${name} (${oppName})`;
        gamesMap[str] = game;
      }
  
      clearLine();
  
      inquirer
        .prompt([
          {
            name: 'continue-game-menu',
            type: 'list',
            message: 'Which game do you want to continue?',
            choices: Object.keys(gamesMap).sort(),
            'default': 0
          }
        ])
        .then(async answers => {
          const gameName = answers['continue-game-menu'];
          const game = gamesMap[gameName];
  
          loadAndShowGame(game.gameUrl, game.storeUrl);
        });
    } else {
      readline.clearLine(process.stdout);
      readline.cursorTo(process.stdout, 0);
      console.log(`You don't have any games to continue.`);
      showGameMenu();
    }
}

  
function login() {
    inquirer
      .prompt([
        {
          name: 'username',
          type: 'input',
          message: 'What is your username?'
        }, {
          name: 'password',
          type: 'password',
          message: 'What is your password?'
        },{
          name: 'identityProvider',
          type: 'input',
          message: 'What is your identify provider?',
          'default': 'https://solid.community'
        }
      ])
      .then(async answers => {
        console.log('Logging in...');
        const {identityProvider, username, password} = answers;
  
        const identityManager = IdentityManager.fromJSON('{}');
        client = new SolidClient({ identityManager });
  
        try {
          session = await client.login(identityProvider, { username, password });
          userWebId = session.idClaims.sub;
          clearLine();
          console.log(`Welcome ${await core.getFormattedName(userWebId)}!`);
  
          showGameMenu();
        } catch(e) {
          console.error(`Something went wrong when logging in. Try again?`);
          showMainMenu();
        }
      });
}

function quit() {
    console.log('Thanks for playing, bye!');
    process.exit(0);
}




//EDIT-------------------------------------------------
function showGame() {
    printASCII();
  
    if (semanticGame.isOpponentsTurn()) {
      showOpponentsTurn();
    } else {
      showUsersTurn();
    }
  }
  
  function printASCII() {
    if (semanticGame.getUserColor() === 'w') {
      console.log(semanticGame.getChess().ascii());
    } else {
      const board = new Chess(semanticGame.getChess().fen()).board();
  
      process.stdout.write(`   +------------------------+\n`);
      for (let i = board.length - 1; i >= 0; i --) {
        for (let j = board[i].length - 1; j >= 0; j --) {
          if (j === board[i].length - 1) {
            process.stdout.write(` ${board.length - i} |`);
          }
  
          const square = board[i][j];
  
          if (square) {
            let piece = square.type;
  
            if (square.color === 'w') {
              piece = piece.toUpperCase();
            }
  
            process.stdout.write(` ${piece} `);
          } else {
            process.stdout.write(' . ');
          }
  
          if (j === 0) {
            process.stdout.write(`|\n`);
          }
        }
      }
  
      process.stdout.write(`   +------------------------+\n`);
      process.stdout.write(`     h  g  f  e  d  c  b  a\n\n`);
    }
  }