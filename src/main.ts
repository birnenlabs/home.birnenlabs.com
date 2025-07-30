import { configFromUrl } from './configuration/config';
import './style.css'
import { AppView } from './view/app';
import { SettingsView } from './view/settings';


function initializePage(): Promise<any> {
  const configPromise = configFromUrl();

  const appView = new AppView();

  return appView.render()
  .then(() => configPromise)
  .then((config) => new SettingsView(config))
  .then((settingsView) => settingsView.render());
}


document.addEventListener('DOMContentLoaded', initializePage);

