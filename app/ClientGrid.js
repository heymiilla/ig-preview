'use client';

import { useState, useEffect } from 'react';

// === CABEÇALHO DO PERFIL ===
function ProfileHeader({ theme }) {
  const defaultProfile = {
    avatar: 'https://placehold.co/150x150/e0e0e0/a8a8a8?text=Foto', 
    username: 'seunome',
    name: 'Sua Descrição ou Nicho',
    bio: 'escreva aqui a sua bio\ncoloque o seu link\n(personalize como quiser)',
    link: 'https://seulink.com',
    highlights: [
      { title: 'Destaque 1', img: 'https://placehold.co/150x150/cccccc/ffffff?text=1' },
      { title: 'Destaque 2', img: 'https://placehold.co/150x150/cccccc/ffffff?text=2' },
      { title: 'Destaque 3', img: 'https://placehold.co/150x150/cccccc/ffffff?text=3' }
    ]
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [mounted, setMounted] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, field: null, index: null, tempUrl: '' });

  useEffect(() => {
    const saved = localStorage.getItem('ig-widget-profile');
    if (saved) setProfile(JSON.parse(saved));
    setMounted(true);
  }, []);

  const saveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('ig-widget-profile', JSON.stringify(newProfile));
  };

  const handleTextChange = (field, e) => {
    saveProfile({ ...profile, [field]: e.target.innerText });
  };

  const openImageModal = (field, index = null) => {
    setModal({ isOpen: true, field, index, tempUrl: '' });
  };

  const saveNewImage = () => {
    if (modal.tempUrl.trim() !== '') {
      if (modal.index !== null) {
        const newHighlights = [...profile.highlights];
        newHighlights[modal.index].img = modal.tempUrl;
        saveProfile({ ...profile, highlights: newHighlights });
      } else {
        saveProfile({ ...profile, [modal.field]: modal.tempUrl });
      }
    }
    setModal({ isOpen: false, field: null, index: null, tempUrl: '' }); 
  };

  if (!mounted) return null;

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      
      {modal.isOpen && (
        <div style={{ position: 'absolute', top: '10%', left: '0', width: '100%', background: theme.modalBg, padding: '16px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 50, border: `1px solid ${theme.border}`, boxSizing: 'border-box' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: theme.text }}>Cole o link da nova imagem:</p>
          <input 
            type="text" 
            placeholder="https://i.postimg.cc/..."
            value={modal.tempUrl} 
            onChange={(e) => setModal({ ...modal, tempUrl: e.target.value })}
            style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '4px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: '12px', boxSizing: 'border-box' }} 
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => setModal({ isOpen: false, field: null, index: null, tempUrl: '' })} style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: theme.postBg, color: theme.text, cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Cancelar</button>
            <button onClick={saveNewImage} style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: '#0095f6', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Salvar</button>
          </div>
        </div>
      )}

      {/* Margem ajustada para 76px porque agora os botões são menores! */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', paddingRight: '76px' }}>
        <img 
          src={profile.avatar} 
          alt="Avatar" 
          onClick={() => openImageModal('avatar')}
          style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: `1px solid ${theme.border}` }} 
          title="Clique para alterar a foto"
        />
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span 
              contentEditable suppressContentEditableWarning onBlur={(e) => handleTextChange('username', e)}
              style={{ fontWeight: '700', fontSize: '16px', color: theme.text, outline: 'none', borderBottom: '1px dashed transparent', cursor: 'text' }}
              title="Clique para editar"
            >{profile.username}</span>
          </div>
          <div 
            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextChange('name', e)}
            style={{ fontSize: '14px', color: theme.text, outline: 'none', marginTop: '2px', cursor: 'text' }}
          >{profile.name}</div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div 
          contentEditable suppressContentEditableWarning onBlur={(e) => handleTextChange('bio', e)}
          style={{ fontSize: '14px', color: theme.text, whiteSpace: 'pre-wrap', outline: 'none', lineHeight: '1.4', cursor: 'text' }}
        >{profile.bio}</div>
        <div 
          contentEditable suppressContentEditableWarning onBlur={(e) => handleTextChange('link', e)}
          style={{ fontSize: '14px', color: theme.link, fontWeight: '600', outline: 'none', marginTop: '4px', cursor: 'text' }}
        >{profile.link}</div>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {profile.highlights.map((highlight, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div 
              onClick={() => openImageModal('highlights', idx)}
              style={{ width: '60px', height: '60px', borderRadius: '50%', padding: '2px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Clique para alterar a capa"
            >
              <img src={highlight.img} alt={highlight.title} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <div 
              contentEditable suppressContentEditableWarning onBlur={(e) => {
                const newHighlights = [...profile.highlights];
                newHighlights[idx].title = e.target.innerText;
                saveProfile({ ...profile, highlights: newHighlights });
              }}
              style={{ fontFamily: '"Georgia", "Times New Roman", serif', fontSize: '12px', color: theme.text, outline: 'none', textAlign: 'center', maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'text' }}
            >{highlight.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === COMPONENTE DO POST NO GRID ===
function PostItem({ post, index, handleDragStart, handleDragOver, handleDrop, openPreview, theme }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasMultipleMedia = post.mediaFiles && post.mediaFiles.length > 1;
  const currentMedia = post.mediaFiles && post.mediaFiles.length > 0 ? post.mediaFiles[imgIndex] : null;

  const nextImg = (e) => {
    e.stopPropagation(); e.preventDefault();
    setImgIndex((prev) => (prev + 1) % post.mediaFiles.length);
  };
  const prevImg = (e) => {
    e.stopPropagation(); e.preventDefault();
    setImgIndex((prev) => (prev - 1 + post.mediaFiles.length) % post.mediaFiles.length);
  };

  return (
    <div 
      draggable 
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openPreview(post)} 
      style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: currentMedia?.isCanva ? 'transparent' : theme.postBg, overflow: 'hidden', cursor: 'grab' }}
    >
      {currentMedia ? (
        currentMedia.isCanva ? (
          <iframe src={currentMedia.url} style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} />
        ) : currentMedia.isVideo ? (
          <video src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} muted playsInline preload="metadata" />
        ) : (
          <img src={currentMedia.url} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
        )
      ) : (
        <div style={{ fontSize: '10px', color: theme.textSecondary, display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>Sem foto</div>
      )}

      {hasMultipleMedia ? (
        <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'white', filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.6))', pointerEvents: 'none' }}>
          <svg aria-label="Carousel" fill="currentColor" height="18" viewBox="0 0 48 48" width="18"><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1.6 1.5 3.7 2.4 6 2.4h13.4c5.5 0 10-4.5 10-10V20.5c0-2.4-.9-4.6-2.5-6.1-.4-.4-1-.1-1 .5z"></path></svg>
        </div>
      ) : currentMedia?.isVideo ? (
        <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'white', filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.6))', pointerEvents: 'none' }}>
          <svg aria-label="Reels" fill="currentColor" height="18" viewBox="0 0 24 24" width="18"><path d="M12 0a12 12 0 1012 12A12 12 0 0012 0zm5.24 12.63l-6.89 4.31A1.18 1.18 0 018.5 16V7.4a1.18 1.18 0 011.85-1l6.89 4.31a1.18 1.18 0 010 1.92z"></path></svg>
        </div>
      ) : null}

      {hasMultipleMedia && isHovered && (
        <>
          <div onMouseDown={prevImg} style={{ position: 'absolute', top: '50%', left: '4px', transform: 'translateY(-50%)', background: theme.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', color: theme.text, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', backdropFilter: 'blur(2px)' }}>❮</div>
          <div onMouseDown={nextImg} style={{ position: 'absolute', top: '50%', right: '4px', transform: 'translateY(-50%)', background: theme.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', color: theme.text, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', backdropFilter: 'blur(2px)' }}>❯</div>
        </>
      )}
    </div>
  );
}

