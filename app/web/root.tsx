import { Links, Meta, Outlet, Scripts } from "react-router";
import { DEFAULT_APP_NAME } from "./app-defaults";

export async function loader() {
  return {
    rules: { appName: process.env.APP_NAME || DEFAULT_APP_NAME },
    preferences: { language: process.env.DEFAULT_LANGUAGE || "english" }
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}