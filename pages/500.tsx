import ErrorPage from '@/components/errorpage'
export default function Custom500() {
  return (
    <ErrorPage errno={500} message="internal server error :O" />
  )
}

