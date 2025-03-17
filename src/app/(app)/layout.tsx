"use client";
import Navbar from "@/components/navbar";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ApolloProvider client={client}>
        <Navbar />
        {children}
      </ApolloProvider>
    </div>
  );
}
