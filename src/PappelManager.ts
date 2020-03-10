/**
 * The PappelManager class is used to setup the components.
 * It is a singleton class, meaning whenever you aim to create a new instance, you will always get the same instance.
 *
 * ## Examples
 * ### Simple
 * ```typescript
 * const system = new PappelManager()
 * ```
 */
export default class PappelManager {
  /**
   * Represents the version of @pappel-dev/components currently in use.
   */
  public version: string = "__version__";
  /**
   * Used to handle singleton logic.
   * @internal
   */
  private static instance: PappelManager;

  constructor() {
    if (PappelManager.instance !== undefined) {
      return PappelManager.instance;
    }

    PappelManager.instance = this;
  }
}
