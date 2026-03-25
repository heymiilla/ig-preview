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
      <div style={{ padding: '20px', color: 'red', fontFamily: 'sans-serif' }}>
        <h3>Erro de Conexão com o Notion:</h3>
        <pre style={{ fontSize: '11px', background: '#fdd', padding: '10px', borderRadius: '5px' }}>{errorData}</pre>
      </div>
    );
  }

  const data = await res.json();
  const posts = data.results;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      
      {/* Caixa Principal com sombra suave idêntica ao Notion */}
      <div style={{ width: '340px', background: 'white', borderRadius: '12px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px', padding: '20px' }}>
        
        {/* Título e Subtítulo */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#37352f' }}>Grid preview</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#787774', lineHeight: '1.4' }}>
            A visual preview of your Instagram content in a grid, automatically updated from the database.
          </p>
        </div>

        {/* Botões Superiores */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          
          {/* O nosso Botão de Refresh que recarrega a página */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'white', color: '#37352f', textDecoration: 'none', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer', fontWeight: '500' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.6499 2.35012C12.1963 0.896472 10.2036 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C11.5312 16 14.5273 13.7056 15.5802 10.4996L13.6823 9.87329C12.9231 12.1824 10.6657 13.8462 8 13.8462C4.77056 13.8462 2.15385 11.2294 2.15385 8C2.15385 4.77056 4.77056 2.15385 8 2.15385C9.61066 2.15385 11.0691 2.80556 12.1264 3.86283L9.23077 6.75845H16V0L13.6499 2.35012Z"/></svg>
            Refresh
          </a>
          
          {/* Botão de enfeite para ficar igual ao seu design original */}
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', background: 'white', color: '#37352f', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer', fontWeight: '500' }}>
            Plan grid
          </div>
        </div>

        {/* Abas com Ícones */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '8px', marginBottom: '16px', color: '#787774' }}>
           <div style={{ cursor: 'pointer', color: '#37352f', borderBottom: '2px solid #37352f', paddingBottom: '7px', marginBottom: '-9px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
           </div>
           <div style={{ cursor: 'pointer' }}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></rect><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
           </div>
        </div>

        {/* A Grade de Fotos (Sem bordas arredondadas internas, como no Instagram real) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {posts.map((post) => {
            const imageFile = post.properties['Imagem']?.files?.[0];
            const imageUrl = imageFile?.type === 'external' ? imageFile.external.url : imageFile?.file?.url;

            return (
              <div key={post.id} style={{ aspectRatio: '1/1', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '10px', color: '#999', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>Sem foto</div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
