'use client'

import dynamic from 'next/dynamic'

const AdventCalendar = dynamic(
  () => import('@/components/cat-advent-calendar'),
  { ssr: false }
)


export default function ClientPage() {
  return (
    <main className="container mx-auto py-8">
      <AdventCalendar />
    </main>
  )
}

