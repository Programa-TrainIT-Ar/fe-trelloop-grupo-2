"use client";

import Header from "components/Header/Header";
import Navbar from "components/Navbar/Navbar";
import Edit from "components/Edit/Edit";

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
