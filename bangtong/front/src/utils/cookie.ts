import { Cookies } from "react-cookie";

const cookies = new Cookies()

// 쿠키 생성 함수
export const setCookie = (email: string, value: object) => {
    return cookies.set(email, {...value})
}

// 쿠키 사용 함수
export const getCookie = (email: string) => {
    return cookies.get(email)
}