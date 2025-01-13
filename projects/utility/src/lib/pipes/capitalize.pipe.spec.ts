import { CapitalizePipe } from "./capitalize.pipe";

describe("CapitalizePipe", (): void => {
  let pipe: CapitalizePipe;

  beforeEach((): void => {
    pipe = new CapitalizePipe();
  });

  it("should capitalize the first letter of a lowercase word", (): void => {
    const result: string = pipe.transform("hello");
    expect(result).toBe("Hello");
  });

  it("should capitalize the first letter and lowercase the rest of an uppercase word", (): void => {
    const result: string = pipe.transform("HELLO");
    expect(result).toBe("Hello");
  });

  it("should leave the first letter capitalized and lowercase the rest of a mixed-case word", (): void => {
    const result: string = pipe.transform("hELLO");
    expect(result).toBe("Hello");
  });

  it("should return an empty string if input is an empty string", (): void => {
    const result: string = pipe.transform("");
    expect(result).toBe("");
  });

  it("should return null if input is null", (): void => {
    const result: string = pipe.transform(null as any);
    expect(result).toBe("");
  });

  it("should return an empty string if input is undefined", () => {
    const result = pipe.transform(undefined as any);
    expect(result).toBe("");
  });

  it("should handle single characters", (): void => {
    const result: string = pipe.transform("a");
    expect(result).toBe("A");
  });

  it("should handle already capitalized single characters", (): void => {
    const result: string = pipe.transform("A");
    expect(result).toBe("A");
  });

  it("should handle words with only one letter", (): void => {
    const result: string = pipe.transform("a");
    expect(result).toBe("A");
  });
});
