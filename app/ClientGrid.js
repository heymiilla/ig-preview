'use client';

import { useState } from 'react';

// === NOVO COMPONENTE: O Post Individual (Cuida do carrossel e do ícone) ===
function PostItem({ post, index, handleDragStart, handleDragOver, handleDrop }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;

  // Funções para passar as fotos do carrossel
  const nextImg = (e) => {
    e.stopPropagation(); e.preventDefault();
    setImgIndex((prev) => (prev + 1) % post.imageUrls.length);
  };
  const prevImg = (e) => {
    e.stopPropagation(); e.preventDefault();
    setImgIndex((prev) => (prev - 1 + post.imageUrls.length) % post.imageUrls.length);
  };

  return (
    <div 
      draggable 
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: '#f0f0f0', overflow: 'hidden', cursor: 'grab' }}
    >
      {/* Imagem do Post */}
      {post.imageUrls && post.imageUrls.length > 0 ? (
        <img src={post.imageUrls[imgIndex]} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      ) : (
        <div style={{ fontSize: '10px', color: '#999', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>Sem foto</div>
      )}

      {/* Ícone Oficial de Carrossel do Instagram no topo direito */}
      {hasMultipleImages && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'white', filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.6))', pointerEvents: 'none' }}>
          <svg aria-label="Carousel" fill="currentColor" height="18" viewBox="0 0 48 48" width="18">
            <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1.6 1.5 3.7 2.4 6 2.4h13.4c5.5 0 10-4.5 10-10V20.5c0-2.4-.9-4.6-2.5-6.1-.4-.4-1-.1-1 .5z"></path>
          </svg>
        </div>
      )}

      {/* Setinhas de navegação (Só aparecem quando passa o mouse e se tiver mais de 1 foto) */}
      {hasMultipleImages && isHovered && (
        <>
          <div onMouseDown={prevImg} style={{ position: 'absolute', top: '50%', left: '4px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', backdropFilter: 'blur(2px)' }}>❮</div>
          <div onMouseDown={nextImg} style={{ position: 'absolute', top: '50%', right: '4px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', backdropFilter: 'blur(2px)' }}>❯</div>
        </>
      )}
    </div>
  );
}

// === GRID PRINCIPAL ===
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
  const handleDragOver = (e) => e.preventDefault(); 
  
  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;
    setIsUpdating(true); 

    const originalDates = posts.map(p => p.date);
    const newPostsOrder = [...posts];
    const [draggedPost] = newPostsOrder.splice(draggedIdx, 1);
    newPostsOrder.splice(dropIdx, 0, draggedPost);

    const postsToUpdate = [];
    const finalPosts = newPostsOrder.map((post, index) => {
      const correctDate = originalDates[index];
      if (post.date !== correctDate) postsToUpdate.push({ id: post.id, newDate: correctDate });
      return { ...post, date: correctDate };
    });

    setPosts(finalPosts);
    if (postsToUpdate.length > 0) await updateDatesInNotion(postsToUpdate);
    setIsUpdating(false);
  };

  const handleRefresh = () => {
    setIsUpdating(true);
    window.location.reload(); 
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
            <PostItem 
              key={post.id} 
              post={post} 
              index={index} 
              handleDragStart={handleDragStart} 
              handleDragOver={handleDragOver} 
              handleDrop={handleDrop} 
            />
          ))}
        </div>

      </div>
    </div>
  );
}
