import { useState, useEffect } from 'react'
import BuildSummary from '@/components/buildsummary'
import BuildSelector from '@/components/buildselector'

type Props = {
  infoUrl: string;
}

export default function BuildPanel({ infoUrl }: Props) {
  const [data, setData]:[any, any] = useState(null)
  const [infoLoading, setInfoLoading] = useState(false)
  useEffect(() => {
    setInfoLoading(true)
    fetch(infoUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setInfoLoading(false)
      })
  }, [])

  return (
    <div>
      {infoLoading && "loading..."}
      {data && (
      <>
      <BuildSummary build_info={data} />
      <BuildSelector build_info={data} />
      </>
      )}
    </div>
  )
}


