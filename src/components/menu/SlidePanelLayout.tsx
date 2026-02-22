"use client"

import type { ReactNode } from "react"

type SlidePanelLayoutProps = {
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function SlidePanelLayout({ title, children, footer }: SlidePanelLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-[12px] px-[30px] pr-[60px] pt-[24px]">
        <div className="flex-1">{title}</div>
      </div>

      <div className="my-[16px] h-px bg-border-light" />

      <div className="flex-1 overflow-y-auto px-[30px] pb-[30px]">
        {children}
      </div>

      {footer && (
        <div className="border-t border-border-light px-[30px] py-[16px]">
          {footer}
        </div>
      )}
    </div>
  )
}
