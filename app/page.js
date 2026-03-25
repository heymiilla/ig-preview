import ClientGrid from './ClientGrid';

export const revalidate = 0;

export default async function Page() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const secret = process.env.NOTION_SECRET;

  // 1. Busca os posts no Notion
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
  
  // Limpa o entulho e separa só o que a tela vai precisar (ID, Foto e Data)
  const posts = data.results.map((post) => {
    const imageFile = post.properties['Imagem']?.files?.[0];
    const imageUrl = imageFile?.type === 'external' ? imageFile.external.url : imageFile?.file?.url;
    const date = post.properties['Data de Publicação']?.date?.start;
    return { id: post.id, imageUrl, date };
  });

  // 2. FUNÇÃO SECRETA DO SERVIDOR: Troca as datas no Notion quando você solta a foto
  async function swapDatesInNotion(id1, date1, id2, date2) {
    'use server'; // Essa tag mágica impede que a senha vaze
    
    const updatePage = async (pageId, newDate) => {
      await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            'Data de Publicação': { date: { start: newDate } }
          }
        })
      });
    };

    // Atualiza as duas páginas no Notion ao mesmo tempo
    await Promise.all([updatePage(id1, date2), updatePage(id2, date1)]);
  }

  // Chama a tela e entrega os posts e a função secreta para ela
  return <ClientGrid initialPosts={posts} swapDatesInNotion={swapDatesInNotion} />;
}
