# About

A benchmark comparing performance of GraphQL requests made over HTTP and WebSocket transport protocols on serverless infrastructure.

> Check out the blog post [here]()

## Usage

Deploy serverless backend (requires AWS credentials)

```sh
cd backend
yarn deploy
```

Start frontend

```sh
# Set endpoint URL from backend deployment
export PREACT_APP_HTTP_ENDPOINT=... # e.g. https://appid.execute-api.region.amazonaws.com/
export PREACT_APP_WS_ENDPOINT=...   # e.g. wss://appid.execute-api.region.amazonaws.com/dev

# Start frontend server
cd frontend
npm start
```

Visit frontend deployment at [`http://localhost:8080`](http://localhost:8080) to start benchnmark.

## Results

### "5G" network connection

<details>
<summary>Connection info</summary>

| Down (mbit) | Up (mbit) | Benchmark                                            |
| ----------- | --------- | ---------------------------------------------------- |
| 300         | 15        | [link](https://www.speedtest.net/result/11794811311) |

</details>

#### Results

| protocol  | benchmark  | average latency (ms) |
| --------- | ---------- | -------------------- |
| HTTPS     | sequential | 298.86ms             |
| HTTPS     | concurrent | 279ms                |
| WebSocket | sequential | 181.18ms             |
| WebSocket | concurrent | 213.2ms              |

### "4G" network connection

<details>
<summary>Connection info</summary>

| Down (mbit) | Up (mbit) | Benchmark                                                |
| ----------- | --------- | -------------------------------------------------------- |
| 60          | 8         | [link](https://www.speedtest.net/result/11794830915.png) |

</details>

#### Results

| protocol  | benchmark  | average latency (ms) |
| --------- | ---------- | -------------------- |
| HTTPS     | sequential | 252.86ms             |
| HTTPS     | concurrent | 269ms                |
| WebSocket | sequential | 182.16ms             |
| WebSocket | concurrent | 227.6ms              |

### "3G" network connection (~3.1mbit down)

<details>
<summary>Connection info</summary>

| Down (mbit) | Up (mbit) | Benchmark                                                |
| ----------- | --------- | -------------------------------------------------------- |
| 7.2         | 2         | [link](https://www.speedtest.net/result/11794850911.png) |

</details>

#### Results

| protocol  | benchmark  | average latency (ms) |
| --------- | ---------- | -------------------- |
| HTTPS     | sequential | 281.76ms             |
| HTTPS     | concurrent | 277.8ms              |
| WebSocket | sequential | 174.6ms              |
| WebSocket | concurrent | 238.9ms              |

---

# Testing

All you need to know about the testing methodology.

## Benchmarks

### Sequential

_Intended to identify the performance difference across protocols when executing a single GraphQL request._

A single GraphQL request is executed in succession, and the average end-to-end response time is recorded.

### Concurrent benchmark

_Intended to identify the performance difference across protocols when executing many GraphQL requests simultaneously._

Multiple GraphQL requests are executed in succession, and the average end-to-end response time is recorded

## Additional factors

While the transport protocol is the controlled variable in this test, the goal was to get results which demonstrate how performance can differ across protocols in real world usage. Because of this, the below variables need to be considered.

### Cold starts

[Cold starts](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/) of serverless functions could influence test results. It is recommended to do an initial "dry run" before interpreting results to rule this out.

### Server side protocol resolution

Different server-side GraphQL libraries are used for each protocol ([Apollo server](https://github.com/apollographql/apollo-server) and [Subscriptionless](https://github.com/andyrichardson/subscriptionless)).

#### Apollo server

Expected to introduce some compute-based latency when converting a HTTP request into a GraphQL execution, and when converting a GraphQL responses into HTTP response (estimated [up to 10ms](https://github.com/benawad/node-graphql-benchmarks)).

#### Subscriptionless

Expected to introduce less compute-based latency, however a DynamoDB query is made on each request (estimated ~10ms latency).

### API Gateway

It is assumed that API Gateway's handling of HTTP/WebSocket requests is distinct and the means in which integrations to serverless functions take place can vary.
