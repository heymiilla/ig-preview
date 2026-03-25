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
      page_size: 18, // Aumentamos para buscar mais posts e preencher a aba de Reels!
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
  
  // ATUALIZAÇÃO: O código agora detecta se o arquivo é um vídeo (.mp4, .mov, etc)
  const posts = data.results.map((post) => {
    const files = post.properties['Imagem']?.files || [];
    
    const mediaFiles = files.map((file) => {
      const url = file.type === 'external' ? file.external.url : file.file?.url;
      const name = (file.name || '').toLowerCase();
      // Se o nome do arquivo ou a URL tiver formato de vídeo, ele marca como isVideo = true
      const isVideo = name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm') || url.includes('.mp4');
      return { url, isVideo };
    }).filter(m => m.url); // Filtra para garantir que tem link

    const date = post.properties['Data de Publicação']?.date?.start;
    return { id: post.id, mediaFiles, date };
  });

  async function updateDatesInNotion(postsToUpdate) {
    'use server';
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
