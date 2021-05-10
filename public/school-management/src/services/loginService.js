import authService from './authService'

export function login(account) {
    return authService.post("http://localhost:3000/login", account)
}