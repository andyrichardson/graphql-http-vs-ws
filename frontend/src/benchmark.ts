import {
  createClient,
  Client,
  gql,
  createRequest,
  fetchExchange,
  subscriptionExchange,
} from "@urql/preact";
import { pipe, take, toPromise } from "wonka";
import { createClient as createWS } from "graphql-ws";

const gqlWs = createWS({
  url: process.env.PREACT_APP_WS_ENDPOINT as string,
  lazy: false,
});

const httpClient = createClient({
  url: process.env.PREACT_APP_HTTP_ENDPOINT as string,
  exchanges: [fetchExchange],
});

const wsClient = createClient({
  url: "/",
  exchanges: [
    subscriptionExchange({
      enableAllOperations: true,
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: gqlWs.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});

const GetArticles = createRequest(gql`
  query GetArticles {
    articles {
      id
      title
      content
    }
  }
`);

const benchmark = async (task: Function, runs: number) => {
  const results = [];
  for (let i = 1; i <= runs; i++) {
    console.log(`Run ${i}/${runs}`);
    const before = Date.now();
    await task();

    results.push(Date.now() - before);
  }

  return {
    results,
    average: results.reduce((agg, t) => t + agg, 0) / results.length,
  };
};

const execSequential = (client: Client) =>
  benchmark(
    () => pipe(client.executeQuery(GetArticles), take(1), toPromise),
    50
  );

const execConcurrent = (client: Client) =>
  benchmark(
    () =>
      Promise.all(
        new Array(10)
          .fill(null)
          .map(() => pipe(client.executeQuery(GetArticles), take(1), toPromise))
      ),
    10
  );

export const execHttpSequential = () => execSequential(httpClient);
export const execHttpConcurrent = () => execConcurrent(httpClient);
export const execWsSequential = () => execSequential(wsClient);
export const execWsConcurrent = () => execConcurrent(wsClient);
