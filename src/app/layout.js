import localFont from "next/font/local";
import { Six_Caps } from "next/font/google";
import "./globals.css";

const Secondary = Six_Caps({
  subsets: ["latin"],
  variable: "--font-six-caps",
  display: "swap",
  weight: "400",
});

const Primary = localFont({
  src: "../../public/Font/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  display: "swap",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${Primary.variable} ${Secondary.variable}`}
    >
      <body >

     

        {children}


      </body>
    </html>
  );
}
