import { Configuration, ConfigurationElement } from '../configuration/config';
import { SettingsAddBookmarkView } from './settings/settings-add_bookmark';
import { SettingsElementsListView } from './settings/settings-elements_list';
import { SettingsRawView } from './settings/settings-raw_view';

export const EMPTY_SVG = '/empty.svg';
export const LOADING_IMG = '/loading.svg';

/**
 * Represents the settings view of the application.
 * This class doesn't hold the configuration object itself, as the sub widgets are responsible for
 * holding and displaying it.
 * This class is a controller of all the child widgets and is responsible for rendering the settings view.
 */
export class SettingsView {

  readonly settingsAddBookmarkView: SettingsAddBookmarkView;
  readonly settingsElementsListView: SettingsElementsListView;
  readonly settingsRawView: SettingsRawView;

  readonly settingsContainer = document.getElementById('settings') as HTMLDivElement;

  constructor() {
    this.settingsAddBookmarkView =
      new SettingsAddBookmarkView((configElement) => this.configElementAdded(configElement));
    this.settingsElementsListView =
      new SettingsElementsListView((configElements) => this.configElementsChanged(configElements));
    this.settingsRawView = new SettingsRawView();
  }

  public init(configuration: Configuration): Promise<any> {
    this.init = () => { throw new Error('Class has already been initialized.') };

    return Promise.all([
      this.settingsAddBookmarkView.init(configuration),
      this.settingsElementsListView.init(configuration),
      this.settingsRawView.init(configuration),
    ])
      .finally(() => this.settingsContainer.style.display = 'block');
  }

  public destroy(): void {
    this.settingsAddBookmarkView.destroy();
    this.settingsElementsListView.destroy();
    this.settingsRawView.destroy();
    this.settingsContainer.parentElement?.removeChild(this.settingsContainer);
  }

  private configElementAdded(configElement: ConfigurationElement): Promise<any> {
    return Promise.all([
      this.settingsElementsListView.addConfigElement(configElement),
      this.settingsRawView.addConfigElement(configElement),
    ]);
  }

  private configElementsChanged(configElements: ConfigurationElement[]): Promise<any> {
    return Promise.all([
      this.settingsRawView.setConfigElements(configElements),
    ]);
  }
}
