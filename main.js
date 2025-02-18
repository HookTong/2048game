
/**
 * 线性合并(核心算法函数)
 * 一维数组向左合并([2, 2, 0, 4]==>[4, 4, 0, 0])
 * @param {Array<number>} line 一维数组
 */
const lineMerge = (line = []) => {
    // 元素是否产生变化
    let isChange = false
    for (let i = 0; i < line.length; i++) { // 当前元素
        if (i === line.length - 1) break
        for (let n = i + 1; n < line.length; n++) { // 下一元素
            let ok = false
            if (line[i] === 0) { // 当前元素为0
                if (line[n] !== 0) { // 下一元素不为0，则交换位置
                    line[i] = line[n]
                    line[n] = 0
                    isChange = true
                }
            } else { // 当前元素不为0
                if (line[i] === line[n]) { // 当前元素与下一个元素相等则执行合并
                    line[i] = line[i] + line[n]
                    line[n] = 0
                    ok = true
                    isChange = true
                } else if (line[n] !== 0) {
                    ok = true
                }
            }
            if (ok) break
        }
    }
    return { line, isChange }
}

/**
 * 宫格元素移动(前置算法函数)
 * 该函数将二维数组拆分为多个一维数组，并执行线性合并(lineMerge(line))
 * @param {Array} table 宫格
 * @param {'up'|'down'|'left'|'right'} type 移动方向
 */
const move = (table = [[]], type = 'up') => {
    const rowSize = table.length
    const colSize = table[0].length
    // 宫格是否变化
    let isChange = false
    // 移动处理器
    const handler = {
        up: () => {
            for (let i = 0; i < colSize; i++) {
                const res = []
                // 获取要操作的一条线
                for (let j = 0; j < rowSize; j++) {
                    res.push(table[j][i])
                }
                const { line: newRes, isChange: change } = lineMerge(res)
                for (let j = 0; j < rowSize; j++) {
                    table[j][i] = newRes[j]
                }
                if (change) {
                    isChange = true
                }
            }
        },
        down: () => {
            for (let i = 0; i < colSize; i++) {
                const res = []
                // 获取要操作的一条线
                for (let j = rowSize - 1; j > -1; j--) {
                    res.push(table[j][i])
                }
                const { line: newRes, isChange: change } = lineMerge(res)
                for (let j = rowSize - 1; j > -1; j--) {
                    table[j][i] = newRes[rowSize - 1 - j]
                }
                if (change) {
                    isChange = true
                }
            }
        },
        left: () => {
            for (let i = 0; i < rowSize; i++) {
                const res = []
                // 获取要操作的一条线
                for (let j = 0; j < colSize; j++) {
                    res.push(table[i][j])
                }
                const { line: newRes, isChange: change } = lineMerge(res)
                for (let j = 0; j < colSize; j++) {
                    table[i][j] = newRes[j]
                }
                if (change) {
                    isChange = true
                }
            }
        },
        right: () => {
            for (let i = 0; i < rowSize; i++) {
                const res = []
                // 获取要操作的一条线
                for (let j = colSize - 1; j > -1; j--) {
                    res.push(table[i][j])
                }
                const { line: newRes, isChange: change } = lineMerge(res)
                for (let j = colSize - 1; j > -1; j--) {
                    table[i][j] = newRes[colSize - 1 - j]
                }
                if (change) {
                    isChange = true
                }
            }
        }
    }
    handler[type]()
    return { table, isChange }
}

/** 宫格随机数可选值 */
const optionalValues = [2, 4, 8]

/**
 * 生成随机数
 * @param {Array<number>} source 可选值
 */
const randomNumber = (source = optionalValues) => {
    const nums = source ?? optionalValues
    return nums[Math.floor(Math.random() * nums.length)]
}

/**
 * 插入新元素
 * @param {Array} table
 */
const insertElement = (table = [[]]) => {
    const rowSize = table.length
    const colSize = table[0].length
    const keys = []
    for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
            if (table[i][j] === 0) {
                keys.push(`${i}-${j}`)
            }
        }
    }
    const [rowIndex, colIndex] = keys[Math.floor(Math.random() * keys.length)].split('-')
    table[Number(rowIndex)][Number(colIndex)] = randomNumber()
    return table
}

/**
 * 初始化表格元素
 * @param {Number} rowSize 行数
 * @param {Number} colSize 列数
 * @param {Number} randomNumberSize 随机数个数
 */
const initTable = (rowSize = 4, colSize = 4, randomNumberSize = 3) => {
    const defTable = Array(rowSize)
        .fill()
        .map(() => Array(colSize).fill(0))
    for (let i = 0; i < randomNumberSize; i++) {
        insertElement(defTable)
    }
    return defTable
}

/**
 * 数字背景颜色
 * @param {Number} number 数字
 */
const getTileColor = (number) => {
    // 你可以根据需要调整颜色生成逻辑
    const colors = [
        '#eee4da', // 2
        '#ede0c8', // 4
        '#f2b179', // 8
        '#f59563', // 16
        '#f67c5f', // 32
        '#f65e3b', // 64
        '#edcf72', // 128
        '#edcc61', // 256
        '#edc850', // 512
        '#edc53f', // 1024
        '#edc22e', // 2048
        '#3c3a32'  // 4096 及以上
    ]
    if (number === 0) return '#cdc1b4' // 空白单元格的颜色
    const index = Math.floor(Math.log2(number)) - 1
    return index < colors.length ? colors[index] : colors[colors.length - 1]
}

/**
 * 渲染表格
 * @param {Array<Array<number>>} table 表格数据
 * @param {{
 * gap:number
 * itemClassName:string
 * root:string|HTMLElement
 * }} option 渲染选项
 */
