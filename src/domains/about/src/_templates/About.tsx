import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { env } from '@lib/env'
import { join, useFetch } from '@lib/fetch'
import log from '@lib/logger'
import ColorPaletteComponent from '../_molecules/ColorPalette'
import Typography from '../_molecules/Typography'
import usePaletteStore from '../state/palette-store'
import colorPalette from '../typedefs/color-palette'

/**
 * A template for a page that shows various styles and how
 * to achieve them. Meant for developers, to provide awareness
 * and ease development
 */
function About () {
  const isFirstMount = useRef(true)
  const palettes = usePaletteStore((state) => state.palettes)
  const [
    paletteFetchErr,
    palettesLoading,
    paletteFetchStatus,
  ] = useFetch<colorPalette[]>(
    join(env.PUBLIC_API_ORIGIN, '/api/palettes'),
    z.array(colorPalette),
    (palettes) => { usePaletteStore.setState({ palettes }) },
  )

  /**
   * TODO: UPDATE THIS
   * This useEffect hook provides an example from the
   * following youtube video, which explains how to use
   * useEffect in React 18 Strict mode
   * @see https://www.youtube.com/watch?v=MXSuOR2yRvQ
   */
  useEffect(() => {
    /**
     * ON COMPONENT RENDER
     */

    // eslint-disable-next-line functional/no-conditional-statements
    if (isFirstMount.current) {
      /**
       * If this is the first time the component is
       * being rendered. Mutate a ref to avoid
       * triggering this part of useEffect on
       * subsequent renders.
       *
       * Use this approach for any side effects that
       * should only happen on first render, such as
       * logging, tracking metrics / telemetry, etc.
       *
       * DO NOT use this approach to reduce the number
       * of fetch requests.
       */
      isFirstMount.current = false
      log.trace('about::component::first_render', {
        you: 'should only see this once'
  })
    }

    return () => { /** clean up / tear down */ }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-brand-violet">About Dev</h1>
      <h2 className="text-brand-purple">TailwindCSS Colors</h2>
      {
        paletteFetchErr &&
          <p className="text-red-400">
            {paletteFetchErr.message}
          </p>
      }
      {
        palettesLoading
          ? <p className="text-brand-green">
              {paletteFetchStatus}...
            </p>
          : palettes.map(({ name, nameColor, palette }: colorPalette) =>
              <ColorPaletteComponent
                key={name}
                name={name}
                nameColor={nameColor}
                palette={palette}
              />,
            )
      }

      <br />
      <h2 className="text-brand-purple">TailwindCSS Typography</h2>
      <Typography />
    </div>
  )
}

export default About
