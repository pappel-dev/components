import {AllowedData, Component} from "./Component";

type SupportedDataTypes = "array" | "boolean" | "number" | "object" | "string" | "symbol" | "bigint";
type NotSupportedDataTypes = "function" | "undefined";

type Mapping = {
  [key in SupportedDataTypes]: typeof ReactiveData;
}

export class ReactiveData {
  private static typeMapping: Mapping = {
    array: ReactiveData,
    bigint: ReactiveData,
    boolean: ReactiveData,
    number: ReactiveData,
    object: ReactiveData,
    string: ReactiveData,
    symbol: ReactiveData
  };

  constructor(protected data: AllowedData,
              private component: Component) {
  }

  public static getNewReactiveData(data: AllowedData, component: Component): ReactiveData {
    let key: SupportedDataTypes | NotSupportedDataTypes = typeof data;
    if (key === "object") {
      if (Array.isArray(data)) {
        key = "array";
      }
    } else if (key === "function" || key === "undefined") {
      throw new Error(`${key} is not a supported data type for reactivity`);
    }
    const constructor = ReactiveData.typeMapping[key];

    return new constructor(data, component);
  }

  protected changed() {

  }

  protected added() {

  }

  protected removed() {

  }
}
