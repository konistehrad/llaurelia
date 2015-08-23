import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
  configureRouter(config, router){
    config.title = 'Aurelia';
    config.map([
      { route: '', redirect: 'cards' },
      { route: 'cards',      name: 'cards',     moduleId: 'kahn.lovelive/views/index',   nav: true, title:'Cards' },
    ]);

    this.router = router;
  }
}
