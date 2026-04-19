export function formatEth(wei: bigint, decimals = 6): string {
  const divisor = 10n ** 18n;
  const whole = wei / divisor;
  const fraction = wei % divisor;
  const fractionStr = fraction.toString().padStart(18, "0").slice(0, decimals);
  return `${whole.toLocaleString()}.${fractionStr}`;
}

export function formatTokens(amount: bigint, decimals = 4): string {
  return formatEth(amount, decimals);
}

export function parseEthInput(value: string): bigint {
  if (!value || isNaN(parseFloat(value))) return 0n;
  const [whole, fraction = ""] = value.split(".");
  const paddedFraction = fraction.slice(0, 18).padEnd(18, "0");
  return BigInt(whole || "0") * 10n ** 18n + BigInt(paddedFraction);
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
