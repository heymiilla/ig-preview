export const revalidate = 0;

export default async function InstagramGrid() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const secret = process.env.NOTION_SECRET;

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secret}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page_size: 9,
      sorts: [{ property: 'Data de Publicação', direction: 'descending' }],
    }),
  });

  if (!res.ok) {
    const errorData = await res.text();
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
        <h3>Erro de Conexão com o Notion:</h3>
        <pre style={{ fontSize: '11px', background: '#fdd', padding: '10px', borderRadius: '5px' }}>{errorData}</pre>
      </div>
    );
  }

  const data = await res.json();
  const posts = data.results;

  const activeColor = '#262626'; 
  const inactiveColor = '#8e8e8e'; 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      
      <div style={{ width: '340px', background: 'white', borderRadius: '12px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px', padding: '20px' }}>
        
        {/* Apenas os Botões Superiores ficaram */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'white', color: '#37352f', textDecoration: 'none', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer', fontWeight: '500' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.6499 2.35012C12.1963 0.896472 10.2036 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C11.5312 16 14.5273 13.7056 15.5802 10.4996L13.6823 9.87329C12.9231 12.1824 10.6657 13.8462 8 13.8462C4.77056 13.8462 2.15385 11.2294 2.15385 8C2.15385 4.77056 4.77056 2.15385 8 2.15385C9.61066 2.15385 11.0691 2.80556 12.1264 3.86283L9.23077 6.75845H16V0L13.6499 2.35012Z"/></svg>
            Refresh
          </a>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', background: 'white', color: '#37352f', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer', fontWeight: '500' }}>
            Plan grid
          </div>
          <div style={{ color: '#787774', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>•••</div>
        </div>

        {/* Abas de Navegação */}
        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e0e0e0', color: inactiveColor, marginBottom: '2px' }}>
           
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: activeColor, borderTop: '1px solid #262626', paddingTop: '12px', paddingBottom: '12px', marginTop: '-1px', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1"/>
                <line x1="10" y1="3" x2="10" y2="21"/>
                <line x1="10" y1="12" x2="21" y2="12"/>
              </svg>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: inactiveColor, paddingTop: '12px', paddingBottom: '12px', cursor: 'pointer' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="1"/>
                <path d="M10 10l5 3-5 3v-6z"/>
                <line x1="7" y1="5" x2="7" y2="19"/>
               </svg>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: inactiveColor, paddingTop: '12px', paddingBottom: '12px', cursor: 'pointer' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 19v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/>
                <circle cx="10" cy="7" r="4"/>
                <path d="M22 8l-6 6L22 20V8z"/>
               </svg>
           </div>
        </div>

        {/* Grade de Fotos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
          {posts.map((post) => {
            const imageFile = post.properties['Imagem']?.files?.[0];
            const imageUrl = imageFile?.type === 'external' ? imageFile.external.url : imageFile?.file?.url;

            return (
              <div key={post.id} style={{ aspectRatio: '4/5', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '10px', color: '#999', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5px' }}>Sem foto</div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
