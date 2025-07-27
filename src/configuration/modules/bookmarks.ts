import {Module} from '../interface';

export default class Bookmarks implements Module {

  name: string;

  constructor() {
    this.name = 'BookmarksModule';
  }

  render(div: HTMLDivElement, config: object): void {
    console.log(div, config);
    throw new Error("Method not implemented.");
  }

}
