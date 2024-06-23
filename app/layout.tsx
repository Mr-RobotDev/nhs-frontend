"use client";
import { Roboto } from "next/font/google";
import "./globals.css";
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'

import { Provider } from "react-redux";
import { store, persistor } from "@/app/store/store";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";
import { Spin } from "antd";

const roboto = Roboto({ weight: "500", subsets: ["cyrillic"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <Provider store={store}>
        <body className={`${roboto.className}`}>
          <PersistGate
            persistor={persistor}
            loading={
              <div className="h-screen flex justify-center items-center">
                <Spin size="large" />
              </div>
            }
          >
            <AntdRegistry>
              {children}
              <Toaster position="top-right" reverseOrder={false} />
            </AntdRegistry>
          </PersistGate>
        </body>
      </Provider>
    </html>
  );
}
