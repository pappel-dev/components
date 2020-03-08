export default class PappelManager {
  public version: string = "__version__";
  private static instance: PappelManager;

  constructor() {
    if (PappelManager.instance !== undefined) {
      return PappelManager.instance;
    }

    PappelManager.instance = this;
  }
}
