import { AppCase } from '@/lib/types'

export default async function DebugCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let caseStudy: AppCase | null = null
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/case-studies/${id}`, {
      cache: 'no-store',
    })
    const data = await res.json()
    if (data && data.id) {
      caseStudy = data
    }
  } catch (error) {
    console.error('Failed to fetch case study:', error)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#f0f0f0' }}>
      <h1>🔍 Debug Case Study: {id}</h1>
      
      {caseStudy ? (
        <div>
          <h2>✅ Case Study Found!</h2>
          
          <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e8f5e9', border: '1px solid #4caf50' }}>
            <h3>📋 Basic Info</h3>
            <p><strong>Title:</strong> {caseStudy.title}</p>
            <p><strong>Subtitle:</strong> {caseStudy.subtitle}</p>
            <p><strong>Year:</strong> {caseStudy.year}</p>
          </section>

          <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#fff3e0', border: '1px solid #ff9800' }}>
            <h3>🔧 Process Blocks: {caseStudy.process_blocks?.length || 0}</h3>
            {caseStudy.process_blocks && caseStudy.process_blocks.length > 0 ? (
              <div>
                {caseStudy.process_blocks.map((block, idx) => (
                  <div key={idx} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff9c4' }}>
                    <p><strong>Block {block.number}:</strong> {block.title}</p>
                    <p>{block.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No process blocks</p>
            )}
          </section>

          <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
            <h3>👤 My Role</h3>
            {caseStudy.my_role_title ? (
              <div>
                <p><strong>{caseStudy.my_role_title}</strong></p>
                <p>{caseStudy.my_role_description}</p>
              </div>
            ) : (
              <p>No role info</p>
            )}
          </section>

          <hr />
          <p><a href={`/case-studies/${id}`}>👉 View actual case study page</a></p>
        </div>
      ) : (
        <p>Case study not found!</p>
      )}
    </div>
  )
}