// === GRID PRINCIPAL ===
export default function ClientGrid({ initialPosts, updateDatesInNotion }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeTab, setActiveTab] = useState('POSTS'); 
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [previewPost, setPreviewPost] = useState(null);
  const [previewImgIdx, setPreviewImgIdx] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('ig-widget-dark-mode');
    if (savedMode) setIsDarkMode(JSON.parse(savedMode));
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('ig-widget-dark-mode', JSON.stringify(newMode)); 
  };

  const theme = {
    isDark: isDarkMode,
    bg: isDarkMode ? '#000000' : '#ffffff',
    text: isDarkMode ? '#f5f5f5' : '#262626',
    textSecondary: isDarkMode ? '#a8a8a8' : '#999999',
    border: isDarkMode ? '#262626' : '#e0e0e0',
    postBg: isDarkMode ? '#121212' : '#f0f0f0',
    modalBg: isDarkMode ? '#1c1c1c' : '#ffffff',
    buttonBg: isDarkMode ? '#1c1c1c' : '#ffffff',
    link: isDarkMode ? '#e0f1ff' : '#00376b',
    overlay: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
    invertFilter: isDarkMode ? 'invert(1)' : 'none' 
  };

  const linkGrid = "https://i.postimg.cc/gJcT83gk/1.png";
  const linkReels = "https://i.postimg.cc/fLWrmY8b/2.png";
  const linkTagged = "https://i.postimg.cc/1tRjwDvt/3.png";

  const displayedPosts = posts.filter(post => {
    if (activeTab === 'POSTS') return true;
    if (activeTab === 'REELS') return post.mediaFiles && post.mediaFiles.some(m => m.isVideo);
    if (activeTab === 'TAGGED') return false; 
    return true;
  });

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e) => e.preventDefault(); 
  
  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;
    setIsUpdating(true); 

    const draggedPostId = displayedPosts[draggedIdx].id;
    const dropPostId = displayedPosts[dropIdx].id;
    
    const actualDragIdx = posts.findIndex(p => p.id === draggedPostId);
    const actualDropIdx = posts.findIndex(p => p.id === dropPostId);

    const originalDates = posts.map(p => p.date);
    const newPostsOrder = [...posts];
    const [draggedPost] = newPostsOrder.splice(actualDragIdx, 1);
    newPostsOrder.splice(actualDropIdx, 0, draggedPost);

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

  const openPreview = (post) => {
    if (!post.mediaFiles || post.mediaFiles.length === 0) return;
    setPreviewPost(post);
    setPreviewImgIdx(0);
  };
  const closePreview = () => setPreviewPost(null);
  
  const nextPreviewImg = (e) => {
    e.stopPropagation();
    setPreviewImgIdx((prev) => (prev + 1) % previewPost.mediaFiles.length);
  };
  const prevPreviewImg = (e) => {
    e.stopPropagation();
    setPreviewImgIdx((prev) => (prev - 1 + previewPost.mediaFiles.length) % previewPost.mediaFiles.length);
  };

  return (
     <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      
      <div style={{ position: 'relative', width: '340px', boxSizing: 'border-box', background: theme.bg, borderRadius: '12px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px', padding: '20px', transition: 'background-color 0.3s' }}>
        
        {/* BOTÕES SUPERIORES: Agora os dois são quadradinhos perfeitos 28x28 */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20, display: 'flex', gap: '8px' }}>
          <div 
            onClick={toggleDarkMode} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.buttonBg, color: theme.text, width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${theme.border}`, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            title="Modo Escuro / Claro"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </div>

          <div 
            onClick={handleRefresh} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.buttonBg, color: theme.text, width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${theme.border}`, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            title="Atualizar Feed"
          >
            {isUpdating ? (
              <span style={{ fontSize: '10px' }}>...</span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.6499 2.35012C12.1963 0.896472 10.2036 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C11.5312 16 14.5273 13.7056 15.5802 10.4996L13.6823 9.87329C12.9231 12.1824 10.6657 13.8462 8 13.8462C4.77056 13.8462 2.15385 11.2294 2.15385 8C2.15385 4.77056 4.77056 2.15385 8 2.15385C9.61066 2.15385 11.0691 2.80556 12.1264 3.86283L9.23077 6.75845H16V0L13.6499 2.35012Z"/></svg>
            )}
          </div>
        </div>

        <div style={{ opacity: isUpdating ? 0.6 : 1 }}>
          
          <ProfileHeader theme={theme} />

          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: `1px solid ${theme.border}`, marginBottom: '2px', marginTop: '16px' }}>
            <div onClick={() => setActiveTab('POSTS')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', borderTop: activeTab === 'POSTS' ? `1px solid ${theme.text}` : '1px solid transparent', paddingTop: '12px', paddingBottom: '12px', marginTop: '-1px', cursor: 'pointer' }}>
                <img src={linkGrid} alt="Grid" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: activeTab === 'POSTS' ? 1 : 0.35, filter: theme.invertFilter }} />
            </div>
            <div onClick={() => setActiveTab('REELS')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', borderTop: activeTab === 'REELS' ? `1px solid ${theme.text}` : '1px solid transparent', paddingTop: '12px', paddingBottom: '12px', marginTop: '-1px', cursor: 'pointer' }}>
                <img src={linkReels} alt="Reels" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: activeTab === 'REELS' ? 1 : 0.35, filter: theme.invertFilter }} />
            </div>
            <div onClick={() => setActiveTab('TAGGED')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', borderTop: activeTab === 'TAGGED' ? `1px solid ${theme.text}` : '1px solid transparent', paddingTop: '12px', paddingBottom: '12px', marginTop: '-1px', cursor: 'pointer' }}>
                <img src={linkTagged} alt="Tagged" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: activeTab === 'TAGGED' ? 1 : 0.35, filter: theme.invertFilter }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
            {displayedPosts.map((post, index) => (
              <PostItem 
                key={post.id} 
                post={post} 
                index={index} 
                handleDragStart={handleDragStart} 
                handleDragOver={handleDragOver} 
                handleDrop={handleDrop} 
                openPreview={openPreview}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* === TELA CHEIA (PREVIEW) === */}
        {previewPost && (
          <div style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: theme.overlay, 
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            zIndex: 100, display: 'flex', flexDirection: 'column', borderRadius: '12px', 
            padding: '16px', boxSizing: 'border-box' 
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>Pré-visualização</span>
              <div onClick={closePreview} style={{ cursor: 'pointer', background: theme.buttonBg, color: theme.text, borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: `1px solid ${theme.border}`, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                ✕
              </div>
            </div>

            <div style={{ position: 'relative', flexGrow: 1, minHeight: 0, backgroundColor: 'transparent', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {previewPost.mediaFiles[previewImgIdx].isCanva ? (
                 <iframe src={previewPost.mediaFiles[previewImgIdx].url} style={{ width: '100%', height: '100%', border: 'none' }} />
              ) : previewPost.mediaFiles[previewImgIdx].isVideo ? (
                 <video src={previewPost.mediaFiles[previewImgIdx].url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} autoPlay controls playsInline />
              ) : (
                 <img src={previewPost.mediaFiles[previewImgIdx].url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
              
              {previewPost.mediaFiles.length > 1 && (
                <>
                  <div onClick={prevPreviewImg} style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: theme.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', color: theme.text, borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>❮</div>
                  <div onClick={nextPreviewImg} style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: theme.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', color: theme.text, borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>❯</div>
                  
                  <div style={{ position: 'absolute', bottom: '12px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                    {previewPost.mediaFiles.map((_, idx) => (
                      <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: idx === previewImgIdx ? '#0095f6' : 'rgba(255,255,255,0.6)', transition: 'background-color 0.2s' }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {previewPost.caption && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                backgroundColor: theme.bg, 
                borderRadius: '8px', 
                border: `1px solid ${theme.border}`, 
                color: theme.text, 
                fontSize: '13px', 
                lineHeight: '1.5', 
                maxHeight: '120px', 
                overflowY: 'auto', 
                whiteSpace: 'pre-wrap',
                flexShrink: 0
              }}>
                <strong style={{ marginRight: '6px' }}>Legenda:</strong>
                {previewPost.caption}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
