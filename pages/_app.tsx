import * as React from "react";
import { MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Competitive Programming Buddies",
  description:
    "A place to track your competitive programming friends' progress!",
};

const queryClient = new QueryClient();

const AppContext = React.createContext<
  | (
      | { name: string; platform: string }
      | React.Dispatch<React.SetStateAction<{ name: string; platform: string }>>
    )[]
  | null
>(null);

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [handleDeleteInfo, setHandleDeleteInfo] = React.useState({
    name: "",
    platform: "",
  });

  return (
    <>
      <AppContext.Provider value={[handleDeleteInfo, setHandleDeleteInfo]}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <Notifications />
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
            </Head>
            <Component className={inter.className} {...pageProps} />
          </MantineProvider>
        </QueryClientProvider>
      </AppContext.Provider>
    </>
  );
}
