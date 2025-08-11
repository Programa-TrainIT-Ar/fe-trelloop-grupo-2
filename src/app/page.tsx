"use client";

import Header from "components/header/Header";
import Navbar from "components/navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen w-full">
        <Header />
      </main>
    </>
  );
}
