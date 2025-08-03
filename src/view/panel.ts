export class PanelView {

  readonly panelContainer = document.getElementById('panel') as HTMLDivElement;
  readonly settingsButton = document.getElementById('panel-settings-button') as HTMLButtonElement;
  readonly panelGoogle = document.getElementById('panel-google') as HTMLDivElement;
  readonly googleSearch = [...document.body.children].find(el => el instanceof HTMLTableElement);;

  constructor(onSettingsButtonClick: () => void) {
    this.settingsButton.addEventListener('click', onSettingsButtonClick);
    const observer = new MutationObserver(this.styleMutationObserver.bind(this));
    if (this.googleSearch) {
      observer.observe(this.googleSearch, { attributes: true, attributeFilter: ['style'] });
    } else {
      console.error('GoogleSearch autocomplete not found');
    }
  }

  public init(): Promise<any> {
    return Promise.resolve()
      .finally(() => this.panelContainer.style.display = 'block')
      // Position after elements are added.
      .then(() => this.positionGoogleSearch());
  }

  public destroy() {
    this.panelContainer.parentElement?.removeChild(this.panelContainer);
  }

  private positionGoogleSearch() {
    const containerRect = this.panelContainer.getBoundingClientRect();
    const googleRect = this.panelGoogle?.getBoundingClientRect();
    // container is at the bottom - it's height minus diff between top values
    this.googleSearch?.style.setProperty(
      'bottom',
      `${containerRect.height - (googleRect ? (googleRect.top - containerRect.top) : 0) + 5}px`);
  }

  private styleMutationObserver(_: MutationRecord[]) {
    // Ignoring MutationRecords as this is all about styles.
    // Checking if top is set as our modification will also trigger
    // observer.
    if (this.googleSearch?.style.top) {
      this.googleSearch?.style.removeProperty('top');
    }
  }
}
