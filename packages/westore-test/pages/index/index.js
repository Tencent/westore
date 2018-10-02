import create from '../../utils/create'
import diff from '../../utils/diff'


console.log(JSON.stringify(diff({ a: 1, b: 2 }, { a: 2, b: 2, c: 3 })) == '{"a":1,"c":null}','【diff】')

console.log(JSON.stringify(create.diffToPushObj({'user[2].name':{cc:1},'user[2].age':13,'user[1].a.b':{xxx:1}}))=='{"user-2":{"name":{"cc":1},"age":13},"user-1":{"a":{"b":{"xxx":1}}}}','【diffToPushObj】')