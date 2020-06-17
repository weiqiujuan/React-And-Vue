class MVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if (this.$el) {
            // 1.实现一个数据的观察者
            new Observer(this.$data)
            // 2.实现一个指令的解析器
            new Compile(this.$el, this)
            this.proxyData(this.$data)
        }
    }

    proxyData(data) {
        for (const key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newVal) {
                    data[key] = newVal
                }
            })
        }
    }
}

const compileUtil = {
    getValue(expr, vm) {
        //[person, name]
        return expr.trim().split('.').reduce((data, currentvalue) => {
            return data[currentvalue]
        }, vm.$data)
    },
    // 双向绑定改变值
    setVal(expr, vm, inputVal) {
        return expr.trim().split('.').reduce((data, currentvalue) => {
            data[currentvalue] = inputVal;
        }, vm.$data)
    },
    getContentVal(expr, vm) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getValue(args[1], vm)
        })
    },
    text(node, expr, vm) { //expr:msg
        let value;
        if (expr.indexOf('{{') !== -1) {
            // {{aaaaaaaa}}
            value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                // 绑定观察者，若数据发生变化，触发回调进行更新
                new Watcher(vm, args[1], () => {
                    this.updater.textUpdater(node, this.getContentVal(expr, vm))
                })
                return this.getValue(args[1], vm)
            })
        } else {
            value = this.getValue(expr, vm)
        }
        this.updater.textUpdater(node, value)
    },
    html(node, expr, vm) {
        const value = this.getValue(expr, vm)
        new Watcher(vm, expr, (newVal) => {
            this.updater.htmlUpdater(node, newVal)
        })
        this.updater.htmlUpdater(node, value)
    },
    model(node, expr, vm) {
        const value = this.getValue(expr, vm)
        // 绑定更新函数
        new Watcher(vm, expr, (newVal) => {
            this.updater.modelUpdater(node, newVal)
        })
        // 视图=>数据=>视图
        node.addEventListener('input', (e) => {
            // 设置值
            this.setVal(expr, vm, e.target.value)
        })
        this.updater.modelUpdater(node, value)
    },
    on(node, expr, vm, eventName) {
        let fn = vm.$options.methods && vm.$options.methods[expr]
        node.addEventListener(eventName, fn.bind(vm), false);
    },
    bind(node, expr, vm, attrName) {
        //
    },
    updater: {
        modelUpdater(node, value) {
            node.value = value
        },
        htmlUpdater(node, value) {
            node.innerHTML = value
        },
        textUpdater(node, value) {
            node.textContent = value
        },
    }
}

// 编译方法
class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        // 1. 获取文档碎片对象，放入内存中减少页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
        console.log(fragment)
        // 2. 编译模板
        this.compile(fragment);
        // 3. 追加子元素到根元素
        this.el.appendChild(fragment);
    }

    compile(fragment) {
        // 1. 获取到每个子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            if (this.isElementNode(child)) {
                // 是元素节点
                // 编译元素节点
                this.compileElement(child);
            } else {
                // 文本节点
                // 编译文本节点
                this.compileText(child);
            }
            // 元素子节点的深层递归
            if (child.childNodes && child.childNodes.length) {
                this.compile(child);
            }
        })
    }

    // 元素编译
    compileElement(node) {
        const attribute = node.attributes;
        [...attribute].forEach(attr => {
            const {name, value} = attr;
            if (this.isDirective(name)) {// 指令v-text, v-html, v-model, v-on: click
                const [, directive] = name.split('-') // text,html,model,on: click
                const [dirName, eventName] = directive.split(':');// on :  name
                // 跟新数据，数据驱动视图
                compileUtil[dirName](node, value, this.vm, eventName)
                // 删除标签上的指令属性
                node.removeAttribute('v-' + directive)
            } else if (this.isEventName(name)) {
                //@click = 'handleClick'
                let [, eventName] = name.split('@')
                compileUtil['on'](node, value, this.vm, eventName)
            }
        })
    }

    isEventName(attrName) {
        return attrName.startsWith('@')
    }

    // 判断是否是一个指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    //文本编译
    compileText(node) {
        const content = node.textContent;
        if (/\{\{(.+?)\}\}/.test(content)) {
            compileUtil['text'](node, content, this.vm)
        }
    }

    node2Fragment(el) {
        // 创建文档碎片
        const f = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }
        return f;
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }
}