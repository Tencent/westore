import create from '../../utils/create'
import diff from '../../utils/diff'
import store from '../../store'
import deepEqual from './deep-equal'

create(store, {


    onLoad: function () {
        const r1 = deepEqual(
            diff(
                { a: 1, b: 2 },
                { a: 2, b: 2, c: 3 }),
            { "a": 1, "c": null })
        this.store.data.testList.push({ d: 'Diff', r: r1 })


        const r2 = deepEqual(
            create.diffToPushObj({ 'user[2].name': { cc: 1 }, 'user[2].age': 13, 'user[1].a.b': { xxx: 1 } }),
            { "user-2": { "name": { "cc": 1 }, "age": 13 }, "user-1": { "a": { "b": { "xxx": 1 } } } }
        )
        this.store.data.testList.push({ d: 'diffToPushObj', r: r2 })
        this.update()
    }

})

