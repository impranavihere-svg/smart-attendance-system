import { VALID_CLASS_CODE } from './constants';

export function validateClassQr(scannedValue) {
  return scannedValue?.trim().toUpperCase() === VALID_CLASS_CODE;
}
