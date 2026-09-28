import { ImageResponse } from "next/og"
import { logoDataUri } from "./logo"

/** The mark on its dark tile as a square PNG, for places that don't take SVG icons. */
export function logoPng(size: number) {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og, not the DOM
      <img src={logoDataUri({ tile: true, rounded: false })} width={size} height={size} alt="" />
    ),
    { width: size, height: size },
  )
}
