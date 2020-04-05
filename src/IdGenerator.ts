export type PappelId = string;

export class IdGenerator {
  private static counter: number = 0;
  private static prefix: string = "pappel_";

  public static getNewId(): PappelId {
    return this.prefix + this.counter++;
  }
}
