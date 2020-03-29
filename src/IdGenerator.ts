export class IdGenerator {
  private static counter: number = 0;
  private static prefix: string = "pappel_";

  public static getNewId(): string {
    return this.prefix + this.counter++;
  }
}
