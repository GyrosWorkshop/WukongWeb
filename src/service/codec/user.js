export function encode(object = {}) {
  return {
    id: object.id,
    userName: object.nickname,
    avatar: object.avatar
  }
}

export function decode(object = {}) {
  return {
    id: object.id,
    nickname: object.userName,
    avatar: object.avatar
  }
}
