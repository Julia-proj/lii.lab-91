"use client"

import { useEffect } from "react"

export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up")
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
