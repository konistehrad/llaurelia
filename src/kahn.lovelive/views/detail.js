import {inject} from 'aurelia-framework';
import {LogManager} from 'aurelia-framework';
import {CardStore} from '../models/cardstore';
import 'fetch';

const logger = LogManager.getLogger('card-detail-viewmodel');

export class CardDetail {
    heading = 'Idol Detail: ';
    get cards() { return CardStore.cards; }
    get cardLength() { return this.cards.length; }
    get totalLength() { return CardStore.totalLength; }
    get isFetching() { return CardStore.isFetching; }

    constructor(){
        this.__scrolled = this.__scrolled.bind(this);
    }

    attached() {
        this.__pageHostEl.addEventListener('scroll', this.__scrolled);
    }


    detached() {
        this.__pageHostEl.removeEventListener('scroll', this.__scrolled);
    }

    __checkScroll() {
        var element = this.__pageHostEl;
        if( element.scrollHeight - element.scrollTop === element.clientHeight ) {
            this.pullNext();
        }
    }

    __scrolled(ev) {
        this.__checkScroll();
    }

    async activate(){
        return this.pullNext(true);
    }

    async pullNext(force = false) {
        await CardStore.pullNext(force);
        this.__checkScroll();
    }

    get __pageHostEl() {
        return document.querySelector('.page-host');
    }

}

