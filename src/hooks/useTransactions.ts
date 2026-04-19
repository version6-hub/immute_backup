import { useChainId, useWriteContract } from "wagmi";
import { IMMUTE_ABI, getContractAddress } from "../lib/contract";
import { trackTx, toastError } from "../lib/txToast";

/**
 * Wraps wagmi's writeContractAsync per Immute action with the toast
 * pipeline so each call shows progress + resolves correctly even after
 * the originating UI element has unmounted (background watcher pattern).
 */
function useImmuteTx<TFn extends (...a: never[]) => Promise<`0x${string}`>>(
  build: (
    sendArgs: (args: {
      functionName: string;
      args: readonly unknown[];
      value?: bigint;
    }) => Promise<`0x${string}`>
  ) => TFn,
  labels: { sending: string; success: string }
) {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  const { writeContractAsync, isPending } = useWriteContract();

  const send = async (params: {
    functionName: string;
    args: readonly unknown[];
    value?: bigint;
  }) => {
    if (!address) throw new Error(`Contract not deployed on chain ${chainId}`);
    const hash = await writeContractAsync({
      address,
      abi: IMMUTE_ABI,
      functionName: params.functionName as never,
      args: params.args as never,
      value: params.value,
    });
    trackTx(labels.sending, labels.success, hash, chainId);
    return hash;
  };

  const fn = build(send);
  // Wrap in try/catch so user-rejection or wallet errors surface as a
  // toast rather than an unhandled promise rejection.
  const wrapped = ((...a: Parameters<TFn>) =>
    (fn as (...args: Parameters<TFn>) => Promise<`0x${string}`>)(...a).catch(
      (e) => {
        toastError(e, labels.sending + " failed");
        throw e;
      }
    )) as unknown as TFn;

  return { call: wrapped, isPending, hasContract: !!address };
}

export function useBuy() {
  return useImmuteTx<
    (referredBy: `0x${string}`, minTokensOut: bigint, value: bigint) => Promise<`0x${string}`>
  >(
    (send) => (referredBy, minTokensOut, value) =>
      send({
        functionName: "buy",
        args: [referredBy, minTokensOut],
        value,
      }),
    { sending: "Buying IMT", success: "IMT purchased" }
  );
}

export function useSell() {
  return useImmuteTx<
    (tokens: bigint, minEthOut: bigint) => Promise<`0x${string}`>
  >(
    (send) => (tokens, minEthOut) =>
      send({ functionName: "sell", args: [tokens, minEthOut] }),
    { sending: "Selling IMT", success: "IMT sold" }
  );
}

export function useWithdraw() {
  return useImmuteTx<() => Promise<`0x${string}`>>(
    (send) => () => send({ functionName: "withdraw", args: [] }),
    { sending: "Withdrawing rewards", success: "Rewards withdrawn" }
  );
}

export function useReinvest() {
  return useImmuteTx<(minTokensOut: bigint) => Promise<`0x${string}`>>(
    (send) => (minTokensOut) =>
      send({ functionName: "reinvest", args: [minTokensOut] }),
    { sending: "Reinvesting rewards", success: "Rewards reinvested" }
  );
}

export function useTransfer() {
  return useImmuteTx<
    (to: `0x${string}`, amount: bigint) => Promise<`0x${string}`>
  >(
    (send) => (to, amount) => send({ functionName: "transfer", args: [to, amount] }),
    { sending: "Transferring IMT", success: "IMT transferred" }
  );
}
