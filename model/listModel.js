class ListModel {
  constructor (props) {
    this.rows = props.rows || []
    this.pageNo = props.pageNo || 1
    this.pageSize = props.pageSize || 10
    this.total = props.total || 0
  }
}

module.exports = {
  ListModel
}
