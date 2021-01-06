import WebViewer from '@pdftron/webviewer'
import { useCallback, useEffect, useRef, useState } from 'react'
import { licenseKey } from './Config'

const extractXfdf = async (docViewer) => {
  const annotManager = docViewer.getAnnotationManager()
  return annotManager.exportAnnotations({
    widgets: false,
    links: false,
    fields: true,
  })
}

const extractXfdfWithCommand = async (docViewer) => {
  const annotManager = docViewer.getAnnotationManager()
  return annotManager.exportAnnotCommand()
}

export const dateDiff = (a, b) => (a.getTime() - b.getTime()) / 1000

export const PdftronXfdf = () => {
  const viewer = useRef(null)
  const [instance, setInstance] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [xfdf, setXfdf] = useState('no xfdf yet')
  const [xfdfCommand, setXfdfCommand] = useState('no xfdf yet')

  useEffect(() => {
    const startedAt = new Date()
    console.log('document is loading', startedAt)
    WebViewer(
      {
        path: '/wv',
        initialDoc: '/files/big.pdf',
        licenseKey,
        fullAPI: true,
        preloadWorker: 'all',
      },
      viewer.current
    ).then((instance) => {
      setInstance(instance)

      instance.docViewer.one('documentLoaded', () => {
        console.log(
          'document is LOADED, elapsed ' +
            dateDiff(new Date(), startedAt) +
            ' secondes'
        )
      })
    })
  }, [])

  const extractXfdfHandler = useCallback(async () => {
    if (!instance) return
    setIsLoading(true)
    const startAt = new Date()
    const { docViewer } = instance
    const currentXfdf = await extractXfdf(docViewer)
    setXfdf(currentXfdf)
    setIsLoading(false)
    console.log('extractXfdf took', dateDiff(new Date(), startAt))
  }, [instance])

  const extractXfdfCommandHandler = useCallback(async () => {
    if (!instance) return
    setIsLoading(true)
    const startAt = new Date()
    const { docViewer } = instance
    const currentXfdf = await extractXfdfWithCommand(docViewer)
    setXfdfCommand(currentXfdf)
    setIsLoading(false)

    console.log('extractXfdfCommand took', dateDiff(new Date(), startAt))
  }, [instance])

  return (
    <div className='MyComponent'>
      <div className='header'>
        {isLoading && <progress />}
        {!isLoading && (
          <div>
            <button onClick={extractXfdfHandler}>Extract XFDF</button>
            export annot<p>{xfdf}</p>
          </div>
        )}
        {!isLoading && (
          <div>
            <button onClick={extractXfdfCommandHandler}>
              Extract XFDF COMMAND
            </button>
            export annot command<p>{xfdfCommand}</p>
          </div>
        )}
      </div>
      <div className='webviewer' ref={viewer} style={{ height: '100vh' }}></div>
    </div>
  )
}
