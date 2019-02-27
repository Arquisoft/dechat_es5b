const winston = require('winston');
const namespaces = require('./namespaces');
const Q = require('q');
const rdfjsSourceFromUrl = require('./rdfjssourcefactory').fromUrl;
const newEngine = require('@comunica/actor-init-sparql-rdfjs').newEngine;

class SolidChatCore {

    constructor(fetch) {
        this.inboxUrls = {};
        this.fetch = fetch;
        this.alreadyCheckedResources = [];
        this.logger = winston.createLogger({
          level: 'error',
          transports: [
            new winston.transports.Console(),
          ],
          format: winston.format.cli()
        });
      };

      async getFormattedName(webid) {
        let formattedName = await this.getObjectFromPredicateForResource(webid, namespaces.foaf + 'name');
    
        if (!formattedName) {
          formattedName = null;
          const firstname = await this.getObjectFromPredicateForResource(webid, namespaces.foaf + 'givenName');
          const lastname = await this.getObjectFromPredicateForResource(webid, namespaces.foaf + 'lastName');
    
          if (firstname) {
            formattedName = firstname;
          }
    
          if (lastname) {
            if (formattedName) {
              formattedName += ' ';
            } else {
              formattedName = '';
            }
    
            formattedName += lastname;
          }
    
          if (!formattedName) {
            formattedName = webid;
          }
        } else {
          formattedName = formattedName.value;
        }
    
        return formattedName;
      }

     async getAllObjectsFromPredicateForResource(url, predicate) {
        const deferred = Q.defer();
        const rdfjsSource = await rdfjsSourceFromUrl(url, this.fetch);
    
        if (rdfjsSource) {
          const engine = newEngine();
          const objects = [];
    
          engine.query(`SELECT ?o {
        <${url}> <${predicate}> ?o.
      }`,
            {sources: [{type: 'rdfjsSource', value: rdfjsSource}]})
            .then(function (result) {
              result.bindingsStream.on('data', function (data) {
                data = data.toObject();
    
                objects.push(data['?o']);
              });
    
              result.bindingsStream.on('end', function () {
                deferred.resolve(objects);
              });
            });
        } else {
          deferred.resolve(null);
        }
    
        return deferred.promise;
     }

     async setUpNewGame(userDataUrl, userWebId, opponentWebId, startPosition, name, dataSync) {
        const gameUrl = await this.generateUniqueUrlForResource(userDataUrl);
        const semanticGame = new SemanticChat({
          url: gameUrl,
          moveBaseUrl: userDataUrl,
          userWebId,
          opponentWebId,
          name,
          startPosition,
        });
        const invitation = await this.generateInvitation(userDataUrl, semanticGame.getUrl(), userWebId, opponentWebId);
    
        try {
          await dataSync.executeSPARQLUpdateForUser(userDataUrl, `INSERT DATA {${semanticGame.getMinimumRDF()} \n <${gameUrl}> <${namespaces.storage}storeIn> <${userDataUrl}>}`);
        } catch (e) {
          this.logger.error(`Could not save new game data.`);
          this.logger.error(e);
        }
    
        try {
          await dataSync.executeSPARQLUpdateForUser(userWebId, `INSERT DATA { <${gameUrl}> <${namespaces.schema}contributor> <${userWebId}>; <${namespaces.storage}storeIn> <${userDataUrl}>.}`);
        } catch (e) {
          this.logger.error(`Could not add chess game to WebId.`);
          this.logger.error(e);
        }
    
        try {
          await dataSync.executeSPARQLUpdateForUser(userDataUrl, `INSERT DATA {${invitation.sparqlUpdate}}`);
        } catch (e) {
          this.logger.error(`Could not save invitation for game.`);
          this.logger.error(e);
        }
    
        try {
          await dataSync.sendToOpponentsInbox(await this.getInboxUrl(opponentWebId), invitation.notification);
        } catch (e) {
          this.logger.error(`Could not send invitation to opponent.`);
          this.logger.error(e);
        }
    
        return semanticGame;
      }

      async generateUniqueUrlForResource(baseurl) {
        let url = baseurl + '#' + uniqid();
    
        try {
          let d = this.getObjectFromPredicateForResource(url, namespaces.rdf + 'type');
    
          // We assume that if this url doesn't have a type, the url is unused.
          // Ok, this is not the most fail-safe thing.
          // TODO: check if there are any triples at all.
          while (d) {
            url = baseurl + '#' + uniqid();
            d = await this.getObjectFromPredicateForResource(url, namespaces.rdf + 'type');
          }
        } catch (e) {
          // this means that response of data[url] returns a 404
          // TODO might be called when you have no access, should check
        } finally {
          return url;
        }
      }

}