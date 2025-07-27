import { Loader } from "../configuration/loader";

export class SettingsView {
  readonly loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }

  public render() {
    const modulesTextArea = document.getElementById('taAvailableModules') as HTMLTextAreaElement;

    if (!modulesTextArea) {
      console.error('Fatal Error: A required element was not found in the DOM!');
      return;
    }

    modulesTextArea.value = this.loader.getModuleNames().join('\n');
  }
}