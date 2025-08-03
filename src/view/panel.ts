export class PanelView {

  readonly panelContainer = document.getElementById('panel') as HTMLDivElement;
  readonly settingsButton = document.getElementById('panel-settings-button') as HTMLButtonElement;
  readonly panelGoogle = document.getElementById('panel-google') as HTMLDivElement;
  googleSearch: HTMLTableElement | null = null;

  constructor(onSettingsButtonClick: () => void) {
    this.settingsButton.addEventListener('click', onSettingsButtonClick);
    this.createObservers();
  }

  public init(): Promise<any> {
    return Promise.resolve()
      .finally(() => this.panelContainer.style.display = 'block');
  }

  public destroy() {
    this.panelContainer.parentElement?.removeChild(this.panelContainer);
  }

  private createObservers() {
    // This observer watches for style changes.
    // It will be initialised after the Google autocomplete element is added.
    const styleObserver = new MutationObserver(this.styleMutationObserver.bind(this));

    // This observer watches for the autocomplete element to be added to the page.
    const creationObserver = new MutationObserver((_, observer) => {
      const googleSearch = [...document.body.children].find(el => el instanceof HTMLTableElement);

      if (googleSearch) {
        console.log('Google autocomplete container found.');
        this.googleSearch = googleSearch;
        this.repositionObserver();
        styleObserver.observe(this.googleSearch, { attributes: true, attributeFilter: ['style'] });
        observer.disconnect();
      }
    });
    creationObserver.observe(document.body, { childList: true, subtree: true });

    // This observer watches for resize changes.
    const resizeObserver = new ResizeObserver(() => this.repositionObserver());
    resizeObserver.observe(this.panelGoogle);
  }

  private styleMutationObserver(_: MutationRecord[]) {
    // Ignoring MutationRecords as this is all about styles.
    // Checking if top is set as our modification will also trigger
    // observer.
    if (this.googleSearch?.style.top) {
      this.googleSearch.style.removeProperty('top');
    }
  }

  private repositionObserver() {
    if (this.googleSearch && this.panelGoogle) {
      const panelGoogleRect = this.panelGoogle.getBoundingClientRect();
      // Calculate bottom position based on the panel's current height
      this.googleSearch.style.setProperty(
        'bottom',
        // height of panel + padding
        `${panelGoogleRect.height + 30}px`
      );
    }
  }
}
