import { Howl } from 'howler';

export function createSprite(src: string, cues: Record<string, [number, number]>) {
  const howl = new Howl({ src: [src], html5: true });
  return {
    play(name: string) {
      const [start, end] = cues[name];
      howl.play();
      howl.seek(start);
      setTimeout(() => howl.stop(), (end - start) * 1000);
    }
  };
}