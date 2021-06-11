export class UtilsHelper {
  public static generateRandomString(
    length: number,
    options: {
      numericDigits?: boolean;
      uppercaseLatin?: boolean;
      lowercaseLatin?: boolean;
    },
  ): string {
    let characters = "";

    if (options.numericDigits) {
      characters += "0123456789";
    }
    if (options.uppercaseLatin) {
      characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (options.lowercaseLatin) {
      characters += "abcdefghijklmnopqrstuvwxyz";
    }

    const charactersLength = characters.length;

    const result: string[] = [];

    for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }

    return result.join("");
  }

  public static formatSortOptions(value: string): Record<string, string> {
    if (!value) {
      return {};
    }

    const sort: Record<string, string> = {};

    for (const option of value.split(",")) {
      if (option) {
        const keyValuePair = option.split(":");
        const key = keyValuePair[0];
        const value = keyValuePair[1];
        sort[key] = value;
      }
    }

    return sort;
  }
}
