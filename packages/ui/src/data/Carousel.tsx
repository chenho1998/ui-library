import * as React from 'react';
import { cx, useControllableState } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Required accessible name for the carousel region, e.g. `"Product photos"`. */
  'aria-label': string;
  /** Controlled active slide index (0-based). */
  index?: number;
  /** Initial active slide index when uncontrolled. Default `0`. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Wrap around from the last slide to the first (and vice versa). Default `false`. */
  loop?: boolean;
  /** Auto-advance interval in ms (pauses on hover, focus and reduced motion). Default `false`. */
  autoPlay?: number | false;
  /** Number of slides visible side-by-side. Default `1`. */
  slidesPerView?: number;
  /** Show Previous / Next buttons. Default `true`. */
  showControls?: boolean;
  /** Show slide indicator dots. Default `true`. */
  showIndicators?: boolean;
}

export interface CarouselSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional slide label; defaults to `"Slide N of M"`. */
  label?: string;
}

const CarouselSlide = /* @__PURE__ */ React.forwardRef<HTMLDivElement, CarouselSlideProps>(function CarouselSlide(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('ui-carousel__slide', className)} {...rest} />;
});

const SWIPE_THRESHOLD = 40;

const CarouselRoot = /* @__PURE__ */ React.forwardRef<HTMLElement, CarouselProps>(function Carousel(
  {
    'aria-label': ariaLabel,
    index: controlledIndex,
    defaultIndex = 0,
    onIndexChange,
    loop = false,
    autoPlay = false,
    slidesPerView = 1,
    showControls = true,
    showIndicators = true,
    className,
    children,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const slides = React.Children.toArray(children).filter(React.isValidElement);
  const count = slides.length;
  const visibleCount = Math.max(1, Math.min(slidesPerView, count || 1));
  const maxIndex = Math.max(0, count - visibleCount);
  const [rawIndex, setRawIndex] = useControllableState(controlledIndex, defaultIndex, onIndexChange);
  const current = Math.max(0, Math.min(maxIndex, rawIndex));
  const [pausedByHover, setPausedByHover] = React.useState(false);
  const [pausedByUser, setPausedByUser] = React.useState(false);
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);

  const goTo = React.useCallback(
    (next: number) => {
      if (count <= 1) return;
      if (loop) {
        const mod = ((next % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
        setRawIndex(mod);
      } else {
        setRawIndex(Math.max(0, Math.min(maxIndex, next)));
      }
    },
    [count, loop, maxIndex, setRawIndex],
  );

  React.useEffect(() => {
    if (!autoPlay || autoPlay <= 0 || count <= 1 || pausedByHover || pausedByUser) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setRawIndex(current >= maxIndex ? 0 : current + 1);
    }, autoPlay);
    return () => window.clearInterval(id);
  }, [autoPlay, count, pausedByHover, pausedByUser, current, maxIndex, setRawIndex]);

  const canPrev = loop ? count > 1 : current > 0;
  const canNext = loop ? count > 1 : current < maxIndex;
  const slideOf = locale.slideOf ?? ((n: number, total: number) => `${n} of ${total}`);

  return (
    // WAI-ARIA carousel region pauses auto-play on hover/focus and handles arrow keys from its controls.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cx('ui-carousel', className)}
      onMouseEnter={(e) => {
        setPausedByHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setPausedByHover(false);
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        setPausedByHover(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausedByHover(false);
        onBlur?.(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goTo(current - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goTo(current + 1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          goTo(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          goTo(maxIndex);
        }
      }}
      {...rest}
    >
      <div
        className="ui-carousel__viewport"
        onPointerDown={(e) => {
          if (e.button !== 0 || (e.target as HTMLElement).closest('button, a, input, textarea, select')) return;
          dragStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = dragStart.current;
          dragStart.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            goTo(dx < 0 ? current + 1 : current - 1);
          }
        }}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
      >
        <div
          className="ui-carousel__track"
          aria-live={autoPlay && !pausedByUser ? 'off' : 'polite'}
          style={{
            transform: `translateX(-${(current * 100) / visibleCount}%)`,
            ['--_slides' as string]: visibleCount,
          }}
        >
          {slides.map((child, i) => {
            const visible = i >= current && i < current + visibleCount;
            const customLabel = (child.props as CarouselSlideProps).label;
            return (
              <div
                key={child.key ?? i}
                role="group"
                aria-roledescription="slide"
                aria-label={customLabel ?? slideOf(i + 1, count)}
                data-inactive={!visible || undefined}
                className="ui-carousel__item"
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>

      {showControls && count > 1 ? (
        <div className="ui-carousel__controls">
          <button
            type="button"
            className="ui-carousel__nav"
            aria-label={locale.previousSlide ?? 'Previous slide'}
            disabled={!canPrev}
            onClick={() => goTo(current - 1)}
          >
            <ChevronLeftIcon size="sm" />
          </button>
          {autoPlay ? (
            <button
              type="button"
              className="ui-carousel__nav ui-carousel__pause"
              aria-label={pausedByUser ? (locale.playCarousel ?? 'Play slides') : (locale.pauseCarousel ?? 'Pause slides')}
              aria-pressed={pausedByUser}
              onClick={() => setPausedByUser((p) => !p)}
            >
              {pausedByUser ? '▶' : '❚❚'}
            </button>
          ) : null}
          <button
            type="button"
            className="ui-carousel__nav"
            aria-label={locale.nextSlide ?? 'Next slide'}
            disabled={!canNext}
            onClick={() => goTo(current + 1)}
          >
            <ChevronRightIcon size="sm" />
          </button>
        </div>
      ) : null}

      {showIndicators && maxIndex > 0 ? (
        <div className="ui-carousel__dots" role="group" aria-label="Slides">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              className="ui-carousel__dot"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              data-active={i === current || undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
});

/**
 * Slideshow region with Previous/Next buttons, slide indicators, keyboard arrows, touch swipe and optional auto-play.
 * Wrap slides in `<Carousel.Slide>` or pass elements directly.
 */
export const Carousel = /* @__PURE__ */ Object.assign(CarouselRoot, { Slide: CarouselSlide });
