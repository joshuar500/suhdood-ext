export default function loginNormalizer(state) {
  return {
    username: state.username,
    password: state.password,
  }
}