import { useEffect, useEffectEvent, useState } from "react";

type QueryState<T> =
  { key: string; status: "ready"; data: T } | { key: string; status: "error" };

export const useQuery = <T>(key: string, load: () => Promise<T>) => {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<QueryState<T> | null>(null);
  const [previous, setPrevious] = useState<T | null>(null);
  const requestKey = `${key}#${version}`;
  const runLoad = useEffectEvent(load);

  useEffect(() => {
    const controller = new AbortController();
    runLoad()
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ key: requestKey, status: "ready", data });
        setPrevious(data);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ key: requestKey, status: "error" });
      });
    return () => controller.abort();
  }, [requestKey]);

  const current = state?.key === requestKey ? state : null;

  return {
    data: current?.status === "ready" ? current.data : null,
    previous,
    loading: current === null,
    failed: current?.status === "error",
    reload: () => setVersion((value) => value + 1),
  };
};
