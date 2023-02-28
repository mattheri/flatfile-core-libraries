import React, { ReactElement, useState, useEffect, useCallback } from 'react'
import { SpaceIframe } from './SpaceStyles'
import { ISpaceConfig } from '../types/ISpaceConfig'
import { useInitializeSpace } from '../hooks/useInitializeSpace'

/**
 * @name Space
 * @description Flatfile Space component
 * @param props
 */

const Space = (props: ISpaceConfig): ReactElement | null => {
  const { handleInit } = useInitializeSpace(props)
  const [spaceUrl, setSpaceUrl] = useState<string | undefined>(undefined)

  const init = useCallback(async () => {
    try {
      const res = await handleInit()
      setSpaceUrl(res)
    } catch (e: any) {
      console.log('error: ', e)
    }
  }, [handleInit])

  useEffect(() => {
    init()
  }, [])

  return spaceUrl ? <SpaceIframe src={spaceUrl} /> : null
}

export default Space