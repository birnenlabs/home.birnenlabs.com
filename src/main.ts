import { configFromUrl, Configuration } from './configuration/config';
import './style/main.css';
import './style/app.css';
import './style/panel.css';
import './style/settings.css';
import { AppView } from './view/app';
import { PanelView } from './view/panel';
import { SettingsView } from './view/settings';
import { LoadingView } from './view/loading';

class MainView {
  readonly appView: AppView;
  readonly loadingView: LoadingView;
  readonly panelView: PanelView;
  readonly settingsView: SettingsView;

  constructor() {
    this.appView = new AppView();
    this.loadingView = new LoadingView();
    this.panelView = new PanelView(this.onSettingsButtonClick.bind(this));
    this.settingsView = new SettingsView();
  }

  public init(config: Configuration): Promise<any> {
    return Promise.all([
      this.appView.init(config),
      this.panelView.init(),
    ])
      .finally(() => this.loadingView.destroy());
  }

  private onSettingsButtonClick(): Promise<any> {
    // Settings button is one way direction from main panel to settings.
    return configFromUrl()
      .then((config) => this.settingsView.init(config))
      .finally(() => this.appView.destroy())
      .finally(() => this.panelView.destroy());
  }
}

function initializePage(): Promise<any> {
  const mainView = new MainView();
  return configFromUrl().then((config) => mainView.init(config));
}


document.addEventListener('DOMContentLoaded', initializePage);

