'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_PAGE_CONTENT, PageContent, withTextDefaults } from './site'
import { fetchAllWork, WorkItem } from './work'

// One request per page load, shared by every component that needs it.
let contentPromise: Promise<PageContent> | null = null
let workPromise: Promise<WorkItem[]> | null = null

function loadContent() {
  if (!contentPromise) {
    contentPromise = fetch(`/api/page-content?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => ({ ...DEFAULT_PAGE_CONTENT, ...d, site_texts: withTextDefaults(d?.site_texts) }))
      .catch(() => DEFAULT_PAGE_CONTENT)
  }
  return contentPromise
}

function loadWork() {
  if (!workPromise) workPromise = fetchAllWork()
  return workPromise
}

export function useSiteContent() {
  const [content, setContent] = useState<PageContent>(DEFAULT_PAGE_CONTENT)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    loadContent().then((c) => {
      if (live) {
        setContent(c)
        setReady(true)
      }
    })
    return () => {
      live = false
    }
  }, [])
  return { content, texts: content.site_texts, ready }
}

export function useAllWork() {
  const [items, setItems] = useState<WorkItem[]>([])
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    loadWork().then((w) => {
      if (live) {
        setItems(w)
        setReady(true)
      }
    })
    return () => {
      live = false
    }
  }, [])
  return { items, ready }
}
