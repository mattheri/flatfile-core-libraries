import { render, screen } from '@testing-library/react'
import React from 'react'
import Space, { SpaceContents } from '../Space'
import { mockWorkbook } from '../../test/mocks'
import Pubnub from 'pubnub'

const baseSpaceProps = {
  publishableKey: 'your-publishable-key',
  environmentId: 'your-env-id',
  workbook: mockWorkbook
}

describe('Space', () => {
  it('renders SpaceContents when spaceId, spaceUrl, pubNub and accessToken are provided', () => {
    const spaceId = 'spaceId'
    const spaceUrl = 'spaceUrl'
    const accessToken = 'accessToken'
    const pubnub = new Pubnub({
      subscribeKey: 'test-subscribe-key',
      uuid: 'test-uuid'
    })

    render(
      <Space
        spaceId={spaceId}
        spaceUrl={spaceUrl}
        accessToken={accessToken}
        pubNub={pubnub}
        {...baseSpaceProps}
      />
    )

    const spaceContentsElement = screen.getByTestId('space-contents')
    expect(spaceContentsElement).toBeInTheDocument()
  })

  it('does not render SpaceContents when spaceId, spaceUrl, or accessToken is missing', () => {
    const spaceId = 'spaceId'
    const spaceUrl = 'spaceUrl'
    const accessToken = ''
    const pubnub = new Pubnub({
      subscribeKey: 'test-subscribe-key',
      uuid: 'test-uuid'
    })

    render(
      <Space
        spaceId={spaceId}
        spaceUrl={spaceUrl}
        accessToken={accessToken}
        pubNub={pubnub}
        {...baseSpaceProps}
      />
    )

    const spaceContentsElement = screen.queryByTestId('space-contents')
    expect(spaceContentsElement).not.toBeInTheDocument()
  })
})

describe('SpaceContents', () => {
  it('renders the iframe and close button', () => {
    const spaceId = 'spaceId'
    const spaceUrl = 'spaceUrl'
    const accessToken = 'accessToken'

    render(
      <SpaceContents
        spaceId={spaceId}
        spaceUrl={spaceUrl}
        accessToken={accessToken}
        {...baseSpaceProps}
      />
    )

    const iframeElement = screen.getByTestId('flatfile-iframe')
    const closeButtonElement = screen.getByTestId('flatfile-close-button')

    expect(iframeElement).toBeInTheDocument()
    expect(closeButtonElement).toBeInTheDocument()
  })

  it('opens the confirmation modal when the close button is clicked', () => {
    const spaceId = 'spaceId'
    const spaceUrl = 'spaceUrl'
    const accessToken = 'accessToken'

    render(
      <SpaceContents
        spaceId={spaceId}
        spaceUrl={spaceUrl}
        accessToken={accessToken}
        {...baseSpaceProps}
      />
    )

    const closeButtonElement = screen.getByTestId('flatfile-close-button')
    closeButtonElement.click()

    const confirmationModalElement = screen.getByTestId('close-confirm-modal')
    expect(confirmationModalElement).toBeInTheDocument()
  })
})