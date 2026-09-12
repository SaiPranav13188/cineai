import Image from "next/image";

export default function IconsPage() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">App Icons</h1>
      <div className="flex items-center gap-4 p-4 border rounded-lg w-fit bg-zinc-50 dark:bg-zinc-900">
        <Image 
          src="/icons/icon1.svg" 
          alt="Camera Icon" 
          width={40} 
          height={40} 
          className="dark:invert"
        />
        <span>Camera Icon (`/icons/icon1.svg`)</span>
      </div>
    </main>
  );
}