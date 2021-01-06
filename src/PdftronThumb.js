import WebViewer from '@pdftron/webviewer'
import { useEffect, useRef, useState } from 'react'
import { licenseKey } from './Config'
import { dateDiff } from './PdftronXfdf'

function loadThumbnailWrapper(docViewer, document, pageIndex) {
  return new Promise((resolve, reject) => {
    try {
      if (!docViewer) {
        reject(new Error('no pdftron instance'))
        return
      }
      document.loadCanvasAsync({
        pageNumber: pageIndex,
        zoom: 0.33,
        height: 100,
        width: 50,
        drawComplete: async (thumbnail) => {
          await docViewer
            .getAnnotationManager()
            .drawAnnotations(pageIndex, thumbnail)
          thumbnail.toBlob((blob) => {
            resolve({
              id: pageIndex,
              pageNumber: pageIndex,
              url: URL.createObjectURL(blob),
            })
          })
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}

export const PdftronThumbs = () => {
  const viewer = useRef(null)

  const [thumbs, setThumbs] = useState()

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
      instance.docViewer.one('documentLoaded', () => {
        console.log(
          'document is LOADED, elapsed ' +
            dateDiff(new Date(), startedAt) +
            ' secondes'
        )

        const promises = []
        if (!instance) return
        try {
          console.log('starting generating thumb ')
          const { docViewer } = instance
          const document = docViewer.getDocument()
          const currentPageCount = document.getPageCount()

          const startedAt = new Date()

          for (let pageIndex = 1; pageIndex <= currentPageCount; pageIndex++) {
            promises.push(loadThumbnailWrapper(docViewer, document, pageIndex))
          }

          Promise.all(promises)
            .then((res) => {
              setThumbs(res)
            })
            .then(() => {
              console.log(
                'generating thumb took ',
                dateDiff(new Date(), startedAt)
              )
            })
        } catch (error) {}
      })
    })
  }, [])

  return (
    <div className='MyComponent'>
      <div>
        {thumbs &&
          thumbs.map((thumb) => {
            return (
              <img
                style={{ border: 'solid 1px black' }}
                key={thumb.id}
                src={thumb.url}
              />
            )
          })}
      </div>
      <div className='webviewer' ref={viewer} style={{ height: '100vh' }}></div>
    </div>
  )
}
