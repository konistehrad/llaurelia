import {HttpClient} from 'aurelia-fetch-client';
import {LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('cardstore');  // eslint-disable-line no-unused-vars
const linkParser = document.createElement('a');
class CardStore {
    __allCards = new Map();
    __matchedIds = [];
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

    async initialize() {

    }

    async getIdol(id) {

    }

    async setFilters(filters) {


    }

    async clearFilters() {

    }

    async pullNext() {
        if( !this.__isInitialized ) {
            await this.initialize();
        }

        if( this.__isFetching || !this.__hasNext ) {
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

    async __pullLoop() {
        while( this.__hasNext ) {
            await this.pullNext();
        }
    }

    __ensureInitialized() {
        // if( !this.__isInitialized ) {
            // this.__pullLoop();
        // }
    }


    get cards() {
        return this.__cards;
    }

    get matchedCards() {
        return this.__cards;
    }

    get rawCards() { 
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

    get __hasNext() {
        return this.__nextSearch !== null;
    }

    get __isInitialized() {
        return this.__cards.length > 0 || this.__isFetching;
    }
}

var instance = new CardStore();
export { instance as CardStore };

