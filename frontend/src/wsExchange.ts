import { pipe, map, subscribe, mergeMap, filter, make } from "wonka";
import {
  Exchange,
  OperationResult,
  makeResult,
  makeErrorResult,
} from "@urql/core";
import { createClient } from "graphql-ws";
import { print } from "graphql";

type WSExchangeArgs = {
  url: string;
};

export const wsExchange = ({ url }: WSExchangeArgs): Exchange => {
  console.log("INIT");
  const wsClient = createClient({
    url,
    lazy: false,
  });

  return ({ client }) => (ops$) =>
    pipe(
      ops$,
      filter((op) => op.kind !== "teardown"),
      mergeMap((operation) =>
        make<OperationResult>(({ next, complete }) => {
          const unsubscribe = wsClient.subscribe(
            {
              ...operation,
              query: print(operation.query),
            },
            {
              next: (result) => next(makeResult(operation, result)),
              error: (err) => next(makeErrorResult(operation, err)),
              complete: complete,
            }
          );

          return unsubscribe;
        })
      )
    );
};
