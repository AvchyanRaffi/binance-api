import { Transform } from 'class-transformer';

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns {(target: any, key: string) => void}
 * @constructor
 */
export function ToInt(): (target: any, key: string) => void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Transform((value) => parseInt(value.value, 10), { toClassOnly: true });
}
