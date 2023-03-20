import ErrorPage from '@/components/errorpage'
export default function Custom404() {
  return (
    <ErrorPage errno={404} message="not found :(" />
  )
}
