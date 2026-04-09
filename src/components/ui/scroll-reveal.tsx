'use client'

import React, { useEffect, useRef } from 'react'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale'

const directionConfig: Record<RevealDirection, { x: number; y: number; scale: number }> = {
  up: { x: 0, y: 24, scale: 1 },
  down: { x: 0, y: -24, scale: 1 },
  left: { x: 24, y: 0, scale: 1 },
  right: { x: -24, y: 0, scale: 1 },
  scale: { x: 0, y: 0, scale: 0.98 },
}

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: RevealDirection
  once?: boolean
  threshold?: number
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = false,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('is-visible')
          } else if (!once) {
            node.classList.remove('is-visible')
          }
        })
      },
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, threshold])

  const config = directionConfig[direction]
  const style = {
    '--reveal-x': `${config.x}px`,
    '--reveal-y': `${config.y}px`,
    '--reveal-scale': `${config.scale}`,
    '--reveal-delay': `${delay}ms`,
  } as React.CSSProperties

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  )
}
