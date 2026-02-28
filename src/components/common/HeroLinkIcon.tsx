type HeroLinkIconName = 'start' | 'knowledge' | 'blog' | 'github';

type HeroLinkIconProps = {
  name: HeroLinkIconName;
};

const iconPathMap: Record<HeroLinkIconName, JSX.Element> = {
  start: (
    <>
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12.8 7.2L8 9.1 6.2 13.8l4.8-1.9 1.8-4.7z" fill="currentColor" />
    </>
  ),
  knowledge: (
    <>
      <path
        d="M3.5 5.2c0-1 .8-1.7 1.8-1.7h4.8c1 0 2 .4 2.7 1.1.7-.7 1.7-1.1 2.7-1.1h1.2c1 0 1.8.8 1.8 1.7v9.6c0 .6-.5 1.1-1.1 1.1h-2.2c-1 0-2 .4-2.7 1.1-.7-.7-1.7-1.1-2.7-1.1H4.6c-.6 0-1.1-.5-1.1-1.1V5.2z"
        fill="currentColor"
      />
      <path d="M7 7.6h3.6M7 10h3.6M13 7.6h3M13 10h3" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  blog: (
    <>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2.3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 13l4.8-4.8 1.8 1.8L8.8 14.8H7V13z" fill="currentColor" />
      <path d="M6.8 7h6.4M6.8 9.6h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  github: (
    <path
      d="M10 2.5a7.5 7.5 0 0 0-2.37 14.62c.37.07.5-.16.5-.36v-1.35c-2.03.44-2.46-.86-2.46-.86-.33-.84-.82-1.06-.82-1.06-.67-.46.05-.45.05-.45.74.05 1.13.76 1.13.76.66 1.13 1.74.8 2.16.6.07-.47.26-.8.47-.99-1.62-.18-3.32-.8-3.32-3.59 0-.8.28-1.45.75-1.96-.08-.18-.33-.92.07-1.92 0 0 .61-.2 2 .75a7.03 7.03 0 0 1 3.64 0c1.38-.95 2-.75 2-.75.4 1 .15 1.74.07 1.92.47.51.75 1.16.75 1.96 0 2.79-1.71 3.41-3.34 3.58.27.23.5.67.5 1.36v2.01c0 .2.13.43.5.36A7.5 7.5 0 0 0 10 2.5z"
      fill="currentColor"
    />
  )
};

export const HeroLinkIcon = ({ name }: HeroLinkIconProps) => (
  <span className="hero-link-icon" aria-hidden="true">
    <svg viewBox="0 0 20 20" role="img">
      {iconPathMap[name]}
    </svg>
  </span>
);
