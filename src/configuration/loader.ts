import { Module } from './interface';

type ModuleConstructor = { default: new () => Module };

export class Loader {
  private readonly modules: Module[];

  private constructor(modules: Module[]) {
    this.modules = modules;
  }

  /**
   * The static factory method that handles async initialization via promises.
   * @returns A Promise that resolves with a fully initialized Loader instance.
   */
  public static create(): Promise<Loader> {
    const moduleFiles = import.meta.glob<ModuleConstructor>('./modules/*.ts');
    const importPromises = Object.values(moduleFiles).map(importer => importer());

    // Start the promise chain
    return Promise.all(importPromises)
      .then(loadedModules => {
        // This runs after all modules are imported
        const instantiatedModules = loadedModules.map(mod => new mod.default());
        
        // Create and return the new instance, which becomes the resolved value of the promise
        return new Loader(instantiatedModules);
      });
  }

  /**
   * @return Module names
   */
  public getModuleNames(): string[] {
    return this.modules.map(module => module.name);
  }
}
