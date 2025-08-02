import { ConfigurationLink, ConfigurationType } from '../configuration/config';
import { getIconForUrl } from '../configuration/image';
import { EMPTY_SVG, LOADING_IMG } from './settings';

const PROTOCOL_REGEX = /^[a-zA-Z]+:/;

export class SettingsAddBookmarkView {
  readonly name: HTMLInputElement = document.getElementById('settings-addBookmark-name') as HTMLInputElement;
  readonly url: HTMLInputElement = document.getElementById('settings-addBookmark-url') as HTMLInputElement;
  readonly add: HTMLButtonElement = document.getElementById('settings-addBookmark-add') as HTMLButtonElement;
  readonly favicon: HTMLInputElement = document.getElementById('settings-addBookmark-favicon') as HTMLInputElement;
  readonly preview: HTMLImageElement = document.getElementById('settings-addBookmark-preview') as HTMLImageElement;

  readonly addBookmarkCallback: (link: ConfigurationLink) => void;

  constructor(addBookmarkCallback: (link: ConfigurationLink) => void) {
    this.add.addEventListener('click', this.addClick.bind(this));
    this.url.addEventListener('change', this.urlChange.bind(this));
    this.favicon.addEventListener('change', this.faviconChange.bind(this));
    this.addBookmarkCallback = addBookmarkCallback;
  }

  private addClick(): void {
    const link: ConfigurationLink = {
      type: ConfigurationType.Link,
      name: this.name.value.trim() || undefined,
      url: this.url.value.trim() || undefined,
      favicon: this.favicon.value.trim() || undefined,
    };

    this.addBookmarkCallback(link);

    this.name.value = '';
    this.url.value = '';
    this.favicon.value = '';
    this.preview.src = EMPTY_SVG;
  }

  private urlChange(): Promise<any> {
    this.add.disabled = true;
    this.favicon.value = 'detecting...';
    this.favicon.disabled = true;
    this.preview.src = LOADING_IMG;

    if (!PROTOCOL_REGEX.test(this.url.value)) {
      this.url.value = 'https://' + this.url.value;
    }

    return Promise.resolve(this.url.value)
      .then(url => getIconForUrl(new URL(url)))
      .then(faviconUrl => this.favicon.value = faviconUrl)
      .then(() => this.faviconChange())
      .catch(error => {
        this.favicon.value = '';
        this.preview.src = EMPTY_SVG;
        console.error('Error fetching icon', error);
      })
      .finally(() => this.add.disabled = false)
      .finally(() => this.favicon.disabled = false);
  }

  private faviconChange(): void {
    this.preview.src = this.favicon.value;
  }
}