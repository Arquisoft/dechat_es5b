const URI = require('uri-js');

class DataSync {

  constructor(fetch) {
    this.fetch = fetch;

    //this._setUpListeningForChangesOfInbox();
  }

  createEmptyFileForUser(url) {
    return this.fetch(url, {
      method: 'PUT',
      body: ''
    });
  }

  deleteFileForUser(url) {
    return this.fetch(url, {
      method: 'DELETE'
    });
  }


  executeSPARQLUpdateForUser(url, query) {
    return this.fetch(url, {
      method: 'PATCH',
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    });
  }

  sendToOpponentsInbox(url, data) {
    return this.fetch(url, {
      method: 'POST',
      body: data
    });
  }

  _setUpListeningForChangesOfInbox() {
    const hostname = URI.parse(this.userInboxUrl).host;
    const socket = new WebSocket(`wss://${hostname}/`);

    socket.onopen = function() {
    	this.send(`sub ${this.userInboxUrl}`);
    };

    socket.onmessage = function(msg) {
    	if (msg.data && msg.data.slice(0, 3) === 'pub') {
        console.log(msg);
    	}
    };
  }
}

module.exports = DataSync;