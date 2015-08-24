import {customElement, bindable} from 'aurelia-framework';

@customElement('nav-bar')
export class NavBar {
  @bindable router = null;
}
