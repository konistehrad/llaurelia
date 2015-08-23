import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {LogManager} from 'aurelia-framework';
import {CardStore} from '../models/cardstore';
import 'fetch';

const logger = LogManager.getLogger('cards-viewmodel');

@inject(HttpClient)
export class Cards {
    heading = 'Love Live Cards';
    get cards() { return CardStore.cards; }
    get isFetching() { return CardStore.isFetching; }

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
        return this.pullNext(true);
    }

    async pullNext(force = false) {
        return CardStore.pullNext(force);
    }

}

