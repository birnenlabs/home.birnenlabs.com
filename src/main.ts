import './style.css'
import { AppView } from './view/app';
import { SettingsView } from './view/settings';


function initializePage(): Promise<any> {
  //const configPromies = configFromUrl();

  const appView = new AppView();
  const settingsView = new SettingsView();
  return appView.render().then(() => settingsView.render());
}


document.addEventListener('DOMContentLoaded', initializePage);

