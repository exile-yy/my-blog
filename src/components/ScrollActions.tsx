"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// 极小的 class 合并辅助，避免额外依赖
function cx(...classes: Array<string | boolean | undefined>) {
  return classes.filter(Boolean).join(" ")
}

type Variant = "floating" | "inline"
type Align = "viewport" | "container"

type Props = {
  variant?: Variant
  showBack?: boolean
  showTop?: boolean
  align?: Align
  scrollSelector?: string
}

export function ScrollActions({
  variant = "floating",
  align = "viewport",
  showBack = true,
  showTop = true,
  scrollSelector,
}: Props) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (scrollSelector) {
      document
        .querySelectorAll<HTMLElement>(scrollSelector)
        .forEach((el) => el.scrollTo({ top: 0, behavior: "smooth" }))
    }
  }

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/posts")
    }
  }

  return (
    <div
      className={
        variant === "floating"
          ? "fixed bottom-10 z-50 flex flex-col gap-3"
          : "flex items-center gap-3"
      }
      style={
        variant === "floating" && align === "container"
          ? { right: "max(16px, calc((100vw - 72rem) / 2 + 24px))" }
          : variant === "floating"
            ? { right: "1.5rem" }
            : undefined
      }
    >
      {showBack && (
        <button
          type="button"
          onClick={goBack}
          className={cx(
            "text-xs font-semibold transition",
            variant === "floating"
              ? "rounded-full bg-white/90 px-3 py-2 text-slate-800 shadow-md shadow-slate-900/10 backdrop-blur hover:-translate-y-0.5 hover:shadow-lg"
              : "rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
          )}
        >
          ← 上一页
        </button>
      )}
      {showTop && (scrolled || variant !== "floating") && (
        <button
          type="button"
          onClick={goTop}
          className={cx(
            "text-xs font-semibold transition",
            variant === "floating"
              ? "rounded-full bg-slate-900 px-3 py-2 text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 hover:bg-slate-800"
              : "rounded-full bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
          )}
        >
          ↑ 回到顶部
        </button>
      )}
    </div>
  )
}
