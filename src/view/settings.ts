import { configFromUrl, configToUrl, Configuration } from '../configuration/config';

export class SettingsView {

  readonly modulesTextArea: HTMLTextAreaElement;
  readonly linkWithConfig: HTMLAnchorElement;
  readonly btnCreateLink: HTMLButtonElement;

  constructor() {
    this.modulesTextArea = document.getElementById('taModules') as HTMLTextAreaElement;
    this.linkWithConfig = document.getElementById('linkWithConfig') as HTMLAnchorElement;
    this.btnCreateLink = document.getElementById('btnCreateLink') as HTMLButtonElement;
    if (!this.modulesTextArea || !this.linkWithConfig || !this.btnCreateLink) {
      throw new Error('Fatal Error: required elements not found in the DOM!');
    }
    this.btnCreateLink.addEventListener('click', this.btnCreateLinkClick.bind(this));
  }

  public render(): Promise<any> {
    return configFromUrl()
      .then(config => {
        this.modulesTextArea.value = JSON.stringify(config, null, 2);
        return config;
      }).then(() => this.updateUrlFromConfig());
  }

  private updateUrlFromConfig(): Promise<any> {
    const conf = JSON.parse(this.modulesTextArea.value) as Configuration;
    return configToUrl(conf)
      .then(url => {
        this.linkWithConfig.innerText = url.toString();
        this.linkWithConfig.href = url.toString();
      });
  }

  private btnCreateLinkClick(): Promise<any> {
    return this.updateUrlFromConfig();
  }
}

