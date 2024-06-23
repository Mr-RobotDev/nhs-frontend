'use client'
import { RootState } from "@/app/store/store"
import UserActivityLog from "@/components/Dashboard/Users/UserActivityLog"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSelector } from "react-redux"
const UserPage = (props: any) => {
  const { user, isAdmin } = useSelector((state: RootState) => state.authReducer)
  const router = useRouter()

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard/floor')
    }
  }, [router, user, isAdmin])

  const { id } = props.params

  return (
    <>
      {isAdmin && id &&
        <UserActivityLog id={id} />
      }
    </>
  )

}

export default UserPage