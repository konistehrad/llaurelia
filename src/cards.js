import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Cards {
    heading = 'Love Live Cards';
    cards = [];
    nextSet = null;

    constructor(http){
        http.configure(config => {
          config
            .useStandardConfiguration()
            .withBaseUrl('http://schoolido.lu/api/');
        });

        this.http = http;
    }

    async activate(){
        return this.pullNext(true);
    }

    async pullNext(force = false) {
        if( this.nextUrl === null && !force ) {
            return Promise.resolve();
        }

        var response = await this.http.fetch('cards');
        var json = await response.json();
        this.nextSet = json.next;
        this.cards.push(...json.results);
    }
}

