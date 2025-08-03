export class PanelView {

  readonly panelContainer = document.getElementById('panel') as HTMLDivElement;
  readonly settingsButton = document.getElementById('panel-settings-button') as HTMLButtonElement;
  readonly panelGoogle = document.getElementById('panel-google') as HTMLDivElement;
  readonly styleObserver: MutationObserver;
  // readonly googleSearch = [...document.body.children].find(el => el instanceof HTMLTableElement);;

  googleSearch: HTMLTableElement | null = null;


  constructor(onSettingsButtonClick: () => void) {
    this.styleObserver = new MutationObserver(this.styleMutationObserver.bind(this));
    this.settingsButton.addEventListener('click', onSettingsButtonClick);

    // This observer watches for the autocomplete element to be added to the page.
    const creationObserver = new MutationObserver((_, observer) => {
      const googleSearch = [...document.body.children].find(el => el instanceof HTMLTableElement);

      if (googleSearch) {
        console.log('Google autocomplete container found.');

        // Google code is only modifying `top` property - let's calculate the bottom property
        // once.
        const containerRect = this.panelContainer.getBoundingClientRect();
        const googleRect = this.panelGoogle?.getBoundingClientRect();
        // container is at the bottom - it's height minus diff between top values
        googleSearch.style.setProperty(
          'bottom',
          `${containerRect.height - (googleRect ? (googleRect.top - containerRect.top) : 0) + 5}px`);

        // Now let's set the style observer to detect css changes.
        this.googleSearch = googleSearch;
        this.styleObserver.observe(this.googleSearch, { attributes: true, attributeFilter: ['style'] });
        observer.disconnect();
      }
    });

    // Start observing the entire document for added elements.
    creationObserver.observe(document.body, { childList: true, subtree: true });
  }

  public init(): Promise<any> {
    return Promise.resolve()
      .finally(() => this.panelContainer.style.display = 'block');
  }

  public destroy() {
    this.panelContainer.parentElement?.removeChild(this.panelContainer);
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
