import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const defaultContent = {
  heroTitle: 'Creating documentaries, brands and visual experiences.',
  heroRole: 'FILMMAKER • CREATIVE DIRECTOR',
  heroSubtitle: 'Blending design and AI-driven creation.',
  heroVideoUrl: ''
}

// Use /tmp for Vercel, or .next for local
const DATA_DIR = process.env.VERCEL ? '/tmp' : join(process.cwd(), '.next', 'cache')
const DATA_FILE = join(DATA_DIR, 'page-content.json')

async function ensureDir() {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true })
    }
  } catch (error) {
    console.log('Dir exists or created')
  }
}

async function readPageContent() {
  try {
    await ensureDir()
    const data = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.log('📖 Using default content')
    return defaultContent
  }
}

async function writePageContent(content: any) {
  try {
    await ensureDir()
    console.log('📝 Writing to:', DATA_FILE)
    await writeFile(DATA_FILE, JSON.stringify(content, null, 2))
    console.log('✅ File written successfully')

    // Verify file was written
    const verify = await readFile(DATA_FILE, 'utf-8')
    console.log('✔️ Verified file contents:', JSON.parse(verify))
  } catch (error) {
    console.error('❌ Error writing file:', error)
    throw error
  }
}

export async function GET() {
  const content = await readPageContent()
  return NextResponse.json(content)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Received page content:', body)

    const currentContent = await readPageContent()

    // Update page content
    const updatedContent = {
      heroTitle: body.heroTitle !== undefined ? body.heroTitle : currentContent.heroTitle,
      heroRole: body.heroRole !== undefined ? body.heroRole : currentContent.heroRole,
      heroSubtitle: body.heroSubtitle !== undefined ? body.heroSubtitle : currentContent.heroSubtitle,
      heroVideoUrl: body.heroVideoUrl !== undefined ? body.heroVideoUrl : currentContent.heroVideoUrl
    }

    await writePageContent(updatedContent)

    console.log('✅ Updated page content:', updatedContent)
    return NextResponse.json({ success: true, data: updatedContent })
  } catch (error) {
    console.error('❌ Error saving page content:', error)
    return NextResponse.json(
      { error: 'Failed to save page content' },
      { status: 500 }
    )
  }
}
