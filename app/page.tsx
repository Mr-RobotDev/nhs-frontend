"use client";

import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.authReducer
  );
  console.log(isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  return <></>;
}
