import ErrorPage from '@/components/errorpage'
export default function Custom503() {
  return (
    <ErrorPage errno={503} message="service unavailable :|" />
  )
}

