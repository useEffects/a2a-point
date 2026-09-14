import { theme } from '@a2apoint/tailwind-theme/src/colors';

export default function Home() {
  return (
    <div className="bg-white flex gap-4 flex-wrap">
      {Object.entries(theme.light).map(([k, v]) => (
        <div
          id={k + v}
          style={{ background: v, color: 'black' }}
          className="w-20 h-20 flex justify-center items-center"
        >
          {k}
        </div>
      ))}
      {Object.entries(theme.dark).map(([k, v]) => (
        <div
          id={k + v}
          style={{ background: v, color: 'white' }}
          className="w-20 h-20 flex justify-center items-center"
        >
          {k}
        </div>
      ))}
    </div>
  );
}
