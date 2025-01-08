import * as process from "node:process";
import { parse } from "npm:tldts";

// Convert decimal notation of ip address into 32 bit unsigned integer
function addr(decimalNotation: string): number {
  return decimalNotation.split(".").reduce((state, part, index) => state | (parseInt(part, 10) << ((3 - index) * 8)), 0) >>> 0;
}

const title = process.argv.slice(2)[0];

if (/[A-Z]/.test(title)) {
  throw new Error("❌ Given string includes an upper-case character!");
}

const parsed = parse(title);

if (parsed.hostname === null) {
  throw new Error("❌ Given string is not a valid domain name or IP address!");
}

if (parsed.hostname !== title) {
  throw new Error("❌ Given string is not a pure hostname!");
}

if (parsed.isIp) {
  const ip = addr(title);

  // https://datatracker.ietf.org/doc/html/rfc1918#section-3
  if (
    (ip >= addr("10.0.0.0") && ip <= addr("10.255.255.255")) ||
    (ip >= addr("172.16.0.0") && ip <= addr("172.31.255.255")) ||
    (ip >= addr("192.168.0.0") && ip <= addr("192.168.255.255"))
  ) {
    throw new Error("❌ Private IP address is not allowed!");
  }
} else if (!parsed.isIcann) {
  throw new Error("❌ TLD is not registered to ICANN!");
}
