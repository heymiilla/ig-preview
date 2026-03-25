import ClientGrid from './ClientGrid';

export const revalidate = 0;

export default async function Page() {
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
  
  const posts = data.results.map((post) => {
    const imageFile = post.properties['Imagem']?.files?.[0];
    const imageUrl = imageFile?.type === 'external' ? imageFile.external.url : imageFile?.file?.url;
    const date = post.properties['Data de Publicação']?.date?.start;
    return { id: post.id, imageUrl, date };
  });

  // CORREÇÃO: Agora o servidor recebe uma lista de posts e atualiza o calendário em fila (Shift)
  async function updateDatesInNotion(postsToUpdate) {
    'use server';
    
    // Processa a fila um por um para não sobrecarregar o Notion
    for (const post of postsToUpdate) {
      if (!post.newDate) continue; 
      
      await fetch(`https://api.notion.com/v1/pages/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            'Data de Publicação': { date: { start: post.newDate } }
          }
        })
      });
    }
  }

  return <ClientGrid initialPosts={posts} updateDatesInNotion={updateDatesInNotion} />;
}
