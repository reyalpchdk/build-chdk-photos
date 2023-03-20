import ErrorPage from '@/components/errorpage'
export default function Custom403() {
  return (
    <ErrorPage errno={403} message="forbidden :x" />
  )
}

