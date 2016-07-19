export const keyword = {
  type: 'SearchKeyword',
  create(keyword) { return {type: this.type, keyword} }
}

export const results = {
  type: 'SearchResults',
  create(results) { return {type: this.type, results} }
}
