'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, ButtonBase, Container, Dialog, DialogContent, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type GalleryImage = {
  _id?: string;
  image: string;
  title?: string;
  caption?: string;
  category?: string;
};

export default function ImageGallery({ category, showHeader = true }: { category?: string; showHeader?: boolean }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  // Which group's lightbox is open and the index of the image inside it.
  const [viewer, setViewer] = useState<{ groupIndex: number; imageIndex: number } | null>(null);

  useEffect(() => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    fetch(`/api/gallery${query}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) setImages(result.data || []);
      })
      .catch(() => {});
  }, [category]);

  const groups = category
    ? [{ category, images }]
    : Object.entries(
        images.reduce((all: Record<string, GalleryImage[]>, image) => {
          const key = image.category || 'other';
          (all[key] ||= []).push(image);
          return all;
        }, {}),
      ).map(([name, groupedImages]) => ({ category: name, images: groupedImages }));

  const openViewer = (groupIndex: number, imageIndex: number) => setViewer({ groupIndex, imageIndex });
  const closeViewer = () => setViewer(null);

  const showNext = useCallback(() => {
    setViewer((current) => {
      if (!current) return current;
      const group = groups[current.groupIndex];
      if (!group) return current;
      const next = (current.imageIndex + 1) % group.images.length;
      return { ...current, imageIndex: next };
    });
  }, [groups]);

  const showPrev = useCallback(() => {
    setViewer((current) => {
      if (!current) return current;
      const group = groups[current.groupIndex];
      if (!group) return current;
      const prev = (current.imageIndex - 1 + group.images.length) % group.images.length;
      return { ...current, imageIndex: prev };
    });
  }, [groups]);

  // Keyboard navigation inside the lightbox.
  useEffect(() => {
    if (!viewer) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'Escape') closeViewer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewer, showNext, showPrev]);

  if (!images.length) return null;

  const activeGroup = viewer ? groups[viewer.groupIndex] : null;
  const activeImage = activeGroup ? activeGroup.images[viewer.imageIndex] : null;
  const totalInGroup = activeGroup ? activeGroup.images.length : 0;

  const navButtonSx = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    color: 'white',
    bgcolor: 'rgba(255,255,255,.12)',
    p: { xs: 0.5, md: 1 },
    '&:hover': { bgcolor: 'rgba(255,255,255,.22)' },
  } as const;

  return (
    <>
      <Box component="section" sx={{ bgcolor: '#f4f1eb', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          {showHeader && (
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ color: '#e76f51', fontWeight: 800, letterSpacing: 1 }}>FROM THE FIELD</Typography>
              <Typography component="h2" sx={{ color: '#102c3b', fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' } }}>हाम्रा झलकहरू</Typography>
              <Typography sx={{ color: '#68777b', mt: 1 }}>Our work, people and shared moments.</Typography>
            </Box>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {groups.map((group, groupIndex) => {
              const isExpanded = expandedCategory === group.category;
              const preview = group.images[0];
              return (
                <Box key={group.category} sx={{ mb: 3, gridColumn: isExpanded ? '1 / -1' : 'auto', '&:last-child': { mb: 0 } }}>
                  <ButtonBase
                    onClick={() => setExpandedCategory(isExpanded ? null : group.category)}
                    aria-expanded={isExpanded}
                    sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left', borderRadius: 1, overflow: 'hidden', bgcolor: '#fff', '&:hover': { bgcolor: '#edf4f0' } }}
                  >
                    <Box component="img" src={preview.image} alt="" sx={{ width: '100%', height: { xs: 150, sm: 170 }, objectFit: 'cover' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography component="h3" sx={{ color: '#102c3b', fontWeight: 800, fontSize: { xs: '1.15rem', md: '1.3rem' }, textTransform: 'capitalize' }}>{group.category}</Typography>
                        <Typography sx={{ color: '#68777b', fontSize: '.9rem' }}>{group.images.length} {group.images.length === 1 ? 'image' : 'images'}</Typography>
                      </Box>
                      <ExpandMoreIcon sx={{ color: '#16866d', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                    </Box>
                  </ButtonBase>
                  {isExpanded && (
                    <ImageList variant="standard" cols={3} gap={14} sx={{ m: 0, mt: 2, '@media (max-width:600px)': { gridTemplateColumns: 'repeat(2, 1fr) !important' } }}>
                      {group.images.map((image, imageIndex) => (
                        <ImageListItem key={image._id || imageIndex} sx={{ cursor: 'zoom-in', overflow: 'hidden', borderRadius: 1, '& img': { width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', transition: 'transform .3s' }, '&:hover img': { transform: 'scale(1.05)' } }}>
                          <img src={image.image} alt={image.title || image.category || ''} loading="lazy" onClick={() => openViewer(groupIndex, imageIndex)} />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Dialog
        open={Boolean(activeImage)}
        onClose={closeViewer}
        fullScreen
        PaperProps={{ sx: { bgcolor: 'rgba(8,20,27,.98)' } }}
      >
        <IconButton onClick={closeViewer} aria-label="Close full screen image" sx={{ position: 'fixed', top: 16, right: 16, zIndex: 3, color: 'white', bgcolor: 'rgba(255,255,255,.12)', '&:hover': { bgcolor: 'rgba(255,255,255,.22)' } }}>
          <CloseIcon />
        </IconButton>

        {totalInGroup > 1 && (
          <>
            <IconButton onClick={showPrev} aria-label="Previous image" sx={{ ...navButtonSx, left: { xs: 4, md: 24 } }}>
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={showNext} aria-label="Next image" sx={{ ...navButtonSx, right: { xs: 4, md: 24 } }}>
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </>
        )}

        <DialogContent sx={{ display: 'grid', placeItems: 'center', p: { xs: 2, md: 6 } }}>
          {activeImage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box component="img" src={activeImage.image} alt={activeImage.title || activeImage.category || ''} sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
              <Box sx={{ textAlign: 'center' }}>
                {(activeImage.title || activeImage.caption) && (
                  <Typography sx={{ color: 'white', fontWeight: 700 }}>{activeImage.title || activeImage.caption}</Typography>
                )}
                <Typography sx={{ color: 'rgba(255,255,255,.65)', fontSize: '.9rem', mt: 0.5, textTransform: 'capitalize' }}>
                  {activeGroup?.category}{totalInGroup > 1 ? ` · ${viewer.imageIndex + 1} / ${totalInGroup}` : ''}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

