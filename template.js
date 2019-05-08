(function (root) {
    function extend() {
        var target = arguments[0] || {};
        var length = arguments.length;
        var options;
        var i = 1;
        if (typeof target !== "object") {
            target = {};
        }
        // 遍历
        for (; i < length; i++) {
            if ((options = arguments[i]) !== null) {
                for (key in options) {
                    target[key] = options[key];
                }
            }
        }
        return target;
    }

    // 解析规则
    var templateSettings = {
        evalute: /<%([\s\S]+?)%>/g, // 逻辑
        interpolate: /<%=([\s\S]+?)%>/g, // 变量
        escape: /<%-([\s\S]+?)%>/g // 逃逸的字符
    };

    var escapes = {
        // 1 需要逃逸的字符

    };
    // escapesExp = //; // 2 正则 3 字符串的替换

    // text 带渲染的模板 settings 自定义的规则
    var template = function (text, settings) {
        // 对象的扩展
        settings = extend({}, templateSettings, settings);
        var matcher = RegExp(
            [
                settings.escape.source,
                settings.interpolate.source,
                settings.evalute.source // 逻辑 正则匹配，如果不放在最后，在传入的是变量的时候，如果放在第一个的话，就直接匹配退出了
            ].join("|"),
            "g"
        );
        var source = "_p+='"; // 执行头
        var index = 0;
        // 渲染模板
        text.replace(matcher, function (
            match,
            escape,
            interpolate,
            evalute,
            offset
        ) {
            source += text.slice(index, offset);
            index = offset + match.length;
            if (escape) {
                // 字符串逃逸
            } else if (interpolate) {
                // 变量
                source += "'+\n((_t=(" + interpolate + "))===null?'':_t)+\n'";
            } else {
                // 逻辑
                source += "';\n" + evalute + "\n_p+='";
            }
        });
        source += "';";
        source = "with(obj || {}){\n" + source + "}\n";
        source = "var _t,_p='';" + source + "return _p;\n";
        console.log(source);
        var render = new Function("obj", source);
        // 预编译 缓存模板
        var templates = function (data) {
            return render.call(this, data);
        };
        return templates;
    };

    root.template = template; // 模板引擎核心函数 提升性能 处理字符串逃逸
})(this);

// 函数体字符串的组装
// new Function()
// var fn = new Funtion('name', 'alert(1)');
// ===
// function fn(name) {
//     alert(1);
// }