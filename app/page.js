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
  const inactiveColor = '#a8a8a8';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      
      <div style={{ width: '340px', background: 'white', borderRadius: '12px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px', padding: '20px' }}>
        
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#37352f' }}>Grid preview</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#787774', lineHeight: '1.4' }}>
            A visual preview of your Instagram content in a grid, automatically updated from the database.
          </p>
        </div>

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

        {/* Abas de Navegação (Apenas Ícones, Centrados) */}
        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e0e0e0', color: inactiveColor, marginBottom: '2px' }}>
           
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: activeColor, borderTop: '1px solid #262626', paddingTop: '12px', paddingBottom: '12px', marginTop: '-1px', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: inactiveColor, paddingTop: '12px', paddingBottom: '12px', cursor: 'pointer' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="m10 10 5 3-5 3V10Z"/><path d="M2 10a1 1 0 0 1 1-1h1.34a1 1 0 0 0 .7-.3l1.17-1.17A1.5 1.5 0 0 1 7.28 7H16.7a1.5 1.5 0 0 1 1.07.44l1.17 1.17a1 1 0 0 0 .7.3H21a1 1 0 0 1 1 1v4h-4a1 1 0 0 0-1 1h-1a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H5a1 1 0 0 0-1-1H2v-4Z"/></svg>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: inactiveColor, paddingTop: '12px', paddingBottom: '12px', cursor: 'pointer' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M12 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M20 20a8 8 0 0 0-16 0"/><circle cx="12" cy="12" r="2"/></svg>
           </div>
        </div>

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
