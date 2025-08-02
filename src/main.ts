import { configFromUrl } from './configuration/config';
import './style.css'
import './style-app.css'
import './style-settings.css'
import { AppView } from './view/app';
import { SettingsView } from './view/settings';


function initializePage(): Promise<any> {
  const loadingPanel = document.getElementById('loading') as HTMLDivElement;
  const appView = new AppView();
  const showSettingsBtn = document.getElementById('app-settings-button');
  showSettingsBtn?.addEventListener('click', () => {
    configFromUrl()
      .then((config) => new SettingsView(config))
      .then((settingsView) => settingsView.render())
      .then(() => appView.destroy());
  });

  return appView.render()
    .finally(() => loadingPanel.parentElement?.removeChild(loadingPanel));
}


document.addEventListener('DOMContentLoaded', initializePage);

