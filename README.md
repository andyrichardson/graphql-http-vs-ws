# About

A benchmark comparing performance of GraphQL requests made over HTTP and WebSocket transport protocols on serverless infrastructure.

> Check out the blog post [here](https://dev.to/andyrichardsonn/graphql-requests-over-http-s-are-slow-d1p)

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

### Fast connection (5g)

On a fast connection, there is roughly a 100ms reduction in latency when using a WebSocket connection rather than HTTP/S.

<details>
  <summary>Results</summary>

| protocol  | benchmark  | average latency (ms) |
| --------- | ---------- | -------------------- |
| HTTPS     | sequential | 298.86ms             |
| HTTPS     | concurrent | 279ms                |
| WebSocket | sequential | 181.18ms             |
| WebSocket | concurrent | 213.2ms              |



![Screenshot from 2021-07-28 12-21-50](https://user-images.githubusercontent.com/10779424/127639670-0f0d707c-1109-46d1-84e5-3b3966c1a5a2.png)

</details>

<details>
  <summary>Connection info</summary>

| Down (mbit) | Up (mbit) | Benchmark                                            |
| ----------- | --------- | ---------------------------------------------------- |
| 300         | 20        | [link](http://www.dslreports.com/speedtest/69091111) |

</details>

### Slow connection (3g)

On a slow connection, there is a larger 500ms or more reduction in latency when using a WebSocket connection rather than HTTP/S.

<details>
  <summary>Results</summary>


| protocol  | benchmark  | average latency (ms) |
| --------- | ---------- | -------------------- |
| HTTPS     | sequential | 1241ms               |
| HTTPS     | concurrent | 1317.9ms             |
| WebSocket | sequential | 578.9ms              |
| WebSocket | concurrent | 644.9ms              |

![Screenshot from 2021-07-30 12-34-45](https://user-images.githubusercontent.com/10779424/127647759-ab5f0e54-6a2f-4e98-8d8d-62a656d3eda2.png)

</details>

<details>
  <summary>Connection info</summary>

| Down (mbit) | Up (mbit) | Benchmark                                            |
| ----------- | --------- | ---------------------------------------------------- |
| 0.4         | 0.03      | [link](http://www.dslreports.com/speedtest/69091033) |

</details>

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

### Network performance

Many factors of a network can influence performance of different connections/protocols. 

For testing purposes the [@sitespeed.io/throttle](https://github.com/sitespeedio/throttle) tool was used to simulate slower connections.
