# Cover clip

Put the studio's showreel here as `showreel.mp4` (muted, ~10 s, H.264, 720p or 1080p, a few MB)
and set `coverVideo` in `src/content/index.ts`:

```ts
export const coverVideo: string | null = '/video/showreel.mp4';
```

The cover then plays it inline on every device, phones included. VK's embedded player cannot be
used there: mobile browsers block the third-party cookies it needs and it renders «видео
недоступно». Until a file is dropped here, phones cross-fade through studio frames (`coverReel`)
and the play button opens the showreel in the VK app.
