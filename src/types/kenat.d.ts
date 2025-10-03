declare module 'kenat' {
  export interface EthiopianDate {
    year: number;
    month: number;
    day: number;
  }

  export interface GregorianDate {
    year: number;
    month: number;
    day: number;
  }

  export function toEC(gYear: number, gMonth: number, gDay: number): EthiopianDate;
  export function toGC(ethYear: number, ethMonth: number, ethDay: number): GregorianDate;
}
