import { onError } from "@/utils/other";
import { JSX, splitProps } from "solid-js";

interface LazyImgProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  altSrc?: string;
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const img = entry.target as HTMLImageElement;
    img.src = img.getAttribute("data-src")!;
    img.removeAttribute("data-src");
    io.unobserve(img);
  });
});

export function LazyImg(props: LazyImgProps) {
  const [localProps, allProps] = splitProps(props, ["src", "altSrc"]);

  return (
    <img
      {...allProps}
      ref={(el) => el && io.observe(el)}
      loading="lazy"
      data-src={localProps.src}
      onError={({ currentTarget }) => onError(currentTarget, localProps.altSrc)}
    />
  );
}
