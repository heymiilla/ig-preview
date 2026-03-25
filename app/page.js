import { Client } from '@notionhq/client';

// Isso impede que as imagens do Notion expirem
export const revalidate = 0; 

const notion = new Client({ auth: process.env.NOTION_SECRET });

export default async function InstagramGrid() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    sorts: [{ property: 'Data de Publicação', direction: 'descending' }],
    page_size: 9, 
  });

  const posts = response.results;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '320px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', padding: '15px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Grid Preview</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
          {posts.map((post) => {
            const imageFile = post.properties['Imagem']?.files[0];
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
