import {HttpClient} from 'aurelia-fetch-client';
import {LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('cardstore');
const linkParser = document.createElement('a');
class CardStore {
	__cards = [];
	__nextSearch = '';
	__totalLength = 0;
	__isFetching = false;

	constructor() {
		var http = new HttpClient();
        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('http://schoolido.lu/api/');
        });

        this.http = http;
	}

    clear() {
        // http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
        this.__cards.length = 0; // I can't believe it
        this.__nextSearch = '';
    }

    async pullNext(force = false) {
        if( this.__isFetching || (this.__nextSearch === null && !force) ) {
            return Promise.resolve();
        }

        var fetchme = `cards${this.__nextSearch}`;
        this.__isFetching = true;

        var response = await this.http.fetch(fetchme);
        var json = await response.json();

        this.__totalLength = json.count;
        if( json.next !== null ) {
            linkParser.href = json.next;
            this.__nextSearch = linkParser.search;
        } else {
            this.__nextSearch = null;
        }
        this.cards.push(...json.results);
        this.__isFetching = false;
    }


    get cards() {
        return this.__cards;
    }

    get length() {
    	return this.__cards.length;
    }

    get totalLength() {
        return this.__totalLength;
    }

	get isFetching() {
		return this.__isFetching;
	}
}

var instance = new CardStore();

export { instance as CardStore };

