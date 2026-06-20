'use client'

import { useState } from 'react'

interface ShareButtonProps {
  url: string
}

export default function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2">
      <div
        className="p-3 rounded text-xs font-mono break-all"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-dim)' }}
      >
        {url}
      </div>
      <button
        onClick={handleCopy}
        className={`w-full py-2.5 rounded text-sm ${copied ? 'btn-cyan' : 'btn-primary'}`}
      >
        {copied ? '[ コピーしました！ ]' : '[ URLをコピーする ]'}
      </button>
    </div>
  )
}
