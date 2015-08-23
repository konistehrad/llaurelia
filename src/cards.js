import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {LogManager} from 'aurelia-framework';
import 'fetch';

const logger = LogManager.getLogger('cards-viewmodel');
const linkParser = document.createElement('a');

@inject(HttpClient)
export class Cards {
    heading = 'Love Live Cards';
    cards = [];
    nextSearch = '';
    isFetching = false;

    constructor(http){
        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('http://schoolido.lu/api/');
        });

        this.http = http;
        this.__scrolled = this.__scrolled.bind(this);
    }

    __scrolled(ev) {
        var element = ev.target;
        if( element.scrollHeight - element.scrollTop === element.clientHeight ) {
            this.pullNext();
        }
    }

    attached() {
        document.querySelector('.page-host').addEventListener('scroll', this.__scrolled);
    }


    detached() {
        document.querySelector('.page-host').removeEventListener('scroll', this.__scrolled);
    }

    async activate(){
        this.__clear();
        return this.pullNext(true);
    }

    async pullNext(force = false) {
        if( this.isFetching || (this.nextSearch === null && !force) ) {
            return Promise.resolve();
        }

        var fetchme = `cards${this.nextSearch}`;
        // logger.debug(`Fetching API: ${fetchme}`);
        this.isFetching = true;
        var response = await this.http.fetch(fetchme);
        var json = await response.json();
        if( json.next !== null ) {
            linkParser.href = json.next;
            this.nextSearch = linkParser.search;
        } else {
            this.nextSearch = null;
        }
        this.cards.push(...json.results);
        this.isFetching = false;
    }

    __clear() {
        // http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
        this.cards.length = 0; // I can't believe it
        this.nextSearch = '';
    }
}

