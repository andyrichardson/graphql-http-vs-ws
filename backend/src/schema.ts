import gql from "graphql-tag";

export const typeDefs = gql`
  type Article {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    articles: [Article!]!
  }

  type Mutation {
    publishArticle(title: String!, content: String!): Article!
  }
`;

export const resolvers = {
  Query: {
    articles: () => [
      {
        id: "article_1",
        title: "Article 1",
        content: "This is an example article",
      },
      {
        id: "article_2",
        title: "Article 2",
        content: "This is an example article",
      },
      {
        id: "article_3",
        title: "Article 3",
        content: "This is an example article",
      },
    ],
  },
  Mutation: {
    publishArticle: (_, { title, content }) => ({
      id: "article_4",
      title,
      content,
    }),
  },
};
