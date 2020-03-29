import {IdGenerator} from "./IdGenerator";

export interface ComponentMapping {
  [key: string]: any;
}

export interface Options {
  components: ComponentMapping,
  scope: Element
}

/**
 * The Manager class is used to setup the components.
 */
export default class Manager {
  /**
   * Represents the version of @pappel-dev/components currently in use.
   */
  public version: string = "__version__";

  /**
   * used to identify class internally
   */
  private id: string;

  /**
   * Options used internally
   */
  private options: Options;

  /**
   * @param managerOptions: a set of options
   */
  constructor(managerOptions: Options) {
    this.id = IdGenerator.getNewId();
    this.options = managerOptions;
  }


}
