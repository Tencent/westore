import create from '../../utils/create'
import diff from '../../utils/diff'
import store from '../../store'
import deepEqual from './deep-equal'

create(store, {


    onLoad: function () {
        let r = deepEqual(
            diff(
                { a: 1, b: 2 },
                { a: 2, b: 2, c: 3 }),
            { "": { a: 1, b: 2 } })
        this.store.data.testList.push({ d: 'Diff', r: r })

        r = deepEqual(
            diff(
                { a: 1, b: 2 },
                { a: 1, b: 2 }),
            {})
        this.store.data.testList.push({ d: 'Diff', r: r })

        r = deepEqual(
            diff(
                { a: { b: 1 } },
                { a: { b: 2 } }),
            { 'a.b': 1 })
        this.store.data.testList.push({ d: 'Diff', r: r })

        r = deepEqual(
            diff(
                { a: [1, 2, 3] },
                { a: [1, 2, 3, 4] }),
            { 'a': [1, 2, 3] })
        this.store.data.testList.push({ d: 'Diff', r: r })

        r = deepEqual(
            diff(
                { a: {} },
                { a: { b: 1, c: 2 } }),
            { 'a': {}})
        this.store.data.testList.push({ d: 'Diff', r: r })
        
        r = deepEqual(
            create.diffToPushObj({ 'user[2].name': 'dnt', 'user[2].age': 13 }),
            { 'user-2': { 'name': 'dnt', 'age': 13 } }
        )
        this.store.data.testList.push({ d: 'diffToPushObj', r: r })


        r = deepEqual(
            create.diffToPushObj({ 'user[2].name': { cc: 1 }, 'user[2].age': 13, 'user[1].a.b': { xxx: 1 } }),
            { 'user-2': { 'name': { 'cc': 1 }, 'age': 13 }, 'user-1': { 'a': { 'b': { 'xxx': 1 } } } }
        )
        this.store.data.testList.push({ d: 'diffToPushObj', r: r })

        r = deepEqual(
            path2Arr('a.b.c'),
            ['a', 'b', 'c']
        )
        this.store.data.testList.push({ d: 'path2Arr', r: r })


        r = deepEqual(
            path2Arr('a[1].c'),
            ['a', '1', 'c']
        )
        this.store.data.testList.push({ d: 'path2Arr', r: r })

        r = deepEqual(
            path2Arr('a[1][2].c'),
            ['a', '1', '2', 'c']
        )
        this.store.data.testList.push({ d: 'path2Arr', r: r })

        r = deepEqual(
            path2Arr('a.b[1][2]'),
            ['a', 'b', '1', '2']
        )
        this.store.data.testList.push({ d: 'path2Arr', r: r })

        r = deepEqual(
            path2Arr('a.b[1].c[2]'),
            ['a', 'b', '1', 'c', '2']
        )
        this.store.data.testList.push({ d: 'path2Arr', r: r })


        this.update()
    }

})

function path2Arr(path) {
    return path.replace(/]/g, '').replace(/\[/g, '.').split('.')
}