# Chimp Test

This is my **personal React starter**.

I clone this repo **every time** I build:

* UI demos
* micro-interactions
* motion experiments
* small showcase projects I post on social media

No setup drama. No boilerplate bloat.
Just clone → install → build.

---

### Supabase integrated



---

### Stack

* **React** (Vite)
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **clsx + tailwind-merge**
* **lucide-react**

Opinionated, modern, and fast to work with.

---

### Quick start

```bash
npm install
npm run dev
```

---

### Utility: `cn()`

Located in `src/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

