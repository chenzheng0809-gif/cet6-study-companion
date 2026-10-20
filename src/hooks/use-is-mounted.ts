"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * `false` on the server and during the hydration render, `true` afterwards.
 * Portal-based UI must use this so the first client render matches the server
 * HTML instead of injecting a node React never saw on the other side.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
