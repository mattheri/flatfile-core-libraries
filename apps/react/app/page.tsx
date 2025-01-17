'use client'

import { FlatfileProvider } from '@flatfile/react'
import App from './App'

export default function Home() {
  const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_FLATFILE_PUBLISHABLE_KEY
  if (!PUBLISHABLE_KEY) {
    return <>No Publishable Key Available</>
  }
  return (
    <FlatfileProvider
      publishableKey={PUBLISHABLE_KEY}
      config={{
        preload: true,
        displayAsModal: false,
      }}
    >
      <App id="1" />
    </FlatfileProvider>
  )
}
