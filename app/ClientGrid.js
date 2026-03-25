'use client';

import { useState } from 'react';

// === COMPONENTE DO POST NO GRID ===
function PostItem({ post, index, handleDragStart, handleDragOver, handleDrop, openPreview }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;

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
      onClick={() => openPreview(post)} // <-- NOVO: Abre a tela cheia ao clicar!
      style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: '#f0f0f0', overflow: 'hidden', cursor: 'grab' }}
    >
      {post.imageUrls && post.imageUrls.length > 0 ? (
        <img src={post.imageUrls[imgIndex]} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      ) : (
        <div style={{ fontSize: '10px', color: '#999', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>Sem foto</div>
      )}

      {hasMultipleImages && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'white', filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.6))', pointerEvents: 'none' }}>
          <svg aria-label="Carousel" fill="currentColor" height="18" viewBox="0 0 48 48" width="18">
            <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1.6 1.5 3.7 2.4 6 2.4h13.4c5.5 0 10-4.5 10-10V20.5c0-2.4-.9-4.6-2.5-6.1-.4-.4-1-.1-1 .5z"></path>
          </svg>
        </div>
      )}

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
  
  // === ESTADOS DO PREVIEW (TELA CHEIA) ===
  const [previewPost, setPreviewPost] = useState(null);
  const [previewImgIdx, setPreviewImgIdx] = useState(0);

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

  // Funções do Preview
  const openPreview = (post) => {
    if (!post.imageUrls || post.imageUrls.length === 0) return;
    setPreviewPost(post);
    setPreviewImgIdx(0);
  };
  const closePreview = () => setPreviewPost(null);
  const nextPreviewImg = (e) => {
    e.stopPropagation();
    setPreviewImgIdx((prev) => (prev + 1) % previewPost.imageUrls.length);
  };
  const prevPreviewImg = (e) => {
    e.stopPropagation();
    setPreviewImgIdx((prev) => (prev - 1 + previewPost.imageUrls.length) % previewPost.imageUrls.length);
  };

  return (
     <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      
      {/* Container principal precisa de position: relative para a tela de preview ficar por cima dele */}
      <div style={{ position: 'relative', width: '340px', background: 'white', borderRadius: '12px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px', padding: '20px', transition: 'opacity 0.2s' }}>
        
        {/* Camada de Opacidade (quando atualiza as datas) */}
        <div style={{ opacity: isUpdating ? 0.6 : 1 }}>
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
                openPreview={openPreview} // Passando a função para dentro do quadradinho
              />
            ))}
          </div>
        </div>

        {/* === TELA CHEIA (MODAL DE PREVIEW) === */}
        {previewPost && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.96)', zIndex: 10, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', padding: '16px' }}>
            
            {/* Cabeçalho do Preview com botão fechar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>Pré-visualização</span>
              <div onClick={closePreview} style={{ cursor: 'pointer', background: '#f5f5f5', color: '#262626', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                ✕
              </div>
            </div>

            {/* Imagem Ampliada */}
            <div style={{ position: 'relative', flexGrow: 1, backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={previewPost.imageUrls[previewImgIdx]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Setas Grandes do Carrossel (só se tiver mais de 1 foto) */}
              {previewPost.imageUrls.length > 1 && (
                <>
                  <div onClick={prevPreviewImg} style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', color: '#262626', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>❮</div>
                  <div onClick={nextPreviewImg} style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', color: '#262626', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>❯</div>
                  
                  {/* Bolinhas indicadoras (Dots) */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                    {previewPost.imageUrls.map((_, idx) => (
                      <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: idx === previewImgIdx ? '#0095f6' : 'rgba(255,255,255,0.6)', transition: 'background-color 0.2s' }} />
                    ))}
                  </div>
                </>
              )}
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