const render = (table = [[]], option = {
    gap: 10,
    itemClassName: '',
    root: 'root'
}) => {
    const { gap, itemClassName, root } = option
    const rootEle = root instanceof HTMLElement ? root : document.getElementById(root)
    if (!rootEle) {
        throw new Error('根元素不存在')
    }
    rootEle.innerHTML = '' // 清空子元素
    const rowSize = table?.length ?? 0 // 行数
    const colSize = table?.[0]?.length ?? 0 // 列数
    if (!rowSize || !colSize) {
        rootEle.innerHTML = '表格数据错误'
        throw new Error('表格数据错误')
    }
    const sumColGap = (colSize - 1) * gap
    // 创建单元格元素
    const createItem = (number) => {
        const ele = document.createElement('div')
        ele.className = `item ${itemClassName || ''}`
        ele.innerHTML = number === 0 ? '' : number
        // 保持宽高相等
        ele.style.aspectRatio = '1 / 1'
        ele.style.width = `calc(calc(100% - ${sumColGap}px) / ${colSize})`
        ele.style.lineHeight = ele.style.width
        ele.style.backgroundColor = getTileColor(number)
        return ele
    }
    // 渲染宫格
    for (let i = 0; i < rowSize; i++) { // 行
        for (let j = 0; j < colSize; j++) { // 列
            const itemEle = createItem(Number(table?.[i]?.[j] ?? 0))
            // 不是最后一列则添加右侧边距
            if (j !== colSize - 1) {
                itemEle.style.marginRight = `${gap}px`
            }
            // 不是最后一行则添加底部边距
            if (i !== rowSize - 1) {
                itemEle.style.marginBottom = `${gap}px`
            }
            rootEle.appendChild(itemEle)
        }
    }
}

/** 默认渲染选项 */
const defaultOption = {
    gap: 10,
    itemClassName: '',
    root: 'root'
}

/**
 * 判断是否游戏结束
 * @param {Array<Array<number>>} table 表格数据
 */
const isTableEnd = (table = [[]]) => {
    // 宫格副本
    const copy = [...table].map((v) => [...v])
    const { isChange: uChange } = move(copy, 'up')
    if (uChange) return false
    const { isChange: dChange } = move(copy, 'down')
    if (dChange) return false
    const { isChange: lChange } = move(copy, 'left')
    if (lChange) return false
    const { isChange: rChange } = move(copy, 'right')
    if (rChange) return false
    return true
}

/**
 * 移动并渲染
 * @param {Array<Array<number>>} table 表格数据
 * @param {'up'|'down'|'left'|'right'} type 移动类型
*/
const moveRender = (table, type) => {
    const { table: newTable, isChange } = move(table, type)
    if (isChange) {
        insertElement(newTable)
        render(newTable, defaultOption)
        localStorage.setItem('table', JSON.stringify(newTable))

        if (isTableEnd(newTable)) {
            setTimeout(() => {
                alert('游戏结束')
                console.warn('游戏结束')
            }, 1000)
        }
    } else {
        console.warn('宫格未产生变化')
    }
}

/**
 * 开始游戏
 * @param {number} gongGeSize 宫格大小
 * @param {number} randomNumberSize 初始化随机数个数
 */
const start = (gongGeSize = 4, randomNumberSize = 3) => {
    const saveTable = localStorage.getItem('table')
    let table = saveTable ? JSON.parse(saveTable) : initTable(gongGeSize, gongGeSize, randomNumberSize)
    render(table)

    // 只有产生移动才会保存到本地
    // localStorage.setItem('table', JSON.stringify(table))

    // 按钮移动
    document.getElementById('up-btn').onclick = () => { // 上
        moveRender(table, 'up')
    }
    document.getElementById('down-btn').onclick = () => { // 下
        moveRender(table, 'down')
    }
    document.getElementById('left-btn').onclick = () => { // 左
        moveRender(table, 'left')
    }
    document.getElementById('right-btn').onclick = () => { // 右
        moveRender(table, 'right')
    }
    document.getElementById('reset-btn').onclick = () => { // 重置
        const ggSize = prompt('请输入宫格大小(size*size):', String(gongGeSize))
        if (ggSize === null) return
        // 必须是大于1的数字
        if (!isNaN(ggSize) && ggSize >= 2) {
            gongGeSize = Number(ggSize)
            table = initTable(gongGeSize, gongGeSize, randomNumberSize)
            render(table)
        } else {
            alert('请输入一个大于1的正整数')
        }
    }

    // 滑动移动
    let start
    document.getElementById('root').ontouchstart = (e) => {
        start = e.changedTouches[0]
        console.warn('ontouchstart', e)
    }
    document.getElementById('root').ontouchend = (e) => {
        if (!start) return
        const { screenX: sX, screenY: sY } = start
        const { screenX: eX, screenY: eY } = e.changedTouches[0]
        const dX = sX - eX
        const dY = sY - eY
        if (Math.abs(dX) > Math.abs(dY)) { // 左右滑动
            if (Math.abs(dX) < 20) return // 滑动距离太小
            if (dX > 0) { // 左滑
                moveRender(table, 'left')
            } else { // 右滑
                moveRender(table, 'right')
            }
        } else { // 上下滑动
            if (Math.abs(dY) < 20) return // 滑动距离太小
            if (dY > 0) { // 上滑
                moveRender(table, 'up')
            } else { // 下滑
                moveRender(table, 'down')
            }
        }
        start = null
        console.warn('ontouchend', e)
    }
}

start()
