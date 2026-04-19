import { toast } from "sonner";
import {
  BaseError,
  ContractFunctionRevertedError,
  UserRejectedRequestError,
} from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "./wagmiConfig";
import { explorerTxUrl } from "./contract";

export function decodeTxError(err: unknown): string {
  if (err instanceof BaseError) {
    const rejected = err.walk((e) => e instanceof UserRejectedRequestError);
    if (rejected) return "You cancelled the transaction.";
    const reverted = err.walk(
      (e) => e instanceof ContractFunctionRevertedError
    ) as ContractFunctionRevertedError | null;
    if (reverted) {
      const reason =
        reverted.reason ||
        (reverted.data?.args as readonly unknown[] | undefined)?.[0];
      if (typeof reason === "string" && reason) return reason;
      if (reverted.data?.errorName)
        return `Reverted: ${reverted.data.errorName}`;
    }
    if (err.shortMessage) return err.shortMessage;
    if (err.message) return err.message.split("\n")[0];
  }
  if (err instanceof Error) {
    const m = err.message;
    if (m.includes("User rejected") || m.includes("User denied"))
      return "You cancelled the transaction.";
    return m.split("\n")[0];
  }
  return "Transaction failed.";
}

const watched = new Set<string>();

/**
 * Spawn a hash-keyed loading toast and a background watcher that resolves
 * it to success/error. The watcher is decoupled from React's component
 * lifecycle — same fix as the main site, so a closed UI doesn't strand
 * the toast in "Waiting for confirmation" forever.
 */
export function trackTx(
  label: string,
  successLabel: string,
  hash: `0x${string}`,
  chainId: number
) {
  const url = explorerTxUrl(chainId, hash);
  toast.loading(label, {
    id: hash,
    description: `Waiting for confirmation — tx ${hash.slice(0, 10)}…`,
    action: {
      label: "Etherscan",
      onClick: () => window.open(url, "_blank", "noopener"),
    },
  });
  if (watched.has(hash)) return;
  watched.add(hash);
  void (async () => {
    try {
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: chainId as 1 | 11155111,
      });
      if (receipt.status === "success") {
        toast.success(successLabel, {
          id: hash,
          description: `Confirmed — ${hash.slice(0, 10)}…`,
          action: {
            label: "Etherscan",
            onClick: () => window.open(url, "_blank", "noopener"),
          },
          duration: 8000,
        });
      } else {
        toast.error(`${label} reverted`, {
          id: hash,
          description: `Tx ${hash.slice(0, 10)}… reverted on-chain.`,
          duration: 10000,
        });
      }
    } catch (err) {
      toast.error(`${label} failed`, {
        id: hash,
        description: decodeTxError(err),
        duration: 10000,
      });
    } finally {
      watched.delete(hash);
    }
  })();
}

export function toastError(err: unknown, label = "Transaction failed") {
  toast.error(label, { description: decodeTxError(err), duration: 10000 });
}
