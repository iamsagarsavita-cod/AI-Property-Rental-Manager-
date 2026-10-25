import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiHome } from "react-icons/fi";
import { imageUrl } from "../services/api";

const PropertyImageCarousel = ({
  images = [],
  title = "Property",
  heightClass = "h-44",
  showThumbnails = false,
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const touchStartX = useRef(null);
  const imageList = Array.isArray(images) ? images.filter(Boolean) : [];
  const hasMultipleImages = imageList.length > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (!autoPlay || !hasMultipleImages || isHovered || isFocused) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % imageList.length);
    }, autoPlayInterval);

    return () => window.clearInterval(intervalId);
  }, [autoPlay, autoPlayInterval, hasMultipleImages, imageList.length, isFocused, isHovered]);

  const goTo = (index) => {
    setCurrentIndex((index + imageList.length) % imageList.length);
  };

  const handleKeyDown = (event) => {
    if (!hasMultipleImages) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || !hasMultipleImages) return;
    const distance = touchStartX.current - event.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(distance) > 40) goTo(currentIndex + (distance > 0 ? 1 : -1));
  };

  return (
    <div className="w-full">
      <div
        className={`group/carousel relative ${heightClass} overflow-hidden bg-slate-800 text-slate-500`}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
        tabIndex={hasMultipleImages ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        {imageList.length ? (
          <>
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {imageList.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="h-full min-w-0 flex-[0_0_100%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${imageList.length}`}
                  aria-hidden={currentIndex !== index}
                >
                  <img
                    src={imageUrl(image)}
                    alt={`${title} photo ${index + 1}`}
                    className="h-full w-full select-none object-cover"
                    draggable="false"
                  />
                </div>
              ))}
            </div>

            {hasMultipleImages && showArrows && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    goTo(currentIndex - 1);
                  }}
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/70 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    goTo(currentIndex + 1);
                  }}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/70 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  aria-label="Next image"
                >
                  <FiChevronRight size={18} />
                </button>
              </>
            )}

            {hasMultipleImages && showDots && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-950/65 px-2.5 py-1.5 backdrop-blur">
                {imageList.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      goTo(index);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === index
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={currentIndex === index ? "true" : undefined}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <FiHome size={36} />
          </div>
        )}
      </div>

      {showThumbnails && hasMultipleImages && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Choose a photo">
          {imageList.map((image, index) => (
            <button
              key={`${image}-thumbnail-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                currentIndex === index
                  ? "border-indigo-400 opacity-100"
                  : "border-slate-800 opacity-60 hover:opacity-100"
              }`}
              aria-label={`Show image ${index + 1}`}
              aria-current={currentIndex === index ? "true" : undefined}
            >
              <img
                src={imageUrl(image)}
                alt=""
                className="h-full w-full object-cover"
                draggable="false"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageCarousel;