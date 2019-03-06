const fileClient = require('solid-file-client');

class chatManager{

    constructor(idp){
        fileClient.login(idp).then( webId => {
            console.log( `Logged in as ${webId}.`)
        }, err => console.log(err) );
    }

    createChatFolder() {
        var url ="https://uo258367.comocomer.es:8443/public/";
        fileClient.createFolder(url).then(success => {
            console.log(`Created folder ${url}.`);
          }, err => console.log(err) );
    }

    writeMessage(){
        var URL="https://uo258367.comocomer.es:8443/public/chatTest";
        var content="Hello world!";
        var contentType="Text";
        fileClient.createFile(URL,content,contentType).then( fileCreated => {
            console.log(`Created file ${fileCreated}.`);
          }, err => console.log(err) );
    }

    readMessage(){

    }

    test(){
        this.createChatFolder();
        this.writeMessage();
    }

    showMenu() {
        inquirer
          .prompt([
            {
              name: 'menu',
              type: 'list',
              message: 'What do you want to do?',
              choices: ['Test', 'Quit'],
              'default': 0
            }
          ])
          .then(answers => {
            const item = answers['game-menu'];
      
            switch (item) {
              case 'Test':
                this.test();
                break;  
              case 'Quit':
                quit();
            }
      
          });
      }

      quit() {
        console.log('Thanks for playing, bye!');
        process.exit(0);
      }

}

var chat = new chatManager("https://comocomer.es:8443/");

