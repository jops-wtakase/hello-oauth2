import { useRouter } from 'vue-router'

export default function () {
  const router = useRouter()

  const pushRouter = (path: string) => {
    router.push(path)
  }

  const goToTop = () => {
    pushRouter('/')
  }

  return {
    pushRouter,
    goToTop,
  }
}
