export default (timestamp) => {
  const upload_date = new Date(timestamp)

  const mins = upload_date.getMinutes()
  const hours = upload_date.getHours()
  const month = upload_date.getMonth()
  const day = upload_date.getDate()
  const year = upload_date.getFullYear()

  return `
    ${((month > 8) ? (month + 1) : ('0' + (month + 1))) + '/' + ((day > 9) ? day : ('0' + day)) + '/' + year}
    ${hours % 12}:${mins < 10 ? '0' + mins : mins}
    ${hours >= 12 ? 'PM' : 'AM'}
  `
}