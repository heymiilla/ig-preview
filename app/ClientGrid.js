'use client';

import { useState } from 'react';

export default function ClientGrid({ initialPosts, updateDatesInNotion }) {
  const [posts, setPosts] = useState(initialPosts);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // === COLE SEUS LINKS DO POSTIMAGES AQUI ===
  const linkGrid = "https://i.postimg.cc/gJcT83gk/1.png";
  const linkReels = "https://i.postimg.cc/fLWrmY8b/2.png";
  const linkTagged = "https://i.postimg.cc/1tRjwDvt/3.png";
  // ===========================================

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;

    setIsUpdating(true); 

    const draggedPost = posts[draggedIdx];
    const droppedPost = posts[dropIdx];

    // 1. Troca as fotos na tela imediatamente
    const newPosts = [...posts];
    newPosts[draggedIdx] = droppedPost;
    newPosts[dropIdx] = draggedPost;
    setPosts(newPosts);

    // 2. Avisa o Notion das datas corretas
    await updateDatesInNotion(
      draggedPost.id, droppedPost.date, 
      droppedPost.id, draggedPost.date
    );

    setIsUpdating(false);
  };

  const handleRefresh = () => {
    setIsUpdating(true);
    window.location.reload(); // Refresh bruto que funciona 100% das vezes
  };

  return (
     <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      
      <div style={{ width: '340px', background: 'white', borderRadius: '12px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px', padding: '20px', opacity: isUpdating ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'white', color: '#37352f', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer', fontWeight: '500' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.6499 2.35012C12.1963 0.896472 10.2036 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C11.5312 16 14.5273 13.7056 15.5802 10.4996L13.6823 9.87329C12.9231 12.1824 10.6657 13.8462 8 13.8462C4.77056 13.8462 2.15385 11.2294 2.15385 8C2.15385 4.77056 4.77056 2.15385 8 2.15385C9.61066 2.15385 11.0691 2.80556 12.1264 3.86283L9.23077 6.75845H16V0L13.6499 2.35012Z"/></svg>
            {isUpdating ? 'Salvando...' : 'Refresh'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', background: 'white', color: '#37352f', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer', fontWeight: '500' }}>Plan grid</div>
          <div style={{ color: '#787774', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>•••</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e0e0e0', marginBottom: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', borderTop: '1px solid #262626', paddingTop: '12px', paddingBottom: '12px', marginTop: '-1px', cursor: 'pointer' }}>
              <img src={linkGrid} alt="Grid" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: 1 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: '12px', paddingBottom: '12px', cursor: 'pointer' }}>
              <img src={linkReels} alt="Reels" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: 0.35 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: '12px', paddingBottom: '12px', cursor: 'pointer' }}>
              <img src={linkTagged} alt="Tagged" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: 0.35 }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              draggable 
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              style={{ aspectRatio: '4/5', backgroundColor: '#f0f0f0', overflow: 'hidden', cursor: 'grab' }}
            >
              {post.imageUrl ? (
                <img src={post.imageUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              ) : (
                <div style={{ fontSize: '10px', color: '#999', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5px' }}>Sem foto</div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
