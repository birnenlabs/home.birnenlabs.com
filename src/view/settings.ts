import {  configToUrl, Configuration, ConfigurationElement } from '../configuration/config';
import { SettingsAddBookmarkView } from './settings-add_bookmark';
import { SettingsElementsListView } from './settings-elements_list';

export const EMPTY_SVG = '/empty.svg';
export const LOADING_IMG = '/loading.svg';

export class SettingsView {

  readonly settingsAddBookmarkView: SettingsAddBookmarkView;
  readonly settingsElementsListView: SettingsElementsListView;

  readonly link = document.getElementById('settings-link') as HTMLAnchorElement;
  readonly showRawConfigButton = document.getElementById('settings-showRawConfig') as HTMLButtonElement;
  readonly rawConfig = document.getElementById('settings-rawConfig') as HTMLPreElement;


  constructor(configuration: Configuration) {
    this.settingsAddBookmarkView =
      new SettingsAddBookmarkView(configElement => this.addConfigElement(configElement));
    this.settingsElementsListView = new SettingsElementsListView(configuration.elements || [], () => this.render());

    this.showRawConfigButton.addEventListener('click', this.showRawConfigButtonClick.bind(this));
  }

  public render(): Promise<any> {
    const configuration: Configuration = {
      elements: this.settingsElementsListView.getConfigElements(),
    };
    this.rawConfig.textContent = JSON.stringify(configuration, null, 2);
    return this.updateLink(configuration);
  }

  private addConfigElement(configElement: ConfigurationElement): Promise<any> {
    this.settingsElementsListView.addConfigElement(configElement);
    return this.render();
  }

  private showRawConfigButtonClick() {
    this.rawConfig.classList.remove('hidden');
    this.showRawConfigButton.classList.add('hidden');
  }

  private updateLink(configuration: Configuration): Promise<any> {
    return configToUrl(configuration)
      .then(url => {
        this.link.innerText = url.toString();
        this.link.href = url.toString();
      });
  }
}
