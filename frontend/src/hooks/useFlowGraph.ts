"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { adaptGraphResponse, GraphResponseValidationError } from "@/lib/graph-adapter";
import { apiFetch } from "@/lib/api";
import type { GraphResponse } from "@/lib/types";

export type FlowGraphState =
  | { status: "loading" }
  | { status: "success"; data: GraphResponse }
  | { status: "empty"; data: GraphResponse }
  | { status: "error"; error: Error }
  | { status: "invalid-response"; error: GraphResponseValidationError };

export interface UseFlowGraphResult {
  state: FlowGraphState;
  refresh: () => Promise<void>;
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  return new Error("The graph request failed with an unknown error.");
}

export function useFlowGraph(): UseFlowGraphResult {
  const [state, setState] = useState<FlowGraphState>({ status: "loading" });
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    controller.current?.abort();
    const requestController = new AbortController();
    controller.current = requestController;
    const currentRequestId = ++requestId.current;
    setState({ status: "loading" });

    try {
      const response = await apiFetch<unknown>("graph", {
        signal: requestController.signal,
      });
      if (requestId.current !== currentRequestId) return;

      const data = adaptGraphResponse(response);
      setState(
        data.nodes.length === 0 && data.edges.length === 0
          ? { status: "empty", data }
          : { status: "success", data },
      );
    } catch (error: unknown) {
      if (requestController.signal.aborted || requestId.current !== currentRequestId) return;

      if (error instanceof GraphResponseValidationError) {
        setState({ status: "invalid-response", error });
      } else {
        setState({ status: "error", error: toError(error) });
      }
    } finally {
      if (requestId.current === currentRequestId) {
        controller.current = null;
      }
    }
  }, []);

  useEffect(() => {
    void refresh();

    return () => {
      requestId.current += 1;
      controller.current?.abort();
      controller.current = null;
    };
  }, [refresh]);

  return { state, refresh };
}
