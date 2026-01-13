import type { ReactNode } from "react";
import Providers from "./providers";

export const metadata = { title: "Calorie Tracker" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
