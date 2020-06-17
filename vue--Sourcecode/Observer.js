class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 保存旧的值
        this.oldVal = this.getOldVal()
    }

    getOldVal() {
        Dep.tartget = this;
        const oldVal = compileUtil.getValue(this.expr, this.vm)
        Dep.tartget = null;
        return oldVal;
    }

    update() {
        const newVal = compileUtil.getValue(this.expr, this.vm)
        if (newVal !== this.oldVal) {
            this.cb(newVal)
        }
    }
}


class Dep {
    constructor() {
        this.subs = [];
    }

    // 收集观察者
    addSub(watcher) {
        this.subs.push(watcher)
    }

    // 通知观察者去更新
    notify() {
        // 通知观察者
        // console.log('观察者', this.subs)
        this.subs.forEach(w => w.update())
    }
}



class Observer {
    constructor(data) {
        this.observer(data);
    }

    // 劫持所有属性
    observer(data) {
        // data是一个对象
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key])
            })
            console.log(Object.keys(data))
        }
    }

    defineReactive(obj, key, value) {
        // 递归遍历
        this.observer(value);
        const dep = new Dep();
        // 劫持并监听所有属性
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: false,
            get() {
                // 订阅数据变化时，往dep中添加观察者
                // 收集依赖
                Dep.tartget && dep.addSub(Dep.tartget)
                return value;
            },
            set: (newVal) => {
                // this的实例
                this.observer(newVal);
                if (newVal !== value) {
                    value = newVal;
                }
                // 告诉dep变化
                dep.notify()
            }
        })
    }
}