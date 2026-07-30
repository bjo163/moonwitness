class MockKnex {
  where(cb) {
    console.log('where called')
    cb(this)
  }
}

let i = 0
let domain = [1]
const query = new MockKnex()

function parseNode(q) {
  console.log('parseNode called, i =', i)
  i++
}

console.log('start loop')
while(i < domain.length) {
  query.where((qb) => {
    parseNode(qb)
  })
}
console.log('end loop')
