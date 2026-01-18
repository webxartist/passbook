"use client";

import dynamic from "next/dynamic";

const PassbookPrint = dynamic(() => import("@/Component/Passbook"), {
  ssr: false,
});

export default function Page() {
  return <PassbookPrint />;
}
